
var app = angular.module('app');

app.service('AMSDataService', ['$http', '$rootScope', 'ImapConstants', '$q', '$cookies', function($http, $rootScope, ImapConstants, $q, $cookies) {

	/*
		This method returns organization details along with the associated business group and accounts.
	*/
	this.getOrganization = function(organizationId) {

		var loggedInUser = $cookies.getObject('loggedInUser');
		var accessToken = loggedInUser.token;

		var deferred = $q.defer();

		$http({
                method: 'GET',
                url: ImapConstants.getUrls().intentwise_base_url + 'organization/' + organizationId,
                data: '',
                headers: {
                    'X-Auth-Token': accessToken,
                    'Content-Type': 'application/json'
                }
            }).then(function(data) {
	        	deferred.resolve(data.data);
	        }, function(error) {
	        	deferred.reject(error);
	        });
        return deferred.promise;
	}

    /*
        This method returns organization details along with the associated business group and accounts.
    */
    this.getOrganizationSetting = function(organizationId) {

        var loggedInUser = $cookies.getObject('loggedInUser');
        var accessToken = loggedInUser.token;

        var deferred = $q.defer();

        $http({
                method: 'GET',
                url: ImapConstants.getUrls().intentwise_base_url + 'organization/' + organizationId + '/setting',
                data: '',
                headers: {
                    'X-Auth-Token': accessToken,
                    'Content-Type': 'application/json'
                }
            }).then(function(data) {
                deferred.resolve(data.data);
            }, function(error) {
                deferred.reject(error);
            });
        return deferred.promise;
    }

	/*
		This method returns organization details along with the associated business group and accounts.
	*/
	this.getBusinessGroup = function(organizationId, accessToken) {

		var deferred = $q.defer();

		var loggedInUser = $cookies.getObject('loggedInUser');
		var accessToken = loggedInUser.token;


		$http({
                method: 'GET',
                url: ImapConstants.getUrls().intentwise_base_url + 'organization/' + organizationId + '/businessgroup',
                data: '',
                headers: {
                    'X-Auth-Token': accessToken,
                    'Content-Type': 'application/json'
                }
            }).then(function(data) {
	        	deferred.resolve(data.data);
	        }, function(error) {
	        	deferred.reject(error);
	        });

        return deferred.promise;
	}

	/*
		This method returns list of organizations user is allowed to see. By default, user is associated 
		to one Organization where as SUPER_ADMINS are allowed to
		view all the organizations within the system
    */
    this.getOrganizations = function() {
        var deferred = $q.defer();

        var loggedInUser = $cookies.getObject('loggedInUser');
		var accessToken = loggedInUser.token;

        $http({
            method: 'GET',
            url: ImapConstants.getUrls().intentwise_base_url + 'organization?status=ACTIVE',
            data: '',
            headers: {
                'X-Auth-Token': accessToken,
                'Content-Type': 'application/json'
            }
        }).then(function(data) {
        	deferred.resolve(data.data);
        }, function(error) {
        	deferred.reject(error);
        });

        return deferred.promise;
    }

    this.getAMSaccounts = function(organizationId, businessgroupId) {
        
    	var deferred = $q.defer();

    	var loggedInUser = $cookies.getObject('loggedInUser');
		var accessToken = loggedInUser.token;

        $http({
            method: 'GET',
            url: ImapConstants.getUrls().intentwise_base_url + 'organization/' + organizationId + '/businessgroup/' + businessgroupId + '/amsaccount/',
            data: '',
            headers: {
                'X-Auth-Token': accessToken,
                'Content-Type': 'application/json'
            }
        }).then(function(data) {
        	deferred.resolve(data.data);
        }, function(error) {
        	deferred.reject(error);
        });

        return deferred.promise;
    }

    this.getCampaigns = function(organizationId, businessgroupId, accountId) {

        var deferred = $q.defer();

        var loggedInUser = $cookies.getObject('loggedInUser');
        var accessToken = loggedInUser.token;

        $http({
            method: 'GET',
            url: ImapConstants.getUrls().intentwise_base_url + 'organization/' + organizationId + '/businessgroup/' + businessgroupId + '/account/' + accountId + "/campaigns",
            headers: {
                'X-Auth-Token': accessToken,
                'Content-Type': 'application/json'
            }
        }).then(function(data) {
            deferred.resolve(data.data);
        }, function(error) {
            deferred.reject(error);
        });

        return deferred.promise;
    }

}]);


        