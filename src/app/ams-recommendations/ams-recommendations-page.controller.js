(function() {
    'use strict';

    angular
        .module('app.ams-recommendations')
        .controller('AMSSPBidRecommendationsController', AMSSPBidRecommendationsController)

    /* @ngInject */
    function AMSSPBidRecommendationsController($location, $cookies, $rootScope, $scope, $mdDialog, AMSDataService, AMSRecommendationDataService, $timeout, $mdEditDialog, $mdToast, DynamicMenuService, AMSMessageService, $q, $filter, DateRangeService, $mdDateRangePicker) {

        var vm = this;

        vm.isLoading = true;
        $scope.selected = [];
        $scope.limitOptions = [50,75,100];
        $scope.getTotalSel = [];
        $scope.showStatus = false; //Shows status column incase multi status response from AMS

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

        vm.uploadStatus = {
            CAMPAIGN_ARCHIVED: "CAMPAIGN ARCHIVED",
            INVALID_KEYWORD: "INVALID KEYWORD",
            INVALID_KEYWORD_BID: "INVALID KEYWORD BID",
            UPDATE_FAILED: "BID UPDATE FAILED",
            INVALID_CAMPAIGN: "INVALID CAMPAIGN",
            KEYWORD_TEXT_MISSING: "KEYWORD TEXT MISSING",
            INVALID_ADGROUP_ID: "INVALID ADGROUP ID",
            INVALID_MATCH_TYPE: "INVALID MATCH TYPE",
            INVALID_STATE: "INVALID STATE",
            DUPLICATE_KEYWORD: "DUPLICATE_KEYWORD"
        }

        $scope.query = {
            order: '-revenue',
            limit: 50,
            page: 1,
            sortOrder: 'asc', //desc
        };

        $scope.isIncontext = true; //By default, its in context editing
        $rootScope.disableDTSorting = true;
        $timeout(function(){
            $scope.floatValue = { top: 0, useAbsolutePositioning: false };
            $scope.floatEnable = true;
        },2000);
        
        $scope.oMessage;

        $scope.filters = [];
        $scope.loadBidsForChangedDates = function(date) {
            $scope.setDates(date);
            //$rootScope.isPaginated = true;
            $scope.loadKeywordBids(1, $scope.query.order);
        }
        $scope.selectedDate = function($dates) {

            $scope.dateRange.startDate = $dates.dateStart;
            $scope.dateRange.endDate = $dates.dateEnd;

            $scope.displayDateRangeText = moment($scope.dateRange.startDate.getTime()).format("MMM DD") + " - " + moment($scope.dateRange.endDate.getTime()).format("MMM DD")

            //$rootScope.isPaginated = true;
            $scope.loadKeywordBids(1, $scope.query.order);
        }

        $scope.setDates = function(date) {
            var today = new Date();
            var endDate = new Date();
            endDate = endDate.setDate(today.getDate() - 0)
            $scope.displayDateRangeText = date;
            var startDate;
            if (date == 'Last 7 days') {
                startDate = today.setDate(today.getDate() - 7)

            } else if (date == 'Last 14 days') {
                startDate = today.setDate(today.getDate() - 14)

            } else if (date == 'Last 30 days') {
                startDate = today.setDate(today.getDate() - 30)

            } else if (date == 'Current Month') {
                startDate = DateRangeService.getMonthStart();

            } else if (date == 'Previous Month') {
                startDate = DateRangeService.getLastMonthStart();
                endDate = DateRangeService.getLastMonthEnd();
            } else if (date == 'custom') {
                $scope.selectDateRange();
            }

            $scope.dateRange = {
                'startDate': new Date(startDate),
                'endDate': new Date(endDate)
            }
        }

        $scope.selectDateRange = function() {
            $scope.serviceModel = {
                dateStart: $scope.dateRange.startDate,
                dateEnd: $scope.dateRange.endDate,
            };
            $mdDateRangePicker.show({
                model: $scope.serviceModel,
                autoConfirm: false,
                showTemplate: false,
                onePanel: true,
                class: "custom",
                onComplete: function afterShowAnimation() {
                    var $dialog = angular.element(document.querySelector('md-dialog'));
                    angular.element($dialog).addClass('date-range-dialog');

                },
                isDisabledDate: function(t) {
                    var d = new Date(new Date(t).setDate(new Date(t).getDate() + 60));
                    var prev_60_days = d.getTime() < new Date().getTime();
                    var futureTime = t.getTime() > new Date().getTime();
                    return (futureTime || prev_60_days);
                }
            }).then(function(result) {
                $scope.selectedDate(result);

            }).catch(function() {
                console.log('Cancelled');
            });
        }

        $scope.setDates('Last 14 days');

        $scope.operators = [
            { display: "=", value: "EQUAL" },
            { display: "!=", value: "NOT_EQUAL" },
            { display: "<", value: "LESS_THAN" },
            { display: "<=", value: "LESS_THAN_OR_EQUAL" },
            { display: ">", value: "GREATER_THAN" },
            { display: ">=", value: "GREATER_THAN_OR_EQUAL" },
        ]

        $scope.textOperators = [
            { display: "Contains", value: "CONTAINS" },
            { display: "Does Not Contains", value: "DOES_NOT_CONTAIN" }
        ]
        $scope.matchType = [
            { display: "Exact", value: "EXACT" },
            { display: "Broad", value: "BROAD" },
            { display: "Phrase", value: "PHRASE" }
        ]


        $scope.isIncontext = true; //By default, its in context editing
        $rootScope.disableDTSorting = true;

        $scope.chips = [];

        $scope.loadKeywordBids = function(pageNo, sortBy) {
            var deferred = $q.defer();
            vm.loadingError = ''
            $scope.showStatus = false;
            $scope.selected = [];
            $rootScope.deferred = deferred.promise;
            var getRecommendations = AMSRecommendationDataService.getKeywordBids($rootScope.current_organization.organizationId, $rootScope.current_account.amsAccountId, pageNo, $scope.query.limit, sortBy, $scope.filters, $scope.dateRange);

            getRecommendations.then(function(data) {

                $scope.query.page = pageNo;
                $scope.query.order = sortBy;

                $scope.query.total = data.totalElements;
                $scope.query.page = (data.number + 1);
                if (data.content == 0) {
                    $scope.copyMessage = $scope.oMessage
                    $scope.oMessage = "No Sponsored keywords or recommendations available."
                } else {
                    $scope.oMessage = $scope.copyMessage;
                }

                $scope.originalKeywordSet = data.content;
                /*
	        	if($scope.query.page > 1) {
	        		Array.prototype.push.apply($scope.originalKeywordSet, data.content);
	        	} else {
	        		$scope.originalKeywordSet = data.content;	
	        	}
				*/
                $scope.keywordBids = $scope.originalKeywordSet;

                deferred.reject();
                $rootScope.isContentLoading = false;
                //$rootScope.isPaginated = false;

            }).catch(function() {
                deferred.reject();
                $rootScope.isContentLoading = false;
                //$rootScope.isPaginated = false;
                vm.loadingError = "Error displaying keyword bids. Please try later!!!"
            })
        }

        $scope.onPaginationChange = function(page, limit) {
            //$rootScope.isPaginated = true;
            $scope.query.limit = limit;
            $scope.loadKeywordBids(page, $scope.query.order);
            $scope.query.page = page;
        }

        $scope.showLoader = function() {

            //$rootScope.isPaginated = true;
        }

        $scope.onReorder = function(order) {
            // $timeout(function() {
            //     $rootScope.isPaginated = true;
            // }, 200);

            $scope.originalKeywordSet = [];

            $scope.query.page = 1
            $scope.currentPage = 1
            $scope.loadKeywordBids($scope.query.page, order);
        }

        $scope.setOverviewMessage = function() {

            var getRecommendationSummary = AMSRecommendationDataService.getRecommendationSummary($rootScope.current_organization.organizationId, $rootScope.current_account.amsAccountId);

            getRecommendationSummary.then(function(response) {

                var totalRecommendedBids = response.data.totalRecommendedBids;
                var updatedRecommendedBids = response.data.totalRecommendedBidUpdates;

                if (totalRecommendedBids != undefined && totalRecommendedBids > 0) {
                    if (updatedRecommendedBids == undefined || updatedRecommendedBids == 0) {

                        $scope.oMessage = totalRecommendedBids + " recommendations available for " + $rootScope.current_account.displayName;
                    } else {
                        $scope.oMessage = updatedRecommendedBids + " out of " + totalRecommendedBids + " recommended bids updated, " + (totalRecommendedBids - updatedRecommendedBids) + " recommendations pending"
                    }
                }
                $scope.copyMessage = $scope.oMessage

            }).catch(function() {
                $rootScope.isContentLoading = false;
                //$rootScope.isPaginated = false;
                vm.loadingError = "Error displaying keyword bids. Please try later!!!"
            })
        }


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

        $scope.loadCampaigns = function() {
            var campaignsFn = AMSDataService.getCampaigns($rootScope.current_organization.organizationId, $rootScope.current_bg.businessGroupId, $rootScope.current_account.amsAccountId);

            campaignsFn.then(function(data) {

                $scope.campaigns = data;
                $scope.originalCampaignsCopy = $scope.campaigns;

            }).catch(function() {
                $scope.campaigns = "error";
            })
        }

        if ($rootScope.current_organization != undefined) {
            $scope.setCurrency();
            $rootScope.isContentLoading = true;
            $scope.setOverviewMessage();
            $scope.loadCampaigns();
            $scope.loadKeywordBids($scope.query.page, $scope.query.order);
        }

        $scope.$on('org_acc_loaded', function() {
            $scope.setCurrency();
            $scope.query.page = 1;
            DynamicMenuService.addDynamicMenu($rootScope.current_organization.organizationId);
            $rootScope.isContentLoading = true;
            $scope.setOverviewMessage();
            $scope.loadCampaigns();
            $scope.loadKeywordBids($scope.query.page, $scope.query.order);
        })

        $scope.$on('left-nav-changed', function(event, menu) {

            $scope.menu = menu;
        })
        

        $scope.downloadData = function() {

            $scope.headers = ["Keyword", "Campaign", "Match Type", "Current Bid", "Reco. Bid", "Spend", "Revenue", "ROAS", "ACOS", "Bids Updated Date"];
            
            AMSMessageService.showInfoMessage("Report download is in progress...");
            AMSRecommendationDataService.getKeywordBids($rootScope.current_organization.organizationId, $rootScope.current_account.amsAccountId, 1, 10000000, $scope.query.order, $scope.filters, $scope.dateRange).then(function(data) {
                
                var content = data.content;
                
                $scope.keywordCSVData = [];
                angular.forEach(content, function(bid) {

                    var kbid = {
                        "Keyword": bid.keywordText,
                        "Campaign": bid.campaign,
                        "Match Type": bid.matchType,
                        "Current Bid": bid.currentBid,
                        "Reco. Bid": bid.recommendedBid,
                        "Spend": bid.spend,
                        "Revenue": bid.revenue,
                        "ROAS": bid.roas,
                        "ACOS": bid.acos,
                        "Bids Updated Date": bid.updatedDate
                    }
                    $scope.keywordCSVData.push(kbid);
                })
                $timeout(function() {
                    angular.element('#csv-data').triggerHandler('click');
                }, 1000);
                
            });

        }

        $scope.editBid = function(event, keywordBid) {
            event.stopPropagation(); // in case autoselect is enabled

            var editDialog = {
                modelValue: keywordBid.currentBid,
                placeholder: keywordBid.currentBid,
                save: function(input) {

                    if (input.$modelValue < 0.02 || isNaN(input.$modelValue)) {
                        input.$invalid = true;
                        return $q.reject();
                    }

                    var variation;
                    var message;
                    if (keywordBid.recommendedBid != null || keywordBid.recommendedBid != undefined) {
                        variation = Math.abs(keywordBid.defaultBid - input.$modelValue);

                        if (variation > (keywordBid.recommendedBid * .30)) {

                            if (keywordBid.recommendedBid - input.$modelValue > 0) {
                                message = 'Entered value is 30% less than the recommended bid. Click confirm to upload the keyword to AMS';
                            } else {
                                message = 'Entered value is 30% more than the recommended bid. Click confirm to upload the keyword to AMS';
                            }
                        } else {
                            message = "Keyword bid will be uploaded to AMS. Click Confirm to continue."
                        }
                    } else {

                        variation = Math.abs(keywordBid.currentBid - input.$modelValue);

                        if (variation > (keywordBid.currentBid * .30)) {

                            if (keywordBid.currentBid - input.$modelValue > 0) {
                                message = 'Entered value is 30% less than the current bid. Click confirm to upload the keyword to AMS';
                            } else {
                                message = 'Entered value is 30% more than the current bid. Click confirm to upload the keyword to AMS';
                            }
                        } else {
                            message = "Keyword bid will be uploaded to AMS. Click Confirm to continue."
                        }
                    }

                    $scope.isIncontext = true;

                    keywordBid.currentBidCopy = keywordBid.currentBid; //This is show previous bid incase of failure
                    keywordBid.currentBid = input.$modelValue;
                    $scope.incontextKeywordBid = keywordBid;

                    vm.showIncontextConfirmationDialog(event, message);
                },
                targetEvent: event,
                title: 'Edit Bid Bid',
                min: "0.02",
                step: "0.01",
                type: "text",
                validators: {
                    'md-numeric': true
                }
            }

            var promise = $mdEditDialog.large(editDialog);

        }

        vm.showIncontextConfirmationDialog = function($event, message) {

            var confirm = $mdDialog.confirm({
                    onComplete: function afterShowAnimation() {
                        var $dialog = angular.element(document.querySelector('md-dialog'));
                        var $actionsSection = $dialog.find('md-dialog-actions');
                        var $cancelButton = $actionsSection.children()[0];
                        var $confirmButton = $actionsSection.children()[1];
                        angular.element($confirmButton).addClass('md-raised md-accent');

                    }
                })
                .textContent(message)
                .ok("CONFIRM")
                .cancel("CANCEL")
                .targetEvent($event);

            $mdDialog.show(confirm).then(function() {
                $scope.selected = [];
                $scope.selected.push($scope.incontextKeywordBid);
                vm.uploadBids($scope.selected);
            }, function() {
                $scope.incontextKeywordBid.currentBid = $scope.incontextKeywordBid.currentBidCopy;
            });
        }

        vm.uploadRecommendedBid = function($event) {

            if ($scope.selected.length > 0) {
                var message = $scope.selected.length + " keyword bids will be uploaded to AMS. Click Confirm to continue."
                vm.showIncontextConfirmationDialog($event, message);
            } else {

                AMSMessageService.showErrorMessage("None of the selected Bids have any recommendations");
            }
        }

        $scope.itsBulkEdit = function(keywordBid) {
            $scope.isIncontext = false;
        }


        vm.uploadBids = function(keywordBids) {
            var deferred = $q.defer();
            //$rootScope.uploadingBids = true;
            $rootScope.deferred = deferred.promise;
            //$rootScope.isPaginated = true;
            var keywordBidUploadRequests = [];

            angular.forEach(keywordBids, function(item) {

                var keywordRequest = {
                    "keywordId": item.keywordId,
                    "keywordText": item.keyword,
                    "bid": item.currentBid,
                    "adGroupId": item.adGroupId,
                    "matchType": item.matchType,
                    "state": item.state,
                    "campaignId": item.campaignId,
                    "id": item.id
                }

                keywordBidUploadRequests.push(keywordRequest);

            });

            var uploadFunction = AMSRecommendationDataService.updateRecommededKeywordBids($rootScope.current_organization.organizationId,
                $rootScope.current_bg.businessGroupId, $rootScope.current_account.amsAccountId, keywordBidUploadRequests);

            uploadFunction.then(function(response) {

                var status = response.status;

                var data = response.data;

                if (status == 207) { //Handling multi status response code.
                    $scope.showStatus = true;
                    $rootScope.uploadingBids = false;

                    if ($scope.selected.length - data.length == 0) {
                        vm.error = data.length + " keyword(s) upload failed. Look at the inidividual records for failure"
                    } else {
                        vm.error = "Out of " + $scope.selected.length + ", " + ($scope.selected.length - data.length) + " were uploaded but " + data.length + " keyword(s) failed. Look at the inidividual records for failure"
                    }

                    AMSMessageService.showErrorMessage(vm.error);
                    $scope.new_selected = [];
                    angular.forEach($scope.selected, function(keywordBid, index) {

                        var failedKeywordFound = false;
                        angular.forEach(data, function(failedKeyword) {

                            if (failedKeyword.keywordId == keywordBid.keywordId) {

                                keywordBid.status = vm.uploadStatus[failedKeyword.status];
                                keywordBid.currentBid = keywordBid.currentBidCopy

                                keywordBid.updatedDate = new Date().getTime();
                                failedKeywordFound = true;
                                $scope.new_selected.push(keywordBid)
                            }
                        })

                        if (!failedKeywordFound) {
                            keywordBid.updatedStatus = 'UPDATED';
                            keywordBid.status = ''
                        } else {
                            keywordBid.currentBidCopy = keywordBid.currentBid;
                        }
                    });

                    $scope.selected = $scope.new_selected;

                } else if (status == 201) {

                    angular.forEach($scope.selected, function(keywordBid) {

                        keywordBid.updatedStatus = 'UPDATED';
                        keywordBid.status = ''
                        keywordBid.updatedDate = new Date().getTime();
                        keywordBid.currentBidCopy = keywordBid.currentBid;
                    });

                    $rootScope.uploadingBids = false;
                    vm.message = "Successfully uploaded " + $scope.selected.length + " keyword bids."
                    $scope.selected = [];
                    AMSMessageService.showSuccessMessage(vm.message);
                } else {
                    $rootScope.uploadingBids = false;
                    vm.error = "Error uploading bids. Please try later!!!"

                    AMSMessageService.showErrorMessage(vm.error);
                }
                //$rootScope.isPaginated = false;
                deferred.reject();
            }).catch(function(response) {

                angular.forEach($scope.selected, function(keywordBid) { //Reset Bids

                    keywordBid.currentBid = keywordBid.currentBidCopy
                })
                deferred.reject();
                $rootScope.uploadingBids = false;
                vm.error = "Error uploading bids. Please try later!!!"
                AMSMessageService.showErrorMessage(vm.error);
                //$rootScope.isPaginated = false;
            })
        }


        //********************** All Filters are managed here **********//
        $scope.originalCampaignsCopy;
        $scope.showFilterByCampaigns = function($event) {
            $scope.getTotalSel = [];
            var parentEl = angular.element(document.querySelector('#filterOptions'));

            if ($scope.originalCampaignsCopy == undefined) {
                $scope.originalCampaignsCopy = $scope.campaigns;
            }

            $scope.campaignsCopy = angular.copy($scope.originalCampaignsCopy);

            angular.forEach($scope.campaignsCopy, function(campaignCopy) {
                var found = false;
                angular.forEach($scope.selectedCampaignIds, function(campaignId) {

                    if (campaignCopy.campaignId == campaignId) {
                        found = true;
                    }
                })

                if (found) {
                    campaignCopy.checked = true;
                } else {
                    campaignCopy.checked = false;
                }

            })

            $mdDialog.show({
                scope: $scope,
                parent: parentEl,
                targetEvent: $event,
                template: '<md-dialog class="campaign-large-dialog">' +
                    '<md-toolbar style="background-color: #fff">' +
                    '<div class="md-toolbar-tools">' +
                    '<md-checkbox class="selectAllCheck" ng-model="isAllSelected" aria-label="Select All" ng-click="toggleSelctAll();" >' +
                    '</md-checkbox>' +
                    '<input type="text" placeholder="Search campaigns..."  class="pop-search-input" ng-model="filtertext" ng-blur="searchSelection();">' +
                    '</div>' +
                    '</md-toolbar>' +
                    '<md-dialog-content>' +
                    '<div layout="row" ng-repeat="campaign in campaignsCopy | filter:filtertext as filtered">' +
                    '<md-checkbox  ng-model="campaign.checked" ng-click="toggleSelect(campaign,$index)" ng-true-value="true" ng-false-value="false">{{campaign.name}}</md-checkbox>' +
                    '</div>' +
                    '</md-dialog-content>' +
                    '<md-dialog-actions style="border-top: 1px solid lightgray">' +
                    '<div ng-show="campaignError" class="error-msg campaignError">{{campaignError}}</div>' +
                    '<div class="listCount" ng-if="!showActions">{{filtered.length}} Campaign(s) available</div>' +
                    '<div class="listCount" ng-if="showActions">{{getTotalSel.length}} Campaign(s) selected</div>' +
                    '<md-button ng-click="closeFilter()" class="md-primary md-confirm-button md-button md-ams-theme-theme md-ink-ripple">' +
                    'Cancel' +
                    '</md-button>' +
                    '<md-button ng-click="filterByCampaign()" class="md-primary md-confirm-button md-button md-ams-theme-theme md-ink-ripple md-raised md-accent">' +
                    'Filter' +
                    '</md-button>' +
                    '</md-dialog-actions>' +
                    '</md-dialog>',
                title: 'Filter By Campaigns',
                controller: function() { return vm; },
                clickOutsideToClose: true,
                preserveScope: true
            });
        }

        //Select all function
        $scope.toggleSelctAll = function() {
            $scope.toggleStatus = !$scope.isAllSelected;
            $scope.showActions = !$scope.isAllSelected;
            $scope.getTotalSel = [];
            angular.forEach($scope.filtered, function(campaign) {
                campaign.checked = $scope.toggleStatus;
                if (campaign.checked) {
                    $scope.getTotalSel.push(campaign);
                } else {
                    $scope.getTotalSel.splice(campaign, 1);
                }
            });
        }


        // Single Select check
        $scope.toggleSelect = function(item, index) {
            if (item.checked) {
                var unselectItem = $scope.getTotalSel.indexOf(item);
                $scope.getTotalSel.splice(unselectItem, 1);
            } else if(angular.isUndefined(item.checked)){
                 $scope.getTotalSel.push(item);
            }else {
                $scope.getTotalSel.push(item);
            }
             console.log($scope.getTotalSel);
            $scope.verifyMessage();
        }
        $scope.verifyMessage  = function(){
            if($scope.getTotalSel.length === $scope.filtered.length){
                $scope.isAllSelected = true;
            }
            else{
                $scope.isAllSelected = false;
            }
            $scope.controlMessage();
        }
        // Enable Messange based on selected length
        $scope.controlMessage = function() {
            if ($scope.getTotalSel.length > 0) {
                $scope.showActions = true;
            } else {
                $scope.showActions = false;
            }
        }
        $scope.filterByCampaign = function() {
            var selectedCampaignIds = [];
            var selectedCampaignNames = []
            angular.forEach($scope.campaignsCopy, function(campaign) {
                if (campaign.checked == true) {
                    selectedCampaignIds.push(campaign.campaignId + '');
                    selectedCampaignNames.push(campaign.name)
                }
            });

            if (selectedCampaignIds.length == 0) {
                $scope.campaignError = "Select atleast one campaign to apply the filter";
                $timeout(function() {
                    $scope.campaignError = false;
                }, 4000);
                return;
            }

            if (selectedCampaignNames.length > 2) {
                selectedCampaignNames.splice(2)
                selectedCampaignNames[1] = selectedCampaignNames[1] + ", +" + (selectedCampaignIds.length - 2) + "more"

            }

            var filter = {
                name: "campaignId",
                value: selectedCampaignIds,
                operator: "EQUAL",
            }

            var chip = {
                name: "CAMPAIGNS",
                operator: "=",
                value: selectedCampaignNames.join(", ")
            }

            //$scope.filters = [];
            $scope.filters = $scope.removeObject($scope.filters, "campaignId");
            $scope.chips = $scope.removeObject($scope.chips, "CAMPAIGNS");
            $scope.filters.push(filter);
            $scope.chips.push(chip);
            $mdDialog.cancel();
            //$rootScope.isPaginated = true;
            $scope.loadKeywordBids(1, $scope.query.order)
        }

        $scope.removeObject = function(array, key) {
            return array.filter(function(obj) {

                return obj.name != key
            });
        }

        $scope.closeFilter = function() {
            angular.element(document.querySelector('input')).removeClass("error-border");
            $scope.showActions = false;
            $scope.getTotalSel = [];
            $scope.campaignCopy = $scope.originalCampaignsCopy;
            $mdDialog.cancel();
        }

        /*---------Filter Func for Keywords------------*/

        $scope.showFilterByText = function(filterType) {
            $scope.modelName = filterType.replace('Text', '');
            $scope.filterType = filterType;
            $scope.filterErrorMsg = undefined;
            $scope.filterError = false;
            $scope.filterValue = '';
            $scope.selectedTextOperator = 'CONTAINS';
            var parentEl = angular.element(document.querySelector('#filterOptions'));
            $mdDialog.show({
                scope: $scope,
                parent: parentEl,
                template: '<form novalidate>' +
                    '<md-dialog class="keyword-filter-dialog">' +
                    '<md-toolbar class="md-accent popup-tool-bar" >' +
                    '<div class="md-toolbar-tools" style="font-size: 14px;padding-left:0px">' +
                    'BY {{modelName | uppercase}}' +
                    '</div>' +
                    '</md-toolbar>' +
                    '<md-dialog-content>' +
                    '<div layout="row">' +
                    '<md-select ng-model="selectedTextOperator" data-md-container-class="selectdemoSelectHeader">' +
                    '<md-option ng-value="contain.value" ng-repeat="contain in textOperators">{{contain.display}}</md-option>' +
                    '</md-select>' +
                    '<input type="text" placeholder="Enter the Keyword"  class="pop-filter-input" ng-class="{\'error-border\': error, \'pop-input-border\': error == undefined || error==\'\'}" ng-model="filterValue" />' +
                    '</div>' +
                    '</md-dialog-content>' +
                    '<div class="error-msg" ng-if="filterError">{{filterErrorMsg}}</div>' +
                    '<md-dialog-actions style="border:none">' +
                    '<md-button ng-click="closeFilter()" class="md-primary md-confirm-button md-button md-ams-theme-theme md-ink-ripple">' +
                    'Cancel' +
                    '</md-button>' +
                    '<md-button ng-click="applyTextFilter()" class="md-primary md-confirm-button md-button md-ams-theme-theme md-ink-ripple md-raised md-accent">' +
                    'Filter' +
                    '</md-button>' +
                    '</md-dialog-actions>' +
                    '</md-dialog>' +
                    '</form>',
                controller: function() { return vm; },
                clickOutsideToClose: true,
                preserveScope: true
            });
        }
        $scope.showMatchTypeFilter = function(filterType){
            $scope.filterType = filterType;
            $scope.filterErrorMsg = undefined;
            $scope.filterError = false;
            $scope.filterValue = '';
            $scope.selectedTextOperator = [];
            var parentEl = angular.element(document.querySelector('#filterOptions'));
            $mdDialog.show({
                scope: $scope,
                parent: parentEl,
                template: '<form novalidate>' +
                    '<md-dialog class="matchType-filter-dialog">' +
                    '<md-toolbar class="md-accent popup-tool-bar" >' +
                    '<div class="md-toolbar-tools" style="font-size: 14px;padding-left:0px">' +
                    'BY {{filterType | uppercase}}' +
                    '</div>' +
                    '</md-toolbar>' +
                    '<md-dialog-content>' +
                    '<div layout="row" ng-repeat="matches in matchType">' +
                    // '<md-select ng-model="selectedTextOperator" data-md-container-class="selectdemoSelectHeader" multiple>'+
                    //   '<md-optgroup>'+
                    //    '<md-option ng-value="matches.value" ng-repeat="matches in matchType">{{matches.display}}</md-option>'+
                    //   '</md-optgroup>'+
                    //   '</md-select>'+
                      '<md-checkbox ng-checked="exists(matches, selectedTextOperator)" ng-click="toggle(matches, selectedTextOperator)">'+
                        '{{matches.display}}'+
                      '</md-checkbox>'+
                    '</div>' +
                    '</md-dialog-content>' +
                    '<div class="error-msg" ng-if="filterError">{{filterErrorMsg}}</div>' +
                    '<md-dialog-actions style="border:none">' +
                    '<md-button ng-click="closeFilter()" class="md-primary md-confirm-button md-button md-ams-theme-theme md-ink-ripple">' +
                    'Cancel' +
                    '</md-button>' +
                    '<md-button ng-click="applyMatchFilter()" class="md-primary md-confirm-button md-button md-ams-theme-theme md-ink-ripple md-raised md-accent">' +
                    'Filter' +
                    '</md-button>' +
                    '</md-dialog-actions>' +
                    '</md-dialog>' +
                    '</form>',
                controller: function() { return vm; },
                clickOutsideToClose: true,
                preserveScope: true
            });
        }
       $scope.toggle = function (item, list) {
        var idx = list.indexOf(item);
        if (idx > -1) {
          list.splice(idx, 1);
        }
        else {
          list.push(item);
        }
      };

      $scope.exists = function (item, list) {
        return list.indexOf(item) > -1;
      };
        $scope.applyMatchFilter = function(){
            var filterValues = [];
           if($scope.selectedTextOperator.length == 0){
                $scope.filterError = true;
                $scope.filterErrorMsg = "Please Choose values";
                $timeout(function() {
                    $scope.filterError = false;
                }, 4000);
           }else{
                var filterValues = [];
                angular.forEach($scope.selectedTextOperator,function(matchType){
                    filterValues.push(matchType.value);
                });
                var filter = {
                    name: $scope.filterType,
                    value: filterValues
                };

                var chip = {
                    name: $scope.filterType.toUpperCase(),
                    value: filterValues.toString()
                };
                if ($scope.filters.length > 0) {
                    $scope.filters = $scope.removeObject($scope.filters, $scope.filterType);
                    $scope.chips = $scope.removeObject($scope.chips, $scope.filterType.toUpperCase());
                }
                $scope.chips.push(chip);
                $scope.filters.push(filter);
                $mdDialog.cancel();
                //$rootScope.isPaginated = true;
                $scope.loadKeywordBids(1, $scope.query.order);
            }
        }
        $scope.applyTextFilter = function() {
            if ($scope.filterValue == '' || angular.isUndefined($scope.filterValue)) {
                $scope.filterError = true;
                $scope.filterErrorMsg = "Enter Valid value";
                $timeout(function() {
                    $scope.filterError = false;
                }, 4000);
                return;
            } else {
                if($scope.filterType == 'keywordText'){
                    $scope.selectedTxtOperator = '';
                    angular.forEach($scope.textOperators, function(txtOperator) {
                        if (txtOperator.value == $scope.selectedTextOperator) {
                            $scope.selectedTxtOperator = txtOperator.value;
                        }
                    });
                }  

                var filterValues = [];
                filterValues.push($scope.filterValue);
                var filter = {
                    name: $scope.filterType,
                    value: filterValues,
                    operator: $scope.selectedTxtOperator
                };

                var chip = {
                    name: $scope.modelName.toUpperCase(),
                    operator: $scope.selectedTextOperator,
                    value: $scope.filterValue
                };
                if ($scope.filters.length > 0) {
                    $scope.filters = $scope.removeObject($scope.filters, $scope.filterType);
                    $scope.chips = $scope.removeObject($scope.chips, $scope.modelName.toUpperCase());
                }
                $scope.chips.push(chip);
                $scope.filters.push(filter);
                $mdDialog.cancel();
                //$rootScope.isPaginated = true;
                $scope.loadKeywordBids(1, $scope.query.order);
            }
        }

        $scope.showCommonFilter = function(filterType) {
            $scope.filterType = filterType;
            $scope.error = undefined;
            //$scope.selectedOperator = {};

            $scope.filterErrorMsg = undefined;
            $scope.filterError = false;
            $scope.filterValue = '';
            $scope.selectedOperator = 'LESS_THAN';

            var parentEl = angular.element(document.querySelector('#filterOptions'));

            $mdDialog.show({
                scope: $scope,
                parent: parentEl,
                template: '<form novalidate>' +
                    '<md-dialog class="common-filter-dialog">' +
                    '<md-toolbar class="md-accent popup-tool-bar" >' +
                    '<div class="md-toolbar-tools" style="font-size: 14px;padding-left:0px">' +
                    'BY {{filterType | uppercase}}' +
                    '</div>' +
                    '</md-toolbar>' +
                    '<md-dialog-content>' +
                    '<div layout="row">' +
                    '<md-select ng-model="selectedOperator" data-md-container-class="selectdemoSelectHeader">' +
                    '<md-option ng-value="operator.value" ng-repeat="operator in operators">{{operator.display}}</md-option>' +
                    '</md-select>' +
                    '<input type="number" placeholder=""  class="pop-filter-input" ng-class="{\'error-border\': error, \'pop-input-border\': error == undefined || error==\'\'}" ng-model="filterValue" >' +
                    '</div>' +
                    '</md-dialog-content>' +
                    '<div class="error-msg" ng-if="filterError">{{filterErrorMsg}}</div>' +
                    '<md-dialog-actions style="border:none">' +
                    '<md-button ng-click="closeFilter()" class="md-primary md-confirm-button md-button md-ams-theme-theme md-ink-ripple">' +
                    'Cancel' +
                    '</md-button>' +
                    '<md-button ng-click="applyCommonFilter()" class="md-primary md-confirm-button md-button md-ams-theme-theme md-ink-ripple md-raised md-accent">' +
                    'Filter' +
                    '</md-button>' +
                    '</md-dialog-actions>' +
                    '</md-dialog>' +
                    '</form>',
                controller: function() { return vm; },
                clickOutsideToClose: true,
                preserveScope: true
            });
        }

        $scope.applyCommonFilter = function() {
            $scope.parseVal = parseFloat($scope.filterValue);
            if (isNaN($scope.parseVal)) {
                $scope.error = "Enter valid value";
                $scope.filterError = true;
                $scope.filterErrorMsg = "Enter Valid value";
                $timeout(function() {
                    $scope.filterError = false;
                    angular.element(document.querySelector('input')).removeClass("error-border");
                }, 4000);
                return;
            } else {
                angular.forEach($scope.operators, function(operator) {
                    if (operator.value == $scope.selectedOperator) {

                        $scope.opDisplay = operator.display;
                    }
                });

                var filterValues = [];
                filterValues.push($scope.parseVal);
                var filter = {
                    name: $scope.filterType,
                    value: filterValues,
                    operator: $scope.selectedOperator
                }

                var chip = {
                    name: $scope.filterType.toUpperCase(),
                    operator: $scope.opDisplay,
                    value: $scope.parseVal
                }

                $scope.chips.push(chip);

                $scope.filters.push(filter);
                $mdDialog.cancel();
                //$rootScope.isPaginated = true;
                angular.element(document.querySelector('input')).removeClass("error-border");
                $scope.loadKeywordBids(1, $scope.query.order);
            }
        }

        $scope.getByKey = function(key) {
            var found = null;

            for (var i = 0; i < $scope.filters.length; i++) {
                var element = $scope.filters[i];

                if (element.name == key) {
                    found = element;
                }
            }
            return found;
        }

        $scope.removeAppliedFilter = function($chip) {

            if ($chip.name == "CAMPAIGNS") {
                $scope.filters = $scope.removeObject($scope.filters, "campaignId");
                $scope.modelContainer = [];
                $scope.originalCampaignsModelContainer = $scope.modelContainer;
            } else if ($chip.name == "CURRENTBID") {
                $scope.filters = $scope.removeObject($scope.filters, "currentBid");
                $scope.modelContainer = [];
                $scope.originalCampaignsModelContainer = $scope.modelContainer;
            } else if ($chip.name == "KEYWORD") {
                $scope.filters = $scope.removeObject($scope.filters, "keywordText");
                $scope.modelContainer = [];
                $scope.originalCampaignsModelContainer = $scope.modelContainer;
            } else if ($chip.name == "MATCHTYPE") {
                $scope.filters = $scope.removeObject($scope.filters, "matchType");
                $scope.modelContainer = [];
                $scope.originalCampaignsModelContainer = $scope.modelContainer;
            } else {
                $scope.filters = $scope.removeObject($scope.filters, $chip.name.toLowerCase());
            }

            //$rootScope.isPaginated = true;
            $scope.loadKeywordBids(1, $scope.query.order);
        }

        $scope.showCPCEdit = function($event) {
            $scope.editType = "new-bid";
            $scope.editByType = "percentage"
            $scope.action = "";
            $scope.amount = '';
            $scope.error = undefined;
            $scope.showLowerBidMessage = false;


            var parentEl = angular.element(document.querySelector('#filterOptions'));
            $mdDialog.show({
                scope: $scope,
                parent: parentEl,
                targetEvent: $event,
                templateUrl: "app/ams-recommendations/sponsored-ads/cpc-template.tmpl.html",
                title: 'Bulk Bid Editing',
                controller: function() { return vm; },
                clickOutsideToClose: true,
                preserveScope: true
            });
        }

        $scope.showRecommendationsPopup = function($event) {
            $scope.editType = "recommendations";
            $scope.error = undefined;
            $scope.showLowerBidMessage = false;

            $scope.selected = $scope.selected.filter(function(selectedKeyword) {

                return (selectedKeyword.recommendedBid != null && selectedKeyword.recommendedBid != undefined &&
                    selectedKeyword.recommendedBid != '')
            });

            angular.forEach($scope.selected, function(selectedKeyword) { //Reset Bids

                selectedKeyword.currentBidCopy = selectedKeyword.currentBid;
                selectedKeyword.currentBid = selectedKeyword.recommendedBid;
            })

            var parentEl = angular.element(document.querySelector('#filterOptions'));
            $mdDialog.show({
                scope: $scope,
                parent: parentEl,
                targetEvent: $event,
                templateUrl: "app/ams-recommendations/sponsored-ads/cpc-template.tmpl.html",
                title: 'Bulk Bid Editing',
                controller: function() { return vm; },
                clickOutsideToClose: true,
                preserveScope: true
            });
        }

        $scope.previewChanges = function() {
            $scope.action = "preview";

            $scope.applyModelChanges();
        }

        $scope.applyChanges = function() {
            $scope.action = "apply";
            $scope.editByType = undefined;
            $scope.editType = undefined;
            vm.uploadBids($scope.selected);

            $scope.showLowerBidMessage = false;
            angular.forEach($scope.selected, function(selectedKeyword) {
                selectedKeyword.isLowerBid = false;
            });


            $mdDialog.cancel();
        }

        $scope.applyModelChanges = function() {
            $scope.error = undefined;

            if ($scope.amount == undefined || isNaN($scope.amount) || parseFloat($scope.amount) < 0) {
                $scope.error = "Please enter a valid positive number";
                $scope.action = "";
                return;
            }

            if ($scope.editType == "new-bid") {
                if (parseFloat($scope.amount) < 0.02) {
                    $scope.error = "Bid cannot be lesser than 0.02";
                    $scope.action = "";
                    return;
                }
                $scope.setNewBids();
            } else if ($scope.editType == "increase-bid") {

                $scope.increaseBids();
            } else if ($scope.editType == "decrease-bid") {
                $scope.decreaseBids();
            }
        }

        $scope.cancelEdit = function() {
            if ($scope.action == "preview" || $scope.editType == "recommendations") { //If previous action was preview then reset the values
                $scope.resetBids();
            }

            $mdDialog.cancel();
        }

        $scope.setNewBids = function() {

            angular.forEach($scope.selected, function(selectedKeyword) {

                selectedKeyword.currentBidCopy = selectedKeyword.currentBid;
                selectedKeyword.currentBid = $scope.amount;
            })
        }

        $scope.increaseBids = function() {

            angular.forEach($scope.selected, function(selectedKeyword) {

                var calculatedBid;
                if ($scope.editByType == "percentage") {

                    calculatedBid = parseFloat(selectedKeyword.currentBid) + (parseFloat(selectedKeyword.currentBid) * (parseFloat($scope.amount) / 100));
                } else {
                    calculatedBid = parseFloat(selectedKeyword.currentBid) + parseFloat($scope.amount);
                }

                calculatedBid = $filter('number')(calculatedBid, 2);

                selectedKeyword.currentBidCopy = selectedKeyword.currentBid;
                selectedKeyword.currentBid = calculatedBid;
            })
        }

        $scope.decreaseBids = function() {
            $scope.lowerBidLimit = 0.02
            $scope.showLowerBidMessage = false;
            angular.forEach($scope.selected, function(selectedKeyword) {

                var calculatedBid;
                if ($scope.editByType == "percentage") {

                    calculatedBid = parseFloat(selectedKeyword.currentBid) - (parseFloat(selectedKeyword.currentBid) * (parseFloat($scope.amount) / 100));
                } else {
                    calculatedBid = parseFloat(selectedKeyword.currentBid) - parseFloat($scope.amount);
                }

                calculatedBid = $filter('number')(calculatedBid, 2);
                if (calculatedBid >= $scope.lowerBidLimit) {
                    selectedKeyword.currentBidCopy = selectedKeyword.currentBid;
                    selectedKeyword.currentBid = calculatedBid;
                } else {
                    $scope.showLowerBidMessage = true;
                    selectedKeyword.isLowerBid = true;
                    selectedKeyword.currentBidCopy = selectedKeyword.currentBid;
                    selectedKeyword.currentBid = $scope.lowerBidLimit;
                }
            })
        }

        $scope.changeEditType = function() {
            if ($scope.action == "preview") {
                $scope.resetBids();
            }
            $scope.action = "";
            $scope.error = undefined;
            $scope.amount = undefined;
        }

        $scope.changeToRecommendation = function() {

            $scope.action = "recommendations";
            $scope.error = undefined;

            $scope.selected = $scope.selected.filter(function(selectedKeyword) {

                return (selectedKeyword.recommendedBid != null && selectedKeyword.recommendedBid != undefined &&
                    selectedKeyword.recommendedBid != '')
            });

            angular.forEach($scope.selected, function(selectedKeyword) { //Reset Bids

                selectedKeyword.currentBidCopy = selectedKeyword.currentBid;
                selectedKeyword.currentBid = selectedKeyword.recommendedBid;
            })
        }

        $scope.$watch("amount", function(newValue, oldValue) {

            if (oldValue != newValue) {
                $scope.action = "";
                $scope.resetBids();
            }
        });

        $scope.changeEditByType = function() {
            $scope.error = undefined;
            $scope.amount = undefined;

            $scope.resetBids();
        }

        $scope.backToEditOptions = function() {
            $scope.action = "";
            $scope.resetBids();
        }

        $scope.resetBids = function() {
            angular.forEach($scope.selected, function(selectedKeyword) {
                if (selectedKeyword.currentBidCopy != undefined) {
                    selectedKeyword.currentBid = selectedKeyword.currentBidCopy;
                    selectedKeyword.isLowerBid = false;
                }
            });
            $scope.showLowerBidMessage = false;
        }

    }
})();
