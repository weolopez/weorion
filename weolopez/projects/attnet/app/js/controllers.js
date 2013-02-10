'use strict';

/* Controllers */

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

/*
angular.module('weolopezApp.controlers',[]).controller(
	"jumbotronController",
*/
  
angular.module('weolopezApp.controlers',['ui.bootstrap.tabs']).controller(
	"weolopezAppController",
	function weolopezAppController($scope) {
  $scope.panes = [
    { title:"Dynamic Title 1", content:"Dynamic content 1" },
    { title:"Dynamic Title 2", content:"Dynamic content 2" }
  ];
});

angular.module('ui.bootstrap.tabs', [])
.controller('TabsController', ['$scope', '$element', function($scope, $element) {
  var panes = $scope.panes = [];

  this.select = $scope.select = function selectPane(pane) {
    angular.forEach(panes, function(pane) {
      pane.selected = false;
    });
    pane.selected = true;
  };

  this.addPane = function addPane(pane) {
    if (!panes.length) {
      $scope.select(pane);
    }
    panes.push(pane);
  };

  this.removePane = function removePane(pane) { 
    var index = panes.indexOf(pane);
    panes.splice(index, 1);
    //Select a new pane if removed pane was selected 
    if (pane.selected && panes.length > 0) {
      $scope.select(panes[index < panes.length ? index : index-1]);
    }
  };
}])
.directive('tabs', function() {
  return {
    restrict: 'EA',
    transclude: true,
    scope: {},
    controller: 'TabsController',
    templateUrl: 'template/tabs/tabs.html',
    replace: true
  };
})
.directive('pane', ['$parse', function($parse) {
  return {
    require: '^tabs',
    restrict: 'EA',
    transclude: true,
    scope:{
      heading:'@'
    },
    link: function(scope, element, attrs, tabsCtrl) {
      var getSelected, setSelected;
      scope.selected = false;
      if (attrs.active) {
        getSelected = $parse(attrs.active);
        setSelected = getSelected.assign;
        scope.$watch(
          function watchSelected() {return getSelected(scope.$parent);},
          function updateSelected(value) {scope.selected = value;}
        );
        scope.selected = getSelected ? getSelected(scope.$parent) : false;
      }
      scope.$watch('selected', function(selected) {
        if(selected) {
          tabsCtrl.select(scope);
        }
        if(setSelected) {
          setSelected(scope.$parent, selected);
        }
      });

      tabsCtrl.addPane(scope);
      scope.$on('$destroy', function() {
        tabsCtrl.removePane(scope);
      });
    },
    templateUrl: 'template/tabs/pane.html',
    replace: true
  };
}]);


	/*  

angular.module('weolopezApp.controlers', ['ui.bootstrap']);

var TabsDemoCtrl = function ($scope) {
};
	


angular.module('weolopezApp.controlers', ['ui.bootstrap.tabs']).controller(


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
*/


