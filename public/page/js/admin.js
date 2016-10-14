(function(){
    var cache = {};
    var host = 'http://spacegate.corp.ganji.com';
    var api = {
        addUser:host+'/user/add',
        deleteUser:host+'/user/delete',
        userList:host+'/user',
        userapp:host+'/app/userapp',
        addAppUser:host+'/app/adduser',
        appuser:host+'/app/appuser',
        deleteAppUser:host+'/app/deleteAppUser'
    };
    var userkey = ['username','userEmail','userType'];
    var appKey = ['appName','appKey'];
    var $userList = $('#user-list tbody');
    var $userAppList = $('#app-list tbody');
    function initNav(active){
        active = active || window.location.hash;
        var navs = $('a[data-toggle=nav]');
        var row = $('#main-content .row');
        $('#sidebar').on('click','a[data-toggle=nav]',function(e){
            navs.parent().removeClass('active');
            var target = $(e.target);
            row.removeClass('show');
            row.addClass('hide');
            $(target.attr('href')).addClass('show');
            target.parent().addClass('active');
        });
        var target = null;
        if(!active){
            target = $(navs[0]);
        }else{
            target = $('a[data-toggle=nav][href='+active+']');
        }
        target.trigger('click');
        window.location.hash = active||target.attr('href');
    }

    function initAddUserUI(){
        $('#add-user-btn').on('click',function(t){
            t.preventDefault();
            t.stopPropagation();
            var emailDom = $('#cemail');
            var username = $('#uname').val();
            var email = emailDom.val();
            $.ajax({
                url:api.addUser,
                data:{userEmail:email,username:username,userType:$('[name=optionsRadios]:checked').val()==='option1'?'1':'2'},
                type:'post',
                dataType:'json',
                success:function(data){
                    if(data.code===1){
                        window.location.hash = '#user-list';
                        window.location.reload();
                    }else{
                        alert(data.msg);
                    }
                },
                error:function(e){
                    alert(e);
                }
            })
        });
    }
    function initUserListUI(){
        $('#user-list').on('click','button',function(t){
            var $data = $($(t.currentTarget).parent().parent());
            var user = $data.data('user');
            var r = confirm('删除'+user.username);
            if(r){
                deleteUser(user.userId);
            }
        });
        if(cache.userList){
        }else{
            loadUser();
        }
    }
    function initUserAppUI(){
        $('#app-list').on('click','button',function(t){
            $('#add-user-dialog').data('appKey',$(t.currentTarget).parent().data('appKey'));
            $('#add-user-dialog').data('appHostsKey',$(t.currentTarget).parent().data('appHostKey'));
            $('#user-dialog').data('appKey',$(t.currentTarget).parent().data('appKey'));
            $('#user-dialog').data('appHostsKey',$(t.currentTarget).parent().data('appHostKey'));
            if($(t.currentTarget).attr('type')==='1'){
                $('#add-user-dialog').modal('show');
            }else{
                $('#user-dialog').modal('show');
                appUser($(t.currentTarget).parent().data('appKey'),function(error,data){
                    if(error){

                    }else{
                        refreshAppUser(data);
                    }
                });
            }
        });

        $('#user-dialog').on('click','.oper-td button',function(e){
            var appKey = $('#user-dialog').data('appKey');
            var currentTarget =$(e.currentTarget);
            deleteAppUser(appKey,$(e.currentTarget).parent().parent().data('user').userId,function (error, data) {
                if(error){
                    alert('删除失败');
                }else{
                    currentTarget.parent().parent().parent().remove();
                }
            });
        });
        $('#add-user-dialog a').on('click',function(r){
            var appKey = $('#add-user-dialog').data('appKey');
            var appHostKey = $('#add-user-dialog').data('appHostKey');
            var userId = $('#add-user-dialog input').val().split(',')[1].split(')')[0];
            addAppUser(appKey,appHostKey,userId,function(error,data){
                if(error){
                    alert('添加失败');
                }else{
                    $('#add-user-dialog').modal('hide');
                }
            });
        })
    }
    function cacheUser(){
        $.ajax({
            url:'http://spacegate.corp.ganji.com/user',
            type:'get',
            dataType:'json',
            success:function(data){
                for(var user in data.data){
                    user = data.data[user];
                    cache.user = cache.user||[];
                    cache.user.push({id:user.userId,name:user.username+"("+user.userEmail+","+user.userId+')'})
                }
                console.log(cache.user);
                $('#product_search').typeahead({source:cache.user,
                    autoSelect: true});
            }
        });
    }
    function refreshAppUser(data){
        $('#user-dialog tbody').empty();
        for(var user in data){
            user = data[user];
            var tr = $('<tr></tr>');
            for(var key in userkey){
                key = userkey[key];
                var td = $('<td></td>');
                if(key==='userType')continue;
                td.text(user[key]);
                tr.append(td);
            }
            var oper = $($('.oper-td')[0]).clone();
            var td = $('<td></td>');
            oper.removeClass('hide');
            td.append(oper);
            tr.append(td);
            td.data('user',user);
            $('#user-dialog tbody').append(tr);
        }
    }
    function appUser(appKey,fn){
        $.ajax({
            url:api.appuser,
            type:'get',
            dataType:'json',
            data:{appKey:appKey},
            success:function(r){
                if(r.code===1){
                    fn(null,r.data);
                }else{
                    fn(new Error(r),null);
                }
            },
            error:function(r){
                fn(r,null);
            }
        });
    }
    function deleteAppUser(appKey,userId,fn){
        $.ajax({
            url:api.deleteAppUser,
            data:{userId:userId,appKey:appKey},
            type:'get',
            dataType:'json',
            success:function(r){
                if(r.code===1){
                    fn(null,r);
                }else{
                    fn(new Error(r),null);
                }
            },
            error:function(r){
                fn(r,null);
            }
        });
    }
    function addAppUser(appKey,appHostKey,userId,fn){
        $.ajax({
            url:api.addAppUser,
            type:'get',
            data:{appKey:appKey,appHostKey:appHostKey,userId:userId},
            dataType:'json',
            success:function(r){
                if(r.code===1){
                    fn(null,r);
                }else{
                    fn(new Error(r),null);
                }
            },
            error:function(r){
                fn(r,null);
            }
        })
    }
    function deleteUser(userid){
        $.ajax({
            url:api.deleteUser,
            data:{userid:userid },
            type:'get',
            dataType:'json',
            success:function(data){
                if(data.code===1){
                    loadUser();
                }else{
                    alert(data.msg);
                }
            }
        })
    }
    function loadUser(){
        $.ajax({
            url:api.userList,
            dataType:'json',
            type:'get',
            success:function(data){
                cache.userList = data.data;
                refreshUserList();
            },
            error:function(error){
                alert(error);
            }
        })
    }
    function refreshUserList(){
        $userList.empty();
        for(var user in cache.userList){
            user = cache.userList[user];
            var tr = $('<tr></tr>');
            for(var key in userkey){
                key = userkey[key];
                var td = $('<td></td>');
                if(key==='userType'){
                    if(user[key]===1){
                        td.text('开发');
                    }else{
                        td.text('测试');
                    }
                }else{
                    td.text(user[key]);
                }
                tr.append(td);
            }
            var oper = $($('.oper-td')[0]).clone();
            var td = $('<td></td>');
            oper.removeClass('hide');
            td.append(oper);
            tr.append(td);
            td.data('user',user);
            $userList.append(tr);
        }
    }
    function refreshAppList(){
        $userAppList.empty();
        for(var user in cache.appList){
            user = cache.appList[user];
            var tr = $('<tr></tr>');
            for(var key in appKey){
                key = appKey[key];
                var td = $('<td></td>');
                td.text(user[key]);
                tr.append(td);
            }
            var oper = $($('.app-oper-td')[0]).clone();
            oper.data('appKey',user.userAppKey);
            oper.data('appHostKey',user.userHostAppKey);
            var td = $('<td></td>');
            oper.removeClass('hide');
            td.append(oper);
            tr.append(td);
            td.data('user',user);
            $userAppList.append(tr);
        }
        $('body').tooltip({
            selector: '[data-toggle=tooltip]'
        });
    }
    $.ajax({
        url:api.userapp,
        dataType:'json',
        success:function(data){
            cache.appList = data.data;
            refreshAppList();
        }
    });

    initNav();
    initAddUserUI();
    initUserListUI();
    initUserAppUI();
    cacheUser();
})();