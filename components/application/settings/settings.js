/* 
 */
'use strict';

angular.module('component.application.settings', [ 
])         
	.controller('SettingsCtrl', function ($window, $user) {
        var settings = this;
        settings.user=$user;
        settings.edit = function() {
			    $window.open('https://orionhub.org/edit/edit.html#/file/weolopez-OrionContent/weorion/index.html');	
		}
	});