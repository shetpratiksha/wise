
var app = angular.module('app');

app.service('AMSRecommendationDataService', ['$http', '$rootScope', 'ImapConstants', '$q', '$cookies', '$timeout', function($http, $rootScope, ImapConstants, $q, $cookies, $timeout) {
    
    /*
    This method returns all the keyword bid suggestions for the given account id
    */

    this.getKeywordBids = function(organizationId, accountId, pageNo, pageSize, orderBy, filter, dateRange) {

        var loggedInUser = $cookies.getObject('loggedInUser');
        var accessToken = loggedInUser.token;
        var npageNo = pageNo - 1
        var norderBy;
        //angular.copy(orderBy, norderBy);

        var order = "asc";
        if(orderBy.indexOf('-') != -1) {
            norderBy = orderBy.substring(1, orderBy.length)
            order = 'desc'
        } else {
            norderBy = orderBy;
        }

        var deferred = $q.defer();

        $http({
                method: 'POST',
                url: ImapConstants.getUrls().intentwise_base_url + 'organization/' + organizationId + 
                                '/account/' + accountId + '/recommendation/keywordbids?campaignType=Sponsored Products&page=' + npageNo + 
                                '&size=' + pageSize+ '&sort=' + norderBy + ',' + order + '&startDate=' + moment(dateRange.startDate).format('YYYY-MM-DD') + '&endDate=' + moment(dateRange.endDate).format('YYYY-MM-DD') ,
                data: this.getFilterData(filter),
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

    this.getFilterData = function(filter) {
        
        if(filter != undefined && filter.length > 0) {
            return filter;
        } else {
            '';
        }
    }

    /*
    This method returns all the keyword bid suggestions for the given account id
    */
    this.getHeadlineKeywordBids = function(organizationId, accountId) {

        var loggedInUser = $cookies.getObject('loggedInUser');
        var accessToken = loggedInUser.token;

        var deferred = $q.defer();

        $http({
                method: 'GET',
                url: ImapConstants.getUrls().intentwise_base_url + 'organization/' + organizationId + '/account/' + accountId + '/recommendation/keywordbids?campaignType=Headline Search',
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

    this.getRecommendedKeywords = function(organizationId, accountId) {

        var loggedInUser = $cookies.getObject('loggedInUser');
        var accessToken = loggedInUser.token;

        var deferred = $q.defer();

        $http({
                method: 'GET',
                url: ImapConstants.getUrls().intentwise_base_url + 'organization/' + organizationId + '/account/' + accountId + '/recommendation/keyword',
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

    this.updateRecommededKeywordBids = function(organizationId, businessGroupId, accountId, keywordbids) {

        var loggedInUser = $cookies.getObject('loggedInUser');
        var accessToken = loggedInUser.token;

        var deferred = $q.defer();

        $http({
                method: 'PUT',
                url: ImapConstants.getUrls().intentwise_base_url + 'organization/' + organizationId + '/businessgroup/' + businessGroupId + '/amsaccount/' + accountId + '/keyword/bid',
                data: keywordbids,
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

    this.updateRecommededKeyword = function(organizationId, businessGroupId, accountId, keywordbids) {

        var loggedInUser = $cookies.getObject('loggedInUser');
        var accessToken = loggedInUser.token;

        var deferred = $q.defer();

        $http({
                method: 'POST',
                url: ImapConstants.getUrls().intentwise_base_url + 'organization/' + organizationId + '/businessgroup/' + businessGroupId + '/amsaccount/' + accountId + '/keyword',
                data: keywordbids,
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

    this.getRecommendationSummary = function(organizationId, accountId) {

        var loggedInUser = $cookies.getObject('loggedInUser');
        var accessToken = loggedInUser.token;

        var deferred = $q.defer();

        $http({
                method: 'GET',
                url: ImapConstants.getUrls().intentwise_base_url + 'organization/' + organizationId + '/account/' + accountId + '/recommendation/summary',
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

        