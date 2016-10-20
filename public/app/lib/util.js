define(function(r,e){
    e.initAutoComplete = function(el,url){
        el.typeahead({
            delay:300,
            autoSelect: true,
            matcher:function(val){
                console.log(val.name);
                return true;
            },
            source:function(query,callback){
                el.data('item',null);
                if(!query){
                    return [];
                }
                $.ajax({
                    url:url,
                    data:{keyword:query},
                    type:'get',
                    xhrFields: {
                        withCredentials: true
                    },
                    success:function(data){
                        callback(data.data.list);
                    }
                });
            },
            afterSelect:function(val){
                el.data('item',val);
            }
        });
    };
});