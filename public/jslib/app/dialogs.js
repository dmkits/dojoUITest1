/**
 * Created by dmkits on 30.12.16.
 */
define(["app/base", "dijit/Dialog", "dijit/form/Button", "dijit/ProgressBar", "dojox/layout/ContentPane", "dijit/form/TextBox"],
    function(base, Dialog, Button, ProgressBar, ContentPane, TextBox) {
        return {
            /**
             * IANAGEZ 20.10.2017
             * @param params = {title, content, btnOkLabel, style, width, height, id, actionBarTemplate}
             */
            _doSimpleDialog: function(params){
                if(!params) params={};
                if(!params.dialogID) params.dialogID="DialogSimple";
                var dialogStyle="text-align:center;",
                    btnOKID=params.dialogID+"_btnOK",
                    actionBarTemplate=params.actionBarTemplate||'<div class="dijitDialogPaneActionBar" style="text-align:center"><button id="'+btnOKID+'"></button></div>';
                var dlg = base.instance(params.dialogID, Dialog, {actionBarTemplate:actionBarTemplate});
                if(params.width)dialogStyle=dialogStyle+'width:'+params.width+'px; ';
                if(params.height)dialogStyle=dialogStyle+'height:'+params.height+'px; ';
                if(params.style) dlg.set("style", dialogStyle+params.style); else dlg.set("style", dialogStyle);
                if(!params.title) params.title="";
                dlg.set("title", params.title);
                if(params.content)dlg.set("content", params.content);
                if(!dlg.btnOK){
                    dlg.btnOK=new Button({"label":"Ok", style:"margin:5px;margin-right:10px;", onClick:function(){ dlg.hide(); } },btnOKID);
                    dlg.btnOK.focusNode.style.width="80px";
                    dlg.btnOK.startup();
                }
                if(params.btnOkLabel)dlg.btnOK.set("label",params.btnOkLabel);
                dlg.startup();
                return dlg;
            },
            showSimple: function(params){
                if(!params.content) params.content="";
                if(params.content)params.content+="<br>";
                var dlg=this._doSimpleDialog(params); dlg.show();
                return dlg;
            },
            /**
             * @param params = {title, content, btnOkLabel, style, width, contentHeight, id, progressMaximum, btnStop,btnStopLabel}
             * default contentHeight=200
             */
            showProgress: function(params){
                if(!params)params={};
                if(!params.id)params.id="progressDialog";
                params.height=null;
                var dlg=this._doSimpleDialog(params);
                if(!params.btnOkLabel)params.btnOkLabel="Close";
                dlg.btnOK.set("label",params.btnOkLabel);dlg.btnOK.set("disabled",true);
                if((params.btnStop||params.btnStopLabel)&&!dlg.btnStop){
                    dlg.btnStop=new Button({"label":"Stop", style:"margin:5px;margin-left:10px;",
                        onClick:function(){ dlg.progressStopped=true;dlg.btnOK.set("disabled",false); } });
                    dlg.btnStop.focusNode.style.width="80px";
                    dlg.btnOK.domNode.parentNode.appendChild(dlg.btnStop.domNode);
                    dlg.btnStop.startup();
                }
                if(params.btnStopLabel)dlg.btnStop.set("label",params.btnStopLabel);
                if(dlg.btnStop)dlg.btnStop.set("disabled",false);
                if(!dlg.enableClose) dlg.enableClose=function(){
                    if(!this.open)this.show();
                    this.btnOK.set("disabled",false);
                    if(this.btnStop)this.btnStop.set("disabled",true);
                };
                if(!dlg.progressBarForDialog){
                    dlg.progressBarForDialog= new ProgressBar({id:dlg.id+"_progressBar",style:"width: 100%"});
                    dlg.addChild(dlg.progressBarForDialog);
                }
                dlg.progressBarForDialog.set("maximum", params.progressMaximum);dlg.progressBarForDialog.set("value",0);
                if(!dlg.messagesContent){
                    dlg.messagesContent= new ContentPane({id:dlg.id+"_messagesContent",style:"padding:0;width:100%;text-align:left"});
                    dlg.addChild(dlg.messagesContent);
                }
                if(!params.contentHeight)params.contentHeight=200;
                dlg.messagesContent.domNode.style.height=params.contentHeight+"px";
                dlg.progressStopped=false;
                dlg.messagesContent.set("content","");
                if(!dlg.addMsg) dlg.addMsg=function(msg){
                    if(!this.open){
                        this.show();
                        if(!this.progressStopped){
                            dlg.btnOK.set("disabled",true);
                            if(dlg.btnStop)dlg.btnStop.set("disabled",false);
                        }
                    }
                    this.messagesContent.domNode.appendChild(this.lastMessage=document.createElement("div"));
                    this.lastMessage.innerHTML=msg;
                    this.lastMessage.scrollIntoView(false);
                };
                if(!dlg.setMsg) dlg.setMsg=function(msg){
                    if(!this.open){
                        this.show();
                        if(!this.progressStopped){
                            dlg.btnOK.set("disabled",true);
                            if(dlg.btnStop)dlg.btnStop.set("disabled",false);
                        }
                    }
                    if(!this.lastMessage)this.messagesContent.domNode.appendChild(this.lastMessage=document.createElement("div"));
                    this.lastMessage.innerHTML=msg;
                    this.lastMessage.scrollIntoView(false);
                };
                if(!dlg.setProgress) dlg.setProgress=function(progress,msg){
                    if(!this.open){
                        this.show();
                        if(!this.progressStopped){
                            dlg.btnOK.set("disabled",true);
                            if(dlg.btnStop)dlg.btnStop.set("disabled",false);
                        }
                    }
                    if(progress>=0)this.progressBarForDialog.set("value",progress);
                    if(msg)this.addMsg(msg);
                };
                dlg.show();
                return dlg;
            }
        };
    });