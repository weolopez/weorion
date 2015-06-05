/* 
 */
'use strict';

angular.module('component.wiki.story', [
]) 
	.controller('StoryCtrl', function ($app, $page, $ionicModal, $scope) {
        var story = this;
        story.app = $app;
        story.current = {name:'undefined'}
        story.title = $app.name;
        story.current = $page.story;
        
        $page.ifStoryChanges(function() {
	        story.current = $page.story;
        })
        
        story.getKeys = function() {
        	return Object.keys(story.current);
        } 
        
		$ionicModal.fromTemplateUrl('components/wiki/story/edit-story.html', {
		    scope: $scope,
		    animation: 'slide-in-up'
	  	}).then(function(modal) {
		    story.modal = modal;		   
	  	});
	  	
	  	story.openModal = function(key) {
	    	story.modal.scope.key = key;
	    	story.modal.show();
	  	};
	  	story.closeModal = function() {
	    	story.modal.hide();	    
	  	};
		  	//Cleanup the modal when we're done with it!
		  	$scope.$on('$destroy', function() {
		    	story.modal.remove();
		  	});
		  	// Execute action on hide modal
		  	$scope.$on('modal.hidden', function() {
		    	// Execute action
		    	$page.save();
		  	});
		  	// Execute action on remove modal
		  	$scope.$on('modal.removed', function() {
		    	// Execute action
		  	});
	});