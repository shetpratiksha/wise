(function() {
    'use strict';

    angular
        .module('app.ams-analytics')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($stateProvider, triMenuProvider) {

        $stateProvider
        .state('triangular.ams-analytics-overview', {
            url: '/ams-analytics/overview',
            templateUrl: 'app/ams-analytics/ams-analytics.tmpl.html',
            // set the controller to load for this page
            controller: 'AMSAnalyticsController',
            controllerAs: 'vm',
            // layout-column class added to make footer move to
            // bottom of the page on short pages
            data: {
                layout: {
                    contentClass: 'layout-column'
                }
            }
        })
        .state('triangular.ams-analytics-campaign', {
            url: '/ams-analytics/campaign',
            templateUrl: 'app/ams-analytics/ams-analytics.tmpl.html',
            // set the controller to load for this page
            controller: 'AMSAnalyticsController',
            controllerAs: 'vm',
            // layout-column class added to make footer move to
            // bottom of the page on short pages
            data: {
                layout: {
                    contentClass: 'layout-column'
                }
            }
        })
        .state('triangular.ams-analytics-sponsored-campaign', {
            url: '/ams-analytics/sponsored-campaign',
            templateUrl: 'app/ams-analytics/ams-analytics.tmpl.html',
            // set the controller to load for this page
            controller: 'AMSAnalyticsController',
            controllerAs: 'vm',
            // layout-column class added to make footer move to
            // bottom of the page on short pages
            data: {
                layout: {
                    contentClass: 'layout-column'
                }
            }
        })
        .state('triangular.ams-analytics-product-campaign', {
            url: '/ams-analytics/product-campaign',
            templateUrl: 'app/ams-analytics/ams-analytics.tmpl.html',
            // set the controller to load for this page
            controller: 'AMSAnalyticsController',
            controllerAs: 'vm',
            // layout-column class added to make footer move to
            // bottom of the page on short pages
            data: {
                layout: {
                    contentClass: 'layout-column'
                }
            }
        })
        .state('triangular.ams-keywords-headline-keywords', {
            url: '/ams-analytics/headline-keywords',
            templateUrl: 'app/ams-analytics/ams-analytics.tmpl.html',
            // set the controller to load for this page
            controller: 'AMSAnalyticsController',
            controllerAs: 'vm',
            // layout-column class added to make footer move to
            // bottom of the page on short pages
            data: {
                layout: {
                    contentClass: 'layout-column'
                }
            }
        })
        .state('triangular.ams-keywords-sponsored-keywords', {
            url: '/ams-analytics/sponsored-keywords',
            templateUrl: 'app/ams-analytics/ams-analytics.tmpl.html',
            // set the controller to load for this page
            controller: 'AMSAnalyticsController',
            controllerAs: 'vm',
            // layout-column class added to make footer move to
            // bottom of the page on short pages
            data: {
                layout: {
                    contentClass: 'layout-column'
                }
            }
        })
       .state('triangular.ams-keywords-negative-keywords', {
            url: '/ams-analytics/negative-keywords',
            templateUrl: 'app/ams-analytics/ams-analytics.tmpl.html',
            // set the controller to load for this page
            controller: 'AMSAnalyticsController',
            controllerAs: 'vm',
            // layout-column class added to make footer move to
            // bottom of the page on short pages
            data: {
                layout: {
                    contentClass: 'layout-column'
                }
            }
        })
        .state('triangular.ams-analytics-sponsored-products', {
            url: '/ams-analytics/sponsored-products',
            templateUrl: 'app/ams-analytics/ams-analytics.tmpl.html',
            // set the controller to load for this page
            controller: 'AMSAnalyticsController',
            controllerAs: 'vm',
            // layout-column class added to make footer move to
            // bottom of the page on short pages
            data: {
                layout: {
                    contentClass: 'layout-column'
                }
            }
        })
        .state('triangular.ams-custom-reports-cas-download', {
            url: '/ams-analytics/custom-reports-cas-download',
            templateUrl: 'app/ams-analytics/ams-analytics.tmpl.html',
            // set the controller to load for this page
            controller: 'AMSAnalyticsController',
            controllerAs: 'vm',
            // layout-column class added to make footer move to
            // bottom of the page on short pages
            data: {
                layout: {
                    contentClass: 'layout-column'
                }
            }
        })
        .state('triangular.ams-custom-reports-vendor-sales-overview', {
            url: '/ams-analytics/custom-reports-vendor-sales-overview',
            templateUrl: 'app/ams-analytics/ams-analytics.tmpl.html',
            // set the controller to load for this page
            controller: 'AMSAnalyticsController',
            controllerAs: 'vm',
            // layout-column class added to make footer move to
            // bottom of the page on short pages
            data: {
                layout: {
                    contentClass: 'layout-column'
                }
            }
        })
        .state('triangular.ams-analytics-sponsored-search-terms', {
            url: '/ams-analytics/sponsored-search-terms',
            templateUrl: 'app/ams-analytics/ams-analytics.tmpl.html',
            // set the controller to load for this page
            controller: 'AMSAnalyticsController',
            controllerAs: 'vm',
            // layout-column class added to make footer move to
            // bottom of the page on short pages
            data: {
                layout: {
                    contentClass: 'layout-column'
                }
            }
        })
        .state('triangular.ams-recommendation-keyword-bids-headline', {
            url: '/ams-analytics/keyword-bids-headline',
            templateUrl: 'app/ams-analytics/ams-analytics.tmpl.html',
            // set the controller to load for this page
            controller: 'AMSAnalyticsController',
            controllerAs: 'vm',
            // layout-column class added to make footer move to
            // bottom of the page on short pages
            data: {
                layout: {
                    contentClass: 'layout-column'
                }
            }
        })
        .state('triangular.ams-analytics-multi-account-view', {
            url: '/ams-analytics/multi-account-view',
            templateUrl: 'app/ams-analytics/ams-analytics.tmpl.html',
            // set the controller to load for this page
            controller: 'AMSAnalyticsController',
            controllerAs: 'vm',
            // layout-column class added to make footer move to
            // bottom of the page on short pages
            data: {
                layout: {
                    contentClass: 'layout-column'
                }
            }
        })
        .state('triangular.ams-analytics-vendor-alerts', {
            url: '/ams-analytics/vendor-alerts',
            templateUrl: 'app/ams-analytics/ams-analytics.tmpl.html',
            // set the controller to load for this page
            controller: 'AMSAnalyticsController',
            controllerAs: 'vm',
            // layout-column class added to make footer move to
            // bottom of the page on short pages
            data: {
                layout: {
                    contentClass: 'layout-column'
                }
            }
        })
        .state('triangular.ams-analytics-pos-view', {
            url: '/ams-analytics/pos-view',
            templateUrl: 'app/ams-analytics/ams-analytics.tmpl.html',
            // set the controller to load for this page
            controller: 'AMSAnalyticsController',
            controllerAs: 'vm',
            // layout-column class added to make footer move to
            // bottom of the page on short pages
            data: {
                layout: {
                    contentClass: 'layout-column'
                }
            }
        })
        .state('triangular.ams-analytics-brand-vs-nb-view', {
            url: '/ams-analytics/brand-vs-nb-view',
            templateUrl: 'app/ams-analytics/ams-analytics.tmpl.html',
            // set the controller to load for this page
            controller: 'AMSAnalyticsController',
            controllerAs: 'vm',
            // layout-column class added to make footer move to
            // bottom of the page on short pages
            data: {
                layout: {
                    contentClass: 'layout-column'
                }
            }
        })
        .state('triangular.ams-analytics-brand-terms-view', {
            url: '/ams-analytics/brand-terms-view',
            templateUrl: 'app/ams-analytics/ams-analytics.tmpl.html',
            // set the controller to load for this page
            controller: 'AMSAnalyticsController',
            controllerAs: 'vm',
            // layout-column class added to make footer move to
            // bottom of the page on short pages
            data: {
                layout: {
                    contentClass: 'layout-column'
                }
            }
        })
        .state('triangular.ams-recommendation-keyword-bids-sponsored', {
            url: '/ams-analytics/keyword-bids-sponsored',
            templateUrl: 'app/ams-analytics/ams-analytics.tmpl.html',
            // set the controller to load for this page
            controller: 'AMSAnalyticsController',
            controllerAs: 'vm',
            // layout-column class added to make footer move to
            // bottom of the page on short pages
            data: {
                layout: {
                    contentClass: 'layout-column'
                }
            }
        })
        .state('triangular.ams-high-level-metrics', {
            url: '/ams-analytics/high-level-metrics',
            templateUrl: 'app/ams-analytics/ams-analytics.tmpl.html',
            // set the controller to load for this page
            controller: 'AMSAnalyticsController',
            controllerAs: 'vm',
            // layout-column class added to make footer move to
            // bottom of the page on short pages
            data: {
                layout: {
                    contentClass: 'layout-column'
                }
            }
        })
        .state('triangular.ams-organic-ranking', {
            url: '/ams-analytics/organic-ranking',
            templateUrl: 'app/ams-analytics/ams-analytics.tmpl.html',
            // set the controller to load for this page
            controller: 'AMSAnalyticsController',
            controllerAs: 'vm',
            // layout-column class added to make footer move to
            // bottom of the page on short pages
            data: {
                layout: {
                    contentClass: 'layout-column'
                }
            }
        })
        .state('triangular.ams-custom-reports-internal-playground', {
            url: '/ams-analytics/custom-reports-internal-playground',
            templateUrl: 'app/ams-analytics/ams-analytics.tmpl.html',
            // set the controller to load for this page
            controller: 'AMSAnalyticsController',
            controllerAs: 'vm',
            // layout-column class added to make footer move to
            // bottom of the page on short pages
            data: {
                layout: {
                    contentClass: 'layout-column'
                }
            }
        })
        .state('triangular.ams-custom-reports-lr-pos-data', {
            url: '/ams-analytics/custom-reports-lr-pos-data',
            templateUrl: 'app/ams-analytics/ams-analytics.tmpl.html',
            // set the controller to load for this page
            controller: 'AMSAnalyticsController',
            controllerAs: 'vm',
            // layout-column class added to make footer move to
            // bottom of the page on short pages
            data: {
                layout: {
                    contentClass: 'layout-column'
                }
            }
        })
        .state('triangular.ams-custom-reports-ia-internal-billing', {
            url: '/ams-analytics/custom-reports-internal-billing',
            templateUrl: 'app/ams-analytics/ams-analytics.tmpl.html',
            // set the controller to load for this page
            controller: 'AMSAnalyticsController',
            controllerAs: 'vm',
            // layout-column class added to make footer move to
            // bottom of the page on short pages
            data: {
                layout: {
                    contentClass: 'layout-column'
                }
            }
        })
        .state('triangular.ams-recommendation-keyword-ideas-sponsored', {
            url: '/ams-analytics/keyword-ideas-sponsored',
            templateUrl: 'app/ams-analytics/ams-analytics.tmpl.html',
            // set the controller to load for this page
            controller: 'AMSAnalyticsController',
            controllerAs: 'vm',
            // layout-column class added to make footer move to
            // bottom of the page on short pages
            data: {
                layout: {
                    contentClass: 'layout-column'
                }
            }
        });

        triMenuProvider.addMenu({

            name: 'Overview',
            icon: 'fa fa-tachometer',
            type: 'link',
            priority: 1,
            state: 'triangular.ams-analytics-overview'
        });

        triMenuProvider.addMenu({
            name: 'Campaigns',
            icon: 'fa fa-area-chart',
            type: 'link',
            priority: 2,
            state: 'triangular.ams-analytics-campaign'
        });

        triMenuProvider.addMenu({
            name: 'Keywords',
            icon: 'fa fa-bar-chart',
            type: 'dropdown',
            priority: 3,
            children: [{
                name: 'Sponsored Keywords',
                state: 'triangular.ams-keywords-sponsored-keywords',
                type: 'link'
            },{
                name: 'Sponsored Search Terms',
                state: 'triangular.ams-analytics-sponsored-search-terms',
                type: 'link'
            },{
                name: 'Negative Keywords',
                state: 'triangular.ams-keywords-negative-keywords',
                type: 'link'
            },{
                name: 'Headline Keywords',
                state: 'triangular.ams-keywords-headline-keywords',
                type: 'link'
            }]
        });

        triMenuProvider.addMenu({
            name: 'Sponsored Products',
            icon: 'fa fa-line-chart',
            type: 'link',
            priority: 4,
            state: 'triangular.ams-analytics-sponsored-products'
        });

    }

})();
