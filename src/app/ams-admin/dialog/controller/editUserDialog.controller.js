(function() {
    angular.module('app')
        .controller('editUserDialogController', editUserDialogController);

    function editUserDialogController($scope, $mdDialog, $rootScope, accountLists, userData, userAssociation) {
        $scope.selected = [];
        $scope.userData = userData;
        $scope.disableCheck = false;
        $scope.accountList = accountLists;
        var userAssocData = userAssociation.filter(function(value) {
            return userData.userId == value.userId;
        })
        var resultUserAssocId = userAssocData.map(function(a) {
            return a.amsAccountId
        });

        function returnSelectedAccount() {
            return $scope.accountList.filter(function(itm) {
                if (resultUserAssocId.indexOf(itm.amsAccountId) > -1) {
                    return true;
                } else {
                    return false;
                }
            });
        }
        if (userData.role == "ADMIN" || userData.role == "SUPER_ADMIN") {
            $scope.disableCheck = true;
        }
        $scope.selected = returnSelectedAccount();

        $scope.user = {
            role: userData.role
        };

        $scope.toggle = function(item, list) {
            if (userData.role !== "ADMIN" && userData.role !== "SUPER_ADMIN") {
                var idx = list.indexOf(item);
                console.log("from controller before: "+list+ ' '+idx)
                if (idx > -1) {
                    list.splice(idx, 1);
                    console.log("from controller 1: "+list);
                } else {
                    list.push(item);

                    console.log("from controller 2: "+list);
                }
              console.log("from controller : "+list)
            }
            // else{
            //     console.log("from controller : "+list)
            // }
        };
        $scope.exists = function(item, list) {
            if (userData.role !== "ADMIN" && userData.role !== "SUPER_ADMIN") {
                return list.indexOf(item) > -1;
                
            } else {
                return true;
            }
        };
        $scope.isIndeterminate = function() {
            // var p = $scope.selected.length !== 0 &&
            //     $scope.selected.length !== $scope.accountList.length;
            // console.log('listy '+$scope.accountList.length+' '+$scope.selected.length+' '+p)
            return ($scope.selected.length !== 0 &&
                $scope.selected.length !== $scope.accountList.length);
        };
        $scope.isChecked = function() {
            if (userData.role !== "ADMIN" && userData.role !== "SUPER_ADMIN") {
                console.log('pl '+$scope.selected.length+" "+$scope.accountList.length)
                return $scope.selected.length === $scope.accountList.length;
            } else {
                return true;
            }
        };
        $scope.toggleAll = function() {
            if (userData.role !== "ADMIN" && userData.role !== "SUPER_ADMIN") {
                if ($scope.selected.length === $scope.accountList.length) {
                    $scope.selected = [];
                } else if ($scope.selected.length === 0 || $scope.selected.length > 0) {
                    $scope.selected = $scope.accountList.slice(0);
                }
            }
        };
        $scope.closeDialog = function() {
            $mdDialog.cancel();
        }
        $scope.saveEditUser = function() {
            var response = {
                userRole: $scope.user.role,
                userId: userData.userId,
                accountSelected: $scope.selected,
                previousSelectedAcc: returnSelectedAccount()
            }
            $mdDialog.hide(response);
        };
    }
})();