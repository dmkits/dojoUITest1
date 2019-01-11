var body=document.body;
if(body) body.style.display="none";
var global=window;                                                                                          console.log("app",this);//!!!IT'S FOR TESTING!!!
require(["dijit/registry","app/Page","app/InnerPage","app/dialogs","app/request"],
    function (registry,Page,InnerPage,dialogs,request){
        global.$$.dialogs= dialogs;
        global.$$.request= request;
    });                                                                                                     console.log("global=window=",window);

/**
 * args = function | "<id>" | ["<id1>","<id2>", ... ]
 *      if args function - run function in callback require ["dojo/ready"]
 *      if args  = "<id>" - run $$Functions({id:"<id>",instance:dijit.registry.byId("<id>")})
 *      if args is array - run $$Functions([ {id:"<id1>",instance:dijit.registry.byId("<id1>")}, {id:"<id2>",instance:dijit.registry.byId("<id2>")}, ... ])
*/
function $$(args){                                                                                          //console.log("$$",args,this);
    //if(typeof(args)==="function"){
    //} else
    if(typeof(args)==="string"&&args.trim().indexOf("#")==0){
        var i=null;
        if(window.dijit&&window.dijit.registry){
            i=window.dijit.registry.byId(args.replace("#",""));
        }else{
            console.error("dijit/registry NOT INITIALIZED!!!"); return;
        }
        if(i){
            var f$=new $$Functions({id:args,instance:i}); return f$;
        }
        var domNode=this.domNode;
        if(!domNode)domNode=document.body;
        var els=domNode.getElementsByTagName("*");
        for(var ind=0;ind<els.length;ind++){
            var el=els[ind];
            if("#"+el.id==args)return el;
        }
    } else if(typeof(args)==="object"&&args.length>0/*array*/){
        var ao=[];
        for (var i in args) {
            var id=args[i]; ao.push({id:id,instance:dijit.registry.byId(id)})
        }
        return new $$Functions(ao);
    }
}
$$.startupPage= function(pageTagID,pageScript){
    var body=document.body;
    if(body) body.style.display="none";
    require(["dojo/ready"],function(ready){
        ready(function(){                                                                                   console.log("$$ startupPage dojo/ready pageTagID=",pageTagID);//!!!IT'S FOR TESTING!!!
            var initParams={id:(pageTagID)?pageTagID.toString().replace("#",""):pageTagID};
            var page=new global.Page(initParams,initParams.id);
            if(body) body.style.display="";
            page.startup();
            if(!pageScript)return;
            page.$=$$;
            page.script=pageScript;
            page.script(page);
        });
    });
};
/**
 * opts = <o> | [<o1>,<o2>, ... ]
 *      <o> - { id:<id of instance of dojo or dijit>, instance:<instance of dojo or dijit> }
*/
function $$Functions(objs){                                                                                 //console.log("$$Functions ",params);
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
     * create new Class(params)
     * return new $$Functions({id:params.id,instance:<new of Class(params)>})
     */
    this.addNew= function(Class, params){
        if (!params) params={};
        var newInstance=new Class(params);
        newInstance.$=new $$Functions({id:newInstance.id,instance:newInstance});
        return newInstance.$;
    };
    /**
     * add child = new Class(params) to o.instance
     * return $$Functions({id:childInstance.id,instance:childInstance})
     */
    this.addChildTo= function(o, Class, params) {                                                           //console.log("addChildTo o",o);
        if(!o||!o.instance) return;
        if (!params) params={};
        var childF= this.addNew(Class, params);
        o.instance.addChild(childF.instance());                                                             //console.log("addChild=",params,childF);
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
                if(addCallback)addCallback(newPopupMenuF.instance());
                return;
            }
            var childFunctions= self.addChildTo(o,menuClass,params);
            childFunctions.setHandlers(params);
            if(addCallback)addCallback(childFunctions.instance());

        });
        return this;
    };
    /**
     * return $$Functions = <this>
     */
    this.addInnerPage=function(params,callback){
        var self=this, innerPagesF=[];
        this.action(function(o){
            innerPagesF.push(self.addChildTo(o, global.InnerPage,params));
        });
        if(callback)callback(innerPagesF);
        return this;
    };
    /**
     * set prop of <this>.o instance
     * return $$Functions = <this>
     */
    this.set=function(param,value){                                                                         console.log("param=",param," value=",value);
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
                actionHandler(instance,e);
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
     * set style of <this>.o domNode
     * return $$Functions = <this>
     */
    this.show=function(value){
        this.action(function(o){
            if(value!=false)o.instance.domNode.style["display"]="";else o.instance.domNode.style["display"]="none";
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
