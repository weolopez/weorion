/* 
 */
'use strict';
// Make module Foo and store providers for later use
var providers = {};
angular.module('component.wiki.page', [ 'ngSanitize'
], function($controllerProvider, $compileProvider, $provide) {
    providers = {
        $controllerProvider: $controllerProvider,
        $compileProvider: $compileProvider,
        $provide: $provide
    };
})        
	.factory('$page', function ($log, $firebaseAuth, $firebaseObject, $firebaseArray, CONST) {
        	var page = this;
            
			var observerCallbacks = [];
            var notifyObservers = function () {
				angular.forEach(observerCallbacks, function (callback) {
					callback();
				});
			};

			page.ifPageChanges = function (callback) {
				observerCallbacks.push(callback);
			}
			
			page.getPages = function(callback) {
				if (page.pages === undefined) {
					return $firebaseArray(new Firebase(CONST.FB+'/wiki/pages')).$loaded(function(value) {
						page.pages = value;
						callback();
					})
				} else callback();
			}
			page.updatePage = function(state) {
				page.getPage(state.params.name, function(p) {
					page.current=p;
					
					if (state.params.storyName !== '' ) {
						angular.forEach(page.current.story, function(story, index) {
							if (state.params.storyName === story.name) {
								page.storyIndex = index;
								page.currentStory = page.current.story[index];
								
					/*			if ($state.params.edit === 'true') $page.ifPageChanges( function() {
									story.openModal($page.storyIndex);
								});*/
							}
						})
					} else {
						page.storyIndex = -1;
						page.currentStory = undefined;
					}
					
			//		notifyStoryObservers();
			//		notifyObservers;
				})
			}
			
            page.add = function(s) {
            	if (page.current.story === undefined) page.current.story = [];
				page.current.story.push(s);
				page.save();
			}
			
			var storyChangeCallbacks = [];
            var notifyStoryObservers = function () {				
				angular.forEach(storyChangeCallbacks, function (callback) {	
					callback();
				});
			};

			page.ifStoryChanges = function (callback) {
				storyChangeCallbacks.push(callback);
			}
			page.save = function() {
				page.current.story[page.storyIndex] = page.currentStory;
				page.current.$save().then(function(value){
					notifyStoryObservers();
					notifyObservers();
				});
			}
			page.removeStory = function() {				
				page.current.story.splice(page.storyIndex, 1);
				page.currentStory = undefined;
				page.storyIndex = -1;
				page.save();
			}
	        page.getPage = function(pageName, callback) {
	        	var pageRef = new Firebase(CONST.FB+'/wiki/pages/'+pageName);
        		$firebaseObject(pageRef).$loaded(function(value) {
        			callback(value);
				})
	        }        
            return page;
    })
	.controller('PageCtrl', function ($log, $stateParams, $state, $location, $app, 
			$page, $scope, $interpolate, $sce, $wiki, $user, $ionicPopup) {
        var page = this;	
        page.page = $page;        
		
		$scope.$on( "$stateChangeSuccess", function()
		{ 
			var storyName = ' / '+$state.params.storyName;
			if ($state.params.storyName === '') storyName = '';
			$app.navBar.title($state.params.name+storyName);
			
			$page.updatePage($state);
            if ($user.user === undefined) return;
            $user.setLocation($location.url());
	    });  
		
		page.componentClicked = function(index){
			if (index === $page.storyIndex) {
					index = -1;
					$page.currentStory = undefined;
					$state.go('app.wiki.pageconf', { 'storyName': ''});
				}
				else {
					$state.go('app.wiki.story', { 'storyName': $page.current.story[index].name});
				}
				
		//	$page.setStory(index);
		} 
		page.isSelected = function(index) {
			return ($page.storyIndex === index); 
		}
		page.getTemplate = function(s) {
			if (s === undefined) {
				$log.error("Story not found:",  $page.currentStory);
				return;
			}
			return 'components/wiki/story-types/'+s.type+'.html';
		}
		page.deliberatelyTrustDangerousSnippet = function(s) {
			var txt = s.text;
			$scope.s = s;
			txt = $wiki.wikify(txt)
			txt=$scope.$eval($interpolate(txt));
			//console.log("SECOND"+txt);
               return $sce.trustAsHtml(txt);
             };
        page.wikify = function(s) {
        	var txt = s.text;
        	return $wiki.wikify(txt);
        }
        page.getStories = function(s) {
        	$page.getPage(s.page, function(p) {
        		page.t=p.story;
        	});
        }
        
	});