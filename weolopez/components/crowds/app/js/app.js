'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives', 'myApp.controllers', 'ngRoute', 'ngAnimate'])
        .config(['$routeProvider', function($routeProvider) {
                $routeProvider.when('/view1', {templateUrl: 'partials/partial1.html', controller: 'MyCtrl1'});
                $routeProvider.when('/view2', {templateUrl: 'partials/partial2.html', controller: 'MyCtrl2'});
                $routeProvider.when('/view3', {templateUrl: 'partials/partial3.html', controller: 'MyCtrl3'});
                $routeProvider.when('/view4', {templateUrl: 'partials/partial4.html', controller: 'MyCtrl4'});
                $routeProvider.when('/view5', {templateUrl: 'partials/partial5.html', controller: 'MyCtrl5'});
                $routeProvider.otherwise({redirectTo: '/view1'});
            }])        
        .value('appName', 'My App')
        .animation('.animate-enter', function() {
            return {
                enter: function(element, done) {
                    $('#splash-screen').find('a').each(function(i) {
                        $(this).delay(i * 400).fadeIn();
                    });
                },
                leave: function(element, done) {
                    $('#splash-screen').find('a').each(function(i) {
                        $(this).hide();
                    });
                    jQuery(element).css({
                        position: 'absolute',
                        'z-index': 101,
                        top: 0,
                        opacity: 1
                    });
                    jQuery(element).animate({
                        top: -600,
                        opacity: 0
                    }, done);
                }
            };
        });
;
