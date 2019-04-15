import React, { Component, Fragment } from 'react';

import './Visualize.css';

import { connect } from 'react-redux';

import Spinner from '../components/Spinner/Spinner';
import CollapsibleTree from '../components/d3/CollapsibleTree/CollapsibleTree';

import { storyActions } from '../actions/story.actions';

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
    }
];

class NodeLabel extends React.PureComponent {
    render() {
        const { className, nodeData } = this.props
        return (
            <div className={className}>
                <h2>{nodeData.name}</h2>
            </div>
        )
    }
}


class VisualizePage extends Component {
    state = {}

    constructor(props) {
        super(props);
        this.treeContainer = React.createRef();
    }

    componentDidMount() {
        this.props.getStoriesTree(this.props.match.params.project_id, this.props.token);
        const dimensions = this.treeContainer.current.getBoundingClientRect();
        this.setState({
            translate: {
                x: dimensions.width / 2,
                y: dimensions.height / 2
            }
        });
    }

    
    render() {
        return (
            <Fragment >
                {this.props.isLoading ? (
                    <Spinner />
                ) : (
                        <div ref={this.treeContainer} className="visualize-container">
                            
                            <CollapsibleTree data={this.props.storiesTree} width="1000" height="1200"/>

                        </div>
                    )}

            </Fragment>);
    }
}

/*
<Tree data={this.props.storiesTree}
                                translate={this.state.translate}
                                allowForeignObjects
                                orientation={'vertical'}
                                nodeLabelComponent={{
                                    render: <NodeLabel className='myLabelComponentInSvg' />,
                                    foreignObjectWrapper: {
                                        y: 24
                                    }
                                }}/>
*/

function mapStateToProps(state) {
    const { token } = state.auth;
    const { storiesTree, isLoading } = state.story;
    return {
        token,
        storiesTree,
        isLoading
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getStoriesTree: (projectId, token) => {
            dispatch(storyActions.getStoriesTree(projectId, token));
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(VisualizePage);