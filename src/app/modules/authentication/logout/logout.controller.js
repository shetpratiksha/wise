(function() {
    'use strict';

    angular
        .module('app.modules.authentication')
        .controller('LogoutController', LogoutController);

    /* @ngInject */
    function LogoutController($state, $http, triSettings, ImapConstants, $cookies, $scope, $rootScope, triMenu) {
        var vm = this;
        vm.triSettings = triSettings;
        var urlConstants = ImapConstants.getUrls()

        $scope.logout = function() {
            var userDetails = $cookies.getObject('loggedInUser')
            $http({
                method: 'POST',
                url: ImapConstants.getUrls().intentwise_base_url + 'user/logout',
                data: '',
                headers: {
                    'X-Auth-Token': userDetails.token,
                    'Content-Type': 'application/json'
                }
            }).then(function successCallback(response) {
                $cookies.remove('loggedInUser');
                $cookies.remove('userActions');
                $cookies.remove('organizationSetting');
                $cookies.remove('current_organization');
                triMenu.removeMenu('triangular.ams-analytics-multi-account-view');
                triMenu.removeMenu('triangular.ams-analytics-pos-view');
                triMenu.removeMenu('triangular.ams-analytics-brand-terms-view');
                triMenu.removeMenu('triangular.ams-analytics-brand-vs-nb-view');
                triMenu.removeMenu('triangular.ams-analytics-vendor-alerts');
                triMenu.removeMenu('triangular.ams-high-level-metrics');
                triMenu.removeMenu('triangular.ams-organic-ranking');
                triMenu.removeMenu('triangular.ams-custom-reports-vendor-sales-overview');
                triMenu.removeMenu('triangular.ams-custom-reports-internal-playground');
                triMenu.removeMenu('triangular.ams-custom-reports-cas-download');
                triMenu.removeMenu('Admin');
                triMenu.removeMenu('triangular.ams-admin-roas-settings');
                triMenu.removeMenu('triangular.ams-admin-budget-settings');
                triMenu.removeMenu('triangular.ams-custom-reports-ia-internal-billing');
                triMenu.removeMenu('triangular.ams-custom-reports-lr-pos-data');

                $scope.clearRootScope();

                $state.go("authentication.login")

            }, function errorCallback(response) {
                $cookies.remove('loggedInUser');
                $cookies.remove('userActions');
                $cookies.remove('organizationSetting');
                $cookies.remove('current_organization');
                triMenu.removeMenu('triangular.ams-analytics-multi-account-view');
                triMenu.removeMenu('triangular.ams-analytics-pos-view');
                triMenu.removeMenu('triangular.ams-analytics-brand-terms-view');
                triMenu.removeMenu('triangular.ams-analytics-brand-vs-nb-view');
                triMenu.removeMenu('triangular.ams-analytics-vendor-alerts');
                triMenu.removeMenu('triangular.ams-high-level-metrics');
                triMenu.removeMenu('triangular.ams-organic-ranking');
                triMenu.removeMenu('triangular.ams-custom-reports-cas-download');
                triMenu.removeMenu('triangular.ams-custom-reports-vendor-sales-overview');
                triMenu.removeMenu('triangular.ams-custom-reports-internal-playground');
                triMenu.removeMenu('Admin');
                triMenu.removeMenu('triangular.ams-admin-roas-settings');
                triMenu.removeMenu('triangular.ams-admin-budget-settings');
                triMenu.removeMenu('triangular.ams-custom-reports-ia-internal-billing');
                triMenu.removeMenu('triangular.ams-custom-reports-lr-pos-data');

                $scope.clearRootScope();

                $state.go("authentication.login")
            });
        }

        $scope.clearRootScope = function() {

            for (var prop in $rootScope) {

                if (prop == 'visibleFilters' || prop == 'loggedInUser' || prop == 'userAction' ||
                    prop == 'current_organization' || prop == 'current_bg' || prop == 'accounts' ||
                    prop == 'current_account' || prop == 'actualURL' || prop == 'currentAcId' || prop == 'currentOrgId' ||
                    prop == 'organizations') {

                    delete $rootScope[prop];
                }
            }

        }

    }
})();
