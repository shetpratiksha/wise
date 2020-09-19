(function() {
    angular.module('app')
        .controller('newAccountDialogController', newAccountDialogController);

    function newAccountDialogController($scope, $mdDialog, $rootScope, userListData) {
        $scope.account = {
            name: ""
        };
        $scope.userListData = userListData;
        $scope.selected = [];
        $scope.toggle = function(item, list) {
            var idx = list.indexOf(item);
            if (idx > -1) {
                list.splice(idx, 1);
            } else {
                list.push(item);
            }
        };
        $scope.exists = function(item, list) {
            return list.indexOf(item) > -1;
        };
        $scope.isIndeterminate = function() {
            return ($scope.selected.length !== 0 &&
                $scope.selected.length !== $scope.userListData.length);
        };
        $scope.isChecked = function() {
            return $scope.selected.length === $scope.userListData.length;
        };
        $scope.toggleAll = function() {
            if ($scope.selected.length === $scope.userListData.length) {
                $scope.selected = [];
            } else if ($scope.selected.length === 0 || $scope.selected.length > 0) {
                $scope.selected = $scope.userListData.slice(0);
            }
        };

        $scope.closeDialog = function() {
            $mdDialog.cancel();
        }
        $scope.addnewAccount = function() {
            var response = {
                newAccount:  $scope.account,
                userSelected: $scope.selected
            }
            $mdDialog.hide(response);
        };
    }
})();