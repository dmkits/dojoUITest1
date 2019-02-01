var path = require('path'),fs = require('fs');
/**
 * tableColumns = [
 *      { data:<tableFieldName>, name:<tableColumnHeader>, width:<tableColumnWidth>, type:<dataType>, align:"left"/"center"/"right",
 *          useFilter:true/false default:true, readOnly:true/false, default:false, visible:true/false default:true },
 *       ...
 * ]
 * tableColumns: -<dataType> = text / html_text / text_date / text_datetime / date / numeric / numeric2 / checkbox
 *                              / combobox,sourceURL / comboboxWN,sourceURL
 * OR tableColumns: -<dataType> = text / text & dateFormat:"DD.MM.YY HH:mm:ss" / html_text / date /
 *              numeric format:"#,###,###,##0.00[#######]" language:"ru-RU" /
 *              checkbox, checkedTemplate:1, uncheckedTemplate:0 /
 *              autocomplete, strict, allowInvalid, sourceURL
 */

function getTableColumnsDataForHTable(tableColumns){
    if (!tableColumns) return tableColumns;
    var htTableColumns=[];
    for(var col=0;col<tableColumns.length;col++){
        var tableColData=tableColumns[col];
        if(!tableColData||!tableColData.data||!tableColData.name) continue;
        var thTableColumnsItem= { data:tableColData.data };
        if(tableColData.identifier!==undefined) thTableColumnsItem.identifier=tableColData.identifier;
        if(tableColData.name!==undefined) thTableColumnsItem.name=tableColData.name;
        if(tableColData.width!==undefined) thTableColumnsItem.width=tableColData.width;
        if(tableColData.type!==undefined) thTableColumnsItem.type=tableColData.type;
        if(tableColData.align!==undefined) thTableColumnsItem.align=tableColData.align;
        if(tableColData.useFilter!==undefined) thTableColumnsItem.useFilter=tableColData.useFilter;
        if(tableColData.readOnly!==undefined) thTableColumnsItem.readOnly=tableColData.readOnly;
        if(tableColData.visible!==undefined) thTableColumnsItem.visible=tableColData.visible;
        if(tableColData.format!==undefined) thTableColumnsItem.format=tableColData.format;
        //if(tableColData.trimWhitespace!==undefined) thTableColumnsItem.trimWhitespace=tableColData.trimWhitespace;
        //else thTableColumnsItem.trimWhitespace=false;
        if(tableColData.dateFormat!==undefined) thTableColumnsItem.dateFormat=tableColData.dateFormat;
        if(tableColData.datetimeFormat!==undefined) thTableColumnsItem.datetimeFormat=tableColData.datetimeFormat;
        if(tableColData.format!==undefined) thTableColumnsItem.format=tableColData.format;
        if(tableColData.language!==undefined) thTableColumnsItem.language=tableColData.language;
        if(tableColData.checkedTemplate!==undefined) thTableColumnsItem.checkedTemplate=tableColData.checkedTemplate;
        if(tableColData.uncheckedTemplate!==undefined) thTableColumnsItem.uncheckedTemplate=tableColData.uncheckedTemplate;
        if(tableColData.strict!==undefined) thTableColumnsItem.strict=tableColData.strict;
        if(tableColData.allowInvalid!==undefined) thTableColumnsItem.allowInvalid=tableColData.allowInvalid;
        if(tableColData.sourceURL!==undefined) thTableColumnsItem.sourceURL=tableColData.sourceURL;
        htTableColumns.push(thTableColumnsItem);
        if (thTableColumnsItem.type=="dateAsText"){
            thTableColumnsItem.type="text";
            //if(!tableColumnsDataItemForHTable.dateFormat) tableColumnsDataItemForHTable.dateFormat="DD.MM.YY";
            if(!thTableColumnsItem.datetimeFormat) thTableColumnsItem.datetimeFormat="DD.MM.YY";
        } else if (thTableColumnsItem.type=="datetimeAsText"){
            thTableColumnsItem.type="text";
            //if(!tableColumnsDataItemForHTable.dateFormat) tableColumnsDataItemForHTable.dateFormat="DD.MM.YY HH:mm:ss";
            if(!thTableColumnsItem.datetimeFormat) thTableColumnsItem.datetimeFormat="DD.MM.YY HH:mm:ss";
        } else if(thTableColumnsItem.type=="numeric"){
            if(!thTableColumnsItem.format) thTableColumnsItem.format="#,###,###,##0.[#########]";
            if(!thTableColumnsItem.language) thTableColumnsItem.language="ru-RU";
        } else if(thTableColumnsItem.type=="numeric2"){
            thTableColumnsItem.type="numeric";
            if(!thTableColumnsItem.format) thTableColumnsItem.format="#,###,###,##0.00[#######]";
            if(!thTableColumnsItem.language) thTableColumnsItem.language="ru-RU";
        } else if(thTableColumnsItem.type=="checkbox"){
            if(!thTableColumnsItem.checkedTemplate) thTableColumnsItem.checkedTemplate="1";
            if(!thTableColumnsItem.uncheckedTemplate) thTableColumnsItem.uncheckedTemplate="0";
        } else if(thTableColumnsItem.type=="checkboxMSSQL"){
            thTableColumnsItem.type="checkbox";
            if(!thTableColumnsItem.checkedTemplate) thTableColumnsItem.checkedTemplate="true";
            if(!thTableColumnsItem.uncheckedTemplate) thTableColumnsItem.uncheckedTemplate="false";
        } else if(thTableColumnsItem.type=="combobox"||thTableColumnsItem.type=="comboboxWN") {
            thTableColumnsItem.strict= true;
            if(thTableColumnsItem.type=="combobox") thTableColumnsItem.allowInvalid=false; else thTableColumnsItem.allowInvalid=true;
            thTableColumnsItem.filter= false;
            thTableColumnsItem.type="autocomplete";
        } else if(!thTableColumnsItem.type) thTableColumnsItem.type="text";
    }
    return htTableColumns;
}
module.exports.getTableColumnsDataForHTable=getTableColumnsDataForHTable;

module.exports.getTableDataForHTable= function(conditions, columns,identifierColInd,fileName, callback){
    var identifier=columns[identifierColInd].data;
    if(!conditions) {
        callback({columns:getTableColumnsDataForHTable(columns), identifier:identifier});
        return;
    }
    var hasConditions=false;
    for(var conditionItem in conditions){
        hasConditions=true; break;
    }
    if(!hasConditions) {
        callback({columns:getTableColumnsDataForHTable(columns), identifier:identifier});
        return;
    }
    fs.readFile(path.join(__dirname,'/',fileName), 'utf8', function (err, data) {
        if(err) {
            callback({columns:getTableColumnsDataForHTable(columns), identifier:identifier,
                error:"Failed read data from file!", userErrorMsg:"Не удалось прочитать данные из файла!"});
            return;
        }
        var jsonData = JSON.parse(data);
        callback({columns:getTableColumnsDataForHTable(columns), identifier:identifier, items:jsonData});
    });
};
