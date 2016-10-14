$(document).ready(function(){
    addVer.getAppId();
    addVer.click(addVer.Flag);
});

//创建添加版本页面命名空间
if(typeof addVer == "undefined"){
    var addVer = {};
}

//版本对应上层appId
addVer.appId = "";

//标志创建最上层应用版本还会h5应用版本
addVer.verFlag = "";

//设置域名
addVer.domain = "http://spacegate.corp.ganji.com";

addVer.getAppId = function(){
    var url = window.location.search.substr(1).split("&");
    addVer.appId = url[0].split("=")[1];
    addVer.Flag = url[1].split("=")[1];
    console.log(url);
    console.log(addVer.appId);
    console.log(addVer.Flag);
}

//控制页面跳转url和配置参数
addVer.skip = function(page){
    if(page == "version"){
        window.location.href = "appVersion.html?appId=" + addVer.appId;
    }
    else if(page == "H5"){
        window.location.href = "apph5Version.html?appId=" + addVer.appId;
    }
}

//点击创建版本页面按钮点击事件
addVer.click = function(page){
    //点击保存按钮
    $("#addVerAppBtnSave").on("click",function(){
        var dataReq = {};
        dataReq.versionName = $("input[name=versionName]").val();
        dataReq.versionDesc = $("textarea[name=versionDesc]").val();
        dataReq.versionAppId = addVer.appId;  
        
        if(dataReq.versionName == ""){
            alert("请输入版本名称");
            return "";
        }     
        else{
            var reg = /[0-9]{0,}\.[0-9]{0,}\.[0-9]{0,}/;
            if(!reg.test(dataReq.versionName)){
                alert("版本号格式不正确，格式：x.x.x");
                return "";
            }
        }
        if(dataReq.versionDesc == ""){
            alert("请输入版本描述");
            return "";
        }

        //ajax异步发送数据
        $.ajax({
            url:addVer.domain + "/version/add?token=123",
            type:"post",
            data:dataReq,
            dataType:"json",
            success:function(data){
                console.log(page);
                console.log(data);
                // alert("数据发送成功");
                //版本已存在提示
                if(data.code == 0){
                    alert(data.msg);
                }
             
                // window.location.href = "showInformation.html?address=versionPage";
                else if(page == "H5"){
                    var id = (data.data)[1].versionId;
                    var url = "addPatch.html?type=h5Patch&Id=" + 
                    addVer.appId + "&versionName=" + dataReq.versionName + 
                    "&versionId=" + id;
                    console.log(url);
                    window.location.href = url;
                }
                else{
                    addVer.skip(page);     
                }
               
            },
            error:function(data){console.log(data)}
            
        });
    });

    //点击取消按钮返回版本列表页
    $("#cancel").on("click",function(){
        addVer.skip(page);
    });
}
