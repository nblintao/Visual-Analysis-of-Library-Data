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
		if (!code) continue;
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
	//	console.log(JSON.stringify(newtree));
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
		if (children.length)
			availTree['children'] = children;
	}
	else if (fullTree['size']) {
		availTree['size'] = fullTree['size'];
	} else {
		console.log(fullTree);
	}
	return availTree;
}

var GtreeType = 1;

function chageTreeType(type) {
	console.log(type);
	GtreeType = type;
	if (GbookList) {
		resetTreemap();
		updateTreemap(GbookList);
	}
}

function updateTreemap(data) {
	var w = document.getElementById('treemap').clientWidth,
		h = document.getElementById('treemap').clientHeight;

	d3.json("static/data/GTF.json", function (info) {

		var node = generateTree(info, data);
		if (GtreeType == 1)
			drawTreemap(node);
		//		drawRadial(root);
		else if (GtreeType == 2)
			drawCollapsibleTree(node);
	});

	function drawCollapsibleTree(treeData) {


		// Calculate total nodes, max label length
		var totalNodes = 0;
		var maxLabelLength = 0;
		// variables for drag/drop
		var selectedNode = null;
		var draggingNode = null;
		// panning variables
		var panSpeed = 200;
		var panBoundary = 20; // Within 20px from edges will pan when dragging.
		// Misc. variables
		var i = 0;
		var duration = 750;
		var root;

		// size of the diagram
		//		var viewerWidth = $(document).width();
		//		var viewerHeight = $(document).height();		
		var viewerWidth = w;
		var viewerHeight = h;

		var tree = d3.layout.tree()
			.size([viewerHeight, viewerWidth]);

		// define a d3 diagonal projection for use by the node paths later on.
		var diagonal = d3.svg.diagonal()
			.projection(function (d) {
            return [d.y, d.x];
        });

		// A recursive helper function for performing some setup by walking through all nodes

		function visit(parent, visitFn, childrenFn) {
			if (!parent) return;

			visitFn(parent);

			var children = childrenFn(parent);
			if (children) {
				var count = children.length;
				for (var i = 0; i < count; i++) {
					visit(children[i], visitFn, childrenFn);
				}
			}
		}

		// Call visit function to establish maxLabelLength
		visit(treeData, function (d) {
			totalNodes++;
			maxLabelLength = Math.max(d.name.length, maxLabelLength);

		}, function (d) {
				return d.children && d.children.length > 0 ? d.children : null;
			});


		// sort the tree according to the node names

		function sortTree() {
			tree.sort(function (a, b) {
				return b.name.toLowerCase() < a.name.toLowerCase() ? 1 : -1;
			});
		}
		// Sort the tree initially incase the JSON isn't in a sorted order.
		sortTree();

		// TODO: Pan function, can be better implemented.

		function pan(domNode, direction) {
			var speed = panSpeed;
			if (panTimer) {
				clearTimeout(panTimer);
				translateCoords = d3.transform(svgGroup.attr("transform"));
				if (direction == 'left' || direction == 'right') {
					translateX = direction == 'left' ? translateCoords.translate[0] + speed : translateCoords.translate[0] - speed;
					translateY = translateCoords.translate[1];
				} else if (direction == 'up' || direction == 'down') {
					translateX = translateCoords.translate[0];
					translateY = direction == 'up' ? translateCoords.translate[1] + speed : translateCoords.translate[1] - speed;
				}
				scaleX = translateCoords.scale[0];
				scaleY = translateCoords.scale[1];
				scale = zoomListener.scale();
				svgGroup.transition().attr("transform", "translate(" + translateX + "," + translateY + ")scale(" + scale + ")");
				d3.select(domNode).select('g.node').attr("transform", "translate(" + translateX + "," + translateY + ")");
				zoomListener.scale(zoomListener.scale());
				zoomListener.translate([translateX, translateY]);
				panTimer = setTimeout(function () {
					pan(domNode, speed, direction);
				}, 50);
			}
		}

		// Define the zoom function for the zoomable tree

		function zoom() {
			svgGroup.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
		}


		// define the zoomListener which calls the zoom function on the "zoom" event constrained within the scaleExtents
		var zoomListener = d3.behavior.zoom().scaleExtent([0.1, 3]).on("zoom", zoom);

		function initiateDrag(d, domNode) {
			draggingNode = d;
			d3.select(domNode).select('.ghostCircle').attr('pointer-events', 'none');
			d3.selectAll('.ghostCircle').attr('class', 'ghostCircle show');
			d3.select(domNode).attr('class', 'node activeDrag');

			svgGroup.selectAll("g.node").sort(function (a, b) { // select the parent and sort the path's
				if (a.id != draggingNode.id) return 1; // a is not the hovered element, send "a" to the back
				else return -1; // a is the hovered element, bring "a" to the front
			});
			// if nodes has children, remove the links and nodes
			if (nodes.length > 1) {
				// remove link paths
				links = tree.links(nodes);
				nodePaths = svgGroup.selectAll("path.link")
					.data(links, function (d) {
                    return d.target.id;
                }).remove();
				// remove child nodes
				nodesExit = svgGroup.selectAll("g.node")
					.data(nodes, function (d) {
                    return d.id;
                }).filter(function (d, i) {
                    if (d.id == draggingNode.id) {
                        return false;
                    }
                    return true;
                }).remove();
			}

			// remove parent link
			parentLink = tree.links(tree.nodes(draggingNode.parent));
			svgGroup.selectAll('path.link').filter(function (d, i) {
				if (d.target.id == draggingNode.id) {
					return true;
				}
				return false;
			}).remove();

			dragStarted = null;
		}

		// define the baseSvg, attaching a class for styling and the zoomListener
		//		var baseSvg = d3.select("#tree-container").append("svg")
		//			.attr("width", viewerWidth)
		//			.attr("height", viewerHeight)
		//			.attr("class", "overlay")
		//			.call(zoomListener);


		var baseSvg = d3.select("#treemap").append("div")
			.attr("class", "chart")
			.style("width", viewerWidth + "px")
			.style("height", viewerHeight + "px")
			.append("svg:svg")
			.attr("width", viewerWidth)
			.attr("height", viewerHeight)
			.attr("class", "overlay")
			.call(zoomListener);		
		//		.append("svg:g")
		//		.attr("transform", "translate(.5,.5)");


		// Define the drag listeners for drag/drop behaviour of nodes.
		dragListener = d3.behavior.drag()
			.on("dragstart", function (d) {
            if (d == root) {
                return;
            }
            dragStarted = true;
            nodes = tree.nodes(d);
            d3.event.sourceEvent.stopPropagation();
            // it's important that we suppress the mouseover event on the node being dragged. Otherwise it will absorb the mouseover event and the underlying node will not detect it d3.select(this).attr('pointer-events', 'none');
        })
			.on("drag", function (d) {
            if (d == root) {
                return;
            }
            if (dragStarted) {
                domNode = this;
                initiateDrag(d, domNode);
            }

            // get coords of mouseEvent relative to svg container to allow for panning
            relCoords = d3.mouse($('svg').get(0));
            if (relCoords[0] < panBoundary) {
                panTimer = true;
                pan(this, 'left');
            } else if (relCoords[0] > ($('svg').width() - panBoundary)) {

                panTimer = true;
                pan(this, 'right');
            } else if (relCoords[1] < panBoundary) {
                panTimer = true;
                pan(this, 'up');
            } else if (relCoords[1] > ($('svg').height() - panBoundary)) {
                panTimer = true;
                pan(this, 'down');
            } else {
                try {
                    clearTimeout(panTimer);
                } catch (e) {

                }
            }

            d.x0 += d3.event.dy;
            d.y0 += d3.event.dx;
            var node = d3.select(this);
            node.attr("transform", "translate(" + d.y0 + "," + d.x0 + ")");
            updateTempConnector();
        }).on("dragend", function (d) {
            if (d == root) {
                return;
            }
            domNode = this;
            if (selectedNode) {
                // now remove the element from the parent, and insert it into the new elements children
                var index = draggingNode.parent.children.indexOf(draggingNode);
                if (index > -1) {
                    draggingNode.parent.children.splice(index, 1);
                }
                if (typeof selectedNode.children !== 'undefined' || typeof selectedNode._children !== 'undefined') {
                    if (typeof selectedNode.children !== 'undefined') {
                        selectedNode.children.push(draggingNode);
                    } else {
                        selectedNode._children.push(draggingNode);
                    }
                } else {
                    selectedNode.children = [];
                    selectedNode.children.push(draggingNode);
                }
                // Make sure that the node being added to is expanded so user can see added node is correctly moved
                expand(selectedNode);
                sortTree();
                endDrag();
            } else {
                endDrag();
            }
        });

		function endDrag() {
			selectedNode = null;
			d3.selectAll('.ghostCircle').attr('class', 'ghostCircle');
			d3.select(domNode).attr('class', 'node');
			// now restore the mouseover event or we won't be able to drag a 2nd time
			d3.select(domNode).select('.ghostCircle').attr('pointer-events', '');
			updateTempConnector();
			if (draggingNode !== null) {
				update(root);
				centerNode(draggingNode);
				draggingNode = null;
			}
		}

		// Helper functions for collapsing and expanding nodes.

		function collapse(d) {
			if (d.children) {
				d._children = d.children;
				d._children.forEach(collapse);
				d.children = null;
			}
		}

		function expand(d) {
			if (d._children) {
				d.children = d._children;
				d.children.forEach(expand);
				d._children = null;
			}
		}

		var overCircle = function (d) {
			selectedNode = d;
			updateTempConnector();
		};
		var outCircle = function (d) {
			selectedNode = null;
			updateTempConnector();
		};

		// Function to update the temporary connector indicating dragging affiliation
		var updateTempConnector = function () {
			var data = [];
			if (draggingNode !== null && selectedNode !== null) {
				// have to flip the source coordinates since we did this for the existing connectors on the original tree
				data = [{
					source: {
						x: selectedNode.y0,
						y: selectedNode.x0
					},
					target: {
						x: draggingNode.y0,
						y: draggingNode.x0
					}
				}];
			}
			var link = svgGroup.selectAll(".templink").data(data);

			link.enter().append("path")
				.attr("class", "templink")
				.attr("d", d3.svg.diagonal())
				.attr('pointer-events', 'none');

			link.attr("d", d3.svg.diagonal());

			link.exit().remove();
		};

		// Function to center node when clicked/dropped so node doesn't get lost when collapsing/moving with large amount of children.

		function centerNode(source) {
			scale = zoomListener.scale();
			x = -source.y0;
			y = -source.x0;
			x = x * scale + viewerWidth / 2;
			y = y * scale + viewerHeight / 2;
			d3.select('g').transition()
				.duration(duration)
				.attr("transform", "translate(" + x + "," + y + ")scale(" + scale + ")");
			zoomListener.scale(scale);
			zoomListener.translate([x, y]);
		}

		// Toggle children function

		function toggleChildren(d) {
			if (d.children) {
				d._children = d.children;
				d.children = null;
			} else if (d._children) {
				d.children = d._children;
				d._children = null;
			}
			return d;
		}

		// Toggle children on click.

		function click(d) {
			if (d3.event.defaultPrevented) return; // click suppressed
			d = toggleChildren(d);
			update(d);
			centerNode(d);
		}

		function update(source) {
			// Compute the new height, function counts total children of root node and sets tree height accordingly.
			// This prevents the layout looking squashed when new nodes are made visible or looking sparse when nodes are removed
			// This makes the layout more consistent.
			var levelWidth = [1];
			var childCount = function (level, n) {

				if (n.children && n.children.length > 0) {
					if (levelWidth.length <= level + 1) levelWidth.push(0);

					levelWidth[level + 1] += n.children.length;
					n.children.forEach(function (d) {
						childCount(level + 1, d);
					});
				}
			};
			childCount(0, root);
			var newHeight = d3.max(levelWidth) * 25; // 25 pixels per line  
			tree = tree.size([newHeight, viewerWidth]);

			// Compute the new tree layout.
			var nodes = tree.nodes(root).reverse(),
				links = tree.links(nodes);

			// Set widths between levels based on maxLabelLength.
			nodes.forEach(function (d) {
				d.y = (d.depth * (maxLabelLength * 10)); //maxLabelLength * 10px
				// alternatively to keep a fixed scale one can set a fixed depth per level
				// Normalize for fixed-depth by commenting out below line
				// d.y = (d.depth * 500); //500px per level.
			});

			// Update the nodes…
			node = svgGroup.selectAll("g.node")
				.data(nodes, function (d) {
                return d.id || (d.id = ++i);
            });

			// Enter any new nodes at the parent's previous position.
			var nodeEnter = node.enter().append("g")
				.call(dragListener)
				.attr("class", "node")
				.attr("transform", function (d) {
                return "translate(" + source.y0 + "," + source.x0 + ")";
            })
				.on('click', click);

			nodeEnter.append("circle")
				.attr('class', 'nodeCircle')
				.attr("r", 0)
				.style("fill", function (d) {
                return d._children ? "lightsteelblue" : "#fff";
            });

			nodeEnter.append("text")
				.attr("x", function (d) {
                return d.children || d._children ? -10 : 10;
            })
				.attr("dy", ".35em")
				.attr('class', 'nodeText')
				.attr("text-anchor", function (d) {
                return d.children || d._children ? "end" : "start";
            })
				.text(function (d) {
                return d.name;
            })
				.style("fill-opacity", 0);

			// phantom node to give us mouseover in a radius around it
			nodeEnter.append("circle")
				.attr('class', 'ghostCircle')
				.attr("r", 30)
				.attr("opacity", 0.2) // change this to zero to hide the target area
				.style("fill", "red")
				.attr('pointer-events', 'mouseover')
				.on("mouseover", function (node) {
                overCircle(node);
            })
				.on("mouseout", function (node) {
                outCircle(node);
            });

			// Update the text to reflect whether node has children or not.
			node.select('text')
				.attr("x", function (d) {
                return d.children || d._children ? -10 : 10;
            })
				.attr("text-anchor", function (d) {
                return d.children || d._children ? "end" : "start";
            })
				.text(function (d) {
                return d.name;
            });

			// Change the circle fill depending on whether it has children and is collapsed
			node.select("circle.nodeCircle")
				.attr("r", 4.5)
				.style("fill", function (d) {
                return d._children ? "lightsteelblue" : "#fff";
            });

			// Transition nodes to their new position.
			var nodeUpdate = node.transition()
				.duration(duration)
				.attr("transform", function (d) {
                return "translate(" + d.y + "," + d.x + ")";
            });

			// Fade the text in
			nodeUpdate.select("text")
				.style("fill-opacity", 1);

			// Transition exiting nodes to the parent's new position.
			var nodeExit = node.exit().transition()
				.duration(duration)
				.attr("transform", function (d) {
                return "translate(" + source.y + "," + source.x + ")";
            })
				.remove();

			nodeExit.select("circle")
				.attr("r", 0);

			nodeExit.select("text")
				.style("fill-opacity", 0);

			// Update the links…
			var link = svgGroup.selectAll("path.link")
				.data(links, function (d) {
                return d.target.id;
            });

			// Enter any new links at the parent's previous position.
			link.enter().insert("path", "g")
				.attr("class", "link")
				.attr("d", function (d) {
                var o = {
                    x: source.x0,
                    y: source.y0
                };
                return diagonal({
                    source: o,
                    target: o
                });
            });

			// Transition links to their new position.
			link.transition()
				.duration(duration)
				.attr("d", diagonal);

			// Transition exiting nodes to the parent's new position.
			link.exit().transition()
				.duration(duration)
				.attr("d", function (d) {
                var o = {
                    x: source.x,
                    y: source.y
                };
                return diagonal({
                    source: o,
                    target: o
                });
            })
				.remove();

			// Stash the old positions for transition.
			nodes.forEach(function (d) {
				d.x0 = d.x;
				d.y0 = d.y;
			});
		}

		// Append a group which holds all nodes and which the zoom Listener can act upon.
		var svgGroup = baseSvg.append("g");

		// Define the root
		root = treeData;
		root.x0 = viewerHeight / 2;
		root.y0 = 0;

		// Layout the tree initially and center on the root node.
		update(root);
		centerNode(root);
	}

	function drawRadial(root) {
		var diameter = 960;

		var tree = d3.layout.tree()
			.size([360, diameter / 2 - 120])
			.separation(function (a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; });

		var diagonal = d3.svg.diagonal.radial()
			.projection(function (d) { return [d.y, d.x / 180 * Math.PI]; });

		var svg = d3.select("body").append("svg")
			.attr("width", diameter)
			.attr("height", diameter - 150)
			.append("g")
			.attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

		var nodes = tree.nodes(root),
			links = tree.links(nodes);

		var link = svg.selectAll(".link")
			.data(links)
			.enter().append("path")
			.attr("class", "link")
			.attr("d", diagonal);

		var node = svg.selectAll(".node")
			.data(nodes)
			.enter().append("g")
			.attr("class", "node")
			.attr("transform", function (d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })

		node.append("circle")
			.attr("r", 4.5);

		node.append("text")
			.attr("dy", ".31em")
			.attr("text-anchor", function (d) { return d.x < 180 ? "start" : "end"; })
			.attr("transform", function (d) { return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)"; })
			.text(function (d) { return d.name; });


		d3.select(self.frameElement).style("height", diameter - 150 + "px");
	}

	function drawTreemap(node) {
		var x = d3.scale.linear().range([0, w]),
			y = d3.scale.linear().range([0, h]),
			color = d3.scale.category20c();
		var root = node;

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


}

