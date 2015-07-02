/* 
 */
'use strict';

angular.module('component.firebase', [ 
])         
	.factory('$firebase', function () {
	})
	.directive('firebase', function ($page) {
		return {
			restrict: 'E',
			scope: {
				page: '@',
				story: '@',
				bindto: '='
			},
			controller: function($scope, $page) {
				var firebase = this;
				$page.getPage(firebase.page, function(p) {
					if (firebase.story === undefined) firebase.bindto = p.story;
					else firebase.bindto = p.story[firebase.story].jsondata;
				});
			},
			controllerAs: 'firebase', 
            bindToController: true
		};
	})
	;