(function(){
    var staticPath = '/ocr_manager_be/public/page/';
    function loadCss(){
        var styleArray = [
            'css/bootstrap.min.css',
            'css/bootstrap-reset.css',
            'assets/font-awesome/css/font-awesome.css',
            'css/style.css',
            'css/style-responsive.css',
            'css/admin.css',
        ];
        var isOldWebKit = +navigator.userAgent.replace(/.*AppleWebKit.*?(\d+)\..*/i, '$1') < 536;
        var isOldFirefox = window.navigator.userAgent.indexOf('Firefox') > 0 &&
            !('onload' in document.createElement('link'));
        var loadover = 0;
        var head = document.getElementsByTagName('head')[0];
        for(var i=0;i<styleArray.length;i++){
            var node = document.createElement('link');
            node.setAttribute('type','text/css');
            node.setAttribute('href',staticPath+styleArray[i]);
            node.setAttribute('rel','stylesheet');
            head.appendChild(node);
            node.onload = onCSSLoad;
        }
        function onCSSLoad(){
            loadover++;
            if(loadover===styleArray.length){
                var node = document.getElementsByTagName('body')[0];
                node.style.display = 'block';
            }
        }
    }
    function loadJS(){
        var body = document.getElementsByTagName('body')[0];
        var node = document.createElement('script');
        node.setAttribute('src',staticPath+'js/jquery.js');
        node.onload = function(){
            loadSea();
            var t = 0;
            var jsArray = [
                'js/bootstrap.min.js',
                'js/jquery.scrollTo.min.js',
                'js/jquery.nicescroll.js',
                'js/common-scripts.js',
                'js/bootstrap-typehead.js',
            ];
            for(var i=0;i<jsArray.length;i++){
                var node = document.createElement('script');
                node.setAttribute('src',staticPath+jsArray[i]);
                node.onload = function(){
                    t++;
                    if(t===jsArray.length){

                        $('body').tooltip({
                            selector: '[data-toggle=tooltip]'
                        });
                    }
                };
                body.appendChild(node);
            }
        };
        body.appendChild(node);


    }
    loadCss();
    loadJS();
    function loadSea(){

        var body = document.getElementsByTagName('body')[0];
        var node = document.createElement('script');
        node.setAttribute('src',staticPath+'js/sea.js');
        node.onload = function(){
            var pageIndex = window.location.pathname.substring(0,window.location.pathname.lastIndexOf('.'))+'.js';
            if (window.frameElement && window.frameElement.tagName == "IFRAME") {
            }else{
                pageIndex = 'index';
            }
            // pageIndex = pageIndex.replace('-','/');
            console.log(pageIndex);
            seajs.config({
                base:'../app/',
                alias:{

                }
            });
            seajs.use(pageIndex);
        };
        body.appendChild(node);
    };
})();