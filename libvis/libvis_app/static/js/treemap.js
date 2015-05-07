function resetTreemap() {
	d3.select("#treemap").selectAll("div").remove();
}

function generateTree(info, data) {
	//	Test
	data = data.map(function (d) { return d.callno; });
	//	data = ["TP391.13/CY1", "TP393.09/CM1", "TP312BA/CW1", "TP312BA/CX1", "TP312BA/CS1", "TP312BA/CA1", "TP393.09/CL1", "TP312BA/CM1", "TP312BA/CB2", "TP312BA/CS2", "TP312BA/CF1", "TP312BA/CB3a", "TP312BA/CW2", "TP312BA/CA2", "TP312BA/CK1", "TP312BA/CZ1", "TP312BA/CD2", "TP312BA/CD3", "TP312BA/CS3", "TP312BA/CB3", "TP312BA/CH1", "TP312BA/CN1", "TP312BA/CY1", "TP312BA/CZ3", "TP312BA/CB4", "TP312BA/CS2a", "TP312BA/CL2", "TP312BA/CZ2", "TP312BA/CK2", "TP312BA/CZ4", "TP312BA/CZ6", "TP312BA/CX3", "TP312BA/CN1a", "TP312BA/CD4", "TP312BA/CZ11", "TP312BA/CL4a", "TP312BA/CA3", "TP312BA/CL6", "TP312BA/CY4", "TP312BA/CD5", "TP312BA/CY5", "TP312BA/CW5", "TP312BA/CW4", "TP312BA/CM4", "TP312BA/CG3", "TP312BA/CD5a", "TP312BA-62/CB1a", "TP312BA/CB5", "TP312BA-62/CW2", "TP312BA/CY6", "TP312BA/CW7", "TP312BA/CW6", "TP312BA/CL7", "TP312BA/CZ7", "TP312BA/CJ2", "TP312BA/CK3", "TP393.4/CF1", "TP312BA/CH12.3", "TP312BA/CW3", "TP312BA-62/CW1", "TP312BA/CX2", "TP312BA-62/CC1", "TP312BA/CH4-z", "TP312BA/CG2", "TP312BA/CM3", "TP312BA-62/CM1", "TP312BA/CH4-b", "TP312BA/CY3", "TP312BA-62/CB2", "TP312BA/CL13", "TP312BA/CW10", "TP312BA/CL11", "TP312BA/CZ19", "TP312BA/CG3a", "TP312BA/CS5", "TP312BA/CM4a", "TP312BA/CW9", "TP312BA/CK5", "TP312BA-61/CL1", "TP312BA/CJ3a", "TP312BA/CZ18", "TP312BA/CW10a", "TP312BA/CA4", "TP312BA/CJ4", "TP312BA-62/CL1", "TP312BA/CL14", "TP312BA/CW8", "TP312BA/CL10", "TP312BA/CZ15", "TP393.4/CH8", "TP312BA/CZ7a", "TP312BA/CZ17", "TP312BA/CD6", "TP312BA/CQ1", "TP312BA/CY7", "TP391.41/CZ26", "TP312BA/357", "TP312BA/CQ3", "TP312BA/CL9", "TP312BA/CM1a"];
	//		data = ["TP312BA/CB2", "TP312BA/CS2", "TP312BA/CF1", "TP2"];
	for (var i in data) {
		var code = data[i];
		var node = info;
		var bestSubnode, subnode;
		while (node) {
			node['pass'] = true;
			if (node['children']) {
				node = node['children'];
				bestSubnode = null;
				for (var j in node) {
					subnode = node[j];
					if (code.indexOf(subnode.code) == 0) {
						bestSubnode = subnode;
						break;
					}
				}
				if (bestSubnode) {
					node = bestSubnode;
				} else {

					// ERROR
					// console.log("Cannot handle book code:" + code);

					if (node['size']) {
						node['size'] += 1;
					} else {
						node['size'] = 1;
					}

					break;
				}
			} else {
				if (node['size']) {
					node['size'] += 1;
				} else {
					node['size'] = 1;
				}
				break;
			}
		}
	}
	var newtree = getAvailNodes(info);
		console.log(newtree);
	return newtree;
}

function getAvailNodes(fullTree) {
	var availTree = {};
	availTree['name'] = fullTree['name'];
	if (fullTree['children']) {
		var children = [];
		for (var ichild in fullTree['children']) {
			var child = fullTree['children'][ichild];
			if (child['pass']) {
				children.push(getAvailNodes(child));
			}
		}
		availTree['children'] = children;
	}
	else if (fullTree['size']) {
		availTree['size'] = fullTree['size'];
	}else{
		console.log(fullTree);
	}
	return availTree;
}

function updateTreemap(data) {
	var w = document.getElementById('treemap').clientWidth,
		h = document.getElementById('treemap').clientHeight,
		x = d3.scale.linear().range([0, w]),
		y = d3.scale.linear().range([0, h]),
		color = d3.scale.category20c(),
		root,
		node;

	var treemap = d3.layout.treemap()
		.round(false)
		.size([w, h])
		.sticky(true)
		.value(function (d) { return d.size; });

	var svg = d3.select("#treemap").append("div")
		.attr("class", "chart")
		.style("width", w + "px")
		.style("height", h + "px")
		.append("svg:svg")
		.attr("width", w)
		.attr("height", h)
		.append("svg:g")
		.attr("transform", "translate(.5,.5)");

	d3.json("static/data/GTF.json", function (info) {

		node = root = generateTree(info, data);

		var nodes = treemap.nodes(root)
			.filter(function (d) { return !d.children; });

		var cell = svg.selectAll("g")
			.data(nodes)
			.enter().append("svg:g")
			.attr("class", "cell")
			.attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; })
			.on("click", function (d) { return zoom(node == d.parent ? root : d.parent); });

		cell.append("svg:rect")
			.attr("width", function (d) { return d.dx - 1; })
			.attr("height", function (d) { return d.dy - 1; })
			.style("fill", function (d) { return color(d.parent.name); });

		cell.append("svg:text")
			.attr("x", function (d) { return d.dx / 2; })
			.attr("y", function (d) { return d.dy / 2; })
			.attr("dy", ".35em")
			.attr("text-anchor", "middle")
			.text(function (d) { return d.name; })
			.style("opacity", function (d) { d.w = this.getComputedTextLength(); return d.dx > d.w ? 1 : 0; });

		d3.select(window).on("click", function () { zoom(root); });

		d3.select("select").on("change", function () {
			treemap.value(this.value == "size" ? size : count).nodes(root);
			zoom(node);
		});
	});

	function size(d) {
		return d.size;
	}

	function count(d) {
		return 1;
	}

	function zoom(d) {
		var kx = w / d.dx, ky = h / d.dy;
		x.domain([d.x, d.x + d.dx]);
		y.domain([d.y, d.y + d.dy]);

		var t = svg.selectAll("g.cell").transition()
			.duration(d3.event.altKey ? 7500 : 750)
			.attr("transform", function (d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

		t.select("rect")
			.attr("width", function (d) { return kx * d.dx - 1; })
			.attr("height", function (d) { return ky * d.dy - 1; })

		t.select("text")
			.attr("x", function (d) { return kx * d.dx / 2; })
			.attr("y", function (d) { return ky * d.dy / 2; })
			.style("opacity", function (d) { return kx * d.dx > d.w ? 1 : 0; });

		node = d;
		d3.event.stopPropagation();
	}


}

