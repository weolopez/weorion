'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', ['mongolabResourceHttp'])
        .constant('MONGOLAB_CONFIG', {API_KEY: '50f36e05e4b0b9deb24829a0', DB_NAME: 'weolopez'})
        .value('version', '0.2')
        .factory('Users', function($mongolabResourceHttp) {
    return $mongolabResourceHttp('Users');
})
        ;