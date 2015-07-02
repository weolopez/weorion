angular.module('component.user', ['firebase','ngStorage'])                
        .factory('$user', function ($log, $q, $location, $timeout, $firebaseAuth, $firebaseObject, CONST) {
        	var user = this;
            
        	user.editRefString='users';
            user.usersRef = new Firebase(CONST.FB);
            var connectedRef = new Firebase(CONST.FB+'/.info/connected');
              							
			$timeout(function() {
	        	if (user.user === undefined) authUser(setUser);
            }, 5000);
            
            user.usersRef.onAuth(function authDataCallback(authData) {
                if (authData) {
                    setUser(authData);
                } else {
$log.error('Loading for the first time.');
                }
            });     
            connectedRef.on('value', function (snap) {
                if ((snap.val() === true) && (user.userConnectionsRef !== undefined)) {
                    var con = user.userConnectionsRef.push(true);
                    con.onDisconnect().remove();
                    user.userLastOnlineRef.onDisconnect().set(Firebase.ServerValue.TIMESTAMP);
                }
            });
			function authUser(callback) {
				$firebaseAuth(user.usersRef).$authWithOAuthRedirect('facebook').then(function (authData) {
					callback(authData);
	                    }), function (reason) {
	                        $log.debug('Failed $authWithOAuthRedirect: ' + reason);
				  alert(reason.toString());
                    		callback(null);
	                    };
			}
            function setUser(authData) {
         //   	console.dir(authData);
         				var name = authData.facebook.cachedUserProfile.name.replace(/\s+/g, '');
			            user.userConnectionString = CONST.FB+'/users/' + name;
            			user.userRef = new Firebase(user.userConnectionString);
            			user.user = $firebaseObject(user.userRef);
            			
		            	user.user.name = name;
		                user.user.profile = authData.facebook.cachedUserProfile;

			            user.userConnectionsRef = new Firebase(user.userConnectionString + '/connections');
			            user.userLastOnlineRef = new Firebase(user.userConnectionString + '/lastOnline');
			            
			            user.user.$watch(function(){
  							$timeout(function() {
	                        	if (user.user.location === $location.url()) return;
	                        	if (user.synch) $location.url(user.user.location);
                        	}, 1000);
                        },'location');
                        save();
            }
            function save() {
            	user.user.$save();
            }               
            user.setLocation = function(location) {
		        user.user.location = location;
		        save();
            }
            
            user.setProperty = function(key, value) {
            	user.user[key] = value;
            	save();            
            }
            
            user.getProperty = function(key) {
            	return user.user[key];
            }
            
 			user.setEditLocation = function(editRefString) {
                user.editLocationConnectionsRef = new Firebase(CONST.FB+'/'+editRefString+'/'+ user.user.name + '/connections');
                user.editLocationLastOnlineRef = new Firebase(CONST.FB+'/'+editRefString+'/'+ user.user.name + '/lastOnline');
            }
            		
            return this;
        })
        .controller('UserCtrl', function ($log, $stateParams, $state, $scope, $user, $location) {
        	var user = this;			
        	
        /*	$scope.$on( "$stateChangeSuccess", function()
			{ $timeout(function() {s.poll[page.user.user.name]=s.isIn;page.page.save();}, 1000);
            	if ($user.user === undefined) return;
            	     $user.setLocation($location.url());
	   		});  */
        })
        ;