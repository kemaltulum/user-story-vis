import React, { Component, Fragment } from 'react';

import * as d3 from "d3";

import "./CollapsibleTree.css";

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
            return "11px";
        } else if (text && text.length >= 20) {
            return "12px";
        } else if (text && text.length > 15) {
            return "13px";
        } else {
            return "15px";
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

    handleStoriesClick(stories){
        console.log({stories});
        this.props.showStories(stories);
    }

    countLeaves(root){
        if(!root.children || root.children.length === 0){
            return 1;
        } else {
            let count = 0
            for(let i=0; i<root.children.length; i++){
                let childRoot = root.children[i];
                count += this.countLeaves(childRoot);
            }
            return count;
        }

    }

    render() {
        const { data } = this.props;

        let width = this.props.width;
        let height = this.props.height;

        let nLeaves = this.countLeaves(data);
        let newHeight = nLeaves * 105;

        if(newHeight > height){
            height = newHeight;
        }

        const nodeWidth = 154;
        const nodeHeight = 58;
        const margin = {y: nodeHeight, x:nodeWidth+20};

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
                                        /*
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
                                        */
                                        <g key={config.x + "-" + config.y} className="node" transform={`translate(${config.y}, ${config.x})`}>
                                            <g>
                                                <rect height="55" width="136" y="2" x="2" strokeWidth="1.5" stroke="#261D3D" fill="#a8a3b1" />
                                                {
                                                    ((config.data.children && config.data.children.length > 0) || (config.data.children2 && config.data.children2.length > 0)) &&
                                                    <Fragment>
                                                        <rect className="node-cursor" onClick={this.handleGroupClick.bind(this, config.data)} rx="15" id="svg_3" height="55" width="27" y="2" x="128" fillOpacity="null" strokeOpacity="null" strokeWidth="1.5" stroke="#261D3D" fill="#261D3D" />
                                                        {
                                                            config.data.children2 &&
                                                            <path className="node-cursor" onClick={this.handleGroupClick.bind(this, config.data)} d="m145.957275,43.158844l2.466873,-2.617722l2.465591,-2.61879l-2.466888,-2.620651l-2.465576,-2.618637l0,2.912262c-0.604416,0 -1.306625,0 -1.541916,0c-1.12175,0.058113 -2.506256,-1.566658 -3.979187,-3.661186c-0.549088,-0.734398 -1.103058,-1.542366 -1.69014,-2.271935c0.587082,-0.730408 1.140213,-1.537476 1.69014,-2.271835c1.472931,-2.091599 2.857437,-3.719345 3.977661,-3.660141l1.543442,-0.000969l0,2.916115l2.465576,-2.61969l2.466888,-2.621704l-2.466888,-2.624466l-2.465576,-2.620651l0,2.914246l-1.542603,0c-2.291107,0.059059 -4.003372,2.563507 -5.501709,4.598969c-1.487427,2.147858 -2.824402,3.764832 -3.599854,3.660172l-4.42337,0l0,4.652328l4.42482,0c0.774765,-0.105713 2.112427,1.512314 3.599701,3.66011c1.49765,2.03653 3.209305,4.538864 5.501099,4.599014l1.541916,0l0,2.915161l0,0z" strokeOpacity="null" strokeWidth="1" stroke="#fff" fill="#261D3D" />
                                                        }
                                                        {
                                                            config.data.children &&
                                                            <path className="node-cursor" onClick={this.handleGroupClick.bind(this, config.data)} d="m136.068832,43.620384l-2.59021,-2.617714l-2.588882,-2.618797l2.59024,-2.620651l2.588852,-2.618637l0,2.912262c0.634644,0 1.371964,0 1.619019,0c1.177826,0.058113 2.631546,-1.566666 4.178146,-3.661186c0.576538,-0.734396 1.158203,-1.542364 1.774643,-2.271933c-0.61644,-0.730408 -1.19722,-1.537476 -1.774643,-2.271835c-1.5466,-2.091599 -3.00032,-3.719345 -4.176544,-3.660141l-1.620621,-0.000969l0,2.916115l-2.588852,-2.61969l-2.59024,-2.621704l2.59024,-2.624466l2.588852,-2.620651l0,2.914246l1.619736,0c2.405655,0.059059 4.203537,2.563507 5.776794,4.598969c1.561798,2.147858 2.965622,3.764832 3.779846,3.660172l4.644531,0l0,4.652327l-4.646057,0c-0.813507,-0.105713 -2.218048,1.512314 -3.779678,3.66011c-1.57254,2.03653 -3.369781,4.538857 -5.776154,4.599007l-1.619019,0l0,2.915169l0,0z" strokeOpacity="null" strokeWidth="1" stroke="#fff" fill="#261D3D" />
                                                        }
                                                    </Fragment>
                                                }
                                                {
                                                    config.data.stories && config.data.stories.length > 0 && 
                                                    <Fragment>
                                                        {
                                                            ((config.data.children && config.data.children.length > 0) || (config.data.children2 && config.data.children2.length > 0)) ?
                                                                <rect onClick={this.handleStoriesClick.bind(this, config.data.stories)} className="node-cursor" height="13" width="82.230823" y="43.461531" x="2.615396" strokeOpacity="null" strokeWidth="1" stroke="#261D3D" fill="#261D3D" /> :
                                                                <rect onClick={this.handleStoriesClick.bind(this, config.data.stories)} className="node-cursor" height="13" width="136" y="43.461531" x="2.615396" strokeOpacity="null" strokeWidth="1" stroke="#261D3D" fill="#261D3D" />
                                                        }
                                                        <text onClick={this.handleStoriesClick.bind(this, config.data.stories)} className="node-cursor" textAnchor="start" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" id="svg_7" y="53.076916" x="27.615463" fillOpacity="null" strokeOpacity="null" strokeWidth="0" stroke="#000" fill="#fff">Stories</text>
                                                    </Fragment>
                                                }
                                                <text transform="matrix(0.970731, 0, 0, 1, 0.321963, 0)" textAnchor="start" fontFamily="Helvetica, Arial, sans-serif" fontSize={this.font(config.data.name)} id="svg_9" y="28" x="11" fillOpacity="null" strokeOpacity="null" strokeWidth="0" stroke="#000" fill="#000000">
                                                    {this.short(config.data.name)}
                                                    <title>{config.data.name}</title>
                                                </text>
                                            </g>
                                        </g>
                                                           );
                                                       }
                                                   )
                                               }
                        {
                            linksList.map(
                                linksConfig => {
                                    return (
                                        <path key={linksConfig.source.x + "-" + linksConfig.source.y + "-" + linksConfig.target.x + "-" + linksConfig.target.y} 
                                            fill="none" stroke="#261D3D" strokeWidth="1.5" className="link"
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