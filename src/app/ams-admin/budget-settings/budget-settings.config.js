(function() {
    'use strict';

    angular
        .module('app.ams-admin-budget-settings')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($stateProvider) {

        $stateProvider.state('triangular.ams-admin-budget-settings', {
            url: '/ams-admin-budget-settings',
            templateUrl: 'app/ams-admin/budget-settings/budget-settings.tmpl.html',
            // set the controller to load for this page
            controller: 'AmdAdminBudgetSettings',
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