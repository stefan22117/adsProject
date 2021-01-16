
$('#postaviBtn').click(function () {

    sracunajProgres();

    var regexTekst = /^\p{L}[\p{L}0-9_ ]+$/u;
    var regexCena = /^\d+(\.\d+)?$/;
    var regexVrsta = /^\d+$/;

    var naslov = $('#naslov').val();
    var slike = $('#fajl')[0].files;
    var vrstaPlacanja = $('#formaNoviOglas').find('input[type=radio]:checked').val();
    var vrsta = $('#vrsta').val();
    var opis = $('#opis').val();
    var noviOglasBool = true;

    if (!regexTekst.test(naslov)) {
        noviOglasBool = false;
    }
    if (slike.length == 0) {//da li ima gore ili nema, ako nema nek bude ovaj uslov true(nema ni jedne slike)
        noviOglasBool = false;
    }
    if (!regexTekst.test(vrstaPlacanja)) {
        noviOglasBool = false;
    }

    if (!regexVrsta.test(vrsta)) {
        noviOglasBool = false;
    }
    if (vrstaPlacanja == 'novac') {
        
        var cena = $('#cena').val();
        if (!regexCena.test(cena)) {
            noviOglasBool = false;
        }
    }
    if (opis == '') {
        noviOglasBool = false;
    }

    console.log('tacno,', noviOglasBool)
    
        progress = $('.progress').children().first().html();
        if(progress != '100%'){
            noviOglasBool = false;
        }

        console.log('posle,', noviOglasBool)
    

    if (noviOglasBool == false) {
        $('#sacuvaj').removeClass('btn-success');
        $('#sacuvaj').addClass('btn-secondary');

        $('#poruka').removeClass('d-none');
        $('#poruka').addClass('d-block');
        $('#poruka').html('Niste popunili sva polja');
        return false;
    }
    else {
        console.log('sdadsds')
        $('#sacuvaj').removeClass('btn-secondary');
        $('#sacuvaj').addClass('btn-success');
        return true;
    }



})

    $('#nazad').click(function () {
        $('#nazad').prop('href', 'javascript:history.back()');
    })

    $('#formaNoviOglas').find('input[type=radio]').change(function (e) {

        if ($(this).val() == 'novac') {
            $('.novacDiv').addClass('d-block');
            $('.novacDiv').removeClass('d-none');
        }
        else {
            $('.novacDiv').addClass('d-none');
            $('.novacDiv').removeClass('d-block');
        }


    })


    function sracunajProgres() {
        var regexTekst = /^\p{L}[\p{L}0-9_ ]+$/u;
    var regexCena = /^\d+(\.\d+)?$/;
    var regexVrsta = /^\d+$/;

    var naslov = $('#naslov').val();
    var slike = $('#fajl')[0].files;
    var vrstaPlacanja = $('#formaNoviOglas').find('input[type=radio]:checked').val();
    var vrsta = $('#vrsta').val();
    var opis = $('#opis').val();


        process = 0;
        if (regexTekst.test(naslov)) {
            process += 20;

        }
        if (slike.length > 0) {
            process += 20;

        }

        console.log('vp:', vrstaPlacanja)

        if (vrstaPlacanja != undefined && regexTekst.test(vrstaPlacanja)) {
            if (vrstaPlacanja == 'novac') {
                process += 10;
                var cena = $('#cena').val();
                if (regexCena.test(cena)) {
                    process += 10;
                }
            }
            else {
                process += 20;
                console.log('das')
            }
        }
        
        if (regexVrsta.test(vrsta)) {
            process += 20;
        }
        if (opis != '') {
            process += 20;
        }
        console.log(regexVrsta.test(vrsta), opis!='')
        console.log(opis)

        $('.progress').children().first().css('width', process + '%');
        $('.progress').children().first().html(process + '%');

        if (process == 100) {
            $('#postaviBtn').removeClass('btn-secondary');
            $('#postaviBtn').addClass('btn-success');
        }



    }

    $('#naslov').change(function () {
        sracunajProgres()
    })
    $('#fajl').change(function () {
        sracunajProgres()
    })
    $('#cena').change(function () {
        sracunajProgres()
    })
    $('#vrsta').change(function () {
        sracunajProgres()
    })
    $('input[name="vrstaPlacanja"]').change(function () {
        sracunajProgres()
    })
    $('#opis').change(function () {
        sracunajProgres()
    })