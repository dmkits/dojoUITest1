define(["dojo/_base/declare","dijit/layout/ContentPane"],
        function(declare,ContentPane){
            return declare("myContentPane",ContentPane,{
                content:"",
                constructor: function(args){
                    declare.safeMixin(this,args);
                },
                onLoad :function(){
                    var resCode={code:[]};
                    this.grabScripts(resCode);
                    this._code=resCode.code;
                    if(this._code.length>0){                                                                            //console.log(this._code);
                        var n = this.containerNode.ownerDocument.createElement('script');
                        n.type = "text/javascript";
                        var scripttext="";
                        this.containerNode.appendChild(n);
                        for(var i=0;i<this._code.length;i++){
                            if(scripttext==""){scripttext = "require(['dijit/registry'],function(registry){ var self=registry.byId('"+this.id+"'); self.script_"+i+"= function(){"+this._code[i]+"}; self.script_"+i+"(); });";}
                            else{scripttext += "\nrequire(['dijit/registry'],function(registry){ var self=registry.byId('"+this.id+"'); self.script_"+i+"= function(){"+this._code[i]+"}; self.script_"+i+"(); });";}
                        }
                        n.text = "require([],function(){\n"+scripttext+"})";                                            //console.log(n.text);
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
                    };
                    return(resCode);
                }
            });
        });