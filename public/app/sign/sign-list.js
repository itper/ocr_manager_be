define(function(require,exports,module){
    var config = require('../global/config');
    var Sign = require('../sign/sign');
    require('../lib/common-post').init(function(){
        $('#update-user-dialog').modal('hide');
        location.reload();
    });
    var listEl = $('#list');
    initGlobalListener();
    var page = 0;
    var pageSize = 10;
    var ocr =1;
    //操作
    var optdel = '<button data-click="1" class="btn   btn-danger btn-xs tooltips" type="1" data-placement="top" data-toggle="tooltip" data-original-title="删除" '
        +'href="">'
        +'<i class="icon-trash "></i></button>';
    var optedit = '<button data-click="2"  class="btn btn-info btn-xs"  data-placement="top" data-toggle="tooltip" data-original-title="修改"'
        +'href="#update-user-dialog"'
        +'><i class="icon-edit "></i></button>';
    var optqrcode = '<button data-click="3"  class="btn btn-primary btn-xs"  data-placement="top" data-toggle="tooltip" data-original-title="签到二维码"'
        +'href="#update-user-dialog"'
        +'><i class="icon-qrcode "></i></button>';

    var optArray = [optdel];
    //显示的值
    var filterArray = {
        'name':function(value){
            return value;
        },
        'updatedAt':null,
        'number':function(value){
            return value;
        }
    };
    var select = $('header select');
    $.ajax({
        url:config.baseUrl+'/ocr',
        data:{page:0,pageSize:1000},
        type:'get',
        xhrFields: {
            withCredentials: true
        },
        success:function(data){
            select.empty();
            var option = '';
            for(var k in data.data.list){
                option+='<option data-id='+data.data.list[k].id+'>'+data.data.list[k].title+'</option>';
            }
            select.append(option);
            ocr = data.data.list[0].id;
            fetch();
        }
    });
    select.on('change',function(e){
        var o = $(e.currentTarget)[0].selectedIndex;
        o = select.find('option')[o];
        ocr = $(o).data('id');
        fetch();
    });

    function optHandler(type,item){
        if(type===1){
            $('#delete-user-dialog').modal('show');
            $('#delete-user-dialog').find('.btn-success').on('click',function(){
                $.ajax({
                    url:config.baseUrl+'sign/delete',
                    data:{ocr:5},
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
        $('#title').val(item.title);
        $('#id').val(item.id);
        $('#toDate').val(new Date(item.toDate*1000).toLocaleString().split(' ')[0]);
        $('#address').val(item.address);
        $('#content').val(item.content);
        $('#fromDate').val(new Date(item.fromDate*1000).toLocaleString().split(' ')[0]);
    }
    var url = config.baseUrl+'/sign';
    function dataFilter(data){
        // return data.data.list;
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
        $('#fromDate').datepicker({
            format:'yyyy/mm/dd'
        });
        $('#toDate').datepicker({
            format:'yyyy/mm/dd'
        });
    }
    function fetch(){
        $.ajax({
            url:url,
            data:{page:page,pageSize:pageSize,ocr:ocr},
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