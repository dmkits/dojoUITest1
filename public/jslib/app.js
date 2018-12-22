                                                                                                        console.log("app",this);//!!!IT'S FOR TESTING!!!
// var doc=this.document;
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

/**
 * args = function | "<id>" | ["<id1>","<id2>", ... ]
 *      if args function - run function in callback require ["dojo/domReady!"]
 *      if args  = "<id>" - run $$Functions({id:"<id>",instance:dijit.registry.byId("<id>")})
 *      if args is array - run $$Functions([ {id:"<id1>",instance:dijit.registry.byId("<id1>")}, {id:"<id2>",instance:dijit.registry.byId("<id2>")}, ... ])
*/
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
/**
 * opts = <o> | [<o1>,<o2>, ... ]
 *      <o> - { id:<id of instance of dojo or dijit>, instance:<instance of dojo or dijit> }
*/
function $$Functions(objs){                                                                      //console.log("$$Functions ",params);
    var global=window;
    this.o=objs;
    this.instance=function(){
        return this.o.instance;
    };
    /**
     * action = function(o)
     * call action for all this.o objects with param function(o)), o = { id, instance }
     */
    this.action=function(action){
        if(typeof(this.o)!="object"||(typeof(this.o)=="object"&&this.o.length===undefined/*not array*/)){
            action(this.o);
            return;
        }
        for (var oKey in this.o) {
            var o = this.o[oKey]; action(o);
        }
    };
    /**
     * action = function(<$$Functions>)
     * call action for all this.o objects with param function(new $$Functions({id:o.id,instance:o.instance}))
     */
    this.actionF=function(action){
        if(typeof(this.o)!="object"||(typeof(this.o)=="object"&&this.o.length===undefined/*not array*/)){
            action(this); return;
        }
        for (var oKey in this.o) {
            var o = this.o[oKey]; action(new $$Functions({id:o.id,instance:o.instance}));
        }
    };
    /**
     * return $$Functions = <this>
     */
    this.pageInit=function(initParams){
        this.action(function(o){
            initParams.id=o.id;
            o.instance=new global.Page(initParams,initParams.id); o.instance.startup();
        });
        return this;
    };
    /**
     * create new Class(params)
     * return new $$Functions({id:params.id,instance:<new of Class(params)>})
     */
    this.addNew= function(Class, params){
        if (!params) params={};
        var newInstance=new Class(params);
        return new $$Functions({id:newInstance.id,instance:newInstance});
    };
    /**
     * add child = new Class(params) to o.instance
     * return $$Functions({id:childInstance.id,instance:childInstance})
     */
    this.addChildTo= function(o, Class, params) {                                                           //console.log("addChildTo o",o);
        if(!o||!o.instance) return;
        if (!params) params={};
        var childF= this.addNew(Class, params);
        o.instance.addChild(childF.instance());                               //console.log("addChild=",params,childInstance);
        return childF;
    };
    /**
     * call addCallback(childFunctions) for each added child
     */
    this.addMenu=function(menuClassName,params,addCallback){
        var self=this, menuClass=global.dijit[menuClassName];
        if(!menuClass){
            console.error("CALL addMenu: dijit/"+menuClassName+" NOT INITIALIZED!!!"); return;
        }
        this.action(function(o){
            if(menuClassName=="PopupMenuBarItem"){
                var popupMenuClass=global.dijit["Menu"];
                if(!popupMenuClass){
                    console.error("CALL addMenu: dijit/"+popupMenuClass+" NOT INITIALIZED!!!"); return;
                }
                var newMenuF= self.addNew(menuClass,params), newPopupMenuF= self.addNew(popupMenuClass,{id:params.id+"_menu"}),
                    newMenuFinstance=newMenuF.instance();
                newMenuFinstance.set("popup",newPopupMenuF.instance());
                o.instance.addChild(newMenuFinstance);
                newMenuF.setHandlers(params);
                if(addCallback)addCallback(newPopupMenuF);
                return;
            }
            var childFunctions= self.addChildTo(o,menuClass,params);
            childFunctions.setHandlers(params);
            if(addCallback)addCallback(childFunctions);

        });
        return this;
    };
    /**
     * return $$Functions = <this>
     */
    this.addInnerPage=function(params){
        var addChildTo=this.addChildTo;
        this.action(function(o){
            addChildTo(o, global.InnerPage,params);
        });
        return this;
    };
    /**
     * set prop of <this>.o instance
     * return $$Functions = <this>
     */
    this.set=function(param,value){                                console.log("param=",param," value=",value);
        this.action(function(o){
            o.instance.set(param,value);
        });
        return this;
    };
    this.setActionFor=function(ownersF,actionName,actionHandler){
        if(!ownersF||!actionName||!actionHandler)return;
        ownersF.actionF(function(of){
            var instance;
            if(!(instance=of.instance())) return;
            instance.set(actionName,function(e){
                actionHandler(of,e);
            })
        });
    };
    /**
     * actionHandlers = { <action name>:<action function> >}
     * return $$Functions = <this>
     */
    this.setHandlers=function(actionHandlers){
        for (var actionName in actionHandlers) {
            var actionHandler=actionHandlers[actionName];
            if(actionName=="click")
                this.setActionFor(this,"onClick",actionHandler);
        }
        return this;
    };
    /**
     * get <this>.o instance value's (array) OR set value of <this>.o instance
     * if set - return $$Functions = <this>
     */
    this.val=function(value){
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
        return this;
    };
    /**
     * set style of <this>.o domNode
     * return $$Functions = <this>
     */
    this.style=function(name,value){
        this.action(function(o){
            o.instance.domNode.style[name]=value;
        });
        return this;
    };
    /**
     * return $$Functions = <this>
     */
    this.click=function(handler){
        this.action(function(o){
            o.instance.onClick=handler;
        });
        return this;
    }
}
