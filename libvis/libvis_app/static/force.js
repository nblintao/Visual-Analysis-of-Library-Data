d3.json("data/force.json", function(error, graph) {
  var width = 900,
      height = 690;

  var color = d3.scale.category20();

  var force = d3.layout.force()
      .charge(-10)
      .linkDistance(400)
      .size([width, height]);

  var svg_force = d3.select(".force").append("svg")
      .attr("width", width)
      .attr("height", height);

  force
      .nodes(graph.nodes)
      .links(graph.links)
      .start();

  var link = svg_force.selectAll(".link")
      .data(graph.links)
    .enter().append("line")
      .attr("class", "link")
      .style("stroke-width", function(d) { return Math.sqrt(d.value); });

  var node = svg_force.selectAll(".node")
      .data(graph.nodes)
    .enter().append("circle")
      .attr("class", "node")
      .attr("r", 15)
      .style("fill", function(d) { return color(d.group); })
      .call(force.drag);

  var name = svg_force.selectAll(".text")
      .data(graph.nodes)
    .enter().append("text")
      .text(function(d){return d.name;})
      .attr("font-size","15")
      .call(force.drag);

  node.append("title")
      .text(function(d) { return d.name; });

  force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });

    name.attr("x", function(d){return d.x - 100;})
        .attr("y", function(d){return d.y;});
  });
});