d3.csv("data/id_frequency_recommand.csv",function(data){
    // console.log(data);
    var maxfrequency = d3.max(data.map(function(d){return Number(d.frequency);}));
    // console.log(maxfrequency);
    var svg = d3.select("body").selectAll("svg").enter
    .enter().append("g")
        .data(data)
        .style("fill","hsl(100,"+maxfrequency*2+"%,50%)")
        .attr("width",10)
        .attr("height",10)
        .attr("transform", function(d,i){return "translate(20," + 10*i + ")";});
})