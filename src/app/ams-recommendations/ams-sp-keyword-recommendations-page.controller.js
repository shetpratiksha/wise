(function() {
    'use strict';

    angular
        .module('app.ams-recommendations')
        .controller('AMSSPKeywordRecommendationsController', AMSSPKeywordRecommendationsController);

    /* @ngInject */
    function AMSSPKeywordRecommendationsController($location, $cookies, $rootScope, $scope, $q, $mdDialog, AMSDataService, AMSRecommendationDataService, $timeout, $mdEditDialog, AMSMessageService, DynamicMenuService) {
        
        var vm = this;

        vm.isLoading = true;

        $scope.selected = [];
		$scope.limitOptions = [100, 250, 500];

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
			CAMPAIGN_ARCHIVED : "CAMPAIGN ARCHIVED",
			INVALID_KEYWORD : "INVALID KEYWORD",
			INVALID_KEYWORD_BID: "INVALID KEYWORD BID",
			UPDATE_FAILED : "BID UPDATE FAILED",
			INVALID_CAMPAIGN : "INVALID CAMPAIGN",
			KEYWORD_TEXT_MISSING: "KEYWORD TEXT MISSING",
			INVALID_ADGROUP_ID: "INVALID ADGROUP ID",
			INVALID_MATCH_TYPE: "INVALID MATCH TYPE",
			INVALID_STATE: "INVALID STATE",
			DUPLICATE_KEYWORD: "DUPLICATE KEYWORD"
		}

		$scope.query = {
		    order: 'suggestedKeyword',
		    limit: 100,
		    page: 1
		};
		$timeout(function(){
            $scope.floatValue = { top: 0, useAbsolutePositioning: false };
            $scope.floatEnable = true;
        },2000);
		$scope.loadRecommendedKeywords = function() {
			
        	//$rootScope.isContentLoading = true;
        	 var deferred = $q.defer();
            $rootScope.deferred = deferred.promise;
        	vm.loadingError = ''
        	$scope.showStatus = false;
        	$scope.selected = [];

	    	var getRecommendations = AMSRecommendationDataService.getRecommendedKeywords($rootScope.current_organization.organizationId, $rootScope.current_account.amsAccountId);

			getRecommendations.then(function(data) {
	        	$scope.keywords = data;  

	        	if(data.length == 0) {
	        		vm.loadingError = "No Sponsored keywords recommendations available."
	        	}

	        	angular.forEach($scope.keywords, function(keyword) {
	        		
	        		keyword.defaultBid = "0.50";
	        		$scope.recommededOn = keyword.analysisDate

	        		var queries = keyword.searchQueries.split(", <br>");

	        		keyword.searchQueries = queries.join(", ")
	        	});

	        	$scope.originalKeywordSet = $scope.keywords;
	        	
	        	$scope.excludeKeywords($scope.excludeUpdated);

	        	$rootScope.isContentLoading = false;
	        	deferred.reject();

	        }).catch(function() {
	        	$rootScope.isContentLoading = false;
			  	vm.loadingError = "Error displaying recommended keywords. Please try later!!!";
			  	deferred.reject();
	        })
        }

        if($rootScope.current_organization != undefined) {
        	$rootScope.isContentLoading = true;
			$scope.loadRecommendedKeywords();
	    }

        $scope.$on('org_acc_loaded', function() {
        	$rootScope.isContentLoading = true;
        	$scope.loadRecommendedKeywords();
        })

        $scope.$on('left-nav-changed', function(event, menu) {

        	$scope.menu = menu;
        })

        $scope.reloadRecommendedKeywords = function() {
        	$rootScope.$broadcast('org_acc_loaded');
        }

        $scope.displayFilter = false;
        $scope.showFilter = function() {
        	$scope.displayFilter = !$scope.displayFilter;
        }

        $scope.clearFilter = function() {
        	$scope.displayFilter = !$scope.displayFilter;
        	$scope.searchtext = "";
        	$scope.excludeKeywords(true)
        }

        $scope.downloadData = function() {

        	$scope.keywordsToDownload = [];
        	$scope.headers = ["Campaign", "Keyword", "Suggested Keyword", "Bid", "Search Query", "Match Type", "Impressions"]
        	AMSMessageService.showInfoMessage("Report download is in progress...");
        	angular.forEach($scope.keywords, function(kword) {

        		var keyword = {
                    "Campaign": kword.campaign,
                    "Keyword": kword.keyword,
                    "Suggested Keyword": kword.keyword + " " + kword.missingIntent,
                    "Bid": kword.defaultBid,
                    "Search Query": kword.searchQueries,
                    "Match Type": kword.matchType,
                    "Impressions": kword.impression
                }
                $scope.keywordsToDownload.push(keyword);
        	})

        	$timeout(function() {
                    angular.element('#csv-data').triggerHandler('click');
            }, 2000);
        }

        $scope.searchtext = "";

        $scope.filterRecommendations = function() {

        	var searchtext = $scope.searchtext.toLowerCase();

        	$scope.excludeKeywords(true);
        	
        	$scope.keywords = $scope.keywords.filter(function(el){ 

        		var values = Object.values(el);

        		var found = false;
        		angular.forEach(values, function(value) {
				  
				  if(value != null && value.toString().toLowerCase().indexOf(searchtext) == 0) {
				  	found = true;
				  }

				})

				return found;
        	});	
        }
        $scope.excludeUpdated = true;

        $scope.excludeKeywords = function(excludeUpdated) {
        	
			$scope.excludeUpdated = excludeUpdated;

			$scope.keywords = $scope.originalKeywordSet;

        	if(excludeUpdated) {
	        	$scope.keywords = $scope.keywords.filter(function(el){ 

	        		return el.updatedStatus != 'UPDATED';
	        	});
	        }

        }

        $scope.$on('org_acc_loaded', function() {

            DynamicMenuService.addDynamicMenu($rootScope.current_organization.organizationId);
        });

        $scope.editBid = function (event, keywordBid) {
		    event.stopPropagation(); // in case autoselect is enabled
		    
		    var editDialog = {
		      modelValue: keywordBid.defaultBid,
		      placeholder: keywordBid.defaultBid,
		      save: function (input) {
		      	
		      	if(input.$modelValue < 0.02 || isNaN(input.$modelValue)) {
		          input.$invalid = true;
		          return $q.reject();
		        } 
		        

		      	var variation = Math.abs(keywordBid.defaultBid - input.$modelValue);
		      	var message = "";
		      	if(variation > (keywordBid.defaultBid * .25)) {

		      		if(keywordBid.defaultBid - input.$modelValue > 0) {
                		message = 'Entered value is 25% less than the recommended value. Click confirm to upload the keyword to AMS';
                	} else {
                		message = 'Entered value is 25% more than the recommended value. Click confirm to upload the keyword to AMS';
                	}
		      	} else {
		      		message = "New keyword will be uploaded to AMS. Click Confirm to continue."
		      	}

		      	$scope.selected = $scope.selected.filter(function(el) {

		      		return el.keywordId != keywordBid.keywordId;

		      	})
		      	$scope.selected.push(keywordBid);

		      	keywordBid.defaultBid = input.$modelValue;

		      	vm.showIncontextConfirmationDialog(event, message);
		      },
		      targetEvent: event,
		      title: 'Edit Recommnded Bid',
		      min:"0.02",
		      step: "0.01",
		      type:"text",
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
                  }
				)
                .textContent(message)
                .ok("CONFIRM")
                .cancel("CANCEL")
                .targetEvent($event);

            $mdDialog.show(confirm).then(function() {
		      vm.uploadKeywords();
		    });
		}

		vm.showConfirmationDialog = function($event) {

			var message = $scope.selected.length + " new keyword will be uploaded to AMS. Click Confirm to continue."
			vm.showIncontextConfirmationDialog($event, message);
		}

		vm.uploadKeywords = function() {
			 var deferred = $q.defer();
            $rootScope.deferred = deferred.promise;
            //$rootScope.uploadingBids = true;
            
            var keywordBidUploadRequests = [];

            angular.forEach($scope.selected, function(item) {
			  
            	var keywordRequest = {
            		"keywordText" : item.suggestedKeyword,
            		"bid" : item.defaultBid,
            		"matchType" : item.matchType,
            		"state" : "enabled",
            		"campaignId" : item.campaignId,
            		"id" : item.id
            	}

            	keywordBidUploadRequests.push(keywordRequest);
			});

            var uploadFunction = AMSRecommendationDataService.updateRecommededKeyword($rootScope.current_organization.organizationId, 
            		$rootScope.current_bg.businessGroupId, $rootScope.current_account.amsAccountId, keywordBidUploadRequests);

            uploadFunction.then(function(response) {
	        	
            	var status = response.status;

            	var data = response.data;

            	if(status == 207) { //Handling multi status response code.
            		$scope.showStatus = true;
            		$rootScope.uploadingBids = false;

            		vm.error = data.length + " keyword update(s) failed. Look at the inidividual records for failure"

            		AMSMessageService.showErrorMessage(vm.error);

            		
            		$scope.new_selected = [];
            		angular.forEach($scope.selected, function(keywordBid, index) {
						
						var failedKeywordFound = false;			  			
			  			angular.forEach(data, function(failedKeyword) {

			  				if(failedKeyword.keywordId == keywordBid.id && failedKeyword.keywordText == keywordBid.suggestedKeyword)  {

            					keywordBid.status = vm.uploadStatus[failedKeyword.status];
            					keywordBid.defaultBid = "0.50";
            					failedKeywordFound = true;
            					$scope.new_selected.push(keywordBid)
	            			}
            			})

            			if(!failedKeywordFound) {
            				keywordBid.currentBid = keywordBid.recommendedBid;
			  				keywordBid.updatedStatus = 'UPDATED';
			  				keywordBid.status = ''
            			} 
					});

            		$scope.selected = $scope.new_selected;
            		
            	} else if (status == 201) {

            		angular.forEach($scope.selected, function(keywordBid) {
				  			
			  			keywordBid.currentBid = keywordBid.recommendedBid;
			  			keywordBid.updatedStatus = 'UPDATED';
			  			keywordBid.status = ''
					});

		        	$rootScope.uploadingBids = false;
	        	
		        	$scope.excludeKeywords($scope.excludeUpdated);
		        	vm.message = "Successfully uploaded " + $scope.selected.length + " recommendations."
		        	$scope.selected = [];
		        	AMSMessageService.showSuccessMessage(vm.message);
		        } else {
		        	$rootScope.uploadingBids = false;
		        	vm.error = "Error uploading recommendations. Please try later!!!"

	            	AMSMessageService.showErrorMessage(vm.error);
		        }
		        deferred.reject();
	        	
	        }).catch(function(response) {
	        	$rootScope.uploadingBids = false;
	        	
	        	vm.error = "Error uploading recommendations. Please try later!!!"
	        	
	        	AMSMessageService.showErrorMessage(vm.error);
	        	deferred.reject();
	        })
        }

    }
})();
