(function() {
    'use strict';

    angular
        .module('app.modules.authentication')
        .controller('TermsController', TermsController);

    /* @ngInject */
    function TermsController($http, $scope, $mdToast, ImapConstants, $cookies,TermsService,triSettings,$state,$rootScope) {
        var vm = this;
        vm.termsLoading = false;
        vm.triSettings = triSettings;
        $rootScope.termsdisable = false;
        vm.showReviewLater = false;

        var loggedInUser = $cookies.getObject('loggedInUser');
        if(loggedInUser.user.legalTermsAccepted == undefined){
            vm.showReviewLater = true;
        }

        vm.reviewLater = function(){
            $state.go('triangular.app-dynamic-menu');
        }

        vm.acceptTerms = function(){
            $rootScope.termsdisable = true;
            vm.termsLoading = true;

            var acceptTerms = TermsService.acceptTermsAndConditions();

            acceptTerms.then(function(data) {
                TermsService.updateAcceptance();
                vm.termsLoading = false;
                $state.go('triangular.app-dynamic-menu');
            })
            .catch(function(error) {
                vm.termsLoading = false;
                $rootScope.termsdisable = false;
                var message = "Failed to accept terms and conditions, Please try again"
                $mdToast.show(
                    $mdToast.simple()
                    .content(message)
                    .position('top right')
                    .highlightAction(true)
                    .hideDelay(8000)
                )
            })
        }
       
    }
})();
