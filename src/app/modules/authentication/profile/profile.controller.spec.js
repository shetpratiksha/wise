// (function() {
//     'use strict';

//     describe('controllers', function() {
//         var $rootScope,$scope,$controller,controller,$cookies;

//         beforeEach(module('app'));

//         beforeEach(angular.mock.inject(function(_$controller_,_$rootScope_, _$cookies_){  
//             $rootScope = _$rootScope_;  
//             $cookies = _$cookies_; 
//             $scope = $rootScope.$new();
//             $controller = _$controller_;

//             $cookies = {    
//             store:{
//             "loggedInUser":{
//             "user":{
//                 "role":'SUPER_ADMIN'
//             },
//             "token":"sample"   
//             }},    
//             putObject: function (key, value) { this.store[key] = value; },    
//             getObject: function (key) { return this.store[key]; }   
//             } 
            
//         controller = $controller('ProfileController',{$scope:$scope,$cookies:$cookies});

             
//         })
//         );


//         it('User profile should be Christos', inject(function($controller) {            
//             var vm = controller;
//             console.log(vm.user.name);
//             expect(vm.user.name === 'Christos').toBeTruthy();

//         }));

//         it('Scope should be isolate', inject(function($controller) {
//             var vm = $controller('ProfileController');
//             expect(vm).toEqual(jasmine.any(Object));
//         }));
//     });
// })();
