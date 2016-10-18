define(function(r,e){
    initnav();

    $('.btn-login').on('click',function(e){
        e.preventDefault();
        $.ajax({
            type:'post',
            url:'http://ocr.itper.xyz/user/login',
            data:{
                username:$('input')[0].value,
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

function initnav(active){
    active = active || window.location.hash;
    var navs = $('a[data-toggle=nav]');
    var row = $('#main-content .row');
    $('#sidebar').on('click','a[data-toggle=nav]',function(e){
        navs.parent().removeClass('active');
        var target = $(e.target);
        row.removeClass('show');
        row.addClass('hide');
        $(target.attr('href')).addClass('show');
        target.parent().addClass('active');
    });
    var target = null;
    if(!active){
        target = $(navs[0]);
    }else{
        target = $('a[data-toggle=nav][href='+active+']');
    }
    target.trigger('click');
    window.location.hash = active||target.attr('href');
}