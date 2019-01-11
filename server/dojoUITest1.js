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
};