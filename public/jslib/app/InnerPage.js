define(["dojo/_base/declare","dijit/layout/ContentPane","app/tagParser","app/scriptsParser"],
        function(declare,ContentPane,tagParser,scriptsParser){
            return declare("InnerPage",ContentPane,{
                constructor: function(args){
                    this.parseOnLoad=false;
                    this.$innerPage={};
                    declare.safeMixin(this,args);
                },
                onLoad :function(){                                                                         console.log('InnerPage.onLoad',this.containerNode);
                    tagParser.parseThis(this.containerNode,this.$innerPage);
                    scriptsParser.parseScripts(this.containerNode);
                }
            });
        });