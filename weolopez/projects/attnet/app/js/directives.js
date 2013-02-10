'use strict';

/* Directives */
angular.module('weolopezApp.directives', ['globalShortCuts','attnetComponents','attoffers']);

angular.module('globalShortCuts', []).directive('onKeyupFn', function($document,$window) {
    return function(scope, elm, attrs) {
        var keyupFn = scope.$eval(attrs.onKeyupFn);
        $document.bind('keyup', function(event) {
		     //       alert("HI");
		            event = event || $window.event; // because of Internet Explorer quirks...
		            var k = event.which || event.charCode || event.keyCode; // because of browser differences...
		    //        alert("KEY="+k);
		            if (k == 69) {
		            	var tail = document.URL.substring(39);
		            	alert( "tail:"+tail );
		                $window.location = "https://orionhub.org/edit/edit.html#/file/weolopez/weorion/weolopez/"+tail;
		            } 
		            if (k==65) {
		                $(".banner").css({opacity: 0, visibility: "visible"}).animate({opacity: 1.0}, 400);
		            }
		            
		            
//            scope.$apply(function() {
  //              keyupFn.call(scope, evt.which);
    //        });
        });
    };
});


angular.module('attnetComponents', []).directive("sharebuttons", function() {
    var strVar = "";
    strVar += "            <div class=\"module\" id=\"shareThis\">";
    strVar += "                <div class=\"modBody\">";
    strVar += "                    <h3><img src=\"http:\/\/www.att.net\/design\/CDLS10\/img\/at\/share.png\" \/><\/h3>";
    strVar += "                    <div class=\"share\">";
    strVar += "                        <span class='st_twitter'><\/span>";
    strVar += "                        <span class='st_facebook'><\/span>";
    strVar += "                        <span class='st_yahoo'><\/span>";
    strVar += "                        <span class='st_gbuzz'><\/span>";
    strVar += "                        <span class='st_email'><\/span>";
    strVar += "                        <span class='st_sharethis' displayText='ShareThis'><\/span><\/div>";
    strVar += "                <\/div>";
    strVar += "            <\/div>";

    return {
        restrict: "E",
        transclude: true,
        replace: true,
        scope: {},
        controller: function($scope, $element, $attrs) {
            this.register = function() {
                console.log("Hooray!");
            };
        },
        template: strVar,
        link: function(scope, element, attrs) {
            stLight.options({publisher: '12b57d5f-ab8d-4a34-8587-ce8bf93c3021'});
        }
    };
});

