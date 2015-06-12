angular.module('component.wiki', ['firebase','ngStorage'])        
        .factory('$wiki', function ($log, $q, $localStorage, $firebaseAuth, $firebaseObject, $firebaseArray) {
        	var wiki = this;
            wiki.$storage = $localStorage;
            
            wiki.wikify = function(txt) {
            	txt=txt.replace(/\[\[(.+?)\]\]/g, function (match) {
                            var display = match.substring(2, match.length - 2);
                            var link = display.replace(/ /g, "-");
                            var newtxt = '<a href=\"/index.html#/app/wiki/' + link + '/pageconf/\">' + display + '</a>';
                            return newtxt;
                        }, txt);
            	return txt;
           	};
            
			var observerCallbacks = [];
            var notifyObservers = function () {
				angular.forEach(observerCallbacks, function (callback) {
					callback();
				});
			};

			wiki.registerObserverCallback = function (callback) {
				observerCallbacks.push(callback);
			}
			
			wiki.setStory = function(s) {
				wiki.story = s;
				notifyObservers()
			}
            
		function wikifyString(data) {
                        var newMsg = '';
                        var res = data.split(" ");
                        angular.forEach(res, function (value) {
                            angular.forEach($page.nouns, function (item) {
                                //console.dir(item);
                                if (item === value) {
                                    value = '<a href=\"#/wiki/' + item + '\">' + item + '</a>';
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
                    
            return wiki;
      	})