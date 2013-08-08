'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives', 'myApp.controllers', 'ngGrid', 'ui.bootstrap']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/createPage', {templateUrl: 'partials/createPage.html', controller: 'createPage'});
    $routeProvider.when('/createIS', {templateUrl: 'partials/createIS.html', controller: 'createIS'});
    $routeProvider.when('/configureCatalogs', {templateUrl: 'partials/configureCatalogs.html', controller: 'configureCatalogs'});
    $routeProvider.when('/view1', {templateUrl: 'partials/partial1.html', controller: 'MyCtrl1'});
    $routeProvider.when('/preview', {templateUrl: 'partials/preview.html', controller: 'preview'});
    $routeProvider.when('/view2', {templateUrl: 'partials/partial2.html', controller: 'partial2'});
    $routeProvider.otherwise({redirectTo: '/view2'});
  }]); 
  
  