/**
 * Created by chendi on 4/15/16.
 */

(function(){
    var username = null;
    var name = null;
    $(document).on('cookieUpdate',parse);
    $(document).ajaxSuccess(
        function(event, xhr, settings){


            var data = null;
            try{
                data = JSON.parse(xhr.responseText);
                if(data.code===2){
                    window.location.href='https://sso.corp.ganji.com/Account/LogOn?id=75&returnUrl=http://spacegate.corp.ganji.com';
                }else{
                    if(username===null){
                        window.setTimeout(parse,0);
                    }
                }
            }catch(r){

            }
        }
    );

    parse();
    function parse(){
        var cookie = document.cookie.split(';');
        for(var key in cookie){
            var value = cookie[key];
            var k = value.split('=')[0];
            var v =  decodeURIComponent(value.split('=')[1]);
            if(k===' username'){
                username = v;
            }
            if(k===' name'){
                name = v;
            }
        }
        $('#username').text(username);
        $('#logout').on('click',function(e){
            e.preventDefault();
            e.stopPropagation();
            window.location.href='http://spacegate.corp.ganji.com/user/logout';
        });
    }
})();