define(["dijit/form/TextBox","dijit/form/DateTextBox"],
    function(TextBox, DateTextBox){
        return {
            parseScripts :function(containerNode){
                var scripts=this.grabScripts(containerNode);
                if(scripts.length>0){
                    var n = containerNode.ownerDocument.createElement('script');
                    n.type = "text/javascript";
                    var scripttext="";
                    containerNode.appendChild(n);
                    for(var i=0;i<scripts.length;i++){
                        if(scripttext.length>0)scripttext+="\n";
                        scripttext =
                            "require(['dijit/registry'],function(registry){ var self=registry.byId('"+containerNode.id+"'); self.script_"+i+"= function(){\n"+
                            scripts[i]+
                            "}; self.script_"+i+"(); });";
                    }
                    n.text = scripttext;
                }
            },
            grabScripts: function (containerNode){
                var i=0, scriptsCode=[];
                while(i<containerNode.children.length){
                    var child=containerNode.children[i];
                    if(child.tagName=="SCRIPT"){
                        if(child.innerText.length>0) scriptsCode.push(child.innerText);
                        containerNode.children[i].remove();
                    } else i++;
                }
                return(scriptsCode);
            }
        };
    });