define(function(require,exports,module){
    var config = require('../global/config');
    require('../lib/common-post').init(function(){
        $('#update-user-dialog').modal('hide');
        location.reload();
    });
    var listEl = $('#list');
    initGlobalListener();
    var page = 0;
    var pageSize = 10;
    var type =1;
    //操作
    var optdel = '<button data-click="1" class="btn   btn-danger btn-xs tooltips" type="1" data-placement="top" data-toggle="tooltip" data-original-title="删除" '
        +'href="">'
        +'<i class="icon-trash "></i></button>';
    var optedit = '<button data-click="2"  class="btn btn-info btn-xs"  data-placement="top" data-toggle="tooltip" data-original-title="修改"'
        +'href="#update-user-dialog"'
        +'><i class="icon-edit "></i></button>';


    var optArray = [optdel,optedit];
    //显示的值
    var filterArray = {
        'name':null,
        'address':null,
        'desc':null,
        'type':null,
    };
    function optHandler(type,item){
        if(type===1){
            $('#delete-user-dialog').modal('show');
            $('#delete-user-dialog').find('.btn-success').on('click',function(){
                $.ajax({
                    url:config.baseUrl+'company/delete',
                    data:{id:item.id},
                    type:'get',
                    xhrFields: {
                        withCredentials: true
                    },
                    success:function(data){
                        if(data.code===0){
                            location.reload();
                        }
                    }
                })

            });
            return;
        }
        $('#update-user-dialog').modal('show');
        $('#name').val(item.name);
        $('#address').val(item.address);
        $('#desc').val(item.desc);
        $('#id').val(item.id);
        $('#type').val([item.type+'']);
    }
    var url = config.baseUrl+'company';
    function dataFilter(data){
        return data?(data.data?(data.data.list?data.data.list:[]):[]):[];
    }

    function initGlobalListener(){
        listEl.on('click','button[data-click]',function(target){
            target = $(target.currentTarget);
            var item = target.data('item');
            optHandler(target.data('click'),item);
        });
        $('#select-type').on('click','a',function(e){
            $('#select-type').find('a').removeClass('active');
            $(e.currentTarget).addClass('active');
            type = $(e.currentTarget).data('val');
            page = 0;
            fetch();
        });

        $('.pre-next-page').on('click',function(e){
            var target = $(e.currentTarget);
            var type = target.data('type');
            e.preventDefault();
            if(type===1){
                page-=1;
                if(page<0){
                    page=0;
                }
            }else{
                page+=1;
            }
            fetch();
        });
    }
        fetch();
    function fetch(){
        $.ajax({
            url:url,
            data:{page:page,pageSize:pageSize,type:type},
            type:'get',
            xhrFields: {
                withCredentials: true
            },
            success:function(data){
                render(dataFilter(data));
            }
        });
    }

    function render(list){
        $('#current-page').text(page+1);
        listEl.empty();
        for(var item in list){
            item = list[item];
            var tr = $('<tr></tr>');
            for(var key in filterArray){
                var td ;
                var value = filterArray[key]?filterArray[key](item[key]):item[key];
                td = $('<td>'+value+'</td>');
                tr.append(td);
            }
            var optel = $('<div></div>');
            for(var opt in optArray){
                opt = $(optArray[opt]);
                opt.data('item',item);
                optel.append(opt);
                optel.append(' ');
            }
            td = $('<td></td>');
            td.append(optel);
            tr.append(td);
            listEl.append(tr);
        }
    }
});