$(document).ready(function(){
    addH5.getAppId();
    addH5.click();
});

//创建新新增H5页面命名空间
if(typeof addH5 == "undefined"){
    var addH5 = {};
}

//设置域名
addH5.domain = "http://spacegate.corp.ganji.com";

//对应上层appId
addH5.appId = "";

//获取url中的appId
addH5.getAppId = function(){
    var url = window.location.search.substr(1).split("&");
    addH5.appId = url[0].split("=")[1];
    console.log(addH5.appId);
}

//控制页面跳转url和配置参数
addH5.skip = function(){
    window.location.href = "appVersion.html?appId=" + addH5.appId;
}

//新增H5页面的点击事件
addH5.click = function(){
    //点击保存按钮
    $("#addVerAppBtnSave").on("click",function(){
        var data = {};
        data.appName = $("input[name=H5appName]").val();
        // console.log(data.appName);
        data.appDesc = $("textarea[name=H5appDesc]").val();
        data.isH5 = 1;
        data.appHostApp = addH5.appId;   
        
        if(data.appName == ""){
            alert("请输入App名称");
            return "";
        }     
        if(data.appDesc == ""){
            alert("请输入应用简介");
            return "";
        }

        //ajax异步发送数据
        $.ajax({
            url:addH5.domain + "/app/add?token=123",
            type:"post",
            data:data,
            success:function(){
                // alert("数据发送成功");
                console.log(data);
               // window.location.href = "showInformation.html?address=versionPage";
               addH5.skip();
            },
            error:function(error){console.log(error)}
            
        });
    });

    //点击取消按钮返回版本列表页
    $("#cancel").on("click",function(){
        addH5.skip();
    });
}