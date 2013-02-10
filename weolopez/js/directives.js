'use strict';

/* Directives */
angular.module('weolopezApp.directives', []).directive('globalEvents', function(News) {
    return function(scope, element, attrs) {
       element.bind('keyup', function(e){
		            alert("HI");
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
    })
    }
    })


