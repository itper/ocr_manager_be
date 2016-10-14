$(document).ready(function(){
    h5VersionInfo.init();
    h5VersionInfo.getAppId();
    h5VersionInfo.H5VerListAjax(h5VersionInfo.h5VerOfh5App,0);
    h5VersionInfo.addH5Version(h5VersionInfo.h5VerOfh5App);
});

//创建h5应用版本页面命名空间
if(typeof h5VersionInfo == "undefined"){
    var h5VersionInfo = {};
}

//h5版本对应的h5应用id
h5VersionInfo.h5VerOfh5App = -1;

//h5版本列表中最新版本号
h5VersionInfo.h5NewVersionName = -1;

//h5版本列表中最新版本id
h5VersionInfo.h5NewVersionId = -1;

h5VersionInfo.dataKey = [ 'versionId','versionName','createdAt','updatedAt','versionH5Status'];
h5VersionInfo.onlineData = null;
h5VersionInfo.testData = null;
//保存h5版本列表数据
h5VersionInfo.h5VerData = {};

//显示h5版本列表数据
h5VersionInfo.h5VerShowData = {};



h5VersionInfo.render = function(data){
    if(data && data.code===1){
        var onlineData = data.data.data;
        onlineData.forEach(function (r) {
            console.log(r);
            var tr = $('<tr></tr>');
            $('#List').append(tr);
            for(var key in h5VersionInfo.dataKey){
                var k = h5VersionInfo.dataKey[key];
                var td = $('<td></td>');
                td.html(r[k]);
                tr.append(td);
            }
        });
    }else{

    }
}
//初始化页面信息
h5VersionInfo.init = function(){
    $("#appName").html(sessionStorage.appName);
    $("#h5AppName").html(sessionStorage.h5AppName);
    $('#h5-app-name').html(sessionStorage.h5AppName);
    $('#h5-app-key').html(sessionStorage.h5AppKey);
    //点击appName
    $("#appName").on("click",function(){
        window.location.href = "appVersion.html?appId=" + sessionStorage.appId;
    });


    $('#toOnline').on('click',function () {
        // window.location.href=;
        $.ajax({
            url: "http://spacegate.corp.ganji.com/version/h5ToOnline?versionId="+h5VersionInfo.h5NewVersionId,
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
                alert(data.data.log[data.data.log.length-1].code===1?'上线成功':'上线失败');
            },
            error:function(){

            }
        })
    });
    $('#testData').on('click',function(){
        if($(this).hasClass('active'))h5VersionInfo.h5VerData=null;
        $('#toOnline').show();
        $('#addH5Ver').show();
        if(h5VersionInfo.h5VerData){
            h5VersionInfo.addData(h5VersionInfo.h5VerData);
            return;
        }
        h5VersionInfo.H5VerListAjax(h5VersionInfo.h5VerOfh5App,0);
    });
    $('#onlineData').on('click',function () {
        if($(this).hasClass('active'))h5VersionInfo.onlineData=null;
        $('#toOnline').hide();
        $('#addH5Ver').hide();
        $('#List').empty();
        if(h5VersionInfo.onlineData){
            h5VersionInfo.render(h5VersionInfo.onlineData);
            return;
        }
        $.ajax({
            url:'http://spacegate.corp.ganji.com/version/online/'+sessionStorage.h5AppKey,
            type:'get',
            dataType:'json',
            success:function(data){
                h5VersionInfo.onlineData = data;
                h5VersionInfo.render(data);
            }
        });
    });
};

//处理url得到appId
h5VersionInfo.getAppId = function(){
    var url = window.location.search.substr(1).split("&");
    h5VersionInfo.h5VerOfh5App = url[0].split("=")[1];
}

//将UTC时间转换成标准时间
h5VersionInfo.change = function(parameter){
    var time = parameter
    var year = time.substr(0,10);
    var hour = (parseInt(time.substr(11,2)) + 8)%24;
    var minute = time.substr(14,2);
    var second = time.substr(17,2);
    time = year + " " + hour + ":" + minute + ":" + second;
    return time;
}

//

//动态添加数据
h5VersionInfo.addData = function(data){
    //清除旧数据
    $("#List").empty();
    var temporary  = {};
    h5VersionInfo.h5VerShowData = [];
    for(var h5v = 0; h5v < data.data.length; h5v++){
        h5VersionInfo.h5VerShowData[h5v] = {patch:data.data[h5v].versionH5PatchIds};
        h5VersionInfo.h5VerShowData[h5v].id = data.data[h5v].versionId;
        h5VersionInfo.h5VerShowData[h5v].name = data.data[h5v].versionName; 
        h5VersionInfo.h5VerShowData[h5v].createdAt = h5VersionInfo.change(data.data[h5v].createdAt);
        h5VersionInfo.h5VerShowData[h5v].updatedAt = h5VersionInfo.change(data.data[h5v].updatedAt);
        h5VersionInfo.h5VerShowData[h5v].versionStatus = data.data[h5v].versionStatus;
    }
    temporary = h5VersionInfo.h5VerShowData;

    for(var obj in temporary){
        var tr = $("<tr></tr>");
        $("#List").append(tr);        //向最后一行添加
        var temp = temporary[obj];
        for(var i in temp){
            if('patch'===i)continue;
            var td = $("<td></td>").text(temp[i]);
            tr.append(td);
        }
        tr.append('<td><a class=" icon-download-alt" href="http://spacegate.corp.ganji.com/public/download/'+temp.patch+'"></a></td>')
    }
}

//点击h5版本页面添加按钮
h5VersionInfo.addH5Version = function(H5Id){
    $("#addH5Ver").on("click",function(){   
        // $(this).attr("href","addNew.html?address=newVersionPage&appId=" + appId)
        var url = "addVersion.html?appId=" + H5Id + "&address=H5";
        window.location.href = url;
        // console.log(url);
    })
}

//点击h5版本列表页面打补丁按钮
// h5VersionInfo.addH5Patch = function(){
//  $(".addH5AppPatch").on("click",function(){
//      // console.log("点击打补丁");
//      var url = "./addNew.html?type=h5Patch&Id=" + 
//      h5VersionInfo.h5VerOfh5App + "&versionName=" + h5VersionInfo.h5NewVersionName + 
//      "&versionId=" + h5VersionInfo.h5NewVersionId;
//      window.location.href = url;
//  })
// }

//ajax请求h5版本数据
h5VersionInfo.H5VerListAjax = function(h5OfAppId,page){
    $.ajax({
        // dataType:"json"
        url:"http://spacegate.corp.ganji.com/version/" + h5OfAppId + "?token=123&page=" + page +"&pageSize=1000",
        type:"get",
        dataType:"json",
        success: function(data){
            h5VersionInfo.h5VerData = data;    //保存请求的数据
            // console.log("h5应用列表页面请求成功显示");
            console.log(data);
            //调用*******************
            h5VersionInfo.addData(data);
            
        },
        error: function(err){console.log(err)}
    }); 

    //ajax请求h5应用下的最新版本号和最先版本id
    $.ajax({
        url:"http://spacegate.corp.ganji.com/version/last/" + h5VersionInfo.h5VerOfh5App,
        type:"get",
        dataType:"json",
        success:function(data){
            console.log("请求最新版本号");
            console.log(data);
            if(data.data != null){
                h5VersionInfo.h5NewVersionName = data.data.versionName;
                h5VersionInfo.h5NewVersionId = data.data.versionId;
            }
            
        },
        error:function(err){
            console.log(err);
        }
    });
}