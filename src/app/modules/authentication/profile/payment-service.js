
var app = angular.module('app');

app.service('PaymentService', ['$http', 'ImapConstants', '$q', '$cookies', function($http, ImapConstants, $q, $cookies) {

	this.getPaymentInfo = function(organizationId) {

		var loggedInUser = $cookies.getObject('loggedInUser');
		var accessToken = loggedInUser.token;

		var deferred = $q.defer();

		$http({
                method: 'GET',
                url: ImapConstants.getUrls().intentwise_base_url + 'organization/' + organizationId + "/paymentInfo",
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

    this.savePaymentInfo = function(token) {

        var loggedInUser = $cookies.getObject('loggedInUser');
        var accessToken = loggedInUser.token;

        var data = {
            type : "STRIPE",
            token: token
        }
        var deferred = $q.defer();

        $http({
                method: 'POST',
                url: ImapConstants.getUrls().intentwise_base_url + 'organization/' + loggedInUser.user.organizationId + "/paymentInfo", 
                data: data,
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


        