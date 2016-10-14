define(function(r,e){
    initnav();
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