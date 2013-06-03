'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', ['weolopezApp.filters', 'weolopezApp.services', 'weolopezApp.directives', 'mongolab']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/view1', {templateUrl: 'components/partials/partial1.html', controller: MyCtrl1});
    $routeProvider.when('/view2', {templateUrl: 'components/partials/partial2.html', controller: MyCtrl2});
    $routeProvider.otherwise({redirectTo: '/view1'});
  }]);
