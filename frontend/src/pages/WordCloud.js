import React, { Component, Fragment } from 'react';
import randomColor from 'randomcolor';
import ReactWordcloud from "react-wordcloud";


import './WordCloud.scss';

import { connect } from 'react-redux';


import Spinner from '../components/Spinner/Spinner';



import { projectActions } from '../actions/project.actions';
import { UIActions } from '../actions/ui.actions';




class WordCloudPage extends Component {


    constructor(props) {
        super(props);


    }

    componentDidMount() {
        this.props.showMainNav(true);
        this.props.getMetaData(this.props.match.params.project_id, "word-cloud", this.props.token);

    }

    componentDidUpdate(prevProps) {
        // will be true
        const locationChanged = this.props.location !== prevProps.location;

        if (locationChanged) {
            this.props.getMetaData(this.props.match.params.project_id, "word-cloud", this.props.token);
        }
        // INCORRECT, will *always* be false because history is mutable.
        //const locationChanged = this.props.history.location !== prevProps.history.location;
    }


    mapValue(min, max, value, minPoint, range){
        let mul = range / (max - min);

        let val = minPoint + mul * (value - min);
        return val;
    }


    render() {
        let tags = []
        if(this.props.wordCloud){
            tags = Object.entries(this.props.wordCloud.data);
            let min = 100000000;
            let max = -1;
            for(let i=0; i<tags.length; i++){
                let value = tags[i][1];
                if(value > max){
                    max = value;
                } else if(value < min) {
                    min = value
                }
            }
            tags = tags.map(tag => {                
                return {
                    text: tag[0],
                    value: tag[1]
                }
            });
            console.log(tags);
        }
        
        return (
            <Fragment >
                <div className="cloud-container">
                    {this.props.isLoading ? 
                        <Spinner /> :
                        <div style={{ marginLeft: "30px", width: 1500, height: 800 }}>
                            <ReactWordcloud
                                options={{
                                    colors: randomColor({ count: 10, luminosity: "bright", hue: 'blue'}),
                                    fontFamily: 'courier new',
                                    fontSizes: [24, 144],
                                    fontStyle: 'italic',
                                    fontWeight: 'bold',
                                    rotations: 1,
                                    rotationAngles: [0, 0]
                                }}
                                words={tags}
                            />
                        </div>
                    }
                </div>
            </Fragment>);
    }
}


function mapStateToProps(state) {
    const { token } = state.auth;
    const { wordCloud, isLoading } = state.project;
    return {
        token,
        wordCloud,
        isLoading
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getMetaData: (projectId, type, token) => {
            dispatch(projectActions.getMetaData(projectId, type, token));
        },
        toggleNav: (showMainNav) => {
            dispatch(UIActions.toggleNav(showMainNav))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(WordCloudPage);