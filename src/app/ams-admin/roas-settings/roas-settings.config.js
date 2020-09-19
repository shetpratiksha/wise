(function () {
    'use strict';

    angular
        .module('app.ams-admin-roas-settings')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($stateProvider) {

        $stateProvider.state('triangular.ams-admin-roas-settings', {
            url: '/ams-admin-roas-settings',
            templateUrl: 'app/ams-admin/roas-settings/roas-settings.tmpl.html',
            // set the controller to load for this page
            controller: 'AmdAdminROASSettings',
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
