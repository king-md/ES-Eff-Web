// ==UserScript==
// @name         Desktop Thumbprint Cache Page - New Layout
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  New layout for the Desktop TP Cache Page
// @author       mking
// @include      http://desk-report.es.global.sonicwall.com/desktop-cache.jsp
// @grant        none
// ==/UserScript==
/* jshint -W097 */
'use strict';

var tpGroupAll = ["ALL"];
var tpGroupIP = ["IP","I4","I6","WH","W6","PB","SB","XB","P6","S6","X6"];
var tpGroupText = ["DT","DB","AT","HT","TT","VR","IM","NM","CT","PH"];
var tpStatusList = ["1","2","3",/*"4","5",*/"p","v","g","w"/*,"d"*/];
var tpServerList = ["sjl0vm-desk01", "sjl0vm-desk02", "sjl0vm-desk03", "sjl0vm-desk04", "sjl0vm-desk05"];

var all = document.getElementsByTagName("*");

var elementsPageB = document.getElementsByTagName("b");
var elementsPageBody = document.getElementsByTagName("body");
var elementsPageBr = document.getElementsByTagName("br");
var elementsPageCaption = document.getElementsByTagName("caption");
var elementsPageCenter = document.getElementsByTagName("center");
var elementsPageH1 = document.getElementsByTagName("h1");
var elementsPageHead = document.getElementsByTagName("head");
var elementsPageHTML = document.getElementsByTagName("html");
var elementsPageMeta = document.getElementsByTagName("meta");
var elementsPageTable = document.getElementsByTagName("table");
var elementsPageTitle = document.getElementsByTagName("title");

var elementsPageTBody = document.getElementsByTagName("tbody");
var elementsPageTr = document.getElementsByTagName("tr");
var elementsPageTd = document.getElementsByTagName("td");
var elementsPageDiv = document.getElementsByTagName("div");
var elementsPageSpan = document.getElementsByTagName("span");
var elementsPageForm = document.getElementsByTagName("form");
var elementsPageInput = document.getElementsByTagName("input");

var pageTitle = elementsPageTitle[0].innerHTML;
var pageHeader = elementsPageH1[0].innerHTML;
var serverName = elementsPageTd[1].innerHTML;
var lastCacheUpdateTime = elementsPageTd[3].innerHTML;
var totalTPCount = ~~(elementsPageTd[5].innerHTML.replace(/\,/g, ""));

var tpTypes = [];
var tpTypesTotalCount = [];

for( var i =  7; i < elementsPageTd.length; i++ )
{
    var tdText = elementsPageTd[i].innerHTML;
    if( tdText.match(/^[A-Z][A-Z0-9] :/) )
    {
        var strAr = tdText.split(":",2);
        var tpType = strAr[0].trim();
        var tpTypeTotalCount = Number(strAr[1].trim().replace(/\,/g, ""));
        tpTypes.push(tpType);
        tpTypesTotalCount[tpType] = tpTypeTotalCount;
    }
    else
        break;
}

var tpTypeStatusMatrix = [];

var tpTypeIndex = -1;
for( var k = 7 + tpTypes.length; k < elementsPageTd.length; k++ )
{
    var myDivElements = elementsPageTd[k].getElementsByTagName("div");
    var tpStatusColumn = [];
    for( var l = 0; l < myDivElements.length; l++ )
    {
        var theStatusItem = myDivElements[l].innerHTML.split(":",3);
        tpStatusColumn[theStatusItem[0].trim()] = ~~(theStatusItem[1].concat(":",theStatusItem[2]).replace(/<[^>]*>/g,'').trim().replace(/\,/g, ""));
    }
    if( -1 == tpTypeIndex )
        tpTypeStatusMatrix["ALL"] = tpStatusColumn;
    else
        tpTypeStatusMatrix[tpTypes[tpTypeIndex]] = tpStatusColumn;
    tpTypeIndex++;
}


function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}



function doRow(tt)
{
    var ttValuesStr = "";
    var ttValuesArr = tpTypeStatusMatrix[tt];
    tpStatusList.forEach(function(stType){
        if( stType in ttValuesArr )
            ttValuesStr += " <div id=\"" + tt + "_" + stType + "\" class=\"tp_column\">" + numberWithCommas(ttValuesArr[stType]) + "</div>\n";
        else
            ttValuesStr += " <div id=\"" + tt + "_" + stType + "\" class=\"tp_column\">&nbsp;</div>\n";
    });
    return ttValuesStr;
}



function add(a, b)
{
    return a + b;
}



function totalRow( r )
{
    var total = 0;
    tpStatusList.forEach(function(stType){
        if( stType in r )
            total += r[stType];
    });
    if( total > 0 )
        return numberWithCommas( total );
    else
        return "&nbsp;";
}



var newHTML = "";
newHTML += "<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.01 Transitional//EN\">\n";
newHTML += "\n";
newHTML += "<html>\n";
newHTML += "<head>\n";
newHTML += "<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf8\" />\n";
newHTML += "<title>"+ serverName +" - Sonicwall Desktop Lookup Server - HACKED</title>\n";
newHTML += "</head>\n";
newHTML += "<body>\n";

newHTML += "<div class=\"bannerStrip\">\n";
newHTML += "    <div class=\"logoBox\">\n";
newHTML += "        <div class=\"pageLogo\"><img src=\"https://procureinsights.files.wordpress.com/2011/07/idea-storm.png\"></div>\n";
newHTML += "        <div class=\"pagePipe\"><img src=\"/pics/branding/logo.pipe.png?rand=1\"></div>\n";
newHTML += "        <div class=\"pageTitle\">Email Security</div>\n";
newHTML += "    </div>\n";
newHTML += "</div>\n";

newHTML += "<div class=\"headline\">\n";
newHTML += "    Desktop Thumbprint Cache\n";
newHTML += "</div>\n";

newHTML += "<div class=\"summary_table\">\n";
newHTML += "    <div class=\"summary_header_row\">\n";
newHTML += "        <div class=\"summary_column\">\n";
newHTML += "            Server\n";
newHTML += "        </div>\n";
newHTML += "        <div class=\"summary_column\">\n";
newHTML += "            Last update (UTC)\n";
newHTML += "        </div>\n";
newHTML += "        <div class=\"summary_column\">\n";
newHTML += "            Thumbprints\n";
newHTML += "        </div>\n";
newHTML += "    </div>\n";
newHTML += "    <div class=\"summary_value_row_odd\">\n";
newHTML += "        <div class=\"summary_column\">\n";
newHTML += "            " + serverName + "\n";
newHTML += "        </div>\n";
newHTML += "        <div class=\"summary_column\">\n";
newHTML += "            " + lastCacheUpdateTime + "\n";
newHTML += "        </div>\n";
newHTML += "        <div class=\"summary_column\">\n";
newHTML += "            " + totalTPCount + "\n";
newHTML += "        </div>\n";
newHTML += "    </div>\n";
newHTML += "</div>\n";

newHTML += "<div class=\"vert_spacer\">\n";
newHTML += "</div>\n";

newHTML += "<div class=\"tp_table\">\n";

newHTML += "<div class=\"tp_head_row\">\n";

newHTML += "<div id=\"blank\" class=\"tp_lead_column\">&nbsp;</div>\n<div class=\"tp_column_narrow\">&nbsp;</div>\n<div class=\"tp_column_totals\">Totals</div>\n<div class=\"tp_column_narrow\">&nbsp;</div>\n";
tpStatusList.forEach(function(tpStatusType){
    newHTML += "<div id=\"" + tpStatusType + "\" class=\"tp_column\">" + tpStatusType + "</div>\n";
});
newHTML += "</div>\n";

var rowEvenOdd = 1;

tpGroupAll.forEach(function(tpType){
    if( Object.keys(tpTypeStatusMatrix).indexOf(tpType) >= 0)
    {
        if( rowEvenOdd == 1 )
            newHTML += "<div class=\"tp_row_odd\">\n";
        else
            newHTML += "<div class=\"tp_row_even\">\n";
        newHTML += "<div id=\"" + tpType + "\" class=\"tp_lead_column\">" + tpType + "</div>\n<div class=\"tp_column_narrow\">&nbsp;</div>\n<div class=\"tp_column_totals\">" + totalRow(tpTypeStatusMatrix[tpType]) + "</div>\n<div class=\"tp_column_narrow\">&nbsp;</div>\n" + doRow(tpType) + "\n";
        newHTML += "</div>\n";
        rowEvenOdd = (rowEvenOdd + 1) % 2;
    }
});

tpGroupIP.forEach(function(tpType){
    if( Object.keys(tpTypeStatusMatrix).indexOf(tpType) >= 0)
    {
        if( rowEvenOdd == 1 )
            newHTML += "<div class=\"tp_row_odd\">\n";
        else
            newHTML += "<div class=\"tp_row_even\">\n";
        newHTML += "<div id=\"" + tpType + "\" class=\"tp_lead_column\">" + tpType + "</div>\n<div class=\"tp_column_narrow\">&nbsp;</div>\n<div class=\"tp_column_totals\">" + totalRow(tpTypeStatusMatrix[tpType]) + "</div>\n<div class=\"tp_column_narrow\">&nbsp;</div>\n" + doRow(tpType) + "\n";
        newHTML += "</div>\n";
        rowEvenOdd = (rowEvenOdd + 1) % 2;
    }
});

tpGroupText.forEach(function(tpType){
    if( Object.keys(tpTypeStatusMatrix).indexOf(tpType) >= 0)
    {
        if( rowEvenOdd == 1 )
            newHTML += "<div class=\"tp_row_odd\">\n";
        else
            newHTML += "<div class=\"tp_row_even\">\n";
        newHTML += "<div id=\"" + tpType + "\" class=\"tp_lead_column\">" + tpType + "</div>\n<div class=\"tp_column_narrow\">&nbsp;</div>\n<div class=\"tp_column_totals\">" + totalRow(tpTypeStatusMatrix[tpType]) + "</div>\n<div class=\"tp_column_narrow\">&nbsp;</div>\n" + doRow(tpType) + "\n";
        newHTML += "</div>\n";
        rowEvenOdd = (rowEvenOdd + 1) % 2;
    }
});

newHTML += "</div>\n";

newHTML += "<style type=\"text/css\">\n";

newHTML += "    div.headline {\n";
newHTML += "        height: 60px;\n";
newHTML += "        font-family: 'Century Gothic', CenturyGothic, AppleGothic, sans-serif;\n";
newHTML += "        font-weight:bold;\n";
newHTML += "        font-size:36px;\n";
newHTML += "        font-style: normal;\n";
newHTML += "        font-variant: normal;\n";
newHTML += "        line-height: 40px;\n";
newHTML += "    }\n";

newHTML += "    div.tp_type {\n";
newHTML += "        color: purple;\n";
newHTML += "    }\n";

newHTML += "    div.status_type {\n";
newHTML += "        color: red;\n";
newHTML += "    }\n";

newHTML += "    div.status_value {\n";
newHTML += "        color: green;\n";
newHTML += "    }\n";

newHTML += "    div.tp_table {\n";
newHTML += "        display:table;\n";
newHTML += "        width:auto;\n";
newHTML += "        background-color: #FEFEFE;\n";
newHTML += "        border:1px solid  #666666;\n";
newHTML += "        border-spacing:  1px;\n";
newHTML += "        border-collapse: separate;\n";
newHTML += "    }\n";

newHTML += "    div.tp_head_row {\n";
newHTML += "      display:table-row;\n";
newHTML += "      width:auto;\n";
newHTML += "      clear:both;\n";
newHTML += "      font-weight: bold;\n";
newHTML += "    }\n";

newHTML += "    div.tp_row_odd {\n";
newHTML += "      display:table-row;\n";
newHTML += "      width:auto;\n";
newHTML += "      clear:both;\n";
newHTML += "      background-color: #EEFFFF;\n";
newHTML += "    }\n";

newHTML += "    div.tp_row_even {\n";
newHTML += "      display:table-row;\n";
newHTML += "      width:auto;\n";
newHTML += "      clear:both;\n";
newHTML += "      background-color: #FFFFFF;\n";
newHTML += "    }\n";

newHTML += "    div.tp_lead_column {\n";
newHTML += "      float:left;\n";
newHTML += "      display:table-column;\n";
newHTML += "      width:50px;\n";
newHTML += "      text-align: right;\n";
newHTML += "      background-color: #FFFFFF;\n";
newHTML += "        border:1px solid  #EEEEEE;\n";
newHTML += "        border-spacing:  0.5px;\n";
newHTML += "        border-collapse: separate;\n";
newHTML += "      font-weight: bold;\n";
newHTML += "    }\n";

newHTML += "    div.tp_column {\n";
newHTML += "      float:left;\n";
newHTML += "      display:table-column;\n";
newHTML += "      width:90px;\n";
newHTML += "      text-align: right;\n";
newHTML += "        border:1px solid  #EEEEEE;\n";
newHTML += "        border-spacing:  0.5px;\n";
newHTML += "        border-collapse: separate;\n";
newHTML += "    }\n";

newHTML += "    div.tp_column_totals {\n";
newHTML += "      float:left;\n";
newHTML += "      display:table-column;\n";
newHTML += "      width:90px;\n";
newHTML += "      text-align: right;\n";
newHTML += "        border:1px solid  #EEEEEE;\n";
newHTML += "        border-spacing:  0.5px;\n";
newHTML += "        border-collapse: separate;\n";
newHTML += "    }\n";

newHTML += "    div.tp_column_narrow {\n";
newHTML += "      float:left;\n";
newHTML += "      display:table-column;\n";
newHTML += "      width:5px;\n";
newHTML += "      text-align: right;\n";
newHTML += "      background-color: #FFFFFF;\n";
newHTML += "        border:1px solid  #EEEEEE;\n";
newHTML += "        border-spacing:  0.5px;\n";
newHTML += "        border-collapse: separate;\n";
newHTML += "    }\n";

newHTML += "    div.vert_spacer {\n";
newHTML += "        height: 50px;\n";
newHTML += "    }\n";

newHTML += "    div.summary_table {\n";
newHTML += "        display:table;\n";
newHTML += "        width:auto;\n";
newHTML += "        background-color: #FEFEFE;\n";
newHTML += "        border:1px solid  #666666;\n";
newHTML += "        border-spacing:  1px;\n";
newHTML += "        border-collapse: separate;\n";
newHTML += "    }\n";

newHTML += "    div.summary_header_row {\n";
newHTML += "      display:table-row;\n";
newHTML += "      width:auto;\n";
newHTML += "      clear:both;\n";
newHTML += "      font-weight: bold;\n";
newHTML += "    }\n";

newHTML += "    div.summary_value_row_odd {\n";
newHTML += "      display:table-row;\n";
newHTML += "      width:auto;\n";
newHTML += "      clear:both;\n";
newHTML += "      background-color: #EEFFFF;\n";
newHTML += "    }\n";

newHTML += "    div.summary_value_row_even {\n";
newHTML += "      display:table-row;\n";
newHTML += "      width:auto;\n";
newHTML += "      clear:both;\n";
newHTML += "      background-color: #FFFFFF;\n";
newHTML += "    }\n";

newHTML += "    div.summary_column {\n";
newHTML += "      float:left;\n";
newHTML += "      display:table-column;\n";
newHTML += "      width:150px;\n";
newHTML += "      text-align: right;\n";
newHTML += "        border:1px solid  #EEEEEE;\n";
newHTML += "        border-spacing:  0.5px;\n";
newHTML += "        border-collapse: separate;\n";
newHTML += "    }\n";

newHTML += "<div class=\"bannerStrip\">\n";
newHTML += "    <div class=\"logoBox\">\n";
newHTML += "        <div class=\"pageLogo\"><img src=\"https://procureinsights.files.wordpress.com/2011/07/idea-storm.png\"></div>\n";
newHTML += "        <div class=\"pagePipe\"><img src=\"/pics/branding/logo.pipe.png?rand=1\"></div>\n";
newHTML += "        <div class=\"pageTitle\">Email Security</div>\n";

newHTML += "    div.bannerStrip {\n";
newHTML += "        display:table;\n";
newHTML += "        width:auto;\n";
newHTML += "        background-color: #FFFFFF;\n";
newHTML += "        border:1px solid  #666666;\n";
newHTML += "        border-spacing:  3px;\n";
newHTML += "        border-collapse: separate;\n";
newHTML += "    }\n";

newHTML += "    div.logoBox {\n";
newHTML += "      display:table-row;\n";
newHTML += "      width:auto;\n";
newHTML += "      clear:both;\n";
newHTML += "    }\n";

newHTML += "    div.pageLogo {\n";
newHTML += "      float:left;\n";
newHTML += "      display:table-column;\n";
newHTML += "      width:200px;\n";
newHTML += "      text-align: center;\n";
newHTML += "      border:1px solid  #EEEEEE;\n";
newHTML += "      border-spacing:  0.5px;\n";
newHTML += "      border-collapse: separate;\n";
newHTML += "    }\n";

newHTML += "    div.pageLogo img {\n";
newHTML += "      width: 100%;\n";
newHTML += "      height: auto;\n";
newHTML += "    }\n";

newHTML += "    div.pagePipe {\n";
newHTML += "      float:left;\n";
newHTML += "      display:table-column;\n";
newHTML += "      width:200px;\n";
newHTML += "      text-align: center;\n";
newHTML += "        border:1px solid  #EEEEEE;\n";
newHTML += "        border-spacing:  0.5px;\n";
newHTML += "        border-collapse: separate;\n";
newHTML += "    }\n";

newHTML += "    div.pageTitle {\n";
newHTML += "      float:left;\n";
newHTML += "      display:table-column;\n";
newHTML += "      width:200px;\n";
newHTML += "      text-align: center;\n";
newHTML += "        border:1px solid  #EEEEEE;\n";
newHTML += "        border-spacing:  0.5px;\n";
newHTML += "        border-collapse: separate;\n";
newHTML += "    }\n";

newHTML += "</style>\n";

newHTML += "</body>\n";
newHTML += "</html>\n";

//console.log("newHTML:",newHTML);
document.body.innerHTML=newHTML;
document.title = "New Layout --- " + serverName + " --- Sonicwall Desktop Lookup Server --- " + serverName + " --- New Layout";
