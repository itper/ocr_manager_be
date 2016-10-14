$(document).ready(function(){
    common.init();
    common.getAppId();
    verInfo.versionListAjax(common.ofAppId,0);
    verInfo.clickVersion();
    h5Info.clickH5();
    common.add();
})

if(typeof common == "undefined"){
    var common = {};
}

//对应的上层appId
common.ofAppId = -1;

//初始化页面信息
common.init = function(){
    $("#appName").html(sessionStorage.appName);
    $(".tableName").html(sessionStorage.appName);
    $(".appKey").html(sessionStorage.appKey);
}

//点击创建新版本或者创建新h5应用
common.add = function(){
    $(".add").on("click",function(event){
        var text = event.target.text;
        if(text == "创建新版本"){
            window.location.href = "addVersion.html?appId="  + common.ofAppId + "&flag=version";
        }
        else if(text = "创建新h5应用"){
            window.location.href = "addh5App.html?appId="  + common.ofAppId;
        }
    });
}

//点击查看删除补丁h5查看版本
common.look = function(type,event){
    var url = "";
    if(type == "versionList"){
        var id = event.target.id;
        var verName = event.target.name;
        url = "./appVerPatch.html?appKey=" + sessionStorage.appKey + "&versionId=" + id + "&verName=" + verName;
    }
    else if(type == "h5List"){
        var id = event.target.id;
        url = "./apph5Version.html?appId=" + id;
    }
    window.location.href = url;         
}

//处理url中的appId
common.getAppId = function(){
    var url = window.location.search.substr(1).split("&");
    console.log(url);
    common.ofAppId = url[0].split("=")[1];

    console.log(common.ofAppId);
}

//将UTC时间转换成标准时间
common.change = function(parameter){
    var time = parameter
    var year = time.substr(0,10);
    var hour = (parseInt(time.substr(11,2)) + 8)%24;
    var minute = time.substr(14,2);
    var second = time.substr(17,2);
    time = year + " " + hour + ":" + minute + ":" + second;
    return time;
}

//common android/ios打补丁方法
common.skipNewPatch = function(patchType,event){
    var url = "";
    var id = event.target.name;
    url = "addPatch.html?type="+ patchType + "&Id=" + id + "&appId=" + common.ofAppId;
    // console.log("appId:  " + verInfo.verOfappId);
    window.location.href = url;
}

//动态添加版本列表数据
common.addData = function(dataType,data){
    //清除旧的数据
    $("#List").empty();

    var temporary = {};
    if(dataType == "versionList"){
        verInfo.versionShowData = [];
        for(var j = 0; j < data.data.length; j++){
            verInfo.versionShowData[j] = {};
            verInfo.versionShowData[j].id = data.data[j].versionId;
            verInfo.versionShowData[j].name = data.data[j].versionName; 
            verInfo.versionShowData[j].createdAt = common.change(data.data[j].createdAt);
            verInfo.versionShowData[j].updatedAt = common.change(data.data[j].updatedAt);
            verInfo.versionShowData[j].versionStatus = data.data[j].versionStatus;
        }
        temporary = verInfo.versionShowData;
    }
    else if(dataType == "h5List"){
        h5Info.h5ShowData = [];
        for(var k = 0; k < data.data.length; k++){
            h5Info.h5ShowData[k] = {};
            h5Info.h5ShowData[k].appKey = data.data[k].appKey;
            h5Info.h5ShowData[k].id = data.data[k].appId;
            h5Info.h5ShowData[k].name = data.data[k].appName;
            h5Info.h5ShowData[k].newVersion = data.data[k].appVersion;  
            h5Info.h5ShowData[k].createdAt = common.change(data.data[k].createdAt);
            h5Info.h5ShowData[k].updatedAt = common.change(data.data[k].updatedAt);
        }
        temporary = h5Info.h5ShowData;
    }
    

    for(var obj in temporary){
        var tr = $("<tr></tr>");
        // newTbody.prepend(tr);    //向第一行添加
        $("#List").append(tr);        //向最后一行添加

        var temp = temporary[obj];
        for(var i in temp){
            if('appKey'===i){
                continue;
            }
            var td = $("<td></td>").text(temp[i]);
            tr.append(td);
        }
        var tdActive = $("<td></td>");  
        tr.append(tdActive);
        if(dataType == "versionList"){
            var aLook = $("<a></a>").text("补丁列表");
            aLook.addClass("pointer");
            aLook.attr("name",temporary[obj].name);
            aLook.attr("id",temporary[obj].id);
            aLook.on("click",function(event){
                //设置sessionStorage存储版本信息
                sessionStorage.versionId = event.target.id;
                sessionStorage.versionName = event.target.name;
                common.look(dataType,event);
            });

            var android = $("<a></a>").text("增加android补丁");
            android.addClass("pointer");
            android.attr("name",temporary[obj].id);
            android.on("click",function(event){
                //点击给Android打补丁
                common.skipNewPatch("androidPatch",event);
            });

            var ios = $("<a></a>").text("增加ios补丁");
            ios.addClass("pointer");
            ios.attr("name",temporary[obj].id);
            ios.on("click",function(event){
                //点击给iso打补丁
                common.skipNewPatch("iosPatch",event);
            });

            tdActive.append(aLook,"&nbsp;","/","&nbsp;",android,"&nbsp;","/","&nbsp;",ios);
        }
        else if(dataType == "h5List"){
            var aLook = $("<a></a>").text("查看");
            aLook.addClass("pointer");
            aLook.attr("id",temporary[obj].id);
            aLook.attr("name",temporary[obj].name);
            aLook.data('key',temporary[obj].appKey);
            aLook.on("click",function(event){
                //设置sessionStorage存储h5应用信息
                sessionStorage.h5AppName = event.target.name;
                sessionStorage.h5AppId = event.target.id;
                sessionStorage.h5AppKey = $(this).data('key');
                //h5应用列表中的查看*********************************************
                common.look(dataType,event);
            });
            var aChange = $("<a></a>").text("修改");
            aChange.addClass("pointer");
            aChange.attr("name",temporary[obj].id);
            aChange.on("click",function(){
                //点击app应用列表里的修改按钮********************************
            });
            tdActive.append(aLook,"&nbsp;","/","&nbsp;",aChange);
        }

        
    }
}

//创建版本列表命名空间
if(typeof verInfo == "undefined"){
    var verInfo = {};
}

//用于保存ajax请求的列表全部数据
verInfo.versionData = [];

//用于显示版本列表数据
verInfo.versionShowData = [];

//点击版本列表事件
verInfo.clickVersion = function(){
    $("#versionList").on("click",function(){
        verInfo.versionListAjax(common.ofAppId,0);
        $("#verThead").removeClass("none");
        $("#h5Thead").addClass("none");
        $("#List").empty();

        $(".add").html("创建新版本");
    });
}

//点击创建新版本按钮动态添加url
verInfo.addVersion = function(appId){
    $(".addVersion").on("click",function(){ 
        // $(this).attr("href","addNew.html?address=newVersionPage&appId=" + appId)
        console.log("点击创建新版本按钮动态添加url");
        var url = "addNew.html?address=newVersionPage&appId=" + appId;
        window.location.href = url;
        // console.log(url);
    })
}

//ajax请求具体app对应的版本列表数据
verInfo.versionListAjax = function(appId,page){
    // console.log(appId);
    $.ajax({
        url:"http://spacegate.corp.ganji.com/version/" + appId + "?token=123&page=" + page +"&pageSize=1000",
        type:"get",
        dataType:"json",
        success: function(data){
            verInfo.versionData = data.data;    //保存请求的数据
            console.log(data);
            
            //调用*******************
            common.addData("versionList",data);
            // console.log(data.data);
            // common.addListData("appList",data);
        },
        error: function(err){console.log(err)}
    });  
}

//创建H5应用页面命名空间
if(typeof h5Info == "undefined"){
    var h5Info = {};
}

//保存请求的h5应用列表
h5Info.h5Data = {};

//h5页面要显示的数据
h5Info.h5ShowData = {};

//点击h5应用事件
h5Info.clickH5 = function(){
    $("#h5List").on("click",function(){
        h5Info.H5ListAjax(common.ofAppId,0);
        $("#verThead").addClass("none");
        $("#h5Thead").removeClass("none");
        $("#List").empty();

        $(".add").html("创建新H5应用");
    });
}

//ajax请求h5应用列表数据
h5Info.H5ListAjax = function(appId,page){
    // console.log(appId);
    // console.log("h5应用列表页面开始请求");
    $.ajax({
        // dataType:"json"
        url:"http://spacegate.corp.ganji.com/app/" + appId + "/h5?token=123&page=" + page +"&pageSize=1000",
        type:"get",
        dataType:"json",
        success: function(data){
            h5Info.h5Data = data.data;  //保存请求的数据
            // console.log("h5应用列表页面请求成功显示");
            console.log(data);
            //调用*******************
            common.addData("h5List",data);
            
        },
        error: function(err){console.log(err)}
    });  
}

//点击创建新H5应用按钮动态添加url并跳转到创建h5页面
h5Info.addH5App = function(appId){
    $(".addH5App").on("click",function(){   
        // console.log(appId);
        // $(this).attr("href","addNew.html?address=newVersionPage&appId=" + appId)
        var url = "addNew.html?address=newH5Page&appId=" + appId;
        window.location.href = url;
        // console.log(url);
    })
}