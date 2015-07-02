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
	.config(function($provide) {
        	$provide.decorator('$exceptionHandler',
        	['$delegate', '$window',
        	    function($delegate, $window) {
        	    	return function(exception, cause) {
					   //; exception.message += '\n\n!!!ERROR Let WEO Know!!!!!!\n\n';
					    $delegate(exception, cause);
					    var newerror = exception.message;
					    $window.pageerror = exception.message;
					    //alert(exception.message);
					  };
        	    }]);
        })
	.factory('$page', function ($log, $firebaseAuth, $firebaseObject, $firebaseArray, CONST, $window, $user) {
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
				page.current = undefined;
				page.getPage(state.params.name, function(p) {					
				//	console.dir(p);
					if (p.title===undefined) p.title=state.params.name;
					
					if (state.params.storyName !== '' ) {
						angular.forEach(p.story, function(story, index) {
							if (state.params.storyName === story.name) {
								if (state.params.set !== undefined) {
									for (var i = 0; i < state.params.set.length; i++) {
										var parameter = state.params.set;
										if (state.params.set instanceof Array) parameter = 	state.params.set[i];
										
										if (state.params.set.length > 0) {
											var name = parameter.substring(0,parameter.indexOf(':'));
											var value = parameter.substring(parameter.indexOf(':')+1);
										//	$log.debug(name,value);
											p.story[index][name]  = ('true' === value);
											page.save(function() {
												
											});
											
										}
									}
								}
								
								page.storyIndex = index;
								page.currentStory = p.story[index];
								
					/*			if ($state.params.edit === 'true') $page.ifPageChanges( function() {
									story.openModal($page.storyIndex);
								});*/
							}
						})
					} else {
						page.storyIndex = -1;
						page.currentStory = undefined;
					}
					
			//		console.dir(p);
					page.current=p;
			//		page.save();
			//		notifyStoryObservers();
					notifyObservers();
				})
			}
            page.add = function(s) {
	        	if (s===undefined) return;
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
			page.save = function( ) {
				if (page.current === undefined) return;
				page.current.story[page.storyIndex] = page.currentStory;
				
				if ($window.pageerror !== undefined) {
					if (page.current.hidden === undefined) page.current.hidden = { error : [$window.pageerror]};
					else page.current.hidden.error.push($window.pageerror);
					$window.pageerror = undefined;
				}
				
				page.current.lastEditBy = $user.user.name;
				
				page.current.$save().then(function(value){
				//	callback();
					notifyStoryObservers();
					notifyObservers();
				}, function(error) {
				  alert(error.toString());
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
        page.user = $user;
		
		$scope.$on( "$stateChangeSuccess", function()
		{ 
			var storyName = ' / '+$state.params.storyName;
			if ($state.params.storyName === '') storyName = '';
			$app.navBar.title($state.params.name+storyName);
			
			$page.updatePage($state);
            if ($user.user === undefined) return;
            $user.setLocation($location.url());
	    });  
		page.getTemplate = function(s) {
			if ( (s === undefined) ||  (s.type === undefined) ) {
		//		$log.debug("Story not found:",  $page.currentStory, 'VS', s);
				return;
			}
			
			return 'components/wiki/story-types/'+s.type+'.html';
		}
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

		page.deliberatelyTrustDangerousSnippet = function(s) {
			if ((s === undefined)||(s===null)) return;
			
			var txt = s;
			$scope.s = s;
			if (typeof s !== "string") {
				txt = s.text;
			}
			txt = $wiki.wikify(txt);      
			txt=$scope.$eval($interpolate(txt));
            return $sce.trustAsHtml(txt);
        };
        page.append = function(text, element) {
        	element.append(text);
        }
        page.wikify = function(s) {
        	var txt = s.text;
        	return $wiki.wikify(txt);
        }
        page.getStories = function(s) {
        	$page.getPage(s.page, function(p) {
        		page.t=p.story;
        	});
        }
        page.init = 'testscope';
	});