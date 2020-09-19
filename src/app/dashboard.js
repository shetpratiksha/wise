//'use strict';

angular.module('app')

    .controller('DashboardController', ['$location', '$scope', '$cookies', '$route', '$rootScope', '$http', '$timeout','DataService', 'DateRangeService', 'ImapConstants', 'toastr', 'usSpinnerService','$sce', function($location, $scope, $cookies, $route, $rootScope, $http, $timeout, DataService, DateRangeService, ImapConstants, toastr, usSpinnerService,$sce) {
        $scope.isCampSet = false;
        $scope.isKeywdSet = false;
        $scope.accFilterFlag = false;
        $rootScope.customDate = false;
        var urlConstants = ImapConstants.getUrls()
        var IDs = ImapConstants.getIds()
        var baseUrl = urlConstants.periscope_base_url
        var path = urlConstants.periscope_base_path
        var apikey = '8d0396d7-ef1a-4641-85a8-26216b95'
        $rootScope.campaignList = $rootScope.campaignList || [];
        $rootScope.keywordListHeadline = $rootScope.keywordListHeadline || [];
        $rootScope.keywordListSponsored = $rootScope.keywordListSponsored || [];
        $rootScope.sponsoredProducts = $rootScope.sponsoredProducts || [];
        $rootScope.campaignTypeList = ["Sponsored Products","Product Display","Headline Search"];

        $scope.stringModelCampaign = [];
        $scope.stringModelKeyword = [];
        $scope.customText1 = { buttonDefaultText: 'Select Campaigns' };
        $scope.customText2 = { buttonDefaultText: 'Select Keywords' };
        $scope.customText3 = { buttonDefaultText: 'Select Products' };
        $scope.filters = {};
        $scope.filters_spend_min
        $scope.filters_spend_max

        if(!$scope.dateRangeText) {
           $scope.dateRangeText = "Last 14 days"
         }


        var dashboardId = $cookies.get('dashId') || IDs.SUMMARY;

        if($location.$$path == "/ams-analytics/headline") {
            dashboardId = IDs.HEADLINEKEYWORDS;

        } else if($location.$$path == "ams-analytics/sponsored") {
            dashboardId = IDs.SPONSOREDKEYWORDS;

        } else if($location.$$path == "ams-recommendations") {
            dashboardId = IDs.RECOMMENDATIONS;
        }

        $scope.dataObj = {
            "dashboard": dashboardId,
            "embed": "v2",
            "filters": [],
            "daterange": {},
            "aggregation": 'Daily',
            "border": "off"
        }

        $scope.filter_acos_slider = {min: 0, max: 0, options: {floor: 0, ceil: 100}};


        if ($rootScope.aggrType) {
            $scope.dataObj.aggregation = $rootScope.aggrType
        } else {
            $rootScope.aggrType = 'Daily'
        }

        $scope.beforeRender = function($dates) {
            /* disable future dates */
            for (var i = 0; i < $dates.length; i++) {
                if (new Date().getTime() < $dates[i].utcDateValue) {
                    $dates[i].selectable = false;
                }
            }
        };

        $scope.onTimeSet = function(newDate, oldDate) {
        }

        $scope.myEventListeners = {
            onSelectionChanged: onSelectionChanged
        };

		$scope.refreshSlider = function() {
            $scope.stringModelCampaign = [];
			$timeout(function () {
				$scope.$broadcast('rzSliderForceRender');
			});
		}

        function onSelectionChanged(property) {
            $scope.setCampaign($scope.stringModelCampaign);
            $scope.setKeyword($scope.stringModelKeyword);
        }

        var userDetails = $cookies.getObject('loggedInUser')
        if (userDetails != undefined) {
            $rootScope.userDetails = userDetails
        } else {
            $location.path('/login')
        }

        $scope.getDateRange = function(rangeType) {
            var daterange;
            switch (rangeType) {
                case null:
                    daterange = {}
                    return daterange;
                case 'this_week':
                    daterange = { "start": DateRangeService.getThisWeekStart(), "end": DateRangeService.getToday() };
                    return daterange;
                case 'last_7_days':
                    daterange = { "start": DateRangeService.getRequiredDay(6), "end": DateRangeService.getToday() };
                    return daterange;
                case 'last_week_sun_sat':
                    daterange = { "start": DateRangeService.getLastSunday(), "end": DateRangeService.getLastSatday() };
                    return daterange;
                case 'last_week_mon_sun':
                    daterange = { "start": DateRangeService.getLastMonday(), "end": DateRangeService.getLastSunday() };
                    return daterange;
                case 'last_business_week':
                    daterange = { "start": DateRangeService.getLastMonday(), "end": DateRangeService.getLastFriday() };
                    return daterange;
                case 'last_14':
                    daterange = { "start": DateRangeService.getRequiredDay(13), "end": DateRangeService.getToday() };
                    return daterange;
                case 'this_month':
                    daterange = { "start": DateRangeService.getMonthStart(), "end": DateRangeService.getToday() };
                    return daterange;
                case 'last_30_days':
                    daterange = { "start": DateRangeService.getRequiredDay(29), "end": DateRangeService.getToday() };
                    return daterange;
                case 'last_month':
                    daterange = { "start": DateRangeService.getLastMonthStart(), "end": DateRangeService.getLastMonthEnd() };
                    return daterange;
                case 'all_time':
                    daterange = { "start": DateRangeService.getEarliestSupportedDate(), "end": DateRangeService.getToday() };
                    return daterange;
                case 'custom_range':
                    daterange = { "start": $rootScope.fromDate, "end": $rootScope.toDate };
                    return daterange;
            }
        }

        $scope.renderDashboard = function(loadFlag) {

            //URL encoding of JSON object...
            var dataSet = $cookies.getObject('periscopeData')
            var currPeriscopeObject;
            if (dataSet != undefined) {
                if($scope.accName == "earthlitede" || ($scope.accName == "earthlitefr")){
                    dataSet.filters = dataSet.filters.filter(function(el){ return el.name != "imap_currency_filter"; });
                    dataSet.filters.push({ "name": "imap_currency_filter", "value": "EURO" });
                }
                else if($scope.accName == "earthliteuk") {
                    dataSet.filters = dataSet.filters.filter(function(el){ return el.name != "imap_currency_filter"; });
                    dataSet.filters.push({ "name": "imap_currency_filter", "value": "GBP" });
                }
                currPeriscopeObject = dataSet
            }
            $rootScope.actualURL = '';
            var encodedUri = encodeURIComponent(JSON.stringify(currPeriscopeObject));
            //msg for HmacSHA256....
            var msgHmac = path + encodedUri
            //Creating HMAC using SHA-256 algorithm....
            var hmacEnc = CryptoJS.HmacSHA256(msgHmac, apikey).toString()
            $rootScope.actualURL = $sce.trustAsResourceUrl(baseUrl + path + encodedUri + '&signature=' + hmacEnc);

            if(loadFlag){
                console.log("Campaigns and keyword data loaded : --")
            } else {
                $scope.loadCampaignList($rootScope.accountDetailsData, $rootScope.selectedDate)
                $scope.loadKeyWordHeadline($rootScope.accountDetailsData, $rootScope.selectedDate)
                $scope.loadKeyWordSponsored($rootScope.accountDetailsData, $rootScope.selectedDate)
                $scope.loadSponsoredProducts($rootScope.accountDetailsData, $rootScope.selectedDate)

            }

            $timeout(function() {
                    usSpinnerService.stop('spinner-2');
            }, 2500);

        }

        $scope.loadKeyWordSponsored = function(accountDetailsData, dateRangeID) {

            $rootScope.keywordListSponsored.length = 0;
            var dateRangeObject = $scope.getDateRange(dateRangeID) || $scope.getDateRange('last_14');
            var startDate = dateRangeObject.start;
            var endDate = dateRangeObject.end;
            $http({
                method: 'GET',
                url: ImapConstants.getUrls().intentwise_base_url + 'organization/' + accountDetailsData.organizationId + '/businessgroup/' + accountDetailsData.businessGroupId + '/account/' + accountDetailsData.amsAccountId + '/keyword?startDate=' + startDate + '&' + 'endDate=' + endDate + '&type=sponsored',
                data: '',
                headers: {
                    'X-Auth-Token': $scope.userDetails.token,
                    'Content-Type': 'application/json'
                }
            }).then(function mySuccess(response) {
                for (var i in response.data) {
                    $rootScope.keywordListSponsored.push(response.data[i])
                }
            }, function myError(response) {
                console.log("Error in keyword data : ", response);
            });
        }

        $scope.loadSponsoredProducts = function(accountDetailsData, dateRangeID) {

            $rootScope.sponsoredProducts.length = 0;
            var dateRangeObject = $scope.getDateRange(dateRangeID) || $scope.getDateRange('last_14');
            var startDate = dateRangeObject.start;
            var endDate = dateRangeObject.end;
            $http({
                method: 'GET',
                url: ImapConstants.getUrls().intentwise_base_url + 'organization/' + accountDetailsData.organizationId + '/businessgroup/' + accountDetailsData.businessGroupId + '/account/' + accountDetailsData.amsAccountId + '/sponsoredProduct?startDate=' + startDate + '&' + 'endDate=' + endDate,
                data: '',
                headers: {
                    'X-Auth-Token': $scope.userDetails.token,
                    'Content-Type': 'application/json'
                }
            }).then(function mySuccess(response) {
                for (var i in response.data) {

                    var product = response.data[i];
                    product.displayName = product.asin
                    product.index = i;

                    $rootScope.sponsoredProducts.push(product)
                }
            }, function myError(response) {
                console.log("Error in keyword data : ", response);
            });
        }

        $scope.loadKeyWordHeadline = function(accountDetailsData, dateRangeID) {


            $rootScope.keywordListHeadline.length = 0;
            var dateRangeObject = $scope.getDateRange(dateRangeID) || $scope.getDateRange('last_14');
            var startDate = dateRangeObject.start;
            var endDate = dateRangeObject.end;
            $http({
                method: 'GET',
                url: ImapConstants.getUrls().intentwise_base_url + 'organization/' + accountDetailsData.organizationId + '/businessgroup/' + accountDetailsData.businessGroupId + '/account/' + accountDetailsData.amsAccountId + '/keyword?startDate=' + startDate + '&' + 'endDate=' + endDate + '&type=headline',
                data: '',
                headers: {
                    'X-Auth-Token': $scope.userDetails.token,
                    'Content-Type': 'application/json'
                }
            }).then(function mySuccess(response) {
                for (var i in response.data) {
                    $rootScope.keywordListHeadline.push(response.data[i])
                }
            }, function myError(response) {
                console.log("Error in keyword data : ", response);
            });
        }

        $scope.loadCampaignList = function(accountDetailsData, dateRangeID) {


            $rootScope.campaignList.length = 0;
            var dateRangeObject = $scope.getDateRange(dateRangeID) || $scope.getDateRange('last_14');
            var startDate = dateRangeObject.start;
            var endDate = dateRangeObject.end;
            $http({
                method: 'GET',
                url: ImapConstants.getUrls().intentwise_base_url + 'organization/' + accountDetailsData.organizationId + '/businessgroup/' + accountDetailsData.businessGroupId + '/account/' + accountDetailsData.amsAccountId + '/campaigns?startDate=' + startDate + '&' + 'endDate=' + endDate,
                data: '',
                headers: {
                    'X-Auth-Token': $scope.userDetails.token,
                    'Content-Type': 'application/json'
                }
            }).then(function mySuccess(response) {
                for (var i in response.data) {
                    $rootScope.campaignList.push(response.data[i])
                }
            }, function myError(response) {
                console.log("Error in campaign data : ", response);
            });
        }

        $scope.setCookie = function(objToSave) {
            $cookies.putObject('periscopeData', objToSave)
        }

        $scope.setOrganization = function(orgName) {

            $rootScope.organization = orgName;
            for (var i = 0; i < $rootScope.organizationList.length; i++) {
                if ($rootScope.organizationList[i].name == orgName) {
                    $rootScope.organizationData = $rootScope.organizationList[i];
                    break;
                }
            }
            $rootScope.userDetails.user.organizationId = $rootScope.organizationData.organizationId;
            $scope.setUserCookie($rootScope.userDetails)
            $scope.getOrganization();
        }

        $scope.setRange = function(rangeType) {

            $scope.fromDate = undefined;
            $scope.toDate = undefined;

            usSpinnerService.spin('spinner-2');
            var currAccName = $cookies.get('currentAccount')
            var currAccId = $cookies.get('currentAccountId')
            if (currAccName != undefined) {
                $scope.accName = currAccName
            }
            if (currAccId != undefined){
                $scope.accId = currAccId
            }
            var dataSet = $cookies.getObject('periscopeData')
            var periscopeObject;
            if (dataSet != undefined) {
                periscopeObject = dataSet
            }
            if (rangeType == 'custom_range') {
                $rootScope.fromDate = undefined;
                $rootScope.toDate = undefined;
                $rootScope.uiController.customDateFlag = true;
                $rootScope.uiController.dateRange = false;
                usSpinnerService.stop('spinner-2');
            } else {
                periscopeObject.daterange = $scope.getDateRange(rangeType);
                $rootScope.selectedDate = rangeType;
                var dates = DataService.getDateRange();
                for (var i = 0; i < dates.length; i++) {
                    if (dates[i].id == $rootScope.selectedDate) {
                        $scope.dateRangeText = dates[i].name;
                        if($scope.dateRangeText=='Custom Date Range'){
                            $scope.dateRangeText = '$rootScope.fromDate+' + ' - '+$rootScope.toDate;
                        }
                    }
                }
                $scope.dateRange = $rootScope.selectedDate;
                $scope.setCookie(periscopeObject);
                $scope.renderDashboard(false);
            }

            $scope.fstatus = false;
        }

        $rootScope.$watch('accountChanged', function() {

            $scope.choosenCampaignTypeFilters = [];
            $scope.choosenProductFilters = [];
            $scope.choosenCampaignFilters = [];
            $scope.choosenKeywordFilters = [];

            $scope.selectedCampaign = [];
            $scope.selectedProduct = [];
            $scope.selectedKeyword = [];
            $scope.selectedCampaignType = [];
        });

        $scope.changeAccount = function() {
            $rootScope.accountChanged = !$rootScope.accountChanged;

            var dataSet = $cookies.getObject('periscopeData')
            var periscopeObject;
            $scope.choosenFilters = [];

            if (dataSet != undefined) {
                periscopeObject = dataSet;
            }

            periscopeObject.filters = dataSet.filters.filter(function(el){ return el.name != "imap_keyword_filter"; });
            periscopeObject.filters = dataSet.filters.filter(function(el){ return el.name != "imap_campaign_filter"; });
            periscopeObject.filters = dataSet.filters.filter(function(el){ return el.name != "imap_product_filter"; });
            periscopeObject.filters = dataSet.filters.filter(function(el){ return el.name != "imap_campaign_type_filter"; });

            $scope.setCookie(periscopeObject);
        }

        $scope.setAccount = function(accName) {

            usSpinnerService.spin('spinner-2');
            if (accName == $rootScope.amsAccount) {

                $scope.accName = accName;
                $scope.accId = $rootScope.accountDetailsData.amsAccountId
                var dataSet = $cookies.getObject('periscopeData')

                var currPeriscopeObjectAcc;
                if (dataSet != undefined) {
                    currPeriscopeObjectAcc = dataSet
                }
                $cookies.put('currentAccount', $scope.accName)
                $cookies.put('currentAccountId',$scope.accId)


                if (currPeriscopeObjectAcc.filters.length == 0) {

                    currPeriscopeObjectAcc.filters.push({ "name": "imap_account_filter", "value": $scope.accName })
                    currPeriscopeObjectAcc.filters.push({"name": "imap_account_id_filter","value":$scope.accId})


                    if ($scope.currentKey && $scope.currentKey.length > 0) {
                        currPeriscopeObjectAcc.filters.push({ "name": "imap_keyword_filter", "value": $scope.currentKey })
                    }
                } else {
                    var idx = currPeriscopeObjectAcc.filters.filter(function(el){ return el.name == "imap_account_filter"; });

                    if (idx != undefined) {
                        dataSet.filters = currPeriscopeObjectAcc.filters.filter(function(el){ return el.name != "imap_account_filter"; });
                        dataSet.filters.push({"name": 'imap_account_filter', "value" : $scope.accName})

                         var accountIdIdx = currPeriscopeObjectAcc.filters.filter(function(el){ return el.name == "imap_account_id_filter"; });
                        if(accountIdIdx != undefined){
                            dataSet.filters = currPeriscopeObjectAcc.filters.filter(function(el){ return el.name != "imap_account_id_filter"; });
                            dataSet.filters.push({"name": 'imap_account_id_filter', "value" : $scope.accId})
                        }
                    } else {
                         currPeriscopeObjectAcc.filters.push({ "name": "imap_account_filter", "value": $scope.accName })
                         currPeriscopeObjectAcc.filters.push({"name": "imap_account_id_filter","value":$scope.accId})
                    }

                    if ($scope.currentKey && $scope.currentKey.length > 0) {
                        var idx = currPeriscopeObjectAcc.filters.filter(function(el){ return el.name == "imap_keyword_filter"; });
                        if (idx != undefined) {
                            dataSet.filters = currPeriscopeObjectAcc.filters.filter(function(el){ return el.name != "imap_keyword_filter"; });
                            dataSet.filters.push({"name": 'imap_keyword_filter', "value" : $scope.currentKey})
                        } else {
                            currPeriscopeObjectAcc.filters.push({ "name": "imap_keyword_filter", "value": $scope.currentKey })
                        }
                    }
                }
                $scope.dateRange = $rootScope.selectedDate || 'last_14';
                var dates = DataService.getDateRange();
                for (var i = 0; i < dates.length; i++) {
                    if (dates[i].id == $scope.dateRange) {
                        $scope.dateRangeText = dates[i].name;
                    }else if ('custom_range' == $scope.dateRange){
                        $scope.dateRangeText = $rootScope.fromDate + ' - ' +$rootScope.toDate;
                    }
                }

                currPeriscopeObjectAcc.daterange = $scope.getDateRange($scope.dateRange)
                $scope.setCookie(currPeriscopeObjectAcc);
                $scope.renderDashboard(true);
            } else {
                $rootScope.userAction.showAggrigation = true

                for (var i = 0; i < $rootScope.accountsList.length; i++) {
                    if ($rootScope.accountsList[i].name == accName) {
                        $rootScope.amsAccountText = $rootScope.accountsList[i].displayName;
                        $rootScope.accountDetailsData = $rootScope.accountsList[i];
                        break;
                    }
                }
                $rootScope.amsAccount = accName;
                $scope.accName = accName;
                $scope.accId = $rootScope.accountDetailsData.amsAccountId
                var dataSet = $cookies.getObject('periscopeData')

                var currPeriscopeObjectAcc;
                if (dataSet != undefined) {
                    currPeriscopeObjectAcc = dataSet
                }
                $cookies.put('currentAccount', $scope.accName)
                $cookies.put('currentAccountId', $scope.accId)
                if (currPeriscopeObjectAcc.filters.length == 0) {
                    currPeriscopeObjectAcc.filters.push({ "name": "imap_account_filter", "value": $scope.accName })
                    currPeriscopeObjectAcc.filters.push({"name": "imap_account_id_filter","value":$scope.accId})
                } else {
                    var idx = currPeriscopeObjectAcc.filters.filter(function(el){ return el.name == "imap_account_filter"; });
                    if (idx != undefined ) {
                        dataSet.filters = currPeriscopeObjectAcc.filters.filter(function(el){ return el.name != "imap_account_filter"; });
                        dataSet.filters.push({"name": 'imap_account_filter', "value" : $scope.accName})
                        var accountIdIdx = currPeriscopeObjectAcc.filters.filter(function(el){ return el.name == "imap_account_id_filter"; });
                        if(accountIdIdx !=undefined){
                        dataSet.filters = currPeriscopeObjectAcc.filters.filter(function(el){ return el.name != "imap_account_id_filter"; });
                        dataSet.filters.push({"name": 'imap_account_id_filter', "value" : $scope.accId})
                        }
                    } else {
                        currPeriscopeObjectAcc.filters.push({ "name": "imap_account_filter", "value": $scope.accName })
                        currPeriscopeObjectAcc.filters.push({"name": "imap_account_id_filter","value":$scope.accId})
                    }
                }
                $scope.dateRange = $rootScope.selectedDate || 'last_14'
                var dates = DataService.getDateRange();
                for (var i = 0; i < dates.length; i++) {
                    if (dates[i].id == $scope.dateRange) {
                        $scope.dateRangeText = dates[i].name;
                        if($scope.dateRangeText=='Custom Date Range'){
                            $scope.dateRangeText = $rootScope.fromDate +' - '+ $rootScope.toDate;
                        }
                    }
                }
                currPeriscopeObjectAcc.daterange = $scope.getDateRange($scope.dateRange)
                $scope.setCookie(currPeriscopeObjectAcc)
                $scope.renderDashboard(false)
            }
        }

        $scope.getOrganization = function() {

            $http({
                method: 'GET',
                url: ImapConstants.getUrls().intentwise_base_url + 'organization/' + $rootScope.userDetails.user.organizationId + '/businessgroup',
                data: '',
                headers: {
                    'X-Auth-Token': $scope.userDetails.token,
                    'Content-Type': 'application/json'
                }
            }).then(function mySuccess(response) {
                $rootScope.businessgroupId = response.data.businessGroupId;
                $rootScope.userDetails.businessgroupId = response.data.businessGroupId;
                $scope.setUserCookie($rootScope.userDetails)
                $scope.getAMSaccounts()
            }, function myError(response) {
                console.log("Error in Business Group data : ", response);
            });
        }

        $scope.getOrganizations = function() {
            $scope.accFilterFlag = true;
            //API to get all organizations for the uuser
            $http({
                method: 'GET',
                url: ImapConstants.getUrls().intentwise_base_url + 'organization?status=ACTIVE',
                data: '',
                headers: {
                    'X-Auth-Token': $scope.userDetails.token,
                    'Content-Type': 'application/json'
                }
            }).then(function mySuccess(response) {
                $rootScope.organizationList = response.data;

                $rootScope.userDetails.user.organizationId = $rootScope.organizationList[0].organizationId
                $scope.setOrganization($rootScope.organizationList[0].name);
                //$scope.setOrganization($rootScope.organizationList[0].name);

            }, function myError(response) {
                console.log("Error in getting all organizations : ", response);
                $rootScope.organizationList = [];
            });
        }

        var userActions = $cookies.getObject('userActions')
        if (userActions != undefined) {
            $rootScope.userAction = userActions
            $rootScope.userAction.showAggrigation = false
        }
        $rootScope.uiController = {
            'customDateFlag': false,
            'dateRange': true
        }

        $scope.setUserCookie = function(objToSave) {
            $cookies.putObject('loggedInUser', objToSave)
        }

        $scope.renderPage = function(page) {
            if (page === 'Summary') {
                $location.path('/dashboardSummary')
            } else if (page === 'Admin') {
                $location.path("/dashboardAdmin")
            } else if (page === 'SponsoredKeywords') {
                $location.path("/dashboardSponsoredKeywords")
            } else if (page === 'SponsoredProducts') {
                $location.path("/dashboardSponsoredProducts")
            } else if (page === 'SponsoredSearch') {
                $location.path("/dashboardSponsoredSearch")
            } else if (page === 'HeadlineKeywords') {
                 $location.path("/dashboardHeadlineKeywords")
            } else if (page === 'Bidding') {
                $location.path("/dashboardBidding")
            }
        }


        $scope.setCookie($scope.dataObj)
        $scope.dateRangeList = DataService.getDateRange()

        //Choose a different path for Super Admin

        if ($rootScope.userDetails.user.role == "SUPER_ADMIN" && !$rootScope.organizationData) {
            $scope.getOrganizations();
        } else {

            if ($rootScope.amsAccount == undefined) {
                usSpinnerService.spin('spinner-2');
                $scope.getOrganization();
                $rootScope.accountsList = [];
            } else {
                $scope.setAccount($rootScope.amsAccount);
            }
        }

        $scope.chPassword = function() {
            $location.path("/changePassword")
        }

        $scope.getAMSaccounts = function() {
            $scope.accFilterFlag = true;
            //API to get all AMS account based on organization id...
            $http({
                method: 'GET',
                url: ImapConstants.getUrls().intentwise_base_url + 'organization/' + $rootScope.userDetails.user.organizationId + '/businessgroup/' + $rootScope.userDetails.businessgroupId + '/amsaccount/',
                data: '',
                headers: {
                    'X-Auth-Token': $scope.userDetails.token,
                    'Content-Type': 'application/json'
                }
            }).then(function mySuccess(response) {
                $rootScope.accountsList = response.data;

                if ($rootScope.accountsList.length > 0) {
                    $scope.setAccount($rootScope.accountsList[0].name);
                }

                if ($location.path() == "/dashboardAdmin") {
                    $route.reload();
                }

            }, function myError(response) {
                console.log("Error in AMS account data : ", response);
                $rootScope.accountsList = [];
            });
        }

        $scope.dateChange = function(date) {
        }

        $scope.changeAggregate = function(aggrType) {

            usSpinnerService.spin('spinner-2');
            var dataSet = $cookies.getObject('periscopeData')
            var currPeriscopeObject;
            if (dataSet != undefined) {
                currPeriscopeObject = dataSet
            }
            currPeriscopeObject.aggregation = aggrType
            $scope.setCookie(currPeriscopeObject)
            $scope.renderDashboard(true)
            $rootScope.aggrType = aggrType;
        }

        $scope.renderWithCampaign = function() {

            usSpinnerService.spin('spinner-2');
            $scope.renderDashboard(true)
        }

        $scope.renderWithKeyword = function() {

            usSpinnerService.spin('spinner-2');
            $scope.renderDashboard(true)
        }

        $scope.clearCustomRange = function() {
            $rootScope.uiController.customDateFlag = false;
            $rootScope.uiController.dateRange = true;
        }
        $scope.loadDashboard = function(fromDate, toDate) {
            $scope.fstatus = false;

            usSpinnerService.spin('spinner-2');
            var currAccName = $cookies.get('currentAccount')
            var currAccId = $cookies.get('currentAccountId')
            var dateFlag = true;
            var rangeType = 'custom_range';
            $rootScope.fromDate = fromDate;
            $rootScope.toDate = toDate;
            if (currAccName != undefined) {
                $scope.accName = currAccName
            }
            if (currAccId != undefined){
                $scope.accId = currAccId
            }

            if (fromDate == undefined) {
                // toastr.warning('Please select FROM date !', 'Warning');
            }
            if (toDate == undefined) {
                // toastr.warning('Please select TO date !', 'Warning');
            }

            if (fromDate > toDate) {
                dateFlag = false;
                usSpinnerService.stop('spinner-2');
                swal({
                    title: "Failure",
                    text: 'Start date can’t be greater than end date',
                    showConfirmButton: true,
                    confirmButtonColor: "#337ab7",
                    confirmButtonHoverColor: "#AD2047",
                    confirmButtonText: "OK",
                    type: 'error',
                    customClass: "sweet-alert-user-response"
                });

            } else {
                $scope.dateRangeText = fromDate + ' - ' +toDate;
                var dataSet = $cookies.getObject('periscopeData')
                var periscopeObject;
                if (dataSet != undefined) {
                    periscopeObject = dataSet
                }
                if (fromDate != undefined && toDate != undefined && dateFlag == true) {
                    periscopeObject.daterange = { "start": fromDate, "end": toDate };
                    $scope.setCookie(periscopeObject)

                    periscopeObject.daterange = $scope.getDateRange(rangeType);
                    $rootScope.selectedDate = rangeType;
                    var dates = DataService.getDateRange();
                    for (var i = 0; i < dates.length; i++) {
                        if (dates[i].id == $rootScope.selectedDate) {
                            $scope.dateRangeText = dates[i].name;
                            if($scope.dateRangeText=='Custom Date Range'){
                                $scope.dateRangeText = $rootScope.fromDate + ' - ' +$rootScope.toDate;
                            }
                        }
                    }
                    $scope.dateRange = $rootScope.selectedDate;
                    $scope.setCookie(periscopeObject);
                    $scope.renderDashboard(false);
                }
            }
        }

        $scope.removeAppliedCampaignFilters = function(campaign) {
            var dataSet = $cookies.getObject('periscopeData')

            var campaigns = dataSet.filters.filter(function(el){ return el.name == "imap_campaign_filter"; });

            campaigns = campaigns[0].value;

            campaigns = campaigns.filter(function(el){ return el != campaign; });

            dataSet.filters = dataSet.filters.filter(function(el){ return el.name != "imap_campaign_filter"; });

            dataSet.filters.push({"name": 'imap_campaign_filter', "value" : campaigns})

            $scope.choosenCampaignFilters = campaigns;

            $timeout(function() {
                    $scope.selectedCampaign = campaigns;
            }, 2000);

            $scope.setCookie(dataSet)
            $scope.status.isopen=false;
            usSpinnerService.spin('spinner-2');
            $scope.renderDashboard();
        }

        $scope.removeCampaignTypeFilters = function(campaignType) {
            var dataSet = $cookies.getObject('periscopeData')

            var campaignTypes = dataSet.filters.filter(function(el){ return el.name == "imap_campaign_type_filter"; });

            campaignTypes = campaignTypes[0].value;

            campaignTypes = campaignTypes.filter(function(el){ return el != campaignType; });

            dataSet.filters = dataSet.filters.filter(function(el){ return el.name != "imap_campaign_type_filter"; });

            dataSet.filters.push({"name": 'imap_campaign_type_filter', "value" : campaignTypes})

            $scope.choosenCampaignTypeFilters = campaignTypes;

            $timeout(function() {
                    $scope.selectedCampaignType = campaignTypes;
            }, 2000);


            $scope.setCookie(dataSet)
            $scope.status.isopen=false;
            usSpinnerService.spin('spinner-2');
            $scope.renderDashboard();
        }

        $scope.removeAppliedProductFilters = function(product) {
            var dataSet = $cookies.getObject('periscopeData')

            var products = dataSet.filters.filter(function(el){ return el.name == "imap_product_filter"; });

            products = products[0].value;

            products = products.filter(function(el){ return el != product; });

            dataSet.filters = dataSet.filters.filter(function(el){ return el.name != "imap_product_filter"; });

            dataSet.filters.push({"name": 'imap_product_filter', "value" : products})


            var productObjects = $scope.sponsoredProducts.filter(function(el) {

                for(var i=0; i < products.length; i++) {

                    if(el.asin == products[i]) {
                        return el;
                    }
                }

            })

            $scope.choosenProductFilters = productObjects;

            $timeout(function() {
                    $scope.selectedProduct = productObjects;
            }, 2000);

            $scope.setCookie(dataSet)
            $scope.status.isopen=false;
            usSpinnerService.spin('spinner-2');
            $scope.renderDashboard();
        }

        $scope.removeAppliedKeywordFilters = function(keyword) {
            var dataSet = $cookies.getObject('periscopeData')

            var keywords = dataSet.filters.filter(function(el){ return el.name == "imap_keyword_filter"; });

            keywords = keywords[0].value;

            keywords = keywords.filter(function(el){ return el != keyword; });

            dataSet.filters = dataSet.filters.filter(function(el){ return el.name != "imap_keyword_filter"; });

            dataSet.filters.push({"name": 'imap_keyword_filter', "value" : keywords})

            $scope.choosenKeywordFilters = keywords;

            $timeout(function() {
                    $scope.selectedKeyword = keywords;
            }, 2000);

            $scope.setCookie(dataSet)
            $scope.status.isopen=false;
            usSpinnerService.spin('spinner-2');
            $scope.renderDashboard();
        }

        $scope.removeAppliedFilters = function(filter){

            var dataSet = $cookies.getObject('periscopeData')

            if(filter == 'campaign_spend') {
                dataSet.filters = dataSet.filters.filter(function(el){ return el.name != "imap_campaign_spend_min"; });
                dataSet.filters = dataSet.filters.filter(function(el){ return el.name != "imap_campaign_spend_max"; });
                $scope.filters_spend_min = "";
                $scope.filters_spend_max = ""

            } else if(filter == 'TopX') {
                dataSet.filters = dataSet.filters.filter(function(el){ return el.name != "imap_topx"; });
                $scope.imap_filter_topx = ""

            } if(filter == 'ACoS') {
                dataSet.filters = dataSet.filters.filter(function(el){ return el.name != "imap_acos_min"; });
                dataSet.filters = dataSet.filters.filter(function(el){ return el.name != "imap_acos_max"; });
                $scope.filter_acos_slider.min = 0;
                $scope.filter_acos_slider.max = 0;
            }

            $scope.choosenFilters = $scope.choosenFilters.filter(function(el){ return el.name != filter; });

            $scope.setCookie(dataSet)
            $scope.status.isopen=false;
            usSpinnerService.spin('spinner-2');
            $scope.renderDashboard();
        }

        $scope.applyMoreFilters = function() {

            $scope.filters = ""
            var dataSet = $cookies.getObject('periscopeData')
            var periscopeObject;
            $scope.choosenFilters = [];

            if (dataSet != undefined) {
                periscopeObject = dataSet
            }

            periscopeObject.filters = dataSet.filters.filter(function(el){ return el.name != "imap_campaign_spend_min"; });
            periscopeObject.filters = dataSet.filters.filter(function(el){ return el.name != "imap_campaign_spend_max"; });
            periscopeObject.filters = dataSet.filters.filter(function(el){ return el.name != "imap_topx"; });
            periscopeObject.filters = dataSet.filters.filter(function(el){ return el.name != "imap_acos_min"; });
            periscopeObject.filters = dataSet.filters.filter(function(el){ return el.name != "imap_acos_max"; });
            periscopeObject.filters = dataSet.filters.filter(function(el){ return el.name != "imap_keyword_filter"; });
            periscopeObject.filters = dataSet.filters.filter(function(el){ return el.name != "imap_campaign_filter"; });
            periscopeObject.filters = dataSet.filters.filter(function(el){ return el.name != "imap_product_filter"; });
            periscopeObject.filters = dataSet.filters.filter(function(el){ return el.name != "imap_campaign_type_filter"; });



            if($scope.filters_spend_min && $scope.filters_spend_max) {

                periscopeObject.filters.push({ "name": "imap_campaign_spend_min", "value": $scope.filters_spend_min})

                periscopeObject.filters.push({ "name": "imap_campaign_spend_max", "value": $scope.filters_spend_max})

                $scope.choosenFilters.push({"name": "campaign_spend", "value": $scope.filters_spend_min + " to " + $scope.filters_spend_max, "displayName": "Campain spend"})
            }

            if($scope.imap_filter_topx) {
                periscopeObject.filters.push({ "name": "imap_topx", "value": $scope.imap_filter_topx})

                $scope.choosenFilters.push({"name": "TopX", "value": $scope.imap_filter_topx, "displayName": "TopX"})
            }

            if($scope.filter_acos_slider.max != 0) {
                periscopeObject.filters.push({ "name": "imap_acos_min", "value": $scope.filter_acos_slider.min})
                periscopeObject.filters.push({ "name": "imap_acos_max", "value": $scope.filter_acos_slider.max})

                $scope.choosenFilters.push({"name": "ACoS", "value": $scope.filter_acos_slider.min + " to " + $scope.filter_acos_slider.max, "displayName": "ACoS"})
            }


            if($scope.selectedCampaign && $scope.selectedCampaign.length > 0) {

                periscopeObject.filters.push({ "name": "imap_campaign_filter", "value": $scope.selectedCampaign})
                $scope.choosenCampaignFilters = $scope.selectedCampaign;
            } else {
                $scope.choosenCampaignFilters = ''
            }


            if($scope.selectedCampaignType && $scope.selectedCampaignType.length > 0) {

                periscopeObject.filters.push({ "name": "imap_campaign_type_filter", "value": $scope.selectedCampaignType})
                $scope.choosenCampaignTypeFilters = $scope.selectedCampaignType;
            } else {
                $scope.choosenCampaignTypeFilters = ''
            }

            if($scope.selectedKeyword && $scope.selectedKeyword.length > 0) {

                periscopeObject.filters.push({ "name": "imap_keyword_filter", "value": $scope.selectedKeyword})
                $scope.choosenKeywordFilters = $scope.selectedKeyword;

            } else {
                $scope.choosenKeywordFilters = ''
            }

            if($scope.selectedProduct && $scope.selectedProduct.length > 0) {

                var prodAsins = [];
                for(var i = 0; i < $scope.selectedProduct.length ; i++) {
                    prodAsins.push($scope.selectedProduct[i].asin);
                }


                periscopeObject.filters.push({ "name": "imap_product_filter", "value": prodAsins})
                $scope.choosenProductFilters = $scope.selectedProduct;

            } else {
                $scope.choosenProductFilters = ''
            }

            $scope.status.isopen=false

            usSpinnerService.spin('spinner-2');

            $scope.setCookie(periscopeObject)
            $scope.renderDashboard();

        }

        $scope.resetFilters = function() {

            var dataSet = $cookies.getObject('periscopeData')
            var periscopeObject;
            $scope.choosenFilters = [];

            if (dataSet != undefined) {
                periscopeObject = dataSet
            }

            periscopeObject.filters = dataSet.filters.filter(function(el){ return el.name != "imap_campaign_spend_min"; });
            periscopeObject.filters = dataSet.filters.filter(function(el){ return el.name != "imap_campaign_spend_max"; });
            periscopeObject.filters = dataSet.filters.filter(function(el){ return el.name != "imap_topx"; });
            periscopeObject.filters = dataSet.filters.filter(function(el){ return el.name != "imap_acos_min"; });
            periscopeObject.filters = dataSet.filters.filter(function(el){ return el.name != "imap_acos_max"; });
            periscopeObject.filters = dataSet.filters.filter(function(el){ return el.name != "imap_keyword_filter"; });
            periscopeObject.filters = dataSet.filters.filter(function(el){ return el.name != "imap_campaign_filter"; });
            periscopeObject.filters = dataSet.filters.filter(function(el){ return el.name != "imap_product_filter"; });
            periscopeObject.filters = dataSet.filters.filter(function(el){return el.name != "imap_campaign_type_filter"});

            $scope.choosenCampaignFilters = ''
            $scope.choosenProductFilters = ''
            $scope.choosenKeywordFilters = ''
            $scope.choosenCampaignTypeFilters = ''
            $scope.selectedCampaign = [];
            $scope.selectedCampaignType = [];
            $scope.selectedKeyword = [];
            $scope.selectedProduct = [];


            $scope.status.isopen=false

            usSpinnerService.spin('spinner-2');

            $scope.setCookie(periscopeObject)
            $scope.renderDashboard();
        }

        $scope.status = {
            isopen: false
        };

        $scope.fstatus = false

        $scope.toggleDropdown = function($event) {

            $scope.status.isopen = !$scope.status.isopen;
            $scope.fstatus = !$scope.fstatus
        };

        $scope.closeMenu = function() {
            $scope.fstatus = false;
        }

        $scope.hideFilterDropdown = function() {
            $scope.status.isopen = false;
            $scope.fstatus = false;
        }

        //This method helps in communicating between two instances of the controllers to close the filter menu
        $scope.menuClicked = function() {
            $rootScope.filterCanBeClosed = !$rootScope.filterCanBeClosed;
        }

        $rootScope.$watch('filterCanBeClosed', function() {
            $scope.status.isopen = false;
            $scope.fstatus = false;
        });






        //------------Commented codes below may be used in future----------//
        // function suggest_camp(term) {
        //     var q = term.toLowerCase().trim();
        //     var results = [];

        //     // Find first 10 states that start with `term`.
        //     for (var i = 0; i < $scope.campaignList.length ; i++) {
        //         var state = $scope.campaignList[i];
        //         if (state.toLowerCase().indexOf(q) === 0)
        //             results.push({ label: state, value: state });
        //     }

        //     return results;
        // }

        // $scope.autocomplete_options = {
        //     suggest: suggest_camp
        // };
    }])
    .controller('DashboardAdminController', ['$location', '$scope', '$cookies', '$rootScope', '$http', 'DataService', 'DateRangeService', 'ImapConstants', 'toastr', 'usSpinnerService', function($location, $scope, $cookies, $rootScope, $http, DataService, DateRangeService, ImapConstants, toastr, usSpinnerService) {
        $scope.isEmailValid = false
        var thisUser = $cookies.getObject('loggedInUser')
        if (thisUser == undefined) {
            $location.path('/login')
        } else {
            $scope.loggedInUser = thisUser
        }
        $scope.isUserSelected = false
        var roles = ImapConstants.getRoles()
        $scope.userListToEdit = []
        $scope.amsListToEdit = []
        var userActions = $cookies.getObject('userActions')
        if (userActions != undefined) {
            $rootScope.userAction = userActions
        }
        //==============setting for AMS Account Grid==========//
        $scope.gridAmsAccount = {
            enableRowSelection: true,
            enableSelectAll: true,
            enableFiltering: true,
            selectionRowHeaderWidth: 35,
            showGridFooter: true,
            columnDefs: [
                { displayName: 'Account Name', name: 'displayName' }
            ]
        };
        //==============setting for User Grid==========//
        $scope.gridUser = {
            enableRowSelection: true,
            enableSelectAll: true,
            enableFiltering: true,
            selectionRowHeaderWidth: 35,
            showGridFooter: true,
            paginationPageSizes: [25, 50, 75],
            paginationPageSize: 25,
            useExternalPagination: true,
            enableColumnMenus: false,
            columnDefs: [
                { displayName: 'User Id', name: 'email', enableGridMenu: false },
                { displayName: 'Account Name', name: 'amsAccountName' },
                { displayName: 'Role', name: 'role' },
                { displayName: 'Status', name: 'status' }, {
                    displayName: 'Action',
                    name: 'action',
                    cellTemplate: "<button class=\"btn-grid-resend-email btnAggregate btn-apply\" ng-if=\"row.entity.status=='IN_ACTIVE'||row.entity.status=='CREATED'\" ng-click=\"grid.appScope.resendActivationToUser(row.entity)\">Resend Activation</button>"
                }
            ],
            data: []
        };
        Array.prototype.remove = function() {
            var what, a = arguments,
                L = a.length,
                ax;
            while (L && this.length) {
                what = a[--L];
                while ((ax = this.indexOf(what)) !== -1) {
                    this.splice(ax, 1);
                }
            }
            return this;
        };
        $scope.validateMailId = function(email) {
            $scope.isEmailValid = DataService.validateEmail(email)
        }
        $scope.addAccount = function() {
            swal({
                title: "<p class='fontFamilia'>Add AMS Account</p>",
                text: "<p class='amsRule header5-body' style='color:red;'>Please ensure that the account names below match with your account name in AMS.</p>",
                type: "input",
                html: true,
                showCancelButton: true,
                confirmButtonColor: "#337ab7",
                confirmButtonHoverColor: "#AD2047",
                closeOnConfirm: false,
                animation: "slide-from-top",
                inputPlaceholder: "Enter Account Name",
                customClass: 'sweet-alert-ams'
            }, function(inputValue) {
                if (inputValue === false) return false;
                if (inputValue === "") {
                    swal.showInputError("Please Enter AMS Account Name");
                    return false
                } else {
                    if (inputValue.indexOf(',') > 0) {
                        swal.showInputError("Account name must not contain comma (,)");
                    } else {
                        usSpinnerService.spin('spinner-3');
                        $http({
                            method: 'POST',
                            url: ImapConstants.getUrls().intentwise_base_url + 'organization/' + $scope.loggedInUser.user.organizationId + '/businessgroup/' + $scope.loggedInUser.businessgroupId + '/amsaccount',
                            data: {
                                "name": inputValue,
                                "type": "AMS_VENDOR"
                            },
                            headers: {
                                'X-Auth-Token': $scope.loggedInUser.token,
                                'Content-Type': 'application/json'
                            }
                        }).then(function successCallback(response) {
                            if (response.status == 201) {
                                usSpinnerService.stop('spinner-3');
                                swal({
                                    title: "Success",
                                    text: '<center><p class="header5-body">Thank you for adding : ' + inputValue + '</p><br><p class="header5-body">We are seeking approval from ' + inputValue + '.</p></center>',
                                    showConfirmButton: true,
                                    confirmButtonColor: "#337ab7",
                                    confirmButtonHoverColor: "#AD2047",
                                    confirmButtonText: "OK",
                                    type: 'success',
                                    customClass: 'sweet-alert-ams-response',
                                    html: true
                                });
                                $scope.amsAccountList.push({
                                    'name': inputValue
                                })
                            } else {
                                usSpinnerService.stop('spinner-3');
                                swal({
                                    title: "<p class='fontFamilia'>Failure</p>",
                                    text: "<p class='fontFamilia'>AMS account creation failed</p>",
                                    showConfirmButton: true,
                                    confirmButtonColor: "#337ab7",
                                    confirmButtonHoverColor: "#AD2047",
                                    confirmButtonText: "OK",
                                    type: 'error',
                                    customClass: 'sweet-alert-ams-response'
                                });
                            }
                        }, function errorCallback(response) {
                            usSpinnerService.stop('spinner-3');
                            swal({
                                title: "Failure",
                                text: "AMS account creation failed",
                                showConfirmButton: true,
                                confirmButtonColor: "#337ab7",
                                confirmButtonHoverColor: "#AD2047",
                                confirmButtonText: "OK",
                                type: 'error',
                                customClass: 'sweet-alert-ams-response'
                            });
                        });
                    }
                }
            });
        }
        $scope.resendActivationToUser = function(user) {
            $http({
                method: 'POST',
                url: ImapConstants.getUrls().intentwise_base_url + 'user/token',
                data: {
                    "email": user.email
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function successCallback(response) {
                if (response.status == 200) {
                    swal({
                        title: "Success",
                        text: '<center><p class="header5-body">We have sent an activation email to : ' + user.email + '</p><br><p class="header5-body">Please check...</p></center>',
                        html: true,
                        showCancelButton: false,
                        confirmButtonColor: "#337ab7",
                        confirmButtonText: "OK",
                        closeOnConfirm: true,
                        type: 'success',
                        customClass: "sweet-alert-user-response"
                    });
                } else {
                    swal({
                        title: "Failure",
                        text: '<center><p class="header5-body">Failed to send activation email.' + '</p><br><p class="header5-body">Please try after sometime...</p></center>',
                        html: true,
                        showConfirmButton: true,
                        confirmButtonColor: "#337ab7",
                        confirmButtonText: "OK",
                        closeOnConfirm: true,
                        type: 'error',
                        customClass: "sweet-alert-user-response"
                    });
                }
            }, function errorCallback(response) {
                swal({
                    title: "Failure",
                    text: '<center><p class="header5-body">Failed to send activation email.' + '</p><br><p class="header5-body">Please try after sometime...</p></center>',
                    html: true,
                    showConfirmButton: true,
                    confirmButtonColor: "#337ab7",
                    confirmButtonText: "OK",
                    closeOnConfirm: true,
                    type: 'error',
                    customClass: "sweet-alert-user-response"
                });
            });
        }
        /*$scope.userAmsLink = function(amsList, userId) {
            for (var idx = 0; idx < amsList.length; idx++) {
                var _this = amsList[idx]
                $http({
                    method: 'POST',
                    url: ImapConstants.getUrls().intentwise_base_url + 'organization/' + $scope.loggedInUser.user.organizationId + '/userassociation',
                    headers: {
                        'X-Auth-Token': $scope.loggedInUser.token,
                        'Content-Type': 'application/json'
                    },
                    data: {
                        "userId": userId,
                        "amsAccountId": _this.amsAccountId
                    }
                }).then(function successCallback(response) {
                    console.log("User AMS Link Success :", response)
                }, function errorCallback(response) {
                    console.log("User AMS Link Failed :", response)
                });
            }
        }*/
        $scope.addUser = function() {

            swal({
                title: "<p class='fontFamilia'>Add User</p>",
                text: "<div class='row'><div class='col-md-3'><label style='padding-top: 12%;' for='emailId'>Email ID:</label></div><div class='col-md-9'><input type='text' id='emailId' ng-model='userEmail' ng-keyup='validateMailId(userEmail)'></div></div>" +
                    "<div class='row' id='emailErr' style='color: red;margin-top: -4%;visibility:hidden;' role='alert'><div class='col-sm-12'>Please enter a valid email id.</div></div>" +
                    "<div class='row'><div class='col-md-3'><label style='padding-right: 30%;' for='emailId'>Role:</label></div><div class='col-md-9'><input id='radio_adm' type='radio' name='radio_role'  value='Admin'><label for='radio_adm' class='radio'>Admin</label><input id='radio_any' type='radio' name='radio_role' checked value='Analyst'><label for='radio_any' class='radio'>Analyst</label></div></div>",
                html: true,
                showCancelButton: true,
                closeOnConfirm: false,
                animation: "slide-from-top",
                confirmButtonColor: "#337ab7",
                confirmButtonHoverColor: "#AD2047",
                confirmButtonText: "Add",
                customClass: "sweet-alert-user"
            }, function() {
                var role = document.querySelector('input[name="radio_role"]:checked').value;
                var email = document.querySelector('input[id="emailId"]').value;
                if (email === false) return false;
                if (email === "" || DataService.validateEmail(email) == true) {
                    //swal.showInputError("Please enter a valid email id.");
                    $('#emailErr').css('visibility', 'visible')
                    $('#emailId').toggleClass('unfilled')

                    return false
                } else {
                    usSpinnerService.spin('spinner-4');
                    $('#emailErr').css('visibility', 'hidden')
                    $('#emailId').removeClass('unfilled')
                    $http({
                        method: 'POST',
                        url: ImapConstants.getUrls().intentwise_base_url + 'organization/' + $scope.loggedInUser.user.organizationId + '/user',
                        headers: {
                            'X-Auth-Token': $scope.loggedInUser.token,
                            'Content-Type': 'application/json'
                        },
                        data: {
                            "firstName": "",
                            "lastName": "",
                            "email": email,
                            "role": role
                        }
                    }).then(function successCallback(response) {
                        if (response.status == 201) {
                            //$scope.userAmsLink($scope.amsList, response.data.userId)
                            $scope.loadAdminContent();
                            usSpinnerService.stop('spinner-4');
                            swal({
                                title: "<p class='fontFamilia'>Success</p>",
                                text: '<center><p class="header5-body">Thank you for adding : ' + email + '</p><br><p class="header5-body">We have sent activation email to the registered email id.</p></center>',
                                html: true,
                                showConfirmButton: true,
                                confirmButtonColor: "#337ab7",
                                confirmButtonHoverColor: "#AD2047",
                                confirmButtonText: "OK",
                                type: 'success',
                                customClass: "sweet-alert-user-response"
                            });
                            $scope.userList.push({
                                'email': email,
                                'amsAccountName': '',
                                'role': role,
                                'organizationId': $scope.loggedInUser.user.organizationId,
                                'userId': response.data.userId
                            })
                        } else {
                            usSpinnerService.stop('spinner-4');
                            swal({
                                title: "<p class='fontFamilia'>Failure</p>",
                                text: "<p class='fontFamilia'>User account creation failed</p>",
                                showConfirmButton: true,
                                confirmButtonColor: "#337ab7",
                                confirmButtonHoverColor: "#AD2047",
                                confirmButtonText: "OK",
                                type: 'error',
                                customClass: "sweet-alert-user-response"
                            });
                        }
                    }, function errorCallback(response) {
                        usSpinnerService.stop('spinner-4');
                        swal({
                            title: "Failure",
                            text: "User account creation failed ",
                            showConfirmButton: true,
                            confirmButtonColor: "#337ab7",
                            confirmButtonHoverColor: "#AD2047",
                            confirmButtonText: "OK",
                            type: 'error',
                            customClass: "sweet-alert-user-response"
                        });
                    });
                }
            });
        }

        $scope.gridAmsAccount.onRegisterApi = function(gridApi) {
            //set gridApi on scope
            $scope.gridApi = gridApi;
            gridApi.selection.on.rowSelectionChanged($scope, function(row) {
                var msg = 'row selected ' + row.isSelected;
                if (row.isSelected == true) {
                    $scope.amsListToEdit.push(row)
                } else {
                    $scope.amsListToEdit = $scope.amsListToEdit.remove(row);
                }
            });
            gridApi.selection.on.rowSelectionChangedBatch($scope, function(selectedUser) {
                //var msg = 'rows changed ' + rows.length;
                for (var idx in selectedUser) {
                    if (selectedUser[idx].isSelected == true) {
                        $scope.amsListToEdit.push(selectedUser[idx])
                    } else {
                        $scope.amsListToEdit = $scope.amsListToEdit.remove(selectedUser[idx]);
                    }
                }
            });
        }
        $scope.gridUser.onRegisterApi = function(gridApi) {
            //set gridApi on scope
            $scope.isUserSelected = true
            $scope.gridApi = gridApi;
            gridApi.selection.on.rowSelectionChanged($scope, function(row) {
                var msg = 'row selected ' + row.isSelected;
                if (row.isSelected == true) {
                    $scope.userListToEdit.push(row)
                } else {
                    $scope.userListToEdit = $scope.userListToEdit.remove(row);
                }
            });
            gridApi.selection.on.rowSelectionChangedBatch($scope, function(selectedUser) {
                //var msg = 'rows changed ' + rows.length;
                for (var idx in selectedUser) {
                    if (selectedUser[idx].isSelected == true) {
                        $scope.userListToEdit.push(selectedUser[idx])
                    } else {
                        $scope.userListToEdit = $scope.userListToEdit.remove(selectedUser[idx]);
                    }
                }
            });
        }
        $scope.getAMSaccounts = function() {

            $http({
                    method: 'GET',
                    url: ImapConstants.getUrls().intentwise_base_url + 'organization/' + $scope.loggedInUser.user.organizationId + '/businessgroup/' + $scope.loggedInUser.businessgroupId + '/amsaccount/',
                    data: '',
                    headers: {
                        'X-Auth-Token': $scope.loggedInUser.token,
                        'Content-Type': 'application/json'
                    }
                })
                .then(function mySuccess(response) {
                    $scope.amsAccountList = response.data;
                    $scope.gridAmsAccount.data = $scope.amsAccountList;
                }, function myError(response) {
                    console.log("Error in retrieving AMS data : ", response);
                });
        }

        $scope.getUsers = function() {
            $http({
                    method: 'GET',
                    url: ImapConstants.getUrls().intentwise_base_url + 'organization/' + $scope.loggedInUser.user.organizationId + '/user',
                    data: '',
                    headers: {
                        'X-Auth-Token': $scope.loggedInUser.token,
                        'Content-Type': 'application/json'
                    }
                })
                .then(function mySuccess(response) {
                    $scope.userList = response.data;
                }, function myError(response) {
                    console.log("Error in retribing User data : ", response);
                });
        }
        $scope.getUserUiList = function() {
            for (var userIdx in $scope.userList) {
                var user = $scope.userList[userIdx]

                function findAmsPair(elm) {
                    return elm.userId === user.userId
                }
                var link = $scope.amsUserLink.find(findAmsPair)
                if (link != undefined) {
                    function findAms(elm) {
                        return elm.amsAccountId === link.amsAccountId
                    }
                    var ams = $scope.amsList.find(findAms)
                    if (ams != undefined) {
                        $scope.userList[userIdx].amsAccountId = ams.amsAccountId
                        $scope.userList[userIdx].amsAccountName = ams.name
                    }
                }
            }
            $scope.gridUser.data = $scope.userList
        }
        $scope.loadAdminContent = function() {
            //------API to get AMS accounts------//
            usSpinnerService.spin('spinner-10');
            $http({
                    method: 'GET',
                    url: ImapConstants.getUrls().intentwise_base_url + 'organization/' + $scope.loggedInUser.user.organizationId + '/businessgroup/' + $scope.loggedInUser.businessgroupId + '/amsaccount/',
                    data: '',
                    headers: {
                        'X-Auth-Token': $scope.loggedInUser.token,
                        'Content-Type': 'application/json'
                    }
                })
                .then(function mySuccess(response) {
                    $scope.amsList = response.data
                    //-----API to get AMS~User map------//
                    $http({
                            method: 'GET',
                            url: ImapConstants.getUrls().intentwise_base_url + 'organization/' + $scope.loggedInUser.user.organizationId + '/userassociation',
                            data: '',
                            headers: {
                                'X-Auth-Token': $scope.loggedInUser.token,
                                'Content-Type': 'application/json'
                            }
                        })
                        .then(function mySuccess(response) {
                            $scope.amsUserLink = response.data
                            //--------API to get user data--------//
                            $http({
                                method: 'GET',
                                url: ImapConstants.getUrls().intentwise_base_url + 'organization/' + $scope.loggedInUser.user.organizationId + '/user',
                                data: '',
                                headers: {
                                    'X-Auth-Token': $scope.loggedInUser.token,
                                    'Content-Type': 'application/json'
                                }
                            }).then(function mySuccess(response) {
                                $scope.userList = response.data;
                                $scope.getUserUiList()
                            }, function myError(response) {
                                console.log("Error in retrieving User data : ", response);
                            });
                        }, function myError(response) {
                            console.log("Error in retrieving AMS-User map data : ", response);
                        });
                    usSpinnerService.stop('spinner-10');
                }, function myError(response) {
                    usSpinnerService.stop('spinner-10');
                    console.log("Error in retrieving AMS data : ", response);
                });
        }
        $scope.deactivateAMS = function() {
            if ($scope.amsListToEdit.length > 0) {
                swal({
                    title: "Do you really want to deactivate this account?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#337ab7",
                    confirmButtonText: "Yes, deactivate ",
                    closeOnConfirm: false,
                    customClass: 'sweet-alert-ams-response'
                }, function() {
                    usSpinnerService.spin('spinner-3');
                    for (var idx = 0; idx < $scope.amsListToEdit.length; idx++) {
                        var currAcc = $scope.amsListToEdit[idx].entity
                        $http({
                            method: 'DELETE',
                            url: ImapConstants.getUrls().intentwise_base_url + 'organization/' + currAcc.organizationId + '/businessgroup/' + currAcc.businessGroupId + '/amsaccount/' + currAcc.amsAccountId,
                            data: {
                                'name': currAcc.name,
                                'type': currAcc.type
                            },
                            headers: {
                                'X-Auth-Token': $scope.loggedInUser.token,
                                'Content-Type': 'application/json'
                            }
                        }).then(function mySuccess(response) {
                            usSpinnerService.stop('spinner-3');
                            swal({
                                title: "Deactivated",
                                text: "AMS accounts have been deactivated",

                                showConfirmButton: true,
                                confirmButtonColor: "#337ab7",
                                confirmButtonHoverColor: "#AD2047",
                                confirmButtonText: "OK",
                                type: 'success',
                                customClass: 'sweet-alert-ams-response'
                            });

                        }, function myError(response) {
                            usSpinnerService.stop('spinner-3');
                            swal({
                                title: "Failure",
                                text: "Deactivation of AMS Failed",
                                showConfirmButton: true,
                                confirmButtonColor: "#337ab7",
                                confirmButtonHoverColor: "#AD2047",
                                confirmButtonText: "OK",
                                type: 'error',
                                customClass: 'sweet-alert-ams-response'
                            });
                        });
                    }
                });

            } else {
                // toastr.warning('Please select one/more accounts !', 'Warning');
            }
        }
        $scope.deactivateUser = function() {
            if ($scope.userListToEdit.length > 0) {
                swal({
                    title: "Do you really want to deactivate user?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#337ab7",
                    confirmButtonText: "Yes, deactivate",
                    closeOnConfirm: false,
                    customClass: 'sweet-alert-ams-response'
                }, function() {
                    usSpinnerService.spin('spinner-4');
                    for (var idx = 0; idx < $scope.userListToEdit.length; idx++) {
                        var currUser = $scope.userListToEdit[idx].entity
                        $http({
                                method: 'DELETE',
                                url: ImapConstants.getUrls().intentwise_base_url + 'organization/' + currUser.organizationId + '/user/' + currUser.userId,
                                data: '',
                                headers: {
                                    'X-Auth-Token': $scope.loggedInUser.token,
                                    'Content-Type': 'application/json'
                                }
                            })
                            .then(function mySuccess(response) {
                                usSpinnerService.stop('spinner-4');
                                swal({
                                    title: "Deactivated",
                                    text: "Users have been deactivated.",
                                    showConfirmButton: true,
                                    confirmButtonColor: "#337ab7",
                                    confirmButtonHoverColor: "#AD2047",
                                    confirmButtonText: "OK",
                                    type: 'success',
                                    customClass: 'sweet-alert-ams-response'
                                });
                                $scope.loadAdminContent();
                            }, function myError(response) {
                                if (response.status == 400) {
                                    usSpinnerService.stop('spinner-4');
                                    swal({
                                        title: "Failure",
                                        text: "Selected user cannot be revoked.",
                                        showConfirmButton: true,
                                        confirmButtonColor: "#337ab7",
                                        confirmButtonHoverColor: "#AD2047",
                                        confirmButtonText: "OK",
                                        type: 'error',
                                        customClass: 'sweet-alert-ams-response'
                                    });
                                } else {
                                    usSpinnerService.stop('spinner-4');
                                    swal({
                                        title: "Failure",
                                        text: "Deactivation failed",
                                        showConfirmButton: true,
                                        confirmButtonColor: "#337ab7",
                                        confirmButtonHoverColor: "#AD2047",
                                        confirmButtonText: "OK",
                                        type: 'error',
                                        customClass: 'sweet-alert-ams-response'
                                    });
                                }
                            });
                    }

                });

            } else {
                // toastr.warning('Please select one/more user !', 'Warning');
            }
        }
        $scope.loadGrid = function() {
            if ($scope.loggedInUser.user.role == roles.superAdmin) {
                $scope.loadAdminContent();
                $scope.getAMSaccounts()
            } else {

            }
        }
    }]);
