angular.module('component.wiki.page', [ ])
.controller('TodoItemCtrl', function ($page, $http, $scope, $window) {
	var todo = this;
	todo.test='TESTTEST';
});     

var queue = angular.module('component.wiki.page')._invokeQueue;
for(var i=0;i<queue.length;i++) {
    var call = queue[i];
    var provider = providers[call[0]];
    if(provider) {
        provider[call[1]].apply(provider, call[2]);
    }
}

$('#firebase').attr('ng-controller', "TodoItemCtrl as todo"); 