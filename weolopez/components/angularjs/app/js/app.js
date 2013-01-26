'use strict';


// Declare app level module which depends on filters, and services
angular.module('weolopezApp', ['weolopezApp.filters', 'weolopezApp.services', 'weolopezApp.directives']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/enter', {templateUrl: 'partials/enter.html', controller: enterCtrl});
    $routeProvider.when('/view1', {templateUrl: 'partials/partial1.html', controller: MyCtrl1});
    $routeProvider.when('/view2', {templateUrl: 'partials/partial2.html', controller: todoCtrl});
    $routeProvider.otherwise({redirectTo: '/enter'});
  }]);
