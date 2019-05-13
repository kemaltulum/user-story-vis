import React, { Component, Fragment } from 'react';

import './Visualize.css';

import { connect } from 'react-redux';

import Tree from 'react-d3-tree';

import Spinner from '../components/Spinner/Spinner';
import CollapsibleTree from '../components/d3/CollapsibleTree/CollapsibleTree';
import StoryList from '../components/Stories/StoryList/StoryList';


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
    

    constructor(props) {
        super(props);
        this.treeContainer = React.createRef();
        this.state = {
            stories: [],
            showStories: false
        };

        this.showStories = this.showStories.bind(this);

    }
    
    componentDidMount() {
        
        const params = new URLSearchParams(this.props.location.search);
        const type = params.get('type'); // bar

        if(type==="actor-tree"){
            this.props.getStoriesTree(this.props.match.params.project_id, 'actor-tree', this.props.token);
        } else {
            this.props.getStoriesTree(this.props.match.params.project_id, 'story-tree', this.props.token);
        }


        const dimensions = this.treeContainer.current.getBoundingClientRect();
        this.setState({
            translate: {
                x: dimensions.width / 2,
                y: dimensions.height / 2
            }
        });
    }

    componentDidUpdate(prevProps) {
        // will be true
        const locationChanged = this.props.location !== prevProps.location;
        const searchChanged = this.props.location.search !== prevProps.location.search;

        if(locationChanged) {
            const params = new URLSearchParams(this.props.location.search);
            const type = params.get('type'); // bar

            if (type === "actor-tree") {
                this.props.getStoriesTree(this.props.match.params.project_id, 'actor-tree', this.props.token);
            } else {
                this.props.getStoriesTree(this.props.match.params.project_id, 'story-tree', this.props.token);
            }
        }
        // INCORRECT, will *always* be false because history is mutable.
        //const locationChanged = this.props.history.location !== prevProps.history.location;
    }

    showStories(stories){
        this.setState({
            showStories: true,
            stories: stories
        });
    }

    sortStories(stories) {
        stories.sort((a, b) => {
            return parseInt(b.id_user) > parseInt(a.id_user);
        });
        return stories;
    }

    
    render() {
        return (
            <Fragment >
                {this.props.isLoading ? (
                    <Spinner />
                ) : (
                        <div className="tree-container" ref={this.treeContainer} style={{ width: '1200px', height: '800px' }} >

                           

                            <CollapsibleTree data={this.props.storiesTree} showStories={this.showStories} width="1000" height="1200" />

                        </div>
                        
                    )}
                <div className={"stories-showcase clearfix " + (this.state.showStories ? 'show' : '')}>
                    { this.state.stories && 
                        <StoryList
                            stories={this.sortStories(this.state.stories)}
                        />
                    }
                </div>
            </Fragment>);
    }
}


/*
<div ref={this.treeContainer} className="visualize-container">

                            <CollapsibleTree data={this.props.storiesTree} width="1000" height="1200"/>

                        </div>

                         <Tree data={this.props.storiesTree}
                                translate={this.state.translate}
                                orientation={'vertical'} />
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
        getStoriesTree: (projectId, type, token) => {
            dispatch(storyActions.getStoriesTree(projectId, type, token));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(VisualizePage);