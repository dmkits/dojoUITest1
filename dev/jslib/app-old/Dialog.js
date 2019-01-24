define(["app/base","dijit/Dialog","dijit/form/Button"],
    function(base,Dialog,Button){
        return {
            /**
             * IANAGEZ 20.10.2017 in dialogs.js
             * @param params = {title, content, btnOkLabel, style, width, dialogID}
             */
            showSimple: function(params) {
                if(!params) params={};
                if(!params.dialogID) params.dialogID="DialogSimple";
                var dialogStyle="text-align:center; ";
                var myDialog = base.instance(params.dialogID, Dialog, {});
                if(params.width)dialogStyle=dialogStyle+'width:'+params.width+'px; ';
                if (!params.title) params.title="";
                myDialog.set("title", params.title);
                if (!params.content) params.content="";
                myDialog.set("content", params.content+"<br>");
                if (params.style) myDialog.set("style", dialogStyle+params.style); else myDialog.set("style", dialogStyle);
                if(!myDialog.btnOK){
                    myDialog.btnOK=new Button({"label":"Ok", style:"margin-top:10px;", onClick:function(){myDialog.hide(); }});
                    myDialog.btnOK.startup();
                    myDialog.addChild(myDialog.btnOK);
                }
                if (params.btnOkLabel)myDialog.btnOK.set("label",params.btnOkLabel );
                myDialog.startup();
                myDialog.show();
            }
        }
    });