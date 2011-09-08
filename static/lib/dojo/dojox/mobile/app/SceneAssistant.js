/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/

//>>built
define("dojox/mobile/app/SceneAssistant",["dojo","dijit","dojox"],function(_1,_2,_3){
_1.getObject("dojox.mobile.app.SceneAssistant",1);
_1.experimental("dojox.mobile.app.SceneAssistant");
_1.declare("dojox.mobile.app.SceneAssistant",null,{constructor:function(){
},setup:function(){
},activate:function(_4){
},deactivate:function(){
},destroy:function(){
var _5=_1.query("> [widgetId]",this.containerNode).map(_2.byNode);
_1.forEach(_5,function(_6){
_6.destroyRecursive();
});
this.disconnect();
},connect:function(_7,_8,_9){
if(!this._connects){
this._connects=[];
}
this._connects.push(_1.connect(_7,_8,_9));
},disconnect:function(){
_1.forEach(this._connects,_1.disconnect);
this._connects=[];
}});
return _1.getObject("dojox.mobile.app.SceneAssistant");
});
require(["dojox/mobile/app/SceneAssistant"]);
