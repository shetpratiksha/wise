var app = angular.module('app');
app.service('AMSAdminBudgetSettingService', ['$http', '$rootScope', 'ImapConstants', '$q', '$cookies', '$timeout', function($http, $rootScope, ImapConstants, $q, $cookies, $timeout) {
    this.getBudgetSettingData = function(organizationId, businessGroupId, accountId, year) {

        var loggedInUser = $cookies.getObject('loggedInUser');
        var accessToken = loggedInUser.token;

        var deferred = $q.defer();

        $http({
            method: 'GET',
            url: ImapConstants.getUrls().intentwise_base_url + 'organization/' + organizationId + '/businessgroup/' + businessGroupId + '/amsaccount/' + accountId + '/accountBudget?year=' + year,
            data: '',
            headers: {
                'X-Auth-Token': accessToken,
                'Content-Type': 'application/json'
            }
        }).then(function(data) {
            deferred.resolve(data);
        }, function(error) {
            //deferred.reject(error);
            deferred.reject(error);
        });
        return deferred.promise;
    }

    this.updateBudgetSettingData = function(organizationId, businessGroupId, accountId, updateValue) {

        var loggedInUser = $cookies.getObject('loggedInUser');
        var accessToken = loggedInUser.token;

        var deferred = $q.defer();

        $http({
            method: 'POST',
            url: ImapConstants.getUrls().intentwise_base_url + 'organization/' + organizationId + '/businessgroup/' + businessGroupId + '/amsaccount/' + accountId + '/accountBudget',
            data: updateValue,
            headers: {
                'X-Auth-Token': accessToken,
                'Content-Type': 'application/json'
            }
        }).then(function(data) {
            deferred.resolve(data);
        }, function(error) {
            //deferred.reject(error);
            deferred.reject(error);
        });
        return deferred.promise;

    }
}]);