import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import * as d3 from "d3";
import { hierarchy, tree } from 'd3-hierarchy'


class CollapsibleTree extends Component {
    state = {
        i: 0,
        duration: 750
    };

    constructor(props) {
        super(props);
        this.update = this.update.bind(this)
    }

    componentDidMount() {
        this.drawTree();
    }

    drawTree() {
        const treeData = this.props.data;
        const widthProp = this.props.width;
        const heightProp = this.props.height;

        // Set the dimensions and margins of the diagram
        const margin = { top: 20, right: 90, bottom: 30, left: 90 },
            width = widthProp - margin.left - margin.right,
            height = heightProp - margin.top - margin.bottom;

        // append the svg object to the body of the page
        // appends a 'group' element to 'svg'
        // moves the 'group' element to the top left margin
        let svg = d3.select("#tree").append("svg")
            .attr("width", width + margin.right + margin.left)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate("
                + margin.left + "," + margin.top + ")");


        // declares a tree layout and assigns the size
        let treemap = d3.tree().size([height, width]);

        // Assigns parent, children, height, depth
        let root = d3.hierarchy(treeData, function (d) { return d.children; });
        root.x0 = height / 2;
        root.y0 = 0;


        this.setState({ svg: svg, treemap: treemap, root: root }, () => {
            let self = this;
            this.update(self, this.state.root);
        });

    }

    collapse(d) {
        if (d.children) {
            d._children = d.children
            d._children.forEach(this.collapse)
            d.children = null
        }
    }

    click(self, d) {
        if (d.children) {
            d._children = d.children;
            d.children = null;
        } else {
            d.children = d._children;
            d._children = null;
        }
        this.update(self, d);
    }

    diagonal(s, d) {
        let path = `M ${s.y} ${s.x}
            C ${(s.y + d.y) / 2} ${s.x},
              ${(s.y + d.y) / 2} ${d.x},
              ${d.y} ${d.x}`;

        return path;
    }

    update(self, source) {
        const treeData = self.state.treemap(this.state.root);

        // Compute the new tree layout.
        const nodes = treeData.descendants();
        const links = treeData.descendants().slice(1);

        // Normalize for fixed-depth.
        nodes.forEach(function (d) { d.y = d.depth * 180 });

        // Update the nodes...
        const node = self.state.svg.selectAll('g.node')
            .data(nodes, function (d) { return d.id || (d.id = ++self.state.i); });

        // Enter any new modes at the parent's previous position.
        const nodeEnter = node.enter().append('g')
            .attr('class', 'node')
            .attr("transform", function (d) {
                return "translate(" + source.y0 + "," + source.x0 + ")";
            })
            .on('click', function (source) { return self.click(self, self.click); });

        const nodeWidth = 120;
        const nodeHeight = 20;

        // Add Circle for the nodes
        nodeEnter.append('rect')
            .attr('class', 'node')
            .attr("width", nodeWidth)
            .attr("height", nodeHeight)
            .style("fill", "#69b3a2")
            .attr("stroke", "black")
            .style("stroke-width", 2)
            .style("fill", function (d) {
                return d._children ? "lightsteelblue" : "#fff";
            });

        // Add labels for the nodes
        nodeEnter.append('text')
            .attr("dy", ".35em")
            .attr("x", function (d) {
                return d.children || d._children ? -13 : 13;
            })
            .attr("text-anchor", function (d) {
                return d.children || d._children ? "end" : "start";
            })
            .text(function (d) { return d.data.name; });

        // UPDATE
        var nodeUpdate = nodeEnter.merge(node);

        // Transition to the proper position for the node
        nodeUpdate.transition()
            .duration(self.state.duration)
            .attr("transform", function (d) {
                return "translate(" + d.y + "," + d.x + ")";
            });

        // Update the node attributes and style
        nodeUpdate.select('circle.node')
            .attr('r', 10)
            .style("fill", function (d) {
                return d._children ? "lightsteelblue" : "#fff";
            })
            .attr('cursor', 'pointer');

        // Remove any exiting nodes
        var nodeExit = node.exit().transition()
            .duration(self.state.duration)
            .attr("transform", function (d) {
                return "translate(" + source.y + "," + source.x + ")";
            })
            .remove();

        // On exit reduce the node circles size to 0
        nodeExit.select('circle')
            .attr('r', 1e-6);

        // On exit reduce the opacity of text labels
        nodeExit.select('text')
            .style('fill-opacity', 1e-6);

        // ****************** links section ***************************

        // Update the links...
        var link = self.state.svg.selectAll('path.link')
            .data(links, function (d) { return d.id; });

        // Enter any new links at the parent's previous position.
        var linkEnter = link.enter().insert('path', "g")
            .attr("class", "link")
            .attr('d', function (d) {
                var o = { x: source.x0, y: source.y0 }
                return self.diagonal(o, o)
            });

        // UPDATE
        var linkUpdate = linkEnter.merge(link);

        // Transition back to the parent element position
        linkUpdate.transition()
            .duration(self.state.duration)
            .attr('d', function (d) { return self.diagonal(d, d.parent) });

        // Remove any exiting links
        var linkExit = link.exit().transition()
            .duration(self.state.duration)
            .attr('d', function (d) {
                var o = { x: source.x, y: source.y }
                return self.diagonal(o, o)
            })
            .remove();

        // Store the old positions for transition.
        nodes.forEach(function (d) {
            d.x0 = d.x;
            d.y0 = d.y;
        });



    }

    componentDidUpdate() {

    }

    bfs(arr, root){
        arr.push({...root, children: null});
        if(root.children){
            root.children.forEach(element => {
                bfs(arr, element);
            });
        }
    }

    render() {
        return (
            <div id="tree" className="TreeChart"></div>
        );
    }
}

export default CollapsibleTree;