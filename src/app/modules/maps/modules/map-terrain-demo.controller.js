(function() {
    'use strict';

    angular
        .module('app.modules.maps')
        .controller('MapTerrainDemoController', MapTerrainDemoController);

    /* @ngInject */
    function MapTerrainDemoController(uiGmapGoogleMapApi) {
        var vm = this;
        uiGmapGoogleMapApi.then(function(maps) {
            vm.terrainMap = {
                center: {
                    latitude: 51.219053,
                    longitude: 4.404418
                },
                zoom: 10,
                options:{
                    scrollwheel:false,
                    mapTypeId:maps.MapTypeId.TERRAIN
                }
            };

            vm.mapMarkers = [{
                id:0,
                coords: {
                    latitude: 51.239053,
                    longitude: 4.434418
                },
                options: {
                    icon: {
                        anchor: new maps.Point(36,36),
                        origin: new maps.Point(0,0),
                        url: 'assets/images/maps/blue_marker.png'
                    }
                },
                labelTitle: 'Hello from Antwerp!'
            },{
                id:1,
                coords: {
                    latitude: 51.379053,
                    longitude: 4.654418
                },
                options: {
                    icon: {
                        anchor: new maps.Point(36,36),
                        origin: new maps.Point(0,0),
                        url: 'assets/images/maps/blue_marker.png'
                    }
                },
                labelTitle: 'Hello from Brecht!'
            }];
        });
    }
})();
