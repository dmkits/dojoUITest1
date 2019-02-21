var startDateTime=new Date(), startTime=startDateTime.getTime();                                            console.log('TEST SERVER STARTING at ',startDateTime );//test

var path = require('path'), fs = require('fs'), dateformat =require('dateformat'),
    log = require('winston');
log.configure({
    transports: [
        new (log.transports.Console)({ colorize: true,level:'silly', timestamp: function() {
            return dateformat(Date.now(), "yyyy-mm-dd HH:MM:ss.l");
        } })
    ]
});
module.exports.log=log;                                                                                     log.info('Modules path, fs, dateformat, winston, util loaded' );//test

var express = require('express');                                                                           log.info('express loaded on ', new Date().getTime()-startTime );//test
var server = express();
server.use(function (req, res, next) {
    next();
});
var bodyParser = require('body-parser');                                                                    log.info('body-parser loaded on ', new Date().getTime()-startTime );//test
var cookieParser = require('cookie-parser');                                                                log.info('cookie-parser loaded on ', new Date().getTime()-startTime );//test
server.use(cookieParser());
server.use(bodyParser.urlencoded({extended: true,limit: '5mb'}));
server.use(bodyParser.json({limit: '5mb'}));
server.use(bodyParser.text({limit: '5mb'}));
server.use('/', express.static('../public'));
//server.set('view engine','ejs');
server.use(function (req, res, next) {                                                                      log.info("req:",req.method,req.path,"params=",req.query,{});//log.info("req.headers=",req.headers,"req.cookies=",req.cookies,{});
    next();
});
server.use('/test', express.static('pages'));

global.appPagesPath= path.join(__dirname,'/../pages/','');
global.appModulesPath= path.join(__dirname,'/modules/','');

require('./serverTestRequest')(server);
require('./serverTestDocSimpleTable')(server);

var serverPort=8181;
server.listen(serverPort, function (err) {
    if(err){
        console.log("listen port err= ", err);
        return;
    }
    console.log("TEST SERVER runs on port "+serverPort+" on "+(new Date().getTime()-startTime));
    log.info("TEST SERVER runs on port "+serverPort+" on "+(new Date().getTime()-startTime));
});

process.on("uncaughtException", function(err){
    log.error("uncaughtException",err);
    console.log("uncaughtException=",err);
});                                                                                                         log.info("TEST SERVER inited.");

