angular.module('component.application', ['firebase','ngStorage', 'component.user'])        
        .factory('$app', function ($log, $localStorage) {
        	var app = this;
            this.$storage = $localStorage;
            return this;
        })
        .controller('AppCtrl', function ($log,$app, $page, $ionicNavBarDelegate, $window, $user) {        	
            var app = this;
            $app.navBar = $ionicNavBarDelegate;
            
            $page.registerObserverCallback(function() {
		        app.name = $page.name;
	        })
	        $page.ifStoryChanges(function(){
				app.story = $page.story;        	
	        })
        
			var user = $user.getUser().then( function(result) {
				//User Loaded
			});
        });