if(!window.DL){var DL={}
}DL.PubSub={};
(function(d){var b={},a=-1,e=[],c=function(g,h){if(!b.hasOwnProperty(g)){return false
}var k=b[g],f=function(l){return function(){throw l
}
};
e=_.map(k,function(l){return l.fn
});
_.each(e,function(l){try{l(g,h)
}catch(m){setTimeout(f(m),0)
}});
return true
};
d.publish=function(f,g){return c(f,g,false)
};
d.subscribe=function(h,g){if(!b.hasOwnProperty(h)){b[h]=[]
}var f=(++a).toString();
b[h].push({token:f,fn:g});
return f
};
d.unsubscribe=function(k){for(var f in b){if(b.hasOwnProperty(f)){for(var h=0,g=b[f].length;
h<g;
h++){if(b[f][h].token===k){b[f].splice(h,1);
return k
}}}}return false
}
}(DL.PubSub));
DL.Dashboard.Connection=function(){this.setUpPersistance()
};
DL.Dashboard.Connection.prototype={isIE:/MSIE /.test(navigator.userAgent),parseAndDelegate:function(e){e=e.replace(/^\*+|[\r\n]+|\r+|\n+$/g,"");
if(e.length&&e!=""){function a(h){if(h.MOID){var g=h.MOID.split(".");
if((g[0]=="512")&&h.dev=="0"){return true
}return false
}}function f(g){if(g.MOID&&g.MOID.split(".")[0]=="512"||g.EID){return false
}return true
}function c(g){if(g.EID){return true
}return false
}function b(h){var g=$.parseJSON(h);
if(g.hasOwnProperty("serviceCommand")){if(g.serviceCommand=="quit"&&g.uuid==DL.Dashboard.sessionId){window.location.href=DL.LogoutUrl
}else{if(g.serviceCommand=="sessionTimeoutAlert"&&g.uuid==DL.Dashboard.sessionId){DL.Dashboard.PingSession.modal()
}}return
}else{if(a(g)){DL.PubSub.publish("onprogrammessagerecevied",g)
}else{if(f(g)){DL.PubSub.publish("onmessagereceived",g)
}else{if(c(g)){DL.PubSub.publish("oncustomevent",g)
}else{if(g.dev=="0"){DL.PubSub.publish("ongatewaymessagereceived",g)
}}}}}}function d(k){var l=k.indexOf("{");
if(l>-1){var h=k.indexOf("}")+1,g=k.slice(l,h);
arguments.callee(k.slice(h));
b(g);
DL.log(g)
}}d(e)
}},displayConnectionError:function(){var a=this;
this.errorModal=new DL.Dashboard.ModalBase({template:"modals/basic",data:{confirm:"OK",title:"Connectivity Lost",body:"We could not reestablish connectivity to the server. As a precaution, you will be logged out."},afterOpen:function(){setTimeout(function(){a.errorModal.close()
},15000)
},afterClose:function(){DL.Dashboard.finalize()
},customEvents:{"click .yes":function(b){b.preventDefault();
a.errorModal.close()
}}})
},setUpPersistance:function(){var b=this,f=0,c=0;
try{function e(){if(!DL.isForcingLogout){var h=DL.Dashboard.pConnectionURL+"?uuid="+DL.Dashboard.sessionId+"&key="+DL.Dashboard.gwid+"&avoidcachetimestamp="+(new Date().getTime());
if(b.isIE&&DL.NotCrossDomain=="false"&&window.XDomainRequest){var g=new XDomainRequest();
g.onerror=function(m){DL.log("xdr: error");
d()
};
g.ontimeout=function(){DL.log("xdr: calling after timeout");
d()
};
g.onprogress=function(){var m=g.responseText.substring(f);
f=g.responseText.length;
DL.log("xdr:"+m);
b.parseAndDelegate(m)
};
g.onload=function(){DL.log("xdr: onload");
d()
};
g.timeout=10000;
g.open("GET",h,true);
g.send()
}else{if(b.isIE){(function l(){var s=$(document.createElement("iframe")),r=300,n=0,o;
function p(t){clearInterval(o);
m()
}function q(){var u=s.contents().find("body"),t=u.text();
if(t){b.parseAndDelegate(t);
n=0;
u.html("")
}else{n++;
if(n>Math.floor(35000/r)){p("reloading persistent frame")
}}}function m(){s.attr("src",h);
n=0;
o=setInterval(q,r)
}s.attr("id","pFrame");
s.css({position:"absolute",left:"-9999em",top:0});
$("body").append(s);
m()
})()
}else{if(window.XMLHttpRequest){var k=new XMLHttpRequest();
k.onreadystatechange=function(){try{if(k.readyState==3){var m=k.responseText.substring(f);
f=k.responseText.length;
b.parseAndDelegate(m)
}if(k.readyState==4){d()
}}catch(n){DL.log(n)
}};
k.open("GET",h,true);
k.send()
}else{DL.log("There was an error processing your request.  Please try again. [eService]")
}}}}}function d(){if(c<=5){c++;
setTimeout(e,5000)
}else{b.displayConnectionError()
}}e()
}catch(a){DL.log("No eServiceProxy service available "+a.description+".")
}}};
(function(){var d=false,c=2,f=2,o={},g="mousedown",p="mousemove",m="mouseup",n;
(function(){var r=document.createElement("div");
r.setAttribute("ontouchmove","return");
if(r.ontouchmove instanceof Function){d=true;
g="touchstart";
p="touchmove";
m="touchend"
}})();
function k(r,s,t){if(r.addEventListener){r.addEventListener(s,t,false)
}else{if(r.attachEvent){r.attachEvent("on"+s,t)
}}}function l(r,s,t){if(r.removeEventListener){r.removeEventListener(s,t,false)
}else{if(r.detachEvent){r.detachEvent("on"+s,t)
}}}function e(r){if(r&&r.preventDefault){r.preventDefault();
r.stopPropagation()
}else{if(window.event){window.event.returnValue=false
}}}function q(r){return{screenX:r.screenX,screenY:r.screenY,clientX:r.clientX,clientY:r.clientY,pageX:r.pageX,pageY:r.pageY}
}function h(t,r){for(var s=t.length-1;
s>-1;
s--){if(t[s].identifier===r){return true
}}return false
}function a(s,r){return s&&r&&s.screenX===r.screenX&&s.screenY===r.screenY
}function b(u,s){var r;
if(u.touches){if(s){for(var t=u.touches.length-1;
t>-1;
t--){if(u.touches[t].identifier==s){r=u.touches[t];
break
}}}else{r=u.touches[0]
}}else{r=u
}return{screenX:r.screenX,screenY:r.screenY,clientX:r.clientX,clientY:r.clientY,pageX:r.pageX,pageY:r.pageY}
}gesture={isSupported:function(){return d
},drag:function(t,v,r,u,x,s){if(t instanceof jQuery){t=t[0]
}var w="data-obj-touch-"+Date.parse(new Date);
k(t,g,function(F){F=F||window.event;
var G=F.currentTarget;
e(F);
var K=null,H=null,z=0,y=0,E=false,G=F.currentTarget||F.srcElement,I=F.target||F.srcElement,D=n;
if(d&&F.changedTouches){D=F.changedTouches[0].identifier
}function B(L){return{identifier:D,currentPoint:q(L),originPoint:q(K),lastPoint:q(H),deltaX:z,deltaY:y,performedMove:E}
}function J(M){if(D){for(var L=M.changedTouches.length-1;
L>-1;
L--){if(M.changedTouches[L].identifier==D){return true
}}return false
}else{return true
}}function C(O){O=O||window.event;
if(G&&J(O)){e(O);
E=true;
var P=b(O,D),M=P.screenX-H.screenX,L=P.screenY-H.screenY,N;
if(Math.abs(M)>c||Math.abs(L)>c){z=M;
y=L;
N=B(P);
if(r){r.call(G,O,N)
}H=P
}}}function A(N){N=N||window.event;
if(G&&J(N)){e(N);
var M=B(H);
if(u){u.call(G,N,M)
}if(Math.abs(K.screenX-H.screenX)<c&&Math.abs(K.screenY-H.screenY)<f){if(d&&x&&!o[D]){var L=document.createEvent("MouseEvents");
L.initMouseEvent("click",true,true,window,0,K.screenX,K.screenY,K.clientX,K.clientY,false,false,false,false,0,null);
I.dispatchEvent(L);
o[D]=true;
setTimeout(function(){delete o[D]
},0)
}}else{if(!d||!x){k(document.body,"click",function(O){l(document.body,"click",arguments.callee)
})
}}G.removeAttribute(w);
I=G=K=H=null;
z=y=0;
E=false;
l(document.body,p,C);
l(document.body,m,A)
}}k(document.body,p,C);
k(document.body,m,A);
K=H=b(F,D);
if(v){v.call(this,F,B(K))
}},false)
}}
})();
var gesture=window.gesture||{};
var draggable=function(f,b,d,a,c,e){if(f.isDragable){throw"draggable already initialized"
}f.isDragable=true;
this.element=f[0]&&f[0].nodeName==="LI"?$(f):$(f).parents("li:first");
this.targetLocation=c;
this.onDragStartCallback=b||null;
this.onDragMoveCallback=d||null;
this.onDragEndCallback=a||null;
this.context=e;
this.initDrag(f);
this.isOldIe=/MSIE 8|MSIE 7/.test(window.navigator.userAgent)
};
draggable.prototype={element:null,events:null,clonedElement:null,elementInactive:false,onDragEndCallback:null,preventDefault:function(a){if(a&&a.preventDefault){a.preventDefault();
a.stopPropagation()
}else{if(window.event){window.event.returnValue=false
}}},centerOnCursor:function(a,g,d){var c=(parseInt(d.css("margin-left"),10)+parseInt(d.css("margin-right"),10))/2,b=(parseInt(d.css("margin-left"),10)+parseInt(d.css("margin-right"),10))/2,e=g-(d.outerHeight()/2)-b,f=a-(d.outerWidth()/2)-c;
return{x:f,y:e}
},createClone:function(b){this.element.find(".drawer").hide();
var a=this.element.find(".panelArrow");
if(a.hasClass("dvcControlsClose")){a.removeClass("dvcControlsClose").addClass("dvcControlsOpen")
}var c=this.element.clone(true);
c.addClass("clone");
c.attr("id",c.attr("id")+"-"+Date.parse(new Date));
if(b){var b=this.centerOnCursor(b.left,b.top,this.element);
c.css({position:"absolute",left:b.x,top:b.y,zIndex:1000,width:this.element.width()+"px"})
}return c
},initDrag:function(a){gesture.drag(a,$.proxy(this.onDragStart,this),$.proxy(this.onDragMove,this),$.proxy(this.onDragEnd,this))
},onDragStart:function(c,a){var b={};
if(this.element.data("dragged")){return false
}if(this.isOldIe){c.cancelBubble=true;
b={left:c.clientX,top:c.clientY}
}else{this.preventDefault(c);
b={left:c.clientX,top:c.pageY}
}this.clonedElement=this.createClone(b);
this.elementInactive=true;
this.clonedElement.appendTo(document.body);
if(this.onDragStartCallback){this.onDragStartCallback(this,this.context)
}},onDragMove:function(f,c){this.preventDefault(f);
if(this.element.data("dragged")){return false
}var b=!this.isOldIe?f.pageX:event.clientX+(document.documentElement.scrollLeft?document.documentElement.scrollLeft:document.body.scrollLeft);
var a=!this.isOldIe?f.pageY:event.clientY+(document.documentElement.scrollTop?document.documentElement.scrollTop:document.body.scrollTop);
var d=this.centerOnCursor(b,a,this.element);
this.element.addClass("inactive");
this.clonedElement.css({left:d.x,top:d.y});
if(this.onDragMoveCallback){this.onDragMoveCallback(this,this.context)
}},onDragEnd:function(b,a){this.preventDefault(b);
if(this.element.data("dragged")){return false
}if(this.isValidDrop(this.clonedElement,a)){this.element.data("dragged",true);
this.clonedElement.appendTo(this.targetLocation).css({left:"auto",top:"auto",position:"relative","float":"left"}).addClass("newInstance").siblings().removeClass("newInstance");
if(this.onDragEndCallback){this.onDragEndCallback(this,this.context,b,this.targetLocation)
}}else{this.clonedElement.remove();
this.clonedElement=null;
this.element.removeClass("inactive");
this.element.data("dragged",false)
}},isValidDrop:function(b,f){var e=this.targetLocation,a=e.offset(),d=f.lastPoint.pageX,c=f.lastPoint.pageY,g=true;
if(d<a.left||c<a.top){g=false
}if(d>a.left+e.width()||c>a.top+e.height()){g=false
}return g
}};
var DL=window.DL||{};
DL.Animation={supported:false,animationString:"animation",keyFramePrefix:"",domPrefixes:"Webkit Moz O ms Khtml".split(" "),pfx:"",init:function(){if(this.supported){var f=this,e=[];
for(var g in this.animations){var b=this.animations[g],d=f.keyFramePrefix+"animation",a=b[1].split(" ");
e.push("@"+f.keyFramePrefix+"keyframes "+g+" {from {"+f.keyFramePrefix+b[2]+"} to {"+f.keyFramePrefix+b[3]+"}}\n");
e.push("."+g+" {"+d+"-name:"+g+";"+d+"-iteration-count:"+a[2]+";"+d+"-timing-function:"+a[1]+";"+d+"-duration:"+a[0]+"}")
}var c=document.createElement("style");
c.type="text/css";
c.innerHTML=e.join("");
document.getElementsByTagName("head")[0].appendChild(c)
}},animations:{infiniteRotate:["rotate","1s linear infinite","transform:rotate(0deg)","transform:rotate(360deg)"]}};
(function(b){var d=document.createElement("div");
if(d.style.animationName){b.supported=true
}if(!b.supported){for(var a=0;
a<b.domPrefixes.length;
a++){var c=b.domPrefixes[a];
if(d.style[c+"AnimationName"]!==undefined){b.pfx=c;
b.animationString=b.pfx+"Animation";
b.keyFramePrefix="-"+b.pfx.toLowerCase()+"-";
b.supported=true;
break
}}}})(DL.Animation);
var DL=window.DL||{};
DL.Dashboard=DL.Dashboard||{};
DL.Dashboard.backboneStarted=false;
DL.Dashboard.Main=(function(d){var c={};
c.loadingStart=function(f){this.loadingOverlay=new DL.Dashboard.LoadingBase(f)
};
c.loadingEnd=function(){if(!_.isUndefined(this.loadingOverlay)){this.loadingOverlay.close()
}else{d("body").find(".loading-overlay").remove()
}};
c.isLoading=function(){return d("body").find(".loading-overlay").length?true:false
};
c.Ajax=function(l,g,f,m,k){m=m||{};
if(typeof l=="object"){m=l
}else{if(m){m.url=l;
m.type=m.type||"POST"
}}if(!_.isUndefined(m.showLoadingOverlay)&&m.showLoadingOverlay){c.loadingStart()
}m=m||{};
var h=jQuery.Deferred(function(n){if(DL.Dashboard.PingSession.timeout){DL.Dashboard.PingSession.reset()
}d.ajax(m).done(function(){var o=arguments[0];
if(m.showLoadingOverlay){c.loadingEnd()
}if(o&&o.responseMessage){if(o.responseMessage.code=="-423"){var p=new DL.Dashboard.Views.PinPad();
p.setSumbitHandler(function(q){DL.Dashboard.Main.Ajax(DL.Dashboard.setPin+DL.Dashboard.gwid+".json",function(){DL.Dashboard.Main.Ajax(l,function(r){p.close();
if(g){g(r)
}},null,n.originalSettings)
},function(r){p.displayError(r.responseMessage.message)
},{data:{pin:q}})
})
}else{if(o.responseMessage.code=="0"||k){if(g||k){g(o)
}n.resolve.apply(this,arguments)
}else{if(f){f(o)
}n.reject.apply(this,arguments)
}}}else{if(g){g(o)
}}}).fail(function(){var o=arguments[0];
if(o.status==401){}if(f){f(o)
}n.reject.apply(this,arguments)
})
});
h.originalSettings=m;
return h
};
c.scrubClassNames=function(m,l){var k=l[0].className.split(" ");
for(var h=0,g=k.length;
h<g;
h++){var f=k[h];
if(f!=m){l.removeClass(f)
}}return l
};
c.getSelectedGatewayData=function(k){if(k){for(var g=0,f=DL.Dashboard.customer.gateways.length;
g<f;
g++){var h=DL.Dashboard.customer.gateways[g];
if(h.gatewayGUID===k){return h
}}return false
}};
c.setSelectedGateway=function(f){DL.Dashboard.Main.Ajax(DL.Dashboard.restURLs.setCurrentlySelectedGateway,function(g){DL.switchingGateways=true;
window.location.reload()
},null,{type:"POST",data:{gatewayGUID:f}})
};
c.setDevicesMonitored=function(l,g){var f=[],h=["0106","010E"];
_.each(h,function(n){n=DL.Dashboard.devices.getDeviceByClassId(n);
if(n){f.push(n)
}});
if(l){_.each(l,function(m){m=DL.Dashboard.devices.get(m);
if(m){f.push(m)
}})
}f=_.flatten(f);
if(!g){f=DL.Dashboard.devices.getAllMonitoredDevices();
k(false);
arguments.callee(null,true)
}else{k(true)
}function k(m){_.each(f,function(n){n.setAlternateStatus(m?"monitored":false)
})
}};
c.setDevicesAlarmed=function(f,k){var n=[];
function m(q){for(var p=0,o=q.length;
p<o;
p++){q[p].setAlternateStatus("alarm")
}}if(!k){n=DL.Dashboard.devices.getAllAlarmDevices();
for(var h=0,g=n.length;
h<g;
h++){n[h].setAlternateStatus(false)
}}else{for(var h=0,g=f.length;
h<g;
h++){var l=DL.Dashboard.devices.getDeviceById(f[h]);
if(l){n.push(l)
}}m(n)
}};
c.setDevicesBypassed=function(f,k){var m=[];
function n(q){for(var p=0,o=q.length;
p<o;
p++){q[p].setAlternateStatus("bypassed")
}}if(!k){m=DL.Dashboard.devices.getAllBypassedDevices();
for(var h=0,g=m.length;
h<g;
h++){m[h].setAlternateStatus(false)
}}else{for(var h=0,g=f.length;
h<g;
h++){var l=DL.Dashboard.devices.getDeviceById(f[h]);
if(l){m.push(l)
}}n(m)
}};
c.onclick_logout=function(f){if(f){f.preventDefault()
}DL.userHasSelectedLogout=true;
DL.Dashboard.finalize()
};
c.init=function(){if(DL.Dashboard.gwid==""){d.when(b()).then(function(g){DL.Dashboard.customer=g;
DL.Dashboard.gwid=g.selectedGateway;
DL.Dashboard.customer.permissions=DL.Dashboard.customer.permissions[DL.Dashboard.gwid];
DL.Dashboard.sessionId=g.sessionId;
f()
})
}else{f()
}function f(){new DL.Dashboard.Connection();
var g=d("#container");
g.find("#app").html("");
c.rawDevicesLoader(null,DL.Dashboard.getGatewayStatusAndProceed);
DL.Dashboard.getAllPrograms(function(h){DL.Dashboard.allSavedPrograms=new DL.Dashboard.Collections.Programs();
DL.Dashboard.allSavedPrograms.add(h)
})
}};
c.rawDevicesLoader=function(f,g){DL.Dashboard.Main.loadingStart(f);
DL.Dashboard.groups={};
DL.Dashboard.devices=new DL.Dashboard.Collections.Devices();
d.when(e(),a()).then(function(k,h){DL.Dashboard.Main.loadingEnd();
_(k).each(function(l){DL.Dashboard.devices.add(l)
});
DL.Dashboard.groups={};
_(h).each(function(m){var l=m.type;
DL.Dashboard.groups[l]=new DL.Dashboard.Collections.Groups();
_.each(m.deviceGroups,function(n){if(n.location){n.floor=n.location.floor
}DL.Dashboard.groups[l].add(n)
})
});
if(_.isFunction(g)){g()
}})
};
c.abandonChangesModalSelector="div.navSection a, div.topSection a, div.topStatus a";
c.abandonChangesModalBind=function(){var f=d(c.abandonChangesModalSelector);
f.addClass("blocked");
f.bind("click.abandonChanges",function(h){if(d(h.target).hasClass("blocked")){h.preventDefault()
}var g=d(h.target);
c.abandonChangesModal(function(l){DL.Dashboard.SpacesShared.inEditMode=true;
c.abandonChangesModalUnbind();
var k=g.attr("href").split("#");
if(_.indexOf(g.attr("href"),"#")==-1){g.trigger("click")
}else{DL.Dashboard.app.navigate(k[1],{trigger:true})
}},function(){})
})
};
c.abandonChangesModal=function(f,g){var h=new DL.Dashboard.ModalBase({template:"modals/basic",data:{confirm:"YES",body:"You have unsaved changes, continue without saving?",title:"Unsaved Changes"},customEvents:{"click .yes":function(k){k.preventDefault();
if(DL.Spaces.BootLoader.roomFloorData){DL.Spaces.Data.setfloorplan(DL.Spaces.BootLoader.roomFloorData);
DL.Spaces.Data.clearHistory()
}f(k);
h.close()
},"click .no":function(k){k.preventDefault();
g(k);
h.close()
}},afterOpen:function(){d("div.modal.basic").addClass("showNoButton");
d("div.modal.basic footer .yes").text("Leave Page");
d("div.modal.basic footer .no").text("Stay")
}})
};
c.abandonChangesModalUnbind=function(){var f=d(c.abandonChangesModalSelector);
f.unbind("click.abandonChanges");
f.removeClass("blocked")
};
function e(){return jQuery.Deferred(function(f){DL.Dashboard.Main.Ajax({url:DL.Dashboard.restURLs.getDevices+DL.Dashboard.gwid+".json",type:"GET"}).done(function(g){f.resolve(g.responseMessage.content)
})
})
}function a(){return jQuery.Deferred(function(f){DL.Dashboard.Main.Ajax({url:DL.Dashboard.restURLs.getDeviceGroups+DL.Dashboard.gwid+".json",type:"GET"}).done(function(g){f.resolve(g.responseMessage.content)
})
})
}function b(){return jQuery.Deferred(function(f){DL.Dashboard.Main.Ajax({url:DL.Dashboard.getCustomerUrl,type:"GET"}).done(function(g){f.resolve(g.responseMessage.content)
})
})
}d(document.body).bind("click",function(f){if(!d(".devicePanel").has(f.target).length&&!d(f.target).hasClass("deviceExpand")){d(".devicePanel").hide();
d("#modal").hide()
}});
return c
})(jQuery);
DL.Dashboard.fullLoad=function(a){function b(){new DL.Dashboard.Views.SystemAlerts();
new DL.Dashboard.Views.Notifications();
new DL.Dashboard.Views.IdeaTank();
DL.QuickHelp.init();
DL.Dashboard.Support.init();
DL.Dashboard.UtilityNav.init();
DL.Animation.init();
if(a){a()
}}if(!DL.Dashboard.programsConfig){DL.Dashboard.Main.Ajax(DL.Dashboard.restURLs.getProgramActions,function(c){DL.Dashboard.programsConfig=c.responseMessage.content;
b()
},function(c){DL.log("There was an error processing your request.  Please try again. [Prog1]",c)
},{type:"GET"})
}else{b()
}};
DL.Dashboard.proceed=function(a,b){b=b||"";
if(a){DL.Dashboard.fullLoad(function(){$("body").find(".overlay").remove();
$("html").removeClass("systemDisabled");
DL.Dashboard.startBackbone();
DL.Dashboard.PingSession.init()
})
}else{var c=new DL.Dashboard.Views.MasterOverlay({message:b})
}$('[data-logout="logout"]').live("click",DL.Dashboard.Main.onclick_logout)
};
DL.Dashboard.startBackbone=function(){if(!DL.Dashboard.backboneStarted){DL.Dashboard.app=new Routers.App();
Backbone.history.start();
DL.Dashboard.backboneStarted=true
}else{DL.Dashboard.app.navigate("-refresh-",{trigger:true});
DL.Dashboard.app.navigate("",{trigger:true})
}};
DL.Dashboard.getGatewayStatusAndProceed=function(e){e=e||DL.Dashboard.devices.getDeviceByClassId("0000");
if(e){var a=e.getMObjectById(10),g=e.getMObjectById(1110),f=e.getMObjectById(40),d=e.getMObjectById(11),c=e.get("hasLoadedFirstTime");
if(d){DL.Dashboard.connectivity=d.get("value");
if(DL.Dashboard.connectivity==0||DL.Dashboard.connectivity==2){DL.Dashboard.connectivity="LOW"
}else{DL.Dashboard.connectivity="BROADBAND"
}}if(f&&((f.get("value")&3)!=3)){DL.Dashboard.proceed(false,"SUSPENDED");
return
}if(a){switch(a.get("value")){case"1":case"2":DL.Dashboard.proceed(false,"OFFLINE");
return
}}if(g&&g.get("value")!="0"){g=parseInt(g.get("value"),10);
if(g<0){DL.Dashboard.proceed(false,"MAINTENANCE");
return
}}if(c){DL.Dashboard.proceed(true)
}else{var b=DL.Dashboard.checkUserForAlarmPin+DL.Dashboard.gwid+".json";
DL.Dashboard.Main.Ajax(b,function(h){if(h.responseMessage.content==false){DL.Dashboard.proceed(false,"PIN")
}else{DL.Dashboard.proceed(true)
}e.set({hasLoadedFirstTime:"true"})
},null,{type:"GET"})
}}};
DL.Dashboard.getAllPrograms=function(c,b){var a=DL.Dashboard.restURLs.getPrograms+DL.Dashboard.gwid+".json";
DL.Dashboard.Main.Ajax(a,function(d){if(d.responseMessage){var e=[];
_.each(d.responseMessage.content,function(f){if(f.rules){e.push(f.rules)
}});
if(c&&typeof c=="function"){c(_.flatten(e))
}}},function(d){if(b&&typeof b=="function"){b(d)
}DL.log("There was an error processing your request.  Please try again. [Prog2]")
},{type:"GET"})
};
DL.Dashboard.getActivePrograms=function(){return jQuery.Deferred(function(b){var a=DL.Dashboard.restURLs.getPrograms+DL.Dashboard.gwid+".json";
DL.Dashboard.Main.Ajax({url:a,type:"GET"}).done(function(d,c,f){if(d.responseMessage&&d.responseMessage.code=="0"){var e=d.responseMessage.content[0].rules;
b.resolve(e)
}else{b.reject();
DL.log("There was an error processing your request.  Please try again. [Prog2]")
}})
})
};
DL.Dashboard.getDeviceClassFromDeviceId=function(c){var b,a;
for(b=0,a=DL.Dashboard.devices.models.length;
b<a;
b++){var e=DL.Dashboard.devices.models[b];
if(e.get("deviceUid")==c){return e.get("deviceClassId")
}}};
DL.Dashboard.getDeviceFromDeviceId=function(c){var b,a;
for(b=0,a=DL.Dashboard.devices.models.length;
b<a;
b++){var e=DL.Dashboard.devices.models[b];
if(e.get("deviceUid")==c){return e
}}};
DL.Dashboard.SpacesShared={inEditMode:false,inArrangeMode:false,currentFloor:false,getDevices:function(b){var a=[],c;
_.each(b,function(d){c=DL.Dashboard.getDeviceFromDeviceId(d);
if(c){a.push(c)
}});
return a
},translateRoomFloorConfig:function(b,m){var a={floors:[]},h=this;
for(var k in b){var c=b[k].rooms,f=[],g=DL.Spaces.Data.getFloorName(k),l=[];
for(var e=0,d=c.length;
e<d;
e++){rm=c[e];
if(rm.deviceLocations){l=h.getDevices(_.keys(rm.deviceLocations))
}f.push({devices:l,id:rm.id,name:rm.name})
}a.floors.push({id:k,name:(g?g:"Other"),rooms:f})
}if(m){m(a)
}else{return a
}},getDefaultRoomFloorConfig:function(l){var d={},k=this;
d.floors=[];
function b(n){var m=_.find(d.floors,function(o){return o.name==n
});
return m
}function c(m){return{id:m.attributes.location.room.id,name:m.attributes.location.room.label,devices:k.getDevices(m.get("deviceIds"))}
}for(var f=0,e=DL.Dashboard.groups.ROOM.length;
f<e;
f++){var a=DL.Dashboard.groups.ROOM.models[f],h=a.get("floor"),g;
if(h){g=b(h.label);
if(g){g.rooms.push(c(a))
}else{d.floors.push({id:h.id,name:h.label,rooms:[c(a)]})
}}}if(l){l(d)
}else{return d
}},initRoomSelection:function(b){function a(g){g.preventDefault();
var f=$(g.currentTarget),c=f.attr("data-id"),d=this;
if(!f.hasClass("selected")){DL.Spaces.Data.addRoom(b,c,function(){if(d.selectionCallback){d.selectionCallback(b,c)
}})
}}this.roomModal.modalContent.find(".homeModalHeader").html("SELECT FLOOR");
this.roomModal.modalContent.find(".floorList a").bind("click",$.proxy(a,this))
},openCreateRoomModal:function(d,c,a){var b=this;
if(d&&d instanceof Function){this.selectionCallback=d
}this.roomModal=new DL.Dashboard.ModalBase({template:"modals/spacesCreateRoom",data:{rooms:c||DL.Spaces.BootLoader.possibleRooms,floors:a||DL.Spaces.BootLoader.possibleFloors},afterOpen:function(e){$(".thinGreyScrollbar",e).jScrollPane({autoReinitialise:true,maintainPosition:false,verticalGutter:30,verticalDragMaxHeight:40});
e.find(".roomList li a").bind("click",$.proxy(b.onclick_roomInList,b))
}})
},markFloorsInactive:function(e,d){var g,f,c,b,a=DL.Spaces.Data.floorplan();
for(g in a){f=a[g].rooms;
for(c=0,b=f.length;
c<b;
c++){if(f[c].id==e){d.find('a[data-id="'+a[g].id+'"]').addClass("selected")
}}}},onclick_roomInList:function(c){c.preventDefault();
var b=$(c.currentTarget),a=b.attr("data-id"),d=b.parents(".choices");
d.addClass("floorView");
this.markFloorsInactive(a,d.find(".floorList"));
this.initRoomSelection(a)
}};
DL.Dashboard.Support={urls:null,onclick_supportLink:function(d){d.preventDefault();
var c=$(d.currentTarget),a=this.urls[c.attr("data-location")],b=a?a:c.attr("href");
DL.Dashboard.UtilityNav.showSupportCenterModal(b);
this.onclick_iframePing();
return false
},onclick_iframePing:function(){$("#supportCenter").load(function(){$(this).contents().find("body").unbind("click").bind("click",function(){DL.Dashboard.PingSession.on_userInteraction()
})
})
},onclick_screenHelp:function(d){d.preventDefault();
var c=$(d.currentTarget);
var a=c.attr("data-location");
var b=this;
DL.Dashboard.UtilityNav.toggleDropdown(null,true);
this.screenHelp=new DL.Dashboard.OnScreenHelp({page:a,afterClose:function(){b.screenHelp=null
}});
return false
},init:function(){var a=this;
$('a[data-command="TO_SUPPORT"]').live("click",$.proxy(this.onclick_supportLink,this));
$('a[data-command="ON_SCREEN"]').live("click",$.proxy(this.onclick_screenHelp,this));
DL.Dashboard.Main.Ajax(DL.Dashboard.getSupportUrls,function(b){a.urls=b.responseMessage.content
},function(b){},{type:"GET"})
}};
DL.Dashboard.UtilityNav={dropDown:null,closeDropDown:function(a){if(a.hasClass("ddOpen")){a.removeClass("ddOpen").fadeOut(100);
a.find(".dropDownWrap").css({display:"none"})
}},onclick_window:function(c){var b=$(c.target),a=b.parents(".dropdown:first");
if(a.length<1){this.closeDropDown($("#container .dropdown.ddOpen"));
$(window).unbind("click",this.onclick_window)
}},toggleDropdown:function(h,f){var d=$("#container .topSection"),b=d.find(".dropdown"),g=this;
if(f){_.each(b,function(k){g.closeDropDown($(k))
})
}else{if(h&&h.length>0){var c=h.siblings(".dropdown"),e=_.without(b,c[0]),g=this;
function a(k){g.closeDropDown(d.find("dropdown.ddOpen"))
}if(!c.hasClass("ddOpen")){_.each(e,function(k){g.closeDropDown($(k))
});
c.fadeIn(250);
c.find(".dropDownWrap").slideDown(350,function(){c.addClass("ddOpen");
$(window).bind("click",$.proxy(g.onclick_window,g));
if(c.hasClass("settingsDD")){c.find(".ddBody a").monobind("click",DL.Common.onclick_forceNavigate)
}})
}else{this.closeDropDown(c)
}}}},setPageHelp:function(c,b){var a=$("#container .supportDD");
a.find('[data-action="PAGE_HELP"]').attr("data-location",b);
a.find('[data-command="ON_SCREEN"]').attr("data-location",c.split(" ").join("_").toUpperCase()+"_SCREEN")
},toggleIdeaTank:function(a){var b=a.find(".wrap");
if(a.data("open")){b.slideUp(function(){a.css({display:"none"});
a.data("open",false)
})
}else{a.fadeIn(100);
b.slideDown(function(){a.data("open",true)
})
}},showSettingsModal:function(a){var b=DL.ServerSecurePath+DL.ContextUrl+"/secure/account/manage/"+DL.Dashboard.version+"/settingsModal.html?dplnk=";
if(!(typeof a==="undefined")&&a!=null){b=b+a
}this.toggleDropdown(null,true);
DL.Dashboard.Main.Ajax(b,function(c){new DL.Dashboard.ModalBase({templateCode:c,afterOpen:function(){DL.ManageAccount.initMenu($(".inModalNavigation",this.containerSelector),$("#manageFrame",this.containerSelector))
}})
},null,{type:"GET"},true)
},showAccountModal:function(b,c){var a=DL.ServerSecurePath+DL.ContextUrl+"/secure/account/manage/"+DL.Dashboard.version+"/myAccountModal.html";
if(c!="editMyself"){a=a+"?dplnk="+c
}this.toggleDropdown(null,true);
DL.Dashboard.Main.Ajax(a,function(d){new DL.Dashboard.ModalBase({templateCode:d,afterOpen:function(){DL.ManageAccount.initMenu($(".inModalNavigation",this.containerSelector),$("#manageFrame",this.containerSelector));
if(c=="editMyself"){$("#manageFrame").attr("src",DL.ServerSecurePath+DL.ContextUrl+"/secure/account/manage/myAccount/components/profile/accounts/update.html?mode=edit&uuid="+DL.Dashboard.customer.userId+"&type=MASTER&selectedGatewayGuid="+DL.Dashboard.customer.selectedGateway)
}},afterClose:function(){if(c=="editmaster"){var e=window.location.href.indexOf("#");
window.location.href=window.location.href.slice(0,e)
}}})
},null,{type:"GET"},true)
},showSupportCenterModal:function(a){this.toggleDropdown(null,true);
var b=new DL.Dashboard.ModalBase({template:"modals/supportCenter",data:{srcUrl:a}})
},onclick_supportCenter:function(a){a.preventDefault();
this.showSupportCenterModal()
},onclick_settings:function(a){a.preventDefault();
this.showSettingsModal($(a.currentTarget))
},onclick_myAccount:function(a){a.preventDefault();
this.showAccountModal($(a.currentTarget))
},onclick_showDropDown:function(a){a.preventDefault();
this.toggleDropdown($(a.currentTarget))
},onclick_showIdeaTank:function(a){a.preventDefault();
this.toggleIdeaTank($("#container .ideaTank"))
},init:function(a){this.context=$("body");
this.context.find(".topSection .userSet, .topSection .userHelp").bind("click",$.proxy(this.onclick_showDropDown,this));
this.context.find(".topSection .userMsg").bind("click",$.proxy(this.onclick_showIdeaTank,this))
}};
DL.Dashboard.PingSession={localNetwork:false,url:DL.Dashboard.pingSession+".json",interactionTimeout:null,interactionDuration:30*1000,timedOutModal:null,hasInteracted:false,reset:function(){this.clearInteraction();
this.detectInteraction()
},clearInteraction:function(){this.hasInteracted=false;
window.clearTimeout(this.interactionTimeout);
this.interactionTimeout=null
},ping:function(){var a=this;
DL.Dashboard.Main.Ajax(this.url,function(b){a.reset()
},function(b){a.errorModal=new DL.Dashboard.ModalBase({template:"modals/basic",data:{confirm:"OK",title:"Unexpected Error",body:"Inactivity Logout. For your security, you have been logged out and will be returned to the log-in screen."},afterClose:function(){DL.Dashboard.finalize()
},customEvents:{"click .yes":function(c){c.preventDefault();
a.errorModal.close()
}}})
},{type:"GET"})
},modal:function(){var a=this;
this.timedOutModal=new DL.Dashboard.ModalBase({template:"modals/basic",data:{confirm:"YES",title:"ARE YOU STILL HERE?",body:'Your session will expire shortly. Click "YES" to stay logged in. Otherwise, you will be logged out for your security.'},afterClose:function(){a.ping()
},customEvents:{"click .yes":function(b){b.preventDefault();
a.timedOutModal.close();
a.timedOutModal=null
}}})
},on_userInteraction:function(a){this.hasInteracted=true
},detectInteraction:function(){var a=this;
this.interactionTimeout=setTimeout(function(){if(a.hasInteracted){a.ping()
}else{a.reset()
}},this.interactionDuration)
},init:function(){this.detectInteraction();
$(window).bind("mousedown",$.proxy(this.on_userInteraction,this))
}};
$(function(){DL.Dashboard.Main.init()
});
var DL=window.DL||{};
DL.QuickHelp={newUser:null,enabled:null,over:false,timeout:null,duration:250,create:function(e){this.hide();
if(e){var a=$("<div>"),b=this.setQuickhelpContent(e.attr("data-quickhelp"),e),d=null,c=this;
a.addClass("quickhelp helper").css({opacity:0,display:"block"});
a.html('<p></p><div class="qhContainer"><div class="arrow up"></div>');
$("body").append(a);
this.populate(b,d);
this.position(e);
e.monobind("mouseleave",function(f){c.over=false;
c.timeout=setTimeout(function(){if(!c.over){c.hide()
}},c.duration)
})
}},hide:function(){var a=$(".quickhelp.helper");
this.over=false;
this.timeout=null;
a.animate({opacity:0},250,function(){a.remove()
})
},onmouseover_element:function(f){this.over=true;
var d=$(f.currentTarget),a=this,b=setTimeout(function(){if(a.over&&d){d.unbind("mouseleave",c);
a.create($(f.currentTarget))
}},1500);
function c(g){a.over=false;
if(d){d.unbind("mouseleave",c);
d=null
}b=null
}d.bind("mouseleave",c)
},init:function(){$("[data-quickhelp]").live("mouseover",$.proxy(this.onmouseover_element,this))
},setQuickhelpContent:function(c,a){if(c==="GET_CONTENT"){var b=a.next(".quickHelpContent");
b=b.length?b:a.parent().siblings(".quickHelpContent");
return b.length?b.html():c
}return c
},populate:function(a,c){var d=$(".quickhelp.helper"),b=d.find("a");
d.find("p").html(a);
if(c!=null){b.attr("data-location",c)
}else{d.addClass("no-link")
}},position:function(g){var a=g.offset(),h=g.width(),d=g.height(),b=$(document).width(),k=Math.floor(b/2),c=0,f=0,l=$(".quickhelp.helper");
paddingBottom=(g.css("padding-bottom").replace("px",""))*1;
paddingTop=(g.css("padding-top").replace("px",""))*1;
paddingLeft=(g.css("padding-left").replace("px",""))*1;
paddingRight=(g.css("padding-right").replace("px",""))*1;
if(a.left||a.top){if(a.left>k){var e=a.left+h+paddingLeft+paddingRight;
c=e-l.width();
if(h<34){c=c+Math.ceil((38-h)/2)
}l.find(".arrow").addClass("right")
}else{c=a.left;
if(h<34){c=c-Math.ceil((38-h)/2)
}l.find(".arrow").addClass("left")
}f=a.top+d+paddingTop+paddingBottom;
l.monobind("mouseenter",function(m){DL.QuickHelp.over=true
});
l.css({left:c,top:f}).animate({opacity:1},250,function(){l.bind("mouseleave",function(m){DL.QuickHelp.hide()
})
})
}}};
DL.Dashboard.ModalBase=Backbone.View.extend({modalOverlay:$('<div class="modal-overlay" />'),el:$("#app"),data:{},isOldIE:false,initialize:function(){DL.PubSub.subscribe("onnotificationpanelanimation",$.proxy(this.adjustPlacement,this));
this.pageTemplate=this.options.template||null;
this.withOverlay=this.options.withOverLay||true;
this.data=this.options.data||{};
if(typeof this.options.preInitialize=="function"){this.options.preInitialize()
}if(this.pageTemplate){this.template=DL.Dashboard.getTemplate(this.pageTemplate)
}this.containerSelector=this.options.containerSelector?$(this.options.containerSelector):$("body");
if(navigator.userAgent.indexOf("MSIE 7")>-1||navigator.userAgent.indexOf("MSIE 8")>-1){this.isOldIE=true
}this.render()
},render:function(){var a=this.options.customEvents;
this.cleanup();
this.modalContent=this.options.templateCode?$(this.options.templateCode):$.tmpl($(this.template),this.data||{});
this.modalContent.find(".close, .closeButton").monobind("click",$.proxy(this.onclick_closeModal,this));
this.containerSelector.append(this.modalContent);
if(this.withOverlay){this.modalOverlay.css({display:"none"});
this.containerSelector.append(this.modalOverlay);
if($.browser.msie&&$.browser.version.substr(0,1)<=8){this.modalOverlay.removeAttr("style")
}}if(a){for(var c in a){var b=c.split(" ");
this.modalContent.find(b[1]).monobind(b[0],a[c])
}}if(_.isFunction(this.options.beforeOpen)){$.proxy(this.options.beforeOpen,this)(this.modalContent)
}this.open()
},onclick_closeModal:function(a){a.preventDefault();
this.close()
},cleanup:function(){var b=$(".modal"),a=$(".modal-overlay");
if(b.length>0){b.remove();
a.remove()
}},center:function(){var f=this.isOver=$("body").find("#statusAlertList.expanded").length>0,a=this.modalContent.outerWidth(),b=this.modalContent.outerHeight(),d=0,c=0,e;
if(this.isOldIE){d=document.documentElement.clientWidth-a;
c=document.documentElement.clientHeight-b
}else{d=window.innerWidth-a;
c=window.innerHeight-b
}e=(c-Math.round(c/2))+(document.documentElement&&document.documentElement.scrollTop?document.documentElement.scrollTop:document.body.scrollTop);
if(e<50){e=50
}this.modalContent.css({position:"absolute",left:((d-Math.round(d/2)+(f?280:0)))+"px",top:e+"px"})
},close:function(){var a=this;
this.modalContent.fadeOut(500,function(){a.modalContent.remove();
if(a.options.afterClose){a.options.afterClose(a.modalContent)
}});
this.modalOverlay.fadeOut(500,function(){a.modalOverlay.remove()
});
this.isOpen=false;
$("body").css("overflow","auto");
$(window).unbind("resize");
$(window).unbind("scroll",$.proxy(this.center,this))
},open:function(a){this.center();
this.modalOverlay.fadeIn(500);
this.modalContent.fadeIn(500);
this.isOpen=true;
if(_.isFunction(this.options.afterOpen)){$.proxy(this.options.afterOpen,this)(this.modalContent)
}$(window).bind("resize",$.proxy(this.checkModalHeight,this));
this.checkModalHeight()
},adjustPlacement:function(c,d){var b=parseInt(this.modalContent.css("left")),a=280;
if(this.isOpen&&d=="open"&&!this.isOver){this.isOver=true;
this.modalContent.animate({left:b+a})
}else{if((this.isOpen&&d=="close")||(this.isOpen&&d=="init"&&this.isOver)){this.isOver=false;
this.modalContent.animate({left:b-a})
}}},checkModalHeight:function(){var a=this.modalContent.height()+this.modalContent.offset().top,b=window.innerHeight,c=$("body").css("overflow");
if(a>b&&c=="hidden"){c="auto";
$("body").css("overflow",c)
}else{if(a<b&&c!="hidden"){c="hidden";
$("body").css("overflow",c)
}}if(c=="hidden"){this.center()
}}});
DL.Dashboard.LoadingBase=Backbone.View.extend({loadingOverlay:$('<div class="loading-overlay"></div>'),loader:$('<div class="loading-overlay-content"><div class="loading-overlay-top">AT&T Digital Life™</div><div class="loading-overlay-bottom">Loading<div id="ajaxSpinner_lg"></div></div><div class="loading-overlay-message"></div></div>'),modalCount:0,initialize:function(a){if(!_.isEmpty(a)){this.loader.addClass("loading-message");
this.loader.find(".loading-overlay-message").text(a).show()
}else{this.loader.find(".loading-overlay-message").hide();
this.loader.removeClass("loading-message")
}this.render()
},render:function(){var a=$("body");
this.cleanup();
a.append(this.loadingOverlay);
a.append(this.loader);
this.open()
},cleanup:function(){var a=$("body").find(".loading-overlay, .loading-overlay-content");
if(a.length){a.remove()
}},close:function(){this.loadingOverlay.remove();
this.loader.remove()
},open:function(b){var a=this;
this.loadingOverlay.show();
this.loader.fadeIn(500);
if(typeof a.options.afterOpen==="function"){a.options.afterOpen()
}}});
DL.Dashboard.IntroWizard=Backbone.View.extend({activeSlide:0,activeNav:0,activePair:0,oActiveSlide:new Object,hasSpaces:false,initialize:function(){this.template=DL.Dashboard.getTemplate("introWizard");
this.page=this.options.page;
this.render()
},render:function(){var a=$("body"),b=$(this.el).html($.tmpl($(this.template)));
a.prepend(b);
this.wizard=a.find(".introWizard");
this.mainNav=a.find(".navItems");
this.controls=this.wizard.find(".controls");
this.slideLength=this.wizard.find(".slide").length;
this.container=this.wizard.find(".container");
if(!this.hasSpaces){this.container.addClass("no-spaces")
}this.open()
},close:function(){this.remove();
Backbone.history.navigate("#",true)
},events:{"click .next":"moveNext","click .previous":"movePrevious","click .replay":"replay","click .finish":"finish","click .getStarted":"getStarted"},open:function(a){this.wizard.find(".slide:first").show();
this.wizard.find(".navIcons img:first").show();
this.wizard.fadeIn(500)
},resetMainNav:function(){this.mainNav.find("a").css({visibility:"visible"})
},setNavElement:function(a){a.css({visibility:"hidden"})
},getStarted:function(a){a.preventDefault();
this.wizard.find(".welcomeScreen").hide();
this.resetMainNav();
this.setNavElement(this.mainNav.find("a:eq("+this.activeSlide+")"));
this.container.show()
},finish:function(a){a.preventDefault();
this.resetMainNav();
var b=this;
DL.Dashboard.Main.Ajax({url:DL.Dashboard.restURLs.introWizard+"?value=true",type:"POST",complete:function(){b.close()
}})
},setComposite:function(){if(this.oActiveSlide.hasClass("composite")){this.controls.addClass("composite")
}else{this.controls.removeClass("composite")
}},setNavAndShowSlide:function(){this.oActiveSlide=this.wizard.find(".slide:eq("+this.activeSlide+")");
this.oActiveSlide.show();
this.resetMainNav();
this.setComposite();
var b=this.oActiveSlide.attr("data-page"),a=this.wizard.find(".steps");
a[0].className="steps";
a.addClass(b);
if(b!="utility"){this.setNavElement(this.mainNav.find('a[href="#'+b+'"]'))
}},moveNext:function(a){if(a){a.preventDefault()
}this.wizard.find(".slide:eq("+this.activeSlide+")").hide();
this.wizard.find(".previous").show();
this.activeSlide++;
this.setNavAndShowSlide();
if(this.oActiveSlide.hasClass("legacy")){this.activeNav++;
this.activePair++
}if(this.activeSlide==(this.slideLength-1)){this.wizard.find(".next").hide();
this.wizard.find(".finish").show();
this.wizard.find(".replay").show()
}},movePrevious:function(a){if(a){a.preventDefault()
}this.wizard.find(".slide:eq("+this.activeSlide+")").hide();
this.wizard.find(".next").show();
this.activeSlide--;
this.setNavAndShowSlide();
if(this.oActiveSlide.hasClass("legacy")){this.activePair--;
this.activeNav--
}if(this.activeSlide==0){this.wizard.find(".previous").hide()
}this.wizard.find(".finish").hide();
this.wizard.find(".replay").hide()
},replay:function(a){a.preventDefault();
this.wizard.find(".alarmIndicatorOverlay").show();
this.wizard.find("a.next").show();
this.wizard.find(".slide:eq("+this.activeSlide+")").hide();
this.wizard.find(".finish").hide();
this.wizard.find(".replay").hide();
this.wizard.find(".previous").hide();
this.activeSlide=this.activePair=this.activeNav=0;
this.setNavAndShowSlide()
}});
var DL=window.DL||{};
DL.Dashboard=DL.Dashboard||{};
DL.Dashboard.Models={Device:Backbone.Model.extend({defaults:{},idAttribute:"deviceUid",initialize:function(){var a=this;
this.url=DL.Dashboard.restURLs.base+DL.Dashboard.gwid+"/"+this.id+".json";
a.managedObjects=new DL.Dashboard.Collections.ManagedObjects();
_.each(this.attributes.managedObjectList,function(b,c){b.label=b.label.split(" ").join("_");
_.extend(b,{parentModel:a});
a.managedObjects.add(b)
})
},getViewName:function(){var c=this,a=null;
function b(g){for(var e=0,d=c.viewMappings.items.length;
e<d;
e++){var f=c.viewMappings.items[e];
if(f.deviceClassId==g){a=f;
return true
}}return false
}if(b(this.attributes.deviceClassId+this.attributes.deviceSubClassId)){return a.viewName
}else{return"Device"
}},setAlternateStatus:function(a){this.set({statusAlternate:a},{silent:true});
if(!this.get("spacesTile")){this.change()
}},getMObjectById:function(d){for(var c=0,b=this.managedObjects.models.length;
c<b;
c++){var a=this.managedObjects.models[c];
if(a.attributes.mObjectID==d){return a;
break
}}},timeOutMonitor:{timeout:null,start:function(b,a,c){this.timeout=setTimeout(function(){var d=DL.Dashboard.restURLs.getDevices+DL.Dashboard.gwid+".json";
DL.Dashboard.Main.Ajax(d,function(e){if(e.responseMessage&&e.responseMessage.code=="0"){DL.Dashboard.devices=new DL.Dashboard.Collections.Devices();
_.each(e.responseMessage.content,function(f){DL.Dashboard.devices.add(f)
});
if(c){c()
}}},null,{type:"GET"})
},b)
},clear:function(){if(this.timeout){window.clearTimeout(this.timeout);
this.timeout=null
}}},viewMappings:{items:[{deviceClassId:"010200",viewName:"ContactSensor"},{deviceClassId:"011101",viewName:"GarageTiltSensor"},{deviceClassId:"010300",viewName:"MotionSensor"},{deviceClassId:"010401",viewName:"WaterTempSensor"},{deviceClassId:"010601",viewName:"SmokeDetector"},{deviceClassId:"010800",viewName:"GlassBreakSensor"},{deviceClassId:"010E00",viewName:"CO2Sensor"},{deviceClassId:"020600",viewName:"IPCamera"},{deviceClassId:"020601",viewName:"IPCamera"},{deviceClassId:"020602",viewName:"IPCamera"},{deviceClassId:"030100",viewName:"PowerControl"},{deviceClassId:"030602",viewName:"LightControl"},{deviceClassId:"030606",viewName:"LightControl"},{deviceClassId:"030800",viewName:"DoorLock"},{deviceClassId:"031001",viewName:"WaterShutOffValue"},{deviceClassId:"040002",viewName:"Thermostat"},{deviceClassId:"050600",viewName:"TakeOverModule"},{deviceClassId:"060100",viewName:"Siren"}]}}),ManagedObject:Backbone.Model.extend({initialize:function(){var a=this.get("parentModel").id;
this.url=DL.Dashboard.restURLs.set+DL.Dashboard.gwid+"/"+a+"/"+this.get("mObjectID")+"/#.json";
this.id=a+"_"+(this.get("mObjectID").toString())
},setNewVal:function(b){var a=this.url.replace("#",b);
DL.Dashboard.Main.Ajax({type:"post",url:a,success:function(c){DL.log("success")
},error:function(c){DL.log("error"+c)
}})
}}),Group:Backbone.Model.extend({}),PageBase:Backbone.Model.extend({}),Program:Backbone.Model.extend({})};
DL.Dashboard.Collections={Devices:Backbone.Collection.extend({model:DL.Dashboard.Models.Device,initialize:function(){if(!_.isUndefined(DL.Dashboard.devices)){DL.PubSub.unsubscribe(DL.Dashboard.devices.token)
}this.token=DL.PubSub.subscribe("onmessagereceived",this.updateDevice)
},updateDevice:function(d,f){if(f.dev&&f.MOID){var b=DL.Dashboard.devices.get(f.dev);
if(typeof b!="undefined"){var c=f.dev+"_"+f.MOID,a=b.managedObjects.get(c);
if(typeof a!="undefined"){a.set({value:f.value,silent:true})
}if(f.MOID=="0"){b.attributes.label=f.value
}}if(f.MOID=="80"){DL.Dashboard.Main.loadingEnd();
DL.Dashboard.Main.rawDevicesLoader("A change has been made that requires updating your devices, please wait...",function(){DL.Dashboard.Views.Notifications.prototype.setUpAlerts();
new DL.Dashboard.Views.SystemAlerts();
var e=Backbone.history.fragment;
DL.Dashboard.app.navigate("-refresh-",{trigger:true});
DL.Dashboard.app.navigate(e,{trigger:true})
})
}}},getDevicesByCategory:function(){var a={};
_.each(this.models,function(b){var c=b.attributes.deviceClassId;
if(!a[c]){a[c]=[b.id]
}else{a[c].push(b.id)
}});
return a
},getDeviceByClassId:function(c,b){var f=[];
for(var e=0,d=this.models.length;
e<d;
e++){var a=this.models[e];
if(a.attributes.deviceClassId+(b?a.attributes.deviceSubClassId:"")==c){f.push(a)
}}if(f.length>1){return f
}return f[0]
},getDeviceById:function(d){for(var c=0,b=this.models.length;
c<b;
c++){var a=this.models[c];
if(a.attributes.deviceUid==d){return a;
break
}}return false
},getClassIdFromDevicesId:function(e,b){for(var d=0,c=this.models.length;
d<c;
d++){var a=this.models[d];
if(a.attributes.deviceUid==e){return a.attributes.deviceClassId+(b?a.attributes.deviceSubClassId:"");
break
}}},getAllMonitoredDevices:function(){var b=[];
for(var d=0,c=this.models.length;
d<c;
d++){var a=this.models[d];
if(a.attributes.statusAlternate=="monitored"){b.push(a)
}}return b
},getAllBypassedDevices:function(){var d=[];
for(var c=0,b=this.models.length;
c<b;
c++){var a=this.models[c];
if(a.attributes.statusAlternate=="bypassed"){d.push(a)
}}return d
},getAllAlarmDevices:function(){var d=[];
for(var c=0,b=this.models.length;
c<b;
c++){var a=this.models[c];
if(a.attributes.statusAlternate=="alarm"){d.push(a)
}}return d
},renderDeviceView:function(e,g,a,f,l){var h=this.get(e);
if(h==null){return false
}var k=h.getViewName(),m=a||false,c=f||false;
if(l){h.set({spacesTile:true},{silent:true})
}if(DL.Dashboard.Views[k]!==undefined){var b=new DL.Dashboard.Views[k]({model:h,containerSelector:$(g),xy:l});
if(m){b.editState(h.id)
}if(c){b.disable(h.id)
}return true
}else{var b=new DL.Dashboard.Views.Device({model:h,containerSelector:$(g)})
}}}),ManagedObjects:Backbone.Collection.extend({model:DL.Dashboard.Models.ManagedObject,getAttributesAndValues:function(){var a={};
_.each(this.models,function(b){a[b.get("label")]=b.get("value")
});
return a
},getObjectByLabel:function(a){return _.find(this.models,function(b){return b.get("label")==a
})
}}),Groups:Backbone.Collection.extend({model:DL.Dashboard.Models.Group}),Programs:Backbone.Collection.extend({model:DL.Dashboard.Models.Program,initialize:function(){DL.PubSub.subscribe("onprogrammessagerecevied",$.proxy(this.handleMessage,this))
},getOne:function(a){return _.find(this.models,function(b){return b.id==a
})
},getActive:function(){return _.filter(this.models,function(a){return parseInt(a.get("status"),10)==2
})
},getOnHold:function(){return _.filter(this.models,function(a){return parseInt(a.get("status"),10)!=2
})
},handleMessage:function(b,a){this.refresh()
},run:function(b,a){DL.Dashboard.Main.Ajax(DL.Dashboard.restURLs.executeASpecificRule+DL.Dashboard.gwid+"/"+b+".json",function(c){if(a){a(c)
}},function(c){if(c.responseMessage.message){alert(c.responseMessage.message)
}else{alert("There was an error processing your request.  Please try again. [cam1]")
}if(a){a(c.responsMessage.content)
}},{type:"GET"})
},edit:function(b,c){var a=DL.ServerSecurePath+DL.ContextUrl+"/secure/dashboard.html#programs/edit/"+b+"/"+c;
window.location.href=a
},destroy:function(b){var a=DL.ServerSecurePath+DL.ContextUrl+"/secure/services/rules/delete/"+DL.Dashboard.gwid+"/"+b.id+".json";
var c=this;
DL.Dashboard.Main.Ajax(a,function(d){c.remove(b,{silent:true})
},null,{type:"POST"})
},destroyAll:function(){var a=DL.ServerSecurePath+DL.ContextUrl+"/secure/services/rules/delete/all/rules/"+DL.Dashboard.gwid+".json";
this.reset();
DL.Dashboard.Main.Ajax(a,null,null,{type:"POST"})
},update:function(d,c){var a=this.getOne(d);
var b=DL.ServerSecurePath+DL.ContextUrl+"/secure/services/rules/"+DL.Dashboard.version+"/"+DL.Dashboard.gwid+"/"+d+".json";
a.set(c);
a=JSON.stringify(a.toJSON());
DL.Dashboard.Main.Ajax(b,null,null,{type:"POST",data:a,contentType:"application/json"})
},isLoading:false,refresh:function(){var a=this;
if(!this.isLoading){this.isLoading=true;
DL.Dashboard.getAllPrograms(function(b){a.isLoading=false;
a.reset(b);
DL.PubSub.publish("programsrerender",true)
})
}}})};
var Routers=window.Routers||{};
Routers.App=Backbone.Router.extend({initialize:function(){var a=this;
this.currentView=null;
this.main=$("#main");
this.header=$("#hdrWrap");
this.controls=$("#controlWrap");
this.app=$("#app");
this.pagination=$("#paginationWrap");
$("#container .navItems a").monobind("click",function(b){a.setActiveSection($(b.currentTarget))
})
},hasPermission:function(a){if(_.isArray(a)&&a.length){if(_.intersection(a,DL.Dashboard.customer.permissions).length){return true
}return false
}},setActiveSection:function(a){if(a&&!a.hasClass("on")&&!a.hasClass("blocked")){$("#container .navItems a").removeClass("on");
a.addClass("on");
this.cleanUpView()
}},cleanUpView:function(){this.currentView=null;
this.header.html("");
this.controls.html("");
this.app.html("");
DL.QuickHelp.hide();
this.main.find(".homeBuckets").remove()
},routes:{"":"index",spaces:"spaces","spaces/arrange":"spacesArrange","spaces/customize":"spacesCustomize","spaces/perspective":"spacesPerspective",devices:"devices","devices/:type":"devices","devices/:type/:page":"devices",custom:"customView","custom/new":"customViewNew","custom/view/:viewId":"customView","custom/edit/:viewId":"customViewEdit",programs:"programs","programs/intro":"programsIntro","programs/home":"programsHome","programs/create/:section":"programsCreate","programs/edit/:section/:programId":"programsEdit","myaccount/:dplnk":"myaccount","settings/:dplnk":"settings",tutorial:"introWizard"},routeToLogin:function(){window.location.href=DL.ServerSecurePath+DL.ContextUrl+"/login.html"
},index:function(){this.setActiveSection($("#container .navHome"));
this.currentView=new DL.Dashboard.Views.HomePage({collection:DL.Dashboard.devices});
DL.Dashboard.UtilityNav.setPageHelp("Home","HOME_HELP_URL")
},spaces:function(){if(this.hasPermission(["MANAGE_PROGRAMS"])){this.setActiveSection($("#container .navSpaces"));
this.currentView=new DL.Dashboard.Views.Spaces();
DL.Dashboard.UtilityNav.setPageHelp("Spaces","SPACES_HELP_URL")
}else{this.index()
}},spacesArrange:function(){if(this.hasPermission(["MANAGE_PROGRAMS"])){this.setActiveSection($("#container .navSpaces"));
this.currentView=new DL.Dashboard.Views.SpacesArrange();
DL.Dashboard.UtilityNav.setPageHelp("Spaces","SPACES_HELP_URL")
}else{this.index()
}},spacesCustomize:function(){if(this.hasPermission(["MANAGE_PROGRAMS"])){this.setActiveSection($("#container .navSpaces"));
this.currentView=new DL.Dashboard.Views.SpacesCustomize();
DL.Dashboard.UtilityNav.setPageHelp("Spaces","SPACES_HELP_URL")
}else{this.index()
}},spacesPerspective:function(){if(this.hasPermission(["MANAGE_PROGRAMS"])){this.setActiveSection($("#container .navSpaces"));
this.currentView=new DL.Dashboard.Views.SpacesPerspective();
DL.Dashboard.UtilityNav.setPageHelp("Spaces","SPACES_HELP_URL")
}else{this.index()
}},devices:function(a){this.setActiveSection($("#container .navList"));
a=a||"type";
var b=(a=="room")?DL.Dashboard.groups.ROOM:DL.Dashboard.groups.TYPE;
this.currentView=new DL.Dashboard.Views.DevicesView({collection:b,model:new DL.Dashboard.Models.PageBase(),type:a});
DL.Dashboard.UtilityNav.setPageHelp("Devices","DEVICES_HELP_URL")
},customView:function(a){this.setActiveSection($("#container .navCustom"));
function c(){var d=a=="defaultView"?"Custom Views Sample":"Custom Views";
this.currentView=new DL.Dashboard.Views.CustomView({model:b,isDefaultView:a=="defaultView"?true:false});
DL.Dashboard.UtilityNav.setPageHelp(d,"CUSTOM_VIEWS_HELP_URL")
}if(a!="defaultView"){var b=DL.Dashboard.groups.CUSTOM.get(a);
if(b!=null){c();
return
}else{if(DL.Dashboard.groups.CUSTOM.models.length>0){window.location.hash="#custom/view/"+DL.Dashboard.groups.CUSTOM.models[0].id;
return
}else{this.customView("defaultView");
return
}}}c()
},customViewEdit:function(a){this.setActiveSection($("#container .navCustom"));
var b=DL.Dashboard.groups.CUSTOM.get(a);
if(b==null){window.location.hash="#custom/new"
}else{this.currentView=new DL.Dashboard.Views.CustomViewEdit({model:b})
}DL.Dashboard.UtilityNav.setPageHelp("Edit Custom Views","CUSTOM_VIEWS_HELP_URL")
},customViewNew:function(a){this.cleanUpView();
this.currentView=new DL.Dashboard.Views.CustomViewNew({model:new DL.Dashboard.Models.PageBase});
DL.Dashboard.UtilityNav.setPageHelp("Edit Custom Views","CUSTOM_VIEWS_HELP_URL")
},programs:function(){if(this.hasPermission(["MANAGE_PROGRAMS"])){window.scroll(0,0);
this.setActiveSection($("#container .navPrograms"));
this.currentView=new DL.Dashboard.Views.ProgramsHome();
DL.Dashboard.UtilityNav.setPageHelp("Programs","PROGRAMS_HELP_URL")
}else{this.index()
}},programsIntro:function(){if(this.hasPermission(["MANAGE_PROGRAMS"])){this.setActiveSection($("#container .navPrograms"));
this.currentView=new DL.Dashboard.Views.ProgramsIntro({el:$("#app"),model:new DL.Dashboard.Models.PageBase});
DL.Dashboard.UtilityNav.setPageHelp("Programs Intro","PROGRAMS_HELP_URL")
}else{this.index()
}},programsCreate:function(a){if(this.hasPermission(["MANAGE_PROGRAMS"])){this.setActiveSection($("#container .navPrograms"));
this.cleanUpView();
if(!a){Routers.App.programsIntro();
return
}this.currentView=new DL.Dashboard.Views.ProgramsCreate({el:$("#app"),section:a});
DL.Dashboard.UtilityNav.setPageHelp("Programs Create","PROGRAMS_HELP_URL")
}else{this.index()
}},programsEdit:function(c,b){if(this.hasPermission(["MANAGE_PROGRAMS"])){if(!c&&!b){Routers.App.programsIntro();
return
}this.setActiveSection($("#container .navPrograms"));
var a=DL.Dashboard.allSavedPrograms.getOne(b);
if(a&&a!="undefined"){this.currentView=new DL.Dashboard.Views.ProgramsCreate({el:$("#app"),section:c,programId:b,editableProgram:true})
}DL.Dashboard.UtilityNav.setPageHelp("Programs Create","PROGRAMS_HELP_URL")
}else{this.index()
}},myaccount:function(a){var c={billingnpayment:["VIEW_BILLINGS_AND_PAYMENT"],useraccounts:["CREATE_FULL_ACCOUNT","CREATE_CUSTOM_ACCOUNT","CREATE_GUEST_ACCOUNT","EDIT_MASTER_ACCOUNT","EDIT_SELF_ACCOUNT","EDIT_OTHER_FULL_ACCOUNTS","EDIT_OTHER_CUSTOM_ACCOUNTS","EDIT_OTHER_GUEST_ACCOUNTS","DELETE_OTHER_FULL_ACCOUNTS","DELETE_OTHER_CUSTOM_ACCOUNTS","DELETE_OTHER_GUEST_ACCOUNTS"],emergencycontacts:["MANAGE_EMERGENCY_CONTACTS"],permitndoc:["VIEW_PERMITS_AND_DOCUMENTS"]},b=c[a];
if(!b||this.hasPermission(b)){this.setActiveSection($("#container .navHome"));
this.currentView=new DL.Dashboard.Views.HomePage({collection:DL.Dashboard.devices});
DL.Dashboard.UtilityNav.setPageHelp("Home","HOME_HELP_URL");
DL.Dashboard.UtilityNav.showAccountModal(false,a)
}},settings:function(a){if(this.hasPermission(["VIEW_SETTINGS"])){this.setActiveSection($("#container .navHome"));
this.currentView=new DL.Dashboard.Views.HomePage({collection:DL.Dashboard.devices});
DL.Dashboard.UtilityNav.setPageHelp("Home","HOME_HELP_URL");
DL.Dashboard.UtilityNav.showSettingsModal(a)
}else{this.index()
}},introWizard:function(a){window.scrollTo(0,0);
this.currentView=new DL.Dashboard.IntroWizard({page:a})
}});
var DL=window.DL||{};
DL.Dashboard=DL.Dashboard||{};
DL.Dashboard.Views={};
DL.Dashboard.Views.BaseDeviceView=Backbone.View.extend({initialize:function(){this.model.unbind("change",this.initDevice,this);
this.model.bind("change",this.initDevice,this);
this.initDevice()
},renderInPlace:function(d,b){d=$(d);
var c=$(b[1]),a=b[0][1],e=b[0][0];
d.css({position:"absolute",top:a-85,left:e-55});
c.append(d)
},renderCommon:function(d,c,b){var a=parseInt(this.model.get("status"),10);
if(this.options.xy){this.renderInPlace(c,this.options.xy)
}else{if(d.find(".dvcWrap").length>0){d.html(c)
}else{$(this.containerSelector).append(d.html(c))
}}if(this.model.get("movable")&&a!=2){this.setDeviceMovable(d,b)
}},bindListeners:function(){if(this.isBoundListeners){this.unbindListeners()
}this.listenerToken=DL.PubSub.subscribe("onmessagereceived",$.proxy(this.handleMessage,this));
this.isBoundListeners=true
},unbindListeners:function(){DL.PubSub.unsubscribe(this.listenerToken);
this.isBoundListeners=false
},handleMessage:function(b,a){if(a.dev==this.model.id){this.model.timeOutMonitor.clear();
this.removeUpdatingSpinner();
this.initDevice()
}},updateProperty:function(g,a,f,h,e){var c,b=DL.Dashboard.restURLs.setPropertyOnDevice+DL.Dashboard.gwid+"/"+g+"/"+a+"/"+encodeURI(f)+".json",d=this;
this.showUpdatingSpinner();
c=DL.Dashboard.Main.Ajax({url:b,type:"POST"}).done(function(k){if(k.responseMessage.code=="0"){if(!e){d.model.timeOutMonitor.start(30000,d.model.id,$.proxy(d.initDevice,d))
}}if(h&&typeof h=="function"){h(k,g,a,f)
}}).fail(function(k){d.removeUpdatingSpinner();
if(k&&k.responseMessage&&k.responseMessage.code&&k.responseMessage.code=="-1"){if(!disableTileDisplay){d.showDeviceError(k.responseMessage.message)
}}if(h&&typeof h==="function"){h(k)
}});
return c
},changeName:function(a,c,b){return this.updateProperty(this.model.id,"0",a,c,b)
},showDeviceError:function(c){var b=$(this.el),a=$("<div/>").addClass("section errorState").html("<p>"+c+"</p>");
b.find(".errorState").remove();
a.insertBefore(b.find(".footer"));
a.slideDown(function(){b.find(".dvcTitle").addClass("editAll").find("textarea").focus()
})
},removeDeviceError:function(){$(this.el).find(".errorState").remove()
},toggleControlPanel:function(g,b,c,e){if(!c){g=g?$(g):$(this.el).find(".panelArrow");
var a=g.parents(".dvcContainer:first"),d=a.find(".controlPanel"),h=d.find(".panelMain"),k=d.find(".footerWrap"),f=this;
if(g.data("isOpen")||d.hasClass("open")||b){d.slideUp(function(){d.removeClass("open").attr("data-isopen",false);
g.data("isOpen",false).removeClass("dvcControlsClose").addClass("dvcControlsOpen");
h.css({display:"block"}).data("isClosed",false);
f.model.set({renderDeviceDrawerOpen:false},{silent:true});
k.removeClass("editOn");
if(e&&typeof e==="function"){e()
}})
}else{this.model.set({renderDeviceDrawerOpen:true},{silent:true});
d.slideDown(function(){var l=d.find(".thinGreyScrollbar");
d.addClass("open").attr("data-isopen",true);
g.data("isOpen",true).addClass("dvcControlsClose").removeClass("dvcControlsOpen");
if(l.length>0){$(".thinGreyScrollbar",d).jScrollPane({verticalDragMaxHeight:40})
}if(e&&typeof e==="function"){e()
}})
}}else{if(e&&typeof e==="function"){e()
}}},collapseManagedObjects:function(){var a=this.model.managedObjects.getAttributesAndValues(),b=_.extend(this.model.toJSON(),a);
return b
},collapseManagedObjectOIDValues:function(){var c={},d,b,a=this.model.managedObjects.models.length;
for(b=0;
b<a;
b++){d=this.model.managedObjects.models[b];
c[d.attributes.mObjectID]=d.attributes.value
}return c
},showRoom:function(a,b){if(b!=a){return false
}else{return true
}},getDisplayName:function(b,a){if(b!=a){return a
}return b
},disable:function(b){var a=$(this.el).find("section:first");
var c=(a.find(".disableMask").length)?a.find(".disableMask"):$('<div class="disableMask"></div>').prependTo(a);
c.css("display","block")
},enable:function(b){b.preventDefault();
var a=$(b.target.parentNode);
var c=a.find(".disableMask");
c.fadeTo("slow",0,function(){c.css("display","none")
})
},remove:function(a){var b=$(a.target);
b.parent.parent.remove()
},editState:function(a){var b=$('<a class="dvcDeleteBtn" href="#"></a>').css("display","block");
$(this.el).find("section:first").prepend(b).end().attr("data-id",a)
},normalizeStatus:function(a){a=parseInt(a,10);
var b="online";
if(a!="NaN"){if(a==2){b="offline"
}}return b
},getBatteryLevelClass:function(b){var a="full";
if(b<=10){a="low"
}return a
},showUpdatingSpinner:function(){var a=$(this.el);
if(DL.Animation.supported){a.find(".icon-ring").addClass("infiniteRotate")
}else{a.find(".dvcSpinner").remove();
a.find(".dvcTitle").append('<div class="dvcSpinner" />')
}},removeUpdatingSpinner:function(){var a=$(this.el);
if(DL.Animation.supported){a.find(".icon-ring").removeClass("infiniteRotate")
}else{a.find(".dvcSpinner").remove()
}},toggleEditDrawer:function(c){var a=c.siblings(".footer").find(".footerWrap"),d=c.parents(".dvcContainer:first"),g=d.find(".dvcTitle"),f=g.find("h3"),e=g.find("textarea"),b=d.find(".errorState");
if(c.data("isClosed")){if(b.length>0){b.slideUp(function(){b.remove()
})
}c.slideDown(function(){c.data("isClosed",false);
a.removeClass("editOn");
e.blur();
g.removeClass("editAll")
})
}else{c.slideUp(function(){c.data("isClosed",true);
a.addClass("editOn");
g.addClass("editAll");
e.focus();
e.keydown(function(h){if(h.keyCode=="13"||h.keyCode=="09"){h.preventDefault();
if(e.val()!=f.val()){if(h.keyCode=="09"){e.blur()
}if(h.keyCode=="13"){d.find(".editSave").click()
}}}else{if(e.val().length>=35){if(!_.contains(["37","38","39","40","46","8"],String(h.keyCode))){h.preventDefault()
}}}})
})
}},openDeviceActivityModal:function(){var d=this,e=this.data||{},a=DL.Dashboard.restURLs.getRecentEvents+DL.Dashboard.gwid+".json",c=new DL.Dashboard.ModalBase({template:"modals/deviceActivities",data:e});
var b=c.modalContent;
b.find(".cameraHome").monobind("click",function(f){f.preventDefault();
c.close()
});
DL.Dashboard.Main.Ajax({url:a,type:"GET",data:{deviceIds:this.model.id}}).done(function(h){DL.log(e.deviceClassId,e);
$(".ajax-loader").remove();
var p=b.find(".activities-list");
if(DL.containsProperties(h.responseMessage.content.items)){p.show();
var o=h.responseMessage.content.items,m=[];
for(var g in o){m.push('<li><span class="activity-date">'+g+"</span>");
var n=o[g];
if(n&&n.length){m.push("<ul>");
for(var l=0,k=n.length;
l<k;
l++){var f=n[l];
m.push('<li><div class="device-class-id device-class-id-'+(e.deviceClassId||0)+'"></div><div class="activity-text">'+f.name+'.<span class="timestamp">'+f.timestamp+'</span><span class="fuzzydate">('+f.timeAgo+")</span></div></li>")
}m.push("</ul>")
}m.push("</li>")
}m=m.join("");
p.html(m);
b.find(".jspScrollable").jScrollPane({autoReinitialise:true,showArrows:false,contentWidth:250,verticalDragMaxHeight:40});
var q=false;
for(var l=0;
l<DL.Dashboard.customer.permissions.length;
l++){if(DL.Dashboard.customer.permissions[l]=="VIEW_SETTINGS"){q=true
}}if(!q){b.find(".actionButton.activity").remove()
}else{b.find(".actionButton.activity").fadeIn().monobind("click",$.proxy(d.onclick_activitiesAndAlerts,d))
}}else{p.remove();
b.find(".viewPort .section").append($("<div/>",{"class":"no-activity",html:"No Device Activity"}))
}})
},cleanup:function(){var b=$(".modal"),a=$(".modal-overlay");
if(b.length>0){b.remove();
a.remove()
}},setDeviceMovable:function(a,b){if(b){this.model.set({isCameraDevice:true},{silent:true})
}else{a.addClass("movable");
a.find(".move").monobind("click",$.proxy(this.onclick_moveDevice,this))
}},moveDevice:{deviceId:null,dataName:["possibleRooms","possibleFloors"],data:{},init:function(d,a){var b=d.get("isCameraDevice")||false;
var c=this;
function e(k){var h=[DL.Dashboard.getPossibleRooms,DL.Dashboard.getPossibleFloors],g=0;
_.each(h,function(l,m){DL.Dashboard.Main.Ajax(l,function(n){if(n.responseMessage.code=="0"){c.data[c.dataName[m]]=n.responseMessage.content;
g++;
if(g==h.length&&k&&typeof k==="function"){k(true)
}}},function(n){k(false,n.responseMessage)
},{type:"GET"})
})
}this.parentContext=a||this;
this.deviceId=d.id;
this.moveToRoomId="";
this.moveToFloorId="";
this.moveToFloorLabel="";
this.moveToRoomLabel="";
this.deviceName=d.get("label");
function f(){return c.moveToFloorLabel+" - "+c.moveToRoomLabel
}a.toggleControlPanel(null,true,b,function(){if(b){a.cameraModal.close()
}e(function(g){if(g){c.moveDeviceModalBack=[];
c.moveDeviceModal=new DL.Dashboard.ModalBase({template:"modals/moveDevice",data:{deviceName:c.deviceName,existingRooms:DL.Dashboard.groups.ROOM.toJSON(),currentRoom:_.filter(DL.Dashboard.groups.ROOM.toJSON(),function(h){return !!~_.indexOf(h.deviceIds,c.deviceId)
})[0],possibleRooms:c.data.possibleRooms,possibleFloors:c.data.possibleFloors},customEvents:{"click .backButton":function(k){k.preventDefault();
var h=c.moveDeviceModalBack.pop();
h()
},"click a.possibleFloorSelect":function(k){k.preventDefault();
$(".moveDevice div.choices.possibleFloorSelect").hide();
$(".moveDevice div.choices.existingRoomSelect").show();
c.moveToFloorId=$(this).attr("data-floor-id");
c.moveToFloorLabel=$(this).text();
$(".moveDevice div.choices.existingRoomSelect ul.rooms li.room").show();
$('.moveDevice div.choices.existingRoomSelect ul.rooms li.room[data-floor-id!="'+c.moveToFloorId+'"]').hide();
c.moveDeviceModal.modalContent.find("div.choices.existingRoomSelect ul.rooms").jScrollPane({showArrows:false});
c.moveDeviceModalBack.push(function(){$(".moveDevice div.choices.possibleFloorSelect").show();
$(".moveDevice div.choices.existingRoomSelect").hide()
});
c.moveDeviceModal.modalContent.find(".existingRoomSelect").removeClass("selected");
if(c.moveToFloorId===d.attributes.location.floor.id){var h=d.attributes.location.room.id;
c.moveDeviceModal.modalContent.find('.existingRoomSelect[data-room-id="'+h+'"]').addClass("selected")
}},"click a.existingRoomSelect":function(h){h.preventDefault();
if(!$(this).hasClass("selected")){$(".moveDevice div.choices").hide();
$(".moveDevice div.finalSelection").show();
c.moveToRoomId=$(this).attr("data-room-id");
c.moveToFloorId=$(this).attr("data-floor-id");
c.moveToRoomLabel=$(this).text();
$(".moveDevice div.finalSelection p").html("Are you sure you want to move this device to the <span>"+f()+"?</span>");
c.moveDeviceModalBack.push(function(){$(".moveDevice div.choices.existingRoomSelect").show();
$(".moveDevice div.finalSelection").hide()
})
}},"click a.addRoom":function(h){h.preventDefault();
$(".moveDevice div.choices.existingRoomSelect").hide();
$(".moveDevice div.choices.possibleRoomSelect").show();
c.moveDeviceModal.modalContent.find("div.choices.possibleRoomSelect ul.rooms").jScrollPane({showArrows:false});
c.moveDeviceModalBack.push(function(){$(".moveDevice div.choices").hide();
$(".moveDevice div.choices.existingRoomSelect").show()
})
},"click a.possibleRoomSelect":function(h){h.preventDefault();
$(".moveDevice div.choices").hide();
$(".moveDevice div.finalSelection").show();
c.moveToRoomId=$(this).attr("data-room-id");
c.moveToRoomLabel=$(this).text();
$(".moveDevice div.finalSelection p").html("Are you sure you want to move this device to the <span>"+f()+"?</span>");
c.moveDeviceModalBack.push(function(){$(".moveDevice div.choices.possibleRoomSelect").show();
$(".moveDevice div.finalSelection").hide()
})
},"click a.gbtn.move":function(l){l.preventDefault();
var h=DL.Dashboard.restURLs.moveDevice+DL.Dashboard.gwid+"/"+c.deviceId+".json",k=this;
data={floorId:c.moveToFloorId,roomId:c.moveToRoomId};
DL.Dashboard.Main.Ajax(h,function(m){if(m.responseMessage.code=="0"){c.moveDeviceModal.close()
}},function(m){if(m&&m.responseMessage&&m.responseMessage.code&&m.responseMessage.code=="-1"){}},{type:"POST",data:data,showLoadingOverlay:true})
}},afterOpen:function(h){h.find("ul.rooms, ul.floors").jScrollPane({showArrows:false})
}});
if(!b){c.moveDeviceModalBack.push($.proxy(c.moveDeviceModal.close,c.moveDeviceModal))
}else{c.moveDeviceModalBack.push($.proxy(a.loadCamera,a))
}}})
})
}},onclick_toggleState:function(a){if(this.model.attributes.status==0){var b=$(a.currentTarget).parents(".actionPanel:first");
if(b.hasClass("active")){b.removeClass("active")
}else{b.addClass("active")
}this.toggleDeviceState()
}},onclick_deviceIcon:function(a){a.preventDefault();
if(this.model.attributes.status==0){this.toggleDeviceState()
}},onclick_toggleControlButton:function(a){a.preventDefault();
this.toggleControlPanel($(a.currentTarget))
},onclick_editButton:function(a){a.preventDefault();
this.toggleEditDrawer($(a.currentTarget).parents(".controlPanel:first").find(".panelMain"))
},onclick_editSave:function(f){f.preventDefault();
var d=$(f.currentTarget).parents(".dvcContainer:first"),b=d.find("h3"),c=d.find("textarea").val(),a=d.find(".dvcTitle");
b.html(c);
a.toggleClass("editAll");
this.changeName(c)
},onclick_deviceActivity:function(a){a.preventDefault();
this.cleanup();
this.openDeviceActivityModal()
},onclick_activitiesAndAlerts:function(a){a.preventDefault();
if($("#manageFrame").length<1){this.cleanup();
DL.Dashboard.UtilityNav.showSettingsModal()
}},onclick_moveDevice:function(a){a.preventDefault();
this.moveDevice.init(this.model,this)
}});
DL.Dashboard.OnScreenHelp=Backbone.View.extend({template:DL.Dashboard.getTemplate("modals/onScreenHelp"),initialize:function(){if(!this.options.page){return
}this.data={page:this.options.page};
this.render()
},events:{"click .wizard-close":"close","click .qhIcon":"close"},render:function(){this.el=$(this.el);
var a=$.tmpl($(this.template),this.data);
var b=this;
$("body").append(this.el.html(a));
this.el.bind("click",function(c){c.preventDefault();
b.close()
});
a.fadeIn()
},close:function(){var a=this;
this.el.fadeOut(function(){a.el.remove();
if(a.options.afterClose&&typeof a.options.afterClose=="function"){a.options.afterClose()
}})
}});
DL.Dashboard.Views.MasterOverlay=Backbone.View.extend({text:{OFFLINE:{title:"System is Offline",description:"Your system is not responding and is DISARMED. Please click FIX to learn how to resolve this situation. To see account information click the MY ACCOUNT button."},SUSPENDED:{title:"Account Suspended",description:"Your account has been suspended due to non-payment. Please click MY ACCOUNT to make a payment. For more information click the INFO button."},MAINTENANCE:{title:"System is in Maintenance Mode",description:"Your system is currently in Maintenance Mode. Click INFO to see more information. Functionality will return once maintenance has been completed. To see account information click the MY ACCOUNT button."},PIN:{title:"Create a Security PIN",description:"Please click the Create PIN button to establish a PIN for your AT&T Digital Life System. NOTE: You will not be able to ARM or DISARM your system without a PIN and alarm passcode."}},template:DL.Dashboard.getTemplate("modals/masterOverlay"),initialize:function(){var b=DL.Dashboard.Main.getSelectedGatewayData(DL.Dashboard.customer.selectedGateway);
this.data={};
this.data.message=this.options.message.toUpperCase()||"ONLINE";
this.data.ctx=DL.ServerSecurePath+DL.ContextUrl;
this.data.isOffline=false;
this.data.stillNeedsPin=false;
this.data.logoutUrl=DL.LogoutUrl;
this.data.selectedGatewayName=b.name;
this.data.accountPermission=_.some(DL.Dashboard.customer.permissions,function(c){switch(c){case"VIEW_ACCOUNT_SUMMARY":case"VIEW_BILLINGS_AND_PAYMENT":case"CREATE_FULL_ACCOUNT":case"CREATE_CUSTOM_ACCOUNT":case"CREATE_GUEST_ACCOUNT":case"EDIT_MASTER_ACCOUNT":case"EDIT_SELF_ACCOUNT":case"EDIT_OTHER_FULL_ACCOUNTS":case"EDIT_OTHER_CUSTOM_ACCOUNTS":case"EDIT_OTHER_GUEST_ACCOUNTS":case"DELETE_OTHER_FULL_ACCOUNTS":case"DELETE_OTHER_CUSTOM_ACCOUNTS":case"DELETE_OTHER_GUEST_ACCOUNTS":case"MANAGE_EMERGENCY_CONTACTS":case"VIEW_PERMITS_AND_DOCUMENTS":case"VIEW_MESSAGE_LOG":case"VIEW_PROFILE":return true
}});
this.data.masterAccountPermission=_.some(DL.Dashboard.customer.permissions,function(c){return c=="EDIT_SELF_ACCOUNT"||c=="EDIT_MASTER_ACCOUNT"
});
if(this.data.message!="ONLINE"){var a=this.text[this.data.message];
if(a){this.data.title=a.title;
this.data.description=a.description;
if(this.data.message=="OFFLINE"){this.data.isOffline=true
}if(DL.Dashboard.customer.gateways.length>1){this.data.multiProperty=true;
this.data.properties=DL.Dashboard.customer.gateways
}if(this.data.message=="PIN"){this.data.stillNeedsPin=true
}}this.render()
}},render:function(){var a=$("#container .topStatus"),c=document.createElement("div"),b=this;
c.className="overlay";
document.documentElement.className+=" systemDisabled";
document.body.appendChild(c);
a.prepend($.tmpl(this.template,this.data));
a.find(".gatewaySelect").monobind("click",this.onclick_gatewaySelector);
a.find("[data-gateway]").monobind("click",this.onclick_newGateway);
a.find('a[data-command="TO_SUPPORT"]').monobind("click",this.onclick_fix);
a.find(".fix").monobind("click",$.proxy(this.onclick_fix,this));
a.find(".later").monobind("click",$.proxy(this.onclick_later,this));
a.find(".account").monobind("click",$.proxy(this.getMyAccount,this));
a.find(".createPin").monobind("click",$.proxy(this.createPin,this));
a.find(".info").monobind("click",$.proxy(this.onclick_fix,this))
},cleanUp:function(c){var a=$("#system-message"),b=this;
if(a.length){a.slideUp(function(){if(c){c()
}a.remove();
b.data=null
})
}else{if(c){c()
}}},createPin:function(a){DL.Dashboard.UtilityNav.showAccountModal(true,"editmaster")
},getMyAccount:function(a){a.preventDefault();
DL.Dashboard.UtilityNav.showAccountModal(true)
},cancel:function(a){if(a){a.preventDefault()
}this.cleanUp(function(){DL.Dashboard.proceed(true)
})
},getInformation:function(b){if(b){b.preventDefault()
}var a=DL.Dashboard.devices.getDeviceByClassId("0000").attributes.supportUrl;
if(a){DL.Dashboard.UtilityNav.showSupportCenterModal(a)
}else{alert("There was an error processing your snapshot.  Please try again. [URL1]")
}},onclick_fix:function(a){a.preventDefault();
this.getInformation()
},onclick_later:function(a){a.preventDefault();
this.cancel()
},onclick_newGateway:function(a){a.preventDefault();
DL.Dashboard.Main.setSelectedGateway($(a.currentTarget).attr("data-gateway"))
},onclick_gatewaySelector:function(b){b.preventDefault();
var a=$(b.currentTarget).siblings(".gatewaySelectList");
if(a.data("isOpen")){a.slideUp(function(){a.data("isOpen",false)
})
}else{a.slideDown(function(){a.data("isOpen",true)
})
}}});
DL.Dashboard.Views.SystemAlerts=Backbone.View.extend({template:DL.Dashboard.getTemplate("systemAlerts"),initialize:function(){if(!_.isUndefined(this.token)){DL.PubSub.unsubscribe(this.token)
}this.token=DL.PubSub.subscribe("onmessagereceived",$.proxy(this.handleMessages,this));
this.status={};
this.context=$("#alertsAndAlarms");
this.isSettingAlarmToArmed=false;
this.alarmSettingValue=null;
this.hasPin=false;
this.render()
},render:function(){var a=this;
a.setAlarmControls(function(){var c=$.tmpl($(a.template),a.status),b=a.context.find("#statusAlarms");
if(b.length>0){b.remove()
}a.context.append(c);
a.context.find(".thinGreyScrollbar").jScrollPane({showArrows:true,verticalDragMaxHeight:40});
a.statusAlarms=a.context.find("#statusAlarms");
a.statusIndicator=a.statusAlarms.find(".statusIndicator");
a.alarmPanel=a.statusAlarms.find("#alarmChangePanel");
a.emergencyPanel=a.statusAlarms.find("#emergencyServices");
a.statusAlarms.children(".statusIndicator").monobind("click",$.proxy(a.onclick_alarmStatus,a));
a.statusAlarms.find("#alarmChangePanel .statusIndicator").monobind("click",$.proxy(a.onclick_setAlarm,a));
a.emergencyPanel.find("a.emgSvcsBtn").monobind("click",$.proxy(a.onclick_emergencyResponse,a));
a.buttonContainer=a.statusAlarms.find(".buttonContainer")
})
},checkForStatus:function(e,d){e=e||function(){};
var c=this;
function b(){var f=DL.Dashboard.devices.getDeviceByClassId("0000"),g=f.getMObjectById(1110);
if(!d&&g&&g.get("value")!="0"){g=parseInt(g.get("value"),10);
if(g<0){c.toggleSystemAlarm(true,function(){DL.Dashboard.proceed(false,"MAINTENANCE")
})
}else{e()
}}else{e()
}}if(!c.hasPin){var a=DL.Dashboard.checkUserForAlarmPin+DL.Dashboard.gwid+".json";
DL.Dashboard.Main.Ajax(a,function(f){if(f.responseMessage.content==false){c.toggleSystemAlarm(true,function(){DL.Dashboard.proceed(false,"PIN")
})
}else{c.hasPin=true;
b()
}},null,{type:"GET"})
}else{b()
}},statusMap:{Disarm:"disarmed",Home:"disarmed",Away:"armed away",Stay:"armed stay"},setAlarmControls:function(l){this.device=DL.Dashboard.devices.getDeviceByClassId("0701");
if(this.device){this.displayProperties=this.device.getMObjectById(1190);
this.statusObj=this.device.getMObjectById(1170);
this.exitDelay=this.device.getMObjectById(1102);
var f=this.displayProperties.get("value").split(" ")[0];
if(f&&f!=="null"&&f.toLowerCase()!=="off"){var m=this.statusMap[f],k=m.split(" "),a=this.statusObj.get("type").split(":")[1].split(","),b=[],c=f=="Away"||f=="Stay";
this.setMonitoredDevices(f,$.proxy(function(){this.setBypassedDevices(this.device.getMObjectById(2020),c)
},this));
this.status.currentState=m.split(" ")[0];
this.status.currentActivity=k.length>1?k[1]:"OFF";
this.status.currentStatusClass=m;
for(var g=0,d=a.length;
g<d;
g++){var h=a[g];
if(m=="disarmed"){m=f
}if(h.toUpperCase()==m.toUpperCase()){_.each(_.without(a,h),function(o){var p=o.split(" "),n=p.length>1?p[1]:"Home",e={};
e.inactiveClass=o=="home"?"disarmed":o;
e.inactiveState=p[0]=="home"?"disarmed":p[0];
e.inactiveActivity=n;
e.dataState=n.charAt(0).toUpperCase()+n.slice(1);
b.push(e)
});
this.status.inactiveStatus=b;
break
}}}else{this.setDeactivatedAlarm()
}}else{this.setDeactivatedAlarm()
}if(l){l()
}},setDeactivatedAlarm:function(){this.status.currentState="disarmed";
this.status.currentActivity="HOME";
this.status.currentStatusClass="disarmed";
this.isNoDevice=true
},setMonitoredDevices:function(c,e){var a,b=[],d=false;
if(c=="Away"){a=this.device.getMObjectById(2000);
d=true
}else{if(c=="Stay"){a=this.device.getMObjectById(2010);
d=true
}else{DL.Dashboard.Main.setDevicesMonitored(b,false);
if(e){e()
}return
}}a=a.get("value");
b=a?a.split(","):[];
DL.Dashboard.Main.setDevicesMonitored(b,d);
if(e){e()
}},setBypassedDevices:function(a,c){var b=a.get("value");
b=b?b.split(","):[];
DL.Dashboard.Main.setDevicesBypassed(b,c)
},setAlarmToNewValue:function(d,b){var c=this,b=b?"?bypass="+b:"",a=DL.Dashboard.setAlarmPropertyUrl+DL.Dashboard.gwid+"/"+d+".json"+b;
c.checkForStatus(function(){c.insertWaiting();
c.isSettingAway=d.indexOf("Away")>-1?true:false;
c.alarmSettingValue=d;
DL.Dashboard.Main.Ajax(a,function(e){c.removeWaiting();
c.showWaitForConfirmation(d,(d=="Disarm"?true:false));
c.userUniqueId=e.responseMessage.content;
if(d=="Stay"||d=="Away"){c.isSettingAlarmToArmed=true
}},function(e){c.removeWaiting();
if(e.responseMessage){c.showWaitForConfirmation(e.responseMessage.message,true)
}else{c.showWaitForConfirmation("An unexpected error occurred while processing your request.  Please try again.",true)
}},{type:"POST"})
})
},handleMessages:function(k,a){var l=this;
function g(){l.alarmSettingValue=null;
l.statusObj.set({value:a.value},{silent:true});
l.removeWaitForConfirmation();
l.toggleSystemAlarm(true,function(){l.render()
})
}if(this.device&&a.dev==this.device.id){if(a.MOID=="2070"&&a.value!==""){var c=a.value;
c=c.split(",");
DL.Dashboard.Main.setDevicesAlarmed(c,true)
}else{if(a.MOID=="1190"){var c=a.value.toLowerCase();
l.device.timeOutMonitor.clear();
if(c.indexOf("exitdelay")<0&&c.indexOf("resetexitdelay")<0){if(c.indexOf("bypass")<0&&(c.indexOf("home")>-1||c.indexOf("stay")>-1||c.indexOf("away")>-1)){if(l.bypassModal){l.bypassModal.close()
}g();
return
}}else{l.showWaitForConfirmation("Arming",false,true)
}}else{if(a.MOID=="1191"&&l.isSettingAlarmToArmed){var c=a.value,n,b,h,f;
l.device.timeOutMonitor.clear();
if(c.indexOf("Nak")>-1){if(c.indexOf("Bypass")>-1){c=c.split("!");
for(h=0,f=c.length;
h<f;
h++){var d=c[h];
if(d.indexOf("Bypass")>-1){b=d.split("=")[1].split(",")
}else{if(d.indexOf("User")>-1){n=d.split("=")[1]
}}}if(this.userUniqueId&&this.userUniqueId==n){l.openBypassModal(b)
}}}}}}}},openBypassModal:function(a){var m=this,h={devices:[]},c=[];
for(var k=0,f=a.length;
k<f;
k++){var b=DL.Dashboard.devices.getDeviceById(a[k]),g;
if(b){var e=b.attributes.alertStatus,d=b.attributes.alternateStatus,l=b.attributes.status,n=b.attributes.deviceClassId;
if(e!=null&&e!=""){g=b.attributes.alertStatus
}else{if(d!=null&&d!=""){g=b.attributes.alternateStatus
}else{if(l!=null&&l!=""){if(l=="1"){g="offline"
}else{if(l=="2"){g="unknown"
}}}else{if(n=="0102"||n=="0111"){if(b.attributes.managedObjectList[3].value.toLowerCase()=="open"){g="open"
}else{g="unknown"
}}else{g="unknown"
}}}}h.devices.push({deviceId:b.id,name:b.attributes.label,deviceStatus:g,deviceType:"device-"+b.attributes.deviceClassId});
c.push(b.id)
}}c=c.join(",");
this.bypassModal=new DL.Dashboard.ModalBase({template:"modals/bypass",data:h,customEvents:{"click .bypassBtn":function(o){o.preventDefault();
m.bypassModal.close();
m.setAlarmToNewValue(m.alarmSettingValue,c)
},"click .checkAgain":function(o){o.preventDefault();
m.bypassModal.close();
m.setAlarmToNewValue(m.alarmSettingValue)
}}})
},toggleSystemAlarm:function(c,d){var b=this;
function a(e,f,g){b.alarmPanel.removeClass(e).addClass(f);
b.emergencyPanel.removeClass(e).addClass(f);
b.statusAlarms.removeClass(e).addClass(f);
g()
}if(!c&&this.alarmPanel.hasClass("collapsed")&&this.emergencyPanel.hasClass("collapsed")){a("collapsed","expanded",function(){var e=b.alarmPanel.width();
if(b.isNoDevice||($("#alarmChangePanel").length==0)){e=0
}b.buttonContainer.animate({width:"429px"});
b.alarmPanel.animate({left:"0px"});
b.emergencyPanel.animate({left:e+"px"},{complete:function(){if(d){d()
}}})
})
}else{a("expanded","collapsed",function(){b.buttonContainer.animate({width:"1px"});
b.emergencyPanel.animate({left:"-227px"});
b.alarmPanel.animate({left:"-200px"},{complete:function(){if(d){d()
}}})
})
}},insertWaiting:function(){this.statusAlarms.find(".buttonContainer").prepend($("<div/>",{"class":"progress"}).append($("<span/>",{html:"Working&hellip;"})))
},removeWaiting:function(){this.statusAlarms.find(".progress").remove()
},showWaitForConfirmation:function(l,m,e){var n=$("#alarmChangePanel .alarmChangeNofication"),b="",o=l,a=35000,h=this,c=h.alarmPanel||$("#alarmChangePanel"),f=h.emergencyPanel||$("#emergencyServices");
if(l=="Away"||l=="Stay"||l=="Arming"){b="arming"
}else{if(l=="Home"||l=="Disarm"){b="disarming";
o="System is disarming."
}else{if(l=="Alarm"){b="disarming";
o="Alarm has been triggered. Please cancel alarm before changing system status."
}}}function g(){if(l!=="Alarm"){h.toggleSystemAlarm();
h.statusIndicator.find(".statusLabel,.statusMsg").hide();
h.context.find(".alarmIndicator .statusArming").html(b);
h.statusIndicator.addClass("waiting");
if(h.isSettingAway||e){h.statusIndicator.addClass("arming");
h.statusIndicator.removeClass("disarmed");
a+=(parseInt(h.exitDelay.get("value"),10)*1000)
}h.device.timeOutMonitor.start(a,h.device.id,$.proxy(h.initialize,h))
}else{c.width(180);
n.addClass("disarming")
}n.find("span").html(o);
n.fadeIn("fast")
}if(!m){var k="/assets/images/alarmArming.gif",d="-2";
o="The system is processing your request. Status will update shortly.";
c.width(200);
f.css("left","200px");
this.statusIndicator.addClass("waiting "+b);
if(this.statusIndicator.first().hasClass("disarming")){n.addClass("disarming");
k="/assets/images/alarmChangeSpinner.gif";
d="-4"
}else{n.removeClass("disarming")
}this.statusIndicator.find(".statusGauge:first").append($("<img/>",{width:"16",height:"16",src:DL.AssetsSecureBasePath+k,css:{"margin-top":"1px","margin-left":d+"px"}}));
g()
}else{g()
}},removeWaitForConfirmation:function(a){a=a?a:this.statusIndicator;
_.each(a,function(c){var c=$(c),b=$(c).find(".statusGauge:first img");
c.removeClass("arming disarming");
if(b.length){b.remove()
}})
},openEmergencyResponseModal:function(a){var f=this.data||{},c=a,h=a;
if(a.toLowerCase()=="aux"){c="Auxiliary Emergency",h="Medical"
}c=c.toUpperCase();
f.address=(function(){for(var l=0,k=DL.Dashboard.customer.gateways.length;
l<k;
l++){var m=DL.Dashboard.customer.gateways[l];
if(m.gatewayGUID==DL.Dashboard.customer.selectedGateway){return m.address1
}}})();
f.service=c;
new DL.Dashboard.ModalBase({template:"modals/emergencyResponse",data:f});
var b=$("#emergency-response"),e=b.find("footer a.confirm"),d=DL.Dashboard.devices.getDeviceByClassId("0000"),g=d.getMObjectById(1110);
if(g&&Number(g.get("value"))>0){b.find(".gbtn.confirm").hide();
b.find("section").html("<p>While the Digital Life system is in test mode, no calls to emergency services will be made.</p>")
}else{e.bind("click",function(l){l.preventDefault();
e.addClass("loading-spinner");
var k=DL.Dashboard.callEmergencyService+DL.Dashboard.gwid+"/"+h.toUpperCase()+".json";
DL.Dashboard.Main.Ajax(k,function(m){e.css({display:"none"});
b.find("footer a.close").addClass("gactive").html("OK");
b.find("p.emerg-req").fadeOut(function(){b.find("p.emerg-sent").fadeIn()
})
},null,{})
})
}},onclick_alarmStatus:function(a){a.preventDefault();
this.toggleSystemAlarm()
},onclick_setAlarm:function(c){c.preventDefault();
var a=this,b=$(c.currentTarget);
a.checkForStatus(function(){a.setAlarmToNewValue(b.data("state"))
})
},onclick_emergencyResponse:function(a){a.preventDefault();
this.openEmergencyResponseModal($(a.currentTarget).find("span").text())
}});
DL.Dashboard.Views.Notifications=Backbone.View.extend({pageData:{},template:DL.Dashboard.getTemplate("notifications"),initialize:function(){var a=this;
if(!DL.Dashboard.listenerRules){a.getListenerRules()
}DL.PubSub.subscribe("oncustomevent",$.proxy(a.handleMessage,a));
DL.PubSub.subscribe("onmessagereceived",$.proxy(a.handleMessage,a));
DL.PubSub.subscribe("ongatewaymessagereceived",$.proxy(a.handleMessage,a));
a.context=$("#alertsAndAlarms");
a.setUpAlerts(function(){$(".dvcContainer.alert").add(".dvcContainer.alarm").find(".icon-status").live("click",function(c){var b=$(this).parents(".dvcWrap");
if(a.context.find("#statusAlertList").hasClass("collapsed")){a.toggleAlertPanel(function(){a.scrollToDevice(b)
})
}else{a.scrollToDevice(b)
}});
a.render()
})
},render:function(){var a=this.context.find("#statusAlerts"),c=a.find("#statusAlertList.expanded"),b=false;
if(a.length){a.remove()
}this.context.prepend($.tmpl($(this.template),this.pageData));
this.context.find("#statusAlerts .statusIndicator").monobind("click",$.proxy(this.onclick_alertStatus,this));
this.context.find(".statusAlertsBtn a").monobind("click",$.proxy(this.onclick_notificationAction,this));
b=_.contains(DL.Dashboard.customer.permissions,"VIEW_SETTINGS");
if(!b){this.context.find(".endCap a").remove()
}else{this.context.find(".endCap a").monobind("click",$.proxy(this.onclick_endCap,this))
}if(this.pageData.alarm.containsAlarm){DL.Dashboard.Views.SystemAlerts.prototype.showWaitForConfirmation.call(DL.Dashboard.Views.SystemAlerts.prototype,"Alarm",true);
this.toggleAlertPanel()
}else{DL.Dashboard.Views.SystemAlerts.prototype.removeWaitForConfirmation.call(DL.Dashboard.Views.SystemAlerts.prototype,$("#statusAlarms .statusIndicator"));
DL.PubSub.publish("onnotificationpanelanimation","init")
}},handleMessage:function(f,g){if(g.dev){var c=DL.Dashboard.getDeviceClassFromDeviceId(g.dev),d=this;
function b(){d.setUpAlerts(function(){d.render()
})
}function a(k,h){k=parseInt(k,10);
for(var l in DL.Dashboard.listenerRules){var e=DL.Dashboard.listenerRules[l];
if(e.deviceClass=="ALL"||e.deviceClass==c){if(h&&e.eids&&e.eids.length){if(e.eids.indexOf(k)>=0){b();
break
}}else{if(e.oids&&e.oids.length){if(e.oids.indexOf(k)>=0){b();
break
}}}}}}if(c||parseInt(g.dev,10)===0){if(g.MOID){a(g.MOID)
}else{if(g.EID){a(g.EID,true)
}}}}},setUpAlerts:function(g){var b=DL.Dashboard.getAllAlerts+DL.Dashboard.gwid+".json",c=this,e=this.pageData.alarm={};
function a(k,h){var l=DL.Dashboard.getDeviceFromDeviceId(k);
if(l){l.set({alertStatus:h},{silent:true});
if(!l.get("spacesTile")){l.change()
}}f(k,h)
}function d(){for(var k=0,h=DL.Dashboard.devices.length;
k<h;
k++){var l=DL.Dashboard.devices.models[k];
l.set({alertStatus:""},{silent:true});
if(!l.get("spacesTile")){l.change()
}}}function f(k,h){DL.PubSub.publish("deviceStatusChange",{id:k,status:h})
}DL.Dashboard.Main.Ajax(b,function(h){var m=h.responseMessage.content;
d();
if(m.alertsByStatus.alarm||m.alertsByStatus.high){e.containsAlerts=true
}e.overall=m.status;
e.endCtaCmd="TO_MANAGE_ALERTS";
e.endCtaText="View all alerts and activities";
e.mainCtaUrl="#";
if(m.alertsByStatus.high){if(m.alertsByStatus.high.alerts.length>0){e.containsHigh=true;
e.highAlerts=m.alertsByStatus.high.alerts;
e.mainCount=m.alertsByStatus.high.count;
for(var k=0;
k<e.mainCount;
k++){var l=e.highAlerts[k].deviceId;
a(l,"alert")
}}e.message=e.mainCount>1?"Alerts":"Alert"
}else{if(!m.alertsByStatus.alarm&&!m.alertsByStatus.high){e.message="Ok";
e.overall=e.message.toLowerCase();
e.mainCount="&#10004;";
f("ALL","ok")
}}if(m.alertsByStatus.alarm){e.containsAlarm=true;
e.overall="alarm";
e.mainCtaText="Cancel Alarm";
e.mainCtaUrl="CANCEL_ALARM";
e.alarmAlerts=m.alertsByStatus.alarm.alerts;
e.containsSevere=true;
e.endCtaCmd="TO_CAMERAS";
e.endCtaText="View cameras";
for(var k=0;
k<e.alarmAlerts.length;
k++){var l=e.alarmAlerts[k].deviceId;
a(l,"alarm")
}}if(g){g()
}},function(h){e.message="Error";
e.overall="high";
e.mainCount="!";
e.containsError=true;
if(g){g()
}},{type:"GET"})
},silenceAlarm:function(){var a=DL.Dashboard.setAlarmPropertyUrl+DL.Dashboard.gwid+"/Home.json",b=this;
DL.Dashboard.Main.Ajax(a,function(c){b.toggleAlertPanel();
$("#statusAlerts .statusGauge").html($("<img/>",{src:DL.AssetsSecureBasePath+"/assets/images/alarmArming.gif",css:{"margin-top":"4px"}}))
},null,{})
},getListenerRules:function(c){var a=DL.Dashboard.getAlertsRules,b=this;
DL.Dashboard.Main.Ajax(a,function(d){DL.Dashboard.listenerRules=d.responseMessage.content;
if(c){c()
}},null,{type:"GET"})
},scrollToDevice:function(d){var c=d.find("h3");
if(c.length>0){var e=this.context.find("#statusAlertList").find("p:contains("+c.text()+")");
if(e.length>0){var a=this.context.find(".jspPane");
var f=e.offset();
if(!_.isUndefined(f.top)){var b=parseInt(a.css("top"),10);
a.animate({top:90-f.top+b})
}}}},toggleAlertPanel:function(h){h=h||function(){};
var e=this.context.find("#statusAlerts"),f=this.context.find("#statusAlertList"),b=this.context.find("#statusAlertList ul"),g=this.context.find("#statusAlertBtns"),d=this.context.find(".statusIndicator"),c=$("body").find(".pageModalMaster");
function a(l){var k=l=="open";
if(k){DL.PubSub.publish("onnotificationpanelanimation","open");
e.animate({width:255});
g.animate({width:155},{complete:function(){f.slideDown(function(){f.addClass("expanded").removeClass("collapsed");
h()
});
b.jScrollPane({verticalDragMaxHeight:40});
d.addClass("opened")
}})
}else{f.slideUp(function(){f.addClass("collapsed").removeClass("expanded");
e.animate({width:100});
g.animate({width:0},400,"swing",h);
DL.PubSub.publish("onnotificationpanelanimation","close")
});
d.removeClass("opened")
}}if(f.hasClass("collapsed")){a("open")
}else{a("closed")
}},onclick_notificationAction:function(b){b.preventDefault();
var a=$(b.currentTarget).attr("href");
if(a.indexOf("CANCEL_ALARM")>-1){this.silenceAlarm()
}},onclick_endCap:function(b){b.preventDefault();
var a=$(b.currentTarget).attr("data-cmd");
if(a=="TO_MANAGE_ALERTS"){if($("#manageFrame").length<1){this.toggleAlertPanel();
DL.Dashboard.UtilityNav.showSettingsModal()
}}else{window.location.hash="#devices"
}},onclick_alertStatus:function(a){a.preventDefault();
this.toggleAlertPanel()
}});
DL.Dashboard.Views.CalendarInput=Backbone.View.extend({className:"homeCalendar",template:"",initialize:function(){this.template=DL.Dashboard.getTemplate("homeCalendar");
this.render()
},render:function(){var b=this;
var a=$(this.el).html($.tmpl($(this.template),{}));
a.appendTo("body");
DL.HomeDataLayer.getEventsDate().done(function(c){setTimeout(function(){$("#calendarContainer").datepicker({dayNamesMin:["Su","M","T","W","Th","F","S"],showOtherMonths:true,defaultDate:c,maxDate:"+0D",minDate:"-60D"})
},1)
});
return this
},events:{"click #calendarClose":"calendarAcceptClose","click #calendarBackOverlay ":"removeCalendar"},calendarAcceptClose:function(){var a=$("#calendarContainer").datepicker("getDate");
if(a){DL.HomeDataLayer.setEventsDate(a).done(function(){new DL.Dashboard.Views.HomeEventsList()
})
}this.removeCalendar()
},removeCalendar:function(){this.remove()
}});
DL.Dashboard.Views.GalleryItem=Backbone.View.extend({template:DL.Dashboard.getTemplate("mediaGallery/galleryItem"),initialize:function(){this.context=this.options.context;
this.container=$(this.options.container);
this.data=this.options.data;
this.context.append(this.container);
this.render()
},render:function(){this.data.Status=this.Status||"LOADING";
this.container.html($.tmpl($(this.template),this.data));
var a=this;
if(!this.hasLoaded){this.loadMedia(function(){a.container.find(".gallery-close").monobind("click",$.proxy(a.onclick_delete,a));
if(a.Status=="VIDEO"){var b=new DL.Dashboard.Views.DLVideo("video-"+a.data.id,{},function(c){a.container.find(".video-duration").html(options.duration)
},false,function(){a.context.find('li.cameraDevice[data-item-id!="'+a.data.id+'"]').css("opacity",".2").bind("click.closeShader",function(c){a.context.find("li.cameraDevice").css("opacity","1").unbind("click.closeShader")
})
},function(){a.context.find("li.cameraDevice").css("opacity","1").unbind("click.closeShader")
})
}})
}},loadMedia:function(c){var a=DL.ServerSecurePath+DL.ContextUrl+"/secure/services/devices/camera/media/item/content/"+DL.Dashboard.version+"/"+DL.Dashboard.gwid+"/"+this.data.deviceId+"/"+this.data.id+".json",b=this;
DL.Dashboard.Main.Ajax(a,function(d){b.data=$.extend(b.data,d.responseMessage.content);
b.Status=d.responseMessage.content.type;
function e(){b.hasLoaded=true;
b.options.loadedItems.push("loaded");
b.render();
if(c){c()
}}if(b.Status=="IMAGE"){b.data.itemClassName="still-image";
b.data.imageUrl=DL.Dashboard.getDirectUrlImage+DL.Dashboard.gwid+"/"+b.data.deviceId+"/"+b.data.id+".jpg";
DL.Dashboard.preloadImage("data:image/gif;base64,"+b.data.data,function(f){b.data.MediaElement=f;
e()
})
}else{if(b.Status=="VIDEO"){b.data.itemClassName="video";
b.data.streamUrl=DL.Dashboard.getStreamVideoUrl+DL.Dashboard.version+"/"+DL.Dashboard.gwid+"/"+b.data.deviceId+"/"+b.data.id+".mp4";
b.data.downloadUrl=DL.Dashboard.getDownloadVideoUrl+DL.Dashboard.gwid+"/"+b.data.deviceId+"/"+b.data.id+".mp4";
e()
}}},function(d){b.Status="ERROR";
b.hasLoaded=true;
b.options.loadedItems.push("loaded");
b.render()
},{type:"GET"})
},confirmDeleteInit:function(b,f){var e=this,h=e.container.find(".confirm-delete");
function c(k){k.preventDefault();
DL.Dashboard.Main.Ajax(b,function(l){if(l.responseMessage.code=="0"){e.container.fadeOut(function(){e.container.remove()
})
}},null,{type:"POST",data:JSON.stringify(f),contentType:"application/json"})
}function a(k){k.preventDefault();
h.fadeOut()
}function g(){e.container.find('[data-action="delete"]').bind("click",c);
e.container.find('[data-action="cancel"]').bind("click",a)
}if(h.length<1){var d=e.Status.toLowerCase();
h=$('<div class="confirm-delete"><h3>Delete '+d+"</h3><p>Deleting this "+d+' will remove it from your system</p><a data-action="delete" class="gbtn gactive" href="#">Delete</a><a data-action="cancel" class="gbtn" href="#">Cancel</a></div>');
e.container.prepend(h)
}h.fadeIn(function(){g()
})
},onclick_delete:function(d){d.preventDefault();
var b=DL.ServerSecurePath+DL.ContextUrl+"/secure/services/devices/camera/media/item/delete/"+DL.Dashboard.gwid+".json",c=$(d.currentTarget),a=[];
a.push(c.parents("li:first").attr("data-item-id"));
this.confirmDeleteInit(b,a)
}});
DL.Dashboard.Views.GroupView=Backbone.View.extend({template:_.template("<div class='groupContainer'><h1><%= groupTitleTxt %></h1><ul class='deviceList'></ul></div>"),initialize:function(){this.group=this.model;
this.deviceList=this.group.deviceList;
this.context=this.options.context;
this.render()
},render:function(){var k=this.group.get("deviceIds"),e,d,f=[],c=function(){return $("<li/>").addClass("listContentBlock")
},a=0;
for(e=0,d=k.length;
e<d;
e++){var h=c();
this.context.append(h);
var b=k[e],g=DL.Dashboard.devices.get(b);
if(g!==undefined){DL.Dashboard.devices.renderDeviceView(g,this.container.find(".deviceList"))
}}return this
}});
DL.Dashboard.Views.Message=Backbone.View.extend({initialize:function(){this.message=this.options.message;
this.render()
},render:function(){$("#notice").html($(this.el).html(this.message));
if(this.options.fadeOut!="false"){setTimeout(function(){$("#notice").html("")
},2000)
}}});
DL.Dashboard.Views.MediaGallery=Backbone.View.extend({isRendering:false,className:"media-gallery-container",maxToLoad:6,loaded:0,loadedItems:[],hasLoadedAll:false,initialize:function(){this.data=this.options.data||{};
this.context=this.options.context;
if(this.data.rerender){this.context.find(".jspPane").html("");
this.context.find(".section-subhead h3").html(this.data.Room)
}this.render()
},render:function(c){if(this.firstLoad&&this.maxToLoad==6){this.maxToLoad=this.maxToLoad/2
}this.contentWell=this.context.find("ul.cam-gallery");
var d=this.context.find('[data-action="edit-mode"]'),k=this.context.find('[data-action="save-mode"]'),h=this.context.find('[data-action="done"]'),f=[];
var l=false;
for(var g=0;
g<DL.Dashboard.customer.permissions.length;
g++){if(DL.Dashboard.customer.permissions[g]=="VIEW_SETTINGS"){l=true
}}if(!l){d.remove()
}if(this.data.Media&&!this.hasLoadedAll){if(DL.containsProperties(this.data.Media)){this.contentWell.show().siblings(".no-results").remove();
if(c||this.data.rerender){this.contentWell=this.context.find(".jspPane")
}for(var g=this.loaded,e=this.loaded+this.maxToLoad;
g<e;
g++){var b=this.data.Media[g];
if(b){b.deviceId=this.data.deviceUid;
new DL.Dashboard.Views.GalleryItem({context:this.contentWell,container:'<li data-item-id="'+b.id+'" class="cameraDevice"></li>',data:b,loadedItems:this.loadedItems});
this.loaded++
}}this.hasLoadedAll=this.loaded==this.data.Media.length?true:false;
$(".thinGreyScrollbar",this.context).jScrollPane({showArrows:false,verticalDragMaxHeight:40});
d.removeClass("hide");
if(!!~window.navigator.userAgent.indexOf("iPad")){k.addClass("hide")
}else{k.removeClass("hide")
}}else{d.addClass("hide");
k.addClass("hide");
this.contentWell.hide().after($("<div/>",{"class":"no-results",html:"No snapshots or videos."}))
}}if(this.data.AdditionalCameras.length>0){if(!this.context.find(".toggleDropDown").length){this.context.find("h2").after($("<a/>",{"class":"toggleDropDown",href:"#",html:"More Cameras"}))
}for(var g=0,e=this.data.AdditionalCameras.length;
g<e;
g++){var a=this.data.AdditionalCameras[g];
f.push('<li><a href="#" data-id="'+a.deviceUid+'">'+a.Name+"</a></li>")
}this.context.find(".camerasDropDown").html(f.join(""));
this.context.find(".toggleDropDown").monobind("click",$.proxy(this.onclick_toggleDropDown,this))
}this.contentWell.monobind("scroll",$.proxy(this.onscroll_camGallery,this));
d.monobind("click",$.proxy(this.onclick_editMode,this));
k.monobind("click",$.proxy(this.onclick_saveMode,this));
h.monobind("click",$.proxy(this.onclick_doneButton,this));
this.firstLoad=true
},isScrolledIntoView:function(b){var c=this.contentWell.parents(".section:first"),d=c.offset().top+c.height(),a=b.offset().top+b.height();
if(a<=d-20){return true
}return false
},initNewGallery:function(e){var a=DL.Dashboard.Views.Camera.prototype.availableCameras,f={};
for(var d=0,b=a.length;
d<b;
d++){var g=a[d];
if(g.deviceUid===e){f=g;
break
}}DL.Dashboard.Views.Camera.prototype.getCameraMedia(e,function(c){f.Media=c;
DL.Dashboard.Views.Camera.prototype.loadGallery(f)
})
},initDropDown:function(d){var b;
if(!this.dd){b=this.dd=d.parents(".section:first").find(".camerasDropDown")
}else{b=this.dd
}var c=this;
function e(f){b.slideUp(function(){b.data("isOpen",false);
b.find("a").unbind("click",a);
if(f){f()
}})
}function a(g){g.preventDefault();
var f=$(g.currentTarget);
c.initNewGallery(f.attr("data-id"));
e(function(){f.parents(".section:first").find("h2").text(f.text())
})
}if(b.data("isOpen")){e()
}else{b.slideDown(function(){b.data("isOpen",true);
b.find("a").bind("click",a)
})
}},onscroll_camGallery:function(a){if(this.loadedItems.length>=this.maxToLoad&&this.isScrolledIntoView($(a.target).find(".jspPane"))){this.loadedItems=[];
this.render(true)
}},onclick_toggleDropDown:function(a){a.preventDefault();
this.initDropDown($(a.currentTarget))
},onclick_editMode:function(a){a.preventDefault();
this.context.removeClass("save-mode");
this.context.addClass("edit-mode");
$("li.cameraDevice").css("opacity","1").unbind("click.closeShader")
},onclick_saveMode:function(a){a.preventDefault();
this.context.removeClass("edit-mode");
this.context.addClass("save-mode");
$("li.cameraDevice").css("opacity","1").unbind("click.closeShader")
},onclick_doneButton:function(a){a.preventDefault();
this.context.removeClass("edit-mode").removeClass("save-mode").find(".confirm-delete").remove();
this.render(true)
}});
DL.Dashboard.Views.PaginationGeneric=Backbone.View.extend({initialize:function(){this.template=$(DL.Dashboard.getTemplate("paginationGeneric")).html();
this.container=$(this.options.container);
this.render()
},render:function(){var a=$(_.template(this.template,this.options));
this.container.prepend(a).addClass("dl-paginate");
setTimeout(function(){a.css({display:"block"});
a.find(".page-nav").addClass("active")
},0)
}});
DL.Dashboard.Views.PaginationAdvanced=Backbone.View.extend({isAnimating:false,initialize:function(){this.columnWidth=this.options.columnWidth;
this.context=$(this.options.context);
this.slider=$(this.options.container);
this.totalPages=this.options.totalPages;
this.numOfColumns=this.options.elements;
this.columnsPerPage=this.options.columnsPerPage;
this.render()
},render:function(){var c=$("#app");
this.context.prepend($.tmpl(this.options.template,{}));
var b=[],a=0,e=this;
this.pagination=this.context.find(".paginationSection");
for(;
a<this.numOfColumns;
a++){var d=a<3?"active":"";
b.push('<li class="'+d+'" data-column='+a+">column_"+a+"</li>")
}b=b.join("");
this.pagination.find("ul").append($(b));
this.pagination.css({display:"block"});
this.animate.init(this.pagination,this)
},animate:{rightArrow:null,leftArrow:null,legendContainer:null,pageWidth:null,sliderWidth:null,parentCtx:null,mouseDownTimeout:null,hasClicked:false,hasMousedown:false,hasMouseup:false,isAnimating:false,reset:function(){this.isAnimating=this.hasClicked=this.hasMousedown=this.hasMouseup=false;
this.mouseDownTimeout=null
},updateNav:function(){var f=this.legendContainer.find("li"),e=Math.abs(DL.toNumber(this.parentCtx.slider.css("left"))),d=e<this.parentCtx.columnWidth/2,b=d?0:Math.ceil(e/this.parentCtx.columnWidth),a=this.parentCtx.numOfColumns-this.parentCtx.columnsPerPage;
f.removeClass("active");
for(var c=b;
c<b+3;
c++){$(f[c]).addClass("active")
}if(b==0||d){this.leftArrow.removeClass("active");
this.rightArrow.addClass("active")
}else{if(b>0){this.rightArrow.addClass("active");
this.leftArrow.addClass("active")
}}if(b>=a){this.rightArrow.removeClass("active")
}},snap:function(d,e){var b=this,c=DL.toNumber(this.parentCtx.slider.css("left")),a=Math.abs(c%this.parentCtx.columnWidth);
if(d=="right"){a=a-this.parentCtx.columnWidth
}this.parentCtx.slider.animate({left:c+a},{duration:1000,easing:"easeOutExpo",complete:function(){if(e){e()
}}})
},moveContinuous:function(d,f){var b=this,a=Math.abs(DL.toNumber(b.parentCtx.slider.css("left"))),e=d=="right"?-(this.parentCtx.columnWidth*(this.parentCtx.numOfColumns-this.parentCtx.columnsPerPage)):0,c=(function(){if(d=="right"){return Math.ceil(((b.sliderWidth-a)/b.parentCtx.columnWidth)*750)
}else{return Math.abs(Math.ceil((a/b.parentCtx.columnWidth)*750))
}})();
if(!this.isAnimating){this.isAnimating=true;
this.parentCtx.slider.animate({left:e},{duration:c,easing:"linear",step:function(){if(b.hasMouseup){b.parentCtx.slider.stop();
b.snap(d,function(){b.reset();
b.updateNav();
if(f){f()
}})
}else{b.updateNav()
}},complete:function(){if(f){f()
}}})
}},moveOnce:function(e){var d=e=="right"?-this.parentCtx.columnWidth:this.parentCtx.columnWidth,a=DL.toNumber(this.parentCtx.slider.css("left")),c=(a<-(d*3))?a+(d*3):"0px",b=this;
if(!this.isAnimating){this.isAnimating=true;
this.parentCtx.slider.animate({left:c},{duration:500,easing:"easeInOutExpo",complete:function(){b.updateNav();
b.reset()
}})
}},init:function(b,a){var d=b.find(".page-nav"),c=this;
this.parentCtx=a;
this.pageWidth=DL.getFullWidth(b);
this.sliderWidth=DL.getFullWidth(a.slider);
this.leftArrow=b.find(".leftArrow");
this.rightArrow=b.find(".rightArrow");
this.legendContainer=b.find("ul");
this.updateNav();
_.each(d,function(e){e=$(e);
e.monobind("click",$.proxy(c.onclick_control,c));
e.monobind("mousedown",$.proxy(c.onmousedown_control,c))
})
},onclick_control:function(c){c.preventDefault();
if(!this.isAnimating&&!this.hasClicked){this.hasClicked=true;
this.hasMouseup=true;
var b=$(c.currentTarget),a=this;
if(this.mouseDownTimeout){window.clearTimeout(this.mouseDownTimeout)
}if(b.hasClass("active")){this.moveOnce(b.attr("data-direction"))
}}},onmousedown_control:function(b){var a=$(b.currentTarget);
that=this;
if(!this.isAnimating&&!this.hasMousedown){this.mouseDownTimeout=setTimeout(function(){that.hasMousedown=true;
if(!that.hasClicked){b.preventDefault();
that.moveContinuous(a.attr("data-direction"),function(){that.reset()
});
function c(){that.hasMouseup=true;
a.unbind("mouseup",c)
}a.bind("mouseup",c)
}},1000)
}}}});
DL.Dashboard.Views.Device=DL.Dashboard.Views.BaseDeviceView.extend({className:"device-section",tagName:"li",initialize:function(a){this.template=DL.Dashboard.getTemplate("device");
this.containerSelector=this.options.containerSelector||"#app";
this.xy=this.options.xy;
this.context=$(this.el);
this.render()
},events:{"click .toggle":"toggleDevice","click .deviceClose":"closeView"},render:function(){var a=this.context.html($.tmpl($(this.template),this.model.toJSON()));
if(this.containerSelector instanceof Array){this.renderInPlace(a,this.containerSelector)
}else{$(this.containerSelector).append(a)
}return this
},updated:function(){this.context.css("webkitAnimationName","pulse")
},toggleDevice:function(){new Message({message:"Toggle device called on: "+this.model.get("name")});
this.model.set({value:!this.model.get("value")});
return false
},closeView:function(){this.context.fadeOut(function(){$(this).hide()
});
return false
}});
DL.Dashboard.Views.CO2Sensor=DL.Dashboard.Views.BaseDeviceView.extend({className:"device-section",tagName:"li",initDevice:function(){if(!this.isBoundListeners){this.bindListeners()
}this.template=DL.Dashboard.getTemplate("co2Sensor");
this.containerSelector=this.options.containerSelector||"#app";
this.data=this.collapseManagedObjects();
this.data.NormalizedStatus=this.normalizeStatus(this.data.Status);
this.data.Battery_level_class=this.getBatteryLevelClass(parseInt(this.data.Battery_level,10));
this.data.Floor=this.data.location.floor.label;
this.data.Room=this.data.location.room.label;
this.data.Default_name=this.data.managedObjectList[0].defaultValue;
this.currentName=this.data.managedObjectList[0].value;
this.data.showRoom=this.showRoom(this.data.Name,this.data.Default_name);
this.data.RenderDrawerOpen=this.model.get("renderDeviceDrawerOpen");
this.render()
},events:{"click .panelArrow":"onclick_toggleControlButton","click .editButton":"onclick_editButton","click .editCancel":"onclick_editButton","click .editSave":"onclick_editSave","click .activity":"onclick_deviceActivity"},render:function(){var b=$(this.el),a=$.tmpl($(this.template),this.data);
this.renderCommon(b,a)
}});
DL.Dashboard.Views.ContactSensor=DL.Dashboard.Views.BaseDeviceView.extend({className:"device-section",tagName:"li",initDevice:function(){if(!this.isBoundListeners){this.bindListeners()
}this.template=DL.Dashboard.getTemplate("contactSensor");
this.containerSelector=this.options.containerSelector||"#app";
this.data=this.collapseManagedObjects();
this.data.NormalizedStatus=this.normalizeStatus(this.data.Status);
this.data.Battery_level_class=this.getBatteryLevelClass(parseInt(this.data.Battery_level,10));
this.data.Floor=this.data.location.floor.label;
this.data.Room=this.data.location.room.label;
this.data.DefaultName=this.data.managedObjectList[0].defaultValue;
this.data.DisplayName=this.data.Name!=this.data.DefaultName?this.data.Name:this.data.DefaultName;
this.data.showRoom=this.showRoom(this.data.Name,this.data.DefaultName);
if(this.model.attributes.status!=0){this.data.Contact_state=this.data.NormalizedStatus
}this.data.RenderDrawerOpen=this.model.get("renderDeviceDrawerOpen");
this.render()
},events:{"click .panelArrow":"onclick_toggleControlButton","click .editButton":"onclick_editButton","click .editCancel":"onclick_editButton","click .editSave":"onclick_editSave","click .activity":"onclick_deviceActivity","click .move":"onclick_moveDevice"},render:function(){var b=$(this.el),a=$.tmpl($(this.template),this.data);
this.renderCommon(b,a)
}});
DL.Dashboard.Views.Camera=DL.Dashboard.Views.BaseDeviceView.extend({className:"device-section",tagName:"li",availableCameras:[],isDeletingPresets:false,data:{},videoSettings:DL.Dashboard.videoSettings,cameraFeedUrls:{},capturingVideoMessage:null,processingVideoMessage:null,render:function(){var d=this,c=d.el=$(d.el),b=$.tmpl($(d.template),d.data);
if(!d.captureLength){d.captureLength=parseInt(d.model.getMObjectById(1072).get("value"),10)
}c.find(".dvcContainer.cameraDevice").attr({"data-quickhelp":"Custom views can include cameras"});
d.renderCommon(c,b);
var a=$(".userControls").find(".dropdown a");
a.bind("click.closer",function(f){d.close();
a.unbind("click.closer")
})
},renderCommon:function(b,a){if(this.options.xy){this.renderInPlace(a,this.options.xy)
}else{if(this.containerElement){this.containerElement.html(a)
}else{this.containerElement=b;
$(this.containerSelector).append(b.html(a))
}}if(this.model.get("movable")){this.setDeviceMovable(b,true)
}},handleEvent:function(b,a){if(a.dev==this.model.id){this.model.timeOutMonitor.clear();
if(!this.hasTimedOutAction){this.removeHudMsg()
}if(a.EID){if(a.EID=="1030"){if(!this.hasTimedOutAction){this.removeHudMsg()
}this.checkQueue(a)
}else{if(a.EID=="1026"||a.EID=="1025"){if(this.cameraModal){this.hasTimedOutAction=false;
this.loadCamera()
}}}this.model.requiresFullRender=true;
this.initDevice()
}}},handleMessage:function(d,a){if(a.dev==this.model.id){this.model.timeOutMonitor.clear();
if(a.MOID){var c=this;
function b(){c.initDevice();
if(c.cameraModalIsOpen){c.loadCamera()
}}if(a.MOID=="10"){c.model.requiresFullRender=true;
b()
}else{if(a.MOID=="1025"){b()
}else{if(a.MOID=="1045"||a.MOID=="1202"){if(!c.hasTimedOutAction){c.removeHudMsg()
}}else{if(a.MOID.indexOf("1201")>-1){this.removeHudMsg();
if(!c.isDeletingPresets){c.goToDefaultPresetView($(".cameraModal"))
}}else{if(a.MOID=="1072"){c.settingsWaitStop()
}else{if(a.MOID=="1215"){if(a.value=="on"){if(c.checkForPrivacyMode()&&c.cameraModalIsOpen){c.enterPrivacyMode()
}}else{$(".privacyMode").remove()
}b()
}}}}}}}}},setCameraFeed:function(e){var c=this;
var b=c.videoSettings.videoType;
var d=c.videoSettings.quality;
var a=DL.Dashboard.getCameraFeedUrls+DL.Dashboard.gwid+"/"+c.model.id+"/"+b+"/"+d+".json";
if(c.data){DL.Dashboard.Main.Ajax(a,function(f){c.cameraFeedUrls=f.responseMessage.content;
e()
},function(f){c.liveFeedActive=false;
c.data.NormalizedStatus="offline";
c.data.CameraState="offline";
e()
},{type:"GET"})
}},parseCameraPresets:function(b,c){var a=DL.Dashboard.cameraPresetCommands+DL.Dashboard.gwid+"/"+b+".json";
DL.Dashboard.Main.Ajax(a,function(d){if(d.responseMessage.content){var g=[],f,e,h;
for(f=0,e=d.responseMessage.content.length;
f<e;
f++){h=d.responseMessage.content[f];
if(h.isSet){g.push(h)
}}c(g);
return
}return false
},null,{type:"GET"})
},getCameraState:function(c){var b=this;
this.data.CameraState="default";
if(parseInt(this.data.Status,10)==2){this.data.CameraState="offline";
if(c){c()
}}else{if(this.model.requiresFullRender||this.model.cachedCameraData==undefined){var a=DL.ServerSecurePath+DL.ContextUrl+"/secure/services/devices/camera/media/image/latest/content/"+DL.Dashboard.version+"/"+DL.Dashboard.gwid+"/"+this.model.id+".json";
DL.Dashboard.Main.Ajax(a,function(d){if(d.responseMessage.content==null){if(c){c(d)
}}else{if(d.responseMessage.content.data){b.data.SnapShotBinary=d.responseMessage.content.data;
b.data.SnapShotTimestamp=d.responseMessage.content.timestamp;
b.data.CameraState="snapShot";
b.model.cachedCameraData={snapshot:b.data.SnapShotBinary,timestamp:b.data.SnapShotTimestamp}
}else{b.model.cachedCameraData={}
}if(c){c()
}}},function(d){if(c){c(d)
}},{type:"GET"})
}else{b.data.SnapShotBinary=this.model.cachedCameraData.snapshot;
b.data.SnapShotTimestamp=this.model.cachedCameraData.timestamp;
b.data.CameraState="snapShot";
if(c){c()
}}}},close:function(){var a=this;
if(a.cameraModalIsOpen){a.cameraModal.close()
}if(a.player&&a.player.type=="flash"){a.player.stop();
a.player.remove();
$("#"+a.data.VideoFlashUrl).remove()
}else{$("video").remove()
}},timeoutCamera:function(a){a.isRestricted=true;
a.toggleState();
a.loadCamera();
window.clearTimeout(a.timeout)
},makeVideoFeed:function(b,c,d,a){new DL.Dashboard.Views.DLVideo(c.liveVideoId,{videoUrl:c.VideoFlashURL},function(e){if(e&&e.type=="html5"){b.player=e.player;
b.player.type="html5";
b.player.addEventListener("play",function(){$(".liveFeed").addClass("active");
$(".liveFeed span").html("Stop live feed")
},false);
b.player.addEventListener("pause",function(){$(".liveFeed").removeClass("active");
$(".liveFeed span").html("Start live feed")
},false);
b.player.addEventListener("error",function(){DL.log("HTML5 Video Error")
},false);
b.player.play();
$(".liveFeed").removeClass("active");
$(".liveFeed span").html("Start live feed");
if(!b.player.playing){b.player.play();
b.isRestricted=false;
b.toggleState();
if(d==="HIGH"){clearTimeout(b.timeout)
}}}else{if(e){b.player=e;
b.player.type="flash";
b.player.onPlay(function(){b.isRestricted=false;
b.toggleState();
if(d==="HIGH"){clearTimeout(b.timeout)
}});
b.player.onBuffer(function(){b.isRestricted=true;
b.toggleState()
});
b.player.onError(function(f){DL.log("Flash Video Error: ",f);
if(d==="HIGH"){}})
}}},a)
},checkForPrivacyMode:function(){var a=this.model.getMObjectById(1215);
if(a&&a.attributes.value==="on"){return true
}else{return false
}},enterPrivacyMode:function(b){b=b||this.modalContent;
b=$(b);
if(b){var c=this,d=$("<div/>").addClass("privacyMode").html("<h1>Privacy Mode Enabled</h1> <p>To see video, turn off privacy mode by pressing the button located on the back of the camera.</p>"),a=b.find(".view");
a.find(".no-controls").hide();
a.append(d)
}},makeCameraModal:function(){var b=this;
var c=b.data;
var d=b.videoSettings.quality;
var a=b.videoSettings.videoType;
b.cameraModal=new DL.Dashboard.ModalBase({template:"modals/camera",data:c,customEvents:{"click .close":function(f){b.close()
},"click a.gbtn.move":function(f){f.preventDefault();
b.onclick_moveDevice(f)
}},afterClose:function(){b.isCapturing=b.cameraModalIsOpen=b.isShowingHud=false;
b.cameraModal=null;
b.model.timeOutMonitor.clear()
},afterOpen:function(e){b.cameraModalIsOpen=true;
if(c.VideoContainsFeed&&!c.PrivacyMode){b.makeVideoFeed(b,c,d,a)
}if(c.PrivacyMode){b.enterPrivacyMode(e)
}}})
},setCameraFeedCallback:function(){var a=this;
var b="";
if(a.cameraFeedUrls){a.data.VideoContainsFeed=true;
if(a.videoSettings.localNetwork){b=a.cameraFeedUrls.direct
}else{b=a.cameraFeedUrls.indirect
}if(a.videoSettings.videoType=="FLASH"){a.data.VideoFlashURL=encodeURIComponent(b)
}else{a.data.VideoFlashURL=b
}a.data.Mode="videoFeed";
a.data.connectivity=DL.Dashboard.connectivity;
a.data.liveVideoId="liveFeedPlayer-"+new Date().getTime()
}if(a.checkForPrivacyMode()){a.data.PrivacyMode=true
}a.makeCameraModal();
if(a.data.isPanTiltCamera){a.panTilt.init(a.cameraModal.modalContent,a.model,a);
a.cameraModal.modalContent.find(".position").monobind("click",$.proxy(a.onclick_goToPosition,a))
}if(a.data.CameraState==="offline"||DL.Dashboard.connectivity==="LOW"){a.isRestricted=true
}a.cameraModal.modalContent.find(".liveFeed").monobind("click",$.proxy(a.onclick_startLiveFeed,a));
a.cameraModal.modalContent.find(".takeSnapShot").monobind("click",$.proxy(a.onclick_takeSnapShot,a));
a.cameraModal.modalContent.find(".capture").monobind("click",$.proxy(a.onclick_captureVideo,a));
a.cameraModal.modalContent.find(".camSettings").monobind("click",$.proxy(a.onclick_settings,a));
a.cameraModal.modalContent.find(".gallery").monobind("click",$.proxy(a.onclick_viewGallery,a));
a.cameraModal.modalContent.find(".editButton").monobind("click",$.proxy(a.onclick_editCameraName,a));
a.cameraModal.modalContent.find(".cameraErrorMessageClear").monobind("click",$.proxy(a.onclick_cameraErrorClear,a))
},loadCamera:function(){var a=this.data||{};
a.Mode="image";
a.Movable=this.model.get("isCameraDevice")?"movable":"";
this.isRestricted=true;
this.setCameraFeed($.proxy(this.setCameraFeedCallback,this))
},loadSettings:function(){var h=this,b=null,d=this.data||{},k=DL.Dashboard.restURLs.setPropertyOnDevice+DL.Dashboard.gwid+"/"+this.model.id+"/1072/";
d.deviceType=d.managedObjectList[0].defaultValue||d.label;
h.close();
this.settingsModal=new DL.Dashboard.ModalBase({template:"modals/cameraSettings",data:d,afterOpen:function(l){var m=l.find(".selections");
m.find("li").each(function(){var n=$(this);
if(n.find("a").data("time")==h.captureLength){n.addClass("active")
}});
l.find(".cameraHome").monobind("click",$.proxy(h.onclick_cameraDeviceTile,h));
l.find(".customSelector").monobind("mousewheel",c);
l.find(".selections li, .selections li a").monobind("click",e);
a(l.find(".selections"),l.find(".selections .active"));
l.find(".activity").monobind("click",$.proxy(h.onclick_deviceActivity,h))
}});
function c(q,r,m,l){var p=$(this).find(".selections"),o=p.find(".active"),n=l>0?o.prev():o.next();
if(n.length>0){g(p,n)
}q.preventDefault()
}function g(m,l){m.find(".active").removeClass("active");
l.addClass("active");
a(m,l);
f(l.find("a").data("time"))
}function a(p,o){var q=p.height()/p.find("li").length,l=p.parent().height(),n=o.prevAll().length,m=(l-q)/2;
p.stop(true).animate({top:m-(q*n)})
}function e(o){o.preventDefault();
o.stopPropagation();
var n=$(o.currentTarget),m=n.parents(".selections"),l=n.is("li")?n:n.parents("li");
g(m,l)
}function f(l){clearTimeout(b);
b=window.setTimeout(function(){var n=k+l+".json",m=h.settingsModal.modalContent.find(".error");
if(m.length){m.slideUp(function(){m.remove()
})
}DL.Dashboard.Main.Ajax(n,function(o){var p=h.settingsModal.modalContent.find(".error");
if(p.length){p.slideUp(function(){p.remove()
})
}h.captureLength=l;
$.proxy(h.settingsWaitStart,h)
},function(o){var p=h.settingsModal.modalContent.find(".error");
if(p.length){p.text(o.responseMessage.message)
}else{p=$('<p class="error">'+o.responseMessage.message+"</p>");
h.settingsModal.modalContent.find(".viewPort").prepend(p);
p.slideDown()
}},{type:"POST"})
},1000)
}},settingsWaitTimer:null,settingsWaitClear:function(){if(this.settingsWaitTimer){window.clearTimeout(this.settingsWaitTimer)
}},settingsWaitStart:function(){var a=this;
this.settingsModal.modalContent.prepend('<div class="screen"><img src="'+DL.AssetsSecureBasePath+'/assets/images/ajax-loader.gif" /></div>');
this.settingsWaitTimer=window.setTimeout(function(){a.settingsWaitStop(true)
},30000)
},settingsWaitStop:function(a){this.settingsWaitClear();
if(this.settingsModal&&this.settingsModal.modalContent){var b=this.settingsModal.modalContent.find(".screen");
b.remove();
if(a){var c=$('<p class="error">There was an error processing your request. Please try again later. [CL1]</p>');
this.settingsModal.modalContent.find(".viewPort").prepend(c);
c.slideDown()
}}},loadGallery:function(h){this.close();
var g=h?h:this.data,a=$(".modal.mediaGallery"),d=[],f=this.availableCameras.length;
if(f>1){g.ContainsMultipleCameras=true
}for(var c=0;
c<f;
c++){var e=this.availableCameras[c];
if(e.deviceUid!==g.deviceUid){d.push(e)
}}g.AdditionalCameras=d;
function b(k,l){k=k?k:a;
if(l){g.rerender=true
}new DL.Dashboard.Views.MediaGallery({context:k,data:g})
}if(a.length<1){a=new DL.Dashboard.ModalBase({template:"modals/mediaGallery",data:g,afterOpen:function(k){b(k)
}})
}else{b(null,true)
}},liveFeed:{start:function(b,a){a.play();
b.find(".viewPort").removeClass("image");
b.find(".liveFeed span").html("Stop live feed")
},stop:function(b,a){var c=this;
if(a.type=="flash"){a.stop();
b.find(".viewPort").addClass("image");
b.find(".liveFeed span").html("Start live feed")
}else{if(a.type="html5"){a.pause()
}}}},panTilt:{view:null,timeout:null,mainModelObj:null,set:function(d,c,f){var e=c||this.mainModelObj.get("deviceUid"),b=this;
if(e){var a=DL.Dashboard.restURLs.setPropertyOnDevice+DL.Dashboard.gwid+"/"+e+"/1045/"+d+".json";
DL.Dashboard.Main.Ajax(a,function(g){if(f){f()
}},function(g){b.parentContext.displayAlert()
},{})
}},onclick_direction:function(c){c.preventDefault();
var b=this.activeTarget=$(c.currentTarget),a=this.view.find(".direct");
direction=b.attr("data-direction");
this.parentContext.showHudMsg();
this.set(direction)
},init:function(b,a,c){this.view=b;
this.mainModelObj=a;
if(c){this.parentContext=c
}b.find(".direct").monobind("click",$.proxy(this.onclick_direction,this));
b.find(".no-controls").removeClass("no-controls")
}},captureQueue:[],checkQueue:function(k){var h=this,f;
for(var g=0,d=h.captureQueue.length;
g<d;
g++){if(h.captureQueue[g].cqid==k.cqid){var l=(h.captureQueue[g].type=="video")?"Video Clip":"Snapshot";
if(typeof h){if(h.captureQueue[g].view!=h.cid){break
}else{f=(h.cameraModalIsOpen)?true:false
}}else{f=false
}if(f){if(h.capturingVideoMessage){clearTimeout(h.capturingVideoMessage);
h.capturingVideoMessage=null;
if(h.processingVideoMessage){clearTimeout(h.processingVideoMessage);
h.processingVideoMessage=null
}h.removeHudMsg()
}h.showHudMsg('<div class="hud-msg"><p>Your '+l.toLowerCase()+" is available in the gallery.</p></div>","saveMsg");
setTimeout(function(){h.removeHudMsg();
h._onCaptureVideoDone()
},4000)
}else{modal=new DL.Dashboard.ModalBase({template:"modals/basic",data:{confirm:"Ok",title:"New "+l+" in Gallery",body:"Your "+l.toLowerCase()+" is available in the gallery."},customEvents:{"click .yes":function(a){a.preventDefault();
modal.close()
}}})
}var e=h.captureQueue.splice(0,g),c=h.captureQueue.splice(1,d);
h.captureQueue=e.concat(c)
}}},takeSnapShot:function(c){var a=DL.Dashboard.restURLs.setPropertyOnDevice+DL.Dashboard.gwid+"/"+this.model.id+"/1070/image.json",b=this;
DL.Dashboard.Main.Ajax(a,function(f){b.captureQueue.push({cqid:f.responseMessage.content.cqid,type:"image",view:b.cid});
var e=$(".cameraControls").find(".view"),d=document.createElement("div");
d.className="snap";
d=$(d);
e.append(d);
d.fadeOut("slow",function(){b.isRestricted=true;
b.toggleState();
b.showHudMsg();
if(c){c()
}})
},function(d){b.displayAlert()
},{})
},showCustomDeviceError:function(a){this.removeHudMsg();
this.cameraModal.modalContent.find(".error").show().find(".cameraErrorMessage").html(a)
},captureVideo:function(e,h){if(e&&!isNaN(e)){var c=DL.Dashboard.restURLs.setPropertyOnDevice+DL.Dashboard.gwid+"/"+this.model.id+"/1070/video.json",g='<div class="hud-msg"><p class="capturing"><img src="'+DL.AssetsSecureBasePath+'/assets/images/ajax_loader_sm_fff.gif" />Capturing video&hellip;</p><p class="status"><span class="remaining"></span>seconds remaining</p><div class="meterWrap"></div></div>',a='<div class="hud-msg"><p class="capturing processing"><img src="'+DL.AssetsSecureBasePath+'/assets/images/ajax_loader_sm_fff.gif" />Processing Video</p><p class="status">Your video will be available in the gallery shortly.</p></div>',f=this,b=132,d=e;
function k(){var n=$("<div/>").addClass("meter"),m=f.cameraModal.modalContent;
remaining=m.find(".remaining");
function l(){f.capturingVideoMessage=setTimeout(function(){var p=--d,q=Math.round((p/e)*100),o;
if(p>-1){remaining.html(p.toString().length<2?"0"+p:p);
n.width(132*(1-(q/100)));
l()
}else{f.removeHudMsg(f.cameraModal.modalContent,function(){f.showHudMsg(a,"captureMsg",function(){f.processingVideoMessage=setTimeout(function(){f.removeHudMsg();
if(h){h()
}},4000)
})
})
}},1000)
}remaining.html(e);
m.find(".meterWrap").append(n);
l()
}}DL.Dashboard.Main.Ajax(c,function(l){f.captureQueue.push({cqid:l.responseMessage.content.cqid,type:"video",view:f.cid});
f.showHudMsg(g,"captureMsg",function(m){k(m)
})
},function(l){f.displayTimeout()
},{})
},displayTimeout:function(){var a='<div class="hud-msg"><a class="refresh" href="#">Refresh</a><div class="hud-timeout-msg"><p>Timed Out.</p><p class="small">Please try again.</p></div>',b=this;
this.hasTimedOutAction=true;
this.isRestricted=true;
this.removeHudMsg(this.cameraModal.modalContent,function(){b.showHudMsg(a,"timeout");
b.toggleState();
b.cameraModal.modalContent.find(".refresh").bind("click",$.proxy(function(c){c.preventDefault();
b.hasTimedOutAction=false;
b.loadCamera()
},b))
})
},displayAlert:function(){var a='<div class="hud-msg"><div class="hud-alert"><p>Alert!</p></div></div>';
this.removeHudMsg();
this.showHudMsg(a,"alert")
},editName:function(){var b=this.cameraModal.modalContent.find(".viewer");
textarea=b.find("textarea"),heading=b.find("h1"),mainWrap=this.cameraModal.modalContent.find(".controlsWrap"),canSave=true;
errorState=b.find(".error");
me=this;
function e(f){if(f&&f.responseMessage&&f.responseMessage.code=="0"){heading.html(textarea.val());
d()
}}function d(f){b.find(".error").hide();
canSave=true;
b.removeClass("editName");
me.removeHudMsg()
}function c(f){if(canSave){canSave=false;
me.changeName(f,e,true).fail(function(g){if(g&&g.responseMessage&&g.responseMessage.message){a(g.responseMessage.message)
}else{a("There was an error processing your request. Please try again later. [SV1]")
}}).always(function(){canSave=true
});
me.showHudMsg()
}}function a(f){me.removeHudMsg();
b.find(".error").show().find(".cameraErrorMessage").html(f)
}b.addClass("editName");
mainWrap.find(".editSave").click(function(f){f.preventDefault();
c(textarea.val())
});
mainWrap.find(".editCancel").click(function(f){f.preventDefault();
d()
});
textarea.focus();
textarea.keydown(function(f){if(f.keyCode=="13"||f.keyCode=="09"){f.preventDefault();
if(textarea.val()!=heading.val()){if(f.keyCode=="09"){textarea.blur()
}if(f.keyCode=="13"){c(textarea.val())
}}}})
},showHudMsg:function(e,d,f,c,b){c=c?c:(this.cameraModal?this.cameraModal.modalContent:null);
if(c&&!this.isShowingHud){var a=document.createElement("div");
this.isShowingHud=true;
e=e||'<div class="hud-msg"><img src="'+DL.AssetsSecureBasePath+'/assets/images/ajax_loader_sm_fff.gif"><p>Working&hellip;</p></div>';
d=d||"working";
a.innerHTML=e;
a.className="hud";
c.find(".viewer .view").append($(a).addClass(d));
this.isRestricted=true;
this.toggleState();
if(d!=="timeout"&&d!=="delete"&&d!=="captureMsg"){this.model.timeOutMonitor.start((b?30000+this.captureLength:30000),this.model.id,$.proxy(this.displayTimeout,this))
}if(f){f(c)
}}},removeHudMsg:function(b,c){b=b?b:(this.cameraModal?this.cameraModal.modalContent:null);
if(b){var a=b.find(".controlsWrap .viewer .hud");
if(a){a.remove();
this.isShowingHud=false;
if(!this.hasTimedOutAction){this.hasTimedOutAction=this.isRestricted=false;
this.toggleState()
}}if(c){c()
}}},isEnabled:function(a){if(a.parents(".offline:first").length>0){return false
}return true
},getCameraMedia:function(d,c){var b=this,d=d?d:b.model.id,a=DL.ServerSecurePath+DL.ContextUrl+"/secure/services/devices/camera/media/all/"+DL.Dashboard.gwid+"/"+d+".json";
DL.Dashboard.Main.Ajax(a,function(f){var e=[];
_.each(f.responseMessage.content,function(g){var h=g.itemType=="image/jpeg"?"still-image":"video";
e.push({id:g.itemId,type:h,srcThumbnail:g.thumbFilename,srcFile:g.itemFilename,timeStamp:g.timestamp})
});
if(b.data){b.data.Media=e
}if(c){c(e);
return
}},null,{type:"GET"})
},toggleState:function(){var a=this.context?this.context:(this.cameraModal?this.cameraModal.modalContent:null);
if(a){var b=a.find(".controlsWrap");
if(this.isRestricted==true){b.addClass("restricted")
}else{b.removeClass("restricted")
}}},togglePositionsPanel:function(c){var a=this.cameraModal.modalContent.find(".positions"),b=this;
if(a.data("open")){a.fadeOut(100,function(){b.cameraModal.modalContent.animate({width:500,left:"+=152px"},250);
a.data("open",false);
c.removeClass("active")
})
}else{c.addClass("active");
this.goToDefaultPresetView(this.cameraModal.modalContent,function(){b.cameraModal.modalContent.animate({width:652,left:"-=152px"},250,function(){a.fadeIn(100,function(){a.data("open",true)
})
})
})
}},goToDefaultPresetView:function(a,d){if(!a){a=$(".cameraModal")
}var c=a.find(".positions"),b=this;
this.isDeletingPresets=false;
if(c.length>0){this.parseCameraPresets(this.model.id,function(e){b.data.presets=e;
new DL.Dashboard.Views.CameraPresetList({context:a,containingElement:c,camera:b,data:{maxPresetsValue:parseInt(b.data.Presets,10),totalPresets:e}});
if(d){d()
}})
}},onclick_goToPosition:function(a){a.preventDefault();
if(!this.isCapturing&&!this.isRestricted){this.togglePositionsPanel($(a.currentTarget))
}},onclick_cameraDeviceTile:function(b){b.preventDefault();
var a=$(b.currentTarget);
if(a.data("disabled")||a.parents(".page-custom-view-edit:first").length||this.data.NormalizedStatus=="offline"){return false
}if(!DL.Dashboard.customer.customerAdmin){this.loadCamera()
}},onclick_startLiveFeed:function(c){c.preventDefault();
var a=this,b=$(c.currentTarget);
if(a.checkForPrivacyMode()){a.enterPrivacyMode(a.cameraModal)
}else{if((a.player.type=="html5"||a.isEnabled(b))&&!a.isRestricted){if(b.hasClass("active")){b.removeClass("active");
a.liveFeed.stop(b.parents(".controlsWrap:first"),a.player)
}else{b.addClass("active");
a.liveFeed.start(b.parents(".controlsWrap:first"),a.player)
}}}},onclick_takeSnapShot:function(b){b.preventDefault();
var a=$(b.currentTarget);
if(this.isEnabled(a)&&!this.isRestricted){a.addClass("active");
this.takeSnapShot(function(){a.removeClass("active")
})
}},onclick_captureVideo:function(c){c.preventDefault();
var a=this,b=$(c.currentTarget);
if(!a.isCapturing&&a.isEnabled(b)&&!a.isRestricted){a.isCapturing=true;
b.addClass("active");
a.captureVideo(a.captureLength,function(){a._onCaptureVideoDone()
})
}},onclick_settings:function(a){a.preventDefault();
if(this.isEnabled($(a.currentTarget))&&!this.isRestricted){this.loadSettings()
}},onclick_viewGallery:function(b){b.preventDefault();
var a=this;
$(b.currentTarget).find("span").addClass("loading-spinner");
this.getCameraMedia(null,function(){a.loadGallery()
})
},onclick_deviceActivity:function(a){a.preventDefault();
this.openDeviceActivityModal()
},onclick_editCameraName:function(a){a.preventDefault();
this.editName($(a.currentTarget).parents(".viewer:first"))
},onclick_cameraErrorClear:function(a){a.preventDefault();
$(a.currentTarget).parents(".error").hide()
},_onCaptureVideoDone:function(){this.isCapturing=false;
this.cameraModal.modalContent.find(".capture").removeClass("active")
}});
DL.Dashboard.Views.IPCamera=DL.Dashboard.Views.Camera.extend({className:"device-section",bindListeners:function(){DL.PubSub.subscribe("oncustomevent",$.proxy(this.handleEvent,this));
DL.PubSub.subscribe("onmessagereceived",$.proxy(this.handleMessage,this));
this.isBoundListeners=true
},initDevice:function(a){var b=this;
if(!this.isBoundListeners){this.bindListeners()
}if(navigator.userAgent.indexOf("MSIE 7")===-1&&navigator.userAgent.indexOf("MSIE 8")===-1){DL.Dashboard.videoSettings.test()
}this.template=DL.Dashboard.getTemplate("ipCamera");
this.containerSelector=this.options.containerSelector||"#app";
this.model.isCameraDevice=true;
this.isCapturing=false;
this.data=this.collapseManagedObjects();
this.data.NormalizedStatus=this.normalizeStatus(this.data.Status);
this.data.Floor=this.data.location.floor.label;
this.data.Room=this.data.location.room.label;
this.data.isPanTiltCamera=this.isPanTiltCamera();
this.data.LoadStatus="loading";
this.render();
this.getCameraState(function(){b.containerSelector=b.el;
b.data.LoadStatus="loaded";
b.hasTimedOutAction=false;
var c=true;
_.each(b.availableCameras,function(d){if(d&&d.Name===b.data.Name){c=false
}});
if(c){b.availableCameras.push({Name:b.data.Name,deviceUid:b.data.deviceUid,Room:b.data.Room})
}b.render();
b.model.requiresFullRender=false
})
},events:{"click .camera":"onclick_cameraDeviceTile"},isPanTiltCamera:function(){var a=false;
if(this.data.deviceSubClassId=="00"){a=true
}return a
}});
DL.Dashboard.Views.CameraPresetList=Backbone.View.extend({initialize:function(){this.template=DL.Dashboard.getTemplate("cameraPresetList");
this.data=this.options.data;
this.data.createPresetList=this.createPresetList;
this.containingElement=this.options.containingElement;
this.context=this.options.context;
this.parentCamera=this.options.camera;
this.model=this.parentCamera.model;
if(this.data){this.render()
}},render:function(){var b=this.el=$(this.el),a=$.tmpl($(this.template),this.data);
this.containingElement.html(a);
this.containingElement.removeClass("save delete");
this.containingElement.find(".reset").monobind("click",$.proxy(this.onclick_reset,this));
this.containingElement.find(".preset").monobind("click",$.proxy(this.onclick_preset,this));
this.containingElement.find(".save").monobind("click",$.proxy(this.onclick_savePositionPreset,this));
this.containingElement.find(".delete").monobind("click",$.proxy(this.onclick_deletePositionPreset,this))
},createPresetList:function(a){var c=[];
for(var b=0;
b<a;
b++){c.push('<li><a class="position" data-preset="'+b+'" href="#"><span>Position '+(b+1)+"</span></a></li>")
}return c.join("")
},savePreset:function(d,b){var a=DL.Dashboard.cameraPresetCommands+DL.Dashboard.gwid+"/"+this.model.id+".json",c=this;
d=parseInt(d,10);
if(!isNaN(d)){DL.Dashboard.Main.Ajax(a,function(e){if(e.responseMessage.code=="0"){c.parentCamera.showHudMsg()
}},null,{type:"POST",contentType:"application/json",data:JSON.stringify({presetId:d,isSet:false})})
}},deletePreset:function(d,b){var a=DL.Dashboard.cameraPresetCommands+"delete/"+DL.Dashboard.gwid+"/"+this.model.id+"/"+d+".json",c=this;
DL.Dashboard.Main.Ajax(a,function(e){if(e.responseMessage.code=="0"){b.slideUp(function(){b.remove();
c.parentCamera.showHudMsg()
})
}},null,{type:"POST"})
},goToSavePresetView:function(){var d=this.context.find(".positions"),c=d.find("ul"),b=this;
function a(g){g.preventDefault();
g.stopImmediatePropagation();
var f=$(g.currentTarget);
b.savePreset(f.data("preset"),f)
}this.parentCamera.isDeletingPresets=false;
d.addClass("save");
d.find("a.position").monobind("click",a);
d.find(".cancel").monobind("click",$.proxy(this.onclick_cancelAndReturn,this))
},goToDeletePresetView:function(){var d=this.context.find(".positions"),b=d.find(".preset"),c=d.find(".done"),a=false;
me=this;
d.addClass("delete");
this.parentCamera.isDeletingPresets=true;
function e(h){h.preventDefault();
h.stopImmediatePropagation();
var g=$(h.currentTarget);
presetElement=g.parents("a:first");
presetValue=g.parents("a:first").data("preset");
if(!a){me.parentCamera.showHudMsg('<p>Are you sure you want to delete "Position '+(presetValue+1)+'"?</p><a href="#" class="yes gbtn gactive">Yes</a><a href="#" class="no gbtn">No</a>',"delete",function(k){a=true;
k.find("a").bind("click",function(l){l.preventDefault();
g=$(l.currentTarget);
if(g.hasClass("yes")){me.deletePreset(presetValue,presetElement)
}me.parentCamera.removeHudMsg(me.context);
a=false
})
},me.context)
}}function f(g){g.preventDefault();
d.removeClass("delete");
d.find(".pDelete").remove();
this.parentCamera.goToDefaultPresetView()
}$.each(b,function(g,h){var h=$(h);
h.append($('<span class="pDelete">Delete</span>'));
h.find(".pDelete").bind("click",e)
});
c.bind("click",$.proxy(f,this))
},onclick_reset:function(b){b.preventDefault();
var a=this;
if(!this.parentCamera.isRestricted){this.parentCamera.panTilt.set("home",this.model.id,function(){a.parentCamera.showHudMsg(null,null,null,a.context)
})
}},onclick_preset:function(b){b.preventDefault();
var a=$(b.currentTarget);
if(!this.parentCamera.isRestricted){this.parentCamera.showHudMsg(null,null,null,this.context,false,true);
this.parentCamera.updateProperty(this.model.id,"1202",a.attr("data-preset"),null,true)
}},onclick_savePositionPreset:function(a){a.preventDefault();
if(!this.parentCamera.isRestricted){this.goToSavePresetView()
}},onclick_deletePositionPreset:function(a){a.preventDefault();
if(!this.parentCamera.isRestricted){this.goToDeletePresetView()
}},onclick_cancelAndReturn:function(b){b.preventDefault();
var a=$(b.currentTarget);
if(!this.parentCamera.isRestricted){a.parents(".positions:first").removeClass("save delete")
}}});
DL.Dashboard.Views.DoorLock=DL.Dashboard.Views.BaseDeviceView.extend({className:"device-section",tagName:"li",bindListeners:function(){DL.PubSub.subscribe("onmessagereceived",$.proxy(this.handleMessage,this));
this.isBoundListeners=true
},initDevice:function(){var b=this,a=this.model.get("isupdating");
if(!this.isBoundListeners){this.bindListeners()
}this.template=DL.Dashboard.getTemplate("doorLock");
this.containerSelector=this.options.containerSelector||"#app";
this.containerSelector=$(this.containerSelector);
this.data=this.collapseManagedObjects();
this.data.isUpdating=a!=="undefined"?a:false;
this.data.NormalizedStatus=this.normalizeStatus(this.data.Status);
this.data.Battery_level_class=this.getBatteryLevelClass(parseInt(this.data.Battery_level,10));
this.data.Floor=this.data.location.floor.label;
this.data.RenderDrawerOpen=this.model.get("renderDeviceDrawerOpen");
this.data.Room=this.data.location.room.label;
this.data.Default_name=this.data.managedObjectList[0].defaultValue;
this.data.showRoom=this.showRoom(this.data.Name,this.data.Default_name);
if(this.data.Status==="0"){this.data.active="";
this.data.LockOutput="unlocked";
if(this.data.Lock==="lock"){this.data.active="active";
this.data.LockOutput="locked"
}}else{this.data.Lock="unlock"
}this.currentName=this.data.managedObjectList[0].value;
if(!this.model.attributes.doorLockCodes||this.requiresFullRefresh){this.data.ContainsValidCodes=false;
this.data.ContainsOpenSlots=true;
this.getDoorLockCodes(function(c,d){b.data.Codes=b.model.attributes.doorLockCodes=c;
if(d){b.data.ContainsValidCodes=true
}b.requiresFullRefresh=false;
b.render()
})
}else{this.data.Codes=this.model.attributes.doorLockCodes;
this.setValidCodesAndOpenSlots(this.data.Codes);
this.render()
}},events:{"click .icon-wrap":"onclick_deviceIcon","click .panelArrow":"onclick_toggleControlButton","click .editButton":"onclick_editButton","click .editCancel":"onclick_editButton","click .editSave":"onclick_editSave","click .editDone":"onclick_editDone","click .editDelete":"onclick_editDelete","click .editCancel":"onclick_addButton","click .lockToggle":"onclick_toggleState","click .activity":"onclick_deviceActivity","click .addButton":"onclick_addButton","click .field label":"onclick_label","focus .field input":"onfocus_field","click .autoLockToggle":"onclick_autoLockToggle","click .backlightToggle":"onclick_toggleBacklight","click .list a":"onclick_savedCode"},render:function(){var b=$(this.el),a=$.tmpl($(this.template),this.data);
this.renderCommon(b,a);
if(this.model.attributes.status==0){this.getAndSetBacklightStatus();
this.autoLockDelaySupport()
}$(".thinGreyScrollbar",b).jScrollPane({verticalDragMaxHeight:40})
},handleMessage:function(d,c){if(c.dev==this.model.id){this.model.timeOutMonitor.clear();
if(c.MOID=="1257"||c.MOID=="1252"){this.removeUpdatingSpinner();
this.removeWorking($(this.el).find("autoLockDelayContainer"));
this.initDevice()
}else{if(c.MOID.indexOf("1255")>-1){var b=$(this.el).find(".controlPanel");
this.removeUpdatingSpinner();
this.removeWorking(b);
var a=c.value.split("~")[0];
if(a=="-1"){this.showError(b.find(".code:first"),"This PIN is a duplicate. Please try again.")
}else{if(a=="-2"){this.showError(b.find(".code:first"),"There was a problem setting the PIN on the device.")
}else{this.requiresFullRefresh=true;
this.initDevice()
}}}}}},insertWorking:function(a){a.append($("<div/>",{"class":"progress"}).append($("<span/>",{html:"Working&hellip;"})))
},removeWorking:function(a){a.find(".progress").remove()
},getInstallerConfigurationValues:function(){if(this.data.installer_configuration&&this.data.installer_configuration!="error"){var b=this.data.installer_configuration.split(","),e={};
for(var c=0,a=b.length;
c<a;
c++){var d=b[c].split("=");
e[d[0]]=d[1]
}return e
}else{return false
}},setValidCodesAndOpenSlots:function(a){var e=false,d=a.length;
for(var c=0,b=a.length;
c<b;
c++){if(a[c].isSet){d--;
e=true
}}if(d==0){this.data.ContainsOpenSlots=false
}else{this.data.ContainsOpenSlots=true
}this.data.ContainsValidCodes=e
},getDoorLockCodes:function(c){var a=DL.ServerSecurePath+DL.ContextUrl+"/secure/services/devices/doorlock/codes/"+DL.Dashboard.gwid+"/"+this.model.id+".json";
var b=this;
DL.Dashboard.Main.Ajax(a,function(d){if(c){c(d.responseMessage.content,b.setValidCodesAndOpenSlots(d.responseMessage.content))
}},null,{type:"GET"})
},autoLockDelaySupport:function(){var b=this.getAutoLockDelay(),a=b[0];
if(b){if(a!=0){$(this.el).find(".autoLockDelay").removeClass("hide")
}this.setInitialAutoLockDelay(b[1],b[2])
}},getAutoLockDelay:function(){if(this.data.installer_configuration!="error"){var b=parseInt(this.getInstallerConfigurationValues().lockTimeout),a=0,c=0;
if(b>0){a=Math.floor(b/60);
c=b%60
}return[b,a,c]
}else{return false
}},setInitialAutoLockDelay:function(e,h){var g=this,c=$(this.el),f=c.find(".autoLockDelay"),b=c.find(".delay"),k=b.find(".minutes"),a=b.find(".seconds"),d=g.getAutoLockDelay()[0];
if(d!=0){if(d==-1){e=0,h=0
}if(d>0){b.show();
f.find(".actionPanel").addClass("active")
}k.find("li").each(function(m){var l=$(this);
if(l.data("minutes")==e){l.addClass("selected")
}});
a.find("li").each(function(m){var l=$(this);
if(l.data("seconds")==h){l.addClass("selected")
}});
g.setAutoLockDelay(f,b,k,a)
}},doorLockPropertySelectTimeout:{timeout:null,timeoutLength:2000,set:function(b){var a=this;
this.timeout=setTimeout(function(){b()
},this.timeoutLength)
},clear:function(a){clearTimeout(this.timeout);
this.timeout=null;
a()
}},setAutoLockDelay:function(g,b,o,a){var m=this,n=b.find(".timeSelector"),l=b.find(".timeSelector.seconds ul");
n.hover(function(){k($(this))
});
b.find(".timeSelector.minutes").monobind("mousewheel",d);
b.find(".timeSelector.seconds").monobind("mousewheel",d);
n.find("li").monobind("click",h);
c(o,o.find(".selected"));
c(a,a.find(".selected"));
function k(p){return(!!~p.attr("class").indexOf("minutes"))?"minutes":(!!~p.attr("class").indexOf("seconds"))?"seconds":""
}function d(v,x,t,s){var p=k($(this));
if(p>""){var q=$(m.el).find(".timeSelector."+p);
var u=q.children("ul");
var r=u.find(".selected");
var w=s>0?r.prev():r.next();
if(w.length>0){f(q,w)
}}v.preventDefault()
}function f(p,q){m.doorLockPropertySelectTimeout.clear(function(){c(p,q,function(){var r=e(p);
m.doorLockPropertySelectTimeout.set(function(){if(r==0){r=-1;
b.slideUp(function(){b.siblings(".autoLockDelay").children(".actionPanel").removeClass("active")
})
}else{m.insertWorking(n.parents(".autoLockDelayContainer"))
}m.sendAutoLockTimeoutToServer(r,p)
})
})
})
}function e(q){var p=q.parents(".timeSelect:first"),t=parseInt(p.find(".seconds ul .selected").data("seconds")),r=parseInt(p.find(".minutes ul .selected").data("minutes")),s=(r*60)+t;
return(r*60)+t
}function c(x,r,v){var s=x.children("ul"),w=x.parents(".timeSelect").find(".minutes ul"),u=w.height()/w.find("li").length,p=w.parent().height(),t=r.prevAll().length,q=(p-u)/2;
s.find(".selected").removeClass("selected");
s.stop(true).animate({top:q-(u*(t))},{complete:function(){r.addClass("selected");
var y=x.parents(".timeSelect:first"),E=parseInt(y.find(".seconds ul .selected").data("seconds")),A=parseInt(y.find(".minutes ul .selected").data("minutes"));
if(A>2&&E!=0){var D=x.parents(".timeSelect").find(".seconds ul"),C=x.parents(".timeSelect").find(".minutes ul"),B=C.height()/C.find("li").length,F=C.parent().height(),G=0,z=(F-B)/2;
D.find(".selected").removeClass("selected");
D.animate({top:z-(B*(G))});
D.find("li").each(function(I){var H=$(this);
if(H.data("seconds")==0){H.addClass("selected")
}})
}if(v){v()
}}})
}function h(u){u.preventDefault();
u.stopPropagation();
var t=$(u.currentTarget),q=t.parents(".timeSelect").find(".seconds ul li.selected"),p=t.parents(".timeSelect").find(".minutes ul li.selected"),s=t.parents(".timeSelector"),r=t.is("li")?t:t.parents("li");
f(s,r)
}},sendAutoLockTimeoutToServer:function(b,c){var a=this.getInstallerConfigurationValues();
if(a){a.lockTimeout=b
}this.updateProperty(this.model.id,"1257",DL.objectToString(a),c)
},getAndSetBacklightStatus:function(){var b=$(this.el),c,a=b.find(".backlight");
if(this.data.installer_configuration!="error"){$(this.el).find(".backlight").removeClass("hide");
c=this.getInstallerConfigurationValues().statusLed
}if(c){if(c=="on"||c=="off"){if(c=="on"){a.find(".actionPanel").addClass("active")
}else{if(c=="off"){a.find(".actionPanel").removeClass("active")
}}}}},toggleAutoLock:function(){var b=this,a=$(this.el),c=a.find(".autoLockDelay .toggleBtn");
activePanel=c.parents(".actionPanel:first");
if(activePanel.hasClass("active")){a.find(".delay").slideUp(function(){activePanel.removeClass("active");
b.sendAutoLockTimeoutToServer(-1)
})
}else{a.find(".delay").slideDown(function(){activePanel.addClass("active")
})
}},sendBacklightToServer:function(b){var a=this.getInstallerConfigurationValues();
if(a){a.statusLed=b
}this.updateProperty(this.model.id,"1257",DL.objectToString(a))
},toggleCodePanel:function(g,b,f){var d=$(this.el),a=d.find(".code"),h=this;
g=g?g:d.find(".addButton");
function c(){a.find("input").val("");
a.find("label").css({display:"block"});
a.find('input[name="doorLockCodeId"]').val("")
}if(a.data("isOpen")&&!f){a.removeClass("editing");
a.find(".error").removeClass("error");
a.find(".codeError").slideUp();
a.slideUp(function(){a.data("isOpen",false);
c();
if(!g.hasClass("editCancel")){g.html("+")
}h.toggleCodeList(a.find(".list"))
})
}else{if(b){var e=a.find('input[name="doorLockCodeId"]'),k=a.find('input[name="nickname"]');
e.val(b.code);
this.toggleFieldLabel(e);
k.val(b.name);
this.toggleFieldLabel(k);
a.addClass("editing")
}a.slideDown(function(){a.data("isOpen",true);
if(!g.hasClass("editCancel")){g.html("-")
}})
}},toggleCodeList:function(a){if(a.data("isClosed")){a.slideDown(function(){a.data("isClosed",false)
})
}else{a.slideUp(function(){a.data("isClosed",true)
})
}},toggleFieldLabel:function(c){if(c.length>0){var b=c.siblings("label");
function a(){if(c.val()==0){b.show()
}}b.hide();
c.monobind("blur",a)
}},toggleDeviceState:function(d){var a=this.model.getMObjectById(1252);
if(a){var b=a.get("type").split(":")[1].split(","),c=a.get("value");
this.updateProperty(this.data.deviceUid,"1252",_.without(b,c).join(""),d)
}},showError:function(c,e,a){var b=c.find(".codeError"),d=c.parents(".controlPanel:first");
d.find(".code input").bind("focus",function(){$(this).removeClass("error");
b.slideUp(function(){b.html("")
})
});
b.html(e).show();
if(a&&typeof a==="function"){a()
}},putDoorLockCode:function(m){var f=this,l=m.parents(".controlPanel:first"),g=m.find('input[name="code"]'),h=m.find('input[name="nickname"]'),b=e(m.find('input[name="doorLockCodeId"]').val(),f),k=h.val(),c=g.val(),a=DL.Dashboard.restURLs.doorLockCodes+DL.Dashboard.gwid+"/"+this.model.id+".json";
function e(q,p){if(q&&q.length){return q
}else{for(var o=0,n=p.data.Codes.length;
o<n;
o++){if(!p.data.Codes[o].isSet){return p.data.Codes[o].doorLockCodeId
}}return null
}}function d(){var r=true,q=l.find('.section.list li:not(".notSet")'),n,p,o;
if(k){if(!$(".code").hasClass("editing")){n=k.toLowerCase();
for(p=0,o=q.length;
p<o;
p++){if(n===$(q[p]).text().toLowerCase()){r=false
}}}}return r
}if(!/^(\d{4,8})$/.test(c)){this.showError(m,"Your doorlock code must be 4 - 8 digits.",function(){g.addClass("error")
})
}else{if(!k.length){this.showError(m,"Please enter a unique nickname.",function(){h.addClass("error")
})
}else{if(!d()){this.showError(m,"Please enter a unique nickname.",function(){h.addClass("error")
})
}else{m.find("error").removeClass("error");
m.find(".codeError").hide();
this.showUpdatingSpinner();
this.insertWorking(l);
DL.Dashboard.Main.Ajax(a,function(n){f.requiresFullRefresh=true;
f.model.timeOutMonitor.start(30000,f.model.id,$.proxy(f.initDevice,f))
},null,{type:"POST",contentType:"application/json",data:JSON.stringify({doorLockCodeId:b,isSet:true,nickname:k,code:c})})
}}}},deleteDoorLockCode:function(b){var a=Math.floor(b.find('input[name="doorLockCodeId"]').val()),d=this,c=DL.Dashboard.restURLs.doorLockCodes+"delete/"+DL.Dashboard.gwid+"/"+this.model.id+"/"+a+".json";
DL.Dashboard.Main.Ajax(c,function(e){d.showUpdatingSpinner();
d.toggleControlPanel(null,true);
d.requiresFullRefresh=true
},null,{type:"POST"})
},onclick_savedCode:function(b){b.preventDefault();
var a=$(b.currentTarget);
if(a.attr("data-code")!="0"){this.toggleCodePanel(null,{code:a.data("code"),name:a.text()},true)
}},onclick_addButton:function(a){a.preventDefault();
this.toggleCodePanel($(a.currentTarget))
},onfocus_field:function(a){this.toggleFieldLabel($(a.currentTarget))
},onclick_label:function(b){var a=$(b.currentTarget).siblings("input");
a.focus()
},onclick_autoLockToggle:function(a){a.preventDefault();
this.toggleAutoLock()
},onclick_editDone:function(a){a.preventDefault();
this.putDoorLockCode($(a.currentTarget).parents(".code:first"))
},onclick_editDelete:function(a){a.preventDefault();
this.deleteDoorLockCode($(a.currentTarget).parents(".code:first"))
},onclick_toggleBacklight:function(a){a.preventDefault();
var b=$(a.currentTarget).parents(".actionPanel:first"),c="on";
if(b.hasClass("active")){b.removeClass("active");
c="off"
}else{b.addClass("active")
}this.sendBacklightToServer(c)
}});
DL.Dashboard.Views.GarageTiltSensor=DL.Dashboard.Views.BaseDeviceView.extend({className:"device-section",tagName:"li",initDevice:function(){if(!this.isBoundListeners){this.bindListeners()
}this.template=DL.Dashboard.getTemplate("garageTiltSensor");
this.containerSelector=this.options.containerSelector||"#app";
this.data=this.collapseManagedObjects();
this.data.NormalizedStatus=this.normalizeStatus(this.data.Status);
this.data.Battery_level_class=this.getBatteryLevelClass(parseInt(this.data.Battery_level,10));
this.data.Floor=this.data.location.floor.label;
this.data.Room=this.data.location.room.label;
this.data.Default_name=this.data.managedObjectList[0].defaultValue;
this.data.showRoom=this.showRoom(this.data.Name,this.data.Default_name);
if(this.model.attributes.status!=0){this.data.Contact_state=this.data.NormalizedStatus
}this.currentName=this.data.managedObjectList[0].value;
this.data.RenderDrawerOpen=this.model.get("renderDeviceDrawerOpen");
this.render()
},events:{"click .panelArrow":"onclick_toggleControlButton","click .editButton":"onclick_editButton","click .editCancel":"onclick_editButton","click .editSave":"onclick_editSave","click .activity":"onclick_deviceActivity"},render:function(){var b=$(this.el),a=$.tmpl($(this.template),this.data);
this.renderCommon(b,a)
}});
DL.Dashboard.Views.GlassBreakSensor=DL.Dashboard.Views.BaseDeviceView.extend({className:"device-section",tagName:"li",initDevice:function(){if(!this.isBoundListeners){this.bindListeners()
}this.template=DL.Dashboard.getTemplate("glassBreakSensor");
this.containerSelector=this.options.containerSelector||"#app";
this.data=this.collapseManagedObjects();
this.data.NormalizedStatus=this.normalizeStatus(this.data.Status);
this.data.Battery_level_class=this.getBatteryLevelClass(parseInt(this.data.Battery_level,10));
this.data.Floor=this.data.location.floor.label;
this.data.Room=this.data.location.room.label;
this.data.Default_name=this.data.managedObjectList[0].defaultValue;
this.currentName=this.data.managedObjectList[0].value;
this.data.showRoom=this.showRoom(this.data.Name,this.data.Default_name);
this.data.RenderDrawerOpen=this.model.get("renderDeviceDrawerOpen");
this.render()
},events:{"click .panelArrow":"onclick_toggleControlButton","click .editButton":"onclick_editButton","click .editCancel":"onclick_editButton","click .editSave":"onclick_editSave","click .activity":"onclick_deviceActivity"},render:function(){var b=$(this.el),a=$.tmpl($(this.template),this.data);
this.renderCommon(b,a)
}});
DL.Dashboard.Views.MotionSensor=DL.Dashboard.Views.BaseDeviceView.extend({className:"device-section",tagName:"li",initDevice:function(){if(!this.isBoundListeners){this.bindListeners()
}this.template=DL.Dashboard.getTemplate("motionSensor");
this.containerSelector=this.options.containerSelector||"#app";
this.data=this.collapseManagedObjects();
this.data.NormalizedStatus=this.normalizeStatus(this.data.Status);
this.data.Battery_level_class=this.getBatteryLevelClass(parseInt(this.data.Battery_level,10));
this.data.Floor=this.data.location.floor.label;
this.data.Room=this.data.location.room.label;
this.data.Default_name=this.data.managedObjectList[0].defaultValue;
this.currentName=this.data.managedObjectList[0].value;
this.data.showRoom=this.showRoom(this.data.Name,this.data.Default_name);
this.data.RenderDrawerOpen=this.model.get("renderDeviceDrawerOpen");
this.render()
},events:{"click .panelArrow":"onclick_toggleControlButton","click .editButton":"onclick_editButton","click .editCancel":"onclick_editButton","click .editSave":"onclick_editSave","click .activity":"onclick_deviceActivity"},render:function(){var b=$(this.el),a=$.tmpl($(this.template),this.data);
this.renderCommon(b,a)
}});
DL.Dashboard.Views.PowerControl=DL.Dashboard.Views.BaseDeviceView.extend({className:"device-section",tagName:"li",initDevice:function(){if(!this.isBoundListeners){this.bindListeners()
}this.template=DL.Dashboard.getTemplate("powerControl");
this.containerSelector=this.options.containerSelector||"#app";
this.data=this.collapseManagedObjects();
this.data.NormalizedStatus=this.normalizeStatus(this.data.Status);
this.data.Battery_level_class=this.getBatteryLevelClass(parseInt(this.data.Battery_level,10));
this.data.Floor=this.data.location.floor.label;
this.data.Room=this.data.location.room.label;
this.data.Default_name=this.data.managedObjectList[0].defaultValue;
this.data.showRoom=this.showRoom(this.data.Name,this.data.Default_name);
if(this.model.attributes.status==0){this.data.active=this.data.Switch=="on"?"active":""
}else{this.data.Switch="off"
}this.currentName=this.data.managedObjectList[0].value;
this.data.RenderDrawerOpen=this.model.get("renderDeviceDrawerOpen");
this.render()
},events:{"click .icon-wrap":"onclick_deviceIcon","click .panelArrow":"onclick_toggleControlButton","click .editButton":"onclick_editButton","click .editCancel":"onclick_editButton","click .editSave":"onclick_editSave","click .toggleBtn":"onclick_toggleState","click .activity":"onclick_deviceActivity"},render:function(){var b=$(this.el),a=$.tmpl($(this.template),this.data);
this.renderCommon(b,a);
if(this.data.status==0){$(this.el).find(".section.first").removeClass("hide")
}},toggleDeviceState:function(){var a=this.model.getMObjectById(1140),b=a.get("type").split(":")[1].split(","),c=a.get("value");
this.updateProperty(this.data.deviceUid,"1140",_.without(b,c).join(""))
}});
DL.Dashboard.Views.LightControl=DL.Dashboard.Views.BaseDeviceView.extend({className:"device-section",tagName:"li",initDevice:function(){if(!this.isBoundListeners){this.bindListeners()
}this.template=DL.Dashboard.getTemplate("lightControl");
this.containerSelector=this.options.containerSelector||"#app";
this.data=this.collapseManagedObjects();
this.data.NormalizedStatus=this.normalizeStatus(this.data.Status);
this.data.Battery_level_class=this.getBatteryLevelClass(parseInt(this.data.Battery_level,10));
this.data.Floor=this.data.location.floor.label;
this.data.Room=this.data.location.room.label;
this.data.Default_name=this.data.managedObjectList[0].defaultValue;
this.data.showRoom=this.showRoom(this.data.Name,this.data.Default_name);
if(this.model.attributes.status==0){this.data.active=this.data.Switch=="on"?"active":""
}else{this.data.Switch=this.data.NormalizedStatus
}this.currentName=this.data.managedObjectList[0].value;
this.data.RenderDrawerOpen=this.model.get("renderDeviceDrawerOpen");
this.render()
},events:{"click .icon-wrap":"onclick_deviceIcon","click .panelArrow":"onclick_toggleControlButton","click .editButton":"onclick_editButton","click .editCancel":"onclick_editButton","click .editSave":"onclick_editSave","click .toggleBtn":"onclick_toggleState","click .activity":"onclick_deviceActivity"},render:function(){var b=$(this.el),a=$.tmpl($(this.template),this.data);
this.renderCommon(b,a);
if(this.data.status==0){$(this.el).find(".section.first").removeClass("hide")
}},toggleDeviceState:function(){var a=this.model.getMObjectById(1140),b=a.get("type").split(":")[1].split(","),c=a.get("value");
this.updateProperty(this.data.deviceUid,"1140",_.without(b,c).join(""))
}});
DL.Dashboard.Views.Siren=DL.Dashboard.Views.BaseDeviceView.extend({className:"device-section",initDevice:function(){if(!this.isBoundListeners){this.bindListeners()
}this.template=DL.Dashboard.getTemplate("siren");
this.containerSelector=this.options.containerSelector||"#app";
this.data=this.collapseManagedObjects();
this.data.NormalizedStatus=this.normalizeStatus(this.data.Status);
this.data.Battery_level_class=this.getBatteryLevelClass(parseInt(this.data.Battery_level,10));
this.data.Floor=this.data.location.floor.label;
this.data.Room=this.data.location.room.label;
this.data.Default_name=this.data.managedObjectList[0].defaultValue;
this.currentName=this.data.managedObjectList[0].value;
this.data.showRoom=this.showRoom(this.data.Name,this.data.Default_name);
this.data.RenderDrawerOpen=this.model.get("renderDeviceDrawerOpen");
this.render()
},events:{"click .panelArrow":"onclick_toggleControlButton","click .editButton":"onclick_editButton","click .editCancel":"onclick_editButton","click .editSave":"onclick_editSave","click .activity":"onclick_deviceActivity"},render:function(){var b=$(this.el),a=$.tmpl($(this.template),this.data);
this.renderCommon(b,a)
}});
DL.Dashboard.Views.SmokeDetector=DL.Dashboard.Views.BaseDeviceView.extend({className:"device-section",tagName:"li",initDevice:function(a){if(!this.isBoundListeners){this.bindListeners()
}this.template=DL.Dashboard.getTemplate("smokeDetector");
this.containerSelector=this.options.containerSelector||"#app";
this.data=this.collapseManagedObjects();
this.data.NormalizedStatus=this.normalizeStatus(this.data.Status);
this.data.Battery_level_class=this.getBatteryLevelClass(parseInt(this.data.Battery_level,10));
this.data.Floor=this.data.location.floor.label;
this.data.Room=this.data.location.room.label;
this.data.Default_name=this.data.managedObjectList[0].defaultValue;
this.currentName=this.data.managedObjectList[0].value;
this.data.showRoom=this.showRoom(this.data.Name,this.data.Default_name);
this.data.RenderDrawerOpen=this.model.get("renderDeviceDrawerOpen");
this.render()
},events:{"click .panelArrow":"onclick_toggleControlButton","click .editButton":"onclick_editButton","click .editCancel":"onclick_editButton","click .editSave":"onclick_editSave","click .activity":"onclick_deviceActivity"},render:function(){var b=$(this.el),a=$.tmpl($(this.template),this.data);
this.renderCommon(b,a)
}});
DL.Dashboard.Views.TakeOverModule=DL.Dashboard.Views.BaseDeviceView.extend({className:"device-section",tagName:"li",initDevice:function(){var a=this;
if(!this.isBoundListeners){this.bindListeners()
}this.template=DL.Dashboard.getTemplate("takeOverModule");
this.containerSelector=this.options.containerSelector||"#app";
this.data=this.collapseManagedObjects();
this.data.NormalizedStatus=this.normalizeStatus(this.data.Status);
this.data.Battery_level_class=this.getBatteryLevelClass(parseInt(this.data.Battery_level,10));
this.data.Floor=this.data.location.floor.label;
this.data.Room=this.data.location.room.label;
this.data.Default_name=this.data.managedObjectList[0].defaultValue;
this.data.zoneSensors=this.getChildDevices(this.data.childDevices);
this.data.showRoom=this.showRoom(this.data.Name,this.data.Default_name);
this.data.RenderDrawerOpen=this.model.get("renderDeviceDrawerOpen");
this.getAbsoluteStatus(function(){a.render()
})
},events:{"click .panelArrow":"onclick_toggleControlButton","click .editButton":"onclick_editButton","click .editCancel":"onclick_editButton","click .editSave":"onclick_editSave","click .activity":"onclick_deviceActivity"},render:function(){var b=$(this.el),a=$.tmpl($(this.template),this.data);
this.renderCommon(b,a)
},handleMessage:function(g,b){var h=b.MOID,f=b.dev,d=b.value,a=this.data.zoneSensors.length;
if(h="1041"){for(var c=0;
c<a;
c++){if(this.data.zoneSensors[c].id==f){this.data.zoneSensors[c].attributes.managedObjectList[3].pendingValue=d;
this.initDevice()
}}}},getChildDevices:function(c){var e=[];
for(var b=0,a=c.length;
b<a;
b++){var f=DL.Dashboard.devices.getDeviceById(c[b]);
if(f){e.push(f)
}}return e
},getAbsoluteStatus:function(a){var b="",d,e,c;
function f(){if(a&&typeof a==="function"){a()
}return
}if(this.data.alertStatus&&this.data.alertStatus!==""&&this.data.alertStatus==="alarm"){f()
}for(e=0,c=this.data.zoneSensors.length;
e<c;
e++){d=this.data.zoneSensors[e].get("alertStatus");
if(d){switch(d){case"alarm":this.data.alertStatus=d;
f();
break;
case"alert":this.data.alertStatus=d
}}}f()
}});
DL.Dashboard.Views.Thermostat=DL.Dashboard.Views.BaseDeviceView.extend({className:"device-section",tagName:"li",initDevice:function(a){if(!this.isBoundListeners){this.bindListeners()
}this.clickTimerCount=null;
this.model.timeOutMonitor.clear();
this.template=DL.Dashboard.getTemplate("thermostat");
this.containerSelector=this.options.containerSelector||"#app";
this.data=this.collapseManagedObjectOIDValues();
this.data.Mode=$.trim(this.data[1038]);
this.data.supportUrl=this.model.get("supportUrl");
this.data.RenderDrawerOpen=this.model.get("renderDeviceDrawerOpen");
if(_.indexOf(this.validModes,this.data.Mode.toLowerCase())>-1){this.data.NormalizedStatus=this.normalizeStatus(this.data[10]);
this.data.Name=this.data[0];
this.data.Floor=this.model.attributes.location.floor.label;
this.data.Room=this.model.attributes.location.room.label;
this.data.CurrentTemp=DL.Common.convertToFahrenheit(this.data[1030]);
this.data.Fan=this.data[1051];
if(this.model.attributes.status==0){this.data.ModeSetTempInfo=this.getModeSetTempInfo(this.data.Mode)
}else{this.data.ModeSetTempInfo=this.data.NormalizedStatus
}this.data.DefaultName=this.model.attributes.managedObjectList[0].defaultValue;
this.data.DisplayName=DL.truncateText(this.getDisplayName(this.data.DefaultName,this.data.Name),16);
this.data.HeatSetPoint=DL.Common.convertToFahrenheit(this.data[1034]);
this.data.CoolSetPoint=DL.Common.convertToFahrenheit(this.data[1035]);
this.data.HeatSaveSetPoint=DL.Common.convertToFahrenheit(this.data[1036]);
this.data.CoolSaveSetPoint=DL.Common.convertToFahrenheit(this.data[1037]);
if(this.data.ModeSetTempInfo instanceof Array){this.data.CurrentDeviceMoid=this.data.ModeSetTempInfo[2];
this.data.CurrentSetTemp=DL.Common.convertToFahrenheit(this.data[this.data.CurrentDeviceMoid])
}}else{DL.log("Mode: "+this.data.Mode)
}this.data.showRoom=this.showRoom(this.data.DisplayName,this.data.DefaultName);
this.render()
},render:function(){var c=$(this.el),a=$.tmpl($(this.template),this.data),b,e=this.data.Mode.toLowerCase(),d=this;
this.renderCommon(c,a);
b=c.find(".modeSelectorList");
b.html(this.createModeHtml(e));
this.initSlider(c.find(".thermostatSlider"),this.data.CoolSetPoint,this.data.HeatSetPoint,function(){b.find("a[data-command]").monobind("click",$.proxy(d.onclick_mode,d))
});
if(this.data.ModeSetTempInfo instanceof Array){$(this.el).find(".currentSetTemp").removeClass("hide")
}if(e==="aux-heat"||e==="auto"||e==="off"){c.find(".changeTemp").css({display:"none"})
}},events:{"click .panelArrow":"onclick_toggleControlButton","click .editButton":"onclick_editButton","click .editCancel":"onclick_editButton","click .editSave":"onclick_editSave","click .activity":"onclick_deviceActivity","click .fanToggle":"onclick_toggleFan","click .changeTemp":"onclick_changeTemp"},insertWorking:function(a){a.append($("<div/>",{"class":"progress"}).append($("<span/>",{html:"Working&hellip;"})))
},removeWorking:function(a){a.remove()
},createModeHtml:function(b){var d=[],c,a,e;
function f(l,k){if(b==l){return"active"
}else{if(k&&b.indexOf(l)>-1){return"active"
}}return""
}for(var h in this.modes){var g=this.modes[h];
if(typeof g=="object"){d.push('<li class="'+f(h,true)+'"><a href="#" data-command="sub">'+h+'</a><ul class="subList">');
for(subMode in g){d.push('<li class="'+f(subMode)+'"><a href="#" data-command="'+subMode+'">'+g[subMode]+"</a></li>")
}d.push("</ul></li>")
}else{d.push('<li class="'+f(h,true)+'"><a href="#" data-command="'+h+'">'+g+"</a></li>")
}}return d.join("")
},validModes:["off","heat","cool","auto","aux-heat","save-heat","save-cool"],modes:{auto:"Auto",heat:{heat:"Regular","aux-heat":"Emergency Heat","save-heat":"Energy Save"},cool:{cool:"Regular","save-cool":"Energy Save"},off:"Off"},getModeSetTempInfo:function(c){var a="off",b;
switch(c){case this.validModes[0]:break;
case this.validModes[1]:a="Heat to";
b=1034;
break;
case this.validModes[2]:a="Cool to";
b=1035;
break;
case this.validModes[3]:a="Auto";
break;
case this.validModes[4]:a="Heat (Emergency)";
break;
case this.validModes[5]:a="Heat (Energy Save) to";
b=1036;
break;
case this.validModes[6]:a="Cool (Energy Save) to";
b=1037;
break
}return[a,c,b]
},initSlider:function(d,p,a,h){var c=$(this.el),m=c.find(".sliderWrap"),e=c.find(".readOut.cool span"),k=c.find(".readOut.heat span"),o,l,b,q,n,r,g,f,s=this;
function t(w,u,v){w=parseFloat(w)-3;
if(u){w=((w/parseInt(o.width(),10))*100)-3
}return Math.floor((1-(w/100))*100)+"%"
}d.slider({range:true,min:DL.Common.getTempLimitsByMode(null).lower,max:DL.Common.getTempLimitsByMode(null).upper,values:[a,p],create:function(v,u){o=$(v.target);
b=o.find(".ui-slider-handle:first").attr("data-direction","left");
n=o.find(".ui-slider-handle:last").attr("data-direction","right");
q=$('<div class="lowerRange"></div>');
r=$('<div class="upperRange"></div>');
if($.browser.msie&&$.browser.version.substr(0,1)<=8){setTimeout(function(){d.append(q.css({width:b.css("left")})).append(r.css({width:"100%"}))
},3000)
}else{d.append(q.css({width:b.css("left")})).append(r.css({width:"100%"}))
}if(h){h()
}},start:function(v,u){g=u.values[0],f=u.values[1]
},slide:function(z,y){var x=$(y.handle),w=x.data("direction"),u=parseInt(o.width(),10);
if(w=="left"){var v=DL.Common.getTempLimitsByMode("heat");
if(y.values[0]<=v.upper&&y.values[0]>=v.lower){q.css({width:b.css("left")});
k.html(y.values[0]+"&deg;");
return true
}}else{var v=DL.Common.getTempLimitsByMode("cool");
if(y.values[1]<=v.upper&&y.values[1]>=v.lower){e.html(y.values[1]+"&deg;");
return true
}}return false
},stop:function(x,w){var v=w.values[0],u=w.values[1];
if(v!==g){s.sendPropToServer(1034,DL.Common.convertToXDegrees(v),true);
s.insertWorking(m)
}else{if(u!==f){s.sendPropToServer(1035,DL.Common.convertToXDegrees(u),true);
s.insertWorking(m)
}}}})
},toggleEditDrawer:function(c){var a=c.parents(".panelMain:first").siblings(".footer").find(".footerWrap"),d=c.parents(".dvcContainer:first"),g=d.find(".thermoForm"),f=g.find(".status"),e=g.find("#currentNameInput"),b=d.find(".errorState");
if(c.data("isClosed")){if(b.length>0){b.slideUp(function(){b.remove()
})
}c.slideDown(function(){c.data("isClosed",false);
a.removeClass("editOn");
e.blur();
g.removeClass("editAll")
})
}else{c.slideUp(function(){c.data("isClosed",true);
a.addClass("editOn");
g.addClass("editAll");
e.focus();
e.select();
e.keydown(function(h){if(h.keyCode=="13"||h.keyCode=="09"){h.preventDefault();
if(e.val()!=f.val()){if(h.keyCode=="09"){e.blur()
}if(h.keyCode=="13"){d.find(".editSave").click()
}}}})
})
}},showDeviceError:function(c){var b=$(this.el),a=$("<div/>").addClass("section errorState").html("<p>"+c+"</p>");
b.find(".errorState").remove();
a.insertBefore(b.find(".panelMain"));
a.slideDown(function(){b.find(".thermoForm").addClass("editAll").find("#currentNameInput").focus().select()
})
},removeDeviceError:function(){$(this.el).find(".errorState").remove()
},goToMenuOption:function(b,d){var c=b.data("command"),a;
b.parent("li").addClass("active").siblings("li").removeClass("active");
if(c=="sub"){a=b.siblings("ul");
d.animate({height:a.height()+b.outerHeight()})
}else{this.sendPropToServer("1038",c,true)
}},changeTemp:function(f,d){var c=this,b=$(this.el),a=DL.Common.getTempLimitsByMode(c.data.Mode),e=f.data("command");
if(e==="up"){c.data.CurrentSetTemp++
}if(e==="down"){c.data.CurrentSetTemp--
}if(c.data.CurrentSetTemp>a.upper){c.data.CurrentSetTemp=a.upper
}else{if(c.data.CurrentSetTemp<a.lower){c.data.CurrentSetTemp=a.lower
}}b.find(".currentSetTemp").html(c.data.CurrentSetTemp+"&deg;F");
this.clickTimer(d)
},sendPropToServer:function(b,c,a){this.insertWorking($(this.el).find(".tempControl"));
this.updateProperty(this.model.id,b,c)
},toggleFan:function(a,b){this.sendPropToServer("1051",a,true);
if(b){b()
}},clickTimer:function(b){var a=this;
if(this.clickTimerCount!=null){clearTimeout(this.clickTimerCount)
}this.clickTimerCount=setTimeout(function(){a.sendPropToServer(a.data.ModeSetTempInfo[2],DL.Common.convertToXDegrees(a.data.CurrentSetTemp),b)
},3000)
},onclick_toggleFan:function(b){b.preventDefault();
var a=this;
if(this.model.attributes.status==0){a.newFanStatus="auto";
var c=$(b.currentTarget).parents(".actionPanel:first"),d=function(){c.removeClass("active")
};
if(!c.hasClass("active")){a.newFanStatus="on";
d=function(){c.addClass("active")
}
}this.toggleFan(a.newFanStatus,d)
}},onclick_editButton:function(a){a.preventDefault();
this.toggleEditDrawer($(a.currentTarget).parents(".controlPanel:first").find(".thermoSlide"))
},onclick_editSave:function(d){d.preventDefault();
var c=$(d.currentTarget).parents(".dvcContainer:first"),b=c.find("#currentNameInput").val(),a=c.find(".controlPanel");
a.toggleClass("editAll");
this.changeName(b)
},onclick_mode:function(f){f.preventDefault();
var d=$(f.currentTarget),b=$(this.el),c=d.parents(".modeSelectorList:first"),a=b.find(".modeSelectorList");
if(!d.parent("li").hasClass("active")){if(d.text()=="Off"||d.text()=="Auto"||d.parents("ul").hasClass("subList")){this.insertWorking(a)
}}this.goToMenuOption(d,c)
},onclick_changeTemp:function(b){b.preventDefault();
var a=$(b.currentTarget);
if(this.data.Mode!="auto"&&this.data.Mode!="off"){this.changeTemp(a,a.parents(".controlPanel:first").length>0)
}}});
DL.Dashboard.Views.WaterTempSensor=DL.Dashboard.Views.BaseDeviceView.extend({className:"device-section",tagName:"li",initDevice:function(){if(!this.isBoundListeners){this.bindListeners()
}this.template=DL.Dashboard.getTemplate("waterTempSensor");
this.containerSelector=this.options.containerSelector||"#app";
this.data=this.collapseManagedObjects();
this.data.NormalizedStatus=this.normalizeStatus(this.data.Status);
this.data.Battery_level_class=this.getBatteryLevelClass(parseInt(this.data.Battery_level,10));
this.data.Floor=this.data.location.floor.label;
this.data.Room=this.data.location.room.label;
this.data.Default_name=this.data.managedObjectList[0].defaultValue;
this.currentName=this.data.managedObjectList[0].value;
this.data.Temperature=DL.Common.convertToFahrenheit(this.data.Temperature);
this.data.showRoom=this.showRoom(this.data.Name,this.data.Default_name);
this.data.RenderDrawerOpen=this.model.get("renderDeviceDrawerOpen");
this.render()
},events:{"click .panelArrow":"onclick_toggleControlButton","click .editButton":"onclick_editButton","click .editCancel":"onclick_editButton","click .editSave":"onclick_editSave","click .activity":"onclick_deviceActivity"},render:function(){var b=$(this.el),a=$.tmpl($(this.template),this.data);
this.renderCommon(b,a)
},toggleDeviceState:function(){var a=this.model.getMObjectById(1100),b=a.get("type").split(":")[1].split(","),c=a.get("value");
this.updateProperty(this.data.deviceUid,"1100",_.without(b,c).join(""))
}});
DL.Dashboard.Views.WaterShutOffValue=DL.Dashboard.Views.BaseDeviceView.extend({className:"device-section",tagName:"li",initDevice:function(){if(!this.isBoundListeners){this.bindListeners()
}this.template=DL.Dashboard.getTemplate("waterShutOffValve");
this.containerSelector=this.options.containerSelector||"#app";
this.containerSelector=$(this.containerSelector);
this.data=this.collapseManagedObjects();
this.data.NormalizedStatus=this.normalizeStatus(this.data.Status);
this.data.Battery_level_class=this.getBatteryLevelClass(parseInt(this.data.Battery_level,10));
this.data.Floor=this.data.location.floor.label;
this.data.Room=this.data.location.room.label;
this.data.Default_name=this.data.managedObjectList[0].defaultValue;
this.data.active=this.data.Valve=="open"?"active":"";
this.data.Valve=this.data.Valve=="open"?this.data.Valve:"closed";
if(this.data.Status==="0"){this.data.ValveOutput=this.data.Valve=="open"?"opened":this.data.Valve
}this.currentName=this.data.managedObjectList[0].value;
this.data.showRoom=this.showRoom(this.data.Name,this.data.Default_name);
this.data.RenderDrawerOpen=this.model.get("renderDeviceDrawerOpen");
this.render()
},events:{"click .icon-wrap":"onclick_deviceIcon","click .panelArrow":"onclick_toggleControlButton","click .toggleBtn":"onclick_toggleState","click .editButton":"onclick_editButton","click .editCancel":"onclick_editButton","click .editSave":"onclick_editSave","click .activity":"onclick_deviceActivity"},render:function(){var b=$(this.el),a=$.tmpl($(this.template),this.data);
this.renderCommon(b,a)
},toggleDeviceState:function(d){var a=this.model.getMObjectById(1143);
if(a){var b=a.get("type").split(":")[1].split(","),c=a.get("value");
this.updateProperty(this.data.deviceUid,"1143",_.without(b,c).join(""),d)
}}});
DL.Dashboard.Views.HomePage=Backbone.View.extend({className:"home",template:"",viewData:{},initialize:function(){this.template=DL.Dashboard.getTemplate("home");
$("#main").attr("class","page-home");
this.render()
},render:function(){var a=$(this.el).html($.tmpl(this.template,this.viewData)),b=$("#app");
b.html(a);
b.find(".username").html(DL.Dashboard.customer.firstName);
new DL.Dashboard.Views.HomeGatewaySelect({customerGateways:DL.Dashboard.customer.gateways});
new DL.Dashboard.Views.HomeHeader();
new DL.Dashboard.Views.HomeWidget();
new DL.Dashboard.Views.HomePageBuckets();
new DL.Dashboard.Views.HomeEventsList();
if(!DL.Dashboard.hasRequestedIntroWizard){this.showIntroWizard();
DL.Dashboard.hasRequestedIntroWizard=true
}},events:{"click .rightCol .refresh":"refreshEventsList","click .edit-activity-panel":"openActivitySettingsModal"},showIntroWizard:function(){DL.Dashboard.Main.Ajax({url:DL.Dashboard.restURLs.introWizard,success:function(a){if(a.responseMessage.content){new DL.Dashboard.IntroWizard()
}}})
},showCalendar:function(){new DL.Dashboard.Views.CalendarInput()
},refreshEventsList:function(a){a.preventDefault();
DL.Dashboard.eventsByRoomsAndDevices=null;
new DL.Dashboard.Views.HomeEventsList()
},openActivitySettingsModal:function(g){g.preventDefault();
var f=DL.Dashboard.eventsByRoomsAndDevices||{},b=$("#pom-activities-settings");
f.isChecked=function(e){if(DL.Dashboard.eventFilter.indexOf(e)<0){return"checked"
}else{return"unchecked"
}};
function a(k){k.preventDefault();
var h=$(k.currentTarget);
section=h.siblings(".list-items:first");
DL.Common.toggleContainer(h,section)
}function c(m){m.preventDefault();
var l=$(m.currentTarget),k=l.siblings("input:checkbox:first")[0],h=l.parent("li").siblings("li:first").children("input").attr("id");
DL.Common.toggleCheckBoxes(l,k,h)
}var d=new DL.Dashboard.ModalBase({template:"modals/pomSettingsActivity",data:f,customEvents:{"click .save":function(m){m.preventDefault();
var k=DL.Common.getAllCheckedValues(d.modalContent.find("ul.devices li")),h=DL.Common.getAllCheckedValues(d.modalContent.find("ul.rooms li")),l={typeGroupIds:k,roomGroupIds:h};
d.close();
DL.Dashboard.eventsByRoomsAndDevices=null;
new DL.Dashboard.Views.HomeEventsList({type:"GET",data:l})
}},afterOpen:function(e){e.find(".action").bind("click",a);
e.find(".list-items label").bind("click",c);
e.find(".thinGreyScrollbar").jScrollPane({showArrows:true,autoReinitialise:true,verticalDragMaxHeight:40})
}})
}});
DL.Dashboard.Views.HomeEditBucket=Backbone.View.extend({className:"editBucket",template:"",bucketID:0,initialize:function(){var a=this;
this.bucketID=this.options.bucket.options.bucket;
this.template=DL.Dashboard.getTemplate("homeBucketEdit").innerHTML;
$.when(DL.HomeDataLayer.getBucketAvailableOptions()).then(function(b){a.options.bucketAvailableInfo=b;
a.render()
})
},render:function(){var a=$(this.el).html(_.template(this.template,this.options.bucketAvailableInfo));
a.appendTo("body");
DL.Common.showModal($(".homeModal",this.el),$(".modalOverlay",this.el));
$(".thinGreyScrollbar",this.el).jScrollPane({showArrows:true,verticalDragMaxHeight:40});
return this
},events:{"click li":"selectItem","click .homeModalCloseButton":"cancelEdit"},selectItem:function(a){var d=this,c=$(a.currentTarget).find(".bucketOptionType").html(),b=$(a.currentTarget).find(".bucketOptionID").html();
$(this.el).dialog("destroy").remove();
DL.HomeDataLayer.setBucketSelectedOptions(this.bucketID,c,b).done(function(){new DL.Dashboard.Views.HomePageBucket({bucket:d.bucketID})
})
},cancelEdit:function(){$(this.el).dialog("destroy").remove()
}});
DL.Dashboard.Views.HomeEventsList=Backbone.View.extend({tagName:"div",className:"eventsList",template:"",initialize:function(b){var c=this,a=DL.Dashboard.restURLs.getRecentEvents+DL.Dashboard.gwid+".json";
b=b||{type:"GET"};
this.template=DL.Dashboard.getTemplate("homeEventsList");
this.placeHolder=$(".eventsListPlaceholder");
this.placeHolder.html("Loading &hellip;");
if(!DL.Dashboard.eventsByRoomsAndDevices){DL.Dashboard.Main.Ajax(a,function(d){DL.Dashboard.eventsByRoomsAndDevices=d.responseMessage.content;
if(d.responseMessage.content){if(_.keys(DL.Dashboard.eventsByRoomsAndDevices.items).length){DL.Dashboard.eventsByRoomsAndDevices.containsItems=true
}else{DL.Dashboard.eventsByRoomsAndDevices.containsItems=false
}c.render()
}},null,b)
}else{if(_.keys(DL.Dashboard.eventsByRoomsAndDevices.items).length){DL.Dashboard.eventsByRoomsAndDevices.containsItems=true
}c.render()
}},render:function(c){var b=false;
DL.Dashboard.eventsByRoomsAndDevices.isMedia=function(d){return d.indexOf("video")>-1||d.indexOf("image")>-1
};
DL.Dashboard.eventsByRoomsAndDevices.getType=this.parseItemType;
this.placeHolder.html($("<div>").addClass(this.className).html($.tmpl($(this.template),DL.Dashboard.eventsByRoomsAndDevices)));
$(".thinGreyScrollbar",this.placeHolder).jScrollPane({verticalGutter:10,verticalDragMaxHeight:40,verticalDragMinHeight:40,contentWidth:388});
for(var a=0;
a<DL.Dashboard.customer.permissions.length;
a++){if(DL.Dashboard.customer.permissions[a]=="VIEW_SETTINGS"){b=true;
break
}}if(b){$(".alertsActivitiesBtn").monobind("click",this.onclick_activitiesAndAlerts)
}else{$(".alertsActivitiesBtn").remove()
}this.placeHolder.find(".mediaLink").monobind("click",$.proxy(this.onclick_mediaModal,this))
},parseItemType:function(b){var a="text";
if(b.indexOf("video")>-1){a="video"
}else{if(b.indexOf("image")>-1){a="image"
}}return a
},openMediaModal:function(d,e,c,f,b){d.id=f;
if(d.type=="VIDEO"){d.url=DL.Dashboard.getStreamVideoUrl+DL.Dashboard.version+"/"+DL.Dashboard.gwid+"/"+c+"/"+f+".mp4"
}if(d.type=="IMAGE"){d.url=DL.Dashboard.getDirectUrlImage+DL.Dashboard.gwid+"/"+c+"/"+f+".jpg"
}var a=e;
this.eventsModal=new DL.Dashboard.ModalBase({template:"modals/pomActivityMedia",data:d,afterOpen:function(g){if(d.type=="VIDEO"){new DL.Dashboard.Views.DLVideo("video-"+f)
}setTimeout(function(){a.siblings(".loading-spinner").remove();
a.show()
},100);
if(!!~window.navigator.userAgent.indexOf("iPad")){g.find(".gallery-export").hide()
}}});
this.setModalButtons(this.eventsModal.modalContent,d,c,f);
if(_.intersection(["VIEW_SETTINGS"],DL.Dashboard.customer.permissions).length){this.eventsModal.modalContent.find(".gallery-delete").bind("click",$.proxy(this.deleteMedia,this,a))
}else{this.eventsModal.modalContent.find(".gallery-delete").remove()
}},setModalButtons:function(a,d,b,e){var c=d.type=="VIDEO"?".mp4":".jpg";
a.attr("data-item",e).attr("data-device",b).attr("data-type",d.type);
a.find(".gallery-export").attr("href",DL.ServerSecurePath+DL.ContextUrl+"/secure/services/devices/camera/media/item/"+d.type.toLowerCase()+"/"+DL.Dashboard.gwid+"/"+b+"/"+e+c)
},deleteMedia:function(b,g){g.preventDefault();
var f=this,c=DL.ServerSecurePath+DL.ContextUrl+"/secure/services/devices/camera/media/item/delete/"+DL.Dashboard.gwid+".json";
itemArray=[],type="image";
if(this.eventsModal.modalContent.data("type")=="VIDEO"){type="video"
}var h=$('<div class="confirm-delete-overlay"></div><div class="confirm-delete"><h3>Delete '+type+"</h3><p>Deleting this "+type+' will remove it from your system</p><a data-action="delete" class="gbtn gactive" href="#">Delete</a><a data-action="cancel" class="gbtn" href="#">Cancel</a></div>');
itemArray.push(this.eventsModal.modalContent.data("item"));
function d(k){k.preventDefault();
DL.Dashboard.Main.Ajax(c,function(e){if(e.responseMessage.code=="0"){f.eventsModal.close();
b.parent("li").slideUp().remove()
}else{container.find(".confirm-delete").remove();
container.find(".confirm-delete-overlay").after($("<div/>",{"class":"delete-error",html:"<p>"+e.responseMessage.message+"</p>"}))
}},null,{type:"POST",data:JSON.stringify(itemArray),contentType:"application/json"})
}function a(k){k.preventDefault();
h.fadeOut("fast",function(){$(this).remove()
})
}f.eventsModal.modalContent.prepend(h);
h.fadeIn(function(){h.find('[data-action="delete"]').unbind("click",d).bind("click",d);
h.find('[data-action="cancel"]').unbind("click",a).bind("click",a)
})
},getMediaData:function(e){var d=this,f=e.itemId?e.itemId:e.data("itemid"),b=e.deviceGuid?e.deviceGuid:e.data("deviceguid"),c=e.type?e.type:e.data("type"),a=DL.ServerSecurePath+DL.ContextUrl+"/secure/services/devices/camera/media/item/content/"+DL.Dashboard.version+"/"+DL.Dashboard.gwid+"/"+b+"/"+f+".json";
DL.Dashboard.Main.Ajax(a,function(g){if(g.responseMessage.content&&g.responseMessage.code=="0"){d.openMediaModal(g.responseMessage.content,e,b,f,a)
}},function(g){if(g.responseMessage.message){alert(g.responseMessage.message)
}else{alert("There was an error processing your request.  Please try again. [Prog3]")
}},{type:"GET"})
},onclick_mediaModal:function(b){b.preventDefault();
var a=$(b.currentTarget);
a.hide().after($("<div/>",{"class":"loading-spinner",html:"Loading&hellip;"}));
this.getMediaData(a)
},onclick_activitiesAndAlerts:function(a){a.preventDefault();
if($("#manageFrame").length<1){DL.Dashboard.UtilityNav.showSettingsModal()
}}});
DL.Dashboard.Views.HomeGatewaySelect=Backbone.View.extend({className:"",bindListeners:function(){DL.PubSub.subscribe("onmessagereceived",$.proxy(this.handleMessage,this));
this.isBoundListeners=true
},initialize:function(){if(!this.isBoundListeners){this.bindListeners()
}this.customerGateways=this.options.customerGateways;
$(".gatewaySelectContainer").html("Loading&hellip;");
this.template=DL.Dashboard.getTemplate("homeGatewaySelect");
this.render()
},render:function(){var d=DL.Dashboard.Main.getSelectedGatewayData(DL.Dashboard.customer.selectedGateway);
var a=d.name;
if(a==""||a==null){a=d.address1
}var c={gateways:DL.Dashboard.customer.gateways,selectedGatewayGUID:DL.Dashboard.customer.selectedGateway,selectedGatewayName:DL.truncateText(a,21)},b=$(this.el).html($.tmpl($(this.template),c));
$(".gatewaySelectContainer").html(b);
this.delegateEvents(this.events)
},handleMessage:function(d,b){var c=this;
if(b.MOID=="0"&&b.dev=="0"){function a(){return jQuery.Deferred(function(e){DL.Dashboard.Main.Ajax({url:DL.Dashboard.getCustomerUrl,type:"GET"}).done(function(f){e.resolve(f.responseMessage.content)
})
})
}$.when(a()).then(function(e){DL.Dashboard.customer=e;
c.render()
})
}},events:{"click .gatewaySelect":"showHideList","click a":"changeGateway"},showHideList:function(){var a=$(".gatewaySelectList",this.el);
if(a.data("isOpen")){a.slideUp(function(){a.data("isOpen",false)
})
}else{a.slideDown(function(){a.data("isOpen",true)
})
}},changeGateway:function(a){a.preventDefault();
var b=$(a.target).data("gateway");
DL.Dashboard.Main.setSelectedGateway(b)
}});
DL.Dashboard.Views.HomeHeader=Backbone.View.extend({className:"homeHeader",template:"",initialize:function(){this.template=DL.Dashboard.getTemplate("homeHeader");
this.render()
},render:function(){var a=$(this.el).html($.tmpl($(this.template),{}));
$("#hdrWrap").html(a);
return this
},events:{"click .editHomeView":"edit","click .saveHomeView":"save","click .cancelHomeView":"cancel"},edit:function(){$(".home, .homeHeader, .homeBuckets").addClass("edit");
DL.Dashboard.UtilityNav.setPageHelp("Home Edit","HOME_HELP_URL")
},save:function(){$(".home, .homeHeader, .homeBuckets").removeClass("edit");
DL.HomeDataLayer.saveChanges().done(function(){new DL.Dashboard.Views.HomePage()
});
DL.Dashboard.UtilityNav.setPageHelp("Home","HOME_HELP_URL")
},cancel:function(){$(".home, .homeHeader, .homeBuckets").removeClass("edit");
DL.HomeDataLayer.cancelChanges().done(function(){new DL.Dashboard.Views.HomePage()
});
DL.Dashboard.UtilityNav.setPageHelp("Home","HOME_HELP_URL")
}});
DL.Dashboard.Views.HomePageBucket=Backbone.View.extend({className:"bucketInner",template:"",initialize:function(){var a=this;
$(".bucket"+this.options.bucket).html("Loading&hellip;");
this.template=DL.Dashboard.getTemplate("homeBucket");
$.when(DL.HomeDataLayer.getBucketSelectedOptions(this.options.bucket)).then(function(b){a.options.bucketInfo=b;
a.render()
})
},render:function(){var a=$(this.el).html($.tmpl($(this.template),this.options.bucketInfo));
$(".bucket"+this.options.bucket).html(a);
if(this.options.bucketInfo){$(this.el).addClass(this.options.bucketInfo.type);
if(this.options.bucketInfo.type==="PROGRAM"){$(this.el).addClass(this.options.bucketInfo.subType);
$(this.el).find(".bucketLinkContainer a").monobind("click",$.proxy(this.onclick_runProgramBtn,this))
}else{if(this.options.bucketInfo.linkUrl){$(this.el).find(".bucketLinkContainer a").attr("href",this.options.bucketInfo.linkUrl)
}}}return this
},runProgram:function(a,b,c){DL.Dashboard.Main.Ajax(DL.Dashboard.restURLs.executeASpecificRule+DL.Dashboard.gwid+"/"+a+".json",function(d){b.siblings(".loading-spinner").hide();
b.css("display","inline-block")
},function(d){if(d.responseMessage.message){alert(d.responseMessage.message)
}else{alert("An unexpected error occurred while processing your request.  Please try again.")
}},{type:"GET"})
},events:{"click .editLink":"showEdit"},showEdit:function(){new DL.Dashboard.Views.HomeEditBucket({bucket:this})
},onclick_runProgramBtn:function(d){d.preventDefault();
var b=this,c=$(d.currentTarget),a=this.options.bucketInfo.id;
c.hide().after($("<div/>",{"class":"loading-spinner",html:"pending..."}));
b.runProgram(a,c)
}});
DL.Dashboard.Views.HomePageBuckets=Backbone.View.extend({className:"homeBuckets",template:"",initialize:function(){this.template=DL.Dashboard.getTemplate("homeBuckets");
this.render();
var a=["A","B","C"],b=false;
_.each(a,function(c){new DL.Dashboard.Views.HomePageBucket({bucket:c})
})
},render:function(){$(".homeBuckets").remove();
var a=$(this.el).html($.tmpl($(this.template),{}));
$(".content").append(a)
}});
DL.Dashboard.Views.HomeWidget=Backbone.View.extend({className:"homeWidget",template:"",data:{},cameraCount:0,initialize:function(){var a=this;
this.container=$(".widgetContainer");
this.container.html("Loading &hellip;");
$.when(DL.HomeDataLayer.getCurrentWidget(),DL.HomeDataLayer.getWidgetsAvailableInfo()).then(function(b,f){var e=_.find(f,function(g){return g.id==b
});
if(!e){e=f[0]
}$(f).each(function(){if(this.type.toLowerCase()=="camera"){a.cameraCount+=1
}});
$(".gbtn.editHomeView").css("display","inline-block");
a.template=DL.Dashboard.getTemplate("homeWidget_"+e.type);
if(e.type=="CAMERA"){a.container.html("").addClass("snapShotContainer");
var d=$('<a href="javascript:void(0)" class="gbtn editLink" data-quickhelp="Select to edit your main home module">EDIT</a>');
a.container.append(d);
d.monobind("click",a.showEdit);
var c=new DL.Dashboard.Views.IPCamera({containerSelector:a.container,model:DL.Dashboard.devices.get(e.id),tagName:"div"})
}else{if(e.type=="WEATHER"||!DL.Dashboard.getDeviceFromDeviceId(e.id)){DL.Dashboard.Main.Ajax(DL.Dashboard.getWeather+DL.Dashboard.gwid+".json",function(g){if(g.responseMessage.content){var h=DL.Dashboard.Main.getSelectedGatewayData(DL.Dashboard.customer.selectedGateway);
$.extend(a.data,g.responseMessage.content);
a.data.location=h.city+", "+h.state;
a.render()
}},function(){a.data.containsError=true;
a.render()
},{type:"GET"})
}else{a.render()
}}})
},render:function(b){var a=$(this.el).html($.tmpl($(this.template),this.data));
this.container.html(a);
if(this.cameraCount<1){$(".homeWidget .editLink").remove()
}if(this.data.containsError){this.container.addClass("fail")
}return this
},events:{"click .editLink":"showEdit","click .widgetWeather .refresh":"refreshWeather"},showEdit:function(a){a.preventDefault();
new DL.Dashboard.Views.HomeWidgetEdit()
},refreshWeather:function(a){a.preventDefault();
new DL.Dashboard.Views.HomeWidget()
}});
DL.Dashboard.Views.HomeWidgetEdit=Backbone.View.extend({className:"homeWidgetEdit",template:"",initialize:function(){var a=this;
this.template=DL.Dashboard.getTemplate("homeWidgetEdit");
$.when(DL.HomeDataLayer.getWidgetsAvailableInfo()).then(function(b){a.options.widgetsAvailableInfo=b;
a.render()
})
},render:function(){var a=$(this.el).html($.tmpl($(this.template),{widgets:this.options.widgetsAvailableInfo}));
a.appendTo("body");
DL.Common.showModal($(".availableWidgetOptions",this.el),$(".modalOverlay",this.el));
$(".thinGreyScrollbar",this.el).jScrollPane({showArrows:true,verticalDragMaxHeight:40});
return this
},events:{"click li":"selectItem","click .homeModalCloseButton":"closeView"},selectItem:function(a){var b=$(a.target).find(".widgetCode").html();
var c=this;
DL.HomeDataLayer.setCurrentWidget(b).done(function(){new DL.Dashboard.Views.HomeWidget();
c.closeView()
})
},closeView:function(a){$(this.el).remove()
}});
DL.HomeDataLayer=(function(){var b={},d=null,a=null,g=null;
function f(){if(!d){d=$.Deferred(function(h){DL.Dashboard.Main.Ajax({url:DL.Dashboard.restURLs.homepagePreferences+DL.Dashboard.gwid+".json",type:"GET"}).done(function(k){h.resolve(k.responseMessage.content)
}).fail(function(){h.reject()
})
})
}return d
}function c(){d=null;
return f()
}function e(){return $.Deferred(function(h){if(!a){f().done(function(k){a=_.extend({},k);
h.resolve(a)
})
}else{h.resolve(a)
}})
}b.activePrograms=null;
b.getDefaultDate=function(){var h=new Date();
h.setHours(0,0,0,0);
return h
};
b.getBucketSelectedOptions=function(h){var k={A:"DEFAULT_GETTING_STARTED",B:"DEFAULT_CUSTOM_VIEWS",C:"DEFAULT_PROGRAMS"};
return $.Deferred(function(l){$.when(e(),b.getBucketAvailableOptions()).then(function(m,n){var p=m.customWidgets["widget"+h];
if(p.type=="PROGRAM"||p.type=="CUSTOM_VIEW"){var o=n[p.type][p.id];
if(o){_.extend(p,o)
}else{p.type=k[h]
}}if(p.type=="DEFAULT_GETTING_STARTED"){_.extend(p,{title:"Getting Started",text:"Customize these shortcuts to quickly see your favorite custom views or programs.",linkText:"Learn More",supportLocation:"HOME_SHORTCUT_HELP_URL"})
}if(p.type=="DEFAULT_CUSTOM_VIEWS"){_.extend(p,{title:"Custom Views",text:"Group devices together for easy access to common tasks.",linkText:"Create a Custom View",linkUrl:"#custom/new"})
}if(p.type=="DEFAULT_PROGRAMS"){_.extend(p,{title:"Smart Programs",text:"Automate tasks in your home to streamline your day.",linkText:"Create a Program",linkUrl:"#programs/intro"})
}l.resolve(p)
},function(){l.reject()
})
})
};
b.getBucketAvailableOptions=function(){var h=g=$.Deferred(function(l){var k={};
k.CUSTOM_VIEW={};
k.PROGRAM={};
if(DL.Dashboard.groups.CUSTOM.length>0){DL.Dashboard.groups.CUSTOM.each(function(n){var o=n.get("id");
k.CUSTOM_VIEW[o]=_.extend(n.toJSON(),{type:"CUSTOM_VIEW",title:n.get("label"),text:"",linkText:"GO TO VIEW",linkUrl:"#custom/view/"+o})
})
}var m=DL.Dashboard.allSavedPrograms.getActive();
if(m){_.each(m,function(n){k.PROGRAM[n.id]=_.extend({},n,{type:"PROGRAM",subType:n.get("type"),title:n.get("name"),id:n.id,text:"",linkText:"RUN NOW",linkUrl:"#program/run/"+n.id})
});
l.resolve(k)
}});
return h
};
b.setBucketSelectedOptions=function(h,l,k){return $.Deferred(function(m){e().done(function(n){_.extend(n.customWidgets["widget"+h],{type:l,id:k});
m.resolve()
})
})
};
b.getWidgetsAvailableInfo=function(){return $.Deferred(function(h){e().done(function(k){h.resolve(k.homeWidget.homeWidgetOptions)
})
})
};
b.getCurrentWidget=function(){return $.Deferred(function(h){e().done(function(k){h.resolve(k.homeWidget.homeWidgetSelectedId)
})
})
};
b.setCurrentWidget=function(h){return $.Deferred(function(k){e().done(function(l){l.homeWidget.homeWidgetSelectedId=h;
k.resolve()
})
})
};
b.saveChanges=function(){return $.Deferred(function(h){e().done(function(k){var l={customWidgets:{widgetA:{type:k.customWidgets.widgetA.type,id:k.customWidgets.widgetA.id,label:k.customWidgets.widgetA.label},widgetB:{type:k.customWidgets.widgetB.type,id:k.customWidgets.widgetB.id,label:k.customWidgets.widgetB.label},widgetC:{type:k.customWidgets.widgetC.type,id:k.customWidgets.widgetC.id,label:k.customWidgets.widgetC.label}},gatewayGUID:k.gatewayGUID,homeWidget:k.homeWidget};
DL.Dashboard.Main.Ajax({url:DL.Dashboard.restURLs.homepagePreferences+DL.Dashboard.gwid+".json",type:"POST",data:JSON.stringify(l),contentType:"application/json"}).done(function(){serverData=$.extend({},l);
h.resolve()
}).fail(function(){h.reject()
})
})
})
};
b.cancelChanges=function(){return $.Deferred(function(h){c().done(function(k){a=$.extend(true,{},k);
h.resolve()
})
})
};
return b
})();
if(typeof jwplayer=="undefined"){var jwplayer=function(b){if(jwplayer.api){return jwplayer.api.selectPlayer(b)
}};
var $jw=jwplayer;
jwplayer.version="5.10.2295 (Licensed version)";
jwplayer.vid=document.createElement("video");
jwplayer.audio=document.createElement("audio");
jwplayer.source=document.createElement("source");
(function(c){c.utils=function(){};
c.utils.typeOf=function(a){var b=typeof a;
if(b==="object"){if(a){if(a instanceof Array){b="array"
}}else{b="null"
}}return b
};
c.utils.extend=function(){var f=c.utils.extend["arguments"];
if(f.length>1){for(var a=1;
a<f.length;
a++){for(var b in f[a]){f[0][b]=f[a][b]
}}return f[0]
}return null
};
c.utils.clone=function(a){var h;
var g=c.utils.clone["arguments"];
if(g.length==1){switch(c.utils.typeOf(g[0])){case"object":h={};
for(var b in g[0]){h[b]=c.utils.clone(g[0][b])
}break;
case"array":h=[];
for(var b in g[0]){h[b]=c.utils.clone(g[0][b])
}break;
default:return g[0];
break
}}return h
};
c.utils.extension=function(a){if(!a){return""
}a=a.substring(a.lastIndexOf("/")+1,a.length);
a=a.split("?")[0];
if(a.lastIndexOf(".")>-1){return a.substr(a.lastIndexOf(".")+1,a.length).toLowerCase()
}return
};
c.utils.html=function(b,a){b.innerHTML=a
};
c.utils.wrap=function(b,a){if(b.parentNode){b.parentNode.replaceChild(a,b)
}a.appendChild(b)
};
c.utils.ajax=function(a,b,l){var h;
if(window.XMLHttpRequest){h=new XMLHttpRequest()
}else{h=new ActiveXObject("Microsoft.XMLHTTP")
}h.onreadystatechange=function(){if(h.readyState===4){if(h.status===200){if(b){if(!c.utils.exists(h.responseXML)){try{if(window.DOMParser){var f=(new DOMParser()).parseFromString(h.responseText,"text/xml");
if(f){h=c.utils.extend({},h,{responseXML:f})
}}else{f=new ActiveXObject("Microsoft.XMLDOM");
f.async="false";
f.loadXML(h.responseText);
h=c.utils.extend({},h,{responseXML:f})
}}catch(e){if(l){l(a)
}}}b(h)
}}else{if(l){l(a)
}}}};
try{h.open("GET",a,true);
h.send(null)
}catch(k){if(l){l(a)
}}return h
};
c.utils.load=function(b,a,f){b.onreadystatechange=function(){if(b.readyState===4){if(b.status===200){if(a){a()
}}else{if(f){f()
}}}}
};
c.utils.find=function(a,b){return a.getElementsByTagName(b)
};
c.utils.append=function(b,a){b.appendChild(a)
};
c.utils.isIE=function(){return((!+"\v1")||(typeof window.ActiveXObject!="undefined"))
};
c.utils.userAgentMatch=function(a){var b=navigator.userAgent.toLowerCase();
return(b.match(a)!==null)
};
c.utils.isIOS=function(){return c.utils.userAgentMatch(/iP(hone|ad|od)/i)
};
c.utils.isIPad=function(){return c.utils.userAgentMatch(/iPad/i)
};
c.utils.isIPod=function(){return c.utils.userAgentMatch(/iP(hone|od)/i)
};
c.utils.isAndroid=function(){return c.utils.userAgentMatch(/android/i)
};
c.utils.isLegacyAndroid=function(){return c.utils.userAgentMatch(/android 2.[012]/i)
};
c.utils.isBlackberry=function(){return c.utils.userAgentMatch(/blackberry/i)
};
c.utils.isMobile=function(){return c.utils.userAgentMatch(/(iP(hone|ad|od))|android/i)
};
c.utils.getFirstPlaylistItemFromConfig=function(f){var b={};
var a;
if(f.playlist&&f.playlist.length){a=f.playlist[0]
}else{a=f
}b.file=a.file;
b.levels=a.levels;
b.streamer=a.streamer;
b.playlistfile=a.playlistfile;
b.provider=a.provider;
if(!b.provider){if(b.file&&(b.file.toLowerCase().indexOf("youtube.com")>-1||b.file.toLowerCase().indexOf("youtu.be")>-1)){b.provider="youtube"
}if(b.streamer&&b.streamer.toLowerCase().indexOf("rtmp://")==0){b.provider="rtmp"
}if(a.type){b.provider=a.type.toLowerCase()
}}if(b.provider=="audio"){b.provider="sound"
}return b
};
c.utils.getOuterHTML=function(b){if(b.outerHTML){return b.outerHTML
}else{try{return new XMLSerializer().serializeToString(b)
}catch(a){return""
}}};
c.utils.setOuterHTML=function(b,h){if(b.outerHTML){b.outerHTML=h
}else{var a=document.createElement("div");
a.innerHTML=h;
var l=document.createRange();
l.selectNodeContents(a);
var k=l.extractContents();
b.parentNode.insertBefore(k,b);
b.parentNode.removeChild(b)
}};
c.utils.hasFlash=function(){if(typeof navigator.plugins!="undefined"&&typeof navigator.plugins["Shockwave Flash"]!="undefined"){return true
}if(typeof window.ActiveXObject!="undefined"){try{new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
return true
}catch(a){}}return false
};
c.utils.getPluginName=function(a){if(a.lastIndexOf("/")>=0){a=a.substring(a.lastIndexOf("/")+1,a.length)
}if(a.lastIndexOf("-")>=0){a=a.substring(0,a.lastIndexOf("-"))
}if(a.lastIndexOf(".swf")>=0){a=a.substring(0,a.lastIndexOf(".swf"))
}if(a.lastIndexOf(".js")>=0){a=a.substring(0,a.lastIndexOf(".js"))
}return a
};
c.utils.getPluginVersion=function(a){if(a.lastIndexOf("-")>=0){if(a.lastIndexOf(".js")>=0){return a.substring(a.lastIndexOf("-")+1,a.lastIndexOf(".js"))
}else{if(a.lastIndexOf(".swf")>=0){return a.substring(a.lastIndexOf("-")+1,a.lastIndexOf(".swf"))
}else{return a.substring(a.lastIndexOf("-")+1)
}}}return""
};
c.utils.getAbsolutePath=function(b,l){if(!c.utils.exists(l)){l=document.location.href
}if(!c.utils.exists(b)){return undefined
}if(d(b)){return b
}var a=l.substring(0,l.indexOf("://")+3);
var m=l.substring(a.length,l.indexOf("/",a.length+1));
var p;
if(b.indexOf("/")===0){p=b.split("/")
}else{var o=l.split("?")[0];
o=o.substring(a.length+m.length+1,o.lastIndexOf("/"));
p=o.split("/").concat(b.split("/"))
}var q=[];
for(var n=0;
n<p.length;
n++){if(!p[n]||!c.utils.exists(p[n])||p[n]=="."){continue
}else{if(p[n]==".."){q.pop()
}else{q.push(p[n])
}}}return a+m+"/"+q.join("/")
};
function d(b){if(!c.utils.exists(b)){return
}var a=b.indexOf("://");
var f=b.indexOf("?");
return(a>0&&(f<0||(f>a)))
}c.utils.pluginPathType={ABSOLUTE:"ABSOLUTE",RELATIVE:"RELATIVE",CDN:"CDN"};
c.utils.getPluginPathType=function(g){if(typeof g!="string"){return
}g=g.split("?")[0];
var b=g.indexOf("://");
if(b>0){return c.utils.pluginPathType.ABSOLUTE
}var h=g.indexOf("/");
var a=c.utils.extension(g);
if(b<0&&h<0&&(!a||!isNaN(a))){return c.utils.pluginPathType.CDN
}return c.utils.pluginPathType.RELATIVE
};
c.utils.mapEmpty=function(b){for(var a in b){return false
}return true
};
c.utils.mapLength=function(b){var f=0;
for(var a in b){f++
}return f
};
c.utils.log=function(a,b){if(typeof console!="undefined"&&typeof console.log!="undefined"){if(b){console.log(a,b)
}else{console.log(a)
}}};
c.utils.css=function(k,a,l){if(c.utils.exists(k)){for(var h in a){try{if(typeof a[h]==="undefined"){continue
}else{if(typeof a[h]=="number"&&!(h=="zIndex"||h=="opacity")){if(isNaN(a[h])){continue
}if(h.match(/color/i)){a[h]="#"+c.utils.strings.pad(a[h].toString(16),6)
}else{a[h]=Math.ceil(a[h])+"px"
}}}k.style[h]=a[h]
}catch(b){}}}};
c.utils.isYouTube=function(a){return(a.indexOf("youtube.com")>-1||a.indexOf("youtu.be")>-1)
};
c.utils.transform=function(l,m,n,b,a){if(!c.utils.exists(m)){m=1
}if(!c.utils.exists(n)){n=1
}if(!c.utils.exists(b)){b=0
}if(!c.utils.exists(a)){a=0
}if(m==1&&n==1&&b==0&&a==0){l.style.webkitTransform="";
l.style.MozTransform="";
l.style.OTransform=""
}else{var k="scale("+m+","+n+") translate("+b+"px,"+a+"px)";
l.style.webkitTransform=k;
l.style.MozTransform=k;
l.style.OTransform=k
}};
c.utils.stretch=function(v,a,b,y,s,x){if(typeof b=="undefined"||typeof y=="undefined"||typeof s=="undefined"||typeof x=="undefined"){return
}var B=b/s;
var z=y/x;
var t=0;
var u=0;
var A=false;
var C={};
if(a.parentElement){a.parentElement.style.overflow="hidden"
}c.utils.transform(a);
switch(v.toUpperCase()){case c.utils.stretching.NONE:C.width=s;
C.height=x;
C.top=(y-C.height)/2;
C.left=(b-C.width)/2;
break;
case c.utils.stretching.UNIFORM:if(B>z){C.width=s*z;
C.height=x*z;
if(C.width/b>0.95){A=true;
B=Math.ceil(100*b/C.width)/100;
z=1;
C.width=b
}}else{C.width=s*B;
C.height=x*B;
if(C.height/y>0.95){A=true;
B=1;
z=Math.ceil(100*y/C.height)/100;
C.height=y
}}C.top=(y-C.height)/2;
C.left=(b-C.width)/2;
break;
case c.utils.stretching.FILL:if(B>z){C.width=s*B;
C.height=x*B
}else{C.width=s*z;
C.height=x*z
}C.top=(y-C.height)/2;
C.left=(b-C.width)/2;
break;
case c.utils.stretching.EXACTFIT:C.width=s;
C.height=x;
var r=Math.round((s/2)*(1-1/B));
var w=Math.round((x/2)*(1-1/z));
A=true;
C.top=C.left=0;
break;
default:break
}if(A){c.utils.transform(a,B,z,r,w)
}c.utils.css(a,C)
};
c.utils.stretching={NONE:"NONE",FILL:"FILL",UNIFORM:"UNIFORM",EXACTFIT:"EXACTFIT"};
c.utils.deepReplaceKeyName=function(a,o,q){switch(c.utils.typeOf(a)){case"array":for(var m=0;
m<a.length;
m++){a[m]=c.utils.deepReplaceKeyName(a[m],o,q)
}break;
case"object":for(var n in a){var b,l;
if(o instanceof Array&&q instanceof Array){if(o.length!=q.length){continue
}else{b=o;
l=q
}}else{b=[o];
l=[q]
}var p=n;
for(var m=0;
m<b.length;
m++){p=p.replace(new RegExp(o[m],"g"),q[m])
}a[p]=c.utils.deepReplaceKeyName(a[n],o,q);
if(n!=p){delete a[n]
}}break
}return a
};
c.utils.isInArray=function(a,b){if(!(a)||!(a instanceof Array)){return false
}for(var f=0;
f<a.length;
f++){if(b===a[f]){return true
}}return false
};
c.utils.exists=function(a){switch(typeof(a)){case"string":return(a.length>0);
break;
case"object":return(a!==null);
case"undefined":return false
}return true
};
c.utils.empty=function(a){if(typeof a.hasChildNodes=="function"){while(a.hasChildNodes()){a.removeChild(a.firstChild)
}}};
c.utils.parseDimension=function(a){if(typeof a=="string"){if(a===""){return 0
}else{if(a.lastIndexOf("%")>-1){return a
}else{return parseInt(a.replace("px",""),10)
}}}return a
};
c.utils.getDimensions=function(a){if(a&&a.style){return{x:c.utils.parseDimension(a.style.left),y:c.utils.parseDimension(a.style.top),width:c.utils.parseDimension(a.style.width),height:c.utils.parseDimension(a.style.height)}
}else{return{}
}};
c.utils.getElementWidth=function(a){if(!a){return null
}else{if(a==document.body){return c.utils.parentNode(a).clientWidth
}else{if(a.clientWidth>0){return a.clientWidth
}else{if(a.style){return c.utils.parseDimension(a.style.width)
}else{return null
}}}}};
c.utils.getElementHeight=function(a){if(!a){return null
}else{if(a==document.body){return c.utils.parentNode(a).clientHeight
}else{if(a.clientHeight>0){return a.clientHeight
}else{if(a.style){return c.utils.parseDimension(a.style.height)
}else{return null
}}}}};
c.utils.timeFormat=function(a){str="00:00";
if(a>0){str=Math.floor(a/60)<10?"0"+Math.floor(a/60)+":":Math.floor(a/60)+":";
str+=Math.floor(a%60)<10?"0"+Math.floor(a%60):Math.floor(a%60)
}return str
};
c.utils.useNativeFullscreen=function(){return(navigator&&navigator.vendor&&navigator.vendor.indexOf("Apple")==0)
};
c.utils.parentNode=function(a){if(!a){return document.body
}else{if(a.parentNode){return a.parentNode
}else{if(a.parentElement){return a.parentElement
}else{return a
}}}};
c.utils.getBoundingClientRect=function(a){if(typeof a.getBoundingClientRect=="function"){return a.getBoundingClientRect()
}else{return{left:a.offsetLeft+document.body.scrollLeft,top:a.offsetTop+document.body.scrollTop,width:a.offsetWidth,height:a.offsetHeight}
}};
c.utils.translateEventResponse=function(h,l){var a=c.utils.extend({},l);
if(h==c.api.events.JWPLAYER_FULLSCREEN&&!a.fullscreen){a.fullscreen=a.message=="true"?true:false;
delete a.message
}else{if(typeof a.data=="object"){a=c.utils.extend(a,a.data);
delete a.data
}else{if(typeof a.metadata=="object"){c.utils.deepReplaceKeyName(a.metadata,["__dot__","__spc__","__dsh__"],["."," ","-"])
}}}var k=["position","duration","offset"];
for(var b in k){if(a[k[b]]){a[k[b]]=Math.round(a[k[b]]*1000)/1000
}}return a
};
c.utils.saveCookie=function(b,a){document.cookie="jwplayer."+b+"="+a+"; path=/"
};
c.utils.getCookies=function(){var a={};
var b=document.cookie.split("; ");
for(var g=0;
g<b.length;
g++){var h=b[g].split("=");
if(h[0].indexOf("jwplayer.")==0){a[h[0].substring(9,h[0].length)]=h[1]
}}return a
};
c.utils.readCookie=function(a){return c.utils.getCookies()[a]
}
})(jwplayer);
(function(b){b.events=function(){};
b.events.COMPLETE="COMPLETE";
b.events.ERROR="ERROR"
})(jwplayer);
(function(jwplayer){jwplayer.events.eventdispatcher=function(debug){var _debug=debug;
var _listeners;
var _globallisteners;
this.resetEventListeners=function(){_listeners={};
_globallisteners=[]
};
this.resetEventListeners();
this.addEventListener=function(type,listener,count){try{if(!jwplayer.utils.exists(_listeners[type])){_listeners[type]=[]
}if(typeof(listener)=="string"){eval("listener = "+listener)
}_listeners[type].push({listener:listener,count:count})
}catch(err){jwplayer.utils.log("error",err)
}return false
};
this.removeEventListener=function(type,listener){if(!_listeners[type]){return
}try{for(var listenerIndex=0;
listenerIndex<_listeners[type].length;
listenerIndex++){if(_listeners[type][listenerIndex].listener.toString()==listener.toString()){_listeners[type].splice(listenerIndex,1);
break
}}}catch(err){jwplayer.utils.log("error",err)
}return false
};
this.addGlobalListener=function(listener,count){try{if(typeof(listener)=="string"){eval("listener = "+listener)
}_globallisteners.push({listener:listener,count:count})
}catch(err){jwplayer.utils.log("error",err)
}return false
};
this.removeGlobalListener=function(listener){if(!listener){return
}try{for(var globalListenerIndex=0;
globalListenerIndex<_globallisteners.length;
globalListenerIndex++){if(_globallisteners[globalListenerIndex].listener.toString()==listener.toString()){_globallisteners.splice(globalListenerIndex,1);
break
}}}catch(err){jwplayer.utils.log("error",err)
}return false
};
this.sendEvent=function(type,data){if(!jwplayer.utils.exists(data)){data={}
}if(_debug){jwplayer.utils.log(type,data)
}if(typeof _listeners[type]!="undefined"){for(var listenerIndex=0;
listenerIndex<_listeners[type].length;
listenerIndex++){try{_listeners[type][listenerIndex].listener(data)
}catch(err){jwplayer.utils.log("There was an error while handling a listener: "+err.toString(),_listeners[type][listenerIndex].listener)
}if(_listeners[type][listenerIndex]){if(_listeners[type][listenerIndex].count===1){delete _listeners[type][listenerIndex]
}else{if(_listeners[type][listenerIndex].count>0){_listeners[type][listenerIndex].count=_listeners[type][listenerIndex].count-1
}}}}}for(var globalListenerIndex=0;
globalListenerIndex<_globallisteners.length;
globalListenerIndex++){try{_globallisteners[globalListenerIndex].listener(data)
}catch(err){jwplayer.utils.log("There was an error while handling a listener: "+err.toString(),_globallisteners[globalListenerIndex].listener)
}if(_globallisteners[globalListenerIndex]){if(_globallisteners[globalListenerIndex].count===1){delete _globallisteners[globalListenerIndex]
}else{if(_globallisteners[globalListenerIndex].count>0){_globallisteners[globalListenerIndex].count=_globallisteners[globalListenerIndex].count-1
}}}}}
}
})(jwplayer);
(function(d){var c={};
d.utils.animations=function(){};
d.utils.animations.transform=function(b,a){b.style.webkitTransform=a;
b.style.MozTransform=a;
b.style.OTransform=a;
b.style.msTransform=a
};
d.utils.animations.transformOrigin=function(b,a){b.style.webkitTransformOrigin=a;
b.style.MozTransformOrigin=a;
b.style.OTransformOrigin=a;
b.style.msTransformOrigin=a
};
d.utils.animations.rotate=function(b,a){d.utils.animations.transform(b,["rotate(",a,"deg)"].join(""))
};
d.utils.cancelAnimation=function(a){delete c[a.id]
};
d.utils.fadeTo=function(a,r,s,o,p,t){if(c[a.id]!=t&&d.utils.exists(t)){return
}if(a.style.opacity==r){return
}var u=new Date().getTime();
if(t>u){setTimeout(function(){d.utils.fadeTo(a,r,s,o,0,t)
},t-u)
}if(a.style.display=="none"){a.style.display="block"
}if(!d.utils.exists(o)){o=a.style.opacity===""?1:a.style.opacity
}if(a.style.opacity==r&&a.style.opacity!==""&&d.utils.exists(t)){if(r===0){a.style.display="none"
}return
}if(!d.utils.exists(t)){t=u;
c[a.id]=t
}if(!d.utils.exists(p)){p=0
}var n=(s>0)?((u-t)/(s*1000)):0;
n=n>1?1:n;
var b=r-o;
var q=o+(n*b);
if(q>1){q=1
}else{if(q<0){q=0
}}a.style.opacity=q;
if(p>0){c[a.id]=t+p*1000;
d.utils.fadeTo(a,r,s,o,0,c[a.id]);
return
}setTimeout(function(){d.utils.fadeTo(a,r,s,o,0,t)
},10)
}
})(jwplayer);
(function(b){b.utils.arrays=function(){};
b.utils.arrays.indexOf=function(f,e){for(var a=0;
a<f.length;
a++){if(f[a]==e){return a
}}return -1
};
b.utils.arrays.remove=function(f,e){var a=b.utils.arrays.indexOf(f,e);
if(a>-1){f.splice(a,1)
}}
})(jwplayer);
(function(b){b.utils.extensionmap={"3gp":{html5:"video/3gpp",flash:"video"},"3gpp":{html5:"video/3gpp"},"3g2":{html5:"video/3gpp2",flash:"video"},"3gpp2":{html5:"video/3gpp2"},flv:{flash:"video"},f4a:{html5:"audio/mp4"},f4b:{html5:"audio/mp4",flash:"video"},f4v:{html5:"video/mp4",flash:"video"},mov:{html5:"video/quicktime",flash:"video"},m4a:{html5:"audio/mp4",flash:"video"},m4b:{html5:"audio/mp4"},m4p:{html5:"audio/mp4"},m4v:{html5:"video/mp4",flash:"video"},mp4:{html5:"video/mp4",flash:"video"},rbs:{flash:"sound"},aac:{html5:"audio/aac",flash:"video"},mp3:{html5:"audio/mp3",flash:"sound"},ogg:{html5:"audio/ogg"},oga:{html5:"audio/ogg"},ogv:{html5:"video/ogg"},webm:{html5:"video/webm"},m3u8:{html5:"audio/x-mpegurl"},gif:{flash:"image"},jpeg:{flash:"image"},jpg:{flash:"image"},swf:{flash:"image"},png:{flash:"image"},wav:{html5:"audio/x-wav"}}
})(jwplayer);
(function(p){p.utils.mediaparser=function(){};
var n={element:{width:"width",height:"height",id:"id","class":"className",name:"name"},media:{src:"file",preload:"preload",autoplay:"autostart",loop:"repeat",controls:"controls"},source:{src:"file",type:"type",media:"media","data-jw-width":"width","data-jw-bitrate":"bitrate"},video:{poster:"image"}};
var o={};
p.utils.mediaparser.parseMedia=function(a){return q(a)
};
function r(a,b){if(!p.utils.exists(b)){b=n[a]
}else{p.utils.extend(b,n[a])
}return b
}function q(f,d){if(o[f.tagName.toLowerCase()]&&!p.utils.exists(d)){return o[f.tagName.toLowerCase()](f)
}else{d=r("element",d);
var e={};
for(var c in d){if(c!="length"){var a=f.getAttribute(c);
if(p.utils.exists(a)){e[d[c]]=a
}}}var b=f.style["#background-color"];
if(b&&!(b=="transparent"||b=="rgba(0, 0, 0, 0)")){e.screencolor=b
}return e
}}function m(f,c){c=r("media",c);
var b=[];
var d=p.utils.selectors("source",f);
for(var a in d){if(!isNaN(a)){b.push(l(d[a]))
}}var e=q(f,c);
if(p.utils.exists(e.file)){b[0]={file:e.file}
}e.levels=b;
return e
}function l(a,b){b=r("source",b);
var c=q(a,b);
c.width=c.width?c.width:0;
c.bitrate=c.bitrate?c.bitrate:0;
return c
}function k(a,b){b=r("video",b);
var c=m(a,b);
return c
}o.media=m;
o.audio=m;
o.source=l;
o.video=k
})(jwplayer);
(function(b){b.utils.loaderstatus={NEW:"NEW",LOADING:"LOADING",ERROR:"ERROR",COMPLETE:"COMPLETE"};
b.utils.scriptloader=function(f){var e=b.utils.loaderstatus.NEW;
var a=new b.events.eventdispatcher();
b.utils.extend(this,a);
this.load=function(){if(e==b.utils.loaderstatus.NEW){e=b.utils.loaderstatus.LOADING;
var c=document.createElement("script");
c.onload=function(d){e=b.utils.loaderstatus.COMPLETE;
a.sendEvent(b.events.COMPLETE)
};
c.onerror=function(d){e=b.utils.loaderstatus.ERROR;
a.sendEvent(b.events.ERROR)
};
c.onreadystatechange=function(){if(c.readyState=="loaded"||c.readyState=="complete"){e=b.utils.loaderstatus.COMPLETE;
a.sendEvent(b.events.COMPLETE)
}};
document.getElementsByTagName("head")[0].appendChild(c);
c.src=f
}};
this.getStatus=function(){return e
}
}
})(jwplayer);
(function(b){b.utils.selectors=function(a,f){if(!b.utils.exists(f)){f=document
}a=b.utils.strings.trim(a);
var h=a.charAt(0);
if(h=="#"){return f.getElementById(a.substr(1))
}else{if(h=="."){if(f.getElementsByClassName){return f.getElementsByClassName(a.substr(1))
}else{return b.utils.selectors.getElementsByTagAndClass("*",a.substr(1))
}}else{if(a.indexOf(".")>0){var g=a.split(".");
return b.utils.selectors.getElementsByTagAndClass(g[0],g[1])
}else{return f.getElementsByTagName(a)
}}}return null
};
b.utils.selectors.getElementsByTagAndClass=function(o,l,m){var k=[];
if(!b.utils.exists(m)){m=document
}var n=m.getElementsByTagName(o);
for(var p=0;
p<n.length;
p++){if(b.utils.exists(n[p].className)){var q=n[p].className.split(" ");
for(var a=0;
a<q.length;
a++){if(q[a]==l){k.push(n[p])
}}}}return k
}
})(jwplayer);
(function(b){b.utils.strings=function(){};
b.utils.strings.trim=function(a){return a.replace(/^\s*/,"").replace(/\s*$/,"")
};
b.utils.strings.pad=function(f,e,a){if(!a){a="0"
}while(f.length<e){f=a+f
}return f
};
b.utils.strings.serialize=function(a){if(a==null){return null
}else{if(a=="true"){return true
}else{if(a=="false"){return false
}else{if(isNaN(Number(a))||a.length>5||a.length==0){return a
}else{return Number(a)
}}}}};
b.utils.strings.seconds=function(e){e=e.replace(",",".");
var a=e.split(":");
var f=0;
if(e.substr(-1)=="s"){f=Number(e.substr(0,e.length-1))
}else{if(e.substr(-1)=="m"){f=Number(e.substr(0,e.length-1))*60
}else{if(e.substr(-1)=="h"){f=Number(e.substr(0,e.length-1))*3600
}else{if(a.length>1){f=Number(a[a.length-1]);
f+=Number(a[a.length-2])*60;
if(a.length==3){f+=Number(a[a.length-3])*3600
}}else{f=Number(e)
}}}}return f
};
b.utils.strings.xmlAttribute=function(a,f){for(var e=0;
e<a.attributes.length;
e++){if(a.attributes[e].name&&a.attributes[e].name.toLowerCase()==f.toLowerCase()){return a.attributes[e].value.toString()
}}return""
};
b.utils.strings.jsonToString=function(m){var k=k||{};
if(k&&k.stringify){return k.stringify(m)
}var p=typeof(m);
if(p!="object"||m===null){if(p=="string"){m='"'+m.replace(/"/g,'\\"')+'"'
}else{return String(m)
}}else{var l=[],a=(m&&m.constructor==Array);
for(var o in m){var n=m[o];
switch(typeof(n)){case"string":n='"'+n.replace(/"/g,'\\"')+'"';
break;
case"object":if(b.utils.exists(n)){n=b.utils.strings.jsonToString(n)
}break
}if(a){if(typeof(n)!="function"){l.push(String(n))
}}else{if(typeof(n)!="function"){l.push('"'+o+'":'+String(n))
}}}if(a){return"["+String(l)+"]"
}else{return"{"+String(l)+"}"
}}}
})(jwplayer);
(function(l){var k=new RegExp(/^(#|0x)[0-9a-fA-F]{3,6}/);
l.utils.typechecker=function(a,b){b=!l.utils.exists(b)?f(a):b;
return h(a,b)
};
function f(b){var a=["true","false","t","f"];
if(a.toString().indexOf(b.toLowerCase().replace(" ",""))>=0){return"boolean"
}else{if(k.test(b)){return"color"
}else{if(!isNaN(parseInt(b,10))&&parseInt(b,10).toString().length==b.length){return"integer"
}else{if(!isNaN(parseFloat(b))&&parseFloat(b).toString().length==b.length){return"float"
}}}}return"string"
}function h(a,b){if(!l.utils.exists(b)){return a
}switch(b){case"color":if(a.length>0){return g(a)
}return null;
case"integer":return parseInt(a,10);
case"float":return parseFloat(a);
case"boolean":if(a.toLowerCase()=="true"){return true
}else{if(a=="1"){return true
}}return false
}return a
}function g(a){switch(a.toLowerCase()){case"blue":return parseInt("0000FF",16);
case"green":return parseInt("00FF00",16);
case"red":return parseInt("FF0000",16);
case"cyan":return parseInt("00FFFF",16);
case"magenta":return parseInt("FF00FF",16);
case"yellow":return parseInt("FFFF00",16);
case"black":return parseInt("000000",16);
case"white":return parseInt("FFFFFF",16);
default:a=a.replace(/(#|0x)?([0-9A-F]{3,6})$/gi,"$2");
if(a.length==3){a=a.charAt(0)+a.charAt(0)+a.charAt(1)+a.charAt(1)+a.charAt(2)+a.charAt(2)
}return parseInt(a,16)
}return parseInt("000000",16)
}})(jwplayer);
(function(b){b.utils.parsers=function(){};
b.utils.parsers.localName=function(a){if(!a){return""
}else{if(a.localName){return a.localName
}else{if(a.baseName){return a.baseName
}else{return""
}}}};
b.utils.parsers.textContent=function(a){if(!a){return""
}else{if(a.textContent){return a.textContent
}else{if(a.text){return a.text
}else{return""
}}}}
})(jwplayer);
(function(b){b.utils.parsers.jwparser=function(){};
b.utils.parsers.jwparser.PREFIX="jwplayer";
b.utils.parsers.jwparser.parseEntry=function(f,e){for(var a=0;
a<f.childNodes.length;
a++){if(f.childNodes[a].prefix==b.utils.parsers.jwparser.PREFIX){e[b.utils.parsers.localName(f.childNodes[a])]=b.utils.strings.serialize(b.utils.parsers.textContent(f.childNodes[a]));
if(b.utils.parsers.localName(f.childNodes[a])=="file"&&e.levels){delete e.levels
}}if(!e.file&&String(e.link).toLowerCase().indexOf("youtube")>-1){e.file=e.link
}}return e
};
b.utils.parsers.jwparser.getProvider=function(d){if(d.type){return d.type
}else{if(d.file.indexOf("youtube.com/w")>-1||d.file.indexOf("youtube.com/v")>-1||d.file.indexOf("youtu.be/")>-1){return"youtube"
}else{if(d.streamer&&d.streamer.indexOf("rtmp")==0){return"rtmp"
}else{if(d.streamer&&d.streamer.indexOf("http")==0){return"http"
}else{var a=b.utils.strings.extension(d.file);
if(extensions.hasOwnProperty(a)){return extensions[a]
}}}}}return""
}
})(jwplayer);
(function(b){b.utils.parsers.mediaparser=function(){};
b.utils.parsers.mediaparser.PREFIX="media";
b.utils.parsers.mediaparser.parseGroup=function(k,g){var h=false;
for(var l=0;
l<k.childNodes.length;
l++){if(k.childNodes[l].prefix==b.utils.parsers.mediaparser.PREFIX){if(!b.utils.parsers.localName(k.childNodes[l])){continue
}switch(b.utils.parsers.localName(k.childNodes[l]).toLowerCase()){case"content":if(!h){g.file=b.utils.strings.xmlAttribute(k.childNodes[l],"url")
}if(b.utils.strings.xmlAttribute(k.childNodes[l],"duration")){g.duration=b.utils.strings.seconds(b.utils.strings.xmlAttribute(k.childNodes[l],"duration"))
}if(b.utils.strings.xmlAttribute(k.childNodes[l],"start")){g.start=b.utils.strings.seconds(b.utils.strings.xmlAttribute(k.childNodes[l],"start"))
}if(k.childNodes[l].childNodes&&k.childNodes[l].childNodes.length>0){g=b.utils.parsers.mediaparser.parseGroup(k.childNodes[l],g)
}if(b.utils.strings.xmlAttribute(k.childNodes[l],"width")||b.utils.strings.xmlAttribute(k.childNodes[l],"bitrate")||b.utils.strings.xmlAttribute(k.childNodes[l],"url")){if(!g.levels){g.levels=[]
}g.levels.push({width:b.utils.strings.xmlAttribute(k.childNodes[l],"width"),bitrate:b.utils.strings.xmlAttribute(k.childNodes[l],"bitrate"),file:b.utils.strings.xmlAttribute(k.childNodes[l],"url")})
}break;
case"title":g.title=b.utils.parsers.textContent(k.childNodes[l]);
break;
case"description":g.description=b.utils.parsers.textContent(k.childNodes[l]);
break;
case"keywords":g.tags=b.utils.parsers.textContent(k.childNodes[l]);
break;
case"thumbnail":g.image=b.utils.strings.xmlAttribute(k.childNodes[l],"url");
break;
case"credit":g.author=b.utils.parsers.textContent(k.childNodes[l]);
break;
case"player":var a=k.childNodes[l].url;
if(a.indexOf("youtube.com")>=0||a.indexOf("youtu.be")>=0){h=true;
g.file=b.utils.strings.xmlAttribute(k.childNodes[l],"url")
}break;
case"group":b.utils.parsers.mediaparser.parseGroup(k.childNodes[l],g);
break
}}}return g
}
})(jwplayer);
(function(c){c.utils.parsers.rssparser=function(){};
c.utils.parsers.rssparser.parse=function(a){var h=[];
for(var b=0;
b<a.childNodes.length;
b++){if(c.utils.parsers.localName(a.childNodes[b]).toLowerCase()=="channel"){for(var g=0;
g<a.childNodes[b].childNodes.length;
g++){if(c.utils.parsers.localName(a.childNodes[b].childNodes[g]).toLowerCase()=="item"){h.push(d(a.childNodes[b].childNodes[g]))
}}}}return h
};
function d(b){var a={};
for(var f=0;
f<b.childNodes.length;
f++){if(!c.utils.parsers.localName(b.childNodes[f])){continue
}switch(c.utils.parsers.localName(b.childNodes[f]).toLowerCase()){case"enclosure":a.file=c.utils.strings.xmlAttribute(b.childNodes[f],"url");
break;
case"title":a.title=c.utils.parsers.textContent(b.childNodes[f]);
break;
case"pubdate":a.date=c.utils.parsers.textContent(b.childNodes[f]);
break;
case"description":a.description=c.utils.parsers.textContent(b.childNodes[f]);
break;
case"link":a.link=c.utils.parsers.textContent(b.childNodes[f]);
break;
case"category":if(a.tags){a.tags+=c.utils.parsers.textContent(b.childNodes[f])
}else{a.tags=c.utils.parsers.textContent(b.childNodes[f])
}break
}}a=c.utils.parsers.mediaparser.parseGroup(b,a);
a=c.utils.parsers.jwparser.parseEntry(b,a);
return new c.html5.playlistitem(a)
}})(jwplayer);
(function(e){var f={};
var d={};
e.plugins=function(){};
e.plugins.loadPlugins=function(a,b){d[a]=new e.plugins.pluginloader(new e.plugins.model(f),b);
return d[a]
};
e.plugins.registerPlugin=function(a,c,k){var l=e.utils.getPluginName(a);
if(f[l]){f[l].registerPlugin(a,c,k)
}else{e.utils.log("A plugin ("+a+") was registered with the player that was not loaded. Please check your configuration.");
for(var b in d){d[b].pluginFailed()
}}}
})(jwplayer);
(function(b){b.plugins.model=function(a){this.addPlugin=function(f){var e=b.utils.getPluginName(f);
if(!a[e]){a[e]=new b.plugins.plugin(f)
}return a[e]
}
}
})(jwplayer);
(function(b){b.plugins.pluginmodes={FLASH:"FLASH",JAVASCRIPT:"JAVASCRIPT",HYBRID:"HYBRID"};
b.plugins.plugin=function(u){var s="http://lp.longtailvideo.com";
var n=b.utils.loaderstatus.NEW;
var m;
var o;
var a;
var t=new b.events.eventdispatcher();
b.utils.extend(this,t);
function r(){switch(b.utils.getPluginPathType(u)){case b.utils.pluginPathType.ABSOLUTE:return u;
case b.utils.pluginPathType.RELATIVE:return b.utils.getAbsolutePath(u,window.location.href);
case b.utils.pluginPathType.CDN:var d=b.utils.getPluginName(u);
var e=b.utils.getPluginVersion(u);
var c=(window.location.href.indexOf("https://")==0)?s.replace("http://","https://secure"):s;
return c+"/"+b.version.split(".")[0]+"/"+d+"/"+d+(e!==""?("-"+e):"")+".js"
}}function p(c){a=setTimeout(function(){n=b.utils.loaderstatus.COMPLETE;
t.sendEvent(b.events.COMPLETE)
},1000)
}function q(c){n=b.utils.loaderstatus.ERROR;
t.sendEvent(b.events.ERROR)
}this.load=function(){if(n==b.utils.loaderstatus.NEW){if(u.lastIndexOf(".swf")>0){m=u;
n=b.utils.loaderstatus.COMPLETE;
t.sendEvent(b.events.COMPLETE);
return
}n=b.utils.loaderstatus.LOADING;
var c=new b.utils.scriptloader(r());
c.addEventListener(b.events.COMPLETE,p);
c.addEventListener(b.events.ERROR,q);
c.load()
}};
this.registerPlugin=function(d,e,c){if(a){clearTimeout(a);
a=undefined
}if(e&&c){m=c;
o=e
}else{if(typeof e=="string"){m=e
}else{if(typeof e=="function"){o=e
}else{if(!e&&!c){m=d
}}}}n=b.utils.loaderstatus.COMPLETE;
t.sendEvent(b.events.COMPLETE)
};
this.getStatus=function(){return n
};
this.getPluginName=function(){return b.utils.getPluginName(u)
};
this.getFlashPath=function(){if(m){switch(b.utils.getPluginPathType(m)){case b.utils.pluginPathType.ABSOLUTE:return m;
case b.utils.pluginPathType.RELATIVE:if(u.lastIndexOf(".swf")>0){return b.utils.getAbsolutePath(m,window.location.href)
}return b.utils.getAbsolutePath(m,r());
case b.utils.pluginPathType.CDN:if(m.indexOf("-")>-1){return m+"h"
}return m+"-h"
}}return null
};
this.getJS=function(){return o
};
this.getPluginmode=function(){if(typeof m!="undefined"&&typeof o!="undefined"){return b.plugins.pluginmodes.HYBRID
}else{if(typeof m!="undefined"){return b.plugins.pluginmodes.FLASH
}else{if(typeof o!="undefined"){return b.plugins.pluginmodes.JAVASCRIPT
}}}};
this.getNewInstance=function(e,c,d){return new o(e,c,d)
};
this.getURL=function(){return u
}
}
})(jwplayer);
(function(b){b.plugins.pluginloader=function(m,p){var n={};
var a=b.utils.loaderstatus.NEW;
var q=false;
var s=false;
var r=new b.events.eventdispatcher();
b.utils.extend(this,r);
function o(){if(!s){s=true;
a=b.utils.loaderstatus.COMPLETE;
r.sendEvent(b.events.COMPLETE)
}}function l(){if(!s){var c=0;
for(plugin in n){var d=n[plugin].getStatus();
if(d==b.utils.loaderstatus.LOADING||d==b.utils.loaderstatus.NEW){c++
}}if(c==0){o()
}}}this.setupPlugins=function(t,d,e){var c={length:0,plugins:{}};
var h={length:0,plugins:{}};
for(var k in n){var g=n[k].getPluginName();
if(n[k].getFlashPath()){c.plugins[n[k].getFlashPath()]=d.plugins[k];
c.plugins[n[k].getFlashPath()].pluginmode=n[k].getPluginmode();
c.length++
}if(n[k].getJS()){var f=document.createElement("div");
f.id=t.id+"_"+g;
f.style.position="absolute";
f.style.zIndex=h.length+10;
h.plugins[g]=n[k].getNewInstance(t,d.plugins[k],f);
h.length++;
if(typeof h.plugins[g].resize!="undefined"){t.onReady(e(h.plugins[g],f,true));
t.onResize(e(h.plugins[g],f))
}}}t.plugins=h.plugins;
return c
};
this.load=function(){a=b.utils.loaderstatus.LOADING;
q=true;
for(var c in p){if(b.utils.exists(c)){n[c]=m.addPlugin(c);
n[c].addEventListener(b.events.COMPLETE,l);
n[c].addEventListener(b.events.ERROR,l)
}}for(c in n){n[c].load()
}q=false;
l()
};
this.pluginFailed=function(){o()
};
this.getStatus=function(){return a
}
}
})(jwplayer);
(function(c){var d=[];
c.api=function(F){this.container=F;
this.id=F.id;
var x={};
var H={};
var u={};
var G=[];
var C=undefined;
var z=false;
var B=[];
var a=undefined;
var v=c.utils.getOuterHTML(F);
var I={};
var A={};
this.getBuffer=function(){return this.callInternal("jwGetBuffer")
};
this.getContainer=function(){return this.container
};
function E(e,f){return function(h,k,g,m){if(e.renderingMode=="flash"||e.renderingMode=="html5"){var l;
if(k){A[h]=k;
l="jwplayer('"+e.id+"').callback('"+h+"')"
}else{if(!k&&A[h]){delete A[h]
}}C.jwDockSetButton(h,l,g,m)
}return f
}
}this.getPlugin=function(g){var e=this;
var f={};
if(g=="dock"){return c.utils.extend(f,{setButton:E(e,f),show:function(){e.callInternal("jwDockShow");
return f
},hide:function(){e.callInternal("jwDockHide");
return f
},onShow:function(h){e.componentListener("dock",c.api.events.JWPLAYER_COMPONENT_SHOW,h);
return f
},onHide:function(h){e.componentListener("dock",c.api.events.JWPLAYER_COMPONENT_HIDE,h);
return f
}})
}else{if(g=="controlbar"){return c.utils.extend(f,{show:function(){e.callInternal("jwControlbarShow");
return f
},hide:function(){e.callInternal("jwControlbarHide");
return f
},onShow:function(h){e.componentListener("controlbar",c.api.events.JWPLAYER_COMPONENT_SHOW,h);
return f
},onHide:function(h){e.componentListener("controlbar",c.api.events.JWPLAYER_COMPONENT_HIDE,h);
return f
}})
}else{if(g=="display"){return c.utils.extend(f,{show:function(){e.callInternal("jwDisplayShow");
return f
},hide:function(){e.callInternal("jwDisplayHide");
return f
},onShow:function(h){e.componentListener("display",c.api.events.JWPLAYER_COMPONENT_SHOW,h);
return f
},onHide:function(h){e.componentListener("display",c.api.events.JWPLAYER_COMPONENT_HIDE,h);
return f
}})
}else{return this.plugins[g]
}}}};
this.callback=function(e){if(A[e]){return A[e]()
}};
this.getDuration=function(){return this.callInternal("jwGetDuration")
};
this.getFullscreen=function(){return this.callInternal("jwGetFullscreen")
};
this.getHeight=function(){return this.callInternal("jwGetHeight")
};
this.getLockState=function(){return this.callInternal("jwGetLockState")
};
this.getMeta=function(){return this.getItemMeta()
};
this.getMute=function(){return this.callInternal("jwGetMute")
};
this.getPlaylist=function(){var e=this.callInternal("jwGetPlaylist");
if(this.renderingMode=="flash"){c.utils.deepReplaceKeyName(e,["__dot__","__spc__","__dsh__"],["."," ","-"])
}for(var f=0;
f<e.length;
f++){if(!c.utils.exists(e[f].index)){e[f].index=f
}}return e
};
this.getPlaylistItem=function(e){if(!c.utils.exists(e)){e=this.getCurrentItem()
}return this.getPlaylist()[e]
};
this.getPosition=function(){return this.callInternal("jwGetPosition")
};
this.getRenderingMode=function(){return this.renderingMode
};
this.getState=function(){return this.callInternal("jwGetState")
};
this.getVolume=function(){return this.callInternal("jwGetVolume")
};
this.getWidth=function(){return this.callInternal("jwGetWidth")
};
this.setFullscreen=function(e){if(!c.utils.exists(e)){this.callInternal("jwSetFullscreen",!this.callInternal("jwGetFullscreen"))
}else{this.callInternal("jwSetFullscreen",e)
}return this
};
this.setMute=function(e){if(!c.utils.exists(e)){this.callInternal("jwSetMute",!this.callInternal("jwGetMute"))
}else{this.callInternal("jwSetMute",e)
}return this
};
this.lock=function(){return this
};
this.unlock=function(){return this
};
this.load=function(e){this.callInternal("jwLoad",e);
return this
};
this.playlistItem=function(e){this.callInternal("jwPlaylistItem",e);
return this
};
this.playlistPrev=function(){this.callInternal("jwPlaylistPrev");
return this
};
this.playlistNext=function(){this.callInternal("jwPlaylistNext");
return this
};
this.resize=function(f,g){if(this.renderingMode=="html5"){C.jwResize(f,g)
}else{this.container.width=f;
this.container.height=g;
var e=document.getElementById(this.id+"_wrapper");
if(e){e.style.width=f+"px";
e.style.height=g+"px"
}}return this
};
this.play=function(e){if(typeof e=="undefined"){e=this.getState();
if(e==c.api.events.state.PLAYING||e==c.api.events.state.BUFFERING){this.callInternal("jwPause")
}else{this.callInternal("jwPlay")
}}else{this.callInternal("jwPlay",e)
}return this
};
this.pause=function(e){if(typeof e=="undefined"){e=this.getState();
if(e==c.api.events.state.PLAYING||e==c.api.events.state.BUFFERING){this.callInternal("jwPause")
}else{this.callInternal("jwPlay")
}}else{this.callInternal("jwPause",e)
}return this
};
this.stop=function(){this.callInternal("jwStop");
return this
};
this.seek=function(e){this.callInternal("jwSeek",e);
return this
};
this.setVolume=function(e){this.callInternal("jwSetVolume",e);
return this
};
this.loadInstream=function(e,f){a=new c.api.instream(this,C,e,f);
return a
};
this.onBufferChange=function(e){return this.eventListener(c.api.events.JWPLAYER_MEDIA_BUFFER,e)
};
this.onBufferFull=function(e){return this.eventListener(c.api.events.JWPLAYER_MEDIA_BUFFER_FULL,e)
};
this.onError=function(e){return this.eventListener(c.api.events.JWPLAYER_ERROR,e)
};
this.onFullscreen=function(e){return this.eventListener(c.api.events.JWPLAYER_FULLSCREEN,e)
};
this.onMeta=function(e){return this.eventListener(c.api.events.JWPLAYER_MEDIA_META,e)
};
this.onMute=function(e){return this.eventListener(c.api.events.JWPLAYER_MEDIA_MUTE,e)
};
this.onPlaylist=function(e){return this.eventListener(c.api.events.JWPLAYER_PLAYLIST_LOADED,e)
};
this.onPlaylistItem=function(e){return this.eventListener(c.api.events.JWPLAYER_PLAYLIST_ITEM,e)
};
this.onReady=function(e){return this.eventListener(c.api.events.API_READY,e)
};
this.onResize=function(e){return this.eventListener(c.api.events.JWPLAYER_RESIZE,e)
};
this.onComplete=function(e){return this.eventListener(c.api.events.JWPLAYER_MEDIA_COMPLETE,e)
};
this.onSeek=function(e){return this.eventListener(c.api.events.JWPLAYER_MEDIA_SEEK,e)
};
this.onTime=function(e){return this.eventListener(c.api.events.JWPLAYER_MEDIA_TIME,e)
};
this.onVolume=function(e){return this.eventListener(c.api.events.JWPLAYER_MEDIA_VOLUME,e)
};
this.onBeforePlay=function(e){return this.eventListener(c.api.events.JWPLAYER_MEDIA_BEFOREPLAY,e)
};
this.onBeforeComplete=function(e){return this.eventListener(c.api.events.JWPLAYER_MEDIA_BEFORECOMPLETE,e)
};
this.onBuffer=function(e){return this.stateListener(c.api.events.state.BUFFERING,e)
};
this.onPause=function(e){return this.stateListener(c.api.events.state.PAUSED,e)
};
this.onPlay=function(e){return this.stateListener(c.api.events.state.PLAYING,e)
};
this.onIdle=function(e){return this.stateListener(c.api.events.state.IDLE,e)
};
this.remove=function(){if(!z){throw"Cannot call remove() before player is ready";
return
}b(this)
};
function b(e){B=[];
if(c.utils.getOuterHTML(e.container)!=v){c.api.destroyPlayer(e.id,v)
}}this.setup=function(f){if(c.embed){var g=this.id;
b(this);
var e=c(g);
e.config=f;
return new c.embed(e)
}return this
};
this.registerPlugin=function(e,f,g){c.plugins.registerPlugin(e,f,g)
};
this.setPlayer=function(f,e){C=f;
this.renderingMode=e
};
this.stateListener=function(f,e){if(!H[f]){H[f]=[];
this.eventListener(c.api.events.JWPLAYER_PLAYER_STATE,D(f))
}H[f].push(e);
return this
};
this.detachMedia=function(){if(this.renderingMode=="html5"){return this.callInternal("jwDetachMedia")
}};
this.attachMedia=function(){if(this.renderingMode=="html5"){return this.callInternal("jwAttachMedia")
}};
function D(e){return function(g){var h=g.newstate,l=g.oldstate;
if(h==e){var f=H[h];
if(f){for(var k=0;
k<f.length;
k++){if(typeof f[k]=="function"){f[k].call(this,{oldstate:l,newstate:h})
}}}}}
}this.componentListener=function(g,f,e){if(!u[g]){u[g]={}
}if(!u[g][f]){u[g][f]=[];
this.eventListener(f,y(g,f))
}u[g][f].push(e);
return this
};
function y(f,e){return function(g){if(f==g.component){var h=u[f][e];
if(h){for(var k=0;
k<h.length;
k++){if(typeof h[k]=="function"){h[k].call(this,g)
}}}}}
}this.addInternalListener=function(g,f){try{g.jwAddEventListener(f,'function(dat) { jwplayer("'+this.id+'").dispatchEvent("'+f+'", dat); }')
}catch(e){c.utils.log("Could not add internal listener")
}};
this.eventListener=function(f,e){if(!x[f]){x[f]=[];
if(C&&z){this.addInternalListener(C,f)
}}x[f].push(e);
return this
};
this.dispatchEvent=function(e){if(x[e]){var f=_utils.translateEventResponse(e,arguments[1]);
for(var g=0;
g<x[e].length;
g++){if(typeof x[e][g]=="function"){x[e][g].call(this,f)
}}}};
this.dispatchInstreamEvent=function(e){if(a){a.dispatchEvent(e,arguments)
}};
this.callInternal=function(){if(z){var e=arguments[0],g=[];
for(var f=1;
f<arguments.length;
f++){g.push(arguments[f])
}if(typeof C!="undefined"&&typeof C[e]=="function"){if(g.length==2){return(C[e])(g[0],g[1])
}else{if(g.length==1){return(C[e])(g[0])
}else{return(C[e])()
}}}return null
}else{B.push(arguments)
}};
this.playerReady=function(e){z=true;
if(!C){this.setPlayer(document.getElementById(e.id))
}this.container=document.getElementById(this.id);
for(var f in x){this.addInternalListener(C,f)
}this.eventListener(c.api.events.JWPLAYER_PLAYLIST_ITEM,function(g){I={}
});
this.eventListener(c.api.events.JWPLAYER_MEDIA_META,function(g){c.utils.extend(I,g.metadata)
});
this.dispatchEvent(c.api.events.API_READY);
while(B.length>0){this.callInternal.apply(this,B.shift())
}};
this.getItemMeta=function(){return I
};
this.getCurrentItem=function(){return this.callInternal("jwGetPlaylistIndex")
};
function w(f,k,e){var h=[];
if(!k){k=0
}if(!e){e=f.length-1
}for(var g=k;
g<=e;
g++){h.push(f[g])
}return h
}return this
};
c.api.selectPlayer=function(b){var f;
if(!c.utils.exists(b)){b=0
}if(b.nodeType){f=b
}else{if(typeof b=="string"){f=document.getElementById(b)
}}if(f){var a=c.api.playerById(f.id);
if(a){return a
}else{return c.api.addPlayer(new c.api(f))
}}else{if(typeof b=="number"){return c.getPlayers()[b]
}}return null
};
c.api.events={API_READY:"jwplayerAPIReady",JWPLAYER_READY:"jwplayerReady",JWPLAYER_FULLSCREEN:"jwplayerFullscreen",JWPLAYER_RESIZE:"jwplayerResize",JWPLAYER_ERROR:"jwplayerError",JWPLAYER_MEDIA_BEFOREPLAY:"jwplayerMediaBeforePlay",JWPLAYER_MEDIA_BEFORECOMPLETE:"jwplayerMediaBeforeComplete",JWPLAYER_COMPONENT_SHOW:"jwplayerComponentShow",JWPLAYER_COMPONENT_HIDE:"jwplayerComponentHide",JWPLAYER_MEDIA_BUFFER:"jwplayerMediaBuffer",JWPLAYER_MEDIA_BUFFER_FULL:"jwplayerMediaBufferFull",JWPLAYER_MEDIA_ERROR:"jwplayerMediaError",JWPLAYER_MEDIA_LOADED:"jwplayerMediaLoaded",JWPLAYER_MEDIA_COMPLETE:"jwplayerMediaComplete",JWPLAYER_MEDIA_SEEK:"jwplayerMediaSeek",JWPLAYER_MEDIA_TIME:"jwplayerMediaTime",JWPLAYER_MEDIA_VOLUME:"jwplayerMediaVolume",JWPLAYER_MEDIA_META:"jwplayerMediaMeta",JWPLAYER_MEDIA_MUTE:"jwplayerMediaMute",JWPLAYER_PLAYER_STATE:"jwplayerPlayerState",JWPLAYER_PLAYLIST_LOADED:"jwplayerPlaylistLoaded",JWPLAYER_PLAYLIST_ITEM:"jwplayerPlaylistItem",JWPLAYER_INSTREAM_CLICK:"jwplayerInstreamClicked",JWPLAYER_INSTREAM_DESTROYED:"jwplayerInstreamDestroyed"};
c.api.events.state={BUFFERING:"BUFFERING",IDLE:"IDLE",PAUSED:"PAUSED",PLAYING:"PLAYING"};
c.api.playerById=function(a){for(var b=0;
b<d.length;
b++){if(d[b].id==a){return d[b]
}}return null
};
c.api.addPlayer=function(b){for(var a=0;
a<d.length;
a++){if(d[a]==b){return b
}}d.push(b);
return b
};
c.api.destroyPlayer=function(m,p){var n=-1;
for(var a=0;
a<d.length;
a++){if(d[a].id==m){n=a;
continue
}}if(n>=0){try{d[n].callInternal("jwDestroy")
}catch(b){}var q=document.getElementById(d[n].id);
if(document.getElementById(d[n].id+"_wrapper")){q=document.getElementById(d[n].id+"_wrapper")
}if(q){if(p){c.utils.setOuterHTML(q,p)
}else{var e=document.createElement("div");
var o=q.id;
if(q.id.indexOf("_wrapper")==q.id.length-8){newID=q.id.substring(0,q.id.length-8)
}e.setAttribute("id",o);
q.parentNode.replaceChild(e,q)
}}d.splice(n,1)
}return null
};
c.getPlayers=function(){return d.slice(0)
}
})(jwplayer);
var _userPlayerReady=(typeof playerReady=="function")?playerReady:undefined;
playerReady=function(c){var d=jwplayer.api.playerById(c.id);
if(d){d.playerReady(c)
}else{jwplayer.api.selectPlayer(c.id).playerReady(c)
}if(_userPlayerReady){_userPlayerReady.call(this,c)
}};
(function(b){b.api.instream=function(D,x,t,a){var y=D;
var E=x;
var z=t;
var w=a;
var B={};
var r={};
function A(){y.callInternal("jwLoadInstream",t,a)
}function u(d,c){E.jwInstreamAddEventListener(c,'function(dat) { jwplayer("'+y.id+'").dispatchInstreamEvent("'+c+'", dat); }')
}function C(d,c){if(!B[d]){B[d]=[];
u(E,d)
}B[d].push(c);
return this
}function s(d,c){if(!r[d]){r[d]=[];
C(b.api.events.JWPLAYER_PLAYER_STATE,v(d))
}r[d].push(c);
return this
}function v(c){return function(g){var h=g.newstate,e=g.oldstate;
if(h==c){var f=r[h];
if(f){for(var d=0;
d<f.length;
d++){if(typeof f[d]=="function"){f[d].call(this,{oldstate:e,newstate:h,type:g.type})
}}}}}
}this.dispatchEvent=function(c,d){if(B[c]){var e=_utils.translateEventResponse(c,d[1]);
for(var f=0;
f<B[c].length;
f++){if(typeof B[c][f]=="function"){B[c][f].call(this,e)
}}}};
this.onError=function(c){return C(b.api.events.JWPLAYER_ERROR,c)
};
this.onFullscreen=function(c){return C(b.api.events.JWPLAYER_FULLSCREEN,c)
};
this.onMeta=function(c){return C(b.api.events.JWPLAYER_MEDIA_META,c)
};
this.onMute=function(c){return C(b.api.events.JWPLAYER_MEDIA_MUTE,c)
};
this.onComplete=function(c){return C(b.api.events.JWPLAYER_MEDIA_COMPLETE,c)
};
this.onSeek=function(c){return C(b.api.events.JWPLAYER_MEDIA_SEEK,c)
};
this.onTime=function(c){return C(b.api.events.JWPLAYER_MEDIA_TIME,c)
};
this.onVolume=function(c){return C(b.api.events.JWPLAYER_MEDIA_VOLUME,c)
};
this.onBuffer=function(c){return s(b.api.events.state.BUFFERING,c)
};
this.onPause=function(c){return s(b.api.events.state.PAUSED,c)
};
this.onPlay=function(c){return s(b.api.events.state.PLAYING,c)
};
this.onIdle=function(c){return s(b.api.events.state.IDLE,c)
};
this.onInstreamClick=function(c){return C(b.api.events.JWPLAYER_INSTREAM_CLICK,c)
};
this.onInstreamDestroyed=function(c){return C(b.api.events.JWPLAYER_INSTREAM_DESTROYED,c)
};
this.play=function(c){E.jwInstreamPlay(c)
};
this.pause=function(c){E.jwInstreamPause(c)
};
this.seek=function(c){E.jwInstreamSeek(c)
};
this.destroy=function(){E.jwInstreamDestroy()
};
this.getState=function(){return E.jwInstreamGetState()
};
this.getDuration=function(){return E.jwInstreamGetDuration()
};
this.getPosition=function(){return E.jwInstreamGetPosition()
};
A()
}
})(jwplayer);
(function(e){var f=e.utils;
e.embed=function(c){var a={width:400,height:300,components:{controlbar:{position:"over"}}};
var l=f.mediaparser.parseMedia(c.container);
var m=new e.embed.config(f.extend(a,l,c.config),this);
var b=e.plugins.loadPlugins(c.id,m.plugins);
function o(k,g){for(var h in g){if(typeof k[h]=="function"){(k[h]).call(k,g[h])
}}}function n(){if(b.getStatus()==f.loaderstatus.COMPLETE){for(var v=0;
v<m.modes.length;
v++){if(m.modes[v].type&&e.embed[m.modes[v].type]){var k=m.modes[v].config;
var y=m;
if(k){y=f.extend(f.clone(m),k);
var z=["file","levels","playlist"];
for(var w=0;
w<z.length;
w++){var h=z[w];
if(f.exists(k[h])){for(var x=0;
x<z.length;
x++){if(x!=w){var u=z[x];
if(f.exists(y[u])&&!f.exists(k[u])){delete y[u]
}}}}}}var g=new e.embed[m.modes[v].type](document.getElementById(c.id),m.modes[v],y,b,c);
if(g.supportsConfig()){g.embed();
o(c,m.events);
return c
}}}f.log("No suitable players found");
new e.embed.logo(f.extend({hide:true},m.components.logo),"none",c.id)
}}b.addEventListener(e.events.COMPLETE,n);
b.addEventListener(e.events.ERROR,n);
b.load();
return c
};
function d(){if(!document.body){return setTimeout(d,15)
}var c=f.selectors.getElementsByTagAndClass("video","jwplayer");
for(var b=0;
b<c.length;
b++){var a=c[b];
if(a.id==""){a.id="jwplayer_"+Math.round(Math.random()*100000)
}e(a.id).setup({})
}}d()
})(jwplayer);
(function(q){var l=q.utils;
function n(a){var b=[{type:"flash",src:a?a:"/jwplayer/player.swf"},{type:"html5"},{type:"download"}];
if(l.isAndroid()){b[0]=b.splice(1,1,b[0])[0]
}return b
}var u={players:"modes",autoplay:"autostart"};
function t(c){var d=c.toLowerCase();
var a=["left","right","top","bottom"];
for(var b=0;
b<a.length;
b++){if(d==a[b]){return true
}}return false
}function s(a){var b=false;
b=(a instanceof Array)||(typeof a=="object"&&!a.position&&!a.size);
return b
}function m(a){if(typeof a=="string"){if(parseInt(a).toString()==a||a.toLowerCase().indexOf("px")>-1){return parseInt(a)
}}return a
}var o=["playlist","dock","controlbar","logo","display"];
function p(b){var d={};
switch(l.typeOf(b.plugins)){case"object":for(var e in b.plugins){d[l.getPluginName(e)]=e
}break;
case"string":var c=b.plugins.split(",");
for(var a=0;
a<c.length;
a++){d[l.getPluginName(c[a])]=c[a]
}break
}return d
}function r(d,e,f,b){if(l.typeOf(d[e])!="object"){d[e]={}
}var a=d[e][f];
if(l.typeOf(a)!="object"){d[e][f]=a={}
}if(b){if(e=="plugins"){var c=l.getPluginName(f);
a[b]=d[c+"."+b];
delete d[c+"."+b]
}else{a[b]=d[f+"."+b];
delete d[f+"."+b]
}}}q.embed.deserialize=function(a){var f=p(a);
for(var b in f){r(a,"plugins",f[b])
}for(var c in a){if(c.indexOf(".")>-1){var d=c.split(".");
var e=d[0];
var c=d[1];
if(l.isInArray(o,e)){r(a,"components",e,c)
}else{if(f[e]){r(a,"plugins",f[e],c)
}}}}return a
};
q.embed.config=function(g,h){var k=l.extend({},g);
var x;
if(s(k.playlist)){x=k.playlist;
delete k.playlist
}k=q.embed.deserialize(k);
k.height=m(k.height);
k.width=m(k.width);
if(typeof k.plugins=="string"){var f=k.plugins.split(",");
if(typeof k.plugins!="object"){k.plugins={}
}for(var b=0;
b<f.length;
b++){var a=l.getPluginName(f[b]);
if(typeof k[a]=="object"){k.plugins[f[b]]=k[a];
delete k[a]
}else{k.plugins[f[b]]={}
}}}for(var w=0;
w<o.length;
w++){var c=o[w];
if(l.exists(k[c])){if(typeof k[c]!="object"){if(!k.components[c]){k.components[c]={}
}if(c=="logo"){k.components[c].file=k[c]
}else{k.components[c].position=k[c]
}delete k[c]
}else{if(!k.components[c]){k.components[c]={}
}l.extend(k.components[c],k[c]);
delete k[c]
}}if(typeof k[c+"size"]!="undefined"){if(!k.components[c]){k.components[c]={}
}k.components[c].size=k[c+"size"];
delete k[c+"size"]
}}if(typeof k.icons!="undefined"){if(!k.components.display){k.components.display={}
}k.components.display.icons=k.icons;
delete k.icons
}for(var d in u){if(k[d]){if(!k[u[d]]){k[u[d]]=k[d]
}delete k[d]
}}var e;
if(k.flashplayer&&!k.modes){e=n(k.flashplayer);
delete k.flashplayer
}else{if(k.modes){if(typeof k.modes=="string"){e=n(k.modes)
}else{if(k.modes instanceof Array){e=k.modes
}else{if(typeof k.modes=="object"&&k.modes.type){e=[k.modes]
}}}delete k.modes
}else{e=n()
}}k.modes=e;
if(x){k.playlist=x
}return k
}
})(jwplayer);
(function(b){b.embed.download=function(n,h,a,m,k){this.embed=function(){var x=b.utils.extend({},a);
var d={};
var y=a.width?a.width:480;
if(typeof y!="number"){y=parseInt(y,10)
}var v=a.height?a.height:320;
if(typeof v!="number"){v=parseInt(v,10)
}var A,f,g;
var C={};
if(a.playlist&&a.playlist.length){C.file=a.playlist[0].file;
f=a.playlist[0].image;
C.levels=a.playlist[0].levels
}else{C.file=a.file;
f=a.image;
C.levels=a.levels
}if(C.file){A=C.file
}else{if(C.levels&&C.levels.length){A=C.levels[0].file
}}g=A?"pointer":"auto";
var w={display:{style:{cursor:g,width:y,height:v,backgroundColor:"#000",position:"relative",textDecoration:"none",border:"none",display:"block"}},display_icon:{style:{cursor:g,position:"absolute",display:A?"block":"none",top:0,left:0,border:0,margin:0,padding:0,zIndex:3,width:50,height:50,backgroundImage:"url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAALdJREFUeNrs18ENgjAYhmFouDOCcQJGcARHgE10BDcgTOIosAGwQOuPwaQeuFRi2p/3Sb6EC5L3QCxZBgAAAOCorLW1zMn65TrlkH4NcV7QNcUQt7Gn7KIhxA+qNIR81spOGkL8oFJDyLJRdosqKDDkK+iX5+d7huzwM40xptMQMkjIOeRGo+VkEVvIPfTGIpKASfYIfT9iCHkHrBEzf4gcUQ56aEzuGK/mw0rHpy4AAACAf3kJMACBxjAQNRckhwAAAABJRU5ErkJggg==)"}},display_iconBackground:{style:{cursor:g,position:"absolute",display:A?"block":"none",top:((v-50)/2),left:((y-50)/2),border:0,width:50,height:50,margin:0,padding:0,zIndex:2,backgroundImage:"url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAEpJREFUeNrszwENADAIA7DhX8ENoBMZ5KR10EryckCJiIiIiIiIiIiIiIiIiIiIiIh8GmkRERERERERERERERERERERERGRHSPAAPlXH1phYpYaAAAAAElFTkSuQmCC)"}},display_image:{style:{width:y,height:v,display:f?"block":"none",position:"absolute",cursor:g,left:0,top:0,margin:0,padding:0,textDecoration:"none",zIndex:1,border:"none"}}};
var z=function(q,o,r){var p=document.createElement(q);
if(r){p.id=r
}else{p.id=n.id+"_jwplayer_"+o
}b.utils.css(p,w[o].style);
return p
};
d.display=z("a","display",n.id);
if(A){d.display.setAttribute("href",b.utils.getAbsolutePath(A))
}d.display_image=z("img","display_image");
d.display_image.setAttribute("alt","Click to download...");
if(f){d.display_image.setAttribute("src",b.utils.getAbsolutePath(f))
}if(true){d.display_icon=z("div","display_icon");
d.display_iconBackground=z("div","display_iconBackground");
d.display.appendChild(d.display_image);
d.display_iconBackground.appendChild(d.display_icon);
d.display.appendChild(d.display_iconBackground)
}_css=b.utils.css;
_hide=function(o){_css(o,{display:"none"})
};
function c(o){_imageWidth=d.display_image.naturalWidth;
_imageHeight=d.display_image.naturalHeight;
B()
}function B(){b.utils.stretch(b.utils.stretching.UNIFORM,d.display_image,y,v,_imageWidth,_imageHeight)
}d.display_image.onerror=function(o){_hide(d.display_image)
};
d.display_image.onload=c;
n.parentNode.replaceChild(d.display,n);
var e=(a.plugins&&a.plugins.logo)?a.plugins.logo:{};
d.display.appendChild(new b.embed.logo(a.components.logo,"download",n.id));
k.container=document.getElementById(k.id);
k.setPlayer(d.display,"download")
};
this.supportsConfig=function(){if(a){var c=b.utils.getFirstPlaylistItemFromConfig(a);
if(typeof c.file=="undefined"&&typeof c.levels=="undefined"){return true
}else{if(c.file){return l(c.file,c.provider,c.playlistfile)
}else{if(c.levels&&c.levels.length){for(var d=0;
d<c.levels.length;
d++){if(c.levels[d].file&&l(c.levels[d].file,c.provider,c.playlistfile)){return true
}}}}}}else{return true
}};
function l(f,d,g){if(g){return false
}var e=["image","sound","youtube","http"];
if(d&&(e.toString().indexOf(d)>-1)){return true
}if(!d||(d&&d=="video")){var c=b.utils.extension(f);
if(c&&b.utils.extensionmap[c]){return true
}}return false
}}
})(jwplayer);
(function(b){b.embed.flash=function(s,r,n,t,p){function a(e,f,d){var c=document.createElement("param");
c.setAttribute("name",f);
c.setAttribute("value",d);
e.appendChild(c)
}function o(d,c,e){return function(h){if(e){document.getElementById(p.id+"_wrapper").appendChild(c)
}var f=document.getElementById(p.id).getPluginConfig("display");
d.resize(f.width,f.height);
var g={left:f.x,top:f.y};
b.utils.css(c,g)
}
}function u(e){if(!e){return{}
}var c={};
for(var f in e){var g=e[f];
for(var d in g){c[f+"."+d]=g[d]
}}return c
}function q(e,f){if(e[f]){var c=e[f];
for(var g in c){var h=c[g];
if(typeof h=="string"){if(!e[g]){e[g]=h
}}else{for(var d in h){if(!e[g+"."+d]){e[g+"."+d]=h[d]
}}}}delete e[f]
}}function w(f){if(!f){return{}
}var c={},d=[];
for(var k in f){var g=b.utils.getPluginName(k);
var h=f[k];
d.push(k);
for(var e in h){c[g+"."+e]=h[e]
}}c.plugins=d.join(",");
return c
}function v(c){var e=c.netstreambasepath?"":"netstreambasepath="+encodeURIComponent(window.location.href.split("#")[0])+"&";
for(var d in c){if(typeof(c[d])=="object"){e+=d+"="+encodeURIComponent("[[JSON]]"+b.utils.strings.jsonToString(c[d]))+"&"
}else{e+=d+"="+encodeURIComponent(c[d])+"&"
}}return e.substring(0,e.length-1)
}this.embed=function(){n.id=p.id;
var g;
var c=b.utils.extend({},n);
var f=c.width;
var l=c.height;
if(s.id+"_wrapper"==s.parentNode.id){g=document.getElementById(s.id+"_wrapper")
}else{g=document.createElement("div");
g.id=s.id+"_wrapper";
b.utils.wrap(s,g);
b.utils.css(g,{position:"relative",width:f,height:l})
}var e=t.setupPlugins(p,c,o);
if(e.length>0){b.utils.extend(c,w(e.plugins))
}else{delete c.plugins
}var F=["height","width","modes","events"];
for(var C=0;
C<F.length;
C++){delete c[F[C]]
}var d="opaque";
if(c.wmode){d=c.wmode
}q(c,"components");
q(c,"providers");
if(typeof c["dock.position"]!="undefined"){if(c["dock.position"].toString().toLowerCase()=="false"){c.dock=c["dock.position"];
delete c["dock.position"]
}}var m=b.utils.getCookies();
for(var h in m){if(typeof(c[h])=="undefined"){c[h]=m[h]
}}var k="#000000";
var D;
if(b.utils.isIE()){var B='<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" bgcolor="'+k+'" width="100%" height="100%" id="'+s.id+'" name="'+s.id+'" tabindex=0"">';
B+='<param name="movie" value="'+r.src+'">';
B+='<param name="allowfullscreen" value="true">';
B+='<param name="allowscriptaccess" value="always">';
B+='<param name="seamlesstabbing" value="true">';
B+='<param name="wmode" value="'+d+'">';
B+='<param name="flashvars" value="'+v(c)+'">';
B+="</object>";
b.utils.setOuterHTML(s,B);
D=document.getElementById(s.id)
}else{var E=document.createElement("object");
E.setAttribute("type","application/x-shockwave-flash");
E.setAttribute("data",r.src);
E.setAttribute("width","100%");
E.setAttribute("height","100%");
E.setAttribute("bgcolor","#000000");
E.setAttribute("id",s.id);
E.setAttribute("name",s.id);
E.setAttribute("tabindex",0);
a(E,"allowfullscreen","true");
a(E,"allowscriptaccess","always");
a(E,"seamlesstabbing","true");
a(E,"wmode",d);
a(E,"flashvars",v(c));
s.parentNode.replaceChild(E,s);
D=E
}p.container=D;
p.setPlayer(D,"flash")
};
this.supportsConfig=function(){if(b.utils.hasFlash()){if(n){var c=b.utils.getFirstPlaylistItemFromConfig(n);
if(typeof c.file=="undefined"&&typeof c.levels=="undefined"){return true
}else{if(c.file){return flashCanPlay(c.file,c.provider)
}else{if(c.levels&&c.levels.length){for(var d=0;
d<c.levels.length;
d++){if(c.levels[d].file&&flashCanPlay(c.levels[d].file,c.provider)){return true
}}}}}}else{return true
}}return false
};
flashCanPlay=function(f,d){var e=["video","http","sound","image"];
if(d&&(e.toString().indexOf(d)<0)){return true
}var c=b.utils.extension(f);
if(!c){return true
}if(b.utils.exists(b.utils.extensionmap[c])&&!b.utils.exists(b.utils.extensionmap[c].flash)){return false
}return true
}
}
})(jwplayer);
(function(b){b.embed.html5=function(n,h,a,m,k){function l(d,c,e){return function(g){var f=document.getElementById(n.id+"_displayarea");
if(e){f.appendChild(c)
}d.resize(f.clientWidth,f.clientHeight);
c.left=f.style.left;
c.top=f.style.top
}
}this.embed=function(){if(b.html5){m.setupPlugins(k,a,l);
n.innerHTML="";
var e=b.utils.extend({screencolor:"0x000000"},a);
var f=["plugins","modes","events"];
for(var d=0;
d<f.length;
d++){delete e[f[d]]
}if(e.levels&&!e.sources){e.sources=a.levels
}if(e.skin&&e.skin.toLowerCase().indexOf(".zip")>0){e.skin=e.skin.replace(/\.zip/i,".xml")
}var c=new (b.html5(n)).setup(e);
k.container=document.getElementById(k.id);
k.setPlayer(c,"html5")
}else{return null
}};
this.supportsConfig=function(){if(!!b.vid.canPlayType){if(a){var c=b.utils.getFirstPlaylistItemFromConfig(a);
if(typeof c.file=="undefined"&&typeof c.levels=="undefined"){return true
}else{if(c.file){return html5CanPlay(b.vid,c.file,c.provider,c.playlistfile)
}else{if(c.levels&&c.levels.length){for(var d=0;
d<c.levels.length;
d++){if(c.levels[d].file&&html5CanPlay(b.vid,c.levels[d].file,c.provider,c.playlistfile)){return true
}}}}}}else{return true
}}return false
};
html5CanPlay=function(e,f,d,g){if(g){return false
}if(d&&d=="youtube"){return true
}if(d&&d!="video"&&d!="http"&&d!="sound"){return false
}if(navigator.userAgent.match(/BlackBerry/i)!==null){return false
}var c=b.utils.extension(f);
if(!b.utils.exists(c)||!b.utils.exists(b.utils.extensionmap[c])){return true
}if(!b.utils.exists(b.utils.extensionmap[c].html5)){return false
}if(b.utils.isLegacyAndroid()&&c.match(/m4v|mp4/)){return true
}return browserCanPlay(e,b.utils.extensionmap[c].html5)
};
browserCanPlay=function(c,d){if(!d){return true
}if(c.canPlayType(d)){return true
}else{if(d=="audio/mp3"&&navigator.userAgent.match(/safari/i)){return c.canPlayType("audio/mpeg")
}else{return false
}}}
}
})(jwplayer);
(function(b){b.embed.logo=function(s,t,A){var v={prefix:"http://l.longtailvideo.com/"+t+"/",file:"",link:"",linktarget:"_top",margin:8,out:0.5,over:1,timeout:5,hide:false,position:"bottom-left"};
_css=b.utils.css;
var C;
var w;
u();
function u(){q();
B();
y()
}function q(){if(v.prefix){var c=b.version.split(/\W/).splice(0,2).join("/");
if(v.prefix.indexOf(c)<0){v.prefix+=c+"/"
}}w=b.utils.extend({},v,s)
}function a(){var c={border:"none",textDecoration:"none",position:"absolute",cursor:"pointer",zIndex:10};
c.display=w.hide?"none":"block";
var d=w.position.toLowerCase().split("-");
for(var e in d){c[d[e]]=w.margin
}return c
}function B(){C=document.createElement("img");
C.id=A+"_jwplayer_logo";
C.style.display="none";
C.onload=function(c){_css(C,a());
z()
};
if(!w.file){return
}if(w.file.indexOf("http://")===0){C.src=w.file
}else{C.src=w.prefix+w.file
}}if(!w.file){return
}function y(){if(w.link){C.onmouseover=x;
C.onmouseout=z;
C.onclick=r
}else{this.mouseEnabled=false
}}function r(c){if(typeof c!="undefined"){c.preventDefault();
c.stopPropagation()
}if(w.link){window.open(w.link,w.linktarget)
}return
}function z(c){if(w.link){C.style.opacity=w.out
}return
}function x(c){if(w.hide){C.style.opacity=w.over
}return
}return C
}
})(jwplayer);
(function(b){b.html5=function(a){var d=a;
this.setup=function(c){b.utils.extend(this,new b.html5.api(d,c));
return this
};
return this
}
})(jwplayer);
(function(f){var g=f.utils;
var e=g.css;
var h=g.isIOS();
f.html5.view=function(ax,ac,aC){var ay=ax;
var al=ac;
var aB=aC;
var c;
var aD;
var aq;
var aw;
var ae;
var U;
var V;
var af=false;
var am=false;
var aj,W;
var aE,b,ap;
function Y(){c=document.createElement("div");
c.id=al.id;
c.className=al.className;
_videowrapper=document.createElement("div");
_videowrapper.id=c.id+"_video_wrapper";
al.id=c.id+"_video";
e(c,{position:"relative",height:aB.height,width:aB.width,padding:0,backgroundColor:k(),zIndex:0});
function k(){if(ay.skin.getComponentSettings("display")&&ay.skin.getComponentSettings("display").backgroundcolor){return ay.skin.getComponentSettings("display").backgroundcolor
}return parseInt("000000",16)
}e(al,{width:"100%",height:"100%",top:0,left:0,zIndex:1,margin:"auto",display:"block"});
e(_videowrapper,{overflow:"hidden",position:"absolute",top:0,left:0,bottom:0,right:0});
g.wrap(al,c);
g.wrap(al,_videowrapper);
aw=document.createElement("div");
aw.id=c.id+"_displayarea";
c.appendChild(aw);
_instreamArea=document.createElement("div");
_instreamArea.id=c.id+"_instreamarea";
e(_instreamArea,{overflow:"hidden",position:"absolute",top:0,left:0,bottom:0,right:0,zIndex:100,background:"000000",display:"none"});
c.appendChild(_instreamArea)
}function Z(){for(var l=0;
l<aB.plugins.order.length;
l++){var k=aB.plugins.order[l];
if(g.exists(aB.plugins.object[k].getDisplayElement)){aB.plugins.object[k].height=g.parseDimension(aB.plugins.object[k].getDisplayElement().style.height);
aB.plugins.object[k].width=g.parseDimension(aB.plugins.object[k].getDisplayElement().style.width);
aB.plugins.config[k].currentPosition=aB.plugins.config[k].position
}}ao()
}function ar(k){am=aB.fullscreen
}function av(k){if(b){return
}switch(k.newstate){case f.api.events.state.PLAYING:if(aB.getMedia()&&aB.getMedia().hasChrome()){aw.style.display="none"
}break;
default:aw.style.display="block";
break
}az()
}function ao(l){var n=aB.getMedia()?aB.getMedia().getDisplayElement():null;
if(g.exists(n)){if(V!=n){if(V&&V.parentNode){V.parentNode.replaceChild(n,V)
}V=n
}for(var m=0;
m<aB.plugins.order.length;
m++){var k=aB.plugins.order[m];
if(g.exists(aB.plugins.object[k].getDisplayElement)){aB.plugins.config[k].currentPosition=aB.plugins.config[k].position
}}}ad(aB.width,aB.height)
}this.setup=function(){if(aB&&aB.getMedia()){al=aB.getMedia().getDisplayElement()
}Y();
Z();
ay.jwAddEventListener(f.api.events.JWPLAYER_PLAYER_STATE,av);
ay.jwAddEventListener(f.api.events.JWPLAYER_MEDIA_LOADED,ao);
ay.jwAddEventListener(f.api.events.JWPLAYER_MEDIA_BEFOREPLAY,ar);
ay.jwAddEventListener(f.api.events.JWPLAYER_MEDIA_META,function(l){az()
});
var k;
if(g.exists(window.onresize)){k=window.onresize
}window.onresize=function(m){if(g.exists(k)){try{k(m)
}catch(n){}}if(ay.jwGetFullscreen()){if(!ai()){var l=g.getBoundingClientRect(document.body);
aB.width=Math.abs(l.left)+Math.abs(l.right);
aB.height=window.innerHeight;
ad(aB.width,aB.height)
}}else{ad(aB.width,aB.height)
}}
};
function X(k){switch(k.keyCode){case 27:if(ay.jwGetFullscreen()){ay.jwSetFullscreen(false)
}break;
case 32:if(ay.jwGetState()!=f.api.events.state.IDLE&&ay.jwGetState()!=f.api.events.state.PAUSED){ay.jwPause()
}else{ay.jwPlay()
}break
}}function ad(q,s){if(c.style.display=="none"){return
}var n=[].concat(aB.plugins.order);
n.reverse();
ae=n.length+2;
if(am&&ai()){try{if(aB.fullscreen&&!aB.getMedia().getDisplayElement().webkitDisplayingFullscreen){aB.fullscreen=false
}}catch(k){}}if(!aB.fullscreen){aD=q;
aq=s;
if(typeof q=="string"&&q.indexOf("%")>0){aD=g.getElementWidth(g.parentNode(c))*parseInt(q.replace("%"),"")/100
}else{aD=q
}if(typeof s=="string"&&s.indexOf("%")>0){aq=g.getElementHeight(g.parentNode(c))*parseInt(s.replace("%"),"")/100
}else{aq=s
}var m={top:0,bottom:0,left:0,right:0,width:aD,height:aq,position:"absolute"};
e(aw,m);
var r={};
var u;
try{u=aB.plugins.object.display.getDisplayElement()
}catch(k){}if(u){r.width=g.parseDimension(u.style.width);
r.height=g.parseDimension(u.style.height)
}var t=g.extend({},m,r,{zIndex:_instreamArea.style.zIndex,display:_instreamArea.style.display});
e(_instreamArea,t);
e(c,{height:aq,width:aD});
var l=an(ab,n);
if(l.length>0){ae+=l.length;
var o=l.indexOf("playlist"),p=l.indexOf("controlbar");
if(o>=0&&p>=0){l[o]=l.splice(p,1,l[o])[0]
}an(au,l,true)
}aj=g.getElementWidth(aw);
W=g.getElementHeight(aw)
}else{if(!ai()&&!h){an(aF,n,true)
}}az()
}var at;
function an(s,n,m){at=0;
var l=[];
for(var o=0;
o<n.length;
o++){var k=n[o];
if(g.exists(aB.plugins.object[k].getDisplayElement)){if(aB.plugins.config[k].currentPosition!=f.html5.view.positions.NONE){var q=s(k,ae--);
if(!q){l.push(k)
}else{var p=q.width;
var r=q.height;
if(m){delete q.width;
delete q.height
}e(aB.plugins.object[k].getDisplayElement(),q);
aB.plugins.object[k].resize(p,r)
}}else{e(aB.plugins.object[k].getDisplayElement(),{display:"none"})
}}}return l
}function ab(l,k){if(g.exists(aB.plugins.object[l].getDisplayElement)){if(aB.plugins.config[l].position&&a(aB.plugins.config[l].position)){if(!g.exists(aB.plugins.object[l].getDisplayElement().parentNode)){c.appendChild(aB.plugins.object[l].getDisplayElement())
}var m=ak(l);
m.zIndex=k;
return m
}}return false
}function au(l,k){if(!g.exists(aB.plugins.object[l].getDisplayElement().parentNode)){aw.appendChild(aB.plugins.object[l].getDisplayElement())
}return{position:"absolute",width:(g.getElementWidth(aw)-g.parseDimension(aw.style.right)),height:(g.getElementHeight(aw)-g.parseDimension(aw.style.bottom)),zIndex:k}
}function aF(l,k){return{position:"fixed",width:aB.width,height:aB.height,zIndex:k}
}var az=this.resizeMedia=function(){aw.style.position="absolute";
var k=aB.getMedia()?aB.getMedia().getDisplayElement():ap;
if(!k){return
}if(k&&k.tagName.toLowerCase()=="video"){if(!k.videoWidth||!k.videoHeight){k.style.width=aw.style.width;
k.style.height=aw.style.height;
return
}k.style.position="absolute";
g.fadeTo(k,1,0.25);
if(k.parentNode){k.parentNode.style.left=aw.style.left;
k.parentNode.style.top=aw.style.top
}if(aB.fullscreen&&ay.jwGetStretching()==f.utils.stretching.EXACTFIT&&!g.isMobile()){var m=document.createElement("div");
g.stretch(f.utils.stretching.UNIFORM,m,g.getElementWidth(aw),g.getElementHeight(aw),aj,W);
g.stretch(f.utils.stretching.EXACTFIT,k,g.parseDimension(m.style.width),g.parseDimension(m.style.height),k.videoWidth?k.videoWidth:400,k.videoHeight?k.videoHeight:300);
e(k,{left:m.style.left,top:m.style.top})
}else{if(!h){g.stretch(ay.jwGetStretching(),k,g.getElementWidth(aw),g.getElementHeight(aw),k.videoWidth?k.videoWidth:400,k.videoHeight?k.videoHeight:300)
}}}else{var l=aB.plugins.object.display.getDisplayElement();
if(l){aB.getMedia().resize(g.parseDimension(l.style.width),g.parseDimension(l.style.height))
}else{aB.getMedia().resize(g.parseDimension(aw.style.width),g.parseDimension(aw.style.height))
}}};
var ak=this.getComponentPosition=function(l){var k={position:"absolute",margin:0,padding:0,top:null};
var m=aB.plugins.config[l].currentPosition.toLowerCase();
switch(m.toUpperCase()){case f.html5.view.positions.TOP:k.top=g.parseDimension(aw.style.top);
k.left=g.parseDimension(aw.style.left);
k.width=g.getElementWidth(aw)-g.parseDimension(aw.style.left)-g.parseDimension(aw.style.right);
k.height=aB.plugins.object[l].height;
aw.style[m]=g.parseDimension(aw.style[m])+aB.plugins.object[l].height+"px";
aw.style.height=g.getElementHeight(aw)-k.height+"px";
break;
case f.html5.view.positions.RIGHT:k.top=g.parseDimension(aw.style.top);
k.right=g.parseDimension(aw.style.right);
k.width=aB.plugins.object[l].width;
k.height=g.getElementHeight(aw)-g.parseDimension(aw.style.top)-g.parseDimension(aw.style.bottom);
aw.style.width=g.getElementWidth(aw)-k.width+"px";
break;
case f.html5.view.positions.BOTTOM:k.left=g.parseDimension(aw.style.left);
k.width=g.getElementWidth(aw)-g.parseDimension(aw.style.left)-g.parseDimension(aw.style.right);
k.height=aB.plugins.object[l].height;
k.bottom=g.parseDimension(aw.style.bottom+at);
at+=k.height;
aw.style.height=g.getElementHeight(aw)-k.height+"px";
break;
case f.html5.view.positions.LEFT:k.top=g.parseDimension(aw.style.top);
k.left=g.parseDimension(aw.style.left);
k.width=aB.plugins.object[l].width;
k.height=g.getElementHeight(aw)-g.parseDimension(aw.style.top)-g.parseDimension(aw.style.bottom);
aw.style[m]=g.parseDimension(aw.style[m])+aB.plugins.object[l].width+"px";
aw.style.width=g.getElementWidth(aw)-k.width+"px";
break;
default:break
}return k
};
this.resize=ad;
var aa,aA,d;
var ah=this.fullscreen=function(k){if(h){return
}var p;
try{p=aB.getMedia().getDisplayElement()
}catch(q){}if(k){aA=aB.width;
d=aB.height
}var o={position:"fixed",width:"100%",height:"100%",top:0,left:0,zIndex:2147483000},n={position:"relative",height:aA,width:d,zIndex:0};
if(ai()&&p&&p.webkitSupportsFullscreen){if(k&&!p.webkitDisplayingFullscreen){try{e(p,o);
g.transform(p);
aa=aw.style.display;
aw.style.display="none";
p.webkitEnterFullscreen()
}catch(l){}}else{if(!k){e(p,n);
az();
if(p.webkitDisplayingFullscreen){try{p.webkitExitFullscreen()
}catch(l){}}aw.style.display=aa
}}af=false
}else{if(k){document.onkeydown=X;
clearInterval(U);
var m=g.getBoundingClientRect(document.body);
aB.width=Math.abs(m.left)+Math.abs(m.right);
aB.height=window.innerHeight;
e(c,o);
o.zIndex=1;
if(aB.getMedia()&&aB.getMedia().getDisplayElement()){e(aB.getMedia().getDisplayElement(),o)
}o.zIndex=2;
e(aw,o);
af=true
}else{document.onkeydown="";
aB.width=aD;
aB.height=aq;
e(c,n);
af=false
}ad(aB.width,aB.height)
}};
function a(k){return([f.html5.view.positions.TOP,f.html5.view.positions.RIGHT,f.html5.view.positions.BOTTOM,f.html5.view.positions.LEFT].toString().indexOf(k.toUpperCase())>-1)
}function ai(){if(ay.jwGetState()!=f.api.events.state.IDLE&&!af&&(aB.getMedia()&&aB.getMedia().getDisplayElement()&&aB.getMedia().getDisplayElement().webkitSupportsFullscreen)&&g.useNativeFullscreen()){return true
}return false
}this.setupInstream=function(l,k){g.css(_instreamArea,{display:"block",position:"absolute"});
aw.style.display="none";
_instreamArea.appendChild(l);
ap=k;
b=true
};
var ag=this.destroyInstream=function(){_instreamArea.style.display="none";
_instreamArea.innerHTML="";
aw.style.display="block";
ap=null;
b=false;
ad(aB.width,aB.height)
}
};
f.html5.view.positions={TOP:"TOP",RIGHT:"RIGHT",BOTTOM:"BOTTOM",LEFT:"LEFT",OVER:"OVER",NONE:"NONE"}
})(jwplayer);
(function(d){var c={backgroundcolor:"",margin:10,font:"Arial,sans-serif",fontsize:10,fontcolor:parseInt("000000",16),fontstyle:"normal",fontweight:"bold",buttoncolor:parseInt("ffffff",16),position:d.html5.view.positions.BOTTOM,idlehide:false,hideplaylistcontrols:false,forcenextprev:false,layout:{left:{position:"left",elements:[{name:"play",type:"button"},{name:"divider",type:"divider"},{name:"prev",type:"button"},{name:"divider",type:"divider"},{name:"next",type:"button"},{name:"divider",type:"divider"},{name:"elapsed",type:"text"}]},center:{position:"center",elements:[{name:"time",type:"slider"}]},right:{position:"right",elements:[{name:"duration",type:"text"},{name:"blank",type:"button"},{name:"divider",type:"divider"},{name:"mute",type:"button"},{name:"volume",type:"slider"},{name:"divider",type:"divider"},{name:"fullscreen",type:"button"}]}}};
_utils=d.utils;
_css=_utils.css;
_hide=function(a){_css(a,{display:"none"})
};
_show=function(a){_css(a,{display:"block"})
};
d.html5.controlbar=function(bc,b){window.controlbar=this;
var bd=bc;
var aR=_utils.extend({},c,bd.skin.getComponentSettings("controlbar"),b);
if(aR.position==d.html5.view.positions.NONE||typeof d.html5.view.positions[aR.position]=="undefined"){return
}if(_utils.mapLength(bd.skin.getComponentLayout("controlbar"))>0){aR.layout=bd.skin.getComponentLayout("controlbar")
}var aN;
var au;
var aO;
var aP;
var a2="none";
var bg;
var be;
var aK;
var bh;
var bi;
var aZ;
var at={};
var a8=false;
var bl={};
var av=-1;
var aV;
var bf=false;
var a9;
var bk;
var ap=false;
var aL=false;
var aJ;
var aY=new d.html5.eventdispatcher();
_utils.extend(this,aY);
function aD(){if(!aV){aV=bd.skin.getSkinElement("controlbar","background");
if(!aV){aV={width:0,height:0,src:null}
}}return aV
}function ax(){aO=0;
aP=0;
au=0;
if(!a8){var e={height:aD().height,backgroundColor:aR.backgroundcolor};
aN=document.createElement("div");
aN.id=bd.id+"_jwplayer_controlbar";
_css(aN,e)
}var f=(bd.skin.getSkinElement("controlbar","capLeft"));
var g=(bd.skin.getSkinElement("controlbar","capRight"));
if(f){a0("capLeft","left",false,aN)
}aT("background",aN,{position:"absolute",height:aD().height,left:(f?f.width:0),zIndex:0},"img");
if(aD().src){at.background.src=aD().src
}aT("elements",aN,{position:"relative",height:aD().height,zIndex:1});
if(g){a0("capRight","right",false,aN)
}}this.getDisplayElement=function(){return aN
};
this.resize=function(e,g){ar();
_utils.cancelAnimation(aN);
bi=e;
aZ=g;
if(aL!=bd.jwGetFullscreen()){aL=bd.jwGetFullscreen();
if(!aL){a()
}bk=undefined
}var f=a1();
aE({id:bd.id,duration:aK,position:be});
a3({id:bd.id,bufferPercent:bh});
return f
};
this.show=function(){if(bf){bf=false;
_show(aN);
ao()
}};
this.hide=function(){if(!bf){bf=true;
_hide(aN);
aQ()
}};
function a7(){var f=["timeSlider","volumeSlider","timeSliderRail","volumeSliderRail"];
for(var e in f){var g=f[e];
if(typeof at[g]!="undefined"){bl[g]=_utils.getBoundingClientRect(at[g])
}}}var bj;
function a(e){if(bf){return
}clearTimeout(a9);
if(aR.position==d.html5.view.positions.OVER||bd.jwGetFullscreen()){switch(bd.jwGetState()){case d.api.events.state.PAUSED:case d.api.events.state.IDLE:if(aN&&aN.style.opacity<1&&(!aR.idlehide||_utils.exists(e))){bj=false;
setTimeout(function(){if(!bj){an()
}},100)
}if(aR.idlehide){a9=setTimeout(function(){aX()
},2000)
}break;
default:bj=true;
if(e){an()
}a9=setTimeout(function(){aX()
},2000);
break
}}else{an()
}}function aX(){if(!bf){aQ();
if(aN.style.opacity==1){_utils.cancelAnimation(aN);
_utils.fadeTo(aN,0,0.1,1,0)
}}}function an(){if(!bf){ao();
if(aN.style.opacity==0){_utils.cancelAnimation(aN);
_utils.fadeTo(aN,1,0.1,0,0)
}}}function aH(e){return function(){if(ap&&bk!=e){bk=e;
aY.sendEvent(e,{component:"controlbar",boundingRect:aw()})
}}
}var ao=aH(d.api.events.JWPLAYER_COMPONENT_SHOW);
var aQ=aH(d.api.events.JWPLAYER_COMPONENT_HIDE);
function aw(){if(aR.position==d.html5.view.positions.OVER||bd.jwGetFullscreen()){return _utils.getDimensions(aN)
}else{return{x:0,y:0,width:0,height:0}
}}function aT(e,f,g,k){var h;
if(!a8){if(!k){k="div"
}h=document.createElement(k);
at[e]=h;
h.id=aN.id+"_"+e;
f.appendChild(h)
}else{h=document.getElementById(aN.id+"_"+e)
}if(_utils.exists(g)){_css(h,g)
}return h
}function ay(){if(bd.jwGetHeight()<=40){aR.layout=_utils.clone(aR.layout);
for(var e=0;
e<aR.layout.left.elements.length;
e++){if(aR.layout.left.elements[e].name=="fullscreen"){aR.layout.left.elements.splice(e,1)
}}for(e=0;
e<aR.layout.right.elements.length;
e++){if(aR.layout.right.elements[e].name=="fullscreen"){aR.layout.right.elements.splice(e,1)
}}ba()
}aB(aR.layout.left);
aB(aR.layout.center);
aB(aR.layout.right)
}function aB(f,k){var e=f.position=="right"?"right":"left";
var g=_utils.extend([],f.elements);
if(_utils.exists(k)){g.reverse()
}var f=aT(f.position+"Group",at.elements,{"float":"left",styleFloat:"left",cssFloat:"left",height:"100%"});
for(var h=0;
h<g.length;
h++){aS(g[h],e,f)
}}function aA(){return au++
}function aS(l,h,f){var m,o,n,p,e;
if(!f){f=at.elements
}if(l.type=="divider"){a0("divider"+aA(),h,true,f,undefined,l.width,l.element);
return
}switch(l.name){case"play":a0("playButton",h,false,f);
a0("pauseButton",h,true,f);
aq("playButton","jwPlay");
aq("pauseButton","jwPause");
break;
case"prev":a0("prevButton",h,true,f);
aq("prevButton","jwPlaylistPrev");
break;
case"stop":a0("stopButton",h,true,f);
aq("stopButton","jwStop");
break;
case"next":a0("nextButton",h,true,f);
aq("nextButton","jwPlaylistNext");
break;
case"elapsed":a0("elapsedText",h,true,f,null,null,bd.skin.getSkinElement("controlbar","elapsedBackground"));
break;
case"time":o=!_utils.exists(bd.skin.getSkinElement("controlbar","timeSliderCapLeft"))?0:bd.skin.getSkinElement("controlbar","timeSliderCapLeft").width;
n=!_utils.exists(bd.skin.getSkinElement("controlbar","timeSliderCapRight"))?0:bd.skin.getSkinElement("controlbar","timeSliderCapRight").width;
m=h=="left"?o:n;
e={height:aD().height,position:"relative","float":"left",styleFloat:"left",cssFloat:"left"};
var k=aT("timeSlider",f,e);
a0("timeSliderCapLeft",h,true,k,"relative");
a0("timeSliderRail",h,false,k,"relative");
a0("timeSliderBuffer",h,false,k,"absolute");
a0("timeSliderProgress",h,false,k,"absolute");
a0("timeSliderThumb",h,false,k,"absolute");
a0("timeSliderCapRight",h,true,k,"relative");
aW("time");
break;
case"fullscreen":a0("fullscreenButton",h,false,f);
a0("normalscreenButton",h,true,f);
aq("fullscreenButton","jwSetFullscreen",true);
aq("normalscreenButton","jwSetFullscreen",false);
break;
case"volume":o=!_utils.exists(bd.skin.getSkinElement("controlbar","volumeSliderCapLeft"))?0:bd.skin.getSkinElement("controlbar","volumeSliderCapLeft").width;
n=!_utils.exists(bd.skin.getSkinElement("controlbar","volumeSliderCapRight"))?0:bd.skin.getSkinElement("controlbar","volumeSliderCapRight").width;
m=h=="left"?o:n;
p=bd.skin.getSkinElement("controlbar","volumeSliderRail").width+o+n;
e={height:aD().height,position:"relative",width:p,"float":"left",styleFloat:"left",cssFloat:"left"};
var g=aT("volumeSlider",f,e);
a0("volumeSliderCapLeft",h,false,g,"relative");
a0("volumeSliderRail",h,false,g,"relative");
a0("volumeSliderProgress",h,false,g,"absolute");
a0("volumeSliderThumb",h,false,g,"absolute");
a0("volumeSliderCapRight",h,false,g,"relative");
aW("volume");
break;
case"mute":a0("muteButton",h,false,f);
a0("unmuteButton",h,true,f);
aq("muteButton","jwSetMute",true);
aq("unmuteButton","jwSetMute",false);
break;
case"duration":a0("durationText",h,true,f,null,null,bd.skin.getSkinElement("controlbar","durationBackground"));
break
}}function a0(m,h,o,e,l,p,n){if(_utils.exists(bd.skin.getSkinElement("controlbar",m))||m.indexOf("Text")>0||m.indexOf("divider")===0){var k={height:"100%",position:l?l:"relative",display:"block","float":"left",styleFloat:"left",cssFloat:"left"};
if((m.indexOf("next")===0||m.indexOf("prev")===0)&&(bd.jwGetPlaylist().length<2||aR.hideplaylistcontrols.toString()=="true")){if(aR.forcenextprev.toString()!="true"){o=false;
k.display="none"
}}var q;
if(m.indexOf("Text")>0){m.innerhtml="00:00";
k.font=aR.fontsize+"px/"+(aD().height+1)+"px "+aR.font;
k.color=aR.fontcolor;
k.textAlign="center";
k.fontWeight=aR.fontweight;
k.fontStyle=aR.fontstyle;
k.cursor="default";
if(n){k.background="url("+n.src+") no-repeat center";
k.backgroundSize="100% "+aD().height+"px"
}k.padding="0 5px"
}else{if(m.indexOf("divider")===0){if(p){if(!isNaN(parseInt(p))){q=parseInt(p)
}}else{if(n){var g=bd.skin.getSkinElement("controlbar",n);
if(g){k.background="url("+g.src+") repeat-x center left";
q=g.width
}}else{k.background="url("+bd.skin.getSkinElement("controlbar","divider").src+") repeat-x center left";
q=bd.skin.getSkinElement("controlbar","divider").width
}}}else{k.background="url("+bd.skin.getSkinElement("controlbar",m).src+") repeat-x center left";
q=bd.skin.getSkinElement("controlbar",m).width
}}if(h=="left"){if(o){aO+=q
}}else{if(h=="right"){if(o){aP+=q
}}}if(_utils.typeOf(e)=="undefined"){e=at.elements
}k.width=q;
if(a8){_css(at[m],k)
}else{var f=aT(m,e,k);
if(_utils.exists(bd.skin.getSkinElement("controlbar",m+"Over"))){f.onmouseover=function(r){f.style.backgroundImage=["url(",bd.skin.getSkinElement("controlbar",m+"Over").src,")"].join("")
};
f.onmouseout=function(r){f.style.backgroundImage=["url(",bd.skin.getSkinElement("controlbar",m).src,")"].join("")
}
}if(m.indexOf("divider")==0){f.setAttribute("class","divider")
}f.innerHTML="&nbsp;"
}}}function aM(){bd.jwAddEventListener(d.api.events.JWPLAYER_PLAYLIST_LOADED,aU);
bd.jwAddEventListener(d.api.events.JWPLAYER_PLAYLIST_ITEM,a5);
bd.jwAddEventListener(d.api.events.JWPLAYER_MEDIA_BUFFER,a3);
bd.jwAddEventListener(d.api.events.JWPLAYER_PLAYER_STATE,a6);
bd.jwAddEventListener(d.api.events.JWPLAYER_MEDIA_TIME,aE);
bd.jwAddEventListener(d.api.events.JWPLAYER_MEDIA_MUTE,aC);
bd.jwAddEventListener(d.api.events.JWPLAYER_MEDIA_VOLUME,bb);
bd.jwAddEventListener(d.api.events.JWPLAYER_MEDIA_COMPLETE,az)
}function aU(){if(!aR.hideplaylistcontrols){if(bd.jwGetPlaylist().length>1||aR.forcenextprev.toString()=="true"){_show(at.nextButton);
_show(at.prevButton)
}else{_hide(at.nextButton);
_hide(at.prevButton)
}a1();
aI()
}}function a5(e){aK=bd.jwGetPlaylist()[e.index].duration;
av=-1;
aE({id:bd.id,duration:aK,position:0});
a3({id:bd.id,bufferProgress:0})
}function aI(){aE({id:bd.id,duration:bd.jwGetDuration(),position:0});
a3({id:bd.id,bufferProgress:0});
aC({id:bd.id,mute:bd.jwGetMute()});
a6({id:bd.id,newstate:d.api.events.state.IDLE});
bb({id:bd.id,volume:bd.jwGetVolume()})
}function aq(f,e,g){if(a8){return
}if(_utils.exists(bd.skin.getSkinElement("controlbar",f))){var h=at[f];
if(_utils.exists(h)){_css(h,{cursor:"pointer"});
if(e=="fullscreen"){h.onmouseup=function(k){k.stopPropagation();
bd.jwSetFullscreen(!bd.jwGetFullscreen())
}
}else{h.onmouseup=function(k){k.stopPropagation();
if(_utils.exists(g)){bd[e](g)
}else{bd[e]()
}}
}}}}function aW(f){if(a8){return
}var e=at[f+"Slider"];
_css(at.elements,{cursor:"pointer"});
_css(e,{cursor:"pointer"});
e.onmousedown=function(g){a2=f
};
e.onmouseup=function(g){g.stopPropagation();
aF(g.pageX)
};
e.onmousemove=function(h){if(a2=="time"){bg=true;
var g=h.pageX-bl[f+"Slider"].left-window.pageXOffset;
_css(at[a2+"SliderThumb"],{left:g})
}}
}function aF(g){bg=false;
var h;
if(a2=="time"){h=g-bl.timeSliderRail.left+window.pageXOffset;
var e=h/bl.timeSliderRail.width*aK;
if(e<0){e=0
}else{if(e>aK){e=aK-3
}}if(bd.jwGetState()==d.api.events.state.PAUSED||bd.jwGetState()==d.api.events.state.IDLE){bd.jwPlay()
}bd.jwSeek(e)
}else{if(a2=="volume"){h=g-bl.volumeSliderRail.left-window.pageXOffset;
var f=Math.round(h/bl.volumeSliderRail.width*100);
if(f<10){f=0
}else{if(f>100){f=100
}}if(bd.jwGetMute()){bd.jwSetMute(false)
}bd.jwSetVolume(f)
}}a2="none"
}function a3(g){if(_utils.exists(g.bufferPercent)){bh=g.bufferPercent
}if(bl.timeSliderRail){var e=bd.skin.getSkinElement("controlbar","timeSliderCapLeft");
var f=bl.timeSliderRail.width;
var h=isNaN(Math.round(f*bh/100))?0:Math.round(f*bh/100);
_css(at.timeSliderBuffer,{width:h,left:e?e.width:0})
}}function aC(e){if(e.mute){_hide(at.muteButton);
_show(at.unmuteButton);
_hide(at.volumeSliderProgress)
}else{_show(at.muteButton);
_hide(at.unmuteButton);
_show(at.volumeSliderProgress)
}}function a6(e){if(e.newstate==d.api.events.state.BUFFERING||e.newstate==d.api.events.state.PLAYING){_show(at.pauseButton);
_hide(at.playButton)
}else{_hide(at.pauseButton);
_show(at.playButton)
}a();
if(e.newstate==d.api.events.state.IDLE){_hide(at.timeSliderBuffer);
_hide(at.timeSliderProgress);
_hide(at.timeSliderThumb);
aE({id:bd.id,duration:bd.jwGetDuration(),position:0})
}else{_show(at.timeSliderBuffer);
if(e.newstate!=d.api.events.state.BUFFERING){_show(at.timeSliderProgress);
_show(at.timeSliderThumb)
}}}function az(e){a3({bufferPercent:0});
aE(_utils.extend(e,{position:0,duration:aK}))
}function aE(e){if(_utils.exists(e.position)){be=e.position
}var k=false;
if(_utils.exists(e.duration)&&e.duration!=aK){aK=e.duration;
k=true
}var g=(be===aK===0)?0:be/aK;
var m=bl.timeSliderRail;
if(m){var h=isNaN(Math.round(m.width*g))?0:Math.round(m.width*g);
var n=bd.skin.getSkinElement("controlbar","timeSliderCapLeft");
var f=h+(n?n.width:0);
if(at.timeSliderProgress){_css(at.timeSliderProgress,{width:h,left:n?n.width:0});
if(!bg){if(at.timeSliderThumb){at.timeSliderThumb.style.left=f+"px"
}}}}if(at.durationText){at.durationText.innerHTML=_utils.timeFormat(aK)
}if(at.elapsedText){var l=_utils.timeFormat(be);
at.elapsedText.innerHTML=l;
if(av!=l.length){k=true;
av=l.length
}}if(k){a1()
}}function ba(){var l=at.elements.childNodes;
var e,g;
for(var h=0;
h<l.length;
h++){var f=l[h].childNodes;
for(var k in f){if(isNaN(parseInt(k,10))){continue
}if(f[k].id.indexOf(aN.id+"_divider")===0&&g&&g.id.indexOf(aN.id+"_divider")===0&&f[k].style.backgroundImage==g.style.backgroundImage){f[k].style.display="none"
}else{if(f[k].id.indexOf(aN.id+"_divider")===0&&e&&e.style.display!="none"){f[k].style.display="block"
}}if(f[k].style.display!="none"){g=f[k]
}e=f[k]
}}}function aG(){if(bd.jwGetFullscreen()){_show(at.normalscreenButton);
_hide(at.fullscreenButton)
}else{_hide(at.normalscreenButton);
_show(at.fullscreenButton)
}if(bd.jwGetState()==d.api.events.state.BUFFERING||bd.jwGetState()==d.api.events.state.PLAYING){_show(at.pauseButton);
_hide(at.playButton)
}else{_hide(at.pauseButton);
_show(at.playButton)
}if(bd.jwGetMute()==true){_hide(at.muteButton);
_show(at.unmuteButton);
_hide(at.volumeSliderProgress)
}else{_show(at.muteButton);
_hide(at.unmuteButton);
_show(at.volumeSliderProgress)
}}function a1(){ba();
aG();
var n={width:bi};
var e={"float":"left",styleFloat:"left",cssFloat:"left"};
if(aR.position==d.html5.view.positions.OVER||bd.jwGetFullscreen()){n.left=aR.margin;
n.width-=2*aR.margin;
n.top=aZ-aD().height-aR.margin;
n.height=aD().height
}var l=bd.skin.getSkinElement("controlbar","capLeft");
var g=bd.skin.getSkinElement("controlbar","capRight");
e.width=n.width-(l?l.width:0)-(g?g.width:0);
var m=_utils.getBoundingClientRect(at.leftGroup).width;
var h=_utils.getBoundingClientRect(at.rightGroup).width;
var k=e.width-m-h-1;
var o=k;
var p=bd.skin.getSkinElement("controlbar","timeSliderCapLeft");
var f=bd.skin.getSkinElement("controlbar","timeSliderCapRight");
if(_utils.exists(p)){o-=p.width
}if(_utils.exists(f)){o-=f.width
}at.timeSlider.style.width=k+"px";
at.timeSliderRail.style.width=o+"px";
_css(aN,n);
_css(at.elements,e);
_css(at.background,e);
a7();
return n
}function bb(e){if(_utils.exists(at.volumeSliderRail)){var h=isNaN(e.volume/100)?1:e.volume/100;
var g=_utils.parseDimension(at.volumeSliderRail.style.width);
var l=isNaN(Math.round(g*h))?0:Math.round(g*h);
var m=_utils.parseDimension(at.volumeSliderRail.style.right);
var k=(!_utils.exists(bd.skin.getSkinElement("controlbar","volumeSliderCapLeft")))?0:bd.skin.getSkinElement("controlbar","volumeSliderCapLeft").width;
_css(at.volumeSliderProgress,{width:l,left:k});
if(at.volumeSliderThumb){var f=(l-Math.round(_utils.parseDimension(at.volumeSliderThumb.style.width)/2));
f=Math.min(Math.max(f,0),g-_utils.parseDimension(at.volumeSliderThumb.style.width));
_css(at.volumeSliderThumb,{left:f})
}if(_utils.exists(at.volumeSliderCapLeft)){_css(at.volumeSliderCapLeft,{left:0})
}}}function ar(){try{var e=(bd.id.indexOf("_instream")>0?bd.id.replace("_instream",""):bd.id);
aJ=document.getElementById(e);
aJ.addEventListener("mousemove",a)
}catch(f){_utils.log("Could not add mouse listeners to controlbar: "+f)
}}function a4(){ax();
ay();
a7();
a8=true;
aM();
aR.idlehide=(aR.idlehide.toString().toLowerCase()=="true");
if(aR.position==d.html5.view.positions.OVER&&aR.idlehide){aN.style.opacity=0;
ap=true
}else{aN.style.opacity=1;
setTimeout((function(){ap=true;
ao()
}),1)
}ar();
aI()
}a4();
return this
}
})(jwplayer);
(function(d){var e=["width","height","state","playlist","item","position","buffer","duration","volume","mute","fullscreen"];
var f=d.utils;
d.html5.controller=function(av,Y,aD,aB){var aw=av,ax=aD,aA=aB,ak=Y,W=true,ac=-1,ai=false,aF=false,T,ag=[],at=false;
var af=(f.exists(ax.config.debug)&&(ax.config.debug.toString().toLowerCase()=="console")),V=new d.html5.eventdispatcher(ak.id,af);
f.extend(this,V);
function X(g){if(at){V.sendEvent(g.type,g)
}else{ag.push(g)
}}function aq(k){if(!at){at=true;
V.sendEvent(d.api.events.JWPLAYER_READY,k);
if(d.utils.exists(window.playerReady)){playerReady(k)
}if(d.utils.exists(window[aD.config.playerReady])){window[aD.config.playerReady](k)
}while(ag.length>0){var g=ag.shift();
V.sendEvent(g.type,g)
}if(aD.config.autostart&&!d.utils.isIOS()){U()
}while(al.length>0){var h=al.shift();
ah(h.method,h.arguments)
}}}ax.addGlobalListener(X);
ax.addEventListener(d.api.events.JWPLAYER_MEDIA_BUFFER_FULL,function(){ax.getMedia().play()
});
ax.addEventListener(d.api.events.JWPLAYER_MEDIA_TIME,function(g){if(g.position>=ax.playlist[ax.item].start&&ac>=0){ax.playlist[ax.item].start=ac;
ac=-1
}});
ax.addEventListener(d.api.events.JWPLAYER_MEDIA_COMPLETE,function(g){setTimeout(ae,25)
});
ax.addEventListener(d.api.events.JWPLAYER_PLAYLIST_LOADED,U);
ax.addEventListener(d.api.events.JWPLAYER_FULLSCREEN,au);
function ad(){try{T=ad;
if(!ai){ai=true;
V.sendEvent(d.api.events.JWPLAYER_MEDIA_BEFOREPLAY);
ai=false;
if(aF){aF=false;
T=null;
return
}}an(ax.item);
if(ax.playlist[ax.item].levels[0].file.length>0){if(W||ax.state==d.api.events.state.IDLE){ax.getMedia().load(ax.playlist[ax.item]);
W=false
}else{if(ax.state==d.api.events.state.PAUSED){ax.getMedia().play()
}}}return true
}catch(g){V.sendEvent(d.api.events.JWPLAYER_ERROR,g);
T=null
}return false
}function aE(){try{if(ax.playlist[ax.item].levels[0].file.length>0){switch(ax.state){case d.api.events.state.PLAYING:case d.api.events.state.BUFFERING:if(ax.getMedia()){ax.getMedia().pause()
}break;
default:if(ai){aF=true
}}}return true
}catch(g){V.sendEvent(d.api.events.JWPLAYER_ERROR,g)
}return false
}function aj(h){try{if(ax.playlist[ax.item].levels[0].file.length>0){if(typeof h!="number"){h=parseFloat(h)
}switch(ax.state){case d.api.events.state.IDLE:if(ac<0){ac=ax.playlist[ax.item].start;
ax.playlist[ax.item].start=h
}if(!ai){ad()
}break;
case d.api.events.state.PLAYING:case d.api.events.state.PAUSED:case d.api.events.state.BUFFERING:ax.seek(h);
break
}}return true
}catch(g){V.sendEvent(d.api.events.JWPLAYER_ERROR,g)
}return false
}function am(h){T=null;
if(!f.exists(h)){h=true
}try{if((ax.state!=d.api.events.state.IDLE||h)&&ax.getMedia()){ax.getMedia().stop(h)
}if(ai){aF=true
}return true
}catch(g){V.sendEvent(d.api.events.JWPLAYER_ERROR,g)
}return false
}function az(){try{if(ax.playlist[ax.item].levels[0].file.length>0){if(ax.config.shuffle){an(a())
}else{if(ax.item+1==ax.playlist.length){an(0)
}else{an(ax.item+1)
}}}if(ax.state!=d.api.events.state.IDLE){var g=ax.state;
ax.state=d.api.events.state.IDLE;
V.sendEvent(d.api.events.JWPLAYER_PLAYER_STATE,{oldstate:g,newstate:d.api.events.state.IDLE})
}ad();
return true
}catch(h){V.sendEvent(d.api.events.JWPLAYER_ERROR,h)
}return false
}function aa(){try{if(ax.playlist[ax.item].levels[0].file.length>0){if(ax.config.shuffle){an(a())
}else{if(ax.item===0){an(ax.playlist.length-1)
}else{an(ax.item-1)
}}}if(ax.state!=d.api.events.state.IDLE){var g=ax.state;
ax.state=d.api.events.state.IDLE;
V.sendEvent(d.api.events.JWPLAYER_PLAYER_STATE,{oldstate:g,newstate:d.api.events.state.IDLE})
}ad();
return true
}catch(h){V.sendEvent(d.api.events.JWPLAYER_ERROR,h)
}return false
}function a(){var g=null;
if(ax.playlist.length>1){while(!f.exists(g)){g=Math.floor(Math.random()*ax.playlist.length);
if(g==ax.item){g=null
}}}else{g=0
}return g
}function ab(h){if(!ax.playlist||!ax.playlist[h]){return false
}try{if(ax.playlist[h].levels[0].file.length>0){var g=ax.state;
if(g!==d.api.events.state.IDLE){if(ax.playlist[ax.item]&&ax.playlist[ax.item].provider==ax.playlist[h].provider){am(false)
}else{am()
}}an(h);
ad()
}return true
}catch(k){V.sendEvent(d.api.events.JWPLAYER_ERROR,k)
}return false
}function an(g){if(!ax.playlist[g]){return
}ax.setActiveMediaProvider(ax.playlist[g]);
if(ax.item!=g){ax.item=g;
W=true;
V.sendEvent(d.api.events.JWPLAYER_PLAYLIST_ITEM,{index:g})
}}function aC(h){try{an(ax.item);
var g=ax.getMedia();
switch(typeof(h)){case"number":g.volume(h);
break;
case"string":g.volume(parseInt(h,10));
break
}ax.setVolume(h);
return true
}catch(k){V.sendEvent(d.api.events.JWPLAYER_ERROR,k)
}return false
}function ar(h){try{an(ax.item);
var g=ax.getMedia();
if(typeof h=="undefined"){g.mute(!ax.mute);
ax.setMute(!ax.mute)
}else{if(h.toString().toLowerCase()=="true"){g.mute(true);
ax.setMute(true)
}else{g.mute(false);
ax.setMute(false)
}}return true
}catch(k){V.sendEvent(d.api.events.JWPLAYER_ERROR,k)
}return false
}function Z(h,k){try{ax.width=h;
ax.height=k;
aA.resize(h,k);
V.sendEvent(d.api.events.JWPLAYER_RESIZE,{width:ax.width,height:ax.height});
return true
}catch(g){V.sendEvent(d.api.events.JWPLAYER_ERROR,g)
}return false
}function ao(h,g){try{if(typeof h=="undefined"){h=!ax.fullscreen
}if(typeof g=="undefined"){g=true
}if(h!=ax.fullscreen){ax.fullscreen=(h.toString().toLowerCase()=="true");
aA.fullscreen(ax.fullscreen);
if(g){V.sendEvent(d.api.events.JWPLAYER_FULLSCREEN,{fullscreen:ax.fullscreen})
}V.sendEvent(d.api.events.JWPLAYER_RESIZE,{width:ax.width,height:ax.height})
}return true
}catch(k){V.sendEvent(d.api.events.JWPLAYER_ERROR,k)
}return false
}function b(h){try{am();
if(ai){aF=false
}ax.loadPlaylist(h);
if(ax.playlist[ax.item].provider){an(ax.item);
if(ax.config.autostart.toString().toLowerCase()=="true"&&!f.isIOS()&&!ai){ad()
}return true
}else{return false
}}catch(g){V.sendEvent(d.api.events.JWPLAYER_ERROR,g)
}return false
}function U(g){if(!f.isIOS()){an(ax.item);
if(ax.config.autostart.toString().toLowerCase()=="true"&&!f.isIOS()){ad()
}}}function au(g){ao(g.fullscreen,false)
}function ap(){try{return ax.getMedia().detachMedia()
}catch(g){return null
}}function ay(){try{var h=ax.getMedia().attachMedia();
if(typeof T=="function"){T()
}}catch(g){return null
}}d.html5.controller.repeatoptions={LIST:"LIST",ALWAYS:"ALWAYS",SINGLE:"SINGLE",NONE:"NONE"};
function ae(){if(ax.state!=d.api.events.state.IDLE){return
}T=ae;
switch(ax.config.repeat.toUpperCase()){case d.html5.controller.repeatoptions.SINGLE:ad();
break;
case d.html5.controller.repeatoptions.ALWAYS:if(ax.item==ax.playlist.length-1&&!ax.config.shuffle){ab(0)
}else{az()
}break;
case d.html5.controller.repeatoptions.LIST:if(ax.item==ax.playlist.length-1&&!ax.config.shuffle){am();
an(0)
}else{az()
}break;
default:am();
break
}}var al=[];
function c(g){return function(){if(at){ah(g,arguments)
}else{al.push({method:g,arguments:arguments})
}}
}function ah(g,h){var k=[];
for(i=0;
i<h.length;
i++){k.push(h[i])
}g.apply(this,k)
}this.play=c(ad);
this.pause=c(aE);
this.seek=c(aj);
this.stop=c(am);
this.next=c(az);
this.prev=c(aa);
this.item=c(ab);
this.setVolume=c(aC);
this.setMute=c(ar);
this.resize=c(Z);
this.setFullscreen=c(ao);
this.load=c(b);
this.playerReady=aq;
this.detachMedia=ap;
this.attachMedia=ay;
this.beforePlay=function(){return ai
};
this.destroy=function(){if(ax.getMedia()){ax.getMedia().destroy()
}}
}
})(jwplayer);
(function(b){b.html5.defaultSkin=function(){this.text='<?xml version="1.0" ?><skin author="LongTail Video" name="Five" version="1.1"><components><component name="controlbar"><settings><setting name="margin" value="20"/><setting name="fontsize" value="11"/><setting name="fontcolor" value="0x000000"/></settings><layout><group position="left"><button name="play"/><divider name="divider"/><button name="prev"/><divider name="divider"/><button name="next"/><divider name="divider"/><text name="elapsed"/></group><group position="center"><slider name="time"/></group><group position="right"><text name="duration"/><divider name="divider"/><button name="blank"/><divider name="divider"/><button name="mute"/><slider name="volume"/><divider name="divider"/><button name="fullscreen"/></group></layout><elements><element name="background" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAIAAABvFaqvAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAElJREFUOI3t1LERACAMQlFgGvcfxNIhHMK4gsUvUviOmgtNsiAZkBSEKxKEnCYkkQrJn/YwbUNiSDDYRZaQRDaShv+oX9GBZEIuK+8hXVLs+/YAAAAASUVORK5CYII="/><element name="blankButton" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAYCAYAAAAyJzegAAAAFElEQVQYV2P8//8/AzpgHBUc7oIAGZdH0RjKN8EAAAAASUVORK5CYII="/><element name="capLeft" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAYCAYAAAA7zJfaAAAAQElEQVQIWz3LsRGAMADDQJ0XB5bMINABZ9GENGrszxhjT2WLSqxEJG2JQrTMdV2q5LpOAvyRaVmsi7WdeZ/7+AAaOTq7BVrfOQAAAABJRU5ErkJggg=="/><element name="capRight" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAYCAYAAAA7zJfaAAAAQElEQVQIWz3LsRGAMADDQJ0XB5bMINABZ9GENGrszxhjT2WLSqxEJG2JQrTMdV2q5LpOAvyRaVmsi7WdeZ/7+AAaOTq7BVrfOQAAAABJRU5ErkJggg=="/><element name="divider" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAYCAIAAAC0rgCNAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAADhJREFUCB0FwcENgEAAw7Aq+893g8APUILNOQcbFRktVGqUVFRkWNz3xTa2sUaLNUosKlRUvvf5AdbWOTtzmzyWAAAAAElFTkSuQmCC"/><element name="playButton" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAYCAYAAAAVibZIAAAANUlEQVR42u2RsQkAAAjD/NTTPaW6dXLrINJA1kBpGPMAjDWmOgp1HFQXx+b1KOefO4oxY57R73YnVYCQUCQAAAAASUVORK5CYII="/><element name="pauseButton" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAYCAYAAAAVibZIAAAAIUlEQVQ4jWNgGAWjYOiD/0gYG3/U0FFDB4Oho2AUDAYAAEwiL9HrpdMVAAAAAElFTkSuQmCC"/><element name="prevButton" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAYCAYAAAAVibZIAAAAQklEQVQ4y2NgGAWjYOiD/1AMA/JAfB5NjCJD/YH4PRaLyDa0H4lNNUP/DxlD59PCUBCIp3ZEwYA+NZLUKBgFgwEAAN+HLX9sB8u8AAAAAElFTkSuQmCC"/><element name="nextButton" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAYCAYAAAAVibZIAAAAQElEQVQ4y2NgGAWjYOiD/0B8Hojl0cT+U2ooCL8HYn9qGwrD/bQw9P+QMXQ+tSMqnpoRBUpS+tRMUqNgFAwGAADxZy1/mHvFnAAAAABJRU5ErkJggg=="/><element name="timeSliderRail" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAOElEQVRIDe3BwQkAIRADwAhhw/nU/kWwUK+KPITMABFh19Y+F0acY8CJvX9wYpXgRElwolSIiMf9ZWEDhtwurFsAAAAASUVORK5CYII="/><element name="timeSliderBuffer" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAN0lEQVRIDe3BwQkAMQwDMBcc55mRe9zi7RR+FCwBEWG39vcfGHFm4MTuhhMlwYlVBSdKhYh43AW/LQMKm1spzwAAAABJRU5ErkJggg=="/><element name="timeSliderProgress" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAIElEQVRIiWNgGAWjYBTQBfynMR61YCRYMApGwSigMQAAiVWPcbq6UkIAAAAASUVORK5CYII="/><element name="timeSliderThumb" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAAYCAYAAAA/OUfnAAAAO0lEQVQYlWP4//8/Awwz0JgDBP/BeN6Cxf/hnI2btiI4u/fsQ3AOHjqK4Jw4eQbBOX/hEoKDYjSd/AMA4cS4mfLsorgAAAAASUVORK5CYII="/><element name="muteButton" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAYCAYAAADKx8xXAAAAJklEQVQ4y2NgGAUjDcwH4v/kaPxPikZkxcNVI9mBQ5XoGAWDFwAAsKAXKQQmfbUAAAAASUVORK5CYII="/><element name="unmuteButton" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAYCAYAAADKx8xXAAAAMklEQVQ4y2NgGAWDHPyntub5xBr6Hwv/Pzk2/yfVG/8psRFE25Oq8T+tQnsIaB4FVAcAi2YVysVY52AAAAAASUVORK5CYII="/><element name="volumeSliderRail" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYAgMAAACdGdVrAAAACVBMVEUAAACmpqampqbBXAu8AAAAAnRSTlMAgJsrThgAAAArSURBVAhbY2AgErBAyA4I2QEhOyBkB4TsYOhAoaCCUCUwDTDtMMNgRuMHAFB5FoGH5T0UAAAAAElFTkSuQmCC"/><element name="volumeSliderProgress" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYAgMAAACdGdVrAAAACVBMVEUAAAAAAAAAAACDY+nAAAAAAnRSTlMAgJsrThgAAAArSURBVAhbY2AgErBAyA4I2QEhOyBkB4TsYOhAoaCCUCUwDTDtMMNgRuMHAFB5FoGH5T0UAAAAAElFTkSuQmCC"/><element name="volumeSliderCapRight" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAYCAYAAAAyJzegAAAAFElEQVQYV2P8//8/AzpgHBUc7oIAGZdH0RjKN8EAAAAASUVORK5CYII="/><element name="fullscreenButton" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAQklEQVRIiWNgGAWjYMiD/0iYFDmSLbDHImdPLQtgBpEiR7Zl2NijAA5oEkT/0Whi5UiyAJ8BVMsHNMtoo2AUDAIAAGdcIN3IDNXoAAAAAElFTkSuQmCC"/><element name="normalscreenButton" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAP0lEQVRIx2NgGAWjYMiD/1RSQ5QB/wmIUWzJfzx8qhj+n4DYCAY0DyJ7PBbYU8sHMEvwiZFtODXUjIJRMJgBACpWIN2ZxdPTAAAAAElFTkSuQmCC"/></elements></component><component name="display"><elements><element name="background" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyAQMAAAAk8RryAAAABlBMVEUAAAAAAAClZ7nPAAAAAnRSTlOZpuml+rYAAAASSURBVBhXY2AYJuA/GBwY6jQAyDyoK8QcL4QAAAAASUVORK5CYII="/><element name="playIcon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAiUlEQVR42u3XSw2AMBREURwgAQlIQAISKgUpSEFKJeCg5b0E0kWBTVcD9ySTsL0Jn9IBAAAA+K2UUrBlW/Rr5ZDoIeeuoFkxJD9ss03aIXXQqB9SttoG7ZA6qNcOKdttiwcJh9RB+iFl4SshkRBuLR72+9cvH0SOKI2HRo7x/Fi1/uoCAAAAwLsD8ki99IlO2dQAAAAASUVORK5CYII="/><element name="muteIcon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAVUlEQVR42u3WMQrAIAxAUW/g/SdvGmvpoOBeSHgPsjj5QTANAACARCJilIhYM0tEvJM+Ik3Id9E957kQIb+F3OdCPC0hPkQriqWx9hp/x/QGAABQyAPLB22VGrpLDgAAAABJRU5ErkJggg=="/><element name="errorIcon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAA/0lEQVR42u2U0QmEMBAF7cASLMESUoIlpARLSCkpwRJSgiWkhOvAXD4WsgRkyaG5DbyB+Yvg8KITAAAAAAAYk+u61mwk15EjPtlEfihmqIiZR1Qx80ghjgdUuiHXGHSVsoag0x6x8DUoyjD5KovmEJ9NTDMRPIT0mtdIUkjlonuNohO+Ha99DTmkuGgKCTcvebAzx82ZoCWC3/3aIMWSRucaxcjORSFY4xpFdjYJGp1rFGcyCYZ/RVh6AUnfcNZ2zih3/mGj1jVCdiNDwyrq1rA/xMdeEXvDVdnYc1vDc3uPkDObXrlaxbNHSOohQhr/WOeLEWfWTgAAAAAAADzNF9sHJ7PJ57MlAAAAAElFTkSuQmCC"/><element name="bufferIcon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAACBklEQVR42u3Zv0sCYRzH8USTzOsHHEWGkC1HgaDgkktGDjUYtDQ01RDSljQ1BLU02+rk1NTm2NLq4Nx/0L/h9fnCd3j4cnZe1/U8xiO8h3uurufF0/3COd/3/0UWYiEWYiEWYiGJQ+J8xuPxKhXjEMZANinjIZhkGuVRNioE4wVURo4JkHm0xKWmhRAc1bh1EyCUw5BcBIjHiApKa4CErko6DEJwuRo6IRKzyJD8FJAyI3Zp2zRImiBcRhlfo5RtlxCcE3CcDNpGrhYIT2IhAJKilO0VRmzJ32fAMTpBTS0QMfGwlcuKMRftE0DJ0wCJdcOsCkBdXP3Mh9CEFUBTPS9mDZJBG6io4aqVzMdCokCw9H3kT6j/C/9iDdSeUMNC7DkyyxAs/Rk6Qss8FPWRZgdVtUH4DjxEn1zxh+/zj1wHlf4MQhNGrwqA6sY40U8JonRJwEQh+AO3AvCG6gHv4U7IY4krxkroWoAOkoQMGfCBrgIm+YBGqPENpIJ66CJg3x66Y0gnSUidAEEnNr9jjLiWMn5DiWP0OC/oAsCgkq43xBdGDMQr7YASP/vEkHvdl1+JOCcEV5sC4hGEOzTlPuKgd0b0xD4JkRcOgnRRTjdErkYhAsQVq6IdUuPJtmk7BCL3t/h88cx91pKQkI/pkDx6pmYTIjEoxiHsN1YWYiEWYiEWknhflZ5IErA5nr8AAAAASUVORK5CYII="/></elements></component><component name="dock"><settings><setting name="fontcolor" value="0xffffff"/></settings><elements><element name="button" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyAQMAAAAk8RryAAAABlBMVEUAAAAAAAClZ7nPAAAAAnRSTlOZpuml+rYAAAASSURBVBhXY2AYJuA/GBwY6jQAyDyoK8QcL4QAAAAASUVORK5CYII="/></elements></component><component name="playlist"><settings><setting name="backgroundcolor" value="0xe8e8e8"/></settings><elements><element name="item" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAIAAAC1nk4lAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAHBJREFUaN7t2MENwCAMBEEe9N8wSKYC/D8YV7CyJoRkVtVImxkZPQInMxoP0XiIxkM0HsGbjjSNBx544IEHHnjggUe/6UQeey0PIh7XTftGxKPj4eXCtLsHHh+ZxkO0Iw8PR55Ni8ZD9Hu/EAoP0dc5RRg9qeRjVF8AAAAASUVORK5CYII="/><element name="sliderCapTop" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAHCAYAAADnCQYGAAAAFUlEQVQokWP8//8/A7UB46ihI9hQAKt6FPPXhVGHAAAAAElFTkSuQmCC"/><element name="sliderRail" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAUCAYAAABiS3YzAAAAKElEQVQ4y2P4//8/Az68bNmy/+iYkB6GUUNHDR01dNTQUUNHDaXcUABUDOKhcxnsSwAAAABJRU5ErkJggg=="/><element name="sliderThumb" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAUCAYAAABiS3YzAAAAJUlEQVQ4T2P4//8/Ay4MBP9xYbz6Rg0dNXTU0FFDRw0dNZRyQwHH4NBa7GJsXAAAAABJRU5ErkJggg=="/><element name="sliderCapBottom" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAHCAYAAADnCQYGAAAAFUlEQVQokWP8//8/A7UB46ihI9hQAKt6FPPXhVGHAAAAAElFTkSuQmCC"/></elements></component></components></skin>';
this.xml=null;
if(window.DOMParser){parser=new DOMParser();
this.xml=parser.parseFromString(this.text,"text/xml")
}else{this.xml=new ActiveXObject("Microsoft.XMLDOM");
this.xml.async="false";
this.xml.loadXML(this.text)
}return this
}
})(jwplayer);
(function(b){_utils=b.utils;
_css=_utils.css;
_hide=function(a){_css(a,{display:"none"})
};
_show=function(a){_css(a,{display:"block"})
};
b.html5.display=function(aL,ak){var aM={icons:true,showmute:false};
var a=_utils.extend({},aM,ak);
var aN=aL;
var Y={};
var aQ;
var az;
var aw;
var ab;
var aB;
var ai;
var aq;
var ah=!_utils.exists(aN.skin.getComponentSettings("display").bufferrotation)?15:parseInt(aN.skin.getComponentSettings("display").bufferrotation,10);
var aD=!_utils.exists(aN.skin.getComponentSettings("display").bufferinterval)?100:parseInt(aN.skin.getComponentSettings("display").bufferinterval,10);
var ar=-1;
var aA=b.api.events.state.IDLE;
var ag=true;
var aR;
var at=false,Z=true;
var aG="";
var aO=false;
var aH=false;
var aJ;
var ax,ad;
var aj=new b.html5.eventdispatcher();
_utils.extend(this,aj);
var an={display:{style:{cursor:"pointer",top:0,left:0,overflow:"hidden"},click:aI},display_icon:{style:{cursor:"pointer",position:"absolute",top:((aN.skin.getSkinElement("display","background").height-aN.skin.getSkinElement("display","playIcon").height)/2),left:((aN.skin.getSkinElement("display","background").width-aN.skin.getSkinElement("display","playIcon").width)/2),border:0,margin:0,padding:0,zIndex:3,display:"none"}},display_iconBackground:{style:{cursor:"pointer",position:"absolute",top:((az-aN.skin.getSkinElement("display","background").height)/2),left:((aQ-aN.skin.getSkinElement("display","background").width)/2),border:0,backgroundImage:(["url(",aN.skin.getSkinElement("display","background").src,")"]).join(""),width:aN.skin.getSkinElement("display","background").width,height:aN.skin.getSkinElement("display","background").height,margin:0,padding:0,zIndex:2,display:"none"}},display_image:{style:{display:"none",width:aQ,height:az,position:"absolute",cursor:"pointer",left:0,top:0,margin:0,padding:0,textDecoration:"none",zIndex:1}},display_text:{style:{zIndex:4,position:"relative",opacity:0.8,backgroundColor:parseInt("000000",16),color:parseInt("ffffff",16),textAlign:"center",fontFamily:"Arial,sans-serif",padding:"0 5px",fontSize:14}}};
aN.jwAddEventListener(b.api.events.JWPLAYER_PLAYER_STATE,aF);
aN.jwAddEventListener(b.api.events.JWPLAYER_MEDIA_MUTE,aF);
aN.jwAddEventListener(b.api.events.JWPLAYER_PLAYLIST_LOADED,af);
aN.jwAddEventListener(b.api.events.JWPLAYER_PLAYLIST_ITEM,aF);
aN.jwAddEventListener(b.api.events.JWPLAYER_ERROR,aE);
ae();
function ae(){Y.display=ao("div","display");
Y.display_text=ao("div","display_text");
Y.display.appendChild(Y.display_text);
Y.display_image=ao("img","display_image");
Y.display_image.onerror=function(c){_hide(Y.display_image)
};
Y.display_image.onload=au;
Y.display_icon=ao("div","display_icon");
Y.display_iconBackground=ao("div","display_iconBackground");
Y.display.appendChild(Y.display_image);
Y.display_iconBackground.appendChild(Y.display_icon);
Y.display.appendChild(Y.display_iconBackground);
aP();
setTimeout((function(){aH=true;
if(a.icons.toString()=="true"){al()
}}),1)
}this.getDisplayElement=function(){return Y.display
};
this.resize=function(c,d){if(aN.jwGetFullscreen()&&_utils.isMobile()){return
}_css(Y.display,{width:c,height:d});
_css(Y.display_text,{width:(c-10),top:((d-_utils.getBoundingClientRect(Y.display_text).height)/2)});
_css(Y.display_iconBackground,{top:((d-aN.skin.getSkinElement("display","background").height)/2),left:((c-aN.skin.getSkinElement("display","background").width)/2)});
if(aQ!=c||az!=d){aQ=c;
az=d;
aR=undefined;
al()
}if(!aN.jwGetFullscreen()){ax=c;
ad=d
}aS();
aF({})
};
this.show=function(){if(aO){aO=false;
aC(aN.jwGetState())
}};
this.hide=function(){if(!aO){ap();
aO=true
}};
function au(c){aw=Y.display_image.naturalWidth;
ab=Y.display_image.naturalHeight;
aS();
if(aN.jwGetState()==b.api.events.state.IDLE||aN.jwGetPlaylist()[aN.jwGetPlaylistIndex()].provider=="sound"){_css(Y.display_image,{display:"block",opacity:0});
_utils.fadeTo(Y.display_image,1,0.1)
}at=false
}function aS(){if(aN.jwGetFullscreen()&&aN.jwGetStretching()==b.utils.stretching.EXACTFIT){var c=document.createElement("div");
_utils.stretch(b.utils.stretching.UNIFORM,c,aQ,az,ax,ad);
_utils.stretch(b.utils.stretching.EXACTFIT,Y.display_image,_utils.parseDimension(c.style.width),_utils.parseDimension(c.style.height),aw,ab);
_css(Y.display_image,{left:c.style.left,top:c.style.top})
}else{_utils.stretch(aN.jwGetStretching(),Y.display_image,aQ,az,aw,ab)
}}function ao(e,d){var c=document.createElement(e);
c.id=aN.id+"_jwplayer_"+d;
_css(c,an[d].style);
return c
}function aP(){for(var c in Y){if(_utils.exists(an[c].click)){Y[c].onclick=an[c].click
}}}function aI(c){if(typeof c.preventDefault!="undefined"){c.preventDefault()
}else{c.returnValue=false
}if(typeof aJ=="function"){aJ(c);
return
}else{if(aN.jwGetState()!=b.api.events.state.PLAYING){aN.jwPlay()
}else{aN.jwPause()
}}}function aa(c){if(aq){ap();
return
}Y.display_icon.style.backgroundImage=(["url(",aN.skin.getSkinElement("display",c).src,")"]).join("");
_css(Y.display_icon,{width:aN.skin.getSkinElement("display",c).width,height:aN.skin.getSkinElement("display",c).height,top:(aN.skin.getSkinElement("display","background").height-aN.skin.getSkinElement("display",c).height)/2,left:(aN.skin.getSkinElement("display","background").width-aN.skin.getSkinElement("display",c).width)/2});
aT();
if(_utils.exists(aN.skin.getSkinElement("display",c+"Over"))){Y.display_icon.onmouseover=function(d){Y.display_icon.style.backgroundImage=["url(",aN.skin.getSkinElement("display",c+"Over").src,")"].join("")
};
Y.display_icon.onmouseout=function(d){Y.display_icon.style.backgroundImage=["url(",aN.skin.getSkinElement("display",c).src,")"].join("")
}
}else{Y.display_icon.onmouseover=null;
Y.display_icon.onmouseout=null
}}function ap(){if(a.icons.toString()=="true"){_hide(Y.display_icon);
_hide(Y.display_iconBackground);
ac()
}}function aT(){if(!aO&&a.icons.toString()=="true"){_show(Y.display_icon);
_show(Y.display_iconBackground);
al()
}}function aE(c){aq=true;
ap();
Y.display_text.innerHTML=c.message;
_show(Y.display_text);
Y.display_text.style.top=((az-_utils.getBoundingClientRect(Y.display_text).height)/2)+"px"
}function am(){Z=false;
Y.display_image.style.display="none"
}function af(){aA=""
}function aF(d){if((d.type==b.api.events.JWPLAYER_PLAYER_STATE||d.type==b.api.events.JWPLAYER_PLAYLIST_ITEM)&&aq){aq=false;
_hide(Y.display_text)
}var c=aN.jwGetState();
if(c==aA){return
}aA=c;
if(ar>=0){clearTimeout(ar)
}if(ag||aN.jwGetState()==b.api.events.state.PLAYING||aN.jwGetState()==b.api.events.state.PAUSED){aC(aN.jwGetState())
}else{ar=setTimeout(aK(aN.jwGetState()),500)
}}function aK(c){return(function(){aC(c)
})
}function aC(c){if(_utils.exists(ai)){clearInterval(ai);
ai=null;
_utils.animations.rotate(Y.display_icon,0)
}switch(c){case b.api.events.state.BUFFERING:if(_utils.isIPod()){am();
ap()
}else{if(aN.jwGetPlaylist()[aN.jwGetPlaylistIndex()].provider=="sound"){ay()
}aB=0;
ai=setInterval(function(){aB+=ah;
_utils.animations.rotate(Y.display_icon,aB%360)
},aD);
aa("bufferIcon");
ag=true
}break;
case b.api.events.state.PAUSED:if(!_utils.isIPod()){if(aN.jwGetPlaylist()[aN.jwGetPlaylistIndex()].provider!="sound"){_css(Y.display_image,{background:"transparent no-repeat center center"})
}aa("playIcon");
ag=true
}break;
case b.api.events.state.IDLE:if(aN.jwGetPlaylist()[aN.jwGetPlaylistIndex()]&&aN.jwGetPlaylist()[aN.jwGetPlaylistIndex()].image){ay()
}else{am()
}aa("playIcon");
ag=true;
break;
default:if(aN.jwGetPlaylist()[aN.jwGetPlaylistIndex()]&&aN.jwGetPlaylist()[aN.jwGetPlaylistIndex()].provider=="sound"){if(_utils.isIPod()){am();
ag=false
}else{ay()
}}else{am();
ag=false
}if(aN.jwGetMute()&&a.showmute){aa("muteIcon")
}else{ap()
}break
}ar=-1
}function ay(){if(aN.jwGetPlaylist()[aN.jwGetPlaylistIndex()]){var c=aN.jwGetPlaylist()[aN.jwGetPlaylistIndex()].image;
if(c){if(c!=aG){aG=c;
at=true;
Y.display_image.src=_utils.getAbsolutePath(c)
}else{if(!(at||Z)){Z=true;
Y.display_image.style.opacity=0;
Y.display_image.style.display="block";
_utils.fadeTo(Y.display_image,1,0.1)
}}}}}function av(c){return function(){if(!aH){return
}if(!aO&&aR!=c){aR=c;
aj.sendEvent(c,{component:"display",boundingRect:_utils.getDimensions(Y.display_iconBackground)})
}}
}var al=av(b.api.events.JWPLAYER_COMPONENT_SHOW);
var ac=av(b.api.events.JWPLAYER_COMPONENT_HIDE);
this.setAlternateClickHandler=function(c){aJ=c
};
this.revertAlternateClickHandler=function(){aJ=undefined
};
return this
}
})(jwplayer);
(function(e){var f=e.utils;
var d=f.css;
e.html5.dock=function(H,P){function c(){return{align:e.html5.view.positions.RIGHT}
}var X=f.extend({},c(),P);
if(X.align=="FALSE"){return
}var ab={};
var V=[];
var aa;
var L;
var ae=false;
var Q=false;
var ad={x:0,y:0,width:0,height:0};
var a;
var W;
var b;
var Y=new e.html5.eventdispatcher();
f.extend(this,Y);
var R=document.createElement("div");
R.id=H.id+"_jwplayer_dock";
R.style.opacity=1;
U();
H.jwAddEventListener(e.api.events.JWPLAYER_PLAYER_STATE,T);
this.getDisplayElement=function(){return R
};
this.setButton=function(g,l,k,h){if(!l&&ab[g]){f.arrays.remove(V,g);
R.removeChild(ab[g].div);
delete ab[g]
}else{if(l){if(!ab[g]){ab[g]={}
}ab[g].handler=l;
ab[g].outGraphic=k;
ab[g].overGraphic=h;
if(!ab[g].div){V.push(g);
ab[g].div=document.createElement("div");
ab[g].div.style.position="absolute";
R.appendChild(ab[g].div);
ab[g].div.appendChild(document.createElement("div"));
ab[g].div.childNodes[0].style.position="relative";
ab[g].div.childNodes[0].style.width="100%";
ab[g].div.childNodes[0].style.height="100%";
ab[g].div.childNodes[0].style.zIndex=10;
ab[g].div.childNodes[0].style.cursor="pointer";
ab[g].div.appendChild(document.createElement("img"));
ab[g].div.childNodes[1].style.position="absolute";
ab[g].div.childNodes[1].style.left=0;
ab[g].div.childNodes[1].style.top=0;
if(H.skin.getSkinElement("dock","button")){ab[g].div.childNodes[1].src=H.skin.getSkinElement("dock","button").src
}ab[g].div.childNodes[1].style.zIndex=9;
ab[g].div.childNodes[1].style.cursor="pointer";
ab[g].div.onmouseover=function(){if(ab[g].overGraphic){ab[g].div.childNodes[0].style.background=ac(ab[g].overGraphic)
}if(H.skin.getSkinElement("dock","buttonOver")){ab[g].div.childNodes[1].src=H.skin.getSkinElement("dock","buttonOver").src
}};
ab[g].div.onmouseout=function(){if(ab[g].outGraphic){ab[g].div.childNodes[0].style.background=ac(ab[g].outGraphic)
}if(H.skin.getSkinElement("dock","button")){ab[g].div.childNodes[1].src=H.skin.getSkinElement("dock","button").src
}};
if(H.skin.getSkinElement("dock","button")){ab[g].div.childNodes[1].src=H.skin.getSkinElement("dock","button").src
}}if(ab[g].outGraphic){ab[g].div.childNodes[0].style.background=ac(ab[g].outGraphic)
}else{if(ab[g].overGraphic){ab[g].div.childNodes[0].style.background=ac(ab[g].overGraphic)
}}if(l){ab[g].div.onclick=function(m){m.preventDefault();
e(H.id).callback(g);
if(ab[g].overGraphic){ab[g].div.childNodes[0].style.background=ac(ab[g].overGraphic)
}if(H.skin.getSkinElement("dock","button")){ab[g].div.childNodes[1].src=H.skin.getSkinElement("dock","button").src
}}
}}}Z(aa,L)
};
function ac(g){return"url("+g+") no-repeat center center"
}function N(g){}function Z(v,h){U();
if(V.length>0){var u=10;
var k=u;
var n=-1;
var m=H.skin.getSkinElement("dock","button").height;
var o=H.skin.getSkinElement("dock","button").width;
var q=v-o-u;
var l,r;
if(X.align==e.html5.view.positions.LEFT){n=1;
q=u
}for(var t=0;
t<V.length;
t++){var g=Math.floor(k/h);
if((k+m+u)>((g+1)*h)){k=((g+1)*h)+u;
g=Math.floor(k/h)
}var s=ab[V[t]].div;
s.style.top=(k%h)+"px";
s.style.left=(q+(H.skin.getSkinElement("dock","button").width+u)*g*n)+"px";
var p={x:f.parseDimension(s.style.left),y:f.parseDimension(s.style.top),width:o,height:m};
if(!l||(p.x<=l.x&&p.y<=l.y)){l=p
}if(!r||(p.x>=r.x&&p.y>=r.y)){r=p
}s.style.width=o+"px";
s.style.height=m+"px";
k+=H.skin.getSkinElement("dock","button").height+u
}ad={x:l.x,y:l.y,width:r.x-l.x+r.width,height:l.y-r.y+r.height}
}if(Q!=H.jwGetFullscreen()||aa!=v||L!=h){aa=v;
L=h;
Q=H.jwGetFullscreen();
a=undefined;
setTimeout(O,1)
}}function ag(g){return function(){if(!ae&&a!=g&&V.length>0){a=g;
Y.sendEvent(g,{component:"dock",boundingRect:ad})
}}
}function T(g){if(f.isMobile()){if(g.newstate==e.api.events.state.IDLE){I()
}else{af()
}}else{S()
}}function S(g){if(ae){return
}clearTimeout(b);
if(P.position==e.html5.view.positions.OVER||H.jwGetFullscreen()){switch(H.jwGetState()){case e.api.events.state.PAUSED:case e.api.events.state.IDLE:if(R&&R.style.opacity<1&&(!P.idlehide||f.exists(g))){M()
}if(P.idlehide){b=setTimeout(function(){K()
},2000)
}break;
default:if(f.exists(g)){M()
}b=setTimeout(function(){K()
},2000);
break
}}else{M()
}}var O=ag(e.api.events.JWPLAYER_COMPONENT_SHOW);
var J=ag(e.api.events.JWPLAYER_COMPONENT_HIDE);
this.resize=Z;
var I=function(){d(R,{display:"block"});
if(ae){ae=false;
O()
}};
var af=function(){d(R,{display:"none"});
if(!ae){J();
ae=true
}};
function K(){if(!ae){J();
if(R.style.opacity==1){f.cancelAnimation(R);
f.fadeTo(R,0,0.1,1,0)
}}}function M(){if(!ae){O();
if(R.style.opacity==0){f.cancelAnimation(R);
f.fadeTo(R,1,0.1,0,0)
}}}function U(){try{W=document.getElementById(H.id);
W.addEventListener("mousemove",S)
}catch(g){f.log("Could not add mouse listeners to dock: "+g)
}}this.hide=af;
this.show=I;
return this
}
})(jwplayer);
(function(b){b.html5.eventdispatcher=function(e,a){var f=new b.events.eventdispatcher(a);
b.utils.extend(this,f);
this.sendEvent=function(d,c){if(!b.utils.exists(c)){c={}
}b.utils.extend(c,{id:e,version:b.version,type:d});
f.sendEvent(d,c)
}
}
})(jwplayer);
(function(d){var c=d.utils;
d.html5.instream=function(K,af,M,a){var U={controlbarseekable:"always",controlbarpausable:true,controlbarstoppable:true,playlistclickable:true};
var Q,ac,X=K,T=af,ai=M,O=a,Y,N,ad,P,am,al,ak,ag,aa,aj=false,ah,an,ae=this;
this.load=function(g,f){ao();
aj=true;
ac=c.extend(U,f);
Q=d.html5.playlistitem(g);
S();
an=document.createElement("div");
an.id=ae.id+"_instream_container";
O.detachMedia();
Y=ak.getDisplayElement();
al=T.playlist[T.item];
am=X.jwGetState();
if(am==d.api.events.state.BUFFERING||am==d.api.events.state.PLAYING){Y.pause()
}N=Y.src?Y.src:Y.currentSrc;
ad=Y.innerHTML;
P=Y.currentTime;
aa=new d.html5.display(ae,c.extend({},T.plugins.config.display));
aa.setAlternateClickHandler(function(h){if(_fakemodel.state==d.api.events.state.PAUSED){ae.jwInstreamPlay()
}else{V(d.api.events.JWPLAYER_INSTREAM_CLICK,h)
}});
an.appendChild(aa.getDisplayElement());
if(!c.isMobile()){ag=new d.html5.controlbar(ae,c.extend({},T.plugins.config.controlbar,{}));
if(T.plugins.config.controlbar.position==d.html5.view.positions.OVER){an.appendChild(ag.getDisplayElement())
}else{var e=T.plugins.object.controlbar.getDisplayElement().parentNode;
e.appendChild(ag.getDisplayElement())
}}ai.setupInstream(an,Y);
ab();
ak.load(Q)
};
this.jwInstreamDestroy=function(f){if(!aj){return
}aj=false;
if(am!=d.api.events.state.IDLE){ak.load(al,false);
ak.stop(false)
}else{ak.stop(true)
}ak.detachMedia();
ai.destroyInstream();
if(ag){try{ag.getDisplayElement().parentNode.removeChild(ag.getDisplayElement())
}catch(e){}}V(d.api.events.JWPLAYER_INSTREAM_DESTROYED,{reason:(f?"complete":"destroyed")},true);
O.attachMedia();
if(am==d.api.events.state.BUFFERING||am==d.api.events.state.PLAYING){Y.play();
if(T.playlist[T.item]==al){T.getMedia().seek(P)
}}return
};
this.jwInstreamAddEventListener=function(f,e){ah.addEventListener(f,e)
};
this.jwInstreamRemoveEventListener=function(f,e){ah.removeEventListener(f,e)
};
this.jwInstreamPlay=function(){if(!aj){return
}ak.play(true)
};
this.jwInstreamPause=function(){if(!aj){return
}ak.pause(true)
};
this.jwInstreamSeek=function(e){if(!aj){return
}ak.seek(e)
};
this.jwInstreamGetState=function(){if(!aj){return undefined
}return _fakemodel.state
};
this.jwInstreamGetPosition=function(){if(!aj){return undefined
}return _fakemodel.position
};
this.jwInstreamGetDuration=function(){if(!aj){return undefined
}return _fakemodel.duration
};
this.playlistClickable=function(){return(!aj||ac.playlistclickable.toString().toLowerCase()=="true")
};
function W(){_fakemodel=new d.html5.model(this,T.getMedia()?T.getMedia().getDisplayElement():T.container,T);
ah=new d.html5.eventdispatcher();
X.jwAddEventListener(d.api.events.JWPLAYER_RESIZE,ab);
X.jwAddEventListener(d.api.events.JWPLAYER_FULLSCREEN,ab)
}function ao(){_fakemodel.setMute(T.mute);
_fakemodel.setVolume(T.volume)
}function S(){if(!ak){ak=new d.html5.mediavideo(_fakemodel,T.getMedia()?T.getMedia().getDisplayElement():T.container);
ak.addGlobalListener(L);
ak.addEventListener(d.api.events.JWPLAYER_MEDIA_META,b);
ak.addEventListener(d.api.events.JWPLAYER_MEDIA_COMPLETE,R);
ak.addEventListener(d.api.events.JWPLAYER_MEDIA_BUFFER_FULL,Z)
}ak.attachMedia()
}function L(e){if(aj){V(e.type,e)
}}function Z(e){if(aj){ak.play()
}}function R(e){if(aj){setTimeout(function(){ae.jwInstreamDestroy(true)
},10)
}}function b(e){if(e.metadata.width&&e.metadata.height){ai.resizeMedia()
}}function V(f,e,g){if(aj||g){ah.sendEvent(f,e)
}}function ab(){var f=T.plugins.object.display.getDisplayElement().style;
if(ag){var e=T.plugins.object.controlbar.getDisplayElement().style;
ag.resize(c.parseDimension(f.width),c.parseDimension(f.height));
_css(ag.getDisplayElement(),c.extend({},e,{zIndex:1001,opacity:1}))
}if(aa){aa.resize(c.parseDimension(f.width),c.parseDimension(f.height));
_css(aa.getDisplayElement(),c.extend({},f,{zIndex:1000}))
}if(ai){ai.resizeMedia()
}}this.jwPlay=function(e){if(ac.controlbarpausable.toString().toLowerCase()=="true"){this.jwInstreamPlay()
}};
this.jwPause=function(e){if(ac.controlbarpausable.toString().toLowerCase()=="true"){this.jwInstreamPause()
}};
this.jwStop=function(){if(ac.controlbarstoppable.toString().toLowerCase()=="true"){this.jwInstreamDestroy();
X.jwStop()
}};
this.jwSeek=function(e){switch(ac.controlbarseekable.toLowerCase()){case"always":this.jwInstreamSeek(e);
break;
case"backwards":if(_fakemodel.position>e){this.jwInstreamSeek(e)
}break
}};
this.jwGetPosition=function(){};
this.jwGetDuration=function(){};
this.jwGetWidth=X.jwGetWidth;
this.jwGetHeight=X.jwGetHeight;
this.jwGetFullscreen=X.jwGetFullscreen;
this.jwSetFullscreen=X.jwSetFullscreen;
this.jwGetVolume=function(){return T.volume
};
this.jwSetVolume=function(e){ak.volume(e);
X.jwSetVolume(e)
};
this.jwGetMute=function(){return T.mute
};
this.jwSetMute=function(e){ak.mute(e);
X.jwSetMute(e)
};
this.jwGetState=function(){return _fakemodel.state
};
this.jwGetPlaylist=function(){return[Q]
};
this.jwGetPlaylistIndex=function(){return 0
};
this.jwGetStretching=function(){return T.config.stretching
};
this.jwAddEventListener=function(e,f){ah.addEventListener(e,f)
};
this.jwRemoveEventListener=function(e,f){ah.removeEventListener(e,f)
};
this.skin=X.skin;
this.id=X.id+"_instream";
W();
return this
}
})(jwplayer);
(function(d){var c={prefix:"",file:"",link:"",linktarget:"_top",margin:8,out:0.5,over:1,timeout:5,hide:true,position:"bottom-left"};
_css=d.utils.css;
d.html5.logo=function(A,w){var x=A;
var a;
var J;
var b;
var F=false;
G();
function G(){z();
x.jwAddEventListener(d.api.events.JWPLAYER_PLAYER_STATE,E);
K();
C()
}function z(){if(c.prefix){var f=A.version.split(/\W/).splice(0,2).join("/");
if(c.prefix.indexOf(f)<0){c.prefix+=f+"/"
}}if(w.position==d.html5.view.positions.OVER){w.position=c.position
}try{if(window.location.href.indexOf("https")==0){c.prefix=c.prefix.replace("http://l.longtailvideo.com","https://securel.longtailvideo.com")
}}catch(e){}J=d.utils.extend({},c,w)
}function K(){b=document.createElement("img");
b.id=x.id+"_jwplayer_logo";
b.style.display="none";
b.onload=function(e){_css(b,D());
y()
};
if(!J.file){return
}if(J.file.indexOf("/")>=0){b.src=J.file
}else{b.src=J.prefix+J.file
}}if(!J.file){return
}this.resize=function(e,f){};
this.getDisplayElement=function(){return b
};
function C(){if(J.link){b.onmouseover=H;
b.onmouseout=y;
b.onclick=v
}else{this.mouseEnabled=false
}}function v(e){if(typeof e!="undefined"){e.stopPropagation()
}if(!F){return
}x.jwPause();
x.jwSetFullscreen(false);
if(J.link){window.open(J.link,J.linktarget)
}return
}function y(e){if(J.link&&F){b.style.opacity=J.out
}return
}function H(e){if(F){b.style.opacity=J.over
}return
}function D(){var e={textDecoration:"none",position:"absolute",cursor:"pointer"};
e.display=(J.hide.toString()=="true"&&!F)?"none":"block";
var f=J.position.toLowerCase().split("-");
for(var g in f){e[f[g]]=parseInt(J.margin)
}return e
}function B(){if(J.hide.toString()=="true"){b.style.display="block";
b.style.opacity=0;
d.utils.fadeTo(b,J.out,0.1,parseFloat(b.style.opacity));
a=setTimeout(function(){I()
},J.timeout*1000)
}F=true
}function I(){F=false;
if(J.hide.toString()=="true"){d.utils.fadeTo(b,0,0.1,parseFloat(b.style.opacity))
}}function E(e){if(e.newstate==d.api.events.state.BUFFERING){clearTimeout(a);
B()
}}return this
}
})(jwplayer);
(function(h){var o={ended:h.api.events.state.IDLE,playing:h.api.events.state.PLAYING,pause:h.api.events.state.PAUSED,buffering:h.api.events.state.BUFFERING};
var m=h.utils;
var k=m.isMobile();
var l,n;
var p={};
h.html5.mediavideo=function(aD,ae){var aa={abort:am,canplay:aw,canplaythrough:aw,durationchange:aq,emptied:am,ended:aw,error:ax,loadeddata:aq,loadedmetadata:aq,loadstart:aw,pause:aw,play:am,playing:aw,progress:ag,ratechange:am,seeked:aw,seeking:aw,stalled:aw,suspend:aw,timeupdate:g,volumechange:aA,waiting:aw,canshowcurrentframe:am,dataunavailable:am,empty:am,load:aE,loadedfirstframe:am,webkitfullscreenchange:aB};
var ai={};
var Z=new h.html5.eventdispatcher();
m.extend(this,Z);
var aC=aD,aj=ae,az,aF,ah,a,af,X,Y=false,ar=false,an=false,ab,ad,d;
c();
this.load=function(s,r){if(typeof r=="undefined"){r=true
}if(!ar){return
}a=s;
an=(a.duration>0);
aC.duration=a.duration;
m.empty(az);
az.style.display="block";
az.style.opacity=1;
if(l&&n){az.style.width=l;
az.style.height=n;
l=_previousHieght=0
}d=0;
av(s.levels);
if(s.levels&&s.levels.length>0){if(s.levels.length==1||m.isIOS()){az.src=s.levels[0].file
}else{if(az.src){az.removeAttribute("src")
}for(var t=0;
t<s.levels.length;
t++){var q=az.ownerDocument.createElement("source");
q.src=s.levels[t].file;
az.appendChild(q);
d++
}}}else{az.src=s.file
}az.volume=aC.volume/100;
az.muted=aC.mute;
if(k){e()
}ab=ad=ah=false;
aC.buffer=0;
if(!m.exists(s.start)){s.start=0
}X=(s.start>0)?s.start:-1;
at(h.api.events.JWPLAYER_MEDIA_LOADED);
if((!k&&s.levels.length==1)||!Y){az.load()
}Y=false;
if(r){ao(h.api.events.state.BUFFERING);
at(h.api.events.JWPLAYER_MEDIA_BUFFER,{bufferPercent:0});
ak()
}if(az.videoWidth>0&&az.videoHeight>0){aq()
}};
this.play=function(){if(!ar){return
}ak();
if(ad){ao(h.api.events.state.PLAYING)
}else{az.load();
ao(h.api.events.state.BUFFERING)
}az.play()
};
this.pause=function(){if(!ar){return
}az.pause();
ao(h.api.events.state.PAUSED)
};
this.seek=function(q){if(!ar){return
}if(!ah&&az.readyState>0){if(!(aC.duration<=0||isNaN(aC.duration))&&!(aC.position<=0||isNaN(aC.position))){az.currentTime=q;
az.play()
}}else{X=q
}};
var al=this.stop=function(t){if(!ar){return
}if(!m.exists(t)){t=true
}au();
if(t){ad=false;
var s=navigator.userAgent;
if(az.webkitSupportsFullscreen){try{az.webkitExitFullscreen()
}catch(r){}}az.style.opacity=0;
ap();
if(m.isIE()){az.src=""
}else{az.removeAttribute("src")
}m.empty(az);
az.load();
Y=true
}if(m.isIPod()){l=az.style.width;
n=az.style.height;
az.style.width=0;
az.style.height=0
}else{if(m.isIPad()){az.style.display="none";
try{az.webkitExitFullscreen()
}catch(q){}}}ao(h.api.events.state.IDLE)
};
this.fullscreen=function(q){if(q===true){this.resize("100%","100%")
}else{this.resize(aC.config.width,aC.config.height)
}};
this.resize=function(q,r){};
this.volume=function(q){if(!k){az.volume=q/100;
at(h.api.events.JWPLAYER_MEDIA_VOLUME,{volume:(q/100)})
}};
this.mute=function(q){if(!k){az.muted=q;
at(h.api.events.JWPLAYER_MEDIA_MUTE,{mute:q})
}};
this.getDisplayElement=function(){return az
};
this.hasChrome=function(){return k&&(aF==h.api.events.state.PLAYING)
};
this.detachMedia=function(){ar=false;
return this.getDisplayElement()
};
this.attachMedia=function(){ar=true
};
this.destroy=function(){if(az&&az.parentNode){au();
for(var q in aa){az.removeEventListener(q,ac(q,aa[q]),true)
}m.empty(az);
aj=az.parentNode;
az.parentNode.removeChild(az);
delete p[aC.id];
az=null
}};
function ac(q,r){if(ai[q]){return ai[q]
}else{ai[q]=function(s){if(m.exists(s.target.parentNode)){r(s)
}};
return ai[q]
}}function c(){aF=h.api.events.state.IDLE;
ar=true;
az=ay();
az.setAttribute("x-webkit-airplay","allow");
if(aj.parentNode){az.id=aj.id;
aj.parentNode.replaceChild(az,aj)
}}function ay(){var r=p[aC.id];
if(!r){if(aj.tagName.toLowerCase()=="video"){r=aj
}else{r=document.createElement("video")
}p[aC.id]=r;
if(!r.id){r.id=aj.id
}}for(var q in aa){r.addEventListener(q,ac(q,aa[q]),true)
}return r
}function ao(r){if(r==h.api.events.state.PAUSED&&aF==h.api.events.state.IDLE){return
}if(k){switch(r){case h.api.events.state.PLAYING:e();
break;
case h.api.events.state.BUFFERING:case h.api.events.state.PAUSED:ap();
break
}}if(aF!=r){var q=aF;
aC.state=aF=r;
at(h.api.events.JWPLAYER_PLAYER_STATE,{oldstate:q,newstate:r})
}}function am(q){}function aA(r){var q=Math.round(az.volume*100);
at(h.api.events.JWPLAYER_MEDIA_VOLUME,{volume:q},true);
at(h.api.events.JWPLAYER_MEDIA_MUTE,{mute:az.muted},true)
}function ag(q){if(!ar){return
}var r;
if(m.exists(q)&&q.lengthComputable&&q.total){r=q.loaded/q.total*100
}else{if(m.exists(az.buffered)&&(az.buffered.length>0)){var s=az.buffered.length-1;
if(s>=0){r=az.buffered.end(s)/az.duration*100
}}}if(m.useNativeFullscreen()&&m.exists(az.webkitDisplayingFullscreen)){if(aC.fullscreen!=az.webkitDisplayingFullscreen){at(h.api.events.JWPLAYER_FULLSCREEN,{fullscreen:az.webkitDisplayingFullscreen},true)
}}if(ad===false&&aF==h.api.events.state.BUFFERING){at(h.api.events.JWPLAYER_MEDIA_BUFFER_FULL);
ad=true
}if(!ab){if(r==100){ab=true
}if(m.exists(r)&&(r>aC.buffer)){aC.buffer=Math.round(r);
at(h.api.events.JWPLAYER_MEDIA_BUFFER,{bufferPercent:Math.round(r)})
}}}function g(q){if(!ar){return
}if(m.exists(q)&&m.exists(q.target)){if(an>0){if(!isNaN(q.target.duration)&&(isNaN(aC.duration)||aC.duration<1)){if(q.target.duration==Infinity){aC.duration=0
}else{aC.duration=Math.round(q.target.duration*10)/10
}}}if(!ah&&az.readyState>0){ao(h.api.events.state.PLAYING)
}if(aF==h.api.events.state.PLAYING){if(az.readyState>0&&(X>-1||!ah)){ah=true;
try{if(az.currentTime!=X&&X>-1){az.currentTime=X;
X=-1
}}catch(r){}az.volume=aC.volume/100;
az.muted=aC.mute
}aC.position=aC.duration>0?(Math.round(q.target.currentTime*10)/10):0;
at(h.api.events.JWPLAYER_MEDIA_TIME,{position:aC.position,duration:aC.duration});
if(aC.position>=aC.duration&&(aC.position>0||aC.duration>0)){f();
return
}}}ag(q)
}function aE(q){}function aw(q){if(!ar){return
}if(l&&n){az.style.width=l;
az.style.height=n;
l=_previousHieght=0
}if(o[q.type]){if(q.type=="ended"){f()
}else{ao(o[q.type])
}}}function aq(r){if(!ar){return
}var s=Math.round(az.duration*10)/10;
var q={height:az.videoHeight,width:az.videoWidth,duration:s};
if(!an){if((aC.duration<s||isNaN(aC.duration))&&az.duration!=Infinity){aC.duration=s
}}at(h.api.events.JWPLAYER_MEDIA_META,{metadata:q})
}function ax(q){if(!ar){return
}if(aF==h.api.events.state.IDLE){return
}var r="There was an error: ";
if((q.target.error&&q.target.tagName.toLowerCase()=="video")||q.target.parentNode.error&&q.target.parentNode.tagName.toLowerCase()=="video"){var s=!m.exists(q.target.error)?q.target.parentNode.error:q.target.error;
switch(s.code){case s.MEDIA_ERR_ABORTED:m.log("User aborted the video playback.");
return;
case s.MEDIA_ERR_NETWORK:r="A network error caused the video download to fail part-way: ";
break;
case s.MEDIA_ERR_DECODE:r="The video playback was aborted due to a corruption problem or because the video used features your browser did not support: ";
break;
case s.MEDIA_ERR_SRC_NOT_SUPPORTED:r="The video could not be loaded, either because the server or network failed or because the format is not supported: ";
break;
default:r="An unknown error occurred: ";
break
}}else{if(q.target.tagName.toLowerCase()=="source"){d--;
if(d>0){return
}if(m.userAgentMatch(/firefox/i)){m.log("The video could not be loaded, either because the server or network failed or because the format is not supported.");
al(false);
return
}else{r="The video could not be loaded, either because the server or network failed or because the format is not supported: "
}}else{m.log("An unknown error occurred.  Continuing...");
return
}}al(false);
r+=b();
_error=true;
at(h.api.events.JWPLAYER_ERROR,{message:r});
return
}function b(){var r="";
for(var s in a.levels){var t=a.levels[s];
var q=aj.ownerDocument.createElement("source");
r+=h.utils.getAbsolutePath(t.file);
if(s<(a.levels.length-1)){r+=", "
}}return r
}function ak(){if(!m.exists(af)){af=setInterval(function(){ag()
},100)
}}function au(){clearInterval(af);
af=null
}function f(){if(aF==h.api.events.state.PLAYING){al(false);
at(h.api.events.JWPLAYER_MEDIA_BEFORECOMPLETE);
at(h.api.events.JWPLAYER_MEDIA_COMPLETE)
}}function aB(q){if(m.exists(az.webkitDisplayingFullscreen)){if(aC.fullscreen&&!az.webkitDisplayingFullscreen){at(h.api.events.JWPLAYER_FULLSCREEN,{fullscreen:false},true)
}}}function av(r){if(r.length>0&&m.userAgentMatch(/Safari/i)&&!m.userAgentMatch(/Chrome/i)){var t=-1;
for(var s=0;
s<r.length;
s++){switch(m.extension(r[s].file)){case"mp4":if(t<0){t=s
}break;
case"webm":r.splice(s,1);
break
}}if(t>0){var q=r.splice(t,1)[0];
r.unshift(q)
}}}function e(){setTimeout(function(){az.setAttribute("controls","controls")
},100)
}function ap(){setTimeout(function(){az.removeAttribute("controls")
},250)
}function at(s,q,r){if(ar||r){if(q){Z.sendEvent(s,q)
}else{Z.sendEvent(s)
}}}}
})(jwplayer);
(function(e){var f={ended:e.api.events.state.IDLE,playing:e.api.events.state.PLAYING,pause:e.api.events.state.PAUSED,buffering:e.api.events.state.BUFFERING};
var d=e.utils.css;
e.html5.mediayoutube=function(r,v){var u=new e.html5.eventdispatcher();
e.utils.extend(this,u);
var p=r;
var s=document.getElementById(v.id);
var t=e.api.events.state.IDLE;
var b,c;
function q(h){if(t!=h){var g=t;
p.state=h;
t=h;
u.sendEvent(e.api.events.JWPLAYER_PLAYER_STATE,{oldstate:g,newstate:h})
}}this.getDisplayElement=this.detachMedia=function(){return s
};
this.attachMedia=function(){};
this.play=function(){if(t==e.api.events.state.IDLE){u.sendEvent(e.api.events.JWPLAYER_MEDIA_BUFFER,{bufferPercent:100});
u.sendEvent(e.api.events.JWPLAYER_MEDIA_BUFFER_FULL);
q(e.api.events.state.PLAYING)
}else{if(t==e.api.events.state.PAUSED){q(e.api.events.state.PLAYING)
}}};
this.pause=function(){q(e.api.events.state.PAUSED)
};
this.seek=function(g){};
this.stop=function(g){if(!_utils.exists(g)){g=true
}p.position=0;
q(e.api.events.state.IDLE);
if(g){d(s,{display:"none"})
}};
this.volume=function(g){p.setVolume(g);
u.sendEvent(e.api.events.JWPLAYER_MEDIA_VOLUME,{volume:Math.round(g)})
};
this.mute=function(g){s.muted=g;
u.sendEvent(e.api.events.JWPLAYER_MEDIA_MUTE,{mute:g})
};
this.resize=function(g,h){if(g*h>0&&b){b.width=c.width=g;
b.height=c.height=h
}};
this.fullscreen=function(g){if(g===true){this.resize("100%","100%")
}else{this.resize(p.config.width,p.config.height)
}};
this.load=function(g){a(g);
d(b,{display:"block"});
q(e.api.events.state.BUFFERING);
u.sendEvent(e.api.events.JWPLAYER_MEDIA_BUFFER,{bufferPercent:0});
u.sendEvent(e.api.events.JWPLAYER_MEDIA_LOADED);
this.play()
};
this.hasChrome=function(){return(t!=e.api.events.state.IDLE)
};
function a(g){var l=g.levels[0].file;
l=["http://www.youtube.com/v/",w(l),"&amp;hl=en_US&amp;fs=1&autoplay=1"].join("");
b=document.createElement("object");
b.id=s.id;
b.style.position="absolute";
var h={movie:l,allowfullscreen:"true",allowscriptaccess:"always"};
for(var o in h){var k=document.createElement("param");
k.name=o;
k.value=h[o];
b.appendChild(k)
}c=document.createElement("embed");
b.appendChild(c);
var n={src:l,type:"application/x-shockwave-flash",allowfullscreen:"true",allowscriptaccess:"always",width:b.width,height:b.height};
for(var m in n){c.setAttribute(m,n[m])
}b.appendChild(c);
b.style.zIndex=2147483000;
if(s!=b&&s.parentNode){s.parentNode.replaceChild(b,s)
}s=b
}function w(k){var l=k.split(/\?|\#\!/);
var g="";
for(var h=0;
h<l.length;
h++){if(l[h].substr(0,2)=="v="){g=l[h].substr(2)
}}if(g==""){if(k.indexOf("/v/")>=0){g=k.substr(k.indexOf("/v/")+3)
}else{if(k.indexOf("youtu.be")>=0){g=k.substr(k.indexOf("youtu.be/")+9)
}else{g=k
}}}if(g.indexOf("?")>-1){g=g.substr(0,g.indexOf("?"))
}if(g.indexOf("&")>-1){g=g.substr(0,g.indexOf("&"))
}return g
}this.embed=c;
return this
}
})(jwplayer);
(function(jwplayer){var _configurableStateVariables=["width","height","start","duration","volume","mute","fullscreen","item","plugins","stretching"];
var _utils=jwplayer.utils;
jwplayer.html5.model=function(api,container,options){var _api=api;
var _container=container;
var _cookies=_utils.getCookies();
var _model={id:_container.id,playlist:[],state:jwplayer.api.events.state.IDLE,position:0,buffer:0,container:_container,config:{width:480,height:320,item:-1,skin:undefined,file:undefined,image:undefined,start:0,duration:0,bufferlength:5,volume:_cookies.volume?_cookies.volume:90,mute:_cookies.mute&&_cookies.mute.toString().toLowerCase()=="true"?true:false,fullscreen:false,repeat:"",stretching:jwplayer.utils.stretching.UNIFORM,autostart:false,debug:undefined,screencolor:undefined}};
var _media;
var _eventDispatcher=new jwplayer.html5.eventdispatcher();
var _components=["display","logo","controlbar","playlist","dock"];
jwplayer.utils.extend(_model,_eventDispatcher);
for(var option in options){if(typeof options[option]=="string"){var type=/color$/.test(option)?"color":null;
options[option]=jwplayer.utils.typechecker(options[option],type)
}var config=_model.config;
var path=option.split(".");
for(var edge in path){if(edge==path.length-1){config[path[edge]]=options[option]
}else{if(!jwplayer.utils.exists(config[path[edge]])){config[path[edge]]={}
}config=config[path[edge]]
}}}for(var index in _configurableStateVariables){var configurableStateVariable=_configurableStateVariables[index];
_model[configurableStateVariable]=_model.config[configurableStateVariable]
}var pluginorder=_components.concat([]);
if(jwplayer.utils.exists(_model.plugins)){if(typeof _model.plugins=="string"){var userplugins=_model.plugins.split(",");
for(var userplugin in userplugins){if(typeof userplugins[userplugin]=="string"){pluginorder.push(userplugins[userplugin].replace(/^\s+|\s+$/g,""))
}}}}if(jwplayer.utils.isMobile()){pluginorder=["display","logo","dock","playlist"];
if(!jwplayer.utils.exists(_model.config.repeat)){_model.config.repeat="list"
}}else{if(_model.config.chromeless){pluginorder=["logo","dock","playlist"];
if(!jwplayer.utils.exists(_model.config.repeat)){_model.config.repeat="list"
}}}_model.plugins={order:pluginorder,config:{},object:{}};
if(typeof _model.config.components!="undefined"){for(var component in _model.config.components){_model.plugins.config[component]=_model.config.components[component]
}}var playlistVisible=false;
for(var pluginIndex in _model.plugins.order){var pluginName=_model.plugins.order[pluginIndex];
var pluginConfig=!jwplayer.utils.exists(_model.plugins.config[pluginName])?{}:_model.plugins.config[pluginName];
_model.plugins.config[pluginName]=!jwplayer.utils.exists(_model.plugins.config[pluginName])?pluginConfig:jwplayer.utils.extend(_model.plugins.config[pluginName],pluginConfig);
if(!jwplayer.utils.exists(_model.plugins.config[pluginName].position)){if(pluginName=="playlist"){_model.plugins.config[pluginName].position=jwplayer.html5.view.positions.NONE
}else{_model.plugins.config[pluginName].position=jwplayer.html5.view.positions.OVER
}}else{if(pluginName=="playlist"){playlistVisible=true
}_model.plugins.config[pluginName].position=_model.plugins.config[pluginName].position.toString().toUpperCase()
}}if(_model.plugins.config.controlbar&&playlistVisible){_model.plugins.config.controlbar.hideplaylistcontrols=true
}if(typeof _model.plugins.config.dock!="undefined"){if(typeof _model.plugins.config.dock!="object"){var position=_model.plugins.config.dock.toString().toUpperCase();
_model.plugins.config.dock={position:position}
}if(typeof _model.plugins.config.dock.position!="undefined"){_model.plugins.config.dock.align=_model.plugins.config.dock.position;
_model.plugins.config.dock.position=jwplayer.html5.view.positions.OVER
}if(typeof _model.plugins.config.dock.idlehide=="undefined"){try{_model.plugins.config.dock.idlehide=_model.plugins.config.controlbar.idlehide
}catch(e){}}}function _loadExternal(playlistfile){var loader=new jwplayer.html5.playlistloader();
loader.addEventListener(jwplayer.api.events.JWPLAYER_PLAYLIST_LOADED,function(evt){_model.playlist=new jwplayer.html5.playlist(evt);
_loadComplete(true)
});
loader.addEventListener(jwplayer.api.events.JWPLAYER_ERROR,function(evt){_model.playlist=new jwplayer.html5.playlist({playlist:[]});
_loadComplete(false)
});
loader.load(playlistfile)
}function _loadComplete(){if(_model.config.shuffle){_model.item=_getShuffleItem()
}else{if(_model.config.item>=_model.playlist.length){_model.config.item=_model.playlist.length-1
}else{if(_model.config.item<0){_model.config.item=0
}}_model.item=_model.config.item
}_model.position=0;
_model.duration=_model.playlist.length>0?_model.playlist[_model.item].duration:0;
_eventDispatcher.sendEvent(jwplayer.api.events.JWPLAYER_PLAYLIST_LOADED,{playlist:_model.playlist});
_eventDispatcher.sendEvent(jwplayer.api.events.JWPLAYER_PLAYLIST_ITEM,{index:_model.item})
}_model.loadPlaylist=function(arg){var input;
if(typeof arg=="string"){if(arg.indexOf("[")==0||arg.indexOf("{")=="0"){try{input=eval(arg)
}catch(err){input=arg
}}else{input=arg
}}else{input=arg
}var config;
switch(jwplayer.utils.typeOf(input)){case"object":config=input;
break;
case"array":config={playlist:input};
break;
default:config={file:input};
break
}_model.playlist=new jwplayer.html5.playlist(config);
_model.item=_model.config.item>=0?_model.config.item:0;
if(!_model.playlist[0].provider&&_model.playlist[0].file){_loadExternal(_model.playlist[0].file)
}else{_loadComplete()
}};
function _getShuffleItem(){var result=null;
if(_model.playlist.length>1){while(!jwplayer.utils.exists(result)){result=Math.floor(Math.random()*_model.playlist.length);
if(result==_model.item){result=null
}}}else{result=0
}return result
}function forward(evt){switch(evt.type){case jwplayer.api.events.JWPLAYER_MEDIA_LOADED:_container=_media.getDisplayElement();
break;
case jwplayer.api.events.JWPLAYER_MEDIA_MUTE:this.mute=evt.mute;
break;
case jwplayer.api.events.JWPLAYER_MEDIA_VOLUME:this.volume=evt.volume;
break
}_eventDispatcher.sendEvent(evt.type,evt)
}var _mediaProviders={};
_model.setActiveMediaProvider=function(playlistItem){if(playlistItem.provider=="audio"){playlistItem.provider="sound"
}var provider=playlistItem.provider;
var current=_media?_media.getDisplayElement():null;
if(provider=="sound"||provider=="http"||provider==""){provider="video"
}if(!jwplayer.utils.exists(_mediaProviders[provider])){switch(provider){case"video":_media=new jwplayer.html5.mediavideo(_model,current?current:_container);
break;
case"youtube":_media=new jwplayer.html5.mediayoutube(_model,current?current:_container);
break
}if(!jwplayer.utils.exists(_media)){return false
}_media.addGlobalListener(forward);
_mediaProviders[provider]=_media
}else{if(_media!=_mediaProviders[provider]){if(_media){_media.stop()
}_media=_mediaProviders[provider]
}}return true
};
_model.getMedia=function(){return _media
};
_model.seek=function(pos){_eventDispatcher.sendEvent(jwplayer.api.events.JWPLAYER_MEDIA_SEEK,{position:_model.position,offset:pos});
return _media.seek(pos)
};
_model.setVolume=function(newVol){_utils.saveCookie("volume",newVol);
_model.volume=newVol
};
_model.setMute=function(state){_utils.saveCookie("mute",state);
_model.mute=state
};
_model.setupPlugins=function(){if(!jwplayer.utils.exists(_model.plugins)||!jwplayer.utils.exists(_model.plugins.order)||_model.plugins.order.length==0){jwplayer.utils.log("No plugins to set up");
return _model
}for(var i=0;
i<_model.plugins.order.length;
i++){try{var pluginName=_model.plugins.order[i];
if(jwplayer.utils.exists(jwplayer.html5[pluginName])){if(pluginName=="playlist"){_model.plugins.object[pluginName]=new jwplayer.html5.playlistcomponent(_api,_model.plugins.config[pluginName])
}else{_model.plugins.object[pluginName]=new jwplayer.html5[pluginName](_api,_model.plugins.config[pluginName])
}}else{_model.plugins.order.splice(plugin,plugin+1)
}if(typeof _model.plugins.object[pluginName].addGlobalListener=="function"){_model.plugins.object[pluginName].addGlobalListener(forward)
}}catch(err){jwplayer.utils.log("Could not setup "+pluginName)
}}};
return _model
}
})(jwplayer);
(function(b){b.html5.playlist=function(a){var e=[];
if(a.playlist&&a.playlist instanceof Array&&a.playlist.length>0){for(var f in a.playlist){if(!isNaN(parseInt(f))){e.push(new b.html5.playlistitem(a.playlist[f]))
}}}else{e.push(new b.html5.playlistitem(a))
}return e
}
})(jwplayer);
(function(e){var f={size:180,position:e.html5.view.positions.NONE,itemheight:60,thumbs:true,fontcolor:"#000000",overcolor:"",activecolor:"",backgroundcolor:"#f8f8f8",font:"_sans",fontsize:"",fontstyle:"",fontweight:""};
var d={_sans:"Arial, Helvetica, sans-serif",_serif:"Times, Times New Roman, serif",_typewriter:"Courier New, Courier, monospace"};
_utils=e.utils;
_css=_utils.css;
_hide=function(a){_css(a,{display:"none"})
};
_show=function(a){_css(a,{display:"block"})
};
e.html5.playlistcomponent=function(L,K){var c=L;
var Z=e.utils.extend({},f,c.skin.getComponentSettings("playlist"),K);
if(Z.position==e.html5.view.positions.NONE||typeof e.html5.view.positions[Z.position]=="undefined"){return
}var b;
var T;
var J;
var aa;
var X;
var Y;
var U=-1;
var W={background:undefined,item:undefined,itemOver:undefined,itemImage:undefined,itemActive:undefined};
this.getDisplayElement=function(){return b
};
this.resize=function(g,k){T=g;
J=k;
if(c.jwGetFullscreen()){_hide(b)
}else{var h={display:"block",width:T,height:J};
_css(b,h)
}};
this.show=function(){_show(b)
};
this.hide=function(){_hide(b)
};
function V(){b=document.createElement("div");
b.id=c.id+"_jwplayer_playlistcomponent";
b.style.overflow="hidden";
switch(Z.position){case e.html5.view.positions.RIGHT:case e.html5.view.positions.LEFT:b.style.width=Z.size+"px";
break;
case e.html5.view.positions.TOP:case e.html5.view.positions.BOTTOM:b.style.height=Z.size+"px";
break
}M();
if(W.item){Z.itemheight=W.item.height
}b.style.backgroundColor="#C6C6C6";
c.jwAddEventListener(e.api.events.JWPLAYER_PLAYLIST_LOADED,I);
c.jwAddEventListener(e.api.events.JWPLAYER_PLAYLIST_ITEM,F);
c.jwAddEventListener(e.api.events.JWPLAYER_PLAYER_STATE,S)
}function P(){var g=document.createElement("ul");
_css(g,{width:b.style.width,minWidth:b.style.width,height:b.style.height,backgroundColor:Z.backgroundcolor,backgroundImage:W.background?"url("+W.background.src+")":"",color:Z.fontcolor,listStyle:"none",margin:0,padding:0,fontFamily:d[Z.font]?d[Z.font]:d._sans,fontSize:(Z.fontsize?Z.fontsize:11)+"px",fontStyle:Z.fontstyle,fontWeight:Z.fontweight,overflowY:"auto"});
return g
}function a(g){return function(){var l=Y.getElementsByClassName("item")[g];
var k=Z.fontcolor;
var h=W.item?"url("+W.item.src+")":"";
if(g==c.jwGetPlaylistIndex()){if(Z.activecolor!==""){k=Z.activecolor
}if(W.itemActive){h="url("+W.itemActive.src+")"
}}_css(l,{color:Z.overcolor!==""?Z.overcolor:k,backgroundImage:W.itemOver?"url("+W.itemOver.src+")":h})
}
}function Q(g){return function(){var l=Y.getElementsByClassName("item")[g];
var k=Z.fontcolor;
var h=W.item?"url("+W.item.src+")":"";
if(g==c.jwGetPlaylistIndex()){if(Z.activecolor!==""){k=Z.activecolor
}if(W.itemActive){h="url("+W.itemActive.src+")"
}}_css(l,{color:k,backgroundImage:h})
}
}function N(p){var g=aa[p];
var h=document.createElement("li");
h.className="item";
_css(h,{height:Z.itemheight,display:"block",cursor:"pointer",backgroundImage:W.item?"url("+W.item.src+")":"",backgroundSize:"100% "+Z.itemheight+"px"});
h.onmouseover=a(p);
h.onmouseout=Q(p);
var o=document.createElement("div");
var s=new Image();
var n=0;
var m=0;
var l=0;
if(E()&&(g.image||g["playlist.image"]||W.itemImage)){s.className="image";
if(W.itemImage){n=(Z.itemheight-W.itemImage.height)/2;
m=W.itemImage.width;
l=W.itemImage.height
}else{m=Z.itemheight*4/3;
l=Z.itemheight
}_css(o,{height:l,width:m,"float":"left",styleFloat:"left",cssFloat:"left",margin:"0 5px 0 0",background:"black",overflow:"hidden",margin:n+"px",position:"relative"});
_css(s,{position:"relative"});
o.appendChild(s);
s.onload=function(){e.utils.stretch(e.utils.stretching.FILL,s,m,l,this.naturalWidth,this.naturalHeight)
};
if(g["playlist.image"]){s.src=g["playlist.image"]
}else{if(g.image){s.src=g.image
}else{if(W.itemImage){s.src=W.itemImage.src
}}}h.appendChild(o)
}var t=T-m-n*2;
if(J<Z.itemheight*aa.length){t-=15
}var u=document.createElement("div");
_css(u,{position:"relative",height:"100%",overflow:"hidden"});
var r=document.createElement("span");
if(g.duration>0){r.className="duration";
_css(r,{fontSize:(Z.fontsize?Z.fontsize:11)+"px",fontWeight:(Z.fontweight?Z.fontweight:"bold"),width:"40px",height:Z.fontsize?Z.fontsize+10:20,lineHeight:24,"float":"right",styleFloat:"right",cssFloat:"right"});
r.innerHTML=_utils.timeFormat(g.duration);
u.appendChild(r)
}var k=document.createElement("span");
k.className="title";
_css(k,{padding:"5px 5px 0 "+(n?0:"5px"),height:Z.fontsize?Z.fontsize+10:20,lineHeight:Z.fontsize?Z.fontsize+10:20,overflow:"hidden","float":"left",styleFloat:"left",cssFloat:"left",width:((g.duration>0)?t-50:t)-10+"px",fontSize:(Z.fontsize?Z.fontsize:13)+"px",fontWeight:(Z.fontweight?Z.fontweight:"bold")});
k.innerHTML=g?g.title:"";
u.appendChild(k);
if(g.description){var q=document.createElement("span");
q.className="description";
_css(q,{display:"block","float":"left",styleFloat:"left",cssFloat:"left",margin:0,paddingLeft:k.style.paddingLeft,paddingRight:k.style.paddingRight,lineHeight:(Z.fontsize?Z.fontsize+4:16)+"px",overflow:"hidden",position:"relative"});
q.innerHTML=g.description;
u.appendChild(q)
}h.appendChild(u);
return h
}function I(k){b.innerHTML="";
aa=H();
if(!aa){return
}items=[];
Y=P();
for(var h=0;
h<aa.length;
h++){var l=N(h);
l.onclick=O(h);
Y.appendChild(l);
items.push(l)
}U=c.jwGetPlaylistIndex();
Q(U)();
b.appendChild(Y);
if(_utils.isIOS()&&window.iScroll){Y.style.height=Z.itemheight*aa.length+"px";
var g=new iScroll(b.id)
}}function H(){var h=c.jwGetPlaylist();
var g=[];
for(var k=0;
k<h.length;
k++){if(!h[k]["ova.hidden"]){g.push(h[k])
}}return g
}function O(g){return function(){c.jwPlaylistItem(g);
c.jwPlay(true)
}
}function R(){Y.scrollTop=c.jwGetPlaylistIndex()*Z.itemheight
}function E(){return Z.thumbs.toString().toLowerCase()=="true"
}function F(g){if(U>=0){Q(U)();
U=g.index
}Q(g.index)();
R()
}function S(){if(Z.position==e.html5.view.positions.OVER){switch(c.jwGetState()){case e.api.events.state.IDLE:_show(b);
break;
default:_hide(b);
break
}}}function M(){for(var g in W){W[g]=G(g)
}}function G(g){return c.skin.getSkinElement("playlist",g)
}V();
return this
}
})(jwplayer);
(function(c){c.html5.playlistitem=function(b){var a={author:"",date:"",description:"",image:"",link:"",mediaid:"",tags:"",title:"",provider:"",file:"",streamer:"",duration:-1,start:0,currentLevel:-1,levels:[]};
var f=c.utils.extend({},a,b);
if(f.type){f.provider=f.type;
delete f.type
}if(f.levels.length===0){f.levels[0]=new c.html5.playlistitemlevel(f)
}if(!f.provider){f.provider=d(f.levels[0])
}else{f.provider=f.provider.toLowerCase()
}return f
};
function d(b){if(c.utils.isYouTube(b.file)){return"youtube"
}else{var a=c.utils.extension(b.file);
var h;
if(a&&c.utils.extensionmap[a]){if(a=="m3u8"){return"video"
}h=c.utils.extensionmap[a].html5
}else{if(b.type){h=b.type
}}if(h){var g=h.split("/")[0];
if(g=="audio"){return"sound"
}else{if(g=="video"){return g
}}}}return""
}})(jwplayer);
(function(b){b.html5.playlistitemlevel=function(a){var e={file:"",streamer:"",bitrate:0,width:0};
for(var f in e){if(b.utils.exists(a[f])){e[f]=a[f]
}}return e
}
})(jwplayer);
(function(b){b.html5.playlistloader=function(){var f=new b.html5.eventdispatcher();
b.utils.extend(this,f);
this.load=function(c){b.utils.ajax(c,e,a)
};
function e(d){var k=[];
try{var k=b.utils.parsers.rssparser.parse(d.responseXML.firstChild);
f.sendEvent(b.api.events.JWPLAYER_PLAYLIST_LOADED,{playlist:new b.html5.playlist({playlist:k})})
}catch(c){a("Could not parse the playlist")
}}function a(c){f.sendEvent(b.api.events.JWPLAYER_ERROR,{message:c?c:"Could not load playlist an unknown reason."})
}}
})(jwplayer);
(function(b){b.html5.skin=function(){var a={};
var d=false;
this.load=function(f,c){new b.html5.skinloader(f,function(e){d=true;
a=e;
c()
},function(){new b.html5.skinloader("",function(e){d=true;
a=e;
c()
})
})
};
this.getSkinElement=function(h,g){if(d){try{return a[h].elements[g]
}catch(c){b.utils.log("No such skin component / element: ",[h,g])
}}return null
};
this.getComponentSettings=function(c){if(d&&a&&a[c]){return a[c].settings
}return null
};
this.getComponentLayout=function(c){if(d){return a[c].layout
}return null
}
}
})(jwplayer);
(function(b){b.html5.skinloader=function(D,u,z){var v={};
var G=u;
var y=z;
var E=true;
var A;
var w=D;
var I=false;
function x(){if(typeof w!="string"||w===""){F(b.html5.defaultSkin().xml)
}else{b.utils.ajax(b.utils.getAbsolutePath(w),function(d){try{if(b.utils.exists(d.responseXML)){F(d.responseXML);
return
}}catch(c){B()
}F(b.html5.defaultSkin().xml)
},function(c){F(b.html5.defaultSkin().xml)
})
}}function F(n){var V=n.getElementsByTagName("component");
if(V.length===0){return
}for(var q=0;
q<V.length;
q++){var X=V[q].getAttribute("name");
var Y={settings:{},elements:{},layout:{}};
v[X]=Y;
var R=V[q].getElementsByTagName("elements")[0].getElementsByTagName("element");
for(var T=0;
T<R.length;
T++){H(R[T],X)
}var l=V[q].getElementsByTagName("settings")[0];
if(l&&l.childNodes.length>0){var k=l.getElementsByTagName("setting");
for(var d=0;
d<k.length;
d++){var c=k[d].getAttribute("name");
var o=k[d].getAttribute("value");
var p=/color$/.test(c)?"color":null;
v[X].settings[c]=b.utils.typechecker(o,p)
}}var h=V[q].getElementsByTagName("layout")[0];
if(h&&h.childNodes.length>0){var g=h.getElementsByTagName("group");
for(var r=0;
r<g.length;
r++){var Z=g[r];
v[X].layout[Z.getAttribute("position")]={elements:[]};
for(var e=0;
e<Z.attributes.length;
e++){var W=Z.attributes[e];
v[X].layout[Z.getAttribute("position")][W.name]=W.value
}var f=Z.getElementsByTagName("*");
for(var s=0;
s<f.length;
s++){var U=f[s];
v[X].layout[Z.getAttribute("position")].elements.push({type:U.tagName});
for(var S=0;
S<U.attributes.length;
S++){var m=U.attributes[S];
v[X].layout[Z.getAttribute("position")].elements[s][m.name]=m.value
}if(!b.utils.exists(v[X].layout[Z.getAttribute("position")].elements[s].name)){v[X].layout[Z.getAttribute("position")].elements[s].name=U.tagName
}}}}E=false;
a()
}}function a(){clearInterval(A);
if(!I){A=setInterval(function(){t()
},100)
}}function H(l,d){var e=new Image();
var h=l.getAttribute("name");
var f=l.getAttribute("src");
var c;
if(f.indexOf("data:image/png;base64,")===0){c=f
}else{var g=b.utils.getAbsolutePath(w);
var k=g.substr(0,g.lastIndexOf("/"));
c=[k,d,f].join("/")
}v[d].elements[h]={height:0,width:0,src:"",ready:false,image:e};
e.onload=function(m){C(e,h,d)
};
e.onerror=function(m){I=true;
a();
y()
};
e.src=c
}function B(){for(var f in v){var d=v[f];
for(var g in d.elements){var c=d.elements[g];
var e=c.image;
e.onload=null;
e.onerror=null;
delete c.image;
delete d.elements[g]
}delete v[f]
}}function t(){for(var d in v){if(d!="properties"){for(var c in v[d].elements){if(!v[d].elements[c].ready){return
}}}}if(E===false){clearInterval(A);
G(v)
}}function C(e,c,d){if(v[d]&&v[d].elements[c]){v[d].elements[c].height=e.height;
v[d].elements[c].width=e.width;
v[d].elements[c].src=e.src;
v[d].elements[c].ready=true;
a()
}else{b.utils.log("Loaded an image for a missing element: "+d+"."+c)
}}x()
}
})(jwplayer);
(function(b){b.html5.api=function(B,a){var r={};
var x=document.createElement("div");
B.parentNode.replaceChild(x,B);
x.id=B.id;
r.version=b.version;
r.id=x.id;
var s=new b.html5.model(r,x,a);
var u=new b.html5.view(r,x,s);
var t=new b.html5.controller(r,x,s,u);
r.skin=new b.html5.skin();
r.jwPlay=function(c){if(typeof c=="undefined"){y()
}else{if(c.toString().toLowerCase()=="true"){t.play()
}else{t.pause()
}}};
r.jwPause=function(c){if(typeof c=="undefined"){y()
}else{if(c.toString().toLowerCase()=="true"){t.pause()
}else{t.play()
}}};
function y(){if(s.state==b.api.events.state.PLAYING||s.state==b.api.events.state.BUFFERING){t.pause()
}else{t.play()
}}r.jwStop=t.stop;
r.jwSeek=t.seek;
r.jwPlaylistItem=function(c){if(A){if(A.playlistClickable()){A.jwInstreamDestroy();
return t.item(c)
}}else{return t.item(c)
}};
r.jwPlaylistNext=t.next;
r.jwPlaylistPrev=t.prev;
r.jwResize=t.resize;
r.jwLoad=t.load;
r.jwDetachMedia=t.detachMedia;
r.jwAttachMedia=t.attachMedia;
function v(c){return function(){return s[c]
}
}function z(e,c,d){return function(){var f=s.plugins.object[e];
if(f&&f[c]&&typeof f[c]=="function"){f[c].apply(f,d)
}}
}r.jwGetPlaylistIndex=v("item");
r.jwGetPosition=v("position");
r.jwGetDuration=v("duration");
r.jwGetBuffer=v("buffer");
r.jwGetWidth=v("width");
r.jwGetHeight=v("height");
r.jwGetFullscreen=v("fullscreen");
r.jwSetFullscreen=t.setFullscreen;
r.jwGetVolume=v("volume");
r.jwSetVolume=t.setVolume;
r.jwGetMute=v("mute");
r.jwSetMute=t.setMute;
r.jwGetStretching=function(){return s.stretching.toUpperCase()
};
r.jwGetState=v("state");
r.jwGetVersion=function(){return r.version
};
r.jwGetPlaylist=function(){return s.playlist
};
r.jwAddEventListener=t.addEventListener;
r.jwRemoveEventListener=t.removeEventListener;
r.jwSendEvent=t.sendEvent;
r.jwDockSetButton=function(c,f,e,d){if(s.plugins.object.dock&&s.plugins.object.dock.setButton){s.plugins.object.dock.setButton(c,f,e,d)
}};
r.jwControlbarShow=z("controlbar","show");
r.jwControlbarHide=z("controlbar","hide");
r.jwDockShow=z("dock","show");
r.jwDockHide=z("dock","hide");
r.jwDisplayShow=z("display","show");
r.jwDisplayHide=z("display","hide");
var A;
r.jwLoadInstream=function(c,d){if(!A){A=new b.html5.instream(r,s,u,t)
}setTimeout(function(){A.load(c,d)
},10)
};
r.jwInstreamDestroy=function(){if(A){A.jwInstreamDestroy()
}};
r.jwInstreamAddEventListener=q("jwInstreamAddEventListener");
r.jwInstreamRemoveEventListener=q("jwInstreamRemoveEventListener");
r.jwInstreamGetState=q("jwInstreamGetState");
r.jwInstreamGetDuration=q("jwInstreamGetDuration");
r.jwInstreamGetPosition=q("jwInstreamGetPosition");
r.jwInstreamPlay=q("jwInstreamPlay");
r.jwInstreamPause=q("jwInstreamPause");
r.jwInstreamSeek=q("jwInstreamSeek");
function q(c){return function(){if(A&&typeof A[c]=="function"){return A[c].apply(this,arguments)
}else{_utils.log("Could not call instream method - instream API not initialized")
}}
}r.jwDestroy=function(){t.destroy()
};
r.jwGetLevel=function(){};
r.jwGetBandwidth=function(){};
r.jwGetLockState=function(){};
r.jwLock=function(){};
r.jwUnlock=function(){};
function C(){if(s.config.playlistfile){s.addEventListener(b.api.events.JWPLAYER_PLAYLIST_LOADED,w);
s.loadPlaylist(s.config.playlistfile)
}else{if(typeof s.config.playlist=="string"){s.addEventListener(b.api.events.JWPLAYER_PLAYLIST_LOADED,w);
s.loadPlaylist(s.config.playlist)
}else{s.loadPlaylist(s.config);
setTimeout(w,25)
}}}function w(c){s.removeEventListener(b.api.events.JWPLAYER_PLAYLIST_LOADED,w);
s.setupPlugins();
u.setup();
var c={id:r.id,version:r.version};
t.playerReady(c)
}if(s.config.chromeless&&!b.utils.isIOS()){C()
}else{r.skin.load(s.config.skin,C)
}return r
}
})(jwplayer)
}DL.Dashboard.Views.DLVideo=Backbone.View.extend({options:{},initialize:function(g,n,l,m,d,c){var e={flashplayer:DL.ServerSecurePath+DL.ContextUrl+"/scripts/web/dashboard/video/player.swf",skin:DL.ServerSecurePath+DL.ContextUrl+"/scripts/web/dashboard/video/DL_flashplayer.zip"},b=g.replace("video-",""),h=this;
n=n||{};
this.player=jwplayer(g);
if(!m){if(!!~window.navigator.userAgent.indexOf("iPad")){$("#"+g)[0].addEventListener("play",function(){$('li[data-item-id="'+b+'"]').find(".cameraData").hide();
if(_.isFunction(d)){d()
}},false);
$("#"+g)[0].addEventListener("pause",function(){$('li[data-item-id="'+b+'"]').find(".cameraData").show()
},false);
$("#"+g)[0].addEventListener("ended",function(){$('li[data-item-id="'+b+'"]').find(".cameraData").show();
if(_.isFunction(c)){c()
}},false)
}else{for(var a in n){if(n.hasOwnProperty(a)){e=$.extend(e,n);
break
}}if(this.player){this.player.setup(e);
this.player.onReady(function(){if(l){l(h.player)
}});
this.player.onPlay(function(){$('li[data-item-id="'+b+'"]').find(".cameraData").hide();
if(_.isFunction(d)){d()
}});
this.player.onPause(function(){$('li[data-item-id="'+b+'"]').find(".cameraData").show()
});
this.player.onComplete(function(){$('li[data-item-id="'+b+'"]').find(".cameraData").show();
if(_.isFunction(c)){c()
}})
}}}else{if(m=="FLASH"){this.initSwf(g,e,n,l)
}else{if(m=="HLS"){var k=$("<video></video>").css("width",320).css("height",240).attr("src",n.videoUrl).attr("autoplay","");
$("#"+g).html(k);
var f=$(document).find("video")[0];
f.addEventListener("loadstart",function(){l({player:f,type:"html5"})
},false)
}}}},initSwf:function(g,c,e,a){var b={file:e.videoUrl,autostart:"true",id:g,controlbar:"none",displayclick:"link"},h={allowfullscreen:"true",icons:"false",controlbar:"none",wmode:"transparent"},d={id:g,name:g},f=DL.AssetsSecureBasePath+"/assets/swf/expressInstall.swf";
swfobject.embedSWF(c.flashplayer,g,"320","240","9",f,b,h,d);
if(a&&typeof a==="function"){a(this.player)
}}});
DL.Dashboard.Views.Programs=window.DL.Dashboard.Views.Programs||{};
DL.Dashboard.Views.Programs.NotificationTimeSelector=Backbone.View.extend({initialize:function(){this.model=this.options.model;
this.context=this.options.context;
this.template=new DL.Dashboard.getTemplate("programs/programsTimeSelector");
this.dateTimeWindow=this.context.find(".dateTimeSelector");
this.dateTimeWindow.html($.tmpl($(this.template)));
this.dateTimeSentence=this.context.find(".dateTimeSelectionBtn");
this.mainControls=this.dateTimeWindow.find(".notificationHome");
this.dayPickerWrap=this.dateTimeWindow.find(".daySelector");
this.timePickerWrap=this.dateTimeWindow.find(".timeSelector");
this.allDayToggleButton=this.timePickerWrap.find(".allDayToggle");
this.dateTimeSentence.monobind("click",$.proxy(this.onclick_openDrawer,this));
this.mainControls.find(".dateTimeDone").monobind("click",$.proxy(this.onclick_mainDoneBtn,this));
this.allDayToggleButton.monobind("click",$.proxy(this.onclick_allDayToggle,this));
this.timeRange=[];
var a=this;
_.each(this.timePickerWrap.find(".btnColContainer"),function(e){var c=a.model.get("timeCondition");
var d={};
var b=$(e).attr("data-range-type");
if(b=="from"){d={hour:0,minute:0}
}else{d={hour:23,minute:55}
}if(_.isObject(c)&&_.isObject(c.timeRange)){a.timePickerWrap.find(".allDayToggle").addClass("inactive");
a.timePickerWrap.find(".timeRange").show();
d=c.timeRange[b]
}a.timeRange.push(new DL.Dashboard.Views.Programs.TimeSelector($(e),d))
})
},openDateTimeSelector:function(){var b=this,a=$(b.context).attr("id");
if(a=="step3"){b.context.find(".saveBtn").hide()
}if(!this.dateTimeWindow.data("isOpen")){if(b.context.data("wasCompleted")){}this.dateTimeWindow.slideDown(function(){b.dateTimeWindow.data("isOpen",true);
b.dateTimeWindow.find('a[data-goto="days"]').monobind("click",$.proxy(b.onclick_goToDays,b));
b.dateTimeWindow.find('a[data-goto="times"]').monobind("click",$.proxy(b.onclick_goToTimes,b))
});
b.dateTimeWindow.not(".completed").prepend($("<span/>",{"class":"indicatorArrow"}))
}else{this.closeDateTimeSelector()
}},closeDateTimeSelector:function(){var b=this,a=$(b.context).attr("id");
if(this.hasValues()){if(this.dateTimeWindow.data("isOpen")){if(b.options.causeStepToComplete){if(b.context.data("wasCompleted")){b.context.addClass("completed")
}}this.dateTimeWindow.slideUp(function(){b.dateTimeWindow.data("isOpen",false);
b.dateTimeWindow.find(".indicatorArrow").remove();
b.context.find(".dateTimeSelectionBtn").addClass("edit");
b.dateTimeWindow.addClass("completed")
})
}}this.dateTimeWindow.slideUp(function(){b.dateTimeWindow.data("isOpen",false);
b.dateTimeWindow.find(".indicatorArrow").remove()
});
if(a=="step3"){b.context.find(".saveBtn").show()
}},hasValues:function(){var c=this.mainControls.find("span");
for(var b=0,a=c.length;
b<a;
b++){if($(c[b]).text().length<1){return false
}}return true
},showControls:function(a){a.css({display:"none"});
this.mainControls.css({display:"block"})
},showDays:function(){var c=this.model.attributes.editing,d=$(".allDays a");
if(!this.dayPicker){var e=this,a=this.dayPickerWrap.find(".daySelectDone");
this.dayPicker=new DL.Dashboard.Views.Programs.DaySelector(this.dayPickerWrap,this.dayPickerWrap.find(".daySelectDone"));
this.dayPickerWrap.find(".backBtn").monobind("click",function(f){f.preventDefault();
e.showControls(e.dayPickerWrap)
});
a.monobind("click",$.proxy(function(f){if(a.hasClass("active")){e.dateTimeWindow.find("a[data-goto=days] .values").html(e.dayPicker.collectDayValues());
e.dateTimeWindow.find("a[data-goto=days]").addClass("done");
e.dateTimeSentence.find(".daysList").text(e.dayPicker.collectDayValues());
this.onclick_daySelected(f)
}f.preventDefault()
},this))
}var b=(_.isObject(this.model.get("timeCondition"))&&this.model.get("timeCondition").days)?this.model.get("timeCondition").days:[];
if(_.isUndefined(b)||!b.length){d.addClass("active")
}else{$.each(b,function(g){var f=b[g];
$("a[data-value="+f+"]").addClass("active")
})
}this.mainControls.css({display:"none"});
this.dayPickerWrap.css({display:"block"})
},showTimes:function(){if(!this.timePicker){var a=this.timePickerWrap.find(".doneBtn"),b=this;
a.monobind("click",$.proxy(this.onclick_timeSelected,this));
this.timePickerWrap.find(".backBtn").monobind("click",function(c){c.preventDefault();
b.showControls(b.timePickerWrap)
})
}this.mainControls.css({display:"none"});
this.timePickerWrap.css({display:"block"})
},createTimeConditionObject:function(b,a){var c=[];
if(_.isObject(b)){c=b.getSelectedDaysOfWeek()
}else{if(_.isObject(this.model.attributes.timeCondition)&&_.isArray(this.model.attributes.timeCondition.days)){c=this.model.attributes.timeCondition.days
}}return{days:c,timeRange:{from:a[0].getTimeObject(),to:a[1].getTimeObject()}}
},onclick_timeSelected:function(d){d.preventDefault();
var c=[],a=this,b=this.timePickerWrap.find(".allDayToggle");
_.each(this.timeRange,function(e){c.push(e.collectTimeValues())
});
var f=c.join(" - ");
this.dateTimeWindow.find("a[data-goto=times]").addClass("done");
if(b.hasClass("inactive")){this.dateTimeWindow.find("a[data-goto=times] .values").html(f);
this.dateTimeSentence.find(".timeList").html(" at "+f)
}else{this.dateTimeWindow.find("a[data-goto=times] .values").html("ALL DAY");
this.dateTimeSentence.find(".timeList").html(" all day.")
}this.showControls(this.timePickerWrap)
},allDayToggle:function(a){var b=this.timePickerWrap.find(".timeRange");
if(a.hasClass("inactive")){a.removeClass("inactive");
b.slideUp()
}else{a.addClass("inactive");
b.slideDown()
}},onclick_allDayToggle:function(a){a.preventDefault();
this.allDayToggle($(a.currentTarget))
},onclick_daySelected:function(a){a.preventDefault();
this.showControls(this.dayPickerWrap)
},onclick_goToDays:function(a){a.preventDefault();
this.showDays()
},onclick_goToTimes:function(a){a.preventDefault();
this.showTimes()
},onclick_openDrawer:function(a){a.preventDefault();
this.openDateTimeSelector()
},onclick_mainDoneBtn:function(c){c.preventDefault();
var a=this;
if(a.hasValues()){var b=this.createTimeConditionObject(a.dayPicker,a.timeRange);
toggleBtn=a.timePickerWrap.find(".allDayToggle");
if(!toggleBtn.hasClass("inactive")){delete b.timeRange
}a.model.set({timeCondition:b});
a.closeDateTimeSelector()
}},onclick_infoEditBtn:function(a){a.preventDefault()
}});
DL.Dashboard.Views.Programs.BasicDateTimeSelector=Backbone.View.extend({initialize:function(){this.model=this.options.model;
this.context=this.options.context;
this.daySelectorWindow=this.context.find(".daySelector");
this.timeSelectorWindow=this.context.find(".timeSelector");
this.timeSelectBtn=this.context.find(".timeSelectionBtn");
this.doneBtn=this.daySelectorWindow.find(".doneBtn");
this.doneBtn.monobind("click",$.proxy(this.onclick_daysSelected,this));
this.daySelector=new DL.Dashboard.Views.Programs.DaySelector(this.daySelectorWindow,this.doneBtn);
this.daySelectBtn=this.context.find(".daySelectionBtn").monobind("click",$.proxy(this.onclick_openDaySelector,this));
this.timeSelectBtn.monobind("click",$.proxy(this.onclick_openTimeSelector,this));
this.daySelectBtn.monobind("click",$.proxy(this.onclick_openDaySelector,this));
this.timeSelect=this.context.find(".timeSelection").monobind("click",$.proxy(this.onclick_openTimeSelector,this));
this.context.find(".daySelection").monobind("click",$.proxy(this.onclick_openDaySelector,this));
if(!this.timeSelector){var b={};
var a=this.model.get("timeEventTriggers")||[];
b={hour:12,minute:0};
if(a.length){b={hour:a[0].hour,minute:a[0].minute}
}this.timeSelector=new DL.Dashboard.Views.Programs.TimeSelector(this.context.find(".btnColContainer"),b);
this.timeSelectorWindow.find(".doneBtn").monobind("click",$.proxy(this.onclick_timeSelected,this));
this.timeSelect.html(this.timeSelector.collectTimeValues())
}this.populateData()
},populateData:function(){var c=this.model.get("timeEventTriggers");
if(c){var b=DL.Dashboard.Views.Programs.DaySelector.prototype.dayMap,a=this.daySelectorWindow.find(".allDays"),d=[];
if(c.length==7){d.push("Every day");
this.daySelectorWindow.find("a").addClass("active")
}else{d=_.map(c,function(e){a.find('a[data-value="'+e.dayOfWeek+'"]').addClass("active");
return b[e.dayOfWeek]
})
}this.context.find(".sentence").addClass("completed");
this.daySelectorWindow.find(".doneBtn").addClass("active");
this.context.find(".daySelection").html(d.join(", "));
DL.Dashboard.Views.Programs.DaySelector.prototype.createSentence(this.context);
$.proxy(DL.Dashboard.Views.ProgramsCreate.prototype.setSectionComplete(this.context.parents(".col:first")),DL.Dashboard.Views.ProgramsCreate)
}},openTimeSelector:function(){if(!this.timeSelectorWindow.data("isOpen")&&!this.daySelectorWindow.data("isOpen")){var e=this,c=e.timeSelectBtn.parents(".sentence:first"),a=e.timeSelectBtn.position(),d=e.timeSelectBtn.outerWidth(true),b=c.find(".timeSelection"),h=b.position(),g=b.outerWidth(true),f;
if(b.css("display")=="block"){f=h.left+Math.round(g/2)-10
}else{if(a){f=a.left+Math.round(d/2)-10
}}if(!this.timeSelectorWindow.data("isOpen")){this.timeSelectorWindow.slideDown();
e.timeSelectorWindow.data("isOpen",true);
e.timeSelectorWindow.prepend($("<span/>",{"class":"indicatorArrow"}));
e.timeSelectorWindow.find(".indicatorArrow").css({left:""+f+"px"});
$(".thinGreyScrollbar",e.context).jScrollPane({showArrows:true,verticalDragMaxHeight:40})
}}},closeTimeSelector:function(){if(this.timeSelectorWindow.data("isOpen")){var a=this;
this.timeSelectorWindow.slideUp(function(){a.timeSelectorWindow.data("isOpen",false);
a.timeSelectorWindow.find(".indicatorArrow").remove();
a.timeSelectBtn.css({display:"none"});
a.timeSelect.css({display:"inline-block"});
a.timeSelect.html(a.timeSelector.collectTimeValues());
a.daySelectBtn.addClass("active");
a.daySelector.setTimeEventTriggers(a.context,a.model,a.timeSelector)
})
}},openDaySelector:function(){if(!this.daySelectorWindow.data("isOpen")&&!this.timeSelectorWindow.data("isOpen")){var e=this,c=e.daySelectBtn.parents(".sentence:first"),f=c.position(),a=e.daySelectBtn.position(),d=e.daySelectBtn.outerWidth(true),b=c.find(".daySelection"),h=b.position(),g=b.outerWidth(true);
if(b.css("display")=="block"){arrowX=h.left+Math.round(g/2)-10
}else{arrowX=a.left+Math.round(d/2)-10
}if(!this.daySelectorWindow.data("isOpen")){this.daySelectorWindow.slideDown(function(){e.daySelectorWindow.data("isOpen",true);
e.daySelectorWindow.prepend($("<span/>",{"class":"indicatorArrow"}));
e.daySelectorWindow.find(".indicatorArrow").css({left:""+arrowX+"px"});
$(".thinGreyScrollbar",e.context).jScrollPane({showArrows:true,verticalDragMaxHeight:40})
})
}}},closeDaySelector:function(){if(this.daySelectorWindow.data("isOpen")){var a=this;
this.daySelectorWindow.slideUp(function(){a.daySelectorWindow.data("isOpen",false);
a.daySelectorWindow.find(".indicatorArrow").remove();
a.daySelectBtn.css({display:"none"});
a.context.find(".daySelection").css({display:"block"}).html(a.daySelector.collectDayValues());
a.daySelector.setTimeEventTriggers(a.context,a.model,a.timeSelector);
DL.Dashboard.Views.ProgramsCreate.prototype.setSectionComplete(a.context.parents("li:first"))
})
}},onclick_timeSelected:function(a){a.preventDefault();
this.closeTimeSelector()
},onclick_openTimeSelector:function(a){a.preventDefault();
this.openTimeSelector()
},onclick_daysSelected:function(a){a.preventDefault();
if($(a.currentTarget).hasClass("active")){this.closeDaySelector()
}},onclick_openDaySelector:function(a){a.preventDefault();
this.openDaySelector()
}});
DL.Dashboard.Views.Programs.TimeSelector=function(a,b){this.element=a;
this.timeObj=b||{};
this.hourToggleBox=this.element.find(".hours");
this.minuteToggleBox=this.element.find(".minutes");
this.amPmToggleBox=this.element.find(".ampm");
this.init()
};
DL.Dashboard.Views.Programs.TimeSelector.prototype={hourMax:12,hourMin:1,minuteMax:55,minuteMin:0,minuteIncrement:5,hourToggleBox:null,minuteToggleBox:null,amPmToggleBox:null,collectTimeValues:function(){return this.hourToggleBox.find("input").val()+":"+this.minuteToggleBox.find("input").val()+" "+this.amPmToggleBox.find("input").val()
},getHour24:function(){var a=parseInt(this.hourToggleBox.find("input").val());
if(this.amPmToggleBox.find("input").val()=="PM"&&a!=12){a+=12
}else{if(this.amPmToggleBox.find("input").val()=="AM"&&a==12){a=0
}}return a
},getMinute:function(){return parseInt(this.minuteToggleBox.find("input").val())
},initHourBox:function(){var a=this.hourToggleBox.find('input[name="inputHourSelect"]');
if(this.timeObj.hour>=0){a.val(this.timeFormat(this.timeObj.hour,"h"))
}function b(d){d.preventDefault();
var c=$(d.currentTarget).attr("data-action"),f=parseInt(a.val(),10);
if(c=="increase"){if(f<this.hourMax){a.val(++f)
}else{if(f==this.hourMax){a.val(this.hourMin)
}}}else{if(c=="decrease"){if(f>this.hourMin){a.val(--f)
}else{if(f==this.hourMin){a.val(this.hourMax)
}}}}}this.hourToggleBox.find("a.upArrowBtn, a.downArrowBtn").monobind("click",$.proxy(b,this))
},initMinuteBox:function(){var a=this.minuteToggleBox.find('input[name="inputMinuteSelect"]');
if(this.timeObj.minute>=0){a.val(this.timeFormat(this.timeObj.minute,"m"))
}function b(f){f.preventDefault();
var d=$(f.currentTarget).attr("data-action"),g=parseInt(a.val(),10),c=g;
if(d=="increase"){if(g<this.minuteMax){c=g+this.minuteIncrement
}else{if(g==this.minuteMax){c=this.minuteMin
}}}else{if(d=="decrease"){if(g>this.minuteMin&&g>0){c=g-this.minuteIncrement
}else{if(g==this.minuteMin){c=this.minuteMax
}}}}if(c<10){c="0"+c
}a.val(c)
}this.minuteToggleBox.find("a.upArrowBtn, a.downArrowBtn").monobind("click",$.proxy(b,this))
},initAmPmBox:function(){var a=this.amPmToggleBox.find('input[name="inputAMPMSelect"]');
if(this.timeObj.hour>=0){a.val((this.timeObj.hour>=12)?"PM":"AM")
}function b(c){c.preventDefault();
if(a.val().toLowerCase()=="am"){a.val("PM")
}else{a.val("AM")
}}this.amPmToggleBox.find("a.upArrowBtn, a.downArrowBtn").monobind("click",$.proxy(b,this))
},timeFormat:function(a,c){if(c=="h"){if(a>12){a-=12
}else{if(a==0){a=12
}}return a
}else{var b=a+"";
while(b.length<2){b="0"+b
}return b
}},getTimeObject:function(){return{hour:this.getHour24(),minute:this.getMinute()}
},init:function(){if(this.hourToggleBox){this.initHourBox()
}if(this.minuteToggleBox){this.initMinuteBox()
}if(this.amPmToggleBox){this.initAmPmBox()
}}};
DL.Dashboard.Views.Programs.DaySelector=function(b,a){this.element=b;
this.doneBtn=a;
this.init()
};
DL.Dashboard.Views.Programs.DaySelector.prototype={allDays:null,dayMap:{0:"Sunday",1:"Monday",2:"Tuesday",3:"Wednesday",4:"Thursday",5:"Friday",6:"Saturday"},collectDayValues:function(){var g=[],e=this.element.find(".active");
for(var b=0,a=e.length;
b<a;
b++){var c=$(e[b]),f=c.hasClass("expanded"),d=c.hasClass("doneBtn");
if(!d&&!f){g.push(c.attr("data-fullname"))
}}if(g.length==7){return"Every day"
}return g.join(", ")
},getSelectedDaysOfWeek:function(){var a=_.map($(".allDays .inline.active"),function(b){return parseInt($(b).attr("data-value"))
});
return(a.length==7)?[]:a
},setTimeEventTriggers:function(f,d,b){var a=b.getHour24();
var e=b.getMinute();
var g=this.getSelectedDaysOfWeek();
if(!g.length){g=_.map(DL.Dashboard.Views.Programs.DaySelector.prototype.dayMap,function(k,h){return Number(h)
})
}var c=_.map(g,function(h){return{month:0,minute:e,hour:a,dayOfWeek:h,date:0}
});
d.set({timeEventTriggers:c});
this.createSentence(f)
},createSentence:function(c){var b=c.find(".timeSelection").text(),d=c.find(".daySelection").text(),a=c.siblings(".stepText").children("p");
a.html("At <span>"+b+"</span> on "+d)
},onclick_day:function(h){h.preventDefault();
var g=$(h.currentTarget),d=this,c=false,f=0;
g.toggleClass("active");
if(g.hasClass("expanded")){if(g.hasClass("active")){_.each(this.allDays,function(e){$(e).addClass("active")
})
}else{_.each(this.allDays,function(e){$(e).removeClass("active")
})
}}for(var b=0,a=this.allDays.length;
b<a;
b++){f=this.element.find(".allDays .smallBtn.inline.active");
if(f.length==7){this.element.find(".allDays .smallBtn.expanded").addClass("active")
}else{this.element.find(".allDays .smallBtn.expanded").removeClass("active")
}if($(this.allDays[b]).hasClass("active")){c=true;
break
}else{isACtive=false
}}c?d.doneBtn.addClass("active"):d.doneBtn.removeClass("active")
},init:function(){this.allDays=this.element.find(".allDays .smallBtn");
this.allDays.monobind("click",$.proxy(this.onclick_day,this))
}};
DL.Dashboard.Views.Programs=window.DL.Dashboard.Views.Programs||{};
DL.Dashboard.Views.Programs.DevicePropertySelector=Backbone.View.extend({initialize:function(){this.model=this.options.model;
this.context=this.options.context;
this.isManagedObjectSelector=this.options.isManagedObjectSelector||false;
this.isMultiple=this.options.isMultiple||false;
this.wrap=this.context.parents("li:first");
this.allowMultiple=this.options.allowMultiple||false;
this.startsBlank=this.options.startsBlank||false;
this.programType=$("#main").hasClass("activity")||$("#main").hasClass("schedule");
this.deviceSelectWindow=this.context.find(".deviceSelection");
this.deviceSelectionBtn=this.context.find(".deviceSelectionBtn");
this.actionSelectWindow=this.context.find(".actionSelection");
this.actionSelectionBtn=this.context.find(".actionSelectionBtn");
this.optionSelector=this.wrap.find(".optionSelector").monobind("click",$.proxy(this.onclick_optionSelector,this));
this.deviceSelectionBtn.monobind("click",$.proxy(this.onclick_deviceSelection,this));
this.actionSelectionBtn.monobind("click",$.proxy(this.onclick_actionSelection,this));
this.context.find(".dvcSelection").monobind("click",$.proxy(this.onclick_deviceSelection,this));
this.context.find(".dvcAction").monobind("click",$.proxy(this.onclick_actionSelection,this));
this.render()
},render:function(){var b=this.isMultiple?true:false,d=this;
new DL.Dashboard.Views.Programs.InModalDeviceList({el:d.context.find(".optModal .deviceList"),collection:DL.Dashboard.groups,containsList:b,isManagedObjectSelector:d.isManagedObjectSelector||false,context:d.context,owner:d});
this.context.find(".device").monobind("click",function(f){f.preventDefault();
d.onclick_deviceInList(f,$(f.currentTarget))
});
if(d.model.get("editing")&&!this.startsBlank){var a=$("#step2"),c=a.find(".intContent");
d.populateData(function(){if(d.programType){d.toggleOptionSelector();
c.each(function(){var e=$(this);
d.initDeleteAction(e)
})
}d.createSentence()
})
}},setModel:function(b){var a=this.model.get("deviceEventTrigger");
if(a){if(b.deviceGUID){a.deviceGUID=b.deviceGUID
}if(b.eventId){a.eventId=b.eventId
}if(b.oidValue){a.oidValue=b.oidValue
}if(b.oid){a.oid=b.oid
}if(b.type){a.type=b.type
}this.model.set({deviceEventTrigger:a})
}},setModelWithProperties:function(){var a=this.wrap.find(".sentence.completed"),b=[];
if(a.length<1){DL.Dashboard.Views.ProgramsCreate.prototype.setSectionIncomplete(this.wrap);
return
}_.each(a,function(c){var e=$(c),d=e.find(".dvcAction");
b.push({value:d.attr("data-value"),deviceGUID:e.find(".dvcSelection").attr("data-selected-device"),mobjectId:d.attr("data-mobj-id")})
});
this.model.set({deviceActions:b})
},populateData:function(e){var g=this.model.get("deviceEventTrigger"),l=this.model.get("deviceActions"),p=true,q=this;
function r(t){q.requestCodes(g.deviceGUID,function(u){_.each(u,function(v){if(v.isSet&&v.doorLockCodeId==g.oidValue){t(v.nickname)
}})
})
}function h(z,u,B,v,C){B=B?B.toLowerCase():"";
if(z&&u){for(var y=0,x=z.length;
y<x;
y++){var D=z[y];
if(D.eventId&&D.eventId==u){if(D.oid){var t=q.getDeviceEventsOrActions(s,d,true),w=q.widgetMap[u+D.oid],A=false;
if(!w){C(D);
return
}_.each(t,function(E){if(E.oid===D.oid&&E.eventId==u){switch(w){case"ThresholdSelector":E.appendedValue=DL.Common.convertToFahrenheit(v.getMObjectById(D.oid).get("value"))+"&deg;";
C(E);
A=true;
return false;
case"CodeSelector":r(function(F){E.appendedValue=F;
C(E);
A=true;
return false
})
}}});
if(A){return
}}else{C(D);
return
}}else{if(!D.eventId&&D.oid==u){if(!D.value){D.eventActionLabel=D.eventActionLabel+" "+DL.Common.convertToFahrenheit(B)+"&deg;";
D.value=B;
C(D);
return
}else{if(D.eventActionLabel.toLowerCase()==B||D.value==B){C(D);
return
}}}}}C()
}}if(g&&!this.isManagedObjectSelector){var b=DL.Dashboard.getDeviceFromDeviceId(g.deviceGUID);
function n(u){if(u){var v=u.eventActionLabel,t=u.appendedValue||"";
if(v.indexOf("%oid")>-1){v=v.replace("%oid",t)
}else{v=v+(t?" "+t:t)
}q.context.find(".dvcSelection").html(b.get("label")).addClass("selectedDevice_"+s);
q.context.find(".dvcAction").html(v).addClass("active").monobind("click",$.proxy(q.onclick_actionSelection,q));
q.setDevicePropertyOrActions(a,b.get("deviceUid"));
q.context.find(".sentence").addClass("completed")
}else{p=false;
$.proxy(DL.Dashboard.Views.ProgramsCreate.prototype.setSectionIncomplete(q.wrap,true),DL.Dashboard.Views.ProgramsCreate)
}}if(b){var s=b.get("deviceClassId"),d=b.get("deviceSubClassId"),a=this.getDeviceEventsOrActions(s,b.get("deviceSubClassId"),true);
if(g.oidValue&&_.isNaN(parseInt(g.oidValue,10))){n(g)
}else{h(a,g.eventId,null,b,n)
}}else{p=false;
$.proxy(DL.Dashboard.Views.ProgramsCreate.prototype.setSectionIncomplete(this.wrap,true),DL.Dashboard.Views.ProgramsCreate);
return
}}else{if(l&&this.isManagedObjectSelector){var m=this.wrap.find(".intContent");
this.wrap.find(".sentence").addClass("completed");
if(m.length<=l.length){var f=l[m.length-1],b=DL.Dashboard.devices.get(f.deviceGUID);
if(b){var o=b.get("deviceClassId"),k=b.get("deviceSubClassId"),c=this.getDeviceEventsOrActions(o,k,false);
h(c,f.mobjectId,f.value,b,function(t){if(t){var v=DL.Dashboard.Main.scrubClassNames("dvcSelection",q.context.find(".dvcSelection"));
q.context.find(".dvcAction").addClass("active").monobind("click",$.proxy(q.onclick_actionSelection,q));
v.attr("data-selected-device",f.deviceGUID).addClass("selectedDevice_"+o).html(b.get("label"));
q.context.find(".dvcAction").attr("data-mobj-id",f.mobjectId).attr("data-value",t.value).html(t.eventActionLabel);
q.setDevicePropertyOrActions(q.getDeviceEventsOrActions(o,k),f.deviceGUID,q.context);
q.context.find(".sentence").addClass("completed");
if(m.length+1<=l.length){var u=q.context.clone();
u.insertBefore(q.context.next());
new DL.Dashboard.Views.Programs.DevicePropertySelector({context:u,allowMultiple:true,isMultiple:true,isManagedObjectSelector:q.isManagedObjectSelector,model:q.model})
}}else{p=false;
$.proxy(DL.Dashboard.Views.ProgramsCreate.prototype.setSectionIncomplete(q.wrap,true),DL.Dashboard.Views.ProgramsCreate)
}})
}else{p=false;
$.proxy(DL.Dashboard.Views.ProgramsCreate.prototype.setSectionIncomplete(this.wrap,true),DL.Dashboard.Views.ProgramsCreate)
}}}}if(e&&p){$.proxy(DL.Dashboard.Views.ProgramsCreate.prototype.setSectionComplete(this.wrap),DL.Dashboard.Views.ProgramsCreate);
e()
}},openDeviceSelector:function(){var e=this,c=e.deviceSelectionBtn.parents(".sentence:first"),a=e.deviceSelectionBtn.position(),d=e.deviceSelectionBtn.outerWidth(true),b=c.find(".dvcSelection"),h=b.position(),g=b.outerWidth(true),f=e.deviceSelectWindow.find(".indicatorArrow");
if(b.css("display")=="block"){arrowX=h.left+Math.round(g/2)-10
}else{arrowX=a.left+Math.round(d/2)-10
}if(!this.actionSelectWindow.data("isOpen")){this.resetPropertySelector();
this.deviceSelectWindow.slideDown();
e.deviceSelectWindow.data("isOpen",true);
if(f.length<1){e.deviceSelectWindow.prepend($("<span/>",{"class":"indicatorArrow"}));
e.deviceSelectWindow.find(".indicatorArrow").css({left:arrowX})
}else{f.css({left:arrowX})
}$(".thinGreyScrollbar",e.context).jScrollPane({showArrows:true,verticalDragMaxHeight:40})
}},widgetMap:{"10921254":"CodeSelector","10931254":"CodeSelector","10401041":"ThresholdSelector","10411042":"ThresholdSelector","10421041":"ThresholdSelector","1034":"ThresholdSelector","1035":"ThresholdSelector"},setDevicePropertyOrActions:function(c,g,d){var f=this,a=[],d=d||this.context,e=d.find(".actionSelection .controlSect"),h=DL.Dashboard.getTemplate("programs/devicePropertySelectButton");
function b(l,k){if(k=="ThresholdSelector"&&f.model.get("editing")){return DL.Common.convertToFahrenheit((f.model.get("deviceActions")[0].value))
}return l.value
}_.each(c,function(o){var r=(f.isManagedObjectSelector)?o.oid:o.eventId+o.oid,n=f.widgetMap[r]||"none",m=o.oidValue?o.oidValue:(o.value)?o.value:"",s=o.eventActionLabel,q=s;
if(n==="ThresholdSelector"){var l=DL.Dashboard.getDeviceFromDeviceId(g);
var k=DL.Common.getTempLimits(l,o.eventId,o.oid);
var t=k.base;
q=s.replace("%oid",t+"&deg;")
}var p=$.tmpl(h,{label:q});
p.find("a").attr({"data-deviceId":g,"data-type":o.type,"data-oid":o.oid,"data-selector":n});
if(f.isManagedObjectSelector){p.find("a").attr({"data-event-value":b(o,n),"data-event":o.oid})
}else{p.find("a").attr({"data-event":o.eventId,"data-oid-value":m,"data-prefix":o.widgetPrefix,"data-originalLabel":s})
}a.push(p.wrap("<div>").parent().html())
});
e.html(a.join(""));
e.find(".event a").monobind("click",$.proxy(this.onclick_propertyInList,this))
},transitionToSelector:function(a,b){a.find("ul.controlSect").animate({left:-420},420,"swing",b)
},transitionFromSelector:function(a,b){a.find("ul.controlSect").animate({left:0},420,"swing",b)
},requestCodes:function(f,a){var e=DL.Dashboard.devices.get(f);
var b=e.get("doorLockCodes");
if(b&&b!="undefined"){this.doorlockCodes=b;
a(b);
return
}var d=this,c=DL.ServerSecurePath+DL.ContextUrl+"/secure/services/devices/doorlock/codes/"+DL.Dashboard.gwid+"/"+f+".json";
DL.Dashboard.Main.Ajax(c,function(g){d.doorlockCodes=g.responseMessage.content;
if(a){a(g.responseMessage.content)
}},function(){},{type:"GET"})
},createCodeSelector:function(d){var c=this,a=false;
function b(){c.transitionToSelector(c.context);
new DL.Dashboard.Views.Programs.CodeSelector({context:c.context,codes:c.doorlockCodes,prefix:d.attr("data-prefix"),complete:$.proxy(function(e){c.transitionFromSelector(c.context,function(){var f={oid:d.attr("data-oid"),type:"ADD_OID_TO_RULE",eventId:d.attr("data-event"),oidValue:e.oidValue};
c.selectProperty(f.eventId,d.text()+" "+e.nickname,f)
})
},c)})
}if(!this.doorlockCodes){if(!a){a=true;
d.addClass("loading");
this.requestCodes(d.attr("data-deviceId"),function(e){d.removeClass("loading");
a=false;
c.doorlockCodes=e;
b()
})
}}else{b()
}},createThresholdSelector:function(g){var d=this,f=g.text(),a=g.attr("data-event"),c=g.attr("data-oid"),e=g.attr("data-deviceId"),b=DL.Dashboard.getDeviceFromDeviceId(e);
this.transitionToSelector(this.context);
new DL.Dashboard.Views.Programs.ThresholdSelector({eventId:a,oid:c,device:b,prefix:g.attr("data-prefix"),context:d.context,complete:$.proxy(function(h){g.html(d.combineDegreesStr(f,h));
d.transitionFromSelector(d.context,function(){var k={oidValue:DL.Common.convertToXDegrees(h),oid:c},l=g.attr("data-event");
if(!d.isManagedObjectSelector){k=_.extend(k,{eventId:l,type:"SET_OID_SIMULTANEOUSLY"})
}d.selectProperty(l,g.html(),k)
})
},d)})
},combineDegreesStr:function(a,d){var c=a;
if(c.indexOf("%oid")>0){c=c.replace("%oid",d);
return c+"&deg;"
}else{var e=c.lastIndexOf(" "),b=c.slice(e,c.length);
if(isNaN(parseInt(b,10))){return c+" "+d+"&deg;"
}else{c=c.replace(b," "+d+"&deg;");
return c
}}},getDeviceEventsOrActions:function(c,d,b){var a=b?DL.Dashboard.programsConfig.events:DL.Dashboard.programsConfig.actions;
var e=_.reduce(a,function(f,h,g){if(g===c||g===c+d||(g==="ANY_DEVICE"&&c==="ANY_")){f=f.concat(h)
}return f
},[]);
return e
},selectDevice:function(a,c,d,b){var e=this;
if(!this.isManagedObjectSelector){this.setModel({deviceGUID:a})
}this.deviceSelectWindow.slideUp(function(){var f=DL.Dashboard.Main.scrubClassNames("dvcSelection",e.context.find(".dvcSelection"));
e.deviceSelectionBtn.css({display:"none"});
e.deviceSelectWindow.data("isOpen",false);
e.deviceSelectWindow.find(".indicatorArrow").remove();
f.html(d).addClass("selectedDevice_"+c).attr("data-selected-device",a);
f.css({display:"block"});
e.actionSelectionBtn.addClass("active");
e.setDevicePropertyOrActions(b,a);
$.proxy(DL.Dashboard.Views.ProgramsCreate.prototype.setSectionIncomplete(e.wrap),DL.Dashboard.Views.ProgramsCreate)
})
},resetPropertySelector:function(){this.context.find(".dvcAction").css({display:"none"}).html("").data({value:"","mobj-id":""});
this.actionSelectionBtn.css({display:"block"}).removeClass("active");
this.context.find(".sentence").removeClass("completed")
},openPropertySelector:function(){var e=this,c=e.actionSelectionBtn.parents(".sentence:first"),a=e.actionSelectionBtn.position(),d=e.actionSelectionBtn.outerWidth(true),b=c.find(".dvcAction"),g=b.position(),f=b.outerWidth(true);
if(b.css("display")=="block"){arrowX=g.left+Math.round(f/2)-10
}else{arrowX=a.left+Math.round(d/2)-10
}this.actionSelectWindow.slideDown();
e.actionSelectWindow.data("isOpen",true);
e.actionSelectWindow.prepend($("<span/>",{"class":"indicatorArrow"}));
e.actionSelectWindow.find(".indicatorArrow").css({left:arrowX})
},selectProperty:function(g,e,d){var a=this.context.find(".dvcAction"),f=this.wrap.find(".error"),c=f.find("span b").html(),b=this;
a.html(e).addClass("selected");
if($(a).siblings(".dvcSelection").html()==c){f.remove()
}this.actionSelectWindow.slideUp(function(){b.actionSelectWindow.find(".indicatorArrow").remove();
b.actionSelectionBtn.css({display:"none"});
b.actionSelectionBtn.css({background:""});
b.actionSelectWindow.data("isOpen",false);
a.css({display:"block"});
DL.Dashboard.Views.ProgramsCreate.prototype.setSectionComplete(b.context.parents("li:first"));
b.actionSelectionBtn.parents(".sentence").addClass("completed");
b.toggleOptionSelector();
b.createSentence();
if(b.isManagedObjectSelector){if(typeof d==="object"){if(d.oidValue){d=d.oidValue
}else{if(d.eventId&&!d.value){d=d.eventId
}else{d=d.value
}}}a.attr("data-value",d).attr("data-mobj-id",g);
b.setModelWithProperties()
}else{d.eventId=g;
b.setModel(d)
}})
},createSentence:function(){var c=[],a=this.wrap.find(".stepText"),b=this;
_.each(this.wrap.find(".sentence"),function(d){d=$(d);
if(b.isManagedObjectSelector){var e="<p>the <span>"+d.find(".dvcSelection").text()+"</span> will "+d.find(".dvcAction").text().toLowerCase()+"</p>"
}else{var e="<p>When the <span>"+d.find(".dvcSelection").text()+"</span> "+d.find(".dvcAction").text().toLowerCase()+"</p>"
}c.push(e)
});
a.html(c.join(""))
},resetSelector:function(a){a.find(".dvcSelection,.dvcAction,.deviceSelection,.actionSelection").css({display:"none"});
a.find(".deviceSelectionBtn").addClass("active").css({display:"block"});
a.find(".actionSelectionBtn").removeClass("active").css({display:"block"});
a.find(".sentence").removeClass("completed");
return a
},insertAdditionalSelector:function(){var a=this.resetSelector(this.context.clone());
a.find(".sentence .dvcSelection").html("").data("selected-device","").removeClass(function(b,c){return(c.match(/\bselectedDevice_\S+/g)||[]).join(" ")
});
a.find(".sentence .dvcAction").html("").data({value:"","mobj-id":""});
a.insertBefore(this.optionSelector);
new DL.Dashboard.Views.Programs.DevicePropertySelector({context:a,allowMultiple:true,isMultiple:true,isManagedObjectSelector:this.isManagedObjectSelector?true:false,startsBlank:true,model:this.model});
this.toggleOptionSelector();
this.initDeleteAction(a)
},initDeleteAction:function(a){var c=this.wrap.find(".sentence"),d=c.eq(0),e=a.find(".closeBtn"),b='<a class="closeBtn" href="#">Close</a>';
if(c.length>1&&d.find(".closeBtn").length<1){d.append($(b));
d.find(".closeBtn").monobind("click",$.proxy(this.onclick_removeSelector,this))
}if(a.find(".closeBtn").length==0){a.find(".sentence").append($(b));
a.find(".closeBtn").monobind("click",$.proxy(this.onclick_removeSelector,this))
}e.monobind("click",$.proxy(this.onclick_removeSelector,this))
},toggleOptionSelector:function(){var a=this.wrap.find(".intContent"),c=this;
function b(){var d=true;
for(var f=0,e=a.length;
f<e;
f++){var g=$(a[f]).find(".sentence");
if(!g.hasClass("completed")){d=false;
return d
}}return d
}if(b()&&this.allowMultiple&&a.length<5){this.optionSelector.removeClass("inactive").addClass("active").monobind("click",$.proxy(c.onclick_optionSelector,c))
}else{this.optionSelector.removeClass("active").addClass("inactive")
}},onclick_removeSelector:function(d){d.preventDefault();
var c=$(d.currentTarget),b=c.parents(".intContent:first"),a=this.wrap.find(".intContent").length;
thisIntCont=b.index()-1;
b.remove();
this.toggleOptionSelector();
this.createSentence();
--a;
if(a==1){this.wrap.find(".sentence .closeBtn").remove()
}this.setModelWithProperties()
},onclick_optionSelector:function(a){a.preventDefault();
this.insertAdditionalSelector()
},onclick_deviceSelection:function(a){if(a){a.preventDefault()
}if(!this.deviceSelectWindow.data("isOpen")){this.openDeviceSelector()
}},onclick_actionSelection:function(b){b.preventDefault();
var a=$(b.currentTarget);
if(a.hasClass("active")||a.hasClass("selected")){this.openPropertySelector()
}},onclick_propertyInList:function(h){h.preventDefault();
var g=$(h.currentTarget);
var a=g.attr("data-selector");
var d=g.attr("data-oid"),b={type:g.attr("data-type"),oid:d};
switch(a){case"CodeSelector":this.createCodeSelector(g);
break;
case"ThresholdSelector":this.createThresholdSelector(g);
break;
default:var f=g.attr("data-event-value"),c=g.attr("data-event");
if(!this.isManagedObjectSelector){b.oidValue=g.attr("data-oid-value");
b.eventId=c
}else{b.value=f
}this.selectProperty(c,g.html(),b);
break
}},onclick_deviceInList:function(d,f){d.preventDefault();
var h=this,f=f||$(d.currentTarget),k=f.attr("data-class-id"),c=f.attr("data-id"),g=k.substr(0,4),b=k.substr(4),a=f.text(),l=h.getDeviceEventsOrActions(g,b,h.isManagedObjectSelector?false:true);
if(g&&a&&l){h.selectDevice(c,g,a,l)
}}});
DL.Dashboard.Views.Programs=window.DL.Dashboard.Views.Programs||{};
DL.Dashboard.Views.Programs.CheckList=Backbone.View.extend({initialize:function(){this.model=this.options.model;
this.context=this.options.context;
this.notificationsList=this.model.get("notifications");
this.eContactsList=[];
this.isLastStep=this.options.isLastStep||false;
this.contactSelectionWindow=this.context.find(".contactSelection");
this.contactSelectedList=this.context.find(".selectedContactsList");
this.contactSelectBtn=this.context.find(".contactSelectionBtn").monobind("click",$.proxy(this.onclick_contactSelection,this));
this.defaultAddContactText=this.context.find('.addContact input[type="text"]').val();
this.contactSelectionWindow.find(".doneBtn").monobind("click",$.proxy(this.onclick_doneBtn,this));
this.render()
},render:function(){var a=this;
if(a.model.get("editing")){this.getContacts(function(c){var d=[],b=[];
a.eContactsList=_.union(c,a.notificationsList);
_.each(a.eContactsList,function(f){var e=f.address.toString();
if(!_.contains(b,e)){b.push(e);
d.push(f)
}});
a.createContactList(d)
})
}else{this.getContacts(function(b){a.createContactList(b)
})
}},contacts:{},populateData:function(){var b=this,d=b.notificationsList,c=this.contactSelectionWindow.find(".contact a"),a=[];
_.each(d,function(f){var e=_.find(c,function(g){return !!~$(g).text().indexOf(f.address)
});
if(_.isObject(e)){e=$(e);
e.addClass("selected");
a.push(e)
}else{b.addContact(f.address)
}});
b.createSelectedContactList(a,b.contactSelectedList);
$.proxy(DL.Dashboard.Views.ProgramsCreate.prototype.setSectionComplete(this.context),DL.Dashboard.Views.ProgramsCreate)
},openSelectorDrawer:function(){var b=this,a=$(b.context).attr("id");
if(a=="step3"){b.context.find(".saveBtn").hide()
}if(!this.contactSelectionWindow.hasClass("open")){this.contactSelectBtn.monobind("click",$.proxy(this.onclick_doneBtn,this));
this.contactSelectionWindow.slideDown(function(){b.contactSelectionWindow.addClass("open");
b.context.find(".checkbox").monobind("click",$.proxy(b.onclick_contactInList,b));
b.context.find(".addButton").monobind("click",$.proxy(b.onclick_addContact,b));
b.context.find(".addContact input").keydown(function(c){if(c.keyCode==13){$.proxy(b.onclick_addContact,b)(c)
}});
b.context.find(".addContact input").monobind("focus",$.proxy(b.onfocus_addContactInput,b));
b.context.find(".addContactList").jScrollPane({autoReinitialise:true,showArrows:true,verticalDragMaxHeight:40})
});
b.contactSelectionWindow.not(".completed").prepend($("<span/>",{"class":"indicatorArrow"}))
}else{if(this.contactSelectionWindow.hasClass("open")&&this.isLastStep&&this.contactSelectionWindow.find(".contact a.selected").length>0){this.closeSelectorDrawer()
}}},createSelectedContactList:function(f,c){var d=this,e=[],b=d.model.attributes.type,a=d.context.find(".doneBtn");
if(b=="NOTIFICATION"){f.length>0?a.addClass("active"):a.removeClass("active")
}if(!this.isLastStep){_.each(f,function(g){g=$(g);
e.push("<li>"+g.text()+"</li>")
});
e=e.join("");
this.context.find(".stepText").html("<p>Send notifications to</p><ul>"+e+"</ul>");
c.css({display:"inline-block"}).html(e).monobind("click",$.proxy(this.onclick_contactSelection,this));
this.contactSelectBtn.hide()
}else{_.each(f,function(g){g=$(g);
e.push(g.text().split(": ")[1])
});
e=e.join(", ");
this.context.find(".contactSelectionBtn").text("Send notifications to "+e)
}},closeSelectorDrawer:function(){var c=this,b=[],a=$(c.context).attr("id");
if(a=="step3"){c.context.find(".saveBtn").show()
}if(this.contactSelectionWindow.hasClass("open")){this.contactSelectBtn.monobind("click",$.proxy(this.onclick_contactSelection,this));
this.contactSelectionWindow.slideUp(function(){c.contactSelectionWindow.removeClass("open");
c.contactSelectionWindow.find(".indicatorArrow").remove();
c.createSelectedContactList(c.context.find(".addContactList .selected"),c.contactSelectedList);
if(c.options.causeStepToComplete){DL.Dashboard.Views.ProgramsCreate.prototype.setSectionComplete(c.context)
}d=d.join("");
c.context.find(".stepText p ul").html(d);
c.contactSelectionWindow.addClass("completed");
c.context.find(".formError").remove();
c.context.find(".contactSelectionBtn").removeClass("edit");
if(d.length){c.context.find(".contactSelectionBtn").addClass("edit")
}});
var e=c.context.find("ul li .selected"),d=[];
_.each(e,function(h){h=$(h);
var g=h.text().split(": "),f=h.attr("data-type");
d.push("<li>"+$(h).text()+"</li>");
var k={address:g[1],type:f};
b.push(k)
});
this.model.set({notifications:b});
$.proxy(DL.Dashboard.Views.ProgramsCreate.prototype.setSectionComplete(this.context.parents(".col:first")),DL.Dashboard.Views.ProgramsCreate)
}},createContactList:function(b){if(b){var e=this.context.find(".addContactList"),a=[],d=this;
for(var c=0;
c<b.length;
c++){a.push(d.createLineItem(b[c].address,b[c].type))
}e.html(a.join(""));
if(d.model.get("editing")){d.populateData()
}}},testInput:function(a){if(a.indexOf("@")>-1){return/^([^.@]+)(\.[^.@]+)*@([^.@]+\.)+([^.@]+)$/.test(a)
}return false
},compareInput:function(a,e){for(var c=0,b=e.length;
c<b;
c++){var d=$(e[c]);
if(d.text().indexOf(a)>-1){return false
}}return true
},createLineItem:function(a,b){if(a&&b){return'<li class="contact"><a href="" data-type="'+b+'" class="email checkbox">'+b+": "+a+"</a></li>"
}},selectContact:function(a){var e=this,d=e.model.attributes.type,b=this.context.find(".doneBtn");
if(a.data("isSelected")){a.removeClass("selected").data("isSelected",false)
}else{a.addClass("selected").data("isSelected",true)
}if(d="NOTIFICATION"){var c=e.context.find(".selected");
if(c.length>0){b.addClass("active")
}else{b.removeClass("active");
this.context.removeClass("completed")
}}},addContact:function(d){var g=d?d:this.context.find('.addContact input[type="text"]').val();
if(g!=this.defaultAddContactText){var f=this.context.find(".addContactList");
if(this.compareInput(g,f.find("a"))&&this.testInput(g)){var e="EMAIL",c=$(this.createLineItem(g,e)),b=f.find(".jspPane"),a=c.find("a");
if(b){f=b
}f.prepend(c);
a.addClass("selected").monobind("click",$.proxy(this.onclick_contactInList,this));
this.selectContact(a);
this.context.find(".formError").remove();
this.context.find(".addContact input").val("")
}else{if(!this.compareInput(g,f.find("a"))&&this.testInput(g)){this.context.find(".formError").remove();
this.context.find(".contactSelection .addContact").after('<div class="formError">Duplicate email address. Please enter a unique email address.</div>')
}else{if(!d){this.context.find(".formError").remove();
this.context.find(".contactSelection .addContact").after('<div class="formError">Invalid email address. Please enter a unique email address.</div>')
}}}}else{this.context.find(".formError").remove()
}},getContacts:function(b){var a=this;
DL.Dashboard.Main.Ajax(DL.Dashboard.restURLs.getAllUserContacts,function(c){if(b){b(c.responseMessage.content)
}else{a.contacts=c.responseMessage.content;
return c.responseMessage.content
}a.contacts=c.responseMessage.content
},null,{type:"GET"})
},onclick_addContact:function(a){if(a){a.preventDefault()
}this.addContact()
},onclick_contactInList:function(a){a.preventDefault();
this.selectContact($(a.currentTarget))
},onclick_doneBtn:function(b){b.preventDefault();
var a=$(this.context).attr("id");
if(a=="step3"||($(b.currentTarget).hasClass("active")&&a!="step3")){this.closeSelectorDrawer()
}},onclick_contactSelection:function(a){if(a){a.preventDefault()
}this.openSelectorDrawer()
},onfocus_addContactInput:function(c){var a=$(c.currentTarget),b=this;
function d(){if(a.val()==""){a.val(b.defaultAddContactText);
b.context.find(".formError").remove()
}}a.val("").monobind("blur",d)
}});
DL.Dashboard.Views.Programs.InModalDeviceList=Backbone.View.extend({template:DL.Dashboard.getTemplate("programs/inModalDeviceList"),initialize:function(){this.collection=this.options.collection;
this.owner=this.options.owner;
this.context=this.options.context;
this.isManagedObjectSelector=this.options.isManagedObjectSelector||false;
this.render()
},render:function(){var b=this,c=this.getDevicesByProperty("ROOM");
function a(h){h.preventDefault();
var g=$(h.target),f=g.attr("data-switch").toUpperCase(),d="";
g.addClass("active");
g.siblings().removeClass("active");
if(f=="ROOM"){g.parent().removeClass("toggleSmAlt")
}else{g.parent().addClass("toggleSmAlt")
}b.getDevicesByProperty(f,function(e){d=b.buildDeviceLayout(e)
});
b.context.find(".jspPane:first").html(d);
$(".thinGreyScrollbar",b.context).jScrollPane({showArrows:true,verticalDragMaxHeight:40});
b.context.find(".device").monobind("click",$.proxy(DL.Dashboard.Views.Programs.DevicePropertySelector.prototype.onclick_deviceInList,b.owner))
}this.options.el.html(this.buildDeviceLayout(c));
this.context.find("a.switch").monobind("click",a)
},buildDeviceLayout:function(f){var d=[],c=this,a=DL.Dashboard.groups.SYSTEM?DL.Dashboard.groups.SYSTEM.models[0]:null;
if(a){var e=DL.Dashboard.devices.get(a.attributes.deviceIds[0]),b=DL.Dashboard.devices.get(a.attributes.deviceIds[1]);
d.push('<ul class="miniDeviceList">');
e.attributes.mod=b.attributes.mod="system";
if(!c.isManagedObjectSelector){d.push($("<div>").append($.tmpl(c.template,e.attributes)).html())
}d.push($("<div>").append($.tmpl(c.template,b.attributes)).html());
d.push("</ul>")
}_.each(f,function(h){var k="<h3>"+h.label+'</h3><ul class="miniDeviceList">',g=[];
_.each(h.devices,function(m){var n=m.get("deviceClassId");
var l=m.get("deviceSubClassId");
if(c.isManagedObjectSelector&&!(DL.Dashboard.programsConfig.actions[n]||DL.Dashboard.programsConfig.actions[n+l])){return
}else{if(!c.isManagedObjectSelector&&!(DL.Dashboard.programsConfig.events[n]||DL.Dashboard.programsConfig.events[n+l])){return
}}g.push($("<div>").append($.tmpl(c.template,m.attributes)).remove().html())
});
if(g.length>0){d.push(k,g.join(""),"</ul>")
}});
return d.join("")
},getDevicesByProperty:function(a,c){var b=this.loopDevicesByProperty(a);
if(c){c(b);
return
}return b
},loopDevicesByProperty:function(f){var h={},g=DL.Dashboard.groups[f].models;
for(var c=0,b=g.length;
c<b;
c++){var a=g[c].get("label"),d=g[c].get("deviceIds"),e=[];
_.each(d,function(l){var k=DL.Dashboard.devices.get(l);
if(k!=undefined){e.push(k)
}});
h[c]={label:a,devices:e}
}return h
}});
DL.Dashboard.Views.Program=Backbone.View.extend({tagName:"li",template:DL.Dashboard.getTemplate("programs/program"),boundListener:false,initialize:function(){if(this.options.isInCustomView){this.token=DL.PubSub.subscribe("programsrerender",$.proxy(this.render,this))
}this.container=$(this.options.container);
this.model=this.options.model;
this.className=this.options.className||"";
this.isInCustomView=this.options.isInCustomView||false;
this.el=$(this.el);
this.render()
},render:function(){if(this.timeout){this.timeout=null
}var a=parseInt(this.model.get("status"),10);
var b=_.find(DL.Dashboard.allSavedPrograms.models,function(e){return e.id==this.model.id
},this);
if(this.isCustomView||b||this.options.dropped){var d=this.model.toJSON();
var c=this.container.find('.dvcContainer[data-program-id="'+this.model.id+'"]');
d.status=a==2?"active":"inactive";
d.isInCustomView=this.isInCustomView;
if(c.length){c.replaceWith(this.el.html($.tmpl(this.template,d)))
}else{this.container.append(this.el.html($.tmpl(this.template,d)))
}this.initTileControls();
this.options.dropped=false
}else{this.removeProgramFromView()
}},initTileControls:function(){this.el.find("a.panelArrow").addClass("dvcControlsOpen");
this.el.find("a.panelArrow").monobind("click",$.proxy(this.onclick_toggleProgram,this));
this.el.find(".toggleBtn").monobind("click",$.proxy(this.onclick_toggleBtn,this));
this.el.find(".cta, .lrgBlueButton").monobind("click",$.proxy(this.onclick_runProgram,this));
this.el.find(".deleteButton").monobind("click",$.proxy(this.onclick_deleteButton,this));
this.el.find(".editButton").monobind("click",$.proxy(this.onclick_editProgram,this));
this.el.find('[data-action="refresh"]').monobind("click",$.proxy(this.onclick_refeshView,this))
},runProgram:function(a){DL.Dashboard.allSavedPrograms.run(a)
},deleteProgram:function(){DL.Dashboard.allSavedPrograms.destroy(DL.Dashboard.allSavedPrograms.getOne(this.model.id))
},editProgram:function(){DL.Dashboard.allSavedPrograms.edit(this.model.get("type"),this.model.id)
},updateProgram:function(a){DL.Dashboard.allSavedPrograms.update(this.model.id,a)
},removeProgramFromView:function(){var a=this;
this.closeProgramDrawer(this.el.find(".drawer"),function(){a.el.fadeOut(function(){a.el.remove()
})
})
},setPending:function(){var b=this.el.find(".dvcWrap");
var a=this.el.find(".titleData .cta");
var c=this;
b.addClass("pending");
a.hide().after('<p class="pendingSpinner">Pending...</p>')
},closeProgramDrawer:function(b,a){var c=this;
b.slideUp(function(){c.renderDrawerOpen=false;
if(a){a()
}})
},openProgramDrawer:function(b,a){var c=this;
b.slideDown(function(){c.renderDrawerOpen=false;
if(a){a()
}})
},onclick_toggleProgram:function(f){f.preventDefault();
f.stopPropagation();
var d=$(f.currentTarget),a=d.parents(".dvcContainer:first"),b=a.find(".programItemDropDown:first"),c=this;
if(a.data("isOpen")){this.closeProgramDrawer(b,function(){d.removeClass("dvcControlsClose").addClass("dvcControlsOpen");
a.data("isOpen",false)
})
}else{this.openProgramDrawer(b,function(){d.removeClass("dvcControlsOpen").addClass("dvcControlsClose");
a.data("isOpen",true)
})
}},onclick_toggleBtn:function(g){var f=$(g.currentTarget),d=f.parents("li:first"),a=d.hasClass("pending"),b=f.parents(".dvcContainer:first"),c=this;
if(!a){f.toggleClass("toggleOFF");
if(f.hasClass("toggleOFF")){this.updateProgram({status:"3"})
}else{this.updateProgram({status:"2"})
}this.closeProgramDrawer(b.find(".drawer"),function(){c.setPending(b)
})
}},onclick_runProgram:function(b){b.preventDefault();
var a=$(b.currentTarget).parents(".dvcContainer:first");
$(b.currentTarget).hide().after('<p class="pendingSpinner">Working...</p>');
setTimeout(function(){$(b.currentTarget).show().next(".pendingSpinner").remove()
},5000);
this.runProgram(a.attr("data-program-id"))
},onclick_deleteButton:function(g,b){g.preventDefault();
var d=this,f=$(g.currentTarget),a=f.parents(".dvcContainer:first"),c=new DL.Dashboard.ModalBase({template:"modals/programConfirmDelete",data:{title:"Confirm",message:"Are you sure you want to delete this program?",icon:"CLOCK"},customEvents:{"click .deleteModalAcceptButton":function(h){h.preventDefault();
c.close();
d.closeProgramDrawer(a.find(".programItemDropDown:first"),function(){d.deleteProgram();
d.setPending(a)
})
}}})
},onclick_editProgram:function(b){b.preventDefault();
var a=$(b.currentTarget).parents(".dvcContainer:first");
this.editProgram(a.attr("data-type"),a.attr("data-program-id"))
}});
DL.Dashboard.Views.ProgramsHome=Backbone.View.extend({template:DL.Dashboard.getTemplate("programs/programsHome"),initialize:function(){this.data={};
this.data.title="Your Active Programs";
this.data.headline="Here you can access your existing programs and create new ones.";
this.data.defaultText="Programs help your life run smoothly and are easy to create.";
this.data.cta="Create New Program";
this.el=$("#app");
this.main=$("#main");
if(!this.token){DL.PubSub.subscribe("programsrerender",$.proxy(this.renderPrograms,this))
}this.render()
},render:function(){var a='<div class="headSection"><h1>'+this.data.title+"</h1><p>"+this.data.headline+"</p></div>";
this.el.html("");
$("#hdrWrap").html(a);
this.main.attr("class","page-programs-home");
this.renderPrograms()
},renderPrograms:function(){var e=[],d=DL.Dashboard.allSavedPrograms.models.length>0;
if(!this.main.hasClass("page-programs-home")){return
}if(d){this.el.html($.tmpl($(this.template),{}));
var g=$('<a href="#" class="gbtn deleteButton">DELETE ALL PROGRAMS</a>');
this.el.append(g);
g.monobind("click",$.proxy(this.onclick_deleteAllPrograms,this));
var f=DL.Dashboard.allSavedPrograms.getActive(),e=DL.Dashboard.allSavedPrograms.getOnHold(),c=this;
if(f.length){var b=this.el.find(".column > ul");
var a=0;
_.each(b,function(h){$(h).html("")
});
_.each(f,function(h){h=new DL.Dashboard.Views.Program({container:b[a],model:h});
if(a==b.length-1){a=0
}else{a++
}})
}else{c.createDefaultText()
}}else{this.createDefaultText()
}this.programListPanel=new DL.Dashboard.Views.ProgramsListPanel()
},programErrorHandler:function(a){alert(a)
},createDefaultText:function(b){var a=b?b:"<p>"+this.data.defaultText+"</p><p>Select <a href='#programs/intro'>"+this.data.cta+"</a> to get started.</p>",c=$('<div id="activeProgramArea" class="defaultText active">'+a+"</div>");
c.attr("id","activeProgramArea").addClass("defaultText active").appendTo(this.el);
this.defaultText=c
},deleteAllPrograms:function(){DL.Dashboard.allSavedPrograms.destroyAll();
var b=this,c=b.el.find(".programsList .programTile"),a=b.el.find(".itemList .iconTile");
a.fadeOut(250);
c.fadeOut(250,function(){a.remove();
c.remove();
b.renderPrograms()
})
},onclick_deleteAllPrograms:function(c){c.preventDefault();
var b=this,a=new DL.Dashboard.ModalBase({template:"modals/allProgramsConfirmDelete",data:{title:"DELETE ALL PROGRAMS",message:"Are you sure you want to delete all active and on-hold programs? This action cannot be undone."},customEvents:{"click .deleteModalAcceptButton":function(d){d.preventDefault();
a.close();
b.deleteAllPrograms()
}}})
}});
DL.Dashboard.Views.ProgramsIntro=Backbone.View.extend({className:"programsView",template:DL.Dashboard.getTemplate("programs/programsIntro"),initialize:function(){this.model.title="Create Programs to Simplify Your Life";
this.model.headline="From getting a text when the kids come home to turning on lights when you unlock the door - you can create programs for many needs.",this.model.cta="Choose an option below to get started.";
this.render()
},render:function(){var a='<div class="headSection"><h1>'+this.model.title+"</h1><p>"+this.model.headline+"<span>"+this.model.cta+"</span></p></div>";
$("#main").attr("class","page-programs");
$("#hdrWrap").html(a);
this.el.html($.tmpl($(this.template),{}));
if($.browser.msie&&$.browser.version.substr(0,1)<=7){this.caret_ie7()
}return this
},events:{"click a.help-link":"onclick_showMeHow"},onclick_showMeHow:function(c){c.preventDefault();
var a=$(c.currentTarget).attr("data-type"),b=this;
this.modal=new DL.Dashboard.ModalBase({template:"programs/programsShowMeHowModal",withOverLay:false,afterOpen:function(d){d.find("a.started").monobind("click",function(){b.modal.close()
})
},data:{type:a,assetsPath:DL.AssetsSecureBasePath}})
},caret_ie7:function(){$(".cta").append("&nbsp;&rsaquo;")
}});
DL.Dashboard.Views.ProgramsCreate=Backbone.View.extend({className:"programsView ",templateName:"",stepViews:[],initialize:function(){var a=function(){};
this.editableProgram=this.options.editableProgram?$.extend(true,{},DL.Dashboard.allSavedPrograms.getOne(this.options.programId)):false;
this.isEditing=false;
if(this.editableProgram){this.isEditing=true
}this.section=this.programType=this.className=this.options.section.toLowerCase();
switch(this.section){case"notification":this.templateName="programsSetNotifications";
this.title="Set Up Notifications";
this.headline="Create a custom email or text alert to be notified when something happens in your home. Select what triggers a notification, choose whom to notify, then name and save it.";
a=$.proxy(this.initNotificationSteps,this);
break;
case"schedule":this.templateName="programsSetTask";
this.title="Schedule Tasks";
this.headline="Streamline your life by automating your house according to your schedule.";
a=$.proxy(this.initScheduleTaskSteps,this);
break;
case"connect":default:this.templateName="programsSetActivity";
this.title="Connect Activities";
this.headline="Make your day easier with connected activities-one activity triggers another to occur. Select your trigger and resulting activities below.";
a=$.proxy(this.initConnectedActivitySteps,this)
}this.render(a)
},render:function(h){var a=$("#main").attr("class","page-programs "+(!this.editableProgram?"create ":"")+this.section),g=$("#hdrWrap"),e=this;
this.template=new DL.Dashboard.getTemplate("programs/"+this.templateName);
g.html('<div class="headSection"><h1>'+this.title+"</h1><p>"+this.headline+'</p><a class="gbtn smRoundBtn cancelProgramCreate" href="#programs" data-quickhelp="Cancel without saving and return to Programs home">Cancel</a></div>');
this.el.html($.tmpl($(this.template)));
g.find(".cancelProgramCreate").monobind("click",function(k){k.preventDefault();
e.editableProgram=null;
DL.Common.onclick_forceNavigate(null,$(k.currentTarget))
});
if(this.editableProgram){var f=a.find(".col");
a.addClass("editing-program");
for(var d=0,c=f.length;
d<c;
d++){var b=$(f[d]);
b.addClass("editing");
b.find(".stepWrap").fadeIn(250)
}a.find(".editBtn").monobind("click",$.proxy(this.onclick_editStep,this))
}else{$(a.find("li.col .stepWrap")[0]).fadeIn(250)
}if(h){h()
}},initNotificationSteps:function(){var e=$("#step3"),d=this.editableProgram?this.editableProgram:new Backbone.Model();
if(this.editableProgram){d.set({editing:true})
}else{d.set({deviceActions:[],deviceEventTrigger:{},timeEventTriggers:[],notifications:[],type:"NOTIFICATION"})
}var c=new DL.Dashboard.Views.Programs.DevicePropertySelector({context:$("#step1 .intContent"),allowMultiple:false,model:d});
var b=new DL.Dashboard.Views.Programs.CheckList({context:$("#step2"),model:d,causeStepToComplete:true});
var a=new DL.Dashboard.Views.Programs.NotificationTimeSelector({context:e,model:d});
this.initNameAndSaveProgram(e,d)
},initScheduleTaskSteps:function(){var b=$("#step3"),a=this.editableProgram?this.editableProgram:new Backbone.Model();
if(this.editableProgram){a.set({editing:true})
}else{a.set({deviceActions:[],notifications:[],type:"SCHEDULE"})
}new DL.Dashboard.Views.Programs.BasicDateTimeSelector({context:$("#step1 .intContent"),model:a});
new DL.Dashboard.Views.Programs.DevicePropertySelector({context:$("#step2 .intContent"),isManagedObjectSelector:true,allowMultiple:true,model:a});
new DL.Dashboard.Views.Programs.CheckList({isLastStep:true,context:b,model:a});
this.initNameAndSaveProgram(b,a)
},initConnectedActivitySteps:function(){var b=$("#step3"),a=this.editableProgram?this.editableProgram:new Backbone.Model();
if(this.editableProgram){a.set({editing:true})
}else{a.set({deviceActions:[],deviceEventTrigger:{},notifications:[],type:"ACTIVITY"})
}new DL.Dashboard.Views.Programs.DevicePropertySelector({context:$("#step1 .intContent"),allowMultiple:false,model:a});
new DL.Dashboard.Views.Programs.DevicePropertySelector({context:$("#step2 .intContent"),isManagedObjectSelector:true,allowMultiple:true,model:a});
new DL.Dashboard.Views.Programs.NotificationTimeSelector({context:b,model:a});
new DL.Dashboard.Views.Programs.CheckList({isLastStep:true,context:b,model:a});
this.initNameAndSaveProgram(b,a)
},initNameAndSaveProgram:function(e,h){var A=this,t=h.attributes.notifications,v=[],b=e.find("#programNameField"),u=b.attr("value"),s=e.find(".completedTitle"),g=e.find(".stepText"),c=e.find("#saveProgram"),p=b.parents(".col:first"),q=e.find(".dateTimeSelector");
if(h.get("editing")){u=h.get("name");
s.html("Named: "+u);
if(e.find(".dateTimeSelector").length!=0){var a=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],d=[],y=[];
if(h.attributes.timeCondition.days!="undefined"&&(h.attributes.timeCondition.days.length>0)){var m=h.attributes.timeCondition.days;
_.each(m,function(B){d.push(a[B])
});
d=d.join(", ")
}else{d="everyday"
}if(h.attributes.timeCondition.timeRange!=undefined){var o=h.attributes.timeCondition.timeRange,f,l,n;
_.each(o,function(B){f=B.hour>=12;
l=(f&&B.hour!=12)?B.hour-12:B.hour;
n=(B.minute==0?"00":(B.minute>9?B.minute:"0"+B.minute));
if(l===0){l=12
}y.push(l+":"+n+" "+(f?"PM":"AM"))
});
y=y.join(" to ")
}else{y="all day"
}g.append("<p>Run "+d+"&nbsp;&nbsp;"+y+"</p>");
var w=e.find(".dateTimeSelectionBtn");
w.addClass("edit");
w.html('Run <span class="daysList">'+d+'</span><span class="timeList">&nbsp;&nbsp;'+y+"</span>");
q.find("a[data-goto=days]").addClass("done");
q.find("a[data-goto=days] .values").text(d);
q.find("a[data-goto=times]").addClass("done");
q.find("a[data-goto=times] .values").text(y)
}if(e.find(".contactSelection").length!=0){if(t.length!=0){_.each(t,function(B){v.push("<li>Send notifcation to "+B.address+"</li>")
});
v=v.join("");
g.append("<ul>"+v+"</ul>")
}else{g.append("<p>Please select a contact.</p>")
}}b.val(u);
$.proxy(DL.Dashboard.Views.ProgramsCreate.prototype.setSectionComplete(e),DL.Dashboard.Views.ProgramsCreate)
}function z(B){var C=e.data("wasCompleted");
if(C==null||(C==false&&b.val()=="New Notification")){b.val("")
}}function k(B){if(q&&q.data("isOpen")){return
}if($.trim(b.val())==""&&A.isEditing){b.val(u);
b.trigger("keyup")
}else{if($.trim(b.val())==""||b.val()==u&&!A.isEditing){b.val(u);
p.data("wasCompleted",false).removeClass("completed");
e.find("div.formError").remove()
}else{b.val($.trim(b.val()))
}}}function x(C){var B=/^[-A-Za-z0-9\-\' _]+$/;
if(q&&q.data("isOpen")){return
}var D=$.trim(b.val());
if(B.test(D)&&D.length<=25){p.addClass("completed").data("wasCompleted",true);
e.find("div.formError").remove();
e.find(".completedTitle").html("Named: "+D)
}else{if(e.find("div.formError").length<1){b.parent().after($("<div/>",{"class":"formError",html:"Maximum length is 25 characters. Letters, numbers, apostrophes, underscores, dashes or spaces only please."}))
}p.data("wasCompleted",false).removeClass("completed")
}if($.trim(b.val())==""){e.find("div.formError").remove()
}}function r(B){B.preventDefault();
A.checkForIncompleteSteps(p,function(){h.set({name:$.trim(b.val())});
var C=h.toJSON();
var E=false;
for(var F=0,D=C.deviceActions.length;
F<D;
F++){if(C.deviceActions[F].mobjectId==="1170"&&DL.Dashboard.devices.get(C.deviceActions[F].deviceGUID).get("deviceClassId").search("0701")==0){E=true;
break
}}if(E){var H=$(B.currentTarget),G=new DL.Dashboard.ModalBase({template:"modals/programArmDisarm",data:{title:"Program Confirmation",icon:"CLOCK"},customEvents:{"click .armModalAcceptButton":function(I){I.preventDefault();
G.close();
A.saveProgram(h)
}}})
}else{A.saveProgram(h)
}})
}b.monobind("focus",z).monobind("blur",k).monobind("keyup",x);
if(h.get("editing")){b.val(h.get("name"))
}c.monobind("click",r)
},checkForIncompleteSteps:function(c,a){var b=$("#app .columns").children(".col");
var d=_.filter(b,function(e){return !$(e).hasClass("completed")
});
if(d.length){this.transitionToNextStep(c,$(d[0]),true)
}else{a()
}},setSectionComplete:function(c){var a=this,b=c.find(".incomplete-error");
c.addClass("completed").find(".nextBtn").monobind("click",function(h){h.preventDefault();
var g=$(h.currentTarget),f=g.parents(".col:first"),k=f.find(".sentence").not(".completed").find(".dvcSelection").html(),d=f.find(".sentence").not(".completed").find(".dvcAction").data("value");
if(c.attr("id")!="saveProgram"&&!k&&!d){f.find(".error").remove();
a.transitionToNextStep(f,f.next())
}else{if(k&&d){a.setSectionError(f,k)
}}});
if(b){b.fadeOut(function(){b.remove()
})
}},setSectionIncomplete:function(c,b){var a=$("#main");
if(c){c.removeClass("completed");
if(b){this.isEditing=false;
c.removeClass("editing")
}}},setSectionError:function(a,b){a.find(".actionSelectionBtn").css({background:"#B30A3C"})
},setStepIncompleteError:function(c){var b=c.find(".incomplete-error");
if(b.length){return
}var a=$("<div/>").addClass("incomplete-error").html("<p>Please complete this step</p>");
c.find(".stepDir").append(a);
a.fadeIn()
},transitionToNextStep:function(c,a,b){var f=c.find(".stepWrap"),d=a.find(".stepWrap"),e=$(".completedTitle");
activeWidth=439,inactiveWidth=199,duration=250,me=this;
f.hide();
d.hide();
a.animate({width:activeWidth},{duration:duration,complete:function(){a.addClass("focused");
d.fadeIn(450);
if(b){me.setStepIncompleteError(a)
}if(a.find(".extField").css("display")=="block"){e.hide()
}else{e.show()
}}});
c.animate({width:inactiveWidth},{duration:duration,complete:function(){c.removeClass("focused");
f.fadeIn(100);
_.each($("#app li.col"),function(g){g=$(g);
g.find(".editBtn").monobind("click",$.proxy(me.onclick_editStep,me))
});
if(c.hasClass("last")){e.show()
}}})
},programsModalVerifying:{program:null,modal:null,open:function(a,c){if(c){var b=this;
b.modal=new DL.Dashboard.ModalBase({template:"programsModalVerifying",data:{title:'Verifying "'+a+'"',classToAdd:"verifying"},handleMessages:function(g,d){if(b.program){var f=d.MOID.split(".");
if(b.program.id==f[1]&&parseInt(f[2],10)===0){DL.PubSub.unsubscribe(b.token);
b.modal.close();
c.programsModalVerified(b.program)
}}},preInitialize:function(){b.token=DL.PubSub.subscribe("ongatewaymessagereceived",this.handleMessages)
},customEvents:{"click .closeButton":function(d){d.preventDefault();
b.modal.close();
window.location.hash="#programs";
DL.PubSub.unsubscribe(b.token)
}}})
}},close:function(){if(this.modal){this.modal.close()
}}},programsModalVerified:function(a){if(a){var c=this,b=new DL.Dashboard.ModalBase({template:"programsModalVerified",data:{classToAdd:"verified"},customEvents:{"click .runNowButton":function(f){f.preventDefault();
var d=$(f.currentTarget);
d.replaceWith('<p class="pendingSpinner">Pending...</p>');
DL.Dashboard.allSavedPrograms.run(a.id,function(){b.close();
c.programsModalDidItWork(a)
})
},"click .closeButton":function(d){d.preventDefault();
b.close();
window.location.hash="#programs"
}}})
}},programsModalDidItWork:function(a){var c=a.type=="notification"?"Did you receive a notification?":"Did it work?",b=new DL.Dashboard.ModalBase({template:"programsModalDidItWork",data:{title:c,classToAdd:"verified"},customEvents:{"click .changeIt":function(d){d.preventDefault();
b.close();
DL.Dashboard.allSavedPrograms.edit(a.type,a.id)
},"click .yes":function(d){d.preventDefault();
b.close();
window.location.hash="#programs"
}}})
},onclick_editStep:function(a){if(a){a.preventDefault()
}this.transitionToNextStep($("#app .col.focused"),$(a.currentTarget).parents(".col:first"))
},onclick_editTitle:function(c){if(c){c.preventDefault()
}var b=$(c.currentTarget),a=$(c.currentTarget).siblings(".intContent").find(".extField:first");
b.unbind("click",this.onclick_editTitle);
b.hide();
a.show();
a.children("input").focus()
},saveProgram:function(c){var b=DL.Dashboard.restURLs.postASpecificRule+this.programType+"/"+DL.Dashboard.gwid+".json",d=this,a=c;
if(this.editableProgram){c.unset("editing");
b=DL.Dashboard.restURLs.postASpecificRule+DL.Dashboard.gwid+"/"+c.get("id")+".json"
}c=c.toJSON();
d.programsModalVerifying.open(c.name,this);
DL.Dashboard.Main.Ajax(b,function(e){d.programsModalVerified(e.responseMessage.content)
},function(f){var e=this,g=f.responseMessage.code;
switch(g){case"-2":d.programConflictModal(e,a,f.responseMessage);
break;
case"-1":default:d.nameConflictModal(e,a,f.responseMessage.message);
break
}},{contentType:"application/json",data:JSON.stringify(c)})
},getProgramDescription:function(a){var h=$(".columns"),g=h.find("#step1 .stepText p").text(),e=[],d=h.find("#step3 a.optionSelector"),c="Run everyday all day",f=[],b;
if(a.attributes.type!="NOTIFICATION"){b=h.find("#step2 .stepText p");
_.each(b,function(k){e.push(b[k])
});
e=e.join(", ")
}else{b=h.find("#step2 .stepText li");
$.each(b,function(k){e.push($(b[k]).text())
});
e=e.join(", ");
e="Send notifications to "+e+"."
}if(d.hasClass("edit")){c=d.text()
}f.push(g,e,c);
return f.join(" ")
},nameConflictModal:function(b,a,d){var c=this;
b.conflictModal=new DL.Dashboard.ModalBase({template:"modals/programNameConflict",data:{message:d,name:a.attributes.name,progType:a.attributes.type,progDesc:c.getProgramDescription(a)},customEvents:{"click .editBtn":function(f){f.preventDefault();
b.conflictModal.close();
$(".completedTitle").click()
},"click .deleteButton":function(k){var g=this,h=$(k.currentTarget),f=new DL.Dashboard.ModalBase({template:"modals/programConfirmDelete",data:{title:"Confirm",message:"Are you sure you want to delete this program?",icon:"CLOCK"},customEvents:{"click .deleteModalAcceptButton":function(l){l.preventDefault();
f.close();
DL.Dashboard.app.navigate("programs",{trigger:true})
}}})
}}})
},programConflictModal:function(b,a,c){var e=this,d=c.content;
if(!d){return false;
DL.log(c)
}b.conflictModal=new DL.Dashboard.ModalBase({template:"modals/programNameConflict",data:{message:"Your new program",name:"Program Conflict",progType:a.attributes.type,progDesc:d.conflictedRule.description},customEvents:{"click .editBtn":function(h){h.preventDefault();
var g=a.attributes.type.toLowerCase();
if(e.isEditing){g="update"
}var f=DL.Dashboard.restURLs.replaceProgram+g+"/"+DL.Dashboard.gwid;
if(e.isEditing){f+="/"+d.conflictedRule.id
}f+=".json";
b.conflictModal.close();
DL.Dashboard.Main.Ajax(f,function(k){e.programsModalVerified(k.responseMessage.content)
},function(k){DL.log(k)
},{showLoadingOverlay:true,type:"POST",contentType:"application/json",data:JSON.stringify({newRule:d.ruleAsSubmitted,ruleGuidToDelete:d.conflictingRule.id})})
},"click .closeButton":function(f){f.preventDefault();
b.conflictModal.close()
}},beforeOpen:function(k){var l=$(k);
var m=l.find(".content");
var g=m.clone();
g.find("p").html("Conflicts with this active program");
g.find(".descText").html(d.conflictingRule.description);
var f=m.clone();
f.find(".programDesc").remove();
f.find("p").html(c.message).css({width:310});
m.add(g).css("border-bottom","none");
g.add(f).insertAfter(m);
var h=$(".progIcon");
h.eq(0).css({top:86});
h.eq(1).css({top:247}).removeClass("ACTIVITY NOTIFICATION SCHEDULE").addClass(d.conflictingRule.type);
l.find(".closeButton").html("CANCEL");
l.find(".editBtn").css({width:202}).html("Yes, Replace Previous Program");
l.find(".deleteButton").remove()
}})
}});
DL.Dashboard.Views.Programs=window.DL.Dashboard.Views.Programs||{};
DL.Dashboard.Views.Programs.ThresholdSelector=Backbone.View.extend({template:DL.Dashboard.getTemplate("programs/thresholdSelector"),initialize:function(){this.prefix=this.options.prefix;
this.complete=this.options.complete;
this.context=this.options.context||"#step1";
this.eventId=this.options.eventId;
this.oid=this.options.oid;
this.device=this.options.device;
this.limits=DL.Common.getTempLimits(this.device,this.eventId,this.oid);
this.start=this.limits.base;
this.render()
},render:function(){var a=this;
a.selector=$($.tmpl(this.template,{prefix:this.prefix}));
a.input=a.selector.find(".input");
$(a.context).find(".actionSelection").append(a.selector);
a.setValue(a.start);
a.transitionIn(function(){a.selector.find("a.upArrowBtn").monobind("click",$.proxy(a.upArrow_onclick,a));
a.selector.find("a.downArrowBtn").monobind("click",$.proxy(a.downArrow_onclick,a));
a.selector.parent().find("a.thresholdSave").monobind("click",$.proxy(a.save_onclick,a))
})
},transitionIn:function(a){this.selector.animate({left:"-=420"},420,"swing",a)
},getValue:function(){return parseInt(this.input.html())
},setValue:function(a){this.input.html(a)
},upArrow_onclick:function(b){b.preventDefault();
var a=this.getValue();
if(a<this.limits.upper){this.setValue(a+1)
}},downArrow_onclick:function(b){b.preventDefault();
var a=this.getValue();
if(a>this.limits.lower){this.setValue(a-1)
}},save_onclick:function(a){a.preventDefault();
this.selector.remove();
this.complete(this.getValue())
}});
DL.Dashboard.Views.Programs.CodeSelector=Backbone.View.extend({template:DL.Dashboard.getTemplate("programs/codeSelector"),initialize:function(){this.prefix=this.options.prefix;
this.context=this.options.context;
this.data={codes:this.options.codes};
this.render()
},render:function(){var a=this,b=this.context.find(".codeSelector");
if(b.length){b.remove()
}this.selector=$($.tmpl(this.template,this.data));
this.context.find(".actionSelection").append(this.selector);
this.selector.animate({left:0},420,"swing",function(){a.selector.find(".event a[data-doorLockCodeId]").monobind("click",$.proxy(a.onclick_code,a))
})
},animateOut:function(a){this.selector.animate({left:420},420);
DL.Dashboard.Views.Programs.DevicePropertySelector.prototype.transitionFromSelector(this.context,a)
},onclick_code:function(b){b.preventDefault();
var a=$(b.currentTarget);
this.options.complete({oidValue:a.attr("data-doorLockCodeId"),nickname:a.text()});
this.selector.remove()
}});
DL.Dashboard.Views.MiniProgram=DL.Dashboard.Views.Program.extend({initialize:function(){this.model=this.options.model;
this.template=this.options.template||DL.Dashboard.getTemplate("miniProgram");
this.containerSelector=this.options.containerSelector;
this.isDraggable=true;
this.render()
},render:function(){var b=this.model.toJSON();
var a=this.containerSelector.find("#program-"+this.model.id);
b.displayType=this.setDisplayType(this.model.get("status"));
b.isDraggable=this.isDraggable;
b.isInCustomView=false;
this.html=$.tmpl($(this.template),b);
this.containerSelector.append(this.html);
this.anchor=this.html.find(".progTileArrow");
this.drawer=this.html.find(".miniProgramDrawer");
this.anchorButton=this.anchor.monobind("click",$.proxy(this.onclick_toggleDrawer,this));
this.editButton=this.drawer.find(".editBtn");
this.deleteButton=this.drawer.find(".deleteBtn");
this.editButton.monobind("click",$.proxy(this.onclick_edit,this));
this.deleteButton.monobind("click",$.proxy(this.onclick_deleteButton,this));
this.initDragAndDrop();
return this
},toggleDrawer:function(a){var b=this;
if(this.drawer){var c=this.drawer;
if(c.data("isOpen")){c.slideUp(function(){b.anchor.removeClass("dvcControlsClose").addClass("dvcControlsOpen");
c.data("isOpen",false);
if(a){a()
}})
}else{c.slideDown(function(){b.anchor.removeClass("dvcControlsOpen").addClass("dvcControlsClose");
c.data("isOpen",true);
if(a){a()
}})
}}},initDragAndDrop:function(){if(this.html.find('[data-dragdrop="true"]').length){var a=new draggable(this.html.find(".program"),null,null,$.proxy(this.dragEnd,this),$("#app .programsList"),this,"programs")
}},dragEnd:function(a,c,h,g){a.element.remove();
a.clonedElement.remove();
var d=g.find(".column"),k=d.outerWidth()+parseInt(d.css("margin-left"),10)+parseInt(d.css("margin-right"),10),f=g.offset();
if(h.clientX>f.left+k*2){d=d[2]
}else{if(h.clientX<f.left+k*2&&h.clientX>f.left+k){d=d[1]
}else{d=d[0]
}}if(this.defaultText){this.defaultText.remove()
}var b=new DL.Dashboard.Views.Program({container:d,model:this.model,dropped:true});
b.setPending();
b.updateProgram({status:"2"})
},onclick_deleteButton:function(g,b){g.preventDefault();
var d=this,f=$(g.currentTarget),a=f.parents("li:first"),c=new DL.Dashboard.ModalBase({template:"modals/programConfirmDelete",data:{title:"Confirm",message:"Are you sure you want to delete this program?",icon:"CLOCK"},customEvents:{"click .deleteModalAcceptButton":function(h){h.preventDefault();
c.close();
d.closeProgramDrawer(a.find(".drawer:first"),function(){d.deleteProgram()
})
}}})
},setPending:function(){var a=this.html.find(".dvcWrap");
var c=a.find(".program");
var b=this;
a.addClass("pending");
c.hide().after('<p class="pendingSpinner">Pending...</p>');
this.timeout=setTimeout(function(){b.render()
},30000)
},deleteProgram:function(){var a=this;
DL.Dashboard.allSavedPrograms.destroy(DL.Dashboard.allSavedPrograms.getOne(this.model.id));
this.toggleDrawer(function(){a.setPending()
})
},onclick_toggleDrawer:function(a){a.preventDefault();
a.stopImmediatePropagation();
this.toggleDrawer()
},onclick_edit:function(a){a.preventDefault();
this.editProgram()
},setDisplayType:function(a){var b;
a=a.toString().toLowerCase();
if(a=="4"||a=="8"||a=="9"||a=="a"||a=="10"){b="error";
this.isDraggable=false
}else{b=this.model.get("type").toLowerCase()
}return b
}});
DL.Dashboard.Views.ProgramsListPanel=Backbone.View.extend({template:DL.Dashboard.getTemplate("programs/programList"),boundListener:false,initialize:function(){this.el=$("#app");
this.content={title:"Programs On Hold",headline:"Programs that appear in this list are not active."};
this.render()
},render:function(){if(!$("#main").hasClass("page-programs-home")){return
}this.el.append($.tmpl($(this.template),this.content));
var b=DL.Dashboard.allSavedPrograms.getOnHold();
if(b.length>0){var a=this;
_.each(b,function(c){new DL.Dashboard.Views.MiniProgram({template:DL.Dashboard.getTemplate("programs/miniProgram"),containerSelector:a.el.find(".itemList"),model:c})
})
}$(".thinGreyScrollbar",this.el).jScrollPane({showArrows:true,verticalDragMaxHeight:40});
return this
}});
DL.Dashboard.Views.Modal=Backbone.View.extend({className:"modal",template:"",initialize:function(){this.template=DL.Dashboard.getTemplate(this.templateName);
if(typeof this.preInitialize=="function"){this.preInitialize()
}if(this.extraEvents){this.delegateEvents(_.extend(this.events,this.extraEvents))
}if(typeof this.postInitialize=="function"){this.postInitialize()
}if(this.title){this.options.title=this.title
}this.render()
},render:function(){var a=$(this.el).html($.tmpl($(this.template),this.options||{}));
a.appendTo("body");
if(this.classToAdd){$(this.el).addClass(this.classToAdd)
}if(this.initPostRender&&typeof this.initPostRender=="function"){this.initPostRender($(this.el).find(".homeModal"))
}DL.Common.showModal($(".homeModal",this.el),$(".modalOverlay",this.el))
},accept:function(){this.closeModal();
if(this.callback&&typeof this.callback=="function"){this.callback()
}},events:{"click .closeButton":"closeModal","click .deleteModalAcceptButton":"accept"},closeModal:function(){$(this.el).dialog("destroy").remove();
$("body .modal").remove()
}});
/*! LAB.js (LABjs :: Loading And Blocking JavaScript)
    v2.0.3 (c) Kyle Simpson
    MIT License
*/
(function(X){var f=X.$LAB,k="UseLocalXHR",g="AlwaysPreserveOrder",v="AllowDuplicates",W="CacheBust",U="BasePath",S=/^[^?#]*\//.exec(location.href)[0],R=/^\w+\:\/\/\/?[^\/]+/.exec(S)[0],Y=document.head||document.getElementsByTagName("head"),e=(X.opera&&Object.prototype.toString.call(X.opera)=="[object Opera]")||("MozAppearance" in document.documentElement.style),V=document.createElement("script"),x=typeof V.preload=="boolean",T=x||(V.readyState&&V.readyState=="uninitialized"),p=!T&&V.async===true,d=!T&&!p&&!e;
function n(o){return Object.prototype.toString.call(o)=="[object Function]"
}function m(o){return Object.prototype.toString.call(o)=="[object Array]"
}function c(q,r){var o=/^\w+\:\/\//;
if(/^\/\/\/?/.test(q)){q=location.protocol+q
}else{if(!o.test(q)&&q.charAt(0)!="/"){q=(r||"")+q
}}return o.test(q)?q:((q.charAt(0)=="/"?R:S)+q)
}function Q(q,r){for(var o in q){if(q.hasOwnProperty(o)){r[o]=q[o]
}}return r
}function b(q){var r=false;
for(var o=0;
o<q.scripts.length;
o++){if(q.scripts[o].ready&&q.scripts[o].exec_trigger){r=true;
q.scripts[o].exec_trigger();
q.scripts[o].exec_trigger=null
}}return r
}function w(q,s,o,r){q.onload=q.onreadystatechange=function(){if((q.readyState&&q.readyState!="complete"&&q.readyState!="loaded")||s[o]){return
}q.onload=q.onreadystatechange=null;
r()
}
}function l(o){o.ready=o.finished=true;
for(var q=0;
q<o.finished_listeners.length;
q++){o.finished_listeners[q]()
}o.ready_listeners=[];
o.finished_listeners=[]
}function a(t,r,s,q,o){setTimeout(function(){var y,z=r.real_src,u;
if("item" in Y){if(!Y[0]){setTimeout(arguments.callee,25);
return
}Y=Y[0]
}y=document.createElement("script");
if(r.type){y.type=r.type
}if(r.charset){y.charset=r.charset
}if(o){if(T){s.elem=y;
if(x){y.preload=true;
y.onpreload=q
}else{y.onreadystatechange=function(){if(y.readyState=="loaded"){q()
}}
}y.src=z
}else{if(o&&z.indexOf(R)==0&&t[k]){u=new XMLHttpRequest();
u.onreadystatechange=function(){if(u.readyState==4){u.onreadystatechange=function(){};
s.text=u.responseText+"\n//@ sourceURL="+z;
q()
}};
u.open("GET",z);
u.send()
}else{y.type="text/cache-script";
w(y,s,"ready",function(){Y.removeChild(y);
q()
});
y.src=z;
Y.insertBefore(y,Y.firstChild)
}}}else{if(p){y.async=false;
w(y,s,"finished",q);
y.src=z;
Y.insertBefore(y,Y.firstChild)
}else{w(y,s,"finished",q);
y.src=z;
Y.insertBefore(y,Y.firstChild)
}}},0)
}function h(){var q={},u=T||d,z=[],y={},o;
q[k]=true;
q[g]=false;
q[v]=false;
q[W]=false;
q[U]="";
function t(B,E,A){var D;
function C(){if(D!=null){D=null;
l(A)
}}if(y[E.src].finished){return
}if(!B[v]){y[E.src].finished=true
}D=A.elem||document.createElement("script");
if(E.type){D.type=E.type
}if(E.charset){D.charset=E.charset
}w(D,A,"finished",C);
if(A.elem){A.elem=null
}else{if(A.text){D.onload=D.onreadystatechange=null;
D.text=A.text
}else{D.src=E.real_src
}}Y.insertBefore(D,Y.firstChild);
if(A.text){C()
}}function s(H,A,G,E){var F,D,C=function(){A.ready_cb(A,function(){t(H,A,F)
})
},B=function(){A.finished_cb(A,G)
};
A.src=c(A.src,H[U]);
A.real_src=A.src+(H[W]?((/\?.*$/.test(A.src)?"&_":"?_")+~~(Math.random()*1000000000)+"="):"");
if(!y[A.src]){y[A.src]={items:[],finished:false}
}D=y[A.src].items;
if(H[v]||D.length==0){F=D[D.length]={ready:false,finished:false,ready_listeners:[C],finished_listeners:[B]};
a(H,A,F,((E)?function(){F.ready=true;
for(var I=0;
I<F.ready_listeners.length;
I++){F.ready_listeners[I]()
}F.ready_listeners=[]
}:function(){l(F)
}),E)
}else{F=D[0];
if(F.finished){B()
}else{F.finished_listeners.push(B)
}}}function r(){var H,G=Q(q,{}),F=[],E=0,J=false,D;
function C(K,L){K.ready=true;
K.exec_trigger=L;
I()
}function B(L,M){L.ready=L.finished=true;
L.exec_trigger=null;
for(var K=0;
K<M.scripts.length;
K++){if(!M.scripts[K].finished){return
}}M.finished=true;
I()
}function I(){while(E<F.length){if(n(F[E])){try{F[E++]()
}catch(K){}continue
}else{if(!F[E].finished){if(b(F[E])){continue
}break
}}E++
}if(E==F.length){J=false;
D=false
}}function A(){if(!D||!D.scripts){F.push(D={scripts:[],finished:true})
}}H={script:function(){for(var K=0;
K<arguments.length;
K++){(function(M,O){var L;
if(!m(M)){O=[M]
}for(var N=0;
N<O.length;
N++){A();
M=O[N];
if(n(M)){M=M()
}if(!M){continue
}if(m(M)){L=[].slice.call(M);
L.unshift(N,1);
[].splice.apply(O,L);
N--;
continue
}if(typeof M=="string"){M={src:M}
}M=Q(M,{ready:false,ready_cb:C,finished:false,finished_cb:B});
D.finished=false;
D.scripts.push(M);
s(G,M,D,(u&&J));
J=true;
if(G[g]){H.wait()
}}})(arguments[K],arguments[K])
}return H
},wait:function(){if(arguments.length>0){for(var K=0;
K<arguments.length;
K++){F.push(arguments[K])
}D=F[F.length-1]
}else{D=false
}I();
return H
}};
return{script:H.script,wait:H.wait,setOptions:function(K){Q(K,G);
return H
}}
}o={setGlobalDefaults:function(A){Q(A,q);
return o
},setOptions:function(){return r().setOptions.apply(null,arguments)
},script:function(){return r().script.apply(null,arguments)
},wait:function(){return r().wait.apply(null,arguments)
},queueScript:function(){z[z.length]={type:"script",args:[].slice.call(arguments)};
return o
},queueWait:function(){z[z.length]={type:"wait",args:[].slice.call(arguments)};
return o
},runQueue:function(){var B=o,D=z.length,A=D,C;
for(;
--A>=0;
){C=z.shift();
B=B[C.type].apply(null,C.args)
}return B
},noConflict:function(){X.$LAB=f;
return o
},sandbox:function(){return h()
}};
return o
}X.$LAB=h();
(function(q,r,o){if(document.readyState==null&&document[q]){document.readyState="loading";
document[q](r,o=function(){document.removeEventListener(r,o,false);
document.readyState="complete"
},false)
}})("addEventListener","DOMContentLoaded")
})(this);
(function(b){b.Frame=function(u,t){var x=a(arguments);
if(u instanceof Array){for(var w in u){x[0]=u[w];
Frame.apply(null,x)
}}else{switch(typeof u){case"string":return Frame.lib.apply(null,x);
break;
case"number":return Frame.soon.apply(null,r.apply(null,x));
break;
case"function":return Frame.soon.apply(null,x);
break;
case"undefined":return Frame.next.apply(null,x);
break;
default:x.unshift("Unidentified input: ");
Frame.error.apply(null,x);
return x;
break
}}};
var a=function(t){return[].slice.call(t,0)
};
Frame.array=a;
var r=function(){var v=a(arguments),t=v.shift(),u=v.shift();
v.unshift(function(){var w=a(arguments);
setTimeout(function(){u.apply(null,w)
},t)
});
return v
};
var e=[];
var c=document.getElementsByTagName("script");
for(i in c){if(typeof c[i].hasAttribute!=="undefined"){if(c[i].hasAttribute("src")){e.push(c[i].getAttribute("src"))
}}}Frame.script=$LAB.script;
Frame.clearLibs=function(){e=[]
};
Frame.libs=Frame.library=function(){return e
};
Frame.lib=function(w,t){var y=a(arguments);
var A=false;
if(typeof w==="string"){for(var x in e){if(e[x]===w){A=true
}}}else{if(w instanceof Array){var z=0;
for(var u in w){for(var x in e){if(e[x]===w[u]){z++
}}}if(z===w.length){A=true
}}else{if(typeof w==="object"&&typeof w.src!=="undefined"){for(var x in e){if(e[x]===w.src){A=true
}}}}}if(!A){Frame(function(){$LAB.script(w).wait(function(){if(typeof w==="string"){e.push(w)
}else{if(w instanceof Array){for(var v in w){e.push(w[v])
}}else{if(typeof w==="object"&&typeof w.src!=="undefined"){e.push(w.src)
}}}Frame.log("Library loaded: "+w);
if(typeof t=="function"){y[0]=Frame.next;
t.apply(null,y)
}else{Frame()
}})
})
}else{Frame.log("Library already loaded, skipping: "+w);
if(typeof t=="function"){t(function(){},w)
}}return y
};
var h=false,f=false,k=false,s=[];
Frame.running=false;
Frame.last=false;
Frame.useTimeout=true;
Frame.overrideTimeoutLength=false;
Frame.baseTimeout=265;
Frame.testDuration=1250;
Frame.machineSpeed=3;
Frame.timeout=Frame.baseTimeout*Frame.machineSpeed;
Frame.keeperSteps=5;
Frame.keeperDuration=Frame.timeout/Frame.keeperSteps;
Frame.resetTimeout=function(){Frame.timeout=(Frame.overrideTimeoutLength)?Frame.overrideTimeoutLength:Frame.baseTimeout*Frame.machineSpeed;
Frame.keeperDuration=Frame.timeout/Frame.keeperSteps;
return Frame.timeout
};
Frame.speedTest=function(u){if(Frame.useTimeout){var t=1;
var v=setInterval(function(){t++
},1);
setTimeout(function(){v=clearInterval(v);
v=false;
Frame.machineSpeed=Math.ceil(Frame.testDuration/t);
if(Frame.machineSpeed<1){Frame.machineSpeed=1
}Frame.resetTimeout();
Frame.log("Speed test complete, Speed Rating: "+Frame.machineSpeed+", Timeout set to: "+Frame.timeout);
if(typeof u==="function"){u.apply(Frame,a(arguments).splice(1))
}},Frame.testDuration);
return"Speed Test running..."
}else{if(typeof u==="function"){u.apply(Frame,a(arguments).splice(1))
}}};
Frame.report=function(){Frame.log("speeds ",s.splice(1))
};
var d=function(){Frame.running=true;
if(Frame.debug>4){Frame.log(Frame.last)
}else{if(Frame.debug>3){Frame.log("---- "+(k||0)+"ms","queue: "+p.length,"later: "+n.length," ----")
}}s.push(k);
k=0;
o();
if(Frame.useTimeout){f=setInterval(function(){k++
},1);
h=setInterval(function(){if(k>Frame.timeout){Frame.error("Timed out after "+k,Frame.last);
Frame()
}},Frame.keeperDuration)
}};
var l=function(){if(Frame.debug>3){Frame.log("---- Frame done ----")
}o();
Frame.running=false
};
var o=function(){h=clearInterval(h);
h=false;
f=clearInterval(f);
f=false
};
var p=[],g=[],n=[],q=[];
Frame.queue=function(){return p.concat(n)
};
Frame.args=function(){return g.concat(q)
};
Frame.len=Frame.count=function(){return(p.length+n.length)
};
Frame.soon=function(t){var u=a(arguments);
if(typeof t==="number"){return Frame.apply(null,u)
}else{if(typeof t==="function"){g.push(u.splice(1));
if(Frame.debug>4){Frame.log("Frame added soon",Frame.count())
}return p.push(t)
}}return false
};
Frame.bump=function(){var t=a(arguments);
if(Frame.debug>4){Frame.log("Frame doubled",t)
}Frame(function(u){Frame.apply(null,t);
u()
});
return t
};
Frame.now=function(t){var u=a(arguments);
if(typeof t==="number"){return Frame.now.apply(null,r.apply(null,u))
}else{if(typeof t==="function"){g.unshift(u.splice(1));
if(Frame.debug>4){Frame.log("Frame added now",Frame.count())
}return p.unshift(t)
}}return false
};
Frame.later=function(t){var u=a(arguments);
if(typeof t==="number"){return Frame.later.apply(null,r.apply(null,u))
}else{if(typeof t==="function"){q.push(u.splice(1));
if(Frame.debug>4){Frame.log("Frame added later",Frame.count())
}return n.push(t)
}}return false
};
Frame.next=function(t){var u=a(arguments);
if(p.length>0){Frame.last=g.shift();
Frame.last.unshift(p.shift());
Frame.last=Frame.last.concat(u);
Frame.stack.push(Frame.last);
return m.apply(null,Frame.last)
}else{if(n.length>0){Frame.last=q.shift();
Frame.last.unshift(n.shift());
Frame.last=Frame.last.concat(u);
Frame.stack.push(Frame.last);
return m.apply(null,Frame.last)
}else{l();
return false
}}};
Frame.go=Frame.begin=Frame.start=Frame.init=function(){if(Frame.running===false){Frame.title("Frame started");
Frame.next();
return true
}else{Frame.title("Frame already running");
return false
}};
var m=function(u){var t=a(arguments);
if(typeof u==="function"){d();
try{t[0]=Frame.next;
return u.apply(null,t)
}catch(v){o();
Frame.error(v,Frame.last);
Frame();
return v
}return true
}else{l();
return false
}};
Frame.debug=0;
Frame.errors=[];
Frame.stack=[];
Frame.log=function(){var t=a(arguments);
Frame.stack.push(t);
if(Frame.debug>0){try{console.log.apply(console,t)
}catch(u){Frame.errors.push(t.shift(u))
}}};
Frame.title=function(t){var u=a(arguments);
if(Frame.debug>2){u.unshift("Frame Title: ");
Frame.log.apply(document,u)
}};
Frame.error=function(t){var u=a(arguments);
Frame.errors.push(u);
if(Frame.debug>1){u.unshift("Frame Error: ");
Frame.log.apply(document,u)
}};
Frame.resetTimeout();
Frame.later(function(t){Frame.speedTest(t)
});
Frame.title("Frame Finished Loading")
})(window);
(function(a){a=a||{};
var b=a.Frame||{};
var c={};
b.perf=function(){if(b.debug>=1){var e=Array.prototype.slice.apply(arguments);
var d={name:e[0],start:[],stop:[],duration:[]};
if(c.hasOwnProperty(d.name)){d=c[d.name]
}else{c[d.name]=d
}switch(e[1]){case"start":var f=new Date();
d.start.push(f.getTime());
break;
case"stop":var f=new Date();
d.stop.push(f.getTime());
d.duration.push(_.last(d.stop)-_.last(d.start));
break
}if(b.debug>=3||e[2]===true){DL.log("Frame Perf ::",e[0])
}return d
}};
b.perf.report=function(){var d=_.reduce(c,function(e,f){e[f.name]=Math.floor(_.reduce(f.duration,function(g,h){return g+h
},0)/f.duration.length);
return e
},{});
return d
};
b.perf.count=function(){var d=_.reduce(c,function(e,f){e[f.name]=f.duration.length;
return e
},{});
return d
};
b.perf.impact=function(){var d=_.reduce(c,function(e,f){e[f.name]=Math.floor(_.reduce(f.duration,function(g,h){g+=h;
return g
},0)/100);
return e
},{});
return d
};
b.perf.range=function(){var d=_.reduce(c,function(e,f){e[f.name]=Math.floor(_.range(f.duration)/100);
return e
},{});
return d
};
b.perf.tests=c
})(window);
if(!window.requestAnimationFrame){window.requestAnimationFrame=(function(){return window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(b,a){window.setTimeout(b,1000/60)
}
})()
}"use strict";
var THREE=THREE||{REVISION:"49"};
self.Int32Array||(self.Int32Array=Array,self.Float32Array=Array);
(function(){for(var e=0,d=["ms","moz","webkit","o"],f=0;
f<d.length&&!window.requestAnimationFrame;
++f){window.requestAnimationFrame=window[d[f]+"RequestAnimationFrame"];
window.cancelAnimationFrame=window[d[f]+"CancelAnimationFrame"]||window[d[f]+"CancelRequestAnimationFrame"]
}if(!window.requestAnimationFrame){window.requestAnimationFrame=function(a){var l=Date.now(),k=Math.max(0,16-(l-e)),h=window.setTimeout(function(){a(l+k)
},k);
e=l+k;
return h
}
}if(!window.cancelAnimationFrame){window.cancelAnimationFrame=function(b){clearTimeout(b)
}
}})();
THREE.Clock=function(b){this.autoStart=b!==void 0?b:true;
this.elapsedTime=this.oldTime=this.startTime=0;
this.running=false
};
THREE.Clock.prototype.start=function(){this.oldTime=this.startTime=Date.now();
this.running=true
};
THREE.Clock.prototype.stop=function(){this.getElapsedTime();
this.running=false
};
THREE.Clock.prototype.getElapsedTime=function(){return this.elapsedTime=this.elapsedTime+this.getDelta()
};
THREE.Clock.prototype.getDelta=function(){var d=0;
this.autoStart&&!this.running&&this.start();
if(this.running){var c=Date.now(),d=0.001*(c-this.oldTime);
this.oldTime=c;
this.elapsedTime=this.elapsedTime+d
}return d
};
THREE.Color=function(b){b!==void 0&&this.setHex(b);
return this
};
THREE.Color.prototype={constructor:THREE.Color,r:1,g:1,b:1,copy:function(b){this.r=b.r;
this.g=b.g;
this.b=b.b;
return this
},copyGammaToLinear:function(b){this.r=b.r*b.r;
this.g=b.g*b.g;
this.b=b.b*b.b;
return this
},copyLinearToGamma:function(b){this.r=Math.sqrt(b.r);
this.g=Math.sqrt(b.g);
this.b=Math.sqrt(b.b);
return this
},convertGammaToLinear:function(){var e=this.r,d=this.g,f=this.b;
this.r=e*e;
this.g=d*d;
this.b=f*f;
return this
},convertLinearToGamma:function(){this.r=Math.sqrt(this.r);
this.g=Math.sqrt(this.g);
this.b=Math.sqrt(this.b);
return this
},setRGB:function(e,d,f){this.r=e;
this.g=d;
this.b=f;
return this
},setHSV:function(h,g,n){var m,l,k;
if(n===0){this.r=this.g=this.b=0
}else{m=Math.floor(h*6);
l=h*6-m;
h=n*(1-g);
k=n*(1-g*l);
g=n*(1-g*(1-l));
switch(m){case 1:this.r=k;
this.g=n;
this.b=h;
break;
case 2:this.r=h;
this.g=n;
this.b=g;
break;
case 3:this.r=h;
this.g=k;
this.b=n;
break;
case 4:this.r=g;
this.g=h;
this.b=n;
break;
case 5:this.r=n;
this.g=h;
this.b=k;
break;
case 6:case 0:this.r=n;
this.g=g;
this.b=h
}}return this
},setHex:function(b){b=Math.floor(b);
this.r=(b>>16&255)/255;
this.g=(b>>8&255)/255;
this.b=(b&255)/255;
return this
},lerpSelf:function(d,c){this.r=this.r+(d.r-this.r)*c;
this.g=this.g+(d.g-this.g)*c;
this.b=this.b+(d.b-this.b)*c;
return this
},getHex:function(){return Math.floor(this.r*255)<<16^Math.floor(this.g*255)<<8^Math.floor(this.b*255)
},getContextStyle:function(){return"rgb("+Math.floor(this.r*255)+","+Math.floor(this.g*255)+","+Math.floor(this.b*255)+")"
},clone:function(){return(new THREE.Color).setRGB(this.r,this.g,this.b)
}};
THREE.Vector2=function(d,c){this.x=d||0;
this.y=c||0
};
THREE.Vector2.prototype={constructor:THREE.Vector2,set:function(d,c){this.x=d;
this.y=c;
return this
},copy:function(b){this.x=b.x;
this.y=b.y;
return this
},add:function(d,c){this.x=d.x+c.x;
this.y=d.y+c.y;
return this
},addSelf:function(b){this.x=this.x+b.x;
this.y=this.y+b.y;
return this
},sub:function(d,c){this.x=d.x-c.x;
this.y=d.y-c.y;
return this
},subSelf:function(b){this.x=this.x-b.x;
this.y=this.y-b.y;
return this
},multiplyScalar:function(b){this.x=this.x*b;
this.y=this.y*b;
return this
},divideScalar:function(b){if(b){this.x=this.x/b;
this.y=this.y/b
}else{this.set(0,0)
}return this
},negate:function(){return this.multiplyScalar(-1)
},dot:function(b){return this.x*b.x+this.y*b.y
},lengthSq:function(){return this.x*this.x+this.y*this.y
},length:function(){return Math.sqrt(this.lengthSq())
},normalize:function(){return this.divideScalar(this.length())
},distanceTo:function(b){return Math.sqrt(this.distanceToSquared(b))
},distanceToSquared:function(d){var c=this.x-d.x,d=this.y-d.y;
return c*c+d*d
},setLength:function(b){return this.normalize().multiplyScalar(b)
},lerpSelf:function(d,c){this.x=this.x+(d.x-this.x)*c;
this.y=this.y+(d.y-this.y)*c;
return this
},equals:function(b){return b.x===this.x&&b.y===this.y
},isZero:function(){return this.lengthSq()<0.0001
},clone:function(){return new THREE.Vector2(this.x,this.y)
}};
THREE.Vector3=function(e,d,f){this.x=e||0;
this.y=d||0;
this.z=f||0
};
THREE.Vector3.prototype={constructor:THREE.Vector3,set:function(e,d,f){this.x=e;
this.y=d;
this.z=f;
return this
},setX:function(b){this.x=b;
return this
},setY:function(b){this.y=b;
return this
},setZ:function(b){this.z=b;
return this
},copy:function(b){this.x=b.x;
this.y=b.y;
this.z=b.z;
return this
},add:function(d,c){this.x=d.x+c.x;
this.y=d.y+c.y;
this.z=d.z+c.z;
return this
},addSelf:function(b){this.x=this.x+b.x;
this.y=this.y+b.y;
this.z=this.z+b.z;
return this
},addScalar:function(b){this.x=this.x+b;
this.y=this.y+b;
this.z=this.z+b;
return this
},sub:function(d,c){this.x=d.x-c.x;
this.y=d.y-c.y;
this.z=d.z-c.z;
return this
},subSelf:function(b){this.x=this.x-b.x;
this.y=this.y-b.y;
this.z=this.z-b.z;
return this
},multiply:function(d,c){this.x=d.x*c.x;
this.y=d.y*c.y;
this.z=d.z*c.z;
return this
},multiplySelf:function(b){this.x=this.x*b.x;
this.y=this.y*b.y;
this.z=this.z*b.z;
return this
},multiplyScalar:function(b){this.x=this.x*b;
this.y=this.y*b;
this.z=this.z*b;
return this
},divideSelf:function(b){this.x=this.x/b.x;
this.y=this.y/b.y;
this.z=this.z/b.z;
return this
},divideScalar:function(b){if(b){this.x=this.x/b;
this.y=this.y/b;
this.z=this.z/b
}else{this.z=this.y=this.x=0
}return this
},negate:function(){return this.multiplyScalar(-1)
},dot:function(b){return this.x*b.x+this.y*b.y+this.z*b.z
},lengthSq:function(){return this.x*this.x+this.y*this.y+this.z*this.z
},length:function(){return Math.sqrt(this.lengthSq())
},lengthManhattan:function(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)
},normalize:function(){return this.divideScalar(this.length())
},setLength:function(b){return this.normalize().multiplyScalar(b)
},lerpSelf:function(d,c){this.x=this.x+(d.x-this.x)*c;
this.y=this.y+(d.y-this.y)*c;
this.z=this.z+(d.z-this.z)*c;
return this
},cross:function(d,c){this.x=d.y*c.z-d.z*c.y;
this.y=d.z*c.x-d.x*c.z;
this.z=d.x*c.y-d.y*c.x;
return this
},crossSelf:function(f){var e=this.x,h=this.y,g=this.z;
this.x=h*f.z-g*f.y;
this.y=g*f.x-e*f.z;
this.z=e*f.y-h*f.x;
return this
},distanceTo:function(b){return Math.sqrt(this.distanceToSquared(b))
},distanceToSquared:function(b){return(new THREE.Vector3).sub(this,b).lengthSq()
},getPositionFromMatrix:function(b){this.x=b.elements[12];
this.y=b.elements[13];
this.z=b.elements[14];
return this
},getRotationFromMatrix:function(s,r){var q=r?r.x:1,p=r?r.y:1,o=r?r.z:1,n=s.elements[0]/q,m=s.elements[4]/p,q=s.elements[1]/q,p=s.elements[5]/p,l=s.elements[9]/o,k=s.elements[10]/o;
this.y=Math.asin(s.elements[8]/o);
o=Math.cos(this.y);
if(Math.abs(o)>0.00001){this.x=Math.atan2(-l/o,k/o);
this.z=Math.atan2(-m/o,n/o)
}else{this.x=0;
this.z=Math.atan2(q,p)
}return this
},getScaleFromMatrix:function(e){var d=this.set(e.elements[0],e.elements[1],e.elements[2]).length(),f=this.set(e.elements[4],e.elements[5],e.elements[6]).length(),e=this.set(e.elements[8],e.elements[9],e.elements[10]).length();
this.x=d;
this.y=f;
this.z=e
},equals:function(b){return b.x===this.x&&b.y===this.y&&b.z===this.z
},isZero:function(){return this.lengthSq()<0.0001
},clone:function(){return new THREE.Vector3(this.x,this.y,this.z)
}};
THREE.Vector4=function(f,e,h,g){this.x=f||0;
this.y=e||0;
this.z=h||0;
this.w=g!==void 0?g:1
};
THREE.Vector4.prototype={constructor:THREE.Vector4,set:function(f,e,h,g){this.x=f;
this.y=e;
this.z=h;
this.w=g;
return this
},copy:function(b){this.x=b.x;
this.y=b.y;
this.z=b.z;
this.w=b.w!==void 0?b.w:1;
return this
},add:function(d,c){this.x=d.x+c.x;
this.y=d.y+c.y;
this.z=d.z+c.z;
this.w=d.w+c.w;
return this
},addSelf:function(b){this.x=this.x+b.x;
this.y=this.y+b.y;
this.z=this.z+b.z;
this.w=this.w+b.w;
return this
},sub:function(d,c){this.x=d.x-c.x;
this.y=d.y-c.y;
this.z=d.z-c.z;
this.w=d.w-c.w;
return this
},subSelf:function(b){this.x=this.x-b.x;
this.y=this.y-b.y;
this.z=this.z-b.z;
this.w=this.w-b.w;
return this
},multiplyScalar:function(b){this.x=this.x*b;
this.y=this.y*b;
this.z=this.z*b;
this.w=this.w*b;
return this
},divideScalar:function(b){if(b){this.x=this.x/b;
this.y=this.y/b;
this.z=this.z/b;
this.w=this.w/b
}else{this.z=this.y=this.x=0;
this.w=1
}return this
},negate:function(){return this.multiplyScalar(-1)
},dot:function(b){return this.x*b.x+this.y*b.y+this.z*b.z+this.w*b.w
},lengthSq:function(){return this.dot(this)
},length:function(){return Math.sqrt(this.lengthSq())
},normalize:function(){return this.divideScalar(this.length())
},setLength:function(b){return this.normalize().multiplyScalar(b)
},lerpSelf:function(d,c){this.x=this.x+(d.x-this.x)*c;
this.y=this.y+(d.y-this.y)*c;
this.z=this.z+(d.z-this.z)*c;
this.w=this.w+(d.w-this.w)*c;
return this
},clone:function(){return new THREE.Vector4(this.x,this.y,this.z,this.w)
}};
THREE.Frustum=function(){this.planes=[new THREE.Vector4,new THREE.Vector4,new THREE.Vector4,new THREE.Vector4,new THREE.Vector4,new THREE.Vector4]
};
THREE.Frustum.prototype.setFromMatrix=function(I){var H,G=this.planes,F=I.elements,I=F[0];
H=F[1];
var E=F[2],D=F[3],C=F[4],B=F[5],A=F[6],y=F[7],z=F[8],u=F[9],x=F[10],v=F[11],t=F[12],w=F[13],s=F[14],F=F[15];
G[0].set(D-I,y-C,v-z,F-t);
G[1].set(D+I,y+C,v+z,F+t);
G[2].set(D+H,y+B,v+u,F+w);
G[3].set(D-H,y-B,v-u,F-w);
G[4].set(D-E,y-A,v-x,F-s);
G[5].set(D+E,y+A,v+x,F+s);
for(I=0;
I<6;
I++){H=G[I];
H.divideScalar(Math.sqrt(H.x*H.x+H.y*H.y+H.z*H.z))
}};
THREE.Frustum.prototype.contains=function(g){for(var f=this.planes,l=g.matrixWorld,k=l.elements,l=-g.geometry.boundingSphere.radius*l.getMaxScaleOnAxis(),h=0;
h<6;
h++){g=f[h].x*k[12]+f[h].y*k[13]+f[h].z*k[14]+f[h].w;
if(g<=l){return false
}}return true
};
THREE.Frustum.__v1=new THREE.Vector3;
THREE.Ray=function(ae,ad){function ac(e,d,f){O.sub(f,e);
I=O.dot(d);
L=S.add(e,N.copy(d).multiplyScalar(I));
return C=f.distanceTo(L)
}function ab(f,e,h,g){O.sub(g,e);
S.sub(h,e);
N.sub(f,e);
M=O.dot(O);
F=O.dot(S);
D=O.dot(N);
K=S.dot(S);
x=S.dot(N);
G=1/(M*K-F*F);
P=(K*D-F*x)*G;
B=(M*x-F*D)*G;
return P>=0&&B>=0&&P+B<1
}this.origin=ae||new THREE.Vector3;
this.direction=ad||new THREE.Vector3;
var aa=0.0001;
this.setPrecision=function(b){aa=b
};
var Z=new THREE.Vector3,Y=new THREE.Vector3,X=new THREE.Vector3,W=new THREE.Vector3,U=new THREE.Vector3,V=new THREE.Vector3,Q=new THREE.Vector3,T=new THREE.Vector3,R=new THREE.Vector3;
this.intersectObject=function(k){var h,f=[];
if(k instanceof THREE.Particle){var e=ac(this.origin,this.direction,k.matrixWorld.getPosition());
if(e>k.scale.x){return[]
}h={distance:e,point:k.position,face:null,object:k};
f.push(h)
}else{if(k instanceof THREE.Mesh){var e=ac(this.origin,this.direction,k.matrixWorld.getPosition()),c=THREE.Frustum.__v1.set(k.matrixWorld.getColumnX().length(),k.matrixWorld.getColumnY().length(),k.matrixWorld.getColumnZ().length());
if(e>k.geometry.boundingSphere.radius*Math.max(c.x,Math.max(c.y,c.z))){return f
}var o,g,m=k.geometry,l=m.vertices,d;
k.matrixRotationWorld.extractRotation(k.matrixWorld);
e=0;
for(c=m.faces.length;
e<c;
e++){h=m.faces[e];
U.copy(this.origin);
V.copy(this.direction);
d=k.matrixWorld;
Q=d.multiplyVector3(Q.copy(h.centroid)).subSelf(U);
T=k.matrixRotationWorld.multiplyVector3(T.copy(h.normal));
o=V.dot(T);
if(!(Math.abs(o)<aa)){g=T.dot(Q)/o;
if(!(g<0)&&(k.doubleSided||(k.flipSided?o>0:o<0))){R.add(U,V.multiplyScalar(g));
if(h instanceof THREE.Face3){Z=d.multiplyVector3(Z.copy(l[h.a]));
Y=d.multiplyVector3(Y.copy(l[h.b]));
X=d.multiplyVector3(X.copy(l[h.c]));
if(ab(R,Z,Y,X)){h={distance:U.distanceTo(R),point:R.clone(),face:h,object:k};
f.push(h)
}}else{if(h instanceof THREE.Face4){Z=d.multiplyVector3(Z.copy(l[h.a]));
Y=d.multiplyVector3(Y.copy(l[h.b]));
X=d.multiplyVector3(X.copy(l[h.c]));
W=d.multiplyVector3(W.copy(l[h.d]));
if(ab(R,Z,Y,W)||ab(R,Y,X,W)){h={distance:U.distanceTo(R),point:R.clone(),face:h,object:k};
f.push(h)
}}}}}}}}return f
};
this.intersectObjects=function(f){for(var e=[],h=0,g=f.length;
h<g;
h++){Array.prototype.push.apply(e,this.intersectObject(f[h]))
}e.sort(function(d,c){return d.distance-c.distance
});
return e
};
var O=new THREE.Vector3,S=new THREE.Vector3,N=new THREE.Vector3,I,L,C,M,F,D,K,x,G,P,B
};
THREE.Rectangle=function(){function l(){o=q-k;
n=p-r
}var k,r,q,p,o,n,m=true;
this.getX=function(){return k
};
this.getY=function(){return r
};
this.getWidth=function(){return o
};
this.getHeight=function(){return n
};
this.getLeft=function(){return k
};
this.getTop=function(){return r
};
this.getRight=function(){return q
};
this.getBottom=function(){return p
};
this.set=function(c,b,a,d){m=false;
k=c;
r=b;
q=a;
p=d;
l()
};
this.addPoint=function(b,a){if(m){m=false;
k=b;
r=a;
q=b;
p=a
}else{k=k<b?k:b;
r=r<a?r:a;
q=q>b?q:b;
p=p>a?p:a
}l()
};
this.add3Points=function(d,c,b,e,a,h){if(m){m=false;
k=d<b?d<a?d:a:b<a?b:a;
r=c<e?c<h?c:h:e<h?e:h;
q=d>b?d>a?d:a:b>a?b:a;
p=c>e?c>h?c:h:e>h?e:h
}else{k=d<b?d<a?d<k?d:k:a<k?a:k:b<a?b<k?b:k:a<k?a:k;
r=c<e?c<h?c<r?c:r:h<r?h:r:e<h?e<r?e:r:h<r?h:r;
q=d>b?d>a?d>q?d:q:a>q?a:q:b>a?b>q?b:q:a>q?a:q;
p=c>e?c>h?c>p?c:p:h>p?h:p:e>h?e>p?e:p:h>p?h:p
}l()
};
this.addRectangle=function(a){if(m){m=false;
k=a.getLeft();
r=a.getTop();
q=a.getRight();
p=a.getBottom()
}else{k=k<a.getLeft()?k:a.getLeft();
r=r<a.getTop()?r:a.getTop();
q=q>a.getRight()?q:a.getRight();
p=p>a.getBottom()?p:a.getBottom()
}l()
};
this.inflate=function(a){k=k-a;
r=r-a;
q=q+a;
p=p+a;
l()
};
this.minSelf=function(a){k=k>a.getLeft()?k:a.getLeft();
r=r>a.getTop()?r:a.getTop();
q=q<a.getRight()?q:a.getRight();
p=p<a.getBottom()?p:a.getBottom();
l()
};
this.intersects=function(b){return q<b.getLeft()||k>b.getRight()||p<b.getTop()||r>b.getBottom()?false:true
};
this.empty=function(){m=true;
p=q=r=k=0;
l()
};
this.isEmpty=function(){return m
}
};
THREE.Math={clamp:function(e,d,f){return e<d?d:e>f?f:e
},clampBottom:function(d,c){return d<c?c:d
},mapLinear:function(g,f,l,k,h){return k+(g-f)*(h-k)/(l-f)
},random16:function(){return(65280*Math.random()+255*Math.random())/65535
},randInt:function(d,c){return d+Math.floor(Math.random()*(c-d+1))
},randFloat:function(d,c){return d+Math.random()*(c-d)
},randFloatSpread:function(b){return b*(0.5-Math.random())
},sign:function(b){return b<0?-1:b>0?1:0
}};
THREE.Matrix3=function(){this.elements=new Float32Array(9)
};
THREE.Matrix3.prototype={constructor:THREE.Matrix3,getInverse:function(w){var v=w.elements,w=v[10]*v[5]-v[6]*v[9],u=-v[10]*v[1]+v[2]*v[9],t=v[6]*v[1]-v[2]*v[5],s=-v[10]*v[4]+v[6]*v[8],r=v[10]*v[0]-v[2]*v[8],q=-v[6]*v[0]+v[2]*v[4],p=v[9]*v[4]-v[5]*v[8],o=-v[9]*v[0]+v[1]*v[8],m=v[5]*v[0]-v[1]*v[4],v=v[0]*w+v[1]*s+v[2]*p;
v===0&&console.warn("Matrix3.getInverse(): determinant == 0");
var v=1/v,n=this.elements;
n[0]=v*w;
n[1]=v*u;
n[2]=v*t;
n[3]=v*s;
n[4]=v*r;
n[5]=v*q;
n[6]=v*p;
n[7]=v*o;
n[8]=v*m;
return this
},transpose:function(){var d,c=this.elements;
d=c[1];
c[1]=c[3];
c[3]=d;
d=c[2];
c[2]=c[6];
c[6]=d;
d=c[5];
c[5]=c[7];
c[7]=d;
return this
},transposeIntoArray:function(d){var c=this.m;
d[0]=c[0];
d[1]=c[3];
d[2]=c[6];
d[3]=c[1];
d[4]=c[4];
d[5]=c[7];
d[6]=c[2];
d[7]=c[5];
d[8]=c[8];
return this
}};
THREE.Matrix4=function(G,F,E,D,C,B,A,z,y,w,x,s,v,t,r,u){this.elements=new Float32Array(16);
this.set(G!==void 0?G:1,F||0,E||0,D||0,C||0,B!==void 0?B:1,A||0,z||0,y||0,w||0,x!==void 0?x:1,s||0,v||0,t||0,r||0,u!==void 0?u:1)
};
THREE.Matrix4.prototype={constructor:THREE.Matrix4,set:function(I,H,G,F,E,D,C,B,A,y,z,u,x,v,t,w){var s=this.elements;
s[0]=I;
s[4]=H;
s[8]=G;
s[12]=F;
s[1]=E;
s[5]=D;
s[9]=C;
s[13]=B;
s[2]=A;
s[6]=y;
s[10]=z;
s[14]=u;
s[3]=x;
s[7]=v;
s[11]=t;
s[15]=w;
return this
},identity:function(){this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1);
return this
},copy:function(b){b=b.elements;
this.set(b[0],b[4],b[8],b[12],b[1],b[5],b[9],b[13],b[2],b[6],b[10],b[14],b[3],b[7],b[11],b[15]);
return this
},lookAt:function(k,h,p){var o=this.elements,n=THREE.Matrix4.__v1,m=THREE.Matrix4.__v2,l=THREE.Matrix4.__v3;
l.sub(k,h).normalize();
if(l.length()===0){l.z=1
}n.cross(p,l).normalize();
if(n.length()===0){l.x=l.x+0.0001;
n.cross(p,l).normalize()
}m.cross(l,n);
o[0]=n.x;
o[4]=m.x;
o[8]=l.x;
o[1]=n.y;
o[5]=m.y;
o[9]=l.y;
o[2]=n.z;
o[6]=m.z;
o[10]=l.z;
return this
},multiply:function(ar,aq){var ap=ar.elements,ao=aq.elements,an=this.elements,am=ap[0],al=ap[4],ak=ap[8],ai=ap[12],ag=ap[1],ah=ap[5],ac=ap[9],af=ap[13],ad=ap[2],aa=ap[6],ae=ap[10],Z=ap[14],U=ap[3],W=ap[7],N=ap[11],ap=ap[15],Y=ao[0],Q=ao[4],O=ao[8],V=ao[12],I=ao[1],T=ao[5],ab=ao[9],L=ao[13],F=ao[2],x=ao[6],B=ao[10],X=ao[14],C=ao[3],S=ao[7],aj=ao[11],ao=ao[15];
an[0]=am*Y+al*I+ak*F+ai*C;
an[4]=am*Q+al*T+ak*x+ai*S;
an[8]=am*O+al*ab+ak*B+ai*aj;
an[12]=am*V+al*L+ak*X+ai*ao;
an[1]=ag*Y+ah*I+ac*F+af*C;
an[5]=ag*Q+ah*T+ac*x+af*S;
an[9]=ag*O+ah*ab+ac*B+af*aj;
an[13]=ag*V+ah*L+ac*X+af*ao;
an[2]=ad*Y+aa*I+ae*F+Z*C;
an[6]=ad*Q+aa*T+ae*x+Z*S;
an[10]=ad*O+aa*ab+ae*B+Z*aj;
an[14]=ad*V+aa*L+ae*X+Z*ao;
an[3]=U*Y+W*I+N*F+ap*C;
an[7]=U*Q+W*T+N*x+ap*S;
an[11]=U*O+W*ab+N*B+ap*aj;
an[15]=U*V+W*L+N*X+ap*ao;
return this
},multiplySelf:function(b){return this.multiply(this,b)
},multiplyToArray:function(f,e,h){var g=this.elements;
this.multiply(f,e);
h[0]=g[0];
h[1]=g[1];
h[2]=g[2];
h[3]=g[3];
h[4]=g[4];
h[5]=g[5];
h[6]=g[6];
h[7]=g[7];
h[8]=g[8];
h[9]=g[9];
h[10]=g[10];
h[11]=g[11];
h[12]=g[12];
h[13]=g[13];
h[14]=g[14];
h[15]=g[15];
return this
},multiplyScalar:function(d){var c=this.elements;
c[0]=c[0]*d;
c[4]=c[4]*d;
c[8]=c[8]*d;
c[12]=c[12]*d;
c[1]=c[1]*d;
c[5]=c[5]*d;
c[9]=c[9]*d;
c[13]=c[13]*d;
c[2]=c[2]*d;
c[6]=c[6]*d;
c[10]=c[10]*d;
c[14]=c[14]*d;
c[3]=c[3]*d;
c[7]=c[7]*d;
c[11]=c[11]*d;
c[15]=c[15]*d;
return this
},multiplyVector3:function(h){var g=this.elements,n=h.x,m=h.y,l=h.z,k=1/(g[3]*n+g[7]*m+g[11]*l+g[15]);
h.x=(g[0]*n+g[4]*m+g[8]*l+g[12])*k;
h.y=(g[1]*n+g[5]*m+g[9]*l+g[13])*k;
h.z=(g[2]*n+g[6]*m+g[10]*l+g[14])*k;
return h
},multiplyVector4:function(h){var g=this.elements,n=h.x,m=h.y,l=h.z,k=h.w;
h.x=g[0]*n+g[4]*m+g[8]*l+g[12]*k;
h.y=g[1]*n+g[5]*m+g[9]*l+g[13]*k;
h.z=g[2]*n+g[6]*m+g[10]*l+g[14]*k;
h.w=g[3]*n+g[7]*m+g[11]*l+g[15]*k;
return h
},rotateAxis:function(g){var f=this.elements,l=g.x,k=g.y,h=g.z;
g.x=l*f[0]+k*f[4]+h*f[8];
g.y=l*f[1]+k*f[5]+h*f[9];
g.z=l*f[2]+k*f[6]+h*f[10];
g.normalize();
return g
},crossVector:function(e){var d=this.elements,f=new THREE.Vector4;
f.x=d[0]*e.x+d[4]*e.y+d[8]*e.z+d[12]*e.w;
f.y=d[1]*e.x+d[5]*e.y+d[9]*e.z+d[13]*e.w;
f.z=d[2]*e.x+d[6]*e.y+d[10]*e.z+d[14]*e.w;
f.w=e.w?d[3]*e.x+d[7]*e.y+d[11]*e.z+d[15]*e.w:1;
return f
},determinant:function(){var G=this.elements,F=G[0],E=G[4],D=G[8],C=G[12],B=G[1],A=G[5],z=G[9],y=G[13],w=G[2],x=G[6],s=G[10],v=G[14],t=G[3],r=G[7],u=G[11],G=G[15];
return C*z*x*t-D*y*x*t-C*A*s*t+E*y*s*t+D*A*v*t-E*z*v*t-C*z*w*r+D*y*w*r+C*B*s*r-F*y*s*r-D*B*v*r+F*z*v*r+C*A*w*u-E*y*w*u-C*B*x*u+F*y*x*u+E*B*v*u-F*A*v*u-D*A*w*G+E*z*w*G+D*B*x*G-F*z*x*G-E*B*s*G+F*A*s*G
},transpose:function(){var d=this.elements,c;
c=d[1];
d[1]=d[4];
d[4]=c;
c=d[2];
d[2]=d[8];
d[8]=c;
c=d[6];
d[6]=d[9];
d[9]=c;
c=d[3];
d[3]=d[12];
d[12]=c;
c=d[7];
d[7]=d[13];
d[13]=c;
c=d[11];
d[11]=d[14];
d[14]=c;
return this
},flattenToArray:function(d){var c=this.elements;
d[0]=c[0];
d[1]=c[1];
d[2]=c[2];
d[3]=c[3];
d[4]=c[4];
d[5]=c[5];
d[6]=c[6];
d[7]=c[7];
d[8]=c[8];
d[9]=c[9];
d[10]=c[10];
d[11]=c[11];
d[12]=c[12];
d[13]=c[13];
d[14]=c[14];
d[15]=c[15];
return d
},flattenToArrayOffset:function(e,d){var f=this.elements;
e[d]=f[0];
e[d+1]=f[1];
e[d+2]=f[2];
e[d+3]=f[3];
e[d+4]=f[4];
e[d+5]=f[5];
e[d+6]=f[6];
e[d+7]=f[7];
e[d+8]=f[8];
e[d+9]=f[9];
e[d+10]=f[10];
e[d+11]=f[11];
e[d+12]=f[12];
e[d+13]=f[13];
e[d+14]=f[14];
e[d+15]=f[15];
return e
},getPosition:function(){var b=this.elements;
return THREE.Matrix4.__v1.set(b[12],b[13],b[14])
},setPosition:function(d){var c=this.elements;
c[12]=d.x;
c[13]=d.y;
c[14]=d.z;
return this
},getColumnX:function(){var b=this.elements;
return THREE.Matrix4.__v1.set(b[0],b[1],b[2])
},getColumnY:function(){var b=this.elements;
return THREE.Matrix4.__v1.set(b[4],b[5],b[6])
},getColumnZ:function(){var b=this.elements;
return THREE.Matrix4.__v1.set(b[8],b[9],b[10])
},getInverse:function(K){var J=this.elements,I=K.elements,H=I[0],G=I[4],F=I[8],E=I[12],D=I[1],C=I[5],A=I[9],B=I[13],w=I[2],z=I[6],x=I[10],v=I[14],y=I[3],t=I[7],s=I[11],I=I[15];
J[0]=A*v*t-B*x*t+B*z*s-C*v*s-A*z*I+C*x*I;
J[4]=E*x*t-F*v*t-E*z*s+G*v*s+F*z*I-G*x*I;
J[8]=F*B*t-E*A*t+E*C*s-G*B*s-F*C*I+G*A*I;
J[12]=E*A*z-F*B*z-E*C*x+G*B*x+F*C*v-G*A*v;
J[1]=B*x*y-A*v*y-B*w*s+D*v*s+A*w*I-D*x*I;
J[5]=F*v*y-E*x*y+E*w*s-H*v*s-F*w*I+H*x*I;
J[9]=E*A*y-F*B*y-E*D*s+H*B*s+F*D*I-H*A*I;
J[13]=F*B*w-E*A*w+E*D*x-H*B*x-F*D*v+H*A*v;
J[2]=C*v*y-B*z*y+B*w*t-D*v*t-C*w*I+D*z*I;
J[6]=E*z*y-G*v*y-E*w*t+H*v*t+G*w*I-H*z*I;
J[10]=G*B*y-E*C*y+E*D*t-H*B*t-G*D*I+H*C*I;
J[14]=E*C*w-G*B*w-E*D*z+H*B*z+G*D*v-H*C*v;
J[3]=A*z*y-C*x*y-A*w*t+D*x*t+C*w*s-D*z*s;
J[7]=G*x*y-F*z*y+F*w*t-H*x*t-G*w*s+H*z*s;
J[11]=F*C*y-G*A*y-F*D*t+H*A*t+G*D*s-H*C*s;
J[15]=G*A*w-F*C*w+F*D*z-H*A*z-G*D*x+H*C*x;
this.multiplyScalar(1/K.determinant());
return this
},setRotationFromEuler:function(A,z){var y=this.elements,x=A.x,w=A.y,v=A.z,u=Math.cos(x),x=Math.sin(x),t=Math.cos(w),w=Math.sin(w),s=Math.cos(v),v=Math.sin(v);
switch(z){case"YXZ":var q=t*s,r=t*v,n=w*s,o=w*v;
y[0]=q+o*x;
y[4]=n*x-r;
y[8]=u*w;
y[1]=u*v;
y[5]=u*s;
y[9]=-x;
y[2]=r*x-n;
y[6]=o+q*x;
y[10]=u*t;
break;
case"ZXY":q=t*s;
r=t*v;
n=w*s;
o=w*v;
y[0]=q-o*x;
y[4]=-u*v;
y[8]=n+r*x;
y[1]=r+n*x;
y[5]=u*s;
y[9]=o-q*x;
y[2]=-u*w;
y[6]=x;
y[10]=u*t;
break;
case"ZYX":q=u*s;
r=u*v;
n=x*s;
o=x*v;
y[0]=t*s;
y[4]=n*w-r;
y[8]=q*w+o;
y[1]=t*v;
y[5]=o*w+q;
y[9]=r*w-n;
y[2]=-w;
y[6]=x*t;
y[10]=u*t;
break;
case"YZX":q=u*t;
r=u*w;
n=x*t;
o=x*w;
y[0]=t*s;
y[4]=o-q*v;
y[8]=n*v+r;
y[1]=v;
y[5]=u*s;
y[9]=-x*s;
y[2]=-w*s;
y[6]=r*v+n;
y[10]=q-o*v;
break;
case"XZY":q=u*t;
r=u*w;
n=x*t;
o=x*w;
y[0]=t*s;
y[4]=-v;
y[8]=w*s;
y[1]=q*v+o;
y[5]=u*s;
y[9]=r*v-n;
y[2]=n*v-r;
y[6]=x*s;
y[10]=o*v+q;
break;
default:q=u*s;
r=u*v;
n=x*s;
o=x*v;
y[0]=t*s;
y[4]=-t*v;
y[8]=w;
y[1]=r+n*w;
y[5]=q-o*w;
y[9]=-x*t;
y[2]=o-q*w;
y[6]=n+r*w;
y[10]=u*t
}return this
},setRotationFromQuaternion:function(w){var v=this.elements,u=w.x,t=w.y,s=w.z,r=w.w,q=u+u,p=t+t,o=s+s,w=u*q,m=u*p,u=u*o,n=t*p,t=t*o,s=s*o,q=r*q,p=r*p,r=r*o;
v[0]=1-(n+s);
v[4]=m-r;
v[8]=u+p;
v[1]=m+r;
v[5]=1-(w+s);
v[9]=t-q;
v[2]=u-p;
v[6]=t+q;
v[10]=1-(w+n);
return this
},compose:function(h,g,n){var m=this.elements,l=THREE.Matrix4.__m1,k=THREE.Matrix4.__m2;
l.identity();
l.setRotationFromQuaternion(g);
k.makeScale(n.x,n.y,n.z);
this.multiply(l,k);
m[12]=h.x;
m[13]=h.y;
m[14]=h.z;
return this
},decompose:function(k,h,p){var o=this.elements,n=THREE.Matrix4.__v1,m=THREE.Matrix4.__v2,l=THREE.Matrix4.__v3;
n.set(o[0],o[1],o[2]);
m.set(o[4],o[5],o[6]);
l.set(o[8],o[9],o[10]);
k=k instanceof THREE.Vector3?k:new THREE.Vector3;
h=h instanceof THREE.Quaternion?h:new THREE.Quaternion;
p=p instanceof THREE.Vector3?p:new THREE.Vector3;
p.x=n.length();
p.y=m.length();
p.z=l.length();
k.x=o[12];
k.y=o[13];
k.z=o[14];
o=THREE.Matrix4.__m1;
o.copy(this);
o.elements[0]=o.elements[0]/p.x;
o.elements[1]=o.elements[1]/p.x;
o.elements[2]=o.elements[2]/p.x;
o.elements[4]=o.elements[4]/p.y;
o.elements[5]=o.elements[5]/p.y;
o.elements[6]=o.elements[6]/p.y;
o.elements[8]=o.elements[8]/p.z;
o.elements[9]=o.elements[9]/p.z;
o.elements[10]=o.elements[10]/p.z;
h.setFromRotationMatrix(o);
return[k,h,p]
},extractPosition:function(d){var c=this.elements,d=d.elements;
c[12]=d[12];
c[13]=d[13];
c[14]=d[14];
return this
},extractRotation:function(g){var f=this.elements,g=g.elements,l=THREE.Matrix4.__v1,k=1/l.set(g[0],g[1],g[2]).length(),h=1/l.set(g[4],g[5],g[6]).length(),l=1/l.set(g[8],g[9],g[10]).length();
f[0]=g[0]*k;
f[1]=g[1]*k;
f[2]=g[2]*k;
f[4]=g[4]*h;
f[5]=g[5]*h;
f[6]=g[6]*h;
f[8]=g[8]*l;
f[9]=g[9]*l;
f[10]=g[10]*l;
return this
},translate:function(f){var e=this.elements,h=f.x,g=f.y,f=f.z;
e[12]=e[0]*h+e[4]*g+e[8]*f+e[12];
e[13]=e[1]*h+e[5]*g+e[9]*f+e[13];
e[14]=e[2]*h+e[6]*g+e[10]*f+e[14];
e[15]=e[3]*h+e[7]*g+e[11]*f+e[15];
return this
},rotateX:function(w){var v=this.elements,u=v[4],t=v[5],s=v[6],r=v[7],q=v[8],p=v[9],o=v[10],m=v[11],n=Math.cos(w),w=Math.sin(w);
v[4]=n*u+w*q;
v[5]=n*t+w*p;
v[6]=n*s+w*o;
v[7]=n*r+w*m;
v[8]=n*q-w*u;
v[9]=n*p-w*t;
v[10]=n*o-w*s;
v[11]=n*m-w*r;
return this
},rotateY:function(w){var v=this.elements,u=v[0],t=v[1],s=v[2],r=v[3],q=v[8],p=v[9],o=v[10],m=v[11],n=Math.cos(w),w=Math.sin(w);
v[0]=n*u-w*q;
v[1]=n*t-w*p;
v[2]=n*s-w*o;
v[3]=n*r-w*m;
v[8]=n*q+w*u;
v[9]=n*p+w*t;
v[10]=n*o+w*s;
v[11]=n*m+w*r;
return this
},rotateZ:function(w){var v=this.elements,u=v[0],t=v[1],s=v[2],r=v[3],q=v[4],p=v[5],o=v[6],m=v[7],n=Math.cos(w),w=Math.sin(w);
v[0]=n*u+w*q;
v[1]=n*t+w*p;
v[2]=n*s+w*o;
v[3]=n*r+w*m;
v[4]=n*q-w*u;
v[5]=n*p-w*t;
v[6]=n*o-w*s;
v[7]=n*m-w*r;
return this
},rotateByAxis:function(W,V){var U=this.elements;
if(W.x===1&&W.y===0&&W.z===0){return this.rotateX(V)
}if(W.x===0&&W.y===1&&W.z===0){return this.rotateY(V)
}if(W.x===0&&W.y===0&&W.z===1){return this.rotateZ(V)
}var T=W.x,S=W.y,R=W.z,Q=Math.sqrt(T*T+S*S+R*R),T=T/Q,S=S/Q,R=R/Q,Q=T*T,P=S*S,O=R*R,M=Math.cos(V),N=Math.sin(V),I=1-M,L=T*S*I,J=T*R*I,I=S*R*I,T=T*N,G=S*N,N=R*N,R=Q+(1-Q)*M,Q=L+N,S=J-G,L=L-N,P=P+(1-P)*M,N=I+T,J=J+G,I=I-T,O=O+(1-O)*M,M=U[0],T=U[1],G=U[2],K=U[3],F=U[4],A=U[5],C=U[6],v=U[7],D=U[8],z=U[9],x=U[10],B=U[11];
U[0]=R*M+Q*F+S*D;
U[1]=R*T+Q*A+S*z;
U[2]=R*G+Q*C+S*x;
U[3]=R*K+Q*v+S*B;
U[4]=L*M+P*F+N*D;
U[5]=L*T+P*A+N*z;
U[6]=L*G+P*C+N*x;
U[7]=L*K+P*v+N*B;
U[8]=J*M+I*F+O*D;
U[9]=J*T+I*A+O*z;
U[10]=J*G+I*C+O*x;
U[11]=J*K+I*v+O*B;
return this
},scale:function(f){var e=this.elements,h=f.x,g=f.y,f=f.z;
e[0]=e[0]*h;
e[4]=e[4]*g;
e[8]=e[8]*f;
e[1]=e[1]*h;
e[5]=e[5]*g;
e[9]=e[9]*f;
e[2]=e[2]*h;
e[6]=e[6]*g;
e[10]=e[10]*f;
e[3]=e[3]*h;
e[7]=e[7]*g;
e[11]=e[11]*f;
return this
},getMaxScaleOnAxis:function(){var b=this.elements;
return Math.sqrt(Math.max(b[0]*b[0]+b[1]*b[1]+b[2]*b[2],Math.max(b[4]*b[4]+b[5]*b[5]+b[6]*b[6],b[8]*b[8]+b[9]*b[9]+b[10]*b[10])))
},makeTranslation:function(e,d,f){this.set(1,0,0,e,0,1,0,d,0,0,1,f,0,0,0,1);
return this
},makeRotationX:function(d){var c=Math.cos(d),d=Math.sin(d);
this.set(1,0,0,0,0,c,-d,0,0,d,c,0,0,0,0,1);
return this
},makeRotationY:function(d){var c=Math.cos(d),d=Math.sin(d);
this.set(c,0,d,0,0,1,0,0,-d,0,c,0,0,0,0,1);
return this
},makeRotationZ:function(d){var c=Math.cos(d),d=Math.sin(d);
this.set(c,-d,0,0,d,c,0,0,0,0,1,0,0,0,0,1);
return this
},makeRotationAxis:function(u,t){var s=Math.cos(t),r=Math.sin(t),q=1-s,p=u.x,o=u.y,n=u.z,m=q*p,k=q*o;
this.set(m*p+s,m*o-r*n,m*n+r*o,0,m*o+r*n,k*o+s,k*n-r*p,0,m*n-r*o,k*n+r*p,q*n*n+s,0,0,0,0,1);
return this
},makeScale:function(e,d,f){this.set(e,0,0,0,0,d,0,0,0,0,f,0,0,0,0,1);
return this
},makeFrustum:function(k,h,p,o,n,m){var l=this.elements;
l[0]=2*n/(h-k);
l[4]=0;
l[8]=(h+k)/(h-k);
l[12]=0;
l[1]=0;
l[5]=2*n/(o-p);
l[9]=(o+p)/(o-p);
l[13]=0;
l[2]=0;
l[6]=0;
l[10]=-(m+n)/(m-n);
l[14]=-2*m*n/(m-n);
l[3]=0;
l[7]=0;
l[11]=-1;
l[15]=0;
return this
},makePerspective:function(g,f,l,k){var g=l*Math.tan(g*Math.PI/360),h=-g;
return this.makeFrustum(h*f,g*f,h,g,l,k)
},makeOrthographic:function(u,t,s,r,q,p){var o=this.elements,n=t-u,m=s-r,k=p-q;
o[0]=2/n;
o[4]=0;
o[8]=0;
o[12]=-((t+u)/n);
o[1]=0;
o[5]=2/m;
o[9]=0;
o[13]=-((s+r)/m);
o[2]=0;
o[6]=0;
o[10]=-2/k;
o[14]=-((p+q)/k);
o[3]=0;
o[7]=0;
o[11]=0;
o[15]=1;
return this
},clone:function(){var b=this.elements;
return new THREE.Matrix4(b[0],b[4],b[8],b[12],b[1],b[5],b[9],b[13],b[2],b[6],b[10],b[14],b[3],b[7],b[11],b[15])
}};
THREE.Matrix4.__v1=new THREE.Vector3;
THREE.Matrix4.__v2=new THREE.Vector3;
THREE.Matrix4.__v3=new THREE.Vector3;
THREE.Matrix4.__m1=new THREE.Matrix4;
THREE.Matrix4.__m2=new THREE.Matrix4;
THREE.Object3D=function(){this.id=THREE.Object3DCount++;
this.name="";
this.parent=void 0;
this.children=[];
this.up=new THREE.Vector3(0,1,0);
this.position=new THREE.Vector3;
this.rotation=new THREE.Vector3;
this.eulerOrder="XYZ";
this.scale=new THREE.Vector3(1,1,1);
this.flipSided=this.doubleSided=false;
this.renderDepth=null;
this.rotationAutoUpdate=true;
this.matrix=new THREE.Matrix4;
this.matrixWorld=new THREE.Matrix4;
this.matrixRotationWorld=new THREE.Matrix4;
this.matrixWorldNeedsUpdate=this.matrixAutoUpdate=true;
this.quaternion=new THREE.Quaternion;
this.useQuaternion=false;
this.boundRadius=0;
this.boundRadiusScale=1;
this.visible=true;
this.receiveShadow=this.castShadow=false;
this.frustumCulled=true;
this._vector=new THREE.Vector3
};
THREE.Object3D.prototype={constructor:THREE.Object3D,applyMatrix:function(b){this.matrix.multiply(b,this.matrix);
this.scale.getScaleFromMatrix(this.matrix);
this.rotation.getRotationFromMatrix(this.matrix,this.scale);
this.position.getPositionFromMatrix(this.matrix)
},translate:function(d,c){this.matrix.rotateAxis(c);
this.position.addSelf(c.multiplyScalar(d))
},translateX:function(b){this.translate(b,this._vector.set(1,0,0))
},translateY:function(b){this.translate(b,this._vector.set(0,1,0))
},translateZ:function(b){this.translate(b,this._vector.set(0,0,1))
},lookAt:function(b){this.matrix.lookAt(b,this.position,this.up);
this.rotationAutoUpdate&&this.rotation.getRotationFromMatrix(this.matrix)
},add:function(d){if(d===this){console.warn("THREE.Object3D.add: An object can't be added as a child of itself.")
}else{if(d instanceof THREE.Object3D){d.parent!==void 0&&d.parent.remove(d);
d.parent=this;
this.children.push(d);
for(var c=this;
c.parent!==void 0;
){c=c.parent
}c!==void 0&&c instanceof THREE.Scene&&c.__addObject(d)
}}},remove:function(d){var c=this.children.indexOf(d);
if(c!==-1){d.parent=void 0;
this.children.splice(c,1);
for(c=this;
c.parent!==void 0;
){c=c.parent
}c!==void 0&&c instanceof THREE.Scene&&c.__removeObject(d)
}},getChildByName:function(g,f){var l,k,h;
l=0;
for(k=this.children.length;
l<k;
l++){h=this.children[l];
if(h.name===g){return h
}if(f){h=h.getChildByName(g,f);
if(h!==void 0){return h
}}}},updateMatrix:function(){this.matrix.setPosition(this.position);
this.useQuaternion?this.matrix.setRotationFromQuaternion(this.quaternion):this.matrix.setRotationFromEuler(this.rotation,this.eulerOrder);
if(this.scale.x!==1||this.scale.y!==1||this.scale.z!==1){this.matrix.scale(this.scale);
this.boundRadiusScale=Math.max(this.scale.x,Math.max(this.scale.y,this.scale.z))
}this.matrixWorldNeedsUpdate=true
},updateMatrixWorld:function(e){this.matrixAutoUpdate&&this.updateMatrix();
if(this.matrixWorldNeedsUpdate||e){this.parent?this.matrixWorld.multiply(this.parent.matrixWorld,this.matrix):this.matrixWorld.copy(this.matrix);
this.matrixWorldNeedsUpdate=false;
e=true
}for(var d=0,f=this.children.length;
d<f;
d++){this.children[d].updateMatrixWorld(e)
}}};
THREE.Object3DCount=0;
THREE.Projector=function(){function ag(){var b=aa[ab]=aa[ab]||new THREE.RenderableObject;
ab++;
return b
}function af(){var b=W[Y]=W[Y]||new THREE.RenderableVertex;
Y++;
return b
}function ae(d,c){return c.z-d.z
}function ad(l,k){var r=0,q=1,p=l.z+l.w,o=k.z+k.w,n=-l.z+l.w,m=-k.z+k.w;
if(p>=0&&o>=0&&n>=0&&m>=0){return true
}if(p<0&&o<0||n<0&&m<0){return false
}p<0?r=Math.max(r,p/(p-o)):o<0&&(q=Math.min(q,p/(p-o)));
n<0?r=Math.max(r,n/(n-m)):m<0&&(q=Math.min(q,n/(n-m)));
if(q<r){return false
}l.lerpSelf(k,r);
k.lerpSelf(l,1-q);
return true
}var ac,ab,aa=[],Z,Y,W=[],X,S,V=[],T,Q=[],U,P,L=[],N,D,O=[],G={objects:[],sprites:[],lights:[],elements:[]},F=new THREE.Vector3,M=new THREE.Vector4,B=new THREE.Matrix4,I=new THREE.Matrix4,R=new THREE.Frustum,C=new THREE.Vector4,x=new THREE.Vector4;
this.projectVector=function(d,c){c.matrixWorldInverse.getInverse(c.matrixWorld);
B.multiply(c.projectionMatrix,c.matrixWorldInverse);
B.multiplyVector3(d);
return d
};
this.unprojectVector=function(d,c){c.projectionMatrixInverse.getInverse(c.projectionMatrix);
B.multiply(c.matrixWorld,c.projectionMatrixInverse);
B.multiplyVector3(d);
return d
};
this.pickingRay=function(e,d){var f;
e.z=-1;
f=new THREE.Vector3(e.x,e.y,1);
this.unprojectVector(e,d);
this.unprojectVector(f,d);
f.subSelf(e).normalize();
return new THREE.Ray(e,f)
};
this.projectGraph=function(a,e){ab=0;
G.objects.length=0;
G.sprites.length=0;
G.lights.length=0;
var c=function(f){if(f.visible!==false){if((f instanceof THREE.Mesh||f instanceof THREE.Line)&&(f.frustumCulled===false||R.contains(f))){F.copy(f.matrixWorld.getPosition());
B.multiplyVector3(F);
ac=ag();
ac.object=f;
ac.z=F.z;
G.objects.push(ac)
}else{if(f instanceof THREE.Sprite||f instanceof THREE.Particle){F.copy(f.matrixWorld.getPosition());
B.multiplyVector3(F);
ac=ag();
ac.object=f;
ac.z=F.z;
G.sprites.push(ac)
}else{f instanceof THREE.Light&&G.lights.push(f)
}}for(var h=0,g=f.children.length;
h<g;
h++){c(f.children[h])
}}};
c(a);
e&&G.objects.sort(ae);
return G
};
this.projectScene=function(E,A,z){var y=A.near,r=A.far,w=false,q,h,t,c,s,m,u,v,n,l,b,k,o,d,p;
D=P=T=S=0;
G.elements.length=0;
if(A.parent===void 0){console.warn("DEPRECATED: Camera hasn't been added to a Scene. Adding it...");
E.add(A)
}E.updateMatrixWorld();
A.matrixWorldInverse.getInverse(A.matrixWorld);
B.multiply(A.projectionMatrix,A.matrixWorldInverse);
R.setFromMatrix(B);
G=this.projectGraph(E,false);
E=0;
for(q=G.objects.length;
E<q;
E++){n=G.objects[E].object;
l=n.matrixWorld;
Y=0;
if(n instanceof THREE.Mesh){b=n.geometry;
k=n.geometry.materials;
c=b.vertices;
o=b.faces;
d=b.faceVertexUvs;
b=n.matrixRotationWorld.extractRotation(l);
h=0;
for(t=c.length;
h<t;
h++){Z=af();
Z.positionWorld.copy(c[h]);
l.multiplyVector3(Z.positionWorld);
Z.positionScreen.copy(Z.positionWorld);
B.multiplyVector4(Z.positionScreen);
Z.positionScreen.x=Z.positionScreen.x/Z.positionScreen.w;
Z.positionScreen.y=Z.positionScreen.y/Z.positionScreen.w;
Z.visible=Z.positionScreen.z>y&&Z.positionScreen.z<r
}c=0;
for(h=o.length;
c<h;
c++){t=o[c];
if(t instanceof THREE.Face3){s=W[t.a];
m=W[t.b];
u=W[t.c];
if(s.visible&&m.visible&&u.visible){w=(u.positionScreen.x-s.positionScreen.x)*(m.positionScreen.y-s.positionScreen.y)-(u.positionScreen.y-s.positionScreen.y)*(m.positionScreen.x-s.positionScreen.x)<0;
if(n.doubleSided||w!=n.flipSided){v=V[S]=V[S]||new THREE.RenderableFace3;
S++;
X=v;
X.v1.copy(s);
X.v2.copy(m);
X.v3.copy(u)
}else{continue
}}else{continue
}}else{if(t instanceof THREE.Face4){s=W[t.a];
m=W[t.b];
u=W[t.c];
v=W[t.d];
if(s.visible&&m.visible&&u.visible&&v.visible){w=(v.positionScreen.x-s.positionScreen.x)*(m.positionScreen.y-s.positionScreen.y)-(v.positionScreen.y-s.positionScreen.y)*(m.positionScreen.x-s.positionScreen.x)<0||(m.positionScreen.x-u.positionScreen.x)*(v.positionScreen.y-u.positionScreen.y)-(m.positionScreen.y-u.positionScreen.y)*(v.positionScreen.x-u.positionScreen.x)<0;
if(n.doubleSided||w!=n.flipSided){p=Q[T]=Q[T]||new THREE.RenderableFace4;
T++;
X=p;
X.v1.copy(s);
X.v2.copy(m);
X.v3.copy(u);
X.v4.copy(v)
}else{continue
}}else{continue
}}}X.normalWorld.copy(t.normal);
!w&&(n.flipSided||n.doubleSided)&&X.normalWorld.negate();
b.multiplyVector3(X.normalWorld);
X.centroidWorld.copy(t.centroid);
l.multiplyVector3(X.centroidWorld);
X.centroidScreen.copy(X.centroidWorld);
B.multiplyVector3(X.centroidScreen);
u=t.vertexNormals;
s=0;
for(m=u.length;
s<m;
s++){v=X.vertexNormalsWorld[s];
v.copy(u[s]);
!w&&(n.flipSided||n.doubleSided)&&v.negate();
b.multiplyVector3(v)
}s=0;
for(m=d.length;
s<m;
s++){if(p=d[s][c]){u=0;
for(v=p.length;
u<v;
u++){X.uvs[s][u]=p[u]
}}}X.material=n.material;
X.faceMaterial=t.materialIndex!==null?k[t.materialIndex]:null;
X.z=X.centroidScreen.z;
G.elements.push(X)
}}else{if(n instanceof THREE.Line){I.multiply(B,l);
c=n.geometry.vertices;
s=af();
s.positionScreen.copy(c[0]);
I.multiplyVector4(s.positionScreen);
l=n.type===THREE.LinePieces?2:1;
h=1;
for(t=c.length;
h<t;
h++){s=af();
s.positionScreen.copy(c[h]);
I.multiplyVector4(s.positionScreen);
if(!((h+1)%l>0)){m=W[Y-2];
C.copy(s.positionScreen);
x.copy(m.positionScreen);
if(ad(C,x)){C.multiplyScalar(1/C.w);
x.multiplyScalar(1/x.w);
k=L[P]=L[P]||new THREE.RenderableLine;
P++;
U=k;
U.v1.positionScreen.copy(C);
U.v2.positionScreen.copy(x);
U.z=Math.max(C.z,x.z);
U.material=n.material;
G.elements.push(U)
}}}}}}E=0;
for(q=G.sprites.length;
E<q;
E++){n=G.sprites[E].object;
l=n.matrixWorld;
if(n instanceof THREE.Particle){M.set(l.elements[12],l.elements[13],l.elements[14],1);
B.multiplyVector4(M);
M.z=M.z/M.w;
if(M.z>0&&M.z<1){y=O[D]=O[D]||new THREE.RenderableParticle;
D++;
N=y;
N.x=M.x/M.w;
N.y=M.y/M.w;
N.z=M.z;
N.rotation=n.rotation.z;
N.scale.x=n.scale.x*Math.abs(N.x-(M.x+A.projectionMatrix.elements[0])/(M.w+A.projectionMatrix.elements[12]));
N.scale.y=n.scale.y*Math.abs(N.y-(M.y+A.projectionMatrix.elements[5])/(M.w+A.projectionMatrix.elements[13]));
N.material=n.material;
G.elements.push(N)
}}}z&&G.elements.sort(ae);
return G
}
};
THREE.Quaternion=function(f,e,h,g){this.x=f||0;
this.y=e||0;
this.z=h||0;
this.w=g!==void 0?g:1
};
THREE.Quaternion.prototype={constructor:THREE.Quaternion,set:function(f,e,h,g){this.x=f;
this.y=e;
this.z=h;
this.w=g;
return this
},copy:function(b){this.x=b.x;
this.y=b.y;
this.z=b.z;
this.w=b.w;
return this
},setFromEuler:function(l){var k=Math.PI/360,r=l.x*k,q=l.y*k,p=l.z*k,l=Math.cos(q),q=Math.sin(q),k=Math.cos(-p),p=Math.sin(-p),o=Math.cos(r),r=Math.sin(r),n=l*k,m=q*p;
this.w=n*o-m*r;
this.x=n*r+m*o;
this.y=q*k*o+l*p*r;
this.z=l*p*o-q*k*r;
return this
},setFromAxisAngle:function(f,e){var h=e/2,g=Math.sin(h);
this.x=f.x*g;
this.y=f.y*g;
this.z=f.z*g;
this.w=Math.cos(h);
return this
},setFromRotationMatrix:function(d){var c=Math.pow(d.determinant(),1/3);
this.w=Math.sqrt(Math.max(0,c+d.elements[0]+d.elements[5]+d.elements[10]))/2;
this.x=Math.sqrt(Math.max(0,c+d.elements[0]-d.elements[5]-d.elements[10]))/2;
this.y=Math.sqrt(Math.max(0,c-d.elements[0]+d.elements[5]-d.elements[10]))/2;
this.z=Math.sqrt(Math.max(0,c-d.elements[0]-d.elements[5]+d.elements[10]))/2;
this.x=d.elements[6]-d.elements[9]<0?-Math.abs(this.x):Math.abs(this.x);
this.y=d.elements[8]-d.elements[2]<0?-Math.abs(this.y):Math.abs(this.y);
this.z=d.elements[1]-d.elements[4]<0?-Math.abs(this.z):Math.abs(this.z);
this.normalize();
return this
},calculateW:function(){this.w=-Math.sqrt(Math.abs(1-this.x*this.x-this.y*this.y-this.z*this.z));
return this
},inverse:function(){this.x=this.x*-1;
this.y=this.y*-1;
this.z=this.z*-1;
return this
},length:function(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)
},normalize:function(){var b=Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w);
if(b===0){this.w=this.z=this.y=this.x=0
}else{b=1/b;
this.x=this.x*b;
this.y=this.y*b;
this.z=this.z*b;
this.w=this.w*b
}return this
},multiply:function(d,c){this.x=d.x*c.w+d.y*c.z-d.z*c.y+d.w*c.x;
this.y=-d.x*c.z+d.y*c.w+d.z*c.x+d.w*c.y;
this.z=d.x*c.y-d.y*c.x+d.z*c.w+d.w*c.z;
this.w=-d.x*c.x-d.y*c.y-d.z*c.z+d.w*c.w;
return this
},multiplySelf:function(l){var k=this.x,r=this.y,q=this.z,p=this.w,o=l.x,n=l.y,m=l.z,l=l.w;
this.x=k*l+p*o+r*m-q*n;
this.y=r*l+p*n+q*o-k*m;
this.z=q*l+p*m+k*n-r*o;
this.w=p*l-k*o-r*n-q*m;
return this
},multiplyVector3:function(y,x){x||(x=y);
var w=y.x,v=y.y,u=y.z,t=this.x,s=this.y,r=this.z,q=this.w,n=q*w+s*u-r*v,o=q*v+r*w-t*u,m=q*u+t*v-s*w,w=-t*w-s*v-r*u;
x.x=n*q+w*-t+o*-r-m*-s;
x.y=o*q+w*-s+m*-t-n*-r;
x.z=m*q+w*-r+n*-s-o*-t;
return x
},clone:function(){return new THREE.Quaternion(this.x,this.y,this.z,this.w)
}};
THREE.Quaternion.slerp=function(h,g,n,m){var l=h.w*g.w+h.x*g.x+h.y*g.y+h.z*g.z;
if(l<0){n.w=-g.w;
n.x=-g.x;
n.y=-g.y;
n.z=-g.z;
l=-l
}else{n.copy(g)
}if(Math.abs(l)>=1){n.w=h.w;
n.x=h.x;
n.y=h.y;
n.z=h.z;
return n
}var k=Math.acos(l),l=Math.sqrt(1-l*l);
if(Math.abs(l)<0.001){n.w=0.5*(h.w+g.w);
n.x=0.5*(h.x+g.x);
n.y=0.5*(h.y+g.y);
n.z=0.5*(h.z+g.z);
return n
}g=Math.sin((1-m)*k)/l;
m=Math.sin(m*k)/l;
n.w=h.w*g+n.w*m;
n.x=h.x*g+n.x*m;
n.y=h.y*g+n.y*m;
n.z=h.z*g+n.z*m;
return n
};
THREE.Vertex=function(){console.warn("THREE.Vertex has been DEPRECATED. Use THREE.Vector3 instead.")
};
THREE.Face3=function(h,g,n,m,l,k){this.a=h;
this.b=g;
this.c=n;
this.normal=m instanceof THREE.Vector3?m:new THREE.Vector3;
this.vertexNormals=m instanceof Array?m:[];
this.color=l instanceof THREE.Color?l:new THREE.Color;
this.vertexColors=l instanceof Array?l:[];
this.vertexTangents=[];
this.materialIndex=k;
this.centroid=new THREE.Vector3
};
THREE.Face3.prototype={constructor:THREE.Face3,clone:function(){var e=new THREE.Face3(this.a,this.b,this.c);
e.normal.copy(this.normal);
e.color.copy(this.color);
e.centroid.copy(this.centroid);
e.materialIndex=this.materialIndex;
var d,f;
d=0;
for(f=this.vertexNormals.length;
d<f;
d++){e.vertexNormals[d]=this.vertexNormals[d].clone()
}d=0;
for(f=this.vertexColors.length;
d<f;
d++){e.vertexColors[d]=this.vertexColors[d].clone()
}d=0;
for(f=this.vertexTangents.length;
d<f;
d++){e.vertexTangents[d]=this.vertexTangents[d].clone()
}return e
}};
THREE.Face4=function(k,h,p,o,n,m,l){this.a=k;
this.b=h;
this.c=p;
this.d=o;
this.normal=n instanceof THREE.Vector3?n:new THREE.Vector3;
this.vertexNormals=n instanceof Array?n:[];
this.color=m instanceof THREE.Color?m:new THREE.Color;
this.vertexColors=m instanceof Array?m:[];
this.vertexTangents=[];
this.materialIndex=l;
this.centroid=new THREE.Vector3
};
THREE.Face4.prototype={constructor:THREE.Face4,clone:function(){var e=new THREE.Face4(this.a,this.b,this.c,this.d);
e.normal.copy(this.normal);
e.color.copy(this.color);
e.centroid.copy(this.centroid);
e.materialIndex=this.materialIndex;
var d,f;
d=0;
for(f=this.vertexNormals.length;
d<f;
d++){e.vertexNormals[d]=this.vertexNormals[d].clone()
}d=0;
for(f=this.vertexColors.length;
d<f;
d++){e.vertexColors[d]=this.vertexColors[d].clone()
}d=0;
for(f=this.vertexTangents.length;
d<f;
d++){e.vertexTangents[d]=this.vertexTangents[d].clone()
}return e
}};
THREE.UV=function(d,c){this.u=d||0;
this.v=c||0
};
THREE.UV.prototype={constructor:THREE.UV,set:function(d,c){this.u=d;
this.v=c;
return this
},copy:function(b){this.u=b.u;
this.v=b.v;
return this
},lerpSelf:function(d,c){this.u=this.u+(d.u-this.u)*c;
this.v=this.v+(d.v-this.v)*c;
return this
},clone:function(){return new THREE.UV(this.u,this.v)
}};
THREE.Geometry=function(){this.id=THREE.GeometryCount++;
this.vertices=[];
this.colors=[];
this.materials=[];
this.faces=[];
this.faceUvs=[[]];
this.faceVertexUvs=[[]];
this.morphTargets=[];
this.morphColors=[];
this.morphNormals=[];
this.skinWeights=[];
this.skinIndices=[];
this.boundingSphere=this.boundingBox=null;
this.dynamic=this.hasTangents=false
};
THREE.Geometry.prototype={constructor:THREE.Geometry,applyMatrix:function(k){var h=new THREE.Matrix4;
h.extractRotation(k);
for(var p=0,o=this.vertices.length;
p<o;
p++){k.multiplyVector3(this.vertices[p])
}p=0;
for(o=this.faces.length;
p<o;
p++){var n=this.faces[p];
h.multiplyVector3(n.normal);
for(var m=0,l=n.vertexNormals.length;
m<l;
m++){h.multiplyVector3(n.vertexNormals[m])
}k.multiplyVector3(n.centroid)
}},computeCentroids:function(){var e,d,f;
e=0;
for(d=this.faces.length;
e<d;
e++){f=this.faces[e];
f.centroid.set(0,0,0);
if(f instanceof THREE.Face3){f.centroid.addSelf(this.vertices[f.a]);
f.centroid.addSelf(this.vertices[f.b]);
f.centroid.addSelf(this.vertices[f.c]);
f.centroid.divideScalar(3)
}else{if(f instanceof THREE.Face4){f.centroid.addSelf(this.vertices[f.a]);
f.centroid.addSelf(this.vertices[f.b]);
f.centroid.addSelf(this.vertices[f.c]);
f.centroid.addSelf(this.vertices[f.d]);
f.centroid.divideScalar(4)
}}}},computeFaceNormals:function(){var l,k,r,q,p,o,n=new THREE.Vector3,m=new THREE.Vector3;
l=0;
for(k=this.faces.length;
l<k;
l++){r=this.faces[l];
q=this.vertices[r.a];
p=this.vertices[r.b];
o=this.vertices[r.c];
n.sub(o,p);
m.sub(q,p);
n.crossSelf(m);
n.isZero()||n.normalize();
r.normal.copy(n)
}},computeVertexNormals:function(){var f,e,h,g;
if(this.__tmpVertices===void 0){g=this.__tmpVertices=Array(this.vertices.length);
f=0;
for(e=this.vertices.length;
f<e;
f++){g[f]=new THREE.Vector3
}f=0;
for(e=this.faces.length;
f<e;
f++){h=this.faces[f];
if(h instanceof THREE.Face3){h.vertexNormals=[new THREE.Vector3,new THREE.Vector3,new THREE.Vector3]
}else{if(h instanceof THREE.Face4){h.vertexNormals=[new THREE.Vector3,new THREE.Vector3,new THREE.Vector3,new THREE.Vector3]
}}}}else{g=this.__tmpVertices;
f=0;
for(e=this.vertices.length;
f<e;
f++){g[f].set(0,0,0)
}}f=0;
for(e=this.faces.length;
f<e;
f++){h=this.faces[f];
if(h instanceof THREE.Face3){g[h.a].addSelf(h.normal);
g[h.b].addSelf(h.normal);
g[h.c].addSelf(h.normal)
}else{if(h instanceof THREE.Face4){g[h.a].addSelf(h.normal);
g[h.b].addSelf(h.normal);
g[h.c].addSelf(h.normal);
g[h.d].addSelf(h.normal)
}}}f=0;
for(e=this.vertices.length;
f<e;
f++){g[f].normalize()
}f=0;
for(e=this.faces.length;
f<e;
f++){h=this.faces[f];
if(h instanceof THREE.Face3){h.vertexNormals[0].copy(g[h.a]);
h.vertexNormals[1].copy(g[h.b]);
h.vertexNormals[2].copy(g[h.c])
}else{if(h instanceof THREE.Face4){h.vertexNormals[0].copy(g[h.a]);
h.vertexNormals[1].copy(g[h.b]);
h.vertexNormals[2].copy(g[h.c]);
h.vertexNormals[3].copy(g[h.d])
}}}},computeMorphNormals:function(){var u,t,s,r,q;
s=0;
for(r=this.faces.length;
s<r;
s++){q=this.faces[s];
q.__originalFaceNormal?q.__originalFaceNormal.copy(q.normal):q.__originalFaceNormal=q.normal.clone();
if(!q.__originalVertexNormals){q.__originalVertexNormals=[]
}u=0;
for(t=q.vertexNormals.length;
u<t;
u++){q.__originalVertexNormals[u]?q.__originalVertexNormals[u].copy(q.vertexNormals[u]):q.__originalVertexNormals[u]=q.vertexNormals[u].clone()
}}var p=new THREE.Geometry;
p.faces=this.faces;
u=0;
for(t=this.morphTargets.length;
u<t;
u++){if(!this.morphNormals[u]){this.morphNormals[u]={};
this.morphNormals[u].faceNormals=[];
this.morphNormals[u].vertexNormals=[];
var o=this.morphNormals[u].faceNormals,n=this.morphNormals[u].vertexNormals,m,k;
s=0;
for(r=this.faces.length;
s<r;
s++){q=this.faces[s];
m=new THREE.Vector3;
k=q instanceof THREE.Face3?{a:new THREE.Vector3,b:new THREE.Vector3,c:new THREE.Vector3}:{a:new THREE.Vector3,b:new THREE.Vector3,c:new THREE.Vector3,d:new THREE.Vector3};
o.push(m);
n.push(k)
}}o=this.morphNormals[u];
p.vertices=this.morphTargets[u].vertices;
p.computeFaceNormals();
p.computeVertexNormals();
s=0;
for(r=this.faces.length;
s<r;
s++){q=this.faces[s];
m=o.faceNormals[s];
k=o.vertexNormals[s];
m.copy(q.normal);
if(q instanceof THREE.Face3){k.a.copy(q.vertexNormals[0]);
k.b.copy(q.vertexNormals[1]);
k.c.copy(q.vertexNormals[2])
}else{k.a.copy(q.vertexNormals[0]);
k.b.copy(q.vertexNormals[1]);
k.c.copy(q.vertexNormals[2]);
k.d.copy(q.vertexNormals[3])
}}}s=0;
for(r=this.faces.length;
s<r;
s++){q=this.faces[s];
q.normal=q.__originalFaceNormal;
q.vertexNormals=q.__originalVertexNormals
}},computeTangents:function(){function ao(h,g,o,n,m,l,k){ah=h.vertices[g];
ag=h.vertices[o];
ae=h.vertices[n];
af=ai[m];
aa=ai[l];
ad=ai[k];
ab=ag.x-ah.x;
Y=ae.x-ah.x;
ac=ag.y-ah.y;
X=ae.y-ah.y;
S=ag.z-ah.z;
U=ae.z-ah.z;
L=aa.u-af.u;
W=ad.u-af.u;
O=aa.v-af.v;
N=ad.v-af.v;
T=1/(L*N-W*O);
I.set((N*ab-O*Y)*T,(N*ac-O*X)*T,(N*S-O*U)*T);
F.set((L*Y-W*ab)*T,(L*X-W*ac)*T,(L*U-W*S)*T);
Q[g].addSelf(I);
Q[o].addSelf(I);
Q[n].addSelf(I);
Z[g].addSelf(F);
Z[o].addSelf(F);
Z[n].addSelf(F)
}var an,am,al,ak,aj,ai,ah,ag,ae,af,aa,ad,ab,Y,ac,X,S,U,L,W,O,N,T,G,Q=[],Z=[],I=new THREE.Vector3,F=new THREE.Vector3,x=new THREE.Vector3,B=new THREE.Vector3,V=new THREE.Vector3;
an=0;
for(am=this.vertices.length;
an<am;
an++){Q[an]=new THREE.Vector3;
Z[an]=new THREE.Vector3
}an=0;
for(am=this.faces.length;
an<am;
an++){aj=this.faces[an];
ai=this.faceVertexUvs[0][an];
if(aj instanceof THREE.Face3){ao(this,aj.a,aj.b,aj.c,0,1,2)
}else{if(aj instanceof THREE.Face4){ao(this,aj.a,aj.b,aj.d,0,1,3);
ao(this,aj.b,aj.c,aj.d,1,2,3)
}}}var C=["a","b","c","d"];
an=0;
for(am=this.faces.length;
an<am;
an++){aj=this.faces[an];
for(al=0;
al<aj.vertexNormals.length;
al++){V.copy(aj.vertexNormals[al]);
ak=aj[C[al]];
G=Q[ak];
x.copy(G);
x.subSelf(V.multiplyScalar(V.dot(G))).normalize();
B.cross(aj.vertexNormals[al],G);
ak=B.dot(Z[ak]);
ak=ak<0?-1:1;
aj.vertexTangents[al]=new THREE.Vector4(x.x,x.y,x.z,ak)
}}this.hasTangents=true
},computeBoundingBox:function(){if(!this.boundingBox){this.boundingBox={min:new THREE.Vector3,max:new THREE.Vector3}
}if(this.vertices.length>0){var g;
g=this.vertices[0];
this.boundingBox.min.copy(g);
this.boundingBox.max.copy(g);
for(var f=this.boundingBox.min,l=this.boundingBox.max,k=1,h=this.vertices.length;
k<h;
k++){g=this.vertices[k];
if(g.x<f.x){f.x=g.x
}else{if(g.x>l.x){l.x=g.x
}}if(g.y<f.y){f.y=g.y
}else{if(g.y>l.y){l.y=g.y
}}if(g.z<f.z){f.z=g.z
}else{if(g.z>l.z){l.z=g.z
}}}}else{this.boundingBox.min.set(0,0,0);
this.boundingBox.max.set(0,0,0)
}},computeBoundingSphere:function(){if(!this.boundingSphere){this.boundingSphere={radius:0}
}for(var f,e=0,h=0,g=this.vertices.length;
h<g;
h++){f=this.vertices[h].length();
f>e&&(e=f)
}this.boundingSphere.radius=e
},mergeVertices:function(){var l={},k=[],r=[],q,p=Math.pow(10,4),o,n,m;
o=0;
for(n=this.vertices.length;
o<n;
o++){q=this.vertices[o];
q=[Math.round(q.x*p),Math.round(q.y*p),Math.round(q.z*p)].join("_");
if(l[q]===void 0){l[q]=o;
k.push(this.vertices[o]);
r[o]=k.length-1
}else{r[o]=r[l[q]]
}}o=0;
for(n=this.faces.length;
o<n;
o++){p=this.faces[o];
if(p instanceof THREE.Face3){p.a=r[p.a];
p.b=r[p.b];
p.c=r[p.c]
}else{if(p instanceof THREE.Face4){p.a=r[p.a];
p.b=r[p.b];
p.c=r[p.c];
p.d=r[p.d];
q=[p.a,p.b,p.c,p.d];
for(l=3;
l>0;
l--){if(q.indexOf(p["abcd"[l]])!=l){q.splice(l,1);
this.faces[o]=new THREE.Face3(q[0],q[1],q[2]);
p=0;
for(q=this.faceVertexUvs.length;
p<q;
p++){(m=this.faceVertexUvs[p][o])&&m.splice(l,1)
}break
}}}}}r=this.vertices.length-k.length;
this.vertices=k;
return r
}};
THREE.GeometryCount=0;
THREE.Spline=function(A){function z(k,h,C,B,p,m,l){k=(C-k)*0.5;
B=(B-h)*0.5;
return(2*(h-C)+k+B)*l+(-3*(h-C)-2*k-B)*m+k*p+h
}this.points=A;
var y=[],x={x:0,y:0,z:0},w,v,u,t,s,q,r,n,o;
this.initFromArray=function(d){this.points=[];
for(var c=0;
c<d.length;
c++){this.points[c]={x:d[c][0],y:d[c][1],z:d[c][2]}
}};
this.getPoint=function(b){w=(this.points.length-1)*b;
v=Math.floor(w);
u=w-v;
y[0]=v===0?v:v-1;
y[1]=v;
y[2]=v>this.points.length-2?this.points.length-1:v+1;
y[3]=v>this.points.length-3?this.points.length-1:v+2;
q=this.points[y[0]];
r=this.points[y[1]];
n=this.points[y[2]];
o=this.points[y[3]];
t=u*u;
s=u*t;
x.x=z(q.x,r.x,n.x,o.x,u,t,s);
x.y=z(q.y,r.y,n.y,o.y,u,t,s);
x.z=z(q.z,r.z,n.z,o.z,u,t,s);
return x
};
this.getControlPointsArray=function(){var f,e,h=this.points.length,g=[];
for(f=0;
f<h;
f++){e=this.points[f];
g[f]=[e.x,e.y,e.z]
}return g
};
this.getLength=function(F){var E,D,C,B=E=E=0,p=new THREE.Vector3,m=new THREE.Vector3,l=[],k=0;
l[0]=0;
F||(F=100);
D=this.points.length*F;
p.copy(this.points[0]);
for(F=1;
F<D;
F++){E=F/D;
C=this.getPoint(E);
m.copy(C);
k=k+m.distanceTo(p);
p.copy(C);
E=(this.points.length-1)*E;
E=Math.floor(E);
if(E!=B){l[E]=k;
B=E
}}l[l.length]=k;
return{chunks:l,total:k}
};
this.reparametrizeByArcLength=function(H){var G,F,E,D,C,B,p=[],m=new THREE.Vector3,l=this.getLength();
p.push(m.copy(this.points[0]).clone());
for(G=1;
G<this.points.length;
G++){F=l.chunks[G]-l.chunks[G-1];
B=Math.ceil(H*F/l.total);
D=(G-1)/(this.points.length-1);
C=G/(this.points.length-1);
for(F=1;
F<B-1;
F++){E=D+F*(1/B)*(C-D);
E=this.getPoint(E);
p.push(m.copy(E).clone())
}p.push(m.copy(this.points[G]).clone())
}this.points=p
}
};
THREE.Camera=function(){THREE.Object3D.call(this);
this.matrixWorldInverse=new THREE.Matrix4;
this.projectionMatrix=new THREE.Matrix4;
this.projectionMatrixInverse=new THREE.Matrix4
};
THREE.Camera.prototype=new THREE.Object3D;
THREE.Camera.prototype.constructor=THREE.Camera;
THREE.Camera.prototype.lookAt=function(b){this.matrix.lookAt(this.position,b,this.up);
this.rotationAutoUpdate&&this.rotation.getRotationFromMatrix(this.matrix)
};
THREE.OrthographicCamera=function(h,g,n,m,l,k){THREE.Camera.call(this);
this.left=h;
this.right=g;
this.top=n;
this.bottom=m;
this.near=l!==void 0?l:0.1;
this.far=k!==void 0?k:2000;
this.updateProjectionMatrix()
};
THREE.OrthographicCamera.prototype=new THREE.Camera;
THREE.OrthographicCamera.prototype.constructor=THREE.OrthographicCamera;
THREE.OrthographicCamera.prototype.updateProjectionMatrix=function(){this.projectionMatrix.makeOrthographic(this.left,this.right,this.top,this.bottom,this.near,this.far)
};
THREE.PerspectiveCamera=function(f,e,h,g){THREE.Camera.call(this);
this.fov=f!==void 0?f:50;
this.aspect=e!==void 0?e:1;
this.near=h!==void 0?h:0.1;
this.far=g!==void 0?g:2000;
this.updateProjectionMatrix()
};
THREE.PerspectiveCamera.prototype=new THREE.Camera;
THREE.PerspectiveCamera.prototype.constructor=THREE.PerspectiveCamera;
THREE.PerspectiveCamera.prototype.setLens=function(d,c){this.fov=2*Math.atan((c!==void 0?c:24)/(d*2))*(180/Math.PI);
this.updateProjectionMatrix()
};
THREE.PerspectiveCamera.prototype.setViewOffset=function(h,g,n,m,l,k){this.fullWidth=h;
this.fullHeight=g;
this.x=n;
this.y=m;
this.width=l;
this.height=k;
this.updateProjectionMatrix()
};
THREE.PerspectiveCamera.prototype.updateProjectionMatrix=function(){if(this.fullWidth){var f=this.fullWidth/this.fullHeight,e=Math.tan(this.fov*Math.PI/360)*this.near,h=-e,g=f*h,f=Math.abs(f*e-g),h=Math.abs(e-h);
this.projectionMatrix.makeFrustum(g+this.x*f/this.fullWidth,g+(this.x+this.width)*f/this.fullWidth,e-(this.y+this.height)*h/this.fullHeight,e-this.y*h/this.fullHeight,this.near,this.far)
}else{this.projectionMatrix.makePerspective(this.fov,this.aspect,this.near,this.far)
}};
THREE.Light=function(b){THREE.Object3D.call(this);
this.color=new THREE.Color(b)
};
THREE.Light.prototype=new THREE.Object3D;
THREE.Light.prototype.constructor=THREE.Light;
THREE.Light.prototype.supr=THREE.Object3D.prototype;
THREE.AmbientLight=function(b){THREE.Light.call(this,b)
};
THREE.AmbientLight.prototype=new THREE.Light;
THREE.AmbientLight.prototype.constructor=THREE.AmbientLight;
THREE.DirectionalLight=function(e,d,f){THREE.Light.call(this,e);
this.position=new THREE.Vector3(0,1,0);
this.target=new THREE.Object3D;
this.intensity=d!==void 0?d:1;
this.distance=f!==void 0?f:0;
this.onlyShadow=this.castShadow=false;
this.shadowCameraNear=50;
this.shadowCameraFar=5000;
this.shadowCameraLeft=-500;
this.shadowCameraTop=this.shadowCameraRight=500;
this.shadowCameraBottom=-500;
this.shadowCameraVisible=false;
this.shadowBias=0;
this.shadowDarkness=0.5;
this.shadowMapHeight=this.shadowMapWidth=512;
this.shadowCascade=false;
this.shadowCascadeOffset=new THREE.Vector3(0,0,-1000);
this.shadowCascadeCount=2;
this.shadowCascadeBias=[0,0,0];
this.shadowCascadeWidth=[512,512,512];
this.shadowCascadeHeight=[512,512,512];
this.shadowCascadeNearZ=[-1,0.99,0.998];
this.shadowCascadeFarZ=[0.99,0.998,1];
this.shadowCascadeArray=[];
this.shadowMatrix=this.shadowCamera=this.shadowMapSize=this.shadowMap=null
};
THREE.DirectionalLight.prototype=new THREE.Light;
THREE.DirectionalLight.prototype.constructor=THREE.DirectionalLight;
THREE.PointLight=function(e,d,f){THREE.Light.call(this,e);
this.position=new THREE.Vector3(0,0,0);
this.intensity=d!==void 0?d:1;
this.distance=f!==void 0?f:0
};
THREE.PointLight.prototype=new THREE.Light;
THREE.PointLight.prototype.constructor=THREE.PointLight;
THREE.SpotLight=function(g,f,l,k,h){THREE.Light.call(this,g);
this.position=new THREE.Vector3(0,1,0);
this.target=new THREE.Object3D;
this.intensity=f!==void 0?f:1;
this.distance=l!==void 0?l:0;
this.angle=k!==void 0?k:Math.PI/2;
this.exponent=h!==void 0?h:10;
this.onlyShadow=this.castShadow=false;
this.shadowCameraNear=50;
this.shadowCameraFar=5000;
this.shadowCameraFov=50;
this.shadowCameraVisible=false;
this.shadowBias=0;
this.shadowDarkness=0.5;
this.shadowMapHeight=this.shadowMapWidth=512;
this.shadowMatrix=this.shadowCamera=this.shadowMapSize=this.shadowMap=null
};
THREE.SpotLight.prototype=new THREE.Light;
THREE.SpotLight.prototype.constructor=THREE.SpotLight;
THREE.Loader=function(b){this.statusDomElement=(this.showStatus=b)?THREE.Loader.prototype.addStatusElement():null;
this.onLoadStart=function(){};
this.onLoadProgress=function(){};
this.onLoadComplete=function(){}
};
THREE.Loader.prototype={constructor:THREE.Loader,crossOrigin:"anonymous",addStatusElement:function(){var b=document.createElement("div");
b.style.position="absolute";
b.style.right="0px";
b.style.top="0px";
b.style.fontSize="0.8em";
b.style.textAlign="left";
b.style.background="rgba(0,0,0,0.25)";
b.style.color="#fff";
b.style.width="120px";
b.style.padding="0.5em 0.5em 0.5em 0.5em";
b.style.zIndex=1000;
b.innerHTML="Loading ...";
return b
},updateProgress:function(d){var c="Loaded ",c=d.total?c+((100*d.loaded/d.total).toFixed(0)+"%"):c+((d.loaded/1000).toFixed(2)+" KB");
this.statusDomElement.innerHTML=c
},extractUrlBase:function(b){b=b.split("/");
b.pop();
return(b.length<1?".":b.join("/"))+"/"
},initMaterials:function(f,e,h){f.materials=[];
for(var g=0;
g<e.length;
++g){f.materials[g]=THREE.Loader.prototype.createMaterial(e[g],h)
}},hasNormals:function(f){var e,h,g=f.materials.length;
for(h=0;
h<g;
h++){e=f.materials[h];
if(e instanceof THREE.ShaderMaterial){return true
}}return false
},createMaterial:function(w,v){function u(b){b=Math.log(b)/Math.LN2;
return Math.floor(b)==b
}function t(b){b=Math.log(b)/Math.LN2;
return Math.pow(2,Math.round(b))
}function s(d,c){var f=new Image;
f.onload=function(){if(!u(this.width)||!u(this.height)){var a=t(this.width),g=t(this.height);
d.image.width=a;
d.image.height=g;
d.image.getContext("2d").drawImage(this,0,0,a,g)
}else{d.image=this
}d.needsUpdate=true
};
f.crossOrigin=p.crossOrigin;
f.src=c
}function r(b,z,y,x,l,k){var e=document.createElement("canvas");
b[z]=new THREE.Texture(e);
b[z].sourceFile=y;
if(x){b[z].repeat.set(x[0],x[1]);
if(x[0]!=1){b[z].wrapS=THREE.RepeatWrapping
}if(x[1]!=1){b[z].wrapT=THREE.RepeatWrapping
}}l&&b[z].offset.set(l[0],l[1]);
if(k){x={repeat:THREE.RepeatWrapping,mirror:THREE.MirroredRepeatWrapping};
if(x[k[0]]!==void 0){b[z].wrapS=x[k[0]]
}if(x[k[1]]!==void 0){b[z].wrapT=x[k[1]]
}}s(b[z],v+"/"+y)
}function q(b){return(b[0]*255<<16)+(b[1]*255<<8)+b[2]*255
}var p=this,o="MeshLambertMaterial",m={color:15658734,opacity:1,map:null,lightMap:null,normalMap:null,wireframe:w.wireframe};
if(w.shading){var n=w.shading.toLowerCase();
n==="phong"?o="MeshPhongMaterial":n==="basic"&&(o="MeshBasicMaterial")
}if(w.blending!==void 0&&THREE[w.blending]!==void 0){m.blending=THREE[w.blending]
}if(w.transparent!==void 0||w.opacity<1){m.transparent=w.transparent
}if(w.depthTest!==void 0){m.depthTest=w.depthTest
}if(w.depthWrite!==void 0){m.depthWrite=w.depthWrite
}if(w.vertexColors!==void 0){if(w.vertexColors=="face"){m.vertexColors=THREE.FaceColors
}else{if(w.vertexColors){m.vertexColors=THREE.VertexColors
}}}if(w.colorDiffuse){m.color=q(w.colorDiffuse)
}else{if(w.DbgColor){m.color=w.DbgColor
}}if(w.colorSpecular){m.specular=q(w.colorSpecular)
}if(w.colorAmbient){m.ambient=q(w.colorAmbient)
}if(w.transparency){m.opacity=w.transparency
}if(w.specularCoef){m.shininess=w.specularCoef
}w.mapDiffuse&&v&&r(m,"map",w.mapDiffuse,w.mapDiffuseRepeat,w.mapDiffuseOffset,w.mapDiffuseWrap);
w.mapLight&&v&&r(m,"lightMap",w.mapLight,w.mapLightRepeat,w.mapLightOffset,w.mapLightWrap);
w.mapNormal&&v&&r(m,"normalMap",w.mapNormal,w.mapNormalRepeat,w.mapNormalOffset,w.mapNormalWrap);
w.mapSpecular&&v&&r(m,"specularMap",w.mapSpecular,w.mapSpecularRepeat,w.mapSpecularOffset,w.mapSpecularWrap);
if(w.mapNormal){o=THREE.ShaderUtils.lib.normal;
n=THREE.UniformsUtils.clone(o.uniforms);
n.tNormal.texture=m.normalMap;
if(w.mapNormalFactor){n.uNormalScale.value=w.mapNormalFactor
}if(m.map){n.tDiffuse.texture=m.map;
n.enableDiffuse.value=true
}if(m.specularMap){n.tSpecular.texture=m.specularMap;
n.enableSpecular.value=true
}if(m.lightMap){n.tAO.texture=m.lightMap;
n.enableAO.value=true
}n.uDiffuseColor.value.setHex(m.color);
n.uSpecularColor.value.setHex(m.specular);
n.uAmbientColor.value.setHex(m.ambient);
n.uShininess.value=m.shininess;
if(m.opacity!==void 0){n.uOpacity.value=m.opacity
}m=new THREE.ShaderMaterial({fragmentShader:o.fragmentShader,vertexShader:o.vertexShader,uniforms:n,lights:true,fog:true})
}else{m=new THREE[o](m)
}if(w.DbgName!==void 0){m.name=w.DbgName
}return m
}};
THREE.BinaryLoader=function(b){THREE.Loader.call(this,b)
};
THREE.BinaryLoader.prototype=new THREE.Loader;
THREE.BinaryLoader.prototype.constructor=THREE.BinaryLoader;
THREE.BinaryLoader.prototype.load=function(g,f,l,k){var l=l?l:this.extractUrlBase(g),k=k?k:this.extractUrlBase(g),h=this.showProgress?THREE.Loader.prototype.updateProgress:null;
this.onLoadStart();
this.loadAjaxJSON(this,g,f,l,k,h)
};
THREE.BinaryLoader.prototype.loadAjaxJSON=function(k,h,p,o,n,m){var l=new XMLHttpRequest;
l.onreadystatechange=function(){if(l.readyState==4){if(l.status==200||l.status==0){var a=JSON.parse(l.responseText);
k.loadAjaxBuffers(a,p,n,o,m)
}else{console.error("THREE.BinaryLoader: Couldn't load ["+h+"] ["+l.status+"]")
}}};
l.open("GET",h,true);
l.overrideMimeType&&l.overrideMimeType("text/plain; charset=x-user-defined");
l.setRequestHeader("Content-Type","text/plain");
l.send(null)
};
THREE.BinaryLoader.prototype.loadAjaxBuffers=function(l,k,r,q,p){var o=new XMLHttpRequest,n=r+"/"+l.buffers,m=0;
o.onreadystatechange=function(){if(o.readyState==4){o.status==200||o.status==0?THREE.BinaryLoader.prototype.createBinModel(o.response,k,q,l.materials):console.error("THREE.BinaryLoader: Couldn't load ["+n+"] ["+o.status+"]")
}else{if(o.readyState==3){if(p){m==0&&(m=o.getResponseHeader("Content-Length"));
p({total:m,loaded:o.responseText.length})
}}else{o.readyState==2&&(m=o.getResponseHeader("Content-Length"))
}}};
o.open("GET",n,true);
o.responseType="arraybuffer";
o.send(null)
};
THREE.BinaryLoader.prototype.createBinModel=function(g,f,l,k){var h=function(ao){var an,am,ak,ai,aj,ae,ah,af,ac,ag,ab,W,Y,N,aa;
function Q(b){return b%4?4-b%4:0
}function O(e,c){return(new Uint8Array(e,c,1))[0]
}function X(e,c){return(new Uint32Array(e,c,1))[0]
}function I(z,y){var w,v,u,t,s,r,q,p,o=new Uint32Array(g,y,3*z);
for(w=0;
w<z;
w++){v=o[w*3];
u=o[w*3+1];
t=o[w*3+2];
s=S[v*2];
v=S[v*2+1];
r=S[u*2];
q=S[u*2+1];
u=S[t*2];
p=S[t*2+1];
t=B.faceVertexUvs[0];
var n=[];
n.push(new THREE.UV(s,v));
n.push(new THREE.UV(r,q));
n.push(new THREE.UV(u,p));
t.push(n)
}}function V(G,E){var D,A,z,y,w,v,u,t,s,r,q=new Uint32Array(g,E,4*G);
for(D=0;
D<G;
D++){A=q[D*4];
z=q[D*4+1];
y=q[D*4+2];
w=q[D*4+3];
v=S[A*2];
A=S[A*2+1];
u=S[z*2];
s=S[z*2+1];
t=S[y*2];
r=S[y*2+1];
y=S[w*2];
z=S[w*2+1];
w=B.faceVertexUvs[0];
var p=[];
p.push(new THREE.UV(v,A));
p.push(new THREE.UV(u,s));
p.push(new THREE.UV(t,r));
p.push(new THREE.UV(y,z));
w.push(p)
}}function ad(m,t,s){for(var r,q,p,o,t=new Uint32Array(g,t,3*m),n=new Uint16Array(g,s,m),s=0;
s<m;
s++){r=t[s*3];
q=t[s*3+1];
p=t[s*3+2];
o=n[s];
B.faces.push(new THREE.Face3(r,q,p,null,null,o))
}}function L(u,t,s){for(var r,q,p,o,n,t=new Uint32Array(g,t,4*u),m=new Uint16Array(g,s,u),s=0;
s<u;
s++){r=t[s*4];
q=t[s*4+1];
p=t[s*4+2];
o=t[s*4+3];
n=m[s];
B.faces.push(new THREE.Face4(r,q,p,o,null,null,n))
}}function F(M,K,J,H){for(var G,E,D,A,z,y,w,K=new Uint32Array(g,K,3*M),J=new Uint32Array(g,J,3*M),v=new Uint16Array(g,H,M),H=0;
H<M;
H++){G=K[H*3];
E=K[H*3+1];
D=K[H*3+2];
z=J[H*3];
y=J[H*3+1];
w=J[H*3+2];
A=v[H];
var u=C[y*3],t=C[y*3+1];
y=C[y*3+2];
var s=C[w*3],r=C[w*3+1];
w=C[w*3+2];
B.faces.push(new THREE.Face3(G,E,D,[new THREE.Vector3(C[z*3],C[z*3+1],C[z*3+2]),new THREE.Vector3(u,t,y),new THREE.Vector3(s,r,w)],null,A))
}}function x(at,ar,aq,ap){for(var U,T,R,P,M,K,J,H,G,ar=new Uint32Array(g,ar,4*at),aq=new Uint32Array(g,aq,4*at),E=new Uint16Array(g,ap,at),ap=0;
ap<at;
ap++){U=ar[ap*4];
T=ar[ap*4+1];
R=ar[ap*4+2];
P=ar[ap*4+3];
K=aq[ap*4];
J=aq[ap*4+1];
H=aq[ap*4+2];
G=aq[ap*4+3];
M=E[ap];
var D=C[J*3],A=C[J*3+1];
J=C[J*3+2];
var z=C[H*3],y=C[H*3+1];
H=C[H*3+2];
var w=C[G*3],v=C[G*3+1];
G=C[G*3+2];
B.faces.push(new THREE.Face4(U,T,R,P,[new THREE.Vector3(C[K*3],C[K*3+1],C[K*3+2]),new THREE.Vector3(D,A,J),new THREE.Vector3(z,y,H),new THREE.Vector3(w,v,G)],null,M))
}}var B=this,Z=0,C=[],S=[],al,d,a;
THREE.Geometry.call(this);
THREE.Loader.prototype.initMaterials(B,k,ao);
(function(n,m,q){for(var n=new Uint8Array(n,m,q),p="",o=0;
o<q;
o++){p=p+String.fromCharCode(n[m+o])
}return p
})(g,Z,12);
an=O(g,Z+12);
O(g,Z+13);
O(g,Z+14);
O(g,Z+15);
am=O(g,Z+16);
ak=O(g,Z+17);
ai=O(g,Z+18);
aj=O(g,Z+19);
ae=X(g,Z+20);
ah=X(g,Z+20+4);
af=X(g,Z+20+8);
ao=X(g,Z+20+12);
ac=X(g,Z+20+16);
ag=X(g,Z+20+20);
ab=X(g,Z+20+24);
W=X(g,Z+20+28);
Y=X(g,Z+20+32);
N=X(g,Z+20+36);
aa=X(g,Z+20+40);
Z=Z+an;
an=am*3+aj;
a=am*4+aj;
al=ao*an;
d=ac*(an+ak*3);
am=ag*(an+ai*3);
aj=ab*(an+ak*3+ai*3);
an=W*a;
ak=Y*(a+ak*4);
ai=N*(a+ai*4);
Z=Z+function(m){var m=new Float32Array(g,m,ae*3),q,p,o,n;
for(q=0;
q<ae;
q++){p=m[q*3];
o=m[q*3+1];
n=m[q*3+2];
B.vertices.push(new THREE.Vector3(p,o,n))
}return ae*3*Float32Array.BYTES_PER_ELEMENT
}(Z);
Z=Z+function(m){if(ah){var m=new Int8Array(g,m,ah*3),q,p,o,n;
for(q=0;
q<ah;
q++){p=m[q*3];
o=m[q*3+1];
n=m[q*3+2];
C.push(p/127,o/127,n/127)
}}return ah*3*Int8Array.BYTES_PER_ELEMENT
}(Z);
Z=Z+Q(ah*3);
Z=Z+function(m){if(af){var m=new Float32Array(g,m,af*2),p,o,n;
for(p=0;
p<af;
p++){o=m[p*2];
n=m[p*2+1];
S.push(o,n)
}}return af*2*Float32Array.BYTES_PER_ELEMENT
}(Z);
al=Z+al+Q(ao*2);
d=al+d+Q(ac*2);
am=d+am+Q(ag*2);
aj=am+aj+Q(ab*2);
an=aj+an+Q(W*2);
ak=an+ak+Q(Y*2);
ai=ak+ai+Q(N*2);
(function(e){if(ag){var c=e+ag*Uint32Array.BYTES_PER_ELEMENT*3;
ad(ag,e,c+ag*Uint32Array.BYTES_PER_ELEMENT*3);
I(ag,c)
}})(d);
(function(m){if(ab){var e=m+ab*Uint32Array.BYTES_PER_ELEMENT*3,n=e+ab*Uint32Array.BYTES_PER_ELEMENT*3;
F(ab,m,e,n+ab*Uint32Array.BYTES_PER_ELEMENT*3);
I(ab,n)
}})(am);
(function(e){if(N){var c=e+N*Uint32Array.BYTES_PER_ELEMENT*4;
L(N,e,c+N*Uint32Array.BYTES_PER_ELEMENT*4);
V(N,c)
}})(ak);
(function(m){if(aa){var e=m+aa*Uint32Array.BYTES_PER_ELEMENT*4,n=e+aa*Uint32Array.BYTES_PER_ELEMENT*4;
x(aa,m,e,n+aa*Uint32Array.BYTES_PER_ELEMENT*4);
V(aa,n)
}})(ai);
ao&&ad(ao,Z,Z+ao*Uint32Array.BYTES_PER_ELEMENT*3);
(function(e){if(ac){var c=e+ac*Uint32Array.BYTES_PER_ELEMENT*3;
F(ac,e,c,c+ac*Uint32Array.BYTES_PER_ELEMENT*3)
}})(al);
W&&L(W,aj,aj+W*Uint32Array.BYTES_PER_ELEMENT*4);
(function(e){if(Y){var c=e+Y*Uint32Array.BYTES_PER_ELEMENT*4;
x(Y,e,c,c+Y*Uint32Array.BYTES_PER_ELEMENT*4)
}})(an);
this.computeCentroids();
this.computeFaceNormals();
THREE.Loader.prototype.hasNormals(this)&&this.computeTangents()
};
h.prototype=new THREE.Geometry;
h.prototype.constructor=h;
f(new h(l))
};
THREE.JSONLoader=function(b){THREE.Loader.call(this,b)
};
THREE.JSONLoader.prototype=new THREE.Loader;
THREE.JSONLoader.prototype.constructor=THREE.JSONLoader;
THREE.JSONLoader.prototype.load=function(e,d,f){f=f?f:this.extractUrlBase(e);
this.onLoadStart();
this.loadAjaxJSON(this,e,d,f)
};
THREE.JSONLoader.prototype.loadAjaxJSON=function(k,h,p,o,n){var m=new XMLHttpRequest,l=0;
m.onreadystatechange=function(){if(m.readyState===m.DONE){if(m.status===200||m.status===0){if(m.responseText){var a=JSON.parse(m.responseText);
k.createModel(a,p,o)
}else{console.warn("THREE.JSONLoader: ["+h+"] seems to be unreachable or file there is empty")
}k.onLoadComplete()
}else{console.error("THREE.JSONLoader: Couldn't load ["+h+"] ["+m.status+"]")
}}else{if(m.readyState===m.LOADING){if(n){l===0&&(l=m.getResponseHeader("Content-Length"));
n({total:l,loaded:m.responseText.length})
}}else{m.readyState===m.HEADERS_RECEIVED&&(l=m.getResponseHeader("Content-Length"))
}}};
m.open("GET",h,true);
m.overrideMimeType&&m.overrideMimeType("text/plain; charset=x-user-defined");
m.setRequestHeader("Content-Type","text/plain");
m.send(null)
};
THREE.JSONLoader.prototype.createModel=function(g,f,l){var k=new THREE.Geometry,h=g.scale!==void 0?1/g.scale:1;
this.initMaterials(k,g.materials,l);
(function(P){var O,N,M,K,L,F,J,G,D,I,C,x,A,a,B=g.faces;
F=g.vertices;
var v=g.normals,d=g.colors,z=0;
for(O=0;
O<g.uvs.length;
O++){g.uvs[O].length&&z++
}for(O=0;
O<z;
O++){k.faceUvs[O]=[];
k.faceVertexUvs[O]=[]
}K=0;
for(L=F.length;
K<L;
){J=new THREE.Vector3;
J.x=F[K++]*P;
J.y=F[K++]*P;
J.z=F[K++]*P;
k.vertices.push(J)
}K=0;
for(L=B.length;
K<L;
){P=B[K++];
F=P&1;
M=P&2;
O=P&4;
N=P&8;
G=P&16;
J=P&32;
I=P&64;
P=P&128;
if(F){C=new THREE.Face4;
C.a=B[K++];
C.b=B[K++];
C.c=B[K++];
C.d=B[K++];
F=4
}else{C=new THREE.Face3;
C.a=B[K++];
C.b=B[K++];
C.c=B[K++];
F=3
}if(M){M=B[K++];
C.materialIndex=M
}M=k.faces.length;
if(O){for(O=0;
O<z;
O++){x=g.uvs[O];
D=B[K++];
a=x[D*2];
D=x[D*2+1];
k.faceUvs[O][M]=new THREE.UV(a,D)
}}if(N){for(O=0;
O<z;
O++){x=g.uvs[O];
A=[];
for(N=0;
N<F;
N++){D=B[K++];
a=x[D*2];
D=x[D*2+1];
A[N]=new THREE.UV(a,D)
}k.faceVertexUvs[O][M]=A
}}if(G){G=B[K++]*3;
N=new THREE.Vector3;
N.x=v[G++];
N.y=v[G++];
N.z=v[G];
C.normal=N
}if(J){for(O=0;
O<F;
O++){G=B[K++]*3;
N=new THREE.Vector3;
N.x=v[G++];
N.y=v[G++];
N.z=v[G];
C.vertexNormals.push(N)
}}if(I){J=B[K++];
J=new THREE.Color(d[J]);
C.color=J
}if(P){for(O=0;
O<F;
O++){J=B[K++];
J=new THREE.Color(d[J]);
C.vertexColors.push(J)
}}k.faces.push(C)
}})(h);
(function(){var a,n,m,d;
if(g.skinWeights){a=0;
for(n=g.skinWeights.length;
a<n;
a=a+2){m=g.skinWeights[a];
d=g.skinWeights[a+1];
k.skinWeights.push(new THREE.Vector4(m,d,0,0))
}}if(g.skinIndices){a=0;
for(n=g.skinIndices.length;
a<n;
a=a+2){m=g.skinIndices[a];
d=g.skinIndices[a+1];
k.skinIndices.push(new THREE.Vector4(m,d,0,0))
}}k.bones=g.bones;
k.animation=g.animation
})();
(function(d){if(g.morphTargets!==void 0){var t,s,q,n,o,r;
t=0;
for(s=g.morphTargets.length;
t<s;
t++){k.morphTargets[t]={};
k.morphTargets[t].name=g.morphTargets[t].name;
k.morphTargets[t].vertices=[];
o=k.morphTargets[t].vertices;
r=g.morphTargets[t].vertices;
q=0;
for(n=r.length;
q<n;
q=q+3){var a=new THREE.Vector3;
a.x=r[q]*d;
a.y=r[q+1]*d;
a.z=r[q+2]*d;
o.push(a)
}}}if(g.morphColors!==void 0){t=0;
for(s=g.morphColors.length;
t<s;
t++){k.morphColors[t]={};
k.morphColors[t].name=g.morphColors[t].name;
k.morphColors[t].colors=[];
n=k.morphColors[t].colors;
o=g.morphColors[t].colors;
d=0;
for(q=o.length;
d<q;
d=d+3){r=new THREE.Color(16755200);
r.setRGB(o[d],o[d+1],o[d+2]);
n.push(r)
}}}})(h);
k.computeCentroids();
k.computeFaceNormals();
this.hasNormals(k)&&k.computeTangents();
f(k)
};
THREE.SceneLoader=function(){this.onLoadStart=function(){};
this.onLoadProgress=function(){};
this.onLoadComplete=function(){};
this.callbackSync=function(){};
this.callbackProgress=function(){}
};
THREE.SceneLoader.prototype.constructor=THREE.SceneLoader;
THREE.SceneLoader.prototype.load=function(f,e){var h=this,g=new XMLHttpRequest;
g.onreadystatechange=function(){if(g.readyState==4){if(g.status==200||g.status==0){var a=JSON.parse(g.responseText);
h.createScene(a,e,f)
}else{console.error("THREE.SceneLoader: Couldn't load ["+f+"] ["+g.status+"]")
}}};
g.open("GET",f,true);
g.overrideMimeType&&g.overrideMimeType("text/plain; charset=x-user-defined");
g.setRequestHeader("Content-Type","text/plain");
g.send(null)
};
THREE.SceneLoader.prototype.createScene=function(ay,ax,aw){function av(d,c){return c=="relativeToHTML"?d:am+"/"+d
}function au(){var b;
for(al in W.objects){if(!X.objects[al]){ad=W.objects[al];
if(ad.geometry!==void 0){if(O=X.geometries[ad.geometry]){b=false;
N=X.materials[ad.materials[0]];
(b=N instanceof THREE.ShaderMaterial)&&O.computeTangents();
ab=ad.position;
Q=ad.rotation;
V=ad.quaternion;
Z=ad.scale;
ae=ad.matrix;
V=0;
ad.materials.length==0&&(N=new THREE.MeshFaceMaterial);
ad.materials.length>1&&(N=new THREE.MeshFaceMaterial);
b=new THREE.Mesh(O,N);
b.name=al;
if(ae){b.matrixAutoUpdate=false;
b.matrix.set(ae[0],ae[1],ae[2],ae[3],ae[4],ae[5],ae[6],ae[7],ae[8],ae[9],ae[10],ae[11],ae[12],ae[13],ae[14],ae[15])
}else{b.position.set(ab[0],ab[1],ab[2]);
if(V){b.quaternion.set(V[0],V[1],V[2],V[3]);
b.useQuaternion=true
}else{b.rotation.set(Q[0],Q[1],Q[2])
}b.scale.set(Z[0],Z[1],Z[2])
}b.visible=ad.visible;
b.doubleSided=ad.doubleSided;
b.castShadow=ad.castShadow;
b.receiveShadow=ad.receiveShadow;
X.scene.add(b);
X.objects[al]=b
}}else{ab=ad.position;
Q=ad.rotation;
V=ad.quaternion;
Z=ad.scale;
V=0;
b=new THREE.Object3D;
b.name=al;
b.position.set(ab[0],ab[1],ab[2]);
if(V){b.quaternion.set(V[0],V[1],V[2],V[3]);
b.useQuaternion=true
}else{b.rotation.set(Q[0],Q[1],Q[2])
}b.scale.set(Z[0],Z[1],Z[2]);
b.visible=ad.visible!==void 0?ad.visible:false;
X.scene.add(b);
X.objects[al]=b;
X.empties[al]=b
}}}}function at(b){return function(a){X.geometries[b]=a;
au();
S=S-1;
ao.onLoadComplete();
aq()
}
}function ar(b){return function(a){X.geometries[b]=a
}
}function aq(){ao.callbackProgress({totalModels:B,totalTextures:x,loadedModels:B-S,loadedTextures:x-ap},X);
ao.onLoadProgress();
S==0&&ap==0&&ax(X)
}var ao=this,am=THREE.Loader.prototype.extractUrlBase(aw),an,ai,al,aj,ah,ak,ag,ad,ae,aa,af,ab,Q,V,Z,ac,Y,O,N,F,I,W,L,S,ap,B,x,X;
W=ay;
aw=new THREE.BinaryLoader;
L=new THREE.JSONLoader;
ap=S=0;
X={scene:new THREE.Scene,geometries:{},materials:{},textures:{},objects:{},cameras:{},lights:{},fogs:{},empties:{}};
if(W.transform){ay=W.transform.position;
aa=W.transform.rotation;
ac=W.transform.scale;
ay&&X.scene.position.set(ay[0],ay[1],ay[2]);
aa&&X.scene.rotation.set(aa[0],aa[1],aa[2]);
ac&&X.scene.scale.set(ac[0],ac[1],ac[2]);
if(ay||aa||ac){X.scene.updateMatrix();
X.scene.updateMatrixWorld()
}}ay=function(){ap=ap-1;
aq();
ao.onLoadComplete()
};
for(ah in W.cameras){ac=W.cameras[ah];
ac.type=="perspective"?F=new THREE.PerspectiveCamera(ac.fov,ac.aspect,ac.near,ac.far):ac.type=="ortho"&&(F=new THREE.OrthographicCamera(ac.left,ac.right,ac.top,ac.bottom,ac.near,ac.far));
ab=ac.position;
aa=ac.target;
ac=ac.up;
F.position.set(ab[0],ab[1],ab[2]);
F.target=new THREE.Vector3(aa[0],aa[1],aa[2]);
ac&&F.up.set(ac[0],ac[1],ac[2]);
X.cameras[ah]=F
}for(aj in W.lights){aa=W.lights[aj];
ah=aa.color!==void 0?aa.color:16777215;
F=aa.intensity!==void 0?aa.intensity:1;
if(aa.type=="directional"){ab=aa.direction;
af=new THREE.DirectionalLight(ah,F);
af.position.set(ab[0],ab[1],ab[2]);
af.position.normalize()
}else{if(aa.type=="point"){ab=aa.position;
af=aa.distance;
af=new THREE.PointLight(ah,F,af);
af.position.set(ab[0],ab[1],ab[2])
}else{aa.type=="ambient"&&(af=new THREE.AmbientLight(ah))
}}X.scene.add(af);
X.lights[aj]=af
}for(ak in W.fogs){aj=W.fogs[ak];
aj.type=="linear"?I=new THREE.Fog(0,aj.near,aj.far):aj.type=="exp2"&&(I=new THREE.FogExp2(0,aj.density));
ac=aj.color;
I.color.setRGB(ac[0],ac[1],ac[2]);
X.fogs[ak]=I
}if(X.cameras&&W.defaults.camera){X.currentCamera=X.cameras[W.defaults.camera]
}if(X.fogs&&W.defaults.fog){X.scene.fog=X.fogs[W.defaults.fog]
}ac=W.defaults.bgcolor;
X.bgColor=new THREE.Color;
X.bgColor.setRGB(ac[0],ac[1],ac[2]);
X.bgColorAlpha=W.defaults.bgalpha;
for(an in W.geometries){ak=W.geometries[an];
if(ak.type=="bin_mesh"||ak.type=="ascii_mesh"){S=S+1;
ao.onLoadStart()
}}B=S;
for(an in W.geometries){ak=W.geometries[an];
if(ak.type=="cube"){O=new THREE.CubeGeometry(ak.width,ak.height,ak.depth,ak.segmentsWidth,ak.segmentsHeight,ak.segmentsDepth,null,ak.flipped,ak.sides);
X.geometries[an]=O
}else{if(ak.type=="plane"){O=new THREE.PlaneGeometry(ak.width,ak.height,ak.segmentsWidth,ak.segmentsHeight);
X.geometries[an]=O
}else{if(ak.type=="sphere"){O=new THREE.SphereGeometry(ak.radius,ak.segmentsWidth,ak.segmentsHeight);
X.geometries[an]=O
}else{if(ak.type=="cylinder"){O=new THREE.CylinderGeometry(ak.topRad,ak.botRad,ak.height,ak.radSegs,ak.heightSegs);
X.geometries[an]=O
}else{if(ak.type=="torus"){O=new THREE.TorusGeometry(ak.radius,ak.tube,ak.segmentsR,ak.segmentsT);
X.geometries[an]=O
}else{if(ak.type=="icosahedron"){O=new THREE.IcosahedronGeometry(ak.radius,ak.subdivisions);
X.geometries[an]=O
}else{if(ak.type=="bin_mesh"){aw.load(av(ak.url,W.urlBaseType),at(an))
}else{if(ak.type=="ascii_mesh"){L.load(av(ak.url,W.urlBaseType),at(an))
}else{if(ak.type=="embedded_mesh"){ak=W.embeds[ak.id];
ak.metadata=W.metadata;
ak&&L.createModel(ak,ar(an),"")
}}}}}}}}}}for(ag in W.textures){an=W.textures[ag];
if(an.url instanceof Array){ap=ap+an.url.length;
for(ak=0;
ak<an.url.length;
ak++){ao.onLoadStart()
}}else{ap=ap+1;
ao.onLoadStart()
}}x=ap;
for(ag in W.textures){an=W.textures[ag];
if(an.mapping!=void 0&&THREE[an.mapping]!=void 0){an.mapping=new THREE[an.mapping]
}if(an.url instanceof Array){ak=[];
for(I=0;
I<an.url.length;
I++){ak[I]=av(an.url[I],W.urlBaseType)
}ak=THREE.ImageUtils.loadTextureCube(ak,an.mapping,ay)
}else{ak=THREE.ImageUtils.loadTexture(av(an.url,W.urlBaseType),an.mapping,ay);
if(THREE[an.minFilter]!=void 0){ak.minFilter=THREE[an.minFilter]
}if(THREE[an.magFilter]!=void 0){ak.magFilter=THREE[an.magFilter]
}if(an.repeat){ak.repeat.set(an.repeat[0],an.repeat[1]);
if(an.repeat[0]!=1){ak.wrapS=THREE.RepeatWrapping
}if(an.repeat[1]!=1){ak.wrapT=THREE.RepeatWrapping
}}an.offset&&ak.offset.set(an.offset[0],an.offset[1]);
if(an.wrap){I={repeat:THREE.RepeatWrapping,mirror:THREE.MirroredRepeatWrapping};
if(I[an.wrap[0]]!==void 0){ak.wrapS=I[an.wrap[0]]
}if(I[an.wrap[1]]!==void 0){ak.wrapT=I[an.wrap[1]]
}}}X.textures[ag]=ak
}for(ai in W.materials){ae=W.materials[ai];
for(Y in ae.parameters){if(Y=="envMap"||Y=="map"||Y=="lightMap"){ae.parameters[Y]=X.textures[ae.parameters[Y]]
}else{if(Y=="shading"){ae.parameters[Y]=ae.parameters[Y]=="flat"?THREE.FlatShading:THREE.SmoothShading
}else{if(Y=="blending"){ae.parameters[Y]=THREE[ae.parameters[Y]]?THREE[ae.parameters[Y]]:THREE.NormalBlending
}else{if(Y=="combine"){ae.parameters[Y]=ae.parameters[Y]=="MixOperation"?THREE.MixOperation:THREE.MultiplyOperation
}else{if(Y=="vertexColors"){if(ae.parameters[Y]=="face"){ae.parameters[Y]=THREE.FaceColors
}else{if(ae.parameters[Y]){ae.parameters[Y]=THREE.VertexColors
}}}}}}}}if(ae.parameters.opacity!==void 0&&ae.parameters.opacity<1){ae.parameters.transparent=true
}if(ae.parameters.normalMap){ag=THREE.ShaderUtils.lib.normal;
ay=THREE.UniformsUtils.clone(ag.uniforms);
an=ae.parameters.color;
ak=ae.parameters.specular;
I=ae.parameters.ambient;
aw=ae.parameters.shininess;
ay.tNormal.texture=X.textures[ae.parameters.normalMap];
if(ae.parameters.normalMapFactor){ay.uNormalScale.value=ae.parameters.normalMapFactor
}if(ae.parameters.map){ay.tDiffuse.texture=ae.parameters.map;
ay.enableDiffuse.value=true
}if(ae.parameters.lightMap){ay.tAO.texture=ae.parameters.lightMap;
ay.enableAO.value=true
}if(ae.parameters.specularMap){ay.tSpecular.texture=X.textures[ae.parameters.specularMap];
ay.enableSpecular.value=true
}ay.uDiffuseColor.value.setHex(an);
ay.uSpecularColor.value.setHex(ak);
ay.uAmbientColor.value.setHex(I);
ay.uShininess.value=aw;
if(ae.parameters.opacity){ay.uOpacity.value=ae.parameters.opacity
}N=new THREE.ShaderMaterial({fragmentShader:ag.fragmentShader,vertexShader:ag.vertexShader,uniforms:ay,lights:true,fog:true})
}else{N=new THREE[ae.type](ae.parameters)
}X.materials[ai]=N
}au();
ao.callbackSync(X);
aq()
};
THREE.Material=function(b){b=b||{};
this.id=THREE.MaterialCount++;
this.name="";
this.opacity=b.opacity!==void 0?b.opacity:1;
this.transparent=b.transparent!==void 0?b.transparent:false;
this.blending=b.blending!==void 0?b.blending:THREE.NormalBlending;
this.blendSrc=b.blendSrc!==void 0?b.blendSrc:THREE.SrcAlphaFactor;
this.blendDst=b.blendDst!==void 0?b.blendDst:THREE.OneMinusSrcAlphaFactor;
this.blendEquation=b.blendEquation!==void 0?b.blendEquation:THREE.AddEquation;
this.depthTest=b.depthTest!==void 0?b.depthTest:true;
this.depthWrite=b.depthWrite!==void 0?b.depthWrite:true;
this.polygonOffset=b.polygonOffset!==void 0?b.polygonOffset:false;
this.polygonOffsetFactor=b.polygonOffsetFactor!==void 0?b.polygonOffsetFactor:0;
this.polygonOffsetUnits=b.polygonOffsetUnits!==void 0?b.polygonOffsetUnits:0;
this.alphaTest=b.alphaTest!==void 0?b.alphaTest:0;
this.overdraw=b.overdraw!==void 0?b.overdraw:false;
this.needsUpdate=this.visible=true
};
THREE.MaterialCount=0;
THREE.NoShading=0;
THREE.FlatShading=1;
THREE.SmoothShading=2;
THREE.NoColors=0;
THREE.FaceColors=1;
THREE.VertexColors=2;
THREE.NoBlending=0;
THREE.NormalBlending=1;
THREE.AdditiveBlending=2;
THREE.SubtractiveBlending=3;
THREE.MultiplyBlending=4;
THREE.AdditiveAlphaBlending=5;
THREE.CustomBlending=6;
THREE.AddEquation=100;
THREE.SubtractEquation=101;
THREE.ReverseSubtractEquation=102;
THREE.ZeroFactor=200;
THREE.OneFactor=201;
THREE.SrcColorFactor=202;
THREE.OneMinusSrcColorFactor=203;
THREE.SrcAlphaFactor=204;
THREE.OneMinusSrcAlphaFactor=205;
THREE.DstAlphaFactor=206;
THREE.OneMinusDstAlphaFactor=207;
THREE.DstColorFactor=208;
THREE.OneMinusDstColorFactor=209;
THREE.SrcAlphaSaturateFactor=210;
THREE.LineBasicMaterial=function(b){THREE.Material.call(this,b);
b=b||{};
this.color=b.color!==void 0?new THREE.Color(b.color):new THREE.Color(16777215);
this.linewidth=b.linewidth!==void 0?b.linewidth:1;
this.linecap=b.linecap!==void 0?b.linecap:"round";
this.linejoin=b.linejoin!==void 0?b.linejoin:"round";
this.vertexColors=b.vertexColors?b.vertexColors:false;
this.fog=b.fog!==void 0?b.fog:true
};
THREE.LineBasicMaterial.prototype=new THREE.Material;
THREE.LineBasicMaterial.prototype.constructor=THREE.LineBasicMaterial;
THREE.MeshBasicMaterial=function(b){THREE.Material.call(this,b);
b=b||{};
this.color=b.color!==void 0?new THREE.Color(b.color):new THREE.Color(16777215);
this.map=b.map!==void 0?b.map:null;
this.lightMap=b.lightMap!==void 0?b.lightMap:null;
this.envMap=b.envMap!==void 0?b.envMap:null;
this.combine=b.combine!==void 0?b.combine:THREE.MultiplyOperation;
this.reflectivity=b.reflectivity!==void 0?b.reflectivity:1;
this.refractionRatio=b.refractionRatio!==void 0?b.refractionRatio:0.98;
this.fog=b.fog!==void 0?b.fog:true;
this.shading=b.shading!==void 0?b.shading:THREE.SmoothShading;
this.wireframe=b.wireframe!==void 0?b.wireframe:false;
this.wireframeLinewidth=b.wireframeLinewidth!==void 0?b.wireframeLinewidth:1;
this.wireframeLinecap=b.wireframeLinecap!==void 0?b.wireframeLinecap:"round";
this.wireframeLinejoin=b.wireframeLinejoin!==void 0?b.wireframeLinejoin:"round";
this.vertexColors=b.vertexColors!==void 0?b.vertexColors:THREE.NoColors;
this.skinning=b.skinning!==void 0?b.skinning:false;
this.morphTargets=b.morphTargets!==void 0?b.morphTargets:false
};
THREE.MeshBasicMaterial.prototype=new THREE.Material;
THREE.MeshBasicMaterial.prototype.constructor=THREE.MeshBasicMaterial;
THREE.MeshLambertMaterial=function(b){THREE.Material.call(this,b);
b=b||{};
this.color=b.color!==void 0?new THREE.Color(b.color):new THREE.Color(16777215);
this.ambient=b.ambient!==void 0?new THREE.Color(b.ambient):new THREE.Color(16777215);
this.emissive=b.emissive!==void 0?new THREE.Color(b.emissive):new THREE.Color(0);
this.wrapAround=b.wrapAround!==void 0?b.wrapAround:false;
this.wrapRGB=new THREE.Vector3(1,1,1);
this.map=b.map!==void 0?b.map:null;
this.lightMap=b.lightMap!==void 0?b.lightMap:null;
this.envMap=b.envMap!==void 0?b.envMap:null;
this.combine=b.combine!==void 0?b.combine:THREE.MultiplyOperation;
this.reflectivity=b.reflectivity!==void 0?b.reflectivity:1;
this.refractionRatio=b.refractionRatio!==void 0?b.refractionRatio:0.98;
this.fog=b.fog!==void 0?b.fog:true;
this.shading=b.shading!==void 0?b.shading:THREE.SmoothShading;
this.wireframe=b.wireframe!==void 0?b.wireframe:false;
this.wireframeLinewidth=b.wireframeLinewidth!==void 0?b.wireframeLinewidth:1;
this.wireframeLinecap=b.wireframeLinecap!==void 0?b.wireframeLinecap:"round";
this.wireframeLinejoin=b.wireframeLinejoin!==void 0?b.wireframeLinejoin:"round";
this.vertexColors=b.vertexColors!==void 0?b.vertexColors:THREE.NoColors;
this.skinning=b.skinning!==void 0?b.skinning:false;
this.morphTargets=b.morphTargets!==void 0?b.morphTargets:false;
this.morphNormals=b.morphNormals!==void 0?b.morphNormals:false
};
THREE.MeshLambertMaterial.prototype=new THREE.Material;
THREE.MeshLambertMaterial.prototype.constructor=THREE.MeshLambertMaterial;
THREE.MeshPhongMaterial=function(b){THREE.Material.call(this,b);
b=b||{};
this.color=b.color!==void 0?new THREE.Color(b.color):new THREE.Color(16777215);
this.ambient=b.ambient!==void 0?new THREE.Color(b.ambient):new THREE.Color(16777215);
this.emissive=b.emissive!==void 0?new THREE.Color(b.emissive):new THREE.Color(0);
this.specular=b.specular!==void 0?new THREE.Color(b.specular):new THREE.Color(1118481);
this.shininess=b.shininess!==void 0?b.shininess:30;
this.metal=b.metal!==void 0?b.metal:false;
this.perPixel=b.perPixel!==void 0?b.perPixel:false;
this.wrapAround=b.wrapAround!==void 0?b.wrapAround:false;
this.wrapRGB=new THREE.Vector3(1,1,1);
this.map=b.map!==void 0?b.map:null;
this.lightMap=b.lightMap!==void 0?b.lightMap:null;
this.envMap=b.envMap!==void 0?b.envMap:null;
this.combine=b.combine!==void 0?b.combine:THREE.MultiplyOperation;
this.reflectivity=b.reflectivity!==void 0?b.reflectivity:1;
this.refractionRatio=b.refractionRatio!==void 0?b.refractionRatio:0.98;
this.fog=b.fog!==void 0?b.fog:true;
this.shading=b.shading!==void 0?b.shading:THREE.SmoothShading;
this.wireframe=b.wireframe!==void 0?b.wireframe:false;
this.wireframeLinewidth=b.wireframeLinewidth!==void 0?b.wireframeLinewidth:1;
this.wireframeLinecap=b.wireframeLinecap!==void 0?b.wireframeLinecap:"round";
this.wireframeLinejoin=b.wireframeLinejoin!==void 0?b.wireframeLinejoin:"round";
this.vertexColors=b.vertexColors!==void 0?b.vertexColors:THREE.NoColors;
this.skinning=b.skinning!==void 0?b.skinning:false;
this.morphTargets=b.morphTargets!==void 0?b.morphTargets:false;
this.morphNormals=b.morphNormals!==void 0?b.morphNormals:false
};
THREE.MeshPhongMaterial.prototype=new THREE.Material;
THREE.MeshPhongMaterial.prototype.constructor=THREE.MeshPhongMaterial;
THREE.MeshDepthMaterial=function(b){THREE.Material.call(this,b);
b=b||{};
this.shading=b.shading!==void 0?b.shading:THREE.SmoothShading;
this.wireframe=b.wireframe!==void 0?b.wireframe:false;
this.wireframeLinewidth=b.wireframeLinewidth!==void 0?b.wireframeLinewidth:1
};
THREE.MeshDepthMaterial.prototype=new THREE.Material;
THREE.MeshDepthMaterial.prototype.constructor=THREE.MeshDepthMaterial;
THREE.MeshNormalMaterial=function(b){THREE.Material.call(this,b);
b=b||{};
this.shading=b.shading?b.shading:THREE.FlatShading;
this.wireframe=b.wireframe?b.wireframe:false;
this.wireframeLinewidth=b.wireframeLinewidth?b.wireframeLinewidth:1
};
THREE.MeshNormalMaterial.prototype=new THREE.Material;
THREE.MeshNormalMaterial.prototype.constructor=THREE.MeshNormalMaterial;
THREE.MeshFaceMaterial=function(){};
THREE.ParticleBasicMaterial=function(b){THREE.Material.call(this,b);
b=b||{};
this.color=b.color!==void 0?new THREE.Color(b.color):new THREE.Color(16777215);
this.map=b.map!==void 0?b.map:null;
this.size=b.size!==void 0?b.size:1;
this.sizeAttenuation=b.sizeAttenuation!==void 0?b.sizeAttenuation:true;
this.vertexColors=b.vertexColors!==void 0?b.vertexColors:false;
this.fog=b.fog!==void 0?b.fog:true
};
THREE.ParticleBasicMaterial.prototype=new THREE.Material;
THREE.ParticleBasicMaterial.prototype.constructor=THREE.ParticleBasicMaterial;
THREE.ParticleCanvasMaterial=function(b){THREE.Material.call(this,b);
b=b||{};
this.color=b.color!==void 0?new THREE.Color(b.color):new THREE.Color(16777215);
this.program=b.program!==void 0?b.program:function(){}
};
THREE.ParticleCanvasMaterial.prototype=new THREE.Material;
THREE.ParticleCanvasMaterial.prototype.constructor=THREE.ParticleCanvasMaterial;
THREE.ParticleDOMMaterial=function(b){THREE.Material.call(this);
this.domElement=b
};
THREE.ShaderMaterial=function(b){THREE.Material.call(this,b);
b=b||{};
this.fragmentShader=b.fragmentShader!==void 0?b.fragmentShader:"void main() {}";
this.vertexShader=b.vertexShader!==void 0?b.vertexShader:"void main() {}";
this.uniforms=b.uniforms!==void 0?b.uniforms:{};
this.attributes=b.attributes;
this.shading=b.shading!==void 0?b.shading:THREE.SmoothShading;
this.wireframe=b.wireframe!==void 0?b.wireframe:false;
this.wireframeLinewidth=b.wireframeLinewidth!==void 0?b.wireframeLinewidth:1;
this.fog=b.fog!==void 0?b.fog:false;
this.lights=b.lights!==void 0?b.lights:false;
this.vertexColors=b.vertexColors!==void 0?b.vertexColors:THREE.NoColors;
this.skinning=b.skinning!==void 0?b.skinning:false;
this.morphTargets=b.morphTargets!==void 0?b.morphTargets:false;
this.morphNormals=b.morphNormals!==void 0?b.morphNormals:false
};
THREE.ShaderMaterial.prototype=new THREE.Material;
THREE.ShaderMaterial.prototype.constructor=THREE.ShaderMaterial;
THREE.Texture=function(l,k,r,q,p,o,n,m){this.id=THREE.TextureCount++;
this.image=l;
this.mapping=k!==void 0?k:new THREE.UVMapping;
this.wrapS=r!==void 0?r:THREE.ClampToEdgeWrapping;
this.wrapT=q!==void 0?q:THREE.ClampToEdgeWrapping;
this.magFilter=p!==void 0?p:THREE.LinearFilter;
this.minFilter=o!==void 0?o:THREE.LinearMipMapLinearFilter;
this.format=n!==void 0?n:THREE.RGBAFormat;
this.type=m!==void 0?m:THREE.UnsignedByteType;
this.offset=new THREE.Vector2(0,0);
this.repeat=new THREE.Vector2(1,1);
this.generateMipmaps=true;
this.needsUpdate=this.premultiplyAlpha=false;
this.onUpdate=null
};
THREE.Texture.prototype={constructor:THREE.Texture,clone:function(){var b=new THREE.Texture(this.image,this.mapping,this.wrapS,this.wrapT,this.magFilter,this.minFilter,this.format,this.type);
b.offset.copy(this.offset);
b.repeat.copy(this.repeat);
return b
}};
THREE.TextureCount=0;
THREE.MultiplyOperation=0;
THREE.MixOperation=1;
THREE.UVMapping=function(){};
THREE.CubeReflectionMapping=function(){};
THREE.CubeRefractionMapping=function(){};
THREE.SphericalReflectionMapping=function(){};
THREE.SphericalRefractionMapping=function(){};
THREE.RepeatWrapping=0;
THREE.ClampToEdgeWrapping=1;
THREE.MirroredRepeatWrapping=2;
THREE.NearestFilter=3;
THREE.NearestMipMapNearestFilter=4;
THREE.NearestMipMapLinearFilter=5;
THREE.LinearFilter=6;
THREE.LinearMipMapNearestFilter=7;
THREE.LinearMipMapLinearFilter=8;
THREE.ByteType=9;
THREE.UnsignedByteType=10;
THREE.ShortType=11;
THREE.UnsignedShortType=12;
THREE.IntType=13;
THREE.UnsignedIntType=14;
THREE.FloatType=15;
THREE.AlphaFormat=16;
THREE.RGBFormat=17;
THREE.RGBAFormat=18;
THREE.LuminanceFormat=19;
THREE.LuminanceAlphaFormat=20;
THREE.DataTexture=function(u,t,s,r,q,p,o,n,m,k){THREE.Texture.call(this,null,p,o,n,m,k,r,q);
this.image={data:u,width:t,height:s}
};
THREE.DataTexture.prototype=new THREE.Texture;
THREE.DataTexture.prototype.constructor=THREE.DataTexture;
THREE.DataTexture.prototype.clone=function(){var b=new THREE.DataTexture(this.image.data,this.image.width,this.image.height,this.format,this.type,this.mapping,this.wrapS,this.wrapT,this.magFilter,this.minFilter);
b.offset.copy(this.offset);
b.repeat.copy(this.repeat);
return b
};
THREE.Particle=function(b){THREE.Object3D.call(this);
this.material=b
};
THREE.Particle.prototype=new THREE.Object3D;
THREE.Particle.prototype.constructor=THREE.Particle;
THREE.ParticleSystem=function(d,c){THREE.Object3D.call(this);
this.geometry=d;
this.material=c!==void 0?c:new THREE.ParticleBasicMaterial({color:Math.random()*16777215});
this.sortParticles=false;
if(this.geometry){this.geometry.boundingSphere||this.geometry.computeBoundingSphere();
this.boundRadius=d.boundingSphere.radius
}this.frustumCulled=false
};
THREE.ParticleSystem.prototype=new THREE.Object3D;
THREE.ParticleSystem.prototype.constructor=THREE.ParticleSystem;
THREE.Line=function(e,d,f){THREE.Object3D.call(this);
this.geometry=e;
this.material=d!==void 0?d:new THREE.LineBasicMaterial({color:Math.random()*16777215});
this.type=f!==void 0?f:THREE.LineStrip;
this.geometry&&(this.geometry.boundingSphere||this.geometry.computeBoundingSphere())
};
THREE.LineStrip=0;
THREE.LinePieces=1;
THREE.Line.prototype=new THREE.Object3D;
THREE.Line.prototype.constructor=THREE.Line;
THREE.Mesh=function(e,d){THREE.Object3D.call(this);
this.geometry=e;
this.material=d!==void 0?d:new THREE.MeshBasicMaterial({color:Math.random()*16777215,wireframe:true});
if(this.geometry){this.geometry.boundingSphere||this.geometry.computeBoundingSphere();
this.boundRadius=e.boundingSphere.radius;
if(this.geometry.morphTargets.length){this.morphTargetBase=-1;
this.morphTargetForcedOrder=[];
this.morphTargetInfluences=[];
this.morphTargetDictionary={};
for(var f=0;
f<this.geometry.morphTargets.length;
f++){this.morphTargetInfluences.push(0);
this.morphTargetDictionary[this.geometry.morphTargets[f].name]=f
}}}};
THREE.Mesh.prototype=new THREE.Object3D;
THREE.Mesh.prototype.constructor=THREE.Mesh;
THREE.Mesh.prototype.supr=THREE.Object3D.prototype;
THREE.Mesh.prototype.getMorphTargetIndexByName=function(b){if(this.morphTargetDictionary[b]!==void 0){return this.morphTargetDictionary[b]
}console.log("THREE.Mesh.getMorphTargetIndexByName: morph target "+b+" does not exist. Returning 0.");
return 0
};
THREE.Bone=function(b){THREE.Object3D.call(this);
this.skin=b;
this.skinMatrix=new THREE.Matrix4
};
THREE.Bone.prototype=new THREE.Object3D;
THREE.Bone.prototype.constructor=THREE.Bone;
THREE.Bone.prototype.supr=THREE.Object3D.prototype;
THREE.Bone.prototype.update=function(f,e){this.matrixAutoUpdate&&(e=e|this.updateMatrix());
if(e||this.matrixWorldNeedsUpdate){f?this.skinMatrix.multiply(f,this.matrix):this.skinMatrix.copy(this.matrix);
this.matrixWorldNeedsUpdate=false;
e=true
}var h,g=this.children.length;
for(h=0;
h<g;
h++){this.children[h].update(this.skinMatrix,e)
}};
THREE.SkinnedMesh=function(l,k){THREE.Mesh.call(this,l,k);
this.identityMatrix=new THREE.Matrix4;
this.bones=[];
this.boneMatrices=[];
var r,q,p,o,n,m;
if(this.geometry.bones!==void 0){for(r=0;
r<this.geometry.bones.length;
r++){p=this.geometry.bones[r];
o=p.pos;
n=p.rotq;
m=p.scl;
q=this.addBone();
q.name=p.name;
q.position.set(o[0],o[1],o[2]);
q.quaternion.set(n[0],n[1],n[2],n[3]);
q.useQuaternion=true;
m!==void 0?q.scale.set(m[0],m[1],m[2]):q.scale.set(1,1,1)
}for(r=0;
r<this.bones.length;
r++){p=this.geometry.bones[r];
q=this.bones[r];
p.parent===-1?this.add(q):this.bones[p.parent].add(q)
}this.boneMatrices=new Float32Array(16*this.bones.length);
this.pose()
}};
THREE.SkinnedMesh.prototype=new THREE.Mesh;
THREE.SkinnedMesh.prototype.constructor=THREE.SkinnedMesh;
THREE.SkinnedMesh.prototype.addBone=function(b){b===void 0&&(b=new THREE.Bone(this));
this.bones.push(b);
return b
};
THREE.SkinnedMesh.prototype.updateMatrixWorld=function(f){this.matrixAutoUpdate&&this.updateMatrix();
if(this.matrixWorldNeedsUpdate||f){this.parent?this.matrixWorld.multiply(this.parent.matrixWorld,this.matrix):this.matrixWorld.copy(this.matrix);
this.matrixWorldNeedsUpdate=false
}for(var f=0,e=this.children.length;
f<e;
f++){var h=this.children[f];
h instanceof THREE.Bone?h.update(this.identityMatrix,false):h.updateMatrixWorld(true)
}for(var e=this.bones.length,h=this.bones,g=this.boneMatrices,f=0;
f<e;
f++){h[f].skinMatrix.flattenToArrayOffset(g,f*16)
}};
THREE.SkinnedMesh.prototype.pose=function(){this.updateMatrixWorld(true);
for(var h,g=[],n=0;
n<this.bones.length;
n++){h=this.bones[n];
var m=new THREE.Matrix4;
m.getInverse(h.skinMatrix);
g.push(m);
h.skinMatrix.flattenToArrayOffset(this.boneMatrices,n*16)
}if(this.geometry.skinVerticesA===void 0){this.geometry.skinVerticesA=[];
this.geometry.skinVerticesB=[];
for(h=0;
h<this.geometry.skinIndices.length;
h++){var n=this.geometry.vertices[h],l=this.geometry.skinIndices[h].x,k=this.geometry.skinIndices[h].y,m=new THREE.Vector3(n.x,n.y,n.z);
this.geometry.skinVerticesA.push(g[l].multiplyVector3(m));
m=new THREE.Vector3(n.x,n.y,n.z);
this.geometry.skinVerticesB.push(g[k].multiplyVector3(m));
if(this.geometry.skinWeights[h].x+this.geometry.skinWeights[h].y!==1){n=(1-(this.geometry.skinWeights[h].x+this.geometry.skinWeights[h].y))*0.5;
this.geometry.skinWeights[h].x=this.geometry.skinWeights[h].x+n;
this.geometry.skinWeights[h].y=this.geometry.skinWeights[h].y+n
}}}};
THREE.MorphAnimMesh=function(d,c){THREE.Mesh.call(this,d,c);
this.duration=1000;
this.mirroredLoop=false;
this.currentKeyframe=this.lastKeyframe=this.time=0;
this.direction=1;
this.directionBackwards=false;
this.setFrameRange(0,this.geometry.morphTargets.length-1)
};
THREE.MorphAnimMesh.prototype=new THREE.Mesh;
THREE.MorphAnimMesh.prototype.constructor=THREE.MorphAnimMesh;
THREE.MorphAnimMesh.prototype.setFrameRange=function(d,c){this.startKeyframe=d;
this.endKeyframe=c;
this.length=this.endKeyframe-this.startKeyframe+1
};
THREE.MorphAnimMesh.prototype.setDirectionForward=function(){this.direction=1;
this.directionBackwards=false
};
THREE.MorphAnimMesh.prototype.setDirectionBackward=function(){this.direction=-1;
this.directionBackwards=true
};
THREE.MorphAnimMesh.prototype.parseAnimations=function(){var l=this.geometry;
if(!l.animations){l.animations={}
}for(var k,r=l.animations,q=/([a-z]+)(\d+)/,p=0,o=l.morphTargets.length;
p<o;
p++){var n=l.morphTargets[p].name.match(q);
if(n&&n.length>1){n=n[1];
r[n]||(r[n]={start:Infinity,end:-Infinity});
var m=r[n];
if(p<m.start){m.start=p
}if(p>m.end){m.end=p
}k||(k=n)
}}l.firstAnimation=k
};
THREE.MorphAnimMesh.prototype.setAnimationLabel=function(e,d,f){if(!this.geometry.animations){this.geometry.animations={}
}this.geometry.animations[e]={start:d,end:f}
};
THREE.MorphAnimMesh.prototype.playAnimation=function(e,d){var f=this.geometry.animations[e];
if(f){this.setFrameRange(f.start,f.end);
this.duration=1000*((f.end-f.start)/d);
this.time=0
}else{console.warn("animation["+e+"] undefined")
}};
THREE.MorphAnimMesh.prototype.updateAnimation=function(d){var c=this.duration/this.length;
this.time=this.time+this.direction*d;
if(this.mirroredLoop){if(this.time>this.duration||this.time<0){this.direction=this.direction*-1;
if(this.time>this.duration){this.time=this.duration;
this.directionBackwards=true
}if(this.time<0){this.time=0;
this.directionBackwards=false
}}}else{this.time=this.time%this.duration;
if(this.time<0){this.time=this.time+this.duration
}}d=this.startKeyframe+THREE.Math.clamp(Math.floor(this.time/c),0,this.length-1);
if(d!==this.currentKeyframe){this.morphTargetInfluences[this.lastKeyframe]=0;
this.morphTargetInfluences[this.currentKeyframe]=1;
this.morphTargetInfluences[d]=0;
this.lastKeyframe=this.currentKeyframe;
this.currentKeyframe=d
}c=this.time%c/c;
this.directionBackwards&&(c=1-c);
this.morphTargetInfluences[this.currentKeyframe]=c;
this.morphTargetInfluences[this.lastKeyframe]=1-c
};
THREE.Ribbon=function(d,c){THREE.Object3D.call(this);
this.geometry=d;
this.material=c
};
THREE.Ribbon.prototype=new THREE.Object3D;
THREE.Ribbon.prototype.constructor=THREE.Ribbon;
THREE.LOD=function(){THREE.Object3D.call(this);
this.LODs=[]
};
THREE.LOD.prototype=new THREE.Object3D;
THREE.LOD.prototype.constructor=THREE.LOD;
THREE.LOD.prototype.supr=THREE.Object3D.prototype;
THREE.LOD.prototype.addLevel=function(e,d){d===void 0&&(d=0);
for(var d=Math.abs(d),f=0;
f<this.LODs.length;
f++){if(d<this.LODs[f].visibleAtDistance){break
}}this.LODs.splice(f,0,{visibleAtDistance:d,object3D:e});
this.add(e)
};
THREE.LOD.prototype.update=function(d){if(this.LODs.length>1){d.matrixWorldInverse.getInverse(d.matrixWorld);
d=d.matrixWorldInverse;
d=-(d.elements[2]*this.matrixWorld.elements[12]+d.elements[6]*this.matrixWorld.elements[13]+d.elements[10]*this.matrixWorld.elements[14]+d.elements[14]);
this.LODs[0].object3D.visible=true;
for(var c=1;
c<this.LODs.length;
c++){if(d>=this.LODs[c].visibleAtDistance){this.LODs[c-1].object3D.visible=false;
this.LODs[c].object3D.visible=true
}else{break
}}for(;
c<this.LODs.length;
c++){this.LODs[c].object3D.visible=false
}}};
THREE.Sprite=function(b){THREE.Object3D.call(this);
this.color=b.color!==void 0?new THREE.Color(b.color):new THREE.Color(16777215);
this.map=b.map!==void 0?b.map:new THREE.Texture;
this.blending=b.blending!==void 0?b.blending:THREE.NormalBlending;
this.blendSrc=b.blendSrc!==void 0?b.blendSrc:THREE.SrcAlphaFactor;
this.blendDst=b.blendDst!==void 0?b.blendDst:THREE.OneMinusSrcAlphaFactor;
this.blendEquation=b.blendEquation!==void 0?b.blendEquation:THREE.AddEquation;
this.useScreenCoordinates=b.useScreenCoordinates!==void 0?b.useScreenCoordinates:true;
this.mergeWith3D=b.mergeWith3D!==void 0?b.mergeWith3D:!this.useScreenCoordinates;
this.affectedByDistance=b.affectedByDistance!==void 0?b.affectedByDistance:!this.useScreenCoordinates;
this.scaleByViewport=b.scaleByViewport!==void 0?b.scaleByViewport:!this.affectedByDistance;
this.alignment=b.alignment instanceof THREE.Vector2?b.alignment:THREE.SpriteAlignment.center;
this.rotation3d=this.rotation;
this.rotation=0;
this.opacity=1;
this.uvOffset=new THREE.Vector2(0,0);
this.uvScale=new THREE.Vector2(1,1)
};
THREE.Sprite.prototype=new THREE.Object3D;
THREE.Sprite.prototype.constructor=THREE.Sprite;
THREE.Sprite.prototype.updateMatrix=function(){this.matrix.setPosition(this.position);
this.rotation3d.set(0,0,this.rotation);
this.matrix.setRotationFromEuler(this.rotation3d);
if(this.scale.x!==1||this.scale.y!==1){this.matrix.scale(this.scale);
this.boundRadiusScale=Math.max(this.scale.x,this.scale.y)
}this.matrixWorldNeedsUpdate=true
};
THREE.SpriteAlignment={};
THREE.SpriteAlignment.topLeft=new THREE.Vector2(1,-1);
THREE.SpriteAlignment.topCenter=new THREE.Vector2(0,-1);
THREE.SpriteAlignment.topRight=new THREE.Vector2(-1,-1);
THREE.SpriteAlignment.centerLeft=new THREE.Vector2(1,0);
THREE.SpriteAlignment.center=new THREE.Vector2(0,0);
THREE.SpriteAlignment.centerRight=new THREE.Vector2(-1,0);
THREE.SpriteAlignment.bottomLeft=new THREE.Vector2(1,1);
THREE.SpriteAlignment.bottomCenter=new THREE.Vector2(0,1);
THREE.SpriteAlignment.bottomRight=new THREE.Vector2(-1,1);
THREE.Scene=function(){THREE.Object3D.call(this);
this.overrideMaterial=this.fog=null;
this.matrixAutoUpdate=false;
this.__objects=[];
this.__lights=[];
this.__objectsAdded=[];
this.__objectsRemoved=[]
};
THREE.Scene.prototype=new THREE.Object3D;
THREE.Scene.prototype.constructor=THREE.Scene;
THREE.Scene.prototype.__addObject=function(d){if(d instanceof THREE.Light){this.__lights.indexOf(d)===-1&&this.__lights.push(d)
}else{if(!(d instanceof THREE.Camera||d instanceof THREE.Bone)&&this.__objects.indexOf(d)===-1){this.__objects.push(d);
this.__objectsAdded.push(d);
var c=this.__objectsRemoved.indexOf(d);
c!==-1&&this.__objectsRemoved.splice(c,1)
}}for(c=0;
c<d.children.length;
c++){this.__addObject(d.children[c])
}};
THREE.Scene.prototype.__removeObject=function(d){if(d instanceof THREE.Light){var c=this.__lights.indexOf(d);
c!==-1&&this.__lights.splice(c,1)
}else{if(!(d instanceof THREE.Camera)){c=this.__objects.indexOf(d);
if(c!==-1){this.__objects.splice(c,1);
this.__objectsRemoved.push(d);
c=this.__objectsAdded.indexOf(d);
c!==-1&&this.__objectsAdded.splice(c,1)
}}}for(c=0;
c<d.children.length;
c++){this.__removeObject(d.children[c])
}};
THREE.Fog=function(e,d,f){this.color=new THREE.Color(e);
this.near=d!==void 0?d:1;
this.far=f!==void 0?f:1000
};
THREE.FogExp2=function(d,c){this.color=new THREE.Color(d);
this.density=c!==void 0?c:0.00025
};
THREE.DOMRenderer=function(){console.log("THREE.DOMRenderer",THREE.REVISION);
var l,k,r,q,p,o,n,m=new THREE.Projector;
n=function(e){for(var d=document.documentElement,f=0;
f<e.length;
f++){if(typeof d.style[e[f]]==="string"){return e[f]
}}return null
}(["transform","MozTransform","WebkitTransform","msTransform","OTransform"]);
this.domElement=document.createElement("div");
this.setSize=function(d,c){r=d;
q=c;
p=r/2;
o=q/2
};
this.render=function(t,h){var b,f,a,g,e,s;
l=m.projectScene(t,h);
k=l.elements;
b=0;
for(f=k.length;
b<f;
b++){a=k[b];
if(a instanceof THREE.RenderableParticle&&a.material instanceof THREE.ParticleDOMMaterial){g=a.material.domElement;
e=a.x*p+p-(g.offsetWidth>>1);
s=a.y*o+o-(g.offsetHeight>>1);
g.style.left=e+"px";
g.style.top=s+"px";
g.style.zIndex=Math.abs(Math.floor((1-a.z)*h.far/h.near));
n&&(g.style[n]="scale("+a.scale.x*p+","+a.scale.y*o+")")
}}}
};
THREE.CanvasRenderer=function(aI){function aH(b){if(ak!=b){aq.globalAlpha=ak=b
}}function aG(b){if(af!=b){switch(b){case THREE.NormalBlending:aq.globalCompositeOperation="source-over";
break;
case THREE.AdditiveBlending:aq.globalCompositeOperation="lighter"
}af=b
}}function aE(b){if(al!=b){aq.strokeStyle=al=b
}}function aD(b){if(ah!=b){aq.fillStyle=ah=b
}}console.log("THREE.CanvasRenderer",THREE.REVISION);
var aI=aI||{},aC=this,aB,aA,av,at=new THREE.Projector,au=aI.canvas!==void 0?aI.canvas:document.createElement("canvas"),ao,ar,ap,an,aq=au.getContext("2d"),am=new THREE.Color(0),aj=0,ak=1,af=0,al=null,ah=null,aX=null,a0=null,ae=null,ai,a4,aU,aS,aN=new THREE.RenderableVertex,aP=new THREE.RenderableVertex,a1,aR,aY,ax,aM,aL,a2,aK,aZ,L,bd,az,aQ=new THREE.Color,aO=new THREE.Color,aJ=new THREE.Color,ba=new THREE.Color,aW=new THREE.Color,bf=[],ac=[],V,S,I,bb,X,be,a8,N,aT,aV,ag=new THREE.Rectangle,a9=new THREE.Rectangle,B=new THREE.Rectangle,a3=false,a6=new THREE.Color,bc=new THREE.Color,ad=new THREE.Color,aF=new THREE.Vector3,aw,ay,x,a5,W,a7,aI=16;
aw=document.createElement("canvas");
aw.width=aw.height=2;
ay=aw.getContext("2d");
ay.fillStyle="rgba(0,0,0,1)";
ay.fillRect(0,0,2,2);
x=ay.getImageData(0,0,2,2);
a5=x.data;
W=document.createElement("canvas");
W.width=W.height=aI;
a7=W.getContext("2d");
a7.translate(-aI/2,-aI/2);
a7.scale(aI,aI);
aI--;
this.domElement=au;
this.sortElements=this.sortObjects=this.autoClear=true;
this.info={render:{vertices:0,faces:0}};
this.setSize=function(d,c){ao=d;
ar=c;
ap=Math.floor(ao/2);
an=Math.floor(ar/2);
au.width=ao;
au.height=ar;
ag.set(-ap,-an,ap,an);
a9.set(-ap,-an,ap,an);
ak=1;
af=0;
ae=a0=aX=ah=al=null
};
this.setClearColor=function(d,c){am.copy(d);
aj=c!==void 0?c:1;
a9.set(-ap,-an,ap,an)
};
this.setClearColorHex=function(d,c){am.setHex(d);
aj=c!==void 0?c:1;
a9.set(-ap,-an,ap,an)
};
this.clear=function(){aq.setTransform(1,0,0,-1,ap,an);
if(!a9.isEmpty()){a9.minSelf(ag);
a9.inflate(2);
aj<1&&aq.clearRect(Math.floor(a9.getX()),Math.floor(a9.getY()),Math.floor(a9.getWidth()),Math.floor(a9.getHeight()));
if(aj>0){aG(THREE.NormalBlending);
aH(1);
aD("rgba("+Math.floor(am.r*255)+","+Math.floor(am.g*255)+","+Math.floor(am.b*255)+","+aj+")");
aq.fillRect(Math.floor(a9.getX()),Math.floor(a9.getY()),Math.floor(a9.getWidth()),Math.floor(a9.getHeight()))
}a9.empty()
}};
this.render=function(J,F){function D(m){var k,s,r,p;
a6.setRGB(0,0,0);
bc.setRGB(0,0,0);
ad.setRGB(0,0,0);
k=0;
for(s=m.length;
k<s;
k++){r=m[k];
p=r.color;
if(r instanceof THREE.AmbientLight){a6.r=a6.r+p.r;
a6.g=a6.g+p.g;
a6.b=a6.b+p.b
}else{if(r instanceof THREE.DirectionalLight){bc.r=bc.r+p.r;
bc.g=bc.g+p.g;
bc.b=bc.b+p.b
}else{if(r instanceof THREE.PointLight){ad.r=ad.r+p.r;
ad.g=ad.g+p.g;
ad.b=ad.b+p.b
}}}}}function C(M,y,w,u){var t,s,r,m,p,k;
t=0;
for(s=M.length;
t<s;
t++){r=M[t];
m=r.color;
if(r instanceof THREE.DirectionalLight){p=r.matrixWorld.getPosition();
k=w.dot(p);
if(!(k<=0)){k=k*r.intensity;
u.r=u.r+m.r*k;
u.g=u.g+m.g*k;
u.b=u.b+m.b*k
}}else{if(r instanceof THREE.PointLight){p=r.matrixWorld.getPosition();
k=w.dot(aF.sub(p,y).normalize());
if(!(k<=0)){k=k*(r.distance==0?1:1-Math.min(y.distanceTo(p)/r.distance,1));
if(k!=0){k=k*r.intensity;
u.r=u.r+m.r*k;
u.g=u.g+m.g*k;
u.b=u.b+m.b*k
}}}}}}function A(O,M,y){aH(y.opacity);
aG(y.blending);
var u,w,t,s,r,p;
if(y instanceof THREE.ParticleBasicMaterial){if(y.map){s=y.map.image;
r=s.width>>1;
p=s.height>>1;
y=M.scale.x*ap;
t=M.scale.y*an;
u=y*r;
w=t*p;
B.set(O.x-u,O.y-w,O.x+u,O.y+w);
if(ag.intersects(B)){aq.save();
aq.translate(O.x,O.y);
aq.rotate(-M.rotation);
aq.scale(y,-t);
aq.translate(-r,-p);
aq.drawImage(s,0,0);
aq.restore()
}}}else{if(y instanceof THREE.ParticleCanvasMaterial){u=M.scale.x*ap;
w=M.scale.y*an;
B.set(O.x-u,O.y-w,O.x+u,O.y+w);
if(ag.intersects(B)){aE(y.color.getContextStyle());
aD(y.color.getContextStyle());
aq.save();
aq.translate(O.x,O.y);
aq.rotate(-M.rotation);
aq.scale(u,w);
y.program(aq);
aq.restore()
}}}}function z(k,r,p,m){aH(m.opacity);
aG(m.blending);
aq.beginPath();
aq.moveTo(k.positionScreen.x,k.positionScreen.y);
aq.lineTo(r.positionScreen.x,r.positionScreen.y);
aq.closePath();
if(m instanceof THREE.LineBasicMaterial){k=m.linewidth;
if(aX!=k){aq.lineWidth=aX=k
}k=m.linecap;
if(a0!=k){aq.lineCap=a0=k
}k=m.linejoin;
if(ae!=k){aq.lineJoin=ae=k
}aE(m.color.getContextStyle());
aq.stroke();
B.inflate(m.linewidth*2)
}}function v(r,w,u,t,s,p,k,y){aC.info.render.vertices=aC.info.render.vertices+3;
aC.info.render.faces++;
aH(y.opacity);
aG(y.blending);
a1=r.positionScreen.x;
aR=r.positionScreen.y;
aY=w.positionScreen.x;
ax=w.positionScreen.y;
aM=u.positionScreen.x;
aL=u.positionScreen.y;
o(a1,aR,aY,ax,aM,aL);
if(y instanceof THREE.MeshBasicMaterial){if(y.map){if(y.map.mapping instanceof THREE.UVMapping){bb=k.uvs[0];
G(a1,aR,aY,ax,aM,aL,bb[t].u,bb[t].v,bb[s].u,bb[s].v,bb[p].u,bb[p].v,y.map)
}}else{if(y.envMap){if(y.envMap.mapping instanceof THREE.SphericalReflectionMapping){r=F.matrixWorldInverse;
aF.copy(k.vertexNormalsWorld[t]);
X=(aF.x*r.elements[0]+aF.y*r.elements[4]+aF.z*r.elements[8])*0.5+0.5;
be=-(aF.x*r.elements[1]+aF.y*r.elements[5]+aF.z*r.elements[9])*0.5+0.5;
aF.copy(k.vertexNormalsWorld[s]);
a8=(aF.x*r.elements[0]+aF.y*r.elements[4]+aF.z*r.elements[8])*0.5+0.5;
N=-(aF.x*r.elements[1]+aF.y*r.elements[5]+aF.z*r.elements[9])*0.5+0.5;
aF.copy(k.vertexNormalsWorld[p]);
aT=(aF.x*r.elements[0]+aF.y*r.elements[4]+aF.z*r.elements[8])*0.5+0.5;
aV=-(aF.x*r.elements[1]+aF.y*r.elements[5]+aF.z*r.elements[9])*0.5+0.5;
G(a1,aR,aY,ax,aM,aL,X,be,a8,N,aT,aV,y.envMap)
}}else{y.wireframe?c(y.color,y.wireframeLinewidth,y.wireframeLinecap,y.wireframeLinejoin):g(y.color)
}}}else{if(y instanceof THREE.MeshLambertMaterial){if(a3){if(!y.wireframe&&y.shading==THREE.SmoothShading&&k.vertexNormalsWorld.length==3){aO.r=aJ.r=ba.r=a6.r;
aO.g=aJ.g=ba.g=a6.g;
aO.b=aJ.b=ba.b=a6.b;
C(av,k.v1.positionWorld,k.vertexNormalsWorld[0],aO);
C(av,k.v2.positionWorld,k.vertexNormalsWorld[1],aJ);
C(av,k.v3.positionWorld,k.vertexNormalsWorld[2],ba);
aO.r=Math.max(0,Math.min(y.color.r*aO.r,1));
aO.g=Math.max(0,Math.min(y.color.g*aO.g,1));
aO.b=Math.max(0,Math.min(y.color.b*aO.b,1));
aJ.r=Math.max(0,Math.min(y.color.r*aJ.r,1));
aJ.g=Math.max(0,Math.min(y.color.g*aJ.g,1));
aJ.b=Math.max(0,Math.min(y.color.b*aJ.b,1));
ba.r=Math.max(0,Math.min(y.color.r*ba.r,1));
ba.g=Math.max(0,Math.min(y.color.g*ba.g,1));
ba.b=Math.max(0,Math.min(y.color.b*ba.b,1));
aW.r=(aJ.r+ba.r)*0.5;
aW.g=(aJ.g+ba.g)*0.5;
aW.b=(aJ.b+ba.b)*0.5;
I=E(aO,aJ,ba,aW);
K(a1,aR,aY,ax,aM,aL,0,0,1,0,0,1,I)
}else{aQ.r=a6.r;
aQ.g=a6.g;
aQ.b=a6.b;
C(av,k.centroidWorld,k.normalWorld,aQ);
aQ.r=Math.max(0,Math.min(y.color.r*aQ.r,1));
aQ.g=Math.max(0,Math.min(y.color.g*aQ.g,1));
aQ.b=Math.max(0,Math.min(y.color.b*aQ.b,1));
y.wireframe?c(aQ,y.wireframeLinewidth,y.wireframeLinecap,y.wireframeLinejoin):g(aQ)
}}else{y.wireframe?c(y.color,y.wireframeLinewidth,y.wireframeLinecap,y.wireframeLinejoin):g(y.color)
}}else{if(y instanceof THREE.MeshDepthMaterial){V=F.near;
S=F.far;
aO.r=aO.g=aO.b=1-H(r.positionScreen.z,V,S);
aJ.r=aJ.g=aJ.b=1-H(w.positionScreen.z,V,S);
ba.r=ba.g=ba.b=1-H(u.positionScreen.z,V,S);
aW.r=(aJ.r+ba.r)*0.5;
aW.g=(aJ.g+ba.g)*0.5;
aW.b=(aJ.b+ba.b)*0.5;
I=E(aO,aJ,ba,aW);
K(a1,aR,aY,ax,aM,aL,0,0,1,0,0,1,I)
}else{if(y instanceof THREE.MeshNormalMaterial){aQ.r=f(k.normalWorld.x);
aQ.g=f(k.normalWorld.y);
aQ.b=f(k.normalWorld.z);
y.wireframe?c(aQ,y.wireframeLinewidth,y.wireframeLinecap,y.wireframeLinejoin):g(aQ)
}}}}}function q(M,y,w,u,t,s,p,r,k){aC.info.render.vertices=aC.info.render.vertices+4;
aC.info.render.faces++;
aH(r.opacity);
aG(r.blending);
if(r.map||r.envMap){v(M,y,u,0,1,3,p,r,k);
v(t,w,s,1,2,3,p,r,k)
}else{a1=M.positionScreen.x;
aR=M.positionScreen.y;
aY=y.positionScreen.x;
ax=y.positionScreen.y;
aM=w.positionScreen.x;
aL=w.positionScreen.y;
a2=u.positionScreen.x;
aK=u.positionScreen.y;
aZ=t.positionScreen.x;
L=t.positionScreen.y;
bd=s.positionScreen.x;
az=s.positionScreen.y;
if(r instanceof THREE.MeshBasicMaterial){h(a1,aR,aY,ax,aM,aL,a2,aK);
r.wireframe?c(r.color,r.wireframeLinewidth,r.wireframeLinecap,r.wireframeLinejoin):g(r.color)
}else{if(r instanceof THREE.MeshLambertMaterial){if(a3){if(!r.wireframe&&r.shading==THREE.SmoothShading&&p.vertexNormalsWorld.length==4){aO.r=aJ.r=ba.r=aW.r=a6.r;
aO.g=aJ.g=ba.g=aW.g=a6.g;
aO.b=aJ.b=ba.b=aW.b=a6.b;
C(av,p.v1.positionWorld,p.vertexNormalsWorld[0],aO);
C(av,p.v2.positionWorld,p.vertexNormalsWorld[1],aJ);
C(av,p.v4.positionWorld,p.vertexNormalsWorld[3],ba);
C(av,p.v3.positionWorld,p.vertexNormalsWorld[2],aW);
aO.r=Math.max(0,Math.min(r.color.r*aO.r,1));
aO.g=Math.max(0,Math.min(r.color.g*aO.g,1));
aO.b=Math.max(0,Math.min(r.color.b*aO.b,1));
aJ.r=Math.max(0,Math.min(r.color.r*aJ.r,1));
aJ.g=Math.max(0,Math.min(r.color.g*aJ.g,1));
aJ.b=Math.max(0,Math.min(r.color.b*aJ.b,1));
ba.r=Math.max(0,Math.min(r.color.r*ba.r,1));
ba.g=Math.max(0,Math.min(r.color.g*ba.g,1));
ba.b=Math.max(0,Math.min(r.color.b*ba.b,1));
aW.r=Math.max(0,Math.min(r.color.r*aW.r,1));
aW.g=Math.max(0,Math.min(r.color.g*aW.g,1));
aW.b=Math.max(0,Math.min(r.color.b*aW.b,1));
I=E(aO,aJ,ba,aW);
o(a1,aR,aY,ax,a2,aK);
K(a1,aR,aY,ax,a2,aK,0,0,1,0,0,1,I);
o(aZ,L,aM,aL,bd,az);
K(aZ,L,aM,aL,bd,az,1,0,1,1,0,1,I)
}else{aQ.r=a6.r;
aQ.g=a6.g;
aQ.b=a6.b;
C(av,p.centroidWorld,p.normalWorld,aQ);
aQ.r=Math.max(0,Math.min(r.color.r*aQ.r,1));
aQ.g=Math.max(0,Math.min(r.color.g*aQ.g,1));
aQ.b=Math.max(0,Math.min(r.color.b*aQ.b,1));
h(a1,aR,aY,ax,aM,aL,a2,aK);
r.wireframe?c(aQ,r.wireframeLinewidth,r.wireframeLinecap,r.wireframeLinejoin):g(aQ)
}}else{h(a1,aR,aY,ax,aM,aL,a2,aK);
r.wireframe?c(r.color,r.wireframeLinewidth,r.wireframeLinecap,r.wireframeLinejoin):g(r.color)
}}else{if(r instanceof THREE.MeshNormalMaterial){aQ.r=f(p.normalWorld.x);
aQ.g=f(p.normalWorld.y);
aQ.b=f(p.normalWorld.z);
h(a1,aR,aY,ax,aM,aL,a2,aK);
r.wireframe?c(aQ,r.wireframeLinewidth,r.wireframeLinecap,r.wireframeLinejoin):g(aQ)
}else{if(r instanceof THREE.MeshDepthMaterial){V=F.near;
S=F.far;
aO.r=aO.g=aO.b=1-H(M.positionScreen.z,V,S);
aJ.r=aJ.g=aJ.b=1-H(y.positionScreen.z,V,S);
ba.r=ba.g=ba.b=1-H(u.positionScreen.z,V,S);
aW.r=aW.g=aW.b=1-H(w.positionScreen.z,V,S);
I=E(aO,aJ,ba,aW);
o(a1,aR,aY,ax,a2,aK);
K(a1,aR,aY,ax,a2,aK,0,0,1,0,0,1,I);
o(aZ,L,aM,aL,bd,az);
K(aZ,L,aM,aL,bd,az,1,0,1,1,0,1,I)
}}}}}}function o(m,k,t,s,r,p){aq.beginPath();
aq.moveTo(m,k);
aq.lineTo(t,s);
aq.lineTo(r,p);
aq.lineTo(m,k);
aq.closePath()
}function h(m,k,w,u,t,s,r,p){aq.beginPath();
aq.moveTo(m,k);
aq.lineTo(w,u);
aq.lineTo(t,s);
aq.lineTo(r,p);
aq.lineTo(m,k);
aq.closePath()
}function c(m,k,r,p){if(aX!=k){aq.lineWidth=aX=k
}if(a0!=r){aq.lineCap=a0=r
}if(ae!=p){aq.lineJoin=ae=p
}aE(m.getContextStyle());
aq.stroke();
B.inflate(k*2)
}function g(k){aD(k.getContextStyle());
aq.fill()
}function G(bg,ab,aa,Z,Y,U,R,T,Q,P,O,M,w){if(w.image.width!=0){if(w.needsUpdate==true||bf[w.id]==void 0){var y=w.wrapS==THREE.RepeatWrapping,u=w.wrapT==THREE.RepeatWrapping;
bf[w.id]=aq.createPattern(w.image,y&&u?"repeat":y&&!u?"repeat-x":!y&&u?"repeat-y":"no-repeat");
w.needsUpdate=false
}aD(bf[w.id]);
var y=w.offset.x/w.repeat.x,u=w.offset.y/w.repeat.y,t=w.image.width*w.repeat.x,s=w.image.height*w.repeat.y,R=(R+y)*t,T=(T+u)*s,aa=aa-bg,Z=Z-ab,Y=Y-bg,U=U-ab,Q=(Q+y)*t-R,P=(P+u)*s-T,O=(O+y)*t-R,M=(M+u)*s-T,y=Q*M-O*P;
if(y==0){if(ac[w.id]===void 0){ab=document.createElement("canvas");
ab.width=w.image.width;
ab.height=w.image.height;
ab=ab.getContext("2d");
ab.drawImage(w.image,0,0);
ac[w.id]=ab.getImageData(0,0,w.image.width,w.image.height).data
}ab=ac[w.id];
R=(Math.floor(R)+Math.floor(T)*w.image.width)*4;
aQ.setRGB(ab[R]/255,ab[R+1]/255,ab[R+2]/255);
g(aQ)
}else{y=1/y;
w=(M*aa-P*Y)*y;
P=(M*Z-P*U)*y;
aa=(Q*Y-O*aa)*y;
Z=(Q*U-O*Z)*y;
bg=bg-w*R-aa*T;
R=ab-P*R-Z*T;
aq.save();
aq.transform(w,P,aa,Z,bg,R);
aq.fill();
aq.restore()
}}}function K(Z,Y,U,T,R,Q,P,M,O,y,w,u,t){var r,s;
r=t.width-1;
s=t.height-1;
P=P*r;
M=M*s;
U=U-Z;
T=T-Y;
R=R-Z;
Q=Q-Y;
O=O*r-P;
y=y*s-M;
w=w*r-P;
u=u*s-M;
s=1/(O*u-w*y);
r=(u*U-y*R)*s;
y=(u*T-y*Q)*s;
U=(O*R-w*U)*s;
T=(O*Q-w*T)*s;
Z=Z-r*P-U*M;
Y=Y-y*P-T*M;
aq.save();
aq.transform(r,y,U,T,Z,Y);
aq.clip();
aq.drawImage(t,0,0);
aq.restore()
}function E(Q,P,O,M){var y=~~(Q.r*255),w=~~(Q.g*255),Q=~~(Q.b*255),u=~~(P.r*255),s=~~(P.g*255),P=~~(P.b*255),t=~~(O.r*255),r=~~(O.g*255),O=~~(O.b*255),p=~~(M.r*255),m=~~(M.g*255),M=~~(M.b*255);
a5[0]=y<0?0:y>255?255:y;
a5[1]=w<0?0:w>255?255:w;
a5[2]=Q<0?0:Q>255?255:Q;
a5[4]=u<0?0:u>255?255:u;
a5[5]=s<0?0:s>255?255:s;
a5[6]=P<0?0:P>255?255:P;
a5[8]=t<0?0:t>255?255:t;
a5[9]=r<0?0:r>255?255:r;
a5[10]=O<0?0:O>255?255:O;
a5[12]=p<0?0:p>255?255:p;
a5[13]=m<0?0:m>255?255:m;
a5[14]=M<0?0:M>255?255:M;
ay.putImageData(x,0,0);
a7.drawImage(aw,0,0);
return W
}function H(m,k,p){m=(m-k)/(p-k);
return m*m*(3-2*m)
}function f(k){k=(k+1)*0.5;
return k<0?0:k>1?1:k
}function n(m,k){var s=k.x-m.x,r=k.y-m.y,p=s*s+r*r;
if(p!=0){p=1/Math.sqrt(p);
s=s*p;
r=r*p;
k.x=k.x+s;
k.y=k.y+r;
m.x=m.x-s;
m.y=m.y-r
}}var b,d,l,e;
this.autoClear?this.clear():aq.setTransform(1,0,0,-1,ap,an);
aC.info.render.vertices=0;
aC.info.render.faces=0;
aB=at.projectScene(J,F,this.sortElements);
aA=aB.elements;
av=aB.lights;
(a3=av.length>0)&&D(av);
b=0;
for(d=aA.length;
b<d;
b++){l=aA[b];
e=l.material;
e=e instanceof THREE.MeshFaceMaterial?l.faceMaterial:e;
if(!(e===void 0||e.visible===false)){B.empty();
if(l instanceof THREE.RenderableParticle){ai=l;
ai.x=ai.x*ap;
ai.y=ai.y*an;
A(ai,l,e,J)
}else{if(l instanceof THREE.RenderableLine){ai=l.v1;
a4=l.v2;
ai.positionScreen.x=ai.positionScreen.x*ap;
ai.positionScreen.y=ai.positionScreen.y*an;
a4.positionScreen.x=a4.positionScreen.x*ap;
a4.positionScreen.y=a4.positionScreen.y*an;
B.addPoint(ai.positionScreen.x,ai.positionScreen.y);
B.addPoint(a4.positionScreen.x,a4.positionScreen.y);
ag.intersects(B)&&z(ai,a4,l,e,J)
}else{if(l instanceof THREE.RenderableFace3){ai=l.v1;
a4=l.v2;
aU=l.v3;
ai.positionScreen.x=ai.positionScreen.x*ap;
ai.positionScreen.y=ai.positionScreen.y*an;
a4.positionScreen.x=a4.positionScreen.x*ap;
a4.positionScreen.y=a4.positionScreen.y*an;
aU.positionScreen.x=aU.positionScreen.x*ap;
aU.positionScreen.y=aU.positionScreen.y*an;
if(e.overdraw){n(ai.positionScreen,a4.positionScreen);
n(a4.positionScreen,aU.positionScreen);
n(aU.positionScreen,ai.positionScreen)
}B.add3Points(ai.positionScreen.x,ai.positionScreen.y,a4.positionScreen.x,a4.positionScreen.y,aU.positionScreen.x,aU.positionScreen.y);
ag.intersects(B)&&v(ai,a4,aU,0,1,2,l,e,J)
}else{if(l instanceof THREE.RenderableFace4){ai=l.v1;
a4=l.v2;
aU=l.v3;
aS=l.v4;
ai.positionScreen.x=ai.positionScreen.x*ap;
ai.positionScreen.y=ai.positionScreen.y*an;
a4.positionScreen.x=a4.positionScreen.x*ap;
a4.positionScreen.y=a4.positionScreen.y*an;
aU.positionScreen.x=aU.positionScreen.x*ap;
aU.positionScreen.y=aU.positionScreen.y*an;
aS.positionScreen.x=aS.positionScreen.x*ap;
aS.positionScreen.y=aS.positionScreen.y*an;
aN.positionScreen.copy(a4.positionScreen);
aP.positionScreen.copy(aS.positionScreen);
if(e.overdraw){n(ai.positionScreen,a4.positionScreen);
n(a4.positionScreen,aS.positionScreen);
n(aS.positionScreen,ai.positionScreen);
n(aU.positionScreen,aN.positionScreen);
n(aU.positionScreen,aP.positionScreen)
}B.addPoint(ai.positionScreen.x,ai.positionScreen.y);
B.addPoint(a4.positionScreen.x,a4.positionScreen.y);
B.addPoint(aU.positionScreen.x,aU.positionScreen.y);
B.addPoint(aS.positionScreen.x,aS.positionScreen.y);
ag.intersects(B)&&q(ai,a4,aU,aS,aN,aP,l,e,J)
}}}}a9.addRectangle(B)
}}aq.setTransform(1,0,0,1,0,0)
}
};
THREE.SVGRenderer=function(){function am(u,t,s,r){var q,p,o,n,m,l;
q=0;
for(p=u.length;
q<p;
q++){o=u[q];
n=o.color;
if(o instanceof THREE.DirectionalLight){m=o.matrixWorld.getPosition();
l=s.dot(m);
if(!(l<=0)){l=l*o.intensity;
r.r=r.r+n.r*l;
r.g=r.g+n.g*l;
r.b=r.b+n.b*l
}}else{if(o instanceof THREE.PointLight){m=o.matrixWorld.getPosition();
l=s.dot(N.sub(m,t).normalize());
if(!(l<=0)){l=l*(o.distance==0?1:1-Math.min(t.distanceTo(m)/o.distance,1));
if(l!=0){l=l*o.intensity;
r.r=r.r+n.r*l;
r.g=r.g+n.g*l;
r.b=r.b+n.b*l
}}}}}}function al(b){if(X[b]==null){X[b]=document.createElementNS("http://www.w3.org/2000/svg","path");
T==0&&X[b].setAttribute("shape-rendering","crispEdges")
}return X[b]
}function ak(b){b=(b+1)*0.5;
return b<0?0:b>1?1:b
}console.log("THREE.SVGRenderer",THREE.REVISION);
var aj=this,ai,ah,ag,af=new THREE.Projector,ae=document.createElementNS("http://www.w3.org/2000/svg","svg"),ac,ad,Y,ab,Z,W,aa,V,O=new THREE.Rectangle,S=new THREE.Rectangle,I=false,U=new THREE.Color,M=new THREE.Color,L=new THREE.Color,Q=new THREE.Color,F,N=new THREE.Vector3,X=[],G=[],C,x,B,T=1;
this.domElement=ae;
this.sortElements=this.sortObjects=this.autoClear=true;
this.info={render:{vertices:0,faces:0}};
this.setQuality=function(b){switch(b){case"high":T=1;
break;
case"low":T=0
}};
this.setSize=function(d,c){ac=d;
ad=c;
Y=ac/2;
ab=ad/2;
ae.setAttribute("viewBox",-Y+" "+-ab+" "+ac+" "+ad);
ae.setAttribute("width",ac);
ae.setAttribute("height",ad);
O.set(-Y,-ab,Y,ab)
};
this.clear=function(){for(;
ae.childNodes.length>0;
){ae.removeChild(ae.childNodes[0])
}};
this.render=function(f,e){var g,m,c,a;
this.autoClear&&this.clear();
aj.info.render.vertices=0;
aj.info.render.faces=0;
ai=af.projectScene(f,e,this.sortElements);
ah=ai.elements;
ag=ai.lights;
B=x=0;
if(I=ag.length>0){M.setRGB(0,0,0);
L.setRGB(0,0,0);
Q.setRGB(0,0,0);
g=0;
for(m=ag.length;
g<m;
g++){a=ag[g];
c=a.color;
if(a instanceof THREE.AmbientLight){M.r=M.r+c.r;
M.g=M.g+c.g;
M.b=M.b+c.b
}else{if(a instanceof THREE.DirectionalLight){L.r=L.r+c.r;
L.g=L.g+c.g;
L.b=L.b+c.b
}else{if(a instanceof THREE.PointLight){Q.r=Q.r+c.r;
Q.g=Q.g+c.g;
Q.b=Q.b+c.b
}}}}}g=0;
for(m=ah.length;
g<m;
g++){c=ah[g];
a=c.material;
a=a instanceof THREE.MeshFaceMaterial?c.faceMaterial:a;
if(!(a===void 0||a.visible===false)){S.empty();
if(c instanceof THREE.RenderableParticle){Z=c;
Z.x=Z.x*Y;
Z.y=Z.y*-ab
}else{if(c instanceof THREE.RenderableLine){Z=c.v1;
W=c.v2;
Z.positionScreen.x=Z.positionScreen.x*Y;
Z.positionScreen.y=Z.positionScreen.y*-ab;
W.positionScreen.x=W.positionScreen.x*Y;
W.positionScreen.y=W.positionScreen.y*-ab;
S.addPoint(Z.positionScreen.x,Z.positionScreen.y);
S.addPoint(W.positionScreen.x,W.positionScreen.y);
if(O.intersects(S)){c=Z;
var b=W,n=B++;
if(G[n]==null){G[n]=document.createElementNS("http://www.w3.org/2000/svg","line");
T==0&&G[n].setAttribute("shape-rendering","crispEdges")
}C=G[n];
C.setAttribute("x1",c.positionScreen.x);
C.setAttribute("y1",c.positionScreen.y);
C.setAttribute("x2",b.positionScreen.x);
C.setAttribute("y2",b.positionScreen.y);
if(a instanceof THREE.LineBasicMaterial){C.setAttribute("style","fill: none; stroke: "+a.color.getContextStyle()+"; stroke-width: "+a.linewidth+"; stroke-opacity: "+a.opacity+"; stroke-linecap: "+a.linecap+"; stroke-linejoin: "+a.linejoin);
ae.appendChild(C)
}}}else{if(c instanceof THREE.RenderableFace3){Z=c.v1;
W=c.v2;
aa=c.v3;
Z.positionScreen.x=Z.positionScreen.x*Y;
Z.positionScreen.y=Z.positionScreen.y*-ab;
W.positionScreen.x=W.positionScreen.x*Y;
W.positionScreen.y=W.positionScreen.y*-ab;
aa.positionScreen.x=aa.positionScreen.x*Y;
aa.positionScreen.y=aa.positionScreen.y*-ab;
S.addPoint(Z.positionScreen.x,Z.positionScreen.y);
S.addPoint(W.positionScreen.x,W.positionScreen.y);
S.addPoint(aa.positionScreen.x,aa.positionScreen.y);
if(O.intersects(S)){var b=Z,n=W,h=aa;
aj.info.render.vertices=aj.info.render.vertices+3;
aj.info.render.faces++;
C=al(x++);
C.setAttribute("d","M "+b.positionScreen.x+" "+b.positionScreen.y+" L "+n.positionScreen.x+" "+n.positionScreen.y+" L "+h.positionScreen.x+","+h.positionScreen.y+"z");
if(a instanceof THREE.MeshBasicMaterial){U.copy(a.color)
}else{if(a instanceof THREE.MeshLambertMaterial){if(I){U.r=M.r;
U.g=M.g;
U.b=M.b;
am(ag,c.centroidWorld,c.normalWorld,U);
U.r=Math.max(0,Math.min(a.color.r*U.r,1));
U.g=Math.max(0,Math.min(a.color.g*U.g,1));
U.b=Math.max(0,Math.min(a.color.b*U.b,1))
}else{U.copy(a.color)
}}else{if(a instanceof THREE.MeshDepthMaterial){F=1-a.__2near/(a.__farPlusNear-c.z*a.__farMinusNear);
U.setRGB(F,F,F)
}else{a instanceof THREE.MeshNormalMaterial&&U.setRGB(ak(c.normalWorld.x),ak(c.normalWorld.y),ak(c.normalWorld.z))
}}}a.wireframe?C.setAttribute("style","fill: none; stroke: "+U.getContextStyle()+"; stroke-width: "+a.wireframeLinewidth+"; stroke-opacity: "+a.opacity+"; stroke-linecap: "+a.wireframeLinecap+"; stroke-linejoin: "+a.wireframeLinejoin):C.setAttribute("style","fill: "+U.getContextStyle()+"; fill-opacity: "+a.opacity);
ae.appendChild(C)
}}else{if(c instanceof THREE.RenderableFace4){Z=c.v1;
W=c.v2;
aa=c.v3;
V=c.v4;
Z.positionScreen.x=Z.positionScreen.x*Y;
Z.positionScreen.y=Z.positionScreen.y*-ab;
W.positionScreen.x=W.positionScreen.x*Y;
W.positionScreen.y=W.positionScreen.y*-ab;
aa.positionScreen.x=aa.positionScreen.x*Y;
aa.positionScreen.y=aa.positionScreen.y*-ab;
V.positionScreen.x=V.positionScreen.x*Y;
V.positionScreen.y=V.positionScreen.y*-ab;
S.addPoint(Z.positionScreen.x,Z.positionScreen.y);
S.addPoint(W.positionScreen.x,W.positionScreen.y);
S.addPoint(aa.positionScreen.x,aa.positionScreen.y);
S.addPoint(V.positionScreen.x,V.positionScreen.y);
if(O.intersects(S)){var b=Z,n=W,h=aa,d=V;
aj.info.render.vertices=aj.info.render.vertices+4;
aj.info.render.faces++;
C=al(x++);
C.setAttribute("d","M "+b.positionScreen.x+" "+b.positionScreen.y+" L "+n.positionScreen.x+" "+n.positionScreen.y+" L "+h.positionScreen.x+","+h.positionScreen.y+" L "+d.positionScreen.x+","+d.positionScreen.y+"z");
if(a instanceof THREE.MeshBasicMaterial){U.copy(a.color)
}else{if(a instanceof THREE.MeshLambertMaterial){if(I){U.r=M.r;
U.g=M.g;
U.b=M.b;
am(ag,c.centroidWorld,c.normalWorld,U);
U.r=Math.max(0,Math.min(a.color.r*U.r,1));
U.g=Math.max(0,Math.min(a.color.g*U.g,1));
U.b=Math.max(0,Math.min(a.color.b*U.b,1))
}else{U.copy(a.color)
}}else{if(a instanceof THREE.MeshDepthMaterial){F=1-a.__2near/(a.__farPlusNear-c.z*a.__farMinusNear);
U.setRGB(F,F,F)
}else{a instanceof THREE.MeshNormalMaterial&&U.setRGB(ak(c.normalWorld.x),ak(c.normalWorld.y),ak(c.normalWorld.z))
}}}a.wireframe?C.setAttribute("style","fill: none; stroke: "+U.getContextStyle()+"; stroke-width: "+a.wireframeLinewidth+"; stroke-opacity: "+a.opacity+"; stroke-linecap: "+a.wireframeLinecap+"; stroke-linejoin: "+a.wireframeLinejoin):C.setAttribute("style","fill: "+U.getContextStyle()+"; fill-opacity: "+a.opacity);
ae.appendChild(C)
}}}}}}}}
};
THREE.ShaderChunk={fog_pars_fragment:"#ifdef USE_FOG\nuniform vec3 fogColor;\n#ifdef FOG_EXP2\nuniform float fogDensity;\n#else\nuniform float fogNear;\nuniform float fogFar;\n#endif\n#endif",fog_fragment:"#ifdef USE_FOG\nfloat depth = gl_FragCoord.z / gl_FragCoord.w;\n#ifdef FOG_EXP2\nconst float LOG2 = 1.442695;\nfloat fogFactor = exp2( - fogDensity * fogDensity * depth * depth * LOG2 );\nfogFactor = 1.0 - clamp( fogFactor, 0.0, 1.0 );\n#else\nfloat fogFactor = smoothstep( fogNear, fogFar, depth );\n#endif\ngl_FragColor = mix( gl_FragColor, vec4( fogColor, gl_FragColor.w ), fogFactor );\n#endif",envmap_pars_fragment:"#ifdef USE_ENVMAP\nvarying vec3 vReflect;\nuniform float reflectivity;\nuniform samplerCube envMap;\nuniform float flipEnvMap;\nuniform int combine;\n#endif",envmap_fragment:"#ifdef USE_ENVMAP\n#ifdef DOUBLE_SIDED\nfloat flipNormal = ( -1.0 + 2.0 * float( gl_FrontFacing ) );\nvec4 cubeColor = textureCube( envMap, flipNormal * vec3( flipEnvMap * vReflect.x, vReflect.yz ) );\n#else\nvec4 cubeColor = textureCube( envMap, vec3( flipEnvMap * vReflect.x, vReflect.yz ) );\n#endif\n#ifdef GAMMA_INPUT\ncubeColor.xyz *= cubeColor.xyz;\n#endif\nif ( combine == 1 ) {\ngl_FragColor.xyz = mix( gl_FragColor.xyz, cubeColor.xyz, reflectivity );\n} else {\ngl_FragColor.xyz = gl_FragColor.xyz * cubeColor.xyz;\n}\n#endif",envmap_pars_vertex:"#ifdef USE_ENVMAP\nvarying vec3 vReflect;\nuniform float refractionRatio;\nuniform bool useRefract;\n#endif",envmap_vertex:"#ifdef USE_ENVMAP\nvec4 mPosition = objectMatrix * vec4( position, 1.0 );\nvec3 nWorld = mat3( objectMatrix[ 0 ].xyz, objectMatrix[ 1 ].xyz, objectMatrix[ 2 ].xyz ) * normal;\nif ( useRefract ) {\nvReflect = refract( normalize( mPosition.xyz - cameraPosition ), normalize( nWorld.xyz ), refractionRatio );\n} else {\nvReflect = reflect( normalize( mPosition.xyz - cameraPosition ), normalize( nWorld.xyz ) );\n}\n#endif",map_particle_pars_fragment:"#ifdef USE_MAP\nuniform sampler2D map;\n#endif",map_particle_fragment:"#ifdef USE_MAP\ngl_FragColor = gl_FragColor * texture2D( map, gl_PointCoord );\n#endif",map_pars_vertex:"#ifdef USE_MAP\nvarying vec2 vUv;\nuniform vec4 offsetRepeat;\n#endif",map_pars_fragment:"#ifdef USE_MAP\nvarying vec2 vUv;\nuniform sampler2D map;\n#endif",map_vertex:"#ifdef USE_MAP\nvUv = uv * offsetRepeat.zw + offsetRepeat.xy;\n#endif",map_fragment:"#ifdef USE_MAP\n#ifdef GAMMA_INPUT\nvec4 texelColor = texture2D( map, vUv );\ntexelColor.xyz *= texelColor.xyz;\ngl_FragColor = gl_FragColor * texelColor;\n#else\ngl_FragColor = gl_FragColor * texture2D( map, vUv );\n#endif\n#endif",lightmap_pars_fragment:"#ifdef USE_LIGHTMAP\nvarying vec2 vUv2;\nuniform sampler2D lightMap;\n#endif",lightmap_pars_vertex:"#ifdef USE_LIGHTMAP\nvarying vec2 vUv2;\n#endif",lightmap_fragment:"#ifdef USE_LIGHTMAP\ngl_FragColor = gl_FragColor * texture2D( lightMap, vUv2 );\n#endif",lightmap_vertex:"#ifdef USE_LIGHTMAP\nvUv2 = uv2;\n#endif",lights_lambert_pars_vertex:"uniform vec3 ambient;\nuniform vec3 diffuse;\nuniform vec3 emissive;\nuniform vec3 ambientLightColor;\n#if MAX_DIR_LIGHTS > 0\nuniform vec3 directionalLightColor[ MAX_DIR_LIGHTS ];\nuniform vec3 directionalLightDirection[ MAX_DIR_LIGHTS ];\n#endif\n#if MAX_POINT_LIGHTS > 0\nuniform vec3 pointLightColor[ MAX_POINT_LIGHTS ];\nuniform vec3 pointLightPosition[ MAX_POINT_LIGHTS ];\nuniform float pointLightDistance[ MAX_POINT_LIGHTS ];\n#endif\n#if MAX_SPOT_LIGHTS > 0\nuniform vec3 spotLightColor[ MAX_SPOT_LIGHTS ];\nuniform vec3 spotLightPosition[ MAX_SPOT_LIGHTS ];\nuniform vec3 spotLightDirection[ MAX_SPOT_LIGHTS ];\nuniform float spotLightDistance[ MAX_SPOT_LIGHTS ];\nuniform float spotLightAngle[ MAX_SPOT_LIGHTS ];\nuniform float spotLightExponent[ MAX_SPOT_LIGHTS ];\n#endif\n#ifdef WRAP_AROUND\nuniform vec3 wrapRGB;\n#endif",lights_lambert_vertex:"vLightFront = vec3( 0.0 );\n#ifdef DOUBLE_SIDED\nvLightBack = vec3( 0.0 );\n#endif\ntransformedNormal = normalize( transformedNormal );\n#if MAX_DIR_LIGHTS > 0\nfor( int i = 0; i < MAX_DIR_LIGHTS; i ++ ) {\nvec4 lDirection = viewMatrix * vec4( directionalLightDirection[ i ], 0.0 );\nvec3 dirVector = normalize( lDirection.xyz );\nfloat dotProduct = dot( transformedNormal, dirVector );\nvec3 directionalLightWeighting = vec3( max( dotProduct, 0.0 ) );\n#ifdef DOUBLE_SIDED\nvec3 directionalLightWeightingBack = vec3( max( -dotProduct, 0.0 ) );\n#ifdef WRAP_AROUND\nvec3 directionalLightWeightingHalfBack = vec3( max( -0.5 * dotProduct + 0.5, 0.0 ) );\n#endif\n#endif\n#ifdef WRAP_AROUND\nvec3 directionalLightWeightingHalf = vec3( max( 0.5 * dotProduct + 0.5, 0.0 ) );\ndirectionalLightWeighting = mix( directionalLightWeighting, directionalLightWeightingHalf, wrapRGB );\n#ifdef DOUBLE_SIDED\ndirectionalLightWeightingBack = mix( directionalLightWeightingBack, directionalLightWeightingHalfBack, wrapRGB );\n#endif\n#endif\nvLightFront += directionalLightColor[ i ] * directionalLightWeighting;\n#ifdef DOUBLE_SIDED\nvLightBack += directionalLightColor[ i ] * directionalLightWeightingBack;\n#endif\n}\n#endif\n#if MAX_POINT_LIGHTS > 0\nfor( int i = 0; i < MAX_POINT_LIGHTS; i ++ ) {\nvec4 lPosition = viewMatrix * vec4( pointLightPosition[ i ], 1.0 );\nvec3 lVector = lPosition.xyz - mvPosition.xyz;\nfloat lDistance = 1.0;\nif ( pointLightDistance[ i ] > 0.0 )\nlDistance = 1.0 - min( ( length( lVector ) / pointLightDistance[ i ] ), 1.0 );\nlVector = normalize( lVector );\nfloat dotProduct = dot( transformedNormal, lVector );\nvec3 pointLightWeighting = vec3( max( dotProduct, 0.0 ) );\n#ifdef DOUBLE_SIDED\nvec3 pointLightWeightingBack = vec3( max( -dotProduct, 0.0 ) );\n#ifdef WRAP_AROUND\nvec3 pointLightWeightingHalfBack = vec3( max( -0.5 * dotProduct + 0.5, 0.0 ) );\n#endif\n#endif\n#ifdef WRAP_AROUND\nvec3 pointLightWeightingHalf = vec3( max( 0.5 * dotProduct + 0.5, 0.0 ) );\npointLightWeighting = mix( pointLightWeighting, pointLightWeightingHalf, wrapRGB );\n#ifdef DOUBLE_SIDED\npointLightWeightingBack = mix( pointLightWeightingBack, pointLightWeightingHalfBack, wrapRGB );\n#endif\n#endif\nvLightFront += pointLightColor[ i ] * pointLightWeighting * lDistance;\n#ifdef DOUBLE_SIDED\nvLightBack += pointLightColor[ i ] * pointLightWeightingBack * lDistance;\n#endif\n}\n#endif\n#if MAX_SPOT_LIGHTS > 0\nfor( int i = 0; i < MAX_SPOT_LIGHTS; i ++ ) {\nvec4 lPosition = viewMatrix * vec4( spotLightPosition[ i ], 1.0 );\nvec3 lVector = lPosition.xyz - mvPosition.xyz;\nlVector = normalize( lVector );\nfloat spotEffect = dot( spotLightDirection[ i ], normalize( spotLightPosition[ i ] - mPosition.xyz ) );\nif ( spotEffect > spotLightAngle[ i ] ) {\nspotEffect = pow( spotEffect, spotLightExponent[ i ] );\nfloat lDistance = 1.0;\nif ( spotLightDistance[ i ] > 0.0 )\nlDistance = 1.0 - min( ( length( lVector ) / spotLightDistance[ i ] ), 1.0 );\nfloat dotProduct = dot( transformedNormal, lVector );\nvec3 spotLightWeighting = vec3( max( dotProduct, 0.0 ) );\n#ifdef DOUBLE_SIDED\nvec3 spotLightWeightingBack = vec3( max( -dotProduct, 0.0 ) );\n#ifdef WRAP_AROUND\nvec3 spotLightWeightingHalfBack = vec3( max( -0.5 * dotProduct + 0.5, 0.0 ) );\n#endif\n#endif\n#ifdef WRAP_AROUND\nvec3 spotLightWeightingHalf = vec3( max( 0.5 * dotProduct + 0.5, 0.0 ) );\nspotLightWeighting = mix( spotLightWeighting, spotLightWeightingHalf, wrapRGB );\n#ifdef DOUBLE_SIDED\nspotLightWeightingBack = mix( spotLightWeightingBack, spotLightWeightingHalfBack, wrapRGB );\n#endif\n#endif\nvLightFront += spotLightColor[ i ] * spotLightWeighting * lDistance * spotEffect;\n#ifdef DOUBLE_SIDED\nvLightBack += spotLightColor[ i ] * spotLightWeightingBack * lDistance * spotEffect;\n#endif\n}\n}\n#endif\nvLightFront = vLightFront * diffuse + ambient * ambientLightColor + emissive;\n#ifdef DOUBLE_SIDED\nvLightBack = vLightBack * diffuse + ambient * ambientLightColor + emissive;\n#endif",lights_phong_pars_vertex:"#ifndef PHONG_PER_PIXEL\n#if MAX_POINT_LIGHTS > 0\nuniform vec3 pointLightPosition[ MAX_POINT_LIGHTS ];\nuniform float pointLightDistance[ MAX_POINT_LIGHTS ];\nvarying vec4 vPointLight[ MAX_POINT_LIGHTS ];\n#endif\n#if MAX_SPOT_LIGHTS > 0\nuniform vec3 spotLightPosition[ MAX_SPOT_LIGHTS ];\nuniform float spotLightDistance[ MAX_SPOT_LIGHTS ];\nvarying vec4 vSpotLight[ MAX_SPOT_LIGHTS ];\n#endif\n#endif\n#if MAX_SPOT_LIGHTS > 0\nvarying vec3 vWorldPosition;\n#endif",lights_phong_vertex:"#ifndef PHONG_PER_PIXEL\n#if MAX_POINT_LIGHTS > 0\nfor( int i = 0; i < MAX_POINT_LIGHTS; i ++ ) {\nvec4 lPosition = viewMatrix * vec4( pointLightPosition[ i ], 1.0 );\nvec3 lVector = lPosition.xyz - mvPosition.xyz;\nfloat lDistance = 1.0;\nif ( pointLightDistance[ i ] > 0.0 )\nlDistance = 1.0 - min( ( length( lVector ) / pointLightDistance[ i ] ), 1.0 );\nvPointLight[ i ] = vec4( lVector, lDistance );\n}\n#endif\n#if MAX_SPOT_LIGHTS > 0\nfor( int i = 0; i < MAX_SPOT_LIGHTS; i ++ ) {\nvec4 lPosition = viewMatrix * vec4( spotLightPosition[ i ], 1.0 );\nvec3 lVector = lPosition.xyz - mvPosition.xyz;\nfloat lDistance = 1.0;\nif ( spotLightDistance[ i ] > 0.0 )\nlDistance = 1.0 - min( ( length( lVector ) / spotLightDistance[ i ] ), 1.0 );\nvSpotLight[ i ] = vec4( lVector, lDistance );\n}\n#endif\n#endif\n#if MAX_SPOT_LIGHTS > 0\nvWorldPosition = mPosition.xyz;\n#endif",lights_phong_pars_fragment:"uniform vec3 ambientLightColor;\n#if MAX_DIR_LIGHTS > 0\nuniform vec3 directionalLightColor[ MAX_DIR_LIGHTS ];\nuniform vec3 directionalLightDirection[ MAX_DIR_LIGHTS ];\n#endif\n#if MAX_POINT_LIGHTS > 0\nuniform vec3 pointLightColor[ MAX_POINT_LIGHTS ];\n#ifdef PHONG_PER_PIXEL\nuniform vec3 pointLightPosition[ MAX_POINT_LIGHTS ];\nuniform float pointLightDistance[ MAX_POINT_LIGHTS ];\n#else\nvarying vec4 vPointLight[ MAX_POINT_LIGHTS ];\n#endif\n#endif\n#if MAX_SPOT_LIGHTS > 0\nuniform vec3 spotLightColor[ MAX_SPOT_LIGHTS ];\nuniform vec3 spotLightPosition[ MAX_SPOT_LIGHTS ];\nuniform vec3 spotLightDirection[ MAX_SPOT_LIGHTS ];\nuniform float spotLightAngle[ MAX_SPOT_LIGHTS ];\nuniform float spotLightExponent[ MAX_SPOT_LIGHTS ];\n#ifdef PHONG_PER_PIXEL\nuniform float spotLightDistance[ MAX_SPOT_LIGHTS ];\n#else\nvarying vec4 vSpotLight[ MAX_SPOT_LIGHTS ];\n#endif\nvarying vec3 vWorldPosition;\n#endif\n#ifdef WRAP_AROUND\nuniform vec3 wrapRGB;\n#endif\nvarying vec3 vViewPosition;\nvarying vec3 vNormal;",lights_phong_fragment:"vec3 normal = normalize( vNormal );\nvec3 viewPosition = normalize( vViewPosition );\n#ifdef DOUBLE_SIDED\nnormal = normal * ( -1.0 + 2.0 * float( gl_FrontFacing ) );\n#endif\n#if MAX_POINT_LIGHTS > 0\nvec3 pointDiffuse  = vec3( 0.0 );\nvec3 pointSpecular = vec3( 0.0 );\nfor ( int i = 0; i < MAX_POINT_LIGHTS; i ++ ) {\n#ifdef PHONG_PER_PIXEL\nvec4 lPosition = viewMatrix * vec4( pointLightPosition[ i ], 1.0 );\nvec3 lVector = lPosition.xyz + vViewPosition.xyz;\nfloat lDistance = 1.0;\nif ( pointLightDistance[ i ] > 0.0 )\nlDistance = 1.0 - min( ( length( lVector ) / pointLightDistance[ i ] ), 1.0 );\nlVector = normalize( lVector );\n#else\nvec3 lVector = normalize( vPointLight[ i ].xyz );\nfloat lDistance = vPointLight[ i ].w;\n#endif\nfloat dotProduct = dot( normal, lVector );\n#ifdef WRAP_AROUND\nfloat pointDiffuseWeightFull = max( dotProduct, 0.0 );\nfloat pointDiffuseWeightHalf = max( 0.5 * dotProduct + 0.5, 0.0 );\nvec3 pointDiffuseWeight = mix( vec3 ( pointDiffuseWeightFull ), vec3( pointDiffuseWeightHalf ), wrapRGB );\n#else\nfloat pointDiffuseWeight = max( dotProduct, 0.0 );\n#endif\npointDiffuse  += diffuse * pointLightColor[ i ] * pointDiffuseWeight * lDistance;\nvec3 pointHalfVector = normalize( lVector + viewPosition );\nfloat pointDotNormalHalf = max( dot( normal, pointHalfVector ), 0.0 );\nfloat pointSpecularWeight = max( pow( pointDotNormalHalf, shininess ), 0.0 );\n#ifdef PHYSICALLY_BASED_SHADING\nfloat specularNormalization = ( shininess + 2.0001 ) / 8.0;\nvec3 schlick = specular + vec3( 1.0 - specular ) * pow( 1.0 - dot( lVector, pointHalfVector ), 5.0 );\npointSpecular += schlick * pointLightColor[ i ] * pointSpecularWeight * pointDiffuseWeight * lDistance * specularNormalization;\n#else\npointSpecular += specular * pointLightColor[ i ] * pointSpecularWeight * pointDiffuseWeight * lDistance;\n#endif\n}\n#endif\n#if MAX_SPOT_LIGHTS > 0\nvec3 spotDiffuse  = vec3( 0.0 );\nvec3 spotSpecular = vec3( 0.0 );\nfor ( int i = 0; i < MAX_SPOT_LIGHTS; i ++ ) {\n#ifdef PHONG_PER_PIXEL\nvec4 lPosition = viewMatrix * vec4( spotLightPosition[ i ], 1.0 );\nvec3 lVector = lPosition.xyz + vViewPosition.xyz;\nfloat lDistance = 1.0;\nif ( spotLightDistance[ i ] > 0.0 )\nlDistance = 1.0 - min( ( length( lVector ) / spotLightDistance[ i ] ), 1.0 );\nlVector = normalize( lVector );\n#else\nvec3 lVector = normalize( vSpotLight[ i ].xyz );\nfloat lDistance = vSpotLight[ i ].w;\n#endif\nfloat spotEffect = dot( spotLightDirection[ i ], normalize( spotLightPosition[ i ] - vWorldPosition ) );\nif ( spotEffect > spotLightAngle[ i ] ) {\nspotEffect = pow( spotEffect, spotLightExponent[ i ] );\nfloat dotProduct = dot( normal, lVector );\n#ifdef WRAP_AROUND\nfloat spotDiffuseWeightFull = max( dotProduct, 0.0 );\nfloat spotDiffuseWeightHalf = max( 0.5 * dotProduct + 0.5, 0.0 );\nvec3 spotDiffuseWeight = mix( vec3 ( spotDiffuseWeightFull ), vec3( spotDiffuseWeightHalf ), wrapRGB );\n#else\nfloat spotDiffuseWeight = max( dotProduct, 0.0 );\n#endif\nspotDiffuse += diffuse * spotLightColor[ i ] * spotDiffuseWeight * lDistance * spotEffect;\nvec3 spotHalfVector = normalize( lVector + viewPosition );\nfloat spotDotNormalHalf = max( dot( normal, spotHalfVector ), 0.0 );\nfloat spotSpecularWeight = max( pow( spotDotNormalHalf, shininess ), 0.0 );\n#ifdef PHYSICALLY_BASED_SHADING\nfloat specularNormalization = ( shininess + 2.0001 ) / 8.0;\nvec3 schlick = specular + vec3( 1.0 - specular ) * pow( 1.0 - dot( lVector, spotHalfVector ), 5.0 );\nspotSpecular += schlick * spotLightColor[ i ] * spotSpecularWeight * spotDiffuseWeight * lDistance * specularNormalization * spotEffect;\n#else\nspotSpecular += specular * spotLightColor[ i ] * spotSpecularWeight * spotDiffuseWeight * lDistance * spotEffect;\n#endif\n}\n}\n#endif\n#if MAX_DIR_LIGHTS > 0\nvec3 dirDiffuse  = vec3( 0.0 );\nvec3 dirSpecular = vec3( 0.0 );\nfor( int i = 0; i < MAX_DIR_LIGHTS; i ++ ) {\nvec4 lDirection = viewMatrix * vec4( directionalLightDirection[ i ], 0.0 );\nvec3 dirVector = normalize( lDirection.xyz );\nfloat dotProduct = dot( normal, dirVector );\n#ifdef WRAP_AROUND\nfloat dirDiffuseWeightFull = max( dotProduct, 0.0 );\nfloat dirDiffuseWeightHalf = max( 0.5 * dotProduct + 0.5, 0.0 );\nvec3 dirDiffuseWeight = mix( vec3( dirDiffuseWeightFull ), vec3( dirDiffuseWeightHalf ), wrapRGB );\n#else\nfloat dirDiffuseWeight = max( dotProduct, 0.0 );\n#endif\ndirDiffuse  += diffuse * directionalLightColor[ i ] * dirDiffuseWeight;\nvec3 dirHalfVector = normalize( dirVector + viewPosition );\nfloat dirDotNormalHalf = max( dot( normal, dirHalfVector ), 0.0 );\nfloat dirSpecularWeight = max( pow( dirDotNormalHalf, shininess ), 0.0 );\n#ifdef PHYSICALLY_BASED_SHADING\nfloat specularNormalization = ( shininess + 2.0001 ) / 8.0;\nvec3 schlick = specular + vec3( 1.0 - specular ) * pow( 1.0 - dot( dirVector, dirHalfVector ), 5.0 );\ndirSpecular += schlick * directionalLightColor[ i ] * dirSpecularWeight * dirDiffuseWeight * specularNormalization;\n#else\ndirSpecular += specular * directionalLightColor[ i ] * dirSpecularWeight * dirDiffuseWeight;\n#endif\n}\n#endif\nvec3 totalDiffuse = vec3( 0.0 );\nvec3 totalSpecular = vec3( 0.0 );\n#if MAX_DIR_LIGHTS > 0\ntotalDiffuse += dirDiffuse;\ntotalSpecular += dirSpecular;\n#endif\n#if MAX_POINT_LIGHTS > 0\ntotalDiffuse += pointDiffuse;\ntotalSpecular += pointSpecular;\n#endif\n#if MAX_SPOT_LIGHTS > 0\ntotalDiffuse += spotDiffuse;\ntotalSpecular += spotSpecular;\n#endif\n#ifdef METAL\ngl_FragColor.xyz = gl_FragColor.xyz * ( emissive + totalDiffuse + ambientLightColor * ambient + totalSpecular );\n#else\ngl_FragColor.xyz = gl_FragColor.xyz * ( emissive + totalDiffuse + ambientLightColor * ambient ) + totalSpecular;\n#endif",color_pars_fragment:"#ifdef USE_COLOR\nvarying vec3 vColor;\n#endif",color_fragment:"#ifdef USE_COLOR\ngl_FragColor = gl_FragColor * vec4( vColor, opacity );\n#endif",color_pars_vertex:"#ifdef USE_COLOR\nvarying vec3 vColor;\n#endif",color_vertex:"#ifdef USE_COLOR\n#ifdef GAMMA_INPUT\nvColor = color * color;\n#else\nvColor = color;\n#endif\n#endif",skinning_pars_vertex:"#ifdef USE_SKINNING\nuniform mat4 boneGlobalMatrices[ MAX_BONES ];\n#endif",skinning_vertex:"#ifdef USE_SKINNING\ngl_Position  = ( boneGlobalMatrices[ int( skinIndex.x ) ] * skinVertexA ) * skinWeight.x;\ngl_Position += ( boneGlobalMatrices[ int( skinIndex.y ) ] * skinVertexB ) * skinWeight.y;\ngl_Position  = projectionMatrix * modelViewMatrix * gl_Position;\n#endif",morphtarget_pars_vertex:"#ifdef USE_MORPHTARGETS\n#ifndef USE_MORPHNORMALS\nuniform float morphTargetInfluences[ 8 ];\n#else\nuniform float morphTargetInfluences[ 4 ];\n#endif\n#endif",morphtarget_vertex:"#ifdef USE_MORPHTARGETS\nvec3 morphed = vec3( 0.0 );\nmorphed += ( morphTarget0 - position ) * morphTargetInfluences[ 0 ];\nmorphed += ( morphTarget1 - position ) * morphTargetInfluences[ 1 ];\nmorphed += ( morphTarget2 - position ) * morphTargetInfluences[ 2 ];\nmorphed += ( morphTarget3 - position ) * morphTargetInfluences[ 3 ];\n#ifndef USE_MORPHNORMALS\nmorphed += ( morphTarget4 - position ) * morphTargetInfluences[ 4 ];\nmorphed += ( morphTarget5 - position ) * morphTargetInfluences[ 5 ];\nmorphed += ( morphTarget6 - position ) * morphTargetInfluences[ 6 ];\nmorphed += ( morphTarget7 - position ) * morphTargetInfluences[ 7 ];\n#endif\nmorphed += position;\ngl_Position = projectionMatrix * modelViewMatrix * vec4( morphed, 1.0 );\n#endif",default_vertex:"#ifndef USE_MORPHTARGETS\n#ifndef USE_SKINNING\ngl_Position = projectionMatrix * mvPosition;\n#endif\n#endif",morphnormal_vertex:"#ifdef USE_MORPHNORMALS\nvec3 morphedNormal = vec3( 0.0 );\nmorphedNormal +=  ( morphNormal0 - normal ) * morphTargetInfluences[ 0 ];\nmorphedNormal +=  ( morphNormal1 - normal ) * morphTargetInfluences[ 1 ];\nmorphedNormal +=  ( morphNormal2 - normal ) * morphTargetInfluences[ 2 ];\nmorphedNormal +=  ( morphNormal3 - normal ) * morphTargetInfluences[ 3 ];\nmorphedNormal += normal;\nvec3 transformedNormal = normalMatrix * morphedNormal;\n#else\nvec3 transformedNormal = normalMatrix * normal;\n#endif",shadowmap_pars_fragment:"#ifdef USE_SHADOWMAP\nuniform sampler2D shadowMap[ MAX_SHADOWS ];\nuniform vec2 shadowMapSize[ MAX_SHADOWS ];\nuniform float shadowDarkness[ MAX_SHADOWS ];\nuniform float shadowBias[ MAX_SHADOWS ];\nvarying vec4 vShadowCoord[ MAX_SHADOWS ];\nfloat unpackDepth( const in vec4 rgba_depth ) {\nconst vec4 bit_shift = vec4( 1.0 / ( 256.0 * 256.0 * 256.0 ), 1.0 / ( 256.0 * 256.0 ), 1.0 / 256.0, 1.0 );\nfloat depth = dot( rgba_depth, bit_shift );\nreturn depth;\n}\n#endif",shadowmap_fragment:"#ifdef USE_SHADOWMAP\n#ifdef SHADOWMAP_DEBUG\nvec3 frustumColors[3];\nfrustumColors[0] = vec3( 1.0, 0.5, 0.0 );\nfrustumColors[1] = vec3( 0.0, 1.0, 0.8 );\nfrustumColors[2] = vec3( 0.0, 0.5, 1.0 );\n#endif\n#ifdef SHADOWMAP_CASCADE\nint inFrustumCount = 0;\n#endif\nfloat fDepth;\nvec3 shadowColor = vec3( 1.0 );\nfor( int i = 0; i < MAX_SHADOWS; i ++ ) {\nvec3 shadowCoord = vShadowCoord[ i ].xyz / vShadowCoord[ i ].w;\nbvec4 inFrustumVec = bvec4 ( shadowCoord.x >= 0.0, shadowCoord.x <= 1.0, shadowCoord.y >= 0.0, shadowCoord.y <= 1.0 );\nbool inFrustum = all( inFrustumVec );\n#ifdef SHADOWMAP_CASCADE\ninFrustumCount += int( inFrustum );\nbvec3 frustumTestVec = bvec3( inFrustum, inFrustumCount == 1, shadowCoord.z <= 1.0 );\n#else\nbvec2 frustumTestVec = bvec2( inFrustum, shadowCoord.z <= 1.0 );\n#endif\nbool frustumTest = all( frustumTestVec );\nif ( frustumTest ) {\nshadowCoord.z += shadowBias[ i ];\n#ifdef SHADOWMAP_SOFT\nfloat shadow = 0.0;\nconst float shadowDelta = 1.0 / 9.0;\nfloat xPixelOffset = 1.0 / shadowMapSize[ i ].x;\nfloat yPixelOffset = 1.0 / shadowMapSize[ i ].y;\nfloat dx0 = -1.25 * xPixelOffset;\nfloat dy0 = -1.25 * yPixelOffset;\nfloat dx1 = 1.25 * xPixelOffset;\nfloat dy1 = 1.25 * yPixelOffset;\nfDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx0, dy0 ) ) );\nif ( fDepth < shadowCoord.z ) shadow += shadowDelta;\nfDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( 0.0, dy0 ) ) );\nif ( fDepth < shadowCoord.z ) shadow += shadowDelta;\nfDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx1, dy0 ) ) );\nif ( fDepth < shadowCoord.z ) shadow += shadowDelta;\nfDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx0, 0.0 ) ) );\nif ( fDepth < shadowCoord.z ) shadow += shadowDelta;\nfDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy ) );\nif ( fDepth < shadowCoord.z ) shadow += shadowDelta;\nfDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx1, 0.0 ) ) );\nif ( fDepth < shadowCoord.z ) shadow += shadowDelta;\nfDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx0, dy1 ) ) );\nif ( fDepth < shadowCoord.z ) shadow += shadowDelta;\nfDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( 0.0, dy1 ) ) );\nif ( fDepth < shadowCoord.z ) shadow += shadowDelta;\nfDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx1, dy1 ) ) );\nif ( fDepth < shadowCoord.z ) shadow += shadowDelta;\nshadowColor = shadowColor * vec3( ( 1.0 - shadowDarkness[ i ] * shadow ) );\n#else\nvec4 rgbaDepth = texture2D( shadowMap[ i ], shadowCoord.xy );\nfloat fDepth = unpackDepth( rgbaDepth );\nif ( fDepth < shadowCoord.z )\nshadowColor = shadowColor * vec3( 1.0 - shadowDarkness[ i ] );\n#endif\n}\n#ifdef SHADOWMAP_DEBUG\n#ifdef SHADOWMAP_CASCADE\nif ( inFrustum && inFrustumCount == 1 ) gl_FragColor.xyz *= frustumColors[ i ];\n#else\nif ( inFrustum ) gl_FragColor.xyz *= frustumColors[ i ];\n#endif\n#endif\n}\n#ifdef GAMMA_OUTPUT\nshadowColor *= shadowColor;\n#endif\ngl_FragColor.xyz = gl_FragColor.xyz * shadowColor;\n#endif",shadowmap_pars_vertex:"#ifdef USE_SHADOWMAP\nvarying vec4 vShadowCoord[ MAX_SHADOWS ];\nuniform mat4 shadowMatrix[ MAX_SHADOWS ];\n#endif",shadowmap_vertex:"#ifdef USE_SHADOWMAP\nfor( int i = 0; i < MAX_SHADOWS; i ++ ) {\n#ifdef USE_MORPHTARGETS\nvShadowCoord[ i ] = shadowMatrix[ i ] * objectMatrix * vec4( morphed, 1.0 );\n#else\nvShadowCoord[ i ] = shadowMatrix[ i ] * objectMatrix * vec4( position, 1.0 );\n#endif\n}\n#endif",alphatest_fragment:"#ifdef ALPHATEST\nif ( gl_FragColor.a < ALPHATEST ) discard;\n#endif",linear_to_gamma_fragment:"#ifdef GAMMA_OUTPUT\ngl_FragColor.xyz = sqrt( gl_FragColor.xyz );\n#endif"};
THREE.UniformsUtils={merge:function(g){var f,l,k,h={};
for(f=0;
f<g.length;
f++){k=this.clone(g[f]);
for(l in k){h[l]=k[l]
}}return h
},clone:function(g){var f,l,k,h={};
for(f in g){h[f]={};
for(l in g[f]){k=g[f][l];
h[f][l]=k instanceof THREE.Color||k instanceof THREE.Vector2||k instanceof THREE.Vector3||k instanceof THREE.Vector4||k instanceof THREE.Matrix4||k instanceof THREE.Texture?k.clone():k instanceof Array?k.slice():k
}}return h
}};
THREE.UniformsLib={common:{diffuse:{type:"c",value:new THREE.Color(15658734)},opacity:{type:"f",value:1},map:{type:"t",value:0,texture:null},offsetRepeat:{type:"v4",value:new THREE.Vector4(0,0,1,1)},lightMap:{type:"t",value:2,texture:null},envMap:{type:"t",value:1,texture:null},flipEnvMap:{type:"f",value:-1},useRefract:{type:"i",value:0},reflectivity:{type:"f",value:1},refractionRatio:{type:"f",value:0.98},combine:{type:"i",value:0},morphTargetInfluences:{type:"f",value:0}},fog:{fogDensity:{type:"f",value:0.00025},fogNear:{type:"f",value:1},fogFar:{type:"f",value:2000},fogColor:{type:"c",value:new THREE.Color(16777215)}},lights:{ambientLightColor:{type:"fv",value:[]},directionalLightDirection:{type:"fv",value:[]},directionalLightColor:{type:"fv",value:[]},pointLightColor:{type:"fv",value:[]},pointLightPosition:{type:"fv",value:[]},pointLightDistance:{type:"fv1",value:[]},spotLightColor:{type:"fv",value:[]},spotLightPosition:{type:"fv",value:[]},spotLightDirection:{type:"fv",value:[]},spotLightDistance:{type:"fv1",value:[]},spotLightAngle:{type:"fv1",value:[]},spotLightExponent:{type:"fv1",value:[]}},particle:{psColor:{type:"c",value:new THREE.Color(15658734)},opacity:{type:"f",value:1},size:{type:"f",value:1},scale:{type:"f",value:1},map:{type:"t",value:0,texture:null},fogDensity:{type:"f",value:0.00025},fogNear:{type:"f",value:1},fogFar:{type:"f",value:2000},fogColor:{type:"c",value:new THREE.Color(16777215)}},shadowmap:{shadowMap:{type:"tv",value:6,texture:[]},shadowMapSize:{type:"v2v",value:[]},shadowBias:{type:"fv1",value:[]},shadowDarkness:{type:"fv1",value:[]},shadowMatrix:{type:"m4v",value:[]}}};
THREE.ShaderLib={depth:{uniforms:{mNear:{type:"f",value:1},mFar:{type:"f",value:2000},opacity:{type:"f",value:1}},vertexShader:"void main() {\ngl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}",fragmentShader:"uniform float mNear;\nuniform float mFar;\nuniform float opacity;\nvoid main() {\nfloat depth = gl_FragCoord.z / gl_FragCoord.w;\nfloat color = 1.0 - smoothstep( mNear, mFar, depth );\ngl_FragColor = vec4( vec3( color ), opacity );\n}"},normal:{uniforms:{opacity:{type:"f",value:1}},vertexShader:"varying vec3 vNormal;\nvoid main() {\nvec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\nvNormal = normalMatrix * normal;\ngl_Position = projectionMatrix * mvPosition;\n}",fragmentShader:"uniform float opacity;\nvarying vec3 vNormal;\nvoid main() {\ngl_FragColor = vec4( 0.5 * normalize( vNormal ) + 0.5, opacity );\n}"},basic:{uniforms:THREE.UniformsUtils.merge([THREE.UniformsLib.common,THREE.UniformsLib.fog,THREE.UniformsLib.shadowmap]),vertexShader:[THREE.ShaderChunk.map_pars_vertex,THREE.ShaderChunk.lightmap_pars_vertex,THREE.ShaderChunk.envmap_pars_vertex,THREE.ShaderChunk.color_pars_vertex,THREE.ShaderChunk.skinning_pars_vertex,THREE.ShaderChunk.morphtarget_pars_vertex,THREE.ShaderChunk.shadowmap_pars_vertex,"void main() {\nvec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",THREE.ShaderChunk.map_vertex,THREE.ShaderChunk.lightmap_vertex,THREE.ShaderChunk.envmap_vertex,THREE.ShaderChunk.color_vertex,THREE.ShaderChunk.skinning_vertex,THREE.ShaderChunk.morphtarget_vertex,THREE.ShaderChunk.default_vertex,THREE.ShaderChunk.shadowmap_vertex,"}"].join("\n"),fragmentShader:["uniform vec3 diffuse;\nuniform float opacity;",THREE.ShaderChunk.color_pars_fragment,THREE.ShaderChunk.map_pars_fragment,THREE.ShaderChunk.lightmap_pars_fragment,THREE.ShaderChunk.envmap_pars_fragment,THREE.ShaderChunk.fog_pars_fragment,THREE.ShaderChunk.shadowmap_pars_fragment,"void main() {\ngl_FragColor = vec4( diffuse, opacity );",THREE.ShaderChunk.map_fragment,THREE.ShaderChunk.alphatest_fragment,THREE.ShaderChunk.lightmap_fragment,THREE.ShaderChunk.color_fragment,THREE.ShaderChunk.envmap_fragment,THREE.ShaderChunk.shadowmap_fragment,THREE.ShaderChunk.linear_to_gamma_fragment,THREE.ShaderChunk.fog_fragment,"}"].join("\n")},lambert:{uniforms:THREE.UniformsUtils.merge([THREE.UniformsLib.common,THREE.UniformsLib.fog,THREE.UniformsLib.lights,THREE.UniformsLib.shadowmap,{ambient:{type:"c",value:new THREE.Color(16777215)},emissive:{type:"c",value:new THREE.Color(0)},wrapRGB:{type:"v3",value:new THREE.Vector3(1,1,1)}}]),vertexShader:["varying vec3 vLightFront;\n#ifdef DOUBLE_SIDED\nvarying vec3 vLightBack;\n#endif",THREE.ShaderChunk.map_pars_vertex,THREE.ShaderChunk.lightmap_pars_vertex,THREE.ShaderChunk.envmap_pars_vertex,THREE.ShaderChunk.lights_lambert_pars_vertex,THREE.ShaderChunk.color_pars_vertex,THREE.ShaderChunk.skinning_pars_vertex,THREE.ShaderChunk.morphtarget_pars_vertex,THREE.ShaderChunk.shadowmap_pars_vertex,"void main() {\nvec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",THREE.ShaderChunk.map_vertex,THREE.ShaderChunk.lightmap_vertex,THREE.ShaderChunk.envmap_vertex,THREE.ShaderChunk.color_vertex,THREE.ShaderChunk.morphnormal_vertex,"#ifndef USE_ENVMAP\nvec4 mPosition = objectMatrix * vec4( position, 1.0 );\n#endif",THREE.ShaderChunk.lights_lambert_vertex,THREE.ShaderChunk.skinning_vertex,THREE.ShaderChunk.morphtarget_vertex,THREE.ShaderChunk.default_vertex,THREE.ShaderChunk.shadowmap_vertex,"}"].join("\n"),fragmentShader:["uniform float opacity;\nvarying vec3 vLightFront;\n#ifdef DOUBLE_SIDED\nvarying vec3 vLightBack;\n#endif",THREE.ShaderChunk.color_pars_fragment,THREE.ShaderChunk.map_pars_fragment,THREE.ShaderChunk.lightmap_pars_fragment,THREE.ShaderChunk.envmap_pars_fragment,THREE.ShaderChunk.fog_pars_fragment,THREE.ShaderChunk.shadowmap_pars_fragment,"void main() {\ngl_FragColor = vec4( vec3 ( 1.0 ), opacity );",THREE.ShaderChunk.map_fragment,THREE.ShaderChunk.alphatest_fragment,"#ifdef DOUBLE_SIDED\nif ( gl_FrontFacing )\ngl_FragColor.xyz *= vLightFront;\nelse\ngl_FragColor.xyz *= vLightBack;\n#else\ngl_FragColor.xyz *= vLightFront;\n#endif",THREE.ShaderChunk.lightmap_fragment,THREE.ShaderChunk.color_fragment,THREE.ShaderChunk.envmap_fragment,THREE.ShaderChunk.shadowmap_fragment,THREE.ShaderChunk.linear_to_gamma_fragment,THREE.ShaderChunk.fog_fragment,"}"].join("\n")},phong:{uniforms:THREE.UniformsUtils.merge([THREE.UniformsLib.common,THREE.UniformsLib.fog,THREE.UniformsLib.lights,THREE.UniformsLib.shadowmap,{ambient:{type:"c",value:new THREE.Color(16777215)},emissive:{type:"c",value:new THREE.Color(0)},specular:{type:"c",value:new THREE.Color(1118481)},shininess:{type:"f",value:30},wrapRGB:{type:"v3",value:new THREE.Vector3(1,1,1)}}]),vertexShader:["varying vec3 vViewPosition;\nvarying vec3 vNormal;",THREE.ShaderChunk.map_pars_vertex,THREE.ShaderChunk.lightmap_pars_vertex,THREE.ShaderChunk.envmap_pars_vertex,THREE.ShaderChunk.lights_phong_pars_vertex,THREE.ShaderChunk.color_pars_vertex,THREE.ShaderChunk.skinning_pars_vertex,THREE.ShaderChunk.morphtarget_pars_vertex,THREE.ShaderChunk.shadowmap_pars_vertex,"void main() {\nvec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",THREE.ShaderChunk.map_vertex,THREE.ShaderChunk.lightmap_vertex,THREE.ShaderChunk.envmap_vertex,THREE.ShaderChunk.color_vertex,"#ifndef USE_ENVMAP\nvec4 mPosition = objectMatrix * vec4( position, 1.0 );\n#endif\nvViewPosition = -mvPosition.xyz;",THREE.ShaderChunk.morphnormal_vertex,"vNormal = transformedNormal;",THREE.ShaderChunk.lights_phong_vertex,THREE.ShaderChunk.skinning_vertex,THREE.ShaderChunk.morphtarget_vertex,THREE.ShaderChunk.default_vertex,THREE.ShaderChunk.shadowmap_vertex,"}"].join("\n"),fragmentShader:["uniform vec3 diffuse;\nuniform float opacity;\nuniform vec3 ambient;\nuniform vec3 emissive;\nuniform vec3 specular;\nuniform float shininess;",THREE.ShaderChunk.color_pars_fragment,THREE.ShaderChunk.map_pars_fragment,THREE.ShaderChunk.lightmap_pars_fragment,THREE.ShaderChunk.envmap_pars_fragment,THREE.ShaderChunk.fog_pars_fragment,THREE.ShaderChunk.lights_phong_pars_fragment,THREE.ShaderChunk.shadowmap_pars_fragment,"void main() {\ngl_FragColor = vec4( vec3 ( 1.0 ), opacity );",THREE.ShaderChunk.map_fragment,THREE.ShaderChunk.alphatest_fragment,THREE.ShaderChunk.lights_phong_fragment,THREE.ShaderChunk.lightmap_fragment,THREE.ShaderChunk.color_fragment,THREE.ShaderChunk.envmap_fragment,THREE.ShaderChunk.shadowmap_fragment,THREE.ShaderChunk.linear_to_gamma_fragment,THREE.ShaderChunk.fog_fragment,"}"].join("\n")},particle_basic:{uniforms:THREE.UniformsUtils.merge([THREE.UniformsLib.particle,THREE.UniformsLib.shadowmap]),vertexShader:["uniform float size;\nuniform float scale;",THREE.ShaderChunk.color_pars_vertex,THREE.ShaderChunk.shadowmap_pars_vertex,"void main() {",THREE.ShaderChunk.color_vertex,"vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n#ifdef USE_SIZEATTENUATION\ngl_PointSize = size * ( scale / length( mvPosition.xyz ) );\n#else\ngl_PointSize = size;\n#endif\ngl_Position = projectionMatrix * mvPosition;",THREE.ShaderChunk.shadowmap_vertex,"}"].join("\n"),fragmentShader:["uniform vec3 psColor;\nuniform float opacity;",THREE.ShaderChunk.color_pars_fragment,THREE.ShaderChunk.map_particle_pars_fragment,THREE.ShaderChunk.fog_pars_fragment,THREE.ShaderChunk.shadowmap_pars_fragment,"void main() {\ngl_FragColor = vec4( psColor, opacity );",THREE.ShaderChunk.map_particle_fragment,THREE.ShaderChunk.alphatest_fragment,THREE.ShaderChunk.color_fragment,THREE.ShaderChunk.shadowmap_fragment,THREE.ShaderChunk.fog_fragment,"}"].join("\n")},depthRGBA:{uniforms:{},vertexShader:[THREE.ShaderChunk.morphtarget_pars_vertex,"void main() {\nvec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",THREE.ShaderChunk.morphtarget_vertex,THREE.ShaderChunk.default_vertex,"}"].join("\n"),fragmentShader:"vec4 pack_depth( const in float depth ) {\nconst vec4 bit_shift = vec4( 256.0 * 256.0 * 256.0, 256.0 * 256.0, 256.0, 1.0 );\nconst vec4 bit_mask  = vec4( 0.0, 1.0 / 256.0, 1.0 / 256.0, 1.0 / 256.0 );\nvec4 res = fract( depth * bit_shift );\nres -= res.xxyz * bit_mask;\nreturn res;\n}\nvoid main() {\ngl_FragData[ 0 ] = pack_depth( gl_FragCoord.z );\n}"}};
THREE.WebGLRenderer=function(a9){function a8(k,h){var p=k.vertices.length,o=h.material;
if(o.attributes){if(k.__webglCustomAttributesList===void 0){k.__webglCustomAttributesList=[]
}for(var n in o.attributes){var m=o.attributes[n];
if(!m.__webglInitialized||m.createUniqueBuffers){m.__webglInitialized=true;
var l=1;
m.type==="v2"?l=2:m.type==="v3"?l=3:m.type==="v4"?l=4:m.type==="c"&&(l=3);
m.size=l;
m.array=new Float32Array(p*l);
m.buffer=a1.createBuffer();
m.buffer.belongsToAttribute=n;
m.needsUpdate=true
}k.__webglCustomAttributesList.push(m)
}}}function a7(d,c){if(d.material&&!(d.material instanceof THREE.MeshFaceMaterial)){return d.material
}if(c.materialIndex>=0){return d.geometry.materials[c.materialIndex]
}}function a6(b){return b instanceof THREE.MeshBasicMaterial&&!b.envMap||b instanceof THREE.MeshDepthMaterial?false:b&&b.shading!==void 0&&b.shading===THREE.SmoothShading?THREE.SmoothShading:THREE.FlatShading
}function a5(b){return b.map||b.lightMap||b instanceof THREE.ShaderMaterial?true:false
}function a4(J,H,G){var F,E,D,C,A=J.vertices;
C=A.length;
var z=J.colors,y=z.length,w=J.__vertexArray,v=J.__colorArray,u=J.__sortArray,s=J.verticesNeedUpdate,t=J.colorsNeedUpdate,r=J.__webglCustomAttributesList;
if(G.sortParticles){aR.copy(av);
aR.multiplySelf(G.matrixWorld);
for(F=0;
F<C;
F++){E=A[F];
ak.copy(E);
aR.multiplyVector3(ak);
u[F]=[ak.z,F]
}u.sort(function(d,c){return c[0]-d[0]
});
for(F=0;
F<C;
F++){E=A[u[F][1]];
D=F*3;
w[D]=E.x;
w[D+1]=E.y;
w[D+2]=E.z
}for(F=0;
F<y;
F++){D=F*3;
E=z[u[F][1]];
v[D]=E.r;
v[D+1]=E.g;
v[D+2]=E.b
}if(r){z=0;
for(y=r.length;
z<y;
z++){A=r[z];
if(A.boundTo===void 0||A.boundTo==="vertices"){D=0;
E=A.value.length;
if(A.size===1){for(F=0;
F<E;
F++){C=u[F][1];
A.array[F]=A.value[C]
}}else{if(A.size===2){for(F=0;
F<E;
F++){C=u[F][1];
C=A.value[C];
A.array[D]=C.x;
A.array[D+1]=C.y;
D=D+2
}}else{if(A.size===3){if(A.type==="c"){for(F=0;
F<E;
F++){C=u[F][1];
C=A.value[C];
A.array[D]=C.r;
A.array[D+1]=C.g;
A.array[D+2]=C.b;
D=D+3
}}else{for(F=0;
F<E;
F++){C=u[F][1];
C=A.value[C];
A.array[D]=C.x;
A.array[D+1]=C.y;
A.array[D+2]=C.z;
D=D+3
}}}else{if(A.size===4){for(F=0;
F<E;
F++){C=u[F][1];
C=A.value[C];
A.array[D]=C.x;
A.array[D+1]=C.y;
A.array[D+2]=C.z;
A.array[D+3]=C.w;
D=D+4
}}}}}}}}}else{if(s){for(F=0;
F<C;
F++){E=A[F];
D=F*3;
w[D]=E.x;
w[D+1]=E.y;
w[D+2]=E.z
}}if(t){for(F=0;
F<y;
F++){E=z[F];
D=F*3;
v[D]=E.r;
v[D+1]=E.g;
v[D+2]=E.b
}}if(r){z=0;
for(y=r.length;
z<y;
z++){A=r[z];
if(A.needsUpdate&&(A.boundTo===void 0||A.boundTo==="vertices")){E=A.value.length;
D=0;
if(A.size===1){for(F=0;
F<E;
F++){A.array[F]=A.value[F]
}}else{if(A.size===2){for(F=0;
F<E;
F++){C=A.value[F];
A.array[D]=C.x;
A.array[D+1]=C.y;
D=D+2
}}else{if(A.size===3){if(A.type==="c"){for(F=0;
F<E;
F++){C=A.value[F];
A.array[D]=C.r;
A.array[D+1]=C.g;
A.array[D+2]=C.b;
D=D+3
}}else{for(F=0;
F<E;
F++){C=A.value[F];
A.array[D]=C.x;
A.array[D+1]=C.y;
A.array[D+2]=C.z;
D=D+3
}}}else{if(A.size===4){for(F=0;
F<E;
F++){C=A.value[F];
A.array[D]=C.x;
A.array[D+1]=C.y;
A.array[D+2]=C.z;
A.array[D+3]=C.w;
D=D+4
}}}}}}}}}if(s||G.sortParticles){a1.bindBuffer(a1.ARRAY_BUFFER,J.__webglVertexBuffer);
a1.bufferData(a1.ARRAY_BUFFER,w,H)
}if(t||G.sortParticles){a1.bindBuffer(a1.ARRAY_BUFFER,J.__webglColorBuffer);
a1.bufferData(a1.ARRAY_BUFFER,v,H)
}if(r){z=0;
for(y=r.length;
z<y;
z++){A=r[z];
if(A.needsUpdate||G.sortParticles){a1.bindBuffer(a1.ARRAY_BUFFER,A.buffer);
a1.bufferData(a1.ARRAY_BUFFER,A.array,H)
}}}}function a3(d,c){return c.z-d.z
}function a2(g,f,l){if(g.length){for(var k=0,h=g.length;
k<h;
k++){x=V=null;
N=an=ae=aF=ax=aV=ab=-1;
aA=true;
g[k].render(f,l,B,S);
x=V=null;
N=an=ae=aF=ax=aV=ab=-1;
aA=true
}}}function aZ(A,z,y,w,v,u,t,s){var r,q,p,o;
if(z){q=A.length-1;
o=z=-1
}else{q=0;
z=A.length;
o=1
}for(var n=q;
n!==z;
n=n+o){r=A[n];
if(r.render){q=r.object;
p=r.buffer;
if(s){r=s
}else{r=r[y];
if(!r){continue
}t&&am.setBlending(r.blending,r.blendEquation,r.blendSrc,r.blendDst);
am.setDepthTest(r.depthTest);
am.setDepthWrite(r.depthWrite);
aM(r.polygonOffset,r.polygonOffsetFactor,r.polygonOffsetUnits)
}am.setObjectFaces(q);
p instanceof THREE.BufferGeometry?am.renderBufferDirect(w,v,u,r,p,q):am.renderBuffer(w,v,u,r,p,q)
}}}function aX(v,u,t,s,r,q,p){for(var o,n,m=0,l=v.length;
m<l;
m++){o=v[m];
n=o.object;
if(n.visible){if(p){o=p
}else{o=o[u];
if(!o){continue
}q&&am.setBlending(o.blending,o.blendEquation,o.blendSrc,o.blendDst);
am.setDepthTest(o.depthTest);
am.setDepthWrite(o.depthWrite);
aM(o.polygonOffset,o.polygonOffsetFactor,o.polygonOffsetUnits)
}am.renderImmediateObject(t,s,r,o,n)
}}}function aY(e,d,f){e.push({buffer:d,object:f,opaque:null,transparent:null})
}function aS(d){for(var c in d.attributes){if(d.attributes[c].needsUpdate){return true
}}return false
}function aW(d){for(var c in d.attributes){d.attributes[c].needsUpdate=false
}}function aT(e,d){for(var f=e.length-1;
f>=0;
f--){e[f].object===d&&e.splice(f,1)
}}function aQ(e,d){for(var f=e.length-1;
f>=0;
f--){e[f]===d&&e.splice(f,1)
}}function aU(bu,bt,bs,br,bq){if(!br.program||br.needsUpdate){am.initMaterial(br,bt,bs,bq);
br.needsUpdate=false
}if(br.morphTargets&&!bq.__webglMorphTargetInfluences){bq.__webglMorphTargetInfluences=new Float32Array(am.maxMorphTargets);
for(var bp=0,bo=am.maxMorphTargets;
bp<bo;
bp++){bq.__webglMorphTargetInfluences[bp]=0
}}var bn=false,bp=br.program,bo=bp.uniforms,bm=br.uniforms;
if(bp!==V){a1.useProgram(bp);
V=bp;
bn=true
}if(br.id!==N){N=br.id;
bn=true
}if(bn||bu!==x){a1.uniformMatrix4fv(bo.projectionMatrix,false,bu._projectionMatrixArray);
bu!==x&&(x=bu)
}if(bn){if(bs&&br.fog){bm.fogColor.value=bs.color;
if(bs instanceof THREE.Fog){bm.fogNear.value=bs.near;
bm.fogFar.value=bs.far
}else{if(bs instanceof THREE.FogExp2){bm.fogDensity.value=bs.density
}}}if(br instanceof THREE.MeshPhongMaterial||br instanceof THREE.MeshLambertMaterial||br.lights){if(aA){for(var bl,bk=0,bj=0,bi=0,bg,bh,be,bd=az,bb=bd.directional.colors,aa=bd.directional.positions,Z=bd.point.colors,U=bd.point.positions,T=bd.point.distances,P=bd.spot.colors,bf=bd.spot.positions,bc=bd.spot.distances,ba=bd.spot.directions,Y=bd.spot.angles,R=bd.spot.exponents,H=0,y=0,G=0,E=be=0,bs=E=0,bn=bt.length;
bs<bn;
bs++){bl=bt[bs];
if(!bl.onlyShadow){bg=bl.color;
bh=bl.intensity;
be=bl.distance;
if(bl instanceof THREE.AmbientLight){if(am.gammaInput){bk=bk+bg.r*bg.r;
bj=bj+bg.g*bg.g;
bi=bi+bg.b*bg.b
}else{bk=bk+bg.r;
bj=bj+bg.g;
bi=bi+bg.b
}}else{if(bl instanceof THREE.DirectionalLight){be=H*3;
if(am.gammaInput){bb[be]=bg.r*bg.r*bh*bh;
bb[be+1]=bg.g*bg.g*bh*bh;
bb[be+2]=bg.b*bg.b*bh*bh
}else{bb[be]=bg.r*bh;
bb[be+1]=bg.g*bh;
bb[be+2]=bg.b*bh
}at.copy(bl.matrixWorld.getPosition());
at.subSelf(bl.target.matrixWorld.getPosition());
at.normalize();
aa[be]=at.x;
aa[be+1]=at.y;
aa[be+2]=at.z;
H=H+1
}else{if(bl instanceof THREE.PointLight){E=y*3;
if(am.gammaInput){Z[E]=bg.r*bg.r*bh*bh;
Z[E+1]=bg.g*bg.g*bh*bh;
Z[E+2]=bg.b*bg.b*bh*bh
}else{Z[E]=bg.r*bh;
Z[E+1]=bg.g*bh;
Z[E+2]=bg.b*bh
}bg=bl.matrixWorld.getPosition();
U[E]=bg.x;
U[E+1]=bg.y;
U[E+2]=bg.z;
T[y]=be;
y=y+1
}else{if(bl instanceof THREE.SpotLight){E=G*3;
if(am.gammaInput){P[E]=bg.r*bg.r*bh*bh;
P[E+1]=bg.g*bg.g*bh*bh;
P[E+2]=bg.b*bg.b*bh*bh
}else{P[E]=bg.r*bh;
P[E+1]=bg.g*bh;
P[E+2]=bg.b*bh
}bg=bl.matrixWorld.getPosition();
bf[E]=bg.x;
bf[E+1]=bg.y;
bf[E+2]=bg.z;
bc[G]=be;
at.copy(bg);
at.subSelf(bl.target.matrixWorld.getPosition());
at.normalize();
ba[E]=at.x;
ba[E+1]=at.y;
ba[E+2]=at.z;
Y[G]=Math.cos(bl.angle);
R[G]=bl.exponent;
G=G+1
}}}}}}bs=H*3;
for(bn=bb.length;
bs<bn;
bs++){bb[bs]=0
}bs=y*3;
for(bn=Z.length;
bs<bn;
bs++){Z[bs]=0
}bs=G*3;
for(bn=P.length;
bs<bn;
bs++){P[bs]=0
}bd.directional.length=H;
bd.point.length=y;
bd.spot.length=G;
bd.ambient[0]=bk;
bd.ambient[1]=bj;
bd.ambient[2]=bi;
aA=false
}bs=az;
bm.ambientLightColor.value=bs.ambient;
bm.directionalLightColor.value=bs.directional.colors;
bm.directionalLightDirection.value=bs.directional.positions;
bm.pointLightColor.value=bs.point.colors;
bm.pointLightPosition.value=bs.point.positions;
bm.pointLightDistance.value=bs.point.distances;
bm.spotLightColor.value=bs.spot.colors;
bm.spotLightPosition.value=bs.spot.positions;
bm.spotLightDistance.value=bs.spot.distances;
bm.spotLightDirection.value=bs.spot.directions;
bm.spotLightAngle.value=bs.spot.angles;
bm.spotLightExponent.value=bs.spot.exponents
}if(br instanceof THREE.MeshBasicMaterial||br instanceof THREE.MeshLambertMaterial||br instanceof THREE.MeshPhongMaterial){bm.opacity.value=br.opacity;
am.gammaInput?bm.diffuse.value.copyGammaToLinear(br.color):bm.diffuse.value=br.color;
(bm.map.texture=br.map)&&bm.offsetRepeat.value.set(br.map.offset.x,br.map.offset.y,br.map.repeat.x,br.map.repeat.y);
bm.lightMap.texture=br.lightMap;
bm.envMap.texture=br.envMap;
bm.flipEnvMap.value=br.envMap instanceof THREE.WebGLRenderTargetCube?1:-1;
bm.reflectivity.value=br.reflectivity;
bm.refractionRatio.value=br.refractionRatio;
bm.combine.value=br.combine;
bm.useRefract.value=br.envMap&&br.envMap.mapping instanceof THREE.CubeRefractionMapping
}if(br instanceof THREE.LineBasicMaterial){bm.diffuse.value=br.color;
bm.opacity.value=br.opacity
}else{if(br instanceof THREE.ParticleBasicMaterial){bm.psColor.value=br.color;
bm.opacity.value=br.opacity;
bm.size.value=br.size;
bm.scale.value=ao.height/2;
bm.map.texture=br.map
}else{if(br instanceof THREE.MeshPhongMaterial){bm.shininess.value=br.shininess;
if(am.gammaInput){bm.ambient.value.copyGammaToLinear(br.ambient);
bm.emissive.value.copyGammaToLinear(br.emissive);
bm.specular.value.copyGammaToLinear(br.specular)
}else{bm.ambient.value=br.ambient;
bm.emissive.value=br.emissive;
bm.specular.value=br.specular
}br.wrapAround&&bm.wrapRGB.value.copy(br.wrapRGB)
}else{if(br instanceof THREE.MeshLambertMaterial){if(am.gammaInput){bm.ambient.value.copyGammaToLinear(br.ambient);
bm.emissive.value.copyGammaToLinear(br.emissive)
}else{bm.ambient.value=br.ambient;
bm.emissive.value=br.emissive
}br.wrapAround&&bm.wrapRGB.value.copy(br.wrapRGB)
}else{if(br instanceof THREE.MeshDepthMaterial){bm.mNear.value=bu.near;
bm.mFar.value=bu.far;
bm.opacity.value=br.opacity
}else{if(br instanceof THREE.MeshNormalMaterial){bm.opacity.value=br.opacity
}}}}}}if(bq.receiveShadow&&!br._shadowPass&&bm.shadowMatrix){bn=bs=0;
for(bl=bt.length;
bn<bl;
bn++){bk=bt[bn];
if(bk.castShadow&&(bk instanceof THREE.SpotLight||bk instanceof THREE.DirectionalLight&&!bk.shadowCascade)){bm.shadowMap.texture[bs]=bk.shadowMap;
bm.shadowMapSize.value[bs]=bk.shadowMapSize;
bm.shadowMatrix.value[bs]=bk.shadowMatrix;
bm.shadowDarkness.value[bs]=bk.shadowDarkness;
bm.shadowBias.value[bs]=bk.shadowBias;
bs++
}}}bt=br.uniformsList;
bm=0;
for(bs=bt.length;
bm<bs;
bm++){if(bk=bp.uniforms[bt[bm][1]]){bn=bt[bm][0];
bj=bn.type;
bl=bn.value;
switch(bj){case"i":a1.uniform1i(bk,bl);
break;
case"f":a1.uniform1f(bk,bl);
break;
case"v2":a1.uniform2f(bk,bl.x,bl.y);
break;
case"v3":a1.uniform3f(bk,bl.x,bl.y,bl.z);
break;
case"v4":a1.uniform4f(bk,bl.x,bl.y,bl.z,bl.w);
break;
case"c":a1.uniform3f(bk,bl.r,bl.g,bl.b);
break;
case"fv1":a1.uniform1fv(bk,bl);
break;
case"fv":a1.uniform3fv(bk,bl);
break;
case"v2v":if(!bn._array){bn._array=new Float32Array(2*bl.length)
}bj=0;
for(bi=bl.length;
bj<bi;
bj++){bd=bj*2;
bn._array[bd]=bl[bj].x;
bn._array[bd+1]=bl[bj].y
}a1.uniform2fv(bk,bn._array);
break;
case"v3v":if(!bn._array){bn._array=new Float32Array(3*bl.length)
}bj=0;
for(bi=bl.length;
bj<bi;
bj++){bd=bj*3;
bn._array[bd]=bl[bj].x;
bn._array[bd+1]=bl[bj].y;
bn._array[bd+2]=bl[bj].z
}a1.uniform3fv(bk,bn._array);
break;
case"v4v":if(!bn._array){bn._array=new Float32Array(4*bl.length)
}bj=0;
for(bi=bl.length;
bj<bi;
bj++){bd=bj*4;
bn._array[bd]=bl[bj].x;
bn._array[bd+1]=bl[bj].y;
bn._array[bd+2]=bl[bj].z;
bn._array[bd+3]=bl[bj].w
}a1.uniform4fv(bk,bn._array);
break;
case"m4":if(!bn._array){bn._array=new Float32Array(16)
}bl.flattenToArray(bn._array);
a1.uniformMatrix4fv(bk,false,bn._array);
break;
case"m4v":if(!bn._array){bn._array=new Float32Array(16*bl.length)
}bj=0;
for(bi=bl.length;
bj<bi;
bj++){bl[bj].flattenToArrayOffset(bn._array,bj*16)
}a1.uniformMatrix4fv(bk,false,bn._array);
break;
case"t":a1.uniform1i(bk,bl);
bk=bn.texture;
if(!bk){continue
}if(bk.image instanceof Array&&bk.image.length===6){bn=bk;
if(bn.image.length===6){if(bn.needsUpdate){if(!bn.image.__webglTextureCube){bn.image.__webglTextureCube=a1.createTexture()
}a1.activeTexture(a1.TEXTURE0+bl);
a1.bindTexture(a1.TEXTURE_CUBE_MAP,bn.image.__webglTextureCube);
bl=[];
for(bk=0;
bk<6;
bk++){bj=bl;
bi=bk;
if(am.autoScaleCubemaps){bd=bn.image[bk];
aa=aE;
if(!(bd.width<=aa&&bd.height<=aa)){Z=Math.max(bd.width,bd.height);
bb=Math.floor(bd.width*aa/Z);
aa=Math.floor(bd.height*aa/Z);
Z=document.createElement("canvas");
Z.width=bb;
Z.height=aa;
Z.getContext("2d").drawImage(bd,0,0,bd.width,bd.height,0,0,bb,aa);
bd=Z
}}else{bd=bn.image[bk]
}bj[bi]=bd
}bk=bl[0];
bj=(bk.width&bk.width-1)===0&&(bk.height&bk.height-1)===0;
bi=al(bn.format);
bd=al(bn.type);
aI(a1.TEXTURE_CUBE_MAP,bn,bj);
for(bk=0;
bk<6;
bk++){a1.texImage2D(a1.TEXTURE_CUBE_MAP_POSITIVE_X+bk,0,bi,bi,bd,bl[bk])
}bn.generateMipmaps&&bj&&a1.generateMipmap(a1.TEXTURE_CUBE_MAP);
bn.needsUpdate=false;
if(bn.onUpdate){bn.onUpdate()
}}else{a1.activeTexture(a1.TEXTURE0+bl);
a1.bindTexture(a1.TEXTURE_CUBE_MAP,bn.image.__webglTextureCube)
}}}else{if(bk instanceof THREE.WebGLRenderTargetCube){bn=bk;
a1.activeTexture(a1.TEXTURE0+bl);
a1.bindTexture(a1.TEXTURE_CUBE_MAP,bn.__webglTexture)
}else{am.setTexture(bk,bl)
}}break;
case"tv":if(!bn._array){bn._array=[];
bj=0;
for(bi=bn.texture.length;
bj<bi;
bj++){bn._array[bj]=bl+bj
}}a1.uniform1iv(bk,bn._array);
bj=0;
for(bi=bn.texture.length;
bj<bi;
bj++){(bk=bn.texture[bj])&&am.setTexture(bk,bn._array[bj])
}}}}if((br instanceof THREE.ShaderMaterial||br instanceof THREE.MeshPhongMaterial||br.envMap)&&bo.cameraPosition!==null){bt=bu.matrixWorld.getPosition();
a1.uniform3f(bo.cameraPosition,bt.x,bt.y,bt.z)
}(br instanceof THREE.MeshPhongMaterial||br instanceof THREE.MeshLambertMaterial||br instanceof THREE.ShaderMaterial||br.skinning)&&bo.viewMatrix!==null&&a1.uniformMatrix4fv(bo.viewMatrix,false,bu._viewMatrixArray);
br.skinning&&a1.uniformMatrix4fv(bo.boneGlobalMatrices,false,bq.boneMatrices)
}a1.uniformMatrix4fv(bo.modelViewMatrix,false,bq._modelViewMatrix.elements);
bo.normalMatrix&&a1.uniformMatrix3fv(bo.normalMatrix,false,bq._normalMatrix.elements);
bo.objectMatrix!==null&&a1.uniformMatrix4fv(bo.objectMatrix,false,bq.matrixWorld.elements);
return bp
}function aP(d,c){d._modelViewMatrix.multiply(c.matrixWorldInverse,d.matrixWorld);
d._normalMatrix.getInverse(d._modelViewMatrix);
d._normalMatrix.transpose()
}function aM(e,d,f){if(ai!==e){e?a1.enable(a1.POLYGON_OFFSET_FILL):a1.disable(a1.POLYGON_OFFSET_FILL);
ai=e
}if(e&&(af!==d||a0!==f)){a1.polygonOffset(d,f);
af=d;
a0=f
}}function aN(e,d){var f;
e==="fragment"?f=a1.createShader(a1.FRAGMENT_SHADER):e==="vertex"&&(f=a1.createShader(a1.VERTEX_SHADER));
a1.shaderSource(f,d);
a1.compileShader(f);
if(!a1.getShaderParameter(f,a1.COMPILE_STATUS)){console.error(a1.getShaderInfoLog(f));
console.error(d);
return null
}return f
}function aI(e,d,f){if(f){a1.texParameteri(e,a1.TEXTURE_WRAP_S,al(d.wrapS));
a1.texParameteri(e,a1.TEXTURE_WRAP_T,al(d.wrapT));
a1.texParameteri(e,a1.TEXTURE_MAG_FILTER,al(d.magFilter));
a1.texParameteri(e,a1.TEXTURE_MIN_FILTER,al(d.minFilter))
}else{a1.texParameteri(e,a1.TEXTURE_WRAP_S,a1.CLAMP_TO_EDGE);
a1.texParameteri(e,a1.TEXTURE_WRAP_T,a1.CLAMP_TO_EDGE);
a1.texParameteri(e,a1.TEXTURE_MAG_FILTER,aJ(d.magFilter));
a1.texParameteri(e,a1.TEXTURE_MIN_FILTER,aJ(d.minFilter))
}}function aO(d,c){a1.bindRenderbuffer(a1.RENDERBUFFER,d);
if(c.depthBuffer&&!c.stencilBuffer){a1.renderbufferStorage(a1.RENDERBUFFER,a1.DEPTH_COMPONENT16,c.width,c.height);
a1.framebufferRenderbuffer(a1.FRAMEBUFFER,a1.DEPTH_ATTACHMENT,a1.RENDERBUFFER,d)
}else{if(c.depthBuffer&&c.stencilBuffer){a1.renderbufferStorage(a1.RENDERBUFFER,a1.DEPTH_STENCIL,c.width,c.height);
a1.framebufferRenderbuffer(a1.FRAMEBUFFER,a1.DEPTH_STENCIL_ATTACHMENT,a1.RENDERBUFFER,d)
}else{a1.renderbufferStorage(a1.RENDERBUFFER,a1.RGBA4,c.width,c.height)
}}}function aJ(b){switch(b){case THREE.NearestFilter:case THREE.NearestMipMapNearestFilter:case THREE.NearestMipMapLinearFilter:return a1.NEAREST;
default:return a1.LINEAR
}}function al(b){switch(b){case THREE.RepeatWrapping:return a1.REPEAT;
case THREE.ClampToEdgeWrapping:return a1.CLAMP_TO_EDGE;
case THREE.MirroredRepeatWrapping:return a1.MIRRORED_REPEAT;
case THREE.NearestFilter:return a1.NEAREST;
case THREE.NearestMipMapNearestFilter:return a1.NEAREST_MIPMAP_NEAREST;
case THREE.NearestMipMapLinearFilter:return a1.NEAREST_MIPMAP_LINEAR;
case THREE.LinearFilter:return a1.LINEAR;
case THREE.LinearMipMapNearestFilter:return a1.LINEAR_MIPMAP_NEAREST;
case THREE.LinearMipMapLinearFilter:return a1.LINEAR_MIPMAP_LINEAR;
case THREE.ByteType:return a1.BYTE;
case THREE.UnsignedByteType:return a1.UNSIGNED_BYTE;
case THREE.ShortType:return a1.SHORT;
case THREE.UnsignedShortType:return a1.UNSIGNED_SHORT;
case THREE.IntType:return a1.INT;
case THREE.UnsignedIntType:return a1.UNSIGNED_INT;
case THREE.FloatType:return a1.FLOAT;
case THREE.AlphaFormat:return a1.ALPHA;
case THREE.RGBFormat:return a1.RGB;
case THREE.RGBAFormat:return a1.RGBA;
case THREE.LuminanceFormat:return a1.LUMINANCE;
case THREE.LuminanceAlphaFormat:return a1.LUMINANCE_ALPHA;
case THREE.AddEquation:return a1.FUNC_ADD;
case THREE.SubtractEquation:return a1.FUNC_SUBTRACT;
case THREE.ReverseSubtractEquation:return a1.FUNC_REVERSE_SUBTRACT;
case THREE.ZeroFactor:return a1.ZERO;
case THREE.OneFactor:return a1.ONE;
case THREE.SrcColorFactor:return a1.SRC_COLOR;
case THREE.OneMinusSrcColorFactor:return a1.ONE_MINUS_SRC_COLOR;
case THREE.SrcAlphaFactor:return a1.SRC_ALPHA;
case THREE.OneMinusSrcAlphaFactor:return a1.ONE_MINUS_SRC_ALPHA;
case THREE.DstAlphaFactor:return a1.DST_ALPHA;
case THREE.OneMinusDstAlphaFactor:return a1.ONE_MINUS_DST_ALPHA;
case THREE.DstColorFactor:return a1.DST_COLOR;
case THREE.OneMinusDstColorFactor:return a1.ONE_MINUS_DST_COLOR;
case THREE.SrcAlphaSaturateFactor:return a1.SRC_ALPHA_SATURATE
}return 0
}console.log("THREE.WebGLRenderer",THREE.REVISION);
var a9=a9||{},ao=a9.canvas!==void 0?a9.canvas:document.createElement("canvas"),aG=a9.precision!==void 0?a9.precision:"highp",aL=a9.alpha!==void 0?a9.alpha:true,ar=a9.premultipliedAlpha!==void 0?a9.premultipliedAlpha:true,aj=a9.antialias!==void 0?a9.antialias:false,ah=a9.stencil!==void 0?a9.stencil:true,X=a9.preserveDrawingBuffer!==void 0?a9.preserveDrawingBuffer:false,ac=a9.clearColor!==void 0?new THREE.Color(a9.clearColor):new THREE.Color(0),ap=a9.clearAlpha!==void 0?a9.clearAlpha:0,ag=a9.maxLights!==void 0?a9.maxLights:4;
this.domElement=ao;
this.context=null;
this.autoUpdateScene=this.autoUpdateObjects=this.sortObjects=this.autoClearStencil=this.autoClearDepth=this.autoClearColor=this.autoClear=true;
this.shadowMapEnabled=this.physicallyBasedShading=this.gammaOutput=this.gammaInput=false;
this.shadowMapCullFrontFaces=this.shadowMapSoft=this.shadowMapAutoUpdate=true;
this.shadowMapCascade=this.shadowMapDebug=false;
this.maxMorphTargets=8;
this.maxMorphNormals=4;
this.autoScaleCubemaps=true;
this.renderPluginsPre=[];
this.renderPluginsPost=[];
this.info={memory:{programs:0,geometries:0,textures:0},render:{calls:0,vertices:0,faces:0,points:0}};
var am=this,a1,W=[],V=null,aq=null,N=-1,an=null,x=null,aD=0,aF=-1,ae=-1,ab=-1,L=-1,aC=-1,I=-1,aV=-1,ax=-1,ai=null,af=null,a0=null,ay=null,aw=0,aH=0,au=0,ad=0,B=0,S=0,aB=new THREE.Frustum,av=new THREE.Matrix4,aR=new THREE.Matrix4,ak=new THREE.Vector4,at=new THREE.Vector3,aA=true,az={ambient:[0,0,0],directional:{length:0,colors:[],positions:[]},point:{length:0,colors:[],positions:[],distances:[]},spot:{length:0,colors:[],positions:[],distances:[],directions:[],angles:[],exponents:[]}};
a1=function(){var d;
try{if(!(d=ao.getContext("experimental-webgl",{alpha:aL,premultipliedAlpha:ar,antialias:aj,stencil:ah,preserveDrawingBuffer:X}))){throw"Error creating WebGL context."
}}catch(c){console.error(c)
}d.getExtension("OES_texture_float")||console.log("THREE.WebGLRenderer: Float textures not supported.");
return d
}();
a1.clearColor(0,0,0,1);
a1.clearDepth(1);
a1.clearStencil(0);
a1.enable(a1.DEPTH_TEST);
a1.depthFunc(a1.LEQUAL);
a1.frontFace(a1.CCW);
a1.cullFace(a1.BACK);
a1.enable(a1.CULL_FACE);
a1.enable(a1.BLEND);
a1.blendEquation(a1.FUNC_ADD);
a1.blendFunc(a1.SRC_ALPHA,a1.ONE_MINUS_SRC_ALPHA);
a1.clearColor(ac.r,ac.g,ac.b,ap);
this.context=a1;
var aK=a1.getParameter(a1.MAX_VERTEX_TEXTURE_IMAGE_UNITS);
a1.getParameter(a1.MAX_TEXTURE_SIZE);
var aE=a1.getParameter(a1.MAX_CUBE_MAP_TEXTURE_SIZE);
this.getContext=function(){return a1
};
this.supportsVertexTextures=function(){return aK>0
};
this.setSize=function(d,c){ao.width=d;
ao.height=c;
this.setViewport(0,0,ao.width,ao.height)
};
this.setViewport=function(f,e,h,g){aw=f;
aH=e;
au=h;
ad=g;
a1.viewport(aw,aH,au,ad)
};
this.setScissor=function(f,e,h,g){a1.scissor(f,e,h,g)
};
this.enableScissorTest=function(b){b?a1.enable(a1.SCISSOR_TEST):a1.disable(a1.SCISSOR_TEST)
};
this.setClearColorHex=function(d,c){ac.setHex(d);
ap=c;
a1.clearColor(ac.r,ac.g,ac.b,ap)
};
this.setClearColor=function(d,c){ac.copy(d);
ap=c;
a1.clearColor(ac.r,ac.g,ac.b,ap)
};
this.getClearColor=function(){return ac
};
this.getClearAlpha=function(){return ap
};
this.clear=function(f,e,h){var g=0;
if(f===void 0||f){g=g|a1.COLOR_BUFFER_BIT
}if(e===void 0||e){g=g|a1.DEPTH_BUFFER_BIT
}if(h===void 0||h){g=g|a1.STENCIL_BUFFER_BIT
}a1.clear(g)
};
this.clearTarget=function(f,e,h,g){this.setRenderTarget(f);
this.clear(e,h,g)
};
this.addPostPlugin=function(b){b.init(this);
this.renderPluginsPost.push(b)
};
this.addPrePlugin=function(b){b.init(this);
this.renderPluginsPre.push(b)
};
this.deallocateObject=function(g){if(g.__webglInit){g.__webglInit=false;
delete g._modelViewMatrix;
delete g._normalMatrix;
delete g._normalMatrixArray;
delete g._modelViewMatrixArray;
delete g._objectMatrixArray;
if(g instanceof THREE.Mesh){for(var f in g.geometry.geometryGroups){var l=g.geometry.geometryGroups[f];
a1.deleteBuffer(l.__webglVertexBuffer);
a1.deleteBuffer(l.__webglNormalBuffer);
a1.deleteBuffer(l.__webglTangentBuffer);
a1.deleteBuffer(l.__webglColorBuffer);
a1.deleteBuffer(l.__webglUVBuffer);
a1.deleteBuffer(l.__webglUV2Buffer);
a1.deleteBuffer(l.__webglSkinVertexABuffer);
a1.deleteBuffer(l.__webglSkinVertexBBuffer);
a1.deleteBuffer(l.__webglSkinIndicesBuffer);
a1.deleteBuffer(l.__webglSkinWeightsBuffer);
a1.deleteBuffer(l.__webglFaceBuffer);
a1.deleteBuffer(l.__webglLineBuffer);
var k=void 0,h=void 0;
if(l.numMorphTargets){k=0;
for(h=l.numMorphTargets;
k<h;
k++){a1.deleteBuffer(l.__webglMorphTargetsBuffers[k])
}}if(l.numMorphNormals){k=0;
for(h=l.numMorphNormals;
k<h;
k++){a1.deleteBuffer(l.__webglMorphNormalsBuffers[k])
}}if(l.__webglCustomAttributesList){k=void 0;
for(k in l.__webglCustomAttributesList){a1.deleteBuffer(l.__webglCustomAttributesList[k].buffer)
}}am.info.memory.geometries--
}}else{if(g instanceof THREE.Ribbon){g=g.geometry;
a1.deleteBuffer(g.__webglVertexBuffer);
a1.deleteBuffer(g.__webglColorBuffer);
am.info.memory.geometries--
}else{if(g instanceof THREE.Line){g=g.geometry;
a1.deleteBuffer(g.__webglVertexBuffer);
a1.deleteBuffer(g.__webglColorBuffer);
am.info.memory.geometries--
}else{if(g instanceof THREE.ParticleSystem){g=g.geometry;
a1.deleteBuffer(g.__webglVertexBuffer);
a1.deleteBuffer(g.__webglColorBuffer);
am.info.memory.geometries--
}}}}}};
this.deallocateTexture=function(b){if(b.__webglInit){b.__webglInit=false;
a1.deleteTexture(b.__webglTexture);
am.info.memory.textures--
}};
this.deallocateRenderTarget=function(d){if(d&&d.__webglTexture){a1.deleteTexture(d.__webglTexture);
if(d instanceof THREE.WebGLRenderTargetCube){for(var c=0;
c<6;
c++){a1.deleteFramebuffer(d.__webglFramebuffer[c]);
a1.deleteRenderbuffer(d.__webglRenderbuffer[c])
}}else{a1.deleteFramebuffer(d.__webglFramebuffer);
a1.deleteRenderbuffer(d.__webglRenderbuffer)
}}};
this.updateShadowMap=function(d,c){V=null;
N=an=ax=aV=ab=-1;
aA=true;
ae=aF=-1;
this.shadowMapPlugin.update(d,c)
};
this.renderBufferImmediate=function(E,D,C){if(!E.__webglVertexBuffer){E.__webglVertexBuffer=a1.createBuffer()
}if(!E.__webglNormalBuffer){E.__webglNormalBuffer=a1.createBuffer()
}if(E.hasPos){a1.bindBuffer(a1.ARRAY_BUFFER,E.__webglVertexBuffer);
a1.bufferData(a1.ARRAY_BUFFER,E.positionArray,a1.DYNAMIC_DRAW);
a1.enableVertexAttribArray(D.attributes.position);
a1.vertexAttribPointer(D.attributes.position,3,a1.FLOAT,false,0,0)
}if(E.hasNormal){a1.bindBuffer(a1.ARRAY_BUFFER,E.__webglNormalBuffer);
if(C===THREE.FlatShading){var A,z,y,w,v,u,t,s,r,q,o=E.count*3;
for(q=0;
q<o;
q=q+9){C=E.normalArray;
A=C[q];
z=C[q+1];
y=C[q+2];
w=C[q+3];
u=C[q+4];
s=C[q+5];
v=C[q+6];
t=C[q+7];
r=C[q+8];
A=(A+w+v)/3;
z=(z+u+t)/3;
y=(y+s+r)/3;
C[q]=A;
C[q+1]=z;
C[q+2]=y;
C[q+3]=A;
C[q+4]=z;
C[q+5]=y;
C[q+6]=A;
C[q+7]=z;
C[q+8]=y
}}a1.bufferData(a1.ARRAY_BUFFER,E.normalArray,a1.DYNAMIC_DRAW);
a1.enableVertexAttribArray(D.attributes.normal);
a1.vertexAttribPointer(D.attributes.normal,3,a1.FLOAT,false,0,0)
}a1.drawArrays(a1.TRIANGLES,0,E.count);
E.count=0
};
this.renderBufferDirect=function(h,g,n,m,l,k){if(m.visible!==false){n=aU(h,g,n,m,k);
h=n.attributes;
g=false;
m=l.id*16777215+n.id*2+(m.wireframe?1:0);
if(m!==an){an=m;
g=true
}if(k instanceof THREE.Mesh){k=l.offsets;
m=0;
for(n=k.length;
m<n;
++m){if(g){a1.bindBuffer(a1.ARRAY_BUFFER,l.vertexPositionBuffer);
a1.vertexAttribPointer(h.position,l.vertexPositionBuffer.itemSize,a1.FLOAT,false,0,k[m].index*12);
if(h.normal>=0&&l.vertexNormalBuffer){a1.bindBuffer(a1.ARRAY_BUFFER,l.vertexNormalBuffer);
a1.vertexAttribPointer(h.normal,l.vertexNormalBuffer.itemSize,a1.FLOAT,false,0,k[m].index*12)
}if(h.uv>=0&&l.vertexUvBuffer){if(l.vertexUvBuffer){a1.bindBuffer(a1.ARRAY_BUFFER,l.vertexUvBuffer);
a1.vertexAttribPointer(h.uv,l.vertexUvBuffer.itemSize,a1.FLOAT,false,0,k[m].index*8);
a1.enableVertexAttribArray(h.uv)
}else{a1.disableVertexAttribArray(h.uv)
}}if(h.color>=0&&l.vertexColorBuffer){a1.bindBuffer(a1.ARRAY_BUFFER,l.vertexColorBuffer);
a1.vertexAttribPointer(h.color,l.vertexColorBuffer.itemSize,a1.FLOAT,false,0,k[m].index*16)
}a1.bindBuffer(a1.ELEMENT_ARRAY_BUFFER,l.vertexIndexBuffer)
}a1.drawElements(a1.TRIANGLES,k[m].count,a1.UNSIGNED_SHORT,k[m].start*2);
am.info.render.calls++;
am.info.render.vertices=am.info.render.vertices+k[m].count;
am.info.render.faces=am.info.render.faces+k[m].count/3
}}}};
this.renderBuffer=function(C,A,z,y,w,v){if(y.visible!==false){var u,t,z=aU(C,A,z,y,v),A=z.attributes,C=false,z=w.id*16777215+z.id*2+(y.wireframe?1:0);
if(z!==an){an=z;
C=true
}if(!y.morphTargets&&A.position>=0){if(C){a1.bindBuffer(a1.ARRAY_BUFFER,w.__webglVertexBuffer);
a1.vertexAttribPointer(A.position,3,a1.FLOAT,false,0,0)
}}else{if(v.morphTargetBase){z=y.program.attributes;
if(v.morphTargetBase!==-1){a1.bindBuffer(a1.ARRAY_BUFFER,w.__webglMorphTargetsBuffers[v.morphTargetBase]);
a1.vertexAttribPointer(z.position,3,a1.FLOAT,false,0,0)
}else{if(z.position>=0){a1.bindBuffer(a1.ARRAY_BUFFER,w.__webglVertexBuffer);
a1.vertexAttribPointer(z.position,3,a1.FLOAT,false,0,0)
}}if(v.morphTargetForcedOrder.length){u=0;
var s=v.morphTargetForcedOrder;
for(t=v.morphTargetInfluences;
u<y.numSupportedMorphTargets&&u<s.length;
){a1.bindBuffer(a1.ARRAY_BUFFER,w.__webglMorphTargetsBuffers[s[u]]);
a1.vertexAttribPointer(z["morphTarget"+u],3,a1.FLOAT,false,0,0);
if(y.morphNormals){a1.bindBuffer(a1.ARRAY_BUFFER,w.__webglMorphNormalsBuffers[s[u]]);
a1.vertexAttribPointer(z["morphNormal"+u],3,a1.FLOAT,false,0,0)
}v.__webglMorphTargetInfluences[u]=t[s[u]];
u++
}}else{var s=[],r=-1,q=0;
t=v.morphTargetInfluences;
var o,n=t.length;
u=0;
for(v.morphTargetBase!==-1&&(s[v.morphTargetBase]=true);
u<y.numSupportedMorphTargets;
){for(o=0;
o<n;
o++){if(!s[o]&&t[o]>r){q=o;
r=t[q]
}}a1.bindBuffer(a1.ARRAY_BUFFER,w.__webglMorphTargetsBuffers[q]);
a1.vertexAttribPointer(z["morphTarget"+u],3,a1.FLOAT,false,0,0);
if(y.morphNormals){a1.bindBuffer(a1.ARRAY_BUFFER,w.__webglMorphNormalsBuffers[q]);
a1.vertexAttribPointer(z["morphNormal"+u],3,a1.FLOAT,false,0,0)
}v.__webglMorphTargetInfluences[u]=r;
s[q]=1;
r=-1;
u++
}}y.program.uniforms.morphTargetInfluences!==null&&a1.uniform1fv(y.program.uniforms.morphTargetInfluences,v.__webglMorphTargetInfluences)
}}if(C){if(w.__webglCustomAttributesList){u=0;
for(t=w.__webglCustomAttributesList.length;
u<t;
u++){z=w.__webglCustomAttributesList[u];
if(A[z.buffer.belongsToAttribute]>=0){a1.bindBuffer(a1.ARRAY_BUFFER,z.buffer);
a1.vertexAttribPointer(A[z.buffer.belongsToAttribute],z.size,a1.FLOAT,false,0,0)
}}}if(A.color>=0){a1.bindBuffer(a1.ARRAY_BUFFER,w.__webglColorBuffer);
a1.vertexAttribPointer(A.color,3,a1.FLOAT,false,0,0)
}if(A.normal>=0){a1.bindBuffer(a1.ARRAY_BUFFER,w.__webglNormalBuffer);
a1.vertexAttribPointer(A.normal,3,a1.FLOAT,false,0,0)
}if(A.tangent>=0){a1.bindBuffer(a1.ARRAY_BUFFER,w.__webglTangentBuffer);
a1.vertexAttribPointer(A.tangent,4,a1.FLOAT,false,0,0)
}if(A.uv>=0){if(w.__webglUVBuffer){a1.bindBuffer(a1.ARRAY_BUFFER,w.__webglUVBuffer);
a1.vertexAttribPointer(A.uv,2,a1.FLOAT,false,0,0);
a1.enableVertexAttribArray(A.uv)
}else{a1.disableVertexAttribArray(A.uv)
}}if(A.uv2>=0){if(w.__webglUV2Buffer){a1.bindBuffer(a1.ARRAY_BUFFER,w.__webglUV2Buffer);
a1.vertexAttribPointer(A.uv2,2,a1.FLOAT,false,0,0);
a1.enableVertexAttribArray(A.uv2)
}else{a1.disableVertexAttribArray(A.uv2)
}}if(y.skinning&&A.skinVertexA>=0&&A.skinVertexB>=0&&A.skinIndex>=0&&A.skinWeight>=0){a1.bindBuffer(a1.ARRAY_BUFFER,w.__webglSkinVertexABuffer);
a1.vertexAttribPointer(A.skinVertexA,4,a1.FLOAT,false,0,0);
a1.bindBuffer(a1.ARRAY_BUFFER,w.__webglSkinVertexBBuffer);
a1.vertexAttribPointer(A.skinVertexB,4,a1.FLOAT,false,0,0);
a1.bindBuffer(a1.ARRAY_BUFFER,w.__webglSkinIndicesBuffer);
a1.vertexAttribPointer(A.skinIndex,4,a1.FLOAT,false,0,0);
a1.bindBuffer(a1.ARRAY_BUFFER,w.__webglSkinWeightsBuffer);
a1.vertexAttribPointer(A.skinWeight,4,a1.FLOAT,false,0,0)
}}if(v instanceof THREE.Mesh){if(y.wireframe){y=y.wireframeLinewidth;
if(y!==ay){a1.lineWidth(y);
ay=y
}C&&a1.bindBuffer(a1.ELEMENT_ARRAY_BUFFER,w.__webglLineBuffer);
a1.drawElements(a1.LINES,w.__webglLineCount,a1.UNSIGNED_SHORT,0)
}else{C&&a1.bindBuffer(a1.ELEMENT_ARRAY_BUFFER,w.__webglFaceBuffer);
a1.drawElements(a1.TRIANGLES,w.__webglFaceCount,a1.UNSIGNED_SHORT,0)
}am.info.render.calls++;
am.info.render.vertices=am.info.render.vertices+w.__webglFaceCount;
am.info.render.faces=am.info.render.faces+w.__webglFaceCount/3
}else{if(v instanceof THREE.Line){v=v.type===THREE.LineStrip?a1.LINE_STRIP:a1.LINES;
y=y.linewidth;
if(y!==ay){a1.lineWidth(y);
ay=y
}a1.drawArrays(v,0,w.__webglLineCount);
am.info.render.calls++
}else{if(v instanceof THREE.ParticleSystem){a1.drawArrays(a1.POINTS,0,w.__webglParticleCount);
am.info.render.calls++;
am.info.render.points=am.info.render.points+w.__webglParticleCount
}else{if(v instanceof THREE.Ribbon){a1.drawArrays(a1.TRIANGLE_STRIP,0,w.__webglVertexCount);
am.info.render.calls++
}}}}}};
this.render=function(D,C,A,z){var y,w,v,u,r=D.__lights,h=D.fog;
N=-1;
aA=true;
if(C.parent===void 0){console.warn("DEPRECATED: Camera hasn't been added to a Scene. Adding it...");
D.add(C)
}this.autoUpdateScene&&D.updateMatrixWorld();
if(!C._viewMatrixArray){C._viewMatrixArray=new Float32Array(16)
}if(!C._projectionMatrixArray){C._projectionMatrixArray=new Float32Array(16)
}C.matrixWorldInverse.getInverse(C.matrixWorld);
C.matrixWorldInverse.flattenToArray(C._viewMatrixArray);
C.projectionMatrix.flattenToArray(C._projectionMatrixArray);
av.multiply(C.projectionMatrix,C.matrixWorldInverse);
aB.setFromMatrix(av);
this.autoUpdateObjects&&this.initWebGLObjects(D);
a2(this.renderPluginsPre,D,C);
am.info.render.calls=0;
am.info.render.vertices=0;
am.info.render.faces=0;
am.info.render.points=0;
this.setRenderTarget(A);
(this.autoClear||z)&&this.clear(this.autoClearColor,this.autoClearDepth,this.autoClearStencil);
u=D.__webglObjects;
z=0;
for(y=u.length;
z<y;
z++){w=u[z];
v=w.object;
w.render=false;
if(v.visible&&(!(v instanceof THREE.Mesh||v instanceof THREE.ParticleSystem)||!v.frustumCulled||aB.contains(v))){aP(v,C);
var l=w,g=l.object,F=l.buffer,E=void 0,E=E=void 0,E=g.material;
if(E instanceof THREE.MeshFaceMaterial){E=F.materialIndex;
if(E>=0){E=g.geometry.materials[E];
if(E.transparent){l.transparent=E;
l.opaque=null
}else{l.opaque=E;
l.transparent=null
}}}else{if(E){if(E.transparent){l.transparent=E;
l.opaque=null
}else{l.opaque=E;
l.transparent=null
}}}w.render=true;
if(this.sortObjects){if(v.renderDepth){w.z=v.renderDepth
}else{ak.copy(v.matrixWorld.getPosition());
av.multiplyVector3(ak);
w.z=ak.z
}}}}this.sortObjects&&u.sort(a3);
u=D.__webglObjectsImmediate;
z=0;
for(y=u.length;
z<y;
z++){w=u[z];
v=w.object;
if(v.visible){aP(v,C);
v=w.object.material;
if(v.transparent){w.transparent=v;
w.opaque=null
}else{w.opaque=v;
w.transparent=null
}}}if(D.overrideMaterial){z=D.overrideMaterial;
this.setBlending(z.blending,z.blendEquation,z.blendSrc,z.blendDst);
this.setDepthTest(z.depthTest);
this.setDepthWrite(z.depthWrite);
aM(z.polygonOffset,z.polygonOffsetFactor,z.polygonOffsetUnits);
aZ(D.__webglObjects,false,"",C,r,h,true,z);
aX(D.__webglObjectsImmediate,"",C,r,h,false,z)
}else{this.setBlending(THREE.NormalBlending);
aZ(D.__webglObjects,true,"opaque",C,r,h,false);
aX(D.__webglObjectsImmediate,"opaque",C,r,h,false);
aZ(D.__webglObjects,false,"transparent",C,r,h,true);
aX(D.__webglObjectsImmediate,"transparent",C,r,h,true)
}a2(this.renderPluginsPost,D,C);
if(A&&A.generateMipmaps&&A.minFilter!==THREE.NearestFilter&&A.minFilter!==THREE.LinearFilter){if(A instanceof THREE.WebGLRenderTargetCube){a1.bindTexture(a1.TEXTURE_CUBE_MAP,A.__webglTexture);
a1.generateMipmap(a1.TEXTURE_CUBE_MAP);
a1.bindTexture(a1.TEXTURE_CUBE_MAP,null)
}else{a1.bindTexture(a1.TEXTURE_2D,A.__webglTexture);
a1.generateMipmap(a1.TEXTURE_2D);
a1.bindTexture(a1.TEXTURE_2D,null)
}}this.setDepthTest(true);
this.setDepthWrite(true)
};
this.renderImmediateObject=function(h,g,n,m,l){var k=aU(h,g,n,m,l);
an=-1;
am.setObjectFaces(l);
l.immediateRenderCallback?l.immediateRenderCallback(k,a1,aB):l.render(function(b){am.renderBufferImmediate(b,k,m.shading)
})
};
this.initWebGLObjects=function(dj){if(!dj.__webglObjects){dj.__webglObjects=[];
dj.__webglObjectsImmediate=[];
dj.__webglSprites=[];
dj.__webglFlares=[]
}for(;
dj.__objectsAdded.length;
){var dg=dj.__objectsAdded[0],df=dj,c8=void 0,c7=void 0,c6=void 0;
if(!dg.__webglInit){dg.__webglInit=true;
dg._modelViewMatrix=new THREE.Matrix4;
dg._normalMatrix=new THREE.Matrix3;
if(dg instanceof THREE.Mesh){c7=dg.geometry;
if(c7 instanceof THREE.Geometry){if(c7.geometryGroups===void 0){var c3=c7,c2=void 0,c0=void 0,cZ=void 0,cY=void 0,cX=void 0,cU=void 0,cV=void 0,dY={},dU=c3.morphTargets.length,dT=c3.morphNormals.length;
c3.geometryGroups={};
c2=0;
for(c0=c3.faces.length;
c2<c0;
c2++){cZ=c3.faces[c2];
cY=cZ.materialIndex;
cU=cY!==void 0?cY:-1;
dY[cU]===void 0&&(dY[cU]={hash:cU,counter:0});
cV=dY[cU].hash+"_"+dY[cU].counter;
c3.geometryGroups[cV]===void 0&&(c3.geometryGroups[cV]={faces3:[],faces4:[],materialIndex:cY,vertices:0,numMorphTargets:dU,numMorphNormals:dT});
cX=cZ instanceof THREE.Face3?3:4;
if(c3.geometryGroups[cV].vertices+cX>65535){dY[cU].counter=dY[cU].counter+1;
cV=dY[cU].hash+"_"+dY[cU].counter;
c3.geometryGroups[cV]===void 0&&(c3.geometryGroups[cV]={faces3:[],faces4:[],materialIndex:cY,vertices:0,numMorphTargets:dU,numMorphNormals:dT})
}cZ instanceof THREE.Face3?c3.geometryGroups[cV].faces3.push(c2):c3.geometryGroups[cV].faces4.push(c2);
c3.geometryGroups[cV].vertices=c3.geometryGroups[cV].vertices+cX
}c3.geometryGroupsList=[];
var dS=void 0;
for(dS in c3.geometryGroups){c3.geometryGroups[dS].id=aD++;
c3.geometryGroupsList.push(c3.geometryGroups[dS])
}}for(c8 in c7.geometryGroups){c6=c7.geometryGroups[c8];
if(!c6.__webglVertexBuffer){var dR=c6;
dR.__webglVertexBuffer=a1.createBuffer();
dR.__webglNormalBuffer=a1.createBuffer();
dR.__webglTangentBuffer=a1.createBuffer();
dR.__webglColorBuffer=a1.createBuffer();
dR.__webglUVBuffer=a1.createBuffer();
dR.__webglUV2Buffer=a1.createBuffer();
dR.__webglSkinVertexABuffer=a1.createBuffer();
dR.__webglSkinVertexBBuffer=a1.createBuffer();
dR.__webglSkinIndicesBuffer=a1.createBuffer();
dR.__webglSkinWeightsBuffer=a1.createBuffer();
dR.__webglFaceBuffer=a1.createBuffer();
dR.__webglLineBuffer=a1.createBuffer();
var dO=void 0,dK=void 0;
if(dR.numMorphTargets){dR.__webglMorphTargetsBuffers=[];
dO=0;
for(dK=dR.numMorphTargets;
dO<dK;
dO++){dR.__webglMorphTargetsBuffers.push(a1.createBuffer())
}}if(dR.numMorphNormals){dR.__webglMorphNormalsBuffers=[];
dO=0;
for(dK=dR.numMorphNormals;
dO<dK;
dO++){dR.__webglMorphNormalsBuffers.push(a1.createBuffer())
}}am.info.memory.geometries++;
var dE=c6,dL=dg,dG=dL.geometry,dI=dE.faces3,ei=dE.faces4,dF=dI.length*3+ei.length*4,ds=dI.length*1+ei.length*2,dt=dI.length*3+ei.length*4,dD=a7(dL,dE),dz=a5(dD),cz=a6(dD),bF=dD.vertexColors?dD.vertexColors:false;
dE.__vertexArray=new Float32Array(dF*3);
if(cz){dE.__normalArray=new Float32Array(dF*3)
}if(dG.hasTangents){dE.__tangentArray=new Float32Array(dF*4)
}if(bF){dE.__colorArray=new Float32Array(dF*3)
}if(dz){if(dG.faceUvs.length>0||dG.faceVertexUvs.length>0){dE.__uvArray=new Float32Array(dF*2)
}if(dG.faceUvs.length>1||dG.faceVertexUvs.length>1){dE.__uv2Array=new Float32Array(dF*2)
}}if(dL.geometry.skinWeights.length&&dL.geometry.skinIndices.length){dE.__skinVertexAArray=new Float32Array(dF*4);
dE.__skinVertexBArray=new Float32Array(dF*4);
dE.__skinIndexArray=new Float32Array(dF*4);
dE.__skinWeightArray=new Float32Array(dF*4)
}dE.__faceArray=new Uint16Array(ds*3);
dE.__lineArray=new Uint16Array(dt*2);
var dx=void 0,bR=void 0;
if(dE.numMorphTargets){dE.__morphTargetsArrays=[];
dx=0;
for(bR=dE.numMorphTargets;
dx<bR;
dx++){dE.__morphTargetsArrays.push(new Float32Array(dF*3))
}}if(dE.numMorphNormals){dE.__morphNormalsArrays=[];
dx=0;
for(bR=dE.numMorphNormals;
dx<bR;
dx++){dE.__morphNormalsArrays.push(new Float32Array(dF*3))
}}dE.__webglFaceCount=ds*3;
dE.__webglLineCount=dt*2;
if(dD.attributes){if(dE.__webglCustomAttributesList===void 0){dE.__webglCustomAttributesList=[]
}var bk=void 0;
for(bk in dD.attributes){var cq=dD.attributes[bk],eh={},cR;
for(cR in cq){eh[cR]=cq[cR]
}if(!eh.__webglInitialized||eh.createUniqueBuffers){eh.__webglInitialized=true;
var cD=1;
eh.type==="v2"?cD=2:eh.type==="v3"?cD=3:eh.type==="v4"?cD=4:eh.type==="c"&&(cD=3);
eh.size=cD;
eh.array=new Float32Array(dF*cD);
eh.buffer=a1.createBuffer();
eh.buffer.belongsToAttribute=bk;
cq.needsUpdate=true;
eh.__original=cq
}dE.__webglCustomAttributesList.push(eh)
}}dE.__inittedArrays=true;
c7.verticesNeedUpdate=true;
c7.morphTargetsNeedUpdate=true;
c7.elementsNeedUpdate=true;
c7.uvsNeedUpdate=true;
c7.normalsNeedUpdate=true;
c7.tangetsNeedUpdate=true;
c7.colorsNeedUpdate=true
}}}}else{if(dg instanceof THREE.Ribbon){c7=dg.geometry;
if(!c7.__webglVertexBuffer){var k=c7;
k.__webglVertexBuffer=a1.createBuffer();
k.__webglColorBuffer=a1.createBuffer();
am.info.memory.geometries++;
var dr=c7,o=dr.vertices.length;
dr.__vertexArray=new Float32Array(o*3);
dr.__colorArray=new Float32Array(o*3);
dr.__webglVertexCount=o;
c7.verticesNeedUpdate=true;
c7.colorsNeedUpdate=true
}}else{if(dg instanceof THREE.Line){c7=dg.geometry;
if(!c7.__webglVertexBuffer){var b1=c7;
b1.__webglVertexBuffer=a1.createBuffer();
b1.__webglColorBuffer=a1.createBuffer();
am.info.memory.geometries++;
var b6=c7,et=dg,c5=b6.vertices.length;
b6.__vertexArray=new Float32Array(c5*3);
b6.__colorArray=new Float32Array(c5*3);
b6.__webglLineCount=c5;
a8(b6,et);
c7.verticesNeedUpdate=true;
c7.colorsNeedUpdate=true
}}else{if(dg instanceof THREE.ParticleSystem){c7=dg.geometry;
if(!c7.__webglVertexBuffer){var d0=c7;
d0.__webglVertexBuffer=a1.createBuffer();
d0.__webglColorBuffer=a1.createBuffer();
am.info.geometries++;
var bx=c7,cP=dg,b=bx.vertices.length;
bx.__vertexArray=new Float32Array(b*3);
bx.__colorArray=new Float32Array(b*3);
bx.__sortArray=[];
bx.__webglParticleCount=b;
a8(bx,cP);
c7.verticesNeedUpdate=true;
c7.colorsNeedUpdate=true
}}}}}}if(!dg.__webglActive){if(dg instanceof THREE.Mesh){c7=dg.geometry;
if(c7 instanceof THREE.BufferGeometry){aY(df.__webglObjects,c7,dg)
}else{for(c8 in c7.geometryGroups){c6=c7.geometryGroups[c8];
aY(df.__webglObjects,c6,dg)
}}}else{if(dg instanceof THREE.Ribbon||dg instanceof THREE.Line||dg instanceof THREE.ParticleSystem){c7=dg.geometry;
aY(df.__webglObjects,c7,dg)
}else{dg instanceof THREE.ImmediateRenderObject||dg.immediateRenderCallback?df.__webglObjectsImmediate.push({object:dg,opaque:null,transparent:null}):dg instanceof THREE.Sprite?df.__webglSprites.push(dg):dg instanceof THREE.LensFlare&&df.__webglFlares.push(dg)
}}dg.__webglActive=true
}dj.__objectsAdded.splice(0,1)
}for(;
dj.__objectsRemoved.length;
){var dP=dj.__objectsRemoved[0],b2=dj;
dP instanceof THREE.Mesh||dP instanceof THREE.ParticleSystem||dP instanceof THREE.Ribbon||dP instanceof THREE.Line?aT(b2.__webglObjects,dP):dP instanceof THREE.Sprite?aQ(b2.__webglSprites,dP):dP instanceof THREE.LensFlare?aQ(b2.__webglFlares,dP):(dP instanceof THREE.ImmediateRenderObject||dP.immediateRenderCallback)&&aT(b2.__webglObjectsImmediate,dP);
dP.__webglActive=false;
dj.__objectsRemoved.splice(0,1)
}for(var bE=0,cC=dj.__webglObjects.length;
bE<cC;
bE++){var bs=dj.__webglObjects[bE].object,b3=bs.geometry,bQ=void 0,bD=void 0,ee=void 0;
if(bs instanceof THREE.Mesh){if(b3 instanceof THREE.BufferGeometry){b3.verticesNeedUpdate=false;
b3.elementsNeedUpdate=false;
b3.uvsNeedUpdate=false;
b3.normalsNeedUpdate=false;
b3.colorsNeedUpdate=false
}else{for(var bO=0,d2=b3.geometryGroupsList.length;
bO<d2;
bO++){bQ=b3.geometryGroupsList[bO];
ee=a7(bs,bQ);
bD=ee.attributes&&aS(ee);
if(b3.verticesNeedUpdate||b3.morphTargetsNeedUpdate||b3.elementsNeedUpdate||b3.uvsNeedUpdate||b3.normalsNeedUpdate||b3.colorsNeedUpdate||b3.tangetsNeedUpdate||bD){var di=bQ,dm=bs,cJ=a1.DYNAMIC_DRAW,cQ=!b3.dynamic,dN=ee;
if(di.__inittedArrays){var c9=a6(dN),ep=dN.vertexColors?dN.vertexColors:false,cK=a5(dN),bo=c9===THREE.SmoothShading,dM=void 0,dA=void 0,cn=void 0,dH=void 0,br=void 0,bU=void 0,bf=void 0,p=void 0,G=void 0,be=void 0,eA=void 0,dw=void 0,dv=void 0,du=void 0,eo=void 0,en=void 0,d5=void 0,dq=void 0,cE=void 0,cS=void 0,cF=void 0,cs=void 0,cr=void 0,b8=void 0,bX=void 0,bL=void 0,b7=void 0,bz=void 0,bm=void 0,m=void 0,bW=void 0,eu=void 0,ef=void 0,cj=void 0,bK=void 0,bI=void 0,bw=void 0,bj=void 0,ew=void 0,e=void 0,er=void 0,d9=void 0,ej=void 0,bt=void 0,cx=void 0,dB=void 0,em=void 0,d4=void 0,bq=void 0,ck=void 0,bP=void 0,bC=void 0,c4=void 0,ey=void 0,bn=0,cm=0,el=0,d1=0,dh=0,dp=0,d6=0,bV=0,ev=0,dJ=0,dQ=0,dW=0,cw=void 0,bd=di.__vertexArray,by=di.__uvArray,bl=di.__uv2Array,cM=di.__normalArray,cG=di.__tangentArray,ez=di.__colorArray,ct=di.__skinVertexAArray,b9=di.__skinVertexBArray,bY=di.__skinIndexArray,bM=di.__skinWeightArray,d7=di.__morphTargetsArrays,dy=di.__morphNormalsArrays,c1=di.__webglCustomAttributesList,cW=void 0,b0=di.__faceArray,cg=di.__lineArray,bJ=dm.geometry,cB=bJ.elementsNeedUpdate,bZ=bJ.uvsNeedUpdate,cp=bJ.normalsNeedUpdate,b5=bJ.tangetsNeedUpdate,bT=bJ.colorsNeedUpdate,bH=bJ.morphTargetsNeedUpdate,de=bJ.vertices,bg=di.faces3,c=di.faces4,eg=bJ.faces,cH=bJ.faceVertexUvs[0],cu=bJ.faceVertexUvs[1],cL=bJ.skinVerticesA,cy=bJ.skinVerticesB,cl=bJ.skinIndices,cI=bJ.skinWeights,cv=bJ.morphTargets,dZ=bJ.morphNormals;
if(bJ.verticesNeedUpdate){dM=0;
for(dA=bg.length;
dM<dA;
dM++){dH=eg[bg[dM]];
dw=de[dH.a];
dv=de[dH.b];
du=de[dH.c];
bd[cm]=dw.x;
bd[cm+1]=dw.y;
bd[cm+2]=dw.z;
bd[cm+3]=dv.x;
bd[cm+4]=dv.y;
bd[cm+5]=dv.z;
bd[cm+6]=du.x;
bd[cm+7]=du.y;
bd[cm+8]=du.z;
cm=cm+9
}dM=0;
for(dA=c.length;
dM<dA;
dM++){dH=eg[c[dM]];
dw=de[dH.a];
dv=de[dH.b];
du=de[dH.c];
eo=de[dH.d];
bd[cm]=dw.x;
bd[cm+1]=dw.y;
bd[cm+2]=dw.z;
bd[cm+3]=dv.x;
bd[cm+4]=dv.y;
bd[cm+5]=dv.z;
bd[cm+6]=du.x;
bd[cm+7]=du.y;
bd[cm+8]=du.z;
bd[cm+9]=eo.x;
bd[cm+10]=eo.y;
bd[cm+11]=eo.z;
cm=cm+12
}a1.bindBuffer(a1.ARRAY_BUFFER,di.__webglVertexBuffer);
a1.bufferData(a1.ARRAY_BUFFER,bd,cJ)
}if(bH){bq=0;
for(ck=cv.length;
bq<ck;
bq++){dM=dQ=0;
for(dA=bg.length;
dM<dA;
dM++){c4=bg[dM];
dH=eg[c4];
dw=cv[bq].vertices[dH.a];
dv=cv[bq].vertices[dH.b];
du=cv[bq].vertices[dH.c];
bP=d7[bq];
bP[dQ]=dw.x;
bP[dQ+1]=dw.y;
bP[dQ+2]=dw.z;
bP[dQ+3]=dv.x;
bP[dQ+4]=dv.y;
bP[dQ+5]=dv.z;
bP[dQ+6]=du.x;
bP[dQ+7]=du.y;
bP[dQ+8]=du.z;
if(dN.morphNormals){if(bo){ey=dZ[bq].vertexNormals[c4];
cS=ey.a;
cF=ey.b;
cs=ey.c
}else{cs=cF=cS=dZ[bq].faceNormals[c4]
}bC=dy[bq];
bC[dQ]=cS.x;
bC[dQ+1]=cS.y;
bC[dQ+2]=cS.z;
bC[dQ+3]=cF.x;
bC[dQ+4]=cF.y;
bC[dQ+5]=cF.z;
bC[dQ+6]=cs.x;
bC[dQ+7]=cs.y;
bC[dQ+8]=cs.z
}dQ=dQ+9
}dM=0;
for(dA=c.length;
dM<dA;
dM++){c4=c[dM];
dH=eg[c4];
dw=cv[bq].vertices[dH.a];
dv=cv[bq].vertices[dH.b];
du=cv[bq].vertices[dH.c];
eo=cv[bq].vertices[dH.d];
bP=d7[bq];
bP[dQ]=dw.x;
bP[dQ+1]=dw.y;
bP[dQ+2]=dw.z;
bP[dQ+3]=dv.x;
bP[dQ+4]=dv.y;
bP[dQ+5]=dv.z;
bP[dQ+6]=du.x;
bP[dQ+7]=du.y;
bP[dQ+8]=du.z;
bP[dQ+9]=eo.x;
bP[dQ+10]=eo.y;
bP[dQ+11]=eo.z;
if(dN.morphNormals){if(bo){ey=dZ[bq].vertexNormals[c4];
cS=ey.a;
cF=ey.b;
cs=ey.c;
cr=ey.d
}else{cr=cs=cF=cS=dZ[bq].faceNormals[c4]
}bC=dy[bq];
bC[dQ]=cS.x;
bC[dQ+1]=cS.y;
bC[dQ+2]=cS.z;
bC[dQ+3]=cF.x;
bC[dQ+4]=cF.y;
bC[dQ+5]=cF.z;
bC[dQ+6]=cs.x;
bC[dQ+7]=cs.y;
bC[dQ+8]=cs.z;
bC[dQ+9]=cr.x;
bC[dQ+10]=cr.y;
bC[dQ+11]=cr.z
}dQ=dQ+12
}a1.bindBuffer(a1.ARRAY_BUFFER,di.__webglMorphTargetsBuffers[bq]);
a1.bufferData(a1.ARRAY_BUFFER,d7[bq],cJ);
if(dN.morphNormals){a1.bindBuffer(a1.ARRAY_BUFFER,di.__webglMorphNormalsBuffers[bq]);
a1.bufferData(a1.ARRAY_BUFFER,dy[bq],cJ)
}}}if(cI.length){dM=0;
for(dA=bg.length;
dM<dA;
dM++){dH=eg[bg[dM]];
bz=cI[dH.a];
bm=cI[dH.b];
m=cI[dH.c];
bM[dJ]=bz.x;
bM[dJ+1]=bz.y;
bM[dJ+2]=bz.z;
bM[dJ+3]=bz.w;
bM[dJ+4]=bm.x;
bM[dJ+5]=bm.y;
bM[dJ+6]=bm.z;
bM[dJ+7]=bm.w;
bM[dJ+8]=m.x;
bM[dJ+9]=m.y;
bM[dJ+10]=m.z;
bM[dJ+11]=m.w;
eu=cl[dH.a];
ef=cl[dH.b];
cj=cl[dH.c];
bY[dJ]=eu.x;
bY[dJ+1]=eu.y;
bY[dJ+2]=eu.z;
bY[dJ+3]=eu.w;
bY[dJ+4]=ef.x;
bY[dJ+5]=ef.y;
bY[dJ+6]=ef.z;
bY[dJ+7]=ef.w;
bY[dJ+8]=cj.x;
bY[dJ+9]=cj.y;
bY[dJ+10]=cj.z;
bY[dJ+11]=cj.w;
bI=cL[dH.a];
bw=cL[dH.b];
bj=cL[dH.c];
ct[dJ]=bI.x;
ct[dJ+1]=bI.y;
ct[dJ+2]=bI.z;
ct[dJ+3]=1;
ct[dJ+4]=bw.x;
ct[dJ+5]=bw.y;
ct[dJ+6]=bw.z;
ct[dJ+7]=1;
ct[dJ+8]=bj.x;
ct[dJ+9]=bj.y;
ct[dJ+10]=bj.z;
ct[dJ+11]=1;
e=cy[dH.a];
er=cy[dH.b];
d9=cy[dH.c];
b9[dJ]=e.x;
b9[dJ+1]=e.y;
b9[dJ+2]=e.z;
b9[dJ+3]=1;
b9[dJ+4]=er.x;
b9[dJ+5]=er.y;
b9[dJ+6]=er.z;
b9[dJ+7]=1;
b9[dJ+8]=d9.x;
b9[dJ+9]=d9.y;
b9[dJ+10]=d9.z;
b9[dJ+11]=1;
dJ=dJ+12
}dM=0;
for(dA=c.length;
dM<dA;
dM++){dH=eg[c[dM]];
bz=cI[dH.a];
bm=cI[dH.b];
m=cI[dH.c];
bW=cI[dH.d];
bM[dJ]=bz.x;
bM[dJ+1]=bz.y;
bM[dJ+2]=bz.z;
bM[dJ+3]=bz.w;
bM[dJ+4]=bm.x;
bM[dJ+5]=bm.y;
bM[dJ+6]=bm.z;
bM[dJ+7]=bm.w;
bM[dJ+8]=m.x;
bM[dJ+9]=m.y;
bM[dJ+10]=m.z;
bM[dJ+11]=m.w;
bM[dJ+12]=bW.x;
bM[dJ+13]=bW.y;
bM[dJ+14]=bW.z;
bM[dJ+15]=bW.w;
eu=cl[dH.a];
ef=cl[dH.b];
cj=cl[dH.c];
bK=cl[dH.d];
bY[dJ]=eu.x;
bY[dJ+1]=eu.y;
bY[dJ+2]=eu.z;
bY[dJ+3]=eu.w;
bY[dJ+4]=ef.x;
bY[dJ+5]=ef.y;
bY[dJ+6]=ef.z;
bY[dJ+7]=ef.w;
bY[dJ+8]=cj.x;
bY[dJ+9]=cj.y;
bY[dJ+10]=cj.z;
bY[dJ+11]=cj.w;
bY[dJ+12]=bK.x;
bY[dJ+13]=bK.y;
bY[dJ+14]=bK.z;
bY[dJ+15]=bK.w;
bI=cL[dH.a];
bw=cL[dH.b];
bj=cL[dH.c];
ew=cL[dH.d];
ct[dJ]=bI.x;
ct[dJ+1]=bI.y;
ct[dJ+2]=bI.z;
ct[dJ+3]=1;
ct[dJ+4]=bw.x;
ct[dJ+5]=bw.y;
ct[dJ+6]=bw.z;
ct[dJ+7]=1;
ct[dJ+8]=bj.x;
ct[dJ+9]=bj.y;
ct[dJ+10]=bj.z;
ct[dJ+11]=1;
ct[dJ+12]=ew.x;
ct[dJ+13]=ew.y;
ct[dJ+14]=ew.z;
ct[dJ+15]=1;
e=cy[dH.a];
er=cy[dH.b];
d9=cy[dH.c];
ej=cy[dH.d];
b9[dJ]=e.x;
b9[dJ+1]=e.y;
b9[dJ+2]=e.z;
b9[dJ+3]=1;
b9[dJ+4]=er.x;
b9[dJ+5]=er.y;
b9[dJ+6]=er.z;
b9[dJ+7]=1;
b9[dJ+8]=d9.x;
b9[dJ+9]=d9.y;
b9[dJ+10]=d9.z;
b9[dJ+11]=1;
b9[dJ+12]=ej.x;
b9[dJ+13]=ej.y;
b9[dJ+14]=ej.z;
b9[dJ+15]=1;
dJ=dJ+16
}if(dJ>0){a1.bindBuffer(a1.ARRAY_BUFFER,di.__webglSkinVertexABuffer);
a1.bufferData(a1.ARRAY_BUFFER,ct,cJ);
a1.bindBuffer(a1.ARRAY_BUFFER,di.__webglSkinVertexBBuffer);
a1.bufferData(a1.ARRAY_BUFFER,b9,cJ);
a1.bindBuffer(a1.ARRAY_BUFFER,di.__webglSkinIndicesBuffer);
a1.bufferData(a1.ARRAY_BUFFER,bY,cJ);
a1.bindBuffer(a1.ARRAY_BUFFER,di.__webglSkinWeightsBuffer);
a1.bufferData(a1.ARRAY_BUFFER,bM,cJ)
}}if(bT&&ep){dM=0;
for(dA=bg.length;
dM<dA;
dM++){dH=eg[bg[dM]];
bf=dH.vertexColors;
p=dH.color;
if(bf.length===3&&ep===THREE.VertexColors){b8=bf[0];
bX=bf[1];
bL=bf[2]
}else{bL=bX=b8=p
}ez[ev]=b8.r;
ez[ev+1]=b8.g;
ez[ev+2]=b8.b;
ez[ev+3]=bX.r;
ez[ev+4]=bX.g;
ez[ev+5]=bX.b;
ez[ev+6]=bL.r;
ez[ev+7]=bL.g;
ez[ev+8]=bL.b;
ev=ev+9
}dM=0;
for(dA=c.length;
dM<dA;
dM++){dH=eg[c[dM]];
bf=dH.vertexColors;
p=dH.color;
if(bf.length===4&&ep===THREE.VertexColors){b8=bf[0];
bX=bf[1];
bL=bf[2];
b7=bf[3]
}else{b7=bL=bX=b8=p
}ez[ev]=b8.r;
ez[ev+1]=b8.g;
ez[ev+2]=b8.b;
ez[ev+3]=bX.r;
ez[ev+4]=bX.g;
ez[ev+5]=bX.b;
ez[ev+6]=bL.r;
ez[ev+7]=bL.g;
ez[ev+8]=bL.b;
ez[ev+9]=b7.r;
ez[ev+10]=b7.g;
ez[ev+11]=b7.b;
ev=ev+12
}if(ev>0){a1.bindBuffer(a1.ARRAY_BUFFER,di.__webglColorBuffer);
a1.bufferData(a1.ARRAY_BUFFER,ez,cJ)
}}if(b5&&bJ.hasTangents){dM=0;
for(dA=bg.length;
dM<dA;
dM++){dH=eg[bg[dM]];
G=dH.vertexTangents;
en=G[0];
d5=G[1];
dq=G[2];
cG[d6]=en.x;
cG[d6+1]=en.y;
cG[d6+2]=en.z;
cG[d6+3]=en.w;
cG[d6+4]=d5.x;
cG[d6+5]=d5.y;
cG[d6+6]=d5.z;
cG[d6+7]=d5.w;
cG[d6+8]=dq.x;
cG[d6+9]=dq.y;
cG[d6+10]=dq.z;
cG[d6+11]=dq.w;
d6=d6+12
}dM=0;
for(dA=c.length;
dM<dA;
dM++){dH=eg[c[dM]];
G=dH.vertexTangents;
en=G[0];
d5=G[1];
dq=G[2];
cE=G[3];
cG[d6]=en.x;
cG[d6+1]=en.y;
cG[d6+2]=en.z;
cG[d6+3]=en.w;
cG[d6+4]=d5.x;
cG[d6+5]=d5.y;
cG[d6+6]=d5.z;
cG[d6+7]=d5.w;
cG[d6+8]=dq.x;
cG[d6+9]=dq.y;
cG[d6+10]=dq.z;
cG[d6+11]=dq.w;
cG[d6+12]=cE.x;
cG[d6+13]=cE.y;
cG[d6+14]=cE.z;
cG[d6+15]=cE.w;
d6=d6+16
}a1.bindBuffer(a1.ARRAY_BUFFER,di.__webglTangentBuffer);
a1.bufferData(a1.ARRAY_BUFFER,cG,cJ)
}if(cp&&c9){dM=0;
for(dA=bg.length;
dM<dA;
dM++){dH=eg[bg[dM]];
br=dH.vertexNormals;
bU=dH.normal;
if(br.length===3&&bo){for(bt=0;
bt<3;
bt++){dB=br[bt];
cM[dp]=dB.x;
cM[dp+1]=dB.y;
cM[dp+2]=dB.z;
dp=dp+3
}}else{for(bt=0;
bt<3;
bt++){cM[dp]=bU.x;
cM[dp+1]=bU.y;
cM[dp+2]=bU.z;
dp=dp+3
}}}dM=0;
for(dA=c.length;
dM<dA;
dM++){dH=eg[c[dM]];
br=dH.vertexNormals;
bU=dH.normal;
if(br.length===4&&bo){for(bt=0;
bt<4;
bt++){dB=br[bt];
cM[dp]=dB.x;
cM[dp+1]=dB.y;
cM[dp+2]=dB.z;
dp=dp+3
}}else{for(bt=0;
bt<4;
bt++){cM[dp]=bU.x;
cM[dp+1]=bU.y;
cM[dp+2]=bU.z;
dp=dp+3
}}}a1.bindBuffer(a1.ARRAY_BUFFER,di.__webglNormalBuffer);
a1.bufferData(a1.ARRAY_BUFFER,cM,cJ)
}if(bZ&&cH&&cK){dM=0;
for(dA=bg.length;
dM<dA;
dM++){cn=bg[dM];
dH=eg[cn];
be=cH[cn];
if(be!==void 0){for(bt=0;
bt<3;
bt++){em=be[bt];
by[el]=em.u;
by[el+1]=em.v;
el=el+2
}}}dM=0;
for(dA=c.length;
dM<dA;
dM++){cn=c[dM];
dH=eg[cn];
be=cH[cn];
if(be!==void 0){for(bt=0;
bt<4;
bt++){em=be[bt];
by[el]=em.u;
by[el+1]=em.v;
el=el+2
}}}if(el>0){a1.bindBuffer(a1.ARRAY_BUFFER,di.__webglUVBuffer);
a1.bufferData(a1.ARRAY_BUFFER,by,cJ)
}}if(bZ&&cu&&cK){dM=0;
for(dA=bg.length;
dM<dA;
dM++){cn=bg[dM];
dH=eg[cn];
eA=cu[cn];
if(eA!==void 0){for(bt=0;
bt<3;
bt++){d4=eA[bt];
bl[d1]=d4.u;
bl[d1+1]=d4.v;
d1=d1+2
}}}dM=0;
for(dA=c.length;
dM<dA;
dM++){cn=c[dM];
dH=eg[cn];
eA=cu[cn];
if(eA!==void 0){for(bt=0;
bt<4;
bt++){d4=eA[bt];
bl[d1]=d4.u;
bl[d1+1]=d4.v;
d1=d1+2
}}}if(d1>0){a1.bindBuffer(a1.ARRAY_BUFFER,di.__webglUV2Buffer);
a1.bufferData(a1.ARRAY_BUFFER,bl,cJ)
}}if(cB){dM=0;
for(dA=bg.length;
dM<dA;
dM++){dH=eg[bg[dM]];
b0[dh]=bn;
b0[dh+1]=bn+1;
b0[dh+2]=bn+2;
dh=dh+3;
cg[bV]=bn;
cg[bV+1]=bn+1;
cg[bV+2]=bn;
cg[bV+3]=bn+2;
cg[bV+4]=bn+1;
cg[bV+5]=bn+2;
bV=bV+6;
bn=bn+3
}dM=0;
for(dA=c.length;
dM<dA;
dM++){dH=eg[c[dM]];
b0[dh]=bn;
b0[dh+1]=bn+1;
b0[dh+2]=bn+3;
b0[dh+3]=bn+1;
b0[dh+4]=bn+2;
b0[dh+5]=bn+3;
dh=dh+6;
cg[bV]=bn;
cg[bV+1]=bn+1;
cg[bV+2]=bn;
cg[bV+3]=bn+3;
cg[bV+4]=bn+1;
cg[bV+5]=bn+2;
cg[bV+6]=bn+2;
cg[bV+7]=bn+3;
bV=bV+8;
bn=bn+4
}a1.bindBuffer(a1.ELEMENT_ARRAY_BUFFER,di.__webglFaceBuffer);
a1.bufferData(a1.ELEMENT_ARRAY_BUFFER,b0,cJ);
a1.bindBuffer(a1.ELEMENT_ARRAY_BUFFER,di.__webglLineBuffer);
a1.bufferData(a1.ELEMENT_ARRAY_BUFFER,cg,cJ)
}if(c1){bt=0;
for(cx=c1.length;
bt<cx;
bt++){cW=c1[bt];
if(cW.__original.needsUpdate){dW=0;
if(cW.size===1){if(cW.boundTo===void 0||cW.boundTo==="vertices"){dM=0;
for(dA=bg.length;
dM<dA;
dM++){dH=eg[bg[dM]];
cW.array[dW]=cW.value[dH.a];
cW.array[dW+1]=cW.value[dH.b];
cW.array[dW+2]=cW.value[dH.c];
dW=dW+3
}dM=0;
for(dA=c.length;
dM<dA;
dM++){dH=eg[c[dM]];
cW.array[dW]=cW.value[dH.a];
cW.array[dW+1]=cW.value[dH.b];
cW.array[dW+2]=cW.value[dH.c];
cW.array[dW+3]=cW.value[dH.d];
dW=dW+4
}}else{if(cW.boundTo==="faces"){dM=0;
for(dA=bg.length;
dM<dA;
dM++){cw=cW.value[bg[dM]];
cW.array[dW]=cw;
cW.array[dW+1]=cw;
cW.array[dW+2]=cw;
dW=dW+3
}dM=0;
for(dA=c.length;
dM<dA;
dM++){cw=cW.value[c[dM]];
cW.array[dW]=cw;
cW.array[dW+1]=cw;
cW.array[dW+2]=cw;
cW.array[dW+3]=cw;
dW=dW+4
}}}}else{if(cW.size===2){if(cW.boundTo===void 0||cW.boundTo==="vertices"){dM=0;
for(dA=bg.length;
dM<dA;
dM++){dH=eg[bg[dM]];
dw=cW.value[dH.a];
dv=cW.value[dH.b];
du=cW.value[dH.c];
cW.array[dW]=dw.x;
cW.array[dW+1]=dw.y;
cW.array[dW+2]=dv.x;
cW.array[dW+3]=dv.y;
cW.array[dW+4]=du.x;
cW.array[dW+5]=du.y;
dW=dW+6
}dM=0;
for(dA=c.length;
dM<dA;
dM++){dH=eg[c[dM]];
dw=cW.value[dH.a];
dv=cW.value[dH.b];
du=cW.value[dH.c];
eo=cW.value[dH.d];
cW.array[dW]=dw.x;
cW.array[dW+1]=dw.y;
cW.array[dW+2]=dv.x;
cW.array[dW+3]=dv.y;
cW.array[dW+4]=du.x;
cW.array[dW+5]=du.y;
cW.array[dW+6]=eo.x;
cW.array[dW+7]=eo.y;
dW=dW+8
}}else{if(cW.boundTo==="faces"){dM=0;
for(dA=bg.length;
dM<dA;
dM++){du=dv=dw=cw=cW.value[bg[dM]];
cW.array[dW]=dw.x;
cW.array[dW+1]=dw.y;
cW.array[dW+2]=dv.x;
cW.array[dW+3]=dv.y;
cW.array[dW+4]=du.x;
cW.array[dW+5]=du.y;
dW=dW+6
}dM=0;
for(dA=c.length;
dM<dA;
dM++){eo=du=dv=dw=cw=cW.value[c[dM]];
cW.array[dW]=dw.x;
cW.array[dW+1]=dw.y;
cW.array[dW+2]=dv.x;
cW.array[dW+3]=dv.y;
cW.array[dW+4]=du.x;
cW.array[dW+5]=du.y;
cW.array[dW+6]=eo.x;
cW.array[dW+7]=eo.y;
dW=dW+8
}}}}else{if(cW.size===3){var cN;
cN=cW.type==="c"?["r","g","b"]:["x","y","z"];
if(cW.boundTo===void 0||cW.boundTo==="vertices"){dM=0;
for(dA=bg.length;
dM<dA;
dM++){dH=eg[bg[dM]];
dw=cW.value[dH.a];
dv=cW.value[dH.b];
du=cW.value[dH.c];
cW.array[dW]=dw[cN[0]];
cW.array[dW+1]=dw[cN[1]];
cW.array[dW+2]=dw[cN[2]];
cW.array[dW+3]=dv[cN[0]];
cW.array[dW+4]=dv[cN[1]];
cW.array[dW+5]=dv[cN[2]];
cW.array[dW+6]=du[cN[0]];
cW.array[dW+7]=du[cN[1]];
cW.array[dW+8]=du[cN[2]];
dW=dW+9
}dM=0;
for(dA=c.length;
dM<dA;
dM++){dH=eg[c[dM]];
dw=cW.value[dH.a];
dv=cW.value[dH.b];
du=cW.value[dH.c];
eo=cW.value[dH.d];
cW.array[dW]=dw[cN[0]];
cW.array[dW+1]=dw[cN[1]];
cW.array[dW+2]=dw[cN[2]];
cW.array[dW+3]=dv[cN[0]];
cW.array[dW+4]=dv[cN[1]];
cW.array[dW+5]=dv[cN[2]];
cW.array[dW+6]=du[cN[0]];
cW.array[dW+7]=du[cN[1]];
cW.array[dW+8]=du[cN[2]];
cW.array[dW+9]=eo[cN[0]];
cW.array[dW+10]=eo[cN[1]];
cW.array[dW+11]=eo[cN[2]];
dW=dW+12
}}else{if(cW.boundTo==="faces"){dM=0;
for(dA=bg.length;
dM<dA;
dM++){du=dv=dw=cw=cW.value[bg[dM]];
cW.array[dW]=dw[cN[0]];
cW.array[dW+1]=dw[cN[1]];
cW.array[dW+2]=dw[cN[2]];
cW.array[dW+3]=dv[cN[0]];
cW.array[dW+4]=dv[cN[1]];
cW.array[dW+5]=dv[cN[2]];
cW.array[dW+6]=du[cN[0]];
cW.array[dW+7]=du[cN[1]];
cW.array[dW+8]=du[cN[2]];
dW=dW+9
}dM=0;
for(dA=c.length;
dM<dA;
dM++){eo=du=dv=dw=cw=cW.value[c[dM]];
cW.array[dW]=dw[cN[0]];
cW.array[dW+1]=dw[cN[1]];
cW.array[dW+2]=dw[cN[2]];
cW.array[dW+3]=dv[cN[0]];
cW.array[dW+4]=dv[cN[1]];
cW.array[dW+5]=dv[cN[2]];
cW.array[dW+6]=du[cN[0]];
cW.array[dW+7]=du[cN[1]];
cW.array[dW+8]=du[cN[2]];
cW.array[dW+9]=eo[cN[0]];
cW.array[dW+10]=eo[cN[1]];
cW.array[dW+11]=eo[cN[2]];
dW=dW+12
}}}}else{if(cW.size===4){if(cW.boundTo===void 0||cW.boundTo==="vertices"){dM=0;
for(dA=bg.length;
dM<dA;
dM++){dH=eg[bg[dM]];
dw=cW.value[dH.a];
dv=cW.value[dH.b];
du=cW.value[dH.c];
cW.array[dW]=dw.x;
cW.array[dW+1]=dw.y;
cW.array[dW+2]=dw.z;
cW.array[dW+3]=dw.w;
cW.array[dW+4]=dv.x;
cW.array[dW+5]=dv.y;
cW.array[dW+6]=dv.z;
cW.array[dW+7]=dv.w;
cW.array[dW+8]=du.x;
cW.array[dW+9]=du.y;
cW.array[dW+10]=du.z;
cW.array[dW+11]=du.w;
dW=dW+12
}dM=0;
for(dA=c.length;
dM<dA;
dM++){dH=eg[c[dM]];
dw=cW.value[dH.a];
dv=cW.value[dH.b];
du=cW.value[dH.c];
eo=cW.value[dH.d];
cW.array[dW]=dw.x;
cW.array[dW+1]=dw.y;
cW.array[dW+2]=dw.z;
cW.array[dW+3]=dw.w;
cW.array[dW+4]=dv.x;
cW.array[dW+5]=dv.y;
cW.array[dW+6]=dv.z;
cW.array[dW+7]=dv.w;
cW.array[dW+8]=du.x;
cW.array[dW+9]=du.y;
cW.array[dW+10]=du.z;
cW.array[dW+11]=du.w;
cW.array[dW+12]=eo.x;
cW.array[dW+13]=eo.y;
cW.array[dW+14]=eo.z;
cW.array[dW+15]=eo.w;
dW=dW+16
}}else{if(cW.boundTo==="faces"){dM=0;
for(dA=bg.length;
dM<dA;
dM++){du=dv=dw=cw=cW.value[bg[dM]];
cW.array[dW]=dw.x;
cW.array[dW+1]=dw.y;
cW.array[dW+2]=dw.z;
cW.array[dW+3]=dw.w;
cW.array[dW+4]=dv.x;
cW.array[dW+5]=dv.y;
cW.array[dW+6]=dv.z;
cW.array[dW+7]=dv.w;
cW.array[dW+8]=du.x;
cW.array[dW+9]=du.y;
cW.array[dW+10]=du.z;
cW.array[dW+11]=du.w;
dW=dW+12
}dM=0;
for(dA=c.length;
dM<dA;
dM++){eo=du=dv=dw=cw=cW.value[c[dM]];
cW.array[dW]=dw.x;
cW.array[dW+1]=dw.y;
cW.array[dW+2]=dw.z;
cW.array[dW+3]=dw.w;
cW.array[dW+4]=dv.x;
cW.array[dW+5]=dv.y;
cW.array[dW+6]=dv.z;
cW.array[dW+7]=dv.w;
cW.array[dW+8]=du.x;
cW.array[dW+9]=du.y;
cW.array[dW+10]=du.z;
cW.array[dW+11]=du.w;
cW.array[dW+12]=eo.x;
cW.array[dW+13]=eo.y;
cW.array[dW+14]=eo.z;
cW.array[dW+15]=eo.w;
dW=dW+16
}}}}}}}a1.bindBuffer(a1.ARRAY_BUFFER,cW.buffer);
a1.bufferData(a1.ARRAY_BUFFER,cW.array,cJ)
}}}if(cQ){delete di.__inittedArrays;
delete di.__colorArray;
delete di.__normalArray;
delete di.__tangentArray;
delete di.__uvArray;
delete di.__uv2Array;
delete di.__faceArray;
delete di.__vertexArray;
delete di.__lineArray;
delete di.__skinVertexAArray;
delete di.__skinVertexBArray;
delete di.__skinIndexArray;
delete di.__skinWeightArray
}}}}b3.verticesNeedUpdate=false;
b3.morphTargetsNeedUpdate=false;
b3.elementsNeedUpdate=false;
b3.uvsNeedUpdate=false;
b3.normalsNeedUpdate=false;
b3.colorsNeedUpdate=false;
b3.tangetsNeedUpdate=false;
ee.attributes&&aW(ee)
}}else{if(bs instanceof THREE.Ribbon){if(b3.verticesNeedUpdate||b3.colorsNeedUpdate){var cf=b3,bN=a1.DYNAMIC_DRAW,f=void 0,es=void 0,dk=void 0,dX=void 0,cO=void 0,bB=cf.vertices,bp=cf.colors,bv=bB.length,bi=bp.length,cA=cf.__vertexArray,co=cf.__colorArray,d=cf.colorsNeedUpdate;
if(cf.verticesNeedUpdate){for(f=0;
f<bv;
f++){dk=bB[f];
dX=f*3;
cA[dX]=dk.x;
cA[dX+1]=dk.y;
cA[dX+2]=dk.z
}a1.bindBuffer(a1.ARRAY_BUFFER,cf.__webglVertexBuffer);
a1.bufferData(a1.ARRAY_BUFFER,cA,bN)
}if(d){for(es=0;
es<bi;
es++){cO=bp[es];
dX=es*3;
co[dX]=cO.r;
co[dX+1]=cO.g;
co[dX+2]=cO.b
}a1.bindBuffer(a1.ARRAY_BUFFER,cf.__webglColorBuffer);
a1.bufferData(a1.ARRAY_BUFFER,co,bN)
}}b3.verticesNeedUpdate=false;
b3.colorsNeedUpdate=false
}else{if(bs instanceof THREE.Line){ee=a7(bs,bQ);
bD=ee.attributes&&aS(ee);
if(b3.verticesNeedUpdate||b3.colorsNeedUpdate||bD){var dl=b3,ce=a1.DYNAMIC_DRAW,eb=void 0,ci=void 0,b4=void 0,bA=void 0,bS=void 0,q=dl.vertices,ex=dl.colors,eq=q.length,d8=ex.length,bG=dl.__vertexArray,bu=dl.__colorArray,ch=dl.colorsNeedUpdate,dV=dl.__webglCustomAttributesList,bh=void 0,ek=void 0,d3=void 0,dn=void 0,dC=void 0,cT=void 0;
if(dl.verticesNeedUpdate){for(eb=0;
eb<eq;
eb++){b4=q[eb];
bA=eb*3;
bG[bA]=b4.x;
bG[bA+1]=b4.y;
bG[bA+2]=b4.z
}a1.bindBuffer(a1.ARRAY_BUFFER,dl.__webglVertexBuffer);
a1.bufferData(a1.ARRAY_BUFFER,bG,ce)
}if(ch){for(ci=0;
ci<d8;
ci++){bS=ex[ci];
bA=ci*3;
bu[bA]=bS.r;
bu[bA+1]=bS.g;
bu[bA+2]=bS.b
}a1.bindBuffer(a1.ARRAY_BUFFER,dl.__webglColorBuffer);
a1.bufferData(a1.ARRAY_BUFFER,bu,ce)
}if(dV){bh=0;
for(ek=dV.length;
bh<ek;
bh++){cT=dV[bh];
if(cT.needsUpdate&&(cT.boundTo===void 0||cT.boundTo==="vertices")){bA=0;
dn=cT.value.length;
if(cT.size===1){for(d3=0;
d3<dn;
d3++){cT.array[d3]=cT.value[d3]
}}else{if(cT.size===2){for(d3=0;
d3<dn;
d3++){dC=cT.value[d3];
cT.array[bA]=dC.x;
cT.array[bA+1]=dC.y;
bA=bA+2
}}else{if(cT.size===3){if(cT.type==="c"){for(d3=0;
d3<dn;
d3++){dC=cT.value[d3];
cT.array[bA]=dC.r;
cT.array[bA+1]=dC.g;
cT.array[bA+2]=dC.b;
bA=bA+3
}}else{for(d3=0;
d3<dn;
d3++){dC=cT.value[d3];
cT.array[bA]=dC.x;
cT.array[bA+1]=dC.y;
cT.array[bA+2]=dC.z;
bA=bA+3
}}}else{if(cT.size===4){for(d3=0;
d3<dn;
d3++){dC=cT.value[d3];
cT.array[bA]=dC.x;
cT.array[bA+1]=dC.y;
cT.array[bA+2]=dC.z;
cT.array[bA+3]=dC.w;
bA=bA+4
}}}}}a1.bindBuffer(a1.ARRAY_BUFFER,cT.buffer);
a1.bufferData(a1.ARRAY_BUFFER,cT.array,ce)
}}}}b3.verticesNeedUpdate=false;
b3.colorsNeedUpdate=false;
ee.attributes&&aW(ee)
}else{if(bs instanceof THREE.ParticleSystem){ee=a7(bs,bQ);
bD=ee.attributes&&aS(ee);
(b3.verticesNeedUpdate||b3.colorsNeedUpdate||bs.sortParticles||bD)&&a4(b3,a1.DYNAMIC_DRAW,bs);
b3.verticesNeedUpdate=false;
b3.colorsNeedUpdate=false;
ee.attributes&&aW(ee)
}}}}}};
this.initMaterial=function(P,O,M,K){var J,H,G;
P instanceof THREE.MeshDepthMaterial?G="depth":P instanceof THREE.MeshNormalMaterial?G="normal":P instanceof THREE.MeshBasicMaterial?G="basic":P instanceof THREE.MeshLambertMaterial?G="lambert":P instanceof THREE.MeshPhongMaterial?G="phong":P instanceof THREE.LineBasicMaterial?G="basic":P instanceof THREE.ParticleBasicMaterial&&(G="particle_basic");
if(G){var F=THREE.ShaderLib[G];
P.uniforms=THREE.UniformsUtils.clone(F.uniforms);
P.vertexShader=F.vertexShader;
P.fragmentShader=F.fragmentShader
}var E,D,C,A,z;
E=A=z=F=0;
for(D=O.length;
E<D;
E++){C=O[E];
if(!C.onlyShadow){C instanceof THREE.DirectionalLight&&A++;
C instanceof THREE.PointLight&&z++;
C instanceof THREE.SpotLight&&F++
}}if(z+F+A<=ag){D=A;
C=z;
A=F
}else{D=Math.ceil(ag*A/(z+A));
A=C=ag-D
}var w=0,F=0;
for(z=O.length;
F<z;
F++){E=O[F];
if(E.castShadow){E instanceof THREE.SpotLight&&w++;
E instanceof THREE.DirectionalLight&&!E.shadowCascade&&w++
}}var y=50;
if(K!==void 0&&K instanceof THREE.SkinnedMesh){y=K.bones.length
}var v;
P:{z=P.fragmentShader;
E=P.vertexShader;
var F=P.uniforms,O=P.attributes,M={map:!!P.map,envMap:!!P.envMap,lightMap:!!P.lightMap,vertexColors:P.vertexColors,fog:M,useFog:P.fog,sizeAttenuation:P.sizeAttenuation,skinning:P.skinning,maxBones:y,morphTargets:P.morphTargets,morphNormals:P.morphNormals,maxMorphTargets:this.maxMorphTargets,maxMorphNormals:this.maxMorphNormals,maxDirLights:D,maxPointLights:C,maxSpotLights:A,maxShadows:w,shadowMapEnabled:this.shadowMapEnabled&&K.receiveShadow,shadowMapSoft:this.shadowMapSoft,shadowMapDebug:this.shadowMapDebug,shadowMapCascade:this.shadowMapCascade,alphaTest:P.alphaTest,metal:P.metal,perPixel:P.perPixel,wrapAround:P.wrapAround,doubleSided:K&&K.doubleSided},u,K=[];
if(G){K.push(G)
}else{K.push(z);
K.push(E)
}for(u in M){K.push(u);
K.push(M[u])
}G=K.join();
u=0;
for(K=W.length;
u<K;
u++){if(W[u].code===G){v=W[u].program;
break P
}}u=a1.createProgram();
K=["precision "+aG+" float;",aK>0?"#define VERTEX_TEXTURES":"",am.gammaInput?"#define GAMMA_INPUT":"",am.gammaOutput?"#define GAMMA_OUTPUT":"",am.physicallyBasedShading?"#define PHYSICALLY_BASED_SHADING":"","#define MAX_DIR_LIGHTS "+M.maxDirLights,"#define MAX_POINT_LIGHTS "+M.maxPointLights,"#define MAX_SPOT_LIGHTS "+M.maxSpotLights,"#define MAX_SHADOWS "+M.maxShadows,"#define MAX_BONES "+M.maxBones,M.map?"#define USE_MAP":"",M.envMap?"#define USE_ENVMAP":"",M.lightMap?"#define USE_LIGHTMAP":"",M.vertexColors?"#define USE_COLOR":"",M.skinning?"#define USE_SKINNING":"",M.morphTargets?"#define USE_MORPHTARGETS":"",M.morphNormals?"#define USE_MORPHNORMALS":"",M.perPixel?"#define PHONG_PER_PIXEL":"",M.wrapAround?"#define WRAP_AROUND":"",M.doubleSided?"#define DOUBLE_SIDED":"",M.shadowMapEnabled?"#define USE_SHADOWMAP":"",M.shadowMapSoft?"#define SHADOWMAP_SOFT":"",M.shadowMapDebug?"#define SHADOWMAP_DEBUG":"",M.shadowMapCascade?"#define SHADOWMAP_CASCADE":"",M.sizeAttenuation?"#define USE_SIZEATTENUATION":"","uniform mat4 objectMatrix;\nuniform mat4 modelViewMatrix;\nuniform mat4 projectionMatrix;\nuniform mat4 viewMatrix;\nuniform mat3 normalMatrix;\nuniform vec3 cameraPosition;\nattribute vec3 position;\nattribute vec3 normal;\nattribute vec2 uv;\nattribute vec2 uv2;\n#ifdef USE_COLOR\nattribute vec3 color;\n#endif\n#ifdef USE_MORPHTARGETS\nattribute vec3 morphTarget0;\nattribute vec3 morphTarget1;\nattribute vec3 morphTarget2;\nattribute vec3 morphTarget3;\n#ifdef USE_MORPHNORMALS\nattribute vec3 morphNormal0;\nattribute vec3 morphNormal1;\nattribute vec3 morphNormal2;\nattribute vec3 morphNormal3;\n#else\nattribute vec3 morphTarget4;\nattribute vec3 morphTarget5;\nattribute vec3 morphTarget6;\nattribute vec3 morphTarget7;\n#endif\n#endif\n#ifdef USE_SKINNING\nattribute vec4 skinVertexA;\nattribute vec4 skinVertexB;\nattribute vec4 skinIndex;\nattribute vec4 skinWeight;\n#endif\n"].join("\n");
D=["precision "+aG+" float;","#define MAX_DIR_LIGHTS "+M.maxDirLights,"#define MAX_POINT_LIGHTS "+M.maxPointLights,"#define MAX_SPOT_LIGHTS "+M.maxSpotLights,"#define MAX_SHADOWS "+M.maxShadows,M.alphaTest?"#define ALPHATEST "+M.alphaTest:"",am.gammaInput?"#define GAMMA_INPUT":"",am.gammaOutput?"#define GAMMA_OUTPUT":"",am.physicallyBasedShading?"#define PHYSICALLY_BASED_SHADING":"",M.useFog&&M.fog?"#define USE_FOG":"",M.useFog&&M.fog instanceof THREE.FogExp2?"#define FOG_EXP2":"",M.map?"#define USE_MAP":"",M.envMap?"#define USE_ENVMAP":"",M.lightMap?"#define USE_LIGHTMAP":"",M.vertexColors?"#define USE_COLOR":"",M.metal?"#define METAL":"",M.perPixel?"#define PHONG_PER_PIXEL":"",M.wrapAround?"#define WRAP_AROUND":"",M.doubleSided?"#define DOUBLE_SIDED":"",M.shadowMapEnabled?"#define USE_SHADOWMAP":"",M.shadowMapSoft?"#define SHADOWMAP_SOFT":"",M.shadowMapDebug?"#define SHADOWMAP_DEBUG":"",M.shadowMapCascade?"#define SHADOWMAP_CASCADE":"","uniform mat4 viewMatrix;\nuniform vec3 cameraPosition;\n"].join("\n");
a1.attachShader(u,aN("fragment",D+z));
a1.attachShader(u,aN("vertex",K+E));
a1.linkProgram(u);
a1.getProgramParameter(u,a1.LINK_STATUS)||console.error("Could not initialise shader\nVALIDATE_STATUS: "+a1.getProgramParameter(u,a1.VALIDATE_STATUS)+", gl error ["+a1.getError()+"]");
u.uniforms={};
u.attributes={};
var t,K=["viewMatrix","modelViewMatrix","projectionMatrix","normalMatrix","objectMatrix","cameraPosition","boneGlobalMatrices","morphTargetInfluences"];
for(t in F){K.push(t)
}t=K;
K=0;
for(F=t.length;
K<F;
K++){z=t[K];
u.uniforms[z]=a1.getUniformLocation(u,z)
}K=["position","normal","uv","uv2","tangent","color","skinVertexA","skinVertexB","skinIndex","skinWeight"];
for(t=0;
t<M.maxMorphTargets;
t++){K.push("morphTarget"+t)
}for(t=0;
t<M.maxMorphNormals;
t++){K.push("morphNormal"+t)
}for(v in O){K.push(v)
}v=K;
t=0;
for(O=v.length;
t<O;
t++){M=v[t];
u.attributes[M]=a1.getAttribLocation(u,M)
}u.id=W.length;
W.push({program:u,code:G});
am.info.memory.programs=W.length;
v=u
}P.program=v;
v=P.program.attributes;
v.position>=0&&a1.enableVertexAttribArray(v.position);
v.color>=0&&a1.enableVertexAttribArray(v.color);
v.normal>=0&&a1.enableVertexAttribArray(v.normal);
v.tangent>=0&&a1.enableVertexAttribArray(v.tangent);
if(P.skinning&&v.skinVertexA>=0&&v.skinVertexB>=0&&v.skinIndex>=0&&v.skinWeight>=0){a1.enableVertexAttribArray(v.skinVertexA);
a1.enableVertexAttribArray(v.skinVertexB);
a1.enableVertexAttribArray(v.skinIndex);
a1.enableVertexAttribArray(v.skinWeight)
}if(P.attributes){for(H in P.attributes){v[H]!==void 0&&v[H]>=0&&a1.enableVertexAttribArray(v[H])
}}if(P.morphTargets){P.numSupportedMorphTargets=0;
u="morphTarget";
for(H=0;
H<this.maxMorphTargets;
H++){t=u+H;
if(v[t]>=0){a1.enableVertexAttribArray(v[t]);
P.numSupportedMorphTargets++
}}}if(P.morphNormals){P.numSupportedMorphNormals=0;
u="morphNormal";
for(H=0;
H<this.maxMorphNormals;
H++){t=u+H;
if(v[t]>=0){a1.enableVertexAttribArray(v[t]);
P.numSupportedMorphNormals++
}}}P.uniformsList=[];
for(J in P.uniforms){P.uniformsList.push([P.uniforms[J],J])
}};
this.setFaceCulling=function(d,c){if(d){!c||c==="ccw"?a1.frontFace(a1.CCW):a1.frontFace(a1.CW);
d==="back"?a1.cullFace(a1.BACK):d==="front"?a1.cullFace(a1.FRONT):a1.cullFace(a1.FRONT_AND_BACK);
a1.enable(a1.CULL_FACE)
}else{a1.disable(a1.CULL_FACE)
}};
this.setObjectFaces=function(b){if(aF!==b.doubleSided){b.doubleSided?a1.disable(a1.CULL_FACE):a1.enable(a1.CULL_FACE);
aF=b.doubleSided
}if(ae!==b.flipSided){b.flipSided?a1.frontFace(a1.CW):a1.frontFace(a1.CCW);
ae=b.flipSided
}};
this.setDepthTest=function(b){if(aV!==b){b?a1.enable(a1.DEPTH_TEST):a1.disable(a1.DEPTH_TEST);
aV=b
}};
this.setDepthWrite=function(b){if(ax!==b){a1.depthMask(b);
ax=b
}};
this.setBlending=function(f,e,h,g){if(f!==ab){switch(f){case THREE.NoBlending:a1.disable(a1.BLEND);
break;
case THREE.AdditiveBlending:a1.enable(a1.BLEND);
a1.blendEquation(a1.FUNC_ADD);
a1.blendFunc(a1.SRC_ALPHA,a1.ONE);
break;
case THREE.SubtractiveBlending:a1.enable(a1.BLEND);
a1.blendEquation(a1.FUNC_ADD);
a1.blendFunc(a1.ZERO,a1.ONE_MINUS_SRC_COLOR);
break;
case THREE.MultiplyBlending:a1.enable(a1.BLEND);
a1.blendEquation(a1.FUNC_ADD);
a1.blendFunc(a1.ZERO,a1.SRC_COLOR);
break;
case THREE.CustomBlending:a1.enable(a1.BLEND);
break;
default:a1.enable(a1.BLEND);
a1.blendEquationSeparate(a1.FUNC_ADD,a1.FUNC_ADD);
a1.blendFuncSeparate(a1.SRC_ALPHA,a1.ONE_MINUS_SRC_ALPHA,a1.ONE,a1.ONE_MINUS_SRC_ALPHA)
}ab=f
}if(f===THREE.CustomBlending){if(e!==L){a1.blendEquation(al(e));
L=e
}if(h!==aC||g!==I){a1.blendFunc(al(h),al(g));
aC=h;
I=g
}}else{I=aC=L=null
}};
this.setTexture=function(h,g){if(h.needsUpdate){if(!h.__webglInit){h.__webglInit=true;
h.__webglTexture=a1.createTexture();
am.info.memory.textures++
}a1.activeTexture(a1.TEXTURE0+g);
a1.bindTexture(a1.TEXTURE_2D,h.__webglTexture);
a1.pixelStorei(a1.UNPACK_PREMULTIPLY_ALPHA_WEBGL,h.premultiplyAlpha);
var n=h.image,m=(n.width&n.width-1)===0&&(n.height&n.height-1)===0,l=al(h.format),k=al(h.type);
aI(a1.TEXTURE_2D,h,m);
h instanceof THREE.DataTexture?a1.texImage2D(a1.TEXTURE_2D,0,l,n.width,n.height,0,l,k,n.data):a1.texImage2D(a1.TEXTURE_2D,0,l,l,k,h.image);
h.generateMipmaps&&m&&a1.generateMipmap(a1.TEXTURE_2D);
h.needsUpdate=false;
if(h.onUpdate){h.onUpdate()
}}else{a1.activeTexture(a1.TEXTURE0+g);
a1.bindTexture(a1.TEXTURE_2D,h.__webglTexture)
}};
this.setRenderTarget=function(l){var k=l instanceof THREE.WebGLRenderTargetCube;
if(l&&!l.__webglFramebuffer){if(l.depthBuffer===void 0){l.depthBuffer=true
}if(l.stencilBuffer===void 0){l.stencilBuffer=true
}l.__webglTexture=a1.createTexture();
var r=(l.width&l.width-1)===0&&(l.height&l.height-1)===0,q=al(l.format),p=al(l.type);
if(k){l.__webglFramebuffer=[];
l.__webglRenderbuffer=[];
a1.bindTexture(a1.TEXTURE_CUBE_MAP,l.__webglTexture);
aI(a1.TEXTURE_CUBE_MAP,l,r);
for(var o=0;
o<6;
o++){l.__webglFramebuffer[o]=a1.createFramebuffer();
l.__webglRenderbuffer[o]=a1.createRenderbuffer();
a1.texImage2D(a1.TEXTURE_CUBE_MAP_POSITIVE_X+o,0,q,l.width,l.height,0,q,p,null);
var n=l,m=a1.TEXTURE_CUBE_MAP_POSITIVE_X+o;
a1.bindFramebuffer(a1.FRAMEBUFFER,l.__webglFramebuffer[o]);
a1.framebufferTexture2D(a1.FRAMEBUFFER,a1.COLOR_ATTACHMENT0,m,n.__webglTexture,0);
aO(l.__webglRenderbuffer[o],l)
}r&&a1.generateMipmap(a1.TEXTURE_CUBE_MAP)
}else{l.__webglFramebuffer=a1.createFramebuffer();
l.__webglRenderbuffer=a1.createRenderbuffer();
a1.bindTexture(a1.TEXTURE_2D,l.__webglTexture);
aI(a1.TEXTURE_2D,l,r);
a1.texImage2D(a1.TEXTURE_2D,0,q,l.width,l.height,0,q,p,null);
q=a1.TEXTURE_2D;
a1.bindFramebuffer(a1.FRAMEBUFFER,l.__webglFramebuffer);
a1.framebufferTexture2D(a1.FRAMEBUFFER,a1.COLOR_ATTACHMENT0,q,l.__webglTexture,0);
aO(l.__webglRenderbuffer,l);
r&&a1.generateMipmap(a1.TEXTURE_2D)
}k?a1.bindTexture(a1.TEXTURE_CUBE_MAP,null):a1.bindTexture(a1.TEXTURE_2D,null);
a1.bindRenderbuffer(a1.RENDERBUFFER,null);
a1.bindFramebuffer(a1.FRAMEBUFFER,null)
}if(l){k=k?l.__webglFramebuffer[l.activeCubeFace]:l.__webglFramebuffer;
r=l.width;
l=l.height;
p=q=0
}else{k=null;
r=au;
l=ad;
q=aw;
p=aH
}if(k!==aq){a1.bindFramebuffer(a1.FRAMEBUFFER,k);
a1.viewport(q,p,r,l);
aq=k
}B=r;
S=l
};
this.shadowMapPlugin=new THREE.ShadowMapPlugin;
this.addPrePlugin(this.shadowMapPlugin);
this.addPostPlugin(new THREE.SpritePlugin);
this.addPostPlugin(new THREE.LensFlarePlugin)
};
THREE.WebGLRenderTarget=function(e,d,f){this.width=e;
this.height=d;
f=f||{};
this.wrapS=f.wrapS!==void 0?f.wrapS:THREE.ClampToEdgeWrapping;
this.wrapT=f.wrapT!==void 0?f.wrapT:THREE.ClampToEdgeWrapping;
this.magFilter=f.magFilter!==void 0?f.magFilter:THREE.LinearFilter;
this.minFilter=f.minFilter!==void 0?f.minFilter:THREE.LinearMipMapLinearFilter;
this.offset=new THREE.Vector2(0,0);
this.repeat=new THREE.Vector2(1,1);
this.format=f.format!==void 0?f.format:THREE.RGBAFormat;
this.type=f.type!==void 0?f.type:THREE.UnsignedByteType;
this.depthBuffer=f.depthBuffer!==void 0?f.depthBuffer:true;
this.stencilBuffer=f.stencilBuffer!==void 0?f.stencilBuffer:true;
this.generateMipmaps=true
};
THREE.WebGLRenderTarget.prototype.clone=function(){var b=new THREE.WebGLRenderTarget(this.width,this.height);
b.wrapS=this.wrapS;
b.wrapT=this.wrapT;
b.magFilter=this.magFilter;
b.minFilter=this.minFilter;
b.offset.copy(this.offset);
b.repeat.copy(this.repeat);
b.format=this.format;
b.type=this.type;
b.depthBuffer=this.depthBuffer;
b.stencilBuffer=this.stencilBuffer;
return b
};
THREE.WebGLRenderTargetCube=function(e,d,f){THREE.WebGLRenderTarget.call(this,e,d,f);
this.activeCubeFace=0
};
THREE.WebGLRenderTargetCube.prototype=new THREE.WebGLRenderTarget;
THREE.WebGLRenderTargetCube.prototype.constructor=THREE.WebGLRenderTargetCube;
THREE.RenderableVertex=function(){this.positionWorld=new THREE.Vector3;
this.positionScreen=new THREE.Vector4;
this.visible=true
};
THREE.RenderableVertex.prototype.copy=function(b){this.positionWorld.copy(b.positionWorld);
this.positionScreen.copy(b.positionScreen)
};
THREE.RenderableFace3=function(){this.v1=new THREE.RenderableVertex;
this.v2=new THREE.RenderableVertex;
this.v3=new THREE.RenderableVertex;
this.centroidWorld=new THREE.Vector3;
this.centroidScreen=new THREE.Vector3;
this.normalWorld=new THREE.Vector3;
this.vertexNormalsWorld=[new THREE.Vector3,new THREE.Vector3,new THREE.Vector3];
this.faceMaterial=this.material=null;
this.uvs=[[]];
this.z=null
};
THREE.RenderableFace4=function(){this.v1=new THREE.RenderableVertex;
this.v2=new THREE.RenderableVertex;
this.v3=new THREE.RenderableVertex;
this.v4=new THREE.RenderableVertex;
this.centroidWorld=new THREE.Vector3;
this.centroidScreen=new THREE.Vector3;
this.normalWorld=new THREE.Vector3;
this.vertexNormalsWorld=[new THREE.Vector3,new THREE.Vector3,new THREE.Vector3,new THREE.Vector3];
this.faceMaterial=this.material=null;
this.uvs=[[]];
this.z=null
};
THREE.RenderableObject=function(){this.z=this.object=null
};
THREE.RenderableParticle=function(){this.rotation=this.z=this.y=this.x=null;
this.scale=new THREE.Vector2;
this.material=null
};
THREE.RenderableLine=function(){this.z=null;
this.v1=new THREE.RenderableVertex;
this.v2=new THREE.RenderableVertex;
this.material=null
};
THREE.ColorUtils={adjustHSV:function(g,f,l,k){var h=THREE.ColorUtils.__hsv;
THREE.ColorUtils.rgbToHsv(g,h);
h.h=THREE.Math.clamp(h.h+f,0,1);
h.s=THREE.Math.clamp(h.s+l,0,1);
h.v=THREE.Math.clamp(h.v+k,0,1);
g.setHSV(h.h,h.s,h.v)
},rgbToHsv:function(l,k){var r=l.r,q=l.g,p=l.b,o=Math.max(Math.max(r,q),p),n=Math.min(Math.min(r,q),p);
if(n===o){n=r=0
}else{var m=o-n,n=m/o,r=(r===o?(q-p)/m:q===o?2+(p-r)/m:4+(r-q)/m)/6;
r<0&&(r=r+1);
r>1&&(r=r-1)
}k===void 0&&(k={h:0,s:0,v:0});
k.h=r;
k.s=n;
k.v=o;
return k
}};
THREE.ColorUtils.__hsv={h:0,s:0,v:0};
THREE.GeometryUtils={merge:function(O,N){for(var M,L,K=O.vertices.length,J=N instanceof THREE.Mesh?N.geometry:N,I=O.vertices,H=J.vertices,G=O.faces,E=J.faces,F=O.faceVertexUvs[0],A=J.faceVertexUvs[0],D={},B=0;
B<O.materials.length;
B++){D[O.materials[B].id]=B
}if(N instanceof THREE.Mesh){N.matrixAutoUpdate&&N.updateMatrix();
M=N.matrix;
L=new THREE.Matrix4;
L.extractRotation(M,N.scale)
}for(var B=0,z=H.length;
B<z;
B++){var C=H[B].clone();
M&&M.multiplyVector3(C);
I.push(C)
}B=0;
for(z=E.length;
B<z;
B++){var I=E[B],x,v,w=I.vertexNormals,s=I.vertexColors;
I instanceof THREE.Face3?x=new THREE.Face3(I.a+K,I.b+K,I.c+K):I instanceof THREE.Face4&&(x=new THREE.Face4(I.a+K,I.b+K,I.c+K,I.d+K));
x.normal.copy(I.normal);
L&&L.multiplyVector3(x.normal);
H=0;
for(C=w.length;
H<C;
H++){v=w[H].clone();
L&&L.multiplyVector3(v);
x.vertexNormals.push(v)
}x.color.copy(I.color);
H=0;
for(C=s.length;
H<C;
H++){v=s[H];
x.vertexColors.push(v.clone())
}if(I.materialIndex!==void 0){H=J.materials[I.materialIndex];
C=H.id;
s=D[C];
if(s===void 0){s=O.materials.length;
D[C]=s;
O.materials.push(H)
}x.materialIndex=s
}x.centroid.copy(I.centroid);
M&&M.multiplyVector3(x.centroid);
G.push(x)
}B=0;
for(z=A.length;
B<z;
B++){M=A[B];
L=[];
H=0;
for(C=M.length;
H<C;
H++){L.push(new THREE.UV(M[H].u,M[H].v))
}F.push(L)
}},clone:function(l){var k=new THREE.Geometry,r,q=l.vertices,p=l.faces,o=l.faceVertexUvs[0];
if(l.materials){k.materials=l.materials.slice()
}l=0;
for(r=q.length;
l<r;
l++){k.vertices.push(q[l].clone())
}l=0;
for(r=p.length;
l<r;
l++){k.faces.push(p[l].clone())
}l=0;
for(r=o.length;
l<r;
l++){for(var q=o[l],p=[],n=0,m=q.length;
n<m;
n++){p.push(new THREE.UV(q[n].u,q[n].v))
}k.faceVertexUvs[0].push(p)
}return k
},randomPointInTriangle:function(l,k,r){var q,p,o,n=new THREE.Vector3,m=THREE.GeometryUtils.__v1;
q=THREE.GeometryUtils.random();
p=THREE.GeometryUtils.random();
if(q+p>1){q=1-q;
p=1-p
}o=1-q-p;
n.copy(l);
n.multiplyScalar(q);
m.copy(k);
m.multiplyScalar(p);
n.addSelf(m);
m.copy(r);
m.multiplyScalar(o);
n.addSelf(m);
return n
},randomPointInFace:function(k,h,p){var o,n,m;
if(k instanceof THREE.Face3){o=h.vertices[k.a];
n=h.vertices[k.b];
m=h.vertices[k.c];
return THREE.GeometryUtils.randomPointInTriangle(o,n,m)
}if(k instanceof THREE.Face4){o=h.vertices[k.a];
n=h.vertices[k.b];
m=h.vertices[k.c];
var h=h.vertices[k.d],l;
if(p){if(k._area1&&k._area2){p=k._area1;
l=k._area2
}else{p=THREE.GeometryUtils.triangleArea(o,n,h);
l=THREE.GeometryUtils.triangleArea(n,m,h);
k._area1=p;
k._area2=l
}}else{p=THREE.GeometryUtils.triangleArea(o,n,h);
l=THREE.GeometryUtils.triangleArea(n,m,h)
}return THREE.GeometryUtils.random()*(p+l)<p?THREE.GeometryUtils.randomPointInTriangle(o,n,h):THREE.GeometryUtils.randomPointInTriangle(n,m,h)
}},randomPointsInGeometry:function(C,B){function A(d){function c(f,b){if(b<f){return f
}var a=f+Math.floor((b-f)/2);
return s[a]>d?c(f,a-1):s[a]<d?c(a+1,b):a
}return c(0,s.length-1)
}var z,y,x=C.faces,w=C.vertices,v=x.length,u=0,s=[],t,n,r,q;
for(y=0;
y<v;
y++){z=x[y];
if(z instanceof THREE.Face3){t=w[z.a];
n=w[z.b];
r=w[z.c];
z._area=THREE.GeometryUtils.triangleArea(t,n,r)
}else{if(z instanceof THREE.Face4){t=w[z.a];
n=w[z.b];
r=w[z.c];
q=w[z.d];
z._area1=THREE.GeometryUtils.triangleArea(t,n,q);
z._area2=THREE.GeometryUtils.triangleArea(n,r,q);
z._area=z._area1+z._area2
}}u=u+z._area;
s[y]=u
}z=[];
for(y=0;
y<B;
y++){w=THREE.GeometryUtils.random()*u;
w=A(w);
z[y]=THREE.GeometryUtils.randomPointInFace(x[w],C,true)
}return z
},triangleArea:function(g,f,l){var k,h=THREE.GeometryUtils.__v1;
h.sub(g,f);
k=h.length();
h.sub(g,l);
g=h.length();
h.sub(f,l);
l=h.length();
f=0.5*(k+g+l);
return Math.sqrt(f*(f-k)*(f-g)*(f-l))
},center:function(e){e.computeBoundingBox();
var d=e.boundingBox,f=new THREE.Vector3;
f.add(d.min,d.max);
f.multiplyScalar(-0.5);
e.applyMatrix((new THREE.Matrix4).makeTranslation(f.x,f.y,f.z));
e.computeBoundingBox();
return f
},normalizeUVs:function(h){for(var h=h.faceVertexUvs[0],g=0,n=h.length;
g<n;
g++){for(var m=h[g],l=0,k=m.length;
l<k;
l++){if(m[l].u!==1){m[l].u=m[l].u-Math.floor(m[l].u)
}if(m[l].v!==1){m[l].v=m[l].v-Math.floor(m[l].v)
}}}},triangulateQuads:function(A){var z,y,x,w,v=[],u=[],t=[];
z=0;
for(y=A.faceUvs.length;
z<y;
z++){u[z]=[]
}z=0;
for(y=A.faceVertexUvs.length;
z<y;
z++){t[z]=[]
}z=0;
for(y=A.faces.length;
z<y;
z++){x=A.faces[z];
if(x instanceof THREE.Face4){w=x.a;
var s=x.b,q=x.c,r=x.d,n=new THREE.Face3,o=new THREE.Face3;
n.color.copy(x.color);
o.color.copy(x.color);
n.materialIndex=x.materialIndex;
o.materialIndex=x.materialIndex;
n.a=w;
n.b=s;
n.c=r;
o.a=s;
o.b=q;
o.c=r;
if(x.vertexColors.length===4){n.vertexColors[0]=x.vertexColors[0].clone();
n.vertexColors[1]=x.vertexColors[1].clone();
n.vertexColors[2]=x.vertexColors[3].clone();
o.vertexColors[0]=x.vertexColors[1].clone();
o.vertexColors[1]=x.vertexColors[2].clone();
o.vertexColors[2]=x.vertexColors[3].clone()
}v.push(n,o);
x=0;
for(w=A.faceVertexUvs.length;
x<w;
x++){if(A.faceVertexUvs[x].length){n=A.faceVertexUvs[x][z];
s=n[1];
q=n[2];
r=n[3];
n=[n[0].clone(),s.clone(),r.clone()];
s=[s.clone(),q.clone(),r.clone()];
t[x].push(n,s)
}}x=0;
for(w=A.faceUvs.length;
x<w;
x++){if(A.faceUvs[x].length){s=A.faceUvs[x][z];
u[x].push(s,s)
}}}else{v.push(x);
x=0;
for(w=A.faceUvs.length;
x<w;
x++){u[x].push(A.faceUvs[x])
}x=0;
for(w=A.faceVertexUvs.length;
x<w;
x++){t[x].push(A.faceVertexUvs[x])
}}}A.faces=v;
A.faceUvs=u;
A.faceVertexUvs=t;
A.computeCentroids();
A.computeFaceNormals();
A.computeVertexNormals();
A.hasTangents&&A.computeTangents()
},explode:function(u){for(var t=[],s=0,r=u.faces.length;
s<r;
s++){var q=t.length,p=u.faces[s];
if(p instanceof THREE.Face4){var o=p.a,n=p.b,m=p.c,o=u.vertices[o],n=u.vertices[n],m=u.vertices[m],k=u.vertices[p.d];
t.push(o.clone());
t.push(n.clone());
t.push(m.clone());
t.push(k.clone());
p.a=q;
p.b=q+1;
p.c=q+2;
p.d=q+3
}else{o=p.a;
n=p.b;
m=p.c;
o=u.vertices[o];
n=u.vertices[n];
m=u.vertices[m];
t.push(o.clone());
t.push(n.clone());
t.push(m.clone());
p.a=q;
p.b=q+1;
p.c=q+2
}}u.vertices=t;
delete u.__tmpVertices
},tessellate:function(U,T){var S,R,Q,P,O,N,M,K,L,F,J,G,E,I,D,A,B,v,C,z=[],x=[];
S=0;
for(R=U.faceVertexUvs.length;
S<R;
S++){x[S]=[]
}S=0;
for(R=U.faces.length;
S<R;
S++){Q=U.faces[S];
if(Q instanceof THREE.Face3){P=Q.a;
O=Q.b;
N=Q.c;
K=U.vertices[P];
L=U.vertices[O];
F=U.vertices[N];
G=K.distanceTo(L);
E=L.distanceTo(F);
J=K.distanceTo(F);
if(G>T||E>T||J>T){M=U.vertices.length;
v=Q.clone();
C=Q.clone();
if(G>=E&&G>=J){K=K.clone();
K.lerpSelf(L,0.5);
v.a=P;
v.b=M;
v.c=N;
C.a=M;
C.b=O;
C.c=N;
if(Q.vertexNormals.length===3){P=Q.vertexNormals[0].clone();
P.lerpSelf(Q.vertexNormals[1],0.5);
v.vertexNormals[1].copy(P);
C.vertexNormals[0].copy(P)
}if(Q.vertexColors.length===3){P=Q.vertexColors[0].clone();
P.lerpSelf(Q.vertexColors[1],0.5);
v.vertexColors[1].copy(P);
C.vertexColors[0].copy(P)
}Q=0
}else{if(E>=G&&E>=J){K=L.clone();
K.lerpSelf(F,0.5);
v.a=P;
v.b=O;
v.c=M;
C.a=M;
C.b=N;
C.c=P;
if(Q.vertexNormals.length===3){P=Q.vertexNormals[1].clone();
P.lerpSelf(Q.vertexNormals[2],0.5);
v.vertexNormals[2].copy(P);
C.vertexNormals[0].copy(P);
C.vertexNormals[1].copy(Q.vertexNormals[2]);
C.vertexNormals[2].copy(Q.vertexNormals[0])
}if(Q.vertexColors.length===3){P=Q.vertexColors[1].clone();
P.lerpSelf(Q.vertexColors[2],0.5);
v.vertexColors[2].copy(P);
C.vertexColors[0].copy(P);
C.vertexColors[1].copy(Q.vertexColors[2]);
C.vertexColors[2].copy(Q.vertexColors[0])
}Q=1
}else{K=K.clone();
K.lerpSelf(F,0.5);
v.a=P;
v.b=O;
v.c=M;
C.a=M;
C.b=O;
C.c=N;
if(Q.vertexNormals.length===3){P=Q.vertexNormals[0].clone();
P.lerpSelf(Q.vertexNormals[2],0.5);
v.vertexNormals[2].copy(P);
C.vertexNormals[0].copy(P)
}if(Q.vertexColors.length===3){P=Q.vertexColors[0].clone();
P.lerpSelf(Q.vertexColors[2],0.5);
v.vertexColors[2].copy(P);
C.vertexColors[0].copy(P)
}Q=2
}}z.push(v,C);
U.vertices.push(K);
P=0;
for(O=U.faceVertexUvs.length;
P<O;
P++){if(U.faceVertexUvs[P].length){K=U.faceVertexUvs[P][S];
C=K[0];
N=K[1];
v=K[2];
if(Q===0){L=C.clone();
L.lerpSelf(N,0.5);
K=[C.clone(),L.clone(),v.clone()];
N=[L.clone(),N.clone(),v.clone()]
}else{if(Q===1){L=N.clone();
L.lerpSelf(v,0.5);
K=[C.clone(),N.clone(),L.clone()];
N=[L.clone(),v.clone(),C.clone()]
}else{L=C.clone();
L.lerpSelf(v,0.5);
K=[C.clone(),N.clone(),L.clone()];
N=[L.clone(),N.clone(),v.clone()]
}}x[P].push(K,N)
}}}else{z.push(Q);
P=0;
for(O=U.faceVertexUvs.length;
P<O;
P++){x[P].push(U.faceVertexUvs[P][S])
}}}else{P=Q.a;
O=Q.b;
N=Q.c;
M=Q.d;
K=U.vertices[P];
L=U.vertices[O];
F=U.vertices[N];
J=U.vertices[M];
G=K.distanceTo(L);
E=L.distanceTo(F);
I=F.distanceTo(J);
D=K.distanceTo(J);
if(G>T||E>T||I>T||D>T){A=U.vertices.length;
B=U.vertices.length+1;
v=Q.clone();
C=Q.clone();
if(G>=E&&G>=I&&G>=D||I>=E&&I>=G&&I>=D){G=K.clone();
G.lerpSelf(L,0.5);
L=F.clone();
L.lerpSelf(J,0.5);
v.a=P;
v.b=A;
v.c=B;
v.d=M;
C.a=A;
C.b=O;
C.c=N;
C.d=B;
if(Q.vertexNormals.length===4){P=Q.vertexNormals[0].clone();
P.lerpSelf(Q.vertexNormals[1],0.5);
O=Q.vertexNormals[2].clone();
O.lerpSelf(Q.vertexNormals[3],0.5);
v.vertexNormals[1].copy(P);
v.vertexNormals[2].copy(O);
C.vertexNormals[0].copy(P);
C.vertexNormals[3].copy(O)
}if(Q.vertexColors.length===4){P=Q.vertexColors[0].clone();
P.lerpSelf(Q.vertexColors[1],0.5);
O=Q.vertexColors[2].clone();
O.lerpSelf(Q.vertexColors[3],0.5);
v.vertexColors[1].copy(P);
v.vertexColors[2].copy(O);
C.vertexColors[0].copy(P);
C.vertexColors[3].copy(O)
}Q=0
}else{G=L.clone();
G.lerpSelf(F,0.5);
L=J.clone();
L.lerpSelf(K,0.5);
v.a=P;
v.b=O;
v.c=A;
v.d=B;
C.a=B;
C.b=A;
C.c=N;
C.d=M;
if(Q.vertexNormals.length===4){P=Q.vertexNormals[1].clone();
P.lerpSelf(Q.vertexNormals[2],0.5);
O=Q.vertexNormals[3].clone();
O.lerpSelf(Q.vertexNormals[0],0.5);
v.vertexNormals[2].copy(P);
v.vertexNormals[3].copy(O);
C.vertexNormals[0].copy(O);
C.vertexNormals[1].copy(P)
}if(Q.vertexColors.length===4){P=Q.vertexColors[1].clone();
P.lerpSelf(Q.vertexColors[2],0.5);
O=Q.vertexColors[3].clone();
O.lerpSelf(Q.vertexColors[0],0.5);
v.vertexColors[2].copy(P);
v.vertexColors[3].copy(O);
C.vertexColors[0].copy(O);
C.vertexColors[1].copy(P)
}Q=1
}z.push(v,C);
U.vertices.push(G,L);
P=0;
for(O=U.faceVertexUvs.length;
P<O;
P++){if(U.faceVertexUvs[P].length){K=U.faceVertexUvs[P][S];
C=K[0];
N=K[1];
v=K[2];
K=K[3];
if(Q===0){L=C.clone();
L.lerpSelf(N,0.5);
F=v.clone();
F.lerpSelf(K,0.5);
C=[C.clone(),L.clone(),F.clone(),K.clone()];
N=[L.clone(),N.clone(),v.clone(),F.clone()]
}else{L=N.clone();
L.lerpSelf(v,0.5);
F=K.clone();
F.lerpSelf(C,0.5);
C=[C.clone(),N.clone(),L.clone(),F.clone()];
N=[F.clone(),L.clone(),v.clone(),K.clone()]
}x[P].push(C,N)
}}}else{z.push(Q);
P=0;
for(O=U.faceVertexUvs.length;
P<O;
P++){x[P].push(U.faceVertexUvs[P][S])
}}}}U.faces=z;
U.faceVertexUvs=x
}};
THREE.GeometryUtils.random=THREE.Math.random16;
THREE.GeometryUtils.__v1=new THREE.Vector3;
THREE.ImageUtils={crossOrigin:"anonymous",loadTexture:function(g,f,l){var k=new Image,h=new THREE.Texture(k,f);
k.onload=function(){h.needsUpdate=true;
l&&l(this)
};
k.crossOrigin=this.crossOrigin;
k.src=g;
return h
},loadTextureCube:function(h,g,n){var m,l=[],k=new THREE.Texture(l,g),g=l.loadCount=0;
for(m=h.length;
g<m;
++g){l[g]=new Image;
l[g].onload=function(){l.loadCount=l.loadCount+1;
if(l.loadCount===6){k.needsUpdate=true
}n&&n(this)
};
l[g].crossOrigin=this.crossOrigin;
l[g].src=h[g]
}return k
},getNormalMap:function(M,L){var K=function(d){var c=Math.sqrt(d[0]*d[0]+d[1]*d[1]+d[2]*d[2]);
return[d[0]/c,d[1]/c,d[2]/c]
},L=L|1,J=M.width,I=M.height,H=document.createElement("canvas");
H.width=J;
H.height=I;
var G=H.getContext("2d");
G.drawImage(M,0,0);
for(var F=G.getImageData(0,0,J,I).data,E=G.createImageData(J,I),C=E.data,D=0;
D<J;
D++){for(var y=0;
y<I;
y++){var B=y-1<0?0:y-1,z=y+1>I-1?I-1:y+1,x=D-1<0?0:D-1,A=D+1>J-1?J-1:D+1,w=[],s=[0,0,F[(y*J+D)*4]/255*L];
w.push([-1,0,F[(y*J+x)*4]/255*L]);
w.push([-1,-1,F[(B*J+x)*4]/255*L]);
w.push([0,-1,F[(B*J+D)*4]/255*L]);
w.push([1,-1,F[(B*J+A)*4]/255*L]);
w.push([1,0,F[(y*J+A)*4]/255*L]);
w.push([1,1,F[(z*J+A)*4]/255*L]);
w.push([0,1,F[(z*J+D)*4]/255*L]);
w.push([-1,1,F[(z*J+x)*4]/255*L]);
B=[];
x=w.length;
for(z=0;
z<x;
z++){var A=w[z],v=w[(z+1)%x],A=[A[0]-s[0],A[1]-s[1],A[2]-s[2]],v=[v[0]-s[0],v[1]-s[1],v[2]-s[2]];
B.push(K([A[1]*v[2]-A[2]*v[1],A[2]*v[0]-A[0]*v[2],A[0]*v[1]-A[1]*v[0]]))
}w=[0,0,0];
for(z=0;
z<B.length;
z++){w[0]=w[0]+B[z][0];
w[1]=w[1]+B[z][1];
w[2]=w[2]+B[z][2]
}w[0]=w[0]/B.length;
w[1]=w[1]/B.length;
w[2]=w[2]/B.length;
s=(y*J+D)*4;
C[s]=(w[0]+1)/2*255|0;
C[s+1]=(w[1]+0.5)*255|0;
C[s+2]=w[2]*255|0;
C[s+3]=255
}}G.putImageData(E,0,0);
return H
},generateDataTexture:function(l,k,r){for(var q=l*k,p=new Uint8Array(3*q),o=Math.floor(r.r*255),n=Math.floor(r.g*255),r=Math.floor(r.b*255),m=0;
m<q;
m++){p[m*3]=o;
p[m*3+1]=n;
p[m*3+2]=r
}l=new THREE.DataTexture(p,l,k,THREE.RGBFormat);
l.needsUpdate=true;
return l
}};
THREE.SceneUtils={showHierarchy:function(d,c){THREE.SceneUtils.traverseHierarchy(d,function(b){b.visible=c
})
},traverseHierarchy:function(g,f){var l,k,h=g.children.length;
for(k=0;
k<h;
k++){l=g.children[k];
f(l);
THREE.SceneUtils.traverseHierarchy(l,f)
}},createMultiMaterialObject:function(h,g){var n,m=g.length,l=new THREE.Object3D;
for(n=0;
n<m;
n++){var k=new THREE.Mesh(h,g[n]);
l.add(k)
}return l
},cloneObject:function(f){var e;
if(f instanceof THREE.MorphAnimMesh){e=new THREE.MorphAnimMesh(f.geometry,f.material);
e.duration=f.duration;
e.mirroredLoop=f.mirroredLoop;
e.time=f.time;
e.lastKeyframe=f.lastKeyframe;
e.currentKeyframe=f.currentKeyframe;
e.direction=f.direction;
e.directionBackwards=f.directionBackwards
}else{if(f instanceof THREE.SkinnedMesh){e=new THREE.SkinnedMesh(f.geometry,f.material)
}else{if(f instanceof THREE.Mesh){e=new THREE.Mesh(f.geometry,f.material)
}else{if(f instanceof THREE.Line){e=new THREE.Line(f.geometry,f.material,f.type)
}else{if(f instanceof THREE.Ribbon){e=new THREE.Ribbon(f.geometry,f.material)
}else{if(f instanceof THREE.ParticleSystem){e=new THREE.ParticleSystem(f.geometry,f.material);
e.sortParticles=f.sortParticles
}else{if(f instanceof THREE.Particle){e=new THREE.Particle(f.material)
}else{if(f instanceof THREE.Sprite){e=new THREE.Sprite({});
e.color.copy(f.color);
e.map=f.map;
e.blending=f.blending;
e.useScreenCoordinates=f.useScreenCoordinates;
e.mergeWith3D=f.mergeWith3D;
e.affectedByDistance=f.affectedByDistance;
e.scaleByViewport=f.scaleByViewport;
e.alignment=f.alignment;
e.rotation3d.copy(f.rotation3d);
e.rotation=f.rotation;
e.opacity=f.opacity;
e.uvOffset.copy(f.uvOffset);
e.uvScale.copy(f.uvScale)
}else{f instanceof THREE.LOD?e=new THREE.LOD:f instanceof THREE.Object3D&&(e=new THREE.Object3D)
}}}}}}}}e.name=f.name;
e.parent=f.parent;
e.up.copy(f.up);
e.position.copy(f.position);
e.rotation instanceof THREE.Vector3&&e.rotation.copy(f.rotation);
e.eulerOrder=f.eulerOrder;
e.scale.copy(f.scale);
e.dynamic=f.dynamic;
e.doubleSided=f.doubleSided;
e.flipSided=f.flipSided;
e.renderDepth=f.renderDepth;
e.rotationAutoUpdate=f.rotationAutoUpdate;
e.matrix.copy(f.matrix);
e.matrixWorld.copy(f.matrixWorld);
e.matrixRotationWorld.copy(f.matrixRotationWorld);
e.matrixAutoUpdate=f.matrixAutoUpdate;
e.matrixWorldNeedsUpdate=f.matrixWorldNeedsUpdate;
e.quaternion.copy(f.quaternion);
e.useQuaternion=f.useQuaternion;
e.boundRadius=f.boundRadius;
e.boundRadiusScale=f.boundRadiusScale;
e.visible=f.visible;
e.castShadow=f.castShadow;
e.receiveShadow=f.receiveShadow;
e.frustumCulled=f.frustumCulled;
for(var h=0;
h<f.children.length;
h++){var g=THREE.SceneUtils.cloneObject(f.children[h]);
e.children[h]=g;
g.parent=e
}if(f instanceof THREE.LOD){for(h=0;
h<f.LODs.length;
h++){e.LODs[h]={visibleAtDistance:f.LODs[h].visibleAtDistance,object3D:e.children[h]}
}}return e
},detach:function(e,d,f){e.applyMatrix(d.matrixWorld);
d.remove(e);
f.add(e)
},attach:function(f,e,h){var g=new THREE.Matrix4;
g.getInverse(h.matrixWorld);
f.applyMatrix(g);
e.remove(f);
h.add(f)
}};
THREE.WebGLRenderer&&(THREE.ShaderUtils={lib:{fresnel:{uniforms:{mRefractionRatio:{type:"f",value:1.02},mFresnelBias:{type:"f",value:0.1},mFresnelPower:{type:"f",value:2},mFresnelScale:{type:"f",value:1},tCube:{type:"t",value:1,texture:null}},fragmentShader:"uniform samplerCube tCube;\nvarying vec3 vReflect;\nvarying vec3 vRefract[3];\nvarying float vReflectionFactor;\nvoid main() {\nvec4 reflectedColor = textureCube( tCube, vec3( -vReflect.x, vReflect.yz ) );\nvec4 refractedColor = vec4( 1.0, 1.0, 1.0, 1.0 );\nrefractedColor.r = textureCube( tCube, vec3( -vRefract[0].x, vRefract[0].yz ) ).r;\nrefractedColor.g = textureCube( tCube, vec3( -vRefract[1].x, vRefract[1].yz ) ).g;\nrefractedColor.b = textureCube( tCube, vec3( -vRefract[2].x, vRefract[2].yz ) ).b;\nrefractedColor.a = 1.0;\ngl_FragColor = mix( refractedColor, reflectedColor, clamp( vReflectionFactor, 0.0, 1.0 ) );\n}",vertexShader:"uniform float mRefractionRatio;\nuniform float mFresnelBias;\nuniform float mFresnelScale;\nuniform float mFresnelPower;\nvarying vec3 vReflect;\nvarying vec3 vRefract[3];\nvarying float vReflectionFactor;\nvoid main() {\nvec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\nvec4 mPosition = objectMatrix * vec4( position, 1.0 );\nvec3 nWorld = normalize ( mat3( objectMatrix[0].xyz, objectMatrix[1].xyz, objectMatrix[2].xyz ) * normal );\nvec3 I = mPosition.xyz - cameraPosition;\nvReflect = reflect( I, nWorld );\nvRefract[0] = refract( normalize( I ), nWorld, mRefractionRatio );\nvRefract[1] = refract( normalize( I ), nWorld, mRefractionRatio * 0.99 );\nvRefract[2] = refract( normalize( I ), nWorld, mRefractionRatio * 0.98 );\nvReflectionFactor = mFresnelBias + mFresnelScale * pow( 1.0 + dot( normalize( I ), nWorld ), mFresnelPower );\ngl_Position = projectionMatrix * mvPosition;\n}"},normal:{uniforms:THREE.UniformsUtils.merge([THREE.UniformsLib.fog,THREE.UniformsLib.lights,THREE.UniformsLib.shadowmap,{enableAO:{type:"i",value:0},enableDiffuse:{type:"i",value:0},enableSpecular:{type:"i",value:0},enableReflection:{type:"i",value:0},tDiffuse:{type:"t",value:0,texture:null},tCube:{type:"t",value:1,texture:null},tNormal:{type:"t",value:2,texture:null},tSpecular:{type:"t",value:3,texture:null},tAO:{type:"t",value:4,texture:null},tDisplacement:{type:"t",value:5,texture:null},uNormalScale:{type:"f",value:1},uDisplacementBias:{type:"f",value:0},uDisplacementScale:{type:"f",value:1},uDiffuseColor:{type:"c",value:new THREE.Color(16777215)},uSpecularColor:{type:"c",value:new THREE.Color(1118481)},uAmbientColor:{type:"c",value:new THREE.Color(16777215)},uShininess:{type:"f",value:30},uOpacity:{type:"f",value:1},uReflectivity:{type:"f",value:0.5},uOffset:{type:"v2",value:new THREE.Vector2(0,0)},uRepeat:{type:"v2",value:new THREE.Vector2(1,1)},wrapRGB:{type:"v3",value:new THREE.Vector3(1,1,1)}}]),fragmentShader:["uniform vec3 uAmbientColor;\nuniform vec3 uDiffuseColor;\nuniform vec3 uSpecularColor;\nuniform float uShininess;\nuniform float uOpacity;\nuniform bool enableDiffuse;\nuniform bool enableSpecular;\nuniform bool enableAO;\nuniform bool enableReflection;\nuniform sampler2D tDiffuse;\nuniform sampler2D tNormal;\nuniform sampler2D tSpecular;\nuniform sampler2D tAO;\nuniform samplerCube tCube;\nuniform float uNormalScale;\nuniform float uReflectivity;\nvarying vec3 vTangent;\nvarying vec3 vBinormal;\nvarying vec3 vNormal;\nvarying vec2 vUv;\nuniform vec3 ambientLightColor;\n#if MAX_DIR_LIGHTS > 0\nuniform vec3 directionalLightColor[ MAX_DIR_LIGHTS ];\nuniform vec3 directionalLightDirection[ MAX_DIR_LIGHTS ];\n#endif\n#if MAX_POINT_LIGHTS > 0\nuniform vec3 pointLightColor[ MAX_POINT_LIGHTS ];\nvarying vec4 vPointLight[ MAX_POINT_LIGHTS ];\n#endif\n#ifdef WRAP_AROUND\nuniform vec3 wrapRGB;\n#endif\nvarying vec3 vViewPosition;",THREE.ShaderChunk.shadowmap_pars_fragment,THREE.ShaderChunk.fog_pars_fragment,"void main() {\ngl_FragColor = vec4( vec3( 1.0 ), uOpacity );\nvec3 specularTex = vec3( 1.0 );\nvec3 normalTex = texture2D( tNormal, vUv ).xyz * 2.0 - 1.0;\nnormalTex.xy *= uNormalScale;\nnormalTex = normalize( normalTex );\nif( enableDiffuse ) {\n#ifdef GAMMA_INPUT\nvec4 texelColor = texture2D( tDiffuse, vUv );\ntexelColor.xyz *= texelColor.xyz;\ngl_FragColor = gl_FragColor * texelColor;\n#else\ngl_FragColor = gl_FragColor * texture2D( tDiffuse, vUv );\n#endif\n}\nif( enableAO ) {\n#ifdef GAMMA_INPUT\nvec4 aoColor = texture2D( tAO, vUv );\naoColor.xyz *= aoColor.xyz;\ngl_FragColor.xyz = gl_FragColor.xyz * aoColor.xyz;\n#else\ngl_FragColor.xyz = gl_FragColor.xyz * texture2D( tAO, vUv ).xyz;\n#endif\n}\nif( enableSpecular )\nspecularTex = texture2D( tSpecular, vUv ).xyz;\nmat3 tsb = mat3( normalize( vTangent ), normalize( vBinormal ), normalize( vNormal ) );\nvec3 finalNormal = tsb * normalTex;\nvec3 normal = normalize( finalNormal );\nvec3 viewPosition = normalize( vViewPosition );\n#if MAX_POINT_LIGHTS > 0\nvec3 pointDiffuse = vec3( 0.0 );\nvec3 pointSpecular = vec3( 0.0 );\nfor ( int i = 0; i < MAX_POINT_LIGHTS; i ++ ) {\nvec3 pointVector = normalize( vPointLight[ i ].xyz );\nfloat pointDistance = vPointLight[ i ].w;\n#ifdef WRAP_AROUND\nfloat pointDiffuseWeightFull = max( dot( normal, pointVector ), 0.0 );\nfloat pointDiffuseWeightHalf = max( 0.5 * dot( normal, pointVector ) + 0.5, 0.0 );\nvec3 pointDiffuseWeight = mix( vec3 ( pointDiffuseWeightFull ), vec3( pointDiffuseWeightHalf ), wrapRGB );\n#else\nfloat pointDiffuseWeight = max( dot( normal, pointVector ), 0.0 );\n#endif\npointDiffuse += pointDistance * pointLightColor[ i ] * uDiffuseColor * pointDiffuseWeight;\nvec3 pointHalfVector = normalize( pointVector + viewPosition );\nfloat pointDotNormalHalf = max( dot( normal, pointHalfVector ), 0.0 );\nfloat pointSpecularWeight = specularTex.r * max( pow( pointDotNormalHalf, uShininess ), 0.0 );\n#ifdef PHYSICALLY_BASED_SHADING\nfloat specularNormalization = ( uShininess + 2.0001 ) / 8.0;\nvec3 schlick = uSpecularColor + vec3( 1.0 - uSpecularColor ) * pow( 1.0 - dot( pointVector, pointHalfVector ), 5.0 );\npointSpecular += schlick * pointLightColor[ i ] * pointSpecularWeight * pointDiffuseWeight * pointDistance * specularNormalization;\n#else\npointSpecular += pointDistance * pointLightColor[ i ] * uSpecularColor * pointSpecularWeight * pointDiffuseWeight;\n#endif\n}\n#endif\n#if MAX_DIR_LIGHTS > 0\nvec3 dirDiffuse = vec3( 0.0 );\nvec3 dirSpecular = vec3( 0.0 );\nfor( int i = 0; i < MAX_DIR_LIGHTS; i++ ) {\nvec4 lDirection = viewMatrix * vec4( directionalLightDirection[ i ], 0.0 );\nvec3 dirVector = normalize( lDirection.xyz );\n#ifdef WRAP_AROUND\nfloat directionalLightWeightingFull = max( dot( normal, dirVector ), 0.0 );\nfloat directionalLightWeightingHalf = max( 0.5 * dot( normal, dirVector ) + 0.5, 0.0 );\nvec3 dirDiffuseWeight = mix( vec3( directionalLightWeightingFull ), vec3( directionalLightWeightingHalf ), wrapRGB );\n#else\nfloat dirDiffuseWeight = max( dot( normal, dirVector ), 0.0 );\n#endif\ndirDiffuse += directionalLightColor[ i ] * uDiffuseColor * dirDiffuseWeight;\nvec3 dirHalfVector = normalize( dirVector + viewPosition );\nfloat dirDotNormalHalf = max( dot( normal, dirHalfVector ), 0.0 );\nfloat dirSpecularWeight = specularTex.r * max( pow( dirDotNormalHalf, uShininess ), 0.0 );\n#ifdef PHYSICALLY_BASED_SHADING\nfloat specularNormalization = ( uShininess + 2.0001 ) / 8.0;\nvec3 schlick = uSpecularColor + vec3( 1.0 - uSpecularColor ) * pow( 1.0 - dot( dirVector, dirHalfVector ), 5.0 );\ndirSpecular += schlick * directionalLightColor[ i ] * dirSpecularWeight * dirDiffuseWeight * specularNormalization;\n#else\ndirSpecular += directionalLightColor[ i ] * uSpecularColor * dirSpecularWeight * dirDiffuseWeight;\n#endif\n}\n#endif\nvec3 totalDiffuse = vec3( 0.0 );\nvec3 totalSpecular = vec3( 0.0 );\n#if MAX_DIR_LIGHTS > 0\ntotalDiffuse += dirDiffuse;\ntotalSpecular += dirSpecular;\n#endif\n#if MAX_POINT_LIGHTS > 0\ntotalDiffuse += pointDiffuse;\ntotalSpecular += pointSpecular;\n#endif\ngl_FragColor.xyz = gl_FragColor.xyz * ( totalDiffuse + ambientLightColor * uAmbientColor) + totalSpecular;\nif ( enableReflection ) {\nvec3 wPos = cameraPosition - vViewPosition;\nvec3 vReflect = reflect( normalize( wPos ), normal );\nvec4 cubeColor = textureCube( tCube, vec3( -vReflect.x, vReflect.yz ) );\n#ifdef GAMMA_INPUT\ncubeColor.xyz *= cubeColor.xyz;\n#endif\ngl_FragColor.xyz = mix( gl_FragColor.xyz, cubeColor.xyz, specularTex.r * uReflectivity );\n}",THREE.ShaderChunk.shadowmap_fragment,THREE.ShaderChunk.linear_to_gamma_fragment,THREE.ShaderChunk.fog_fragment,"}"].join("\n"),vertexShader:["attribute vec4 tangent;\nuniform vec2 uOffset;\nuniform vec2 uRepeat;\n#ifdef VERTEX_TEXTURES\nuniform sampler2D tDisplacement;\nuniform float uDisplacementScale;\nuniform float uDisplacementBias;\n#endif\nvarying vec3 vTangent;\nvarying vec3 vBinormal;\nvarying vec3 vNormal;\nvarying vec2 vUv;\n#if MAX_POINT_LIGHTS > 0\nuniform vec3 pointLightPosition[ MAX_POINT_LIGHTS ];\nuniform float pointLightDistance[ MAX_POINT_LIGHTS ];\nvarying vec4 vPointLight[ MAX_POINT_LIGHTS ];\n#endif\nvarying vec3 vViewPosition;",THREE.ShaderChunk.shadowmap_pars_vertex,"void main() {\nvec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\nvViewPosition = -mvPosition.xyz;\nvNormal = normalMatrix * normal;\nvTangent = normalMatrix * tangent.xyz;\nvBinormal = cross( vNormal, vTangent ) * tangent.w;\nvUv = uv * uRepeat + uOffset;\n#if MAX_POINT_LIGHTS > 0\nfor( int i = 0; i < MAX_POINT_LIGHTS; i++ ) {\nvec4 lPosition = viewMatrix * vec4( pointLightPosition[ i ], 1.0 );\nvec3 lVector = lPosition.xyz - mvPosition.xyz;\nfloat lDistance = 1.0;\nif ( pointLightDistance[ i ] > 0.0 )\nlDistance = 1.0 - min( ( length( lVector ) / pointLightDistance[ i ] ), 1.0 );\nlVector = normalize( lVector );\nvPointLight[ i ] = vec4( lVector, lDistance );\n}\n#endif\n#ifdef VERTEX_TEXTURES\nvec3 dv = texture2D( tDisplacement, uv ).xyz;\nfloat df = uDisplacementScale * dv.x + uDisplacementBias;\nvec4 displacedPosition = vec4( normalize( vNormal.xyz ) * df, 0.0 ) + mvPosition;\ngl_Position = projectionMatrix * displacedPosition;\n#else\ngl_Position = projectionMatrix * mvPosition;\n#endif",THREE.ShaderChunk.shadowmap_vertex,"}"].join("\n")},cube:{uniforms:{tCube:{type:"t",value:1,texture:null},tFlip:{type:"f",value:-1}},vertexShader:"varying vec3 vViewPosition;\nvoid main() {\nvec4 mPosition = objectMatrix * vec4( position, 1.0 );\nvViewPosition = cameraPosition - mPosition.xyz;\ngl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}",fragmentShader:"uniform samplerCube tCube;\nuniform float tFlip;\nvarying vec3 vViewPosition;\nvoid main() {\nvec3 wPos = cameraPosition - vViewPosition;\ngl_FragColor = textureCube( tCube, vec3( tFlip * wPos.x, wPos.yz ) );\n}"}}});
THREE.BufferGeometry=function(){this.id=THREE.GeometryCount++;
this.vertexColorArray=this.vertexUvArray=this.vertexNormalArray=this.vertexPositionArray=this.vertexIndexArray=this.vertexColorBuffer=this.vertexUvBuffer=this.vertexNormalBuffer=this.vertexPositionBuffer=this.vertexIndexBuffer=null;
this.dynamic=false;
this.boundingSphere=this.boundingBox=null;
this.morphTargets=[]
};
THREE.BufferGeometry.prototype={constructor:THREE.BufferGeometry,computeBoundingBox:function(){},computeBoundingSphere:function(){}};
THREE.Curve=function(){};
THREE.Curve.prototype.getPoint=function(){console.log("Warning, getPoint() not implemented!");
return null
};
THREE.Curve.prototype.getPointAt=function(b){return this.getPoint(this.getUtoTmapping(b))
};
THREE.Curve.prototype.getPoints=function(e){e||(e=5);
var d,f=[];
for(d=0;
d<=e;
d++){f.push(this.getPoint(d/e))
}return f
};
THREE.Curve.prototype.getSpacedPoints=function(e){e||(e=5);
var d,f=[];
for(d=0;
d<=e;
d++){f.push(this.getPointAt(d/e))
}return f
};
THREE.Curve.prototype.getLength=function(){var b=this.getLengths();
return b[b.length-1]
};
THREE.Curve.prototype.getLengths=function(h){h||(h=this.__arcLengthDivisions?this.__arcLengthDivisions:200);
if(this.cacheArcLengths&&this.cacheArcLengths.length==h+1&&!this.needsUpdate){return this.cacheArcLengths
}this.needsUpdate=false;
var g=[],n,m=this.getPoint(0),l,k=0;
g.push(0);
for(l=1;
l<=h;
l++){n=this.getPoint(l/h);
k=k+n.distanceTo(m);
g.push(k);
m=n
}return this.cacheArcLengths=g
};
THREE.Curve.prototype.updateArcLengths=function(){this.needsUpdate=true;
this.getLengths()
};
THREE.Curve.prototype.getUtoTmapping=function(s,r){var q=this.getLengths(),p=0,o=q.length,n;
n=r?r:s*q[o-1];
for(var m=0,l=o-1,k;
m<=l;
){p=Math.floor(m+(l-m)/2);
k=q[p]-n;
if(k<0){m=p+1
}else{if(k>0){l=p-1
}else{l=p;
break
}}}p=l;
if(q[p]==n){return p/(o-1)
}m=q[p];
return q=(p+(n-m)/(q[p+1]-m))/(o-1)
};
THREE.Curve.prototype.getNormalVector=function(b){b=this.getTangent(b);
return new THREE.Vector2(-b.y,b.x)
};
THREE.Curve.prototype.getTangent=function(d){var c=d-0.0001,d=d+0.0001;
c<0&&(c=0);
d>1&&(d=1);
c=this.getPoint(c);
return this.getPoint(d).clone().subSelf(c).normalize()
};
THREE.Curve.prototype.getTangentAt=function(b){return this.getTangent(this.getUtoTmapping(b))
};
THREE.LineCurve=function(d,c){this.v1=d;
this.v2=c
};
THREE.LineCurve.prototype=new THREE.Curve;
THREE.LineCurve.prototype.constructor=THREE.LineCurve;
THREE.LineCurve.prototype.getPoint=function(d){var c=this.v2.clone().subSelf(this.v1);
c.multiplyScalar(d).addSelf(this.v1);
return c
};
THREE.LineCurve.prototype.getPointAt=function(b){return this.getPoint(b)
};
THREE.LineCurve.prototype.getTangent=function(){return this.v2.clone().subSelf(this.v1).normalize()
};
THREE.QuadraticBezierCurve=function(e,d,f){this.v0=e;
this.v1=d;
this.v2=f
};
THREE.QuadraticBezierCurve.prototype=new THREE.Curve;
THREE.QuadraticBezierCurve.prototype.constructor=THREE.QuadraticBezierCurve;
THREE.QuadraticBezierCurve.prototype.getPoint=function(d){var c;
c=THREE.Shape.Utils.b2(d,this.v0.x,this.v1.x,this.v2.x);
d=THREE.Shape.Utils.b2(d,this.v0.y,this.v1.y,this.v2.y);
return new THREE.Vector2(c,d)
};
THREE.QuadraticBezierCurve.prototype.getTangent=function(d){var c;
c=THREE.Curve.Utils.tangentQuadraticBezier(d,this.v0.x,this.v1.x,this.v2.x);
d=THREE.Curve.Utils.tangentQuadraticBezier(d,this.v0.y,this.v1.y,this.v2.y);
c=new THREE.Vector2(c,d);
c.normalize();
return c
};
THREE.CubicBezierCurve=function(f,e,h,g){this.v0=f;
this.v1=e;
this.v2=h;
this.v3=g
};
THREE.CubicBezierCurve.prototype=new THREE.Curve;
THREE.CubicBezierCurve.prototype.constructor=THREE.CubicBezierCurve;
THREE.CubicBezierCurve.prototype.getPoint=function(d){var c;
c=THREE.Shape.Utils.b3(d,this.v0.x,this.v1.x,this.v2.x,this.v3.x);
d=THREE.Shape.Utils.b3(d,this.v0.y,this.v1.y,this.v2.y,this.v3.y);
return new THREE.Vector2(c,d)
};
THREE.CubicBezierCurve.prototype.getTangent=function(d){var c;
c=THREE.Curve.Utils.tangentCubicBezier(d,this.v0.x,this.v1.x,this.v2.x,this.v3.x);
d=THREE.Curve.Utils.tangentCubicBezier(d,this.v0.y,this.v1.y,this.v2.y,this.v3.y);
c=new THREE.Vector2(c,d);
c.normalize();
return c
};
THREE.SplineCurve=function(b){this.points=b==void 0?[]:b
};
THREE.SplineCurve.prototype=new THREE.Curve;
THREE.SplineCurve.prototype.constructor=THREE.SplineCurve;
THREE.SplineCurve.prototype.getPoint=function(g){var f=new THREE.Vector2,l=[],k=this.points,h;
h=(k.length-1)*g;
g=Math.floor(h);
h=h-g;
l[0]=g==0?g:g-1;
l[1]=g;
l[2]=g>k.length-2?k.length-1:g+1;
l[3]=g>k.length-3?k.length-1:g+2;
f.x=THREE.Curve.Utils.interpolate(k[l[0]].x,k[l[1]].x,k[l[2]].x,k[l[3]].x,h);
f.y=THREE.Curve.Utils.interpolate(k[l[0]].y,k[l[1]].y,k[l[2]].y,k[l[3]].y,h);
return f
};
THREE.ArcCurve=function(h,g,n,m,l,k){this.aX=h;
this.aY=g;
this.aRadius=n;
this.aStartAngle=m;
this.aEndAngle=l;
this.aClockwise=k
};
THREE.ArcCurve.prototype=new THREE.Curve;
THREE.ArcCurve.prototype.constructor=THREE.ArcCurve;
THREE.ArcCurve.prototype.getPoint=function(d){var c=this.aEndAngle-this.aStartAngle;
this.aClockwise||(d=1-d);
c=this.aStartAngle+d*c;
d=this.aX+this.aRadius*Math.cos(c);
c=this.aY+this.aRadius*Math.sin(c);
return new THREE.Vector2(d,c)
};
THREE.Curve.Utils={tangentQuadraticBezier:function(f,e,h,g){return 2*(1-f)*(h-e)+2*f*(g-h)
},tangentCubicBezier:function(g,f,l,k,h){return -3*f*(1-g)*(1-g)+3*l*(1-g)*(1-g)-6*g*l*(1-g)+6*g*k*(1-g)-3*g*g*k+3*g*g*h
},tangentSpline:function(b){return 6*b*b-6*b+(3*b*b-4*b+1)+(-6*b*b+6*b)+(3*b*b-2*b)
},interpolate:function(h,g,n,m,l){var h=(n-h)*0.5,m=(m-g)*0.5,k=l*l;
return(2*g-2*n+h+m)*l*k+(-3*g+3*n-2*h-m)*k+h*l+g
}};
THREE.Curve.create=function(d,c){d.prototype=new THREE.Curve;
d.prototype.constructor=d;
d.prototype.getPoint=c;
return d
};
THREE.LineCurve3=THREE.Curve.create(function(d,c){this.v1=d;
this.v2=c
},function(d){var c=new THREE.Vector3;
c.sub(this.v2,this.v1);
c.multiplyScalar(d);
c.addSelf(this.v1);
return c
});
THREE.QuadraticBezierCurve3=THREE.Curve.create(function(e,d,f){this.v0=e;
this.v1=d;
this.v2=f
},function(e){var d,f;
d=THREE.Shape.Utils.b2(e,this.v0.x,this.v1.x,this.v2.x);
f=THREE.Shape.Utils.b2(e,this.v0.y,this.v1.y,this.v2.y);
e=THREE.Shape.Utils.b2(e,this.v0.z,this.v1.z,this.v2.z);
return new THREE.Vector3(d,f,e)
});
THREE.CubicBezierCurve3=THREE.Curve.create(function(f,e,h,g){this.v0=f;
this.v1=e;
this.v2=h;
this.v3=g
},function(e){var d,f;
d=THREE.Shape.Utils.b3(e,this.v0.x,this.v1.x,this.v2.x,this.v3.x);
f=THREE.Shape.Utils.b3(e,this.v0.y,this.v1.y,this.v2.y,this.v3.y);
e=THREE.Shape.Utils.b3(e,this.v0.z,this.v1.z,this.v2.z,this.v3.z);
return new THREE.Vector3(d,f,e)
});
THREE.SplineCurve3=THREE.Curve.create(function(b){this.points=b==void 0?[]:b
},function(k){var h=new THREE.Vector3,p=[],o=this.points,n,k=(o.length-1)*k;
n=Math.floor(k);
k=k-n;
p[0]=n==0?n:n-1;
p[1]=n;
p[2]=n>o.length-2?o.length-1:n+1;
p[3]=n>o.length-3?o.length-1:n+2;
n=o[p[0]];
var m=o[p[1]],l=o[p[2]],p=o[p[3]];
h.x=THREE.Curve.Utils.interpolate(n.x,m.x,l.x,p.x,k);
h.y=THREE.Curve.Utils.interpolate(n.y,m.y,l.y,p.y,k);
h.z=THREE.Curve.Utils.interpolate(n.z,m.z,l.z,p.z,k);
return h
});
THREE.ClosedSplineCurve3=THREE.Curve.create(function(b){this.points=b==void 0?[]:b
},function(g){var f=new THREE.Vector3,l=[],k=this.points,h;
h=(k.length-0)*g;
g=Math.floor(h);
h=h-g;
g=g+(g>0?0:(Math.floor(Math.abs(g)/k.length)+1)*k.length);
l[0]=(g-1)%k.length;
l[1]=g%k.length;
l[2]=(g+1)%k.length;
l[3]=(g+2)%k.length;
f.x=THREE.Curve.Utils.interpolate(k[l[0]].x,k[l[1]].x,k[l[2]].x,k[l[3]].x,h);
f.y=THREE.Curve.Utils.interpolate(k[l[0]].y,k[l[1]].y,k[l[2]].y,k[l[3]].y,h);
f.z=THREE.Curve.Utils.interpolate(k[l[0]].z,k[l[1]].z,k[l[2]].z,k[l[3]].z,h);
return f
});
THREE.CurvePath=function(){this.curves=[];
this.bends=[];
this.autoClose=false
};
THREE.CurvePath.prototype=new THREE.Curve;
THREE.CurvePath.prototype.constructor=THREE.CurvePath;
THREE.CurvePath.prototype.add=function(b){this.curves.push(b)
};
THREE.CurvePath.prototype.checkConnection=function(){};
THREE.CurvePath.prototype.closePath=function(){var d=this.curves[0].getPoint(0),c=this.curves[this.curves.length-1].getPoint(1);
d.equals(c)||this.curves.push(new THREE.LineCurve(c,d))
};
THREE.CurvePath.prototype.getPoint=function(e){for(var d=e*this.getLength(),f=this.getCurveLengths(),e=0;
e<f.length;
){if(f[e]>=d){d=f[e]-d;
e=this.curves[e];
d=1-d/e.getLength();
return e.getPointAt(d)
}e++
}return null
};
THREE.CurvePath.prototype.getLength=function(){var b=this.getCurveLengths();
return b[b.length-1]
};
THREE.CurvePath.prototype.getCurveLengths=function(){if(this.cacheLengths&&this.cacheLengths.length==this.curves.length){return this.cacheLengths
}var f=[],e=0,h,g=this.curves.length;
for(h=0;
h<g;
h++){e=e+this.curves[h].getLength();
f.push(e)
}return this.cacheLengths=f
};
THREE.CurvePath.prototype.getBoundingBox=function(){var s=this.getPoints(),r,q,p,o;
r=q=Number.NEGATIVE_INFINITY;
p=o=Number.POSITIVE_INFINITY;
var n,m,l,k;
k=new THREE.Vector2;
m=0;
for(l=s.length;
m<l;
m++){n=s[m];
if(n.x>r){r=n.x
}else{if(n.x<p){p=n.x
}}if(n.y>q){q=n.y
}else{if(n.y<q){o=n.y
}}k.addSelf(n.x,n.y)
}return{minX:p,minY:o,maxX:r,maxY:q,centroid:k.divideScalar(l)}
};
THREE.CurvePath.prototype.createPointsGeometry=function(b){return this.createGeometry(this.getPoints(b,true))
};
THREE.CurvePath.prototype.createSpacedPointsGeometry=function(b){return this.createGeometry(this.getSpacedPoints(b,true))
};
THREE.CurvePath.prototype.createGeometry=function(e){for(var d=new THREE.Geometry,f=0;
f<e.length;
f++){d.vertices.push(new THREE.Vector3(e[f].x,e[f].y,0))
}return d
};
THREE.CurvePath.prototype.addWrapPath=function(b){this.bends.push(b)
};
THREE.CurvePath.prototype.getTransformedPoints=function(g,f){var l=this.getPoints(g),k,h;
if(!f){f=this.bends
}k=0;
for(h=f.length;
k<h;
k++){l=this.getWrapPoints(l,f[k])
}return l
};
THREE.CurvePath.prototype.getTransformedSpacedPoints=function(g,f){var l=this.getSpacedPoints(g),k,h;
if(!f){f=this.bends
}k=0;
for(h=f.length;
k<h;
k++){l=this.getWrapPoints(l,f[k])
}return l
};
THREE.CurvePath.prototype.getWrapPoints=function(s,r){var q=this.getBoundingBox(),p,o,n,m,l,k;
p=0;
for(o=s.length;
p<o;
p++){n=s[p];
m=n.x;
l=n.y;
k=m/q.maxX;
k=r.getUtoTmapping(k,m);
m=r.getPoint(k);
l=r.getNormalVector(k).multiplyScalar(l);
n.x=m.x+l.x;
n.y=m.y+l.y
}return s
};
THREE.EventTarget=function(){var b={};
this.addEventListener=function(a,d){b[a]==void 0&&(b[a]=[]);
b[a].indexOf(d)===-1&&b[a].push(d)
};
this.dispatchEvent=function(a){for(var d in b[a.type]){b[a.type][d](a)
}};
this.removeEventListener=function(a,f){var e=b[a].indexOf(f);
e!==-1&&b[a].splice(e,1)
}
};
THREE.Gyroscope=function(){THREE.Object3D.call(this)
};
THREE.Gyroscope.prototype=new THREE.Object3D;
THREE.Gyroscope.prototype.constructor=THREE.Gyroscope;
THREE.Gyroscope.prototype.updateMatrixWorld=function(e){this.matrixAutoUpdate&&this.updateMatrix();
if(this.matrixWorldNeedsUpdate||e){if(this.parent){this.matrixWorld.multiply(this.parent.matrixWorld,this.matrix);
this.matrixWorld.decompose(this.translationWorld,this.rotationWorld,this.scaleWorld);
this.matrix.decompose(this.translationObject,this.rotationObject,this.scaleObject);
this.matrixWorld.compose(this.translationWorld,this.rotationObject,this.scaleWorld)
}else{this.matrixWorld.copy(this.matrix)
}this.matrixWorldNeedsUpdate=false;
e=true
}for(var d=0,f=this.children.length;
d<f;
d++){this.children[d].updateMatrixWorld(e)
}};
THREE.Gyroscope.prototype.translationWorld=new THREE.Vector3;
THREE.Gyroscope.prototype.translationObject=new THREE.Vector3;
THREE.Gyroscope.prototype.rotationWorld=new THREE.Quaternion;
THREE.Gyroscope.prototype.rotationObject=new THREE.Quaternion;
THREE.Gyroscope.prototype.scaleWorld=new THREE.Vector3;
THREE.Gyroscope.prototype.scaleObject=new THREE.Vector3;
THREE.Path=function(b){THREE.CurvePath.call(this);
this.actions=[];
b&&this.fromPoints(b)
};
THREE.Path.prototype=new THREE.CurvePath;
THREE.Path.prototype.constructor=THREE.Path;
THREE.PathActions={MOVE_TO:"moveTo",LINE_TO:"lineTo",QUADRATIC_CURVE_TO:"quadraticCurveTo",BEZIER_CURVE_TO:"bezierCurveTo",CSPLINE_THRU:"splineThru",ARC:"arc"};
THREE.Path.prototype.fromPoints=function(e){this.moveTo(e[0].x,e[0].y);
for(var d=1,f=e.length;
d<f;
d++){this.lineTo(e[d].x,e[d].y)
}};
THREE.Path.prototype.moveTo=function(e,d){var f=Array.prototype.slice.call(arguments);
this.actions.push({action:THREE.PathActions.MOVE_TO,args:f})
};
THREE.Path.prototype.lineTo=function(f,e){var h=Array.prototype.slice.call(arguments),g=this.actions[this.actions.length-1].args;
this.curves.push(new THREE.LineCurve(new THREE.Vector2(g[g.length-2],g[g.length-1]),new THREE.Vector2(f,e)));
this.actions.push({action:THREE.PathActions.LINE_TO,args:h})
};
THREE.Path.prototype.quadraticCurveTo=function(h,g,n,m){var l=Array.prototype.slice.call(arguments),k=this.actions[this.actions.length-1].args;
this.curves.push(new THREE.QuadraticBezierCurve(new THREE.Vector2(k[k.length-2],k[k.length-1]),new THREE.Vector2(h,g),new THREE.Vector2(n,m)));
this.actions.push({action:THREE.PathActions.QUADRATIC_CURVE_TO,args:l})
};
THREE.Path.prototype.bezierCurveTo=function(l,k,r,q,p,o){var n=Array.prototype.slice.call(arguments),m=this.actions[this.actions.length-1].args;
this.curves.push(new THREE.CubicBezierCurve(new THREE.Vector2(m[m.length-2],m[m.length-1]),new THREE.Vector2(l,k),new THREE.Vector2(r,q),new THREE.Vector2(p,o)));
this.actions.push({action:THREE.PathActions.BEZIER_CURVE_TO,args:n})
};
THREE.Path.prototype.splineThru=function(e){var d=Array.prototype.slice.call(arguments),f=this.actions[this.actions.length-1].args,f=[new THREE.Vector2(f[f.length-2],f[f.length-1])];
Array.prototype.push.apply(f,e);
this.curves.push(new THREE.SplineCurve(f));
this.actions.push({action:THREE.PathActions.CSPLINE_THRU,args:d})
};
THREE.Path.prototype.arc=function(l,k,r,q,p,o){var n=Array.prototype.slice.call(arguments),m=this.actions[this.actions.length-1],m=new THREE.ArcCurve(m.x+l,m.y+k,r,q,p,o);
this.curves.push(m);
m=m.getPoint(o?1:0);
n.push(m.x);
n.push(m.y);
this.actions.push({action:THREE.PathActions.ARC,args:n})
};
THREE.Path.prototype.absarc=function(l,k,r,q,p,o){var n=Array.prototype.slice.call(arguments),m=new THREE.ArcCurve(l,k,r,q,p,o);
this.curves.push(m);
m=m.getPoint(o?1:0);
n.push(m.x);
n.push(m.y);
this.actions.push({action:THREE.PathActions.ARC,args:n})
};
THREE.Path.prototype.getSpacedPoints=function(e){e||(e=40);
for(var d=[],f=0;
f<e;
f++){d.push(this.getPoint(f/e))
}return d
};
THREE.Path.prototype.getPoints=function(G,F){if(this.useSpacedPoints){console.log("tata");
return this.getSpacedPoints(G,F)
}var G=G||12,E=[],D,C,B,A,z,y,w,x,s,v,t,r,u;
D=0;
for(C=this.actions.length;
D<C;
D++){B=this.actions[D];
A=B.action;
B=B.args;
switch(A){case THREE.PathActions.MOVE_TO:E.push(new THREE.Vector2(B[0],B[1]));
break;
case THREE.PathActions.LINE_TO:E.push(new THREE.Vector2(B[0],B[1]));
break;
case THREE.PathActions.QUADRATIC_CURVE_TO:z=B[2];
y=B[3];
s=B[0];
v=B[1];
if(E.length>0){A=E[E.length-1];
t=A.x;
r=A.y
}else{A=this.actions[D-1].args;
t=A[A.length-2];
r=A[A.length-1]
}for(B=1;
B<=G;
B++){u=B/G;
A=THREE.Shape.Utils.b2(u,t,s,z);
u=THREE.Shape.Utils.b2(u,r,v,y);
E.push(new THREE.Vector2(A,u))
}break;
case THREE.PathActions.BEZIER_CURVE_TO:z=B[4];
y=B[5];
s=B[0];
v=B[1];
w=B[2];
x=B[3];
if(E.length>0){A=E[E.length-1];
t=A.x;
r=A.y
}else{A=this.actions[D-1].args;
t=A[A.length-2];
r=A[A.length-1]
}for(B=1;
B<=G;
B++){u=B/G;
A=THREE.Shape.Utils.b3(u,t,s,w,z);
u=THREE.Shape.Utils.b3(u,r,v,x,y);
E.push(new THREE.Vector2(A,u))
}break;
case THREE.PathActions.CSPLINE_THRU:A=this.actions[D-1].args;
u=[new THREE.Vector2(A[A.length-2],A[A.length-1])];
A=G*B[0].length;
u=u.concat(B[0]);
u=new THREE.SplineCurve(u);
for(B=1;
B<=A;
B++){E.push(u.getPointAt(B/A))
}break;
case THREE.PathActions.ARC:z=B[0];
y=B[1];
w=B[2];
s=B[3];
v=!!B[5];
x=B[4]-s;
t=G*2;
for(B=1;
B<=t;
B++){u=B/t;
v||(u=1-u);
u=s+u*x;
A=z+w*Math.cos(u);
u=y+w*Math.sin(u);
E.push(new THREE.Vector2(A,u))
}}}D=E[E.length-1];
Math.abs(D.x-E[0].x)<1e-10&&Math.abs(D.y-E[0].y)<1e-10&&E.splice(E.length-1,1);
F&&E.push(E[0]);
return E
};
THREE.Path.prototype.transform=function(d,c){this.getBoundingBox();
return this.getWrapPoints(this.getPoints(c),d)
};
THREE.Path.prototype.nltransform=function(y,x,w,v,u,t){var s=this.getPoints(),r,q,n,o,m;
r=0;
for(q=s.length;
r<q;
r++){n=s[r];
o=n.x;
m=n.y;
n.x=y*o+x*m+w;
n.y=v*m+u*o+t
}return s
};
THREE.Path.prototype.debug=function(g){var f=this.getBoundingBox();
if(!g){g=document.createElement("canvas");
g.setAttribute("width",f.maxX+100);
g.setAttribute("height",f.maxY+100);
document.body.appendChild(g)
}f=g.getContext("2d");
f.fillStyle="white";
f.fillRect(0,0,g.width,g.height);
f.strokeStyle="black";
f.beginPath();
var l,k,h,g=0;
for(l=this.actions.length;
g<l;
g++){k=this.actions[g];
h=k.args;
k=k.action;
k!=THREE.PathActions.CSPLINE_THRU&&f[k].apply(f,h)
}f.stroke();
f.closePath();
f.strokeStyle="red";
k=this.getPoints();
g=0;
for(l=k.length;
g<l;
g++){h=k[g];
f.beginPath();
f.arc(h.x,h.y,1.5,0,Math.PI*2,false);
f.stroke();
f.closePath()
}};
THREE.Path.prototype.toShapes=function(){var k,h,p,o,n=[],m=new THREE.Path;
k=0;
for(h=this.actions.length;
k<h;
k++){p=this.actions[k];
o=p.args;
p=p.action;
if(p==THREE.PathActions.MOVE_TO&&m.actions.length!=0){n.push(m);
m=new THREE.Path
}m[p].apply(m,o)
}m.actions.length!=0&&n.push(m);
if(n.length==0){return[]
}var l;
o=[];
k=!THREE.Shape.Utils.isClockWise(n[0].getPoints());
if(n.length==1){m=n[0];
l=new THREE.Shape;
l.actions=m.actions;
l.curves=m.curves;
o.push(l);
return o
}if(k){l=new THREE.Shape;
k=0;
for(h=n.length;
k<h;
k++){m=n[k];
if(THREE.Shape.Utils.isClockWise(m.getPoints())){l.actions=m.actions;
l.curves=m.curves;
o.push(l);
l=new THREE.Shape
}else{l.holes.push(m)
}}}else{k=0;
for(h=n.length;
k<h;
k++){m=n[k];
if(THREE.Shape.Utils.isClockWise(m.getPoints())){l&&o.push(l);
l=new THREE.Shape;
l.actions=m.actions;
l.curves=m.curves
}else{l.holes.push(m)
}}o.push(l)
}return o
};
THREE.Shape=function(){THREE.Path.apply(this,arguments);
this.holes=[]
};
THREE.Shape.prototype=new THREE.Path;
THREE.Shape.prototype.constructor=THREE.Path;
THREE.Shape.prototype.extrude=function(b){return new THREE.ExtrudeGeometry(this,b)
};
THREE.Shape.prototype.getPointsHoles=function(f){var e,h=this.holes.length,g=[];
for(e=0;
e<h;
e++){g[e]=this.holes[e].getTransformedPoints(f,this.bends)
}return g
};
THREE.Shape.prototype.getSpacedPointsHoles=function(f){var e,h=this.holes.length,g=[];
for(e=0;
e<h;
e++){g[e]=this.holes[e].getTransformedSpacedPoints(f,this.bends)
}return g
};
THREE.Shape.prototype.extractAllPoints=function(b){return{shape:this.getTransformedPoints(b),holes:this.getPointsHoles(b)}
};
THREE.Shape.prototype.extractPoints=function(b){return this.useSpacedPoints?this.extractAllSpacedPoints(b):this.extractAllPoints(b)
};
THREE.Shape.prototype.extractAllSpacedPoints=function(b){return{shape:this.getTransformedSpacedPoints(b),holes:this.getSpacedPointsHoles(b)}
};
THREE.Shape.Utils={removeHoles:function(I,H){var G=I.concat(),F=G.concat(),E,D,C,B,A,y,z,u,x,v,t=[];
for(A=0;
A<H.length;
A++){y=H[A];
Array.prototype.push.apply(F,y);
D=Number.POSITIVE_INFINITY;
for(E=0;
E<y.length;
E++){x=y[E];
v=[];
for(u=0;
u<G.length;
u++){z=G[u];
z=x.distanceToSquared(z);
v.push(z);
if(z<D){D=z;
C=E;
B=u
}}}E=B-1>=0?B-1:G.length-1;
D=C-1>=0?C-1:y.length-1;
var w=[y[C],G[B],G[E]];
u=THREE.FontUtils.Triangulate.area(w);
var s=[y[C],y[D],G[B]];
x=THREE.FontUtils.Triangulate.area(s);
v=B;
z=C;
B=B+1;
C=C+-1;
B<0&&(B=B+G.length);
B=B%G.length;
C<0&&(C=C+y.length);
C=C%y.length;
E=B-1>=0?B-1:G.length-1;
D=C-1>=0?C-1:y.length-1;
w=[y[C],G[B],G[E]];
w=THREE.FontUtils.Triangulate.area(w);
s=[y[C],y[D],G[B]];
s=THREE.FontUtils.Triangulate.area(s);
if(u+x>w+s){B=v;
C=z;
B<0&&(B=B+G.length);
B=B%G.length;
C<0&&(C=C+y.length);
C=C%y.length;
E=B-1>=0?B-1:G.length-1;
D=C-1>=0?C-1:y.length-1
}u=G.slice(0,B);
x=G.slice(B);
v=y.slice(C);
z=y.slice(0,C);
D=[y[C],y[D],G[B]];
t.push([y[C],G[B],G[E]]);
t.push(D);
G=u.concat(v).concat(z).concat(x)
}return{shape:G,isolatedPts:t,allpoints:F}
},triangulateShape:function(u,t){var s=THREE.Shape.Utils.removeHoles(u,t),r=s.allpoints,q=s.isolatedPts,s=THREE.FontUtils.Triangulate(s.shape,false),p,o,n,m,k={};
p=0;
for(o=r.length;
p<o;
p++){m=r[p].x+":"+r[p].y;
k[m]!==void 0&&console.log("Duplicate point",m);
k[m]=p
}p=0;
for(o=s.length;
p<o;
p++){n=s[p];
for(r=0;
r<3;
r++){m=n[r].x+":"+n[r].y;
m=k[m];
m!==void 0&&(n[r]=m)
}}p=0;
for(o=q.length;
p<o;
p++){n=q[p];
for(r=0;
r<3;
r++){m=n[r].x+":"+n[r].y;
m=k[m];
m!==void 0&&(n[r]=m)
}}return s.concat(q)
},isClockWise:function(b){return THREE.FontUtils.Triangulate.area(b)<0
},b2p0:function(e,d){var f=1-e;
return f*f*d
},b2p1:function(d,c){return 2*(1-d)*d*c
},b2p2:function(d,c){return d*d*c
},b2:function(f,e,h,g){return this.b2p0(f,e)+this.b2p1(f,h)+this.b2p2(f,g)
},b3p0:function(e,d){var f=1-e;
return f*f*f*d
},b3p1:function(e,d){var f=1-e;
return 3*f*f*e*d
},b3p2:function(d,c){return 3*(1-d)*d*d*c
},b3p3:function(d,c){return d*d*d*c
},b3:function(g,f,l,k,h){return this.b3p0(g,f)+this.b3p1(g,l)+this.b3p2(g,k)+this.b3p3(g,h)
}};
THREE.TextPath=function(d,c){THREE.Path.call(this);
this.parameters=c||{};
this.set(d)
};
THREE.TextPath.prototype.set=function(h,g){g=g||this.parameters;
this.text=h;
var n=g.curveSegments!==void 0?g.curveSegments:4,m=g.font!==void 0?g.font:"helvetiker",l=g.weight!==void 0?g.weight:"normal",k=g.style!==void 0?g.style:"normal";
THREE.FontUtils.size=g.size!==void 0?g.size:100;
THREE.FontUtils.divisions=n;
THREE.FontUtils.face=m;
THREE.FontUtils.weight=l;
THREE.FontUtils.style=k
};
THREE.TextPath.prototype.toShapes=function(){for(var f=THREE.FontUtils.drawText(this.text).paths,e=[],h=0,g=f.length;
h<g;
h++){Array.prototype.push.apply(e,f[h].toShapes())
}return e
};
THREE.AnimationHandler=function(){var f=[],e={},h={update:function(a){for(var d=0;
d<f.length;
d++){f[d].update(a)
}},addToUpdate:function(a){f.indexOf(a)===-1&&f.push(a)
},removeFromUpdate:function(a){a=f.indexOf(a);
a!==-1&&f.splice(a,1)
},add:function(m){e[m.name]!==void 0&&console.log("THREE.AnimationHandler.add: Warning! "+m.name+" already exists in library. Overwriting.");
e[m.name]=m;
if(m.initialized!==true){for(var r=0;
r<m.hierarchy.length;
r++){for(var q=0;
q<m.hierarchy[r].keys.length;
q++){if(m.hierarchy[r].keys[q].time<0){m.hierarchy[r].keys[q].time=0
}if(m.hierarchy[r].keys[q].rot!==void 0&&!(m.hierarchy[r].keys[q].rot instanceof THREE.Quaternion)){var p=m.hierarchy[r].keys[q].rot;
m.hierarchy[r].keys[q].rot=new THREE.Quaternion(p[0],p[1],p[2],p[3])
}}if(m.hierarchy[r].keys.length&&m.hierarchy[r].keys[0].morphTargets!==void 0){p={};
for(q=0;
q<m.hierarchy[r].keys.length;
q++){for(var o=0;
o<m.hierarchy[r].keys[q].morphTargets.length;
o++){var b=m.hierarchy[r].keys[q].morphTargets[o];
p[b]=-1
}}m.hierarchy[r].usedMorphTargets=p;
for(q=0;
q<m.hierarchy[r].keys.length;
q++){var n={};
for(b in p){for(o=0;
o<m.hierarchy[r].keys[q].morphTargets.length;
o++){if(m.hierarchy[r].keys[q].morphTargets[o]===b){n[b]=m.hierarchy[r].keys[q].morphTargetsInfluences[o];
break
}}o===m.hierarchy[r].keys[q].morphTargets.length&&(n[b]=0)
}m.hierarchy[r].keys[q].morphTargetsInfluences=n
}}for(q=1;
q<m.hierarchy[r].keys.length;
q++){if(m.hierarchy[r].keys[q].time===m.hierarchy[r].keys[q-1].time){m.hierarchy[r].keys.splice(q,1);
q--
}}for(q=0;
q<m.hierarchy[r].keys.length;
q++){m.hierarchy[r].keys[q].index=q
}}q=parseInt(m.length*m.fps,10);
m.JIT={};
m.JIT.hierarchy=[];
for(r=0;
r<m.hierarchy.length;
r++){m.JIT.hierarchy.push(Array(q))
}m.initialized=true
}},get:function(b){if(typeof b==="string"){if(e[b]){return e[b]
}console.log("THREE.AnimationHandler.get: Couldn't find animation "+b);
return null
}},parse:function(k){var d=[];
if(k instanceof THREE.SkinnedMesh){for(var l=0;
l<k.bones.length;
l++){d.push(k.bones[l])
}}else{g(k,d)
}return d
}},g=function(k,d){d.push(k);
for(var l=0;
l<k.children.length;
l++){g(k.children[l],d)
}};
h.LINEAR=0;
h.CATMULLROM=1;
h.CATMULLROM_FORWARD=2;
return h
}();
THREE.Animation=function(f,e,h,g){this.root=f;
this.data=THREE.AnimationHandler.get(e);
this.hierarchy=THREE.AnimationHandler.parse(f);
this.currentTime=0;
this.timeScale=1;
this.isPlaying=false;
this.loop=this.isPaused=true;
this.interpolationType=h!==void 0?h:THREE.AnimationHandler.LINEAR;
this.JITCompile=g!==void 0?g:true;
this.points=[];
this.target=new THREE.Vector3
};
THREE.Animation.prototype.play=function(h,g){if(!this.isPlaying){this.isPlaying=true;
this.loop=h!==void 0?h:true;
this.currentTime=g!==void 0?g:0;
var n,m=this.hierarchy.length,l;
for(n=0;
n<m;
n++){l=this.hierarchy[n];
if(this.interpolationType!==THREE.AnimationHandler.CATMULLROM_FORWARD){l.useQuaternion=true
}l.matrixAutoUpdate=true;
if(l.animationCache===void 0){l.animationCache={};
l.animationCache.prevKey={pos:0,rot:0,scl:0};
l.animationCache.nextKey={pos:0,rot:0,scl:0};
l.animationCache.originalMatrix=l instanceof THREE.Bone?l.skinMatrix:l.matrix
}var k=l.animationCache.prevKey;
l=l.animationCache.nextKey;
k.pos=this.data.hierarchy[n].keys[0];
k.rot=this.data.hierarchy[n].keys[0];
k.scl=this.data.hierarchy[n].keys[0];
l.pos=this.getNextKeyWith("pos",n,1);
l.rot=this.getNextKeyWith("rot",n,1);
l.scl=this.getNextKeyWith("scl",n,1)
}this.update(0)
}this.isPaused=false;
THREE.AnimationHandler.addToUpdate(this)
};
THREE.Animation.prototype.pause=function(){this.isPaused?THREE.AnimationHandler.addToUpdate(this):THREE.AnimationHandler.removeFromUpdate(this);
this.isPaused=!this.isPaused
};
THREE.Animation.prototype.stop=function(){this.isPaused=this.isPlaying=false;
THREE.AnimationHandler.removeFromUpdate(this);
for(var b=0;
b<this.hierarchy.length;
b++){if(this.hierarchy[b].animationCache!==void 0){this.hierarchy[b] instanceof THREE.Bone?this.hierarchy[b].skinMatrix=this.hierarchy[b].animationCache.originalMatrix:this.hierarchy[b].matrix=this.hierarchy[b].animationCache.originalMatrix;
delete this.hierarchy[b].animationCache
}}};
THREE.Animation.prototype.update=function(G){if(this.isPlaying){var F=["pos","rot","scl"],E,D,C,B,A,z,y,w,x=this.data.JIT.hierarchy,s,v;
v=this.currentTime=this.currentTime+G*this.timeScale;
s=this.currentTime=this.currentTime%this.data.length;
w=parseInt(Math.min(s*this.data.fps,this.data.length*this.data.fps),10);
for(var t=0,r=this.hierarchy.length;
t<r;
t++){G=this.hierarchy[t];
y=G.animationCache;
if(this.JITCompile&&x[t][w]!==void 0){if(G instanceof THREE.Bone){G.skinMatrix=x[t][w];
G.matrixAutoUpdate=false;
G.matrixWorldNeedsUpdate=false
}else{G.matrix=x[t][w];
G.matrixAutoUpdate=false;
G.matrixWorldNeedsUpdate=true
}}else{if(this.JITCompile){G instanceof THREE.Bone?G.skinMatrix=G.animationCache.originalMatrix:G.matrix=G.animationCache.originalMatrix
}for(var u=0;
u<3;
u++){E=F[u];
A=y.prevKey[E];
z=y.nextKey[E];
if(z.time<=v){if(s<v){if(this.loop){A=this.data.hierarchy[t].keys[0];
for(z=this.getNextKeyWith(E,t,1);
z.time<s;
){A=z;
z=this.getNextKeyWith(E,t,z.index+1)
}}else{this.stop();
return
}}else{do{A=z;
z=this.getNextKeyWith(E,t,z.index+1)
}while(z.time<s)
}y.prevKey[E]=A;
y.nextKey[E]=z
}G.matrixAutoUpdate=true;
G.matrixWorldNeedsUpdate=true;
D=(s-A.time)/(z.time-A.time);
C=A[E];
B=z[E];
if(D<0||D>1){console.log("THREE.Animation.update: Warning! Scale out of bounds:"+D+" on bone "+t);
D=D<0?0:1
}if(E==="pos"){E=G.position;
if(this.interpolationType===THREE.AnimationHandler.LINEAR){E.x=C[0]+(B[0]-C[0])*D;
E.y=C[1]+(B[1]-C[1])*D;
E.z=C[2]+(B[2]-C[2])*D
}else{if(this.interpolationType===THREE.AnimationHandler.CATMULLROM||this.interpolationType===THREE.AnimationHandler.CATMULLROM_FORWARD){this.points[0]=this.getPrevKeyWith("pos",t,A.index-1).pos;
this.points[1]=C;
this.points[2]=B;
this.points[3]=this.getNextKeyWith("pos",t,z.index+1).pos;
D=D*0.33+0.33;
C=this.interpolateCatmullRom(this.points,D);
E.x=C[0];
E.y=C[1];
E.z=C[2];
if(this.interpolationType===THREE.AnimationHandler.CATMULLROM_FORWARD){D=this.interpolateCatmullRom(this.points,D*1.01);
this.target.set(D[0],D[1],D[2]);
this.target.subSelf(E);
this.target.y=0;
this.target.normalize();
D=Math.atan2(this.target.x,this.target.z);
G.rotation.set(0,D,0)
}}}}else{if(E==="rot"){THREE.Quaternion.slerp(C,B,G.quaternion,D)
}else{if(E==="scl"){E=G.scale;
E.x=C[0]+(B[0]-C[0])*D;
E.y=C[1]+(B[1]-C[1])*D;
E.z=C[2]+(B[2]-C[2])*D
}}}}}}if(this.JITCompile&&x[0][w]===void 0){this.hierarchy[0].updateMatrixWorld(true);
for(t=0;
t<this.hierarchy.length;
t++){x[t][w]=this.hierarchy[t] instanceof THREE.Bone?this.hierarchy[t].skinMatrix.clone():this.hierarchy[t].matrix.clone()
}}}};
THREE.Animation.prototype.interpolateCatmullRom=function(u,t){var s=[],r=[],q,p,o,n,m,k;
q=(u.length-1)*t;
p=Math.floor(q);
q=q-p;
s[0]=p===0?p:p-1;
s[1]=p;
s[2]=p>u.length-2?p:p+1;
s[3]=p>u.length-3?p:p+2;
p=u[s[0]];
n=u[s[1]];
m=u[s[2]];
k=u[s[3]];
s=q*q;
o=q*s;
r[0]=this.interpolate(p[0],n[0],m[0],k[0],q,s,o);
r[1]=this.interpolate(p[1],n[1],m[1],k[1],q,s,o);
r[2]=this.interpolate(p[2],n[2],m[2],k[2],q,s,o);
return r
};
THREE.Animation.prototype.interpolate=function(k,h,p,o,n,m,l){k=(p-k)*0.5;
o=(o-h)*0.5;
return(2*(h-p)+k+o)*l+(-3*(h-p)-2*k-o)*m+k*n+h
};
THREE.Animation.prototype.getNextKeyWith=function(f,e,h){for(var g=this.data.hierarchy[e].keys,h=this.interpolationType===THREE.AnimationHandler.CATMULLROM||this.interpolationType===THREE.AnimationHandler.CATMULLROM_FORWARD?h<g.length-1?h:g.length-1:h%g.length;
h<g.length;
h++){if(g[h][f]!==void 0){return g[h]
}}return this.data.hierarchy[e].keys[0]
};
THREE.Animation.prototype.getPrevKeyWith=function(f,e,h){for(var g=this.data.hierarchy[e].keys,h=this.interpolationType===THREE.AnimationHandler.CATMULLROM||this.interpolationType===THREE.AnimationHandler.CATMULLROM_FORWARD?h>0?h:0:h>=0?h:h+g.length;
h>=0;
h--){if(g[h][f]!==void 0){return g[h]
}}return this.data.hierarchy[e].keys[g.length-1]
};
THREE.KeyFrameAnimation=function(k,h,p){this.root=k;
this.data=THREE.AnimationHandler.get(h);
this.hierarchy=THREE.AnimationHandler.parse(k);
this.currentTime=0;
this.timeScale=0.001;
this.isPlaying=false;
this.loop=this.isPaused=true;
this.JITCompile=p!==void 0?p:true;
k=0;
for(h=this.hierarchy.length;
k<h;
k++){var p=this.data.hierarchy[k].sids,o=this.hierarchy[k];
if(this.data.hierarchy[k].keys.length&&p){for(var n=0;
n<p.length;
n++){var m=p[n],l=this.getNextKeyWith(m,k,0);
l&&l.apply(m)
}o.matrixAutoUpdate=false;
this.data.hierarchy[k].node.updateMatrix();
o.matrixWorldNeedsUpdate=true
}}};
THREE.KeyFrameAnimation.prototype.play=function(h,g){if(!this.isPlaying){this.isPlaying=true;
this.loop=h!==void 0?h:true;
this.currentTime=g!==void 0?g:0;
this.startTimeMs=g;
this.startTime=10000000;
this.endTime=-this.startTime;
var n,m=this.hierarchy.length,l,k;
for(n=0;
n<m;
n++){l=this.hierarchy[n];
k=this.data.hierarchy[n];
l.useQuaternion=true;
if(k.animationCache===void 0){k.animationCache={};
k.animationCache.prevKey=null;
k.animationCache.nextKey=null;
k.animationCache.originalMatrix=l instanceof THREE.Bone?l.skinMatrix:l.matrix
}l=this.data.hierarchy[n].keys;
if(l.length){k.animationCache.prevKey=l[0];
k.animationCache.nextKey=l[1];
this.startTime=Math.min(l[0].time,this.startTime);
this.endTime=Math.max(l[l.length-1].time,this.endTime)
}}this.update(0)
}this.isPaused=false;
THREE.AnimationHandler.addToUpdate(this)
};
THREE.KeyFrameAnimation.prototype.pause=function(){this.isPaused?THREE.AnimationHandler.addToUpdate(this):THREE.AnimationHandler.removeFromUpdate(this);
this.isPaused=!this.isPaused
};
THREE.KeyFrameAnimation.prototype.stop=function(){this.isPaused=this.isPlaying=false;
THREE.AnimationHandler.removeFromUpdate(this);
for(var f=0;
f<this.data.hierarchy.length;
f++){var e=this.hierarchy[f],h=this.data.hierarchy[f];
if(h.animationCache!==void 0){var g=h.animationCache.originalMatrix;
if(e instanceof THREE.Bone){g.copy(e.skinMatrix);
e.skinMatrix=g
}else{g.copy(e.matrix);
e.matrix=g
}delete h.animationCache
}}};
THREE.KeyFrameAnimation.prototype.update=function(A){if(this.isPlaying){var z,y,x,w,v=this.data.JIT.hierarchy,u,t,s;
t=this.currentTime=this.currentTime+A*this.timeScale;
u=this.currentTime=this.currentTime%this.data.length;
if(u<this.startTimeMs){u=this.currentTime=this.startTimeMs+u
}w=parseInt(Math.min(u*this.data.fps,this.data.length*this.data.fps),10);
if((s=u<t)&&!this.loop){for(var A=0,q=this.hierarchy.length;
A<q;
A++){var r=this.data.hierarchy[A].keys,v=this.data.hierarchy[A].sids;
x=r.length-1;
w=this.hierarchy[A];
if(r.length){for(r=0;
r<v.length;
r++){u=v[r];
(t=this.getPrevKeyWith(u,A,x))&&t.apply(u)
}this.data.hierarchy[A].node.updateMatrix();
w.matrixWorldNeedsUpdate=true
}}this.stop()
}else{if(!(u<this.startTime)){A=0;
for(q=this.hierarchy.length;
A<q;
A++){x=this.hierarchy[A];
z=this.data.hierarchy[A];
var r=z.keys,n=z.animationCache;
if(this.JITCompile&&v[A][w]!==void 0){if(x instanceof THREE.Bone){x.skinMatrix=v[A][w];
x.matrixWorldNeedsUpdate=false
}else{x.matrix=v[A][w];
x.matrixWorldNeedsUpdate=true
}}else{if(r.length){if(this.JITCompile&&n){x instanceof THREE.Bone?x.skinMatrix=n.originalMatrix:x.matrix=n.originalMatrix
}z=n.prevKey;
y=n.nextKey;
if(z&&y){if(y.time<=t){if(s&&this.loop){z=r[0];
for(y=r[1];
y.time<u;
){z=y;
y=r[z.index+1]
}}else{if(!s){for(var o=r.length-1;
y.time<u&&y.index!==o;
){z=y;
y=r[z.index+1]
}}}n.prevKey=z;
n.nextKey=y
}y.time>=u?z.interpolate(y,u):z.interpolate(y,y.time)
}this.data.hierarchy[A].node.updateMatrix();
x.matrixWorldNeedsUpdate=true
}}}if(this.JITCompile&&v[0][w]===void 0){this.hierarchy[0].updateMatrixWorld(true);
for(A=0;
A<this.hierarchy.length;
A++){v[A][w]=this.hierarchy[A] instanceof THREE.Bone?this.hierarchy[A].skinMatrix.clone():this.hierarchy[A].matrix.clone()
}}}}}};
THREE.KeyFrameAnimation.prototype.getNextKeyWith=function(e,d,f){d=this.data.hierarchy[d].keys;
for(f=f%d.length;
f<d.length;
f++){if(d[f].hasTarget(e)){return d[f]
}}return d[0]
};
THREE.KeyFrameAnimation.prototype.getPrevKeyWith=function(e,d,f){d=this.data.hierarchy[d].keys;
for(f=f>=0?f:f+d.length;
f>=0;
f--){if(d[f].hasTarget(e)){return d[f]
}}return d[d.length-1]
};
THREE.CubeCamera=function(s,r,q){THREE.Object3D.call(this);
var p=new THREE.PerspectiveCamera(90,1,s,r);
p.up.set(0,-1,0);
p.lookAt(new THREE.Vector3(1,0,0));
this.add(p);
var o=new THREE.PerspectiveCamera(90,1,s,r);
o.up.set(0,-1,0);
o.lookAt(new THREE.Vector3(-1,0,0));
this.add(o);
var n=new THREE.PerspectiveCamera(90,1,s,r);
n.up.set(0,0,1);
n.lookAt(new THREE.Vector3(0,1,0));
this.add(n);
var m=new THREE.PerspectiveCamera(90,1,s,r);
m.up.set(0,0,-1);
m.lookAt(new THREE.Vector3(0,-1,0));
this.add(m);
var l=new THREE.PerspectiveCamera(90,1,s,r);
l.up.set(0,-1,0);
l.lookAt(new THREE.Vector3(0,0,1));
this.add(l);
var k=new THREE.PerspectiveCamera(90,1,s,r);
k.up.set(0,-1,0);
k.lookAt(new THREE.Vector3(0,0,-1));
this.add(k);
this.renderTarget=new THREE.WebGLRenderTargetCube(q,q,{format:THREE.RGBFormat,magFilter:THREE.LinearFilter,minFilter:THREE.LinearFilter});
this.updateCubeMap=function(f,e){var g=this.renderTarget,d=g.generateMipmaps;
g.generateMipmaps=false;
g.activeCubeFace=0;
f.render(e,p,g);
g.activeCubeFace=1;
f.render(e,o,g);
g.activeCubeFace=2;
f.render(e,n,g);
g.activeCubeFace=3;
f.render(e,m,g);
g.activeCubeFace=4;
f.render(e,l,g);
g.generateMipmaps=d;
g.activeCubeFace=5;
f.render(e,k,g)
}
};
THREE.CubeCamera.prototype=new THREE.Object3D;
THREE.CubeCamera.prototype.constructor=THREE.CubeCamera;
THREE.CombinedCamera=function(k,h,p,o,n,m,l){THREE.Camera.call(this);
this.fov=p;
this.left=-k/2;
this.right=k/2;
this.top=h/2;
this.bottom=-h/2;
this.cameraO=new THREE.OrthographicCamera(k/-2,k/2,h/2,h/-2,m,l);
this.cameraP=new THREE.PerspectiveCamera(p,k/h,o,n);
this.zoom=1;
this.toPerspective()
};
THREE.CombinedCamera.prototype=new THREE.Camera;
THREE.CombinedCamera.prototype.constructor=THREE.CombinedCamera;
THREE.CombinedCamera.prototype.toPerspective=function(){this.near=this.cameraP.near;
this.far=this.cameraP.far;
this.cameraP.fov=this.fov/this.zoom;
this.cameraP.updateProjectionMatrix();
this.projectionMatrix=this.cameraP.projectionMatrix;
this.inPersepectiveMode=true;
this.inOrthographicMode=false
};
THREE.CombinedCamera.prototype.toOrthographic=function(){var d=this.cameraP.aspect,c=(this.cameraP.near+this.cameraP.far)/2,c=Math.tan(this.fov/2)*c,d=2*c*d/2,c=c/this.zoom,d=d/this.zoom;
this.cameraO.left=-d;
this.cameraO.right=d;
this.cameraO.top=c;
this.cameraO.bottom=-c;
this.cameraO.updateProjectionMatrix();
this.near=this.cameraO.near;
this.far=this.cameraO.far;
this.projectionMatrix=this.cameraO.projectionMatrix;
this.inPersepectiveMode=false;
this.inOrthographicMode=true
};
THREE.CombinedCamera.prototype.setSize=function(d,c){this.cameraP.aspect=d/c;
this.left=-d/2;
this.right=d/2;
this.top=c/2;
this.bottom=-c/2
};
THREE.CombinedCamera.prototype.setFov=function(b){this.fov=b;
this.inPersepectiveMode?this.toPerspective():this.toOrthographic()
};
THREE.CombinedCamera.prototype.updateProjectionMatrix=function(){if(this.inPersepectiveMode){this.toPerspective()
}else{this.toPerspective();
this.toOrthographic()
}};
THREE.CombinedCamera.prototype.setLens=function(e,d){var f=2*Math.atan((d!==void 0?d:24)/(e*2))*(180/Math.PI);
this.setFov(f);
return f
};
THREE.CombinedCamera.prototype.setZoom=function(b){this.zoom=b;
this.inPersepectiveMode?this.toPerspective():this.toOrthographic()
};
THREE.CombinedCamera.prototype.toFrontView=function(){this.rotation.x=0;
this.rotation.y=0;
this.rotation.z=0;
this.rotationAutoUpdate=false
};
THREE.CombinedCamera.prototype.toBackView=function(){this.rotation.x=0;
this.rotation.y=Math.PI;
this.rotation.z=0;
this.rotationAutoUpdate=false
};
THREE.CombinedCamera.prototype.toLeftView=function(){this.rotation.x=0;
this.rotation.y=-Math.PI/2;
this.rotation.z=0;
this.rotationAutoUpdate=false
};
THREE.CombinedCamera.prototype.toRightView=function(){this.rotation.x=0;
this.rotation.y=Math.PI/2;
this.rotation.z=0;
this.rotationAutoUpdate=false
};
THREE.CombinedCamera.prototype.toTopView=function(){this.rotation.x=-Math.PI/2;
this.rotation.y=0;
this.rotation.z=0;
this.rotationAutoUpdate=false
};
THREE.CombinedCamera.prototype.toBottomView=function(){this.rotation.x=Math.PI/2;
this.rotation.y=0;
this.rotation.z=0;
this.rotationAutoUpdate=false
};
THREE.FirstPersonControls=function(e,d){function f(g,c){return function(){c.apply(g,arguments)
}
}this.object=e;
this.target=new THREE.Vector3(0,0,0);
this.domElement=d!==void 0?d:document;
this.movementSpeed=1;
this.lookSpeed=0.005;
this.noFly=false;
this.lookVertical=true;
this.autoForward=false;
this.activeLook=true;
this.heightSpeed=false;
this.heightCoef=1;
this.heightMin=0;
this.constrainVertical=false;
this.verticalMin=0;
this.verticalMax=Math.PI;
this.theta=this.phi=this.lon=this.lat=this.mouseY=this.mouseX=this.autoSpeedFactor=0;
this.mouseDragOn=this.freeze=this.moveRight=this.moveLeft=this.moveBackward=this.moveForward=false;
if(this.domElement===document){this.viewHalfX=window.innerWidth/2;
this.viewHalfY=window.innerHeight/2
}else{this.viewHalfX=this.domElement.offsetWidth/2;
this.viewHalfY=this.domElement.offsetHeight/2;
this.domElement.setAttribute("tabindex",-1)
}this.onMouseDown=function(b){this.domElement!==document&&this.domElement.focus();
b.preventDefault();
b.stopPropagation();
if(this.activeLook){switch(b.button){case 0:this.moveForward=true;
break;
case 2:this.moveBackward=true
}}this.mouseDragOn=true
};
this.onMouseUp=function(b){b.preventDefault();
b.stopPropagation();
if(this.activeLook){switch(b.button){case 0:this.moveForward=false;
break;
case 2:this.moveBackward=false
}}this.mouseDragOn=false
};
this.onMouseMove=function(b){if(this.domElement===document){this.mouseX=b.pageX-this.viewHalfX;
this.mouseY=b.pageY-this.viewHalfY
}else{this.mouseX=b.pageX-this.domElement.offsetLeft-this.viewHalfX;
this.mouseY=b.pageY-this.domElement.offsetTop-this.viewHalfY
}};
this.onKeyDown=function(b){switch(b.keyCode){case 38:case 87:this.moveForward=true;
break;
case 37:case 65:this.moveLeft=true;
break;
case 40:case 83:this.moveBackward=true;
break;
case 39:case 68:this.moveRight=true;
break;
case 82:this.moveUp=true;
break;
case 70:this.moveDown=true;
break;
case 81:this.freeze=!this.freeze
}};
this.onKeyUp=function(b){switch(b.keyCode){case 38:case 87:this.moveForward=false;
break;
case 37:case 65:this.moveLeft=false;
break;
case 40:case 83:this.moveBackward=false;
break;
case 39:case 68:this.moveRight=false;
break;
case 82:this.moveUp=false;
break;
case 70:this.moveDown=false
}};
this.update=function(h){var g=0;
if(!this.freeze){if(this.heightSpeed){g=THREE.Math.clamp(this.object.position.y,this.heightMin,this.heightMax)-this.heightMin;
this.autoSpeedFactor=h*g*this.heightCoef
}else{this.autoSpeedFactor=0
}g=h*this.movementSpeed;
(this.moveForward||this.autoForward&&!this.moveBackward)&&this.object.translateZ(-(g+this.autoSpeedFactor));
this.moveBackward&&this.object.translateZ(g);
this.moveLeft&&this.object.translateX(-g);
this.moveRight&&this.object.translateX(g);
this.moveUp&&this.object.translateY(g);
this.moveDown&&this.object.translateY(-g);
h=h*this.lookSpeed;
this.activeLook||(h=0);
this.lon=this.lon+this.mouseX*h;
if(this.lookVertical){this.lat=this.lat-this.mouseY*h
}this.lat=Math.max(-85,Math.min(85,this.lat));
this.phi=(90-this.lat)*Math.PI/180;
this.theta=this.lon*Math.PI/180;
var g=this.target,k=this.object.position;
g.x=k.x+100*Math.sin(this.phi)*Math.cos(this.theta);
g.y=k.y+100*Math.cos(this.phi);
g.z=k.z+100*Math.sin(this.phi)*Math.sin(this.theta);
g=1;
this.constrainVertical&&(g=Math.PI/(this.verticalMax-this.verticalMin));
this.lon=this.lon+this.mouseX*h;
if(this.lookVertical){this.lat=this.lat-this.mouseY*h*g
}this.lat=Math.max(-85,Math.min(85,this.lat));
this.phi=(90-this.lat)*Math.PI/180;
this.theta=this.lon*Math.PI/180;
if(this.constrainVertical){this.phi=THREE.Math.mapLinear(this.phi,0,Math.PI,this.verticalMin,this.verticalMax)
}g=this.target;
k=this.object.position;
g.x=k.x+100*Math.sin(this.phi)*Math.cos(this.theta);
g.y=k.y+100*Math.cos(this.phi);
g.z=k.z+100*Math.sin(this.phi)*Math.sin(this.theta);
this.object.lookAt(g)
}};
this.domElement.addEventListener("contextmenu",function(b){b.preventDefault()
},false);
this.domElement.addEventListener("mousemove",f(this,this.onMouseMove),false);
this.domElement.addEventListener("mousedown",f(this,this.onMouseDown),false);
this.domElement.addEventListener("mouseup",f(this,this.onMouseUp),false);
this.domElement.addEventListener("keydown",f(this,this.onKeyDown),false);
this.domElement.addEventListener("keyup",f(this,this.onKeyUp),false)
};
THREE.PathControls=function(l,k){function r(b){return(b=b*2)<1?0.5*b*b:-0.5*(--b*(b-2)-1)
}function q(d,c){return function(){c.apply(d,arguments)
}
}function p(B,A,z,y){var x={name:z,fps:0.6,length:y,hierarchy:[]},w,v=A.getControlPointsArray(),t=A.getLength(),s=v.length,C=0;
w=s-1;
A={parent:-1,keys:[]};
A.keys[0]={time:0,pos:v[0],rot:[0,0,0,1],scl:[1,1,1]};
A.keys[w]={time:y,pos:v[w],rot:[0,0,0,1],scl:[1,1,1]};
for(w=1;
w<s-1;
w++){C=y*t.chunks[w]/t.total;
A.keys[w]={time:C,pos:v[w]}
}x.hierarchy[0]=A;
THREE.AnimationHandler.add(x);
return new THREE.Animation(B,z,THREE.AnimationHandler.CATMULLROM_FORWARD,false)
}function o(g,f){var t,s,h=new THREE.Geometry;
for(t=0;
t<g.points.length*f;
t++){s=t/(g.points.length*f);
s=g.getPoint(s);
h.vertices[t]=new THREE.Vector3(s.x,s.y,s.z)
}return h
}this.object=l;
this.domElement=k!==void 0?k:document;
this.id="PathControls"+THREE.PathControlsIdCounter++;
this.duration=10000;
this.waypoints=[];
this.useConstantSpeed=true;
this.resamplingCoef=50;
this.debugPath=new THREE.Object3D;
this.debugDummy=new THREE.Object3D;
this.animationParent=new THREE.Object3D;
this.lookSpeed=0.005;
this.lookHorizontal=this.lookVertical=true;
this.verticalAngleMap={srcRange:[0,2*Math.PI],dstRange:[0,2*Math.PI]};
this.horizontalAngleMap={srcRange:[0,2*Math.PI],dstRange:[0,2*Math.PI]};
this.target=new THREE.Object3D;
this.theta=this.phi=this.lon=this.lat=this.mouseY=this.mouseX=0;
if(this.domElement===document){this.viewHalfX=window.innerWidth/2;
this.viewHalfY=window.innerHeight/2
}else{this.viewHalfX=this.domElement.offsetWidth/2;
this.viewHalfY=this.domElement.offsetHeight/2;
this.domElement.setAttribute("tabindex",-1)
}var n=Math.PI*2,m=Math.PI/180;
this.update=function(e){var c;
if(this.lookHorizontal){this.lon=this.lon+this.mouseX*this.lookSpeed*e
}if(this.lookVertical){this.lat=this.lat-this.mouseY*this.lookSpeed*e
}this.lon=Math.max(0,Math.min(360,this.lon));
this.lat=Math.max(-85,Math.min(85,this.lat));
this.phi=(90-this.lat)*m;
this.theta=this.lon*m;
e=this.phi%n;
this.phi=e>=0?e:e+n;
c=this.verticalAngleMap.srcRange;
e=this.verticalAngleMap.dstRange;
c=THREE.Math.mapLinear(this.phi,c[0],c[1],e[0],e[1]);
var f=e[1]-e[0];
this.phi=r((c-e[0])/f)*f+e[0];
c=this.horizontalAngleMap.srcRange;
e=this.horizontalAngleMap.dstRange;
c=THREE.Math.mapLinear(this.theta,c[0],c[1],e[0],e[1]);
f=e[1]-e[0];
this.theta=r((c-e[0])/f)*f+e[0];
e=this.target.position;
e.x=100*Math.sin(this.phi)*Math.cos(this.theta);
e.y=100*Math.cos(this.phi);
e.z=100*Math.sin(this.phi)*Math.sin(this.theta);
this.object.lookAt(this.target.position)
};
this.onMouseMove=function(b){if(this.domElement===document){this.mouseX=b.pageX-this.viewHalfX;
this.mouseY=b.pageY-this.viewHalfY
}else{this.mouseX=b.pageX-this.domElement.offsetLeft-this.viewHalfX;
this.mouseY=b.pageY-this.domElement.offsetTop-this.viewHalfY
}};
this.init=function(){this.spline=new THREE.Spline;
this.spline.initFromArray(this.waypoints);
this.useConstantSpeed&&this.spline.reparametrizeByArcLength(this.resamplingCoef);
if(this.createDebugDummy){var e=new THREE.MeshLambertMaterial({color:30719}),d=new THREE.MeshLambertMaterial({color:65280}),u=new THREE.CubeGeometry(10,10,20),s=new THREE.CubeGeometry(2,2,10);
this.animationParent=new THREE.Mesh(u,e);
e=new THREE.Mesh(s,d);
e.position.set(0,10,0);
this.animation=p(this.animationParent,this.spline,this.id,this.duration);
this.animationParent.add(this.object);
this.animationParent.add(this.target);
this.animationParent.add(e)
}else{this.animation=p(this.animationParent,this.spline,this.id,this.duration);
this.animationParent.add(this.target);
this.animationParent.add(this.object)
}if(this.createDebugPath){var e=this.debugPath,d=this.spline,s=o(d,10),u=o(d,10),f=new THREE.LineBasicMaterial({color:16711680,linewidth:3}),s=new THREE.Line(s,f),u=new THREE.ParticleSystem(u,new THREE.ParticleBasicMaterial({color:16755200,size:3}));
s.scale.set(1,1,1);
e.add(s);
u.scale.set(1,1,1);
e.add(u);
for(var s=new THREE.SphereGeometry(1,16,8),f=new THREE.MeshBasicMaterial({color:65280}),t=0;
t<d.points.length;
t++){u=new THREE.Mesh(s,f);
u.position.copy(d.points[t]);
e.add(u)
}}this.domElement.addEventListener("mousemove",q(this,this.onMouseMove),false)
}
};
THREE.PathControlsIdCounter=0;
THREE.FlyControls=function(e,d){function f(g,c){return function(){c.apply(g,arguments)
}
}this.object=e;
this.domElement=d!==void 0?d:document;
d&&this.domElement.setAttribute("tabindex",-1);
this.movementSpeed=1;
this.rollSpeed=0.005;
this.autoForward=this.dragToLook=false;
this.object.useQuaternion=true;
this.tmpQuaternion=new THREE.Quaternion;
this.mouseStatus=0;
this.moveState={up:0,down:0,left:0,right:0,forward:0,back:0,pitchUp:0,pitchDown:0,yawLeft:0,yawRight:0,rollLeft:0,rollRight:0};
this.moveVector=new THREE.Vector3(0,0,0);
this.rotationVector=new THREE.Vector3(0,0,0);
this.handleEvent=function(b){if(typeof this[b.type]=="function"){this[b.type](b)
}};
this.keydown=function(b){if(!b.altKey){switch(b.keyCode){case 16:this.movementSpeedMultiplier=0.1;
break;
case 87:this.moveState.forward=1;
break;
case 83:this.moveState.back=1;
break;
case 65:this.moveState.left=1;
break;
case 68:this.moveState.right=1;
break;
case 82:this.moveState.up=1;
break;
case 70:this.moveState.down=1;
break;
case 38:this.moveState.pitchUp=1;
break;
case 40:this.moveState.pitchDown=1;
break;
case 37:this.moveState.yawLeft=1;
break;
case 39:this.moveState.yawRight=1;
break;
case 81:this.moveState.rollLeft=1;
break;
case 69:this.moveState.rollRight=1
}this.updateMovementVector();
this.updateRotationVector()
}};
this.keyup=function(b){switch(b.keyCode){case 16:this.movementSpeedMultiplier=1;
break;
case 87:this.moveState.forward=0;
break;
case 83:this.moveState.back=0;
break;
case 65:this.moveState.left=0;
break;
case 68:this.moveState.right=0;
break;
case 82:this.moveState.up=0;
break;
case 70:this.moveState.down=0;
break;
case 38:this.moveState.pitchUp=0;
break;
case 40:this.moveState.pitchDown=0;
break;
case 37:this.moveState.yawLeft=0;
break;
case 39:this.moveState.yawRight=0;
break;
case 81:this.moveState.rollLeft=0;
break;
case 69:this.moveState.rollRight=0
}this.updateMovementVector();
this.updateRotationVector()
};
this.mousedown=function(b){this.domElement!==document&&this.domElement.focus();
b.preventDefault();
b.stopPropagation();
if(this.dragToLook){this.mouseStatus++
}else{switch(b.button){case 0:this.object.moveForward=true;
break;
case 2:this.object.moveBackward=true
}}};
this.mousemove=function(k){if(!this.dragToLook||this.mouseStatus>0){var h=this.getContainerDimensions(),m=h.size[0]/2,l=h.size[1]/2;
this.moveState.yawLeft=-(k.pageX-h.offset[0]-m)/m;
this.moveState.pitchDown=(k.pageY-h.offset[1]-l)/l;
this.updateRotationVector()
}};
this.mouseup=function(b){b.preventDefault();
b.stopPropagation();
if(this.dragToLook){this.mouseStatus--;
this.moveState.yawLeft=this.moveState.pitchDown=0
}else{switch(b.button){case 0:this.moveForward=false;
break;
case 2:this.moveBackward=false
}}this.updateRotationVector()
};
this.update=function(g){var c=g*this.movementSpeed,g=g*this.rollSpeed;
this.object.translateX(this.moveVector.x*c);
this.object.translateY(this.moveVector.y*c);
this.object.translateZ(this.moveVector.z*c);
this.tmpQuaternion.set(this.rotationVector.x*g,this.rotationVector.y*g,this.rotationVector.z*g,1).normalize();
this.object.quaternion.multiplySelf(this.tmpQuaternion);
this.object.matrix.setPosition(this.object.position);
this.object.matrix.setRotationFromQuaternion(this.object.quaternion);
this.object.matrixWorldNeedsUpdate=true
};
this.updateMovementVector=function(){var b=this.moveState.forward||this.autoForward&&!this.moveState.back?1:0;
this.moveVector.x=-this.moveState.left+this.moveState.right;
this.moveVector.y=-this.moveState.down+this.moveState.up;
this.moveVector.z=-b+this.moveState.back
};
this.updateRotationVector=function(){this.rotationVector.x=-this.moveState.pitchDown+this.moveState.pitchUp;
this.rotationVector.y=-this.moveState.yawRight+this.moveState.yawLeft;
this.rotationVector.z=-this.moveState.rollRight+this.moveState.rollLeft
};
this.getContainerDimensions=function(){return this.domElement!=document?{size:[this.domElement.offsetWidth,this.domElement.offsetHeight],offset:[this.domElement.offsetLeft,this.domElement.offsetTop]}:{size:[window.innerWidth,window.innerHeight],offset:[0,0]}
};
this.domElement.addEventListener("mousemove",f(this,this.mousemove),false);
this.domElement.addEventListener("mousedown",f(this,this.mousedown),false);
this.domElement.addEventListener("mouseup",f(this,this.mouseup),false);
this.domElement.addEventListener("keydown",f(this,this.keydown),false);
this.domElement.addEventListener("keyup",f(this,this.keyup),false);
this.updateMovementVector();
this.updateRotationVector()
};
THREE.RollControls=function(E,D){this.object=E;
this.domElement=D!==void 0?D:document;
this.mouseLook=true;
this.autoForward=false;
this.rollSpeed=this.movementSpeed=this.lookSpeed=1;
this.constrainVertical=[-0.9,0.9];
this.object.matrixAutoUpdate=false;
this.forward=new THREE.Vector3(0,0,1);
this.roll=0;
var C=new THREE.Vector3,B=new THREE.Vector3,A=new THREE.Vector3,z=new THREE.Matrix4,y=false,x=1,w=0,u=0,v=0,r=0,t=0,s=window.innerWidth/2,n=window.innerHeight/2;
this.update=function(d){if(this.mouseLook){var c=d*this.lookSpeed;
this.rotateHorizontally(c*r);
this.rotateVertically(c*t)
}c=d*this.movementSpeed;
this.object.translateZ(-c*(w>0||this.autoForward&&!(w<0)?1:w));
this.object.translateX(c*u);
this.object.translateY(c*v);
if(y){this.roll=this.roll+this.rollSpeed*d*x
}if(this.forward.y>this.constrainVertical[1]){this.forward.y=this.constrainVertical[1];
this.forward.normalize()
}else{if(this.forward.y<this.constrainVertical[0]){this.forward.y=this.constrainVertical[0];
this.forward.normalize()
}}A.copy(this.forward);
B.set(0,1,0);
C.cross(B,A).normalize();
B.cross(A,C).normalize();
this.object.matrix.elements[0]=C.x;
this.object.matrix.elements[4]=B.x;
this.object.matrix.elements[8]=A.x;
this.object.matrix.elements[1]=C.y;
this.object.matrix.elements[5]=B.y;
this.object.matrix.elements[9]=A.y;
this.object.matrix.elements[2]=C.z;
this.object.matrix.elements[6]=B.z;
this.object.matrix.elements[10]=A.z;
z.identity();
z.elements[0]=Math.cos(this.roll);
z.elements[4]=-Math.sin(this.roll);
z.elements[1]=Math.sin(this.roll);
z.elements[5]=Math.cos(this.roll);
this.object.matrix.multiplySelf(z);
this.object.matrixWorldNeedsUpdate=true;
this.object.matrix.elements[12]=this.object.position.x;
this.object.matrix.elements[13]=this.object.position.y;
this.object.matrix.elements[14]=this.object.position.z
};
this.translateX=function(b){this.object.position.x=this.object.position.x+this.object.matrix.elements[0]*b;
this.object.position.y=this.object.position.y+this.object.matrix.elements[1]*b;
this.object.position.z=this.object.position.z+this.object.matrix.elements[2]*b
};
this.translateY=function(b){this.object.position.x=this.object.position.x+this.object.matrix.elements[4]*b;
this.object.position.y=this.object.position.y+this.object.matrix.elements[5]*b;
this.object.position.z=this.object.position.z+this.object.matrix.elements[6]*b
};
this.translateZ=function(b){this.object.position.x=this.object.position.x-this.object.matrix.elements[8]*b;
this.object.position.y=this.object.position.y-this.object.matrix.elements[9]*b;
this.object.position.z=this.object.position.z-this.object.matrix.elements[10]*b
};
this.rotateHorizontally=function(b){C.set(this.object.matrix.elements[0],this.object.matrix.elements[1],this.object.matrix.elements[2]);
C.multiplyScalar(b);
this.forward.subSelf(C);
this.forward.normalize()
};
this.rotateVertically=function(b){B.set(this.object.matrix.elements[4],this.object.matrix.elements[5],this.object.matrix.elements[6]);
B.multiplyScalar(b);
this.forward.addSelf(B);
this.forward.normalize()
};
this.domElement.addEventListener("contextmenu",function(b){b.preventDefault()
},false);
this.domElement.addEventListener("mousemove",function(b){r=(b.clientX-s)/window.innerWidth;
t=(b.clientY-n)/window.innerHeight
},false);
this.domElement.addEventListener("mousedown",function(b){b.preventDefault();
b.stopPropagation();
switch(b.button){case 0:w=1;
break;
case 2:w=-1
}},false);
this.domElement.addEventListener("mouseup",function(b){b.preventDefault();
b.stopPropagation();
switch(b.button){case 0:w=0;
break;
case 2:w=0
}},false);
this.domElement.addEventListener("keydown",function(b){switch(b.keyCode){case 38:case 87:w=1;
break;
case 37:case 65:u=-1;
break;
case 40:case 83:w=-1;
break;
case 39:case 68:u=1;
break;
case 81:y=true;
x=1;
break;
case 69:y=true;
x=-1;
break;
case 82:v=1;
break;
case 70:v=-1
}},false);
this.domElement.addEventListener("keyup",function(b){switch(b.keyCode){case 38:case 87:w=0;
break;
case 37:case 65:u=0;
break;
case 40:case 83:w=0;
break;
case 39:case 68:u=0;
break;
case 81:y=false;
break;
case 69:y=false;
break;
case 82:v=0;
break;
case 70:v=0
}},false)
};
THREE.TrackballControls=function(C,B){THREE.EventTarget.call(this);
var A=this;
this.object=C;
this.domElement=B!==void 0?B:document;
this.enabled=true;
this.screen={width:window.innerWidth,height:window.innerHeight,offsetLeft:0,offsetTop:0};
this.radius=(this.screen.width+this.screen.height)/4;
this.rotateSpeed=1;
this.zoomSpeed=1.2;
this.panSpeed=0.3;
this.staticMoving=this.noPan=this.noZoom=this.noRotate=false;
this.dynamicDampingFactor=0.2;
this.minDistance=0;
this.maxDistance=Infinity;
this.keys=[65,83,68];
this.target=new THREE.Vector3;
var z=new THREE.Vector3,y=false,x=-1,w=new THREE.Vector3,v=new THREE.Vector3,u=new THREE.Vector3,s=new THREE.Vector2,t=new THREE.Vector2,n=new THREE.Vector2,r=new THREE.Vector2,q={type:"change"};
this.handleEvent=function(b){if(typeof this[b.type]=="function"){this[b.type](b)
}};
this.getMouseOnScreen=function(d,c){return new THREE.Vector2((d-A.screen.offsetLeft)/A.radius*0.5,(c-A.screen.offsetTop)/A.radius*0.5)
};
this.getMouseProjectionOnBall=function(f,c){var h=new THREE.Vector3((f-A.screen.width*0.5-A.screen.offsetLeft)/A.radius,(A.screen.height*0.5+A.screen.offsetTop-c)/A.radius,0),g=h.length();
g>1?h.normalize():h.z=Math.sqrt(1-g*g);
w.copy(A.object.position).subSelf(A.target);
g=A.object.up.clone().setLength(h.y);
g.addSelf(A.object.up.clone().crossSelf(w).setLength(h.x));
g.addSelf(w.setLength(h.z));
return g
};
this.rotateCamera=function(){var e=Math.acos(v.dot(u)/v.length()/u.length());
if(e){var c=(new THREE.Vector3).cross(v,u).normalize(),f=new THREE.Quaternion,e=e*A.rotateSpeed;
f.setFromAxisAngle(c,-e);
f.multiplyVector3(w);
f.multiplyVector3(A.object.up);
f.multiplyVector3(u);
if(A.staticMoving){v=u
}else{f.setFromAxisAngle(c,e*(A.dynamicDampingFactor-1));
f.multiplyVector3(v)
}}};
this.zoomCamera=function(){var b=1+(t.y-s.y)*A.zoomSpeed;
if(b!==1&&b>0){w.multiplyScalar(b);
A.staticMoving?s=t:s.y=s.y+(t.y-s.y)*this.dynamicDampingFactor
}};
this.panCamera=function(){var d=r.clone().subSelf(n);
if(d.lengthSq()){d.multiplyScalar(w.length()*A.panSpeed);
var c=w.clone().crossSelf(A.object.up).setLength(d.x);
c.addSelf(A.object.up.clone().setLength(d.y));
A.object.position.addSelf(c);
A.target.addSelf(c);
A.staticMoving?n=r:n.addSelf(d.sub(r,n).multiplyScalar(A.dynamicDampingFactor))
}};
this.checkDistances=function(){if(!A.noZoom||!A.noPan){A.object.position.lengthSq()>A.maxDistance*A.maxDistance&&A.object.position.setLength(A.maxDistance);
w.lengthSq()<A.minDistance*A.minDistance&&A.object.position.add(A.target,w.setLength(A.minDistance))
}};
this.update=function(){w.copy(A.object.position).subSelf(A.target);
A.noRotate||A.rotateCamera();
A.noZoom||A.zoomCamera();
A.noPan||A.panCamera();
A.object.position.add(A.target,w);
A.checkDistances();
A.object.lookAt(A.target);
if(z.distanceTo(A.object.position)>0){A.dispatchEvent(q);
z.copy(A.object.position)
}};
this.domElement.addEventListener("contextmenu",function(b){b.preventDefault()
},false);
this.domElement.addEventListener("mousemove",function(b){if(A.enabled){if(y){v=u=A.getMouseProjectionOnBall(b.clientX,b.clientY);
s=t=A.getMouseOnScreen(b.clientX,b.clientY);
n=r=A.getMouseOnScreen(b.clientX,b.clientY);
y=false
}x!==-1&&(x===0&&!A.noRotate?u=A.getMouseProjectionOnBall(b.clientX,b.clientY):x===1&&!A.noZoom?t=A.getMouseOnScreen(b.clientX,b.clientY):x===2&&!A.noPan&&(r=A.getMouseOnScreen(b.clientX,b.clientY)))
}},false);
this.domElement.addEventListener("mousedown",function(b){if(A.enabled){b.preventDefault();
b.stopPropagation();
if(x===-1){x=b.button;
x===0&&!A.noRotate?v=u=A.getMouseProjectionOnBall(b.clientX,b.clientY):x===1&&!A.noZoom?s=t=A.getMouseOnScreen(b.clientX,b.clientY):this.noPan||(n=r=A.getMouseOnScreen(b.clientX,b.clientY))
}}},false);
this.domElement.addEventListener("mouseup",function(b){if(A.enabled){b.preventDefault();
b.stopPropagation();
x=-1
}},false);
window.addEventListener("keydown",function(b){if(A.enabled&&x===-1){b.keyCode===A.keys[0]&&!A.noRotate?x=0:b.keyCode===A.keys[1]&&!A.noZoom?x=1:b.keyCode===A.keys[2]&&!A.noPan&&(x=2);
x!==-1&&(y=true)
}},false);
window.addEventListener("keyup",function(){A.enabled&&x!==-1&&(x=-1)
},false)
};
THREE.CubeGeometry=function(O,N,M,L,K,J,I,H){function G(af,ae,ad,ac,ab,Z,X,W){var V,T=L||1,U=K||1,S=ab/2,R=Z/2,P=E.vertices.length;
if(af==="x"&&ae==="y"||af==="y"&&ae==="x"){V="z"
}else{if(af==="x"&&ae==="z"||af==="z"&&ae==="x"){V="y";
U=J||1
}else{if(af==="z"&&ae==="y"||af==="y"&&ae==="z"){V="x";
T=J||1
}}}var aa=T+1,l=U+1,e=ab/T,Q=Z/U,d=new THREE.Vector3;
d[V]=X>0?1:-1;
for(ab=0;
ab<l;
ab++){for(Z=0;
Z<aa;
Z++){var f=new THREE.Vector3;
f[af]=(Z*e-S)*ad;
f[ae]=(ab*Q-R)*ac;
f[V]=X;
E.vertices.push(f)
}}for(ab=0;
ab<U;
ab++){for(Z=0;
Z<T;
Z++){af=new THREE.Face4(Z+aa*ab+P,Z+aa*(ab+1)+P,Z+1+aa*(ab+1)+P,Z+1+aa*ab+P);
af.normal.copy(d);
af.vertexNormals.push(d.clone(),d.clone(),d.clone(),d.clone());
af.materialIndex=W;
E.faces.push(af);
E.faceVertexUvs[0].push([new THREE.UV(Z/T,ab/U),new THREE.UV(Z/T,(ab+1)/U),new THREE.UV((Z+1)/T,(ab+1)/U),new THREE.UV((Z+1)/T,ab/U)])
}}}THREE.Geometry.call(this);
var E=this,F=O/2,A=N/2,D=M/2,B,z,C,x,v,w;
if(I!==void 0){if(I instanceof Array){this.materials=I
}else{this.materials=[];
for(B=0;
B<6;
B++){this.materials.push(I)
}}B=0;
x=1;
z=2;
v=3;
C=4;
w=5
}else{this.materials=[]
}this.sides={px:true,nx:true,py:true,ny:true,pz:true,nz:true};
if(H!=void 0){for(var s in H){this.sides[s]!==void 0&&(this.sides[s]=H[s])
}}this.sides.px&&G("z","y",-1,-1,M,N,F,B);
this.sides.nx&&G("z","y",1,-1,M,N,-F,x);
this.sides.py&&G("x","z",1,1,O,M,A,z);
this.sides.ny&&G("x","z",1,-1,O,M,-A,v);
this.sides.pz&&G("x","y",1,-1,O,N,D,C);
this.sides.nz&&G("x","y",-1,-1,O,N,-D,w);
this.computeCentroids();
this.mergeVertices()
};
THREE.CubeGeometry.prototype=new THREE.Geometry;
THREE.CubeGeometry.prototype.constructor=THREE.CubeGeometry;
THREE.CylinderGeometry=function(Y,X,W,V,U,T){THREE.Geometry.call(this);
var Y=Y!==void 0?Y:20,X=X!==void 0?X:20,W=W!==void 0?W:100,S=W/2,V=V||8,U=U||1,R,Q,O=[],P=[];
for(Q=0;
Q<=U;
Q++){var K=[],N=[],L=Q/U,J=L*(X-Y)+Y;
for(R=0;
R<=V;
R++){var M=R/V,I=new THREE.Vector3;
I.x=J*Math.sin(M*Math.PI*2);
I.y=-L*W+S;
I.z=J*Math.cos(M*Math.PI*2);
this.vertices.push(I);
K.push(this.vertices.length-1);
N.push(new THREE.UV(M,L))
}O.push(K);
P.push(N)
}W=(X-Y)/W;
for(R=0;
R<V;
R++){if(Y!==0){K=this.vertices[O[0][R]].clone();
N=this.vertices[O[0][R+1]].clone()
}else{K=this.vertices[O[1][R]].clone();
N=this.vertices[O[1][R+1]].clone()
}K.setY(Math.sqrt(K.x*K.x+K.z*K.z)*W).normalize();
N.setY(Math.sqrt(N.x*N.x+N.z*N.z)*W).normalize();
for(Q=0;
Q<U;
Q++){var L=O[Q][R],J=O[Q+1][R],M=O[Q+1][R+1],I=O[Q][R+1],C=K.clone(),F=K.clone(),x=N.clone(),G=N.clone(),B=P[Q][R].clone(),A=P[Q+1][R].clone(),D=P[Q+1][R+1].clone(),v=P[Q][R+1].clone();
this.faces.push(new THREE.Face4(L,J,M,I,[C,F,x,G]));
this.faceVertexUvs[0].push([B,A,D,v])
}}if(!T&&Y>0){this.vertices.push(new THREE.Vector3(0,S,0));
for(R=0;
R<V;
R++){L=O[0][R];
J=O[0][R+1];
M=this.vertices.length-1;
C=new THREE.Vector3(0,1,0);
F=new THREE.Vector3(0,1,0);
x=new THREE.Vector3(0,1,0);
B=P[0][R].clone();
A=P[0][R+1].clone();
D=new THREE.UV(A.u,0);
this.faces.push(new THREE.Face3(L,J,M,[C,F,x]));
this.faceVertexUvs[0].push([B,A,D])
}}if(!T&&X>0){this.vertices.push(new THREE.Vector3(0,-S,0));
for(R=0;
R<V;
R++){L=O[Q][R+1];
J=O[Q][R];
M=this.vertices.length-1;
C=new THREE.Vector3(0,-1,0);
F=new THREE.Vector3(0,-1,0);
x=new THREE.Vector3(0,-1,0);
B=P[Q][R+1].clone();
A=P[Q][R].clone();
D=new THREE.UV(A.u,1);
this.faces.push(new THREE.Face3(L,J,M,[C,F,x]));
this.faceVertexUvs[0].push([B,A,D])
}}this.computeCentroids();
this.computeFaceNormals()
};
THREE.CylinderGeometry.prototype=new THREE.Geometry;
THREE.CylinderGeometry.prototype.constructor=THREE.CylinderGeometry;
THREE.ExtrudeGeometry=function(d,c){if(typeof d!=="undefined"){THREE.Geometry.call(this);
d=d instanceof Array?d:[d];
this.shapebb=d[d.length-1].getBoundingBox();
this.addShapeList(d,c);
this.computeCentroids();
this.computeFaceNormals()
}};
THREE.ExtrudeGeometry.prototype=new THREE.Geometry;
THREE.ExtrudeGeometry.prototype.constructor=THREE.ExtrudeGeometry;
THREE.ExtrudeGeometry.prototype.addShapeList=function(f,e){for(var h=f.length,g=0;
g<h;
g++){this.addShape(f[g],e)
}};
THREE.ExtrudeGeometry.prototype.addShape=function(aH,aG){function aF(e,d,f){d||console.log("die");
return d.clone().multiplyScalar(f).addSelf(e)
}function aE(s,r,q){var p=THREE.ExtrudeGeometry.__v1,o=THREE.ExtrudeGeometry.__v2,n=THREE.ExtrudeGeometry.__v3,m=THREE.ExtrudeGeometry.__v4,l=THREE.ExtrudeGeometry.__v5,k=THREE.ExtrudeGeometry.__v6;
p.set(s.x-r.x,s.y-r.y);
o.set(s.x-q.x,s.y-q.y);
p=p.normalize();
o=o.normalize();
n.set(-p.y,p.x);
m.set(o.y,-o.x);
l.copy(s).addSelf(n);
k.copy(s).addSelf(m);
if(l.equals(k)){return m.clone()
}l.copy(r).addSelf(n);
k.copy(q).addSelf(m);
n=p.dot(m);
m=k.subSelf(l).dot(m);
if(n===0){console.log("Either infinite or no solutions!");
m===0?console.log("Its finite solutions."):console.log("Too bad, no solutions.")
}m=m/n;
if(m<0){r=Math.atan2(r.y-s.y,r.x-s.x);
s=Math.atan2(q.y-s.y,q.x-s.x);
r>s&&(s=s+Math.PI*2);
q=(r+s)/2;
s=-Math.cos(q);
q=-Math.sin(q);
return new THREE.Vector2(s,q)
}return p.multiplyScalar(m).addSelf(l).subSelf(s).clone()
}function aD(A,z){var y,w;
for(ab=A.length;
--ab>=0;
){y=ab;
w=ab-1;
w<0&&(w=A.length-1);
for(var v=0,u=av+ax*2,v=0;
v<u;
v++){var t=I*v,s=I*(v+1),r=z+y+t,t=z+w+t,m=z+w+s,s=z+y+s,b=A,k=v,a=u,r=r+X,t=t+X,m=m+X,s=s+X;
af.faces.push(new THREE.Face4(r,t,m,s,null,null,an));
r=S.generateSideWallUV(af,aH,b,aG,r,t,m,s,k,a);
af.faceVertexUvs[0].push(r)
}}}function aC(e,d,f){af.vertices.push(new THREE.Vector3(e,d,f))
}function aB(h,g,b,a){h=h+X;
g=g+X;
b=b+X;
af.faces.push(new THREE.Face3(h,g,b,null,null,am));
h=a?S.generateBottomUV(af,aH,aG,h,g,b):S.generateTopUV(af,aH,aG,h,g,b);
af.faceVertexUvs[0].push(h)
}var aA=aG.amount!==void 0?aG.amount:100,ay=aG.bevelThickness!==void 0?aG.bevelThickness:6,aw=aG.bevelSize!==void 0?aG.bevelSize:ay-2,ax=aG.bevelSegments!==void 0?aG.bevelSegments:3,ar=aG.bevelEnabled!==void 0?aG.bevelEnabled:true,av=aG.steps!==void 0?aG.steps:1,at=aG.bendPath,aq=aG.extrudePath,au,ap=false,am=aG.material,an=aG.extrudeMaterial,aj,ao,ak,Z;
if(aq){au=aq.getSpacedPoints(av);
ap=true;
ar=false;
aj=new THREE.TubeGeometry.FrenetFrames(aq,av,false);
ao=new THREE.Vector3;
ak=new THREE.Vector3;
Z=new THREE.Vector3
}if(!ar){aw=ay=ax=0
}var ac,ai,al,af=this,X=this.vertices.length;
at&&aH.addWrapPath(at);
var aq=aH.extractPoints(),at=aq.shape,W=aq.holes;
if(aq=!THREE.Shape.Utils.isClockWise(at)){at=at.reverse();
ai=0;
for(al=W.length;
ai<al;
ai++){ac=W[ai];
THREE.Shape.Utils.isClockWise(ac)&&(W[ai]=ac.reverse())
}aq=false
}var N=THREE.Shape.Utils.triangulateShape(at,W),Q=at;
ai=0;
for(al=W.length;
ai<al;
ai++){ac=W[ai];
at=at.concat(ac)
}var ad,V,aa,az,L,I=at.length,ae,B=N.length,aq=[],ab=0;
aa=Q.length;
ad=aa-1;
for(V=ab+1;
ab<aa;
ab++,ad++,V++){ad===aa&&(ad=0);
V===aa&&(V=0);
aq[ab]=aE(Q[ab],Q[ad],Q[V])
}var x=[],ag,ah=aq.concat();
ai=0;
for(al=W.length;
ai<al;
ai++){ac=W[ai];
ag=[];
ab=0;
aa=ac.length;
ad=aa-1;
for(V=ab+1;
ab<aa;
ab++,ad++,V++){ad===aa&&(ad=0);
V===aa&&(V=0);
ag[ab]=aE(ac[ab],ac[ad],ac[V])
}x.push(ag);
ah=ah.concat(ag)
}for(ad=0;
ad<ax;
ad++){aa=ad/ax;
az=ay*(1-aa);
V=aw*Math.sin(aa*Math.PI/2);
ab=0;
for(aa=Q.length;
ab<aa;
ab++){L=aF(Q[ab],aq[ab],V);
aC(L.x,L.y,-az)
}ai=0;
for(al=W.length;
ai<al;
ai++){ac=W[ai];
ag=x[ai];
ab=0;
for(aa=ac.length;
ab<aa;
ab++){L=aF(ac[ab],ag[ab],V);
aC(L.x,L.y,-az)
}}}V=aw;
for(ab=0;
ab<I;
ab++){L=ar?aF(at[ab],ah[ab],V):at[ab];
if(ap){ak.copy(aj.normals[0]).multiplyScalar(L.x);
ao.copy(aj.binormals[0]).multiplyScalar(L.y);
Z.copy(au[0]).addSelf(ak).addSelf(ao);
aC(Z.x,Z.y,Z.z)
}else{aC(L.x,L.y,0)
}}for(aa=1;
aa<=av;
aa++){for(ab=0;
ab<I;
ab++){L=ar?aF(at[ab],ah[ab],V):at[ab];
if(ap){ak.copy(aj.normals[aa]).multiplyScalar(L.x);
ao.copy(aj.binormals[aa]).multiplyScalar(L.y);
Z.copy(au[aa]).addSelf(ak).addSelf(ao);
aC(Z.x,Z.y,Z.z)
}else{aC(L.x,L.y,aA/av*aa)
}}}for(ad=ax-1;
ad>=0;
ad--){aa=ad/ax;
az=ay*(1-aa);
V=aw*Math.sin(aa*Math.PI/2);
ab=0;
for(aa=Q.length;
ab<aa;
ab++){L=aF(Q[ab],aq[ab],V);
aC(L.x,L.y,aA+az)
}ai=0;
for(al=W.length;
ai<al;
ai++){ac=W[ai];
ag=x[ai];
ab=0;
for(aa=ac.length;
ab<aa;
ab++){L=aF(ac[ab],ag[ab],V);
ap?aC(L.x,L.y+au[av-1].y,au[av-1].x+az):aC(L.x,L.y,aA+az)
}}}var S=THREE.ExtrudeGeometry.WorldUVGenerator;
(function(){if(ar){var b;
b=I*0;
for(ab=0;
ab<B;
ab++){ae=N[ab];
aB(ae[2]+b,ae[1]+b,ae[0]+b,true)
}b=av+ax*2;
b=I*b;
for(ab=0;
ab<B;
ab++){ae=N[ab];
aB(ae[0]+b,ae[1]+b,ae[2]+b,false)
}}else{for(ab=0;
ab<B;
ab++){ae=N[ab];
aB(ae[2],ae[1],ae[0],true)
}for(ab=0;
ab<B;
ab++){ae=N[ab];
aB(ae[0]+I*av,ae[1]+I*av,ae[2]+I*av,false)
}}})();
(function(){var b=0;
aD(Q,b);
b=b+Q.length;
ai=0;
for(al=W.length;
ai<al;
ai++){ac=W[ai];
aD(ac,b);
b=b+ac.length
}})()
};
THREE.ExtrudeGeometry.WorldUVGenerator={generateTopUV:function(h,g,n,m,l,k){g=h.vertices[l].x;
l=h.vertices[l].y;
n=h.vertices[k].x;
k=h.vertices[k].y;
return[new THREE.UV(h.vertices[m].x,1-h.vertices[m].y),new THREE.UV(g,1-l),new THREE.UV(n,1-k)]
},generateBottomUV:function(h,g,n,m,l,k){return this.generateTopUV(h,g,n,m,l,k)
},generateSideWallUV:function(A,z,y,x,w,v,u,t){var z=A.vertices[w].x,y=A.vertices[w].y,w=A.vertices[w].z,x=A.vertices[v].x,s=A.vertices[v].y,v=A.vertices[v].z,q=A.vertices[u].x,r=A.vertices[u].y,u=A.vertices[u].z,n=A.vertices[t].x,o=A.vertices[t].y,A=A.vertices[t].z;
return Math.abs(y-s)<0.01?[new THREE.UV(z,w),new THREE.UV(x,v),new THREE.UV(q,u),new THREE.UV(n,A)]:[new THREE.UV(y,w),new THREE.UV(s,v),new THREE.UV(r,u),new THREE.UV(o,A)]
}};
THREE.ExtrudeGeometry.__v1=new THREE.Vector2;
THREE.ExtrudeGeometry.__v2=new THREE.Vector2;
THREE.ExtrudeGeometry.__v3=new THREE.Vector2;
THREE.ExtrudeGeometry.__v4=new THREE.Vector2;
THREE.ExtrudeGeometry.__v5=new THREE.Vector2;
THREE.ExtrudeGeometry.__v6=new THREE.Vector2;
THREE.LatheGeometry=function(k,h,p){THREE.Geometry.call(this);
for(var h=h||12,p=p||2*Math.PI,o=[],n=(new THREE.Matrix4).makeRotationZ(p/h),m=0;
m<k.length;
m++){o[m]=k[m].clone();
this.vertices.push(o[m])
}for(var l=h+1,p=0;
p<l;
p++){for(m=0;
m<o.length;
m++){o[m]=n.multiplyVector3(o[m].clone());
this.vertices.push(o[m])
}}for(p=0;
p<h;
p++){o=0;
for(n=k.length;
o<n-1;
o++){this.faces.push(new THREE.Face4(p*n+o,(p+1)%l*n+o,(p+1)%l*n+(o+1)%n,p*n+(o+1)%n));
this.faceVertexUvs[0].push([new THREE.UV(1-p/h,o/n),new THREE.UV(1-(p+1)/h,o/n),new THREE.UV(1-(p+1)/h,(o+1)/n),new THREE.UV(1-p/h,(o+1)/n)])
}}this.computeCentroids();
this.computeFaceNormals();
this.computeVertexNormals()
};
THREE.LatheGeometry.prototype=new THREE.Geometry;
THREE.LatheGeometry.prototype.constructor=THREE.LatheGeometry;
THREE.PlaneGeometry=function(w,v,u,t){THREE.Geometry.call(this);
for(var s=w/2,r=v/2,u=u||1,t=t||1,q=u+1,p=t+1,o=w/u,m=v/t,n=new THREE.Vector3(0,1,0),w=0;
w<p;
w++){for(v=0;
v<q;
v++){this.vertices.push(new THREE.Vector3(v*o-s,0,w*m-r))
}}for(w=0;
w<t;
w++){for(v=0;
v<u;
v++){s=new THREE.Face4(v+q*w,v+q*(w+1),v+1+q*(w+1),v+1+q*w);
s.normal.copy(n);
s.vertexNormals.push(n.clone(),n.clone(),n.clone(),n.clone());
this.faces.push(s);
this.faceVertexUvs[0].push([new THREE.UV(v/u,w/t),new THREE.UV(v/u,(w+1)/t),new THREE.UV((v+1)/u,(w+1)/t),new THREE.UV((v+1)/u,w/t)])
}}this.computeCentroids()
};
THREE.PlaneGeometry.prototype=new THREE.Geometry;
THREE.PlaneGeometry.prototype.constructor=THREE.PlaneGeometry;
THREE.SphereGeometry=function(M,L,K,J,I,H,G){THREE.Geometry.call(this);
var M=M||50,J=J!==void 0?J:0,I=I!==void 0?I:Math.PI*2,H=H!==void 0?H:0,G=G!==void 0?G:Math.PI,L=Math.max(3,Math.floor(L)||8),K=Math.max(2,Math.floor(K)||6),F,E,C=[],D=[];
for(E=0;
E<=K;
E++){var y=[],B=[];
for(F=0;
F<=L;
F++){var z=F/L,x=E/K,A=new THREE.Vector3;
A.x=-M*Math.cos(J+z*I)*Math.sin(H+x*G);
A.y=M*Math.cos(H+x*G);
A.z=M*Math.sin(J+z*I)*Math.sin(H+x*G);
this.vertices.push(A);
y.push(this.vertices.length-1);
B.push(new THREE.UV(z,x))
}C.push(y);
D.push(B)
}for(E=0;
E<K;
E++){for(F=0;
F<L;
F++){var J=C[E][F+1],I=C[E][F],H=C[E+1][F],G=C[E+1][F+1],y=this.vertices[J].clone().normalize(),B=this.vertices[I].clone().normalize(),z=this.vertices[H].clone().normalize(),x=this.vertices[G].clone().normalize(),A=D[E][F+1].clone(),w=D[E][F].clone(),s=D[E+1][F].clone(),v=D[E+1][F+1].clone();
if(Math.abs(this.vertices[J].y)==M){this.faces.push(new THREE.Face3(J,H,G,[y,z,x]));
this.faceVertexUvs[0].push([A,s,v])
}else{if(Math.abs(this.vertices[H].y)==M){this.faces.push(new THREE.Face3(J,I,H,[y,B,z]));
this.faceVertexUvs[0].push([A,w,s])
}else{this.faces.push(new THREE.Face4(J,I,H,G,[y,B,z,x]));
this.faceVertexUvs[0].push([A,w,s,v])
}}}}this.computeCentroids();
this.computeFaceNormals();
this.boundingSphere={radius:M}
};
THREE.SphereGeometry.prototype=new THREE.Geometry;
THREE.SphereGeometry.prototype.constructor=THREE.SphereGeometry;
THREE.TextGeometry=function(f,e){var h=(new THREE.TextPath(f,e)).toShapes();
e.amount=e.height!==void 0?e.height:50;
if(e.bevelThickness===void 0){e.bevelThickness=10
}if(e.bevelSize===void 0){e.bevelSize=8
}if(e.bevelEnabled===void 0){e.bevelEnabled=false
}if(e.bend){var g=h[h.length-1].getBoundingBox().maxX;
e.bendPath=new THREE.QuadraticBezierCurve(new THREE.Vector2(0,0),new THREE.Vector2(g/2,120),new THREE.Vector2(g,0))
}THREE.ExtrudeGeometry.call(this,h,e)
};
THREE.TextGeometry.prototype=new THREE.ExtrudeGeometry;
THREE.TextGeometry.prototype.constructor=THREE.TextGeometry;
THREE.FontUtils={faces:{},face:"helvetiker",weight:"normal",style:"normal",size:150,divisions:10,getFace:function(){return this.faces[this.face][this.weight][this.style]
},loadFace:function(d){var c=d.familyName.toLowerCase();
this.faces[c]=this.faces[c]||{};
this.faces[c][d.cssFontWeight]=this.faces[c][d.cssFontWeight]||{};
this.faces[c][d.cssFontWeight][d.cssFontStyle]=d;
return this.faces[c][d.cssFontWeight][d.cssFontStyle]=d
},drawText:function(l){for(var k=this.getFace(),r=this.size/k.resolution,q=0,p=(""+l).split(""),o=p.length,n=[],l=0;
l<o;
l++){var m=new THREE.Path,m=this.extractGlyphPoints(p[l],k,r,q,m),q=q+m.offset;
n.push(m.path)
}return{paths:n,offset:q/2}
},extractGlyphPoints:function(O,N,M,L,K){var J=[],I,H,G,E,F,A,D,B,z,C,x,v=N.glyphs[O]||N.glyphs["?"];
if(v){if(v.o){N=v._cachedOutline||(v._cachedOutline=v.o.split(" "));
E=N.length;
for(O=0;
O<E;
){G=N[O++];
switch(G){case"m":G=N[O++]*M+L;
F=N[O++]*M;
J.push(new THREE.Vector2(G,F));
K.moveTo(G,F);
break;
case"l":G=N[O++]*M+L;
F=N[O++]*M;
J.push(new THREE.Vector2(G,F));
K.lineTo(G,F);
break;
case"q":G=N[O++]*M+L;
F=N[O++]*M;
B=N[O++]*M+L;
z=N[O++]*M;
K.quadraticCurveTo(B,z,G,F);
if(I=J[J.length-1]){A=I.x;
D=I.y;
I=1;
for(H=this.divisions;
I<=H;
I++){var w=I/H,s=THREE.Shape.Utils.b2(w,A,B,G),w=THREE.Shape.Utils.b2(w,D,z,F);
J.push(new THREE.Vector2(s,w))
}}break;
case"b":G=N[O++]*M+L;
F=N[O++]*M;
B=N[O++]*M+L;
z=N[O++]*-M;
C=N[O++]*M+L;
x=N[O++]*-M;
K.bezierCurveTo(G,F,B,z,C,x);
if(I=J[J.length-1]){A=I.x;
D=I.y;
I=1;
for(H=this.divisions;
I<=H;
I++){w=I/H;
s=THREE.Shape.Utils.b3(w,A,B,C,G);
w=THREE.Shape.Utils.b3(w,D,z,x,F);
J.push(new THREE.Vector2(s,w))
}}}}}return{offset:v.ha*M,points:J,path:K}
}}};
(function(d){var c=function(k){for(var h=k.length,n=0,m=h-1,l=0;
l<h;
m=l++){n=n+(k[m].x*k[l].y-k[l].x*k[m].y)
}return n*0.5
};
d.Triangulate=function(ax,aw){var av=ax.length;
if(av<3){return null
}var au=[],at=[],ar=[],ap,an,ao;
if(c(ax)>0){for(an=0;
an<av;
an++){at[an]=an
}}else{for(an=0;
an<av;
an++){at[an]=av-1-an
}}var aj=2*av;
for(an=av-1;
av>2;
){if(aj--<=0){console.log("Warning, unable to triangulate polygon!");
break
}ap=an;
av<=ap&&(ap=0);
an=ap+1;
av<=an&&(an=0);
ao=an+1;
av<=ao&&(ao=0);
var am;
ax:{am=ax;
var ak=ap,ai=an,al=ao,ah=av,ae=at,af=void 0,ab=void 0,ag=void 0,ac=void 0,Q=void 0,V=void 0,aa=void 0,ad=void 0,Z=void 0,ab=am[ae[ak]].x,ag=am[ae[ak]].y,ac=am[ae[ai]].x,Q=am[ae[ai]].y,V=am[ae[al]].x,aa=am[ae[al]].y;
if(1e-10>(ac-ab)*(aa-ag)-(Q-ag)*(V-ab)){am=false
}else{for(af=0;
af<ah;
af++){if(!(af==ak||af==ai||af==al)){var ad=am[ae[af]].x,Z=am[ae[af]].y,O=void 0,N=void 0,F=void 0,I=void 0,W=void 0,L=void 0,S=void 0,aq=void 0,B=void 0,x=void 0,X=void 0,b=void 0,O=F=W=void 0,O=V-ac,N=aa-Q,F=ab-V,I=ag-aa,W=ac-ab,L=Q-ag,S=ad-ab,aq=Z-ag,B=ad-ac,x=Z-Q,X=ad-V,b=Z-aa,O=O*x-N*B,W=W*aq-L*S,F=F*b-I*X;
if(O>=0&&F>=0&&W>=0){am=false;
break ax
}}}am=true
}}if(am){au.push([ax[at[ap]],ax[at[an]],ax[at[ao]]]);
ar.push([at[ap],at[an],at[ao]]);
ap=an;
for(ao=an+1;
ao<av;
ap++,ao++){at[ap]=at[ao]
}av--;
aj=2*av
}}return aw?ar:au
};
d.Triangulate.area=c;
return d
})(THREE.FontUtils);
self._typeface_js={faces:THREE.FontUtils.faces,loadFace:THREE.FontUtils.loadFace};
THREE.TorusGeometry=function(s,r,q,p,o){THREE.Geometry.call(this);
this.radius=s||100;
this.tube=r||40;
this.segmentsR=q||8;
this.segmentsT=p||6;
this.arc=o||Math.PI*2;
o=new THREE.Vector3;
s=[];
r=[];
for(q=0;
q<=this.segmentsR;
q++){for(p=0;
p<=this.segmentsT;
p++){var n=p/this.segmentsT*this.arc,m=q/this.segmentsR*Math.PI*2;
o.x=this.radius*Math.cos(n);
o.y=this.radius*Math.sin(n);
var l=new THREE.Vector3;
l.x=(this.radius+this.tube*Math.cos(m))*Math.cos(n);
l.y=(this.radius+this.tube*Math.cos(m))*Math.sin(n);
l.z=this.tube*Math.sin(m);
this.vertices.push(l);
s.push(new THREE.UV(p/this.segmentsT,1-q/this.segmentsR));
r.push(l.clone().subSelf(o).normalize())
}}for(q=1;
q<=this.segmentsR;
q++){for(p=1;
p<=this.segmentsT;
p++){var o=(this.segmentsT+1)*q+p-1,n=(this.segmentsT+1)*(q-1)+p-1,m=(this.segmentsT+1)*(q-1)+p,l=(this.segmentsT+1)*q+p,k=new THREE.Face4(o,n,m,l,[r[o],r[n],r[m],r[l]]);
k.normal.addSelf(r[o]);
k.normal.addSelf(r[n]);
k.normal.addSelf(r[m]);
k.normal.addSelf(r[l]);
k.normal.normalize();
this.faces.push(k);
this.faceVertexUvs[0].push([s[o].clone(),s[n].clone(),s[m].clone(),s[l].clone()])
}}this.computeCentroids()
};
THREE.TorusGeometry.prototype=new THREE.Geometry;
THREE.TorusGeometry.prototype.constructor=THREE.TorusGeometry;
THREE.TorusKnotGeometry=function(w,v,u,t,s,r,q){function p(k,h,A,z,y,x){var l=Math.cos(k);
Math.cos(h);
h=Math.sin(k);
k=A/z*k;
A=Math.cos(k);
l=y*(2+A)*0.5*l;
h=y*(2+A)*h*0.5;
y=x*y*Math.sin(k)*0.5;
return new THREE.Vector3(l,h,y)
}THREE.Geometry.call(this);
this.radius=w||200;
this.tube=v||40;
this.segmentsR=u||64;
this.segmentsT=t||8;
this.p=s||2;
this.q=r||3;
this.heightScale=q||1;
this.grid=Array(this.segmentsR);
u=new THREE.Vector3;
t=new THREE.Vector3;
s=new THREE.Vector3;
for(w=0;
w<this.segmentsR;
++w){this.grid[w]=Array(this.segmentsT);
for(v=0;
v<this.segmentsT;
++v){var o=w/this.segmentsR*2*this.p*Math.PI,q=v/this.segmentsT*2*Math.PI,r=p(o,q,this.q,this.p,this.radius,this.heightScale),o=p(o+0.01,q,this.q,this.p,this.radius,this.heightScale);
u.sub(o,r);
t.add(o,r);
s.cross(u,t);
t.cross(s,u);
s.normalize();
t.normalize();
o=-this.tube*Math.cos(q);
q=this.tube*Math.sin(q);
r.x=r.x+(o*t.x+q*s.x);
r.y=r.y+(o*t.y+q*s.y);
r.z=r.z+(o*t.z+q*s.z);
this.grid[w][v]=this.vertices.push(new THREE.Vector3(r.x,r.y,r.z))-1
}}for(w=0;
w<this.segmentsR;
++w){for(v=0;
v<this.segmentsT;
++v){var s=(w+1)%this.segmentsR,r=(v+1)%this.segmentsT,u=this.grid[w][v],t=this.grid[s][v],s=this.grid[s][r],r=this.grid[w][r],q=new THREE.UV(w/this.segmentsR,v/this.segmentsT),o=new THREE.UV((w+1)/this.segmentsR,v/this.segmentsT),m=new THREE.UV((w+1)/this.segmentsR,(v+1)/this.segmentsT),n=new THREE.UV(w/this.segmentsR,(v+1)/this.segmentsT);
this.faces.push(new THREE.Face4(u,t,s,r));
this.faceVertexUvs[0].push([q,o,m,n])
}}this.computeCentroids();
this.computeFaceNormals();
this.computeVertexNormals()
};
THREE.TorusKnotGeometry.prototype=new THREE.Geometry;
THREE.TorusKnotGeometry.prototype.constructor=THREE.TorusKnotGeometry;
THREE.TubeGeometry=function(E,D,C,B,A,z){THREE.Geometry.call(this);
this.path=E;
this.segments=D||64;
this.radius=C||1;
this.segmentsRadius=B||8;
this.closed=A||false;
if(z){this.debug=new THREE.Object3D
}this.grid=[];
var y,x,z=this.segments+1,w,u,v,r=new THREE.Vector3,t,s,n,D=new THREE.TubeGeometry.FrenetFrames(E,D,A);
t=D.tangents;
s=D.normals;
n=D.binormals;
this.tangents=t;
this.normals=s;
this.binormals=n;
for(D=0;
D<z;
D++){this.grid[D]=[];
B=D/(z-1);
v=E.getPointAt(B);
B=t[D];
y=s[D];
x=n[D];
if(this.debug){this.debug.add(new THREE.ArrowHelper(B,v,C,255));
this.debug.add(new THREE.ArrowHelper(y,v,C,16711680));
this.debug.add(new THREE.ArrowHelper(x,v,C,65280))
}for(B=0;
B<this.segmentsRadius;
B++){w=B/this.segmentsRadius*2*Math.PI;
u=-this.radius*Math.cos(w);
w=this.radius*Math.sin(w);
r.copy(v);
r.x=r.x+(u*y.x+w*x.x);
r.y=r.y+(u*y.y+w*x.y);
r.z=r.z+(u*y.z+w*x.z);
this.grid[D][B]=this.vertices.push(new THREE.Vector3(r.x,r.y,r.z))-1
}}for(D=0;
D<this.segments;
D++){for(B=0;
B<this.segmentsRadius;
B++){z=A?(D+1)%this.segments:D+1;
r=(B+1)%this.segmentsRadius;
E=this.grid[D][B];
C=this.grid[z][B];
z=this.grid[z][r];
r=this.grid[D][r];
t=new THREE.UV(D/this.segments,B/this.segmentsRadius);
s=new THREE.UV((D+1)/this.segments,B/this.segmentsRadius);
n=new THREE.UV((D+1)/this.segments,(B+1)/this.segmentsRadius);
y=new THREE.UV(D/this.segments,(B+1)/this.segmentsRadius);
this.faces.push(new THREE.Face4(E,C,z,r));
this.faceVertexUvs[0].push([t,s,n,y])
}}this.computeCentroids();
this.computeFaceNormals();
this.computeVertexNormals()
};
THREE.TubeGeometry.prototype=new THREE.Geometry;
THREE.TubeGeometry.prototype.constructor=THREE.TubeGeometry;
THREE.TubeGeometry.FrenetFrames=function(y,x,w){new THREE.Vector3;
var v=new THREE.Vector3;
new THREE.Vector3;
var u=[],t=[],s=[],r=new THREE.Vector3,q=new THREE.Matrix4,x=x+1,n,o,m;
this.tangents=u;
this.normals=t;
this.binormals=s;
for(n=0;
n<x;
n++){o=n/(x-1);
u[n]=y.getTangentAt(o);
u[n].normalize()
}t[0]=new THREE.Vector3;
s[0]=new THREE.Vector3;
y=Number.MAX_VALUE;
n=Math.abs(u[0].x);
o=Math.abs(u[0].y);
m=Math.abs(u[0].z);
if(n<=y){y=n;
v.set(1,0,0)
}if(o<=y){y=o;
v.set(0,1,0)
}m<=y&&v.set(0,0,1);
r.cross(u[0],v).normalize();
t[0].cross(u[0],r);
s[0].cross(u[0],t[0]);
for(n=1;
n<x;
n++){t[n]=t[n-1].clone();
s[n]=s[n-1].clone();
r.cross(u[n-1],u[n]);
if(r.length()>0.0001){r.normalize();
v=Math.acos(u[n-1].dot(u[n]));
q.makeRotationAxis(r,v).multiplyVector3(t[n])
}s[n].cross(u[n],t[n])
}if(w){v=Math.acos(t[0].dot(t[x-1]));
v=v/(x-1);
u[0].dot(r.cross(t[0],t[x-1]))>0&&(v=-v);
for(n=1;
n<x;
n++){q.makeRotationAxis(u[n],v*n).multiplyVector3(t[n]);
s[n].cross(u[n],t[n])
}}};
THREE.PolyhedronGeometry=function(y,x,w,v){function u(e){var d=e.normalize().clone();
d.index=q.vertices.push(d)-1;
var f=Math.atan2(e.z,-e.x)/2/Math.PI+0.5,e=Math.atan2(-e.y,Math.sqrt(e.x*e.x+e.z*e.z))/Math.PI+0.5;
d.uv=new THREE.UV(f,e);
return d
}function t(f,e,h,g){if(g<1){g=new THREE.Face3(f.index,e.index,h.index,[f.clone(),e.clone(),h.clone()]);
g.centroid.addSelf(f).addSelf(e).addSelf(h).divideScalar(3);
g.normal=g.centroid.clone().normalize();
q.faces.push(g);
g=Math.atan2(g.centroid.z,-g.centroid.x);
q.faceVertexUvs[0].push([r(f.uv,f,g),r(e.uv,e,g),r(h.uv,h,g)])
}else{g=g-1;
t(f,s(f,e),s(f,h),g);
t(s(f,e),e,s(e,h),g);
t(s(f,h),s(e,h),h,g);
t(s(f,e),s(e,h),s(f,h),g)
}}function s(e,d){m[e.index]||(m[e.index]=[]);
m[d.index]||(m[d.index]=[]);
var f=m[e.index][d.index];
f===void 0&&(m[e.index][d.index]=m[d.index][e.index]=f=u((new THREE.Vector3).add(e,d).divideScalar(2)));
return f
}function r(e,d,f){f<0&&e.u===1&&(e=new THREE.UV(e.u-1,e.v));
d.x===0&&d.z===0&&(e=new THREE.UV(f/2/Math.PI+0.5,e.v));
return e
}THREE.Geometry.call(this);
for(var w=w||1,v=v||0,q=this,n=0,o=y.length;
n<o;
n++){u(new THREE.Vector3(y[n][0],y[n][1],y[n][2]))
}for(var m=[],y=this.vertices,n=0,o=x.length;
n<o;
n++){t(y[x[n][0]],y[x[n][1]],y[x[n][2]],v)
}this.mergeVertices();
n=0;
for(o=this.vertices.length;
n<o;
n++){this.vertices[n].multiplyScalar(w)
}this.computeCentroids();
this.boundingSphere={radius:w}
};
THREE.PolyhedronGeometry.prototype=new THREE.Geometry;
THREE.PolyhedronGeometry.prototype.constructor=THREE.PolyhedronGeometry;
THREE.IcosahedronGeometry=function(e,d){var f=(1+Math.sqrt(5))/2;
THREE.PolyhedronGeometry.call(this,[[-1,f,0],[1,f,0],[-1,-f,0],[1,-f,0],[0,-1,f],[0,1,f],[0,-1,-f],[0,1,-f],[f,0,-1],[f,0,1],[-f,0,-1],[-f,0,1]],[[0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],[1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],[3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],[4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1]],e,d)
};
THREE.IcosahedronGeometry.prototype=new THREE.Geometry;
THREE.IcosahedronGeometry.prototype.constructor=THREE.IcosahedronGeometry;
THREE.OctahedronGeometry=function(d,c){THREE.PolyhedronGeometry.call(this,[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]],[[0,2,4],[0,4,3],[0,3,5],[0,5,2],[1,2,5],[1,5,3],[1,3,4],[1,4,2]],d,c)
};
THREE.OctahedronGeometry.prototype=new THREE.Geometry;
THREE.OctahedronGeometry.prototype.constructor=THREE.OctahedronGeometry;
THREE.TetrahedronGeometry=function(d,c){THREE.PolyhedronGeometry.call(this,[[1,1,1],[-1,-1,1],[-1,1,-1],[1,-1,-1]],[[2,1,0],[0,3,2],[1,3,0],[2,3,1]],d,c)
};
THREE.TetrahedronGeometry.prototype=new THREE.Geometry;
THREE.TetrahedronGeometry.prototype.constructor=THREE.TetrahedronGeometry;
THREE.ParametricGeometry=function(G,F,E,D){THREE.Geometry.call(this);
var C=this.vertices,B=this.faces,A=this.faceVertexUvs[0],D=D===void 0?false:D,z,y,w,x,s=F+1;
for(z=0;
z<=E;
z++){x=z/E;
for(y=0;
y<=F;
y++){w=y/F;
w=G(w,x);
C.push(w)
}}var v,t,r,u;
for(z=0;
z<E;
z++){for(y=0;
y<F;
y++){G=z*s+y;
C=z*s+y+1;
x=(z+1)*s+y;
w=(z+1)*s+y+1;
v=new THREE.UV(z/F,y/E);
t=new THREE.UV(z/F,(y+1)/E);
r=new THREE.UV((z+1)/F,y/E);
u=new THREE.UV((z+1)/F,(y+1)/E);
if(D){B.push(new THREE.Face3(G,C,x));
B.push(new THREE.Face3(C,w,x));
A.push([v,t,r]);
A.push([t,u,r])
}else{B.push(new THREE.Face4(G,C,w,x));
A.push([v,t,r,u])
}}}this.computeCentroids();
this.computeFaceNormals();
this.computeVertexNormals()
};
THREE.ParametricGeometry.prototype=new THREE.Geometry;
THREE.ParametricGeometry.prototype.constructor=THREE.ParametricGeometry;
THREE.AxisHelper=function(){THREE.Object3D.call(this);
var e=new THREE.Geometry;
e.vertices.push(new THREE.Vector3);
e.vertices.push(new THREE.Vector3(0,100,0));
var d=new THREE.CylinderGeometry(0,5,25,5,1),f;
f=new THREE.Line(e,new THREE.LineBasicMaterial({color:16711680}));
f.rotation.z=-Math.PI/2;
this.add(f);
f=new THREE.Mesh(d,new THREE.MeshBasicMaterial({color:16711680}));
f.position.x=100;
f.rotation.z=-Math.PI/2;
this.add(f);
f=new THREE.Line(e,new THREE.LineBasicMaterial({color:65280}));
this.add(f);
f=new THREE.Mesh(d,new THREE.MeshBasicMaterial({color:65280}));
f.position.y=100;
this.add(f);
f=new THREE.Line(e,new THREE.LineBasicMaterial({color:255}));
f.rotation.x=Math.PI/2;
this.add(f);
f=new THREE.Mesh(d,new THREE.MeshBasicMaterial({color:255}));
f.position.z=100;
f.rotation.x=Math.PI/2;
this.add(f)
};
THREE.AxisHelper.prototype=new THREE.Object3D;
THREE.AxisHelper.prototype.constructor=THREE.AxisHelper;
THREE.ArrowHelper=function(g,f,l,k){THREE.Object3D.call(this);
k===void 0&&(k=16776960);
l===void 0&&(l=20);
var h=new THREE.Geometry;
h.vertices.push(new THREE.Vector3(0,0,0));
h.vertices.push(new THREE.Vector3(0,1,0));
this.line=new THREE.Line(h,new THREE.LineBasicMaterial({color:k}));
this.add(this.line);
h=new THREE.CylinderGeometry(0,0.05,0.25,5,1);
this.cone=new THREE.Mesh(h,new THREE.MeshBasicMaterial({color:k}));
this.cone.position.set(0,1,0);
this.add(this.cone);
if(f instanceof THREE.Vector3){this.position=f
}this.setDirection(g);
this.setLength(l)
};
THREE.ArrowHelper.prototype=new THREE.Object3D;
THREE.ArrowHelper.prototype.constructor=THREE.ArrowHelper;
THREE.ArrowHelper.prototype.setDirection=function(d){var c=(new THREE.Vector3(0,1,0)).crossSelf(d),d=Math.acos((new THREE.Vector3(0,1,0)).dot(d.clone().normalize()));
this.matrix=(new THREE.Matrix4).makeRotationAxis(c.normalize(),d);
this.rotation.getRotationFromMatrix(this.matrix,this.scale)
};
THREE.ArrowHelper.prototype.setLength=function(b){this.scale.set(b,b,b)
};
THREE.ArrowHelper.prototype.setColor=function(b){this.line.material.color.setHex(b);
this.cone.material.color.setHex(b)
};
THREE.CameraHelper=function(f){function e(k,c,l){h(k,l);
h(c,l)
}function h(d,c){g.lineGeometry.vertices.push(new THREE.Vector3);
g.lineGeometry.colors.push(new THREE.Color(c));
g.pointMap[d]===void 0&&(g.pointMap[d]=[]);
g.pointMap[d].push(g.lineGeometry.vertices.length-1)
}THREE.Object3D.call(this);
var g=this;
this.lineGeometry=new THREE.Geometry;
this.lineMaterial=new THREE.LineBasicMaterial({color:16777215,vertexColors:THREE.FaceColors});
this.pointMap={};
e("n1","n2",16755200);
e("n2","n4",16755200);
e("n4","n3",16755200);
e("n3","n1",16755200);
e("f1","f2",16755200);
e("f2","f4",16755200);
e("f4","f3",16755200);
e("f3","f1",16755200);
e("n1","f1",16755200);
e("n2","f2",16755200);
e("n3","f3",16755200);
e("n4","f4",16755200);
e("p","n1",16711680);
e("p","n2",16711680);
e("p","n3",16711680);
e("p","n4",16711680);
e("u1","u2",43775);
e("u2","u3",43775);
e("u3","u1",43775);
e("c","t",16777215);
e("p","c",3355443);
e("cn1","cn2",3355443);
e("cn3","cn4",3355443);
e("cf1","cf2",3355443);
e("cf3","cf4",3355443);
this.camera=f;
this.update(f);
this.lines=new THREE.Line(this.lineGeometry,this.lineMaterial,THREE.LinePieces);
this.add(this.lines)
};
THREE.CameraHelper.prototype=new THREE.Object3D;
THREE.CameraHelper.prototype.constructor=THREE.CameraHelper;
THREE.CameraHelper.prototype.update=function(){function d(b,k,h,g){THREE.CameraHelper.__v.set(k,h,g);
THREE.CameraHelper.__projector.unprojectVector(THREE.CameraHelper.__v,THREE.CameraHelper.__c);
b=c.pointMap[b];
if(b!==void 0){k=0;
for(h=b.length;
k<h;
k++){c.lineGeometry.vertices[b[k]].copy(THREE.CameraHelper.__v)
}}}var c=this;
THREE.CameraHelper.__c.projectionMatrix.copy(this.camera.projectionMatrix);
d("c",0,0,-1);
d("t",0,0,1);
d("n1",-1,-1,-1);
d("n2",1,-1,-1);
d("n3",-1,1,-1);
d("n4",1,1,-1);
d("f1",-1,-1,1);
d("f2",1,-1,1);
d("f3",-1,1,1);
d("f4",1,1,1);
d("u1",0.7,1.1,-1);
d("u2",-0.7,1.1,-1);
d("u3",0,2,-1);
d("cf1",-1,0,1);
d("cf2",1,0,1);
d("cf3",0,-1,1);
d("cf4",0,1,1);
d("cn1",-1,0,-1);
d("cn2",1,0,-1);
d("cn3",0,-1,-1);
d("cn4",0,1,-1);
this.lineGeometry.verticesNeedUpdate=true
};
THREE.CameraHelper.__projector=new THREE.Projector;
THREE.CameraHelper.__v=new THREE.Vector3;
THREE.CameraHelper.__c=new THREE.Camera;
THREE.SubdivisionModifier=function(b){this.subdivisions=b===void 0?1:b;
this.useOldVertexColors=false;
this.supportUVs=true;
this.debug=false
};
THREE.SubdivisionModifier.prototype.constructor=THREE.SubdivisionModifier;
THREE.SubdivisionModifier.prototype.modify=function(d){for(var c=this.subdivisions;
c-->0;
){this.smooth(d)
}};
THREE.SubdivisionModifier.prototype.smooth=function(ay){function ax(){al.debug&&console.log.apply(console,arguments)
}function aw(){console&&console.log.apply(console,arguments)
}function av(A,z,y,w,v,u,t){var s=new THREE.Face4(A,z,y,w,null,v.color,v.material);
if(al.useOldVertexColors){s.vertexColors=[];
for(var p,m,k,f=0;
f<4;
f++){k=u[f];
p=new THREE.Color;
p.setRGB(0,0,0);
for(var b=0;
b<k.length;
b++){m=v.vertexColors[k[b]-1];
p.r=p.r+m.r;
p.g=p.g+m.g;
p.b=p.b+m.b
}p.r=p.r/k.length;
p.g=p.g/k.length;
p.b=p.b/k.length;
s.vertexColors[f]=p
}}an.push(s);
if(al.supportUVs){v=[at(A,""),at(z,t),at(y,t),at(w,t)];
v[0]?v[1]?v[2]?v[3]?ai.push(v):ax("d :( ",w+":"+t):ax("c :( ",y+":"+t):ax("b :( ",z+":"+t):ax("a :( ",A+":"+t)
}}function au(d,c){return Math.min(d,c)+"_"+Math.max(d,c)
}function at(b,h){var g=b+":"+h,c=ae[g];
if(!c){b>=aa&&b<aa+ah.length?ax("face pt"):ax("edge pt");
aw("warning, UV not found for",g);
return null
}return c
}function ar(f,c,h){var g=f+":"+c;
g in ae?aw("dup vertexNo",f,"oldFaceNo",c,"value",h,"key",g,ae[g]):ae[g]=h
}function aq(d,c){F[d]===void 0&&(F[d]=[]);
F[d].push(c)
}function ao(e,d,f){I[e]===void 0&&(I[e]={});
I[e][d]=f
}var am=[],an=[],ai=[],al=this,aj=ay.vertices,ah=ay.faces,am=aj.concat(),ak=[],ag={},ad={},ae={},aa=aj.length,af,ab,Q,V,Z,ac=ay.faceVertexUvs[0],Y;
ax("originalFaces, uvs, originalVerticesLength",ah.length,ac.length,aa);
if(al.supportUVs){af=0;
for(ab=ac.length;
af<ab;
af++){Q=0;
for(V=ac[af].length;
Q<V;
Q++){Y=ah[af]["abcd".charAt(Q)];
ar(Y,af,ac[af][Q])
}}}if(ac.length==0){al.supportUVs=false
}af=0;
for(Z in ae){af++
}if(!af){al.supportUVs=false;
ax("no uvs")
}ax("-- Original Faces + Vertices UVs completed",ae,"vs",ac.length);
af=0;
for(ab=ah.length;
af<ab;
af++){Z=ah[af];
ak.push(Z.centroid);
am.push(Z.centroid);
if(al.supportUVs){ac=new THREE.UV;
if(Z instanceof THREE.Face3){ac.u=at(Z.a,af).u+at(Z.b,af).u+at(Z.c,af).u;
ac.v=at(Z.a,af).v+at(Z.b,af).v+at(Z.c,af).v;
ac.u=ac.u/3;
ac.v=ac.v/3
}else{if(Z instanceof THREE.Face4){ac.u=at(Z.a,af).u+at(Z.b,af).u+at(Z.c,af).u+at(Z.d,af).u;
ac.v=at(Z.a,af).v+at(Z.b,af).v+at(Z.c,af).v+at(Z.d,af).v;
ac.u=ac.u/4;
ac.v=ac.v/4
}}ar(aa+af,"",ac)
}}ax("-- added UVs for new Faces",ae);
ab=function(k){function e(b,d){l[b]===void 0&&(l[b]=[]);
l[b].push(d)
}var p,o,n,m,l={};
p=0;
for(o=k.faces.length;
p<o;
p++){n=k.faces[p];
if(n instanceof THREE.Face3){m=au(n.a,n.b);
e(m,p);
m=au(n.b,n.c);
e(m,p);
m=au(n.c,n.a);
e(m,p)
}else{if(n instanceof THREE.Face4){m=au(n.a,n.b);
e(m,p);
m=au(n.b,n.c);
e(m,p);
m=au(n.c,n.d);
e(m,p);
m=au(n.d,n.a);
e(m,p)
}}}return l
}(ay);
Y=0;
var O,N,F={},I={};
for(af in ab){ac=ab[af];
O=af.split("_");
N=O[0];
O=O[1];
aq(N,[N,O]);
aq(O,[N,O]);
Q=0;
for(V=ac.length;
Q<V;
Q++){Z=ac[Q];
ao(N,Z,af);
ao(O,Z,af)
}ac.length<2&&(ad[af]=true)
}ax("vertexEdgeMap",F,"vertexFaceMap",I);
for(af in ab){ac=ab[af];
Z=ac[0];
V=ac[1];
O=af.split("_");
N=O[0];
O=O[1];
ac=new THREE.Vector3;
if(ad[af]){ac.addSelf(aj[N]);
ac.addSelf(aj[O]);
ac.multiplyScalar(0.5)
}else{ac.addSelf(ak[Z]);
ac.addSelf(ak[V]);
ac.addSelf(aj[N]);
ac.addSelf(aj[O]);
ac.multiplyScalar(0.25)
}ag[af]=aa+ah.length+Y;
am.push(ac);
Y++;
if(al.supportUVs){ac=new THREE.UV;
ac.u=at(N,Z).u+at(O,Z).u;
ac.v=at(N,Z).v+at(O,Z).v;
ac.u=ac.u/2;
ac.v=ac.v/2;
ar(ag[af],Z,ac);
if(!ad[af]){ac=new THREE.UV;
ac.u=at(N,V).u+at(O,V).u;
ac.v=at(N,V).v+at(O,V).v;
ac.u=ac.u/2;
ac.v=ac.v/2;
ar(ag[af],V,ac)
}}}ax("-- Step 2 done");
var W,L;
V=["123","12","2","23"];
O=["123","23","3","31"];
var S=["123","31","1","12"],ap=["1234","12","2","23"],B=["1234","23","3","34"],x=["1234","34","4","41"],X=["1234","41","1","12"];
af=0;
for(ab=ak.length;
af<ab;
af++){Z=ah[af];
ac=aa+af;
if(Z instanceof THREE.Face3){Y=au(Z.a,Z.b);
N=au(Z.b,Z.c);
W=au(Z.c,Z.a);
av(ac,ag[Y],Z.b,ag[N],Z,V,af);
av(ac,ag[N],Z.c,ag[W],Z,O,af);
av(ac,ag[W],Z.a,ag[Y],Z,S,af)
}else{if(Z instanceof THREE.Face4){Y=au(Z.a,Z.b);
N=au(Z.b,Z.c);
W=au(Z.c,Z.d);
L=au(Z.d,Z.a);
av(ac,ag[Y],Z.b,ag[N],Z,ap,af);
av(ac,ag[N],Z.c,ag[W],Z,B,af);
av(ac,ag[W],Z.d,ag[L],Z,x,af);
av(ac,ag[L],Z.a,ag[Y],Z,X,af)
}else{ax("face should be a face!",Z)
}}}ag=new THREE.Vector3;
Z=new THREE.Vector3;
af=0;
for(ab=aj.length;
af<ab;
af++){if(F[af]!==void 0){ag.set(0,0,0);
Z.set(0,0,0);
N=new THREE.Vector3(0,0,0);
ac=0;
for(Q in I[af]){ag.addSelf(ak[Q]);
ac++
}V=0;
Y=F[af].length;
for(Q=0;
Q<Y;
Q++){ad[au(F[af][Q][0],F[af][Q][1])]&&V++
}if(V!=2){ag.divideScalar(ac);
for(Q=0;
Q<Y;
Q++){ac=F[af][Q];
ac=aj[ac[0]].clone().addSelf(aj[ac[1]]).divideScalar(2);
Z.addSelf(ac)
}Z.divideScalar(Y);
N.addSelf(aj[af]);
N.multiplyScalar(Y-3);
N.addSelf(ag);
N.addSelf(Z.multiplyScalar(2));
N.divideScalar(Y);
am[af]=N
}}}ay.vertices=am;
ay.faces=an;
ay.faceVertexUvs[0]=ai;
delete ay.__tmpVertices;
ay.computeCentroids();
ay.computeFaceNormals();
ay.computeVertexNormals()
};
THREE.ImmediateRenderObject=function(){THREE.Object3D.call(this);
this.render=function(){}
};
THREE.ImmediateRenderObject.prototype=new THREE.Object3D;
THREE.ImmediateRenderObject.prototype.constructor=THREE.ImmediateRenderObject;
THREE.LensFlare=function(g,f,l,k,h){THREE.Object3D.call(this);
this.lensFlares=[];
this.positionScreen=new THREE.Vector3;
this.customUpdateCallback=void 0;
g!==void 0&&this.add(g,f,l,k,h)
};
THREE.LensFlare.prototype=new THREE.Object3D;
THREE.LensFlare.prototype.constructor=THREE.LensFlare;
THREE.LensFlare.prototype.supr=THREE.Object3D.prototype;
THREE.LensFlare.prototype.add=function(h,g,n,m,l,k){g===void 0&&(g=-1);
n===void 0&&(n=0);
k===void 0&&(k=1);
l===void 0&&(l=new THREE.Color(16777215));
if(m===void 0){m=THREE.NormalBlending
}n=Math.min(n,Math.max(0,n));
this.lensFlares.push({texture:h,size:g,distance:n,x:0,y:0,z:0,scale:1,rotation:1,opacity:k,color:l,blending:m})
};
THREE.LensFlare.prototype.updateLensFlares=function(){var g,f=this.lensFlares.length,l,k=-this.positionScreen.x*2,h=-this.positionScreen.y*2;
for(g=0;
g<f;
g++){l=this.lensFlares[g];
l.x=this.positionScreen.x+k*l.distance;
l.y=this.positionScreen.y+h*l.distance;
l.wantedRotation=l.x*Math.PI*0.25;
l.rotation=l.rotation+(l.wantedRotation-l.rotation)*0.25
}};
THREE.MorphBlendMesh=function(e,d){THREE.Mesh.call(this,e,d);
this.animationsMap={};
this.animationsList=[];
var f=this.geometry.morphTargets.length;
this.createAnimation("__default",0,f-1,f/1);
this.setAnimationWeight("__default",1)
};
THREE.MorphBlendMesh.prototype=new THREE.Mesh;
THREE.MorphBlendMesh.prototype.constructor=THREE.MorphBlendMesh;
THREE.MorphBlendMesh.prototype.createAnimation=function(f,e,h,g){e={startFrame:e,endFrame:h,length:h-e+1,fps:g,duration:(h-e)/g,lastFrame:0,currentFrame:0,active:false,time:0,direction:1,weight:1,directionBackwards:false,mirroredLoop:false};
this.animationsMap[f]=e;
this.animationsList.push(e)
};
THREE.MorphBlendMesh.prototype.autoCreateAnimations=function(s){for(var r=/([a-z]+)(\d+)/,q,p={},o=this.geometry,n=0,m=o.morphTargets.length;
n<m;
n++){var l=o.morphTargets[n].name.match(r);
if(l&&l.length>1){var k=l[1];
p[k]||(p[k]={start:Infinity,end:-Infinity});
l=p[k];
if(n<l.start){l.start=n
}if(n>l.end){l.end=n
}q||(q=k)
}}for(k in p){l=p[k];
this.createAnimation(k,l.start,l.end,s)
}this.firstAnimation=q
};
THREE.MorphBlendMesh.prototype.setAnimationDirectionForward=function(b){if(b=this.animationsMap[b]){b.direction=1;
b.directionBackwards=false
}};
THREE.MorphBlendMesh.prototype.setAnimationDirectionBackward=function(b){if(b=this.animationsMap[b]){b.direction=-1;
b.directionBackwards=true
}};
THREE.MorphBlendMesh.prototype.setAnimationFPS=function(e,d){var f=this.animationsMap[e];
if(f){f.fps=d;
f.duration=(f.end-f.start)/f.fps
}};
THREE.MorphBlendMesh.prototype.setAnimationDuration=function(e,d){var f=this.animationsMap[e];
if(f){f.duration=d;
f.fps=(f.end-f.start)/f.duration
}};
THREE.MorphBlendMesh.prototype.setAnimationWeight=function(e,d){var f=this.animationsMap[e];
if(f){f.weight=d
}};
THREE.MorphBlendMesh.prototype.setAnimationTime=function(e,d){var f=this.animationsMap[e];
if(f){f.time=d
}};
THREE.MorphBlendMesh.prototype.getAnimationTime=function(d){var c=0;
if(d=this.animationsMap[d]){c=d.time
}return c
};
THREE.MorphBlendMesh.prototype.getAnimationDuration=function(d){var c=-1;
if(d=this.animationsMap[d]){c=d.duration
}return c
};
THREE.MorphBlendMesh.prototype.playAnimation=function(d){var c=this.animationsMap[d];
if(c){c.time=0;
c.active=true
}else{console.warn("animation["+d+"] undefined")
}};
THREE.MorphBlendMesh.prototype.stopAnimation=function(b){if(b=this.animationsMap[b]){b.active=false
}};
THREE.MorphBlendMesh.prototype.update=function(k){for(var h=0,p=this.animationsList.length;
h<p;
h++){var o=this.animationsList[h];
if(o.active){var n=o.duration/o.length;
o.time=o.time+o.direction*k;
if(o.mirroredLoop){if(o.time>o.duration||o.time<0){o.direction=o.direction*-1;
if(o.time>o.duration){o.time=o.duration;
o.directionBackwards=true
}if(o.time<0){o.time=0;
o.directionBackwards=false
}}}else{o.time=o.time%o.duration;
if(o.time<0){o.time=o.time+o.duration
}}var m=o.startFrame+THREE.Math.clamp(Math.floor(o.time/n),0,o.length-1),l=o.weight;
if(m!==o.currentFrame){this.morphTargetInfluences[o.lastFrame]=0;
this.morphTargetInfluences[o.currentFrame]=1*l;
this.morphTargetInfluences[m]=0;
o.lastFrame=o.currentFrame;
o.currentFrame=m
}n=o.time%n/n;
o.directionBackwards&&(n=1-n);
this.morphTargetInfluences[o.currentFrame]=n*l;
this.morphTargetInfluences[o.lastFrame]=(1-n)*l
}}};
THREE.LensFlarePlugin=function(){function C(b){var h=B.createProgram(),g=B.createShader(B.FRAGMENT_SHADER),f=B.createShader(B.VERTEX_SHADER);
B.shaderSource(g,b.fragmentShader);
B.shaderSource(f,b.vertexShader);
B.compileShader(g);
B.compileShader(f);
B.attachShader(h,g);
B.attachShader(h,f);
B.linkProgram(h);
return h
}var B,A,z,y,x,w,v,u,s,t,n,r,q;
this.init=function(a){B=a.context;
A=a;
z=new Float32Array(16);
y=new Uint16Array(6);
a=0;
z[a++]=-1;
z[a++]=-1;
z[a++]=0;
z[a++]=0;
z[a++]=1;
z[a++]=-1;
z[a++]=1;
z[a++]=0;
z[a++]=1;
z[a++]=1;
z[a++]=1;
z[a++]=1;
z[a++]=-1;
z[a++]=1;
z[a++]=0;
z[a++]=1;
a=0;
y[a++]=0;
y[a++]=1;
y[a++]=2;
y[a++]=0;
y[a++]=2;
y[a++]=3;
x=B.createBuffer();
w=B.createBuffer();
B.bindBuffer(B.ARRAY_BUFFER,x);
B.bufferData(B.ARRAY_BUFFER,z,B.STATIC_DRAW);
B.bindBuffer(B.ELEMENT_ARRAY_BUFFER,w);
B.bufferData(B.ELEMENT_ARRAY_BUFFER,y,B.STATIC_DRAW);
v=B.createTexture();
u=B.createTexture();
B.bindTexture(B.TEXTURE_2D,v);
B.texImage2D(B.TEXTURE_2D,0,B.RGB,16,16,0,B.RGB,B.UNSIGNED_BYTE,null);
B.texParameteri(B.TEXTURE_2D,B.TEXTURE_WRAP_S,B.CLAMP_TO_EDGE);
B.texParameteri(B.TEXTURE_2D,B.TEXTURE_WRAP_T,B.CLAMP_TO_EDGE);
B.texParameteri(B.TEXTURE_2D,B.TEXTURE_MAG_FILTER,B.NEAREST);
B.texParameteri(B.TEXTURE_2D,B.TEXTURE_MIN_FILTER,B.NEAREST);
B.bindTexture(B.TEXTURE_2D,u);
B.texImage2D(B.TEXTURE_2D,0,B.RGBA,16,16,0,B.RGBA,B.UNSIGNED_BYTE,null);
B.texParameteri(B.TEXTURE_2D,B.TEXTURE_WRAP_S,B.CLAMP_TO_EDGE);
B.texParameteri(B.TEXTURE_2D,B.TEXTURE_WRAP_T,B.CLAMP_TO_EDGE);
B.texParameteri(B.TEXTURE_2D,B.TEXTURE_MAG_FILTER,B.NEAREST);
B.texParameteri(B.TEXTURE_2D,B.TEXTURE_MIN_FILTER,B.NEAREST);
if(B.getParameter(B.MAX_VERTEX_TEXTURE_IMAGE_UNITS)<=0){s=false;
t=C(THREE.ShaderFlares.lensFlare)
}else{s=true;
t=C(THREE.ShaderFlares.lensFlareVertexTexture)
}n={};
r={};
n.vertex=B.getAttribLocation(t,"position");
n.uv=B.getAttribLocation(t,"uv");
r.renderType=B.getUniformLocation(t,"renderType");
r.map=B.getUniformLocation(t,"map");
r.occlusionMap=B.getUniformLocation(t,"occlusionMap");
r.opacity=B.getUniformLocation(t,"opacity");
r.color=B.getUniformLocation(t,"color");
r.scale=B.getUniformLocation(t,"scale");
r.rotation=B.getUniformLocation(t,"rotation");
r.screenPosition=B.getUniformLocation(t,"screenPosition");
q=false
};
this.render=function(T,S,Q,F){var T=T.__webglFlares,I=T.length;
if(I){var l=new THREE.Vector3,N=F/Q,o=Q*0.5,m=F*0.5,G=16/F,h=new THREE.Vector2(G*N,G),p=new THREE.Vector3(1,1,0),O=new THREE.Vector2(1,1),k=r,G=n;
B.useProgram(t);
if(!q){B.enableVertexAttribArray(n.vertex);
B.enableVertexAttribArray(n.uv);
q=true
}B.uniform1i(k.occlusionMap,0);
B.uniform1i(k.map,1);
B.bindBuffer(B.ARRAY_BUFFER,x);
B.vertexAttribPointer(G.vertex,2,B.FLOAT,false,16,0);
B.vertexAttribPointer(G.uv,2,B.FLOAT,false,16,8);
B.bindBuffer(B.ELEMENT_ARRAY_BUFFER,w);
B.disable(B.CULL_FACE);
B.depthMask(false);
var g,b,c,L,f;
for(g=0;
g<I;
g++){G=16/F;
h.set(G*N,G);
L=T[g];
l.set(L.matrixWorld.elements[12],L.matrixWorld.elements[13],L.matrixWorld.elements[14]);
S.matrixWorldInverse.multiplyVector3(l);
S.projectionMatrix.multiplyVector3(l);
p.copy(l);
O.x=p.x*o+o;
O.y=p.y*m+m;
if(s||O.x>0&&O.x<Q&&O.y>0&&O.y<F){B.activeTexture(B.TEXTURE1);
B.bindTexture(B.TEXTURE_2D,v);
B.copyTexImage2D(B.TEXTURE_2D,0,B.RGB,O.x-8,O.y-8,16,16,0);
B.uniform1i(k.renderType,0);
B.uniform2f(k.scale,h.x,h.y);
B.uniform3f(k.screenPosition,p.x,p.y,p.z);
B.disable(B.BLEND);
B.enable(B.DEPTH_TEST);
B.drawElements(B.TRIANGLES,6,B.UNSIGNED_SHORT,0);
B.activeTexture(B.TEXTURE0);
B.bindTexture(B.TEXTURE_2D,u);
B.copyTexImage2D(B.TEXTURE_2D,0,B.RGBA,O.x-8,O.y-8,16,16,0);
B.uniform1i(k.renderType,1);
B.disable(B.DEPTH_TEST);
B.activeTexture(B.TEXTURE1);
B.bindTexture(B.TEXTURE_2D,v);
B.drawElements(B.TRIANGLES,6,B.UNSIGNED_SHORT,0);
L.positionScreen.copy(p);
L.customUpdateCallback?L.customUpdateCallback(L):L.updateLensFlares();
B.uniform1i(k.renderType,2);
B.enable(B.BLEND);
b=0;
for(c=L.lensFlares.length;
b<c;
b++){f=L.lensFlares[b];
if(f.opacity>0.001&&f.scale>0.001){p.x=f.x;
p.y=f.y;
p.z=f.z;
G=f.size*f.scale/F;
h.x=G*N;
h.y=G;
B.uniform3f(k.screenPosition,p.x,p.y,p.z);
B.uniform2f(k.scale,h.x,h.y);
B.uniform1f(k.rotation,f.rotation);
B.uniform1f(k.opacity,f.opacity);
B.uniform3f(k.color,f.color.r,f.color.g,f.color.b);
A.setBlending(f.blending,f.blendEquation,f.blendSrc,f.blendDst);
A.setTexture(f.texture,1);
B.drawElements(B.TRIANGLES,6,B.UNSIGNED_SHORT,0)
}}}}B.enable(B.CULL_FACE);
B.enable(B.DEPTH_TEST);
B.depthMask(true)
}}
};
THREE.ShadowMapPlugin=function(){var l,k,r,q,p=new THREE.Frustum,o=new THREE.Matrix4,n=new THREE.Vector3,m=new THREE.Vector3;
this.init=function(b){l=b.context;
k=b;
var b=THREE.ShaderLib.depthRGBA,a=THREE.UniformsUtils.clone(b.uniforms);
r=new THREE.ShaderMaterial({fragmentShader:b.fragmentShader,vertexShader:b.vertexShader,uniforms:a});
q=new THREE.ShaderMaterial({fragmentShader:b.fragmentShader,vertexShader:b.vertexShader,uniforms:a,morphTargets:true});
r._shadowPass=true;
q._shadowPass=true
};
this.render=function(b,d){k.shadowMapEnabled&&k.shadowMapAutoUpdate&&this.update(b,d)
};
this.update=function(v,g){var h,c,f,d,b,e,a,A,B,x=[];
d=0;
l.clearColor(1,1,1,1);
l.disable(l.BLEND);
l.enable(l.CULL_FACE);
k.shadowMapCullFrontFaces?l.cullFace(l.FRONT):l.cullFace(l.BACK);
k.setDepthTest(true);
h=0;
for(c=v.__lights.length;
h<c;
h++){f=v.__lights[h];
if(f.castShadow){if(f instanceof THREE.DirectionalLight&&f.shadowCascade){for(b=0;
b<f.shadowCascadeCount;
b++){var C;
if(f.shadowCascadeArray[b]){C=f.shadowCascadeArray[b]
}else{B=f;
a=b;
C=new THREE.DirectionalLight;
C.isVirtual=true;
C.onlyShadow=true;
C.castShadow=true;
C.shadowCameraNear=B.shadowCameraNear;
C.shadowCameraFar=B.shadowCameraFar;
C.shadowCameraLeft=B.shadowCameraLeft;
C.shadowCameraRight=B.shadowCameraRight;
C.shadowCameraBottom=B.shadowCameraBottom;
C.shadowCameraTop=B.shadowCameraTop;
C.shadowCameraVisible=B.shadowCameraVisible;
C.shadowDarkness=B.shadowDarkness;
C.shadowBias=B.shadowCascadeBias[a];
C.shadowMapWidth=B.shadowCascadeWidth[a];
C.shadowMapHeight=B.shadowCascadeHeight[a];
C.pointsWorld=[];
C.pointsFrustum=[];
A=C.pointsWorld;
e=C.pointsFrustum;
for(var z=0;
z<8;
z++){A[z]=new THREE.Vector3;
e[z]=new THREE.Vector3
}A=B.shadowCascadeNearZ[a];
B=B.shadowCascadeFarZ[a];
e[0].set(-1,-1,A);
e[1].set(1,-1,A);
e[2].set(-1,1,A);
e[3].set(1,1,A);
e[4].set(-1,-1,B);
e[5].set(1,-1,B);
e[6].set(-1,1,B);
e[7].set(1,1,B);
C.originalCamera=g;
e=new THREE.Gyroscope;
e.position=f.shadowCascadeOffset;
e.add(C);
e.add(C.target);
g.add(e);
f.shadowCascadeArray[b]=C;
console.log("Created virtualLight",C)
}a=f;
A=b;
B=a.shadowCascadeArray[A];
B.position.copy(a.position);
B.target.position.copy(a.target.position);
B.lookAt(B.target);
B.shadowCameraVisible=a.shadowCameraVisible;
B.shadowDarkness=a.shadowDarkness;
B.shadowBias=a.shadowCascadeBias[A];
e=a.shadowCascadeNearZ[A];
a=a.shadowCascadeFarZ[A];
B=B.pointsFrustum;
B[0].z=e;
B[1].z=e;
B[2].z=e;
B[3].z=e;
B[4].z=a;
B[5].z=a;
B[6].z=a;
B[7].z=a;
x[d]=C;
d++
}}else{x[d]=f;
d++
}}}h=0;
for(c=x.length;
h<c;
h++){f=x[h];
if(!f.shadowMap){f.shadowMap=new THREE.WebGLRenderTarget(f.shadowMapWidth,f.shadowMapHeight,{minFilter:THREE.LinearFilter,magFilter:THREE.LinearFilter,format:THREE.RGBAFormat});
f.shadowMapSize=new THREE.Vector2(f.shadowMapWidth,f.shadowMapHeight);
f.shadowMatrix=new THREE.Matrix4
}if(!f.shadowCamera){if(f instanceof THREE.SpotLight){f.shadowCamera=new THREE.PerspectiveCamera(f.shadowCameraFov,f.shadowMapWidth/f.shadowMapHeight,f.shadowCameraNear,f.shadowCameraFar)
}else{if(f instanceof THREE.DirectionalLight){f.shadowCamera=new THREE.OrthographicCamera(f.shadowCameraLeft,f.shadowCameraRight,f.shadowCameraTop,f.shadowCameraBottom,f.shadowCameraNear,f.shadowCameraFar)
}else{console.error("Unsupported light type for shadow");
continue
}}v.add(f.shadowCamera);
k.autoUpdateScene&&v.updateMatrixWorld()
}if(f.shadowCameraVisible&&!f.cameraHelper){f.cameraHelper=new THREE.CameraHelper(f.shadowCamera);
f.shadowCamera.add(f.cameraHelper)
}if(f.isVirtual&&C.originalCamera==g){b=g;
d=f.shadowCamera;
e=f.pointsFrustum;
B=f.pointsWorld;
n.set(Infinity,Infinity,Infinity);
m.set(-Infinity,-Infinity,-Infinity);
for(a=0;
a<8;
a++){A=B[a];
A.copy(e[a]);
THREE.ShadowMapPlugin.__projector.unprojectVector(A,b);
d.matrixWorldInverse.multiplyVector3(A);
if(A.x<n.x){n.x=A.x
}if(A.x>m.x){m.x=A.x
}if(A.y<n.y){n.y=A.y
}if(A.y>m.y){m.y=A.y
}if(A.z<n.z){n.z=A.z
}if(A.z>m.z){m.z=A.z
}}d.left=n.x;
d.right=m.x;
d.top=m.y;
d.bottom=n.y;
d.updateProjectionMatrix()
}d=f.shadowMap;
e=f.shadowMatrix;
b=f.shadowCamera;
b.position.copy(f.matrixWorld.getPosition());
b.lookAt(f.target.matrixWorld.getPosition());
b.updateMatrixWorld();
b.matrixWorldInverse.getInverse(b.matrixWorld);
if(f.cameraHelper){f.cameraHelper.lines.visible=f.shadowCameraVisible
}f.shadowCameraVisible&&f.cameraHelper.update();
e.set(0.5,0,0,0.5,0,0.5,0,0.5,0,0,0.5,0.5,0,0,0,1);
e.multiplySelf(b.projectionMatrix);
e.multiplySelf(b.matrixWorldInverse);
if(!b._viewMatrixArray){b._viewMatrixArray=new Float32Array(16)
}if(!b._projectionMatrixArray){b._projectionMatrixArray=new Float32Array(16)
}b.matrixWorldInverse.flattenToArray(b._viewMatrixArray);
b.projectionMatrix.flattenToArray(b._projectionMatrixArray);
o.multiply(b.projectionMatrix,b.matrixWorldInverse);
p.setFromMatrix(o);
k.setRenderTarget(d);
k.clear();
B=v.__webglObjects;
f=0;
for(d=B.length;
f<d;
f++){a=B[f];
e=a.object;
a.render=false;
if(e.visible&&e.castShadow&&(!(e instanceof THREE.Mesh)||!e.frustumCulled||p.contains(e))){e._modelViewMatrix.multiply(b.matrixWorldInverse,e.matrixWorld);
a.render=true
}}f=0;
for(d=B.length;
f<d;
f++){a=B[f];
if(a.render){e=a.object;
a=a.buffer;
A=e.customDepthMaterial?e.customDepthMaterial:e.geometry.morphTargets.length?q:r;
a instanceof THREE.BufferGeometry?k.renderBufferDirect(b,v.__lights,null,A,a,e):k.renderBuffer(b,v.__lights,null,A,a,e)
}}B=v.__webglObjectsImmediate;
f=0;
for(d=B.length;
f<d;
f++){a=B[f];
e=a.object;
if(e.visible&&e.castShadow){e._modelViewMatrix.multiply(b.matrixWorldInverse,e.matrixWorld);
k.renderImmediateObject(b,v.__lights,null,r,e)
}}}h=k.getClearColor();
c=k.getClearAlpha();
l.clearColor(h.r,h.g,h.b,c);
l.enable(l.BLEND);
k.shadowMapCullFrontFaces&&l.cullFace(l.BACK)
}
};
THREE.ShadowMapPlugin.__projector=new THREE.Projector;
THREE.SpritePlugin=function(){function w(d,c){return c.z-d.z
}var v,u,t,s,r,q,p,o,m,n;
this.init=function(c){v=c.context;
u=c;
t=new Float32Array(16);
s=new Uint16Array(6);
c=0;
t[c++]=-1;
t[c++]=-1;
t[c++]=0;
t[c++]=1;
t[c++]=1;
t[c++]=-1;
t[c++]=1;
t[c++]=1;
t[c++]=1;
t[c++]=1;
t[c++]=1;
t[c++]=0;
t[c++]=-1;
t[c++]=1;
t[c++]=0;
c=t[c++]=0;
s[c++]=0;
s[c++]=1;
s[c++]=2;
s[c++]=0;
s[c++]=2;
s[c++]=3;
r=v.createBuffer();
q=v.createBuffer();
v.bindBuffer(v.ARRAY_BUFFER,r);
v.bufferData(v.ARRAY_BUFFER,t,v.STATIC_DRAW);
v.bindBuffer(v.ELEMENT_ARRAY_BUFFER,q);
v.bufferData(v.ELEMENT_ARRAY_BUFFER,s,v.STATIC_DRAW);
var c=THREE.ShaderSprite.sprite,b=v.createProgram(),e=v.createShader(v.FRAGMENT_SHADER),d=v.createShader(v.VERTEX_SHADER);
v.shaderSource(e,c.fragmentShader);
v.shaderSource(d,c.vertexShader);
v.compileShader(e);
v.compileShader(d);
v.attachShader(b,e);
v.attachShader(b,d);
v.linkProgram(b);
p=b;
o={};
m={};
o.position=v.getAttribLocation(p,"position");
o.uv=v.getAttribLocation(p,"uv");
m.uvOffset=v.getUniformLocation(p,"uvOffset");
m.uvScale=v.getUniformLocation(p,"uvScale");
m.rotation=v.getUniformLocation(p,"rotation");
m.scale=v.getUniformLocation(p,"scale");
m.alignment=v.getUniformLocation(p,"alignment");
m.color=v.getUniformLocation(p,"color");
m.map=v.getUniformLocation(p,"map");
m.opacity=v.getUniformLocation(p,"opacity");
m.useScreenCoordinates=v.getUniformLocation(p,"useScreenCoordinates");
m.affectedByDistance=v.getUniformLocation(p,"affectedByDistance");
m.screenPosition=v.getUniformLocation(p,"screenPosition");
m.modelViewMatrix=v.getUniformLocation(p,"modelViewMatrix");
m.projectionMatrix=v.getUniformLocation(p,"projectionMatrix");
n=false
};
this.render=function(h,g,c,b){var h=h.__webglSprites,f=h.length;
if(f){var a=o,z=m,A=b/c,c=c*0.5,k=b*0.5,B=true;
v.useProgram(p);
if(!n){v.enableVertexAttribArray(a.position);
v.enableVertexAttribArray(a.uv);
n=true
}v.disable(v.CULL_FACE);
v.enable(v.BLEND);
v.depthMask(true);
v.bindBuffer(v.ARRAY_BUFFER,r);
v.vertexAttribPointer(a.position,2,v.FLOAT,false,16,0);
v.vertexAttribPointer(a.uv,2,v.FLOAT,false,16,8);
v.bindBuffer(v.ELEMENT_ARRAY_BUFFER,q);
v.uniformMatrix4fv(z.projectionMatrix,false,g._projectionMatrixArray);
v.activeTexture(v.TEXTURE0);
v.uniform1i(z.map,0);
for(var l,x=[],a=0;
a<f;
a++){l=h[a];
if(l.visible&&l.opacity!==0){if(l.useScreenCoordinates){l.z=-l.position.z
}else{l._modelViewMatrix.multiply(g.matrixWorldInverse,l.matrixWorld);
l.z=-l._modelViewMatrix.elements[14]
}}}h.sort(w);
for(a=0;
a<f;
a++){l=h[a];
if(l.visible&&l.opacity!==0&&l.map&&l.map.image&&l.map.image.width){if(l.useScreenCoordinates){v.uniform1i(z.useScreenCoordinates,1);
v.uniform3f(z.screenPosition,(l.position.x-c)/c,(k-l.position.y)/k,Math.max(0,Math.min(1,l.position.z)))
}else{v.uniform1i(z.useScreenCoordinates,0);
v.uniform1i(z.affectedByDistance,l.affectedByDistance?1:0);
v.uniformMatrix4fv(z.modelViewMatrix,false,l._modelViewMatrix.elements)
}g=l.map.image.width/(l.scaleByViewport?b:1);
x[0]=g*A*l.scale.x;
x[1]=g*l.scale.y;
v.uniform2f(z.uvScale,l.uvScale.x,l.uvScale.y);
v.uniform2f(z.uvOffset,l.uvOffset.x,l.uvOffset.y);
v.uniform2f(z.alignment,l.alignment.x,l.alignment.y);
v.uniform1f(z.opacity,l.opacity);
v.uniform3f(z.color,l.color.r,l.color.g,l.color.b);
v.uniform1f(z.rotation,l.rotation);
v.uniform2fv(z.scale,x);
if(l.mergeWith3D&&!B){v.enable(v.DEPTH_TEST);
B=true
}else{if(!l.mergeWith3D&&B){v.disable(v.DEPTH_TEST);
B=false
}}u.setBlending(l.blending,l.blendEquation,l.blendSrc,l.blendDst);
u.setTexture(l.map,0);
v.drawElements(v.TRIANGLES,6,v.UNSIGNED_SHORT,0)
}}v.enable(v.CULL_FACE);
v.enable(v.DEPTH_TEST);
v.depthMask(true)
}}
};
THREE.DepthPassPlugin=function(){this.enabled=false;
this.renderTarget=null;
var h,g,n,m,l=new THREE.Frustum,k=new THREE.Matrix4;
this.init=function(b){h=b.context;
g=b;
var b=THREE.ShaderLib.depthRGBA,a=THREE.UniformsUtils.clone(b.uniforms);
n=new THREE.ShaderMaterial({fragmentShader:b.fragmentShader,vertexShader:b.vertexShader,uniforms:a});
m=new THREE.ShaderMaterial({fragmentShader:b.fragmentShader,vertexShader:b.vertexShader,uniforms:a,morphTargets:true});
n._shadowPass=true;
m._shadowPass=true
};
this.render=function(d,c){this.enabled&&this.update(d,c)
};
this.update=function(f,e){var d,b,c,q,a,r;
h.clearColor(1,1,1,1);
h.disable(h.BLEND);
g.setDepthTest(true);
g.autoUpdateScene&&f.updateMatrixWorld();
if(!e._viewMatrixArray){e._viewMatrixArray=new Float32Array(16)
}if(!e._projectionMatrixArray){e._projectionMatrixArray=new Float32Array(16)
}e.matrixWorldInverse.getInverse(e.matrixWorld);
e.matrixWorldInverse.flattenToArray(e._viewMatrixArray);
e.projectionMatrix.flattenToArray(e._projectionMatrixArray);
k.multiply(e.projectionMatrix,e.matrixWorldInverse);
l.setFromMatrix(k);
g.setRenderTarget(this.renderTarget);
g.clear();
r=f.__webglObjects;
d=0;
for(b=r.length;
d<b;
d++){c=r[d];
a=c.object;
c.render=false;
if(a.visible&&(!(a instanceof THREE.Mesh)||!a.frustumCulled||l.contains(a))){a._modelViewMatrix.multiply(e.matrixWorldInverse,a.matrixWorld);
c.render=true
}}d=0;
for(b=r.length;
d<b;
d++){c=r[d];
if(c.render){a=c.object;
c=c.buffer;
g.setObjectFaces(a);
q=a.customDepthMaterial?a.customDepthMaterial:a.geometry.morphTargets.length?m:n;
c instanceof THREE.BufferGeometry?g.renderBufferDirect(e,f.__lights,null,q,c,a):g.renderBuffer(e,f.__lights,null,q,c,a)
}}r=f.__webglObjectsImmediate;
d=0;
for(b=r.length;
d<b;
d++){c=r[d];
a=c.object;
if(a.visible&&a.castShadow){a._modelViewMatrix.multiply(e.matrixWorldInverse,a.matrixWorld);
g.renderImmediateObject(e,f.__lights,null,n,a)
}}d=g.getClearColor();
b=g.getClearAlpha();
h.clearColor(d.r,d.g,d.b,b);
h.enable(h.BLEND)
}
};
THREE.ShaderFlares={lensFlareVertexTexture:{vertexShader:"uniform vec3 screenPosition;\nuniform vec2 scale;\nuniform float rotation;\nuniform int renderType;\nuniform sampler2D occlusionMap;\nattribute vec2 position;\nattribute vec2 uv;\nvarying vec2 vUV;\nvarying float vVisibility;\nvoid main() {\nvUV = uv;\nvec2 pos = position;\nif( renderType == 2 ) {\nvec4 visibility = texture2D( occlusionMap, vec2( 0.1, 0.1 ) ) +\ntexture2D( occlusionMap, vec2( 0.5, 0.1 ) ) +\ntexture2D( occlusionMap, vec2( 0.9, 0.1 ) ) +\ntexture2D( occlusionMap, vec2( 0.9, 0.5 ) ) +\ntexture2D( occlusionMap, vec2( 0.9, 0.9 ) ) +\ntexture2D( occlusionMap, vec2( 0.5, 0.9 ) ) +\ntexture2D( occlusionMap, vec2( 0.1, 0.9 ) ) +\ntexture2D( occlusionMap, vec2( 0.1, 0.5 ) ) +\ntexture2D( occlusionMap, vec2( 0.5, 0.5 ) );\nvVisibility = (       visibility.r / 9.0 ) *\n( 1.0 - visibility.g / 9.0 ) *\n(       visibility.b / 9.0 ) *\n( 1.0 - visibility.a / 9.0 );\npos.x = cos( rotation ) * position.x - sin( rotation ) * position.y;\npos.y = sin( rotation ) * position.x + cos( rotation ) * position.y;\n}\ngl_Position = vec4( ( pos * scale + screenPosition.xy ).xy, screenPosition.z, 1.0 );\n}",fragmentShader:"precision mediump float;\nuniform sampler2D map;\nuniform float opacity;\nuniform int renderType;\nuniform vec3 color;\nvarying vec2 vUV;\nvarying float vVisibility;\nvoid main() {\nif( renderType == 0 ) {\ngl_FragColor = vec4( 1.0, 0.0, 1.0, 0.0 );\n} else if( renderType == 1 ) {\ngl_FragColor = texture2D( map, vUV );\n} else {\nvec4 texture = texture2D( map, vUV );\ntexture.a *= opacity * vVisibility;\ngl_FragColor = texture;\ngl_FragColor.rgb *= color;\n}\n}"},lensFlare:{vertexShader:"uniform vec3 screenPosition;\nuniform vec2 scale;\nuniform float rotation;\nuniform int renderType;\nattribute vec2 position;\nattribute vec2 uv;\nvarying vec2 vUV;\nvoid main() {\nvUV = uv;\nvec2 pos = position;\nif( renderType == 2 ) {\npos.x = cos( rotation ) * position.x - sin( rotation ) * position.y;\npos.y = sin( rotation ) * position.x + cos( rotation ) * position.y;\n}\ngl_Position = vec4( ( pos * scale + screenPosition.xy ).xy, screenPosition.z, 1.0 );\n}",fragmentShader:"precision mediump float;\nuniform sampler2D map;\nuniform sampler2D occlusionMap;\nuniform float opacity;\nuniform int renderType;\nuniform vec3 color;\nvarying vec2 vUV;\nvoid main() {\nif( renderType == 0 ) {\ngl_FragColor = vec4( texture2D( map, vUV ).rgb, 0.0 );\n} else if( renderType == 1 ) {\ngl_FragColor = texture2D( map, vUV );\n} else {\nfloat visibility = texture2D( occlusionMap, vec2( 0.5, 0.1 ) ).a +\ntexture2D( occlusionMap, vec2( 0.9, 0.5 ) ).a +\ntexture2D( occlusionMap, vec2( 0.5, 0.9 ) ).a +\ntexture2D( occlusionMap, vec2( 0.1, 0.5 ) ).a;\nvisibility = ( 1.0 - visibility / 4.0 );\nvec4 texture = texture2D( map, vUV );\ntexture.a *= opacity * visibility;\ngl_FragColor = texture;\ngl_FragColor.rgb *= color;\n}\n}"}};
THREE.ShaderSprite={sprite:{vertexShader:"uniform int useScreenCoordinates;\nuniform int affectedByDistance;\nuniform vec3 screenPosition;\nuniform mat4 modelViewMatrix;\nuniform mat4 projectionMatrix;\nuniform float rotation;\nuniform vec2 scale;\nuniform vec2 alignment;\nuniform vec2 uvOffset;\nuniform vec2 uvScale;\nattribute vec2 position;\nattribute vec2 uv;\nvarying vec2 vUV;\nvoid main() {\nvUV = uvOffset + uv * uvScale;\nvec2 alignedPosition = position + alignment;\nvec2 rotatedPosition;\nrotatedPosition.x = ( cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y ) * scale.x;\nrotatedPosition.y = ( sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y ) * scale.y;\nvec4 finalPosition;\nif( useScreenCoordinates != 0 ) {\nfinalPosition = vec4( screenPosition.xy + rotatedPosition, screenPosition.z, 1.0 );\n} else {\nfinalPosition = projectionMatrix * modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );\nfinalPosition.xy += rotatedPosition * ( affectedByDistance == 1 ? 1.0 : finalPosition.z );\n}\ngl_Position = finalPosition;\n}",fragmentShader:"precision mediump float;\nuniform vec3 color;\nuniform sampler2D map;\nuniform float opacity;\nvarying vec2 vUV;\nvoid main() {\nvec4 texture = texture2D( map, vUV );\ngl_FragColor = vec4( color * texture.xyz, texture.a * opacity );\n}"}};
(function(c){var d={VERSION:"2.2.0",Result:{SUCCEEDED:1,NOTRANSITION:2,CANCELLED:3,ASYNC:4},Error:{INVALID_TRANSITION:100,PENDING_TRANSITION:200,INVALID_CALLBACK:300},WILDCARD:"*",ASYNC:"async",create:function(p,o){var m=(typeof p.initial=="string")?{state:p.initial}:p.initial;
var q=o||p.target||{};
var a=p.events||[];
var n=p.callbacks||{};
var s={};
var b=function(e){var f=(e.from instanceof Array)?e.from:(e.from?[e.from]:[d.WILDCARD]);
s[e.name]=s[e.name]||{};
for(var g=0;
g<f.length;
g++){s[e.name][f[g]]=e.to||f[g]
}};
if(m){m.event=m.event||"startup";
b({name:m.event,from:"none",to:m.state})
}for(var r=0;
r<a.length;
r++){b(a[r])
}for(var t in s){if(s.hasOwnProperty(t)){q[t]=d.buildEvent(t,s[t])
}}for(var t in n){if(n.hasOwnProperty(t)){q[t]=n[t]
}}q.current="none";
q.is=function(e){return this.current==e
};
q.can=function(e){return !this.transition&&(s[e].hasOwnProperty(this.current)||s[e].hasOwnProperty(d.WILDCARD))
};
q.cannot=function(e){return !this.can(e)
};
q.error=p.error||function(l,f,g,u,e,h,k){throw k||h
};
if(m&&!m.defer){q[m.event]()
}return q
},doCallback:function(e,l,m,a,b,n){if(l){try{return l.apply(e,[m,a,b].concat(n))
}catch(k){return e.error(m,a,b,n,d.Error.INVALID_CALLBACK,"an exception occurred in a caller-provided callback function",k)
}}},beforeEvent:function(h,k,a,b,l){return d.doCallback(h,h["onbefore"+k],k,a,b,l)
},afterEvent:function(h,k,a,b,l){return d.doCallback(h,h["onafter"+k]||h["on"+k],k,a,b,l)
},leaveState:function(h,k,a,b,l){return d.doCallback(h,h["onleave"+a],k,a,b,l)
},enterState:function(h,k,a,b,l){return d.doCallback(h,h["onenter"+b]||h["on"+b],k,a,b,l)
},changeState:function(h,k,a,b,l){return d.doCallback(h,h.onchangestate,k,a,b,l)
},buildEvent:function(b,a){return function(){var k=this.current;
var l=a[k]||a[d.WILDCARD]||k;
var n=Array.prototype.slice.call(arguments);
if(this.transition){return this.error(b,k,l,n,d.Error.PENDING_TRANSITION,"event "+b+" inappropriate because previous transition did not complete")
}if(this.cannot(b)){return this.error(b,k,l,n,d.Error.INVALID_TRANSITION,"event "+b+" inappropriate in current state "+this.current)
}if(false===d.beforeEvent(this,b,k,l,n)){return d.CANCELLED
}if(k===l){d.afterEvent(this,b,k,l,n);
return d.NOTRANSITION
}var m=this;
this.transition=function(){m.transition=null;
m.current=l;
d.enterState(m,b,k,l,n);
d.changeState(m,b,k,l,n);
d.afterEvent(m,b,k,l,n)
};
this.transition.cancel=function(){m.transition=null;
d.afterEvent(m,b,k,l,n)
};
var o=d.leaveState(this,b,k,l,n);
if(false===o){this.transition=null;
return d.CANCELLED
}else{if("async"===o){return d.ASYNC
}else{if(this.transition){this.transition()
}return d.SUCCEEDED
}}}
}};
if("function"===typeof define){define(function(a){return d
})
}else{c.StateMachine=d
}}(this));
(function(aM,aL){function al(d,c){this._d=d,this._isUTC=!!c
}function ak(b){return b<0?Math.ceil(b):Math.floor(b)
}function aj(t){var s=this._data={},r=t.years||t.y||0,q=t.months||t.M||0,p=t.weeks||t.w||0,o=t.days||t.d||0,n=t.hours||t.h||0,m=t.minutes||t.m||0,l=t.seconds||t.s||0,k=t.milliseconds||t.ms||0;
this._milliseconds=k+l*1000+m*60000+n*3600000,this._days=o+p*7,this._months=q+r*12,s.milliseconds=k%1000,l+=ak(k/1000),s.seconds=l%60,m+=ak(l/60),s.minutes=m%60,n+=ak(m/60),s.hours=n%24,o+=ak(n/24),o+=p*7,s.days=o%30,q+=ak(o/30),s.months=q%12,r+=ak(q/12),s.years=r
}function ai(e,d){var f=e+"";
while(f.length<d){f="0"+f
}return f
}function ah(k,h,p){var o=h._milliseconds,n=h._days,m=h._months,l;
o&&k._d.setTime(+k+o*p),n&&k.date(k.date()+n*p),m&&(l=k.date(),k.date(1).month(k.month()+m*p).date(Math.min(l,k.daysInMonth())))
}function ag(b){return Object.prototype.toString.call(b)==="[object Array]"
}function af(a){return new aM(a[0],a[1]||0,a[2]||1,a[3]||0,a[4]||0,a[5]||0,a[6]||0)
}function ae(B,A){function a(f){var b,e;
switch(f){case"M":return z+1;
case"Mo":return z+1+l(z+1);
case"MM":return ai(z+1,2);
case"MMM":return aK.monthsShort[z];
case"MMMM":return aK.months[z];
case"D":return y;
case"Do":return y+l(y);
case"DD":return ai(y,2);
case"DDD":return b=new aM(x,z,y),e=new aM(x,0,1),~~((b-e)/86400000+1.5);
case"DDDo":return b=a("DDD"),b+l(b);
case"DDDD":return ai(a("DDD"),3);
case"d":return w;
case"do":return w+l(w);
case"ddd":return aK.weekdaysShort[w];
case"dddd":return aK.weekdays[w];
case"w":return b=new aM(x,z,y-w+5),e=new aM(b.getFullYear(),0,4),~~((b-e)/86400000/7+1.5);
case"wo":return b=a("w"),b+l(b);
case"ww":return ai(a("w"),2);
case"YY":return ai(x%100,2);
case"YYYY":return x;
case"a":return c?c(v,u,!1):v>11?"pm":"am";
case"A":return c?c(v,u,!0):v>11?"PM":"AM";
case"H":return v;
case"HH":return ai(v,2);
case"h":return v%12||12;
case"hh":return ai(v%12||12,2);
case"m":return u;
case"mm":return ai(u,2);
case"s":return t;
case"ss":return ai(t,2);
case"S":return ~~(s/100);
case"SS":return ai(~~(s/10),2);
case"SSS":return ai(s,3);
case"Z":return(r<0?"-":"+")+ai(~~(Math.abs(r)/60),2)+":"+ai(~~(Math.abs(r)%60),2);
case"ZZ":return(r<0?"-":"+")+ai(~~(10*Math.abs(r)/6),4);
case"L":case"LL":case"LLL":case"LLLL":case"LT":return ae(B,aK.longDateFormat[f]);
default:return f.replace(/(^\[)|(\\)|\]$/g,"")
}}var z=B.month(),y=B.date(),x=B.year(),w=B.day(),v=B.hours(),u=B.minutes(),t=B.seconds(),s=B.milliseconds(),r=-B.zone(),l=aK.ordinal,c=aK.meridiem;
return A.replace(aB,a)
}function ad(b){switch(b){case"DDDD":return ax;
case"YYYY":return aw;
case"S":case"SS":case"SSS":case"DDD":return ay;
case"MMM":case"MMMM":case"ddd":case"dddd":case"a":case"A":return av;
case"Z":case"ZZ":return au;
case"T":return at;
case"MM":case"DD":case"dd":case"YY":case"HH":case"hh":case"mm":case"ss":case"M":case"D":case"d":case"H":case"h":case"m":case"s":return az;
default:return new RegExp(b.replace("\\",""))
}}function ac(g,c,l,k){var h;
switch(g){case"M":case"MM":l[1]=c==null?0:~~c-1;
break;
case"MMM":case"MMMM":for(h=0;
h<12;
h++){if(aK.monthsParse[h].test(c)){l[1]=h;
break
}}break;
case"D":case"DD":case"DDD":case"DDDD":l[2]=~~c;
break;
case"YY":c=~~c,l[0]=c+(c>70?1900:2000);
break;
case"YYYY":l[0]=~~Math.abs(c);
break;
case"a":case"A":k.isPm=(c+"").toLowerCase()==="pm";
break;
case"H":case"HH":case"h":case"hh":l[3]=~~c;
break;
case"m":case"mm":l[4]=~~c;
break;
case"s":case"ss":l[5]=~~c;
break;
case"S":case"SS":case"SSS":l[6]=~~(("0."+c)*1000);
break;
case"Z":case"ZZ":k.isUTC=!0,h=(c+"").match(ao),h&&h[1]&&(k.tzh=~~h[1]),h&&h[2]&&(k.tzm=~~h[2]),h&&h[0]==="+"&&(k.tzh=-k.tzh,k.tzm=-k.tzm)
}}function ab(a,p){var o=[0,0,1,0,0,0,0],n={tzh:0,tzm:0},m=p.match(aB),l,k;
for(l=0;
l<m.length;
l++){k=(ad(m[l]).exec(a)||[])[0],a=a.replace(ad(m[l]),""),ac(m[l],k,o,n)
}return n.isPm&&o[3]<12&&(o[3]+=12),n.isPm===!1&&o[3]===12&&(o[3]=0),o[3]+=n.tzh,o[4]+=n.tzm,n.isUTC?new aM(aM.UTC.apply({},o)):af(o)
}function aa(h,g){var n=Math.min(h.length,g.length),m=Math.abs(h.length-g.length),l=0,k;
for(k=0;
k<n;
k++){~~h[k]!==~~g[k]&&l++
}return l+m
}function Z(s,r){var q,p=s.match(aA)||[],o,n=99,m,l,k;
for(m=0;
m<r.length;
m++){l=ab(s,r[m]),o=ae(new al(l),r[m]).match(aA)||[],k=aa(p,o),k<n&&(n=k,q=l)
}return q
}function Y(a){var f="YYYY-MM-DDT",e;
if(ar.exec(a)){for(e=0;
e<4;
e++){if(ap[e][1].exec(a)){f+=ap[e][0];
break
}}return au.exec(a)?ab(a,f+" Z"):ab(a,f)
}return new aM(a)
}function X(g,c,l,k){var h=aK.relativeTime[g];
return typeof h=="function"?h(c||1,!!l,g,k):h.replace(/%d/i,c||1)
}function W(k,e){var q=aI(Math.abs(k)/1000),p=aI(q/60),o=aI(p/60),n=aI(o/24),m=aI(n/365),l=q<45&&["s",q]||p===1&&["m"]||p<45&&["mm",p]||o===1&&["h"]||o<22&&["hh",o]||n===1&&["d"]||n<=25&&["dd",n]||n<=45&&["M"]||n<345&&["MM",aI(n/30)]||m===1&&["y"]||["yy",m];
return l[2]=e,l[3]=k>0,X.apply({},l)
}function V(d,c){aK.fn[d]=function(b){var e=this._isUTC?"UTC":"";
return b!=null?(this._d["set"+e+c](b),this):this._d["get"+e+c]()
}
}function U(b){aK.duration.fn[b]=function(){return this._data[b]
}
}function T(d,c){aK.duration.fn["as"+d]=function(){return +this/c
}
}var aK,aJ="1.6.2",aI=Math.round,aH,aG={},aF="en",aE=typeof module!="undefined",aD="months|monthsShort|monthsParse|weekdays|weekdaysShort|longDateFormat|calendar|relativeTime|ordinal|meridiem".split("|"),aC=/^\/?Date\((\-?\d+)/i,aB=/(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|dddd?|do?|w[o|w]?|YYYY|YY|a|A|hh?|HH?|mm?|ss?|SS?S?|zz?|ZZ?|LT|LL?L?L?)/g,aA=/([0-9a-zA-Z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)/gi,az=/\d\d?/,ay=/\d{1,3}/,ax=/\d{3}/,aw=/\d{4}/,av=/[0-9a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+/i,au=/Z|[\+\-]\d\d:?\d\d/i,at=/T/i,ar=/^\s*\d{4}-\d\d-\d\d(T(\d\d(:\d\d(:\d\d(\.\d\d?\d?)?)?)?)?([\+\-]\d\d:?\d\d)?)?/,aq="YYYY-MM-DDTHH:mm:ssZ",ap=[["HH:mm:ss.S",/T\d\d:\d\d:\d\d\.\d{1,3}/],["HH:mm:ss",/T\d\d:\d\d:\d\d/],["HH:mm",/T\d\d:\d\d/],["HH",/T\d\d/]],ao=/([\+\-]|\d\d)/gi,an="Month|Date|Hours|Minutes|Seconds|Milliseconds".split("|"),am={Milliseconds:1,Seconds:1000,Minutes:60000,Hours:3600000,Days:86400000,Months:2592000000,Years:31536000000};
aK=function(l,k){if(l===null||l===""){return null
}var c,b,a;
return aK.isMoment(l)?(c=new aM(+l._d),a=l._isUTC):k?ag(k)?c=Z(l,k):c=ab(l,k):(b=aC.exec(l),c=l===aL?new aM:b?new aM(+b[1]):l instanceof aM?l:ag(l)?af(l):typeof l=="string"?Y(l):new aM(l)),new al(c,a)
},aK.utc=function(a,c){return ag(a)?new al(new aM(aM.UTC.apply({},a)),!0):c&&a?aK(a+" +0000",c+" Z").utc():aK(a&&!au.exec(a)?a+"+0000":a).utc()
},aK.unix=function(b){return aK(b*1000)
},aK.duration=function(g,c){var l=aK.isDuration(g),k=typeof g=="number",h=l?g._data:k?{}:g;
return k&&(c?h[c]=g:h.milliseconds=g),new aj(h)
},aK.humanizeDuration=function(e,c,f){return aK.duration(e,c===!0?null:c).humanize(c===!0?!0:f)
},aK.version=aJ,aK.defaultFormat=aq,aK.lang=function(g,c){var l,k,h=[];
if(!g){return aF
}if(c){for(l=0;
l<12;
l++){h[l]=new RegExp("^"+c.months[l]+"|^"+c.monthsShort[l].replace(".",""),"i")
}c.monthsParse=c.monthsParse||h,aG[g]=c
}if(aG[g]){for(l=0;
l<aD.length;
l++){aK[aD[l]]=aG[g][aD[l]]||aG.en[aD[l]]
}aF=g
}else{aE&&(k=require("./lang/"+g),aK.lang(g,k))
}},aK.lang("en",{months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),monthsShort:"Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),weekdaysShort:"Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),longDateFormat:{LT:"h:mm A",L:"MM/DD/YYYY",LL:"MMMM D YYYY",LLL:"MMMM D YYYY LT",LLLL:"dddd, MMMM D YYYY LT"},meridiem:!1,calendar:{sameDay:"[Today at] LT",nextDay:"[Tomorrow at] LT",nextWeek:"dddd [at] LT",lastDay:"[Yesterday at] LT",lastWeek:"[last] dddd [at] LT",sameElse:"L"},relativeTime:{future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"},ordinal:function(d){var c=d%10;
return ~~(d%100/10)===1?"th":c===1?"st":c===2?"nd":c===3?"rd":"th"
}}),aK.isMoment=function(b){return b instanceof al
},aK.isDuration=function(b){return b instanceof aj
},aK.fn=al.prototype={clone:function(){return aK(this)
},valueOf:function(){return +this._d
},unix:function(){return Math.floor(+this._d/1000)
},toString:function(){return this._d.toString()
},toDate:function(){return this._d
},utc:function(){return this._isUTC=!0,this
},local:function(){return this._isUTC=!1,this
},format:function(b){return ae(this,b?b:aK.defaultFormat)
},add:function(e,c){var f=c?aK.duration(+c,e):aK.duration(e);
return ah(this,f,1),this
},subtract:function(e,c){var f=c?aK.duration(+c,e):aK.duration(e);
return ah(this,f,-1),this
},diff:function(t,s,r){var q=this._isUTC?aK(t).utc():aK(t).local(),p=(this.zone()-q.zone())*60000,o=this._d-q._d-p,n=this.year()-q.year(),m=this.month()-q.month(),e=this.date()-q.date(),c;
return s==="months"?c=n*12+m+e/30:s==="years"?c=n+(m+e/30)/12:c=s==="seconds"?o/1000:s==="minutes"?o/60000:s==="hours"?o/3600000:s==="days"?o/86400000:s==="weeks"?o/604800000:o,r?c:aI(c)
},from:function(d,c){return aK.duration(this.diff(d)).humanize(!c)
},fromNow:function(b){return this.from(aK(),b)
},calendar:function(){var f=this.diff(aK().sod(),"days",!0),c=aK.calendar,h=c.sameElse,g=f<-6?h:f<-1?c.lastWeek:f<0?c.lastDay:f<1?c.sameDay:f<2?c.nextDay:f<7?c.nextWeek:h;
return this.format(typeof g=="function"?g.apply(this):g)
},isLeapYear:function(){var b=this.year();
return b%4===0&&b%100!==0||b%400===0
},isDST:function(){return this.zone()<aK([this.year()]).zone()||this.zone()<aK([this.year(),5]).zone()
},day:function(d){var c=this._isUTC?this._d.getUTCDay():this._d.getDay();
return d==null?c:this.add({d:d-c})
},sod:function(){return aK(this).hours(0).minutes(0).seconds(0).milliseconds(0)
},eod:function(){return this.sod().add({d:1,ms:-1})
},zone:function(){return this._isUTC?0:this._d.getTimezoneOffset()
},daysInMonth:function(){return aK(this).month(this.month()+1).date(0).date()
}};
for(aH=0;
aH<an.length;
aH++){V(an[aH].toLowerCase(),an[aH])
}V("year","FullYear"),aK.duration.fn=aj.prototype={weeks:function(){return ak(this.days()/7)
},valueOf:function(){return this._milliseconds+this._days*86400000+this._months*2592000000
},humanize:function(f){var c=+this,h=aK.relativeTime,g=W(c,!f);
return f&&(g=(c<=0?h.past:h.future).replace(/%s/i,g)),g
}};
for(aH in am){am.hasOwnProperty(aH)&&(T(aH,am[aH]),U(aH.toLowerCase()))
}T("Weeks",604800000),aE&&(module.exports=aK),typeof window!="undefined"&&typeof ender=="undefined"&&(window.moment=aK),typeof define=="function"&&define.amd&&define("moment",[],function(){return aK
})
})(Date);
var DL=window.DL||{};
(function(){DL.TimezoneOffset={AKST9AKDT:"-09:00","Africa/Abidjan":"+00:00","Africa/Accra":"+00:00","Africa/Addis_Ababa":"+03:00","Africa/Algiers":"+01:00","Africa/Asmara":"+03:00","Africa/Asmera":"+03:00","Africa/Bamako":"+00:00","Africa/Bangui":"+01:00","Africa/Banjul":"+00:00","Africa/Bissau":"+00:00","Africa/Blantyre":"+02:00","Africa/Brazzaville":"+01:00","Africa/Bujumbura":"+02:00","Africa/Cairo":"+02:00","Africa/Casablanca":"+00:00","Africa/Ceuta":"+01:00","Africa/Conakry":"+00:00","Africa/Dakar":"+00:00","Africa/Dar_es_Salaam":"+03:00","Africa/Djibouti":"+03:00","Africa/Douala":"+01:00","Africa/El_Aaiun":"+00:00","Africa/Freetown":"+00:00","Africa/Gaborone":"+02:00","Africa/Harare":"+02:00","Africa/Johannesburg":"+02:00","Africa/Juba":"+03:00","Africa/Kampala":"+03:00","Africa/Khartoum":"+03:00","Africa/Kigali":"+02:00","Africa/Kinshasa":"+01:00","Africa/Lagos":"+01:00","Africa/Libreville":"+01:00","Africa/Lome":"+00:00","Africa/Luanda":"+01:00","Africa/Lubumbashi":"+02:00","Africa/Lusaka":"+02:00","Africa/Malabo":"+01:00","Africa/Maputo":"+02:00","Africa/Maseru":"+02:00","Africa/Mbabane":"+02:00","Africa/Mogadishu":"+03:00","Africa/Monrovia":"+00:00","Africa/Nairobi":"+03:00","Africa/Ndjamena":"+01:00","Africa/Niamey":"+01:00","Africa/Nouakchott":"+00:00","Africa/Ouagadougou":"+00:00","Africa/Porto-Novo":"+01:00","Africa/Sao_Tome":"+00:00","Africa/Timbuktu":"+00:00","Africa/Tripoli":"+02:00","Africa/Tunis":"+01:00","Africa/Windhoek":"+01:00","America/Adak":"-10:00","America/Anchorage":"-09:00","America/Anguilla":"-04:00","America/Antigua":"-04:00","America/Araguaina":"-03:00","America/Argentina/Buenos_Aires":"-03:00","America/Argentina/Catamarca":"-03:00","America/Argentina/ComodRivadavia":"-03:00","America/Argentina/Cordoba":"-03:00","America/Argentina/Jujuy":"-03:00","America/Argentina/La_Rioja":"-03:00","America/Argentina/Mendoza":"-03:00","America/Argentina/Rio_Gallegos":"-03:00","America/Argentina/Salta":"-03:00","America/Argentina/San_Juan":"-03:00","America/Argentina/San_Luis":"-03:00","America/Argentina/Tucuman":"-03:00","America/Argentina/Ushuaia":"-03:00","America/Aruba":"-04:00","America/Asuncion":"-04:00","America/Atikokan":"-05:00","America/Atka":"-10:00","America/Bahia":"-03:00","America/Bahia_Banderas":"-06:00","America/Barbados":"-04:00","America/Belem":"-03:00","America/Belize":"-06:00","America/Blanc-Sablon":"-04:00","America/Boa_Vista":"-04:00","America/Bogota":"-05:00","America/Boise":"-07:00","America/Buenos_Aires":"-03:00","America/Cambridge_Bay":"-07:00","America/Campo_Grande":"-04:00","America/Cancun":"-06:00","America/Caracas":"-04:30","America/Catamarca":"-03:00","America/Cayenne":"-03:00","America/Cayman":"-05:00","America/Chicago":"-06:00","America/Chihuahua":"-07:00","America/Coral_Harbour":"-05:00","America/Cordoba":"-03:00","America/Costa_Rica":"-06:00","America/Creston":"-07:00","America/Cuiaba":"-04:00","America/Curacao":"-04:00","America/Danmarkshavn":"+00:00","America/Dawson":"-08:00","America/Dawson_Creek":"-07:00","America/Denver":"-07:00","America/Detroit":"-05:00","America/Dominica":"-04:00","America/Edmonton":"-07:00","America/Eirunepe":"-04:00","America/El_Salvador":"-06:00","America/Ensenada":"-08:00","America/Fort_Wayne":"-05:00","America/Fortaleza":"-03:00","America/Glace_Bay":"-04:00","America/Godthab":"-03:00","America/Goose_Bay":"-04:00","America/Grand_Turk":"-05:00","America/Grenada":"-04:00","America/Guadeloupe":"-04:00","America/Guatemala":"-06:00","America/Guayaquil":"-05:00","America/Guyana":"-04:00","America/Halifax":"-04:00","America/Havana":"-05:00","America/Hermosillo":"-07:00","America/Indiana/Indianapolis":"-05:00","America/Indiana/Knox":"-06:00","America/Indiana/Marengo":"-05:00","America/Indiana/Petersburg":"-05:00","America/Indiana/Tell_City":"-06:00","America/Indiana/Vevay":"-05:00","America/Indiana/Vincennes":"-05:00","America/Indiana/Winamac":"-05:00","America/Indianapolis":"-05:00","America/Inuvik":"-07:00","America/Iqaluit":"-05:00","America/Jamaica":"-05:00","America/Jujuy":"-03:00","America/Juneau":"-09:00","America/Kentucky/Louisville":"-05:00","America/Kentucky/Monticello":"-05:00","America/Knox_IN":"-06:00","America/Kralendijk":"-04:00","America/La_Paz":"-04:00","America/Lima":"-05:00","America/Los_Angeles":"-08:00","America/Louisville":"-05:00","America/Lower_Princes":"-04:00","America/Maceio":"-03:00","America/Managua":"-06:00","America/Manaus":"-04:00","America/Marigot":"-04:00","America/Martinique":"-04:00","America/Matamoros":"-06:00","America/Mazatlan":"-07:00","America/Mendoza":"-03:00","America/Menominee":"-06:00","America/Merida":"-06:00","America/Metlakatla":"-08:00","America/Mexico_City":"-06:00","America/Miquelon":"-03:00","America/Moncton":"-04:00","America/Monterrey":"-06:00","America/Montevideo":"-03:00","America/Montreal":"-05:00","America/Montserrat":"-04:00","America/Nassau":"-05:00","America/New_York":"-05:00","America/Nipigon":"-05:00","America/Nome":"-09:00","America/Noronha":"-02:00","America/North_Dakota/Beulah":"-06:00","America/North_Dakota/Center":"-06:00","America/North_Dakota/New_Salem":"-06:00","America/Ojinaga":"-07:00","America/Panama":"-05:00","America/Pangnirtung":"-05:00","America/Paramaribo":"-03:00","America/Phoenix":"-07:00","America/Port-au-Prince":"-05:00","America/Port_of_Spain":"-04:00","America/Porto_Acre":"-04:00","America/Porto_Velho":"-04:00","America/Puerto_Rico":"-04:00","America/Rainy_River":"-06:00","America/Rankin_Inlet":"-06:00","America/Recife":"-03:00","America/Regina":"-06:00","America/Resolute":"-06:00","America/Rio_Branco":"-04:00","America/Rosario":"-03:00","America/Santa_Isabel":"-08:00","America/Santarem":"-03:00","America/Santiago":"-04:00","America/Santo_Domingo":"-04:00","America/Sao_Paulo":"-03:00","America/Scoresbysund":"-01:00","America/Shiprock":"-07:00","America/Sitka":"-09:00","America/St_Barthelemy":"-04:00","America/St_Johns":"-03:30","America/St_Kitts":"-04:00","America/St_Lucia":"-04:00","America/St_Thomas":"-04:00","America/St_Vincent":"-04:00","America/Swift_Current":"-06:00","America/Tegucigalpa":"-06:00","America/Thule":"-04:00","America/Thunder_Bay":"-05:00","America/Tijuana":"-08:00","America/Toronto":"-05:00","America/Tortola":"-04:00","America/Vancouver":"-08:00","America/Virgin":"-04:00","America/Whitehorse":"-08:00","America/Winnipeg":"-06:00","America/Yakutat":"-09:00","America/Yellowknife":"-07:00","Antarctica/Casey":"+11:00","Antarctica/Davis":"+05:00","Antarctica/DumontDUrville":"+10:00","Antarctica/Macquarie":"+11:00","Antarctica/Mawson":"+05:00","Antarctica/McMurdo":"+12:00","Antarctica/Palmer":"-04:00","Antarctica/Rothera":"-03:00","Antarctica/South_Pole":"+12:00","Antarctica/Syowa":"+03:00","Antarctica/Vostok":"+06:00","Arctic/Longyearbyen":"+01:00","Asia/Aden":"+03:00","Asia/Almaty":"+06:00","Asia/Amman":"+02:00","Asia/Anadyr":"+12:00","Asia/Aqtau":"+05:00","Asia/Aqtobe":"+05:00","Asia/Ashgabat":"+05:00","Asia/Ashkhabad":"+05:00","Asia/Baghdad":"+03:00","Asia/Bahrain":"+03:00","Asia/Baku":"+04:00","Asia/Bangkok":"+07:00","Asia/Beirut":"+02:00","Asia/Bishkek":"+06:00","Asia/Brunei":"+08:00","Asia/Calcutta":"+05:30","Asia/Choibalsan":"+08:00","Asia/Chongqing":"+08:00","Asia/Chungking":"+08:00","Asia/Colombo":"+05:30","Asia/Dacca":"+06:00","Asia/Damascus":"+02:00","Asia/Dhaka":"+06:00","Asia/Dili":"+09:00","Asia/Dubai":"+04:00","Asia/Dushanbe":"+05:00","Asia/Gaza":"+02:00","Asia/Harbin":"+08:00","Asia/Hebron":"+02:00","Asia/Ho_Chi_Minh":"+07:00","Asia/Hong_Kong":"+08:00","Asia/Hovd":"+07:00","Asia/Irkutsk":"+09:00","Asia/Istanbul":"+02:00","Asia/Jakarta":"+07:00","Asia/Jayapura":"+09:00","Asia/Jerusalem":"+02:00","Asia/Kabul":"+04:30","Asia/Kamchatka":"+12:00","Asia/Karachi":"+05:00","Asia/Kashgar":"+08:00","Asia/Kathmandu":"+05:45","Asia/Katmandu":"+05:45","Asia/Kolkata":"+05:30","Asia/Krasnoyarsk":"+08:00","Asia/Kuala_Lumpur":"+08:00","Asia/Kuching":"+08:00","Asia/Kuwait":"+03:00","Asia/Macao":"+08:00","Asia/Macau":"+08:00","Asia/Magadan":"+12:00","Asia/Makassar":"+08:00","Asia/Manila":"+08:00","Asia/Muscat":"+04:00","Asia/Nicosia":"+02:00","Asia/Novokuznetsk":"+07:00","Asia/Novosibirsk":"+07:00","Asia/Omsk":"+07:00","Asia/Oral":"+05:00","Asia/Phnom_Penh":"+07:00","Asia/Pontianak":"+07:00","Asia/Pyongyang":"+09:00","Asia/Qatar":"+03:00","Asia/Qyzylorda":"+06:00","Asia/Rangoon":"+06:30","Asia/Riyadh":"+03:00","Asia/Saigon":"+07:00","Asia/Sakhalin":"+11:00","Asia/Samarkand":"+05:00","Asia/Seoul":"+09:00","Asia/Shanghai":"+08:00","Asia/Singapore":"+08:00","Asia/Taipei":"+08:00","Asia/Tashkent":"+05:00","Asia/Tbilisi":"+04:00","Asia/Tehran":"+03:30","Asia/Tel_Aviv":"+02:00","Asia/Thimbu":"+06:00","Asia/Thimphu":"+06:00","Asia/Tokyo":"+09:00","Asia/Ujung_Pandang":"+08:00","Asia/Ulaanbaatar":"+08:00","Asia/Ulan_Bator":"+08:00","Asia/Urumqi":"+08:00","Asia/Vientiane":"+07:00","Asia/Vladivostok":"+11:00","Asia/Yakutsk":"+10:00","Asia/Yekaterinburg":"+06:00","Asia/Yerevan":"+04:00","Atlantic/Azores":"-01:00","Atlantic/Bermuda":"-04:00","Atlantic/Canary":"+00:00","Atlantic/Cape_Verde":"-01:00","Atlantic/Faeroe":"+00:00","Atlantic/Faroe":"+00:00","Atlantic/Jan_Mayen":"+01:00","Atlantic/Madeira":"+00:00","Atlantic/Reykjavik":"+00:00","Atlantic/South_Georgia":"-02:00","Atlantic/St_Helena":"+00:00","Atlantic/Stanley":"-03:00","Australia/ACT":"+10:00","Australia/Adelaide":"+09:30","Australia/Brisbane":"+10:00","Australia/Broken_Hill":"+09:30","Australia/Canberra":"+10:00","Australia/Currie":"+10:00","Australia/Darwin":"+09:30","Australia/Eucla":"+08:45","Australia/Hobart":"+10:00","Australia/LHI":"+10:30","Australia/Lindeman":"+10:00","Australia/Lord_Howe":"+10:30","Australia/Melbourne":"+10:00","Australia/NSW":"+10:00","Australia/North":"+09:30","Australia/Perth":"+08:00","Australia/Queensland":"+10:00","Australia/South":"+09:30","Australia/Sydney":"+10:00","Australia/Tasmania":"+10:00","Australia/Victoria":"+10:00","Australia/West":"+08:00","Australia/Yancowinna":"+09:30","Brazil/Acre":"-04:00","Brazil/DeNoronha":"-02:00","Brazil/East":"-03:00","Brazil/West":"-04:00",CET:"+01:00",CST6CDT:"-06:00","Canada/Atlantic":"-04:00","Canada/Central":"-06:00","Canada/East-Saskatchewan":"-06:00","Canada/Eastern":"-05:00","Canada/Mountain":"-07:00","Canada/Newfoundland":"-03:30","Canada/Pacific":"-08:00","Canada/Saskatchewan":"-06:00","Canada/Yukon":"-08:00","Chile/Continental":"-04:00","Chile/EasterIsland":"-06:00",Cuba:"-05:00",EET:"+02:00",EST5EDT:"-05:00",EST:"-05:00",Egypt:"+02:00",Eire:"+00:00","Etc/GMT":"+00:00","Etc/GMT+0":"+00:00","Etc/UCT":"+00:00","Etc/UTC":"+00:00","Etc/Universal":"+00:00","Etc/Zulu":"+00:00","Europe/Amsterdam":"+01:00","Europe/Andorra":"+01:00","Europe/Athens":"+02:00","Europe/Belfast":"+00:00","Europe/Belgrade":"+01:00","Europe/Berlin":"+01:00","Europe/Bratislava":"+01:00","Europe/Brussels":"+01:00","Europe/Bucharest":"+02:00","Europe/Budapest":"+01:00","Europe/Chisinau":"+02:00","Europe/Copenhagen":"+01:00","Europe/Dublin":"+00:00","Europe/Gibraltar":"+01:00","Europe/Guernsey":"+00:00","Europe/Helsinki":"+02:00","Europe/Isle_of_Man":"+00:00","Europe/Istanbul":"+02:00","Europe/Jersey":"+00:00","Europe/Kaliningrad":"+03:00","Europe/Kiev":"+02:00","Europe/Lisbon":"+00:00","Europe/Ljubljana":"+01:00","Europe/London":"+00:00","Europe/Luxembourg":"+01:00","Europe/Madrid":"+01:00","Europe/Malta":"+01:00","Europe/Mariehamn":"+02:00","Europe/Minsk":"+03:00","Europe/Monaco":"+01:00","Europe/Moscow":"+04:00","Europe/Nicosia":"+02:00","Europe/Oslo":"+01:00","Europe/Paris":"+01:00","Europe/Podgorica":"+01:00","Europe/Prague":"+01:00","Europe/Riga":"+02:00","Europe/Rome":"+01:00","Europe/Samara":"+04:00","Europe/San_Marino":"+01:00","Europe/Sarajevo":"+01:00","Europe/Simferopol":"+02:00","Europe/Skopje":"+01:00","Europe/Sofia":"+02:00","Europe/Stockholm":"+01:00","Europe/Tallinn":"+02:00","Europe/Tirane":"+01:00","Europe/Tiraspol":"+02:00","Europe/Uzhgorod":"+02:00","Europe/Vaduz":"+01:00","Europe/Vatican":"+01:00","Europe/Vienna":"+01:00","Europe/Vilnius":"+02:00","Europe/Volgograd":"+04:00","Europe/Warsaw":"+01:00","Europe/Zagreb":"+01:00","Europe/Zaporozhye":"+02:00","Europe/Zurich":"+01:00",GB:"+00:00","GB-Eire":"+00:00",GMT0:"+00:00",GMT:"+00:00","GMT+0":"+00:00","GMT-0":"+00:00",Greenwich:"+00:00",HST:"-10:00",Hongkong:"+08:00",Iceland:"+00:00","Indian/Antananarivo":"+03:00","Indian/Chagos":"+06:00","Indian/Christmas":"+07:00","Indian/Cocos":"+06:30","Indian/Comoro":"+03:00","Indian/Kerguelen":"+05:00","Indian/Mahe":"+04:00","Indian/Maldives":"+05:00","Indian/Mauritius":"+04:00","Indian/Mayotte":"+03:00","Indian/Reunion":"+04:00",Iran:"+03:30",Israel:"+02:00","JST-9":"+09:00",Jamaica:"-05:00",Japan:"+09:00",Kwajalein:"+12:00",Libya:"+02:00",MET:"+01:00",MST7MDT:"-07:00",MST:"-07:00","Mexico/BajaNorte":"-08:00","Mexico/BajaSur":"-07:00","Mexico/General":"-06:00",NZ:"+12:00","NZ-CHAT":"+12:45",Navajo:"-07:00",PRC:"+08:00",PST7PDT:"-07:00",PST8PDT:"-08:00","Pacific/Apia":"+13:00","Pacific/Auckland":"+12:00","Pacific/Chatham":"+12:45","Pacific/Chuuk":"+10:00","Pacific/Easter":"-06:00","Pacific/Efate":"+11:00","Pacific/Enderbury":"+13:00","Pacific/Fakaofo":"+13:00","Pacific/Fiji":"+12:00","Pacific/Funafuti":"+12:00","Pacific/Galapagos":"-06:00","Pacific/Gambier":"-09:00","Pacific/Guadalcanal":"+11:00","Pacific/Guam":"+10:00","Pacific/Honolulu":"-10:00","Pacific/Johnston":"-10:00","Pacific/Kiritimati":"+14:00","Pacific/Kosrae":"+11:00","Pacific/Kwajalein":"+12:00","Pacific/Majuro":"+12:00","Pacific/Marquesas":"-09:30","Pacific/Midway":"-11:00","Pacific/Nauru":"+12:00","Pacific/Niue":"-11:00","Pacific/Norfolk":"+11:30","Pacific/Noumea":"+11:00","Pacific/Pago_Pago":"-11:00","Pacific/Palau":"+09:00","Pacific/Pitcairn":"-08:00","Pacific/Pohnpei":"+11:00","Pacific/Ponape":"+11:00","Pacific/Port_Moresby":"+10:00","Pacific/Rarotonga":"-10:00","Pacific/Saipan":"+10:00","Pacific/Samoa":"-11:00","Pacific/Tahiti":"-10:00","Pacific/Tarawa":"+12:00","Pacific/Tongatapu":"+13:00","Pacific/Truk":"+10:00","Pacific/Wake":"+12:00","Pacific/Wallis":"+12:00","Pacific/Yap":"+10:00",Poland:"+01:00",Portugal:"+00:00",ROC:"+08:00",ROK:"+09:00",Singapore:"+08:00",Turkey:"+02:00",UCT:"+00:00","US/Alaska":"-09:00","US/Aleutian":"-10:00","US/Arizona":"-07:00","US/Central":"-06:00","US/East-Indiana":"-05:00","US/Eastern":"-05:00","US/Hawaii":"-10:00","US/Indiana-Starke":"-06:00","US/Michigan":"-05:00","US/Mountain":"-07:00","US/Pacific":"-08:00","US/Pacific-New":"-08:00","US/Samoa":"-11:00",UTC:"+00:00",Universal:"+00:00","W-SU":"+04:00",WET:"+00:00",Zulu:"+00:00"}
})();
if(!window.DL){var DL={}
}DL.Spaces=DL.Spaces||{};
DL.Spaces.BootLoader={};
(function(a){a.loaded=false;
a.loadedLibs=false;
a.errorHandler=function(b){DL.log(b)
};
a.getData=function(f){f=f||function(){};
var d=[DL.Dashboard.getPossibleRooms,DL.Dashboard.getPossibleFloors,DL.Dashboard.getRoomFloorConfig+DL.Dashboard.gwid+".json"];
var b=["possibleRooms","possibleFloors","roomFloorData"];
var e=0;
var c=function(){e++;
if(e>=d.length){a.loaded=true;
if(f){f()
}}};
_.each(d,function(h,g){DL.Dashboard.Main.Ajax(h,function(k){if(k.responseMessage){a[b[g]]=k.responseMessage.content
}else{if(k.responseText){DL.log("--- Data Error ---",JSON.parse(k.responseText))
}else{DL.log("--- Parse Error ---",k)
}}c()
},function(k){DL.log("--- AJAX Error ---",k.responseText);
c()
},{type:"GET"})
})
};
a.getLibs=function(b){Frame.useTimeout=false;
Frame(DL.ServerSecurePath+DL.ContextUrl+"/scripts/web/dashboard/views/spaces/classes/validator.js");
Frame(DL.ServerSecurePath+DL.ContextUrl+"/scripts/web/dashboard/views/spaces/classes/scaffold.js");
Frame(DL.ServerSecurePath+DL.ContextUrl+"/scripts/web/dashboard/views/spaces/classes/pixels.js");
Frame(DL.ServerSecurePath+DL.ContextUrl+"/scripts/web/dashboard/views/spaces/classes/projector.js");
Frame(DL.ServerSecurePath+DL.ContextUrl+"/scripts/web/dashboard/views/spaces/classes/canvas.js");
Frame(DL.ServerSecurePath+DL.ContextUrl+"/scripts/web/dashboard/views/spaces/classes/overlay.js");
Frame(DL.ServerSecurePath+DL.ContextUrl+"/scripts/web/dashboard/views/spaces/classes/operators.js");
Frame(DL.ServerSecurePath+DL.ContextUrl+"/scripts/web/dashboard/views/spaces/classes/timeline.js");
Frame(DL.ServerSecurePath+DL.ContextUrl+"/scripts/web/dashboard/views/spaces/classes/events.js");
Frame(function(c){a.loadedLibs=true;
if(b){b()
}c()
});
Frame.start()
};
a.loadFromConfig=function(b){DL.Dashboard.SpacesShared.getDefaultRoomFloorConfig(function(c){DL.Spaces.Data.getDefault.isLoadingDefault=true;
DL.Spaces.Data.getDefault.floorPlan(c);
if(_.isFunction(b)){b(c)
}else{return c
}})
};
a.isFloorplanLoaded=function(){return(_.keys(DL.Spaces.Data.floorplan()).length>0)
};
a.getRoomFloorData=function(c,b){if(!!!document.createElement("canvas").getContext){new DL.Dashboard.Views.IE8Spaces()
}else{Frame(function(d){if(!a.loaded){DL.Spaces.BootLoader.getData(function(){d()
})
}else{d()
}});
Frame(function(d){if(!DL.Spaces.BootLoader.roomFloorData&&!a.isFloorplanLoaded()){a.loadFromConfig(d)
}else{DL.Spaces.Data.setfloorplan(a.roomFloorData);
d()
}});
Frame(function(d){DL.Spaces.DataSync.sync(d)
});
Frame(function(d){DL.Spaces.Validator.validateFloorplan(d)
});
Frame(function(d){if(b&&!a.loadedLibs){DL.Spaces.BootLoader.getLibs(function(){c()
})
}else{c()
}d()
});
Frame.start()
}}
})(DL.Spaces.BootLoader);
if(!window.DL){var DL={}
}DL.Spaces=DL.Spaces||{};
DL.Spaces.Helpers={};
(function(c){c.fn=function(){};
c.linear=function b(f,e,h,g){return h*f/g+e
};
c.easeInExpo=function(f,g,e,k,h){return(g==0)?e:k*Math.pow(2,10*(g/h-1))+e
};
c.easeOutExpo=function(f,g,e,k,h){return(g==h)?e+k:k*(-Math.pow(2,-10*g/h)+1)+e
};
c.easeInOutExpo=function(f,g,e,k,h){if(g==0){return e
}if(g==h){return e+k
}if((g/=h/2)<1){return k/2*Math.pow(2,10*(g-1))+e
}return k/2*(-Math.pow(2,-10*--g)+2)+e
};
c.easeInCirc=function(f,g,e,k,h){return -k*(Math.sqrt(1-(g/=h)*g)-1)+e
};
c.easeOutCirc=function(f,g,e,k,h){return k*Math.sqrt(1-(g=g/h-1)*g)+e
};
c.easeInOutCirc=function(f,g,e,k,h){if((g/=h/2)<1){return -k/2*(Math.sqrt(1-g*g)-1)+e
}return k/2*(Math.sqrt(1-(g-=2)*g)+1)+e
};
jQuery.extend(jQuery.easing,{easeOutExpo:c.easeOutExpo});
jQuery.extend(jQuery.easing,{easeInExpo:c.easeInExpo});
jQuery.extend(jQuery.easing,{easeInOutExpo:c.easeInOutExpo});
jQuery.extend(jQuery.easing,{easeOutCirc:c.easeOutCirc});
jQuery.extend(jQuery.easing,{easeInCirc:c.easeInCirc});
jQuery.extend(jQuery.easing,{easeInOutCirc:c.easeInOutCirc});
c.preventDefault=function(d){if(d&&d.preventDefault){d.preventDefault()
}else{if(window.event){window.event.returnValue=false
}}};
c.clearSelection=function(){if(document.selection){document.selection.empty()
}else{if(window.getSelection){window.getSelection().removeAllRanges()
}}};
c.Factory=function(e,d){return(typeof e==="function")?function(){return e.apply({},c.toArray(arguments))
}:function(){return d.apply(e,_.rest(c.toArray(arguments)))
}
};
c.Model=function(d){return function(e){return jQuery.extend(true,{},d,e)
}
};
if(JSON){c.json=function(d){if(typeof d==="string"){return JSON.parse(d)
}else{return JSON.stringify(d)
}}
}c.toArray=function(d){return Array.prototype.slice.apply(d)
};
c.sign=function(d){return d&&d/Math.abs(d)
};
if(!Array.prototype.indexOf){Array.prototype.indexOf=function(e){for(var d=0;
d<this.length;
d++){if(this[d]===e){return d
}}return -1
}
}c.optional=function(){var e=c.toArray(arguments);
for(var d=0;
d<e.length;
d++){if(typeof e[d]!=="undefined"&&e[d]!==null){if(!(typeof d!=="string"&&String(e[d])==="NaN")){return e[d]
}}}return""
};
c.object2array=function(d){return _.reduce(d,function(e,f,g){if(_.isObject(f)&&!_.isFunction(f)){f.id=g;
e.push(f)
}return e
},[])
};
c.inRange=function(f,e,d){if(e<f+d/2&&e>f-d/2){return true
}return false
};
c.makeInt=function(e){var d=c.optional(parseInt(e,10));
return d
};
c.wrap=function(e,d,g){g=g||0;
var f=d-g+1;
if(e>=g&&e<=d){return e
}if(e<g){return c.wrap(e+f,d,g)
}if(e>d){return c.wrap(e-f,d,g)
}return g
};
var a=[];
c.uniqueId=function(d){var g="0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
var h=d;
var k="elm-";
randomstring="";
for(var f=0;
f<h;
f++){var e=Math.floor(Math.random()*g.length);
k+=g.substring(e,e+1)
}while($.inArray(k,a)!==-1){randomstring="";
for(var f=0;
f<h;
f++){var e=Math.floor(Math.random()*g.length);
k+=g.substring(e,e+1)
}}a.push(k);
return k
};
c.tag=function(f,k,g,e,h){var d=jQuery("<"+f+"></"+f+">");
d.attr(c.optional(jQuery.extend(g,{id:c.uniqueId(5)}),{}));
jQuery.each(c.optional(e,{}),function(m,l){d.bind(m,l)
});
if(h instanceof Array){jQuery(h).each(function(l){d.append(jQuery(this))
})
}else{d.append(c.optional(h))
}if(c.optional(k)!==""){jQuery(k).append(d)
}return d
};
c.div=function(g,e,d,f){return c.tag("div",g,e,d,f)
};
c.h1=function(g,e,d,f){return c.tag("h1",g,e,d,f)
};
c.h2=function(g,e,d,f){return c.tag("h2",g,e,d,f)
};
c.p=function(g,e,d,f){return c.tag("p",g,e,d,f)
}
}(DL.Spaces.Helpers));
if(!window.DL){var DL={}
}DL.Spaces=DL.Spaces||{};
DL.Spaces.Data={};
(function(l){var z=DL.Spaces.BootLoader;
var n=DL.Spaces.Helpers;
var v=n.Model;
var B=n.Factory;
var t=n.fn;
l.samples={};
l.models={};
var o={};
var D={};
var c="";
var y=0;
l.FPS=10;
l.SPEED=960;
l.EASE="easeOutExpo";
l.DELAY=100;
l.WIDTH=950;
l.HEIGHT=580;
l.floorplan=function(){return o
};
l.setfloorplan=function(F){if(F&&F instanceof Object){o=$.extend(true,{},F);
_.each(o,function(H,G){H.id=G
});
if(DL.Dashboard.SpacesShared.currentFloor!==false){l.setFloor(DL.Dashboard.SpacesShared.currentFloor)
}else{if(DL.Spaces.DataSync.modifiedData&&DL.Spaces.DataSync.modifiedFloor){l.setFloor(DL.Spaces.DataSync.modifiedFloor)
}else{l.setFloor()
}}l.insetDeviceLocations()
}};
l.setFloor=function(F){if(typeof F==="number"){D=l.floorByIndex(F)
}else{if(typeof F==="string"){D=l.floor(F)
}else{D=l.floorByIndex(0)
}}if(!D){D=l.floorByIndex(0)
}c=D.id;
DL.Dashboard.SpacesShared.currentFloor=c
};
l.floor=function(F){if(F){var G=o[F];
if(!G){G=l.getFloor(F);
if(G){l.addFloor(F)
}}if(!G.hasOwnProperty("id")){G.id=F
}return G||false
}else{return D||false
}};
l.floorByIndex=function(G){var H=0,F=false;
_.each(o,function(J,I){if(typeof J!=="function"){if(H===G){F=J
}H++
}});
return F
};
l.floorId=function(){return c
};
l.floorIndex=function(G){var H=0,F=false;
if(!G){G=c
}_.each(o,function(J,I){if(typeof J!=="function"){if(I===G){F=H
}H++
}});
return F
};
l.floorName=function(){return _.reduce(DL.Spaces.BootLoader.possibleFloors,function(F,G){if(G.id===c){F=G.label
}return F
},"Other")
};
l.room=function(G,F){if(!F){F=c
}if(o[F]){if(typeof G==="string"){var H=_.filter(o[F].rooms,function(I){return I.id===G
});
return H[0]||false
}return o[F].rooms[G]
}return false
};
l.rooms=function(){return(o[c])?o[c].rooms:false
};
l.addWall=function(H,F,G){var I=l.room(H);
I.points.splice(G,0,F.point);
I.doorLocations.splice(G,0,F.door);
I.windowLocations.splice(G,0,F.window)
};
l.removeWall=function(G,F){var H=l.room(G);
H.points.splice(F,1);
H.doorLocations.splice(F,1);
H.windowLocations.splice(F,1)
};
l.devices=function(G){var F=l.room(G);
return n.object2array(F.deviceLocations)||false
};
l.getRoomPointIndex=function(I,F){var H=l.room(I);
var G=false;
_.each(H.points,function(K,J){if(K[0]===F[0]&&K[1]===F[1]){G=J
}});
return G
};
l.addDoor=function(H,F,I){var G=l.room(H);
if(G){G.doorLocations[F].push(I);
return true
}return false
};
l.removeDoor=function(I,G,F){var H=l.room(I);
if(H){H.doorLocations[G].splice(F,1);
return true
}return false
};
l.addWindow=function(H,F,I){var G=l.room(H);
if(G){G.windowLocations[F].push(I);
return true
}return false
};
l.removeWindow=function(H,F,I){var G=l.room(H);
DL.log(G);
if(G){G.windowLocations[F].splice(I,1);
return true
}return false
};
l.leftMost=function(J,I,H){Frame.perf("Data.leftMost","start");
var F=H||l.room(J,I).points;
var G=_.reduce(F,function(K,L){if(L[0]<K[0]){K[0]=L[0]
}if(L[1]<K[1]){K[1]=L[1]
}return K
},[99999,99999]);
Frame.perf("Data.leftMost","stop");
return G
};
l.moveAllPoints=function(F){var G=$.extend(true,{},l.floorplan());
_.each(G,function(H){_.each(H.rooms,function(I){_.each(I.points,function(K,J){I.points[J][0]+=F[0];
I.points[J][1]+=F[1]
})
})
});
o=G
};
var E=[];
var k={};
var p=0;
l.clearHistory=function(){E=[];
k={};
p=0;
l.initHistory()
};
l.historyLength=function(){return E.length
};
l.historyIndex=function(){return p
};
l.resetHistory=function(){E=E.slice(p,E.length-1);
p=0;
if(E.length===0){E.unshift($.extend(true,{},k))
}$("#app").find(".toolPalette ul.buttons li").eq(1).addClass("disabled")
};
l.saveHistory=_.throttle(function(){if(l.historyLength()==y){DL.Dashboard.Main.abandonChangesModalBind()
}if(p!==0){l.resetHistory()
}E.unshift($.extend(true,{},l.floorplan()));
if(E.length>0){$("#app").find(".toolPalette ul.buttons li").eq(0).removeClass("disabled")
}},l.DELAY);
l.initHistory=function(){k=$.extend(true,{},l.floorplan());
E.unshift($.extend(true,{},k));
y=l.historyLength()
};
l.undoHistory=function(){if(p<E.length-1){p++;
$("#app").find(".toolPalette ul.buttons li").eq(1).removeClass("disabled");
o=E[p]||_.last(history)
}else{$("#app").find(".toolPalette ul.buttons li").eq(0).addClass("disabled");
o=$.extend(true,{},k)
}l.setFloor(c);
return p
};
l.redoHistory=function(){if(p>0){p--;
$("#app").find(".toolPalette ul.buttons li").eq(0).removeClass("disabled")
}else{$("#app").find(".toolPalette ul.buttons li").eq(1).addClass("disabled")
}o=E[p]||_.first(E);
l.setFloor(c);
return p
};
l.revertHistory=function(){l.saveHistory();
l.undoHistory();
l.resetHistory()
};
l.put=function(H){var H=H||function(){};
l.insetDeviceLocations();
if(DL.Spaces.Operators){_.each(DL.Spaces.Data.floorplan,function(I){DL.Spaces.Operators.ensureDetailLocations(I.id)
})
}var G=o;
var F=DL.Dashboard.getRoomFloorConfig+DL.Dashboard.gwid+".json";
DL.Dashboard.Main.Ajax(F,function(I){DL.log("save success",I);
DL.Spaces.BootLoader.roomFloorData=G;
l.clearHistory();
H()
},function(I){DL.log("--- Data Save Error ---",I,F);
alert("There was an error processing your request. Please try again later. [SV1]")
},{type:"POST",contentType:"application/json",data:n.json(G)})
};
var s=30;
l.insetDeviceLocations=function(){_.each(o,function(G,F){_.each(G.rooms,function(I,H){_.each(I.deviceLocations,function(S,L){var Q=l.leftMost(H,F);
var T=[S[0]+Q[0],S[1]+Q[1]];
for(var O=0,N=I.points.length-1;
O<I.points.length;
N=O++){var U=I.points[O];
var K=I.points[N];
var R=(U[0]===K[0])?0:1;
var P=Math.abs(R-1);
if((T[P]<U[P]&&T[P]>K[P])||(T[P]>U[P]&&T[P]<K[P])){if(Math.abs(T[R]-U[R])<s){var M=(T[R]>U[R])?1:-1;
var J=l.room(H,F).deviceLocations[L];
J[R]=(U[R]+(s*M))-Q[R]
}}}})
})
})
};
l.centerFloorplan=function(){Frame.perf("Data.centerFloorplan","start");
var F=999999;
var G=999999;
_.each(o,function(H){_.each(H.rooms,function(I){_.each(I.points,function(J){if(J[0]<F){F=J[0]
}if(J[1]<G){G=J[1]
}})
})
});
if((F!==0||G!==0)&&(F!==999999&&G!==999999)){_.each(o,function(H){_.each(H.rooms,function(I){_.each(I.points,function(J){J[0]-=F-50;
J[1]-=G-50
})
})
})
}Frame.perf("Data.centerFloorplan","stop")
};
l.getDefault={isLoadingDefault:false,unit:"meter",floorPlan:function(G){var I=[];
if(G&&G instanceof Object){for(var H=0,F=G.floors.length;
H<F;
H++){I.push(this.floor(G.floors[H]))
}l.setfloorplan(d(I));
return true
}else{return false
}},floor:function(F){if(F&&F instanceof Object){var G=this.rooms(F.rooms);
return b({id:F.id,unitOfDistance:this.unit,rooms:G})
}},generateWalls:function(I,F){I=I>3?I%4:I;
F=F||0;
var J=50+(I*200),H=50*(5*F),G=200;
H=H==0?50:H;
return[f({point:[J,H]}),f({point:[J+G,H]}),f({point:[J+G,H+G]}),f({point:[J,H+G]})]
},rooms:function(G){var L=[],K=0,F=4,J;
if(G&&G instanceof Array){for(var I=0,H=G.length;
I<H;
I++){if(I!=0&&I%F==0){K+=1
}J=G[I];
L.unshift(e(h({name:J.label||J.name,id:J.id,devices:this.devices(J.devices),walls:this.generateWalls(I,K)})))
}return L
}else{return false
}},devices:function(L){if(L&&L instanceof Array){var I=[],J,K=22,M=0,F=0;
for(var H=0,G=L.length;
H<G;
H++){J=L[H];
I.push(m({id:J.id,location:[K+(22*F),K+(22*M)]}));
if((H+1)%4==0){M+=1;
F=0
}else{F++
}}return I
}}};
l.addRoom=function(I,G,K){var H=false,J=l.getNewRoom(I),F=DL.Spaces.Data.floorplan();
$.each(F,function(P,L){if(P==G){var O=F[P].rooms.length,M=l.getDefault.generateWalls(O,Math.floor(O/4));
if(DL.Spaces.Scaffold){if(DL.Spaces.Scaffold.bounds){var N=-99999;
_.each(l.floor(G).rooms,function(Q){_.each(Q.points,function(R){if(R[1]>N){N=R[1]
}})
});
if(l.floor(G).rooms.length===0){N=0
}M=l.getDefault.generateWalls(0,0);
_.each(M,function(Q){Q.point[1]+=N
})
}}H=true;
F[P].rooms.push(e(h({name:J.label||J.name,id:J.id,devices:[],walls:M})));
_floorPlan=F;
return false
}});
if(!H){l.addFloor(G,[J])
}if(K){K()
}};
l.addDevice=function(I,H,G,J){var F=DL.Spaces.Data.floorplan();
$.each(F,function(L,K){if(L==G){_.each(l.floor(G).rooms,function(N,M){if(N.id==H){var O=F[L].rooms[M].deviceLocations||{};
O[I]=[25,25]
}});
_floorPlan=F;
return false
}});
if(J){J()
}};
l.deleteDevice=function(I,H,G,J){var F=DL.Spaces.Data.floorplan();
$.each(F,function(L,K){if(L==G){_.each(l.floor(G).rooms,function(N,M){if(N.id==H){delete F[L].rooms[M].deviceLocations[I]
}});
_floorPlan=F;
return false
}});
if(J){J()
}};
l.getNewRoom=function(H){var G=0,F=DL.Spaces.BootLoader.possibleRooms.length;
for(;
G<F;
G++){var I=DL.Spaces.BootLoader.possibleRooms[G];
if(I.id==H){return I
}}return false
};
l.deleteRoom=function(I,H,J){var G=l.floorplan(),F=false;
$.each(G,function(L,K){if(F){return false
}else{if(H==L){$.each(K.rooms,function(M,N){if(N&&N.id==I){K.rooms.splice(M,1);
if(K.rooms.length<1&&!J){l.deleteFloor(L)
}F=true;
return false
}})
}}})
};
l.addFloor=function(G,H){var F=DL.Spaces.Data.floorplan();
F[G]=b({id:G,unitOfDistance:"meter",rooms:H?l.getDefault.rooms(H):[]})
};
l.getFloor=function(H){if(H){var I,G=0,F=DL.Spaces.BootLoader.possibleFloors.length;
for(;
G<F;
G++){var J=DL.Spaces.BootLoader.possibleFloors[G];
if(J.id==H){I=J
}}if(!I){I={label:"Unknown",id:"-1"}
}return I
}};
l.deleteFloor=function(G){if(G){var F=DL.Spaces.Data.floorplan();
for(id in F){if(id==G){delete F[id];
break
}}}};
l.getFloorName=function(H){if(H){var I,G=0,F=DL.Spaces.BootLoader.possibleFloors.length;
for(;
G<F;
G++){I=DL.Spaces.BootLoader.possibleFloors[G];
if(I.id==H){return I.label
}}return false
}};
l.getAllWithSelected=function(H){var F=[],I=H?_.keys(l.floorplan()):getAllSelectedRoomIds(),G=0,J=H?DL.Spaces.BootLoader.possibleFloors:DL.Spaces.BootLoader.possibleRooms;
function K(){var L=[];
$.each(l.floorPlan(floorId,floorObj),function(){})
}$.each(J,function(L,M){if(G<=I.length){$.each(I,function(N,O){if(O==M.id){M.selected="selected";
G++;
return false
}else{M.selected=""
}})
}else{M.selected=""
}F.push(M)
});
return F
};
var C=l.models.RoomOverview=v({label:"",id:""});
var x=l.models.FloorOverview=v({rooms:[],id:""});
var m=l.models.Device=v({id:"",location:[]});
var f=l.models.Wall=v({point:[],door:[],window:[]});
var h=l.models.RoomBase=v({name:"",id:"",devices:[],walls:[]});
var b=l.models.Floor=v({id:"",unitOfDistance:"meter",rooms:[]});
var u=l.models.MachineRule=v({name:"",from:"",to:""});
var q=l.models.MachineEvent=v({name:"",fn:t});
var A=l.models.Machine=v({initial:"",rules:[],events:[]});
var w=l.models.Pixel=v({xy:[],id:0,row:0,column:0,state:"none",display:"2d",room:-1,refs:[]});
var r=l.models.PointReference=v({roomIndex:false,pointIndex:false,detailIndex:false,xy:[],type:"none"});
var a=l.models.Overview=B(function(G){var F={};
F.add=function(I,H){F[I]=H;
return F
};
$.each(G,function(I,H){F.add(H.id,H.rooms)
});
return F
});
var g=l.models.Devices=B(function(F){var G={};
$.each(F,function(H,I){G[I.id]=I.location
});
return G
});
var e=l.models.Room=B(function(F){var G={name:F.name,id:F.id,deviceLocations:g(F.devices),points:[],doorLocations:[],windowLocations:[]};
_.each(F.walls,function(H,I){G.points.splice(I,0,H.point);
G.doorLocations.splice(I,0,H.door);
G.windowLocations.splice(I,0,H.window)
});
return G
});
var d=l.models.FloorData=B(function(G){var F={};
_.each(G,function(I,H){F[I.id]=b({unitOfDistance:I.unitOfDistance,id:I.id});
_.each(I.rooms,function(J){F[I.id].rooms.push(J)
})
});
return F
});
l.samples.floorOverview=a([x({id:"0002",rooms:[C({label:"Living Room",id:"002"}),C({label:"Breakfast Area",id:"006"}),C({label:"Dining Room",id:"004"})]}),x({id:"0003",rooms:[C({label:"Bedroom 1",id:"016"}),C({label:"Bedroom 2",id:"014"})]})])
})(DL.Spaces.Data);
if(!window.DL){var DL={}
}DL.Spaces=DL.Spaces||{};
DL.Spaces.DataSync={};
(function(b){var a=DL.Spaces.Data;
b.sync=function(o){b.deviceData=[];
b.roomData=[];
b.modifiedData=false;
b.modifiedFloor=false;
_.each(DL.Dashboard.groups.ROOM.toJSON(),function(q){if(!_.isUndefined(q.deviceIds)&&_.isObject(q.deviceIds)){_.each(q.deviceIds,function(v,s){var t=q.floor.id;
var u=q.location.room.id;
var r={device_id_loc:v+"_"+t+"_"+u,device_id:v,floor_id:t,room_id:u,floor_room_pair:t+"_"+u};
b.deviceData.push(r)
})
}});
var k=0;
_.each(DL.Spaces.BootLoader.roomFloorData,function(r,q){if(_.isObject(r.rooms)){_.each(r.rooms,function(s){if(_.isObject(s.deviceLocations)){_.each(s.deviceLocations,function(u,v){var t={device_id_loc:v+"_"+q+"_"+s.id,device_id:v,floor_id:q,room_id:s.id,floor_room_pair:q+"_"+s.id};
b.roomData.push(t);
k++
})
}})
}});
var n=["floor_id","floor_room_pair","device_id_loc"];
for(var l in n){var d=n[l];
var c=_.difference(_.uniq(_.pluck(b.roomData,d)),_.uniq(_.pluck(b.deviceData,d)));
if(c.length){for(var g in c){if(d=="floor_id"){a.deleteFloor(c[g]);
b.modifiedData=true;
DL.log("data sync -- removing floor",c[g])
}else{if(d=="floor_room_pair"){var f=c[g].split("_")[1];
var m=c[g].split("_")[0];
a.deleteRoom(m,f);
b.modifiedData=true;
DL.log("data sync -- removing room",m,f)
}else{var p=_.find(b.roomData,function(q){return q.device_id_loc==c[g]
});
a.deleteDevice(p.device_id,p.room_id,p.floor_id);
b.modifiedData=true;
DL.log("data sync -- removing device",p.device_id,p.floor_id,p.room_id)
}}b.roomData=_.reject(DL.Spaces.DataSync.roomData,function(q){return q[d]==c[g]
})
}}}var h=["floor_id","floor_room_pair","device_id_loc"];
for(var l in h){var d=h[l];
var e=_.difference(_.uniq(_.pluck(b.deviceData,d)),_.uniq(_.pluck(b.roomData,d)));
if(e.length){for(var g in e){b.roomData=_.reject(DL.Spaces.DataSync.roomData,function(q){return q[d]==e[g]
});
if(d=="floor_id"){a.addFloor(e[g]);
b.modifiedData=true;
b.modifiedFloor=e[g];
DL.log("data sync -- adding floor",e[g])
}else{if(d=="floor_room_pair"){var f=e[g].split("_")[1];
var m=e[g].split("_")[0];
a.addRoom(f,m);
b.modifiedData=true;
b.modifiedFloor=m;
DL.log("data sync -- adding room",f,m)
}else{var p=_.find(b.deviceData,function(q){return q.device_id_loc==e[g]
});
a.addDevice(p.device_id,p.room_id,p.floor_id);
b.modifiedData=true;
b.modifiedFloor=p.floor_id;
DL.log("data sync -- adding device",p.device_id,p.room_id,p.floor_id)
}}}}}a.setfloorplan($.extend(true,{},a.floorplan()));
a.setFloor(b.modifiedFloor);
if(o&&_.isFunction(o)){o()
}}
})(DL.Spaces.DataSync);
if(!window.DL){var DL={}
}DL.Spaces=DL.Spaces||{};
DL.Spaces.Validator={};
(function(b){var e=DL.Spaces.Data;
var d=DL.Spaces.Helpers;
var a=0;
var c=20;
b.validateFloorplan=function(o,k){Frame.perf("Validator.validateFloorplan","start");
o=o||function(){};
var l=k||e.floorplan();
var h=true;
var g=0;
if(_.keys(l).length<1){h=false;
g=1
}var f=function(p){return p.rooms&&p.rooms.length>0
};
if(!_.any(l,f)){h=false;
g=2
}var m=function(p){return !_.isArray(p.points)||!_.isArray(p.doorLocations)||!_.isArray(p.windowLocations)
};
var n=function(p){return _.any(p.rooms,m)
};
if(_.any(l,n)){h=false;
g=3
}if(h){h=b.validateRooms();
if(!h){DL.log("validator attempting to repair wireframe");
b.forceRightAngles();
h=b.validateRooms();
if(!h){g=4
}}}if(h){h=b.detectRoomOverlaps();
if(!h){g=5
}}if(!h){a++;
if(e.historyLength()>1&&a<15){DL.log("Data validation failed, trying to undo","failed at "+g,"number of attempts "+a);
e.revertHistory();
b.validateFloorplan(o)
}else{DL.log("Data validation failed, trying to rebuild","failed at "+g,"number of attempts "+a);
DL.Spaces.BootLoader.loadFromConfig(o)
}}else{a=0;
Frame.perf("Validator.validateFloorplan.callback","start");
o();
Frame.perf("Validator.validateFloorplan.callback","stop")
}Frame.perf("Validator.validateFloorplan","stop");
return h
};
b.forceRightAngles=function(f){Frame.perf("Validator.forceRightAngles","start");
var g=f||e.floorplan();
_.each(g,function(k,h){_.each(k.rooms,function(m,l){_.each(m.points,function(o,p){var q=m.points[p-1]||m.points[m.points.length-1];
var n=Math.abs(q[0]-o[0]);
var r=Math.abs(q[1]-o[1]);
if(n<r&&o[0]!==q[0]){DL.log("angle",n,r,d.json(o),d.json(q));
o[0]=q[0]
}else{if(n>=r&&o[1]!==q[1]){DL.log("angle",n,r,d.json(o),d.json(q));
o[1]=q[1]
}}})
})
});
Frame.perf("Validator.forceRightAngles","stop")
};
b.validateRooms=function(v){Frame.perf("Validator.validateRooms","start");
var x=v||e.floorplan();
var n=true;
var p=0;
var f=_.keys(x);
for(var y=0,o=f.length;
y<o;
y++){var r=x[f[y]];
if(!n){break
}for(var l=0,m=r.rooms.length;
l<m;
l++){var u=r.rooms[l];
if(!n){break
}if(u.points.length<3){n=false;
p=1;
break
}if(u.points.length!==u.windowLocations.length||u.points.length!==u.doorLocations.length){n=false;
p=2;
break
}for(var w=0,h=u.points.length;
w<h;
w++){var q=u.points[w];
var k=u.points[w-1]||u.points[u.points.length-1];
if(!q||!k){DL.log(q,k,w,d.json(u.points));
n=false;
p=3;
break
}var t=Math.abs(k[0]-q[0]);
var s=Math.abs(k[1]-q[1]);
if(t===s){u.points.splice(w,1);
u.doorLocations.splice(w,1);
u.windowLocations.splice(w,1);
h--
}if(t<s&&q[0]!==k[0]){n=false;
p=4;
DL.log(t,s,q,k,l,w,u);
break
}if(t>s&&q[1]!==k[1]){n=false;
p=5;
DL.log(t,s,q,k,l,w,u);
break
}if(q[0]<0||q[1]<0){if(!DL.Spaces.Scaffold){n=false;
p=6;
break
}else{var g=DL.Spaces.Scaffold.getFloorLimits(e);
g.min[0]=(g.min[0]<0)?-g.min[0]:0;
g.min[1]=(g.min[1]<0)?-g.min[1]:0;
e.moveAllPoints(g.min);
DL.Spaces.Scaffold.options.shift[0]-=g.min[0];
DL.Spaces.Scaffold.options.shift[1]-=g.min[1]
}}if(n){u.doorLocations=b.orderDetails(u.doorLocations);
u.windowLocations=b.orderDetails(u.windowLocations);
b.validateDetails(u,q,w)
}}if(n){n=b.validateDevices(u,l,r.id);
if(!n){p=8;
break
}}}}if(!n){DL.log("Room validation failed at "+p)
}Frame.perf("Validator.validateRooms","stop");
return n
};
b.detectRoomOverlaps=function(h){Frame.perf("Validator.detectRoomOverlaps","start");
var g=true;
var k=h||e.floorplan();
var f={};
_.each(k,function(m,l){f[l]=[];
_.each(m.rooms,function(r,q){var o=[];
var t=[];
var p=[];
var n=[];
_.each(r.points,function(u,v){t.push(u[0]);
p.push(u[1]);
var w=r.points[v+1]||r.points[0];
if(w[0]===u[0]){if(w[1]>u[1]){n.push([u,w])
}else{n.push([w,u])
}}});
t=_.sortBy(t,function(u){return u
});
t=_.uniq(t,true);
p=_.sortBy(p,function(u){return u
});
p=_.uniq(p,true);
var s=function(x,u){var w=true;
var v=p[u+1]||false;
if(v){_.each(t,function(y,B){var C=t[B+1]||false;
if(C){var D=[[y,x],[C,x],[C,v],[y,v]];
var A=function(E){if(E[0][0]===y){if(E[0][1]<=x&&E[1][1]>=v){return true
}}};
if(B===0&&!_.any(n,A)){w=!w
}if(w){o.push(D)
}var z=function(E){if(E[0][0]===C){if(E[0][1]<=x&&E[1][1]>=v){return true
}}};
if(_.any(n,z)){w=!w
}}})
}};
_.each(p,s);
f[l].push(o)
})
});
_.each(f,function(m,l){_.each(m,function(o,n){_.each(o,function(p,q){_.each(m,function(r,s){_.each(r,function(u,t){if(n!==s){if(p[0][0]<u[1][0]&&u[0][0]<p[1][0]){if(p[0][1]<u[2][1]&&u[0][1]<p[2][1]){DL.log("overlap",p,u,o,r,l,n);
g=false;
return false
}}}});
if(!g){return false
}});
if(!g){return false
}});
if(!g){return false
}});
if(!g){return false
}});
Frame.perf("Validator.detectRoomOverlaps","stop");
return g
};
b.orderDetails=function(f){_.each(f,function(h,g){h=_.sortBy(h,function(k){return k[0]
});
f[g]=h
});
return f
};
b.validateDetails=function(n,f,l){Frame.perf("Validator.validateDetails","start");
var k=(n.points[l+1])?l+1:0;
var h=n.points[k];
var m=(h[0]===f[0])?1:0;
var g=Math.abs(h[m]-f[m]);
var o=function(q){var p=false;
_.each(q[l],function(v,u){var y=v[0]-(v[1]/2);
var r=y+v[1];
var w=20;
if(!_.isUndefined(DL.Spaces.Scaffold)&&_.isFunction(DL.Spaces.Scaffold.margin)){w=DL.Spaces.Scaffold.margin()
}if(y<0){v[1]-=0-y
}if(v[1]<w*2){v[1]=w*2
}if(y===0&&r!==g){v[0]++
}if(r===g&&y!==0){v[1]--
}if(p){var t=p[0]-(p[1]/2);
var s=t+p[1];
if(s>y){p=[(r-t)/2,p[1]+v[1]-(s-y)];
q[l].splice(u,1)
}}if(v[0]-c>g){q[k].push([v[0]-g,v[1]]);
q[l].splice(u,1)
}var x=g-(w/2);
if(r>x){v[1]-=Math.abs(r-x)/2
}p=v
})
};
o(n.doorLocations);
o(n.windowLocations);
Frame.perf("Validator.validateDetails","stop")
};
b.validateDevices=function(k,h,f){Frame.perf("Validator.validateDevices","start");
var g=true;
_.each(k.deviceLocations,function(r,m){if(r[0]<0||r[1]<0){g=false;
return false
}var p=e.leftMost(h,f,k.points);
var s=[r[0]+p[0],r[1]+p[1]];
var q=false;
for(var o=0,n=k.points.length-1;
o<k.points.length;
n=o++){var t=k.points[o];
var l=k.points[n];
if(t[1]!==l[1]&&t[1]<s[1]){if((t[1]<s[1]&&l[1]>=s[1])||(t[1]>s[1]&&l[1]<=s[1])){q=!q
}}}if(!q){g=false;
return false
}});
Frame.perf("Validator.validateDevices","stop");
return g
}
})(DL.Spaces.Validator);
DL.Dashboard.Views.Spaces=Backbone.View.extend({pageTitle:"Spaces",pageHeadline:"View your entire system in one place by following these three simple steps.",template:DL.Dashboard.getTemplate("spaces/spacesLanding"),initialize:function(){$("#main")[0].className="";
if(!!!document.createElement("canvas").getContext){new DL.Dashboard.Views.IE8Spaces()
}else{if(true){new DL.Dashboard.Views.InterceptSpaces()
}else{var a=this;
DL.Dashboard.Main.loadingStart();
DL.Spaces.BootLoader.getRoomFloorData(function(){if(DL.Spaces.Data.getDefault.isLoadingDefault&&!DL.Dashboard.SpacesShared.inEditMode){a.render()
}else{setTimeout(function(){DL.Dashboard.app.navigate("spaces/customize",{trigger:true})
},DL.Spaces.Data.SPEED)
}})
}}},render:function(){var b=$("#main"),c=$("#app"),d=this.data||{},a=b.find(".headSection");
if(a.length){a.remove()
}b.attr("class","page-spaces").find(".wrapper").append($('<div class="headSection"><h1>'+this.pageTitle+"</h1><p>"+this.pageHeadline+"</p></div>"));
c.html($.tmpl(this.template,this.data));
DL.Dashboard.Main.loadingEnd()
}});
DL.Dashboard.Views.SpacesArrange=Backbone.View.extend({pageTitle:"Spaces",pageHeadline:"The rooms that contain your selected Devices are the building blocks of your floor plan. Add the rooms without Devices to complete your space.",template:DL.Dashboard.getTemplate("spaces/arrange"),initialize:function(){var a=this;
DL.Dashboard.Main.loadingStart();
DL.Spaces.BootLoader.getRoomFloorData(function(){DL.Dashboard.SpacesShared.translateRoomFloorConfig(DL.Spaces.Data.floorplan(),function(b){a.data=b;
if((DL.Spaces.Data.getDefault.isLoadingDefault&&!DL.Dashboard.SpacesShared.inEditMode)||DL.Dashboard.SpacesShared.inArrangeMode){a.render()
}else{setTimeout(function(){DL.Dashboard.app.navigate("spaces/customize",{trigger:true})
},DL.Spaces.Data.SPEED)
}})
})
},render:function(){DL.Dashboard.Main.abandonChangesModalBind();
var c=$(this.el),b=$("#main"),e=$("#app"),a=b.find(".headSection"),d=this;
if(a.length>0){a.remove()
}b.attr("class","page-spaces arrange").find(".wrapper").append($('<div class="headSection"><h1>'+this.pageTitle+"</h1><p>"+this.pageHeadline+"</p></div>"));
e.html(c.html($.tmpl(this.template,{})));
e.find(".createRoom").monobind("click",$.proxy(d.onclick_openCreateRoomModal,d));
e.find('a[href="#spaces/customize"]').monobind("click",$.proxy(d.onclick_customize,d));
this.renderFloorConfig()
},renderFloorConfig:function(){var a=$(this.el).find("#homeConfig");
new DL.Dashboard.Views.SpacesArrangeFloorConfig({data:this.data,context:a});
a.find(".delete").monobind("click",$.proxy(this.onclick_deleteRoom,this));
DL.Dashboard.SpacesShared.inArrangeMode=false;
DL.Dashboard.Main.loadingEnd()
},deleteRoom:function(d,b){var c=this,a=false;
$.each(this.data.floors,function(e,f){if(!a){if(f&&f.id==b){$.each(f.rooms,function(g,h){if(h&&h.id==d){f.rooms.splice(g,1);
if(f.rooms.length<1){c.data.floors.splice(e,1);
a=true;
return false
}}})
}}else{return false
}});
DL.Spaces.Data.deleteRoom(d,b);
this.renderFloorConfig()
},onclick_openCreateRoomModal:function(b){b.preventDefault();
var a=this;
DL.Dashboard.SpacesShared.openCreateRoomModal(function(k,e){var l=DL.Spaces.Data.getNewRoom(k),h=DL.Spaces.Data.getFloor(e),g=false;
DL.Dashboard.SpacesShared.roomModal.close();
l.name=l.label;
for(var d=0,c=a.data.floors.length;
d<c;
d++){var f=a.data.floors[d];
if(f.id==h.id){g=true;
f.rooms.push(l)
}}if(!g){a.data.floors.push({id:h.id,name:h.label,rooms:[l]})
}a.renderFloorConfig()
})
},onclick_deleteRoom:function(d){d.preventDefault();
var c=$(d.currentTarget),b=c.parents("li:first"),a=this;
b.fadeOut(250,function(){a.deleteRoom(b.attr("data-id"),b.parents(".floor:first").attr("data-floorid"));
b.remove()
})
},onclick_customize:function(a){a.preventDefault();
DL.Dashboard.Main.loadingStart();
DL.Dashboard.SpacesShared.inEditMode=true;
setTimeout(function(){DL.Dashboard.app.navigate("spaces/customize",{trigger:true})
},DL.Spaces.Data.SPEED)
}});
DL.Dashboard.Views.SpacesArrangeFloorConfig=Backbone.View.extend({template:DL.Dashboard.getTemplate("spaces/spacesArrangeFloorConfig"),initialize:function(){this.context=this.options.context;
this.data=this.options.data;
this.render()
},render:function(){this.context.removeData("jsp");
this.context.html($.tmpl(this.template,this.data));
this.context.jScrollPane({verticalGutter:30,verticalDragMaxHeight:40,autoReinitialise:true})
}});
DL.Dashboard.Views.SpacesCustomize=Backbone.View.extend({template:DL.Dashboard.getTemplate("spaces/customize"),events:{"click a.select":"selectFloor","click a.save":"save","click .toolPalette ul.buttons li:first":"undo","click .toolPalette ul.buttons li:last":"redo","mousedown .toolPalette ul.tools li":"toolbar","touchstart .toolPalette ul.tools li":"toolbar"},initialize:function(){var b=this;
function a(){b.Helpers=DL.Spaces.Helpers,b.Data=DL.Spaces.Data,b.Validator=DL.Spaces.Validator,b.Scaffold=DL.Spaces.Scaffold,b.Projector=DL.Spaces.Projector,b.Canvas=DL.Spaces.Canvas,b.Overlay=DL.Spaces.Overlay,b.Operators=DL.Spaces.Operators,b.Events=DL.Spaces.Events;
b.render()
}DL.Dashboard.Main.loadingStart();
DL.Spaces.BootLoader.getRoomFloorData(function(){a()
},true)
},render:function(){Frame.perf("Spaces.render","start");
var a=this;
a.mainContainer=$("#main");
a.createHTMLBase();
a.Data.initHistory();
a.Scaffold.init();
setTimeout(function(){if(!DL.Dashboard.SpacesShared.inEditMode&&!DL.Spaces.DataSync.modifiedData&&!DL.Spaces.Data.getDefault.isLoadingDefault){setTimeout(function(){DL.Dashboard.app.navigate("spaces/perspective",{trigger:true})
},DL.Spaces.Data.SPEED)
}else{a.pageContainer.find("a.cancel").unbind().bind("click",a.cancel);
a.Projector.init({display:"2d"});
a.Canvas.create(a.canvasContainer);
a.Canvas.addProjectionGrid();
a.Projector.project();
a.Canvas.render();
a.Overlay.create(a.overlayContainer);
a.Events.init(a.eventsContainer);
a.Events.drawMode();
a.Scaffold.init();
DL.Dashboard.Main.loadingEnd();
Frame.perf("Spaces.render","stop")
}},a.Data.SPEED)
},toolbar:function(c){var a=$(c.currentTarget),b=a.parent(),d=a.html().toLowerCase();
this.Helpers.preventDefault(c);
this.Operators.deselect();
b.children().removeClass("selected");
a.addClass("selected");
$(".toolCursor").remove();
switch(d){case"corner":this.Helpers.div(".spacesGrid",{"class":"cornerCursor toolCursor"},{},"Corner Cursor");
this.Events.cornerMove(c);
this.Events.cornerMode();
break;
case"door":this.Helpers.div(".spacesGrid",{"class":"doorCursor toolCursor"},{},"Door Cursor");
this.Events.doorMove(c);
this.Events.doorMode();
break;
case"window":this.Helpers.div(".spacesGrid",{"class":"windowCursor toolCursor"},{},"Window Cursor");
this.Events.windowMove(c);
this.Events.windowMode();
break;
case"room":this.onclick_openCreateRoomModal();
break
}},save:function(b){var a=this;
a.Helpers.preventDefault(b);
DL.Dashboard.Main.loadingStart();
DL.Dashboard.SpacesShared.inEditMode=false;
DL.Spaces.Data.getDefault.isLoadingDefault=false;
a.Data.put(function(){DL.Dashboard.app.navigate("spaces/perspective",{trigger:true})
});
DL.Dashboard.Main.abandonChangesModalUnbind()
},cancel:function(a){DL.Spaces.Helpers.preventDefault(a);
DL.Dashboard.Main.abandonChangesModal(function(b){if(DL.Spaces.Data.getDefault.isLoadingDefault){DL.Dashboard.SpacesShared.inArrangeMode=true;
DL.Dashboard.SpacesShared.inEditMode=true;
setTimeout(function(){DL.Dashboard.app.navigate("spaces/arrange",{trigger:true})
},DL.Spaces.Data.SPEED)
}else{DL.Dashboard.SpacesShared.inArrangeMode=false;
DL.Dashboard.SpacesShared.inEditMode=false;
DL.Spaces.Operators.updateWireframe(function(){setTimeout(function(){$("a.save").click()
},DL.Spaces.Data.SPEED)
})
}},function(b){})
},edit:function(a){DL.Dashboard.SpacesShared.inArrangeMode=false;
DL.Dashboard.SpacesShared.inEditMode=true;
DL.Spaces.Scaffold.zoomReset()
},undo:function(a){this.Helpers.preventDefault(a);
this.Operators.deselect();
this.Data.undoHistory();
this.Operators.updateDisplay(true)
},redo:function(a){this.Helpers.preventDefault(a);
this.Operators.deselect();
this.Data.redoHistory();
this.Operators.updateDisplay(true)
},selectFloor:function(d){var b=this,a=_.keys(b.Data.floorplan()),c={floors:[]};
this.Helpers.preventDefault(d);
$.each(a,function(e,f){c.floors.push(b.Data.getFloor(f))
});
this.selectFloorModal=new DL.Dashboard.ModalBase({template:"modals/spacesSelectFloor",data:c,customEvents:{"click .floorList a":function(g){g.preventDefault();
b.Data.resetHistory();
var f=$(g.target).attr("data-id");
b.selectFloorModal.close();
b.resetFloor(f)
},"click .add":function(f){f.preventDefault();
b.Data.resetHistory();
b.selectFloorModal.close();
b.addFloor()
}},afterOpen:function(e){$(".thinGreyScrollbar",e).jScrollPane({autoReinitialise:true,maintainPosition:false,verticalGutter:30,verticalDragMaxHeight:40});
if(DL.Dashboard.SpacesShared.inEditMode){$(".lowerNav",e).css("display","block")
}else{$(".lowerNav",e).css("display","none")
}}})
},resetFloor:function(a){Frame.perf("Spaces.resetFloor","start");
if(a){this.Data.setFloor(a);
this.mainContainer.find(".headSection h1").html(this.Data.floorName());
this.Operators.deselect();
this.Data.resetHistory();
this.Operators.updateDisplay(true)
}Frame.perf("Spaces.resetFloor","stop")
},addFloor:function(){var a=this,b={floors:this.Data.getAllWithSelected(true)};
this.addFloorModal=new DL.Dashboard.ModalBase({template:"modals/spacesAddFloor",data:b,customEvents:{"click .floorList a":function(f){f.preventDefault();
var d=$(f.target);
if(!d.hasClass("selected")){var c=d.attr("data-id");
a.addFloorModal.close();
a.resetFloor(c)
}}},afterOpen:function(c){$(".thinGreyScrollbar",c).jScrollPane({autoReinitialise:true,maintainPosition:false,verticalGutter:30,verticalDragMaxHeight:40})
}})
},createHTMLBase:function(){var a=this.mainContainer.find(".headSection"),b=this.Data.floorName();
if(!b||b=="false"){b="Other"
}this.el=$(this.el);
this.mainContainer.find(".headSection h1").html(b);
this.pageContainer=$("#app");
if(a.length){a.remove()
}this.mainContainer.attr("class","page-spaces customize").find(".wrapper").append($('<div class="headSection"><h1>'+b+"</h1></div>"));
this.pageContainer.html(this.el.html($.tmpl(this.template,{})));
this.mainContainer.find(".spacesTimeline").css({opacity:0,display:"none"});
this.pageContainer.find(".spacesCustomize .spacesPageWrap").css({"padding-bottom":"0"});
this.grid=this.mainContainer.find(".spacesGrid");
this.canvasContainer=this.Helpers.div(this.grid,{"class":"canvasContainer"});
this.overlayContainer=this.Helpers.div(this.grid,{"class":"overlayContainer"});
this.eventsContainer=this.Helpers.div(this.grid,{"class":"eventsContainer"},{},"<p>Events Layer</p>")
},onclick_openCreateRoomModal:function(){var a=this;
DL.Dashboard.SpacesShared.openCreateRoomModal(function(c,b){DL.Dashboard.SpacesShared.roomModal.close();
a.resetFloor(b);
a.Data.saveHistory()
})
}});
DL.Dashboard.Views.SpacesPerspective=DL.Dashboard.Views.SpacesCustomize.extend({template:DL.Dashboard.getTemplate("spaces/customize"),initialize:function(){var b=this;
function a(){b.Helpers=DL.Spaces.Helpers,b.Data=DL.Spaces.Data,b.Validator=DL.Spaces.Validator,b.Scaffold=DL.Spaces.Scaffold,b.Projector=DL.Spaces.Projector,b.Canvas=DL.Spaces.Canvas,b.Overlay=DL.Spaces.Overlay,b.Operators=DL.Spaces.Operators,b.Events=DL.Spaces.Events;
b.render()
}DL.Dashboard.Main.loadingStart();
DL.Spaces.BootLoader.getRoomFloorData(function(){a()
},true)
},render:function(){Frame.perf("Spaces.render","start");
var a=this;
a.mainContainer=$("#main");
a.createHTMLBase();
a.Data.initHistory();
a.Scaffold.init();
setTimeout(function(){var b=a.pageContainer.find(".spacesTimeline"),c=a.pageContainer.find(".spacesCustomize");
a.Projector.init({display:"3d"});
a.Canvas.create(a.canvasContainer);
a.Canvas.addProjectionGrid();
a.Events.init(a.eventsContainer);
DL.Dashboard.SpacesShared.inEditMode=false;
DL.Spaces.Data.getDefault.isLoadingDefault=false;
c.find("a.save").hide();
c.find("a.cancel").hide();
a.grid.addClass("spacesGrid3D");
a.grid.find(".toolPalette").hide();
a.Data.centerFloorplan();
a.Operators.updateWireframe(function(){DL.Spaces.Timeline.init(b);
a.Events.timelineMode(b);
a.mainContainer.find(".spacesTimeline").css({display:"block"}).animate({opacity:1},a.Data.SPEED,a.Data.EASE,function(){DL.Dashboard.Main.loadingEnd();
a.Canvas.startTransition(function(){a.Helpers.clearSelection();
a.Overlay.create(a.overlayContainer);
var d=c.find("a.cancel");
d.css("right",0).show().html("Edit");
d.unbind();
d.monobind("click",a.edit)
});
Frame.perf("Spaces.render","stop")
})
});
DL.Dashboard.Main.abandonChangesModalUnbind()
},a.Data.SPEED)
},edit:function(a){DL.Dashboard.SpacesShared.inArrangeMode=false;
DL.Dashboard.SpacesShared.inEditMode=true;
DL.Spaces.Scaffold.zoomReset()
}});
DL.Dashboard.Views.TimelineProgram=Backbone.View.extend({template:DL.Dashboard.getTemplate("spaces/timelineProgram"),initialize:function(){this.data=this.options.data;
this.location=this.options.location;
this.afterOpen=this.options.afterOpen;
this.context=$("#spacesWrap");
this.timeline=this.context.find(".timeline");
this.render()
},render:function(){var a=$(this.template);
this.modal=$('<div class="timeLineModal"></div>');
var b=$('<div class="timeLineScroller jspScrollable thinGreyScrollbar "></div>');
_.each(this.data,function(c){var d=$.tmpl(a,c);
b.append(d)
});
this.modal.append(b).css("left",this.location);
this.timeline.append(this.modal);
this.open()
},open:function(){var a=this;
this.modal.fadeIn(500,function(){});
if(_.isFunction(this.afterOpen)){$.proxy(this.afterOpen,this)()
}},close:function(){var a=this;
this.modal.fadeOut(500,function(){a.modal.remove()
})
},setPlacement:function(b){if(b){var a=this.context.find(".spacesTimeline").offset().left;
return((b-a)-(this.modal.width()/2))
}return 0
}});
DL.Dashboard.Views.TimelineTooltip=Backbone.View.extend({template:DL.Dashboard.getTemplate("spaces/timelineTooltip"),initialize:function(a){this.el=a.element;
this.data=a.data||{};
this.content=$.tmpl($(DL.Dashboard.getTemplate(a.content)),this.data)[0].outerHTML;
this.left=(!_.isUndefined(a.left))?a.left:0;
this.marginLeft=(!_.isUndefined(a.marginLeft))?a.marginLeft:0;
this.bottom=(!_.isUndefined(a.bottom))?a.bottom:0;
this.afterOpen=a.afterOpen;
this.afterClose=a.afterClose;
this.action=a.action;
this.width=a.width||null;
_.bindAll(this,"render","open","close");
if(a.bindClick){$(this.el).bind("click",this.render)
}if(a.open){this.render()
}},render:function(){this.modal=$.tmpl($(this.template),{content:this.content});
$(this.el).append(this.modal);
if(this.width){this.modal.css("width",this.width)
}this.modal.css("bottom",$(this.el).height()+5+Number(this.bottom));
this.modal.css("margin-left",-(this.modal.width()/2-$(this.el).width()/2)+Number(this.marginLeft));
this.modal.css("left",this.left);
var a=this.options.customEvents;
if(a){for(var c in a){var b=c.split(" ");
this.modal.find(b[1]).monobind(b[0],a[c])
}}this.open()
},open:function(){var a=this;
DL.Spaces.Timeline.events.closeAllModals();
a.modal.fadeIn(500,function(){});
$(a.el).unbind("click").bind("click",function(b){if(b.target===$(a.el)[0]){a.close()
}});
$(a.el).find(".tooltipClose").bind("click",a.close);
$.proxy(this.afterOpen,this)()
},close:function(){var a=this;
if(this.options.removeOnClose){this.modal.fadeOut(500,function(){a.modal.remove()
});
$(a.el).unbind("click")
}else{this.modal.fadeOut(500);
$(a.el).unbind("click").bind("click",function(b){if(b.target===$(a.el)[0]){a.open()
}})
}if(_.isFunction(this.afterClose)){$.proxy(this.afterClose,this)
}}});
DL.Dashboard.Views.IE8Spaces=Backbone.View.extend({template:DL.Dashboard.getTemplate("spaces/IE8Spaces"),initialize:function(){this.container=$("#app");
this.container.html("");
this.render()
},render:function(){this.modal=$.tmpl($(this.template));
this.container.append(this.modal);
DL.Dashboard.Main.loadingEnd();
DL.log("IE7/8 Version Loaded")
}});
DL.Dashboard.Views.InterceptSpaces=Backbone.View.extend({template:DL.Dashboard.getTemplate("spaces/interceptSpaces"),initialize:function(){this.container=$("#app");
this.container.html("");
this.render()
},render:function(){this.modal=$.tmpl($(this.template));
this.container.append(this.modal);
DL.Dashboard.Main.loadingEnd();
DL.log("Spaces Intercept Loaded")
}});
DL.Dashboard.Views.DevicesView=Backbone.View.extend({className:"deviceView",devicesPerColumn:3,columnsPerPage:3,initialize:function(){this.page=parseInt(this.options.page,10);
this.template=DL.Dashboard.getTemplate("devicesView");
this.groups=this.collection;
this.context=$("#main").attr("class","page-devices");
this.context.find(".wrapper").html("");
this.render()
},render:function(){var b=$(this.el),n=$('<div class="headSection"><h1>Devices</h1></div>'),m=$('<div class="controlView"><div class="controlText">Sort by</div><div class="toggleSm" data-quickhelp="Sort your devices according to room or type"><a class="first" href="#devices/room">ROOM</a><a class="second" href="#devices/type">TYPE</a></div></div>'),h=b.html($.tmpl($(this.template),{})),c=m.find(".first"),e=m.find(".second");
this.context.find(".wrapper").append(n.append(m));
$("#app").html(h);
this.deviceListWrap=b.find(".deviceListWrap");
for(i=0,j=this.groups.length;
i<j;
i++){var o=[],r=this.groups.models[i],q=r.get("label"),l=[],p=this;
function a(k){return k.get("deviceClassId")=="0206"?1.5:1
}function s(t,v,k){v=$(v);
var x=v.find(".deviceList"),w=0,u=p.devicesPerColumn;
p.deviceListWrap.append(v);
_.each(t,function(A){var z=a(A);
function y(){DL.Dashboard.devices.renderDeviceView(A,$(x[w]));
u-=z;
if(u<1){u=p.devicesPerColumn;
w++
}}if(u>=z&&u>0){y()
}else{u=p.devicesPerColumn;
w++;
y()
}});
if(k){k()
}}if(r.attributes.deviceIds.length){var g=0,f=0;
_.each(r.attributes.deviceIds,function(t){var k=DL.Dashboard.devices.get(t);
if(k!=="undefined"){l.push(k);
g+=a(k)
}});
g=Math.ceil(g/this.devicesPerColumn);
for(;
f<g;
f++){var d=f>0?" additional":"";
o.push('<li class="listContentBlock dl-col'+d+'"><div class="groupContainer">');
if(f===0){o.push("<h1>"+q+'</h1><ul class="deviceList"></ul>')
}else{o.push('<ul class="deviceList"></ul>')
}o.push("</div></li>")
}s(l,o.join(""),function(){var k=p.deviceListWrap.find(".listContentBlock"),t=DL.getFullWidth($(k[0]))*k.length;
p.deviceListWrap.css({width:t})
})
}}if(this.options.type=="room"){c.parents(".toggleSm:first").removeClass("toggleSmAlt");
c.addClass("active");
e.removeClass("active")
}else{e.parents(".toggleSm:first").addClass("toggleSmAlt");
e.addClass("active");
c.removeClass("active")
}this.setUpPagination(b)
},setUpPagination:function(b){var a=b.find(".dl-col");
if(a.length>this.columnsPerPage){new DL.Dashboard.Views.PaginationAdvanced({context:$("#app"),container:this.deviceListWrap,columnWidth:DL.getFullWidth($(a[0])),template:DL.Dashboard.getTemplate("controls/pagination"),elements:a.length,totalPages:Math.ceil(a.length/this.columnsPerPage),columnsPerPage:this.columnsPerPage})
}}});
DL.Dashboard.Views.Custom=Backbone.View.extend({className:"customView view-sample",initialize:function(){var a=this;
this.template=DL.Dashboard.getTemplate("customViewSample");
$("#main").attr("class","page-custom-view-sample");
this.model=this.options.model||new DL.Dashboard.Models.PageBase();
this.model.title="Add a Custom View";
this.model.headline="Create a time-saving custom view for at-a-glance monitoring of your home. Or group common features and functions for easy access.";
if(DL.Dashboard.groups.SAMPLE){this.model.views=DL.Dashboard.groups.SAMPLE;
this.render()
}else{$("#app").html("");
DL.Dashboard.Main.loadingStart();
DL.Dashboard.Main.Ajax(DL.Dashboard.getSampleCustomViews+DL.Dashboard.gwid+".json",function(f){if(f.responseMessage.content){var b=[],h,g,e,d,m,l;
for(m=0,e=f.responseMessage.content.length;
m<e;
m++){d=f.responseMessage.content[m],devices=[];
for(h=0,g=d.deviceIds.length;
h<g;
h++){l=d.deviceIds[h];
devices.push(DL.Dashboard.devices.getDeviceById(l))
}d.devices=devices;
d.id=m;
b.push(d)
}a.model.views=DL.Dashboard.groups.SAMPLE=b;
a.render();
DL.Dashboard.Main.loadingEnd()
}},null,{type:"GET"})
}},render:function(){var b=$(this.el),a=b.html($.tmpl($(this.template),this.model)),c='<div class="headSection"><h1>'+this.model.title+"</h1><p>"+this.model.headline+"</p></div>";
$("#hdrWrap").html(c);
$("#app").html(a);
$(".thinGreyScrollbar",b).jScrollPane({verticalDragMaxHeight:40});
b.find(".customGoToButton").bind("click",$.proxy(this.onclick_goToView,this));
if(this.options.afterRender&&typeof this.options.afterRender==="function"){this.options.afterRender()
}},onclick_goToView:function(c){c.preventDefault();
var a=$(c.currentTarget).parents(".col:first"),d=a.attr("data-id"),b=_.extend({},DL.Dashboard.groups.SAMPLE[d]);
b.id="";
new DL.Dashboard.Views.CustomViewEdit({model:new DL.Dashboard.Models.Group(b)})
}});
DL.Dashboard.Views.CustomView=Backbone.View.extend({className:"customView",template:"",initialize:function(){$("#main").attr("class","page-custom-view-display");
this.template=DL.Dashboard.getTemplate("customView");
this.context=$("#app");
this.basehref="#custom/view/";
this.showingDefault=this.options.isDefaultView||false;
this.render();
if(this.options.model){this.loadDevices(this.options.model.get("deviceIds"))
}},render:function(){if(this.showingDefault){new DL.Dashboard.Views.Custom({collection:DL.Dashboard.devices,model:this.options.model,afterRender:$.proxy(this.setupPagination,this)})
}else{if(DL.Dashboard.groups.CUSTOM.models.length){var a={customViewTitle:this.options.model.get("label"),customViewID:this.options.model.get("id")};
var b=$(this.el).html($.tmpl($(this.template),a));
this.context.html(b);
this.setupPagination()
}}return this
},loadDevices:function(r,m){var b=4,s=b-1,a=this.context.find(".devicesColumn"),d=function(w){return(DL.Dashboard.devices.getClassIdFromDevicesId(w)==="0206")
},t=_.filter(r,d),k=_.reject(r,d),f=t.length+k.length,v=[],l=DL.Dashboard.getTemplate("programs/program"),g=0,e=0,q=0,h=this.options.model.get("programIds"),p=this,n=false;
renderDevice=function(x){var w=DL.Dashboard.devices.renderDeviceView(x,a[g]);
if(w){g++;
if((h.length&&g==s)||g>=b){g=0
}}};
if(!r.length&&!h.length){var c=$("<div/>").addClass("customViewPlaceholderMessageContainer").html("<p>The Devices and/or Programs associated with this Custom View have been removed or are no longer available.</p>");
this.context.find(".customViewWrap").append(c);
return
}s=f<b?f:s;
_.each(t,function(w){renderDevice(w)
});
if(g){e=b-g;
q=1
}_.each(k,function(x){if(e){var w=DL.Dashboard.devices.renderDeviceView(x,a[g]);
if(w){if(q){q--
}else{e--;
g++;
q=1;
if(h.length&&g==s){g=q=e=0
}}}}else{renderDevice(x)
}});
if(h.length){var u=[];
var o=$(a[s]);
_.each(h,function(x){var w=DL.Dashboard.allSavedPrograms.getOne(x);
if(w){v.push(w);
u.push(x)
}});
p.options.model.set({addedPrograms:v});
if(v.length){_.each(v,function(x){var w=new DL.Dashboard.Views.Program({container:o,model:x,className:"device-section",isInCustomView:true})
})
}}},events:{"click .switchCustomView":"switchCustomView"},switchCustomView:function(){new DL.Dashboard.Views.CustomViewSwitch()
},setupPagination:function(){var b,a=DL.Dashboard.groups.CUSTOM.models.length,d=a+1,c=this.showingDefault?d:0,e=this.basehref,f=this.basehref;
if(this.showingDefault&&a<1){return
}if(this.showingDefault){c=d;
e="javascript:void(0)";
f+=DL.Dashboard.groups.CUSTOM.models.length?DL.Dashboard.groups.CUSTOM.models[d-2].get("id"):"javascript:void(0)"
}else{if(!this.showingDefault){for(b=0;
b<d;
b++){if(DL.Dashboard.groups.CUSTOM.models[b].get("id")==this.options.model.get("id")){c=b+1;
break
}}if(c==a){e+="defaultView"
}else{e+=DL.Dashboard.groups.CUSTOM.models[c].get("id")
}if(c==1){f="javascript:void(0)"
}else{f+=DL.Dashboard.groups.CUSTOM.models[c-2].get("id")
}}}new DL.Dashboard.Views.PaginationGeneric({container:this.context.find(".customView"),nexthref:e,prevhref:f,totalPages:d,currentPage:c})
}});
DL.Dashboard.Views.CustomViewNew=Backbone.View.extend({className:"custom",template:DL.Dashboard.getTemplate("customViewBase"),initialize:function(){this.title=this.options.title||"Enter Your Custom View Name";
this.addedDevices=this.options.devices||null;
this.tryingToSave=false;
this.devices=[];
this.placeholderMessage=$('<div class="customViewPlaceHolderMessage"><p>Drag the programs and devices you want to use in your view and drop them here.</p></div>');
this.context=$("#main").attr("class","page-custom-view-edit");
this.render()
},events:{"click .dvcDeleteBtn":"removeDevice"},render:function(){var a=$(this.el).html($.tmpl(this.template,{}));
$("#app").html(a);
this.$(".customViewPlaceholderMessageContainer").html(this.placeholderMessage);
this.afterRender()
},afterRender:function(){new DL.Dashboard.Views.CustomViewEditPanel({selector:".custom",title:this.title,customView:this});
if(this.addedDevices&&this.addedDevices.length){this.reflowDevices(this.addedDevices)
}},setUpDragDrop:function(){var a=this;
$(".editPanelGroup li .miniDvcPanel").each(function(){var b=this;
new draggable(b,a.dragStart,null,a.dragEnd,a.$(".customDrop"),a)
});
_.each(a.devices,function(b){$('li[data-id="'+b+'"]').addClass("inactive").data("dragged",true)
})
},setContainerHeight:function(){var a=$(".custom").height();
$(".customDelete").css({top:a})
},reflowDevices:function(e,b){var d=this;
e=e||this.devices;
b=b||this.$(".customDrop");
b.html("");
$(this.el).find(".customViewPlaceHolderMessage").remove();
var c=_.filter(e,function(f){return(DL.Dashboard.devices.getClassIdFromDevicesId(f)==="0206")
});
var a=_.reject(e,function(f){return(DL.Dashboard.devices.getClassIdFromDevicesId(f)==="0206")
});
_.each(c,function(f){d.addDevice(f);
DL.Dashboard.devices.renderDeviceView(f,b,true,true)
});
_.each(a,function(f){d.addDevice(f);
DL.Dashboard.devices.renderDeviceView(f,b,true,true)
});
this.setContainerHeight()
},addDevice:function(b){var a=_.find(this.devices,function(c){return c==b
});
if(!a){this.devices.unshift(b)
}},removeDevice:function(d){d.preventDefault();
d.stopPropagation();
var c=$(d.currentTarget),a=c.parents(".device-section"),b=a.attr("data-id");
a.remove();
$('.groupsContainer .editPanelGroup li[data-id="'+b+'"]').removeClass("inactive").data("dragged",false);
this.devices=_.reject(this.devices,function(e){return e==b
});
if(!this.devices.length){this.$(".customViewPlaceholderMessageContainer").html(this.placeholderMessage)
}this.setContainerHeight()
},dragEnd:function(b,c){var d=$(b.clonedElement).attr("data-id"),a=DL.Dashboard.devices.get(d);
c.addDevice(d);
c.reflowDevices();
$(b.clonedElement).remove()
},cancelCustomViewShowConfirm:function(c){var b=this,a=new DL.Dashboard.ModalBase({template:"customViewConfirm",data:{message:c?c:"Are you sure you want to cancel? You will lose all unsaved changes.",title:"Are you sure?",classToAdd:"verifying"},customEvents:{"click .yes":function(d){d.preventDefault();
a.close();
window.location.hash="#custom"
}}})
},customViewErrorModal:function(a,b){new DL.Dashboard.ModalBase({template:"customViewError",data:{message:a?a:"There was an error processing your request. Please try again later.[CV1]",title:b?b:"Error.",classToAdd:"verifying"}})
},saveCustomView:function(){var b=this.model.get("programIds"),a=b?b:[],d=$(".customViewTitle").val();
if(this.tryingToSave){return
}if(this.devices.length==0&&a.length<1){this.customViewErrorModal("A Custom View needs to have at least one Device or one Program before you can continue.","ERROR");
return
}if(this.nameAlreadyExists(d)){this.customViewErrorModal("You have an existing Custom View with this name. Please use a different name.","ERROR");
return
}var c={label:d,deviceIds:this.devices.join(",")};
if(a.length){c.programIds=a.join(",")
}this.putDataToServer(c)
},cancelCustomView:function(){this.cancelCustomViewShowConfirm()
},nameAlreadyExists:function(c){var d=false,b=this.options.model.get("label")||"",a=this.options.model.attributes.id;
c=c.toLowerCase();
if(c==b.toLowerCase()){if(a&&a.length){return false
}}DL.Dashboard.groups.CUSTOM.each(function(e){if(e.get("label").toLowerCase()==c){d=true
}});
return d
},putDataToServer:function(b){var a=DL.Dashboard.restURLs.updateCustomDeviceGroup+DL.Dashboard.gwid+"/"+this.model.get("id")+".json",e=this,c=false,d={label:$(".customViewTitle").val(),deviceIds:e.devices};
if(_.isEmpty(this.model.get("id"))){c=true;
a=DL.Dashboard.restURLs.createCustomDeviceGroup+DL.Dashboard.gwid+".json"
}this.tryingToSave=true;
DL.Dashboard.Main.Ajax({url:a,data:b,type:"POST"}).done(function(g,h,f){if(!g.responseMessage||g.responseMessage.code!="0"){e.customViewErrorModal("There was an error processing your request. Please try again later. [CV1]","Error")
}else{if(c){var k=g.responseMessage.content;
k.deviceIds=e.devices;
DL.Dashboard.groups.CUSTOM.add(k)
}else{e.model.set(d,{silent:true})
}window.location.hash="#custom/view/"+g.responseMessage.content.id
}}).fail(function(g,h,f){e.customViewErrorModal("There was an error processing your request. Please try again later.[CV1]","Error")
}).always(function(g,h,f){e.tryingToSave=false
})
}});
DL.Dashboard.Views.CustomViewEdit=DL.Dashboard.Views.CustomViewNew.extend({afterRender:function(){var a=$(this.el);
this.loadDevices(this.options.model.get("deviceIds"));
new DL.Dashboard.Views.CustomViewEditPanel({selector:".custom",customView:this});
a.addClass("editing").find(".customViewTitle").val(this.options.model.get("label"))
},loadDevices:function(g){var f=this,e=DL.Dashboard.getTemplate("programs/program"),a=this.options.model.get("programIds"),c=$(".customDrop"),b=$(".customDropPrograms ul");
function d(k,h){if(k){_.each(k,function(m){var l=new DL.Dashboard.Views.Program({container:b,model:m,className:"device-section"})
});
f.options.model.set({addedPrograms:k},{silent:true})
}else{k=[];
_.each(DL.Dashboard.allSavedPrograms.models,function(l){if(_.indexOf(a,l.id.toString())>-1){k.push(l)
}});
d(k,true)
}}this.savedPrograms=a;
$(this.el).find(".customViewPlaceHolderMessage").remove();
this.reflowDevices(g);
d(this.options.model.get("addedPrograms"))
},cancelCustomView:function(c){var b=this,a=new DL.Dashboard.ModalBase({template:"customViewConfirm",data:{message:c?c:"Are you sure you want to cancel? You will lose all unsaved changes.",title:"Confirm Cancel",classToAdd:"verifying"},customEvents:{"click .yes":function(d){d.preventDefault();
b.options.model.set({addedPrograms:null});
b.options.model.set({programIds:b.savedPrograms});
a.close();
window.location.hash="#custom/view/"+b.options.model.get("id")
}}})
},customViewDeleteHandler:function(){var a=this;
return function(){a.customViewDelete()
}
},customViewDelete:function(){var a=DL.Dashboard.restURLs.deleteCustomDeviceGroup+DL.Dashboard.gwid+"/"+this.options.model.get("id")+".json",b=this;
this.tryingToSave=true;
DL.Dashboard.Main.Ajax({url:a,type:"POST"}).done(function(d,g,c){if(!d.responseMessage||d.responseMessage.code!="0"){new DL.Dashboard.Views.CustomViewError({errorTitle:"GATEWAY ERROR",errorMessage:d.responseMessage.message})
}else{for(var f=0,e=DL.Dashboard.groups.CUSTOM.models.length;
f<e;
f++){if(DL.Dashboard.groups.CUSTOM.models[f].id==b.options.model.id){DL.Dashboard.groups.CUSTOM.models.splice(f,1);
break
}}window.location.hash="#custom"
}}).fail(function(d,e,c){new DL.Dashboard.Views.CustomViewError({errorTitle:"REQUEST ERROR",errorMessage:"The Custom View cannot be saved. Please try again."})
}).always(function(d,e,c){b.tryingToSave=false
})
}});
DL.Dashboard.Views.CustomViewEditPanel=Backbone.View.extend({className:"customViewEditPanel",data:{},initialize:function(){this.defaultTitleText="Enter Your Custom View Name";
this.template=DL.Dashboard.getTemplate("customViewEditPanel");
this.data.title=this.options.title||this.defaultTitleText;
this.selector=this.options.selector||".custom";
this.customView=this.options.customView;
this.render()
},render:function(){var a=$(this.el).html($.tmpl($(this.template),this.data));
$(this.selector).append(a);
this.programsListView=new DL.Dashboard.Views.CustomViewEditProgramsList({customView:this.customView,dropTarget:$(".customDropPrograms ul")});
this.showDevices();
$(".customDropPrograms").jScrollPane({autoReinitialise:true,showArrows:true,verticalDragMaxHeight:40})
},events:{"click .showDevices ":"showDevices","click .showPrograms ":"showPrograms","click .showDevicesByRoom ":"showDevicesByRoom","click .showDevicesByType ":"showDevicesByType","click .customDelete":"deleteCustomView","click .customSave":"save","click .customCancel":"cancel","focus .customViewTitle":"onfocus_title"},showDevices:function(){var a=$(".customDrop").parent().height();
if(this.currentlyShowing!="devicesByRoom"&&this.currentlyShowing!="devicesByType"){this.showDevicesByRoom()
}$(".customViewEditPanelButtonsSmall").css("visibility","visible");
$(this.el).removeClass("displayingPrograms");
$(".customDrop").animate({left:0});
$(".customDropPrograms").animate({right:-2});
$(".customDelete").css({top:a})
},showPrograms:function(){var a=$(".customDropPrograms");
this.currentlyShowing="programs";
$(this.el).addClass("displayingPrograms");
$(".customViewEditPanelButtonsSmall").css("visibility","hidden");
$(".customDrop").animate({left:-245});
a.animate({right:242});
this.programsListView.render()
},showDevicesByRoom:function(){DL.QuickHelp.create();
this.currentlyShowing="devicesByRoom";
new DL.Dashboard.Views.CustomViewEditDevicesList({showBy:"ROOM"});
$(this.el).removeClass("displayingByType");
this.customView.setUpDragDrop()
},showDevicesByType:function(){DL.QuickHelp.create();
this.currentlyShowing="devicesByType";
new DL.Dashboard.Views.CustomViewEditDevicesList({showBy:"TYPE"});
$(this.el).addClass("displayingByType");
this.customView.setUpDragDrop()
},deleteCustomView:function(){var b=this;
var c=$(this.el).find(".customViewTitle").val(),a=new DL.Dashboard.ModalBase({template:"customViewConfirm",data:{message:"Are you sure you want to delete "+c+"?",title:"Delete Custom View Confirmation",classToAdd:"verifying"},customEvents:{"click .yes":function(d){d.preventDefault();
a.close();
b.customView.customViewDelete()
}}})
},save:function(){var b=$(".customViewTitle",".custom");
if(b.val()!==this.defaultTitleText){this.customView.saveCustomView()
}else{var c=$(this.el).find(".customViewTitle").val(),a=new DL.Dashboard.ModalBase({template:"customViewError",data:{message:"You must provide a name for the Custom View.",title:"Create Custom View"}})
}},cancel:function(){this.customView.cancelCustomView()
},onfocus_title:function(c){var b=$(c.currentTarget),a=b.val();
function d(){if(b.val()===""){b.val(a)
}}b.val("");
b.monobind("blur",d)
}});
DL.Dashboard.Views.MiniDevice=Backbone.View.extend({initialize:function(){this.model=this.options.model;
this.containerSelector=this.options.containerSelector;
this.label=this.model.attributes.label;
this.template=DL.Dashboard.getTemplate("miniDevice");
this.render()
},render:function(){var a=$.tmpl($(this.template),this.model.toJSON());
$(this.containerSelector).append(a);
return this
}});
DL.Dashboard.Views.MiniProgramCustomView=Backbone.View.extend({initialize:function(){this.template=DL.Dashboard.getTemplate("miniProgramCustomView");
this.render()
},render:function(){var a=this.model.toJSON();
a.isInCustomView=false;
this.mini=$.tmpl($(this.template),a);
$(this.options.containerSelector).append(this.mini);
new draggable(this.mini,$.proxy(this.dragStartProgramTile,this),null,$.proxy(this.dragEndProgramTile,this),this.options.dropTarget,this);
if(this.options.inactive){this.mini.addClass("inactive").data("dragged",true)
}},dragStartProgramTile:function(b,a){},dragEndProgramTile:function(d,b){var f=this.model.toJSON();
f.isInCustomView=false;
var c=DL.Dashboard.getTemplate("programs/program"),e=$("<li/>").append($.tmpl($(c),f)),a=this.options.customView.model.get("programIds")||[];
a.push(e.find(".dvcContainer").attr("id"));
$(d.clonedElement).remove();
this.options.dropTarget.append(e);
this.options.customView.model.set({programIds:a},{silent:true});
e.find(".dvcDeleteBtn").bind("click",$.proxy(this.options.editPanel.onclick_delete,this.options.editPanel))
}});
DL.Dashboard.Views.CustomViewEditDevicesList=Backbone.View.extend({className:"customViewEditDevicesList",template:"",initialize:function(){this.template=DL.Dashboard.getTemplate("customViewEditDevicesList");
this.customView=this.options.customView;
this.render();
_.each(DL.Dashboard.groups[this.options.showBy].models,function(a){if(a.get("deviceIds").length){new DL.Dashboard.Views.CustomViewEditPanelDeviceListGroup({deviceIds:a.get("deviceIds"),label:a.get("label")})
}});
$(".thinGreyScrollbar",this.el).jScrollPane({showArrows:true,verticalDragMaxHeight:40})
},render:function(){var a=$(this.el).html($.tmpl($(this.template),{type:this.options.showBy}));
$(".customViewEditPanelList").html(a);
return this
}});
DL.Dashboard.Views.CustomViewEditProgramsList=Backbone.View.extend({className:"customViewEditProgramsList",template:"",initialize:function(){this.template=DL.Dashboard.getTemplate("customViewEditProgramsList");
var a=this;
$(".editPanelGroup").html("<li>Loading programs...</li>");
if($(".customViewEditPanel").hasClass("displayingPrograms")){a.render()
}},render:function(){function b(h){var g=[];
_.each(h,function(k){g.push(parseInt($(k).attr("data-program-id"),10))
});
return g
}function c(k){k=k.toString();
var h=false,g=e.options.customView.model.get("programIds");
if(_.indexOf(g,k)>-1||_.indexOf(f,k)>-1){h=true
}return h
}var a=$(this.el).html($.tmpl($(this.template),{})),d=$(".editPanelGroup",this.el),f=b(this.options.dropTarget.find("li")),e=this;
$(".customViewEditPanelList").html(a);
d.empty();
_.each(DL.Dashboard.allSavedPrograms.models,function(g){new DL.Dashboard.Views.MiniProgramCustomView({containerSelector:d,model:g,editPanel:e,customView:e.options.customView,dropTarget:e.options.dropTarget,inactive:c(g.id)})
});
$(".customDropPrograms .dvcDeleteBtn").bind("click",$.proxy(this.onclick_delete,this));
$(".thinGreyScrollbar",this.el).jScrollPane({showArrows:true,verticalDragMaxHeight:40,verticalDragMinHeight:40,autoReinitialize:true})
},onclick_delete:function(c){var b=$(c.currentTarget).parents("li:first"),d=b.find(".dvcContainer").attr("data-program-id"),a=this.options.customView.model.get("programIds"),f=this;
a=_.without(a,d);
b.fadeOut(function(){b.remove();
f.options.customView.model.set({programIds:a});
f.options.inactive=false;
f.render()
})
}});
DL.Dashboard.Views.CustomViewEditPanelDeviceListGroup=Backbone.View.extend({className:"customViewEditPanelDeviceListGroup",template:"",initialize:function(){var a=this;
this.template=DL.Dashboard.getTemplate("customViewEditDevicesGroup");
this.render();
_.each(this.options.deviceIds,function(c){var b=DL.Dashboard.devices.get(c);
if(b){new DL.Dashboard.Views.MiniDevice({containerSelector:$(a.el).find(".editPanelGroup"),model:b})
}})
},render:function(){var a=$(this.el).html($.tmpl($(this.template),{groupTitle:this.options.label}));
$(".groupsContainer").append(a);
return this
}});
DL.Dashboard.Views.CustomViewConfirmDelete=Backbone.View.extend({className:"customViewConfirmDelete",template:"",initialize:function(){this.customView=this.options.customView;
this.render()
},render:function(){var a=new DL.Dashboard.ModalBase({template:"customViewError",data:{title:"Verifying +",classToAdd:"verifying ="}});
out.appendTo("body");
return this
},events:{"click .deleteModalAcceptButton":"accept","click .deleteModalCloseButton":"cancel"},accept:function(){this.closeModal();
if(typeof this.options.accept=="function"){this.options.accept()
}},cancel:function(){this.closeModal();
if(typeof this.options.cancel=="function"){this.options.cancel()
}},closeModal:function(){$(this.el).dialog("destroy").remove()
}});
DL.Dashboard.Views.CustomViewError=Backbone.View.extend({className:"customViewError",template:"",initialize:function(){this.template=DL.Dashboard.getTemplate("customViewError");
this.customView=this.options.customView;
this.render()
},render:function(){var a={errorTitle:this.options.errorTitle,errorMessage:this.options.errorMessage};
var b=$(this.el).html($.tmpl($(this.template),a));
b.appendTo("body");
DL.Common.showModal($(".homeModal",this.el),$(".modalOverlay",this.el));
return this
},events:{"click .homeModalCloseButton":"close"},close:function(){this.closeModal()
},closeModal:function(){$(this.el).dialog("destroy").remove()
}});
DL.Dashboard.Views.CustomViewSwitch=Backbone.View.extend({className:"customViewSwitch",template:"",initialize:function(){this.template=DL.Dashboard.getTemplate("customViewSwitch");
this.options.views=this.getAvailableCustomViews();
this.render()
},render:function(){var a=$(this.el).html($.tmpl($(this.template),{views:this.options.views}));
a.appendTo("body");
DL.Common.showModal($(".homeModal",this.el),$(".modalOverlay",this.el));
$(".thinGreyScrollbar",this.el).jScrollPane({showArrows:true,verticalDragMaxHeight:40});
return this
},events:{"click li":"selectItem","click .homeModalCloseButton":"closeView","click .createNew a":"goToCreateNew"},selectItem:function(b){var a=$(b.target).find(".viewCode").html();
this.closeView();
window.location.hash="#custom/view/"+a
},closeView:function(a){$(this.el).remove()
},getAvailableCustomViews:function(){var a={};
DL.Dashboard.groups.CUSTOM.each(function(b){if(b){a[b.get("id")]=b.get("label")
}});
return a
},goToCreateNew:function(){this.closeView();
window.location.hash="#custom/new"
}});
DL.Dashboard.Views.ProgramView=Backbone.View.extend({className:"device-section",initialize:function(a){this.template=DL.Dashboard.getTemplate("programs/programsHome");
this.containerSelector=this.options.containerSelector||"#app";
this.render()
},events:{},render:function(){var a=$(this.el).html($.tmpl($(this.template),this.options.model));
$(this.containerSelector).append(a);
return this
},updated:function(){$(this.el).css("webkitAnimationName","pulse")
},remove:function(a){var b=$(a.target);
b.parent.parent.remove()
}});
DL.Dashboard.Views.SessionTimeout=Backbone.View.extend({className:"",template:"",initialize:function(){this.template=DL.Dashboard.getTemplate("sessionTimeout");
this.render()
},render:function(){var a=$(this.el).html($.tmpl($(this.template),{}));
$("body").append(a);
this.setLoginLinkUrl();
this.startCountdown();
DL.Common.showModal($(this.el).find(".sessionTimeout"),null);
return this
},setLoginLinkUrl:function(){$(this.el).find(".sessionTimeout a").attr("href",this.getLoginURLWithTimeoutMessage())
},startCountdown:function(){var b=5,c=this,a;
$(c.el).find(".timeoutSeconds").html(b);
a=setInterval(function(){$(c.el).find(".timeoutSeconds").html(--b);
if(b==0){$(c.el).find(".timeoutMessage").html("Redirecting to Log In...");
clearInterval(a);
window.location.href=c.getLoginURLWithTimeoutMessage();
$(c.el).find(".sessionTimeout a").remove()
}},1000)
},getLoginURLWithTimeoutMessage:function(){return DL.ServerSecurePath+DL.ContextUrl+"/login.html"
}});
DL.Dashboard.Views.IdeaTank=Backbone.View.extend({className:"ideaTank",template:"",data:{},initialize:function(){var b=this,a=DL.Dashboard.getIdeaTank+DL.Dashboard.gwid+".json";
this.context=$("#container .ideaTank");
b.template=DL.Dashboard.getTemplate("modals/ideaTank");
DL.Dashboard.Main.Ajax(a,function(c){if(c.responseMessage.content&&c.responseMessage.code!="-1"){$.extend(b.data,c.responseMessage.content);
b.data.title=c.responseMessage.content.title;
b.data.description=c.responseMessage.content.description;
b.data.topics=c.responseMessage.content.topics;
b.render()
}},null,{type:"GET"})
},render:function(){var d=$.tmpl($(this.template),this.data);
this.context.append(d);
var c=this.context.find(".panel"),a=$(c[1]),f=c.length,e=this.context.find(".panels"),b=f-1;
if(f>2){this.context.find(".scroll.r").show()
}this.context.find(".scroll").monobind("click",$.proxy(this.onclick_scroll,this));
e.width((a.outerWidth()+parseInt(a.css("margin-left")+a.css("margin-right"),10))*f);
$(".topSection .userControls .userMsg span").html(b);
this.context.find(".close").monobind("click",$.proxy(this.onclick_close,this))
},advance:function(f){var d=this;
if(!d.isScrolling){d.isScrolling=true;
var c=this.context.find(".wrap"),e=c.find(".panels"),b=e.width(),g=e.find(".panel").outerWidth(true);
if(f=="left"){var a="+="+g
}else{a="-="+g
}e.animate({left:a},500,function(){var k=e.position(),h=Math.abs(k.left),l=b-h;
if(k.left<0){c.find(".scroll.l").fadeIn(100)
}else{c.find(".scroll.l").fadeOut(100)
}if(l==g*2){c.find(".scroll.r").fadeOut(100)
}else{c.find(".scroll.r").fadeIn(100)
}d.isScrolling=false
})
}},onclick_scroll:function(a){a.preventDefault();
this.advance($(a.currentTarget).data("direction"))
},onclick_close:function(b){b.preventDefault();
var a=$("#container .ideaTank");
this.context.find(".wrap").slideUp(function(){a.hide();
a.siblings(".topSection").find(".userControls .userMsg").removeClass("active");
a.data("open",false)
})
}});
DL.Dashboard.Views.PinPad=Backbone.View.extend({className:"pin-pad",initialize:function(){this.render()
},render:function(){this.pad=new DL.Dashboard.ModalBase({template:"modals/pinPad",afterClose:function(){var a=$("#statusAlarms").find(".progress");
if(a){a.remove()
}}});
this.pad.modalContent.find(".pinButton").monobind("click",$.proxy(this.pinButton_click,this));
this.pad.modalContent.find("#pinButtonBack").monobind("click",$.proxy(this.pinButtonBack_click,this));
this.pad.modalContent.find("#pinButtonSubmit").monobind("click",$.proxy(this.pinButtonSubmit_click,this));
this.pad.modalContent.find("#pinInput").focus().monobind("keydown",$.proxy(this.pinInput_keydown,this))
},close:function(){this.pad.close()
},pinButton_click:function(d){d.preventDefault();
var c=d.target.id.match(/pinButton(\d)/),b=$("#pinInput",this.pad.modalContent);
if(c){if(b.val().length<4){var a=c[1];
b.val(b.val()+a)
}b.focus();
this.hideErrors()
}},pinButtonBack_click:function(c){c.preventDefault();
var a=$("#pinInput",this.pad.modalContent),b=a.val();
this.hideErrors();
b=b.substr(0,b.length-1);
a.val(b);
a.focus()
},pinButtonSubmit_click:function(b){b.preventDefault();
var a=$("#pinInput",this.pad.modalContent).val();
if(this.validatePin(a)){if(typeof this.callback==="function"){this.callback(a)
}}},pinInput_keydown:function(a){if((a.which<48||a.which>57)&&(a.which<96||a.which>105)&&a.which!=8&&a.which!=46){a.preventDefault()
}this.hideErrors()
},validatePin:function(a){if(a==""){this.displayError("Enter the PIN number");
return false
}if(!/\d\d\d\d/.test(a)){this.displayError("PIN number must be 4 digits");
return false
}return true
},displayError:function(a){$(".pinError",this.pad.modalContent).html(a).show()
},hideErrors:function(){$(".pinError",this.pad.modalContent).hide()
},setSumbitHandler:function(a){this.callback=a
}});
var DL=window.DL||{};
function populateContacts(c){var g=$("#manageFrame"),b=g.contents(),d=b.find(".secondary, .additional"),a=0,f=0,e=b.find(".importContacts");
d.each(function(m){var o=$(this),n=o.find(".firstName"),l=o.find(".lastName"),k=o.find(".phoneField"),h=c[a];
if(n.val()==""&&l.val()==""&&k.val()==""&&h){n.val(h.firstName);
l.val(h.lastName);
k.val(h.phoneNumber);
o.find(".input-wrap.info .input-hint").css({display:"none"});
a++
}});
d.each(function(l){var n=$(this),m=n.find(".firstName"),k=n.find(".lastName"),h=n.find(".phoneField");
if(m.val()==""&&k.val()==""&&h.val()==""){f++
}});
if(f){e.css({display:"inline-block"})
}else{e.css({display:"none"})
}}DL.ManageAccount=(function(a){var c={},b=null;
c.initMenu=function(f,e){var d=a(".webView .tablet");
b=e[0];
f.find("li a").bind("click",c.onclick_menuItem);
if(d){d.find("#manageFrame").addClass("isTablet")
}};
c.onclick_menuItem=function(l){l.preventDefault();
l.stopPropagation();
var m=a(l.currentTarget),g=m.attr("href"),n=m.parent().find(".subnav"),o=m.parents(".inModalNavigation:first"),f=o.find(".subnav"),p=o.find("a");
function d(){for(var q=0,e=p.length;
q<e;
q++){a(p[q]).removeClass("active open")
}}function k(){for(var q=0,e=f.length;
q<e;
q++){a(f[q]).slideUp()
}}if(m.attr("data-goto")&&n.length>0){if(!m.hasClass("open")){d();
k();
var h=n.find("a:first");
n.slideDown(function(){g=h.attr("href");
m.addClass("open");
h.addClass("active");
if(g!="#"){b.src=g+"#data-received"
}})
}}else{if(g!="#"){if(m.parents(".subnav:first").length<1){k()
}d();
m.addClass("active");
m.parents(".subnav:first").siblings("a[data-goto]").addClass("open");
b.src=g
}}};
c.initMenu(a(".inModalNavigation"),a("#manageFrame"));
return c
})(jQuery);