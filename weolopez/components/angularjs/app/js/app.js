'use strict';


// Declare app level module which depends on filters, and services
angular.module('weolopezApp', ['weolopezApp.filters', 'weolopezApp.services', 'weolopezApp.directives', 'weolopezApp.controlers']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/enter', {templateUrl: 'partials/enter.html', controller: enterCtrl});
    $routeProvider.when('/view1', {templateUrl: 'partials/partial1.html', controller: componentsCtrl});
    $routeProvider.when('/view2', {templateUrl: 'partials/partial2.html', controller: componentsCtrl});
    $routeProvider.when('/viewComponent', {templateUrl: 'partials/componentPartial.html', controller: componentsCtrl});
    $routeProvider.otherwise({redirectTo: '/enter'});
  }]);
