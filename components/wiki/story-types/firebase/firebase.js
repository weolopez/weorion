angular.module('component.wiki.page', [ ])
.controller('TodoItemCtrl', function ($page, $http, $scope, $window) {
	var todo = this;
	todo.test='TESTTEST';
	todo.change = function() {
		$page.save();
	};
	todo.canExpand = function(s) {
		return (($page.currentStory===s) && (!s.complete) );
	}
	$scope.$watch(todo.url, function(value, old) {
	//	console.log(value, old);
	//	if (todo.url === undefined) return;
	var s = $page.currentStory;
	console.log('todo.s.url:'+s.url);
		var url = 'http://allow-any-origin.appspot.com/'+s.url;
		$http.get(url).
		  success(function(data, status, headers, config) {
		//    console.log(data,status, headers, config);
		  	data = $(data).find(s.selector);
		//    console.dir(data.length);
		    if (data.length === 0) {
		    	alert('not found');
		    	$window.open(s.url, '_blank');
		    	return;
		    }
		   // var html = data;
		//    console.log('63: '+data);
		//    
		//    if (data === undefined) return;
		    var jsondata=html2json(data.html());
		//    console.log('68: '+data);
		//    console.dir($page.currentStory);
		    $page.currentStory.json=jsondata;
		    $page.currentStory.html=data.html();
		    $page.save();
		    todo.data = $page.currentStory.html;
		 //   console.log(todo.data);
		  })
	})
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