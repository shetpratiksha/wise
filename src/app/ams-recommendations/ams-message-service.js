
var app = angular.module('app');

app.service('AMSMessageService', ['$mdToast', function($mdToast) {

	this.showErrorMessage = function(message) {
        $mdToast.show(
            $mdToast.simple()
            .content(message)
            .position('top right')
            .highlightAction(true)
            .hideDelay(5000)
            .theme("error-toast")
        );
    }

    this.showSuccessMessage = function(message) {
        $mdToast.show(
            $mdToast.simple()
            .content(message)
            .position('top right')
            .highlightAction(true)
            .hideDelay(4000)
            .theme("success-toast")
        );
    }

    this.showInfoMessage = function(message) {
        $mdToast.show(
            $mdToast.simple()
            .content(message)
            .position('top right')
            .highlightAction(true)
            .hideDelay(3000)
            .theme("info-toast")
        );
    }

    this.showWarningMessage = function(message) {
        $mdToast.show(
            $mdToast.simple()
            .content(message)
            .position('top right')
            .highlightAction(true)
            .hideDelay(6000)
            .theme("warning-toast")
        );
    }

}]);


        