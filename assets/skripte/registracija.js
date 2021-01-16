

$('#username').focusout(function () {

    $('#username').removeClass('is-valid');
    $('#username').removeClass('is-invalid');

    var username = $('#username').val();
    var regexUsername = /^[a-zA-Z0-9]+([a-zA-Z0-9](_|-| )[a-zA-Z0-9])*[a-zA-Z0-9]+$/;



    if (regexUsername.test(username)) {

        $.ajax({
            url: '/proveriUsername',
            type: 'post',
            data: { username: username },
            success: function (data) {
                if (data.postoji) {
                    $('#invalidUsername').html('Postoji korisnik sa username-om: ' + username);
                    $('#username').removeClass('is-invalid');
                    $('#username').addClass('is-invalid');
                    $('#username').val('');
                }
                else {
                    $('#username').removeClass('is-invalid');
                    $('#username').addClass('is-valid');
                }
            }
        })



    }
    else {
        $('#invalidUsername').html('Niste uneli username pravilno');
        $('#username').removeClass('is-invalid');
        $('#username').addClass('is-invalid');

    }
    if (validirajRegistraciju()) {
        $('#registracija').removeClass('btn-secondary');
        $('#registracija').addClass('btn-success');
        //$('#registracija').prop('disabled', false);
    }
    else {
        $('#registracija').removeClass('btn-success');
        $('#registracija').addClass('btn-secondary');
        //$('#registracija').prop('disabled', true);
    }
})

$('#password1').focusout(function () {
    $('#password1').removeClass('is-valid');
    $('#password1').removeClass('is-invalid');

    var regexPassword = /^[a-zA-Z0-9]+([a-zA-Z0-9](_|-| )[a-zA-Z0-9])*[a-zA-Z0-9]+$/;

    var password1 = $('#password1').val();

    if (regexPassword.test(password1)) {
        $('#password1').removeClass('is-invalid');
        $('#password1').addClass('is-valid');
    }
    else {
        $('#invalidPassword1').html('Niste uneli sifru pravilno');
        $('#password1').removeClass('is-invalid');
        $('#password1').addClass('is-invalid');
    }

    if (password1 == $('#password2').val() && regexPassword.test($('#password2').val())) {
        $('#password2').removeClass('is-invalid');
        $('#password2').addClass('is-valid');
    }
    if (validirajRegistraciju()) {
        $('#registracija').removeClass('btn-secondary');
        $('#registracija').addClass('btn-success');
        //$('#registracija').prop('disabled', false);
    }
    else {
        $('#registracija').removeClass('btn-success');
        $('#registracija').addClass('btn-secondary');
        //$('#registracija').prop('disabled', true);
    }
})

$('#password2').focusout(function () {
    $('#password2').removeClass('is-valid');
    $('#password2').removeClass('is-invalid');

    var regexPassword = /^[a-zA-Z0-9]+([a-zA-Z0-9](_|-| )[a-zA-Z0-9])*[a-zA-Z0-9]+$/;

    var password2 = $('#password2').val();

    if (regexPassword.test(password2)) {
        if ($('#password1').val() == $('#password2').val()) {
            $('#password2').removeClass('is-invalid');
            $('#password2').addClass('is-valid');
        }
        else {
            $('#invalidPassword2').html('Lozinke se ne poklapaju');
            $('#password2').removeClass('is-invalid');
            $('#password2').addClass('is-invalid');
        }
    }
    else {
        $('#invalidPassword2').html('Niste uneli sifru pravilno');
        $('#password2').removeClass('is-invalid');
        $('#password2').addClass('is-invalid');
    }

    if (validirajRegistraciju()) {
        $('#registracija').removeClass('btn-secondary');
        $('#registracija').addClass('btn-success');
        //$('#registracija').prop('disabled', false);
    }
    else {
        $('#registracija').removeClass('btn-success');
        $('#registracija').addClass('btn-secondary');
        //$('#registracija').prop('disabled', true);
    }
})

$('#email').focusout(function () {
    $('#email').removeClass('is-valid');
    $('#email').removeClass('is-invalid');

    var regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

    var email = $('#email').val();

    if (regexEmail.test(email)) {
        $('#email').removeClass('is-invalid');
        $('#email').addClass('is-valid');
    }
    else {
        $('#invalidEmail').html('Niste uneli email pravilno');
        $('#email').removeClass('is-invalid');
        $('#email').addClass('is-invalid');
    }
    if (validirajRegistraciju()) {
        $('#registracija').removeClass('btn-secondary');
        $('#registracija').addClass('btn-success');
        //$('#registracija').prop('disabled', false);
    }
    else {
        $('#registracija').removeClass('btn-success');
        $('#registracija').addClass('btn-secondary');
        //$('#registracija').prop('disabled', true);
    }
})

$('#brojTel').focusout(function () {

    $('#brojTel').removeClass('is-valid');
    $('#brojTel').removeClass('is-invalid');

    var regexBrojTel = /^\d{8,10}$/;

    var brojTel = $('#brojTel').val();
    
    if (regexBrojTel.test(brojTel)) {
        $('#brojTel').removeClass('is-invalid');
        $('#brojTel').addClass('is-valid');
    }
    else {
        $('#invalidBrojTel').html('Niste uneli broj telefona pravilno');
        $('#brojTel').removeClass('is-invalid');
        $('#brojTel').addClass('is-invalid');
    }

    if (validirajRegistraciju()) {
        $('#registracija').removeClass('btn-secondary');
        $('#registracija').addClass('btn-success');
        //$('#registracija').prop('disabled', false);
    }
    else {
        $('#registracija').removeClass('btn-success');
        $('#registracija').addClass('btn-secondary');
        //$('#registracija').prop('disabled', true);
    }
})


$('#login').click(function () {
    location.href = '/login';
    return false;
})

function validirajRegistraciju() {
    var registrujBool = true;

    var username = $('#username').val();
    var password1 = $('#password1').val();
    var password2 = $('#password2').val();//pass2 zbog frontenda
    var email = $('#email').val();
    var brojTel = $('#brojTel').val();

    var regexUsername = /^[a-zA-Z0-9]+([a-zA-Z0-9](_|-| )[a-zA-Z0-9])*[a-zA-Z0-9]+$/;
    var regexPassword = /^[a-zA-Z0-9]+([a-zA-Z0-9](_|-| )[a-zA-Z0-9])*[a-zA-Z0-9]+$/;
    var regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    var regexBrojTel = /^\d{8,10}$/;


    if (!regexUsername.test(username)) {
        registrujBool = false;
    }
    if (!regexPassword.test(password1)) {
        registrujBool = false;
    }
    if (!regexPassword.test(password2)) {
        registrujBool = false;
    }
    if (password1 != password2) {
        registrujBool = false;

    }
    if (!regexEmail.test(email)) {
        registrujBool = false;
    }
    if (!regexBrojTel.test(brojTel)) {
        registrujBool = false;
    }
    
    return registrujBool;
}

$('#registracija').click(function () {

    var username = $('#username').val();
    var password1 = $('#password1').val();
    var password2 = $('#password2').val();//pass2 zbog frontenda
    var email = $('#email').val();
    var brojTel = $('#brojTel').val();



    if (validirajRegistraciju()) {

        $.ajax({
            url: '/proveriUsername',
            type: 'post',
            data: {
                username: username
            },
            success: function (data) {
                if (!data.postoji) {
                    $.ajax({
                        url: '/registracija',
                        type: 'post',
                        data: {
                            username: username,
                            password: password1,
                            email: email,
                            brojTel: brojTel
                        },
                        success: function (data) {
                            location.href = '/';
                        }
                    })
                }
                else{
                    $('#invalidUsername').html('Postoji korisnik sa username-om: ' + username);
                    $('#username').removeClass('is-invalid');
                    $('#username').addClass('is-invalid');
                    $('#username').val('');
                }
            }
        })




    }
    else {
        var regexUsername = /^[a-zA-Z0-9]+([a-zA-Z0-9](_|-| )[a-zA-Z0-9])*[a-zA-Z0-9]+$/;
        var regexPassword = /^[a-zA-Z0-9]+([a-zA-Z0-9](_|-| )[a-zA-Z0-9])*[a-zA-Z0-9]+$/;
        var regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        var regexBrojTel = /^\d{8,10}$/;

        $('#registracija').removeClass('btn-success');
        $('#registracija').addClass('btn-secondary');


        if (!regexUsername.test(username)) {

            $('#invalidUsername').html('Niste uneli username pravilno');
            $('#username').removeClass('is-invalid');
            $('#username').addClass('is-invalid');



        }
        if (!regexPassword.test(password1)) {
            $('#invalidPassword1').html('Niste uneli sifru pravilno');
            $('#password1').removeClass('is-invalid');
            $('#password1').addClass('is-invalid');
        }
        if (!regexPassword.test(password2)) {
            $('#invalidPassword2').html('Niste uneli sifru pravilno');
            $('#password2').removeClass('is-invalid');
            $('#password2').addClass('is-invalid');
        }
        if (password1 != password2) {
            $('#invalidPassword2').html('Lozinke se ne poklapaju');
            $('#password2').removeClass('is-invalid');
            $('#password2').addClass('is-invalid');

        }
        if (!regexEmail.test(email)) {
            $('#invalidEmail').html('Niste uneli email pravilno');
            $('#email').removeClass('is-invalid');
            $('#email').addClass('is-invalid');
        }
        if (!regexBrojTel.test(brojTel)) {
            $('#invalidBrojTel').html('Niste uneli broj telefona pravilno');
            $('#brojTel').removeClass('is-invalid');
            $('#brojTel').addClass('is-invalid');
        }
    }



    return false;

})