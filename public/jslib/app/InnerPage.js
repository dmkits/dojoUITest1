define(["dojo/_base/declare","dijit/layout/ContentPane","app/tagParser"],
        function(declare,ContentPane,tagParser){
            return declare("InnerPage",ContentPane,{
                content:"",
                constructor: function(args){
                    this.parseOnLoad=false;
                    declare.safeMixin(this,args);
                },
                onLoad :function(){
                    tagParser.parseThis(this.containerNode);
                    var resCode={code:[]};
                    this.grabScripts(resCode);
                    this._code=resCode.code;
                    if(this._code.length>0){
                        var n = this.containerNode.ownerDocument.createElement('script');
                        n.type = "text/javascript";
                        var scripttext="";
                        this.containerNode.appendChild(n);
                        for(var i=0;i<this._code.length;i++){
                            if(scripttext.length>0)scripttext+="\n";
                            scripttext =
                                "require(['dijit/registry'],function(registry){ var self=registry.byId('"+this.id+"'); self.script_"+i+"= function(){\n"+
                                this._code[i]+
                                "}; self.script_"+i+"(); });";
                        }
                        n.text = scripttext;
                    }
                },
                grabScripts: function (resCode){
                    var i=0;
                    while(i<this.containerNode.children.length){
                        var child=this.containerNode.children[i];
                        if(child.tagName=="SCRIPT"){
                           if(child.innerText.length>0) resCode.code.push(child.innerText);
                           this.containerNode.children[i].remove();
                       } else i++;
                    }
                    return(resCode);
                }
            });
        });