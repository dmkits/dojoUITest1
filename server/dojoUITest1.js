module.exports= function(app) {
    app.get("/", function (req, res) {
        res.sendFile(appViewsPath + 'main.html');
    });
    app.get("/ipage1", function (req, res) {
        res.sendFile(appViewsPath + '/ipage1.html');
    });
    app.get("/ipage2", function (req, res) {
        res.sendFile(appViewsPath + '/ipage2.html');
    });

    app.get("/mobileInvent/viewInvent", function (req, res) {
        res.sendFile(appViewsPath + 'mobile/viewInvent.html');
    });
};