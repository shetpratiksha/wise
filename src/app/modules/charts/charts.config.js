(function() {
    'use strict';

    angular
        .module('app.modules.charts')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($stateProvider, triMenuProvider) {

        $stateProvider
        .state('triangular.charts-google-bar', {
            url: '/charts/google/bar',
            templateUrl: 'app/modules/charts/google-bar.tmpl.html',
            data: {
                permissions: {
                    only: ['viewCharts']
                },
                layout: {
                    contentClass: 'layout-column'
                }
            }
        })
        .state('triangular.charts-google-scatter', {
            url: '/charts/google/scatter',
            templateUrl: 'app/modules/charts/google-scatter.tmpl.html',
            data: {
                permissions: {
                    only: ['viewCharts']
                },
                layout: {
                    contentClass: 'layout-column'
                }
            }
        })
        .state('triangular.charts-google-line', {
            url: '/charts/google/line',
            templateUrl: 'app/modules/charts/google-line.tmpl.html',
            data: {
                permissions: {
                    only: ['viewCharts']
                },
                layout: {
                    contentClass: 'layout-column'
                }
            }
        })
        .state('triangular.charts-chartjs-bar', {
            url: '/charts/chartjs/bar',
            templateUrl: 'app/modules/charts/chartjs-bar.tmpl.html',
            data: {
                permissions: {
                    only: ['viewCharts']
                },
                layout: {
                    contentClass: 'layout-column'
                }
            }
        })
        .state('triangular.charts-chartjs-pie', {
            url: '/charts/chartjs/pie',
            templateUrl: 'app/modules/charts/chartjs-pie.tmpl.html',
            data: {
                permissions: {
                    only: ['viewCharts']
                },
                layout: {
                    contentClass: 'layout-column'
                }
            }
        })
        .state('triangular.charts-chartjs-ticker', {
            url: '/charts/chartjs/ticker',
            templateUrl: 'app/modules/charts/chartjs-ticker.tmpl.html',
            data: {
                permissions: {
                    only: ['viewCharts']
                },
                layout: {
                    contentClass: 'layout-column'
                }
            }
        })
        .state('triangular.charts-chartjs-line', {
            url: '/charts/chartjs/line',
            templateUrl: 'app/modules/charts/chartjs-line.tmpl.html',
            data: {
                permissions: {
                    only: ['viewCharts']
                },
                layout: {
                    contentClass: 'layout-column'
                }
            }
        })
        .state('triangular.charts-d3-scatter', {
            url: '/charts/d3/scatter',
            templateUrl: 'app/modules/charts/d3-scatter.tmpl.html',
            data: {
                permissions: {
                    only: ['viewCharts']
                },
                layout: {
                    contentClass: 'layout-column'
                }
            }
        })
        .state('triangular.charts-d3-bar', {
            url: '/charts/d3/bar',
            templateUrl: 'app/modules/charts/d3-bar.tmpl.html',
            data: {
                permissions: {
                    only: ['viewCharts']
                },
                layout: {
                    contentClass: 'layout-column'
                }
            }
        })
        .state('triangular.charts-d3-multiline', {
            url: '/charts/d3/multiline',
            templateUrl: 'app/modules/charts/d3-multiline.tmpl.html',
            data: {
                permissions: {
                    only: ['viewCharts']
                },
                layout: {
                    contentClass: 'layout-column'
                }
            }
        });
/*
        triMenuProvider.addMenu({
            name: 'Charts',
            icon: 'zmdi zmdi-chart',
            type: 'dropdown',
            priority: 5.1,
            permission: 'viewCharts',
            children: [{
                name: 'Google',
                type: 'dropdown',
                children: [{
                    name: 'Bar',
                    state: 'triangular.charts-google-bar',
                    type: 'link'
                },{
                    name: 'Scatter',
                    state: 'triangular.charts-google-scatter',
                    type: 'link'
                },{
                    name: 'Line',
                    state: 'triangular.charts-google-line',
                    type: 'link'
                }]
            },{
                name: 'Chart.js',
                type: 'dropdown',
                children: [{
                    name: 'Bar',
                    state: 'triangular.charts-chartjs-bar',
                    type: 'link'
                },{
                    name: 'Line',
                    state: 'triangular.charts-chartjs-line',
                    type: 'link'
                },{
                    name: 'Pie',
                    state: 'triangular.charts-chartjs-pie',
                    type: 'link'
                },{
                    name: 'Ticker',
                    state: 'triangular.charts-chartjs-ticker',
                    type: 'link'
                }]
            },{
                name: 'D3 Charts',
                type: 'dropdown',
                children: [{
                    name: 'Scatter',
                    state: 'triangular.charts-d3-scatter',
                    type: 'link'
                },{
                    name: 'OHCL Bar',
                    state: 'triangular.charts-d3-bar',
                    type: 'link'
                },{
                    name: 'Multiline',
                    state: 'triangular.charts-d3-multiline',
                    type: 'link'
                }]
            }]
        });
        */
    }
})();
