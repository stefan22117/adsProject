
$('#nazad').click(function () {
    $('#nazad').prop('href', 'javascript:history.back()');
})



$("#cenaOdInput").val($("#cenaOd").val())

$("#cenaDoInput").val($("#cenaDo").val())

$("#cenaOdInput").focusout(function (e) {
    var vrednost = parseFloat($(this).val());

    if (vrednost < parseFloat($('#cenaDo').val())) {
        $('#cenaOd').val($(this).val());
        $(this).val($('#cenaOd').val());

    }
    else {
        $(this).val($('#cenaDo').val())
        $('#cenaOd').val($('#cenaDo').val())
    }

})

$("#cenaDoInput").focusout(function (e) {
    var vrednost = parseFloat($(this).val());

    if (vrednost > parseFloat($('#cenaOd').val())) {
        $('#cenaDo').val($(this).val())
        $(this).val($('#cenaDo').val())

    }
    else {
        $(this).val($('#cenaOd').val())
        $('#cenaDo').val($('#cenaOd').val())
    }
})



$('#cenaOd').change(function (e) {
    if (parseFloat($(this).val()) > parseFloat($("#cenaDo").val())) {
        $(this).val(parseFloat($("#cenaDo").val()));
    }
    $("#cenaOdInput").val($(this).val())
});

$('#cenaDo').change(function (e) {
    if (parseFloat($(this).val()) < parseFloat($("#cenaOd").val())) {
        $(this).val(parseFloat($("#cenaOd").val()));
    }
    $("#cenaDoInput").val($(this).val())
});



$('#pretragaForm').find('input[type=radio]').click(function (e) {

    if ($(this).val() == 'novac') {
        $('.cena').css('display', 'inline-block')
    }
    else {
        $('.cena').css('display', 'none')
    }


})

$('#pretrazi').click(function () {


    var url = location.href.split('?')
    var username = undefined;
    if (/^username=/.test(url[url.length - 1])) {
        username = url[url.length - 1].split('username=')
        username = username.filter(x => x != '');
        username = username[0];
    }



    var naslov = $('#naslov').val();//trimuje se u controlleru
    var vrsta = $('#vrsta').val();
    var vrstaPlacanja = $('#pretragaForm').find('input[name="vrstaPlacanja"]:checked').val();//ne treba trim, a i baca gresku ako nista nije selektovano
    var cenaOd = $('#cenaOd').val();
    var cenaDo = $('#cenaDo').val();

    if ((naslov == '' || naslov == undefined) && (vrsta == '' || vrsta == undefined) && (vrstaPlacanja == '' || vrstaPlacanja == undefined)) {

        var str = '';
        str += '<div class="text-warning h4 mx-auto">\n';
        str += '<p class="h3 font-size-bold text-warning alert alert-light">\n';
        str += 'Niste pravilno uneli parametre za pretragu';
        str += '</p>\n';
        str += '</div>\n';

        $('.oglasi').html(str);

        return false;
    }







    $.ajax({
        url: '/pretraga',
        type: 'post',
        data: {
            username: username,
            naslov: naslov,
            vrsta: vrsta,
            vrstaPlacanja: vrstaPlacanja,
            cenaOd: cenaOd,
            cenaDo: cenaDo
        },
        success: function (data) {
            var oglasi = data.oglasi;
            var str = "";
            var paginacija = "";
            if (typeof oglasi != 'undefined' && oglasi != null && oglasi.length > 0) {
                var i = 0;
                for (let oglas of oglasi) {
                    var nizSlika = oglas.slika.split(' ').filter(x => x != '');
                    if (i < 6) {
                        str += '<div class="col-md-4 oglas">\n';
                        i++;
                    }
                    else {
                        str += '<div class="col-md-4 oglas d-none">\n';
                    }

                    str += '<div class="card mb-2">\n';
                    str += '<p style="display: none;" class="oglasId">' + oglas.id + '</p>\n';

                    str += '<p style="display: none;" class="oglasId">' + oglas.id + '</p>\n';
                    str += '<img src="/slike/' + (nizSlika[0] || 'blanc.png') + '" style="width: 100%; height: 25vh;" class="card-img-top" alt="">\n';
                    str += '<div class="card-body">\n'
                    str += '<p class="card-title">' + oglas.naslov + '</p>\n';
                    if (oglas.vrstaPlacanja == "poDogovoru") {
                        str += '<p class="card-text">Po dogovoru</p>\n';
                    }
                    if (oglas.vrstaPlacanja == "zamena") {
                        str += '<p class="card-text">Zamena</p>\n';
                    }
                    if (oglas.vrstaPlacanja == "novac") {
                        str += '<p class="card-text">' + oglas.cena + '</p>\n';
                    }
                    str += '</div>\n';
                    str += '</div>\n';
                    str += '</div>\n';

                }

                paginacija += '<div class="paginacija container text-center mb-2">\n';
                paginacija += '<p id="trenutniIndex" class="d-none">1</p>\n';
                paginacija += '<button class="btn btn-primary btn-lg font-weight-bold levo">\n';
                paginacija += '&#10094;\n';
                paginacija += ' </button>\n';
                paginacija += '<button class="btn btn-primary btn-lg font-weight-bold desno">\n';
                paginacija += '&#10095;\n';
                paginacija += '</button>\n';
                paginacija += '</div>\n';

            }
            else {
                str += '<div class="text-warning h4 mx-auto">\n';
                str += '<p class="h3 font-size-bold text-warning alert alert-light">\n';
                str += 'Nismo uspeli da pronadjemo oglase';
                str += '</p>\n';
                str += '</div>\n';
            }
            $('.oglasi').html(str);

            $('.oglasi').append(paginacija);



            if (typeof oformiPaginaciju != 'undefined') {
                oformiPaginaciju();
            }
            oformiOglase();

        }
    })

    function oformiOglase() {
        $('.oglas').click(function () {
            var id = $(this).find('.oglasId');
            if (id != undefined) {
                id = id.html();
                if (id != undefined) {
                    id = id.trim();
                }
            }
            else {
                id = 0;
            }

            location.href = "/oglas/" + id;
        })

    }


    return false;
})
