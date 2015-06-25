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
		  //  transclude: true,
			scope: {
		//		path: '@',
		//		bindTo: '='
			},
			template: '<div>XXXXX</div>',
//			replace: false,
			controller: function($scope) {
				alert("test");
				var firebase = this;
				firebase.path = $scope.path;
				firebase.bindTo = $scope.bindTo;
				firebase.test= 'scope.bindTo';
				console.log('weotest');
			},
			controllerAs: 'firebase',
			link: function (scope, element, attrs, ctrl, transclude) {
				transclude(scope, function(clone, scope) {
				console.log('weotest');
			        element.append(clone);
			      });
			}
		};
	})
	;