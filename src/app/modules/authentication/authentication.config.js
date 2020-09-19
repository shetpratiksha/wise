(function() {
    'use strict';

    angular
        .module('app.modules.authentication')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($stateProvider, triMenuProvider) {

        $stateProvider
        .state('authentication', {
            abstract: true,
            views: {
                'root': {
                    templateUrl: 'app/modules/authentication/layouts/authentication.tmpl.html'
                }
            },
            data: {
                permissions: {
                    only: ['viewAuthentication']
                }
            }
        })
        .state('authentication.login', {
            url: '/login',
            templateUrl: 'app/modules/authentication/login/login.tmpl.html',
            controller: 'LoginController',
            controllerAs: 'vm'
        })
        .state('authentication.signup', {
            url: '/signup',
            templateUrl: 'app/modules/authentication/signup/signup.tmpl.html',
            controller: 'SignupController',
            controllerAs: 'vm'
        })
        .state('authentication.lock', {
            url: '/lock',
            templateUrl: 'app/modules/authentication/lock/lock.tmpl.html',
            controller: 'LockController',
            controllerAs: 'vm'
        })
        .state('authentication.forgot', {
            url: '/forgot',
            templateUrl: 'app/modules/authentication/forgot/forgot.tmpl.html',
            controller: 'ForgotController',
            controllerAs: 'vm'
        })
        .state('triangular.profile', {
            url: '/profile',
            templateUrl: 'app/modules/authentication/profile/profile.tmpl.html',
            controller: 'ProfileController',
            controllerAs: 'vm'
        })
        .state('authentication.setpassword', {
            url: '/setPassword/:token',
            templateUrl: 'app/modules/authentication/setpassword/setpassword.tmpl.html',
            controller: 'SetPasswordController',
            controllerAs: 'vm'
        })
        .state('authentication.termsAndConditions', {
            url: '/termsAndConditions',
            templateUrl: 'app/modules/authentication/terms/terms.tmpl.html',
            controller: 'TermsController',
            controllerAs: 'vm'
        })
        .state('authentication.amsaccess', {
            url: '/amsaccess',
            templateUrl: 'app/modules/authentication/ams_access/amsaccess.tmpl.html',
            controller: 'LogoutController',
            controllerAs: 'vm'
        });
    }
})();
