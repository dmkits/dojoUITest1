/**
 * Created by dmkits on 30.12.16.
 */
define(["app/base", "dijit/Dialog", "dijit/form/Button", "dijit/form/TextBox"],
    function(base, Dialog, Button, TextBox) {
        return {
            /**
             * IANAGEZ 20.10.2017
             * @param params = {title, content, btnOkLabel, style, width, dialogID}
             */
            showSimple: function(params) {
                if(!params) params={};
                if(!params.dialogID) params.dialogID="DialogSimple";
                var dialogStyle="text-align:center; ",
                    btnOKID=params.dialogID+"_btnOK",
                    actionBarTemplate='<div class="dijitDialogPaneActionBar" style="text-align:center"><button id="'+btnOKID+'"></button></div>';
                var myDialog = base.instance(params.dialogID, Dialog, {actionBarTemplate:actionBarTemplate});
                if(params.width)dialogStyle=dialogStyle+'width:'+params.width+'px; ';
                if(!params.title) params.title="";
                myDialog.set("title", params.title);
                if(!params.content) params.content="";
                myDialog.set("content", params.content+"<br>");
                if(params.style) myDialog.set("style", dialogStyle+params.style); else myDialog.set("style", dialogStyle);
                if(!myDialog.btnOK){
                    myDialog.btnOK=new Button({"label":"Ok", style:"margin:5px;", onClick:function(){myDialog.hide(); }},btnOKID);
                    myDialog.btnOK.startup();
                }
                if(params.btnOkLabel)myDialog.btnOK.set("label",params.btnOkLabel);
                myDialog.startup();
                myDialog.show();
            }
        };
    });