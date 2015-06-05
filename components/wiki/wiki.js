angular.module('component.wiki', ['firebase','ngStorage'])        
        .factory('$wiki', function ($log, $q, $localStorage, $firebaseAuth, $firebaseObject, $firebaseArray) {
        	var wiki = this;
            wiki.$storage = $localStorage;
            
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
            
            return wiki;
      	})