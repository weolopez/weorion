/* 
 */
'use strict';

angular.module('component.html', [ 
])         
	.directive('wikihtml', function ($compile, $sce, $timeout ) {
		return {
			link: function (scope, element, attrs) {
				scope.$watch(function(v){
					if (v.$parent.s === undefined)
						return v.$parent.s;
					else
						return v.$parent.s.text;
				}, function(n,v){
					if (scope.s === undefined) return;
					element.empty();
					
					var delay = 0;
					if (scope.s.delay !== undefined) delay = Number(scope.s.delay);
							
					$timeout(function() {
						element.append($compile(scope.s.text)(scope));	
					}, delay);
				})	
			}
		};
	});