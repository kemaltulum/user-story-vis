import React, { Component, Fragment } from 'react';
import Tree from 'react-d3-tree';

import './Visualize.css';

import { connect } from 'react-redux';

import Spinner from '../components/Spinner/Spinner';
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

                            <Tree data={this.props.storiesTree}
                                translate={this.state.translate}
                                orientation={'vertical'} />

                        </div>
                    )}

            </Fragment>);
    }
}

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