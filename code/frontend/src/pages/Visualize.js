import React, { Component, Fragment } from 'react';
import Tree from 'react-d3-tree';

import './Visualize.css';

const myTreeData = [
    {
        name: 'Actor',
        children: [
            {
                name: 'User',
            },
            {
                name: 'Admin',
            }
        ],
    },
];

class VisualizePage extends Component {
    state = {}

    constructor(props) {
        super(props);
        this.treeContainer = React.createRef();
    }

    componentDidMount() {
        const dimensions = this.treeContainer.current.getBoundingClientRect();
        this.setState({
            translate: {
                x: dimensions.width / 2,
                y: dimensions.height / 2
            }
        });
    }

    render(){
        return (
            <Fragment >
                <div ref={this.treeContainer} className="visualize-container">

                <Tree data={myTreeData} 
                    translate={this.state.translate}
                    orientation={'horizontal'}/>

            </div>
        </Fragment>);
    }
}

export default VisualizePage;