(function() {
    'use strict';

    angular
        .module('app.ams-recommendations')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($stateProvider, triMenuProvider) {

        $stateProvider
        .state('triangular.ams-recommendations-sponsored-keywords', {
            url: '/ams-recommendations/sponsored-keywords',
            templateUrl: 'app/ams-recommendations/sponsored-ads/new-keywords.tmpl.html',
            // set the controller to load for this page
            controller: 'AMSSPKeywordRecommendationsController',
            controllerAs: 'vm',
            // layout-column class added to make footer move to
            // bottom of the page on short pages
            data: {
                layout: {
                    contentClass: 'layout-column'
                }
            }
        })
        .state('triangular.ams-recommendations-sponsored-bids', {
            url: '/ams-recommendations/sponsored-bids',
            templateUrl: 'app/ams-recommendations/sponsored-ads/keyword-bids.tmpl.html',
            // set the controller to load for this page
            controller: 'AMSSPBidRecommendationsController',
            controllerAs: 'vm',
            // layout-column class added to make footer move to
            // bottom of the page on short pages
            data: {
                layout: {
                    contentClass: 'layout-column'
                }
            }
        })
        .state('triangular.ams-recommendations-headline-bids', {
            url: '/ams-recommendations/headline-bids',
            templateUrl: 'app/ams-recommendations/headline-ads/keyword-bids.tmpl.html',
            // set the controller to load for this page
            controller: 'AMSRecommendationsController',
            controllerAs: 'vm',
            // layout-column class added to make footer move to
            // bottom of the page on short pages
            data: {
                layout: {
                    contentClass: 'layout-column'
                }
            }
        });

/*
        triMenuProvider.addMenu({
            name: 'Bid Uploads (BETA)',
            icon: 'fa icon-beta',
            type: 'dropdown',
            priority: 6,
            children: [{
                name: 'Sponsored Keyword Bids',
                state: 'triangular.ams-recommendations-sponsored-bids',
                type: 'link'
            },{
                name: 'Sponsored New Keywords',
                state: 'triangular.ams-recommendations-sponsored-keywords',
                type: 'link'
            },{
                name: 'Headline Keyword Bids',
                state: 'triangular.ams-recommendations-headline-bids',
                type: 'link'
            }]
        });
        */
    }

})();
