/**
 *  id_main_output_scatter id_main_output_tooltips
 *          id_main_input
 *          id_main_output
 *          id_main_settings
 *          id_main_end
 */
var tissues = [];	// 所有有效点的tissue分类
var datas = new Array(); // 存储每个tissue下的坐标
datas[0] = new Array();
var details = new Array();	//存储每个tissue的detail
details[0] = new Array();
var groups = new Array();	//存储每个datas的tissue，相关系数，个数，pvalue信息
var attrMatchs = new Array(); 	//用来匹配各JSON的键名
var tissueMatchs = new Array();	//用来匹配INFO.JSON里的键名，有tissue和category两种
var detailMatchs = new Array();	//用来匹配INFO.JSON里的键名detail
var G1 = ""; 	//g1.json的JSON形式
var G2 = "";	//g2.json的JSON形式
var INFO = "";	//info.json的JSON形式
var lastLineCorrelationCoefficient = "";	//数据表格最后一行统计计算所有数据
var numForChangingTheOrderByTissue = 0;	//记录tissue列改变排序的次数
var numForChangingTheOrderByCoefficient = 0;	//记录Coefficient列改变排序的次数
var numForChangingTheOrderByNumber = 0;	//记录Number列改变排序的次数
var numForChangingTheOrderByP = 0;	//记录pvalue列改变排序的次数
var executeAdjustOfBasicModel = "";
var strTissueSettings = "Tissue";
function startRun() {
    makeFileToString();
    displaySettingsPreviewOfBasicModel();
    addTheDefaultMatchToArray();
    keepPreview();
    showMatchs();
    $("#id_main_output_scatter").hide();
    $("#id_main_output_tooltips").hide();
    $("#id_main_output").hide();
    $("#id_main_settings").hide();
}
function clickTheSubmit() {
    $("#id_main_output_scatter").show();
    $("#id_main_output_tooltips").show();
    $("#id_main_input").hide();
    $("#id_main_output").show();
    $("#id_main_settings_settings").hide();
    $("#id_main_settings").hide();
    window.scrollTo(document.body.scrollHeight, 0);
    getJsons();
    drawScatterPlot();
}
/**
 * 将上传的gene1，gene2，以及information文件转换为字符串，并将转换的结果写到id_main_input_preview中去
 */
function makeFileToString() {
    var reader;
    if (FileReader) {
        reader = new FileReader();
		//获取到input对象
        var objFile1 = document.getElementById("id_main_input_upload_gene1");
        var objFile2 = document.getElementById("id_main_input_upload_gene2");
        var objFile3 = document.getElementById("id_main_input_upload_information");
		//对input对象进行监听，如果文件内容改变则执行.onChange()
        objFile1.onchange = function () {
            var file = objFile1.files[0];
            reader.readAsText(file, 'utf-8');
            reader.onload = function () {
                document.getElementById('id_main_input_preview_gene1').innerHTML = reader.result;
            }
        }
        objFile2.onchange = function () {
            var file = objFile2.files[0];
            reader.readAsText(file, 'utf-8');
            reader.onload = function () {
                document.getElementById('id_main_input_preview_gene2').innerHTML = reader.result;
            }
        }
        objFile3.onchange = function () {
            var file = objFile3.files[0];
            reader.readAsText(file, 'utf-8');
            reader.onload = function () {
                document.getElementById('id_main_input_preview_information').innerHTML = reader.result;
            }
        }
    }
    else {
        errorCode(100);
    }
}
// 从前端页面获得json文件字符串
function getJsons(){
	var strGene1 = document.getElementById("id_main_input_preview_gene1").innerHTML;
    var strGene2 = document.getElementById("id_main_input_preview_gene2").innerHTML;
    var strInformation = document.getElementById("id_main_input_preview_information").innerHTML;
	//定义函数，返回值是字典
	condition_specific_correlation(strGene1, strGene2, strInformation);
}
//定义condition_specific_correlation,返回值是字典
function condition_specific_correlation(g1, g2, info){
	//将id_main_input_preview中的内容转换为Json，返回值a是为了判断info文件是否为空
	var a = convertStringToJson(g1, g2, info);
	//info文件不是空的
	if(a){
		//使用json文件内容计算并赋值给tissues, datas, details,gene1,gene2等全局变量，返回值为可绘制种类的数量
		var numberOfExecuted = makeJsonIntoArray(G1, G2, INFO, a);
		//表格排序，传入参数
 		lastLineCorrelationCoefficient = getCorrelationCoefficientAndSetGroups(datas,groups,totals);
		//计算运行时间
		console.time("empirical_p");
		// 计算Empirical P-Value
		empirical_p(gene1,gene2,datas,groups,totals);
		console.timeEnd("empirical_p");
		// 表格最后一行
		lastLineCorrelationCoefficient = "<tr>" + lastLineCorrelationCoefficient + "<td><b>" + totals[1].toFixed(4)+ "<b></td></tr>"
 		if (numberOfExecuted != 0) {
 			// 以第二排的相关系数进行排序
 			sortByColumn(2);
 		}
	}
	//定义字典d
	var d = new Array();
	for(var i = 0; i < groups.length - 1; i++){
		//每一种类的字典内容
		var value = new Array();
		value["r"] = groups[i][1].toFixed(5) + groups[i][4];
		value["n"] = groups[i][2];			
		value["p-value"] = makeNumberToStringAndExponential(groups[i][3]);
		d[groups[i][0]] = new Array(value);
	}
	return d;
}
/**
 * 将id_main_input_preview中的内容转换为Json
 */
function convertStringToJson(strGene1, strGene2, strInformation) {
    if(strGene1 != "" && strGene2 != "") {
        var isJsonGene1 = isJson(strGene1);
        var isJsonGene2 = isJson(strGene2);
        var isJsonInformation = isJson(strInformation);
        if (isJsonGene1 && isJsonGene2) {
            G1 = eval('(' + strGene1 + ')');
            G2 = eval('(' + strGene2 + ')');
            if (isJsonInformation) {
                INFO = eval('(' + strInformation + ')');
            }
            else {
                errorCode(106);
                var jsonInformation = null;
            }
            var testOrder1 = !isGene1OrGene2Json(strGene1);
            var testOrder2 = !isGene1OrGene2Json(strGene2);
            if (testOrder1 || testOrder2) {
                errorCode(108);
            }
            else {
		return isJsonInformation;
            }
        }
        else {
    
            if (!isJsonGene1&&!isJsonGene2&&!isJsonInformation) {
                errorCode(116);
            }
            else if (!isJsonGene2&&!isJsonInformation) {
                errorCode(115);
            }
            else if (!isJsonGene1&&!isJsonInformation) {
                errorCode(114);
            }
            else if (!isJsonGene1&&!isJsonGene2) {
                errorCode(113);
            }
            else if (!isJsonInformation) {
                errorCode(106);
            }
            else if (!isJsonGene2) {
                errorCode(105);
            }
            else if (!isJsonGene1) {
                errorCode(104);
            }
            
        }
    }
    else {
        
        if (strGene1 == ""&&strGene2 == ""&&strInformation == "") {
            errorCode(112);
        }
        else if (strGene2 == ""&&strInformation == "") {
            errorCode(111);
        }
        else if (strGene1 == ""&&strGene2 == "") {
            errorCode(109);
        }
        else if (strGene1 == ""&&strInformation == "") {
            errorCode(110);
        }
        else if (strGene1 == "") {
            errorCode(101);
        }
        else if (strGene2 == "") {
            errorCode(102);
        }
        else if (strInformation == "") {
            errorCode(103);
        }
        
    }
       
        
    }
//使用json文件内容计算并赋值给tissues, datas, details,gene1,gene2等全局变量
function makeJsonIntoArray(jsonGene1, jsonGene2, jsonInformation, isJsonInformation) {
    var numberOfExecuted = 0;
    var numberOfExecutedInfor = 0;
    var numberOfGene1 = 0;
    var numberOfGene2 = 0;
    var numberOfInformation = 0;
    for (var attrGene1 in jsonGene1) {
        var attrGene2 = "";
        var attrInformation = "";
        var attrTissue = "";
        var attrDetail = "";
        for (var i = 0; i < attrMatchs.length; i++) {
            var attrTemp = attrGene1.replace(attrMatchs[i][0], "");
            attTemp = attrTemp.replace(attrMatchs[i][1], "");
            var gene2Temp = attrMatchs[i][2] + attTemp + attrMatchs[i][3];
            if (jsonGene2[gene2Temp] != undefined) {
                attrGene2 = gene2Temp;
                break;
            }
        }
        for (var i = 0; i < attrMatchs.length; i++) {
            var attrTemp = attrGene1.replace(attrMatchs[i][0], "");
            attTemp = attrTemp.replace(attrMatchs[i][1], "");
            var inforTemp = attrMatchs[i][4] + attTemp + attrMatchs[i][5];
            if (isJsonInformation && jsonInformation[inforTemp] != undefined) {
                attrInformation = inforTemp;
                break;
            }
        }
        var numGene1 = jsonGene1[attrGene1];
        var numGene2 = jsonGene2[attrGene2];
        if ( !isNaN(numGene1) && !isNaN(numGene2)) {
            var strTissue = "";
            var strDetail = "";
            if (jsonInformation == null || jsonInformation[attrInformation] == undefined) {
               strTissue = "unknown";
               strDetail = "The information of gene1, gene2 can't be found.";
            }
            else {
                numberOfExecutedInfor++;
                strTissue = "undefined";
                strDetail = "The information of gene1, gene2 can be found, but the tissue and detail can't be used."
                for (var i = 0; i < tissueMatchs.length; i++) {
                    var tissueTemp = tissueMatchs[i];
                    if (jsonInformation[attrInformation][tissueTemp] != undefined) {
                        strTissue = jsonInformation[attrInformation][tissueTemp];
                        var wordChar = tissueTemp.charAt(0) + "";
                        strTissueSettings = wordChar.toUpperCase() + tissueTemp.substring(1);
                        break;
                    }
                }
                for (var i = 0; i < detailMatchs.length; i++) {
                    var detailTemp = detailMatchs[i];
                    if (jsonInformation[attrInformation][detailTemp] != undefined) {
                        strDetail = jsonInformation[attrInformation][detailTemp];
                        break;
                    }
                }
            }
            var index = indexOfTissues(strTissue, tissues);
            if (index == -1) {
                tissues.push(strTissue);
                index = indexOfTissues(strTissue, tissues);
                datas[index] = new Array();
                details[index] = new Array();
            }
            datas[index].push(numGene1);
            datas[index].push(numGene2);
            details[index].push(strDetail);
            numberOfExecuted++;
        }
        numberOfGene1++;
    }
    for(var attrGene2 in jsonGene2) {
        numberOfGene2++;
    }
    for(var attrInformation in jsonInformation) {
        numberOfInformation++;
    }
    setAndDisplayUtilization(numberOfExecuted, numberOfExecutedInfor, numberOfGene1, numberOfGene2, numberOfInformation, isJsonInformation);
    return numberOfExecuted;
}
function setAndDisplayUtilization (numberOfExecuted, numberOfExecutedInfor, numberOfGene1, numberOfGene2, numberOfInformation, isJsonInformation) {
    document.getElementById("id_main_output_utilization").innerHTML =
        "Gene1 utilization: " +
        Math.round(numberOfExecuted / numberOfGene1 * 100.0)  + "%  " +
        numberOfExecuted + "/" + numberOfGene1 +
        "<br>Gene2 utilization: " +
        Math.round(numberOfExecuted / numberOfGene2 * 100.0) + "%  " +
        numberOfExecuted + "/" + numberOfGene2;
    if (isJsonInformation) {
        document.getElementById("id_main_output_utilization").innerHTML =
            document.getElementById("id_main_output_utilization").innerHTML +
            "<br>Information utilization: " +
            Math.round(numberOfExecutedInfor / numberOfInformation * 100.0) + "%  " +
            numberOfExecutedInfor + "/" + numberOfInformation;
    }
}
// 根据column进行排序
function sortByColumn(numForChangingTheOrderByColumn) {
    var str = "";
    for (var i = 0; i < groups.length - 1; i++) {
        for (var j = i + 1; j < groups.length; j++) {
            if (groups[j][numForChangingTheOrderByColumn - 1] > groups[i][numForChangingTheOrderByColumn - 1]) {
                var temp1 = groups[i][0];
                var temp2 = groups[i][1];
                var temp3 = groups[i][2];
                var temp4 = groups[i][3];
                var temp5 = groups[i][4];
		// 给表格添加新的数据，Empirical P-Value
		var temp6 = groups[i][5];
                groups[i][0] = groups[j][0];
                groups[i][1] = groups[j][1];
                groups[i][2] = groups[j][2];
                groups[i][3] = groups[j][3];
                groups[i][4] = groups[j][4];
		groups[i][5] = groups[j][5];
                groups[j][0] = temp1;
                groups[j][1] = temp2;
                groups[j][2] = temp3;
                groups[j][3] = temp4;
                groups[j][4] = temp5;
		groups[j][5] = temp6;
            }
        }
    }
    //根据选择的列进行排序
    switch (numForChangingTheOrderByColumn) {
        case 1:
        if (numForChangingTheOrderByTissue % 2 == 0) {
            for (var i = 0; i < groups.length; i++) {
                str = str + "<tr><td>" + groups[i][0] + "</td><td>" + groups[i][1].toFixed(5) + groups[i][4] + "</td><td>" + groups[i][2] + "</td><td>" + makeNumberToStringAndExponential(groups[i][3]) + "</td><td>" +groups[i][5].toFixed(4) + "</td></tr>";
            }
        }
        else {
            for (var i = groups.length - 1; i >= 0; i--) {
                str = str + "<tr><td>" + groups[i][0] + "</td><td>" + groups[i][1].toFixed(5) + groups[i][4] + "</td><td>" + groups[i][2] + "</td><td>" + makeNumberToStringAndExponential(groups[i][3]) + "</td><td>" +groups[i][5].toFixed(4) + "</td></tr>";
            }
        }
        numForChangingTheOrderByTissue++;
        break;
        case 2:
        if (numForChangingTheOrderByCoefficient % 2 == 0) {
            for (var i = 0; i < groups.length; i++) {
                str = str + "<tr><td>" + groups[i][0] + "</td><td>" + groups[i][1].toFixed(5) + groups[i][4] + "</td><td>" + groups[i][2] + "</td><td>" + makeNumberToStringAndExponential(groups[i][3]) + "</td><td>" +groups[i][5].toFixed(4) + "</td></tr>";
            }
        }
        else {
            for (var i = groups.length - 1; i >= 0; i--) {
                str = str + "<tr><td>" + groups[i][0] + "</td><td>" + groups[i][1].toFixed(5) + groups[i][4] + "</td><td>" + groups[i][2] + "</td><td>" + makeNumberToStringAndExponential(groups[i][3]) + "</td><td>" +groups[i][5].toFixed(4) + "</td></tr>";
            }
        }
        numForChangingTheOrderByCoefficient++;
        break;
        case 3:
        if (numForChangingTheOrderByNumber % 2 == 0) {
            for (var i = 0; i < groups.length; i++) {
                str = str + "<tr><td>" + groups[i][0] + "</td><td>" + groups[i][1].toFixed(5) + groups[i][4] + "</td><td>" + groups[i][2] + "</td><td>" + makeNumberToStringAndExponential(groups[i][3]) + "</td><td>" +groups[i][5].toFixed(4) + "</td></tr>";
            }
        }
        else {
            for (var i = groups.length - 1; i >= 0; i--) {
                str = str + "<tr><td>" + groups[i][0] + "</td><td>" + groups[i][1].toFixed(5) + groups[i][4] + "</td><td>" + groups[i][2] + "</td><td>" + makeNumberToStringAndExponential(groups[i][3]) + "</td><td>" +groups[i][5].toFixed(4) + "</td></tr>";
            }
        }
        numForChangingTheOrderByNumber++;
        break;
        case 4:
        if (numForChangingTheOrderByP % 2 == 0) {
            for (var i = 0; i < groups.length; i++) {
                str = str + "<tr><td>" + groups[i][0] + "</td><td>" + groups[i][1].toFixed(5) + groups[i][4] + "</td><td>" + groups[i][2] + "</td><td>" + makeNumberToStringAndExponential(groups[i][3]) + "</td><td>" +groups[i][5].toFixed(4) + "</td></tr>";
            }
        }
        else {
            for (var i = groups.length - 1; i >= 0; i--) {
                str = str + "<tr><td>" + groups[i][0] + "</td><td>" + groups[i][1].toFixed(5) + groups[i][4] + "</td><td>" + groups[i][2] + "</td><td>" + makeNumberToStringAndExponential(groups[i][3]) + "</td><td>" +groups[i][5].toFixed(4) + "</td></tr>";
            }
        }
        numForChangingTheOrderByP++;
        break;
		case 6:
        if (numForChangingTheOrderByEP % 2 == 0) {
            for (var i = 0; i < groups.length; i++) {
                str = str + "<tr><td>" + groups[i][0] + "</td><td>" + groups[i][1].toFixed(5) + groups[i][4] + "</td><td>" + groups[i][2] + "</td><td>" + makeNumberToStringAndExponential(groups[i][3]) + "</td><td>" +groups[i][5].toFixed(4) + "</td></tr>";
            }
        }
        else {
            for (var i = groups.length - 1; i >= 0; i--) {
                str = str + "<tr><td>" + groups[i][0] + "</td><td>" + groups[i][1].toFixed(5) + groups[i][4] + "</td><td>" + groups[i][2] + "</td><td>" + makeNumberToStringAndExponential(groups[i][3]) + "</td><td>" +groups[i][5].toFixed(4) + "</td></tr>";
            }
        }
        numForChangingTheOrderByEP++;
        break;
    }
    // 点击相应的column就可以进行该column的排序
    str = "<tr><th><p onclick='sortByColumn(1);'>" + strTissueSettings + "</p></th><th><p onclick='sortByColumn(2);'>Correlation Coefficient</p></th><th><p onclick='sortByColumn(3);'>Number</p></th><th style='width: 200px;'><p onclick='sortByColumn(4);'>P Value (one-tail)</p></th><th><p onclick='sortByColumn(6);'>Empirical P-Value</p></th></tr>" +
        str + lastLineCorrelationCoefficient;
    document.getElementById("id_main_output_table").innerHTML = str;
}
function drawScatterPlot() {
    var tissues = getTissues();
    var datas = getDatas();
    var details = getDetatils();
    var tempX = 0;
    var tempY = 0;
    var chart;
    nv.addGraph(function() {
        chart = nv.models.scatterChart()
            .showDistX(true)
            .showDistY(true)
            .duration(300)
            .color(d3.scale.category10().range());
        chart.dispatch.on('renderEnd', function(){
            console.log('render complete');
        });
        chart.tooltip.headerFormatter(function(d, i) {
            tempX = chart.xAxis.tickFormat()(d, i);
            return ;
        });
        chart.tooltip.valueFormatter(function(d, i) {
            tempY = chart.yAxis.tickFormat()(d, i);
            return getDetail(tissues, datas, details, tempX, tempY);
        });
        chart.tooltip.keyFormatter(function(d, i) {
            return d;
        });
        chart.xAxis.tickFormat(d3.format('.05f'));
        chart.yAxis.tickFormat(d3.format('.05f'));
        var dataset = getData(tissues, datas, details);
        d3.select('#id_main_output_scatter svg')
            .datum(nv.log(dataset))
            .call(chart)
        nv.utils.windowResize(chart.update);
        chart.dispatch.on('stateChange', function(e) { nv.log('New State:', JSON.stringify(e)); });
        return chart;
    });
    function getData(tissues, datas, details) {
        var data = [],
            shapes = ['square'],
            random = d3.random.normal();

        for (i = 0; i < tissues.length; i++) {
            data.push({
                key: tissues[i],
                values: []
            });

            for (j = 0; j < datas[i].length; j = j + 2) {
                data[i].values.push({
                    x: datas[i][j],
                    y: datas[i][j + 1],
                });
            }
            data[i].values.push({
                    x: 0,
                    y: 0,
            });
        }
        return data;
    }
   function getDetail(tissues, datas, details, tempX, tempY) {
      for (var i = 0; i < datas.length; i++) {
        for (var j = 0; j < datas[i].length; j = j + 2) {
          if (datas[i][j].toFixed(5) == tempX && datas[i][j + 1].toFixed(5) == tempY) {
            var index = indexOfGroups(tissues[i], groups);
            var preDetail = "<p class='tooltips_left' style='text-align: left; overflow: auto; '>";
            var tempDetail = strTissueSettings + ": " + tissues[i] + "<br>(" + datas[i][j] + ", " + datas[i][j + 1] + ")<br><br>Correlation Coefficient: " + groups[index][1].toFixed(5) +
                groups[index][4] + "<br>Number of the tissue: " + groups[index][2] + "<br>P Value (one-tail): " + makeNumberToStringAndExponential(groups[index][3]) + "<br><br>" +details[i][j / 2];
            tempDetail = preDetail + tempDetail + "<br>";
            document.getElementById("id_main_output_tooltips_detail").innerHTML = tempDetail + "</p>";
            return "(" + datas[i][j] + ", " + datas[i][j + 1] + ")";
          }
        }
      }
      return "";
    }
}
function clickTheSettings() {
    if (document.getElementById("id_main_settings_settings").innerHTML == "Settings") {
        $("#id_main_settings").show();
        window.scrollTo(0,document.body.scrollHeight);
        document.getElementById("id_main_settings_settings").innerHTML = "Settings&#9660";
    }
    else {
        $("#id_main_settings").hide();
        document.getElementById("id_main_settings_settings").innerHTML = "Settings";
    }
}
function displaySettingsPreviewOfBasicModel() {
    var tempError = "Invalid Format"
    var gene1Str = document.getElementById("id_main_settings_modelbasic_input_gene1").value;
    var gene2Str = document.getElementById("id_main_settings_modelbasic_input_gene2").value;
    var inforStr = document.getElementById("id_main_settings_modelbasic_input_information").value;
    var tissueStr = document.getElementById("id_main_settings_modelbasic_input_tissue").value;
    var detailStr = document.getElementById("id_main_settings_modelbasic_input_detail").value;
    var minStr = gene1Str.length < gene2Str.length ? gene1Str : gene2Str;
    if (minStr == gene1Str) {
        minStr = gene1Str.length < inforStr.length ? gene1Str : inforStr;
    }
    else {
        minStr = gene2Str.length < inforStr.length ? gene2Str : inforStr;
    }
    document.getElementById("id_main_settings_modelbasic_output_gene1left").value = tempError;
    document.getElementById("id_main_settings_modelbasic_output_gene1key").value = tempError;
    document.getElementById("id_main_settings_modelbasic_output_gene1right").value = tempError;
    document.getElementById("id_main_settings_modelbasic_output_gene2left").value = tempError;
    document.getElementById("id_main_settings_modelbasic_output_gene2key").value = tempError;
    document.getElementById("id_main_settings_modelbasic_output_gene2right").value = tempError;
    document.getElementById("id_main_settings_modelbasic_output_informationleft").value = tempError;
    document.getElementById("id_main_settings_modelbasic_output_informationkey").value = tempError;
    document.getElementById("id_main_settings_modelbasic_output_informationright").value = tempError;
    findMinOfMaxLoop: for (var j = minStr.length; j >= 1; j--) {
        for (var i = 0; i + j <= minStr.length; i++) {
            var judgeMinOfMax = minStr.substring(i, j + i);
            if (gene1Str.indexOf(judgeMinOfMax) != -1 && gene2Str.indexOf(judgeMinOfMax) != -1 && inforStr.indexOf(judgeMinOfMax) != -1) {
                var adjustG1Left = gene1Str.substring(0, gene1Str.indexOf(judgeMinOfMax));
                var adjustG1Right = gene1Str.substring(gene1Str.indexOf(judgeMinOfMax) + judgeMinOfMax.length);
                var adjustG2Left = gene2Str.substring(0, gene2Str.indexOf(judgeMinOfMax));
                var adjustG2Right = gene2Str.substring(gene2Str.indexOf(judgeMinOfMax) + judgeMinOfMax.length);
                var adjustInforLeft = inforStr.substring(0, inforStr.indexOf(judgeMinOfMax));
                var adjustInforRight = inforStr.substring(inforStr.indexOf(judgeMinOfMax) + judgeMinOfMax.length);
                document.getElementById("id_main_settings_modelbasic_output_gene1left").value = adjustG1Left;
                document.getElementById("id_main_settings_modelbasic_output_gene1key").value = judgeMinOfMax;
                document.getElementById("id_main_settings_modelbasic_output_gene1right").value = adjustG1Right;
                document.getElementById("id_main_settings_modelbasic_output_gene2left").value = adjustG2Left;
                document.getElementById("id_main_settings_modelbasic_output_gene2key").value = judgeMinOfMax;
                document.getElementById("id_main_settings_modelbasic_output_gene2right").value = adjustG2Right;
                document.getElementById("id_main_settings_modelbasic_output_informationleft").value = adjustInforLeft;
                document.getElementById("id_main_settings_modelbasic_output_informationkey").value = judgeMinOfMax;
                document.getElementById("id_main_settings_modelbasic_output_informationright").value = adjustInforRight;
                break findMinOfMaxLoop;
            }
        }
    }
}
function keepKey(idOfKey) {
    var strOfKey = document.getElementById(idOfKey).value;
    document.getElementById("id_main_settings_modelbasic_output_gene1key").value = strOfKey;
    document.getElementById("id_main_settings_modelbasic_output_gene2key").value = strOfKey;
    document.getElementById("id_main_settings_modelbasic_output_informationkey").value = strOfKey;
    keepPreview();
}
function keepPreview() {
    var adjustG1Left = document.getElementById("id_main_settings_modelbasic_output_gene1left").value;
    var adjustG1Right = document.getElementById("id_main_settings_modelbasic_output_gene1right").value;
    var adjustG2Left = document.getElementById("id_main_settings_modelbasic_output_gene2left").value;
    var adjustG2Right = document.getElementById("id_main_settings_modelbasic_output_gene2right").value;
    var adjustInforLeft = document.getElementById("id_main_settings_modelbasic_output_informationleft").value;
    var adjustInforRight = document.getElementById("id_main_settings_modelbasic_output_informationright").value;
    var judgeMinOfMax = document.getElementById("id_main_settings_modelbasic_output_gene1key").value;
    var tissueStr = document.getElementById("id_main_settings_modelbasic_input_tissue").value;
    var detailStr = document.getElementById("id_main_settings_modelbasic_input_detail").value;
    displayStr = "<br>{ \"" + adjustG1Left.fontcolor("red") + judgeMinOfMax.fontcolor("blue") + adjustG1Right.fontcolor("red") + "\": 1.00, --- }<br>" +
                    "{ \"" + adjustG2Left.fontcolor("red") + judgeMinOfMax.fontcolor("blue") + adjustG2Right.fontcolor("red") + "\": 1.00, --- }<br>" +
                    "{ \"" + adjustInforLeft.fontcolor("red") + judgeMinOfMax.fontcolor("blue") + adjustInforRight.fontcolor("red") + "\": {\"" +
                    tissueStr.fontcolor("green") + "\": \"root\", " + detailStr.fontcolor("green") + "\": something }, --- }";
    document.getElementById("id_main_settings_modelbasic_preview").innerHTML = displayStr;
}
function clickTheAddOfBasicModel() {
    addTheMatchToArray();
    showMatchs();
}
function addTheDefaultMatchToArray() {
    var len = attrMatchs.length;
    attrMatchs[len] = new Array();
    attrMatchs[len].push("");
    attrMatchs[len].push("");
    attrMatchs[len].push("");
    attrMatchs[len].push("");
    attrMatchs[len].push("");
    attrMatchs[len].push("");

    len++;
    attrMatchs[len] = new Array();
    attrMatchs[len].push("R0");
    attrMatchs[len].push("XX");
    attrMatchs[len].push("R0");
    attrMatchs[len].push("XX");
    attrMatchs[len].push("");
    attrMatchs[len].push("");
    
    len++;
    attrMatchs[len] = new Array();
    attrMatchs[len].push("R0");
    attrMatchs[len].push("XXX");
    attrMatchs[len].push("R0");
    attrMatchs[len].push("XXX");
    attrMatchs[len].push("");
    attrMatchs[len].push("");
    
    tissueMatchs.push("tissue");
    tissueMatchs.push("category");
    detailMatchs.push("detail");
}
function addTheMatchToArray() {
    var adjustG1Left = document.getElementById("id_main_settings_modelbasic_output_gene1left").value;
    var adjustG1Right = document.getElementById("id_main_settings_modelbasic_output_gene1right").value;
    var adjustG2Left = document.getElementById("id_main_settings_modelbasic_output_gene2left").value;
    var adjustG2Right = document.getElementById("id_main_settings_modelbasic_output_gene2right").value;
    var adjustInforLeft = document.getElementById("id_main_settings_modelbasic_output_informationleft").value;
    var adjustInforRight = document.getElementById("id_main_settings_modelbasic_output_informationright").value;
    var tissue = document.getElementById("id_main_settings_modelbasic_input_tissue").value;
    var detail = document.getElementById("id_main_settings_modelbasic_input_detail").value;
    var len;
    var existTheAttr = isExistInAttrMatchs(adjustG1Left, adjustG1Right, adjustG2Left, adjustG2Right, adjustInforLeft, adjustInforRight);
    var existTheTissue = isExistInTissueMatchs(tissue);
    var existTheDetail = isExistInDetailMatchs(detail);
    if (!existTheAttr) {
        len = attrMatchs.length;
        attrMatchs[len] = new Array();
        attrMatchs[len].push(adjustG1Left);
        attrMatchs[len].push(adjustG1Right);
        attrMatchs[len].push(adjustG2Left);
        attrMatchs[len].push(adjustG2Right);
        attrMatchs[len].push(adjustInforLeft);
        attrMatchs[len].push(adjustInforRight);
    }
    if (!existTheTissue) {
        tissueMatchs.push(tissue);
    }
    if (!existTheDetail) {
        detailMatchs.push(detail);
    }
    if (existTheAttr && existTheTissue && existTheDetail) {
        errorCode(107);
    }
    else {
        document.getElementById("id_main_settings_modelbasic_lastsaved").innerHTML = "<i>Last added: " + getTime() + "</i>";
    }
}
function showMatchs() {
    var num = 1;
    var str = "";
    var strThen = "";
    var strEnd = "";
    var strKey = "<i>_key_</i>";
    var strTable = "<caption><b>Acceptable Samples</b></caption><tr><th>No</th><th>Gene1</th><th>Gene2</th><th>Information</th><th>Attribute1</th><th>Attribute2</th></tr>";
    for (var i = 0; i < attrMatchs.length; i++) {
        str =  "</td><td>" + attrMatchs[i][0].fontcolor("red") + strKey.fontcolor("blue") + attrMatchs[i][1].fontcolor("red") + "</td><td>" +
        attrMatchs[i][2].fontcolor("red") + strKey.fontcolor("blue") + attrMatchs[i][3].fontcolor("red") + "</td><td>" +
        attrMatchs[i][4].fontcolor("red") + strKey .fontcolor("blue")+ attrMatchs[i][5].fontcolor("red") + "</td>";
        for (var j = 0; j < tissueMatchs.length; j++) {
            strThen = str + "<td>" + tissueMatchs[j].fontcolor("green") + "</td>"
            for (var k = 0; k < detailMatchs.length; k++) {
                strEnd = strEnd + "<tr><td>" + num + strThen + "<td>" + detailMatchs[k].fontcolor("green") + "</td></tr>";
                num++;
            }
        }
    }
    strEnd = strTable + strEnd;
    document.getElementById("id_main_settings_modelbasic_attr_table").innerHTML = strEnd;
    
}
function isExistInAttrMatchs(adjustG1Left, adjustG1Right, adjustG2Left, adjustG2Right, adjustInforLeft, adjustInforRight) {
    for (var i = 0; i < attrMatchs.length; i++) {
        if (attrMatchs[i][0] == adjustG1Left && attrMatchs[i][1] == adjustG1Right && attrMatchs[i][2] == adjustG2Left &&
            attrMatchs[i][3] == adjustG2Right && attrMatchs[i][4] == adjustInforLeft && attrMatchs[i][5] == adjustInforRight){ 
            return true;
        }
    }
    return false;
}
function isExistInTissueMatchs(tissue) {
    for (var i = 0; i < tissueMatchs.length; i++) {
        if (tissueMatchs[i] == tissue) {
            return true;
        }
    }
    return false;
}
function isExistInDetailMatchs(detail) {
    for (var i = 0; i < detailMatchs.length; i++) {
        if (detailMatchs[i] == detail) {
            return true;
        }
    }
    return false;
}
// 计算相关系数并为groups赋值，并用形参来代替全局变量
function getCorrelationCoefficientAndSetGroups (data,group,total) {
    var tail = 1;
    var str = "";
    var correlationCoefficient1 = 0;
    var sumOfSquareOfX1 = 0;
    var sumOfSquareOfY1 = 0;
    var sumOfXTimesY1 = 0;
    var averageX1 = 0;
    var averageY1 = 0;
    var squareOfAverageX1 = 0;
    var squareOfAverageY1 = 0;
    var averageXTimesAverageY1 = 0;
    var allN = 0;
    for (var i = 0; i < data.length; i++) {
        var correlationCoefficient = 0;
        var sumOfSquareOfX = 0;
        var sumOfSquareOfY = 0;
        var sumOfXTimesY = 0;
        var averageX = 0;
        var averageY = 0;
        var squareOfAverageX = 0;
        var squareOfAverageY = 0;
        var averageXTimesAverageY = 0;
        for (var j = 0; j < data[i].length; j = j + 2) {
            var x = data[i][j];
            var y = data[i][j + 1];
            sumOfSquareOfX += x * x;
            sumOfSquareOfY += y * y;
            sumOfXTimesY += x * y;
            averageX += x;
            averageY += y;
            sumOfSquareOfX1 += x * x;
            sumOfSquareOfY1 += y * y;
            sumOfXTimesY1 += x * y;
            averageX1 += x;
            averageY1 += y;
            allN++;
        }
		// doN为同个issue的点的个数
        var doN = data[i].length / 2;
        averageX /= doN;
        averageY /= doN;
        squareOfAverageX = averageX * averageX;
        squareOfAverageY = averageY * averageY;
        averageXTimesAverageY = averageX * averageY;
        correlationCoefficient = (sumOfXTimesY - doN * averageXTimesAverageY) / (Math.sqrt((sumOfSquareOfX - doN * squareOfAverageX) * (sumOfSquareOfY - doN * squareOfAverageY)));
        var sign = " (+)";
        if (correlationCoefficient < 0) {
            sign = " (-)";
        }
        if (isNaN(correlationCoefficient)) {
            correlationCoefficient = 0;
            sign = " (NaN)";
        }
        var pValue = correlationCoefficientToPValue(correlationCoefficient, doN, 1);
		//total.push(correlationCoefficient);	//如果比较非绝对值的相关系数
        group[i] = new Array(tissues[i], Math.abs(correlationCoefficient), doN, pValue, sign);
    }
    averageX1 /= allN;
    averageY1 /= allN;
    squareOfAverageX1 = averageX1 * averageX1;
    squareOfAverageY1 = averageY1 * averageY1;
    averageXTimesAverageY1 = averageX1 * averageY1;
    correlationCoefficient1 = (sumOfXTimesY1 - allN * averageXTimesAverageY1) / (Math.sqrt((sumOfSquareOfX1 - allN * squareOfAverageX1) * (sumOfSquareOfY1 - allN * squareOfAverageY1)));
    sign = " (+)";
    if (correlationCoefficient1 < 0) {
        sign = " (-)";
    }
    if (isNaN(correlationCoefficient1)) {
        correlationCoefficient1 = 0;
        sign = " (NaN)";
    }
    var totalPTemp = correlationCoefficientToPValue(correlationCoefficient1, allN, 1);
    total.push(correlationCoefficient1);
    return "<td><b>total</b></td><td><b>" + correlationCoefficient1.toFixed(5) + sign + "</b></td><td><b>" + allN + "</b></td><td><b>" + makeNumberToStringAndExponential(totalPTemp) + "<b></td>";
}
function getTissues() {
    return this.tissues;
}
function getDatas() {
    return this.datas;
}
function getDetatils() {
    return this.details;
}

function errorCode(temp) {
    var code = {
                '100': 'Your browser does not support FileReader objects （Error code 100）',
                '101': 'Missing gene 1 file （Error code 101）',
                '102': 'Missing gene 2 file （Error code 102）',
                '103': 'Missing information file （Error code 103）',
                '104': 'Invalid json format in gene1 file （Error code 104）',
                '105': 'Invalid json format in gene2 file （Error code 105）',
                '106': 'Invalid json format in information file （Error code 106）',
                '107': 'Sample already exists, no need to add it again （Error code 107）',
                '108': 'Invalid gene1, gene2, or information uploading order, please upload again by right order （Error code 108）',
                '109': 'Missing gene 1 and gene 2 files （Error code 109）',
                '110': 'Missing gene 1 and information files （Error code 110）',
                '111': 'Missing gene 2 and information files （Error code 111）',
                '112': 'Missing all files （Error code 112）',
                '113': 'Invalid json format in gene1 and gene2 files （Error code 113）',
                '114': 'Invalid json format in gene1 and information files （Error code 114）',
                '115': 'Invalid json format in gene2 and information files （Error code 115）',
                '116': 'Invalid json format in all files （Error code 116）'

               }
    //alert("Error " + temp + ": " + code[temp]);
	//修改提示框的样式
    $.gDialog.alert( code[temp], {
		title: "Error",
		animateIn: "bounceIn",
		animateOut: "bounceOut"
	});

}
function isJson(str) {
    if (typeof str == 'string') {
        try {
            var obj=JSON.parse(str);
            if(typeof obj == 'object' && obj ){
                return true;
            }else{
                return false;
            }

        } catch(e) {
            return false;
        }
    }
    console.log('It is not a string!')
}
function indexOfTissues(tissue, tissues) {
    for (var i = 0; i < tissues.length; i++) {
        if (tissue == tissues[i]) {
            return i;
        }
    }
    return -1;
}
function indexOfGroups(tissue, groups) {
    for (var i = 0; i < groups.length; i++) {
        if (tissue == groups[i][0]) {
            return i;
        }
    }
}
function getTime() {
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth();
        var day = date.getDate();
        var hour = date.getHours();
        var minute = date.getMinutes();
        var second = date.getSeconds();
        return formatZero(hour) + ":" + formatZero(minute) + ":" + formatZero(second);
    }
function formatZero(temp){
    if (temp >= 0 && temp <= 9) {
        return 0 + "" + temp;
    }
    else {
        return temp;
    }
}
function correlationCoefficientToPValue(r, n, tail) {
    var degreesOfFreedom = n;
    var t = r * Math.pow((degreesOfFreedom - 2) / (1 - r * r), 0.5);
    t = Math.abs(t);
    if (degreesOfFreedom <= 2) {
        return 0.5 * tail;
    }
    return TtoP(t, degreesOfFreedom) / 2 * tail;
}
function makeNumberToStringAndExponential(temp) {
    var eTemp = temp.toExponential(3);
    var strTemp = eTemp + "";
    var indexOfE = 0;
    var str = "";
    for (var i = 0; i < strTemp.length; i++) {
        if(strTemp.charAt(i) == 'e') {
            indexOfE = i;
            break;
        }
    }
    str = strTemp.substring(0, indexOfE) + "x10<sup>" + strTemp.substring(indexOfE + 1) + "</sup>";
    return str;
}
/**
 * @param {Object} str 合法JSON格式的字符串
 * @return {bool} 是否为合法的Gene1和Gene2内容
 */
function isGene1OrGene2Json(str) {
	//valid json
	//{string : number, string : number} ok
	//{string : {string : number}} not ok
	//{string : number, string : [number1, number2]} not ok
	//[number, number, number] not ok
	//number not ok
	//合法条件为：以 { 开头，以 } 结束；只有一个 {，只有一个 }；不存在 [ 或 ]；
	var string = str.trim();
	var isStartOk = (string.charAt(0) == '{');
	var isEndOk = (string.charAt(string.length - 1) == '}');
	var isJustOneLeft = true;
	var isJustOneRight = true;
	var isJustLeftAndRight = true;
    for (var i = 1; i < str.length - 1; i++) {
		var aChar = string.charAt(i);
        if (aChar == '{') {
            isJustOneLeft = false;
			break;
        }
		if (aChar == '}') {
			isJustOneRight = false;
			break;
		}
		if (aChar == '[' || aChar == ']') {
			isJustLeftAndRight = false;
			break;
		}
    }
	//判断顺序不能改变，用了短路
    return isStartOk && isEndOk && isJustOneLeft && isJustOneRight && isJustLeftAndRight;
}

