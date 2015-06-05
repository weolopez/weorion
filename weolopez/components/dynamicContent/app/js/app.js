'use strict';


// Declare app level module which depends on filters, and services
var app = angular.module('inventorySpaceDefinition', ['isd.services','isd.controllers','isd.directives']).
  config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/dashboard', {templateUrl:'partials/dashboard.html', controller:'DashboardCtrl', resolve:{
  }});
  $routeProvider.when('/users', {templateUrl:'partials/users.html', controller:'UsersCtrl', resolve:{
    user:function(Users){return Users.query({'CURRENT_USER':'CURRENT_USER'});} ,
    allUsers:function(Users){return Users.all();},
    allCEs:function(ConsumptionEngines){return ConsumptionEngines.all();}
  }});
  $routeProvider.when('/ces', {templateUrl:'partials/ces.html', controller:'CEsCtrl', resolve:{
    allCEs:function(ConsumptionEngines){return ConsumptionEngines.all();}
  }});
  $routeProvider.when('/list/:id', {templateUrl:'partials/list.html', controller:'ListCtrl', resolve:{    
    is:function(InventorySpaces, $route){return InventorySpaces.query({'ce.name':$route.current.params.id});}
  }});
  $routeProvider.when('/edit/:ce/:id', {templateUrl:'partials/form.html', controller:'FormCtrl', resolve:{
    is:function(InventorySpaces, $route){return InventorySpaces.getById($route.current.params.id);} ,
    allPages:function(Pages, $route){return Pages.query({'ce.name':$route.current.params.ce});} ,
    allModules:function(Modules){return Modules.all();}
  }});
  $routeProvider.when('/new', {templateUrl:'partials/form.html', controller:'FormCtrl', resolve:{ 
    is:function(InventorySpaces){return new InventorySpaces();} ,   
    allPages:function(Pages){return Pages.all();} ,
    allModules:function(Modules){return Modules.all();}
  }});
  $routeProvider.when('/catalog/:id', {templateUrl:'partials/catalog.html', controller:'CatalogCtrl', resolve:{
    is:function(InventorySpaces, $route){return InventorySpaces.getById($route.current.params.id);},
    allOffers:function(Catalog){return Catalog.all();},
    allContentTypes:function(ContentTypes){return ContentTypes.all();},
    allTemplates:function(Templates){return Templates.all();},
    allCatalogs:function(Catalogs){return Catalogs.all();}
  }});
  $routeProvider.when('/templateDesign/:id', {templateUrl:'partials/templateDesign.html', controller:'TemplateDesignCtrl', resolve:{
    template:function(Templates, $route){return Templates.getById($route.current.params.id);},
    allTemplates:function(Templates){return Templates.all();}
  }});
  $routeProvider.otherwise({redirectTo: '/dashboard'});
  }]);




