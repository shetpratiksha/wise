var app = angular.module('app');

app.service('DynamicMenuService', ['$http', '$rootScope', 'ImapConstants', '$cookies', 'SettingService', 'triMenu', function($http, $rootScope, ImapConstants, $cookies, SettingService, triMenu) {


    this.addDynamicMenu = function addDynamicMenu(organizationId) {


        var isMultiAccountViewEnabled = SettingService.isOrganizationSettingEnabled('MULTI_ACC_VIEW', organizationId);
        var isPosViewEnabled = SettingService.isOrganizationSettingEnabled('DISPLAY_POS_DATA', organizationId);
        var isBrandTermsViewEnabled = SettingService.isOrganizationSettingEnabled('DISPLAY_BRAND_TERMS', organizationId);
        var isBrandvsNBViewEnabled = SettingService.isOrganizationSettingEnabled('DISPLAY_BRAND_VS_NB_VIEW', organizationId);
        var isVendorAlertsEnabled = SettingService.isOrganizationSettingEnabled('VENDOR_ALERTS', organizationId);
        var isHighLevelMetricsEnabled = SettingService.isOrganizationSettingEnabled('HIGH_LEVEL_METRICS', organizationId);
        var isCasperReportDownloadEnabled = SettingService.isOrganizationSettingEnabled('CASPER_REPORT_DOWNLOAD', organizationId);
        var isOrganicRankingEnabled = SettingService.isOrganizationSettingEnabled('ORGANIC_RANKING', organizationId);
        var isVendorSalesEnabled = SettingService.isOrganizationSettingEnabled('VENDOR_SALES_OVERVIEW', organizationId);
        var isInternalPlaygroundEnabled = SettingService.isOrganizationSettingEnabled('INTERNAL_PLAYGROUND', organizationId);
        var isLRPosDataEnabled = SettingService.isOrganizationSettingEnabled('LR_DISPLAY_POS_DATA', organizationId);


        triMenu.removeMenu('triangular.ams-analytics-multi-account-view');
        triMenu.removeMenu('triangular.ams-analytics-pos-view');
        triMenu.removeMenu('triangular.ams-analytics-brand-terms-view');
        triMenu.removeMenu('triangular.ams-analytics-brand-vs-nb-view');
        triMenu.removeMenu('triangular.ams-analytics-vendor-alerts');
        triMenu.removeMenu('triangular.ams-high-level-metrics');
        triMenu.removeMenu('triangular.ams-custom-reports-cas-download');
        triMenu.removeMenu('triangular.ams-organic-ranking');
        triMenu.removeMenu('triangular.ams-custom-reports-vendor-sales-overview');
        triMenu.removeMenu('triangular.ams-custom-reports-internal-playground');
        triMenu.removeMenu('triangular.ams-custom-reports-ia-internal-billing');
        triMenu.removeMenu('triangular.ams-custom-reports-lr-pos-data');
        triMenu.removeMenu('Vendor Data');

        childMenu = []
        lrChildMenu = []

        if (isHighLevelMetricsEnabled) {
            lrChildMenu.push({
                name: 'High Level Metrics',
                state: 'triangular.ams-high-level-metrics',
                type: 'link'
            });
        }

        if (isOrganicRankingEnabled) {
            lrChildMenu.push({
                name: 'Organic Ranking',
                state: 'triangular.ams-organic-ranking',
                type: 'link'
            });
        }

        if (isLRPosDataEnabled) {
            lrChildMenu.push({
                name: 'POS Data',
                state: 'triangular.ams-custom-reports-lr-pos-data',
                type: 'link'
            });
        }


        if (lrChildMenu.length > 0 && ($rootScope.current_account != undefined && $rootScope.current_account.name != 'educationalinsights')) {

            triMenu.addMenu({
                name: 'Custom Reports',
                icon: 'fa fa-cubes',
                type: 'dropdown',
                priority: 10,
                children: lrChildMenu
            });
        }

        if (isCasperReportDownloadEnabled) {
            casperChildMenu = []
            casperChildMenu.push({
                name: 'Report Download',
                state: 'triangular.ams-custom-reports-cas-download',
                type: 'link'
            });

            triMenu.addMenu({
                name: 'Custom Reports',
                icon: 'fa fa-cubes',
                type: 'dropdown',
                priority: 10,
                children: casperChildMenu
            });
        }


        if (isMultiAccountViewEnabled) {
            childMenu.push({
                name: 'Account View',
                type: 'link',
                state: 'triangular.ams-analytics-multi-account-view'
            });
        }


        if (isPosViewEnabled) {
            childMenu.push({
                name: 'Vendor Sales and AMS',
                state: 'triangular.ams-analytics-pos-view',
                type: 'link'
            })
        }

        if (isVendorAlertsEnabled) {
            childMenu.push({
                name: 'Vendor Sales Alerts',
                state: 'triangular.ams-analytics-vendor-alerts',
                type: 'link'
            })
        }

        if (isVendorSalesEnabled) {
            childMenu.push({
                name: 'Vendor Sales Overview',
                state: 'triangular.ams-custom-reports-vendor-sales-overview',
                type: 'link'
            })
        }

        if (isBrandTermsViewEnabled) {
            triMenu.addMenu({
                name: 'Competitive Ad Tracking',
                icon: 'fa fa-check-circle',
                type: 'link',
                priority: 8,
                state: 'triangular.ams-analytics-brand-terms-view'
            });
        }

        if (isBrandvsNBViewEnabled) {
            triMenu.addMenu({
                name: 'Brand vs NB Overview',
                icon: 'fa fa-pie-chart',
                type: 'link',
                priority: 8,
                state: 'triangular.ams-analytics-brand-vs-nb-view'
            });
        }

        if (isInternalPlaygroundEnabled) {
            childMenu.push({
                name: 'Internal Dashboard',
                type: 'link',
                state: 'triangular.ams-custom-reports-internal-playground'
            });

            childMenu.push({
                name: 'Internal Billing',
                type: 'link',
                state: 'triangular.ams-custom-reports-ia-internal-billing'
            });
        }

        if (childMenu.length > 0) {
            triMenu.addMenu({
                name: 'Custom Reports',
                icon: 'fa fa-cubes',
                type: 'dropdown',
                priority: 10,
                children: childMenu
            });
        }

        this.addRecommendationMenus(organizationId);
    }



    this.addRecommendationMenus = function(organizationId) {

        var isBidUploadEnabled = true;
        var isRecommendedKeywordUploadEnabled = true;

        var isOrgRegistrationEnabled = SettingService.isOrganizationSettingEnabled('ORG_REGISTRATION', organizationId);
        var isAccountManagementEnabled = SettingService.isOrganizationSettingEnabled('ACCOUNT_MANAGEMENT', organizationId);
        var isUserManagementEnabled = SettingService.isOrganizationSettingEnabled('USER_MANAGEMENT', organizationId);

        var userDetails = $cookies.getObject('loggedInUser')

        triMenu.removeMenu('Bid Management');
        triMenu.removeMenu('Keyword Management');
        triMenu.removeMenu('triangular.ams-recommendations-sponsored-bids');
        triMenu.removeMenu('triangular.ams-recommendation-keyword-bids-sponsored');
        triMenu.removeMenu('triangular.ams-recommendations-sponsored-keywords');
        triMenu.removeMenu('triangular.ams-recommendation-keyword-ideas-sponsored');
        triMenu.removeMenu('triangular.ams-recommendation-keyword-bids-headline');
        triMenu.removeMenu('Admin');
        triMenu.removeMenu('triangular.ams-admin-roas-settings');
        triMenu.removeMenu('triangular.ams-admin-budget-settings');
        triMenu.removeMenu('triangular.ams-admin-account-management');

        var bidManagementMenu = [];
        var keywordManagementMenu = [];
        var adminSettings = [];
        var accountManagement = [];

        if (isBidUploadEnabled) {

            bidManagementMenu.push({
                name: 'Sponsored Keyword Bids',
                state: 'triangular.ams-recommendations-sponsored-bids',
                type: 'link'
            })
        } else {
            bidManagementMenu.push({
                name: 'Sponsored Keyword Bids',
                state: 'triangular.ams-recommendation-keyword-bids-sponsored',
                type: 'link'
            })
        }

        bidManagementMenu.push({
            name: 'Headline Keyword Bids',
            state: 'triangular.ams-recommendation-keyword-bids-headline',
            type: 'link'
        })

        
        adminSettings.push({
            name: 'Target ACOS',
            state: 'triangular.ams-admin-roas-settings',
            type: 'link'
        })
    
        adminSettings.push({
            name: 'Monthly Budget',
            state: 'triangular.ams-admin-budget-settings',
            type: 'link'
        })
        
        if (userDetails.user.role == "SUPER_ADMIN") {
            if(isOrgRegistrationEnabled || isAccountManagementEnabled || isUserManagementEnabled || userDetails.user.role == "SUPER_ADMIN"){
                adminSettings.push({
                    name: 'Account Management',
                    state: 'triangular.ams-admin-account-management',
                    type: 'link'
                })
            }
        }
        if (isRecommendedKeywordUploadEnabled) {

            keywordManagementMenu.push({
                name: 'Sponsored New Keywords',
                state: 'triangular.ams-recommendations-sponsored-keywords',
                type: 'link'
            })
        } else {
            keywordManagementMenu.push({
                name: 'Sponsored New Keywords',
                state: 'triangular.ams-recommendation-keyword-ideas-sponsored',
                type: 'link'
            })
        }

        if (bidManagementMenu.length > 0) {
            triMenu.addMenu({
                name: 'Bid Management',
                icon: 'fa fa-usd',
                type: 'dropdown',
                priority: 6,
                children: bidManagementMenu
            });
        }

        if (keywordManagementMenu.length > 0) {
            triMenu.addMenu({
                name: 'Keyword Management',
                icon: 'fa fa-lightbulb-o',
                type: 'dropdown',
                priority: 7,
                children: keywordManagementMenu
            });
        }
        //if (userDetails.user.role == "SUPER_ADMIN" || userDetails.user.role == "ADMIN") {
            if (adminSettings.length > 0) {
                triMenu.addMenu({
                    name: 'Admin',
                    icon: 'fa fa-lock',
                    type: 'dropdown',
                    priority: 9,
                    children: adminSettings
                });
            }
        //}
    }
}]);
