define(["dijit/layout/BorderContainer", "dijit/layout/LayoutContainer", "dijit/layout/TabContainer", "dijit/layout/StackContainer", "dojox/layout/ContentPane",
        "dijit/MenuBar", "dijit/MenuBarItem", "dijit/PopupMenuBarItem", "dijit/Menu", "dijit/MenuItem", "dijit/MenuSeparator",
        "dijit/form/Button","dijit/form/ToggleButton", "dijit/form/TextBox","dijit/form/DateTextBox"],
    function(BorderContainer,LayoutContainer,TabContainer, StackContainer, ContentPane,
             MenuBar, MenuBarItem, PopupMenuBarItem, Menu, MenuItem, MenuSeparator,
             Button,ToggleButton, TextBox, DateTextBox){
        return {
            /**
             *
             */
            createBaseTags: function(node){                                                             //console.log('tagParser.createBaseTags: node=',node);
                var tagClass=null;
                if(node.tagName=="TEXTBOX"){
                    tagClass=TextBox;
                }else if(node.tagName=="DATETEXTBOX"){
                    tagClass=DateTextBox;
                }else if(node.tagName=="BUTTON"){
                    tagClass=Button;
                }else if(node.tagName=="TOGGLEBUTTON"){
                    tagClass=ToggleButton;
                }
                if(!tagClass)return;
                var params={tagName:node.tagName};
                this.parseNodeAttributes(node,["class","style", "iconClass"],params);
                var d=new tagClass(params,node);
                d.domNode.setAttribute("tagName",node.tagName);                                     //console.log('tagParser.createBaseTags: d=',d);
                var label=node.getAttribute("label");
                if(label){
                    var l;
                    d.domNode.parentNode.insertBefore(l=document.createElement("label"),d.domNode);
                    d.labelTag=l;
                    l.innerText=label; l.setAttribute("for",node.getAttribute("id"));
                }
                return d;
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
                if(!tagClass)return;
                var params={tagName:node.tagName};
                this.parseNodeAttributes(node,["class","style","region","design","gutters","tabPosition"],params);
                var d=new tagClass(params,node);
                d.domNode.setAttribute("tagName",node.tagName);
                return d;
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
                if(!tagClass)return;
                var params={tagName:node.tagName};
                this.parseNodeAttributes(node,["class","style","region","tabPosition"],params);//
                var d=new tagClass(params,node);
                d.domNode.setAttribute("tagName",node.tagName);
                return d;
            },
            parseNodeAttributes:function(node,attributes,params){
                for(var i in attributes){
                    var attrName=attributes[i];
                    var val=node.getAttribute(attrName);
                    if(val)params[attrName]=val;
                }
            },
            parseThis: function(containerNode){                                                     //console.log('tagParser.parseThis: containerNode.ChildNodes=',containerNode.childNodes);
                if(!containerNode)return;
                this.parseContainer(0,containerNode);
            },
            parseContainer: function(ind,containerNode) {
                var containerChild=containerNode.children[ind];
                if(!containerChild)return;                                                          //console.log('tagParser.parseContainer: containerChild=', containerChild);
                var newNode=this.createBaseTags(containerChild);
                if(!newNode)newNode=this.createContainerTags(containerChild);
                if(!newNode)newNode=this.createMenuTags(containerChild);
                //if(newNode)/*IT'S FOR TEST*/                                                      console.log('tagParser.parseThis createBaseTags: newNode=',newNode);
                if(containerChild.children.length>0) this.parseContainer(0,containerChild);
                if(newNode&&newNode.labelTag) ind++;
                this.parseContainer(ind+1,containerNode);
            }
        };
    });