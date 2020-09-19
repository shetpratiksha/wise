(function() {
    'use strict';

    angular
        .module('app')
        .config(appConfig);

    /* @ngInject */
    function appConfig($compileProvider, $stateProvider, $qProvider) {
        // Make sure this still works in controllers (breaking change in angular 1.6)
        $compileProvider.preAssignBindingsEnabled(true);
        $qProvider.errorOnUnhandledRejections(false);

        $stateProvider
        .state('triangular.app-dynamic-menu', {
            // set the controller to load for this page
            controller: 'APPDynamicMenuController',
            controllerAs: 'vm',
            // layout-column class added to make footer move to
            // bottom of the page on short pages
            data: {
                layout: {
                    contentClass: 'layout-column'
                }
            }
        })
    }

})();
