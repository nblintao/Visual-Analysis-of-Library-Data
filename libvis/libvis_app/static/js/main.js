
$(function () {
	$('#i0').tagator({
		autocomplete: ['科研', '可视化', 'Visual', 'Basic', '浙江大学','反恐','日语']
	});
});
var GbookList;
function startQuery() {
	var searchKeys = document.getElementById("i0").value.split(",");
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