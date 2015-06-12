/* 
 */
'use strict';

angular.module('component.firebase', [ 
])         
		.factory('$firebase', function () {
	})
	.directive('firebase', function () {
		return {
			restrict: 'E',
		    transclude: true,
			scope: {
				path: '@',
				bindTo: '='
			},
			template: '<div ng-transclude></div>',
			replace: false,
			controller: function($scope) {
				var firebase = this;
				firebase.path = $scope.path;
				firebase.bindTo = $scope.bindTo;
			},
			controllerAs: 'firebase',
			link: function (scope, element, attrs, ctrl, transclude) {
				transclude(scope, function(clone, scope) {
			        element.append(clone);
			      });
			}
		};
	})
	;