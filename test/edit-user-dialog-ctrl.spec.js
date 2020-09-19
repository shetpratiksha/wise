describe('editUserDialogController',function(){
    beforeEach(angular.mock.module('app'));
    var $controller,$editUserDialogControllerService,$mdDialog,$rootScope,$q,controller;
    var list = ['a','b','c'];
    var listCopy,listcopy1;
    var userData;

    var accountLists = [];
    var userAssociation = [];

    // beforeEach(module(function($provide){
    //     editUserDialogControllerService = jasmine.createSpyObj('editUserDialogControllerService',[])
    // }));

    beforeEach(angular.mock.inject(function(_$controller_,_$rootScope_){
          $controller = _$controller_;
        //   $mdDialog = _mdDialog_;
        //   $q=_$q_;
        $rootScope = _$rootScope_;  
        $scope = _$rootScope_.$new();
        listCopy = ['a','b','c'];
        listcopy1 = ['a','b'];

    userData = {
         "role":'pqr'
    }      
        //deferred = $q.defer();
        
          controller = $controller('editUserDialogController', { $scope: $scope,accountLists:accountLists,userData:userData,userAssociation:userAssociation});
    }));

    describe('User Toggle Function',function(){
        
        //1
        it('Equal Condition',function(){            
            $scope.toggle('c',list);
            console.log(list +"list +++");
            expect(list).toEqual(listcopy1);
            //expect(list).toEqual(listCopy);
            // console.log('listing ',$scope.toggle);
        });

        //2
        it('Unequl Condition',function(){
            $scope.toggle('c',list);
             console.log(list +"list +++");
            expect(list).toEqual(listCopy)

        })
    });

    describe('User Exists Function', function(){

        it('True Condition',function(){
            var user_exists = $scope.exists('c',list);
            expect(user_exists).toBe(true);
        });

        // it('False Condition',function(){

        // })
    });

    describe('IsIndeterminate Function', function(){

        it('true Condition',function(){
            $scope.selected = ['value1'];
            $scope.accountList = [];
            var checkIsIndeterminate = $scope.isIndeterminate();
            expect(checkIsIndeterminate).toBe(true);
        });
    });

    describe('IsChecked Function', function(){

        it('True Condition',function(){
            $scope.selected = ['value1'];
            $scope.accountList = ['bbb'];
            var checkIsIndeterminate = $scope.isChecked();
            expect(checkIsIndeterminate).toBe(true);
        });

        it('False Condition',function(){
            $scope.selected = [];
            $scope.accountList = ['bbb'];
            var checkIsIndeterminate = $scope.isChecked();
            expect(checkIsIndeterminate).toBe(false);
        });
    });
});