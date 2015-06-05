/* 
 */
'use strict';

angular.module('component.application.settings', [ 
])         
	.controller('SettingsCtrl', function ($window) {
        var settings = this;
        
        settings.edit = function() {
			    $window.open('https://orionhub.org/edit/edit.html#/file/weolopez-OrionContent/weorion/index.html');	
		}
	});