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

$$= function(args){                                                                                     console.log("$$",args,this);
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
    }
};
$$Functions= function(params){
    var global=window;
    return{
        id:params.id,
        instance:params.instance,
        pageInit:function(params){
            if(!params)params={};
            params.id=this.id;
            this.instance=new global.Page(params,this.id); this.instance.startup();
            return this;
        },
        addChild: function(Class, params) {
            if (!params) params={};
            var childInstance = new Class(params);
            if (this.instance!=null) this.instance.addChild(childInstance);
        },
        addInnerPage:function(params){
            this.addChild(global.InnerPage,params);
            return this;
        },
        val:function(value){
            if(value===undefined) return this.instance.get("value");
            this.instance.set("value",value);
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
