
$(function () {
	$('#i0').tagator({
		autocomplete: ['科研', '可视化', 'Visual', 'Basic', '浙江大学','反恐','日语']
	});
});
var GbookList;

$(function () {
  $('[data-toggle="popover"]').popover()
})

function startQuery() {	
	var searchKeys = document.getElementById("i0").value + getCallList();
//	console.log(searchKeys);
	if(searchKeys ==""){
		alert("请至少输入一个查询关键词");
		return;
	}
	
	searchKeys = searchKeys.split(",");
	var searchKeyList = searchKeys.join("_");
	resetTable();
	resetLine();
	resetTreemap();

	d3.json("/bookList/" + searchKeyList, function (data) {
		GbookList = data;
		// console.log(data);
		updateTable(data);
		updateTreemap(data);
	});

	d3.json("/timeSerial/" + searchKeyList, function (data) {
		// console.log(data);
		updateLine(data);
	});
            
            
            
	// console.log("startQuery");
}

var CallList = []

function clearCallList(){
	CallList = []
	updateCallList();
}

function addCallNoTag(tag){
	CallList.push(tag);
	updateCallList();
}

function getCallList(){
	str = ""
	for (var i = 0; i < CallList.length; i++) {
		s = CallList[i];
		str+= '_CALL:'+s.code;
	};
	return str;
}

function updateCallList () {
	str = ""
	for (var i = 0; i < CallList.length; i++) {
		s = CallList[i];
		str+= '<span class="label label-default">'+s.name+'</span> ';
	};
	// console.log(str);
	document.getElementById('tagList').innerHTML = str;
}
