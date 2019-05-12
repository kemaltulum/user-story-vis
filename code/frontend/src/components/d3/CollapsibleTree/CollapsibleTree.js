import React, { Component } from 'react';

import * as d3 from "d3";

import NodesGroup from './NodesGroup';
import LinksGroup from './LinksGroup';


class CollapsibleTree extends Component {

    bfs(arr, root) {
        arr.push({ ...root });
        if (root.children) {
            root.children.forEach(element => {
                this.bfs(arr, element);
            });
        }
    }


    render() {
        const { data } = this.props;

        let width = this.props.width;
        let height = this.props.height;

        if(data.children && data.children.length > 10) {
           height = data.children.length * 90;
        }

        const nodeWidth = 110;
        const nodeHeight = 24;
        const margin = {y: nodeHeight/2+16, x:nodeWidth/2+16};

        

        const treeLayout = d3.tree().size([height - 2 * margin.y, width - 2*margin.x]);

        // Assigns parent, children, height, depth
        let root = d3.hierarchy(data, function (d) { return d.children; });
        root.x0 = height / 2;
        root.y0 = 0;

        const nodeList = treeLayout(root);
        /*var diagonal = d3.linkHorizontal()
            .x(function (d) { return d.y + nodeWidth; })
            .y(function (d) { return d.x + nodeHeight/2; }); */


        const linksList = nodeList.links();

        return (
            <div className="tree-container">
                <svg height={height} width={width} transform={`translate(${margin.y}, ${margin.x})`}>
                    <g>
                        <NodesGroup nodeList={nodeList} linksList={linksList} />
                    </g>
                </svg>
            </div>
        );
    }
}

export default CollapsibleTree;