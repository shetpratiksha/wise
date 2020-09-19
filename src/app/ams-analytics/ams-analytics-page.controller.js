(function() {
    'use strict';

    angular.module('app.ams-analytics').controller('AMSAnalyticsController', AMSAnalyticsController);

    /* @ngInject */
    function AMSAnalyticsController(ImapConstants, $location, $scope, $cookies, $rootScope, $http, $sce, DateRangeService, $timeout, $state, triLayout, triSettings,SettingService,DynamicMenuService) {
    	var vm = this;
        vm.triSettings = triSettings;
        vm.triLayout = triLayout
        $rootScope.isDashboardLoaded = true;
        $rootScope.current_organization = $cookies.getObject('current_organization');
        vm.recommendation = {
            error : false,
            disabled: false,
            keywordDisabled: false,
            message: ''
        };


    	var urlConstants = ImapConstants.getUrls()
        var IDs = ImapConstants.getIds()

    	if($location.$$path == "/ams-analytics/overview") {
            $rootScope.dashboardId = IDs.OVERVIEW;
            $rootScope.visibleFilters = ["DateAggregation", "daterange", "CampaignType", "Campaigns"]

        } else if($location.$$path == "/ams-analytics/campaign") {
            $rootScope.dashboardId = IDs.CAMPAIGNS;
            $rootScope.visibleFilters = ["DateAggregation", "daterange", "CampaignType", "Campaigns"]
        } else if($location.$$path == "/ams-analytics/headline-keywords") {
            $rootScope.dashboardId = IDs.HEADLINEKEYWORDS;
            $rootScope.visibleFilters = ["daterange","HeadlineKeywords", "HeadlineCampaigns"]
        } else if($location.$$path == "/ams-analytics/sponsored-keywords") {
            $rootScope.dashboardId = IDs.SPONSOREDKEYWORDS;
            $rootScope.visibleFilters = ["daterange","SponsoredKeywords", "SponsoredCampaigns"]
        } else if($location.$$path == "/ams-analytics/negative-keywords") {
            $rootScope.dashboardId = IDs.NEGATIVEKEYWORDS;
            $rootScope.visibleFilters = ["SponsoredCampaigns"]
        } else if($location.$$path == "/ams-analytics/sponsored-products") {
            $rootScope.dashboardId = IDs.PRODUCTSUMMARY;
            $rootScope.visibleFilters = ["daterange","SponsoredProducts", "SponsoredCampaigns"]
        } else if($location.$$path == "/ams-analytics/sponsored-search-terms") {
            $rootScope.dashboardId = IDs.CUSTOMERSEARCHTERM;
            $rootScope.visibleFilters = ["daterange","SponsoredKeywords", "SponsoredCampaigns"]
        } else if($location.$$path == "/ams-analytics/keyword-bids-headline") {
            $rootScope.dashboardId = IDs.HEADLINEKEYWORDBIDS;
            $rootScope.visibleFilters = [];
        } else if($location.$$path == "/ams-analytics/keyword-bids-sponsored") {
            $rootScope.dashboardId = IDs.SPONSOREDKEYWORDBIDS;
            $rootScope.visibleFilters = [];
        } else if($location.$$path == "/ams-analytics/keyword-ideas-sponsored") {
            $rootScope.dashboardId = IDs.SPONSOREDKEYWORDIDEAS;
            $rootScope.visibleFilters = [];
        } else if($location.$$path == "/ams-analytics/multi-account-view" && SettingService.isOrganizationSettingEnabled('MULTI_ACC_VIEW',$rootScope.current_organization.organizationId)){
            $rootScope.dashboardId = IDs.MULTIACCOUNTVIEW;
            $rootScope.visibleFilters = ["CampaignType","DateAggregation","daterange"];
        } else if($location.$$path == "/ams-analytics/pos-view" && SettingService.isOrganizationSettingEnabled('DISPLAY_POS_DATA',$rootScope.current_organization.organizationId)){
            $rootScope.dashboardId = IDs.POSVIEW;
            $rootScope.visibleFilters = ["DateAggregation","daterange","Brands"];
        } else if($location.$$path == "/ams-analytics/brand-terms-view" && SettingService.isOrganizationSettingEnabled('DISPLAY_BRAND_TERMS',$rootScope.current_organization.organizationId)){
            $rootScope.dashboardId = IDs.BRANDVIEW;
            $rootScope.visibleFilters = ["daterange"];
        } else if($location.$$path == "/ams-analytics/brand-vs-nb-view" && SettingService.isOrganizationSettingEnabled('DISPLAY_BRAND_VS_NB_VIEW',$rootScope.current_organization.organizationId)){
            $rootScope.dashboardId = IDs.BRANDVSNBVIEW;
            $rootScope.visibleFilters = ["daterange","DateAggregation"];
        } else if($location.$$path == "/ams-analytics/vendor-alerts" && SettingService.isOrganizationSettingEnabled('VENDOR_ALERTS',$rootScope.current_organization.organizationId)){
            $rootScope.dashboardId = IDs.VENDORALERTS;
            $rootScope.visibleFilters = ["daterange","DateAggregation","Brands"];
        } else if($location.$$path == "/ams-analytics/high-level-metrics" && SettingService.isOrganizationSettingEnabled('HIGH_LEVEL_METRICS',$rootScope.current_organization.organizationId)){
            $rootScope.dashboardId = IDs.HIGHLEVELMETRICS;
            $rootScope.visibleFilters = [];
        } else if($location.$$path == "/ams-analytics/custom-reports-cas-download" && SettingService.isOrganizationSettingEnabled('CASPER_REPORT_DOWNLOAD',$rootScope.current_organization.organizationId)){
            $rootScope.dashboardId = IDs.CASPERREPORTDOWNLOAD;
            $rootScope.visibleFilters = [];
        } else if($location.$$path == "/ams-analytics/organic-ranking" && SettingService.isOrganizationSettingEnabled('ORGANIC_RANKING',$rootScope.current_organization.organizationId)){
            $rootScope.dashboardId = IDs.ORGANICRANKING;
            $rootScope.visibleFilters = ["RankDate","Keywords","KeywordCategory","KeywordSource"];
        } else if($location.$$path == "/ams-analytics/custom-reports-vendor-sales-overview" && SettingService.isOrganizationSettingEnabled('VENDOR_SALES_OVERVIEW',$rootScope.current_organization.organizationId)){
            $rootScope.dashboardId = IDs.VENDORSALESOVERVIEW;
            $rootScope.visibleFilters = ["DateAggregation","daterange","Brands"];
        } else if($location.$$path == "/ams-analytics/custom-reports-internal-playground" && SettingService.isOrganizationSettingEnabled('INTERNAL_PLAYGROUND',$rootScope.current_organization.organizationId)){
            $rootScope.dashboardId = IDs.INTERNALPLAYGROUND;
            $rootScope.visibleFilters = ["daterange"];
        }else if($location.$$path == "/ams-analytics/custom-reports-internal-billing" && SettingService.isOrganizationSettingEnabled('INTERNAL_PLAYGROUND',$rootScope.current_organization.organizationId)){
            $rootScope.dashboardId = IDs.IABILLING;
            $rootScope.visibleFilters = [];
        }else if($location.$$path == "/ams-analytics/custom-reports-lr-pos-data" && SettingService.isOrganizationSettingEnabled('LR_DISPLAY_POS_DATA',$rootScope.current_organization.organizationId)){
            $rootScope.dashboardId = IDs.LRPOSDATA;
            $rootScope.visibleFilters = ["DateAggregation","daterange","POSASIN"];
        }


        $scope.dataObj = {
            "dashboard": $rootScope.dashboardId,
            "embed": "v2",
            "filters": [],
            "daterange": {},
            "DateAggregation": 'day',
            "data_ts":"",
            "border": "off"
        }


        vm.loggedInUser = $cookies.getObject('loggedInUser');

        if(vm.loggedInUser == undefined) {
            $state.go("authentication.login")
        }

        $rootScope.loggedInUser = vm.loggedInUser



        $scope.renderDashboard = function(organizationId, businessGroupId, account, dashboardId) {

        	var baseUrl = urlConstants.periscope_base_url
        	var path = urlConstants.periscope_base_path
        	var apikey = '8d0396d7-ef1a-4641-85a8-26216b95'

        	var periscopeData = {
        		filters : []
        	}

        	periscopeData.filters.push({ "name": "imap_account_filter", "value": account.name })
            periscopeData.filters.push({"name": "imap_account_id_filter","value":account.amsAccountId})
            periscopeData.filters.push({"name": "imap_organization_id_filter","value":organizationId})
            periscopeData.filters.push({"name": "DateAggregation","value":"day"})
            var accounts = []
            for (var i =0; i < $rootScope.accounts.length;i++) {
                accounts.push($rootScope.accounts[i].name)
            }

            periscopeData.filters.push({"name": "ia_account_filter","value": accounts})
            periscopeData.dashboard = dashboardId;
            periscopeData.embed = "v2";
            periscopeData.border = "off";

            if(account.name == "earthlitede" || (account.name == "earthlitefr")){

                periscopeData.filters.push({ "name": "imap_currency_filter", "value": "EURO" });
            }else if(account.name == "earthliteuk") {

                periscopeData.filters.push({ "name": "imap_currency_filter", "value": "GBP" });
            } else {

            	periscopeData.filters.push({"name": "imap_currency_filter","value":"USD"})
            }

            periscopeData.daterange =  {"days": 14};

            var data_ts = '';
            //pass data_ts to refresh dashboard, currently refresh at 12:30 UTC time
            var currentDateUTCElevenHours = DateRangeService.getCurrentDateUTCHours(12,45)
            if (DateRangeService.isCurrentTimeGreaterThan(currentDateUTCElevenHours)){
                data_ts = currentDateUTCElevenHours.unix();
            }else {
                data_ts = DateRangeService.getYesterdayUtcHoursEpoc(12,45);
            }

            if($rootScope.dashboardId == IDs.BRANDVIEW){
                var currentDateUTCHours = DateRangeService.getCurrentDateUTCHours(15,30)
                if (DateRangeService.isCurrentTimeGreaterThan(currentDateUTCHours)){
                    data_ts = currentDateUTCHours.unix();
                }
            }

            periscopeData.data_ts = data_ts;

			periscopeData.visible = $rootScope.visibleFilters;

            //Create the URL to be loaded

            var encodedUri = encodeURIComponent(JSON.stringify(periscopeData));
            //msg for HmacSHA256....
            var msgHmac = path + encodedUri
            //Creating HMAC using SHA-256 algorithm....
            var hmacEnc = CryptoJS.HmacSHA256(msgHmac, apikey).toString()
            $rootScope.actualURL = $sce.trustAsResourceUrl(baseUrl + path + encodedUri + '&signature=' + hmacEnc);

            $rootScope.currentAcId = account.amsAccountId
            $rootScope.currentOrgId = organizationId;

            $timeout(function() {
                $rootScope.isDashboardLoaded = false;
            }, 2000);

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

        $scope.$on('org_acc_loaded', function() {

            DynamicMenuService.addDynamicMenu($rootScope.current_organization.organizationId);

            if(($location.$$path == "/ams-analytics/multi-account-view" && !SettingService.isOrganizationSettingEnabled('MULTI_ACC_VIEW',$rootScope.current_organization.organizationId)) ||
                ($location.$$path == "/ams-analytics/brand-terms-view" && !SettingService.isOrganizationSettingEnabled('DISPLAY_BRAND_TERMS',$rootScope.current_organization.organizationId)) ||
                ($location.$$path == "/ams-analytics/brand-vs-nb-view" && !SettingService.isOrganizationSettingEnabled('DISPLAY_BRAND_VS_NB_VIEW',$rootScope.current_organization.organizationId)) ||
                ($location.$$path == "/ams-analytics/pos-view" && !SettingService.isOrganizationSettingEnabled('DISPLAY_POS_DATA',$rootScope.current_organization.organizationId)) ||
                ($location.$$path == "/ams-analytics/vendor-alerts" && !SettingService.isOrganizationSettingEnabled('VENDOR_ALERTS',$rootScope.current_organization.organizationId)) ||
                ($location.$$path == "/ams-analytics/high-level-metrics" && !SettingService.isOrganizationSettingEnabled('HIGH_LEVEL_METRICS',$rootScope.current_organization.organizationId)) ||
                ($location.$$path == "/ams-analytics/custom-reports-cas-download" && !SettingService.isOrganizationSettingEnabled('CASPER_REPORT_DOWNLOAD',$rootScope.current_organization.organizationId)) ||
                ($location.$$path == "/ams-analytics/organic-ranking" && !SettingService.isOrganizationSettingEnabled('ORGANIC_RANKING',$rootScope.current_organization.organizationId)) ||
                ($location.$$path == "/ams-analytics/custom-reports-vendor-sales-overview" && !SettingService.isOrganizationSettingEnabled('VENDOR_SALES_OVERVIEW',$rootScope.current_organization.organizationId)) ||
                ($location.$$path == "/ams-analytics/custom-reports-internal-playground" && !SettingService.isOrganizationSettingEnabled('INTERNAL_PLAYGROUND',$rootScope.current_organization.organizationId)) ||
                ($location.$$path == "/ams-analytics/custom-reports-internal-billing" && !SettingService.isOrganizationSettingEnabled('INTERNAL_PLAYGROUND',$rootScope.current_organization.organizationId)) ||
                ($location.$$path == "/ams-analytics/custom-reports-lr-pos-data" && !SettingService.isOrganizationSettingEnabled('LR_DISPLAY_POS_DATA',$rootScope.current_organization.organizationId))) {
                $state.go('triangular.ams-analytics-overview');
            }


            if($location.$$path == "/ams-analytics/headline" ||
                $location.$$path == "/ams-analytics/overview" ||
                $location.$$path == "/ams-analytics/campaign" ||
                $location.$$path == '/ams-analytics/sponsored-campaign' ||
                $location.$$path == '/ams-analytics/product-campaign' ||
                $location.$$path == '/ams-analytics/headline-keywords' ||
                $location.$$path == '/ams-analytics/sponsored-keywords' ||
                $location.$$path == '/ams-analytics/sponsored-search-terms' ||
                $location.$$path == '/ams-analytics/keyword-bids-headline' ||
                $location.$$path == '/ams-analytics/keyword-bids-sponsored' ||
                $location.$$path == '/ams-analytics/keyword-ideas-sponsored' ||
                $location.$$path == '/ams-analytics/multi-account-view' ||
                $location.$$path == '/ams-analytics/pos-view' ||
                $location.$$path == '/ams-analytics/brand-terms-view' ||
                $location.$$path == '/ams-analytics/brand-vs-nb-view' ||
                $location.$$path == '/ams-analytics/sponsored-products' ||
                $location.$$path == '/ams-analytics/high-level-metrics' ||
                $location.$$path == '/ams-analytics/custom-reports-cas-download' ||
                $location.$$path == '/ams-analytics/organic-ranking' ||
                $location.$$path == '/ams-analytics/custom-reports-vendor-sales-overview' ||
                $location.$$path == '/ams-analytics/custom-reports-internal-playground' ||
                $location.$$path == '/ams-analytics/custom-reports-internal-billing' ||
                $location.$$path == "/ams-analytics/custom-reports-lr-pos-data") {

                $scope.renderDashboard($rootScope.current_organization.organizationId, $rootScope.current_bg.businessGroupId, $rootScope.current_account, $rootScope.dashboardId)
            }
        })

        if($rootScope.current_organization != undefined && $rootScope.current_bg != undefined &&
            $rootScope.current_account != undefined) {

            $scope.renderDashboard($rootScope.current_organization.organizationId, $rootScope.current_bg.businessGroupId, $rootScope.current_account, $rootScope.dashboardId)
        }

    }
})();
