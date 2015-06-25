/* 
 */
'use strict';

angular.module('component.wiki.story', [
]) 
	.controller('StoryCtrl', function ($app, $log, $ionicModal, $ionicSideMenuDelegate, $scope, $page, $ionicActionSheet) {
        var story = this;        
        story.page = $page;
        story.app = $app;
        $page.storyCtrl = story;
        story.currentStory = {};
        
        story.getKeys = function() {
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
		function swap(array, from, to) {
			if ((to === -1) || (to>array.length))return;
			var temp=array[from];
			array[from]=array[to];
			array[to]=temp;
			return array;
		}
		story.move = function(to) {
			var from = story.page.storyIndex;
			to=story.page.storyIndex+to;
			$page.current.story=swap($page.current.story, from, to);
			$page.currentStory = undefined;
			$page.storyIndex = -1;
		    $page.save();
		};	
        story.add = function(s) {
        	if (s===undefined) {
				var story = {
					text:'',
					type:story.model.id,
					name:'Index'+($page.current.story.length+1)
				};
        	} else var story = s;
			$page.add(story);			
		}			 
		story.open = function() {
				var titleText='Edit Properties';
				var lButtons=[
			       { text: '<b>Add</b> ',
			         action: function() {
			         	alert('Add Property');
			         }
			       }
				]
				var destructText='Delete';
			   var hideSheet = $ionicActionSheet.show({
			     buttons: lButtons,
			     destructiveText: destructText,
			     titleText: titleText,
			     cancelText: 'Cancel',
			     cancel: function() {
			          // add cancel code..
			     },
			     buttonClicked: function(index, button) {
			       if (button.action !== undefined) button.action();
			       return true;
			     },
			     destructiveButtonClicked: function() {
			         	alert('Delete Property');
			       return true;
			     }
			   });         
			}
	});