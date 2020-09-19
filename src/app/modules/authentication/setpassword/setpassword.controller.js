(function() {
    'use strict';

    angular
        .module('app.modules.authentication')
        .controller('SetPasswordController', SetPasswordController);

    /* @ngInject */
    function SetPasswordController($scope, $state, $mdToast, $filter, $http, triSettings, ImapConstants, $location, $timeout) {
        var vm = this;
        vm.triSettings = triSettings;
        vm.isLoading = false;
        var urlConstants = ImapConstants.getUrls()

        vm.user = {
            password: ''
        };

        vm.password = {
            error : false,
            message : '' 
        }
        vm.resetClick = resetClick;
        ////////////////

        function resetClick() {
            vm.isLoading = true;
            vm.password.error = false
            
            var currUrl = $location.path();
            if (currUrl.indexOf(':') > 0) {
                var regenerateToken = currUrl.substr(currUrl.indexOf(':') + 1, currUrl.length)
            }

            $http({
                method: 'POST',
                url: urlConstants.intentwise_base_url + 'user/setpassword',
                data: {
                    "token": regenerateToken,
                    "password": vm.user.password
                },
                headers: {
                    'Content-Type': 'application/json',
                }
            }).then(function successCallback(response) {
                vm.isLoading = false;
                
                $mdToast.show(
                    $mdToast.simple()
                    .content($filter('triTranslate')('You have successfully set your password. Please login'))
                    .position('top left')
                    .highlightAction(true)
                    .hideDelay(5000)
                )

                $timeout(function() {
                    $state.go('authentication.login');
                }, 5000);
            },
            function errorCallback(response) {
                vm.isLoading = false;
                vm.password.error = true
                vm.password.message = "Setting Password Failed. Please try forgot password."
            });
            
        }
    }
})();
