angular.module('component.wiki.page', [ ])
.controller('HTMLCtrl', function ($page, $http, $scope, $window) {
	var html = this;
	html.test='TESTTEST';
});     

var queue = angular.module('component.wiki.page')._invokeQueue;
for(var i=0;i<queue.length;i++) {
    var call = queue[i];
    var provider = providers[call[0]];
    if(provider) {
        provider[call[1]].apply(provider, call[2]);
    }
}
$('#html').attr('ng-controller', "HTMLCtrl as html"); 