(function() {
    'use strict';

    angular
        .module('app.modules.authentication')
        .controller('ProfileController', ProfileController);

    /* @ngInject */
    function ProfileController($http,$rootScope, $scope, $mdToast, ImapConstants, $cookies, PaymentService) {
        var vm = this;
        vm.isLoading = false;
        var urlConstants = ImapConstants.getUrls()
        var stripeKey = ImapConstants.getStripe();
        
        $rootScope.isContentLoading = false;
        vm.password = {
            error : false,
            message : '' 
        }

        vm.loggedInUser = $cookies.getObject('loggedInUser');

        vm.user = vm.loggedInUser.user

        var getPIFunction = PaymentService.getPaymentInfo(vm.user.organizationId)

        vm.showPI = false; 
        getPIFunction.then(function(data) {
            vm.showPI = false;     
                
        }).catch(function() {
            vm.showPI = true;
        })
        

        vm.updatePassword = function() {
            vm.isLoading = true;

            $http({
                method: 'POST',
                url: urlConstants.intentwise_base_url + 'user/changepassword',
                data: {
                    "password": vm.user.password
                },
                headers: {
                    'Content-Type': 'application/json',
                    'X-Auth-Token': vm.loggedInUser.token
                }
            }).then(function successCallback(response) {
                vm.isLoading = false;
                
                $mdToast.show(
                    $mdToast.simple()
                    .content('You have successfully updated your password.')
                    .position('bottom right')
                    .highlightAction(true)
                    .hideDelay(5000)
                )
            },
            function errorCallback(response) {
                vm.isLoading = false;
                vm.password.error = true
                vm.password.message = "Updated Password Failed."
            });
        }

        vm.showBilling = function() {

            // Create a Stripe client
            var stripe = Stripe(stripeKey.key);

            // Create an instance of Elements
            var elements = stripe.elements();

            // Custom styling can be passed to options when creating an Element.
            // (Note that this demo uses a wider set of styles than the guide below.)
            var style = {
              base: {
                color: '#32325d',
                lineHeight: '18px',
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                fontSmoothing: 'antialiased',
                fontSize: '16px',
                '::placeholder': {
                  color: '#aab7c4'
                }
              },
              invalid: {
                color: '#fa755a',
                iconColor: '#fa755a'
              }
            };

            // Create an instance of the card Element
            var card = elements.create('card', {style: style});

            // Add an instance of the card Element into the `card-element` <div>
            card.mount('#card-element');

            // Handle real-time validation errors from the card Element.
            card.addEventListener('change', function(event) {
              var displayError = document.getElementById('card-errors');
              if (event.error) {
                displayError.textContent = event.error.message;
              } else {
                displayError.textContent = '';
              }
            });

            card.addEventListener('blur', function(event) {
              var displayError = document.getElementById('card-errors');
              if (event.error) {
                displayError.textContent = event.error.message;
              } else {
                displayError.textContent = '';
              }
            });

            // Handle form submission
            var form = document.getElementById('payment-form');
            form.addEventListener('submit', function(event) {
              event.preventDefault();

              stripe.createToken(card).then(function(result) {
                if (result.error) {
                  var errorElement = document.getElementById('card-errors');
                  errorElement.textContent = result.error.message;

                } else {
                
                  var savePayment = PaymentService.savePaymentInfo(result.token.id);

                    savePayment.then(function(data) {
                        $mdToast.show(
                            $mdToast.simple()
                            .content('Payment details updated successfully')
                            .position('top right')
                            .highlightAction(true)
                            .hideDelay(5000)
                        )
                        vm.showPI = false;
                    }).catch(function(error) {
                        vm.showPI = true;

                        var message = "Card information could not be saved. Please try later and/or contact help@intentwise.com"
                        if(error.status == 401) {
                            message = error.data.message
                        }
                        $mdToast.show(
                            $mdToast.simple()
                            .content(message)
                            .position('top right')
                            .highlightAction(true)
                            .hideDelay(8000)
                        )
                    })
                  
                }
              });
            });

        }


    }
})();
