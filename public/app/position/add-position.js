/**
 * Created by chendi on 16/10/17.
 */
define(function(require,exports,module){
    var config = require('../global/config');
    require('../lib/common-post').init();
    $('#fromDate').datepicker({
        format:'yyyy/mm/dd'
    });
    $('#toDate').datepicker({
        format:'yyyy/mm/dd'
    });
});