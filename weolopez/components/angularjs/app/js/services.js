'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('weolopezApp.services', []).
  value('version', '0.1');

angular.module('weolopezApp.services', [], function($provide ) {
  $provide.factory('localStorage',window.localStorage);	

    /**
    * batchLog service allows for messages to be queued in memory and flushed
    * to the console.log every 50 seconds.
    *
    * @param {*} message Message to be logged.
    */
    function batchLogModule($provide){
    $provide.factory('batchLog', ['$timeout', '$log', function($timeout, $log) {
    var messageQueue = [];
     
    function log() {
    if (messageQueue.length) {
    $log('batchLog messages: ', messageQueue);
    messageQueue = [];
    }
    $timeout(log, 50000);
    }
     
    // start periodic checking
    log();
     
    return function(message) {
    messageQueue.push(message);
    }
    }]);
     
    /**
    * routeTemplateMonitor monitors each $route change and logs the current
    * template via the batchLog service.
    */
    $provide.factory('routeTemplateMonitor',
    ['$route', 'localStorage', '$rootScope',
    function($route, localStorage, $rootScope) {
  //  $rootScope.$on('$routeChangeSuccess', function() {
  //  batchLog($route.current ? $route.current.template : null);
  //  });
    	var user = {
   	   name: "lopez",
       todos: undefined
  	   };
  	   return user;
    }]);
    }
   
     $provide.factory('user', function() {  	
  	var user = {
   	   name: "lopez",
       todos: undefined
  	};
  	return user;
  });
  
});  
    // get the main service to kick of the application
    angular.injector([localStorage]).get('user');


/*

angular.module('weolopezApp.services', []).
  value('user', function($rootScope, localStorage) {
	
  var LOCAL_STORAGE_ID = 'wlUser',
      userString = localStorage[LOCAL_STORAGE_ID];

  var user = userString ? JSON.parse(userString) : {
    name: "weo",
    todos: undefined
  };
alert(JSON.parse(userString));
  $rootScope.$watch(function() { return user; }, function() {
    localStorage[LOCAL_STORAGE_ID] = JSON.stringify(user);
  }, true);

  return user;
});
*/
