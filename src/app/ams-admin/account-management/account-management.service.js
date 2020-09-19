var app = angular.module('app');



app.filter('titleCase', function() {
    return function(input) {
      input = input || '';
      return input.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    };
  })

app.service('AMSAdminAccountManagementService', ['$http', '$rootScope', 'ImapConstants', '$q', '$cookies', function($http, $rootScope, ImapConstants, $q, $cookies) {

    this.createOrganization = function(updateValue) {

        var loggedInUser = $cookies.getObject('loggedInUser');
        var accessToken = loggedInUser.token;

        var deferred = $q.defer();

        $http({
            method: 'POST',
            url: ImapConstants.getUrls().intentwise_base_url + 'organization',
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

    this.getUserListData = function(organizationId) {

        var loggedInUser = $cookies.getObject('loggedInUser');
        var accessToken = loggedInUser.token;

        var deferred = $q.defer();

        $http({
            method: 'GET',
            url: ImapConstants.getUrls().intentwise_base_url + 'organization/' + organizationId + '/user',
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

    this.getAccountListData = function(organizationId, businessGroupId) {

        var loggedInUser = $cookies.getObject('loggedInUser');
        var accessToken = loggedInUser.token;

        var deferred = $q.defer();

        $http({
            method: 'GET',
            url: ImapConstants.getUrls().intentwise_base_url + 'organization/'+ organizationId +'/businessgroup/'+ businessGroupId + '/amsaccount',
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


    this.getUserAssociationData = function(organizationId) {

        var loggedInUser = $cookies.getObject('loggedInUser');
        var accessToken = loggedInUser.token;

        var deferred = $q.defer();

        $http({
            method: 'GET',
            url: ImapConstants.getUrls().intentwise_base_url + 'organization/'+ organizationId +'/userassociation',
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


    this.addNewUserApi = function(organizationId, newData) {

        var loggedInUser = $cookies.getObject('loggedInUser');
        var accessToken = loggedInUser.token;

        var deferred = $q.defer();

        $http({
            method: 'POST',
            url: ImapConstants.getUrls().intentwise_base_url + 'organization/' + organizationId + '/user',
            data: newData,
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

    this.editUserApi = function(organizationId, editedUserData) {

        var loggedInUser = $cookies.getObject('loggedInUser');
        var accessToken = loggedInUser.token;

        var deferred = $q.defer();

        $http({
            method: 'PUT',
            url: ImapConstants.getUrls().intentwise_base_url + 'organization/' + organizationId + '/user/' + editedUserData.userId ,
            data: editedUserData,
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

    this.addUserAssociationApi = function(organizationId, newData) {

        var loggedInUser = $cookies.getObject('loggedInUser');
        var accessToken = loggedInUser.token;

        var deferred = $q.defer();

        $http({
            method: 'POST',
            url: ImapConstants.getUrls().intentwise_base_url + 'organization/' + organizationId + '/userassociation',
            data: newData,
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

    this.deleteUserAssociationApi = function(organizationId, editedData) {

        var loggedInUser = $cookies.getObject('loggedInUser');
        var accessToken = loggedInUser.token;

        var deferred = $q.defer();

        $http({
            method: 'DELETE',
            url: ImapConstants.getUrls().intentwise_base_url + 'organization/' + organizationId + '/userassociation',
            data: editedData,
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

    this.deleteUserApi = function(organizationId, userId) {

        var loggedInUser = $cookies.getObject('loggedInUser');
        var accessToken = loggedInUser.token;

        var deferred = $q.defer();

        $http({
            method: 'DELETE',
            url: ImapConstants.getUrls().intentwise_base_url + 'organization/' + organizationId + '/user/' + userId,
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

    this.resendMailApi = function(resendData) {

        var loggedInUser = $cookies.getObject('loggedInUser');
        var accessToken = loggedInUser.token;

        var deferred = $q.defer();

        $http({
            method: 'POST',
            url: ImapConstants.getUrls().intentwise_base_url + '/user/token',
            data: resendData,
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