define(function(r,e){
    initnav();

    $('.btn-login').on('click',function(e){
        e.preventDefault();
        $.ajax({
            type:'post',
            url:'http://ocr.itper.xyz/user/login',
            data:{
                number:$('input')[0].value,
                pwd:$('input')[1].value
            },
            xhrFields: {
                withCredentials: true
            },
            success:function(data){
                window.location.href = 'http://manager.ocr.itper.xyz/ocr_manager_be/public/app/admin.html#user-user-list';
            }
        })
    })
});
var preWin;
function initnav(active){
    active = active || window.location.hash;
    var navs = $('a[data-toggle=nav]');
    var row = $('#main-content .row');
    $('#sidebar').on('click','a[data-toggle=nav]',function(e){
        navs.parent().removeClass('active');
        var target = $(e.target);
        if(preWin){
            preWin.active = false;
            if(preWin.pause)
                preWin.pause();
        }
        row.removeClass('show');
        row.addClass('hide');
        $(target.attr('href')).addClass('show');
        target.parent().addClass('active');
        preWin = loadPage(target);

    });
    var target = null;
    if(!active){
        target = $(navs[0]);
    }else{
        target = $('a[data-toggle=nav][href='+active+']');
    }
    {
        navs.parent().removeClass('active');
        row.removeClass('show');
        row.addClass('hide');
        $(target.attr('href')).addClass('show');
        target.parent().addClass('active');
        loadPage(target);
    }
    window.location.hash = active||target.attr('href');
    function loadPage(target){
        var frame = $(target.attr('href')+' iframe').get()[0];
        if(frame&&!frame.src){
            var url = target.attr('href').replace('#','').replace('-','/')+'.html';
            frame.src = url;
            $(frame).on('load',function(){
                var w = frame.contentWindow;
                w.active = true;
                    if(w.resume)
                        w.resume();
                if(w && w.init){
                    w.init();
                }
            });
        }else{
            if(!frame)return;
            var w = frame.contentWindow;
            w.active = true;
            if(w.resume)
                w.resume();
        }
        return frame.contentWindow;
    }
}