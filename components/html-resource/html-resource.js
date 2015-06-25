/* 
 */
'use strict';

angular.module('component.html-resource', [ 'ngResource'
])         
		.factory('$resources', function ($http, $localStorage) {
		var resources = {};
		var observerCallbacks = [];

		if ($localStorage.resourceCache === undefined)
			$localStorage.resourceCache = {};
		if ($localStorage.resourceCache[document.title] === undefined)
			$localStorage.resourceCache[document.title] = {};
		resources = $localStorage.resourceCache[document.title];

		//call this when you know 'foo' has been changed
		var notifyObservers = function (resourceName) {
			angular.forEach(observerCallbacks, function (r) {
				if (resourceName === r.resourceName)
					r.callback();
			});
		};

		return {
			'get': function (resourceName) {
				return resources[resourceName];
			},
			'update': function (resourceName, newValue) {
				resources[resourceName] = newValue;
				notifyObservers(resourceName);
			},
			'registerObserverCallback': function (resourceName, callback) {
				observerCallbacks.push({'resourceName': resourceName,
					'callback': callback});
			}
		};
	})
	.directive('scrapee', function ($resource, $localStorage, $resources, $timeout) {
		return {
			restrict: 'E',
			priority: -100,
			scope: {
				id: '@',
				url: '@',
				bindTo: '='
			},
			templateUrl: 'components/html-resource/html-resource.html',
			replace: false,
			link: function (scope, element, attrs) {
				scope.name = attrs.bindTo;

				if ($resources.get(attrs.bindTo) === undefined) {
					refreshData(scope.url);
				}
				else scope.bindTo = $resources.get(attrs.bindTo);
				scope.idAction = function () {
					if (!scope.autorefresh)
						refreshData(scope.url);
					else
						edit = false;
				};
				function refreshData(newValue) {
					return;
					$('#' + attrs.bindTo).html('');
					if (newValue.length < 4)
						return;
					$.getJSON('http://allow-any-origin.appspot.com/' + newValue + '&callback=?', function (data) {
						var content = data.contents.substring(data.contents.indexOf('<body'));
						content = content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
						content = content.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "");
						content = content.replace(/<img[^>]*>/g, '');
						content = content.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "");
						element.html(content);
						//console.log("AFTER:"+$('#' + attrs.bindTo).html());
						scope.bindTo = new Date().toString();
						$resources.update(attrs.bindTo, scope.bindTo);
					});
				}
			}
		};
	})
	;