import React, { Component, Fragment } from 'react';


import './EntityGraph.css';

import { connect } from 'react-redux';


import Spinner from '../components/Spinner/Spinner';



import { storyActions } from '../actions/story.actions';
import { projectActions } from '../actions/project.actions';

import { Graph } from 'react-d3-graph';

// graph payload (with minimalist structure)

// the graph configuration, you only need to pass down properties
// that you want to override, otherwise default ones will be used
const myConfig = {
    nodeHighlightBehavior: true,
    linkHighlightBehavior: true,
    minZoom: 0.8,
    maxZoom: 2,
    collapsible: true,
    directed: true,
    width: 1750,
    height: 1800,
    node: {
        labelProperty: "name",
        color: 'blue',
        size: 150,
        highlightStrokeColor: '#DBCAFC'
    },
    link: {
        highlightColor: '#DBCAFC',
        renderLabel: true,
        labelProperty: "relation"
    }, 
    d3:{
        linkLength: 100,
        gravity: -250
    }
};



class EntityGraphPage extends Component {


    constructor(props) {
        super(props);


    }

    componentDidMount() {
        console.log("Welcome to entity graph");
        this.props.getStoriesGraph(this.props.match.params.project_id, 'entity-graph', this.props.token);

    }

    componentDidUpdate(prevProps) {
        // will be true
        const locationChanged = this.props.location !== prevProps.location;

        if (locationChanged) {
            this.props.getStoriesGraph(this.props.match.params.project_id, 'entity-graph', this.props.token);
        }
        // INCORRECT, will *always* be false because history is mutable.
        //const locationChanged = this.props.history.location !== prevProps.history.location;
    }




    render() {

        let data = {};

        if(this.props.entityGraph){            
            let nodes = [];
            for (let i = 0; i < this.props.entityGraph.data.nodes.length; i++){
                let node = Object.assign({}, this.props.entityGraph.data.nodes[i]);
                if(node.nodeType === "actor"){
                    node.color = "#003152";
                } else if (node.nodeType === "action"){
                    node.color = "#1034A6";
                } else if (node.nodeType === "benefit"){
                    node.color = "#008081";
                }
                nodes.push(node);
            }

            data.nodes = nodes;

            let links = []
            for(let i=0; i < this.props.entityGraph.data.links.length; i++){
                let link = this.props.entityGraph.data.links[i];
                if (link.linkType === "is-a") {
                    link.color = "#7285A5";
                } else if (link.linkType === "action") {
                    link.color = "#73C2FB";
                } else if (link.linkType === "benefit") {
                    link.color = "#4F97A3";
                }
                links.push(link);
            }

            data.links = links;
        }

        console.log(data)


        return (
            <Fragment>
                {
                    (this.props.isLoading || this.props.entityGraph === undefined)?
                    <Spinner /> :
                    <div>
                        <Graph
                            id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
                            data={data}
                            config={myConfig} />
                    </div>
                }
            </Fragment>);
    }
}


function mapStateToProps(state) {
    const { token } = state.auth;
    const { entityGraph, isLoading } = state.project;
    return {
        token,
        entityGraph,
        isLoading
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getStoriesGraph: (projectId, type, token) => {
            dispatch(projectActions.getMetaData(projectId, type, token));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EntityGraphPage);