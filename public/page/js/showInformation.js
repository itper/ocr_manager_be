$(document).ready(function(){
	appInfo.appListAjax(0);
	common.selectPage();

	// app列表页
	appInfo.hiddenCatalogue();		//隐藏目录
	appInfo.showCatalogue();		//显示目录
	
	
	// common.addListData("appList",appInfo.appData);	//添加app列表数据

	// appInfo.lookVersion();			//查看版本

	// 版本页
	// verInfo.switchOS();				//切换系统
	
	// verInfo.clickH5();

	//h5应用列表页
	// h5Info.lookH5AppVersion();		//查看h5应用版本列表

	//补丁页面
	patchInfo.save();
	
});

//创建公共命名空间
if(typeof common == "undefined"){
	var common = {};
}

common.showPageSize = 100;

//选择显示页面
common.selectPage =function(){

		//处理url去除其中的参数
    	var url = window.location.search.substr(1);
    	var parameter = url.split("&");
    	var page = parameter[0].split("=")[1];

    	


        // var page = window.location.search.substr(1).split("=")[1];
        // console.log(page);
        $(".showList > *").hide();
        $(".page").show();
        // $(".H5VersionPage").show();
        // return ;
         // $(".appPage").show();
        if(page == "appPage" || page == undefined){
            //显示app列表页面
            $(".appPage").show();
        }
        else if(page == "versionPage"){
        	// common.addListData("versionList",verInfo.iosData);
        	verInfo.verOfappId = parameter[1] != undefined ?  parameter[1].split("=")[1] : null;
        	//ajax请求后台appId对应的版本列表
        	verInfo.addVersion(verInfo.verOfappId);			//注册创建新版本点击事件，但并不执行
        	verInfo.versionListAjax(verInfo.verOfappId,0);
        	//显示版本列表页面
            $(".versionPage").show();

        }
        else if(page == "H5AppPage"){
        	h5Info.h5OfAppId = parameter[1] != undefined ?  parameter[1].split("=")[1] : null;
        	// common.addListData("H5List",h5Info.h5Data);
        	//ajax请求h5列表数据
        	h5Info.addH5App(h5Info.h5OfAppId);		//注册创建新H5应用点击事件，但不执行

        	h5Info.H5ListAjax(h5Info.h5OfAppId,0);
        	//显示h5列表页面
        	$(".H5AppPage").show();
        }
        else if(page == "H5VersionPage"){
        	h5VersionInfo.h5VerOfh5App = parameter[1] != undefined ? parameter[1].split("=")[1] : null;
        	console.log("创建取消");
        	console.log(h5VersionInfo.h5VerOfh5App);
        	h5VersionInfo.addH5Version(h5VersionInfo.h5VerOfh5App);//注册创建h5新版本点击事件，暂不执行
        	h5VersionInfo.addH5Patch();								//注册打补丁点击事件
        	h5VersionInfo.H5VerListAjax(h5VersionInfo.h5VerOfh5App,0)
        	$(".H5VersionPage").show();
        }

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

//动态添加列表数据
common.addListData = function(dataType,data){
	// console.log(data.data.appId);
	console.log(data);
	// console.log(dataType);
	var temporary = {};

	//处理接收数据成为显示数据
	if(dataType == "appList"){
		appInfo.appShowData = [];
		for(var i = 0; i < data.data.length; i++){
			appInfo.appShowData[i] = {};
			appInfo.appShowData[i].id = data.data[i].appId;
			appInfo.appShowData[i].name = data.data[i].appName;
			appInfo.appShowData[i].version = data.data[i].appVersion;		
		}
			temporary = appInfo.appShowData;
	}
	else if(dataType == "versionList"){
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
	else if(dataType == "H5List"){
		h5Info.h5ShowData = [];
		for(var k = 0; k < data.data.length; k++){
			h5Info.h5ShowData[k] = {};
			h5Info.h5ShowData[k].id = data.data[k].appId;
			h5Info.h5ShowData[k].name = data.data[k].appName;
			h5Info.h5ShowData[k].newVersion = data.data[k].appVersion;	
			h5Info.h5ShowData[k].createdAt = common.change(data.data[k].createdAt);
			h5Info.h5ShowData[k].updatedAt = common.change(data.data[k].updatedAt);
		}
		temporary = h5Info.h5ShowData;
	}
	else if(dataType == "H5VersionList"){
		h5VersionInfo.h5VerShowData = [];
		for(var h5v = 0; h5v < data.data.length; h5v++){
			h5VersionInfo.h5VerShowData[h5v] = {};
			h5VersionInfo.h5VerShowData[h5v].id = data.data[h5v].versionId;
			h5VersionInfo.h5VerShowData[h5v].name = data.data[h5v].versionName;	
			h5VersionInfo.h5VerShowData[h5v].createdAt = common.change(data.data[h5v].createdAt);
			h5VersionInfo.h5VerShowData[h5v].updatedAt = common.change(data.data[h5v].updatedAt);
			h5VersionInfo.h5VerShowData[h5v].versionStatus = data.data[h5v].versionStatus;
		}
		temporary = h5VersionInfo.h5VerShowData;
	}
	else if(dataType == "patchList"){
		patchInfo.patchShowData = [];
		for(var patch = 0; patch < data.data.length; patch++){
			patchInfo.patchShowData[patch] = {};
			console.log("查看请求数据");
			console.log(data.data);
			patchInfo.patchShowData[patch].id = data.data[patch].patchId;
			patchInfo.versionIdArr[patch] = data.data[patch].patchId;
			patchInfo.patchShowData[patch].name = data.data[patch].patchName;	
			patchInfo.patchShowData[patch].size = data.data[patch].patchSize;
			patchInfo.patchShowData[patch].createdAt = common.change(data.data[patch].createdAt);
			patchInfo.patchShowData[patch].updatedAt = common.change(data.data[patch].updatedAt);
		}
		temporary = patchInfo.patchShowData;
	}
	

	$("." + dataType + " tbody").remove();

	var newTbody = $("<tbody></tbody>");
	$("." + dataType).append(newTbody);


	
	

	for(var obj in temporary){
		var tr = $("<tr></tr>");
		// newTbody.prepend(tr);	//向第一行添加
		newTbody.append(tr);		//向最后一行添加
		// console.log(temporary[obj].id)

		var temp = temporary[obj];
		for(var i in temp){
			var td = $("<td></td>").text(temp[i]);
			tr.append(td);
			// console.log(temp[i]);
		}

		var tdActive = $("<td></td>");
		//应用列表
		if(dataType == "appList"){
			// console.log("appList");
			var aLook = $("<a></a>").text("查看");
			aLook.attr("name",temporary[obj].id);
			aLook.attr("appName",temporary[obj].name);
			// console.log(dataType);
			aLook.on("click",function(event){
				common.look(dataType,event);
			});
			
			var aChange = $("<a></a>").text("修改");
			aChange.attr("name",temporary[obj].id);
			aChange.on("click",function(){
				//点击app应用列表里的修改按钮********************************
			});
			var H5App = $("<a></a>").text("H5应用"); 
			// console.log(temporary[obj].id);
			H5App.attr("name",temporary[obj].id);
			H5App.on("click",function(){
				common.look(dataType,event);
			});
			tdActive.append(aLook,"&nbsp;","/","&nbsp;",aChange,"&nbsp;","/","&nbsp;",H5App);
		}
		//版本列表
		else if(dataType == "versionList"){
			var aLook = $("<a></a>").text("删除补丁");
			aLook.attr("name",temporary[obj].name);
			aLook.attr("id",temporary[obj].id);
			aLook.on("click",function(event){
				// console.log("版本列表中点击查看方法");
				common.look(dataType,event);
			});

			var android = $("<a></a>").text("增加android补丁");
			android.attr("name",temporary[obj].id);
			android.on("click",function(event){
				//点击给Android打补丁
				common.skipNewPatch("androidPatch",event);
			});

			var ios = $("<a></a>").text("增加ios补丁");
			ios.attr("name",temporary[obj].id);
			ios.on("click",function(event){
				//点击给iso打补丁
				common.skipNewPatch("iosPatch",event);
			});

			tdActive.append(aLook,"&nbsp;","/","&nbsp;",android,"&nbsp;","/","&nbsp;",ios);
		}
		//H5应用列表页面
		else if(dataType == "H5List"){
			var aLook = $("<a></a>").text("查看");
			aLook.attr("name",temporary[obj].id);
			aLook.on("click",function(event){
				//h5应用列表中的查看*********************************************
				common.look(dataType,event);
			});
			var aChange = $("<a></a>").text("修改");
			aChange.attr("name",temporary[obj].id);
			aChange.on("click",function(){
				//点击app应用列表里的修改按钮********************************
			});
			tdActive.append(aLook,"&nbsp;","/","&nbsp;",aChange);
		}
		//补丁列表页面
		else if(dataType == "patchList"){
			var del = $("<input></input>");
			del.attr("name",temporary[obj].id);
			del.attr("type","checkbox");
			// del.attr("checked","");
			del.on("change",function(event){
				patchInfo.delChange(event);
			});
			tdActive.append(del);
		}

		tr.append(tdActive);
	}
}

//common点击查看方法
common.look = function(dataType,event){

	
	
	if(dataType == "appList"){
		if(event.target.text != "H5应用"){
			verInfo.verOfappId = event.target.id;
			verInfo.addVersion(verInfo.verOfappId);			//注册创建新版本点击事件，但并不执行
			// common.addListData("versionList",verInfo.iosData);
			//请求appId对应的版本列表数据并显示
			verInfo.versionListAjax(verInfo.verOfappId,0);
			
			//添加分层目录******************************************
			var appL = $("<a></a>").text("app列表");
			appL.on("click",function(){
				appInfo.appListAjax(0);
				$(".versionPage").hide();
				$(".appPage").show();
			});
			var appVer = $("<label></label>").text($(event.target).attr("appName"));
			$("#versionCata > span").remove();
			var verSpan = $("<span></span>");
			verSpan.append(appL,"&nbsp;>&nbsp;",appVer);
			$("#versionCata").append(verSpan);

			$(".appPage").hide();
			$(".versionPage").show();
		}
		else if(event.target.text == "H5"){
			h5Info.h5OfAppId = event.target.name;
			h5Info.addH5App(h5Info.h5OfAppId);		//注册创建新H5应用点击事件，但不执行
			h5Info.H5ListAjax(h5Info.h5OfAppId,0);	//ajax请求h5应用列表
			$(".appPage").hide();
			$(".H5AppPage").show();
		}
		

	}
	else if(dataType == "versionList"){
		//版本列表中点击查看方法****************************************
		patchInfo.OfVerName = event.target.name;
		patchInfo.OfVerId = event.target.id;
		patchInfo.patchListAjax(patchInfo.OfVerName,"ios",0);
		patchInfo.switchOS();		//注册ios/Android切换按钮点击事件

		//添加分层目录
		var appA = $("<a></a>").text("app列表");
		appA.on("click",function(){
			appInfo.appListAjax(0);
			$(".patchPage").hide();
			$(".appPage").show();
		});
		var verA = $("<a></a>").text($("#versionCata > span > label").html());
		verA.attr("appName",$("#versionCata > span > label").html());
		verA.attr("name",verInfo.verOfappId);
		// console.log(verInfo.verOfappId);
		verA.on("click",function(event){
			common.look("appList",event);
			$(".patchPage").hide();
			$(".versionPage").show();
		});
		var patchL = $("<label></label>").text(event.target.name)
		$("#patchCata > span").remove();
		var patchSpan = $("<span></span>");
		$("#patchCata").append(patchSpan);
		patchSpan.append(appA,"&nbsp;>&nbsp;",verA,"&nbsp;>&nbsp;",patchL);

		$(".versionPage").hide();
		$(".patchPage").show();

	}
	else if(dataType == "H5List"){
		// console.log(event.target.name);
		h5VersionInfo.h5VerOfh5App = event.target.name;
		console.log(h5VersionInfo.h5VerOfh5App);
		h5VersionInfo.addH5Version(h5VersionInfo.h5VerOfh5App);//注册创建h5新版本点击事件，暂不执行
		// h5VersionInfo.addH5Patch();								//注册打补丁点击事件
		h5VersionInfo.H5VerListAjax(h5VersionInfo.h5VerOfh5App,0);	//ajax请求h5应用列表
		$(".H5AppPage").hide();
		$(".H5VersionPage").show();
	}
	// else if(dataType == "H5VersionList"){
	// 	//h5应用列表中点击查看方法***************************************
	// }
}

//common android/ios打补丁方法
common.skipNewPatch = function(patchType,event){
	var url = "";
	var id = event.target.name;
	url = "./addNew.html?type="+ patchType + "&Id=" + id + "&appId=" + verInfo.verOfappId;
	// console.log("appId:  " + verInfo.verOfappId);
	window.location.href = url;
}

//创建应用列表命名空间
if(typeof appInfo == "undefined"){
	var appInfo = {};
}

appInfo.addData = function(data){
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
			common.look("appList",event);
		});
		section.append(divIcon);

		var divName = $("<div></div>");
		divName.addClass("value appName");
		divName.attr("id",data.data[i].appId);
		divName.on("click",function(event){
			common.look("appList",event);
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
	
	appInfo.hover();				//鼠标移如移出事件
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
  		// 	$(this).css("width","")
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
        		
        	// 	// console.log("可以显示了");
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

//点击隐藏按钮隐藏目录
appInfo.hiddenCatalogue = function(){
	// console.log("hidden");
	$(".hiddenCata").on("click",function(){
		$(".hiddenCata").addClass("hiddenH");
		// $(".aside").animate({
		// 	width:"0px"
		// },function(){
		// 	$("#showAside").removeClass("hiddenH");
		// });
		$(".aside").hide(1000,function(){
			$("#showAside").removeClass("hiddenH");
		});
	});
}

//点击显示按钮显示目录
appInfo.showCatalogue = function(){
	// console.log("showFunction");
	$("#showAside").on("click",function(){
		// console.log("click show");
		$("#showAside").addClass("hiddenH");
		// $(".aside").animate({
		// 	width:"25%"
		// },function(){
		// 	$(".hiddenCata").removeClass("hiddenH");
		// });

		$(".aside").show(1000,function(){
			$(".hiddenCata").removeClass("hiddenH");
		});
		
	});
}

//保存app应用真实数据
appInfo.appData = [];

//app需要显示的数据
appInfo.appShowData = [];

//ajax请求app列表数据
appInfo.appListAjax = function(page){
	$.ajax({
		
		url:"http://spacegate.corp.ganji.com/app?token=123&page=" + page +"&pageSize=" + common.showPageSize,
		type:"get",
		dataType:"json",
		success: function(data){
			appInfo.appData = data.data;	//保存请求的数据
			console.log(typeof data);
			console.log(data);

			appInfo.addData(data);
		},
		error: function(err){console.log(err)}
	});  
}



//创建版本列表命名空间
if(typeof verInfo == "undefined"){
	var verInfo = {};
}

//版本列表对应的appId
verInfo.verOfappId = -1;

//用于保存ajax请求的列表全部数据
verInfo.versionData = [];

//用于显示版本列表数据
verInfo.versionShowData = [];

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
		url:"http://spacegate.corp.ganji.com/version/" + appId + "?token=123&page=" + page +"&pageSize=" + common.showPageSize,
		type:"get",
		dataType:"json",
		success: function(data){
			verInfo.versionData = data.data;	//保存请求的数据
			
			
			//调用*******************
			common.addListData("versionList",data);
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

//h5列表对应的appid
h5Info.h5OfAppId = -1;

//保存请求的h5应用列表
h5Info.h5Data = {};

//h5页面要显示的数据
h5Info.h5ShowData = {};

//点击具体应用下的查看跳转h5应用版本列表页面
// h5Info.lookH5AppVersion = function(){
// 	// console.log("miaoqiang");
// 	$("#miaoqiang").on("click",function(){
// 		console.log("lookH5AppVersion");
// 		$(".H5AppPage").hide();
// 		$(".H5VersionPage").show();
// 		common.addListData("H5VersionList",h5VersionInfo.data);
// 	});
// }

h5Info.H5ListAjax = function(appId,page){
	// console.log(appId);
	// console.log("h5应用列表页面开始请求");
	$.ajax({
		// dataType:"json"
		url:"http://spacegate.corp.ganji.com/app/" + appId + "/h5?token=123&page=" + page +"&pageSize=" + common.showPageSize,
		type:"get",
		dataType:"json",
		success: function(data){
			h5Info.h5Data = data.data;	//保存请求的数据
			// console.log("h5应用列表页面请求成功显示");
			// console.log(data);
			//调用*******************
			common.addListData("H5List",data);
			
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

//保存h5版本列表数据
h5VersionInfo.h5VerData = {};

//显示h5版本列表数据
h5VersionInfo.h5VerShowData = {};

//点击h5版本页面添加按钮
h5VersionInfo.addH5Version = function(H5Id){
	$(".addH5Ver").on("click",function(){	
		// $(this).attr("href","addNew.html?address=newVersionPage&appId=" + appId)
		var url = "addNew.html?address=newH5VerPage&appId=" + H5Id;
		window.location.href = url;
		// console.log(url);
	})
}

//点击h5版本列表页面打补丁按钮
// h5VersionInfo.addH5Patch = function(){
// 	$(".addH5AppPatch").on("click",function(){
// 		// console.log("点击打补丁");
// 		var url = "./addNew.html?type=h5Patch&Id=" + 
// 		h5VersionInfo.h5VerOfh5App + "&versionName=" + h5VersionInfo.h5NewVersionName + 
// 		"&versionId=" + h5VersionInfo.h5NewVersionId;
// 		window.location.href = url;
// 	})
// }

//ajax请求h5版本数据
h5VersionInfo.H5VerListAjax = function(h5OfAppId,page){
	$.ajax({
		// dataType:"json"
		url:"http://spacegate.corp.ganji.com/version/" + h5OfAppId + "?token=123&page=" + page +"&pageSize=" + common.showPageSize,
		type:"get",
		dataType:"json",
		success: function(data){
			h5VersionInfo.h5VerData = data.data;	//保存请求的数据
			// console.log("h5应用列表页面请求成功显示");
			// console.log(data);
			//调用*******************
			common.addListData("H5VersionList",data);
			
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




//h5版本页面测试数据
h5VersionInfo.data = [
	
	{
		"order" : "1",
		"version" : "1.1",
		"commitVersion" : "123adsfa",
		"update" : "完全替换",
		"state" : "打包"
	}
]

//创建补丁patchInfo命名空间
if(typeof patchInfo == "undefined"){
	var patchInfo = {};
}

//补丁页面所有补丁id数组
patchInfo.versionIdArr = [];

//补丁对应上层版本名称
patchInfo.OfVerName = -1;

//补丁对应上层版本id
patchInfo.OfVerId = -1;

//保存补丁列表数据
patchInfo.patchData = {};

//显示补丁数据
patchInfo.patchShowData = {};

//ajax请求补丁列表数据
patchInfo.patchListAjax = function(verName,os,page){
	// console.log("appId: " + verInfo.verOfappId);
	// console.log("versionid: " + verName);
	$.ajax({
		// dataType:"json"
		url:"http://spacegate.corp.ganji.com/patch/" + os + "/" + verInfo.verOfappId + "/" + verName + "?token=123&page=" + page +"&pageSize=" + common.showPageSize,
		type:"get",
		dataType:"json",
		success: function(data){
			patchInfo.patchData = data.data;	//保存请求的数据
			// console.log("h5应用列表页面请求成功显示");
			// console.log(data);
			//调用*******************
			common.addListData("patchList",data);
			
		},
		error: function(err){console.log(err)}
	}); 
}

//应用版本显示页面系统导航切换点击
patchInfo.switchOS = function(){
	$(".navOS > li").on("click",function(){

		$(".active").removeClass("active");
		$(this).addClass("active");

		var target = $(this).attr("id");
		
		if(target == "iosPatchList"){
			// common.addListData("versionList",verInfo.iosData);
			patchInfo.patchListAjax(patchInfo.OfVerName,"ios",0);
		}
		else if(target == "androidPatchList"){
			// $(".versionList tbody").remove();
			patchInfo.patchListAjax(patchInfo.OfVerName,"android",0);
			// common.addListData("versionList",verInfo.androidData);
			// console.log(verInfo.androidData);
		}
	});
}

//点击保存按钮保存选中的补丁
patchInfo.save = function(){
	$("#delete").on("click",function(){
		var data = {};
		data.versionids = patchInfo.OfVerId;
		data.applyType = 0;
		data.patchids = patchInfo.versionIdArr.toString();
		var patchType = $(".navOS > .active > a").html();
		var iosAndroid = "";
		if(patchType == "Android"){
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
			url:"http://spacegate.corp.ganji.com/patch/applyc",
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

//应用列表数据结构
/*{
    "code": 1,
    "data": [
        {
            "appId": 2,
            "appName": "咨询",
            "appDesc": "咨询",
            "appSupAndroid": false,
            "appSupIOS": false,
            "appSupH5": false,
            "appHostApp": 1,
            "appVersion": "3.3.3",
            "createdAt": "2016-03-03T04:47:30.000Z",
            "updatedAt": "2016-03-04T03:50:17.000Z"
        }
    ],
    "msg": "success"
}*/

/*窗口大小 发生变化
info.windowResize = function(){
	window.onresize = function(){
		// console.log(typeof document.documentElement.clientWidth);
		// console.log(document.documentElement.clientWidth + 10000000);
		if(document.documentElement.clientWidth < 700){
			$(".aside").animate({
				width:"0px"
			});
			console.log("小于700");
		}
		else{
			$(".aside").animate({
				width:"25%"
			});
			console.log("700")
		}
	}
}*/


