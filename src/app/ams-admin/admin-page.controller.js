(function() {
    'use strict';

    angular
        .module('app.ams-admin')
        .controller('AMSAdminController', AMSAdminController);

    /* @ngInject */
    function AMSAdminController() {
        var vm = this;
        vm.testData = ['triangular', 'is', 'great'];
    }
})();
