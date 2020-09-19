describe('roasSettingsController', function () {
    beforeEach(angular.mock.module('app', 'ngCookies'));   
    var $controller, $cookies,$q,AMSAdminRoasSettingService,AMSMessageService,$mdDialog,$rootScope,$scope,deferred,controller;   
    var accountCallResponseData = {
        "data":{
          "accountId": 10190,
          "name": "Intentwise",
          "roas": 13
    }};
    
    var accountCallResponseDataError = {
        "accountId": 121,
        "name": "",
        "roas": undefined
    }

    var roasList =  {"data": [
                                {            
                                    "roasId": 290,
                                    "accountId": 10110,
                                    "campaignType": "sponsoredProducts",
                                    "campaignName": "SP_Manual_Promo_BTSoffice_201603",
                                    "roas": 120,
                                    "campaignId": 96938560789729
                                },
                                {
                                    "accountId": 10110,
                                    "campaignType": "sponsoredProducts",
                                    "campaignName": "Dinosaurs",
                                    "campaignId": 115816350962764
                                }
                            ]
                        };
    beforeEach(module(function($provide) {
        AMSAdminRoasSettingService = jasmine.createSpyObj('AMSAdminRoasSettingService', ['getAccountRoasData','getRoasSettingData','updateAccountRoasSettingData','updateRoasSettingData']);
        $provide.value('AMSAdminRoasSettingService', AMSAdminRoasSettingService);

        AMSMessageService = jasmine.createSpyObj('AMSMessageService', ['showErrorMessage','showSuccessMessage','showWarningMessage']);
        $provide.value('AMSMessageService', AMSMessageService);

        DynamicMenuService = jasmine.createSpyObj('DynamicMenuService',['addDynamicMenu'])
        $provide.value('DynamicMenuService', DynamicMenuService);
    }));
    
    beforeEach(angular.mock.inject(function(_$controller_, _$cookies_,_$mdDialog_,_$q_,_$rootScope_,_$mdToast_,_$location_){    
        $controller = _$controller_;    
        $cookies = _$cookies_; 
        $mdDialog = _$mdDialog_;
        $q=_$q_;
        $mdToast = _$mdToast_;
        $rootScope = _$rootScope_;      
        $scope = $rootScope.$new();
        $location = _$location_;
        deferred = $q.defer();
        $cookies = {    
            store:{
            "loggedInUser":{
            "user":{
                "role":'SUPER_ADMIN'
                }    
            }},    
            putObject: function (key, value) { this.store[key] = value; },    
            getObject: function (key) { return this.store[key]; }   
        }  
        
        controller = $controller('AmdAdminROASSettings', { $scope: $scope ,$cookies:$cookies,$location:$location,AMSAdminRoasSettingService:AMSAdminRoasSettingService ,AMSMessageService:AMSMessageService,DynamicMenuService:DynamicMenuService}); 
        spyOn($scope, 'listApiCall').and.callThrough();  
        spyOn($mdDialog, 'show');
        // // $scope.$broadcast('org_acc_loaded');
        spyOn($scope, 'roasListCall').and.callThrough();
        spyOn($scope, 'accountRoasCall').and.callThrough();
        spyOn(controller,'showIncontextConfirmationDialog').and.callThrough();
        $mdDialog.show.and.callFake(function () {
        return {
            then: function (callBack) {
                        callBack(true); //return the value to be assigned.
                    }
            }
        })

          
        $rootScope.current_organization = {'organizationId' : 1};
        $rootScope.current_bg = {'businessGroupId' : 2};
        $rootScope.current_account = {'amsAccountId' : 121};

    }));
       
           
            
            describe('Check Length Function', function () {
                // console.log($rootScope.current_organization);
                //1
                it('False Condition', function () {    
                    $scope.selected = ['value1'];            
                    var checkLenghtVal = $scope.checkLength();            
                    expect(checkLenghtVal).toEqual(false);     
                        
                }); 
            
                //2
                it('True Condition', function () {        
                    $scope.selected = [];        
                    var checkLenghtVal = $scope.checkLength();        
                    expect(checkLenghtVal).toEqual(true);        
                });
            
                // console.log($scope.listApiCall);
                   
            });
        
            describe('GetAccountData', function () {
                //3
                it('success condition',function() {
                    var deferred = $q.defer();
                    AMSAdminRoasSettingService.getAccountRoasData.and.returnValue(deferred.promise);
                    $scope.accountRoasCall(1,2,121);          
                    deferred.resolve(accountCallResponseData);          
                    $rootScope.$apply();
                    expect($scope.accountRoasData).toBe(accountCallResponseData.data);          
                });       
        
                //4
                it('failed condition',function() {
                    var deferred = $q.defer();
                    AMSAdminRoasSettingService.getAccountRoasData.and.returnValue(deferred.promise);
                    $scope.accountRoasCall(1,2,121);          
                    deferred.reject('I hate you Bob!');
                    $rootScope.$apply();
                    console.log($scope.accountRoasData);
                    expect($scope.accountRoasData).toEqual(accountCallResponseDataError);          
                });       
        
            });
        
            describe('AccountRoasUpdate function', function () {
                //5
                it('Valid Form - Opens dialog ',function() {
                    deferred = $q.defer();            
                    // spyOn(console, 'log');
                   
                    AMSAdminRoasSettingService.updateAccountRoasSettingData.and.returnValue(deferred.promise);
                    $scope.form = {};
                    $scope.form.$invalid = false;
                    $scope.accountRoasUpdate($scope.form);
                    $rootScope.$apply();            
                    expect($mdDialog.show).toHaveBeenCalled();  
                             
                }); 
        
                //6
                it('Invalid Form - No dialog ',function() {           
                    $scope.form = {};
                    $scope.form.$invalid = true;                 
                    $scope.accountRoasUpdate($scope.form);
                    $rootScope.$apply();
                    expect($mdDialog.show).not.toHaveBeenCalled(); 
                                    
                }); 
            });
        
            describe('UploadAccountRoas function', function () {
                //7
                it('Success Function ',function() {
                    deferred = $q.defer();           
                    
                    AMSAdminRoasSettingService.updateAccountRoasSettingData.and.returnValue(deferred.promise);
                    controller.uploadAccountRoas(accountCallResponseData.data);
                    deferred.resolve(accountCallResponseData);          
                    $rootScope.$apply();
                    //6
                    expect($scope.accountRoasDataCopy).toEqual(accountCallResponseData.data);
                    //7
                    expect($rootScope.roasLoading).toEqual(false);                     
                    //8
                    expect(AMSMessageService.showSuccessMessage).toHaveBeenCalled(); 
                });
        
                //8
                it('Failed Function ',function() {
                    deferred = $q.defer();           
                    
                    AMSAdminRoasSettingService.updateAccountRoasSettingData.and.returnValue(deferred.promise);
                    controller.uploadAccountRoas(accountCallResponseData.data);
                    deferred.reject();          
                    $rootScope.$apply();              
                    //9
                    expect($rootScope.roasLoading).toEqual(false);                    
                    //10
                    expect(AMSMessageService.showErrorMessage).toHaveBeenCalled(); 
                             
                });
            });
        
            describe('ShowIncontextConfirmationDialog', function () {
                //9
                it('Case - "roasEdit"',function() {
                    deferred = $q.defer();
                 
                   
                    AMSAdminRoasSettingService.updateRoasSettingData.and.returnValue(deferred.promise);
                    controller.showIncontextConfirmationDialog("click","some message","roasEdit");
                    $rootScope.$apply();
                    expect($mdDialog.show).toHaveBeenCalled();  
        
                });
        
                //10
                it('Case - "roasBulk"',function() {
                    deferred = $q.defer();
                    
                   
                    AMSAdminRoasSettingService.updateRoasSettingData.and.returnValue(deferred.promise);
                    controller.showIncontextConfirmationDialog("click","some message","roasBulk");
                    $rootScope.$apply();
                    expect($mdDialog.show).toHaveBeenCalled();  
        
                });
        
                //11
                it('Case - "roasAccount"',function() {
                    deferred = $q.defer();          
                   
                    AMSAdminRoasSettingService.updateAccountRoasSettingData.and.returnValue(deferred.promise);
                    controller.showIncontextConfirmationDialog("click","some message","roasAccount");
                    $rootScope.$apply();
                    expect($mdDialog.show).toHaveBeenCalled();  
        
                });
        
                
            });
        
            describe('RoasListCall', function () {
                //12
                it('success condition',function() {
                    var deferred = $q.defer();
                    AMSAdminRoasSettingService.getRoasSettingData.and.returnValue(deferred.promise);
                    $scope.roasListCall(1,2,121);          
                    deferred.resolve(roasList);          
                    $rootScope.$apply();
                    expect($scope.adminROASData).toEqual(roasList.data);  
                    expect($scope.adminROASCampList).toEqual(roasList.data);         
                });       
        
                //13
                it('failed condition',function() {
                    var deferred = $q.defer();
                    AMSAdminRoasSettingService.getRoasSettingData.and.returnValue(deferred.promise);
                    $scope.roasListCall(1,2,121);              
                    deferred.reject('I hate you Bob!');
                    $rootScope.$apply();
                    expect(controller.loadingError).toEqual("Error displaying ACOS. Please try later!!!");       
                });       
        
            });
            
        
            describe('ListApiCall', function () {
                //14
                it('call roasListCall',function() {
                    var deferred = $q.defer();
                    AMSAdminRoasSettingService.getRoasSettingData.and.returnValue(deferred.promise);
                    AMSAdminRoasSettingService.getAccountRoasData.and.returnValue(deferred.promise);
                    $scope.listApiCall();                
                    $rootScope.$apply();
                    expect($scope.roasListCall).toHaveBeenCalled();  
                    expect($scope.accountRoasCall).toHaveBeenCalled();           
                }); 
            });
        
            describe('UploadROAS function', function () {
                //15
                it('Success Function ',function() {
                    deferred = $q.defer(); 
                    $scope.selected = [1,12,12]          
                    AMSAdminRoasSettingService.updateRoasSettingData.and.returnValue(deferred.promise);
                    controller.uploadROAS(roasList.data);
                    // expect(controller.ROASUploadRequests).toEqual(roasList.data);
                    deferred.resolve("success");          
                    $rootScope.$apply();            
                    expect(AMSAdminRoasSettingService.updateRoasSettingData).toHaveBeenCalled();
                    expect(AMSAdminRoasSettingService.updateRoasSettingData).toHaveBeenCalledWith($rootScope.current_organization.organizationId, $rootScope.current_bg.businessGroupId, $rootScope.current_account.amsAccountId, roasList.data);
                    expect($rootScope.roasEditLoading).toBe(false);     
                    console.log($scope.selected.length);                
                    expect(controller.message).toEqual("Successfully uploaded 3 ACOS value.")
                    expect($scope.selected.length).toEqual(0); 
                    expect(AMSMessageService.showSuccessMessage).toHaveBeenCalled();
                    expect(AMSMessageService.showSuccessMessage).toHaveBeenCalledWith("Successfully uploaded 3 ACOS value.");
                });
        
                //16
                it('Failed Function ',function() {
                    deferred = $q.defer();   
                    AMSAdminRoasSettingService.updateRoasSettingData.and.returnValue(deferred.promise);
                    controller.uploadROAS(roasList.data);
                    deferred.reject();          
                    $rootScope.$apply();              
                    expect($rootScope.roasEditLoading).toBe(false);                  
                    expect(AMSMessageService.showErrorMessage).toHaveBeenCalled(); 
                    expect(AMSMessageService.showErrorMessage).toHaveBeenCalledWith("Error uploading ACOS Value. Please try later!!!");
                });
            });
        
            describe('RoasBulkEdit', function () {
                beforeEach(function(){
                $mdDialog.show.and.callFake(function () {
                    return {
                        then: function (callBack) {
                                    callBack(13); //return the value to be assigned.
                                }
                        }
                    });
        
                    $scope.adminROASCampList = [{
                        "roasId": 290,
                        "accountId": 10110,
                        "campaignType": "sponsoredProducts",
                        "campaignName": "SP_Manual_Promo_BTSoffice_201603",
                        "roas": 120,
                        "campaignId": 96938560789729
                    },
                    {
                        "roasId": 291,
                        "accountId": 10111,
                        "campaignType": "sponsoredProducts1",
                        "campaignName": "SP_Manual_Promo_BTSoffice_2016031",
                        "roas": 120,
                        "campaignId": 96938560789730
                    },
                    {
                        "roasId": 292,
                        "accountId": 10112,
                        "campaignType": "sponsoredProducts2",
                        "campaignName": "SP_Manual_Promo_BTSoffice_2016032",
                        "roas": 120,
                        "campaignId": 96938560789731
                    },
                ];       
        
                $scope.selected= [
                    {
                        "roasId": 291,
                        "accountId": 10111,
                        "campaignType": "sponsoredProducts1",
                        "campaignName": "SP_Manual_Promo_BTSoffice_2016031",
                        "roas": 120,
                        "campaignId": 96938560789730
                    },
                    {
                        "roasId": 292,
                        "accountId": 10112,
                        "campaignType": "sponsoredProducts2",
                        "campaignName": "SP_Manual_Promo_BTSoffice_2016032",
                        "roas": 120,
                        "campaignId": 96938560789731
                    },
                ];
                })
                //14
                it('call roasListCall',function() {
                    var deferred = $q.defer();    
                    console.log($scope.selected);
                    AMSAdminRoasSettingService.updateRoasSettingData.and.returnValue(deferred.promise);
                    $scope.roasBulkEdit();                
                    $rootScope.$apply();
                    expect($mdDialog.show).toHaveBeenCalled(); 
                    
                    expect($scope.selected[0].campaignId).toEqual(96938560789730);
                    expect($scope.selected[0].roas).toEqual(13);
                    expect($scope.selected[1].campaignId).toEqual(96938560789731);
                    expect($scope.selected[1].roas).toEqual(13);
                    expect(controller.showIncontextConfirmationDialog).toHaveBeenCalled();
                }); 
            });
        
            describe('EditROAS', function () {
                beforeEach(function(){
                $mdDialog.show.and.callFake(function () {
                    return {
                        then: function (callBack) {
                                    callBack(13); //return the value to be assigned.
                                }
                        }
                    });
        
                    $scope.adminROASCampList = [{
                        "roasId": 290,
                        "accountId": 10110,
                        "campaignType": "sponsoredProducts",
                        "campaignName": "SP_Manual_Promo_BTSoffice_201603",
                        "roas": 120,
                        "campaignId": 96938560789729
                    },
                    {
                        "roasId": 291,
                        "accountId": 10111,
                        "campaignType": "sponsoredProducts1",
                        "campaignName": "SP_Manual_Promo_BTSoffice_2016031",
                        "roas": 120,
                        "campaignId": 96938560789730
                    },
                    {
                        "roasId": 292,
                        "accountId": 10112,
                        "campaignType": "sponsoredProducts2",
                        "campaignName": "SP_Manual_Promo_BTSoffice_2016032",
                        "roas": 120,
                        "campaignId": 96938560789731
                    },
                ];       
        
                $scope.selected= [
                    {
                        "roasId": 291,
                        "accountId": 10111,
                        "campaignType": "sponsoredProducts1",
                        "campaignName": "SP_Manual_Promo_BTSoffice_2016031",
                        "roas": 120,
                        "campaignId": 96938560789730
                    },
                    {
                        "roasId": 292,
                        "accountId": 10112,
                        "campaignType": "sponsoredProducts2",
                        "campaignName": "SP_Manual_Promo_BTSoffice_2016032",
                        "roas": 120,
                        "campaignId": 96938560789731
                    },
                ];
                })
                //14
                it('call roasListCall',function() {
                    var deferred = $q.defer();    
                    console.log($scope.selected);
                    AMSAdminRoasSettingService.updateRoasSettingData.and.returnValue(deferred.promise);
                    $scope.roasBulkEdit();                
                    $rootScope.$apply();
                    expect($mdDialog.show).toHaveBeenCalled(); 
                    
                    expect($scope.selected[0].campaignId).toEqual(96938560789730);
                    expect($scope.selected[0].roas).toEqual(13);
                    expect($scope.selected[1].campaignId).toEqual(96938560789731);
                    expect($scope.selected[1].roas).toEqual(13);
                    expect(controller.showIncontextConfirmationDialog).toHaveBeenCalled();
                }); 
            });



});