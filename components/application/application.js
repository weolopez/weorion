angular.module('component.application', ['firebase','ngStorage', 'component.user'])        
        .factory('CONST', function() {
            this.FB='https://weo.firebaseio.com';
        	return this;
        })
        .factory('$app', function ($log, $localStorage, $user) {
        	var app = this;
            this.$storage = $localStorage;
            
            app.copy = function(jsonContent) {
            	$user.setProperty('copy', jsonContent);
            }
            
			app.paste = function() {
				if ($user.user === undefined) return undefined;
				if ($user.user.copy !== undefined) return $user.user.copy;
				else return undefined;
			}
            
            return app;
        })
        .controller('AppCtrl', function ($log,$app, $page, $ionicNavBarDelegate, $window, $user) {        	
            var app = this;
            app.page=$page;
            
            $app.navBar = $ionicNavBarDelegate;
            
            /*
            $page.ifPageChanges(function() {
		        app.name = $page.name;
				$app.navBar.title(app.name);
	        })
	        $page.ifStoryChanges(function(){
				app.story = $page.story;        	
	        })
        */
        });