define(function(require,exports,module){
    require('../../page/js/jquery.qrcode.min');
    require('../../page/js/socket.io');
    var config = require('../global/config');
    var socket = io('http://ocr.itper.xyz');
    socket.on('connect',function(){
        console.log('connect');
    });

    var ocrId;
    var active = false;
    exports.pause = function(){
        active = false;
    };
    exports.resume = function(ocr){
        ocrId = ocr;
        active = true;
        autoRefresh();
    };
    var t = 0;
    var interval = 20;

    socket.on('sign-valid',function(data){
        if(data.code===currentCode){
            $('#qrcode').empty();
            $('#qrcode-container h3').text('已验证(姓名:'+data.user.name+',学号:'+data.user.number+')');
            setTimeout(function(){
                $('#qrcode-container h3').text('');
            },3000);
            t=0;
        }
    });
    var currentCode;
    if(active)
    autoRefresh();
    function autoRefresh(){
        function next(){
            if(!active){
                return;
            }
            $('#qrcode-container h6').text(t+'s'+'后自动刷新');
            t--;
            if(t===-1){
                $('#qrcode-container h6').text('刷新中.');
                refresh();
            }else{
                setTimeout(next,1000);
            }
        }
        function refresh(){
            $.ajax({
                url:config.baseUrl+'user/createcode',
                data:{ocr:ocrId},
                type:'get',
                xhrFields: {
                    withCredentials: true
                },
                success:function(data){
                    if(data.code===0){
                        $('#qrcode').empty();
                        $('#qrcode').qrcode({width:300,height:300,text:data.data.code.code});
                        currentCode = data.data.code.code;
                        console.log(data.data.code.code);
                        t=interval;
                        next();
                    }
                }
            });
        }
        refresh();
    }
});