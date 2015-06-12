angular.module('component.user', ['firebase','ngStorage'])        
        .factory('$user', function ($log, $q, $location, $timeout, $firebaseAuth, $localStorage, $firebaseObject, $firebaseArray, CONST) {
        	var user = this;
        	user.editRefString='users';
            //user.$storage = $localStorage;
            if ($localStorage.user === undefined) $localStorage.user={};
            user.name = $localStorage.user.name;
            user.icon = $localStorage.user.icon;
            
            user.userConnectionString = '';
            user.usersRef = new Firebase(CONST.FB);
            var connectedRef = new Firebase(CONST.FB+'/.info/connected');
            
                   

            connectedRef.on('value', function (snap) {
                if ((snap.val() === true) && (user.userConnectionsRef !== undefined)) {
                    var con = user.userConnectionsRef.push(true);
                    con.onDisconnect().remove();
                    //con.onDisconnect().set("I disconnected!");
                    user.userLastOnlineRef.onDisconnect().set(Firebase.ServerValue.TIMESTAMP);
                   // user.setEditLocation(user.editRefString);
                  //  var editLocationConn = user.editLocationConnectionsRef.push(true);
    				//editLocationConn.onDisconnect().remove();
                    //con.onDisconnect().set("I disconnected!");
                  //  user.editLocationLastOnlineRef.onDisconnect().set(Firebase.ServerValue.TIMESTAMP);
                }
            });
 
            user.getUser = function () {
                var deferred = $q.defer();
                
                if (user.user === undefined) {
                    if (user.usersRef === undefined) {
                        alert('Users undefined');
                        return;
                    }
                    if (user.name === undefined) {
                    alert('calling firebaseAuth');
	                    $firebaseAuth(user.usersRef).$authWithOAuthRedirect('twitter').then(function (authData) {
	                        $log.debug('Initiallizing User');
                    alert('Initiallizing User');
			            	user.name = authData.twitter.cachedUserProfile.name;
			                user.icon = authData.twitter.cachedUserProfile.profile_image_url;
	                        $localStorage.user.name=user.name;
		            		$localStorage.user.icon=user.icon;
	                        deferred.resolve(init());
	                    }), function (reason) {
	                        $log.debug('Failed $authWithOAuthPopup: ' + reason);
	                        
                    alert('Failed $authWithOAuthPopup');
                    		deferred.reject(reason);
	                    };
                    }
                    else {
	              		deferred.resolve(init());
                    }
                } else {
                    deferred.resolve(user.user);
                }

                return deferred.promise;
            }

            
 			user.setEditLocation = function(editRefString) {
                user.editLocationConnectionsRef = new Firebase(CONST.FB+'/'+editRefString+'/'+ user.name + '/connections');
                user.editLocationLastOnlineRef = new Firebase(CONST.FB+'/'+editRefString+'/'+ user.name + '/lastOnline');
            }
            
            function init() {
                //$log.debug('Logged in as:', user.user);
                user.userConnectionString = CONST.FB+'/users/' + user.name;
                user.userConnectionsRef = new Firebase(user.userConnectionString + '/connections');
                user.userLastOnlineRef = new Firebase(user.userConnectionString + '/lastOnline');
                user.userRef = new Firebase(user.userConnectionString);

                $firebaseObject(user.userRef).$loaded().then(function (u) {
                    if (u.name === undefined) {

                        u.name = user.name;
                        u.icon = user.icon

                        u.$save().then(function (newuser) {
                            $log.debug('Saved new user: ', newuser);
                            $log.debug(newuser);
                            user.userConnectionsRef = new Firebase(user.userConnectionString + '/connections');
                            user.userLastOnlineRef = new Firebase(user.userConnectionString + '/lastOnline');			               
							user.user = newuser;
							
                            $localStorage.user = user.user;
                        }, function (reason) {
                            $log.debug('Failed save new user: ' + u.name + ' for reason: ' + reason);
                        });
                    } else {
                        //$log.debug('Existing user: ', u);
                        u.name = user.name;
                        u.icon = user.icon
                        user.user = u;
                        $localStorage.user = user.user;
                        user.userConnectionsRef = new Firebase(user.userConnectionString + '/connections');
                        user.userLastOnlineRef = new Firebase(user.userConnectionString + '/lastOnline');
                        user.user.$watch(function(){
  							$timeout(function() {
	                        	if (user.user.location === $location.url()) return;
	                        	if (user.synch) $location.url(user.user.location);
                        	}, 1000);
                        },'location');
                    }
                }), function (reason) {
                    alert('Failed load: ' + reason);
                };
            }      
            
            user.setLocation = function(location) {
		        user.user.location = location;
		        user.user.$save();
            }
            
            user.usersRef.onAuth(function authDataCallback(authData) {
                if (authData) {
                    //alert('Initiallizing User');
                    if (user.name === undefined) {
                    	$log.debug('User ' + authData.twitter.cachedUserProfile.name + ' is logged in with ' + authData.provider);                                        
		            	user.name = authData.twitter.cachedUserProfile.name;
		                user.icon = authData.twitter.cachedUserProfile.profile_image_url;
		                $localStorage.user.name=user.name;
	            		$localStorage.user.icon=user.icon;
	            	}
                    init();
                } else {
                    $log.debug('User is logged out');
                    alert('User is logged out');
                    user.getUser();
                }
            });     
            
            user.setProperty = function(key, value) {
            	user.user[key] = value;
            	user.user.$save();
            }
            
            user.getProperty = function(key) {
            	return user.user[key];
            }
            
            return this;
        })
        .controller('UserCtrl', function ($log, $stateParams, $state, $scope, $user, $location) {
        	var user = this;			
        	
        /*	$scope.$on( "$stateChangeSuccess", function()
			{ 
            	if ($user.user === undefined) return;
            	     $user.setLocation($location.url());
	   		});  */
        })
        ;