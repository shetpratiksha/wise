(function() {
    'use strict';

    angular
        .module('app.modules.authentication')
        .controller('LoginController', LoginController);

    /* @ngInject */
    function LoginController($state, triSettings, $http, ImapConstants, $cookies, $rootScope, $analytics,AMSDataService) {
        var vm = this;
        vm.loginClick = loginClick;

        var urlConstants = ImapConstants.getUrls();
        var roles = ImapConstants.getRoles();

        vm.user = {
            email: '',
            password: ''
        };

        vm.triSettings = triSettings;

        vm.login = {
            error : false,
            message: ''
        };

        vm.socialLogins = [{
            icon: 'fa fa-lock',
            color: '#5893f5',
            url: 'https://intentwise.com/content/policy',
            tooltip: 'Privacy and Policy'
        },{
             icon: 'fa fa-building',
             color: '#5893f5',
             url: 'https://intentwise.com/content/amazon',
             tooltip: 'Intentwise'
         },{
             icon: 'fa fa-info-circle',
             color: '#5893f5',
             url: 'https://intentwise.com/content/contact',
             tooltip: 'Contact us'
         }];
         vm.triSettings = triSettings;


        vm.isLoading = false;


        function loginClick() {

            vm.isLoading = true;

            $http({
                method: 'POST',
                url: urlConstants.intentwise_base_url + 'user/login',
                data: {
                    "email": vm.user.email,
                    "password": vm.user.password
                }
            }).then(function successCallback(response) {

                var userCookie = response.data
                userCookie.isAuthenticated = true;

                $analytics.setUsername(response.data.user.userId);

                $rootScope.loggedInUser = userCookie;

                $cookies.putObject('loggedInUser', userCookie)

                $state.go('precheck');

            }, function errorCallback(response) {
                vm.isLoading = false;
                vm.login.error = true
                if (response.data != null && response.data.status == '401' && response.data.exception != undefined && response.data.exception.indexOf("LockedException")!== -1) {
                    vm.login.message = "Account is locked, Please use forgot password to reset your account"
                }else{
                    vm.login.message = "Invalid Username or Password"
                 }
            });

        }
    }
})();
