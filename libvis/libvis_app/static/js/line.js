
var rawRecord = [
[0,0,2460944],
[0,1,2644204],
[0,2,2600816],
[0,3,2470248],
[0,4,2294121],
[0,5,2172519],

// [1,0,944105],
[1,0,2025432],

[1,1,1873453],
[1,2,1714236],
[1,3,1577378],
[1,4,1469055],
[1,5,1461027],
[2,0,1231302],
[2,1,1132392],
[2,2,1076382],
[2,3,1021737],
[2,4,948164],
[2,5,581684],
[3,0,531303],
[3,1,806674],
[3,2,770312],
[3,3,732237],
[3,4,700394],
[3,5,800411],
[4,0,647428],
[4,1,632128],
[4,2,627842],
[4,3,620011],
[4,4,623543],
[4,5,702009],
[5,0,654674],
[5,1,634445],
[5,2,668987],
[5,3,698926],
[5,4,729242],
[5,5,888659],
[6,0,804490],
[6,1,869643],
[6,2,962380],
[6,3,1104557],
[6,4,1273334],
[6,5,1542908],
[7,0,1620629],
[7,1,1820496],
[7,2,2054581],
[7,3,2267316],
[7,4,2479523],
[7,5,2858391],
[8,0,2794021],
[8,1,3032167],
[8,2,3209267],
[8,3,3476142],
[8,4,3715152],
[8,5,4033176],
[9,0,4083348],
[9,1,4290676],
[9,2,4507312],
[9,3,4687960],
[9,4,4636786],
[9,5,5110384],
[10,0,5098770],
[10,1,5213655],
[10,2,5413006],
[10,3,5540317],
[10,4,5617442],
[10,5,5825058],
[11,0,5524991],
[11,1,5658810],
[11,2,5674634],
[11,3,5467187],
[11,4,5645516],
[11,5,5581167],
[12,0,5075335],
[12,1,5238503],
[12,2,5105682],
[12,3,5151432],
[12,4,5153000],
[12,5,5237734],
[13,0,5123814],
[13,1,5142704],
[13,2,5249382],
[13,3,5311836],
[13,4,5360349],
[13,5,5336430],
[14,0,5162438],
[14,1,5344022],
[14,2,5297141],
[14,3,5204182],
[14,4,5155353],
[14,5,5311222],
[15,0,4842757],
[15,1,4818937],
[15,2,4966158],
[15,3,4982068],
[15,4,4912099],
[15,5,4753266],
[16,0,4539021],
[16,1,4747164],
[16,2,4724381],
[16,3,4640657],
[16,4,4660284],
[16,5,4754499],
[17,0,4567457],
[17,1,4555514],
[17,2,4430231],
[17,3,4447813],
[17,4,4489888],
[17,5,4553231],
[18,0,4284491],
[18,1,4205570],
[18,2,4092818],
[18,3,4080959],
[18,4,3810623],
[18,5,4075685],
[19,0,3850551],
[19,1,3638210],
[19,2,3758919],
[19,3,3691309],
[19,4,3648763],
[19,5,3723700],
[20,0,3479956],
[20,1,3316947],
[20,2,3404811],
[20,3,3207208],
[20,4,3232294],
[20,5,3299124],
[21,0,3057632],
[21,1,2972678],
[21,2,2833183],
[21,3,2767991],
[21,4,2664124],
[21,5,2738862],
[22,0,2458156],
[22,1,2380387],
[22,2,2280710],
[22,3,2188381],
[22,4,2060133],
[22,5,2161169],
[23,0,1841754],
[23,1,1798112],
[23,2,1741854],
[23,3,1661335],
[23,4,804096]
]

var valueRecord = rawRecord.map(function(d){return d[2]});
var timestampRecord = rawRecord.map(function(d){return ''+d[0]+':'+d[1]+'0'});

var myChart = echarts.init(document.getElementById('Sselect')); 
                
var option = {
    title : {
        text: '每月借阅次数统计'
    },
    toolbox: {
        show : true,
        feature : {
            mark : {show: true},
            dataZoom : {show: true},
            dataView : {show: true, readOnly: false},
            magicType: {show: true, type: ['line', 'bar']},
            restore : {show: true},
            saveAsImage : {show: true}
        }
    }, 
    tooltip : {
        trigger: 'axis'
    },
    calculable : true,
    dataZoom : {
        show : true,
        realtime : true,
        // x:0,
        // y:0,
        // dataBackgroundColor:'rgba(38,143,26,0.6)',
        dataBackgroundColor:'rgba(56,151,197,0.6)',
        // backgroundColor:'rgba(156,151,197,0.6)',
        start : 20,
        end : 60,
        // width:800,
        // height:200
    },
    xAxis : [
        {
            type : 'category',
            boundaryGap : false,
            data:timestampRecord
        }
    ],
    yAxis : [
        {
            type : 'value'
        }
    ],
    series : [
        {
            name:'借阅次数',
            type:'line',
            // data:function (){
            //     var list = [];
            //     for (var i = 1; i <= 30; i++) {
            //         list.push(Math.round(Math.random()* 10));
            //     }
            //     return list;
            // }()
            data:valueRecord
        }
    ],
    backgroundColor: 'rgba(0,0,0,0)'
};

function getTimerecord(data){
    timerecord = {};
    for (var i = data.length - 1; i >= 0; i--) {
        timeserial = data[i].timeserial;
        for (var j = timeserial.length - 1; j >= 0; j--) {
            t = timeserial[j].substring(0,6);
            if(timerecord[t])
                timerecord[t] += 1;
            else
                timerecord[t] = 1;      
        };
    };
    return timerecord;
}

function getTimestamp(timerecord){
    keys=[];
    for (var key in timerecord)
        keys.push(key);
    keys.sort();
    begin = keys[0];
    end = keys[keys.length-1];
    timestamp = [];
    for(var time=begin; time!=end; ){
        year = +time.substring(0,4);
        month = +time.substring(4,6);
        timestamp.push(time);
        if(month!=12){
            month++;
        }
        else{
            year++;
            month=1;
        }
        time=year.toString()
        m=month.toString()
        if (m.length==1){
            time+='0'+m;
        }else{
            time+=m;
        }
    }
    return timestamp;
}

function updateLine(data){

    timerecord = getTimerecord(data);
    timestamp = getTimestamp(timerecord);
    value = timestamp.map(function(d){
        var r = timerecord[d]
        if(r)
            return r;
        else
            return 0;
    })
    console.log(timestamp);
    console.log(value);
// valueRecord
    // console.log(timerecord);
    option.series[0].data = value;
    option.xAxis[0].data = timestamp;
    myChart.setOption(option); 
}