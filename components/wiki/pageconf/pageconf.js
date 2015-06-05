/* 
 */
'use strict';

angular.module('component.wiki.pageconf', [ 
])         
	.controller('PageConfCtrl', function ($page) {
        var pageconf = this;
        pageconf.name = $page.name;        
        $page.ifStoryChanges(function() {
	        pageconf.story = $page.story;
        })        
        pageconf.add = function() {
			var story = {
				text:'',
				type:pageconf.model.id,
				name:$page.current.story.length+1
			};
			$page.add(story);			
		}
        pageconf.delete = function() {
			$page.removeStory();			
		}
	});