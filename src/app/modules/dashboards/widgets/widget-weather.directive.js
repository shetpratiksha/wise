(function() {
    'use strict';

    angular
        .module('app.modules.dashboards')
        .directive('weatherWidget', weatherWidget);

    /* @ngInject */
    function weatherWidget($http) {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            require: 'triWidget',
            link: link,
            restrict: 'A'
        };
        return directive;

        function link($scope, $element, attrs, widgetCtrl) {
            widgetCtrl.setLoading(true);

            var query = 'select item.condition from weather.forecast where woeid in (select woeid from geo.places(1) where text="' + attrs.weatherWidget + '")';
            var url = 'https://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent(query) + '&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';

            $http.get(url).
            then(function(response) {
                if(response.data.query.count > 0) {
                    widgetCtrl.setLoading(false);
                    $scope.weather = {
                        iconClass: 'wi-yahoo-' + response.data.query.results.channel.item.condition.code,
                        date: new Date(response.data.query.created),
                        temp: response.data.query.results.channel.item.condition.temp,
                        text: response.data.query.results.channel.item.condition.text,
                        location: attrs.weatherWidget
                    };
                }
            });
        }
    }
})();
