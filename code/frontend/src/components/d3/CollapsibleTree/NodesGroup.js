import React, { Component, Fragment } from 'react';
import { TransitionMotion, spring } from 'react-motion';
import {_} from 'lodash';

export default class NodesGroup extends Component {

    constructor(props) {
        super(props);
        this.state = {
            oldNodesList: null
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


    render() {
        const { nodeList } = this.props;
        const nodeArr = []
        this.bfs(nodeArr, nodeList);
        const nodesConfig = nodeArr.map(node => ({
            key: node.x + "-" + node.y,
            style: { x: spring(node.x), y: spring(node.y) },
            data: node
        }));

        console.log({nodesConfig});
        const defaultNodesConfig = nodeArr.map(node => {
            const style = node.parent ? { x: node.parent.x, y: node.parent.y } : { x: node.x, y: 0 };
            return {
                key: node.x + "-" + node.y,
                style: style,
                data: node
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
                                                    <text x="5" y={nodeHeight / 2 + 3} style={{ fontSize: (this.font(config.data.data.name)) }}>
                                                        {this.short(config.data.data.name)}
                                                        <title>{config.data.data.name}</title>
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

        return nodes;
    }


    componentWillReceiveProps() {
        const oldNodesList = this.props.nodesList;
        this.setState({ oldNodesList });
    }


    nodeWillEnter(node) {
        const nodesList = this.state.oldNodesList || this.props.nodesList;
        const { x, y } = this.findParent(node.data, nodesList);
        return { x, y };
    }


    nodeWillLeave(node) {
        const { nodesList } = this.props;
        const { x, y } = this.findParent(node.data, nodesList);
        return {
            x: spring(x),
            y: spring(y)
        };
    }


    findParent(node, nodesList) {
        let parent = _.find(nodesList, { id: node.parent.id });
        parent = parent ? parent : this.findParent(node.parent, nodesList);
        return parent;
    }


    handleGroupClick(d) {
        /* has no children, do nothing 
        if (!d.children && !d._children) {
            return;
        }

        const data = d.ref;

        console.log({data});

        if (data.children) {
            data._children = data.children;
            data.children = null;
            this.bfs(this.props.nodeList);
        } else {
            data.children = data._children;
            data.children = null;
            this.bfs(this.props.nodeList);
        } */
    }

    findPathInTree(d) {
        let path;

        /* root node */
        if (d.path.length == 1) {
            path = ['pedigreeTree'];
            return path;
        }

        /* create the path to query in the baobab tree */
        path = _.tail(d.path);
        path = _.reduce(path, (result, id) => {
            result.push((d) => d.id == id);
            return result;
        }, []);
        path = _.zip(_.fill(Array(path.length), 'children'), path);
        path = _.flatten(path);
        path = _.compact(path);
        path.unshift('pedigreeTree');

        return path;
    }
};