'use strict';


// Declare app level module which depends on filters, and services
angular.module('weolopezApp', ['weolopezApp.filters', 'weolopezApp.services', 'weolopezApp.directives','project']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/enter', {templateUrl: 'components/partials/enter.html', controller: enterCtrl});
    $routeProvider.when('/view1', {templateUrl: 'components/partials/partial1.html', controller: enterCtrl});
    $routeProvider.when('/view2', {templateUrl: 'components/partials/partial2.html', controller: enterCtrl});
    $routeProvider.when('/viewComponent', {templateUrl: 'components/partials/componentPartial.html', controller: enterCtrl});
    $routeProvider.otherwise({redirectTo: '/enter'});
  }]);
