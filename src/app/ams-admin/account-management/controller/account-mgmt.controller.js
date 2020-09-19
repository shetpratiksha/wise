(function() {
    'use strict';

    angular
        .module('app.ams-admin-account-management')
        .controller('AmdAdminAccountMgmt', AmdAdminAccountMgmt);

    /* @ngInject */
    function AmdAdminAccountMgmt($cookies, $rootScope, $location, $scope, SettingService, AMSMessageService, $mdEditDialog, $q, $mdDialog, AMSAdminAccountManagementService, DynamicMenuService) {
        var userDetails = $cookies.getObject('loggedInUser')
        if (userDetails == undefined) {
            $location.path('/login')
        } else {
            if (userDetails.user.role == "SUPER_ADMIN" || userDetails.user.role == "ADMIN") {
                if (userDetails.user.role == "SUPER_ADMIN") {
                    $scope.userRoleEqlSuperAdm = true;
                }

                var vm = this;
                $scope.selected = [];
                $scope.userListData = [];
                vm.isLoading = true;
                $scope.limitOptions = [50, 75, 100];
                $scope.options = {
                    rowSelection: true,
                    multiSelect: true,
                    autoSelect: true,
                    decapitate: false,
                    largeEditDialog: false,
                    boundaryLinks: false,
                    limitSelect: true,
                    pageSelect: true
                };
                $scope.query = {
                    order: 'email',
                    limit: 50,
                    page: 1,
                    sortOrder: 'asc', //desc
                };
                $scope.checkLength = function() {
                    if ($scope.selected.length >= 1) {
                        return false;
                    } else {
                        return true;
                    }
                }


                $scope.accountTabClicked = function() {
                    if ($rootScope.current_organization && $rootScope.current_bg) {
                        $scope.userListApiCall();
                    }
                }
                $scope.$on('org_acc_loaded', function() {
                    //DynamicMenuService.addDynamicMenu($rootScope.current_organization.organizationId);
                    $scope.userListApiCall();
                })

                $scope.userListApiCall = function() {
                    var deferred = $q.defer();
                    $scope.deferred = deferred.promise;
                    AMSAdminAccountManagementService.getUserListData($rootScope.current_organization.organizationId).then(function(response) {
                        $scope.userListData = response.data;
                        vm.isLoading = false;
                        $scope.accountListApiCall();
                        deferred.resolve();
                    }).catch(function(response) {
                        vm.isLoading = false;
                        vm.loadingError = "Error displaying Users. Please try later!!!";
                        deferred.reject();
                    })
                }

                $scope.accountListApiCall = function() {
                    AMSAdminAccountManagementService.getAccountListData($rootScope.current_organization.organizationId, $rootScope.current_bg.businessGroupId).then(function(response) {
                        $scope.accountListData = response.data;
                        $scope.userAssociationListApiCall();
                    }).catch(function(response) {
                        vm.loadingError = "Error in getting Account Detail. Please try later!!!";
                    })
                }

                $scope.userAssociationListApiCall = function() {
                    var deferred = $q.defer();
                    $scope.deferred = deferred.promise;
                    AMSAdminAccountManagementService.getUserAssociationData($rootScope.current_organization.organizationId).then(function(response) {
                        $scope.userAssociationListData = response.data;
                        $scope.combineAlldata($scope.userListData, $scope.accountListData, $scope.userAssociationListData);
                        deferred.resolve();
                    }).catch(function(response) {
                        vm.loadingError = "Error in getting Account Detail. Please try later!!!";
                    })
                }

                $scope.combineAlldata = function(userListData, accountListData, userAssociationListData) {
                    var userIdList = userListData.map(function(userData) {
                        return userData.userId;
                    })
                    var listOfAssocUser = userAssociationListData.map(function(assocData) {
                        if (userIdList.indexOf(assocData.userId) > -1) {
                            var index = userIdList.indexOf(assocData.userId);
                            assocData.user = userListData[index];
                            return assocData;
                        }
                    })
                    accountListData.map(function(accData, index) {
                        var userList = [];
                        listOfAssocUser.map(function(assocData) {
                            if (accData.amsAccountId === assocData.amsAccountId) {
                                userList.push(assocData.user);
                                accData.user = userList;
                            }
                        })
                    })
                }

                vm.showIncontextConfirmationDialog = function($event, message, actionType, user) {
                    var confirm = $mdDialog.confirm({
                            onComplete: function afterShowAnimation() {
                                var $dialog = angular.element(document.querySelector('md-dialog'));
                                var $actionsSection = $dialog.find('md-dialog-actions');
                                var $cancelButton = $actionsSection.children()[0];
                                var $confirmButton = $actionsSection.children()[1];
                                angular
                                    .element($confirmButton)
                                    .addClass('md-raised md-accent');
                            }
                        })
                        .textContent(message)
                        .ok("CONFIRM")
                        .cancel("CANCEL")
                        .targetEvent($event);

                    $mdDialog
                        .show(confirm)
                        .then(function() {

                            switch (actionType) {
                                case "addNewAccount":
                                    $scope.addAccountCall($scope.addNewAccountData);
                                    break;
                            }

                        }, function() {

                        });
                }

                $scope.newAccountDialogOpen = function($event) {
                    var parentEl = angular.element(document.body);
                    $mdDialog.show({
                            parent: parentEl,
                            targetEvent: $event,
                            templateUrl: 'app/ams-admin/dialog/newAccountDialog.html',
                            locals: {
                                userListData: $scope.userListData
                            },
                            controller: 'newAccountDialogController'
                        })
                        .then(function(response) {
                            $scope.addNewAccountData = response;
                            var message = "Click confirm to add User";
                            vm.showIncontextConfirmationDialog($event, message, "addNewAccount");

                        }, function() {});
                };

                $scope.editAccountDialogOpen = function($event, accountSelected) {
                    var parentEl = angular.element(document.body);
                    $mdDialog.show({
                            parent: parentEl,
                            targetEvent: $event,
                            templateUrl: 'app/ams-admin/dialog/editAccountDialog.html',
                            locals: {
                                userListData: $scope.userListData,
                                accountData: accountSelected
                            },
                            controller: 'editAccountDialogController'
                        })
                        .then(function(response) {
                            $scope.addNewUserData = response;
                            var message = "Click confirm to add User";
                            vm.showIncontextConfirmationDialog($event, message, "addNewUser");

                        }, function() {});
                };

                $scope.addAccountCall = function(addNewAccountData){
                    console.log("addNewAccountData",addNewAccountData);
                }
            }
        }
    }
})();