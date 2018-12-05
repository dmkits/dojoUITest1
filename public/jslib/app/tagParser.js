define(["dijit/form/TextBox","dijit/form/DateTextBox"],
    function(TextBox, DateTextBox){
        return {
            /**
             *
             */
            createBaseTags: function(node){                                                         //console.log('tagParser.createBaseTags: node=',node);
                var d;
                if(node.tagName=="TEXTBOX"){
                    d=new TextBox({tagName:node.tagName},node);                                     //console.log("t.domNode=",d.domNode.innerHTML.toString(),d.domNode);
                    d.domNode.setAttribute("tagName",node.tagName);
                    return d.domNode;
                }else if(node.tagName=="DATETEXTBOX"){
                    d=new DateTextBox({tagName:node.tagName},node);                                 // console.log("d.domNode=",d.domNode);
                    d.domNode.setAttribute("tagName",node.tagName);
                    return d.domNode;
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
                if(newNode)                                                                         console.log('tagParser.parseThis createBaseTags: newNode=',newNode);
                if(containerChild.children.length>0) this.parseContainer(0,containerChild);
                this.parseContainer(ind+1,containerNode);
            }
        };
    });