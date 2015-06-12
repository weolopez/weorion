/* 
 */
'use strict';

angular.module('resource-cache', [
	'ngStorage',
	'ngResource'
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
	.directive('resourceCache', function ($resource, $localStorage, $resources, $timeout) {
		return {
			restrict: 'E',
			priority: -100,
			scope: {
				id: '@',
				url: '@',
				htmltemplate: '@',
				autorefresh: '@',
				ishtml: '@',
				bindTo: '='
			},
			templateUrl: 'components/resource-cache/resource-template.html',
			replace: false,
			link: function (scope, element, attrs) {
				scope.hasInit = true;
				scope.edit = true;
				scope.name = attrs.bindTo;

				scope.$watch('url', function (newValue) {
					console.log('newValue=', newValue);
					scope.url = newValue;
				});
				if ($resources.get(attrs.bindTo) === undefined) {
					refreshData(scope.url);
				}
				else
					scope.bindTo = $resources.get(attrs.bindTo);
				if (!scope.autorefresh) {
					scope.autorefresh = false;
				}
				if (!scope.ishtml) {
					scope.ishtml = false;
				}
				if (!scope.htmltemplate) {
					scope.htmltemplate = '';
				}
				scope.idAction = function () {
					if (!scope.autorefresh)
						refreshData(scope.url);
					else
						edit = false;
				};
				function refreshData(newValue) {
					$('#' + attrs.bindTo).html('');
					if (newValue.length < 4)
						return;
					if (scope.ishtml==='true') {
					console.log("scope.ishtml:" + scope.ishtml);
						$.getJSON('http://anyorigin.com/dev/get?url=' + newValue + '&callback=?', function (data) {
							var content = data.contents.substring(data.contents.indexOf('<body'));
							content = content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
							content = content.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "");
							content = content.replace(/<img[^>]*>/g, '');
							content = content.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "");
							$('#' + attrs.bindTo).html(content);
							console.log("AFTER:"+$('#' + attrs.bindTo).html());
							scope.bindTo = new Date().toString();
							$resources.update(attrs.bindTo, scope.bindTo);

						});
					}
					else {
						scope.bindTo = $resource(newValue).get();
						$resources.update(attrs.bindTo, scope.bindTo);
					}
				}
				;
			}
		};
	})
	.directive('weoBind', function ($resource, $resources) {
		return {
			restrict: 'E',
			priority: -100,
			scope: {
				selector: '@',
				from: '=',
				to: '='
			},
			link: function (scope, element, attrs) {
				if (scope.$parent.bindings === undefined)
					scope.$parent.bindings = [];
				scope.$parent.bindings.push(attrs.to);

				scope.to = $resources.get(attrs.to);
				$resources.registerObserverCallback(attrs.from, function () {
					scope.processSelector();
				});

				scope.$watch('selector', function (newValue) {
					scope.processSelector(newValue);
				});

				scope.processSelector = function () {
					var sel = scope.selector;
					if (sel.length < 4)
						return;
					var timer = setInterval(function () {
						if ($(sel).length) {
							var selectedHTML = $(sel).html();

							$('#' + attrs.to + 'sel').html(selectedHTML);
							//var temp = JsonML.fromHTML(selectedHTML);

							var timer2 = setInterval(function () {
								//console.log($('#'+attrs.to+'sel').html());
								//console.log('beforescope.to:' + scope.to);
								scope.to = JsonML.fromHTML($('#' + attrs.to + 'sel').get(0));
								scope.$apply();
								//console.log('afterscope.to:' + scope.to);
								$resources.update(attrs.to, scope.to);

								clearInterval(timer2);
							}, 200);
							clearInterval(timer);
						}
					}, 200);
				};
			}
		};

	})
	.directive('preview', function ($compile) {
		return {
			restrict: 'E',
			priority: -100,
			scope: {
				template: '='
			},
			link: function (scope, element, attrs) {
				scope.$watch('template', function (newValue) {
					var htmlstring;
					try {
						htmlstring = $compile(newValue)(scope.$parent);
					}
					catch (err) {
						console.log('Template Does Not Exists: ' + err.message);
						return;
					}
					$('preview').html(htmlstring);
				});
			}
		};
	})
	.directive('string2json', function () {
		return {
			restrict: 'E',
			priority: -100,
			scope: {
				string: '@',
				bindTo: '='
			},
			link: function (scope) {
				var res = '{"' + scope.string.replace(/([:])+/g, '":"').replace(/([,])+/g, '","').replace(/([ ])+/g, '') + '"}';
				scope.bindTo = JSON.parse(res);
			}
		};
	});