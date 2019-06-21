var path = require('path'),
    tableData=require('./tableData');

var server=require('./server_dojoUITest'), getLoadInitModulesError=server.getLoadInitModulesError, log = server.log,
    appParams=server.getAppStartupParams(),
    getSysConfig=server.getSysConfig, setSysConfig=server.setSysConfig,loadSysConfig=server.loadSysConfig,
    getAppConfig=server.getAppConfig;
var common=require('./common'); //common=require('../common'), database=require('../databaseMSSQL');

var getDBValidateError=function(){
        return "Validation failed! Reason:IN TESTING No database system connection!";
    },
    test_dbSysConnErr="TEST NOT USED DATABASE!";

module.exports= function(app){
    app.get("/sysadmin",function(req,res){
        res.sendFile(appViewsPath + '/sysadmin.html');
    });
    app.get("/sysadmin/sysState", function(req, res){
        var revalidateModules= false;
        if (req.query&&req.query["REVALIDATE"]) revalidateModules= true;
        var outData= {};
        outData.mode= appParams.mode;
        outData.port=appParams.port;
        outData.dbUserName=req.dbUserName;
        var sysConfig=getSysConfig();
        if (!sysConfig||sysConfig.error){
            outData.error= (sysConfig&&sysConfig.error)?sysConfig.error:"unknown";
            res.send(outData);
            return;
        }
        outData.sysConfig= sysConfig;
        outData.appConfig=getAppConfig();
        var dbSysConnErr= test_dbSysConnErr;//database.getSystemConnectionErr();
        if(dbSysConnErr){
            outData.dbSysConnErr= dbSysConnErr;
            outData.dbValidationErr = "Validation failed! Reason:No database system connection!";
            res.send(outData);
            return
        }
        var loadInitModulesError=getLoadInitModulesError();
        if(loadInitModulesError) outData.modulesFailures = loadInitModulesError;
        if(revalidateModules){
            //appModules.validateModules(function(errs, errMessage){
            //    if(errMessage) outData.dbValidation = errMessage; else outData.dbValidation = "success";
            //    res.send(outData);
            //});
            outData.dbValidation = getDBValidateError();//"success";
            res.send(outData);
            return;
        }
        var dbValidateErr=getDBValidateError();
        if(dbValidateErr) outData.dbValidationErr=dbValidateErr; else outData.dbValidation = "success";
        res.send(outData);
    });

    app.get("/sysadmin/sysConfig",function(req,res){
        res.sendFile(appViewsPath + '/sysadmin/sysConfig.html');
    });
    app.get("/sysadmin/sysConfig/getSysConfig",function(req,res){
        var sysConfig=getSysConfig();
        if (!sysConfig||sysConfig.error) {
            res.send({error:(sysConfig&&sysConfig.error)?sysConfig.error:"unknown"});
            return;
        }
        res.send(sysConfig);
    });
    var dbList=[{"name":"GMSData38"},
        {"name":"GMSData38btkKlnk"},
        {"name":"GMSData38btkSKidsNP"},
        {"name":"GMSData38ret3510"},
        {"name":"GMSDev380305kita"},
        {"name":"GMSDev38Btk380307GS"},
        {"name":"GMSDev38klnkCB74"},
        {"name":"GMSDev38Rest3_8_0_26_GnCrv"},
        {"name":"GMSDev38Rest3_8_0_326_GnCrvPOS2"},
        {"name":"GMSDev38Rest3_8_0_326_GnCrvPOS3"},
        {"name":"GMSDev38Rest3_8_0_326_GnCrvPOS4"},
        {"name":"GMSSample38"},
        {"name":"GMSSample38btkGsua"},
        {"name":"GMSTest38Btk380260op"},
        {"name":"GMSTest38Btk380307GS"},
        {"name":"GMSTest38Btk380307GS_atz"},
        {"name":"GMSTest38Btk380307GScb65_20181215"},
        {"name":"GMSTest38Btk380307GScb80_20190419"},
        {"name":"GMSTest38Btk380307GScb81_20190520"},
        {"name":"GMSTest38Rest3_8_0_260_KKPOS1"},
        {"name":"GMSTest38Ret315bp"},
        {"name":"GMSTest38Rtl380307Tit20190205"},
        {"name":"GMSTestBtk35pdm"},
        {"name":"GMSTestRestkk"},
        {"name":"GMSTestRestkkPOS"},
        {"name":"GMSTestRet315bpMN7"},
        {"name":"servicedesk"},
        {"name":"TestArtur"}
    ];
    app.get("/sysadmin/sysConfig/getDBList",function(req,res){
        //database.selectQuery(database.getDBSystemConnection(),
        //    "select	name "+
        //    "from sys.databases "+
        //    "where name not in ('master','tempdb','model','msdb') and is_distributor = 0 and source_database_id is null",
        //    function(err,recordset){
        //        if(err){
        //            res.send({error:err.message});
        //            return;
        //        }
        //        res.send({dbList:recordset});
        //    });
        res.send({dbList:dbList});
    });
    app.get("/sysadmin/sysConfig/loadSysConfig",function(req,res){
        loadSysConfig();
        var sysConfig=getSysConfig();                                                               log.info("sysConfig=",sysConfig);
        if(!sysConfig){
            res.send({error: "Failed load server config!"});
            return;
        }
        res.send(sysConfig);
    });
    app.post("/sysadmin/sysConfig/storeSysConfigAndReconnectToDB",function(req,res){
        var newSysConfig = req.body,
            currentDbName=server.getSysConfig().database, currentDbHost=server.getSysConfig().host;
        common.saveConfig(appParams.mode+".cfg", newSysConfig,
            function(err){
                var outData = {};
                if(err){
                    outData.error = "Failed to store system config. Reason: "+err+". New system config not applied!";
                    res.send(outData);
                    return;
                }
                //if(!(currentDbName==newSysConfig.database) || !(currentDbHost==newSysConfig.host)) database.cleanConnectionPool();
                setSysConfig(newSysConfig);
                //database.setDBSystemConnection(newSysConfig, function(err,result){
                //    if(err){
                //        outData.message="System config stored and applied.";
                //        outData.dbSysConnErr = "Failed connect to database! Reason: "+err.error;
                //        res.send(outData);
                //        return;
                //    }
                //    outData.message="System config stored and system reconnect to database with new system config.";
                //    appModules.validateModules(function (errs, errMessage){
                //        if(errMessage) outData.dbValidation = errMessage;
                //        res.send(outData);
                //    });
                //});
                outData.message="System config stored and applied.";
                outData.dbSysConnErr = test_dbSysConnErr;//"Failed connect to database! Reason: "+err.error;
                outData.dbValidation = getDBValidateError();//errMessage;
                res.send(outData);
            });
    });

    app.get("/sysadmin/Database",function(req,res){
        res.sendFile(appViewsPath + '/sysadmin/database.html');
    });
    app.get("/sysadmin/Database/get1",function(req,res){
        res.send();
    });
    var tDBCurrentChangesColumns=[
        {data: "changeID", name: "changeID", width: 200, type: "text"},
        {data: "changeDatetime", name: "changeDatetime", width: 120, type:"text", datetimeFormat:"YYYY-MM-DD HH:mm:ss"},
        {data: "changeObj", name: "changeObj", width: 200, type: "text"},
        {data: "changeVal", name: "changeVal", width: 450, type: "text"},
        {data: "type", name: "type", width: 100, type: "text"},
        {data: "message", name: "message", width: 200, type: "text"}
    ];
    app.get("/sysadmin/Database/getCurrentChanges",function(req,res){
        tableData.getTableDataForHTable({"1~":1}, tDBCurrentChangesColumns, 0, 'currentChangesItems.json',
            function(tDBCurrentChangesData){
                for(var i = 0; i < tDBCurrentChangesData.items.length; i++){
                    var tDBCurChangeDataItem = tDBCurrentChangesData.items[i];
                    if(!tDBCurChangeDataItem.type) tDBCurChangeDataItem.type="new";
                }
                res.send(tDBCurrentChangesData);
            });
    });
    app.post("/sysadmin/Database/applyChange",function(req,res){
        var changeID=req.body["CHANGE_ID"];
        if(changeID=="1-2") res.send({resultItem:{"ID":changeID,"CHANGE_MSG":"Applied "+changeID+"!"}});
        else if(changeID=="1-2-3") res.send({resultItem:{"CHANGE_MSG":"FAILED result for "+changeID+"!"}});
        else res.send();
    });
    app.get("/sysadmin/DatabaseNEW",function(req,res){
        res.sendFile(appViewsPath + '/sysadmin/databaseNEW.html');
    });

    app.get("/sysadmin/logins",function(req,res){
        res.sendFile(appViewsPath + '/sysadmin/logins.html');
    });
    var userVisiblePass="****************",
        loginsTableColumns=[
            {data: "UserID", name: "UserID", width: 65, type: "numeric",align:"center", readOnly:true, visible:true},
            {data: "UserName", name: "User name", width: 250, type: "text", readOnly:true},
            {data: "EmpID", name: "EmpID", width: 65, type:"numeric",align:"center", dataSource:"r_Users", readOnly:true, visible:false},
            {data: "EmpName", name: "Employee name", width: 300, type: "text", readOnly:true,
                dataSource:"r_Emps",linkCondition:"r_Emps.EmpID=r_Users.EmpID"},
            {data: "ShiftPostID", name: "User role", width: 120, dataSource:"r_Emps", visible:false},
            {data: "ShiftPostName", name: "User role", width: 120,
                dataSource:"r_Uni", sourceField:"RefName", linkCondition:"r_Uni.RefTypeID=10606 and r_Uni.RefID=r_Emps.ShiftPostID",
                type: "combobox", sourceURL:"/sysadmin/logins/getDataForUserRoleCombobox"},
            {data: "suname", name: "DB User Name", width: 250, type: "text", readOnly:true, visible:false,
                childDataSource:"sysusers", sourceField:"name",
                childLinkCondition:"sysusers.islogin=1 and (sysusers.name=r_Users.UserName or (sysusers.Name='dbo' and r_Users.UserName='sa'))"},
            {data: "login", name: "login", width: 150, type: "text", readOnly:true,
                childDataSource:"sys.server_principals", sourceField:"name",
                childLinkCondition:"sys.server_principals.type in ('S','U') and sys.server_principals.sid=sysusers.sid"},
            {data: "lPass", name: "Password", width: 150, type: "text",
                dataSource:"sys.server_principals", dataFunction:"CASE When sys.server_principals.sid is Null Then '' else '"+userVisiblePass+"' END"},
            {data: "PswrdNote", name: "Password note", width: 150, type: "text", readOnly:true, visible:true,
                childDataSource:"ir_UserData", sourceField:"pswrdNote",
                childLinkCondition:"ir_UserData.UserID=r_Users.UserID"},
            {data: "is_disabled", name: "Disabled", width: 75, type: "checkboxMSSQL",
                dataSource:"sys.server_principals", sourceField:"is_disabled"}
        ];
    app.get("/sysadmin/logins/getLoginsDataForTable",function(req,res){
        tableData.getTableDataForHTable({"1~":1}, loginsTableColumns, 0, 'loginsItems.json',
            function(loginsTableColumns){
                res.send(loginsTableColumns);
            });
    });
};