angular.module('component.application', ['firebase','ngStorage', 'component.user'])        
        .factory('CONST', function() {
            this.FB='https://weo.firebaseio.com';
        	return this;
        })
        .factory('$app', function ($log, $localStorage, $user) {
        	var app = this;
            this.$storage = $localStorage;
            
            app.copy = function(jsonContent) {
            	$user.setProperty('copy', jsonContent);
            }
            
			app.paste = function() {
				if ($user.user === undefined) return undefined;
				if ($user.user.copy !== undefined) return $user.user.copy;
				else return undefined;
			}
            
            return app;
        })
        .controller('AppCtrl', function ($log, $app, $page, $ionicNavBarDelegate, $state, $window, $user, $ionicActionSheet) {        	
            var app = this;
            app.page=$page;
            
            $app.navBar = $ionicNavBarDelegate;
            
			 // Triggered on a button click, or some other target
			 app.open = function() {
				var titleText='Page:'+$page.current.title;
				var lButtons=[
			    /*   { text: '<b>Add</b> ',
			         action: function() {
			         	alert('Add Story');
			         }
			       }*/
				]
				var destructText;
				if ($page.currentStory !== undefined) {
					titleText=titleText+' Story: '+$page.currentStory.name;
					lButtons.push(
				       { text: '<b>Copy</b> ',
				         action: function() {
				         	$app.copy($page.currentStory);
				         }
			       		});
			       		destructText='Delete';
					/*lButtons.push(
				       { text: '<b>Move</b> ' }
			       	);*/
			       	
				}
				if ($app.paste()) {
					lButtons.push(
				       { text: '<b>Paste</b> '+$app.paste().name,
				         action: function() {
				         	$page.add($app.paste());
				         }
				       }
			       	);
				}
			   // Show the action sheet
			   var hideSheet = $ionicActionSheet.show({
			     buttons: lButtons,
			     destructiveText: destructText,
			     titleText: titleText,
			     cancelText: 'Cancel',
			     cancel: function() {
			          // add cancel code..
			     },
			     buttonClicked: function(index, button) {
			       if (button.action !== undefined) button.action();
			       return true;
			     },
			     destructiveButtonClicked: function() {
			       $page.removeStory();
				   $state.go('app.wiki.pageconf', { 'storyName': ''});
			       return true;
			     }
			   });         
			}
        })

.directive('headerShrink', function($document) {
  var fadeAmt;

  var shrink = function(header, content, amt, max) {
    amt = Math.min(44, amt);
    fadeAmt = 1 - amt / 44;
    ionic.requestAnimationFrame(function() {
      header.style[ionic.CSS.TRANSFORM] = 'translate3d(0, -' + amt + 'px, 0)';
      for(var i = 0, j = header.children.length; i < j; i++) {
        header.children[i].style.opacity = fadeAmt;
      }
    });
  };

  return {
    restrict: 'A',
    link: function($scope, $element, $attr) {
      var starty = $scope.$eval($attr.headerShrink) || 0;
      var shrinkAmt;
      
      var header = $document[0].body.querySelector('.bar-header');
      var headerHeight = header.offsetHeight;
      
      $element.bind('scroll', function(e) {
        var scrollTop = null;
        if(e.detail){
          scrollTop = e.detail.scrollTop;
        }else if(e.target){
          scrollTop = e.target.scrollTop;
        }
        if(scrollTop > starty){
          // Start shrinking
          shrinkAmt = headerHeight - Math.max(0, (starty + headerHeight) - scrollTop);
          shrink(header, $element[0], shrinkAmt, headerHeight);
        } else {
          shrink(header, $element[0], 0, headerHeight);
        }
      });
    }
  }
})        
.directive('headerShrink', function($document) {
  var fadeAmt;

  var shrink = function(header, content, amt, max) {
    amt = Math.min(44, amt);
    fadeAmt = 1 - amt / 44;
    ionic.requestAnimationFrame(function() {
      header.style[ionic.CSS.TRANSFORM] = 'translate3d(0, -' + amt + 'px, 0)';
      for(var i = 0, j = header.children.length; i < j; i++) {
        header.children[i].style.opacity = fadeAmt;
      }
    });
  };

  return {
    restrict: 'A',
    link: function($scope, $element, $attr) {
      var starty = $scope.$eval($attr.headerShrink) || 0;
      var shrinkAmt;
      
      var header = $document[0].body.querySelector('.bar-header');
      var headerHeight = header.offsetHeight;
      
      $element.bind('scroll', function(e) {
        var scrollTop = null;
        if(e.detail){
          scrollTop = e.detail.scrollTop;
        }else if(e.target){
          scrollTop = e.target.scrollTop;
        }
        if(scrollTop > starty){
          // Start shrinking
          shrinkAmt = headerHeight - Math.max(0, (starty + headerHeight) - scrollTop);
          shrink(header, $element[0], shrinkAmt, headerHeight);
        } else {
          shrink(header, $element[0], 0, headerHeight);
        }
      });
    }
  }
})
        ;