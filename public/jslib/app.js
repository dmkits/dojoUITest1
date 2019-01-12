var body=document.body;
if(body) body.style.display="none";
var global=window;                                                                                          console.log("app",this);//!!!IT'S FOR TESTING!!!
require(["dijit/registry","app/Page","app/InnerPage","app/dialogs","app/request"],
    function (registry,Page,InnerPage,dialogs,request){
        global.$$.dialogs= dialogs;
        global.$$.request= request;
    });                                                                                                     console.log("global=window=",window);

///**
// * args = function | "<id>" | ["<id1>","<id2>", ... ]
// *      if args function - run function in callback require ["dojo/ready"]
// *      if args  = "<id>" - run $$Functions({id:"<id>",instance:dijit.registry.byId("<id>")})
// *      if args is array - run $$Functions([ {id:"<id1>",instance:dijit.registry.byId("<id1>")}, {id:"<id2>",instance:dijit.registry.byId("<id2>")}, ... ])
//*/
function $$(){                                                                                          //console.log("$$",args,this);
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
}
$$.startupPage= function(pageTagID,pageScript){
    var body=document.body;
    if(body) body.style.display="none";
    require(["dojo/ready"],function(ready){
        ready(function(){                                                                                   console.log("$$ startupPage dojo/ready pageTagID=",pageTagID);//!!!IT'S FOR TESTING!!!
            var initParams={id:(pageTagID)?pageTagID.toString().replace("#",""):pageTagID};
            var page=new global.Page(initParams,initParams.id);
            if(body) body.style.display="";
            page.startup();
            if(!pageScript)return;
            page.$page.startup=pageScript;
            var dialogs=global.$$.dialogs,request=global.$$.request
            $$=page.$page;
            $$.dialogs=dialogs;$$.$dialogs=dialogs;
            $$.request=request;$$.$request=request;
            page.$page.startup(page);
        });
    });
};
