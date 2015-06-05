/* 
 */
'use strict';

angular.module('component.wiki.page', [ 'contenteditable', 'dndLists', 'ngSanitize'
])         
	.factory('$page', function ($log, $firebaseAuth, $firebaseObject, $firebaseArray) {
        	var page = this;
            
			var observerCallbacks = [];
            var notifyObservers = function () {
				angular.forEach(observerCallbacks, function (callback) {
					callback();
				});
			};

			page.registerObserverCallback = function (callback) {
				observerCallbacks.push(callback);
			}
			
			page.setPageName = function(p) {
				page.name = p;
				var pageRef = new Firebase("https://weo.firebaseio.com/wiki/pages/"+page.name);
        		$firebaseObject(pageRef).$loaded(function(value) {
					page.dataExists = value.$value !== null;
					page.current = value;
					if (page.dataExists === false) {
					    page.current.title = page.name;			
						page.current.story = [];
					} else {
					} 			
					notifyObservers()
				});
			}
			
			page.save = function() {
				page.current.$save();
			}
            page.add = function(s) {
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
			
			page.setStory = function(index, story) {
				page.storyIndex = index;
				page.story = story;
	        	if ( (page.story !== undefined) && (page.story.name === undefined) ) page.story.name = 'undefined';
				notifyStoryObservers();
			}
			page.removeStory = function() {				
				page.current.story.splice(page.storyIndex, 1);
				page.save();
				page.story = undefined;
				page.storyIndex = -1;
				notifyStoryObservers();
			}
            return page;
    })
	.controller('PageCtrl', function ($stateParams, $app, $page, $compile, $sanitize) {
        var page = this;
        page.name = $stateParams.name;		
		$app.name = page.name;		
		$app.navBar.title($app.name);
		$page.registerObserverCallback(function() {
			page.page = $page.current;
		});
		$page.setPageName(page.name);
		
        var storyLength=0;
        
        $page.ifStoryChanges(function(){
			page.story = $page.story;        	
        })
        
		page.componentClicked = function(index, story){
			if (index === $page.storyIndex) $page.setStory(-1,undefined);
			else $page.setStory(index, story);
		} 
		page.moved = function($index,s) {
			if (storyLength !== page.page.story.length-1) return;
			page.page.story.splice($index, 1);
			page.page.$save();
		}
		page.save = function(s,text) {
			if (text === undefined) return;
			text = angular.element('<textarea />').html(text).text();
			text = $sanitize(text);
		//	page.story[$index].text = text;
			page.page.$save();
		}
		page.getTemplate = function(s) {
			return 'components/wiki/story-types/'+s.type+'.html';
		}
		
		function wikifyString(data) {
                        var newMsg = '';
                        var res = data.split(" ");
                        angular.forEach(res, function (value) {
                            angular.forEach($page.nouns, function (item) {
                                //console.dir(item);
                                if (item === value) {
                                    value = '<a href="#/wiki/' + item + '">' + item + '</a>';
                                    return false;
                                }
                            });
                            newMsg += value + " ";
                        });
                        return newMsg;
                    }
		function updateHTML() {
                        $timeout(function () {
                            var value = $element.html();
                            value = wikifyString(value);
                        });
                    }
		function parseStory(story) {
                        if (story.type === 'paragraph') {
                            var txt = replaceLink(story.text)
                            return "<p>" + txt + "</p>";
                        }
                        if (story.type === 'html') {
                            var txt = replaceLink(story.text)
                            return txt + "</h3>";
                        }
                        if (story.type === 'pagefold') {
                            return "<hr>";
                        }
                        else {
                            $log.error("Story Type Not Found: "+ story.type);
                            return story.type + "<br>" + story.text + "<hr>";
                        }
                    }
		function replaceLink(txt) {
			txt='xxxx'
                        var txt = txt.replace(/\[\[(.+?)\]\]/g, function (match) {
                            var display = match.substring(2, match.length - 2);
                            var link = display.replace(/ /g, "-");
                            var newtxt = "<a ng-click=\"page.openFedWiki(\'" + link + "\')\">" + display + "</a>";
                            return newtxt;
                        }, txt);
                        return txt;
                    }
	});