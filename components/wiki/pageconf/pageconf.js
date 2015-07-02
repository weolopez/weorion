/* 
 */
'use strict';

angular.module('component.wiki.pageconf', [ 
])         
	.controller('PageConfCtrl', function ($page, $app, $location, $ionicSideMenuDelegate) {
        var pageconf = this;
        pageconf.name = $page.name;      
        pageconf.page=$page;
        pageconf.app=$app;
        
        $page.getPages(function(value){
        		pageconf.pages = $page.pages;
        	});
		pageconf.goToPage = function(p) {
			$location.path('/app/wiki/'+p.title+'/pageconf/');
			$location.replace();
	  		$ionicSideMenuDelegate.toggleRight();
		}
	
		pageconf.displayError = function() {			
			alert($page.current.hidden.error);
			$page.current.hidden = {};
			$page.save();
		}	
	});