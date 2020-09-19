(function() {
    angular.module('app')
        .controller('newUserDialogController', newUserDialogController);

    function newUserDialogController($scope, $mdDialog, $rootScope, accountList) {
        $scope.user = {
            email: "",
            role: "Analyst"
        };
        $scope.accountList = accountList;
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
                $scope.selected.length !== $scope.accountList.length);
        };
        $scope.isChecked = function() {
            return $scope.selected.length === $scope.accountList.length;
        };
        $scope.toggleAll = function() {
            if ($scope.selected.length === $scope.accountList.length) {
                $scope.selected = [];
            } else if ($scope.selected.length === 0 || $scope.selected.length > 0) {
                $scope.selected = $scope.accountList.slice(0);
            }
        };

        $scope.closeDialog = function() {
            $mdDialog.cancel();
        }
        $scope.addNewUser = function() {
            var response = {
                newUser: $scope.user,
                accountSelected: $scope.selected
            }
            $mdDialog.hide(response);
        };
    }
})();