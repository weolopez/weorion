'use strict';

/* Controllers */
//regular controllers
	
function enterCtrl($scope,userProfile) {
   $scope.userName=userProfile.name;
}
//enterCtrl.$inject = [''];
function BannerCtl($scope, userProfile) {
   $scope.bannerText = "This site is a demo playground from weo to experiment, learn and share web components.";
   if (userProfile.component !== undefined) $scope.bannerText = userProfile.component;
   
}

function componentsCtrl($scope,userProfile, componentList,$location) {
   alert("Current Component:"+userProfile.component);
   $scope.userName=userProfile.name;
   $scope.component=userProfile.component;
   $scope.csi=componentList;
   
   $scope.clickHandler = function(text)
   {
      userProfile.component=text;
      $location.path("/viewComponent");
      //$window.location.href='http://home.orionhub.org:8080/weolopez/components/'+text+'/index.html'; 
      // $route.reload();
   };
}
//MyCtrl1.$inject = [];


function todoCtrl() {
}
todoCtrl.$inject = [];

var application = angular.module('project', ['mongolab']).
  config(function($routeProvider) {
    $routeProvider.
      when('/', {controller:ListCtrl, templateUrl:'list.html'}).
      when('/edit/:projectId', {controller:EditCtrl, templateUrl:'detail.html'}).
      when('/new', {controller:CreateCtrl, templateUrl:'detail.html'}).
      otherwise({redirectTo:'/'});
  }).controller(
	"CommandLineCtrl",
	function CommandLineCtrl($scope, commandLine) {
	alert("Command: "+commandLine);
	});;


function ListCtrl($scope, Project) {
  $scope.projects = Project.query();
};
 

function CreateCtrl($scope, $location, Project) {
  $scope.save = function() {
    Project.save($scope.project, function(project) {
      $location.path('/edit/' + project._id.$oid);
    });
  }
}


function EditCtrl($scope, $location, $routeParams, Project) {
  var self = this;

  Project.get({id: $routeParams.projectId}, function(project) {
    self.original = project;
    $scope.project = new Project(self.original);
  });

  $scope.isClean = function() {
    return angular.equals(self.original, $scope.project);
  }

  $scope.destroy = function() {
    self.original.destroy(function() {
      $location.path('/list');
    });
  };

  $scope.save = function() {
    $scope.project.update(function() {
      $location.path('/');
    });
  };
}

// This is a module for cloud persistance in mongolab - https://mongolab.com
angular.module('mongolab', ['ngResource']).
    factory('Project', function($resource) {
      var Project = $resource('https://api.mongolab.com/api/1/databases' +
          '/weolopez/collections/post/:id',
          { apiKey: '50f36e05e4b0b9deb24829a0' }, {
            update: { method: 'PUT' }
          }
      );

      Project.prototype.update = function(cb) {
        return Project.update({id: this._id.$oid},
            angular.extend({}, this, {_id:undefined}), cb);
      };

      Project.prototype.destroy = function(cb) {
        return Project.remove({id: this._id.$oid}, cb);
      };

      return Project;
    });


/*
function componentsCtrl($scope,userProfile, componentList,$location) {
   alert("Current Component:"+userProfile.component);
   $scope.userName=userProfile.name;
   $scope.component=userProfile.component;
   $scope.csi=componentList;
   
   $scope.clickHandler = function(text)
   {
      userProfile.component=text;
      $location.path("/viewComponent");
      //$window.location.href='http://home.orionhub.org:8080/weolopez/components/'+text+'/index.html'; 
      // $route.reload();
   };
}
//MyCtrl1.$inject = [];


function todoCtrl() {
}
todoCtrl.$inject = [];

angular.module('weolopezApp.controlers',[]).controller(
	"weolopezAppController",
	function MyCtrl($scope) {})
    $scope.keylog = [];
    $scope.keyCount= 0;
    
    $scope.handleKeypress = function(k) {
				   alert("KEY DOWN");
		           // event = event || $window.event; // because of Internet Explorer quirks...
		            //k = event.which || event.charCode || event.keyCode; // because of browser differences...
		            alert("KEY="+k);
		            if (k == 69) {
		            	var tail = document.URL.substring(39);
		            	alert( "tail:"+tail );
		                $window.location = "https://orionhub.org/edit/edit.html#/file/weolopez/weorion/weolopez/"+tail;
		            } 
		            if (k==65) {
		                $(".banner").css({opacity: 0, visibility: "visible"}).animate({opacity: 1.0}, 400);
		            }
    };
});
angular.module('weolopezApp.controlers',[]).controller(
"weolopezAppController",
function( $scope, $window ) {
// When the document is clicked, it will invoke
// this method, passing-through the jQuery event.
$scope.handleKeyPress = function( event ){

var key = new Array();
alert("KEY DOWN");
event = event || $window.event; // because of Internet Explorer quirks...
k = event.which || event.charCode || event.keyCode; // because of browser differences...
alert("KEY="+k);
if (k == 69) {
var tail = document.URL.substring(39);
alert( "tail:"+tail );
$window.location = "https://orionhub.org/edit/edit.html#/file/weolopez/weorion/weolopez/"+tail;
}
if (k==65) {
//$(".banner").css({opacity: 0, visibility: "visible"}).animate({opacity: 1.0}, 400);
}


};

}
);


*/



