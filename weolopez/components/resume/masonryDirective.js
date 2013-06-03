/**
 * Vanilla Masonry v1.0.7
 * Dynamic layouts for the flip-side of CSS Floats
 * http://vanilla-masonry.desandro.com
 *
 * Licensed under the MIT license.
 * Copyright 2012 David DeSandro
 */
(function(a,b){function e(a){return new RegExp("(^|\\s+)"+a+"(\\s+|$)")}function o(a,b,c){if(c.indexOf("%")===-1)return c;var d=a.style,e=d.width,f;return d.width=c,f=b.width,d.width=e,f}function p(a,b,c){var d=b!=="height",e=d?a.offsetWidth:a.offsetHeight,f=d?"Left":"Top",g=d?"Right":"Bottom",h=j(a),i=parseFloat(h["padding"+f])||0,k=parseFloat(h["padding"+g])||0,l=parseFloat(h["border"+f+"Width"])||0,m=parseFloat(h["border"+g+"Width"])||0,p=h["margin"+f],q=h["margin"+g],r,s;n||(p=o(a,h,p),q=o(a,h,q)),r=parseFloat(p)||0,s=parseFloat(q)||0;if(e>0)c?e+=r+s:e-=i+k+l+m;else{e=h[b];if(e<0||e===null)e=a.style[b]||0;e=parseFloat(e)||0,c&&(e+=i+k+r+s+l+m)}return e}function q(b,c,d){b.addEventListener?b.addEventListener(c,d,!1):b.attachEvent&&(b["e"+c+d]=d,b[c+d]=function(){b["e"+c+d](a.event)},b.attachEvent("on"+c,b[c+d]))}function r(a,b,c){a.removeEventListener?a.removeEventListener(b,c,!1):a.detachEvent&&(a.detachEvent("on"+b,a[b+c]),a[b+c]=null,a["e"+b+c]=null)}function s(a,b){if(!a)return;this.element=a,this.options={};for(var c in s.defaults)this.options[c]=s.defaults[c];for(c in b)this.options[c]=b[c];this._create(),this.build()}"use strict";var c=a.document,d="classList"in c.createElement("div"),f=d?function(a,b){return a.classList.contains(b)}:function(a,b){return e(b).test(a.className)},g=d?function(a,b){a.classList.add(b)}:function(a,b){f(a,b)||(a.className=a.className+" "+b)},h=d?function(a,b){a.classList.remove(b)}:function(a,b){a.className=a.className.replace(e(b)," ")},i=c.defaultView,j=i&&i.getComputedStyle?function(a){return i.getComputedStyle(a,null)}:function(a){return a.currentStyle},k=c.getElementsByTagName("body")[0],l=c.createElement("div"),m=k||c.createElement("body");l.style.marginTop="1%",m.appendChild(l);var n=j(l).marginTop!=="1%";m.removeChild(l);var t=["position","height"];s.defaults={isResizable:!0,gutterWidth:0,isRTL:!1,isFitWidth:!1},s.prototype={_getBricks:function(a){var b;for(var c=0,d=a.length;c<d;c++)b=a[c],b.style.position="absolute",g(b,"masonry-brick"),this.bricks.push(b)},_create:function(){this.reloadItems();var b=this.element.style;this._originalStyle={};for(var c=0,d=t.length;c<d;c++){var e=t[c];this._originalStyle[e]=b[e]||""}this.element.style.position="relative",this.horizontalDirection=this.options.isRTL?"right":"left",this.offset={};var f=j(this.element),h=this.options.isRTL?"paddingRight":"paddingLeft";this.offset.y=parseFloat(f.paddingTop)||0,this.offset.x=parseFloat(f[h])||0,this.isFluid=this.options.columnWidth&&typeof this.options.columnWidth=="function";var i=this;setTimeout(function(){g(i.element,"masonry")}),this.options.isResizable&&q(a,"resize",function(){i._handleResize()})},build:function(a){this._getColumns(),this._reLayout(a)},_getColumns:function(){var a=this.options.isFitWidth?this.element.parentNode:this.element,b=p(a,"width");this.columnWidth=this.isFluid?this.options.columnWidth(b):this.options.columnWidth||p(this.bricks[0],"width",!0)||b,this.columnWidth+=this.options.gutterWidth,this.cols=Math.floor((b+this.options.gutterWidth)/this.columnWidth),this.cols=Math.max(this.cols,1)},reloadItems:function(){this.bricks=[],this._getBricks(this.element.children)},_reLayout:function(a){var b=this.cols;this.colYs=[];while(b--)this.colYs.push(0);this.layout(this.bricks,a)},layout:function(a,b){if(!a||!a.length)return;var c,d,e,f,g,h,i;for(var j=0,k=a.length;j<k;j++){c=a[j];if(c.nodeType!==1)continue;d=Math.ceil(p(c,"width",!0)/this.columnWidth),d=Math.min(d,this.cols);if(d===1)i=this.colYs;else{e=this.cols+1-d,i=[];for(h=0;h<e;h++)g=this.colYs.slice(h,h+d),i[h]=Math.max.apply(Math,g)}var l=Math.min.apply(Math,i);for(var m=0,n=i.length;m<n;m++)if(i[m]===l)break;c.style.top=l+this.offset.y+"px",c.style[this.horizontalDirection]=this.columnWidth*m+this.offset.x+"px";var o=l+p(c,"height",!0),q=this.cols+1-n;for(h=0;h<q;h++)this.colYs[m+h]=o}var r={};this.element.style.height=Math.max.apply(Math,this.colYs)+"px";if(this.options.isFitWidth){var s=0;j=this.cols;while(--j){if(this.colYs[j]!==0)break;s++}this.element.style.width=(this.cols-s)*this.columnWidth-this.options.gutterWidth+"px"}b&&b.call(a)},_handleResize:function(){function b(){a.resize(),a._resizeTimeout=null}var a=this;this._resizeTimeout&&clearTimeout(this._resizeTimeout),this._resizeTimeout=setTimeout(b,100)},resize:function(){var a=this.cols;this._getColumns(),(this.isFluid||this.cols!==a)&&this._reLayout()},reload:function(a){this.reloadItems(),this.build(a)},appended:function(a,b,c){var d=this,e=function(){d._appended(a,c)};if(b){var f=p(this.element,"height")+"px";for(var g=0,h=a.length;g<h;g++)a[g].style.top=f;setTimeout(e,1)}else e()},_appended:function(a,b){this._getBricks(a),this.layout(a,b)},destroy:function(){var b;for(var c=0,d=this.bricks.length;c<d;c++)b=this.bricks[c],b.style.position="",b.style.top="",b.style.left="",h(b,"masonry-brick");var e=this.element.style;d=t.length;for(c=0;c<d;c++){var f=t[c];e[f]=this._originalStyle[f]}h(this.element,"masonry"),this.resizeHandler&&r(a,"resize",this.resizeHandler)}},s.getWH=p,a.Masonry=s})(window);

 function loadcss(url) {
   var head = document.getElementsByTagName('head')[0],
   link = document.createElement('link');
   link.type = 'text/css';
   link.rel = 'stylesheet';
   link.href = url;
   head.appendChild(link);
   return link;
 }
 
 loadcss('http://raw.github.com/desandro/vanilla-masonry/master/css/style.css');
 
 angular.module('masonryDirective', []).directive('masonry',, function() {
	  return {
restrict: 'E',
transclude: true,
scope: {},
controller: function($scope, $element) {
var panes = $scope.panes = [];
 
$scope.select = function(pane) {
angular.forEach(panes, function(pane) {
pane.selected = false;
});
pane.selected = true;
}
 
this.addPane = function(pane) {
if (panes.length == 0) $scope.select(pane);
panes.push(pane);
}
},
template:
'<div class="tabbable">' +
'<ul class="nav nav-tabs">' +
'<li ng-repeat="pane in panes" ng-class="{active:pane.selected}">'+
'<a href="" ng-click="select(pane)">{{pane.title}}</a>' +
'</li>' +
'</ul>' +
'<div class="tab-content" ng-transclude></div>' +
'</div>',
replace: true
};
}).
directive('pane', function() {
return {
require: '^tabs',
restrict: 'E',
transclude: true,
scope: { title: '@' },
link: function(scope, element, attrs, tabsCtrl) {
tabsCtrl.addPane(scope);
},
template:
'<div class="tab-pane" ng-class="{active: selected}" ng-transclude>' +
'</div>',
replace: true
};
 });
 
 