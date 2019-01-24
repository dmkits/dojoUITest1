define(["dijit/layout/BorderContainer", "dijit/layout/LayoutContainer", "dojox/layout/ContentPane",
        "dijit/layout/TabContainer", "dijit/layout/StackContainer","dijit/layout/StackController",
        "dijit/MenuBar", "dijit/MenuBarItem", "dijit/PopupMenuBarItem", "dijit/Menu", "dijit/MenuItem", "dijit/MenuSeparator",
        "dijit/form/Button","dijit/form/ToggleButton", "dijit/form/TextBox","dijit/form/DateTextBox"],
    function(){
        var $ComponentFunctions= function($c){
            this.val= function(val){
                if(val===undefined)return $c.get("value");
                $c.set("value",val);
                return $c;
            };
            this.show=function(value){
                if(value!=false)$c.domNode.style["display"]="";else $c.domNode.style["display"]="none";
                return $c;
            };
            this.style=function(name,value){
                $c.domNode.style[name]=value;
                return $c;
            };
            this.click=function(handler){
                $c.onClick=handler;
                return $c;
            };
            this.addNew= function(Class, params){
                if (!params) params={};
                var newInstance=new Class(params);
                newInstance.$=new $ComponentFunctions(newInstance);
                return newInstance;
            };
            this.addChildTo= function(o, Class, params) {
                if(!o||!Class) return;
                if (!params) params={};
                var child= o.$.addNew(Class, params);
                o.addChild(child);
                return child;
            };
            this.addInnerPage=function(params,callback){
                var innerPage=this.addChildTo($c, window.InnerPage,params);
                if(callback)callback(innerPage);
                return $c;
            };
            this.setActionFor=function(owner,actionName,actionHandler){
                if(!owner||!actionName||!actionHandler)return $c;
                owner.set(actionName,function(e){
                    actionHandler(owner,e);
                });
            };
            this.setHandlers=function(actionHandlers){
                for (var actionName in actionHandlers) {
                    var actionHandler=actionHandlers[actionName];
                    if(actionName=="click")
                        this.setActionFor($c,"onClick",actionHandler);
                }
                return $c;
            };
            this.addMenu=function(menuClassName,params,addCallback){
                var menuClass=window.dijit[menuClassName];
                if(!menuClass){
                    console.error("CALL addMenu: dijit/"+menuClassName+" NOT INITIALIZED!!!"); return $c;
                }
                if(menuClassName=="PopupMenuBarItem"){
                    var popupMenuClass=window.dijit["Menu"];
                    if(!popupMenuClass){
                        console.error("CALL addMenu: dijit/"+popupMenuClass+" NOT INITIALIZED!!!"); return $c;
                    }
                    var newMenu= this.addNew(menuClass,params), newPopupMenu= this.addNew(popupMenuClass,{id:params.id+"_menu"});
                    newMenu.set("popup",newPopupMenu);
                    $c.addChild(newMenu);
                    newPopupMenu.$.setHandlers(params);
                    if(addCallback)addCallback(newPopupMenu);
                    return $c;
                }
                var child= this.addChildTo($c,menuClass,params);
                child.$.setHandlers(params);
                if(addCallback)addCallback(child);
                return $c;
            };
        };
        return $ComponentFunctions;
    });