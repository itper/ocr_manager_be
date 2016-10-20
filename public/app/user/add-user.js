/**
 * Created by chendi on 16/10/17.
 */
define(function(require,exports,module){
    var config = require('../global/config');
    var util = require('../lib/util');
    require('../lib/common-post').init();
    var companyInput = $('#companyId');
    var companyInputArea = companyInput.parent().parent();
    var numberLabel = $('#number-label');

    util.initAutoComplete(companyInput,config.baseUrl+'company/find');


    $('[name=type]').on('click',function(e){
        companyInputArea.addClass('hide');
        var val = e.currentTarget.value;
        numberLabel.parent().show();
        companyInput.data('disable',true);
        if(val==='1'){
            numberLabel.text('学号');
        }else if(val==='2'){
            numberLabel.parent().hide();
            companyInputArea.removeClass('hide');
            companyInput.data('disable',false);
        }else{
            numberLabel.text('工号');
        }
    });
});