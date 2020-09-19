(function() {
    'use strict';

    angular
        .module('app.modules.dashboards')
        .component('counterWidget', {
            templateUrl: 'app/modules/dashboards/analytics/widgets/counter-widget/counter-widget.tmpl.html',
            controllerAs: 'vm',
            bindings: {
                title: '@',
                count: '<',
                icon: '@',
                background: '@',
                color: '@'
            }
        });
})();
