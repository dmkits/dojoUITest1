define(["dojo/_base/declare","dijit/layout/ContentPane","app/tagParser","app/scriptsParser"],
        function(declare,ContentPane,tagParser,scriptsParser){
            return declare("InnerPage",ContentPane,{
                constructor: function(args){
                    this.parseOnLoad=false;
                    this.$innerPage={$parent:this,
                        dialogs:window.$$.dialogs,request:window.$$.request,
                        $dialogs:window.$$.dialogs,$request:window.$$.request
                    };
                    declare.safeMixin(this,args);
                },
                onLoad :function(){                                                                         console.log('InnerPage.onLoad',this.containerNode);
                    tagParser.parseThis(this.containerNode,this.$innerPage);
                    this.startup();
                    this._layout();
                    scriptsParser.parseScripts(this.containerNode);
                }
            });
        });