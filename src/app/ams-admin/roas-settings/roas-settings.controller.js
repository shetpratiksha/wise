(function() {
    'use strict';

    angular
        .module('app.ams-admin-roas-settings')
        .controller('AmdAdminROASSettings', AmdAdminROASSettings);

    /* @ngInject */
    function AmdAdminROASSettings($cookies, $rootScope, $location, $scope,$timeout, $mdEditDialog, $q, $mdDialog, AMSMessageService, DynamicMenuService, AMSAdminRoasSettingService) {
        var userDetails = $cookies.getObject('loggedInUser')
        if (userDetails == undefined) {
            $location.path('/login')
        } else {
            
                var vm = this;
                vm.isLoading = true;
                $rootScope.roasLoading = true;
                $scope.selected = [];
                $scope.limitOptions = [50, 75, 100];
                $scope.showStatus = false; //Shows status column incase multi status response from AMS
                $scope.showAcosEdit = false;
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
                $timeout(function(){
                    $scope.floatValue = { top: 0, useAbsolutePositioning: false };
                    $scope.floatEnable = true;
                },2000);
                $scope.enableAcosEdit = function() {
                    $scope.showAcosEdit = !$scope.showAcosEdit;
                    if (!$scope.showAcosEdit) {
                        $scope.accountRoasData = angular.copy($scope.accountRoasDataCopy);
                    }
                }
                $scope.checkLength = function() {
                    if ($scope.selected.length >= 1) {
                        return false;
                    } else {
                        return true;
                    }
                }

                $scope.accountRoasCall = function(organizationId, businessGroupId, amsAccountId) {
                     var deferred = $q.defer();
                    $rootScope.deferred = deferred.promise; 
                    var getAccountRoasFunc = AMSAdminRoasSettingService.getAccountRoasData(organizationId, businessGroupId, amsAccountId);
                    getAccountRoasFunc.then(function(response) {
                        $scope.accountRoasData = response.data;
                        $scope.accountRoasDataCopy = angular.copy($scope.accountRoasData);
                        deferred.reject();
                    }).catch(function(response) {
                        $scope.accountRoasData = {
                            "accountId": amsAccountId,
                            "name": "",
                            "roas": undefined
                        }
                        $scope.accountRoasDataCopy = angular.copy($scope.accountRoasData);
                        deferred.reject();

                    })
                }


                $scope.roasListCall = function(organizationId, businessGroupId, amsAccountId) {
                     var deferred = $q.defer();
                    $rootScope.deferred = deferred.promise;
                    var getRoasDataFunc = AMSAdminRoasSettingService.getRoasSettingData(organizationId, businessGroupId, amsAccountId);
                    getRoasDataFunc.then(function(response) {

                        $scope.adminROASData = response.data;
                        $scope.adminROASCampList = $scope.adminROASData;

                        vm.isLoading = false;
                        $rootScope.roasLoading = false;
                        deferred.reject();
                    }).catch(function(response) {
                        vm.isLoading = false;
                        $rootScope.roasLoading = false;
                        vm.loadingError = "Error displaying ACOS. Please try later!!!";
                        deferred.reject();
                    })
                }

                $scope.listApiCall = function() {

                    $scope.roasListCall(
                        $rootScope.current_organization.organizationId,
                        $rootScope.current_bg.businessGroupId,
                        $rootScope.current_account.amsAccountId
                    );
                    $scope.accountRoasCall(
                        $rootScope.current_organization.organizationId,
                        $rootScope.current_bg.businessGroupId,
                        $rootScope.current_account.amsAccountId
                    );
                }

                $scope.$on('org_acc_loaded', function() {
                    $rootScope.roasLoading = true;
                    vm.loadingError = false;
                    DynamicMenuService.addDynamicMenu($rootScope.current_organization.organizationId);
                    $scope.accountRoasData = {
                        "accountId": $rootScope.current_account.amsAccountId,
                        "name": "",
                        "roas": undefined
                    }
                    $scope.listApiCall();
                })
                if ($rootScope.current_organization && $rootScope.current_account && $rootScope.current_bg) {
                    $scope.listApiCall();
                }

                $scope.query = {
                    order: 'campaignName',
                    limit: 50,
                    page: 1,
                    sortOrder: 'asc', //desc
                };

                $scope.editROAS = function(event, ROASData) {
                    event.stopPropagation(); // in case autoselect is enabled

                    var editDialog = {
                        modelValue: ROASData.roas,
                        placeholder: ROASData.roas,
                        save: function(input) {

                            if (input.$modelValue < 0.02 || isNaN(input.$modelValue)) {
                                input.$invalid = true;
                                return $q.reject();
                            }

                            var variation;
                            var message = "Click confirm to add ACOS";
                            ROASData.roasCopy = ROASData.roas; //This is show previous bid incase of failure
                            ROASData.roas = input.$modelValue;
                            $scope.incontextROAS = ROASData;
                            vm.showIncontextConfirmationDialog(event, message, "roasEdit");
                        },
                        targetEvent: event,
                        title: 'Edit ACOS value',
                        type: "text",
                        validators: {
                            'md-numeric': true
                        }
                    }

                    var promise = $mdEditDialog.large(editDialog);
                };
                 $scope.clearFilter = function() {
                     $scope.searchtext = "";
                }
                vm.showIncontextConfirmationDialog = function($event, message, actionType) {

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
                                case "roasEdit":
                                    $scope.selected = [];
                                    $scope.selected.push($scope.incontextROAS);
                                    vm.uploadROAS($scope.selected);
                                    break;
                                case "roasBulk":
                                    vm.uploadROAS($scope.selected);
                                    break;
                                case "roasAccount":
                                    vm.uploadAccountRoas($scope.accountRoasData);
                                    break;
                            }

                        }, function() {
                            $scope.selected = [];
                            if ($scope.incontextROAS) {
                                $scope.incontextROAS.roas = $scope.incontextROAS.roasCopy;
                            }
                            if ($scope.adminROASCampListCopy) {
                                $scope.adminROASCampList = $scope.adminROASCampListCopy;
                            }
                            if ($scope.accountRoasDataCopy) {
                                $scope.accountRoasData = $scope.accountRoasDataCopy;
                            }
                        });
                }

                vm.uploadAccountRoas = function(accountRoasData) {
                    //$rootScope.roasLoading = true;
                     var deferred = $q.defer();
                    $rootScope.deferred = deferred.promise;
                    var uploadFunction = AMSAdminRoasSettingService.updateAccountRoasSettingData($rootScope.current_organization.organizationId, $rootScope.current_bg.businessGroupId, $rootScope.current_account.amsAccountId, accountRoasData);
                    uploadFunction.then(function(response) {
                        $rootScope.roasLoading = false;
                        vm.message = "Successfully uploaded Account ACOS value."
                        $scope.selected = [];
                        $scope.showAcosEdit = !$scope.showAcosEdit;
                        $scope.accountRoasDataCopy = angular.copy(response.data);
                        AMSMessageService.showSuccessMessage(vm.message);
                        deferred.reject();
                    }).catch(function(response) {
                        $rootScope.roasLoading = false;
                        var errorMessage = "Error uploading Account ACOS Value. Please try later!!!"
                        AMSMessageService.showErrorMessage(errorMessage);
                        deferred.reject();
                    })
                }

                vm.uploadROAS = function(ROASData) {
                    var ROASUploadRequests = [];
                     var deferred = $q.defer();
                    $rootScope.deferred = deferred.promise;
                    //$rootScope.roasEditLoading = true;
                    angular.forEach(ROASData, function(item) {
                        ROASUploadRequests.push(item);
                    });
                    var uploadFunction = AMSAdminRoasSettingService.updateRoasSettingData($rootScope.current_organization.organizationId, $rootScope.current_bg.businessGroupId, $rootScope.current_account.amsAccountId, ROASUploadRequests);
                    uploadFunction.then(function(response) {
                        $rootScope.roasEditLoading = false;
                        vm.message = "Successfully uploaded " + $scope.selected.length + " ACOS value."
                        $scope.selected = [];
                        AMSMessageService.showSuccessMessage(vm.message);
                        deferred.reject();
                    }).catch(function(response) {
                        $rootScope.roasEditLoading = false;
                        var errorMessage = "Error uploading ACOS Value. Please try later!!!"
                        AMSMessageService.showErrorMessage(errorMessage);
                        deferred.reject();
                    })
                }
                $scope.searchtext = "";

                $scope.roasBulkEdit = function($event) {
                    var parentEl = angular.element(document.body);
                    $mdDialog.show({
                            parent: parentEl,
                            targetEvent: $event,
                            templateUrl: 'app/ams-admin/dialog/bulkEditDialog.html',
                            locals: {
                                selected: $scope.selected
                            },
                            controller: DialogController
                        })
                        .then(function(bulkEditValue) {
                            $scope.adminROASCampListCopy = angular.copy($scope.adminROASCampList);
                            $scope
                                .selected
                                .map(function(selectedValue) {
                                    if ($scope.adminROASCampList.indexOf(selectedValue.campaignId)) {
                                        selectedValue.roas = bulkEditValue;
                                    }
                                })
                            var message = "Click Confirm to save ACOS.";
                            vm.showIncontextConfirmationDialog(event, message, "roasBulk");
                        }, function() {});

                    function DialogController($scope, $mdDialog, $rootScope, selected) {
                        $scope.bulkEditValue = "";
                        $scope.editTitle = "ACOS";
                        $scope.selected = selected;
                        $scope.closeDialog = function() {
                            $mdDialog.cancel();
                        }
                        $scope.saveROAS = function() {
                            $mdDialog.hide($scope.bulkEditValue);
                        };
                    }
                };

                $scope.accountRoasUpdate = function(form) {
                    if (!form.$invalid) {
                        console.log("form.roas", form.roas)
                        var message = "Click Confirm to save Account ACOS.";
                        vm.showIncontextConfirmationDialog(event, message, "roasAccount");
                    }
                }
            
        }
    }
})();