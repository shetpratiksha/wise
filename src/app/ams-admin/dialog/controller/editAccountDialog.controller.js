(function() {
    angular.module('app')
        .controller('editAccountDialogController', editAccountDialogController);

    function editAccountDialogController($scope, $mdDialog, $rootScope, userListData, accountData) {
        $scope.account = {
            name: accountData.displayName
        };
        $scope.userListData = userListData;
        $scope.selected = accountData.user;
        $scope.toggle = function(item, list) {
            var idx = list.indexOf(item);
            if (idx > -1) {
                list.splice(idx, 1);
            } else {
                list.push(item);
            }
        };
        $scope.exists = function(item, list) {
            console.log(list.indexOf(item) > -1)
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
                newAccount: $scope.userListData,
                userSelected: $scope.selected
            }
            $mdDialog.hide(response);
        };
    }
})();