var body=document.body;if(body) body.style.display="none";
window.app= function(arg){
    if(arg&&typeof(arg)=="object"){
        for (var p in arg) this[p]=arg[p]
    }
};
app.log= function(args){
    if(!window.app.debug&&!window.app.dev)return;
    console.log.apply(true,arguments);
};
app._loadScript=function(parent,src,attributes,onload){
    if(!parent)return;
    var script = document.createElement('script');
    script.type = "text/javascript";script.src = src;
    script.async = false;
    script.onload=onload;
    if(attributes)
        for (var aName in attributes) script.setAttribute(aName,attributes[aName]);
    parent.appendChild(script);
};
window.$$={};
app.pages={};
app.startupPage= function(pageTagID,pageScript) {
    app.pages[pageTagID] = pageScript;
};
app._startupPageTag= function(pageTagID,pageScript){
    var body=document.body;
    if(body) body.style.display="none";
    require(["dojo/ready"],function(ready){
        ready(function(){                                                                                   app.log("$$ startupPage dojo/ready pageTagID=",pageTagID);//!!!IT'S FOR TESTING!!!
            var initParams={id:(pageTagID)?pageTagID.toString().replace("#",""):pageTagID};
            var page=new window.Page(initParams,initParams.id);
            if(body) body.style.display="";
            page.startup();
            if(!pageScript)return;
            $$=page.$page;
            page.$page.startup=pageScript;
            page.$page.startup(page);
        });
    });
};
app._loadScript(document.currentScript.parentNode,"/jslib/dojo/dojo.js",{"data-dojo-config":"async:true,parseOnLoad:false"},
    function(){                                                                                                     console.log("LOADED");
        require(["dijit/registry","app/dialogs","app/request","app/Page","app/InnerPage"],
            function (registry,dialogs,request){
                window.$$.dialogs= dialogs;
                window.$$.request= request;
            });                                                                                                     app.log("app window=",window);
        if(window.Handsontable)
            require(["app/hTableSimple","app/hTableSimpleFiltered","app/tDocSimpleTable"],
                function (){
                });
        for (var pageID in app.pages) app._startupPageTag(pageID,app.pages[pageID]);
    });

                                            //console.log("app.loadScript",app.loadScript);

                                            console.log("document.currentScript",document.currentScript,document.currentScript.attributes.src.value);
                                            console.dir(document.currentScript);
                                            console.log(document.currentScript.parentNode);
//
//require(["dijit/registry","app/dialogs","app/request","app/Page","app/InnerPage"],
//    function (registry,dialogs,request){
//        window.$$.dialogs= dialogs;
//        window.$$.request= request;
//    });                                                                                                     app.log("app window=",window);
//if(window.Handsontable)
//    require(["app/hTableSimple","app/hTableSimpleFiltered","app/tDocSimpleTable"],
//        function (){
//        });
/////**
//// * args = function | "<id>" | ["<id1>","<id2>", ... ]
//// *      if args function - run function in callback require ["dojo/ready"]
//// *      if args  = "<id>" - run $$Functions({id:"<id>",instance:dijit.registry.byId("<id>")})
//// *      if args is array - run $$Functions([ {id:"<id1>",instance:dijit.registry.byId("<id1>")}, {id:"<id2>",instance:dijit.registry.byId("<id2>")}, ... ])
////*/
//function $$(){                                                                                          //app.log("$$",args,this);
//    //if(typeof(args)==="function"){
//    //} else
//    if(typeof(args)==="string"&&args.trim().indexOf("#")==0){
//        var i=null;
//        if(window.dijit&&window.dijit.registry){
//            i=window.dijit.registry.byId(args.replace("#",""));
//        }else{
//            console.error("dijit/registry NOT INITIALIZED!!!"); return;
//        }
//        if(i)return i;//i.$=new $$Functions(i),i;
//        var domNode=this.domNode;
//        if(!domNode)domNode=document.body;
//        var els=domNode.getElementsByTagName("*");
//        for(var ind=0;ind<els.length;ind++){
//            var el=els[ind];
//            if("#"+el.id==args)return el;
//        }
//    }
//    //else if(typeof(args)==="object"&&args.length>0/*array*/){
//    //    var ao=[];
//    //    for (var i in args) {
//    //        var id=args[i]; ao.push({id:id,instance:dijit.registry.byId(id)})
//    //    }
//    //    return new $$Functions(ao);
//    //}
//}
app.pages={};
app.startupPage= function(pageTagID,pageScript){
    app.pages[pageTagID]=pageScript;
    //var body=document.body;
    //if(body) body.style.display="none";
    //require(["dojo/ready"],function(ready){
    //    ready(function(){                                                                                   app.log("$$ startupPage dojo/ready pageTagID=",pageTagID);//!!!IT'S FOR TESTING!!!
    //        var initParams={id:(pageTagID)?pageTagID.toString().replace("#",""):pageTagID};
    //        var page=new window.Page(initParams,initParams.id);
    //        if(body) body.style.display="";
    //        page.startup();
    //        if(!pageScript)return;
    //        page.$page.startup=pageScript;
    //        $$=page.$page;
    //        page.$page.startup(page);
    //    });
    //});
    //pageScript();
};
