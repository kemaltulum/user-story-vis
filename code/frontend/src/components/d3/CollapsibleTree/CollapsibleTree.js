import React, { Component } from 'react';

import * as d3 from "d3";

import NodesGroup from './NodesGroup';
import LinksGroup from './LinksGroup';


class CollapsibleTree extends Component {

    constructor(props){
        super(props);
        this.state = {
            nodeList: props.data
        };
    }

    bfs(arr, root) {
        arr.push({ ...root });
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

    findNodeAndUpdate(root, _id) {
        if (root._id === _id) {
            if (root.children) {
                root.children2 = root.children;
                let result = delete root.children;
            }

            else if (root.children2) {
                root.children = root.children2;
                delete root.children2;
            }

            return root;
        } else if (root.children && root.children.length > 0) {
            let newChildren = []
            for (let i = 0; i < root.children.length; i++) {
                let childRoot = root.children[i];
                let updatedNode = this.findNodeAndUpdate(childRoot, _id);
                newChildren.push(updatedNode);
            }
            root.children = newChildren;
            return root;
        } else {
            return root;
        }
    }

    handleGroupClick(d){
        if (!d.children && !d.children2) {
            return;
        }

        const { nodeList } = this.state;

        let nodeListUpdated = this.findNodeAndUpdate(nodeList, d._id);

        this.setState({
            nodeList: nodeListUpdated
        });

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

        const nodeArr = []
        this.bfs(nodeArr, nodeList);

        const linksList = nodeList.links();

        return (
            <div className="tree-container">
                <svg height={height} width={width} transform={`translate(${margin.y}, ${margin.x})`}>
                    <g>
                        {
                            nodeArr.map(
                                config => {
                                    return (
                                        <g key={config.x + "-" + config.y} className="node"
                                            transform={`translate(${config.y}, ${config.x})`}>
                                            <rect width={nodeWidth} height={nodeHeight} onClick={this.handleGroupClick.bind(this, config.data)}
                                                fill="lightblue" style={{ stroke: 'black' }} >
                                            </rect>
                                            <text x="5" y={nodeHeight / 2 + 3} style={{ fontSize: (this.font(config.data.name)) }}>
                                                {this.short(config.data.name)}
                                                <title>{config.data.name}</title>
                                            </text>
                                        </g >
                                    );
                                }
                            )
                        }
                        {
                            linksList.map(
                                linksConfig => {
                                    return (
                                        <path key={linksConfig.source.x + "-" + linksConfig.source.y + "-" + linksConfig.target.x + "-" + linksConfig.target.y} 
                                            fill="none" stroke="black" className="link"
                                            d={this.diagonal(linksConfig, nodeWidth, nodeHeight)} />
                                    );
                                }
                            )
                        }
                    </g>
                </svg>
            </div>
        );
    }
}

export default CollapsibleTree;