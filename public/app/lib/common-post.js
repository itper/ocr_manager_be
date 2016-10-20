define(function(require,exports,module){
    exports.init = function(success,failure){

        var config = require('../global/config');
        $('#post').on('click',function(e){
            var target = $(e.currentTarget);
            var form = $(e.currentTarget).parent();
            var input = form.find('input[id],textarea[id]');
            var data = {};
            for(var i=0;i<input.length; i++){
                var el = input[i];
                if($(el).data('disable')){
                    break;
                }
                if(el.type==='radio'){
                    data[el.name] = $('[name='+el.name+']:checked').val();
                }else if(($(el).data('type')==='date')){
                    data[el.id] = new Date(el.value).getTime()/1000;
                }else if($(el).data('type')==='auto'){
                    var key = $(el).data('key');
                    key = key.split(',');
                    for(var k=0;k<key.length;k++){
                        data[key[k].split(':')[0]] = $(el).data('item')[key[k].split(':')[1]];
                    }
                }else{
                    if(el.id)
                        data[el.id] = el.value;
                }


            }
            data.pwd = '123456';
            $.ajax({
                url:config.baseUrl+target.data('action'),
                type:target.data('type'),
                data:data,
                xhrFields: {
                    withCredentials: true
                },
                success:function(data){
                    console.log(data);
                    if(data.code===0){
                        if(success)success();
                        else
                            alert(target.data('successtxt'));

                    }else{
                        if(failure)failure();
                        else
                        alert(target.data('failuretxt'));
                    }
                }
            });
            e.preventDefault();
        })
    }
});