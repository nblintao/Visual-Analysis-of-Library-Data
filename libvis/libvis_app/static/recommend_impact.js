d3.csv("data/id_frequency_recommend.csv",function(data){
    data.forEach(function(d){
        d.frequency = +d.frequency;
    })
    data.sort(function(a,b){return a.frequency - b.frequency;})
    // console.log(data);
    var maxfrequency = d3.max(data.map(function(d){return d.frequency;}));
    // console.log(maxfrequency);
    var svg = d3.select("body").append("svg");
    var bar = svg.selectAll("g")
    var pix = bar.data(data)
      .enter();

    var pix_height = 100;
    var pix_width = 0.10;
    var recommend_offset = 20;

    pix.append("rect")
        .style("fill",function(d){
            if(d.recommend == '0')
                return "hsl(240,"+d.frequency/maxfrequency*100+"%,50%)";
            else
                return "red";
        })
        .attr("width",pix_width)
        .attr("height",pix_height)
        .attr("transform", function(d,i){
            if(d.recommend == '0')
                offset = 0;
            else
                offset = recommend_offset;
            return "translate(" + pix_width*i + "," + offset + ")";
        });
})