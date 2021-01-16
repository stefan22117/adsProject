
$('#username').focusout(function () {
    $('#username').removeClass('is-valid');
    $('#username').removeClass('is-invalid');

    var regexUsername = /^[a-zA-Z0-9]+([a-zA-Z0-9](_|-| )[a-zA-Z0-9])*[a-zA-Z0-9]+$/;
    var regexPassword = /^[a-zA-Z0-9]+([a-zA-Z0-9](_|-| )[a-zA-Z0-9])*[a-zA-Z0-9]+$/;

    var username = $('#username').val();
    var password = $('#password').val();

    $('#login').removeClass('btn-success');
    $('#login').addClass('btn-secondary');
    if (regexUsername.test(username)) {
        $.ajax({
            url: '/proveriUsername',
            type: 'post',
            data: { username: username },
            success: function (data) {
                if (data.postoji) {
                    $('#username').removeClass('is-invalid');
                    $('#username').addClass('is-valid');
                    if (regexPassword.test(password)) {
                        $.ajax({
                            url: '/proveriPassword',
                            type: 'post',
                            data: {
                                username: username,
                                password: password
                            },
                            success: function (data) {
                                if (data.postoji) {
                                    $('#password').removeClass('is-invalid');
                                    $('#password').addClass('is-valid');

                                    $('#login').removeClass('btn-secondary');
                                    $('#login').addClass('btn-success');
                                }
                            }
                        })
                    }

                }
                else {
                    $('#invalidUsername').html('Ne postoji korisnik sa username-om: ' + username);
                    $('#username').removeClass('is-valid');
                    $('#username').addClass('is-invalid');
                    $('#username').val('');
                }
            }
        })

    }
    else {
        $('#invalidUsername').html('Niste uneli username pravilno');
        $('#username').removeClass('is-valid');
        $('#username').addClass('is-invalid');
        $('#username').val('');
    }
})




$('#password').focusout(function () {
    $('#password').removeClass('is-valid');
    $('#password').removeClass('is-invalid');

    var regexUsername = /^[a-zA-Z0-9]+([a-zA-Z0-9](_|-| )[a-zA-Z0-9])*[a-zA-Z0-9]+$/;
    var regexPassword = /^[a-zA-Z0-9]+([a-zA-Z0-9](_|-| )[a-zA-Z0-9])*[a-zA-Z0-9]+$/;

    var username = $('#username').val();
    var password = $('#password').val();

    $('#login').removeClass('btn-success');
    $('#login').addClass('btn-secondary');


    if (regexPassword.test(password)) {
        $.ajax({
            url: '/proveriPassword',
            type: 'post',
            data: {
                username: username,
                password: password
            },
            success: function (data) {
                if (data.postoji) {
                    $('#password').removeClass('is-invalid');
                    $('#password').addClass('is-valid');

                    $('#login').removeClass('btn-secondary');
                    $('#login').addClass('btn-success');
                }
                else {
                    $('#invalidPassword').html('Pogresna lozinka');
                    $('#password').removeClass('is-valid');
                    $('#password').addClass('is-invalid');
                    $('#password').val('');
                }
            }
        })
    }
    else {
        $('#invalidPassword').html('Niste uneli sifru pravilno');
        $('#password').removeClass('is-valid');
        $('#password').addClass('is-invalid');
        $('#password').val('');
    }

})



function validirajLogin() {
    var loginBool = true;

    var username = $('#username').val();
    var password = $('#password').val();

    var regexUsername = /^[a-zA-Z0-9]+([a-zA-Z0-9](_|-| )[a-zA-Z0-9])*[a-zA-Z0-9]+$/;
    var regexPassword = /^[a-zA-Z0-9]+([a-zA-Z0-9](_|-| )[a-zA-Z0-9])*[a-zA-Z0-9]+$/;


    if (!regexUsername.test(username)) {
        loginBool = false;
    }
    if (!regexPassword.test(password)) {
        loginBool = false;
    }
    return loginBool;
}


$('#registracija').click(function () {
    location.href = '/registracija';
    return false;
})
$('#login').click(function () {
    var username = $('#username').val();
    var password = $('#password').val();


    if (validirajLogin()) {

        $.ajax({
            url: '/proveriUsername',
            type: 'post',
            data: {
                username: username
            },
            success: function (data) {
                if (data.postoji) {
                    $.ajax({
                        url: '/proveriPassword',
                        type: 'post',
                        data: {
                            username: username,
                            password: password
                        },
                        success: function (data) {

                            if (data.postoji) {
                                console.log('da')
                                $.ajax({
                                    url:'/login',
                                    type:'post',
                                    data:{
                                        username: username,
                                        password: password
                                    },
                                    success: function(data){
                                        location.href = '/';
                                    }
                                })
                            }
                            else {
                                $('#invalidPassword').html('Pogresna lozinka');
                                $('#password').removeClass('is-valid');
                                $('#password').addClass('is-invalid');
                                $('#password').val('');
                            }


                        }
                    })
                }
                else {
                    $('#invalidUsername').html('Niste uneli username pravilno');
                    $('#username').removeClass('is-valid');
                    $('#username').addClass('is-invalid');
                    $('#username').val('');
                }
            }
        })



    }
    else {

        var regexUsername = /^[a-zA-Z0-9]+([a-zA-Z0-9](_|-| )[a-zA-Z0-9])*[a-zA-Z0-9]+$/;
        var regexPassword = /^[a-zA-Z0-9]+([a-zA-Z0-9](_|-| )[a-zA-Z0-9])*[a-zA-Z0-9]+$/;

        $('#login').removeClass('btn-success');
        $('#login').addClass('btn-secondary');

        if (!regexUsername.test(username)) {
            $('#invalidUsername').html('Niste uneli username pravilno');
            $('#username').removeClass('is-valid');
            $('#username').addClass('is-invalid');
            $('#username').val('');
        }
        if (!regexUsername.test(username)) {
            $('#invalidPassword').html('Niste uneli sifru pravilno');
            $('#password').removeClass('is-valid');
            $('#password').addClass('is-invalid');
            $('#password').val('');
        }

        return false;
    }

    return false;
})