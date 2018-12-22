define(["dojo/_base/declare","dijit/layout/BorderContainer","app/tagParser","app/scriptsParser"],
        function(declare,BorderContainer,tagParser,scriptsParser){
            return declare("Page",BorderContainer,{
                constructor: function(args){
                    this.parseOnLoad=false;
                    declare.safeMixin(this,args);
                },
                postCreate :function(){
                    tagParser.parseThis(this.containerNode);
                }
            });
        });