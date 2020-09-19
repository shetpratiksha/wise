(function() {
    'use strict';

    angular
        .module('app.ams-admin')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($stateProvider, triMenuProvider) {

        $stateProvider
        .state('triangular.ams-admin', {
            url: '/ams-admin',
            templateUrl: 'app/ams-admin/admin.tmpl.html',
            // set the controller to load for this page
            controller: 'AMSAdminController',
            controllerAs: 'vm',
            // layout-column class added to make footer move to
            // bottom of the page on short pages
            data: {
                layout: {
                    contentClass: 'layout-column'
                }
            }
        })
        .state('triangular.ams-help', {
            url: '/ams-help',
            templateUrl: 'app/ams-admin/help.tmpl.html',
            // set the controller to load for this page
            controller: 'AMSAdminController',
            controllerAs: 'vm',
            // layout-column class added to make footer move to
            // bottom of the page on short pages
            data: {
                layout: {
                    contentClass: 'layout-column'
                }
            }
        });

    }
})();
