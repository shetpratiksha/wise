(function() {
    'use strict';

    angular
        .module('triangular.components')
        .controller('RightSidenavAmsController', RightSidenavAmsController);

    /* @ngInject */
    function RightSidenavAmsController($scope, $http, $mdSidenav, $state, ImapConstants) {
        var vm = this;
        // sets the current active tab
        vm.close = close;
        vm.currentTab = 0;
        vm.notificationGroups = [{
            name: 'Notifications',
            notifications: [{
                title: 'Agree to Terms & Conditions',
                icon: 'zmdi zmdi-alert-triangle',
                iconColor: 'rgb(255, 152, 0)',
            }]
        }];
        ////////////////

        // add an event to switch tabs (used when user clicks a menu item before sidebar opens)
        $scope.$on('triSwitchNotificationTab', function($event, tab) {
            vm.currentTab = tab;
        });

         vm.openTerms = function(){
            $state.go("authentication.termsAndConditions");
        }

        /* fetch some dummy emails from the API
        $http({
            method: 'GET',
            url: ImapConstants.getUrls().intentwise_base_url + 'email/inbox'
        }).then(function(response) {
            vm.emails = response.data.slice(1,20);
        });
        */

        function close() {
            $mdSidenav('notifications').close();
        }
    }
})();
