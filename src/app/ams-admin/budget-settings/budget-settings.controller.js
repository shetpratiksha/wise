(function() {
    'use strict';

    angular
        .module('app.ams-admin-budget-settings')
        .controller('AmdAdminBudgetSettings', AmdAdminBudgetSettings);

    /* @ngInject */
    function AmdAdminBudgetSettings($cookies, $rootScope, $location, $scope,$timeout, $q, AMSMessageService, $mdEditDialog, $mdDialog, DynamicMenuService, AMSAdminBudgetSettingService) {
        var userDetails = $cookies.getObject('loggedInUser')
        if (userDetails == undefined) {
            $location.path('/login')
        } else {
            
                var vm = this;
                vm.isLoading = true;
                $rootScope.budgetLoading = true;
                $scope.selected = [];
                var d = new Date();
                $scope.year = d.getFullYear();
                $scope.years = [d.getFullYear() - 1, d.getFullYear(), d.getFullYear() + 1];
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
                    order: 'budget',
                    limit: 50,
                    page: 1,
                    sortOrder: 'asc', //desc
                };

                $scope.setCurrency = function() {
                    var account = $rootScope.current_account;
                    if (account.name == "earthlitede" || (account.name == "earthlitefr")) {
                        $scope.currency = "€"
                    } else if (account.name == "earthliteuk") {
                        $scope.currency = "£"
                    } else {

                        $scope.currency = "$";
                    }
                }

                $scope.checkLength = function() {
                    if ($scope.selected.length >= 1) {
                        return false;
                    } else {
                        return true;
                    }
                }

                $timeout(function(){
                    $scope.floatValue = { top: 0, useAbsolutePositioning: false };
                    $scope.floatEnable = true;
                },2000);

                $scope.dataForMonth = function(editValue, month) {
                    var budgetDate = moment(month + "1, " + $scope.year).format('YYYY-MM-DD')
                    return {
                        month: month,
                        edit: editValue,
                        budgetDate: budgetDate,
                        amsAccountId: $rootScope.current_account.amsAccountId

                    };
                }
                $scope.yearChanged = function() {
                    //$rootScope.budgetLoading = true;
                    $scope.listApiCall();
                }
                $scope.monthCalc = function(year) {
                    var monthData = ('January February March April May June July August September October November December')
                        .split(' ')
                        .map(function(month, index) {
                            var currentYear = d.getFullYear();
                            var currentMonth = d.getMonth();
                            if (year >= currentYear) {
                                // if (currentMonth > index && year == currentYear) {
                                //     return $scope.dataForMonth(false, month);
                                // } else {
                                return $scope.dataForMonth(true, month);
                                // }
                            } else {
                                return $scope.dataForMonth(false, month);
                            }
                        })

                    $scope.budgetData = monthData.map(function(data, index) {
                        var loopData = data;
                        $scope.adminBudgetData.map(function(da) {
                            var date = new Date(da.budgetDate);
                            if (date.getMonth() == index) {
                                loopData.budget = da.budget;
                                loopData.budgetId = da.budgetId;
                            }
                        })
                        return loopData;
                    })
                }

                $scope.listApiCall = function() {
                     var deferred = $q.defer();
                    $rootScope.deferred = deferred.promise;
                    var getRoasDataFunc = AMSAdminBudgetSettingService.getBudgetSettingData(
                        $rootScope.current_organization.organizationId,
                        $rootScope.current_bg.businessGroupId,
                        $rootScope.current_account.amsAccountId,
                        $scope.year);
                    getRoasDataFunc.then(function(response) {
                        $scope.adminBudgetData = response.data;
                        vm.isLoading = false;
                        $rootScope.budgetLoading = false;
                        $scope.monthCalc($scope.year);
                        deferred.reject();
                    }).catch(function(response) {
                        vm.isLoading = false;
                        $rootScope.budgetLoading = false;
                        vm.loadingError = "Error displaying ROAS. Please try later!!!";
                        deferred.reject();
                    })
                }

                $scope.$on('org_acc_loaded', function() {
                    vm.isLoading = true;
                    $rootScope.budgetLoading = true;
                    vm.loadingError = false;
                    DynamicMenuService.addDynamicMenu($rootScope.current_organization.organizationId);
                    $scope.listApiCall();
                    $scope.setCurrency();
                })
                if ($rootScope.current_organization && $rootScope.current_account && $rootScope.current_bg) {
                    $scope.listApiCall();
                }

                $scope.editBudget = function(event, budgetData) {
                    if (budgetData.edit) {
                        event.stopPropagation(); // in case autoselect is enabled

                        var editDialog = {
                            modelValue: budgetData.budget,
                            placeholder: budgetData.budget,
                            save: function(input) {
                                if (input.$modelValue < 0.02 || isNaN(input.$modelValue)) {
                                    input.$invalid = true;
                                    return $q.reject();
                                }
                                var variation;
                                var message = "Click confirm to add new budget";
                                $scope.isIncontext = true;
                                budgetData.budgetCopy = budgetData.budget; //This is show previous bid incase of failure
                                budgetData.budget = input.$modelValue;
                                $scope.incontextBudget = budgetData;
                                vm.showIncontextConfirmationDialog(event, message, "budgetEdit");
                            },
                            targetEvent: event,
                            title: 'Edit budget value',
                            type: "text",
                            validators: {
                                'md-numeric': true
                            }
                        }

                        var promise = $mdEditDialog.large(editDialog);
                    }
                };

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
                                case "budgetEdit":
                                    $scope.selected = [];
                                    $scope
                                        .selected
                                        .push($scope.incontextBudget);
                                    vm.uploadbudget($scope.selected);
                                    break;
                                case "budgetBulk":
                                    vm.uploadbudget($scope.selected);
                                    break;
                            }
                        }, function() {
                            $scope.selected = [];
                            if ($scope.incontextBudget) {
                                $scope.incontextBudget.budget = $scope.incontextBudget.budgetCopy;
                            }
                            if ($scope.budgetDataCopy) {
                                $scope.budgetData = $scope.budgetDataCopy;
                            }
                        });
                }

                vm.uploadbudget = function(budgetData) {
                    var budgetUploadRequests = [];
                     var deferred = $q.defer();
                    $rootScope.deferred = deferred.promise;
                    //$rootScope.budgetEditLoading = true;
                    angular.forEach(budgetData, function(item) {
                        budgetUploadRequests.push(item);
                    });
                    var uploadFunction = AMSAdminBudgetSettingService.updateBudgetSettingData($rootScope.current_organization.organizationId, $rootScope.current_bg.businessGroupId, $rootScope.current_account.amsAccountId, budgetUploadRequests);
                    uploadFunction.then(function(response) {
                        $rootScope.budgetEditLoading = false;
                        vm.message = "Successfully uploaded " + $scope.selected.length + " Budget value."
                        $scope.selected = [];
                        AMSMessageService.showSuccessMessage(vm.message);
                        $scope.updateWithResponse(response.data);
                        deferred.reject();
                    }).catch(function(response) {
                        $rootScope.budgetEditLoading = false;
                        var errorMessage = "Error uploading Budget Value. Please try later!!!"
                        AMSMessageService.showErrorMessage(errorMessage);
                        deferred.reject();
                    })
                }

                $scope.updateWithResponse = function(response) {
                    var monthNames = ["January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"
                    ];
                    response.map(function(res) {
                        var date = new Date(res.budgetDate);
                        res.month = monthNames[date.getMonth()];
                        $scope.budgetData.map(function(data) {
                            if (data.month == res.month) {
                                data.budgetId = res.budgetId;
                            }
                        })
                    })
                }

                $scope.budgetBulkEdit = function($event) {
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
                            $scope.budgetDataCopy = angular.copy($scope.budgetData);
                            $scope
                                .selected
                                .map(function(selectedValue) {
                                    if ($scope.budgetData.indexOf(selectedValue.month)) {
                                        selectedValue.budget = bulkEditValue;
                                    }
                                })
                            var message = "Click Confirm to save budget.";
                            vm.showIncontextConfirmationDialog(event, message, "budgetBulk");
                        }, function() {});

                    function DialogController($scope, $mdDialog, $rootScope, selected) {
                        $scope.bulkEditValue = "";
                        $scope.editTitle = "Budget";
                        $scope.selected = selected;
                        $scope.closeDialog = function() {
                            $mdDialog.cancel();
                        }
                        $scope.saveROAS = function() {
                            $mdDialog.hide($scope.bulkEditValue);
                        };
                    }
                };
            
        }
    }
})();