(function() {
    'use strict';

    angular
        .module('triangular.components')
        .controller('ToolbarController', DefaultToolbarController);

    /* @ngInject */
    function DefaultToolbarController($scope, $injector, $rootScope, $mdMedia, $state, $element, $filter, $mdUtil,
        $mdSidenav, $mdToast, $timeout, $document, $cookies, triBreadcrumbsService, triSettings, triLayout, AMSDataService,SettingService) {

        var vm = this;
        vm.breadcrumbs = triBreadcrumbsService.breadcrumbs;
        vm.emailNew = false;
        vm.languages = triSettings.languages;
        vm.openSideNav = openSideNav;
        vm.hideMenuButton = hideMenuButton;
        vm.switchLanguage = switchLanguage;
        vm.toggleNotificationsTab = toggleNotificationsTab;
        vm.isFullScreen = false;
        $rootScope.showAccountMenu = false;
        $rootScope.showFullScreenOption = true;
        vm.fullScreenIcon = 'zmdi zmdi-fullscreen';
        vm.toggleFullScreen = toggleFullScreen;
        vm.showNotificationCount = 0;

        var loggedInUser = $cookies.getObject('loggedInUser');
        if(loggedInUser.user.legalTermsAccepted == undefined){
            vm.showNotificationCount++;
        }

        if($injector.has('UserService')) {
            var UserService = $injector.get('UserService');
            vm.currentUser = UserService.getCurrentUser();
        }
        else {
            // permissions are turned off so no UserService available
            // just set default user
            vm.currentUser = {
                displayName: 'Christos',
                username: 'christos',
                avatar: 'assets/images/avatars/avatar-5.png',
                roles: []
            };
        }

        vm.loggedInUser = $cookies.getObject('loggedInUser');

        if(vm.loggedInUser == undefined) {
            $state.go("authentication.login")
        }

        var email = vm.loggedInUser.user.email;
        vm.loggedInUser.user.email_display   = email.substring(0, email.lastIndexOf("@"));

        //Load all the organization and account details for the drop down

        $rootScope.userAction = $cookies.getObject('userActions');

        if($rootScope.userAction.isAdmin) {

            if($rootScope.organizations == undefined) {

                var getOrganizations =  AMSDataService.getOrganizations();

                getOrganizations.then(function(data) {
                    $rootScope.organizations = data;

                    $rootScope.current_organization = $rootScope.organizations[1];
                    $cookies.putObject('current_organization', $rootScope.current_organization);
                    loadOrganizationSetting($rootScope.current_organization.organizationId);
                    loadBGAndAccounts($rootScope.current_organization.organizationId);
                    if(angular.isUndefined($scope.currentOrgId)){
                        var defaultOrg = $cookies.getObject('current_organization');
                        $scope.currentOrgId = defaultOrg.organizationId;
                    }

                })
            }
        } else {

            if($rootScope.current_organization == undefined) {

                var getOrganization =  AMSDataService.getOrganization(vm.loggedInUser.user.organizationId);

                getOrganization.then(function(data) {
                    $rootScope.current_organization = data;
                    $cookies.putObject('current_organization', $rootScope.current_organization);
                    loadBGAndAccounts(vm.loggedInUser.user.organizationId);
                })
            } else {
                $cookies.putObject('current_organization', $rootScope.current_organization);
                loadBGAndAccounts($rootScope.current_organization.organizationId);

            }
        }
            //Evaluated in Index.html
           if(isIe11){
                $rootScope.showFullScreenOption = false;
            }



        function loadOrganizationSetting(organizationId) {

            SettingService.loadOrganizationSetting(organizationId);
        }

        $scope.propertyName = 'displayName';
        $scope.reverse = false;

        function loadBGAndAccounts(organizationId) {

            var getBusinessGroup = AMSDataService.getBusinessGroup(organizationId);

            getBusinessGroup.then(function(data) {

                $rootScope.current_bg = data;
                var getAccounts = AMSDataService.getAMSaccounts(organizationId, data.businessGroupId)

                getAccounts.then(function(data) {
                    if($rootScope.userAction.isAdmin ==true || data.length > 1){
                        $rootScope.showAccountMenu = true;
                    }
                    $rootScope.accounts = data;
                    $rootScope.accounts = $filter('orderBy')($scope.accounts, 'displayName');
                    $rootScope.current_account = $rootScope.accounts[0];
                    $rootScope.$broadcast('org_acc_loaded');
                    $scope.currentAcId = $rootScope.current_account.amsAccountId;
                   
                })
            })
        }

        $scope.changeAccount = function(accountId) {

            var accounts = $rootScope.accounts.filter(function(el){ return el.amsAccountId == accountId; });

            $rootScope.current_account = accounts[0];
            $rootScope.$broadcast('org_acc_loaded');
        }

        $scope.changeOrganization = function(organizationId) {

            var orgs = $rootScope.organizations.filter(function(el){ return el.organizationId == organizationId });

            $rootScope.current_organization = orgs[0];
            $cookies.putObject('current_organization', $rootScope.current_organization);

            loadOrganizationSetting(organizationId);
            loadBGAndAccounts(organizationId);
        }

        function openSideNav(navID) {
            $mdUtil.debounce(function(){
                $mdSidenav(navID).toggle();
            }, 300)();
        }

        function switchLanguage(languageCode) {
            if($injector.has('$translate')) {
                var $translate = $injector.get('$translate');
                $translate.use(languageCode)
                .then(function() {
                    $mdToast.show(
                        $mdToast.simple()
                        .content($filter('triTranslate')('Language Changed'))
                        .position('bottom right')
                        .hideDelay(500)
                    );
                    $rootScope.$emit('changeTitle');
                });
            }
        }

        function hideMenuButton() {
            switch(triLayout.layout.sideMenuSize) {
                case 'hidden':
                    // always show button if menu is hidden
                    return false;
                case 'off':
                    // never show button if menu is turned off
                    return true;
                default:
                    // show the menu button when screen is mobile and menu is hidden
                    return $mdMedia('gt-sm');
            }
        }

        function toggleNotificationsTab(tab) {
            $rootScope.$broadcast('triSwitchNotificationTab', tab);
            vm.openSideNav('notifications');
        }

       $scope.navigateToProfile = function(){
            $state.go("triangular.profile")
        }

       $scope.navigateToHelp = function(){
            $state.go("triangular.ams-help")
       }

        function toggleFullScreen() {
            vm.isFullScreen = !vm.isFullScreen;
            vm.fullScreenIcon = vm.isFullScreen ? 'zmdi zmdi-fullscreen-exit':'zmdi zmdi-fullscreen';
            // more info here: https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API
            var doc = $document[0];
            if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement ) {
                if (doc.documentElement.requestFullscreen) {
                    doc.documentElement.requestFullscreen();
                } else if (doc.documentElement.msRequestFullscreen) {
                    doc.documentElement.msRequestFullscreen();
                } else if (doc.documentElement.mozRequestFullScreen) {
                    doc.documentElement.mozRequestFullScreen();
                } else if (doc.documentElement.webkitRequestFullscreen) {
                    doc.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
                }
            } else {
                if (doc.exitFullscreen) {
                    doc.exitFullscreen();
                } else if (doc.msExitFullscreen) {
                    doc.msExitFullscreen();
                } else if (doc.mozCancelFullScreen) {
                    doc.mozCancelFullScreen();
                } else if (doc.webkitExitFullscreen) {
                    doc.webkitExitFullscreen();
                }
            }
        }

        $scope.$on('newMailNotification', function(){
            vm.emailNew = true;
        });
    }
})();
