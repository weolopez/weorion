'use strict';

/* Controllers */

function enterCtrl($scope, localStorage) {
//alert("user.name"+user);
  $scope.userName = "user.name";
}
MyCtrl1.$inject = [];

function MyCtrl1() {
}
MyCtrl1.$inject = [];

weolopezApp.controller('UserController',
    function UserController($scope, user) {

  $scope.userName = user.name;
  $scope.userTodos = user.todos;

});



function todoCtrl($scope, $http,user) {
	/*var internallURL = 'https://api.mongolab.com/api/1/databases/weolopez/collections/post?apiKey=50f36e05e4b0b9deb24829a0';
   	
 
 	$http.get(internallURL).success(function(data) {
    	$scope.todos=data;
    });
 	var tempT=user.todos;
 	alert(JSON.stringify(tempT));
 */
  $scope.userName="weo";
  $scope.todos = [
	{text:'learn angular', done:true},
	{text:'build an angular app', done:false}];
 
	$scope.addTodo = function() {
		$scope.todos.push({text:$scope.todoText, done:false});
		$scope.todoText = '';
	};
 
	$scope.remaining = function() {
		var count = 0;
		angular.forEach($scope.todos, function(todo) {
			count += todo.done ? 0 : 1;
		});
		return count;
	};
 
	$scope.archive = function() {
		var oldTodos = $scope.todos;
		$scope.todos = [];
		angular.forEach(oldTodos, function(todo) {
			if (!todo.done) $scope.todos.push(todo);
		});
	};
	
	/*$scope.save = function() {
		user.name = $scope.userName;
		
		$http.put(internallURL, $scope.todos, function(data, status){
            if(status == "success"){
                alert( "Data Saved: " + data.message );
           }
        });
	};
	*/
}
//MyCtrl2.$inject = [];
