define(function(require,exports,module){
    exports.init = function(success,failure){

        var config = require('../global/config');
        $('#post').on('click',function(e){
            var target = $(e.currentTarget);
            var form = $(e.currentTarget).parent();
            var input = form.find('input[id]');
            var data = {};
            for(var el in input){
                el = input[el];
                if(el.type==='radio'){
                    data[el.name] = $('[name='+el.name+']:checked').val();
                }else{
                    if(el.id && el.type==='text')
                        data[el.id] = el.value;
                }
            }
            data.pwd = '123456';
            $.ajax({
                url:config.baseUrl+target.data('action'),
                type:target.data('type'),
                data:data,
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