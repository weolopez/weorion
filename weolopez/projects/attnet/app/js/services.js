'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
var weolopezModules = angular.module('weolopezApp.services', []);
weolopezModules.value('version', '0.1');
weolopezModules.value('localStorage', window.localStorage);

weolopezModules.factory('userProfile', function($rootScope,localStorage) { 
	
  var LOCAL_STORAGE_ID = 'wlUser',
      userString = localStorage[LOCAL_STORAGE_ID];

  var user = userString ? JSON.parse(userString) : {
    name: undefined,
    component: undefined
  };

  $rootScope.$watch(function() { return user; }, function() {
    localStorage[LOCAL_STORAGE_ID] = JSON.stringify(user);
  }, true);

	return user;
});

weolopezModules.factory('componentList', function($http) {
  var componentArray = [];
  var internallURL = 'http://home.orionhub.org:8080/weolopez/components/';
    $http.get(internallURL).success(function (data) {
                var loadedData = $(data);
            	var compList = loadedData.find('a'); 
                compList.each(function( index ) {
                	var txt = $(this).text();
                	txt = txt.substring(0,txt.length-1)
					componentArray.push({text: txt, done:false});
				}).error(function(data, status) {
				    $scope.data = data || "Request failed";
				    $scope.status = status;
			    });
    });
    return componentArray;
});