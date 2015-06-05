angular.module('component.user', ['firebase','ngStorage'])        
        .factory('$user', function ($log, $q, $localStorage, $firebaseAuth, $firebaseObject, $firebaseArray) {
        	var user = this;
            this.$storage = $localStorage;
            
            user.usersRef = new Firebase('https://weo.firebaseio.com');
            user.usersRef.onAuth(authDataCallback);
            var connectedRef = new Firebase('https://weo.firebaseio.com/.info/connected');

            connectedRef.on('value', function (snap) {
                if ((snap.val() === true) && (user.userConnectionsRef !== undefined)) {
                    var con = user.userConnectionsRef.push(true);
                    con.onDisconnect().remove();
                    // con.onDisconnect().set("I disconnected!");
                    user.userLastOnlineRef.onDisconnect().set(Firebase.ServerValue.TIMESTAMP);
                    
                    //var roomConn = user.roomConnectionsRef.push(true);
                    //roomConn.onDisconnect().remove();
                    // con.onDisconnect().set("I disconnected!");
                    //user.roomLastOnlineRef.onDisconnect().set(Firebase.ServerValue.TIMESTAMP);
                }
            });

            user.getUser = function () {
                var deferred = $q.defer();
                this.user = this.$storage.user;
                if (user.user === undefined) {
                    if (user.usersRef === undefined) {
                        alert('Users undefined');
                        return;
                    }
                    $firebaseAuth(user.usersRef).$authWithOAuthPopup('twitter').then(function (authData) {
                        $log.debug('Initiallizing User');
                        deferred.resolve(init(authData));
                    }), function (reason) {
                        $log.debug('Failed $authWithOAuthPopup: ' + reason);
                      deferred.reject(reason);
                    };
                } else {
                    deferred.resolve(user.user);
                }

                return deferred.promise;
            }

            function authDataCallback(authData) {
                if (authData) {
                    $log.debug('User ' + authData.twitter.cachedUserProfile.name + ' is logged in with ' + authData.provider);
                    init(authData);
                } else {
                    $log.debug('User is logged out');
                }
            }

            function init(authData) {
                user.user = {};
                user.user.name = authData.twitter.cachedUserProfile.name;
                user.user.icon = authData.twitter.cachedUserProfile.profile_image_url;

                $log.debug('Logged in as:', user.user);
                var userConnectionString = 'https://uverse-social.firebaseio.com/chat/users/' + user.user.name;
                user.userConnectionsRef = new Firebase(userConnectionString + '/connections');
                user.userLastOnlineRef = new Firebase(userConnectionString + '/lastOnline');
                user.userRef = new Firebase(userConnectionString);

                $firebaseObject(user.userRef).$loaded().then(function (u) {
                    if (u.name === undefined) {firebaseWiki
                        u.name = user.user.name;
                        u.icon = user.user.icon;

                        u.$save().then(function (newuser) {
                            $log.debug('Saved new user: ', newuser);
                            $log.debug(newuser);
                            user.userConnectionsRef = new Firebase(userConnectionString + '/connections');
                            user.userLastOnlineRef = new Firebase(userConnectionString + '/lastOnline');

                            $localStorage.user = user.user;
                        }, function (reason) {
                            $log.debug('Failed save new user: ' + u.name + ' for reason: ' + reason);
                        });
                    } else {
                        $log.debug('Existing user: ', u);
                        user.user = u;
                        $localStorage.user = user.user;
                        user.userConnectionsRef = new Firebase(userConnectionString + '/connections');
                        user.userLastOnlineRef = new Firebase(userConnectionString + '/lastOnline');
                    }
                }), function (reason) {
                    alert('Failed load: ' + reason);
                };
            }
            return this;
        })