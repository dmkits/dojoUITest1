define(["dojo/_base/declare","dijit/layout/ContentPane","app/tagParser","app/scriptsParser"],
        function(declare,ContentPane,tagParser,scriptsParser){
            return declare("InnerPage",ContentPane,{
                constructor: function(args){
                    this.parseOnLoad=false;
                    declare.safeMixin(this,args);
                },
                onLoad :function(){
                    tagParser.parseThis(this.containerNode);
                    scriptsParser.parseScripts(this.containerNode);
                }
            });
        });