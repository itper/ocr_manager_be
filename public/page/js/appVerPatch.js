$(document).ready(function(){
    patchInfo.init();
    patchInfo.getInfomation();
    patchInfo.patchListAjax(patchInfo.OfVerName,"ios",0);
    patchInfo.click();
    patchInfo.delete();
    patchInfo.gray();
});

//创建补丁patchInfo命名空间
if(typeof patchInfo == "undefined"){
    var patchInfo = {};
}
var parseUrl = function(url){
    var result = {};
    var value = {};
    url = url || window.location.href;
    var p = url.split('?')[1]||'';
    p = p.split('&');
    for(var k in p){
        k = p[k];
        if(!k)continue;
        var key = k.split('=');
        var v = key[1];
        key = key[0];
        value[key] = decodeURIComponent(v);
    }

    if(url.indexOf('http')!==0){
        url = 'http://'+url;
    }
    var host = url.split('/')[2];
    var port = host.split(':')[1]||(url.indexOf('http://')===0?80:443);
    return value;
};

//设置域名
patchInfo.domain = "http://spacegate.corp.ganji.com";

//最上层应用appId
patchInfo.appId = "";

//补丁页面所有补丁id数组
patchInfo.versionIdArr = [];

//补丁对应上层版本名称
patchInfo.OfVerName = "";

//补丁对应上层版本id
patchInfo.OfVerId = -1;

//保存补丁列表数据
patchInfo.patchData = {};

//显示补丁数据
patchInfo.patchShowData = {};

//初始化页面信息
patchInfo.init = function(){
    $("#appName").html(sessionStorage.appName);
    $("#versionName").html(sessionStorage.versionName);

    $(".versionName").html(sessionStorage.versionName);
    //点击app名称
    $("#appName").on("click",function(){
        window.location.href = "appVersion.html?appId=" + sessionStorage.appId;
    });
    $('#testData').on('click',function(){
        $("#List").empty();
        var onlineData = patchInfo.patchData.test;
        var dex = ['patchId','patchName', 'patchSize','patchHash','createdAt','updatedAt'];
        for(var obj in onlineData){
            var p = onlineData[obj];
            var tr = $("<tr></tr>");
            $("#List").append(tr);
            patchInfo.versionIdArr[obj] = p.patchId;
            var temp = p;
            for(var i in dex){
                var td = $("<td></td>").text(p[dex[i]]);
                tr.append(td);
            }
            tr.append('<td><a class="icon-download-alt" href="http://spacegate.corp.ganji.com/public/download/'+p.patchPath +'"></a></td>');
            var tdActive = $("<td></td>");
            var del = $("<input></input>");
            del.attr("name",p.patchId);
            del.attr("type","checkbox");
            del.addClass('ver-checkbox');
            del.on("change",function(event){
                patchInfo.delChange(event);
            });
            tdActive.append(del);
            tr.append(tdActive);
        }
        $('#gray-over-btn').show();
        $('.ver-checkbox').hide();
        $('#del').show();
        $('#gray-add-btn').hide();
        $('#gray-list-btn').hide();
        $('#update').show();
        var toGray = $('#toGray');
        toGray.data('gray',true);
        toGray.show();
        toGray.html('灰度上线');
        $('#update').data('v',true);
        $('#update').trigger('click');
    });
    $('#onlineData').on('click',function(){
        $("#List").empty();
        var onlineData = patchInfo.patchData.online.data.online;
        var dex = ['patchId','patchName', 'patchSize','patchHash','createdAt','updatedAt'];
        for(var obj in onlineData){
            var p = onlineData[obj];
            var tr = $("<tr></tr>");
            $("#List").append(tr);

            var temp = p;
            for(var i in dex){
                var td = $("<td></td>").text(p[dex[i]]);
                tr.append(td);
            }
            tr.append('<td><a class="icon-download-alt" href="https://spacegate.ganji.com/public/download/'+p.patchPath +'"></a></td>');
            tr.append('<td></td>')

        }
        $('#gray-over-btn').hide();
        $('#update').hide();
        $('.oper-col').hide();
        $('#gray-add-btn').hide();
        $('#gray-list-btn').hide();
        $('#toGray').hide();
        $('#del').hide();

    });
    $('#grayData').on('click',function () {
        $("#List").empty();
        var onlineData = patchInfo.patchData.online.data.gray;
        var dex = ['patchId','patchName', 'patchSize','patchHash','createdAt','updatedAt'];
        for(var obj in onlineData){
            var p = onlineData[obj];
            var tr = $("<tr></tr>");
            $("#List").append(tr);

            var temp = p;
            for(var i in dex){
                var td = $("<td></td>").text(p[dex[i]]);
                tr.append(td);
            }
            tr.append('<td><a class="icon-download-alt" href="https://spacegate.ganji.com/public/download/'+p.patchPath +'"></a></td>');            tr.append('<td></td>')


        }
        $('#gray-over-btn').hide();
        $('#update').hide();
        $('#del').hide();
        $('#gray-add-btn').show();
        $('#gray-list-btn').show();
        $('.oper-col').hide();
        $('#toGray').data('gray',false);
        $('#toGray').show();
        $('#toGray').html('上线');
    });
    $('#gray-append-btn').on('click',function () {
        $($('.gray-group')[0]).clone().insertBefore('#append-content');
    });
    var update = $('#update');
    $('#update').on('click',function(){
        if($(this).data('v')){
            $('#gray-over-btn').show();
            $('.ver-checkbox').hide();
            $('#del').hide();
            $('.oper-col').hide();
            $('#toGray').show();
            $(this).data('v',false);
            $(this).html('修改');
        }else{
            $('#gray-over-btn').hide();
            $('.ver-checkbox').show();
            $('#del').show();
            $('.oper-col').show();
            $('#toGray').hide();
            $(this).data('v',true);
            $(this).html('取消');
        }
    });
    $('.form-horizontal').on('click','.to-trash .btn',function (e) {
        e.preventDefault();
        $(this).parent().parent().remove();
    });
    $('#add-gray').on('click',function(){
        var list = $('.gray-group');
        var data = [];


        list.each(function(){
            var key = ($(this).find('select').val());
            var value = $(this).find('input').val();
            data.push({[key]:value,key:key});
        });
        $.ajax({
            url:patchInfo.domain+'/gray/add',
            data:{data:JSON.stringify(data),appKey:parseUrl().appKey,versionName:parseUrl().verName,appType:patchInfo.appType||1},
            type:'post',
            dataType:'json',
            success:function(data){
                if(data.code===1){
                    $('.close').trigger('click');
                }else{
                    alert(data.msg);
                }
            },
            error:function(error){

            }
        });
    });
    $('#gray-list-btn').on('click',function(){
        $.ajax({
            url:patchInfo.domain+'/gray/',
            data:{appKey:parseUrl().appKey,versionName:parseUrl().verName,appType:patchInfo.appType||1},
            type:'get',
            dataType:'json',
            success:function(data){
                var t = $('#gray-list-dialog tbody');
                t.empty();
                for(var g in data.data){
                    g = data.data[g];
                    var td = $('<td>'+g.grayUserId+'</td>'+'<td>'+g.grayInstallId+'</td>'+'<td>'+g.grayCityId+'</td>'+'<td>'+g.grayProduct+'</td>' +
                        '<td><button class="btn btn-danger btn-xs tash"><i class="icon-trash "></i></button></td>');
                    var tr = $('<tr></tr>').append(td);
                    t.append(tr);
                    tr.find('button').data('gray',g.grayId);
                }
            },
            error:function(e){

            }
        })
    });
    $('#gray-list-dialog').on('click','.tash',function(t){
        var target = $(t.currentTarget);
        $.ajax({
            url:patchInfo.domain+'/gray/delete',
            data:{appKey:parseUrl().appKey,versionName:parseUrl().verName,appType:patchInfo.appType||1,grayId:target.data('gray')},
            type:'get',
            dataType:'json',
            success:function(data){
                if(data.code===1){
                    target.parent().parent().remove();
                }else{

                }
            },
            error:function(e){

            }
        })
    });
    //点击添加灰度
    $(".gray").on("click",function(){
        $(".grayDiv").show();
    });

    //点击提交按钮
    $(".graySubmit").on("click",function(){
        $(".grayDiv").hide();
    });
    $('#toOnline').on('click',function(){
        var versionId = location.href.substring(location.href.indexOf('?')+1).split('&')[1];
        var r = confirm('确定灰度上线');
        if(!r){
            e.stopPropagation();
            e.preventDefault();
        }else{
            $.ajax({
                url: "http://spacegate.corp.ganji.com/version/toOnlineGray?"+versionId+'&patchType='+(patchInfo.appType!==2?'IOS':'Android'),
                type:'get',
                success:function(data){
                    alert(data);
                },
                error:function(){

                }
            })
        }
    });
    $('#toGray').on('click',function(){
        var versionId = location.href.substring(location.href.indexOf('?')+1).split('&')[1];
        var r = confirm('确定上线');
        var href = '';
        if($('#toGray').data('gray')){
            href = "http://spacegate.corp.ganji.com/version/toOnlineGray?gray=1&"+versionId+'&patchType='+(patchInfo.appType!==2?'IOS':'Android')
        }else{
            href = "http://spacegate.corp.ganji.com/version/toOnline?"+versionId+'&patchType='+(patchInfo.appType!==2?'IOS':'Android')
        }
        if(!r){

        }else{
            $('#to-gray-dialog').modal('show');
            $.ajax({
                url: href,
                type:'get',
                dataType:'json',
                success:function(data){
                    $('#to-gray-log').val(data);
                    $('#to-gray-log').empty();
                    var container = document.getElementById("to-gray-log");
                    var options = {};
                    var editor = new JSONEditor(container, options);
                    editor.set(data);
                    editor.expandAll();
                    $(patchInfo.appType!==2?'#ios':'#android').trigger('click');
                    if(data.data.log){
                        alert(data.data.log[data.data.log.length-1].code===1?'上线成功':'上线失败');
                    }else{
                        alert(data.data.code===1?'上线成功':'上线失败');
                    }
                },
                error:function(){

                }
            })
        }

    });
    $('#gray-over-btn').on('click',function(r){
        var versionId = location.href.substring(location.href.indexOf('?')+1).split('&')[1];
        var href = 'http://spacegate.corp.ganji.com/version/onlineGrayOver?'+versionId+'&patchType='+(patchInfo.appType!==2?'IOS':'Android');
        $.ajax({
            url:href,
            data:{},
            dataType:"json",
            type:'get',
            success:function(data){
                if(data.code===1){
                    alert('操作成功');
                    $(patchInfo.appType!==2?'#ios':'#android').trigger('click');
                }else{
                    alert(data.msg);
                }
            },
            error:function(data){

            }
        })
    });
};

//将UTC时间转换成标准时间
patchInfo.change = function(parameter){
    var time = parameter
    var year = time.substr(0,10);
    var year = time.substr(0,10);
    var hour = (parseInt(time.substr(11,2)) + 8)%24;
    var minute = time.substr(14,2);
    var second = time.substr(17,2);
    time = year + " " + hour + ":" + minute + ":" + second;
    return time;
}

//处理URL得到上层信息
patchInfo.getInfomation = function(){
    var url = window.location.search.substr(1).split("&");
    patchInfo.appKey = url[0].split("=")[1];
    patchInfo.OfVerId = url[1].split("=")[1];
    patchInfo.OfVerName = url[2].split("=")[1];
}

//添加灰度，包括点击“添加灰度”，点击提交按钮
patchInfo.gray = function(){

};

//点击ios/android
patchInfo.click = function(){
    $("#ios").on("click",function(){
        patchInfo.patchListAjax(patchInfo.OfVerName,"ios",0);
        patchInfo.appType = 1;
    });
    $("#android").on("click",function(){
        patchInfo.patchListAjax(patchInfo.OfVerName,"android",0);
        patchInfo.appType = 2;
    });
}

//动态添加数据
patchInfo.addData = function(data){
    var status = null;
    if(patchInfo.patchData.online.code===1){
        if(patchInfo.appType===2){
            status = patchInfo.patchData.online.data.version.versionAndroidStatus;
        }else{
            status = patchInfo.patchData.online.data.version.versionIOSStatus;
        }
    }
    if(status==='1'){
        status = '灰度中';
    }else if(status==='2'){
        status = '灰度结束';
    }else if(status==='3'){
        status = '已上线';
    }else{
        status = '';
    }
    $('.versionName').html(sessionStorage.versionName+(status===''?'':('('+status+')')));
    $('#testData').trigger('click');return;
    var temporary = {};
    //清除旧数据
    $("#List").empty();

    //配置数据
    patchInfo.patchShowData = [];
    for(var patch = 0; patch < data.data.test.length; patch++){
        patchInfo.patchShowData[patch] = {};
        patchInfo.patchShowData[patch].id = data.data.test[patch].patchId;
        patchInfo.versionIdArr[patch] = data.data.test[patch].patchId;
        patchInfo.patchShowData[patch].name = data.data.test[patch].patchName;
        patchInfo.patchShowData[patch].size = data.data.test[patch].patchSize;
        patchInfo.patchShowData[patch].createdAt = patchInfo.change(data.data.test[patch].createdAt);
        patchInfo.patchShowData[patch].updatedAt = patchInfo.change(data.data.test[patch].updatedAt);
    }
    temporary = patchInfo.patchShowData;
    var onlineData = data.data.online.data.online;
    var grayData = data.data.online.data.gray;
    var dex = ['patchId','patchName', 'patchSize','patchHash','createdAt','updatedAt'];
    $('#ListGray').empty();
    $('#ListOnline').empty();
    for(var obj in onlineData){
        var p = onlineData[obj];
        var tr = $("<tr></tr>");
        $("#ListOnline").append(tr);

        var temp = p;
        for(var i in dex){
            var td = $("<td></td>").text(p[dex[i]]);
            tr.append(td);
        }

    }
    for(var obj in grayData){
        var p = grayData[obj];
        var tr = $("<tr></tr>");
        $("#ListGray").append(tr);

        var temp = p;
        for(var i in dex){
            var td = $("<td></td>").text(p[dex[i]]);
            tr.append(td);
        }

    }
    //添加数据
    for(var obj in temporary){
        var tr = $("<tr></tr>");
        // newTbody.prepend(tr);    //向第一行添加
        $("#List").append(tr);        //向最后一行添加
        // console.log(temporary[obj].id)

        var temp = temporary[obj];
        for(var i in temp){
            var td = $("<td></td>").text(temp[i]);
            tr.append(td);
            // console.log(temp[i]);
        }

        var tdActive = $("<td></td>");

        var del = $("<input></input>");
        del.attr("name",p.id);
        del.attr("type","checkbox");
        // del.attr("checked","");
        del.on("change",function(event){
            patchInfo.delChange(event);
        });
        tdActive.append(del);

        tr.append(tdActive);
    }
}

//ajax请求补丁列表数据
patchInfo.patchListAjax = function(verName,os,page){
    // console.log("appId: " + verInfo.verOfappId);
    // console.log("versionid: " + verName);
    $.ajax({
        // dataType:"json"
        // url:patchInfo.domain + "/patch/" + 'h5' + "/" + 'a1073ac0-f66a-11e5-ba18-43351def6548' + "/" + '2.3.1' + "?token=123&page=" + page +"&pageSize=1000",
        url:patchInfo.domain + "/patch/" + os + "/" + patchInfo.appKey + "/" + verName + "?token=123&page=" + page +"&pageSize=1000",
        type:"get",
        dataType:"json",
        success: function(data){
            patchInfo.patchData = data.data;    //保存请求的数据
            // console.log("h5应用列表页面请求成功显示");
            console.log(data);
            // alert(data.data.online.data.version.versionIOSStatus+','+data.data.online.data.version.versionAndroidStatus+','+data.data.online.data.version.versionH5Status);
            //调用*******************
            patchInfo.addData(data);
            
        },
        error: function(err){console.log(err)}
    }); 
}

//应用版本显示页面系统导航切换点击
// patchInfo.switchOS = function(){
//     $(".navOS > li").on("click",function(){

//         $(".active").removeClass("active");
//         $(this).addClass("active");

//         var target = $(this).attr("id");
        
//         if(target == "iosPatchList"){
//             // common.addListData("versionList",verInfo.iosData);
//             patchInfo.patchListAjax(patchInfo.OfVerName,"ios",0);
//         }
//         else if(target == "androidPatchList"){
//             // $(".versionList tbody").remove();
//             patchInfo.patchListAjax(patchInfo.OfVerName,"android",0);
//             // common.addListData("versionList",verInfo.androidData);
//             // console.log(verInfo.androidData);
//         }
//     });
// }

//点击删除按钮删除选中的补丁，原理是重新添加除过选中的补丁
patchInfo.delete = function(){
    $("#del").on("click",function(){
        if($(this).attr('class').indexOf('gray')!==-1)return;
        var r=confirm("确定删除?");
        if(!r){
            return;
        }
        var data = {};
        data.versionids = patchInfo.OfVerId;
        data.applyType = 0;
        data.patchids = patchInfo.versionIdArr.toString();
        if(data.patchids == ""){
            data.patchids = 0;
        }
        var patchType = $(".navOS > .active > a").html();
        var iosAndroid = "";
        if(patchType == "android"){
            data.patchType = 3;
            iosAndroid = "android";
        }
        else{
            data.patchType = 2;
            iosAndroid = "ios";
        }
        console.log("点击保存");
        console.log(data);

        $.ajax({
            url:patchInfo.domain + "/patch/apply",
            data:data,
            type:"post",
            success:function(data){
                console.log("打补丁发送数据成功");
                patchInfo.patchListAjax(patchInfo.OfVerName,iosAndroid,0);
            },
            error:function(error){
                console.log(error);
            }
        });
    });
}

//补丁列表中checkbox改变事件
patchInfo.delChange = function(event){
    var patchId = event.target.name;
    patchId = parseInt(patchId);
    console.log("前：" + patchInfo.versionIdArr);
    if(event.target.checked){
        var index = $.inArray(patchId,patchInfo.versionIdArr);
        patchInfo.versionIdArr.splice(index,1);
    }   
    else{
        patchInfo.versionIdArr.push(patchId);
    }
    console.log("后：" + patchInfo.versionIdArr);
}