define(["app/tagParserCF",
        "dijit/layout/BorderContainer", "dijit/layout/LayoutContainer", "dojox/layout/ContentPane",
        "dijit/layout/TabContainer", "dijit/layout/StackContainer","dijit/layout/StackController", "dijit/TitlePane",
        "dijit/MenuBar", "dijit/MenuBarItem", "dijit/PopupMenuBarItem", "dijit/Menu", "dijit/MenuItem", "dijit/MenuSeparator",
        "dijit/form/Button","dijit/form/ToggleButton", "dijit/form/TextBox","dijit/form/DateTextBox"],
    function(TagParserComponentFunctions,
             BorderContainer,LayoutContainer,ContentPane,
             TabContainer, StackContainer, StackController, TitlePane,
             MenuBar, MenuBarItem, PopupMenuBarItem, Menu, MenuItem, MenuSeparator,
             Button,ToggleButton, TextBox, DateTextBox){
        return {
            /**
             *
             */
            createBaseTags: function(node){                                                                 //console.log('tagParser.createBaseTags: node=',node);
                var tagClass=null;
                if(node.tagName=="TextBox".toUpperCase()){
                    tagClass=TextBox;
                }else if(node.tagName=="DateTextBox".toUpperCase()){
                    tagClass=DateTextBox;
                }else if(node.tagName=="Button".toUpperCase()){
                    tagClass=Button;
                }else if(node.tagName=="ToggleButton".toUpperCase()){
                    tagClass=ToggleButton;
                }
                if(!tagClass)return;
                var params={tagName:node.tagName};
                this.parseNodeAttributes(params,node,["class","style", "iconClass","aria-disabled"]);
                var d=new tagClass(params,node);
                d.domNode.setAttribute("tagName",node.tagName);                                             //console.log('tagParser.createBaseTags: d=',d);
                var label=node.getAttribute("label");
                if(label){
                    var l, labelstyle=node.getAttribute("labelstyle");
                    d.domNode.parentNode.insertBefore(l=document.createElement("label"),d.domNode);
                    d.labelTag=l;
                    l.innerText=label; l.setAttribute("for",node.getAttribute("id"));
                    if(labelstyle){
                        if(labelstyle.indexOf("width")>=0)labelstyle="display: inline-block;"+labelstyle;
                        l.setAttribute("style",labelstyle);
                    }
                }
                return d;
            },
            createContainerTags: function(node,startupList){
                var tagClass=null;
                if(node.tagName=="BorderContainer".toUpperCase()){
                    tagClass=BorderContainer;
                }else if(node.tagName=="LayoutContainer".toUpperCase()){
                    tagClass=LayoutContainer;
                }else if(node.tagName=="ContentPane".toUpperCase()){
                    tagClass=ContentPane;
                }else if(node.tagName=="TabContainer".toUpperCase()){
                    tagClass=TabContainer;
                }else if(node.tagName=="StackContainer".toUpperCase()){
                    tagClass=StackContainer;
                }else if(node.tagName=="StackController".toUpperCase()){
                    tagClass=StackController;
                }else if(node.tagName=="TitlePane".toUpperCase()){
                    tagClass=TitlePane;
                }
                if(!tagClass)return;
                var params={tagName:node.tagName};
                this.parseNodeAttributes(params,node,
                    ["class","style","region","design","gutters","tabPosition","containerId","title","iconClass"],
                    {"childIconClass":"iconClass"});
                var d=new tagClass(params,node);                                                            //console.log('tagParser.createContainerTags: d=',d);
                d.domNode.setAttribute("tagName",node.tagName);
                if(d.startup) startupList.push(d);
                return d;
            },
            createMenuTags: function(node){
                var tagClass=null;
                if(node.tagName=="MenuBar".toUpperCase()){
                    tagClass=MenuBar;
                }else if(node.tagName=="MenuBarItem".toUpperCase()){
                    tagClass=MenuBarItem;
                }else if(node.tagName=="PopupMenuBarItem".toUpperCase()){
                    tagClass=PopupMenuBarItem;
                }else if(node.tagName=="Menu".toUpperCase()){
                    tagClass=Menu;
                }
                if(!tagClass)return;
                var params={tagName:node.tagName};
                this.parseNodeAttributes(params,node,["class","style","region"]);//
                var d=new tagClass(params,node);
                d.domNode.setAttribute("tagName",node.tagName);
                return d;
            },
            createHTableTags: function(node){
                var tagClass=null;
                if(node.tagName=="HTableSimple".toUpperCase()){
                    tagClass=window.HTableSimple;
                    if(!tagClass)console.error("Module for tag "+node.tagName+" cannot loaded!");
                }else if(node.tagName=="HTableSimpleFiltered".toUpperCase()){
                    tagClass=window.HTableSimpleFiltered;
                    if(!tagClass)console.error("Module for tag "+node.tagName+" cannot loaded!");
                }
                if(!tagClass)return;
                var params={tagName:node.tagName};
                this.parseNodeAttributes(params,node,
                    ["class","style","region","design","gutters","title","iconClass"]);
                var d=new tagClass(params,node);                                                            //console.log('tagParser.createHTableTags: d=',d);
                d.domNode.setAttribute("tagName",node.tagName);
                return d;
            },
            createTDocTags: function(node){
                var tagClass=null;
                if(node.tagName=="TDocSimpleTable".toUpperCase()){
                    tagClass=window.TDocSimpleTable;
                    if(!tagClass)console.error("Module for tag "+node.tagName+" cannot loaded!");
                }
                if(!tagClass)return;
                var params={tagName:node.tagName};
                this.parseNodeAttributes(params,node,
                    ["class","style","region","design","gutters","title","iconClass"]);
                var d=new tagClass(params,node);                                                            //console.log('tagParser.createHTableTags: d=',d);
                d.domNode.setAttribute("tagName",node.tagName);
                return d;
            },
            parseCFunctions:[],
            parseNodeAttributes:function(params,node,attributes,childAttributes){
                for(var i in attributes){
                    var attrName=attributes[i];
                    var val=node.getAttribute(attrName);
                    if(val)params[attrName]=val;
                }
                if(!childAttributes)return;
                for(var childAttrName in childAttributes){
                    var val=node.getAttribute(childAttrName);
                    if(!val)continue;
                    var childRealAttrName=childAttributes[childAttrName];
                    if(!params.ChildWidgetProperties)params.ChildWidgetProperties={};
                    params.ChildWidgetProperties[childRealAttrName]=val;
                }
            },
            parseThis: function(containerNode,$page){                                                       //console.log('tagParser.parseThis: containerNode.ChildNodes=',containerNode.childNodes);
                if(!containerNode)return;
                if($page){
                    if(!$page.$cItems)$page.$cItems={};
                    if(!$page.$nItems)$page.$nItems={};
                }
                var startupList=[];
                this.parseContainer(0,containerNode,$page, startupList);
                if(startupList.length>0)startupList[0].startup();                                           //console.log("startupList",startupList);
            },
            parseContainer: function(ind,containerNode,$page, startupList) {
                var containerChild=containerNode.children[ind];
                if(!containerChild)return;                                                                  //console.log('tagParser.parseContainer: containerChild=', containerChild);
                var newNode=this.createBaseTags(containerChild);
                if(!newNode)newNode=this.createContainerTags(containerChild, startupList);
                if(!newNode)newNode=this.createMenuTags(containerChild);
                if(!newNode)newNode=this.createHTableTags(containerChild);
                if(!newNode)newNode=this.createTDocTags(containerChild);
                if(!newNode&&this.parseCFunctions)
                    for (var fInd in this.parseCFunctions) {
                        var parseFunction=this.parseCFunctions[fInd];
                        if(!parseFunction)continue;
                        newNode=parseFunction(containerChild);
                        if(newNode)break;
                    }
                //if(newNode)/*IT'S FOR TEST*/                                                              console.log('tagParser.parseThis createBaseTags: newNode=',newNode);
                if(newNode)newNode.$= new TagParserComponentFunctions(newNode);
                if(newNode&&$page){
                    $page[newNode.id]=newNode;$page.$cItems[newNode.id]=newNode;
                }else if(containerChild.id&&$page){
                    $page[containerChild.id]=containerChild;$page.$nItems[containerChild.id]=containerChild;
                }
                if(containerChild.children.length>0) this.parseContainer(0,containerChild,$page,startupList);
                if(newNode&&newNode.labelTag) ind++;
                this.parseContainer(ind+1,containerNode,$page,startupList);
            }
        };
    });