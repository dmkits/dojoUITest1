var path = require('path');

module.exports= function(app) {
    app.post("/test/post1", function (req, res) {
        res.send('TEXT qwe0123RTY456uio789p[]');
    });
    app.get("/test/getUndef", function (req, res) {
        res.send();
    });
    app.post("/test/postUndef", function (req, res) {
        res.send();
    });
    app.get("/test/getNull", function (req, res) {
        res.send(null);
    });
    app.post("/test/postNull", function (req, res) {
        res.send(null);
    });
    app.get("/test/getNum0", function (req, res) {
        res.send(0);
    });
    app.post("/test/postNum0", function (req, res) {
        res.send(0);
    });
    app.get("/test/getNum0123", function (req, res) {
        res.send(0123);
    });
    app.post("/test/postNum0123", function (req, res) {
        res.send(0123);
    });
    app.get("/test/getNumL", function (req, res) {
        res.send(01234567890);
    });
    app.post("/test/postNumL", function (req, res) {
        res.send(01234567890);
    });
    app.get("/test/getStrE", function (req, res) {
        res.send("");
    });
    app.post("/test/postStrE", function (req, res) {
        res.send("");
    });
    app.get("/test/getStr0", function (req, res) {
        res.send("0");
    });
    app.post("/test/postStr0", function (req, res) {
        res.send("0");
    });
    app.get("/test/getStr1", function (req, res) {
        res.send("1");
    });
    app.post("/test/postStr1", function (req, res) {
        res.send("1");
    });
    app.get("/test/getStrNumL", function (req, res) {
        res.send("1234567890");
    });
    app.post("/test/postStrNumL", function (req, res) {
        res.send("1234567890");
    });
    app.get("/test/getDate", function (req, res) {
        res.send(new Date());
    });
    app.post("/test/postDate", function (req, res) {
        res.send(new Date());
    });

    app.get("/test/getJSONobjE", function (req, res) {
        res.send({});
    });
    app.post("/test/postJSONobjE", function (req, res) {
        res.send({});
    });
    app.get("/test/getJSONarrE", function (req, res) {
        res.send([]);
    });
    app.post("/test/postJSONarrE", function (req, res) {
        res.send([]);
    });
    var jsonArrObjs=[
        { "menuItemName":"menuBarItemRec", "menuTitle":"Приход товара", "pageTitle":"Приход товара", "module":"rec", "closable":true },
        { "menuItemName":"menuBarItemReportsProds", "menuTitle":"Товарные отчеты", "pageTitle":"Товарные отчеты", "closable":true,
            popupMenu:[
                {menuTitle:"Остатки товаров", "pageTitle":"Остатки товаров", "closable":true},
                {menuItemName:"separator1"},
                {menuTitle:"Движение товаров", "pageTitle":"Движение товаров", "closable":true}
            ]
        },
        { "menuItemName":"menuBarItemReportsCashier", "menuTitle":"Отчеты кассира", "pageTitle":"Отчеты кассира", "module":"reportsCashier", "closable":false },
        { "menuItemName":"menuBarItemHelpAbout", "menuTitle":"О программе", "action":"help_about" },
        { "menuItemName":"menuBarItemClose", "menuTitle":"Выход", "action":"close" }
    ];
    app.get("/test/getJSONarrObjs", function (req, res) {
        res.send({jsonArrObjs:jsonArrObjs});
    });
    app.post("/test/postJSONarrObjs", function (req, res) {
        res.send({jsonArrObjs:jsonArrObjs});
    });

    app.get("/test/getDataErr", function (req, res) {
        res.send({error:"DATA ERROR"});
    });
    app.get("/test/getDataErrObj", function (req, res) {
        res.send({ error:{message:"DATA ERROR MESSAGE"} });
    });
    app.get("/test/getDataErrObjE", function (req, res) {
        res.send({ error:{} });
    });
    app.get("/test/getDataErrObjWUM", function (req, res) {
        res.send({ error:{message:"DATA ERROR MESSAGE", userMessage:"DATA ERROR USER MESSAGE"} });
    });
    app.get("/test/getDataErrObjWRes", function (req, res) {
        res.send({ res1:"RESULT 1 STR", error:{message:"DATA ERROR MESSAGE", userMessage:"DATA ERROR USER MESSAGE"} });
    });


};