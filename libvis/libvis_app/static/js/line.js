var myChart = echarts.init(document.getElementById('lineChart'));

var option = {
    title: {
        text: '每月借阅次数统计',
        padding: '0px',
        show: false
    },
    toolbox: {
        // show : true,
        show: false,
        feature: {
            mark: { show: true },
            dataZoom: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: true },
            saveAsImage: { show: true }
        }
    },
    tooltip: {
        trigger: 'axis'
    },
    // calculable : true,
    dataZoom: {
        show: true,
        realtime: true,
        // x:0,
        // y:0,
        // dataBackgroundColor:'rgba(38,143,26,0.6)',
        dataBackgroundColor: 'rgba(56,151,197,0.6)',
        // backgroundColor:'rgba(156,151,197,0.6)',
        start: 20,
        end: 60,
        // width:800,
        // height:200
    },
    xAxis: [
        {
            type: 'category',
            boundaryGap: false
            // ,data:timestampRecord
        }
    ],
    yAxis: [
        {
            type: 'value'
        }
    ],
    series: [
        {
            name: '借阅次数',
            type: 'line'
            // data:function (){
            //     var list = [];
            //     for (var i = 1; i <= 30; i++) {
            //         list.push(Math.round(Math.random()* 10));
            //     }
            //     return list;
            // }()
            // ,data:valueRecord
        }
    ],
    backgroundColor: 'rgba(0,0,0,0)'
};


function getTimerecord(data) {
    var timerecord = {};
    for (var i = data.length - 1; i >= 0; i--) {
        var timeserial = data[i].timeserial;
        for (var j = timeserial.length - 1; j >= 0; j--) {
            var t = timeserial[j].substring(0, 6);
            if (timerecord[t])
                timerecord[t] += 1;
            else
                timerecord[t] = 1;
        };
    };
    return timerecord;
}

function getTimestamp(timerecord) {
    var keys = [];
    for (var key in timerecord)
        keys.push(key);
    keys.sort();
    var begin = keys[0];
    var end = keys[keys.length - 1];
    var timestamp = [];
    for (var time = begin; time != end;) {
        var year = +time.substring(0, 4);
        var month = +time.substring(4, 6);
        timestamp.push(time);
        if (month != 12) {
            month++;
        }
        else {
            year++;
            month = 1;
        }
        time = year.toString();
        var m = month.toString();
        if (m.length == 1) {
            time += '0' + m;
        } else {
            time += m;
        }
    }
    return timestamp;
}

function resetLine() {
    myChart.clear();
}

function updateLine(data) {
    var timerecord = getTimerecord(data);
    var timestamp = getTimestamp(timerecord);
    var value = timestamp.map(function (d) {
        var r = timerecord[d];
        if (r)
            return r;
        else
            return 0;
    });
    // console.log(timestamp);
    // console.log(value);

    // console.log(timerecord);
    option.series[0].data = value;
    option.xAxis[0].data = timestamp;
    myChart.setOption(option); 
    // myChart.refresh();
}