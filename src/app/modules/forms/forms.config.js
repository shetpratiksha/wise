(function() {
    'use strict';

    angular
        .module('app.modules.forms')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($stateProvider, triMenuProvider) {

        $stateProvider
        .state('triangular.forms-inputs', {
            url: '/forms/inputs',
            templateUrl: 'app/modules/forms/inputs.tmpl.html',
            data: {
                layout: {
                    contentClass: 'layout-column'
                }
            }
        })
        .state('triangular.forms-binding', {
            url: '/forms/binding',
            templateUrl: 'app/modules/forms/binding.tmpl.html',
            data: {
                layout: {
                    contentClass: 'layout-column'
                }
            }
        })
        .state('triangular.forms-autocomplete', {
            url: '/forms/autocomplete',
            templateUrl: 'app/modules/forms/autocomplete.tmpl.html',
            data: {
                layout: {
                    contentClass: 'layout-column'
                }
            }
        })
        .state('triangular.forms-wizard', {
            url: '/forms/wizard',
            templateUrl: 'app/modules/forms/wizard.tmpl.html',
            controller: 'FormWizardController',
            controllerAs: 'wizardController',
            data: {
                layout: {
                    contentClass: 'layout-column full-image-background mb-bg-fb-02 background-overlay-static',
                    innerContentClass: 'overlay-gradient-20'
                }
            }
        })
        .state('triangular.forms-validation', {
            url: '/forms/validation',
            templateUrl: 'app/modules/forms/validation.tmpl.html',
            data: {
                layout: {
                    contentClass: 'layout-column'
                }
            }
        });
/*
        triMenuProvider.addMenu({
            name: 'Forms',
            icon: 'zmdi zmdi-calendar-check',
            type: 'dropdown',
            priority: 3.3,
            children: [{
                name: 'Autocomplete',
                type: 'link',
                state: 'triangular.forms-autocomplete'
            },{
                name: 'Data Binding',
                type: 'link',
                state: 'triangular.forms-binding'
            },{
                name: 'Inputs',
                type: 'link',
                state: 'triangular.forms-inputs'
            },{
                name: 'Wizard',
                type: 'link',
                state: 'triangular.forms-wizard'
            },{
                name: 'Validation',
                type: 'link',
                state: 'triangular.forms-validation'
            }]
        });
        triMenuProvider.addMenu({
            type: 'divider',
            priority: 3.4
        });
        */
    }
})();
