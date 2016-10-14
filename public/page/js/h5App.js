$(document).ready(function(){
    h5Info.H5ListAjax(h5Info.getAppId(),0);
});

//创建H5应用页面命名空间
if(typeof h5Info == "undefined"){
    var h5Info = {};
}

//h5列表对应的appid
h5Info.h5OfAppId = -1;

//保存请求的h5应用列表
h5Info.h5Data = {};

//h5页面要显示的数据
h5Info.h5ShowData = {};

h5Info.addData = function(data){
    $(".row").empty();
    // appInfo.appShowData = [];    
    for(var i = 0; i < data.data.length; i++){
        // appInfo.appShowData[i] = {};
        // appInfo.appShowData[i].id = data.data[i].appId;
        // appInfo.appShowData[i].name = data.data[i].appName;
        // appInfo.appShowData[i].version = data.data[i].appVersion;    

        var div = $("<div></div>");
        div.addClass("col-lg-3 col-sm-6");
        $(".row").append(div);

        var section = $("<section></section>");
        section.addClass("panel");
        div.append(section);

        var divIcon = $("<div></div>").html(data.data[i].appName.substr(0,1));
        divIcon.addClass("symbol appIcon");
        divIcon.addClass("color" + i%7);
        divIcon.attr("id",data.data[i].appId);
        divIcon.on("click",function(){
            console.log("click h5");
            appInfo.look(event);
        });
        section.append(divIcon);

        var divName = $("<div></div>");
        divName.addClass("value appName");
        divName.attr("id",data.data[i].appId);
        divName.on("click",function(event){
            appInfo.look(event);
        })
        section.append(divName);

        var h1 = $("<h1></h1>").html(data.data[i].appName);
        h1.attr("id",data.data[i].appId);
        divName.append(h1);

        var p = $("<p></p>").html(data.data[i].appVersion);
        p.attr("id",data.data[i].appId);
        divName.append(p);
    }
    // temporary = appInfo.appShowData; 
    
    // h5Info.hover();                //鼠标移如移出事件
}

//处理URL中的appId 
h5Info.getAppId = function(){
    var url = window.location.search.substr(1);
    var appId = url.split("&")[0].split("=")[1];
    
    return appId;
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
            // console.log(data);
            //调用*******************
            h5Info.addData(data);
            
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

h5Info.hover = function(){
    var html = "";
    var oldWidth = "";
    $(".appIcon").on("mouseenter",function(){
        oldWidth = $(".appIcon").css("width");
        html = $(this).html();
        $(this).next().hide();
        $(this).html("H5");
        $(this).animate({
            width: "100%",
            borderRadius: "4px"
        },"swing");

        // $(this).next().hide();
        // $(this).html("H5");
        // var big = setInterval(function(){
        //  $(this).css("width","")
        // },10)

    }).on("mouseleave",function(){
        $(this).html(html);
        $(this).animate({
            width: "40%",
            borderTopRightRadius: "0",
            borderBottomRightRadius: "0"
        },function(){
            $(this).next().show();
            // console.log(oldWidth);
            // var width = $(this).css("width");
            // if(width == oldWidth){
                
            //  // console.log("可以显示了");
            // }
        });
    });



    // $(".appName").on("mouseenter",function(){
    //     console.log("移入");
    //     $(this).css("borderRadius","4px");
    //     $(this).prev().animate({
    //         width:"0%",
    //     });
    // }).on("mouseleave",function(){
    //     console.log("移出");
    //     $(this).css("borderRadius","0 4px 4px 0");
    //     $(this).prev().animate({
    //         width: "40%"
    //     });
    // });
}

//点击具体应用下的查看跳转h5应用版本列表页面
// h5Info.lookH5AppVersion = function(){
//  // console.log("miaoqiang");
//  $("#miaoqiang").on("click",function(){
//      console.log("lookH5AppVersion");
//      $(".H5AppPage").hide();
//      $(".H5VersionPage").show();
//      common.addListData("H5VersionList",h5VersionInfo.data);
//  });
// }