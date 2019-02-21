var path = require('path'),
    tableData=require('./tableData');

module.exports= function(app) {
    app.get("/test/testTDocSimpleTable1", function (req, res) {
        res.sendFile(appPagesPath + '/testTDocSimpleTable1c.html');
    });
    app.get("/test/getDirCRsForSelect", function (req, res) {
        res.sendFile(path.join(__dirname,'/','prodsSalesCRsList.json'));
    });
    var tProdsSalesTableColumns=[
        {data: "ChID", name: "ChID", width: 50, type: "text", visible:false, dataSource:"t_SaleD"},
        {data: "OurID", name: "OurID", width: 50, type: "text", visible:false,
            dataSource:"t_Sale", sourceField:"DocID", linkCondition:"t_Sale.ChID=t_SaleD.ChID"},
        {data: "StockID", name: "StockID", width: 50, type: "text", visible:false, dataSource:"t_Sale"},
        {data: "CRID", name: "CRID", width: 50, type: "text", visible:false, dataSource:"t_Sale"},
        {data: "CRName", name: "Касса", width: 250, type: "text", visible:false,
            dataSource:"r_CRs", sourceField:"CRName", linkCondition:"r_CRs.CRID=t_Sale.CRID"},
        {data: "DocID", name: "Номер чека", width: 70, type: "text", align:"center", visible:false, dataSource:"t_Sale"},
        {data: "DocDate", name: "Дата чека", width: 55, type: "dateAsText", visible:true, dataSource:"t_Sale"},
        {data: "DocTime", name: "Дата время чека", width: 55, type: "datetimeAsText", visible:true, dataSource:"t_Sale"},
        {data: "SrcPosID", name: "Позиция", width: 50, type: "numeric", align:"right", visible:false, dataSource:"t_SaleD"},
        {data: "Barcode", name: "Штрихкод", width: 75, type: "text", align:"center", visible:false, dataSource:"t_SaleD"},
        {data: "ProdID", name: "Код товара", width: 50, type: "text", align:"center", visible:true, dataSource:"t_SaleD"},
        // {data: "Article1", name: "Артикул1 товара", width: 200, type: "text",
        //     dataSource:"r_Prods", sourceField:"Article1"},
        {data: "ProdName", name: "Наименование товара", width: 350, type: "text",
            dataSource:"r_Prods", sourceField:"ProdName", linkCondition:"r_Prods.ProdID=t_SaleD.ProdID" },
        {data: "UM", name: "Ед. изм.", width: 55, type: "text", align:"center", dataSource:"t_SaleD" },
        {data: "Qty", name: "Кол-во", width: 50, type: "numeric",source:"t_SaleD" },
        {data: "PurPriceCC_wt", name: "Цена без скидки", width: 65, type: "numeric2",source:"t_SaleD" },
        {data: "DiscountP", name: "Скидка", width: 65, type: "numeric",dataFunction:"(1-RealPrice/PurPriceCC_wt)*100" },
        {data: "RealPrice", name: "Цена", width: 65, type: "numeric2",source:"t_SaleD" },
        {data: "RealSum", name: "Сумма", width: 75, type: "numeric2",source:"t_SaleD" },
        {data: "DiscountSum", name: "Сумма скидки", width: 65, type: "numeric2",dataFunction:"(PurPriceCC_wt-RealPrice)*Qty" }
    ];
    app.get("/test/prodsSalesWDupl", function (req, res) {
        tableData.getTableDataForHTable({"1=":"1"}, tProdsSalesTableColumns, 0, 'pages/prodsSalesData.json',
            function(resData){
                res.send(resData);
            });
    });
    app.get("/test/prodsSales", function (req, res) {
        tableData.getTableDataForHTable(req.query, tProdsSalesTableColumns, 0, 'pages/prodsSalesData.json',
            function(resData){
                res.send(resData);
            });
    });
    app.get("/test/getDirStocksForSelect", function (req, res) {
        res.sendFile(path.join(__dirname,'/','pages/prodsRemsStocksList.json'));
    });
    var tProdsRemsTableColumns=[
        {data: "OurID", name: "OurID", width: 50, type: "text", visible:false, dataSource:"t_Rem"},
        {data: "StockID", name: "StockID", width: 50, type: "text", visible:false, dataSource:"t_Rem"},
        {data: "PLID", name: "PLID", width: 50, type: "text", visible:false},
        {data: "ProdChID", name: "ProdChID", width: 50, type: "text", visible:false},
        {data: "Article1", name: "Артикул1 товара", width: 200, type: "text"},
        {data: "PCatName", name: "Бренд товара", width: 140, type: "text", visible:true,
            dataSource:"r_ProdC", sourceField:"PCatName", linkCondition:"r_ProdC.PCatID=r_Prods.PCatID"},
        // {data: "PGrName", name: "Коллекция товара", width: 95, type: "text", visible:false},
        // {data: "PGrName2", name: "Тип товара", width: 140, type: "text", visible:false},
        // {data: "PGrName3", name: "Вид товара", width: 150, type: "text", visible:false},
        // {data: "PGrName1", name: "Линия товара", width: 70, type: "text", visible:false},
        //{data: "ColorName", name: "Цвет товара", width: 80, type: "text"},
        //{data: "SizeName", name: "Размер товара", width: 70, type: "text"},
        //{data: "Barcode", name: "Штрихкод", width: 75, type: "text", dataSource:"t_Rem", visible:false},
        {data: "ProdID", name: "Код товара", width: 50, type: "text", align:"center", visible:true, dataSource:"t_Rem"},
        {data: "ProdName", name: "Наименование товара", width: 350, type: "text"},
        {data: "UM", name: "Ед. изм.", width: 55, type: "text", align:"center", visible:false, dataSource:"r_Prods", sourceField:"UM"},
        {data: "TQty", name: "Кол-во", width: 50, type: "numeric"},
        {data: "PPID", name: "Партия", width: 50, type: "numeric", align:"center"},
        {data: "PriceMC", name: "Цена", width: 65, type: "numeric2", visible:true}
    ];
    app.get("/test/prodsRems", function (req, res) {
        tableData.getTableDataForHTable(req.query, tProdsRemsTableColumns, 0, 'pages/prodsRemsData.json',
            function(resData){
                res.send(resData);
            });
    });

    app.get("/test/tDocSimpleTable1", function (req, res) {
        res.sendFile(appPagesPath + '/test/testTDocSimpleTable1ip.html');
    });
    app.get("/test/tDocSimpleTable2wActions", function (req, res) {
        res.sendFile(appPagesPath + '/test/tDocSimpleTable2wActions.html');
    });
};