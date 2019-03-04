/*
	Copyright (c) 2004-2016, The JS Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/

//>>built
define("dojo/request/xhr",["../errors/RequestError","./watch","./handlers","./util","../has"],function(_1,_2,_3,_4,_5){
_5.add("native-xhr",function(){
return typeof XMLHttpRequest!=="undefined";
});
_5.add("dojo-force-activex-xhr",function(){
return _5("activex")&&window.location.protocol==="file:";
});
_5.add("native-xhr2",function(){
if(!_5("native-xhr")||_5("dojo-force-activex-xhr")){
return;
}
var x=new XMLHttpRequest();
return typeof x["addEventListener"]!=="undefined"&&(typeof opera==="undefined"||typeof x["upload"]!=="undefined");
});
_5.add("native-formdata",function(){
return typeof FormData!=="undefined";
});
_5.add("native-response-type",function(){
return _5("native-xhr")&&typeof new XMLHttpRequest().responseType!=="undefined";
});
_5.add("native-xhr2-blob",function(){
if(!_5("native-response-type")){
return;
}
var x=new XMLHttpRequest();
x.open("GET","https://dojotoolkit.org/",true);
x.responseType="blob";
var _6=x.responseType;
x.abort();
return _6==="blob";
});
var _7={"blob":_5("native-xhr2-blob")?"blob":"arraybuffer","document":"document","arraybuffer":"arraybuffer"};
function _8(_9,_a){
var _b=_9.xhr;
_9.status=_9.xhr.status;
try{
_9.text=_b.responseText;
}
catch(e){
}
if(_9.options.handleAs==="xml"){
_9.data=_b.responseXML;
}
var _c;
if(_a){
this.reject(_a);
}else{
try{
_3(_9);
}
catch(e){
_c=e;
}
if(_4.checkStatus(_b.status)){
if(!_c){
this.resolve(_9);
}else{
this.reject(_c);
}
}else{
if(!_c){
_a=new _1("Unable to load "+_9.url+" status: "+_b.status,_9);
this.reject(_a);
}else{
_a=new _1("Unable to load "+_9.url+" status: "+_b.status+" and an error in handleAs: transformation of response",_9);
this.reject(_a);
}
}
}
};
var _d,_e,_f,_10;
if(_5("native-xhr2")){
_d=function(_11){
return !this.isFulfilled();
};
_10=function(dfd,_12){
_12.xhr.abort();
};
_f=function(_13,dfd,_14){
function _15(evt){
dfd.handleResponse(_14);
};
function _16(evt){
var _17=evt.target;
var _18=new _1("Unable to load "+_14.url+" status: "+_17.status,_14);
dfd.handleResponse(_14,_18);
};
function _19(evt){
if(evt.lengthComputable){
_14.loaded=evt.loaded;
_14.total=evt.total;
dfd.progress(_14);
}else{
if(_14.xhr.readyState===3){
_14.loaded=("loaded" in evt)?evt.loaded:evt.position;
dfd.progress(_14);
}
}
};
_13.addEventListener("load",_15,false);
_13.addEventListener("error",_16,false);
_13.addEventListener("progress",_19,false);
return function(){
_13.removeEventListener("load",_15,false);
_13.removeEventListener("error",_16,false);
_13.removeEventListener("progress",_19,false);
_13=null;
};
};
}else{
_d=function(_1a){
return _1a.xhr.readyState;
};
_e=function(_1b){
return 4===_1b.xhr.readyState;
};
_10=function(dfd,_1c){
var xhr=_1c.xhr;
var _1d=typeof xhr.abort;
if(_1d==="function"||_1d==="object"||_1d==="unknown"){
xhr.abort();
}
};
}
function _1e(_1f){
return this.xhr.getResponseHeader(_1f);
};
var _20,_21={data:null,query:null,sync:false,method:"GET"};
function xhr(url,_22,_23){
var _24=_5("native-formdata")&&_22&&_22.data&&_22.data instanceof FormData;
var _25=_4.parseArgs(url,_4.deepCreate(_21,_22),_24);
url=_25.url;
_22=_25.options;
var _26=!_22.data&&_22.method!=="POST"&&_22.method!=="PUT";
if(_5("ie")<=10){
url=url.split("#")[0];
}
var _27,_28=function(){
_27&&_27();
};
var dfd=_4.deferred(_25,_10,_d,_e,_8,_28);
var _29=_25.xhr=xhr._create();
if(!_29){
dfd.cancel(new _1("XHR was not created"));
return _23?dfd:dfd.promise;
}
_25.getHeader=_1e;
if(_f){
_27=_f(_29,dfd,_25);
}
var _2a=typeof (_22.data)==="undefined"?null:_22.data,_2b=!_22.sync,_2c=_22.method;
try{
_29.open(_2c,url,_2b,_22.user||_20,_22.password||_20);
if(_22.withCredentials){
_29.withCredentials=_22.withCredentials;
}
if(_5("native-response-type")&&_22.handleAs in _7){
_29.responseType=_7[_22.handleAs];
}
var _2d=_22.headers,_2e=(_24||_26)?false:"application/x-www-form-urlencoded";
if(_2d){
for(var hdr in _2d){
if(hdr.toLowerCase()==="content-type"){
_2e=_2d[hdr];
}else{
if(_2d[hdr]){
_29.setRequestHeader(hdr,_2d[hdr]);
}
}
}
}
if(_2e&&_2e!==false){
_29.setRequestHeader("Content-Type",_2e);
}
if(!_2d||!("X-Requested-With" in _2d)){
_29.setRequestHeader("X-Requested-With","XMLHttpRequest");
}
if(_4.notify){
_4.notify.emit("send",_25,dfd.promise.cancel);
}
_29.send(_2a);
}
catch(e){
dfd.reject(e);
}
_2(dfd);
_29=null;
return _23?dfd:dfd.promise;
};
xhr._create=function(){
throw new Error("XMLHTTP not available");
};
if(_5("native-xhr")&&!_5("dojo-force-activex-xhr")){
xhr._create=function(){
return new XMLHttpRequest();
};
}else{
if(_5("activex")){
try{
new ActiveXObject("Msxml2.XMLHTTP");
xhr._create=function(){
return new ActiveXObject("Msxml2.XMLHTTP");
};
}
catch(e){
try{
new ActiveXObject("Microsoft.XMLHTTP");
xhr._create=function(){
return new ActiveXObject("Microsoft.XMLHTTP");
};
}
catch(e){
}
}
}
}
_4.addCommonMethods(xhr);
return xhr;
});
