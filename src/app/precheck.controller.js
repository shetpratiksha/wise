(function() {
    'use strict';

    angular
        .module('app.modules.authentication')
        .controller('PreCheckController', PreCheckController);

    /* @ngInject */
    function PreCheckController($state, triSettings, $http, ImapConstants, $cookies, $rootScope, $analytics,TermsService) {
        var vm = this;

        var urlConstants = ImapConstants.getUrls();
        var roles = ImapConstants.getRoles();

         vm.loggedInUser = $cookies.getObject('loggedInUser');

            if(vm.loggedInUser != undefined) {
                processResponse(vm.loggedInUser)
            }else{
                $state.go('authentication.login');
            }


            function processResponse(data){
                var userCookie = data
                userCookie.isAuthenticated = true;

                $analytics.setUsername(data.user.userId);

                $rootScope.loggedInUser = userCookie;

                $cookies.putObject('loggedInUser', userCookie)

                $http({
                    method: 'GET',
                    url: urlConstants.intentwise_base_url + 'organization/' + data.user.organizationId,
                    data: '',
                    headers: {
                        'X-Auth-Token': data.token,
                        'Content-Type': 'application/json'
                    }
                }).then(function mySuccess(response) {
                    if (response.data.status == 'PENDING') {
                        $rootScope.userAction = {
                            'showDropdown': false,
                            'logout': false,
                            'chEmail': false,
                            'chPassword': false,
                            'dashboardsMenu': false,
                            'isAdmin': false,
                            'logo': true,
                            'showAccounts': false,
                            'showAggrigation': false,
                            'isLoggedIn': true,
                            'support' : false
                        }
                        $state.go('authentication.amsaccess');
                    } else {
                        $rootScope.userAction = {
                            'showDropdown': true,
                            'logout': true,
                            'chEmail': true,
                            'chPassword': true,
                            'dashboardsMenu': true,
                            'isAdmin': false,
                            'logo': true,
                            'showAccounts': true,
                            'showAggrigation': false,
                            'isLoggedIn': true,
                            'support' : true
                        }

                        $rootScope.current_organization = response.data;

                        $cookies.putObject('current_organization',$rootScope.current_organization);

                        userCookie.user.organization = response.data.name;

                        if (userCookie.user.role == roles.superAdmin) {
                            $rootScope.userAction.isAdmin = true;
                        }
                        $cookies.putObject('loggedInUser', userCookie)

                        $cookies.putObject('userActions', $rootScope.userAction)
                        vm.isLoading = false;

                        if(verifyTermsAndConditions(userCookie)){
                            $state.go('authentication.termsAndConditions');
                        }else{
                            $state.go('triangular.app-dynamic-menu');
                        }

                    }

                });
   
        }

        function verifyTermsAndConditions(userCookie){
           return TermsService.showTermsAndConditions(userCookie);
            
        }

    }
})();
