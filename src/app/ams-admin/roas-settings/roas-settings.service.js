var app = angular.module('app');
app.service('AMSAdminRoasSettingService', ['$http', '$rootScope', 'ImapConstants', '$q', '$cookies', '$timeout', function($http, $rootScope, ImapConstants, $q, $cookies, $timeout) {

    this.getRoasSettingData = function(organizationId, businessGroupId, accountId) {

        var loggedInUser = $cookies.getObject('loggedInUser');
        var accessToken = loggedInUser.token;

        var deferred = $q.defer();

        $http({
            method: 'GET',
            url: ImapConstants.getUrls().intentwise_base_url + 'organization/' + organizationId + '/businessgroup/' + businessGroupId + '/amsaccount/' + accountId + '/campaignroas',
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

    this.getAccountRoasData = function(organizationId, businessGroupId, accountId) {

        var loggedInUser = $cookies.getObject('loggedInUser');
        var accessToken = loggedInUser.token;

        var deferred = $q.defer();

        $http({
            method: 'GET',
            url: ImapConstants.getUrls().intentwise_base_url + 'organization/' + organizationId + '/businessgroup/' + businessGroupId + '/amsaccount/' + accountId + '/roas',
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

    this.updateRoasSettingData = function(organizationId, businessGroupId, accountId, updateValue) {

        var loggedInUser = $cookies.getObject('loggedInUser');
        var accessToken = loggedInUser.token;

        var deferred = $q.defer();

        $http({
            method: 'POST',
            url: ImapConstants.getUrls().intentwise_base_url + 'organization/' + organizationId + '/businessgroup/' + businessGroupId + '/amsaccount/' + accountId + '/campaignroas',
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

    this.updateAccountRoasSettingData = function(organizationId, businessGroupId, accountId, updateValue) {

        var loggedInUser = $cookies.getObject('loggedInUser');
        var accessToken = loggedInUser.token;

        var deferred = $q.defer();

        $http({
            method: 'POST',
            url: ImapConstants.getUrls().intentwise_base_url + 'organization/' + organizationId + '/businessgroup/' + businessGroupId + '/amsaccount/' + accountId + '/roas',
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

app.directive('showFocus', function($timeout) {
    return function(scope, element, attrs) {
        scope.$watch(attrs.showFocus,
            function(newValue) {
                $timeout(function() {
                    newValue && element[0].focus();
                });
            }, true);
    };
});

app.filter('removeLeadingZero', function() {
    return function(item) {
        var n = item.toString().replace(/^(0+)/g, '');
        return parseInt(n);
        //return item
    };
});

app.directive('numbersOnly', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                if (text) {
                    var transformedInput = text.replace(/[^0-9]/g, '');

                    if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    return transformedInput;
                }
                return undefined;
            }
            ngModelCtrl
                .$parsers
                .push(fromUser);
        }
    };
});