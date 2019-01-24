module.exports= function(app) {
    app.get("/", function (req, res) {
        res.sendFile(appViewsPath + 'main.html');
    });

    var mainMenu=[
        { "menuItemName":"menuBarItemRec", "menuTitle":"Приход товара", "pageTitle":"Приход товара", "module":"rec", "closable":false },
        { "menuItemName":"menuBarItemReportsProds", "menuTitle":"Товарные отчеты", "pageTitle":"Товарные отчеты", "closable":false,
            popupMenu:[
                {menuTitle:"Остатки товаров"},
                {menuItemName:"separator1"},
                {menuTitle:"Движение товаров"}
            ]
        },
        { "menuItemName":"menuBarItemReportsCashier", "menuTitle":"Отчеты кассира", "pageTitle":"Отчеты кассира", "module":"reportsCashier", "closable":false },
        { "menuItemName":"menuBarItemHelpAbout", "menuTitle":"О программе", "action":"help_about" },
        { "menuItemName":"menuBarItemClose", "menuTitle":"Выход", "action":"close" }
    ];
    app.get("/getMainData", function (req, res) {
        res.send({mainMenu:mainMenu});
    });

    app.get("/ipage1", function (req, res) {
        res.sendFile(appViewsPath + '/ipage1.html');
    });
    app.get("/ipage2", function (req, res) {
        res.sendFile(appViewsPath + '/ipage2.html');
    });

    app.get("/sysadmin", function (req, res) {
        res.sendFile(appViewsPath + '/sysadmin.html');
    });
    app.get("/sysadmin/startupConfig", function (req, res) {
        res.sendFile(appViewsPath + '/sysadmin/startupConfig.html');
    });
    app.get("/sysadmin/Database", function (req, res) {
        res.sendFile(appViewsPath + '/sysadmin/database.html');
    });
    var tDBCurrentChangesData={
        columns:[
            {data: "changeID", name: "changeID", width: 200, type: "text"},
            {data: "changeDatetime", name: "changeDatetime", width: 120, type:"text", datetimeFormat:"YYYY-MM-DD HH:mm:ss"},
            {data: "changeObj", name: "changeObj", width: 200, type: "text"},
            {data: "changeVal", name: "changeVal", width: 450, type: "text"},
            {data: "type", name: "type", width: 100, type: "text"},
            {data: "message", name: "message", width: 200, type: "text"}
        ],
        identifier:"changeID",
        items:[
            {changeID:"1",changeObj:"o1",changeVal:"QWErtyUIOP",type:"applied",message:"msg1"},
            {changeID:"1-2",changeObj:"oo12",changeVal:"ASDfghJKL",type:"new",message:"msg22"},
            {changeID:"1-2-3",changeObj:"ooo123",changeVal:"1234567890",type:"new",message:"msg333"}
        ]
    };
    app.get("/sysadmin/Database/getCurrentChanges", function (req, res) {
        res.send(tDBCurrentChangesData);
    });
    app.get("/sysadmin/DatabaseNEW", function (req, res) {
        res.sendFile(appViewsPath + '/sysadmin/databaseNEW.html');
    });
};