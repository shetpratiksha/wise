
var app = angular.module('app');

app.service('SettingService', ['$http', '$rootScope', 'ImapConstants', '$q', '$cookies','AMSDataService', function($http, $rootScope, ImapConstants, $q, $cookies,AMSDataService) {


    /*
        This method returns organization details along with the associated business group and accounts.
    */
    this.loadOrganizationSetting = function(organizationId) {

        fetchOrganizationSetting(organizationId);

    }

    this.isOrganizationSettingEnabled = function(orgSetting,organizationId){
        var isSettingEnabled = false;

        var organizationSetting = $cookies.getObject(organizationId + '_organizationSetting')

        if(organizationSetting != undefined){
            var setting = organizationSetting.filter(function(el){ return el.setting == orgSetting; });
            if(setting != undefined && setting[0] != undefined){
              isSettingEnabled = true;
            }
        }
        return isSettingEnabled;
    }

    function fetchOrganizationSetting(organizationId) {

        var getOrganizationSetting =  AMSDataService.getOrganizationSetting(organizationId);

            getOrganizationSetting.then(function(data) {
                $cookies.putObject(organizationId + '_organizationSetting', data);
            })
    }

    this.gettingOrgSettingProps = function (organizationId){
        var isOrgRegistrationEnabled = this.isOrganizationSettingEnabled('ORG_REGISTRATION', organizationId);
        var isAccountManagementEnabled = this.isOrganizationSettingEnabled('ACCOUNT_MANAGEMENT', organizationId);
        var isUserManagementEnabled = this.isOrganizationSettingEnabled('USER_MANAGEMENT', organizationId);

        var returnData = {
            ORG_REGISTRATION: isOrgRegistrationEnabled,
            ACCOUNT_MANAGEMENT: isAccountManagementEnabled,
            USER_MANAGEMENT: isUserManagementEnabled
        }
        return returnData;
    }

}]);


        