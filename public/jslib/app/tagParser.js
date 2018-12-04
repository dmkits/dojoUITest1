define(["dijit/form/TextBox","dijit/form/DateTextBox"],
    function(TextBox, DateTextBox){
        return {
            /**
             *
             */
            createBaseTags: function(tag){                          //console.log("tag=",tag,tag.tagName);
                var d;
                if(tag.tagName=="TEXTBOX"){
                    d=new TextBox({tagName:tag.tagName},tag);                 //console.log("t.domNode=",d.domNode.innerHTML.toString(),d.domNode);
                    d.domNode.setAttribute("tagName",tag.tagName);
                    return d.domNode;
                }else if(tag.tagName=="DATETEXTBOX"){
                    d=new DateTextBox({tagName:tag.tagName},tag);                        // console.log("d.domNode=",d.domNode);
                    d.domNode.setAttribute("tagName",tag.tagName);
                    return d.domNode;
                }
            },
            parseThis: function(domNode){                                              console.log('domNode.ChildNodes=',domNode.childNodes);
                for(var i=0; i<domNode.childNodes.length;i++){
                    var node = domNode.childNodes[i]; //, tagData=this.tags[node.tagName];                                               //console.log("node",node);
                    //if(!tagData||!tagData.newNode)continue;
                    if(this.createBaseTags(node))continue;
                }
            }
        };
    });