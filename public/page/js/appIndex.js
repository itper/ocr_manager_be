$(document).ready(function(){
    appInfo.appListAjax(0);
    appInfo.addApp();
});

//创建应用列表命名空间
if(typeof appInfo == "undefined"){
    var appInfo = {};
}

appInfo.addApp = function(){
    $(".addApp").on("click",function(){
        $(".add").css("display","block");
    });
}

appInfo.look = function(event){
    var appId = event.target.id;
    var html = event.target.innerHTML;
    console.log(appId + "   " + html);

    var url = "";
    if(html != "H5"){
        url = "appVersion.html?appId=" + appId;
    }
    else{
        url = "h5App.html?appId=" + appId;
    }
    window.location.href = url;
}

appInfo.addData = function(data){
    $(".appList").empty();
    // appInfo.appShowData = [];    
    for(var i = 0; i < data.data.length; i++){
        // appInfo.appShowData[i] = {};
        // appInfo.appShowData[i].id = data.data[i].appId;
        // appInfo.appShowData[i].name = data.data[i].appName;
        // appInfo.appShowData[i].version = data.data[i].appVersion;    

        var div = $("<div></div>");
        div.addClass("col-lg-3 col-sm-6");
        $(".appList").append(div);

        var section = $("<section></section>");
        section.addClass("panel");
        div.append(section);

        var divIcon = $("<div></div>").html(data.data[i].appName.substr(0,1));
        divIcon.addClass("symbol appIcon");
        divIcon.addClass("color" + i%7);
        divIcon.attr("id",data.data[i].appId);
        divIcon.attr("title",data.data[i].appName);
        divIcon.attr("appKey",data.data[i].appKey);
        divIcon.on("click",function(event){
            //设置sessionStorage存储app信息
            sessionStorage.appName = event.target.title;
            sessionStorage.appId = event.target.id;
            sessionStorage.appKey = $(event.target.outerHTML).attr("appKey");
            appInfo.look(event);
        });
        section.append(divIcon);

        var divName = $("<div></div>");
        divName.addClass("value appName");
        divName.attr("id",data.data[i].appId);
        divName.attr("title",data.data[i].appName);
        divName.attr("appKey",data.data[i].appKey);
        divName.on("click",function(event){
            //设置sessionStorage存储app信息
            sessionStorage.appName = event.target.title;
            sessionStorage.appId = event.target.id;
            sessionStorage.appKey = $(event.target.outerHTML).attr("appKey");
           
            appInfo.look(event);
        })
        section.append(divName);

        var h1 = $("<h1></h1>").html(data.data[i].appName);
        h1.attr("id",data.data[i].appId);
        h1.attr("title",data.data[i].appName);
        h1.attr("appKey",data.data[i].appKey);
        divName.append(h1);

        var p = $("<p></p>").html(data.data[i].appVersion);
        p.attr("id",data.data[i].appId);
        p.attr("title",data.data[i].appName);
        p.attr("appKey",data.data[i].appKey);
        divName.append(p);
    }
    // temporary = appInfo.appShowData; 
    
    // appInfo.hover();                //鼠标移如移出事件
}   

appInfo.hover = function(){
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

//保存app应用真实数据
appInfo.appData = [];

//app需要显示的数据
appInfo.appShowData = [];

//ajax请求app列表数据
appInfo.appListAjax = function(page){
    $.ajax({
        
        url:"http://spacegate.corp.ganji.com/app/userapp?token=123&page=" + page +"&pageSize=1000",
        type:"get",
        dataType:"json",
        success: function(data){
            appInfo.appData = data.data;    //保存请求的数据
            console.log(typeof data);
            console.log(data);

            appInfo.addData(data);
        },
        error: function(err){console.log(err)}
    });  
}

//sessionStorage数据结构
// sessionStorage = {
//     appId:
// }