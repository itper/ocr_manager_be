$(document).ready(function(){
    addPatch.getParameters();
    addPatch.click(addPatch.type);
});

//创建打补丁页面命名空间
if(typeof addPatch == "undefined"){
    var addPatch = {};
}
//设置域名
addPatch.domain = "http://spacegate.corp.ganji.com";

//android/ios打补丁时对应上层appId
addPatch.appId = -1;

//补丁对应的类型
addPatch.type = "";

//补丁对应的版本id
addPatch.versionId = "";

//上传h5补丁时最新版本号
addPatch.versionName = "";

//获得url中的各个参数
addPatch.getParameters = function(){
    var url = window.location.search.substr(1).split("&");
    var type = url[0].split("=")[1];
    if(type == "h5Patch"){
        addPatch.appId = url[1].split("=")[1];
        addPatch.versionName = url[2].split("=")[1];
        addPatch.versionId = url[3].split("=")[1];
        addPatch.type = 1;
        $(".h5Hide").hide();
        $("input[name=patchAppVersion]").val(addPatch.versionName);
        $("input[name=patchAppId]").val(addPatch.appId);
    }
    else{
        addPatch.versionId = url[1].split("=")[1];
        addPatch.appId = url[2].split("=")[1];
    }

    if(type == "androidPatch"){
        addPatch.type = 3;
        $("#patchHead").html("增加Android补丁");
    }
    else if(type == "iosPatch"){
        addPatch.type = 2;
        $("#patchHead").html("增加Ios补丁");
    }
    $("input[name=patchType]").val(addPatch.type);
    
}

//跳转页面方法
addPatch.skip = function(type){
    console.log("type:" + type);
    console.log("appId" + addPatch.appId);
    console.log("versionId：" + addPatch.versionId);
    if(type == 1){
        console.log("h5更新包取消" + type);
        window.location.href = "apph5Version.html?appId=" + addPatch.appId;
    }
    else{
        window.location.href = "appVersion.html?appId=" + addPatch.appId;
    }
    
}

addPatch.click = function(type){
    //补丁文件上传
    console.log("type:" + type);
    console.log("appId" + addPatch.appId);
    console.log("versionId：" + addPatch.versionId);
    var data = {};


    $("#file").on("change",function(){
        var patch = {};
        patch.patchName = $("#patchName").val();
        patch.patchDesc = $("#patchDesc").val();
        patch.patchType = $("input[name=patchType]").val();
    });
    window.addEventListener('message',function (r) {
        if(tag!=1)return;
        var url = window.location.search.substr(1);
        var pra = url.split("&");
        // var appid = pra[3].split("=")[1];
        // var versionName = pra[4].split("=")[1];
        var data = {};
        data.versionids = addPatch.versionId;		//版本id
        data.applyType = $("#applyType").val();		//追加或覆盖
        data.patchType = addPatch.type;		//对什么打补丁，ios/android/h5
        data.patchids = JSON.parse(r.data).data.patchId;                         //补丁id

        //通过code是否为1判断补丁是否上传成功

        if(JSON.parse(r.data).code == "1"){
            $.ajax({
               url:"http://spacegate.corp.ganji.com/patch/apply",
                // url:location.origin+"/patch/apply",
                //
                data:data,
                type:"post",
                success:function(data){
                    console.log("打补丁发送数据成功");

                    //打补丁成功，发送成功信号给父窗口
                    console.log("开始发送");
                    //history.replaceState('','','/page');
                    if(type == 1){
                       // window.location.href = ;
                       // $('#addPatchForm').empty();
                        $('#to-update').trigger('click');
                        $.ajax({
                            url:"http://spacegate.corp.ganji.com:9012/"+ sessionStorage.h5AppKey +"/" + addPatch.versionName,
                            type:'get',
                            success:function(data){
                                $('#to-update-log').html(data);
                            },
                            error:function(e){
                                
                            }
                        })
                    }
                    else{
                        addPatch.skip(type);
                    }
                },
                error:function(error){
                    console.log(error);
                } 
            });
        }
        else{
        }

        console.log(r);
    });
    //点击保存按钮
    $("#addPatchBtnSave").on("click",function(){
        tag = 1;
        $("#addPatchForm").submit();
        return;
        // if(addPatch.versionId == null){
        //     // console.log("非h5页面");
        //     data.versionids = common.parentId;
        // }
        // else{
        //     // console.log("h5页面");
        //     data.versionids = common.versionId;
        // }
        // data.versionids = addPatch.versionId;
        // data.applyType = $("#applyType").val();     //追加，覆盖
        // // data.patchids = $("#patchIframe").html();
        // data.patchType = type;

        //创建新的iframe处理打补丁操作
        exec_obj = document.createElement('iframe');
        exec_obj.name = 'tmp_frame';
        exec_obj.src = addPatch.domain + "/exe.html?versionids=" + addPatch.versionId + "&applyType=" + $("#applyType").val() + "&patchType=" + addPatch.type + "&H5appId=none&versionName=none";

        exec_obj.style.display = 'none';
        document.body.appendChild(exec_obj);

        //接收子窗口返回的成功信号、处理后续操作
        window.addEventListener('message',function(e){
            var sign = e.data;
            console.log(sign);
            if(sign == "success"){
                if(type == 1){
                    //window.location.href = "http://spacegate.corp.ganji.com:9012/"+ sessionStorage.h5AppKey +"/" + addPatch.versionName;

                }
                else{
                    addPatch.skip(type);
                }
            }
            else if(sign == "error"){
                alert("文件上传失败，请重新上传！");
            }


        },false);
    });

    //点击取消按钮
    $("#cancel").on("click",function(){
        addPatch.skip(type);
    });
}