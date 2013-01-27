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
