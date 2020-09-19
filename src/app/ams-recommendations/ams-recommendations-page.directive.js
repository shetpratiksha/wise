(function() {
    'use strict';

    angular
        .module('app.ams-recommendations')
        .directive('scroll',stickyHeader)

        /*Inject*/
        function stickyHeader($window,$rootScope,$timeout){
            
        return function (scope, elm, attr) {
          var raw = elm[0];
          var getOffset = 0;
            var el = angular.element(document.querySelector('#scrollHead'));
            
          elm.bind('scroll', function () {
            if(elm[0].scrollTop > 0){
                el.css({
                        'opacity':'0',
                        'transform':'translateY(0px)',
                        '-webkit-transform':'translateY(0px)',
                        '-moz-transform':'translateY(0px)',
                        '-ms-transform':'translateY(0px)'
                });
                $timeout(function(){
                    el.css({
                        'opacity':'1',
                        'transform':'translateY('+raw.scrollTop+'px)',
                         '-webkit-transform':'translateY('+raw.scrollTop+'px)',
                        '-moz-transform':'translateY('+raw.scrollTop+'px)',
                        '-ms-transform':'translateY('+raw.scrollTop+'px)'
                    });
                },600);
            }
            // Detect Stopped Scroll execution
            
            // clearTimeout( $.data( this, "scrollCheck" ) );
            //     $.data( this, "scrollCheck", setTimeout(function() {
            //          el.css({
            //             'opacity':'1',
            //             'transform':'translateY('+raw.scrollTop+'px)',
            //              '-webkit-transform':'translateY('+raw.scrollTop+'px)',
            //             '-moz-transform':'translateY('+raw.scrollTop+'px)',
            //             '-ms-transform':'translateY('+raw.scrollTop+'px)'
            //         });
            //     }, 250) );      
          });
        };
    }
})();
