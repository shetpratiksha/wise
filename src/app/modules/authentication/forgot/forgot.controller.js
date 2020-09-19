(function() {
    'use strict';

    angular
        .module('app.modules.authentication')
        .controller('ForgotController', ForgotController);

    /* @ngInject */
    function ForgotController($scope, $state, $mdToast, $filter, $http, triSettings, ImapConstants,$timeout) {
        var vm = this;
        vm.triSettings = triSettings;
        vm.isLoading = false;
        var urlConstants = ImapConstants.getUrls()

        vm.user = {
            email: ''
        };

        vm.forgotpassword = {
            error : false,
            message : '' 
        }
        vm.resetClick = resetClick;
        ////////////////

        function resetClick() {
            vm.isLoading = true;
            vm.forgotpassword.error = false
            $http({
                method: 'POST',
                url: urlConstants.intentwise_base_url + 'user/token?version=v2',
                data: {
                    "email": vm.user.email
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function successCallback(response) {
                    vm.isLoading = false;
                    $mdToast.show(
                        $mdToast.simple()
                        .content($filter('triTranslate')('We have sent a reset password link to your email id : ' + vm.user.email))
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

                if(response.status = 404) {
                    vm.forgotpassword.message = 'Invalid Email address. Please try again with a valid email id.'
                    vm.forgotpassword.error = true
                } else {
                    vm.forgotpassword.message = 'There was an error during password reset, please try again!'
                    vm.forgotpassword.error = true
                }
            });
            
        }
    }
})();
