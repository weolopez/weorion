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
