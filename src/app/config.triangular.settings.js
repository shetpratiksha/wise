(function() {
    'use strict';

    angular
        .module('app')
        .config(translateConfig);

    /* @ngInject */
    function translateConfig(triSettingsProvider, triRouteProvider) {
        var now = new Date();
        // set app name & logo (used in loader, sidemenu, footer, login pages, etc)
        triSettingsProvider.setName('intentwise');
        triSettingsProvider.setCopyright('&copy;' + now.getFullYear() + ' intentwise.com');
        triSettingsProvider.setLogo('assets/images/logo.png');
        // set current version of app (shown in footer)
        triSettingsProvider.setVersion('1.0');
        // set the document title that appears on the browser tab
        triRouteProvider.setTitle('Intentwise - Marketing Analytics and Recommendation Engine');
        triRouteProvider.setSeparator('|');
    }
})();
