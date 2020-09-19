(function() {
    'use strict';

    angular
        .module('app.modules.menu')
        .factory('dynamicMenuService', dynamicMenuService);

    /* @ngInject */
    function dynamicMenuService() {
        return {
            dynamicMenu: {
                showDynamicMenu: false
            }
        };
    }
})();
