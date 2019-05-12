import React, { Fragment } from 'react';

import ReactCardFlip from 'react-card-flip';

import './StoryItem.css';


class StoryItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isFlipped: false
        }
    }
    flipCard(e) {
        e.preventDefault();
        this.setState(prevState => ({ isFlipped: !prevState.isFlipped }));
    }
    render() {
        return (
            <div className="stories__wrapper">
               
                <ReactCardFlip key={this.props.storyId} className="stories__card" isFlipped={this.state.isFlipped} flipDirection="horizontal">
                    <div key="front" className={"stories__card stories__list-item"}>
                        <div className="stories_id-user">
                            {this.props.id_user}
                        </div>
                        <div className="stories__flip-button" onClick={this.flipCard.bind(this)}>&#8227;</div>
                        {this.props.is_parsed &&
                            <Fragment>
                                <div className="stories__summary">
                                    <div className="summary-actor">
                                        {this.props.actor}
                                    </div>
                                    {
                                        this.props.tokens.action.main_verb &&
                                        <div className="summary-verb">
                                            {this.props.tokens.action.main_verb}
                                        </div>
                                    }
                                    {
                                        this.props.tokens.action.main_object &&
                                        <div className="summary-object">
                                            {this.props.tokens.action.main_object.text}
                                        </div>
                                    }
                                </div>
                            </Fragment>
                        }
                        
                    </div>
                    <div key="back">
                        <div className={"stories__card stories__list-item "}>
                            <div className="stories_id-user">
                                {this.props.id_user}
                            </div>
                            <div className="stories__flip-button" onClick={this.flipCard.bind(this)}>&#8227;</div>
                            {this.props.is_parsed &&
                                <Fragment>
                                    <div className="stories__full-text">
                                        As a <span className="actor">{this.props.actor}</span>,
                                I want to <span className="action">{this.props.action}</span>{this.props.action && this.props.action.endsWith(',') ? '' : ','}
                                        {this.props.benefit &&
                                            <Fragment> so that&nbsp;
                                    <span className="benefit">{this.props.benefit}</span>
                                            </Fragment>}
                                    </div>
                                </Fragment>
                            }
                        </div>
                    </div>
                </ReactCardFlip>
            </div>
        );
    }
}

export default StoryItem;