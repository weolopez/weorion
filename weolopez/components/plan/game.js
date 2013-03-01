
var htmlStr="";
htmlStr += "<div class=\"modal-header\">";
htmlStr += "    New plan";
htmlStr += "<\/div>";
htmlStr += "<div class=\"modal-body\">";
htmlStr += "    <form name=\"myForm\">";
htmlStr += "        <div class=\"control-group\" ng-class=\"{error: myForm.name.$invalid}\">";
htmlStr += "            <label>Name<\/label>";
htmlStr += "            <input type=\"text\" name=\"name\" ng-model=\"Game.name\" required>";
htmlStr += "            <span ng-show=\"myForm.name.$error.required\" class=\"help-inline\">";
htmlStr += "                Required<\/span>";
htmlStr += "        <\/div>";
htmlStr += "";
htmlStr += "        <div class=\"control-group\" ng-class=\"{error: myForm.site.$invalid}\">";
htmlStr += "            <label>Website<\/label>";
htmlStr += "            <input type=\"url\" name=\"site\" ng-model=\"Game.site\" required>";
htmlStr += "            <span ng-show=\"myForm.site.$error.required\" class=\"help-inline\">";
htmlStr += "                Required<\/span>";
htmlStr += "            <span ng-show=\"myForm.site.$error.url\" class=\"help-inline\">";
htmlStr += "                Not a URL<\/span>";
htmlStr += "        <\/div>";
htmlStr += "";
htmlStr += "        <label>Description<\/label>";
htmlStr += "        <textarea name=\"description\" ng-model=\"Game.description\"><\/textarea>";
htmlStr += "";
htmlStr += "        <br>";
htmlStr += "        <div class=\"modal-footer\">";
htmlStr += "            <!--a href=\"#\/\" class=\"btn\">Cancel<\/a-->";
htmlStr += "            <button ng-click=\"close(result)\" class=\"btn btn-primary\" >Close<\/button>";
htmlStr += "            <button ng-click=\"save()\" ng-disabled=\"isClean() || myForm.$invalid\"";
htmlStr += "                    class=\"btn btn-primary\">Save<\/button>";
htmlStr += "            <button ng-click=\"destroy()\"";
htmlStr += "                    ng-show=\"Game._id\" class=\"btn btn-danger\">Delete<\/button>";
htmlStr += "        <\/div>";
htmlStr += "    <\/form>";
htmlStr += "<\/div>";
htmlStr += "";


angular.module('game', ['ui.bootstrap.dialog','ngResource']).

    // This is a module for cloud persistance in mongolab - https://mongolab.com
 //  angular.module('mongolab', ['ngResource']).
    factory('Game', function($resource) {
    	var Game = $resource('https://api.mongolab.com/api/1/databases' +
    		'/weolopez/collections/Games/:id',
    	{ apiKey: '50f36e05e4b0b9deb24829a0' }, {
    		update: { method: 'PUT' }
    	});
     
	    Game.prototype.update = function(cb) {
	    return Game.update({id: this._id.$oid},
	    angular.extend({}, this, {_id:undefined}), cb);
	    };
     
	    Game.prototype.destroy = function(cb) {
	    return Game.remove({id: this._id.$oid}, cb);
	    };
     
    	return Game;
    });


function gameCtrl($scope, Game, $dialog, $rootScope, plan) {
    $scope.Games = Game.query();
    
    $scope.createOpts = {
	    backdrop: true,
	    keyboard: true,
	    backdropClick: true,
	    template:  htmlStr, // OR: 	    templateUrl: 'detail.html',
	    controller: 'CreateGameCtrl'
  	};

  $scope.createDialog = function(){
    var d = $dialog.dialog($scope.createOpts);
    d.open().then(function(result){
      if(result)
      {
        alert('dialog closed with result: ' + result);
      }
    });
  };
  
    $scope.editOpts = {
	    backdrop: true,
	    keyboard: true,
	    backdropClick: true,
	    template:  htmlStr, // OR: 	    templateUrl: 'detail.html',
	    templateUrl: 'detail.html',
	    controller: 'EditGameCtrl'
  	};

  $scope.editDialog = function(GameId){
    $rootScope.GameID = GameId;
    var d = $dialog.dialog($scope.editOpts);
    d.open().then(function(result){
      if(result)
      {
        alert('dialog closed with result: ' + result);
      }
    });
  };
  
}

function CreateGameCtrl($scope, Game, dialog) {

    $scope.save = function() {
	    Game.save($scope.Game, function(Game) {
	    	dialog.close();
	    });
    };
    
	  $scope.close = function(result){
	    dialog.close(result);
	  };
}

function EditGameCtrl($scope, Game, dialog, $rootScope) {
    var self = this;
    
     
    Game.get({id: $rootScope.GameID}, function(Game) {
	    self.original = Game;
	    $scope.Game = new Game(self.original);
    });
     
    $scope.isClean = function() {
    	return angular.equals(self.original, $scope.Game);
    }
     
    $scope.destroy = function() {
	    self.original.destroy(function() {
	   	 dialog.close();
	    });
    };
     
	    $scope.save = function() {
	    	$scope.Game.update(function() {
	    		$dialog.close("Save Success");
	   		});
	    };
	      
	  $scope.close = function(result){
	    dialog.close(result);
	  };
}