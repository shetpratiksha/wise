(function() {
    'use strict';

    angular.module('app').controller('APPDynamicMenuController', APPDynamicMenuController);

    /* @ngInject */
    function APPDynamicMenuController(ImapConstants, $location, $scope, $cookies, $rootScope, $http, $sce, $timeout, $state, triLayout, triSettings,SettingService,DynamicMenuService,triMenu) {

        $rootScope.current_organization = $cookies.getObject('current_organization');

        SettingService.loadOrganizationSetting($rootScope.current_organization.organizationId);

        DynamicMenuService.addDynamicMenu($rootScope.current_organization.organizationId);
        $state.go('triangular.ams-analytics-overview');
    }
})();