'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('isd.services', ['mongolabResourceHttp', 'ngResource'])
        .constant('MONGOLAB_CONFIG', {API_KEY: '50f36e05e4b0b9deb24829a0', DB_NAME: 'weolopez'})
        .value('version', '0.10')
        .factory('Users', function($mongolabResourceHttp) {
    return $mongolabResourceHttp('Users');
})
        .factory('InventorySpaces', function($mongolabResourceHttp) {
    return $mongolabResourceHttp('InventorySpaces');
})
        .factory('Pages', function($mongolabResourceHttp) {
    return $mongolabResourceHttp('Pages');
})
        .factory('ConsumptionEngines', function($mongolabResourceHttp) {
    return $mongolabResourceHttp('ConsumptionEngines');
})
        .factory('Modules', function($mongolabResourceHttp) {
    return $mongolabResourceHttp('Modules');
})
        .factory('InventorySpaceSizes', function($mongolabResourceHttp) {
    return $mongolabResourceHttp('InventorySpaceSizes');
})
        .factory('ContentSizes', function($mongolabResourceHttp) {
    return $mongolabResourceHttp('ContentSizes');
})
        .factory('ContentTypes', function($mongolabResourceHttp) {
    return $mongolabResourceHttp('ContentTypes');
})
        .factory('Catalogs', function($mongolabResourceHttp) {
    return $mongolabResourceHttp('Catalogs');
})
        .factory('Catalog', function($mongolabResourceHttp) {
    return $mongolabResourceHttp('Catalog');
})
        .factory('Templates', function($mongolabResourceHttp) {
    var templates = $mongolabResourceHttp('Templates');
    templates.init = function(cat, size) {
        var template = new templates();
        template.name = "Responsive";
        template.size = size;
        template.catalog = {
            'name': cat.name,
            'contentSize': cat.contentSize
        };
        return template;
    }
    return templates;
})
        .factory('Entity', function($resource) {
    return {
        offers: $resource('serviceEMU/server.json'),
        sizes: $resource('serviceEMU/sizes.json'),
        rules: $resource('serviceEMU/rules.json'),
        catalog: $resource('serviceEMU/catalog.json'),
        catalogs: $resource('serviceEMU/catalogs.json'),
        allOffers: "",
        previewDialog: "",
        selectedSize: "",
        selectedTemplate: "",
        selectedPage: "",
        selectedOffer: undefined,
        selectedCatalog: undefined,
        selectedInventorySpace: undefined
    }
})
        ;

