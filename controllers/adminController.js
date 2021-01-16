const Komentar = require("../models/Komentar");
const Korisnik = require("../models/Korisnik");
const Lajk = require("../models/Lajk");
const Poruka = require("../models/Poruka");
const Vrsta = require("../models/Vrsta");

module.exports = function (router) {
    router.get('/', function (req, res) {
        var sess = req.session;
        if (typeof sess.korisnik == 'undefined' || sess.korisnik == null) {
            res.redirect('/login');
            return;
        }
        if (sess.korisnik.role != 'admin') {
            res.redirect('/');
            return;
        }
        Korisnik.find(function (err, korisnici) {
            korisnici = korisnici.filter(x => x.username != sess.korisnik.username)


            Vrsta.find(function (err, vrste) {
                res.render('admin', { korisnik: sess.korisnik, korisnici: korisnici, vrste: vrste });
            });

        });

    });


    router.post('/obrisiKorisnika', function (req, res) {
        var sess = req.session;
        if (typeof sess.korisnik == 'undefined' || sess.korisnik == null) {
            res.redirect('/login');
            return;
        }
        if (sess.korisnik.role != 'admin') {
            res.redirect('/');
            return;
        }

        var username = req.body.username;
        Korisnik.find({ username: username }, function (err, kor) {
            if (kor.length == 0) {
                Korisnik.find(function (err, korisnici) {
                    korisnici = korisnici.filter(x => x.username != sess.korisnik.username);
                    var poruka = 'Nema korisnika sa usernameom "' + username + '" za brisanje';
                    res.json({ korisnik: sess.korisnik, korisnici: korisnici, porukaDanger: poruka });
                })
            }
            else {
                if (sess.korisnik.username == username) {
                    Korisnik.find(function (err, korisnici) {
                        console.log(sess.korisnik.username)
                        korisnici = korisnici.filter(x => x.username != sess.korisnik.username);
                        var poruka = 'Ne mozete obrisati sami sebe';
                        res.json({ korisnik: sess.korisnik, korisnici: korisnici, porukaDanger: poruka });
                    })
                }
                else {
                    Poruka.deleteMany({ $or: [{ zaUsername: username }, { odUsername: username }] }, function (err, porukaCount) {
                        Komentar.deleteMany({ KorisnikUsername: username }, function (err, komCount) {
                            Lajk.deleteMany({ KorisnikUsername: username }, function (err, lajkCount) {
                                Oglas.deleteMany({ KorisnikUsername: username }, function (err, oglasCount) {
                                    Korisnik.deleteOne({ username: username }, function (err, korCount) {
                                        Korisnik.find(function (err, korisnici) {
                                            korisnici = korisnici.filter(x => x.username != sess.korisnik.username)
                                            var poruka = 'Uspesno ste obrisali korisnika sa username-om: "' + username + '"'
                                            res.json({ korisnik: sess.korisnik, korisnici: korisnici, poruka: poruka });
                                        });
                                    });
                                });
                            });
                        });
                    });
                }

            }

        });
    });


    router.post('/dodajVrstu', function (req, res) {
        var vrstaNaziv = req.body.vrstaNaziv;
        console.log(vrstaNaziv)
        Vrsta.find({ naziv: vrstaNaziv }, function (err, vrsteNaziv) {
            console.log(vrsteNaziv)
            if (vrsteNaziv.length > 0) {
                Vrsta.find(function (err, vrste) {
                    var poruka = 'Vec postoji vrsta sa nazivom "' + vrstaNaziv + '"';
                    res.json({ vrste: vrste, porukaDanger: poruka });
                })
            }
            else {
                Vrsta.find(function (err, vrste) {
                    var id = 1;

                    if (vrste.length > 0) {
                        id = vrste.sort().reverse()[0].id + 1;
                    }
                    var vrsta = new Vrsta({
                        id: id,
                        naziv: vrstaNaziv
                    });

                    vrsta.save(function(err, vrsta){
                        Vrsta.find(function(err, vrste){
                            var poruka = 'Uspesno ste dodali vrstu sa nazivom "' + vrstaNaziv + '"';
                            res.json({vrste: vrste, poruka: poruka});
                        });
                        
                    });

                });
            }
        });
    });
    router.post('/obrisiVrstu', function (req, res) {


        var sess = req.session;
        if (typeof sess.korisnik == 'undefined' || sess.korisnik == null) {
            res.redirect('/login');
            return;
        }
        if (sess.korisnik.role != 'admin') {
            res.redirect('/');
            return;
        }

        var id = req.body.id;
        Vrsta.find({ id: id }, function (err, vrste) {
            if (vrste.length == 0) {
                Korisnik.find(function (err, korisnici) {
                    korisnici = korisnici.filter(x => x.username != sess.korisnik.username);
                    var poruka = 'Nema vrste sa ID-jem "' + id + '" za brisanje';
                    Vrsta.find(function (err, vrste) {
                        res.json({ porukaDanger: poruka, vrste: vrste });
                    })

                })
            }
            else {
                Oglas.deleteMany({ VrstaId: id }, function (err, oglasiCount) {
                    Vrsta.find({ id: id }, function (err, vrstaZaBrisanje) {
                        var naziv = vrstaZaBrisanje[0].naziv;
                        Vrsta.deleteOne(vrstaZaBrisanje[0], function (err, vrstaCount) {
                            Korisnik.find(function (err, korisnici) {
                                korisnici = korisnici.filter(x => x.username != sess.korisnik.username)
                                var poruka = 'Uspesno ste obrisali vrstu sa nazivom: "' + naziv + '"';
                                Vrsta.find(function (err, vrste) {
                                    res.json({ poruka: poruka, vrste: vrste });
                                });

                            });
                        });
                    });

                });
            }
        });

    });
}