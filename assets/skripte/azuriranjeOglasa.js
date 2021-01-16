
postaviSveAzuriranje();
function postaviSveAzuriranje() {
    var string = window.location.pathname;
    var niz = string.split('/')
    var OglasId = niz[niz.length - 1];

    $(".slika").hover(function (e) {

        var nazivSlike = $(e.target).prop('src');


        var slika = e.target;
        $(e.target).parent().prepend('<a class="iks">&#215;</a>')

        $('.iks').click(function (e) {
            $(e.target).parent().remove()
            return
            $.ajax({
                url: '/oduzmiSliku',
                type: 'post',
                data: {
                    nazivSlike: nazivSlike,
                    OglasId: OglasId
                },
                success: function (data) {
                    var nizSlika = data.noveSlike.split(' ').filter(x => x != "");
                    var stareSlike = $(".stareSlike");
                    stareSlike.html('');
                    for (let slika of nizSlika) {
                        stareSlike.append('<div class="slika">'
                            + '<img src="/slike/' + slika + '" alt="">'
                            + '</div>')

                    }
                    postaviSveAzuriranje();
                }
            })
        })


    })
    $(".slika").mouseleave(function (e) {
        $(e.target).parent().find('.iks').remove();
    })
}
$('#nazad').click(function () {
    $('#nazad').prop('href', 'javascript:history.back()');
})


$('#formaNoviOglas').find('input[type=radio]').change(function (e) {

    if ($(this).val() == 'novac') {
        $('.novacDiv').removeClass('d-none');
        $('.novacDiv').addClass('d-block');
    }
    else {
        $('.novacDiv').removeClass('d-block');
        $('.novacDiv').addClass('d-none');
    }


})


$('#sacuvaj').click(function () {

   
var regexTekst = /^\p{L}[\p{L}0-9_ ]+$/u;
var regexCena = /^\d+(\.\d+)?$/;
var regexVrsta = /^\d+$/;

var naslov = $('#naslov').val();
var slike = $('#fajl')[0].files;
var vrstaPlacanja = $('#formaNoviOglas').find('input[type=radio]:checked').val();
var vrsta = $('#vrsta').val();
var opis = $('#opis').val();
var azuriranjeBool = true;
var stareSlike = $('.stareSlike').children();

if (!regexTekst.test(naslov)) {
azuriranjeBool = false;
}
if (slike.length == 0 && stareSlike.length == 0) {//da li ima gore ili nema, ako nema nek bude ovaj uslov true(nema ni jedne slike)
azuriranjeBool = false;
}
if (vrstaPlacanja == undefined || !regexTekst.test(vrstaPlacanja)) {
azuriranjeBool = false;
}

if (!regexVrsta.test(vrsta)) {
azuriranjeBool = false;
}
if (vrstaPlacanja == 'novac') {
var cena = $('#cena').val();
if (!regexCena.test(cena)) {
azuriranjeBool = false;
}
}
if (opis == '') {
azuriranjeBool = false;
}

if (azuriranjeBool == false) {
$('#sacuvaj').removeClass('btn-success');
$('#sacuvaj').addClass('btn-secondary');

$('#poruka').removeClass('d-none')
$('#poruka').addClass('d-block')
$('#poruka').html('Niste popunili sva polja')

return false;
}
else {
$('#sacuvaj').removeClass('btn-secondary');
$('#sacuvaj').addClass('btn-success');
return true;
}



})