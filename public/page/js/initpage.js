(function(){

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
            node.setAttribute('href',styleArray[i]);
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
        var jsArray = [
            'js/jquery.js',
            'js/bootstrap.min.js',
            'js/jquery.scrollTo.min.js',
            'js/jquery.nicescroll.js',
            'js/common-scripts.js',
            'js/bootstrap-typehead.js',
        ];
        var body = document.getElementsByTagName('body')[0];
        for(var i=0;i<jsArray.length;i++){
            var node = document.createElement('script');
            node.setAttribute('src',jsArray[i]);
            node.onload = onJsLoad;
            body.appendChild(node);
        }
        function onJsLoad(e){
            if(e.target.getAttribute('src')===jsArray[0]){
            }
        }
    }
    loadCss();
    loadJS();
    !function loadSea(){
        var body = document.getElementsByTagName('body')[0];
        var node = document.createElement('script');
        node.setAttribute('src','js/sea.js');
        node.onload = function(){
            var pageIndex = window.parent.location.hash.replace('#','');
            if (window.frameElement && window.frameElement.tagName == "IFRAME") {
                 pageIndex = window.parent.location.hash.replace('#','');
            }else{
                pageIndex = 'index';
            }

            console.log(pageIndex);
            seajs.config({
                base:'../app/',
                alias:{
                    
                }
            });
            seajs.use(pageIndex);
        };
        body.appendChild(node);
    }();
})();