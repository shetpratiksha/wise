(function() {
    'use strict';

    angular
        .module('app.ams-admin-account-management')
        .controller('AmdAdminRegisterOrg', AmdAdminRegisterOrg);

    /* @ngInject */
    function AmdAdminRegisterOrg($cookies, $rootScope, $location, $scope, SettingService, AMSMessageService, $mdEditDialog, $q, $mdDialog, AMSAdminAccountManagementService, DynamicMenuService) {
        var userDetails = $cookies.getObject('loggedInUser')
        if (userDetails == undefined) {
            $location.path('/login')
        } else {
            if (userDetails.user.role == "SUPER_ADMIN" || userDetails.user.role == "ADMIN") {
                if (userDetails.user.role == "SUPER_ADMIN") {
                    $scope.userRoleEqlSuperAdm = true;
                }

                var vm = this;
                $scope.org = {};
                $scope.$on('org_acc_loaded', function() {
                    DynamicMenuService.addDynamicMenu($rootScope.current_organization.organizationId);
                })

                $scope.clearData = function(form) {
                    $scope.org.orgName = "";
                    $scope.org.orgEmail = "";
                    form.$setPristine();
                    form.$setUntouched();
                }


                $scope.registerOrg = function(event, form) {
                    if (form.$valid) {
                        var uploadData = {
                                "name": $scope.org.orgName,
                                "contact": {
                                    "email": $scope.org.orgEmail
                                }
                            }
                        vm.createOrgApiCall(uploadData);
                    }
                }

                vm.createOrgApiCall = function(uploadData) {
                    $rootScope.isContentLoading = true;
                    AMSAdminAccountManagementService.createOrganization(uploadData).then(function(response) {
                        vm.message = "Successfully Registered."
                        AMSMessageService.showSuccessMessage(vm.message);
                        $rootScope.isContentLoading = false;
                    }).catch(function(response) {
                        var errorMessage = "Error in creating Organization. Email address already registered!!!"
                        AMSMessageService.showErrorMessage(errorMessage);
                        $rootScope.isContentLoading = false;
                    })
                }
            } else {
                $location.path('/login')
            }
        }
    }
})();