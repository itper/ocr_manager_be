/**
 * Created by chendi on 4/15/16.
 */

define(function() {
    var username = null;
    var name = null;
    // $(document).on('cookieUpdate',parse);
    $(document).ajaxSuccess(
        function(event, xhr, settings){
            console.log('123');
            var data = null;
            try{
                data = JSON.parse(xhr.responseText);
                console.log(data);
                if(data.code===2){
                    if (window.frameElement && window.frameElement.tagName == "IFRAME") {
                        window.parent.location.href='http://manager.ocr.itper.xyz/ocr_manager_be/public/app/login.html#undefined';
                    }else{
                        window.location.href='http://manager.ocr.itper.xyz/ocr_manager_be/public/app/login.html#undefined';
                    }
                }else{
                    // console.log('已登录');
                }
            }catch(r){
                console.log(r);
            }
        }
    );
});