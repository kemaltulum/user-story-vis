import React, { Component } from 'react';

import * as d3 from "d3";


class CollapsibleTree extends Component {
    componentDidMount() {




    }

    componentDidUpdate() {

    }

    bfs(arr, root) {
        arr.push({ ...root, children: null });
        if (root.children) {
            root.children.forEach(element => {
                this.bfs(arr, element);
            });
        }
    }

    short(text) {
        let short = '';
        if (text && text.length > 15) {
            let arr = text.split(' ');
            if (arr.length > 2) {
                for (let i = 0; i < arr.length - 2; i++) {
                    short += arr[i].charAt(0).toUpperCase() + '. ';
                }
                short += arr[arr.length - 2] + ' ';
                short += arr[arr.length - 1];
                return short
            }
        }
        return text;
    }

    font(text) {
        if (text && text.length >= 24) {
            return "9px";
        } else if (text && text.length >= 20) {
            return "10px";
        } else if (text && text.length > 15) {
            return "11px";
        } else {
            return "13px";
        }
    }


    diagonal(d, w, h) {
        let dsy = d.source.y + w;
        let dsx = d.source.x + h / 2;
        let dtx = d.target.x + h / 2;
        let dty = d.target.y;
        return "M" + dsy + "," + dsx
            + "C" + (dsy + dty) / 2 + "," + dsx
            + " " + (dsy + dty) / 2 + "," + dtx
            + " " + dty + "," + dtx;
    }

    render() {
        const { data } = this.props;

        let width = this.props.width;
        let height = this.props.height;

        if (data.children && data.children.length > 10) {
            height = data.children.length * 90;
        }
        console.log(data);

        const nodeWidth = 110;
        const nodeHeight = 24;
        const margin = { y: nodeHeight / 2 + 16, x: nodeWidth / 2 + 16 };



        const treeLayout = d3.tree().size([height - 2 * margin.y, width - 2 * margin.x]);

        // Assigns parent, children, height, depth
        let root = d3.hierarchy(data, function (d) { return d.children; });
        root.x0 = height / 2;
        root.y0 = 0;

        const nodeList = treeLayout(root);
        /*var diagonal = d3.linkHorizontal()
            .x(function (d) { return d.y + nodeWidth; })
            .y(function (d) { return d.x + nodeHeight/2; }); */

        console.log(nodeList);

        let arr = [];

        this.bfs(arr, nodeList);

        console.log(arr);

        const linksList = nodeList.links();

        console.log(linksList);

        /* render the nodes */
        const nodes = arr.map(node => {
            return (
                <g key={node.x + "-" + node.y} className="node"
                    transform={`translate(${node.y}, ${node.x})`}>
                    <rect width={nodeWidth} height={nodeHeight} fill="lightblue" style={{ stroke: 'black' }} >
                    </rect>
                    <text x="5" y={nodeHeight / 2 + 3} style={{ fontSize: (this.font(node.data.name)) }}>
                        {this.short(node.data.name)}
                        <title>{node.data.name}</title>
                    </text>
                </g >
            );
        });

        /* render the links */
        const links = linksList.map(link => {
            return (
                <path key={`${link.source.x}-${link.target.y}`} fill="none" stroke="black" stroke-width="1" className="link"
                    d={this.diagonal(link, nodeWidth, nodeHeight)} />
            );
        });
        return (
            <div className="tree-container">
                <svg height={height} width={width} transform={`translate(${margin.y}, ${margin.x})`}>
                    <g>
                        {nodes}
                        {links}
                    </g>
                </svg>
            </div>
        );
    }
}

export default CollapsibleTree;