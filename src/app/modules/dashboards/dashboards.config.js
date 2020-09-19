(function() {
    'use strict';

    angular
        .module('app.modules.dashboards')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($stateProvider, triMenuProvider) {

        $stateProvider
        .state('triangular.sales-layout', {
            abstract: true,
            views: {
                sidebarLeft: {
                    templateUrl: 'app/layouts/leftsidenav/leftsidenav.tmpl.html',
                    controller: 'MenuController',
                    controllerAs: 'vm'
                },
                content: {
                    template: '<div id="admin-panel-content-view" flex ui-view></div>'
                },
                belowContent: {
                    template: '<div ui-view="belowContent"></div>'
                }
            }
        })
        .state('triangular.dashboard-general', {
            url: '/dashboards/general',
            templateUrl: 'app/modules/dashboards/general/dashboard-general.tmpl.html'
        })
        .state('triangular.dashboard-analytics', {
            url: '/dashboards/analytics',
            views: {
                '': {
                    templateUrl: 'app/modules/dashboards/analytics/analytics.tmpl.html',
                    controller: 'DashboardAnalyticsController',
                    controllerAs: 'vm'
                },
                'belowContent': {
                    templateUrl: 'app/modules/dashboards/analytics/fab-button.tmpl.html',
                    controller: 'DashboardAnalyticsFabButtonController',
                    controllerAs: 'vm'
                }
            },
            data: {
                layout: {
                    contentClass: 'analytics-dashboard'
                }
            }
        })
        .state('triangular.dashboard-classic', {
            url: '/dashboards/classic',
            templateUrl: 'app/modules/dashboards/classic/classic.tmpl.html',
            controller: 'DashboardClassicController',
            controllerAs: 'vm'
        })
        .state('triangular.dashboard-server', {
            url: '/dashboards/server',
            templateUrl: 'app/modules/dashboards/server/dashboard-server.tmpl.html',
            controller: 'DashboardServerController',
            controllerAs: 'vm'
        })
        .state('triangular.dashboard-widgets', {
            url: '/dashboards/widgets',
            templateUrl: 'app/modules/dashboards/widgets.tmpl.html'
        })
        .state('triangular.dashboard-social', {
            url: '/dashboards/social',
            templateUrl: 'app/modules/dashboards/social/dashboard-social.tmpl.html',
            controller: 'DashboardSocialController',
            controllerAs: 'vm'
        })
        .state('triangular.dashboard-sales', {
            url: '/dashboards/sales',
            data: {
                layout: {
                    showToolbar: false
                }
            },
            views: {
                '': {
                    templateUrl: 'app/modules/dashboards/sales/dashboard-sales.tmpl.html',
                    controller: 'DashboardSalesController',
                    controllerAs: 'vm'
                },
                'belowContent': {
                    templateUrl: 'app/modules/dashboards/sales/fab-button.tmpl.html',
                    controller: 'SalesFabController',
                    controllerAs: 'vm'
                }
            }
        })
        .state('triangular.dashboard-draggable', {
            url: '/dashboards/draggable-widgets',
            templateUrl: 'app/modules/dashboards/dashboard-draggable.tmpl.html',
            controller: 'DashboardDraggableController',
            controllerAs: 'vm'
        });

        triMenuProvider.addMenu({
            name: 'Dashboards',
            icon: 'zmdi zmdi-home',
            type: 'dropdown',
            priority: 5,
            children: [{
                name: 'Analytics',
                state: 'triangular.dashboard-analytics',
                type: 'link'
            },{
                name: 'General',
                state: 'triangular.dashboard-general',
                type: 'link'
            },{
                name: 'Sales',
                state: 'triangular.dashboard-sales',
                type: 'link'
            },{
                name: 'Classic',
                state: 'triangular.dashboard-classic',
                type: 'link'
            },{
                name: 'Server',
                state: 'triangular.dashboard-server',
                type: 'link'
            },{
                name: 'Social',
                state: 'triangular.dashboard-social',
                type: 'link'
            },{
                name: 'Widgets',
                state: 'triangular.dashboard-widgets',
                type: 'link'
            },{
                name: 'Draggable',
                state: 'triangular.dashboard-draggable',
                type: 'link'
            }]
        });

    }
})();
