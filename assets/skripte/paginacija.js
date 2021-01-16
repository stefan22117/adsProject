
oformiPaginaciju();

function oformiPaginaciju(){
    $('.paginacija').ready(function () {
        var brojOglasa = 6;
    
        $('.levo').click(function () {
            var stariIndex = parseInt($('#trenutniIndex').html());
            if (stariIndex <= 1) {
                $('.levo').removeClass('btn-primary');
                $('.levo').addClass('btn-secondary');
                return false;
    
            }
            else {
                $('.levo').removeClass('btn-secondary');
                $('.levo').addClass('btn-primary');
                $('.desno').removeClass('btn-secondary');
                $('.desno').addClass('btn-primary');
    
                var noviIndex = stariIndex - 1;
                var nizOglasa = $('.oglasi').find('.oglas');
                var i = noviIndex * brojOglasa + 1 - brojOglasa;
                var j = i + brojOglasa;
                for (let oglas of nizOglasa) {
                    
                    if (i < j) {
                        $(oglas).removeClass('d-none');
                    }
                    else {
                        $(oglas).addClass('d-none');
                    }
                    i++;
                }
                $('#trenutniIndex').html(noviIndex)
            }
        })
    
        $('.desno').click(function () {
            var stariIndex = parseInt($('#trenutniIndex').html());
            var nizOglasa = $('.oglasi').find('.oglas');
    
            
            console.log('da',stariIndex>= nizOglasa.length / brojOglasa )
            if (nizOglasa.length<=brojOglasa || (stariIndex >= nizOglasa.length / brojOglasa && nizOglasa.length % brojOglasa==0)) {
                $('.desno').removeClass('btn-primary');
                $('.desno').addClass('btn-secondary');
                return false;
            }
            else {
                $('.levo').removeClass('btn-secondary');
                $('.levo').addClass('btn-primary');
    
                $('.desno').removeClass('btn-secondary');
                $('.desno').addClass('btn-primary');
                var noviIndex = stariIndex + 1;
                console.log(stariIndex, noviIndex)
                var i = noviIndex * brojOglasa + 1 - brojOglasa;
                var j = i + brojOglasa;
                console.log(i, j)
                for (let oglas of nizOglasa) {
                    
                    $(oglas).addClass('d-none');
    
                }
                for (i = i - 1; i < j - 1; i++) {
                    $(nizOglasa[i]).removeClass('d-none');
                }
                $('#trenutniIndex').html(noviIndex)
            }
    
            console.log($('.paginacija'))
    
        })
    })


}

   