(function () {
    'use strict';

    angular
        .module('app.ams-admin-account-management')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($stateProvider) {

        $stateProvider.state('triangular.ams-admin-account-management', {
            url: '/ams-admin-account-management',
            templateUrl: 'app/ams-admin/account-management/account-management.tmpl.html',
            // set the controller to load for this page
            //controller: 'AmdAdminRegisterOrg',
            controllerAs: 'vm',
            // layout-column class added to make footer move to bottom of the page on short
            // pages
            data: {
                layout: {
                    contentClass: 'layout-column'
                }
            }
        })
    }
})();
