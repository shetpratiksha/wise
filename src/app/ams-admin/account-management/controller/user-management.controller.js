(function() {
    'use strict';

    angular
        .module('app.ams-admin-account-management')
        .controller('AmdAdminUserManagement', AmdAdminUserManagement);
    /* @ngInject */
    function AmdAdminUserManagement($cookies, $rootScope, $timeout, $location, $scope, AMSMessageService, $mdEditDialog, $q, $mdDialog, AMSAdminAccountManagementService) {
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

                $scope.userTabClicked = function() {
                    if ($rootScope.current_organization && $rootScope.current_bg) {
                        $scope.userListApiCall();
                        $scope.accountListApiCall();
                        $scope.userAssociationListApiCall();
                    }
                }
                $scope.$on('org_acc_loaded', function() {
                    //DynamicMenuService.addDynamicMenu($rootScope.current_organization.organizationId);
                    $scope.userListApiCall();
                    $scope.accountListApiCall();
                    $scope.userAssociationListApiCall();

                })

                $scope.userListApiCall = function() {
                    var deferred = $q.defer();
                    $scope.deferred = deferred.promise;
                    AMSAdminAccountManagementService.getUserListData($rootScope.current_organization.organizationId).then(function(response) {
                        $scope.userListData = response.data;
                        vm.isLoading = false;
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
                    }).catch(function(response) {
                        vm.loadingError = "Error in getting Account Detail. Please try later!!!";
                    })
                }

                $scope.userAssociationListApiCall = function() {
                    AMSAdminAccountManagementService.getUserAssociationData($rootScope.current_organization.organizationId).then(function(response) {
                        $scope.userAssociationListData = response.data;
                    }).catch(function(response) {
                        vm.loadingError = "Error in getting Account Detail. Please try later!!!";
                    })
                }

                $scope.editUser = function($event, user) {
                    var parentEl = angular.element(document.body);
                    $mdDialog.show({
                            parent: parentEl,
                            targetEvent: $event,
                            templateUrl: 'app/ams-admin/dialog/editUserDialog.html',
                            locals: {
                                accountLists: $scope.accountListData,
                                userData: user,
                                userAssociation: $scope.userAssociationListData,
                            },
                            controller: 'editUserDialogController'
                        })
                        .then(function(response) {
                            $scope.editedUserData = response;
                            var message = "Click Confirm to save User.";
                            vm.showIncontextConfirmationDialog($event, message, "editUser");
                        }, function() {});
                }


                $scope.newUserDialogOpen = function($event) {
                    var parentEl = angular.element(document.body);
                    $mdDialog.show({
                            parent: parentEl,
                            targetEvent: $event,
                            templateUrl: 'app/ams-admin/dialog/newUserDialog.html',
                            locals: {
                                accountList: $scope.accountListData
                            },
                            controller: 'newUserDialogController'
                        })
                        .then(function(response) {
                            $scope.addNewUserData = response;
                            var message = "Click confirm to add User";
                            vm.showIncontextConfirmationDialog($event, message, "addNewUser");

                        }, function() {});
                };

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
                                case "addNewUser":
                                    $scope.addUserCall($scope.addNewUserData);
                                    break;
                                case "bulkUserDelete":
                                    $scope.deleteUserCall($scope.selected);
                                    break;
                                case "editUser":
                                    $scope.saveEditedUser($scope.editedUserData);
                                    break;
                                case "reactiveUser":
                                    $scope.reactivateUserApiCall(user);
                                    break;
                            }

                        }, function() {

                        });
                }

                $scope.saveEditedUser = function(editedUserData) {
                    var deferred = $q.defer();
                    $scope.deferred = deferred.promise;
                    var resultUserAssocId = editedUserData.accountSelected.map(function(a) {
                        return a.amsAccountId
                    });
                    var prevUserAssocId = editedUserData.previousSelectedAcc.map(function(a) {
                        return a.amsAccountId
                    });
                    var editedUserApiData = {
                        userId: editedUserData.userId,
                        role: editedUserData.userRole
                    }
                    AMSAdminAccountManagementService.editUserApi($rootScope.current_organization.organizationId, editedUserApiData).then(function(response) {
                        $scope.userAccountAssociationApiCall(editedUserData, prevUserAssocId, resultUserAssocId);
                        $scope.userListApiCall();
                        var message = "Successfully User Edited."
                        AMSMessageService.showSuccessMessage(message);
                        deferred.resolve();
                    }).catch(function(response) {
                        var errorMessage = "Error Editing user. Please try later!!!"
                        AMSMessageService.showErrorMessage(errorMessage);
                        deferred.reject();
                    })
                }

                $scope.userAccountAssociationApiCall = function(editedUserData, prevUserAssocId, resultUserAssocId) {
                    var deferred = $q.defer();
                    $scope.deferred = deferred.promise;
                    $scope.accountListData.map(function(data, i) {
                        var associationUpdateData = {
                            userId: editedUserData.userId,
                            amsAccountId: data.amsAccountId
                        }

                        if (resultUserAssocId.indexOf(data.amsAccountId) > -1) {
                            if (prevUserAssocId.indexOf(data.amsAccountId) <= -1) {
                                AMSAdminAccountManagementService.addUserAssociationApi($rootScope.current_organization.organizationId, associationUpdateData).then(function(response) {
                                    deferred.resolve();
                                }).catch(function(response) {
                                    var errorMessage = "Error Associating User. Please try later!!!";
                                    AMSMessageService.showErrorMessage(errorMessage);
                                    deferred.reject();
                                })
                            }

                        } else {
                            if (prevUserAssocId.indexOf(data.amsAccountId) > -1) {
                                AMSAdminAccountManagementService.deleteUserAssociationApi($rootScope.current_organization.organizationId, associationUpdateData).then(function(response) {
                                    deferred.resolve();
                                }).catch(function(response) {
                                    var errorMessage = "Error Associating User. Please try later!!!";
                                    AMSMessageService.showErrorMessage(errorMessage);
                                    deferred.reject();
                                })
                            }
                        }
                        if ($scope.accountListData.length == (i + 1)) {
                            $timeout(function() {
                                $scope.userAssociationListApiCall();
                            }, 500);

                        }
                    })
                }

                $scope.addUserCall = function(addnewUserData) {
                    var newUserData = addnewUserData.newUser;
                    Object.assign(newUserData, { firstName: "", lastName: "" });
                    var deferred = $q.defer();
                    $scope.deferred = deferred.promise;
                    AMSAdminAccountManagementService.addNewUserApi($rootScope.current_organization.organizationId, newUserData).then(function(response) {
                        $scope.userId = response.data.userId;
                        $scope.userAssociationCall($scope.userId, addnewUserData.accountSelected);
                        var message = "Successfully User Added."
                        AMSMessageService.showSuccessMessage(message);
                        deferred.resolve();
                    }).catch(function(response) {
                        if (response.status == 409) {
                            var errorMessage = "Resource already exists in the system"
                        } else {
                            var errorMessage = "Error Adding User. Please try later!!!"
                        }
                        AMSMessageService.showErrorMessage(errorMessage);
                        deferred.reject();
                    })
                }

                $scope.userAssociationCall = function(userId, accountSelected) {
                    var deferred = $q.defer();
                    $scope.deferred = deferred.promise;
                    accountSelected.map(function(data, i) {
                        var newAssociationData = {
                            userId: userId,
                            amsAccountId: data.amsAccountId
                        }
                        AMSAdminAccountManagementService.addUserAssociationApi($rootScope.current_organization.organizationId, newAssociationData).then(function(response) {
                            if (accountSelected.length == (i + 1)) {
                                $scope.userListApiCall();
                                $scope.userAssociationListApiCall()
                                deferred.resolve();
                            }
                        }).catch(function(response) {
                            var errorMessage = "Error Associating User. Please try later!!!";
                            AMSMessageService.showErrorMessage(errorMessage);
                            deferred.reject();
                        })
                    })
                }


                $scope.bulkUserDelete = function($event) {
                    var message = "Click confirm to Revoke access to the selected User";
                    vm.showIncontextConfirmationDialog($event, message, "bulkUserDelete");
                }

                $scope.deleteUserCall = function(deleteUser) {
                    var deferred = $q.defer();
                    $scope.deferred = deferred.promise;
                    deleteUser.map(function(user, i) {
                        AMSAdminAccountManagementService.deleteUserApi($rootScope.current_organization.organizationId, user.userId).then(function(response) {
                            if (deleteUser.length == (i + 1)) {
                                $scope.userListApiCall();
                                var message = "Successfully " + deleteUser.length + " User Deleted."
                                $scope.selected = [];
                                AMSMessageService.showSuccessMessage(message);
                                deferred.resolve();
                            }
                        }).catch(function(response) {
                            var errorMessage = "Error Deleting Users Please try later!!!"
                            AMSMessageService.showErrorMessage(errorMessage);
                            deferred.reject();
                        })
                    })
                }

                $scope.resendActMail = function(userData) {
                    var resendData = {
                        email: userData.email,
                        userId: userData.userId
                    }
                    var deferred = $q.defer();
                    $scope.deferred = deferred.promise;
                    AMSAdminAccountManagementService.resendMailApi(resendData).then(function(response) {
                        var message = "Email Successfully Sent."
                        AMSMessageService.showSuccessMessage(message);
                        deferred.resolve();
                    }).catch(function(response) {
                        var errorMessage = "Error Sending Mail Please try later!!!"
                        AMSMessageService.showErrorMessage(errorMessage);
                        deferred.reject();
                    })
                }

                $scope.reactivateUser = function($event, user){
                    var message = "Click confirm to Reactivate User";
                    vm.showIncontextConfirmationDialog($event, message, "reactiveUser", user);
                }

                $scope.reactivateUserApiCall = function(user){
                    var reactivateUserData = {
                        userId: user.userId,
                        status: 'CREATED',
                        role: user.role
                    }
                    var deferred = $q.defer();
                    $scope.deferred = deferred.promise;
                    AMSAdminAccountManagementService.editUserApi($rootScope.current_organization.organizationId, reactivateUserData).then(function(response) {
                        var message = "User Successfully Activated."
                        AMSMessageService.showSuccessMessage(message);
                        $scope.userListApiCall();
                        deferred.resolve();
                    }).catch(function(response) {
                        var errorMessage = "Error Activating User Please try later!!!"
                        AMSMessageService.showErrorMessage(errorMessage);
                        deferred.reject();
                    })
                }

            } else {
                $location.path('/login')
            }
        }
    }
})();