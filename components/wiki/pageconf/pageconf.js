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
	
        pageconf.add = function(s) {
        	if (s===undefined) {
				var story = {
					text:'',
					type:pageconf.model.id,
					name:$page.current.story.length+1
				};
        	} else var story = s;
			$page.add(story);			
		}
        pageconf.delete = function() {
			$page.removeStory();			
		}
	});