/**
 * Created by dmkits on 30.12.16.
 */
define(["dojo/request", "app/base","app/dialogs"],
    function(request, base, dialogs) {
        return {
            jsonHeader: {"X-Requested-With":"application/json; charset=utf-8",
                'Content-Type': 'application/x-www-form-urlencoded'},
            showRequestErrorDialog: false,
            /** getJSON
             * params = { url, condition, headers, handleAs, timeout, consoleLog }
             * default headers=this.jsonHeader, handleAs="json"
             * if success : callback(true,data), if not success callback(false,error)
             * @param params
             * @param callback
             */
            getJSON: function(params,callback){
                if (!params) return;
                var url= params["url"],condition=params["condition"],consoleLog=params["consoleLog"],timeout=params["timeout"];
                if(condition && typeof(condition)==="object"){
                    var scondition;
                    for(var condItem in condition){
                        if (condition[condItem]!==undefined&&condition[condItem]!==null)
                            scondition = (!scondition) ? condItem+"="+condition[condItem] : scondition+"&"+condItem+"="+condition[condItem];
                    }
                    if (scondition) url=url+"?"+scondition;
                } else if(condition) url=url+"?"+condition;
                var requestParams={headers: this.jsonHeader, handleAs: "json"};
                if(params.handleAs) requestParams.handleAs=params.handleAs;
                if(params.headers) requestParams.headers=params.headers;
                if(params.timeout) requestParams.timeout=params.timeout;
                request.get(url, requestParams).then(
                    function(respdata){
                        if(callback)callback(true, respdata);
                    }, function(resperror){
                        if(consoleLog) console.log("getJSON ERROR! url=",url," error=",resperror);
                        if(callback)callback(false, resperror);
                    })
            },
            /** getJSONData
             * params = { url, condition, timeout, showRequestErrorDialog, consoleLog, resultItemName }
             * default: params.showRequestErrorDialog = true, params.consoleLog = true
             * resultCallback = function(result, error)
             *  result = undefined if request failed
             *  result = null if result is empty or result error (parameter error exists)
             *  result = response result if no params.resultItemName
             *  OR result = response result[params.resultItemName] if exists params.resultItemName
             */
            getJSONData: function(params, resultCallback){
                if (!params) return;
                var requestFailDialog, self=this;
                if (params.showRequestErrorDialog!==false)
                    requestFailDialog= function(msg){
                        self.doRequestFailDialog({title:"Внимание",content:"Невозможно получить данные! <br>Причина:"+msg});
                    };
                this.getJSON(params,function(success, serverResult){
                    if(!success){
                        if(requestFailDialog) requestFailDialog("Нет связи с сервером!");
                        resultCallback();
                        return;
                    }
                    if(!serverResult){
                        if(requestFailDialog) requestFailDialog("Нет данных с сервера!");
                        resultCallback(null);
                        return;
                    }
                    if(serverResult.error){
                        var msg=serverResult.error;
                        if(serverResult.errorMsg) msg= serverResult.errorMsg+"<br>"+msg;
                        if(serverResult.userErrorMsg)msg=serverResult.userErrorMsg;
                        if(params.consoleLog) console.log("getJSONData DATA ERROR! url=",params.url," error=",msg);
                        if(requestFailDialog) requestFailDialog(msg);
                        resultCallback((params.resultItemName)?serverResult[params.resultItemName]:serverResult, serverResult.error);
                        return;
                    }
                    if(params.resultItemName&&serverResult[params.resultItemName]===undefined){
                        if(params.consoleLog) console.log("getJSONData DATA ERROR! url=",params.url," No result!");
                        if(requestFailDialog) requestFailDialog("Нет данных с сервера!");
                        resultCallback(null);
                        return;
                    }
                    if(params.resultItemName){
                        resultCallback(serverResult[params.resultItemName]);
                        return;
                    }
                    resultCallback(serverResult);
                });
            },

            /** postData
             * params = { url, condition, data, headers, handleAs, timeout, consoleLog }
             * if success : callback(data),
             * if not success callback(undefined,error)
             */
            postData: function (params,callback){
                if(!params)return;
                var url= params["url"],condition=params["condition"],consoleLog=params["consoleLog"];
                if(condition && typeof(condition)==="object"){
                    var scondition;
                    for(var condItem in condition){
                        if (condition[condItem]!==undefined&&condition[condItem]!==null)
                            scondition = (!scondition) ? condItem+"="+condition[condItem] : scondition+"&"+condItem+"="+condition[condItem];
                    }
                    if (scondition) url=url+"?"+scondition;
                } else if(condition) url=url+"?"+condition;
                var requestParams={data:params["data"]};
                if(params.handleAs) requestParams.handleAs=params.handleAs;
                if(params.headers) requestParams.headers=params.headers;
                if(params.timeout) requestParams.timeout=params.timeout;
                request.post(url, requestParams).then(
                    function(respData){
                        if(callback)callback(respData);
                    }, function(reqErr){
                        if(consoleLog) console.error("Request postData ERROR! url=",url," error=",reqErr);
                        if(callback)callback(undefined,reqErr);
                    })
            },
            /** postJSON
             * params = { url, condition, data, timeout, consoleLog, showRequestErrorDialog }
             * if success : callback(jsonData),
             * if not success callback(undefined,error)
             */
            postJSON: function (params,callback){
                if (!params) return;
                params.handleAs="json"; params.headers=this.jsonHeader;
                this.postData(params,callback);
            },
            /** postJSONData
             * params = { url, condition, timeout, showRequestErrorDialog, data, resultItemName }
             * default: params.showRequestErrorDialog = true
             * resultCallback = function(result, error), error = { reqError/srvError, message, errorMsg,userErrorMsg }
             *      result = response result if request success and has result and no params.resultItemName,
             *          error.srvError contained server error, message contained userErrorMsg/errorMsg from server if post request returned error
             *      OR result = result[params.resultItemName] if request success and has result and exists params.resultItemName,
             *          error.srvError contained server error, message contained userErrorMsg/errorMsg from server if post request returned error
             *      result = response result if request success and no response result
             *  result = undefined if request failed, error.reqError,error.message present
             */
            postJSONData: function (params,resultCallback){
                if (!params) return;
                var requestFailDialog, self=this;
                if(params.showRequestErrorDialog!==false)
                    requestFailDialog= function(msg, reason){
                        if(!reason) reason="";
                        self.doRequestFailDialog({title:"Внимание",content:msg+" <br>Причина:"+reason});
                    };
                this.postJSON(params,function(respJSON,error){
                    if(!error&&respJSON&&!respJSON.error&&!params.resultItemName){
                        resultCallback(respJSON);
                        return;
                    }else if(!error&&respJSON&&!respJSON.error&&params.resultItemName){
                        var postRes=respJSON[params.resultItemName];
                        if((postRes===undefined||postRes===null)&&requestFailDialog)
                            requestFailDialog("Невозможно получить результат операции!","Нет данных результата операции с сервера!");
                        resultCallback(postRes);
                        return;
                    }else if(!error&&respJSON&&respJSON.error){
                        var postRes=(!params.resultItemName)?respJSON:respJSON[params.resultItemName],
                            postErr={srvError:respJSON.error}, dlgMsg=respJSON.error;
                        if(respJSON.errorMsg) {
                            dlgMsg=respJSON.errorMsg + "<br>" + dlgMsg;
                            postErr.message=respJSON.errorMsg;postErr.errorMsg=respJSON.errorMsg;
                        }
                        if(respJSON.userErrorMsg){
                            dlgMsg=respJSON.userErrorMsg;
                            postErr.message=respJSON.userErrorMsg;postErr.userErrorMsg=respJSON.userErrorMsg;
                        }
                        if(requestFailDialog) requestFailDialog("Невозможно выпонить операцию!",dlgMsg);
                        resultCallback(postRes,postErr);
                        return;
                    }else if(!error&&!respJSON){
                        if (requestFailDialog) requestFailDialog("Невозможно получить результат операции!","Нет данных с сервера!");
                        resultCallback(null);
                        return;
                    }
                    //if error
                    var msg = (error.response&&error.response.status==404)?"Некорретный ответ сервера!":"Нет связи с сервером!",
                        postErr=(error.message)?error.message:error;
                    if(requestFailDialog) requestFailDialog("Невозможно получить результат операции!",msg);
                    resultCallback(undefined,{reqError:postErr,message:msg});
                })
            },
            doRequestFailDialog: function(params){
                if(!params) params={};
                params.dialogID="requestFailDialog";
                params.width=350;
                params.btnOkLabel="Закрыть";
                var instance= base.getInstanceByID(params.dialogID);
                if(instance&&instance.open)return;
                dialogs.showSimple(params);
            }
        };
    });