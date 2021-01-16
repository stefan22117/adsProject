const multer = require("multer");
const Korisnik = require("../models/Korisnik");
const Vrsta = require("../models/Vrsta");
const Oglas = require("../models/Oglas");
const Komentar = require("../models/Komentar");
const Lajk = require("../models/Lajk");
const Poruka = require("../models/Poruka");
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

module.exports = function (router) {

   


    router.get("/", function (req, res) {
        Oglas.find(function (err, oglasi) {
            Vrsta.find(function (err, vrste) {
                var sess = req.session;
                res.render('index', { oglasi: oglasi, korisnik: sess.korisnik, vrste: vrste })
            });

        });

    });

    router.get("/logout", function (req, res) {
        var sess = req.session;
        sess.korisnik = null;
        res.redirect("/");
    });


    router.get("/login", function (req, res) {
        res.render("login")
    });

    router.post("/login", function (req, res) {
        var username = req.body.username;
        var password = req.body.password;
        Korisnik.find({ username: username }, function (err2, userPassKor) {

            if (userPassKor.length > 0) {
                bcrypt.compare(password, userPassKor[0].password, function (err, result) {
                    if (result) {
                        var sess = req.session;
                        sess.korisnik = userPassKor[0];
                    }
                    res.json({});
                });


            }
            else {
                res.json({});
            }

        });




    });

    router.get('/registracija', function (req, res) {
        res.render('registracija');
    });

    router.post('/registracija', function (req, res) {
        var username = req.body.username;
        var password = req.body.password;
        var email = req.body.email;
        var brojTel = req.body.brojTel;

        Korisnik.find({ username: username }, function (err, korProvera) {

            if (korProvera.length == 0) {
                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(password, salt, function (err, hashedPass) {
                        var korisnik = new Korisnik({
                            username: username,
                            password: hashedPass,
                            email: email,
                            brojTel: brojTel,
                            role: 'korisnik'
                        });
                        korisnik.save(function (err, kor) {
                            var sess = req.session;
                            sess.korisnik = kor;
                            res.json({});
                        });
                    });
                });

            }
            else {
                res.json({});
            }


        });

    });


    router.post('/proveriUsername', function (req, res) {
        var username = req.body.username;
        Korisnik.find({ username: username }, function (err, korisnici) {
            if (korisnici.length > 0) {
                res.json({ postoji: true });
            }
            else {
                res.json({ postoji: false });
            }
        });
    });
    router.post('/proveriPassword', function (req, res) {
        var username = req.body.username;
        var password = req.body.password;

        Korisnik.find({ username: username }, function (err, korisnici) {

            if (korisnici.length > 0) {
                bcrypt.compare(password, korisnici[0].password, function (err, result) {
                    if (result) {
                        res.json({ postoji: true });
                    }
                    else {
                        res.json({ postoji: false });
                    }
                });


            }
            else {
                res.json({ postoji: false });
            }
        });



    });

    router.get("/noviOglas", function (req, res) {
        var sess = req.session;
        if (typeof sess.korisnik == 'undefined' || sess.korisnik == null) {
            res.redirect('/login');
            return;
        }

        Vrsta.find(function (err, vrste) {
            res.render("noviOglas", { vrste: vrste, korisnik: sess.korisnik })
        });

    });

    router.post("/noviOglas", function (req, res) {

        var sess = req.session;
        if (typeof sess.korisnik == 'undefined' || sess.korisnik == null) {
            res.redirect('/login');
            return;
        }

        var slike = '';

        var storage = multer.diskStorage({
            filename: function (req, file, callback) {

                var filename = file.fieldname + "-" + Date.now() + path.extname(file.originalname)

                slike += filename + " "

                callback(null, filename);


            },
            destination: "./assets/slike"
        });
        var upload = multer({ storage: storage }).array('fajl', 10)

        upload(req, res, function (err) {
            if (err) {
                throw err
            }

            var naslov = req.body.naslov;
            var vrstaPlacanja = req.body.vrstaPlacanja;

            var cena = 0;
            if (vrstaPlacanja == "novac") {
                cena = parseFloat(req.body.cena)
            }
            var vrsta = req.body.vrsta;

            var opis = req.body.opis;


            Oglas.find(function (err, oglasi) {
                var id = 1;
                if (oglasi.length > 0) {
                    id = oglasi.sort().reverse()[0].id + 1;
                }

                oglas = new Oglas({
                    id: id,
                    slika: slike,
                    naslov: naslov,
                    vrstaPlacanja: vrstaPlacanja,
                    cena: cena,
                    opis: opis,
                    KorisnikUsername: sess.korisnik.username,
                    VrstaId: vrsta
                });
                oglas.save(function (err, oglas) {

                    Korisnik.find({ username: oglas.KorisnikUsername }, function (err, korisnik) {
                        var UspesnoPostavljenPoruka = "You have successfully placed your ad"
                        res.render("oglas", { oglas: oglas, postavio: korisnik[0], korisnik: sess.korisnik, UspesnoPostavljenPoruka: UspesnoPostavljenPoruka })
                    });

                });
            });

        });

    });



    router.get("/oglas/:id", function (req, res) {
        var id = req.params.id;
        Oglas.find({ id: id }, function (err, oglas) {
            if (oglas.length == 0) {
                res.render("oglas", { oglas: undefined })
                return
            }
            Korisnik.find({ username: oglas[0].KorisnikUsername }, function (err, korisnik) {
                Komentar.find({ OglasId: id }, function (err, komentari) {
                    komentari = komentari.reverse();

                    var sess = req.session;
                    var lajk;
                    Lajk.find({ OglasId: oglas[0].id }, function (err, sviLajkovi) {
                        var brojLajkova = sviLajkovi.filter((lajk) => lajk.LajkDislajk).length;
                        var brojDislajkova = sviLajkovi.filter((lajk) => !lajk.LajkDislajk).length;


                        if (typeof sess.korisnik == 'undefined' || sess.korisnik == null) {
                            lajk = "nista"
                            res.render("oglas", { oglas: oglas[0], postavio: korisnik[0], komentari: komentari, korisnik: sess.korisnik, lajk: lajk, brojLajkova: brojLajkova, brojDislajkova: brojDislajkova })

                            return
                        }
                        else {
                            Lajk.find({ KorisnikUsername: sess.korisnik.username, OglasId: oglas[0].id }, function (err, like) {
                                if (like.length > 0) {
                                    if (like[0].LajkDislajk == true) {
                                        lajk = 'lajk'
                                    }
                                    else {
                                        lajk = 'dislajk'
                                    }
                                }
                                else {
                                    lajk = 'nista'
                                }

                                res.render("oglas", { oglas: oglas[0], postavio: korisnik[0], komentari: komentari, korisnik: sess.korisnik, lajk: lajk, brojLajkova: brojLajkova, brojDislajkova: brojDislajkova })

                                return;
                            });
                        }


                    });
                });



            });
        });
    });



    router.get("/azuriranjeOglasa/:id", function (req, res) {
        var sess = req.session;
        if (typeof sess.korisnik == 'undefined' || sess.korisnik == null) {
            res.redirect('/login')
            return
        }
        var OglasId = req.params.id;
        Oglas.find({ id: OglasId }, function (err, oglas) {
            Vrsta.find(function (err, vrste) {
                res.render('azuriranjeOglasa', { oglas: oglas[0], vrste: vrste, korisnik: sess.korisnik });
            });

        });

    });

    router.post('/oduzmiSliku', function (req, res) {
        var OglasId = req.body.OglasId;
        Oglas.find({ id: OglasId }, function (err, oglas) {
            var nazivSlike = req.body.nazivSlike;

            var nizSlika = oglas[0].slika.split(' ');
            nizSlika = nizSlika.filter(function (slika) {
                return slika != nazivSlike && slika != "";
            });
            var noveSlike = nizSlika.join(' ');
            res.json({ noveSlike: noveSlike });

        });


    });


    router.post('/azuriranjeOglasa', function (req, res) {
        var sess = req.session;
        if (typeof sess.korisnik == 'undefined' || sess.korisnik == null) {
            res.redirect('/login');
            return;
        }

        var slike = '';
        var storage = multer.diskStorage({
            filename: function (req, file, callback) {

                var filename = file.fieldname + "-" + Date.now() + path.extname(file.originalname)

                slike += filename + " "
                callback(null, filename);


            },
            destination: "./assets/slike"
        });

        var upload = multer({ storage: storage }).array('fajl', 10)

        upload(req, res, function (err) {
            if (err) {
                throw err
            }


            var naslov = req.body.naslov;
            var vrstaPlacanja = req.body.vrstaPlacanja;

            var cena = 0;
            if (vrstaPlacanja == "novac") {
                cena = parseFloat(req.body.cena)
            }
            var vrsta = req.body.vrsta;
            var opis = req.body.opis;

            var nazivSlike = req.body.nazivSlike;

            if (typeof nazivSlike == 'string') {
                nazivSlike = [nazivSlike];
            }
            if (nazivSlike != undefined) {
                for (let s of nazivSlike) {
                    slike += s + " ";
                }
            }


            var oglasId = req.body.oglasId;

            Oglas.find({ id: oglasId }, function (err, oglas) {
                var oglas = oglas[0];
                oglas.naslov = naslov;
                oglas.vrstaPlacanja = vrstaPlacanja;
                oglas.cena = cena;
                oglas.opis = opis;
                oglas.VrstaId = vrsta;
                oglas.slika = slike;
                oglas.KorisnikUsername = sess.korisnik.username;


                oglas.save(function (err, oglas) {
                    Korisnik.find({ username: oglas.KorisnikUsername }, function (err, korisnik) {
                        Komentar.find({ OglasId: oglas.id }, function (err, komentari) {
                            var komentari = komentari.reverse();
                            var sess = req.session;
                            var lajk;
                            Lajk.find({ OglasId: oglas.id }, function (err, sviLajkovi) {
                                var brojLajkova = sviLajkovi.filter((lajk) => lajk.LajkDislajk).length;
                                var brojDislajkova = sviLajkovi.filter((lajk) => !lajk.LajkDislajk).length;


                                if (typeof sess.korisnik == 'undefined' || sess.korisnik == null) {
                                    lajk = "nista"
                                    res.render("oglas", { oglas: oglas, postavio: korisnik[0], komentari: komentari, korisnik: sess.korisnik, lajk: lajk, brojLajkova: brojLajkova, brojDislajkova: brojDislajkova })

                                    return
                                }
                                else {
                                    Lajk.find({ KorisnikUsername: sess.korisnik.username, OglasId: oglas.id }, function (err, like) {
                                        if (like.length > 0) {
                                            if (like[0].LajkDislajk == true) {
                                                lajk = 'lajk'
                                            }
                                            else {
                                                lajk = 'dislajk'
                                            }
                                        }
                                        else {
                                            lajk = 'nista'
                                        }
                                        var UspesnoAzuriranPoruka = "Uspesno ste azurirali oglas"
                                        res.render("oglas", { oglas: oglas, postavio: korisnik[0], komentari: komentari, korisnik: sess.korisnik, lajk: lajk, brojLajkova: brojLajkova, brojDislajkova: brojDislajkova, UspesnoAzuriranPoruka: UspesnoAzuriranPoruka })

                                        return;
                                    });
                                }


                            });
                        });
                    });
                });
            });






        });
    });

    router.get("/oglasiKorisnika", function (req, res) {
        var username = req.query.username;

        var sess = req.session;

        Korisnik.find({ username: username }, function (err1, kor) {
            Oglas.find({ KorisnikUsername: username }, function (err2, oglasi) {
                var nizIdijeva = oglasi.map(function (oglas) {
                    return { OglasId: oglas.id };
                });

                Lajk.find({ $or: nizIdijeva }, function (err, sviLajkovi) {
                    if (nizIdijeva.length == 0) {
                        sviLajkovi = [];
                    }
                    var brojLajkova = sviLajkovi.filter((lajk) => lajk.LajkDislajk).length;
                    var brojDislajkova = sviLajkovi.filter((lajk) => !lajk.LajkDislajk).length;
                    Vrsta.find(function (err, vrste) {
                        res.render("oglasiKorisnika", { kor: kor[0], oglasi: oglasi, brojLajkova: brojLajkova, brojDislajkova: brojDislajkova, korisnik: sess.korisnik, vrste: vrste });
                    });

                });


            });
        });
    });

    router.post("/brisanjeOglasa", function (req, res) {

        var oglasId = req.body.oglasId;
        Komentar.deleteMany({ OglasId: oglasId }, function (err, komentariCount) {

            Lajk.deleteMany({ OglasId: oglasId }, function (err, lajkoviCount) {

                Oglas.find({ id: oglasId }, function (err, oglas) {

                    var nizSlika = oglas[0].slika.split(' ').filter(x => x != '')


                    Oglas.deleteOne({ id: oglasId }, function (err, oglasCount) {
                        
                        for (let slika of nizSlika) {
                            var putanja = path.join(__dirname, '..', 'assets', 'slike', slika);
                            if (fs.existsSync(putanja)) {
                                fs.unlinkSync(putanja)
                            }
                        }

                        Oglas.find(function (err, oglasi) {
                            Vrsta.find(function (err, vrste) {
                                var sess = req.session;
                                var poruka = "Uspesno ste obrisali oglas sa ID-ijem: " + oglas[0].id;
                                res.render('index', { oglasi: oglasi, korisnik: sess.korisnik, vrste: vrste, poruka: poruka })
                            });

                        });

                    });

                });

            });
        });
    });

    router.post("/komentarisi", function (req, res) {
        var tekst = req.body.komentar;
        var OglasId = req.body.OglasId;

        var sess = req.session;
        if (typeof sess.korisnik == "undefined" || sess.korisnik == null) {
            res.json({ poruka: "Morate se ulogovati da bi ostavili komentar", greska: true })
        }
        else {
            Komentar.find(function (err, komId) {
                var id = 1;
                if (komId.length > 0) {
                    id = komId.sort().reverse()[0].id + 1;
                }
                var username = sess.korisnik.username;
                var komentar = new Komentar({
                    id: id,
                    tekst: tekst,
                    OglasId: OglasId,
                    KorisnikUsername: username
                });

                komentar.save(function (err, data) {
                    Komentar.find({ OglasId: OglasId }, function (err, komentari) {

                        res.json({ komentari: komentari.reverse(), username: username, poruka: "Uspesno ste dodali komentar: '" + komentar.tekst + "'" });
                    });
                });
            });

        }


    });

    router.post('/obrisiKomentar', function (req, res) {
        var sess = req.session;
        if (typeof sess.korisnik == "undefined" || sess.korisnik == null) {
            res.json({ poruka: "Morate se ulogovati da bi obrisali komentar" })
        }
        else {
            var OglasId = req.body.OglasId;
            var KomentarId = req.body.KomentarId;
            var username = sess.korisnik.username;


            Komentar.find({ id: KomentarId }, function (err, komentar) {
                if (komentar.length > 0) {
                    if (komentar[0].KorisnikUsername != sess.korisnik.username) {
                        res.json({ poruka: "Ne mozete obrisati tudji komentar" })
                    }
                    else {
                        Komentar.deleteOne({ id: KomentarId }, function (err, komCount) {
                            Komentar.find({ OglasId: OglasId }, function (err, komentari) {
                                var poruka = "Uspesno ste obrisali komentar";
                                res.json({ komentari: komentari.reverse(), username: username, poruka: poruka });
                            });
                        });
                    }
                }
                else {
                    res.json({ poruka: "Komentar nije pronadjen" })
                }

            });
        }

    });

    router.post('/azurirajKomentar', function (req, res) {
        var sess = req.session;
        if (typeof sess.korisnik == "undefined" || sess.korisnik == null) {
            res.json({ poruka: "Morate se ulogovati da bi azurirali komentar" })
        }
        else {
            var oglasId = req.body.oglasId;
            var KomentarId = req.body.KomentarId;
            var tekst = req.body.tekst;
            var username = sess.korisnik.username;
            Komentar.find({ id: KomentarId }, function (err, komentar) {

                if (komentar[0].KorisnikUsername != sess.korisnik.username) {
                    res.json({ poruka: "Ne mozete menjati tudji komentar" })
                }
                else {
                    komentar[0].tekst = tekst;
                    komentar[0].save(function (err, komentar) {
                        Komentar.find({ OglasId: oglasId }, function (err, komentari) {
                            var poruka = "Uspesno ste azurirali komentar"
                            res.json({ komentari: komentari.reverse(), username: username, poruka: poruka });
                        });
                    });
                }
            });
        }
    });

    router.get('/obrKom', function (req, res) {
        Komentar.deleteMany(function (err, dataCount) {
            res.send(dataCount)
        });
    });

    router.post('/dislajk', function (req, res) {


        var OglasId = req.body.OglasId;
        var sess = req.session;
        if (typeof sess.korisnik == 'undefined' || sess.korisnik == null) {
            res.json({ putanja: '/login' })
            return
        }
        Lajk.find({ KorisnikUsername: sess.korisnik.username, OglasId: OglasId }, function (err, lajk) {
            if (lajk.length > 0) {
                if (lajk[0].LajkDislajk == true) {
                    lajk[0].LajkDislajk = false;
                    lajk[0].save(function () {
                        Lajk.find({ OglasId: OglasId }, function (err, sviLajkovi) {
                            var brojLajkova = sviLajkovi.filter((lajk) => lajk.LajkDislajk).length;
                            var brojDislajkova = sviLajkovi.filter((lajk) => !lajk.LajkDislajk).length;
                            res.json({
                                dislajk: "dislajkovan",
                                brojLajkova: brojLajkova,
                                brojDislajkova: brojDislajkova
                            });
                            return;
                        });

                    });
                }
                else {
                    Lajk.deleteOne(lajk[0], function (err, l) {
                        Lajk.find({ OglasId: OglasId }, function (err, sviLajkovi) {
                            var brojLajkova = sviLajkovi.filter((lajk) => lajk.LajkDislajk).length;
                            var brojDislajkova = sviLajkovi.filter((lajk) => !lajk.LajkDislajk).length;
                            res.json({
                                dislajk: "nista",
                                brojLajkova: brojLajkova,
                                brojDislajkova: brojDislajkova
                            });
                            return;
                        });
                    });
                }

            }
            else {
                lajk = new Lajk({
                    OglasId: OglasId,
                    LajkDislajk: false,
                    KorisnikUsername: sess.korisnik.username
                });
                lajk.save(function (e, l) {
                    Lajk.find({ OglasId: OglasId }, function (err, sviLajkovi) {
                        var brojLajkova = sviLajkovi.filter((lajk) => lajk.LajkDislajk).length;
                        var brojDislajkova = sviLajkovi.filter((lajk) => !lajk.LajkDislajk).length;
                        res.json({
                            dislajk: "dislajkovan",
                            brojLajkova: brojLajkova,
                            brojDislajkova: brojDislajkova
                        });
                        return;
                    });
                });
            }
        });
    });


    router.post('/lajk', function (req, res) {
        var OglasId = req.body.OglasId;
        var sess = req.session;
        if (typeof sess.korisnik == 'undefined' || sess.korisnik == null) {
            res.json({ putanja: '/login' });
            return;
        }

        Lajk.find({ OglasId: OglasId, KorisnikUsername: sess.korisnik.username }, function (err, lajk) {
            if (lajk.length > 0) {
                if (lajk[0].LajkDislajk == false) {
                    lajk[0].LajkDislajk = true;
                    lajk[0].save(function () {
                        Lajk.find({ OglasId: OglasId }, function (err, sviLajkovi) {
                            var brojLajkova = sviLajkovi.filter((lajk) => lajk.LajkDislajk).length;
                            var brojDislajkova = sviLajkovi.filter((lajk) => !lajk.LajkDislajk).length;
                            res.json({
                                lajk: "lajkovan",
                                brojLajkova: brojLajkova,
                                brojDislajkova: brojDislajkova
                            });
                            return;
                        });
                    });
                }
                else {
                    Lajk.deleteOne(lajk[0], function () {
                        Lajk.find({ OglasId: OglasId }, function (err, sviLajkovi) {
                            var brojLajkova = sviLajkovi.filter((lajk) => lajk.LajkDislajk).length;
                            var brojDislajkova = sviLajkovi.filter((lajk) => !lajk.LajkDislajk).length;
                            res.json({
                                lajk: "nista",
                                brojLajkova: brojLajkova,
                                brojDislajkova: brojDislajkova
                            });
                            return;
                        });
                    });
                }
            }
            else {
                lajk = new Lajk({
                    OglasId: OglasId,
                    LajkDislajk: true,
                    KorisnikUsername: sess.korisnik.username
                });
                lajk.save(function () {
                    Lajk.find({ OglasId: OglasId }, function (err, sviLajkovi) {
                        var brojLajkova = sviLajkovi.filter((lajk) => lajk.LajkDislajk).length;
                        var brojDislajkova = sviLajkovi.filter((lajk) => !lajk.LajkDislajk).length;
                        res.json({
                            lajk: "lajkovan",
                            brojLajkova: brojLajkova,
                            brojDislajkova: brojDislajkova
                        });
                        return;
                    });
                });
            }
        });

    });

    router.post('/pretraga', function (req, res) {

        var username = req.body.username;
        var naslov = req.body.naslov;
        var vrsta = req.body.vrsta;
        var vrstaPlacanja = req.body.vrstaPlacanja;
        var cenaOd = req.body.cenaOd;
        var cenaDo = req.body.cenaDo;



        Oglas.find(function (err, oglasi) {

            if (username != undefined && username != '') {
                oglasi = oglasi.filter(function (oglas) {
                    return oglas.KorisnikUsername == username
                });
            }

            if (naslov != undefined && naslov != '') {
                oglasi = oglasi.filter(function (oglas) {
                    naslovRegex = new RegExp(naslov.trim().toLowerCase(), 'gu')


                    var PoklapaSe = naslovRegex.test(oglas.naslov.toLowerCase())
                        || naslovRegex.test(oglas.opis.toLowerCase());

                    return PoklapaSe;
                });
            }

            if (vrsta != undefined && vrsta != '') {
                oglasi = oglasi.filter(function (oglas) {
                    return oglas.VrstaId == vrsta
                });
            }
            if (vrstaPlacanja != undefined && vrstaPlacanja != '') {
                if (vrstaPlacanja != 'novac') {
                    oglasi = oglasi.filter(function (oglas) {
                        return oglas.vrstaPlacanja == vrstaPlacanja
                    });
                }
                else {
                    oglasi = oglasi.filter(function (oglas) {
                        return oglas.vrstaPlacanja == vrstaPlacanja
                            && oglas.cena >= cenaOd
                            && oglas.cena <= cenaDo
                    });
                }

            }
            res.json({ oglasi: oglasi });

        });
    });




    router.get('/inbox', function (req, res) {
        var sess = req.session;
        if (typeof sess.korisnik == 'undefined' || sess.korisnik == null) {
            res.redirect('/login');
            return;
        }
        var username = sess.korisnik.username;
        var za = req.query.za;
        if (za == undefined) {
            Poruka.find({ $or: [{ zaUsername: username }, { odUsername: username }] }, function (err, poruke) {
                niz = poruke.map(function (poruka) {
                    if (poruka.zaUsername == username) {
                        return { username: poruka.odUsername }
                    }
                    else {
                        return { username: poruka.zaUsername }
                    }
                })
                Korisnik.find({ $or: niz }, function (err, korisnici) {
                    if (niz.length == 0) {
                        korisnici = [];
                    }
                   


                    Poruka.find({ zaUsername: username }, function (err, svePor) {

                        korisnici = korisnici.map(function (kor) {

                            porZaPregled = svePor.filter(function (por) {
                                return por.odUsername == kor.username;
                            })

                            var pregledane = true;
                            for (let p of porZaPregled) {
                                if (p.procitana == false) {
                                    pregledane = false
                                }

                            }
                            k = {
                                username: kor.username,
                                password: kor.password,
                                email: kor.email,
                                brojTel: kor.brojTel,
                                pregledane: pregledane

                            };

                            return k;
                        });
                        korisnici = korisnici.sort(function (a, b) {
                            return a.pregledane - b.pregledane
                        });
                        if (korisnici.length > 0) {
                            poruke = poruke.filter(function (poruka) {
                                return poruka.zaUsername == korisnici[0].username || poruka.odUsername == korisnici[0].username;
                            });
                        }
                        else {
                            poruke = [];
                        }

                        res.render('inbox', { korisnici: korisnici, korisnik: sess.korisnik, poruke: poruke });
                    });


                });
            });
        }
        else {

            Poruka.find({ $or: [{ zaUsername: username, odUsername: za }, { zaUsername: za, odUsername: username }] }, function (err, poruke) {

                if (poruke.length > 0) {
                    Poruka.find({ $or: [{ zaUsername: username }, { odUsername: username }] }, function (err, poruke) {
                        niz = poruke.map(function (poruka) {
                            if (poruka.zaUsername == username) {
                                return { username: poruka.odUsername }
                            }
                            else {
                                return { username: poruka.zaUsername }
                            }
                        })

                        Korisnik.find({ $or: niz }, function (err, korisnici) {
                            if (niz.length == 0) {
                                korisnici = [];
                            }
                            
                            poruke = poruke.filter(function (poruka) {
                                return poruka.zaUsername == za || poruka.odUsername == za
                            })
                            Poruka.find({ zaUsername: username }, function (err, svePor) {

                                korisnici = korisnici.map(function (kor) {

                                    porZaPregled = svePor.filter(function (por) {
                                        return por.odUsername == kor.username;
                                    })

                                    var pregledane = true;
                                    for (let p of porZaPregled) {
                                        if (p.procitana == false) {
                                            pregledane = false;
                                        }

                                    }
                                    k = {
                                        username: kor.username,
                                        password: kor.password,
                                        email: kor.email,
                                        brojTel: kor.brojTel,
                                        pregledane: pregledane


                                    };

                                    return k;
                                })
                                korisnici3 = [];
                                korisnici1 = korisnici.find(x => x.username == za);
                                korisnici3.push(korisnici1);
                                korisnici2 = korisnici.filter(x => x.username != za);

                                korisnici2 = korisnici2.sort(function (a, b) {
                                    return a.username == za || a.pregledane - b.pregledane
                                });
                                korisnici3.push(...korisnici2);


                                res.render('inbox', { korisnici: korisnici3, korisnik: sess.korisnik, poruke: poruke });
                            });


                        });
                    });
                }
                else {
                    Korisnik.find({ username: za }, function (err, za) {
                        if (za.length > 0) {
                            Poruka.find({ $or: [{ zaUsername: username }, { odUsername: username }] }, function (err, poruke) {

                                niz = poruke.map(function (poruka) {
                                    if (poruka.zaUsername == username) {
                                        return { username: poruka.odUsername }
                                    }
                                    else {
                                        return { username: poruka.zaUsername }
                                    }
                                })

                                Korisnik.find({ $or: niz }, function (err, korisnici) {
                                    if (niz.length == 0) {
                                        korisnici = [];
                                    }
                                    poruke = poruke.filter(function (poruka) {
                                        return poruka.zaUsername == za[0].username || poruka.odUsername == za[0].username
                                    });

                                    Poruka.find({ zaUsername: sess.korisnik.username }, function (err, svePor) {
                                        korisnici = korisnici.map(function (kor) {

                                            porZaPregled = svePor.filter(function (por) {
                                                return por.odUsername == kor.username;
                                            })

                                            var pregledane = true;
                                            for (let p of porZaPregled) {
                                                if (p.procitana == false) {
                                                    pregledane = false;
                                                }

                                            }


                                            k = {
                                                username: kor.username,
                                                password: kor.password,
                                                email: kor.email,
                                                brojTel: kor.brojTel,
                                                pregledane: pregledane


                                            };

                                            return k;
                                        });
                                        za[0].pregledane = true;
                                        korisnici1 = [za[0]];
                                        korisnici2 = korisnici.filter(x => x.username != za[0].username);

                                        korisnici2 = korisnici2.sort(function (a, b) {
                                            return a.username == za || a.pregledane - b.pregledane
                                        });
                                        korisnici1.push(...korisnici2);



                                        res.render('inbox', { korisnici: korisnici1, korisnik: sess.korisnik, poruke: poruke });
                                    });


                                });
                            });
                        }
                        else {

                            Poruka.find({ $or: [{ zaUsername: username }, { odUsername: username }] }, function (err, poruke) {
                                niz = poruke.map(function (poruka) {
                                    if (poruka.zaUsername == username) {
                                        return { username: poruka.odUsername }
                                    }
                                    else {
                                        return { username: poruka.zaUsername }
                                    }
                                })

                                Korisnik.find({ $or: niz }, function (err, korisnici) {
                                    if (niz.korisnici == 0) {
                                        korisnici = [];
                                    }
                                    
                                    Poruka.find({ zaUsername: sess.korisnik.username }, function (err, svePor) {
                                        korisnici = korisnici.map(function (kor) {

                                            porZaPregled = svePor.filter(function (por) {
                                                return por.odUsername == kor.username;
                                            })

                                            var pregledane = true;
                                            for (let p of porZaPregled) {
                                                if (p.procitana == false) {
                                                    pregledane = false
                                                }

                                            }
                                            k = {
                                                username: kor.username,
                                                password: kor.password,
                                                email: kor.email,
                                                brojTel: kor.brojTel,
                                                pregledane: pregledane


                                            };

                                            return k;
                                        })

                                        korisnici = korisnici.sort(function (a, b) {
                                            return a.username == za || a.pregledane - b.pregledane
                                        })
                                        poruke = [];
                                        var poruka = "Ne postoji korisnik sa zeljenim username-om."
                                        res.render('inbox', { korisnici: korisnici, korisnik: sess.korisnik, poruke: poruke, poruka: poruka })



                                    });


                                });
                            });
                        }
                    });


                }
            });
        }


    });

    router.post('/ucitajPoruke', function (req, res) {
        var sess = req.session;
        if (typeof sess.korisnik == 'undefined' || sess.korisnik == null) {
            res.redirect('/login');
            return;
        }
        var username = req.body.username;
        Poruka.find({ $or: [{ zaUsername: username }, { odUsername: username }] }, function (err, poruke) {
            poruke = poruke.filter(function (por) {
                return sess.korisnik.username == por.odUsername || sess.korisnik.username == por.zaUsername;
            });
            res.json({ poruke: poruke });

        });
    });



    router.post('/posaljiPoruku', function (req, res) {
        var sess = req.session;
        if (typeof sess.korisnik == 'undefined' || sess.korisnik == null) {
            res.redirect('/login')
            return
        }
        var tekst = req.body.tekst;
        var zaUsername = req.body.zaUsername;
        Poruka.find(function (err, poruke) {
            maxId = 1;
            if (poruke.length > 0) {
                maxId = poruke.sort().reverse()[0].idPoruke + 1;
            }
            var poruka = new Poruka({
                idPoruke: maxId,
                odUsername: sess.korisnik.username,
                zaUsername: zaUsername,
                tekst: tekst,
                procitana: false,
                vreme: new Date()
            })
            poruka.save(function (err, por) {
                res.json({ poruka: por })
            });

        });

    });

    router.post('/seen', function (req, res) {
        var sess = req.session;
        if (typeof sess.korisnik == 'undefined' || sess.korisnik == null) {
            res.redirect('/login')
            return;
        }
        var username = req.body.username;
        Poruka.find({ zaUsername: sess.korisnik.username, odUsername: username }, function (err, poruke) {
            for (let poruka of poruke) {
                poruka.procitana = true;
            }
            var i = poruke.length;

            sacuvaj(poruke, i)


            res.json({})
            return;

        })
    });


    function sacuvaj(niz, i) {
        i--;
        if (i > -1) {
            niz[i].save(function (err, data) {

                sacuvaj(niz, i)
            })
        }
        else {
            return;
        }

    }

    router.post('/proveriPoruke', function (req, res) {

        var sess = req.session;
        if (typeof sess.korisnik == 'undefined' || sess.korisnik == null) {
            res.json({ postoji: false })
        }
        else {
            var username = sess.korisnik.username;
            Poruka.find({ zaUsername: username, procitana: false }, function (err, poruke) {
                if (poruke.length > 0) {
                    var nizZaPretragu = poruke.map(function (por) {
                        return { username: por.odUsername };
                    })

                    Korisnik.find({ $or: nizZaPretragu }, function (err, korisnici) {

                        if (nizZaPretragu.length == 0) {
                            korisnici = [];
                        }

                        res.json({ postoji: true, brojPoruka: korisnici.length })
                    })


                }
                else {
                    res.json({ postoji: false })
                }
            })
        }
    });

    router.get('/error', function (req, res) {
        var error = "Doslo je do greske!";
        res.render('error', { error: error })
    });
    router.get('/:url', function (req, res) {
        var url = req.params.url;

        if (url == 'admin' || url == '/admin' || url == '/admin/') {
            res.redirect('/admin//');
        }
        else {
            var error = "Ne mozemo naci putanju /" + url;
            res.render('error', { error: error })
        }
    });

}