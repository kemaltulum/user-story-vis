import React, { Component, Fragment } from 'react';
import { TransitionMotion, spring } from 'react-motion';
import {_} from 'lodash';

export default class NodesGroup extends Component {

    constructor(props) {
        super(props);
        this.state = {
            nodeList: props.nodeList,
            linksList: props.linksList
        };
    }

    bfs(arr, root) {
        arr.push({ ...root, ref: root });
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
        const { nodeList } = this.state;
        const nodeArr = []
        this.bfs(nodeArr, nodeList);
        const nodesConfig = nodeArr.map(node => ({
            key: node.x + "-" + node.y,
            style: { x: spring(node.x), y: spring(node.y) },
            data: node.data
        }));

        const defaultNodesConfig = nodeArr.map(node => {
            const style = node.parent ? { x: node.parent.x, y: node.parent.y } : { x: node.x, y: 0 };
            return {
                key: node.x + "-" + node.y,
                style: style,
                data: node.data
            };
        });

        const nodeWidth = 110;
        const nodeHeight = 24;

        
        
        const nodes = (
            <TransitionMotion
                willEnter={this.nodeWillEnter.bind(this)}
                willLeave={this.nodeWillLeave.bind(this)}
                defaultStyles={defaultNodesConfig}
                styles={nodesConfig}>
                {
                    nodesConfig => {
                        return (
                            <g transform="translate(0,0)">
                                {
                                    nodesConfig.map(
                                        config => {
                                            return (
                                                <g key={config.key} className="node" 
                                                    transform={`translate(${config.style.y}, ${config.style.x})`}>
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
                            </g>
                        );
                    }
                }
            </TransitionMotion>
        );

        let { linksList } = this.state;
        linksList = linksList.filter(link => !link.collapsed);
        const linksConfig = linksList.map(link => ({
            key: `${link.source.x}-${link.target.y}-${link.source.y}-${link.target.x}`,
            style: {
                sourceX: spring(link.source.x),
                sourceY: spring(link.source.y),
                targetX: spring(link.target.x),
                targetY: spring(link.target.y)
            },
            data: link
        }));
        const defaultLinksConfig = linksList.map(link => ({
            key: `${link.source.x}-${link.target.y}-${link.source.y}-${link.target.x}`,
            style: {
                sourceX: link.source.x,
                sourceY: link.source.y,
                targetX: link.source.x,
                targetY: link.source.y
            },
            data: link
        }));

        console.log(linksList);

        const links = (
            <TransitionMotion
                willEnter={this.linkWillEnter.bind(this)}
                willLeave={this.linkWillLeave.bind(this)}
                defaultStyles={defaultLinksConfig}
                styles={linksConfig}>
                {
                    linksConfig => {
                        return (
                            <g transform="translate(0,0)">
                                {
                                    linksConfig.map(
                                        config => {
                                            return (
                                                <path key={config.key} fill="none" stroke="black" className="link"
                                                    d={this.diagonal(config.data, nodeWidth, nodeHeight)} />
                                            );
                                        }
                                    )
                                }
                            </g>
                        );
                    }
                }
            </TransitionMotion>
        );


        return (
        <Fragment>
            {nodes}
            {links}
        </Fragment>
        );
    }



    nodeWillEnter(node) {
        const { nodeList } = this.state;
        const { x, y } = this.findParent(node.data, nodeList);
        return { x, y };
    }


    nodeWillLeave(node) {
        const { nodeList } = this.state;
        const { x, y } = this.findParent(node.data, nodeList);
        return {
            x: spring(x),
            y: spring(y)
        };
    }


    findParent(node, nodesList) {
        let parent = this.findNode(nodesList, node.parentId);
        parent = parent ? parent : this.findParent(node.parent, nodesList);
        return parent;
    }

    findNode(root, _id) {
        if (root.data._id === _id) {
            return root;
        } else if (root.children && root.children.length > 0) {
            for (let i = 0; i < root.children.length; i++) {
                let childRoot = root.children[i];
                let node = this.findNode(childRoot, _id);
                if(node){
                    return node;
                }
            }
            return null;
        } else {
            return null;
        }
    }

    findNodeAndUpdate(root, _id, sources){
        if(root.data._id === _id){
            if (root.children) {
                root.children2 = root.children;
                let result = delete root.children;
            }

            else if (root.children2) {
                root.children = root.children2;
                delete root.children2;
            }

            if(root.children || root.children2){
                sources.push(root.data._id);
            }

            return root;
        } else if(root.children && root.children.length > 0){
            let newChildren = []
            for(let i=0; i<root.children.length; i++){
                let childRoot = root.children[i];
                let updatedNode = this.findNodeAndUpdate(childRoot, _id, sources);
                newChildren.push(updatedNode);
            }
            root.children = newChildren;
            return root;
        } else {
            return root;
        }
    }


    handleGroupClick(d) {
        if(!d.children && !d._children) {
            return;
        }
        const { nodeList } = this.state;
        
        let linkSources = [];
        let nodeListUpdated = this.findNodeAndUpdate(nodeList, d._id, linkSources);

        const { linksList } = this.state;

        linksList.forEach(link => {
            for(let i=0; i<linkSources.length; i++){
                let source = linkSources[i];
                if(source === link.source.data._id){
                    if(link.collapsed){
                        link.collapsed = false;
                    } else {
                        link.collapsed = true;
                    }
                }
            }
        });

        console.log({linksList});

        this.setState({
            nodeList: nodeListUpdated,
            linksList: linksList
        });
    }

    findLink(node, linksList) {
        let source = linksList.filter(item => item.target.data._id == node.data._id)[0];
        if (source) {
            return source.target;
        }
        if (!node.parent) {
            return node;
        }
        return this.findSource(node.parent, linksList);
    }

    linkWillEnter(link) {
        const { linksList } = this.state;
        const { x, y } = this.findLink(link.data.source, linksList);
        return {
            sourceX: x,
            sourceY: y,
            targetX: x,
            targetY: y
        };
    }

    linkWillLeave(link) {
        const { linksList } = this.state;
        const linkSource = this.findLink(link.data.source, linksList);
        const {x, y} = linkSource;
        return {
            sourceX: spring(x),
            sourceY: spring(y),
            targetX: spring(x),
            targetY: spring(y)
        };
    }

};