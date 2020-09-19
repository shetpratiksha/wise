
var app = angular.module('app');

app.service('TermsService', ['$http', '$rootScope', 'ImapConstants', '$q', '$cookies', function($http, $rootScope, ImapConstants, $q, $cookies) {


    /*
        This method verifies if terms is accepted
    */
    this.showTermsAndConditions = function(userCookie) {
        return userCookie.user.legalTermsAccepted == undefined || !userCookie.user.legalTermsAccepted;
    }

    this.updateAcceptance = function(){
        var loggedInUser = $cookies.getObject('loggedInUser');
        loggedInUser.user.legalTermsAccepted = true;
        $cookies.putObject('loggedInUser',loggedInUser);
    }

    this.acceptTermsAndConditions = function(){
       return updateTermsAndConditions();
    }

    function updateTermsAndConditions(){
        var loggedInUser = $cookies.getObject('loggedInUser');
        var userId = loggedInUser.user.userId;
        var organizationId = loggedInUser.user.organizationId;
        var accessToken = loggedInUser.token;

        var deferred = $q.defer();
        $http({
                method: 'PUT',
                url: ImapConstants.getUrls().intentwise_base_url + 'organization/' + organizationId + '/user/' + userId + '/legalterms?legalVersion=V1',
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

}]);


        