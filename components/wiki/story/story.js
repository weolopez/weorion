/* 
 */
'use strict';

angular.module('component.wiki.story', [
]) 
	.controller('StoryCtrl', function ($app, $log, $ionicModal, $ionicSideMenuDelegate, $scope, $page) {
        var story = this;        
        story.page = $page;
        story.app = $app;
        $page.storyCtrl = story;
        story.currentStory = {};
        
        story.page.ifStoryChanges(function(){
      //  	if (story.page.currentStory === undefined) return story.currentStory = {};
        })
        
        story.getKeys = function() {
        	//$log.debug(story.page.currentStory);
        	if (story.page.currentStory===undefined)return;
        	return Object.keys(story.page.currentStory);
        }   
	  	story.isSaved = function() {
	  		return false;
	  	}
	  	story.openModal = function(key) {
	  		$ionicSideMenuDelegate.toggleRight();
	  		$ionicModal.fromTemplateUrl('components/wiki/story/edit-story.html', {
		  		id: '1',	
		  		backdropClickToClose: false,
		    	scope: $scope,
				animation: 'slide-in-up'
			}).then(function(modal) {
			    story.modal = modal;
				story.modal.scope.key = key;  
		    	story.modal.show();
			  });
	  	};
		story.closeModal = function(u) {       
		    $page.save();
		    story.modal.hide();
		};	
	});