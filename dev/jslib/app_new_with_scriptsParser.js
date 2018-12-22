                                                                                                        console.log("app",this);//!!!IT'S FOR TESTING!!!
var doc=this.document;
require(["dijit/registry","app/Page","app/InnerPage"],function (registry,Page,InnerPage){
});
// require(["dijit/registry", "dojo/dom-style", "app/app", "app/Page","app/InnerPage",
//         "dijit/form/ToggleButton"],
//     function (registry, domStyle, APP, Page,InnerPage,
//               ToggleButton) {                                                               console.log("app require",this);//!!!IT'S FOR TESTING!!!
//         var doc=this.document;
//         // var main_Page = APP.instanceForID("main_Page", Page, {design: "headline"});
//         // main_Page.startup();
//         // var innerPage1 =
//         //     APP.childFor(main_Page, "innerPage_1",
//         //         InnerPage, {region: "center", title:"innerPage_1", closable:true, style:"margin:0;padding:0;",href:"/ipage1"});
//     });

$$= function(args){                                                                                     //console.log("$$",args,this);
    if(typeof(args)==="function"){
        require(["dojo/domReady!"],function () {                                                        console.log("$$ run");//!!!IT'S FOR TESTING!!!
            args();
        });
    } else if(typeof(args)==="string"){
        if(this.dijit&&this.dijit.registry){
            return new $$Functions({id:args,instance:dijit.registry.byId(args)});
        }else{
            console.error("dijit/registry NOT INITIALIZED!!!"); return;
        }
    } else if(typeof(args)==="object"&&args.length>0/*array*/){
        var ao=[];
        for (var i in args) {
            var id=args[i]; ao.push({id:id,instance:dijit.registry.byId(id)})
        }
        return new $$Functions(ao);
    }
};
$$Functions= function(params){                                                                      //console.log("$$Functions ",params);
    var global=window;
    return{
        o:params,
        action:function(action){
            if(typeof(this.o)!="object"||(typeof(this.o)=="object"&&this.o.length===undefined/*not array*/)){
                action(this.o);
                return;
            }
            for (var oKey in this.o) {
                var o = this.o[oKey]; action(o);
            }
        },
        pageInit:function(initParams){
            this.action(function(o){
                initParams.id=o.id;
                o.instance=new global.Page(initParams,initParams.id); o.instance.startup();
            });
            return this;
        },
        addChildTo: function(o, Class, params) {
            if (!params) params={};
            var childInstance = new Class(params);
            if (o.instance!=null) o.instance.addChild(childInstance);
        },
        addInnerPage:function(params){
            var addChildTo=this.addChildTo;
            this.action(function(o){
                addChildTo(o, global.InnerPage,params);
            });
            return this;
        },
        set:function(param,value){
            this.action(function(o){
                o.instance.set(param,value);
            });
        },
        val:function(value){
            if(value===undefined) {
                var values=[];
                this.action(function(o){
                    values.push(o.instance.get("value"));
                });
                return (values.length<=1)?values[0]:values;
            }
            this.action(function(o){
                o.instance.set("value",value);
            });
        },
        style:function(name,value){
            this.action(function(o){
                o.instance.domNode.style[name]=value;
            });
            return this;
        },
        click:function(handler){
            this.action(function(o){
                o.instance.onClick=handler;
            });
            return this;
        }
    }
};

// $$scriptParser={
//     parseScripts :function(containerNode){
//         var scripts=this.grabScripts(containerNode);                                        console.log("$$scriptParser.parseScripts scripts=",scripts);
//         if(scripts.length==0)return;
//         for(var i=0;i<scripts.length;i++){
//             var scriptData=scripts[i];
//             scriptData.parentNode.removeChild(scriptData.scriptNode);
//             var n = scriptData.parentNode.ownerDocument.createElement('script');
//             n.type = "text/javascript";
//             scriptData.parentNode.appendChild(n);
//             var scripttext =
//                 "require(['dijit/registry'],function(registry){ var self=registry.byId('"+scriptData.parentNode.id+"'); self.script_"+i+"= function(){"+
//                 scriptData.script+
//                 "}; self.script_"+i+"(); });";
//             n.text = scripttext;
//         }
//     },
//     grabScripts: function (containerNode){
//         var scripts=[], scriptsNodes=containerNode.getElementsByTagName("script");
//         for (var i = 0; i < scriptsNodes.length; i++) {
//             var scriptNode=scriptsNodes[i];
//             if(scriptNode.src.length!=0)continue;
//             scripts.push({scriptNode:scriptNode,parentNode:scriptNode.parentNode,script:scriptNode.innerText});
//
//         }
//         return(scripts);
//     }
// };
//$$scriptParser.parseScripts(this.document);                                       // console.log("grabScripts=",$$scriptParser.grabScripts(this.document));
