$(document).ready(function(){
    addNewApp.save();
});

//创建addNewApp命名空间
if(typeof addNewApp == "undefined"){
    var addNewApp = {};
}

//设置域名
addNewApp.domain = "http://spacegate.corp.ganji.com";

//点击创建app应用页面的保存按钮 
addNewApp.save = function(){
    $("#addAppBtnSave").on("click",function(){
        var data = {};
        data.appName = $("#formAppName").val();

        // var h5 = $("input[name=H5]").is(":checked");
        // var ios = $("input[name=ios]").is(":checked");
        // var android = $("input[name=android]").is(":checked");
        // console.log("h5: " + h5 + "  ios : " + ios + " android : " + android);
        // return "";
        
        data.supH5 = $("input[name=H5]").is(":checked") == true ?1:0;
        data.supIOS = $("input[name=ios]").is(":checked") == true ?1:0;
        data.supAndroid = $("input[name=android]").is(":checked") == true ?1:0;
        data.appDesc = $("textarea[name=appDesc]").val();
        data.isH5 = 0;
        if(data.appName == ""){
            alert("请输入App名称");
            return "";
        }
        if(data.appDesc == ""){
            alert("请输入应用描述");
            return "";
        }
        

        $.ajax({
            url:addNewApp.domain + "/app/add?token=123",
            type:"post",
            data:data,
            dataType:'json',
            success:function(data){
                if(data.code===1){
                    window.location.href = "./appIndex.html";
                }else{
                    alert(data.msg);
                }
            },
            error:function(error){console.log(error)}
            
        });

    });

    //点击取消按钮
    $("#cancel").on("click",function(){
        window.location.href = "./appIndex.html";
    });
}