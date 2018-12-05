define(["dijit/layout/BorderContainer", "dijit/layout/LayoutContainer", "dijit/layout/TabContainer", "dojox/layout/ContentPane",
        "dijit/MenuBar", "dijit/MenuBarItem", "dijit/PopupMenuBarItem", "dijit/Menu", "dijit/MenuItem", "dijit/MenuSeparator",
        "dijit/form/TextBox","dijit/form/DateTextBox"],
    function(BorderContainer,LayoutContainer,TabContainer, ContentPane,
             MenuBar, MenuBarItem, PopupMenuBarItem, Menu, MenuItem, MenuSeparator,
             TextBox, DateTextBox){
        return {
            /**
             *
             */
            createBaseTags: function(node){                                                         //console.log('tagParser.createBaseTags: node=',node);
                var d;
                if(node.tagName=="TEXTBOX"){
                    d=new TextBox({tagName:node.tagName},node);                                     //console.log("t.domNode=",d.domNode.innerHTML.toString(),d.domNode);
                }else if(node.tagName=="DATETEXTBOX"){
                    d=new DateTextBox({tagName:node.tagName},node);                                 // console.log("d.domNode=",d.domNode);
                }
                if(d){
                    d.domNode.setAttribute("tagName",node.tagName);
                    return d.domNode;
                }
            },
            createContainerTags: function(node){
                var tagClass=null;
                if(node.tagName=="BORDERCONTAINER"){
                    tagClass=BorderContainer;
                }else if(node.tagName=="LAYOUTCONTAINER"){
                    tagClass=LayoutContainer;
                }else if(node.tagName=="TABCONTAINER"){
                    tagClass=TabContainer;
                }else if(node.tagName=="CONTENTPANE"){
                    tagClass=ContentPane;
                }
                if(tagClass){
                    var params={tagName:node.tagName};
                    this.parseNodeAttributes(node,["region","design","gutters","tabPosition"],params);//
                    var d=new tagClass(params,node);
                    d.domNode.setAttribute("tagName",node.tagName);
                    return d.domNode;
                }
            },
            createMenuTags: function(node){
                var tagClass=null;
                if(node.tagName=="MENUBAR"){
                    tagClass=MenuBar;
                }else if(node.tagName=="MENUBARITEM"){
                    tagClass=MenuBarItem;
                }else if(node.tagName=="POPUPMENUBARITEM"){
                    tagClass=PopupMenuBarItem;
                }else if(node.tagName=="MENU"){
                    tagClass=Menu;
                }
                if(tagClass){
                    var params={tagName:node.tagName};
                    this.parseNodeAttributes(node,["region","tabPosition"],params);//
                    var d=new tagClass(params,node);
                    d.domNode.setAttribute("tagName",node.tagName);
                    return d.domNode;
                }
            },
            parseNodeAttributes:function(node,attributes,params){
                for(var i in attributes){
                    var attrName=attributes[i];
                    var val=node.getAttribute(attrName);
                    if(val)params[attrName]=val;
                }
            },
            parseThis: function(containerNode){                                                     console.log('tagParser.parseThis: containerNode.ChildNodes=',containerNode.childNodes);
                if(!containerNode)return;
                this.parseContainer(0,containerNode);
            },
            parseContainer: function(ind,containerNode) {                                           //console.log('tagParser.parseContainer: containerNode.ChildNodes=', containerNode.childNodes);
                var containerChild=containerNode.children[ind];
                if(!containerChild)return;
                var newNode=this.createBaseTags(containerChild);
                if(!newNode)newNode=this.createContainerTags(containerChild);
                if(!newNode)newNode=this.createMenuTags(containerChild);
                if(newNode)                                                                         console.log('tagParser.parseThis createBaseTags: newNode=',newNode);
                if(containerChild.children.length>0) this.parseContainer(0,containerChild);
                this.parseContainer(ind+1,containerNode);
            }
        };
    });