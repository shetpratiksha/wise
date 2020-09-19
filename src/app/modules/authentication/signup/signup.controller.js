(function() {
    'use strict';

    angular
        .module('app.modules.authentication')
        .controller('SignupController', SignupController);

    /* @ngInject */
    function SignupController($scope, $state, $mdToast, $http, $filter, triSettings, ImapConstants, $cookies,$timeout) {
        var vm = this;
        vm.triSettings = triSettings;
        var urlConstants = ImapConstants.getUrls()

        vm.signupClick = signupClick;
        vm.user = {
            name: '',
            email: '',
            password: '',
            confirm: ''
        };

        ////////////////

        function signupClick() {

            $http({
                method: 'POST',
                url: urlConstants.intentwise_base_url + 'organization',
                data: {
                    'name': vm.user.name,
                    'contact': {
                        'email': vm.user.email
                    }
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function successCallback(response) {
                var orgCookie = $cookies.getObject('organization')
                if (orgCookie != undefined) {
                    $cookies.remove('organization')
                }
                
                $mdToast.show(
                    $mdToast.simple()
                    .content($filter('triTranslate')('Please verify your email. An verification email is sent to your account'))
                    .position('top right')
                    .highlightAction(true)
                    .hideDelay(5000)
                )

            }, function errorCallback(response) {

                vm.error = true;
                vm.message = 'Registration failed. Please contact help@intentwise.com'

                $timeout(function() {
                    vm.error = false;
                }, 5000);
            });


        }
    }
})();
