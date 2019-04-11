import React, { Fragment } from 'react';

import './StoryItem.css';

const storyItem = props => (
    <li key={props.storyId} className={"stories__list-item " + (props.is_parsed ? "correct" : "incorrect")}>
        {props.is_parsed && 
            <Fragment>
                <div className="stories_id-user">
                {props.id_user}
                </div>
                <div className="stories__full-text">
                    As a <span className="actor">{props.actor}</span>,
                I want to <span className="action">{props.action}</span>{props.action && props.action.endsWith(',') ? '' : ','}
                {props.benefit && <span className="benefit"> so that {props.benefit.charAt(0).toUpperCase() + props.benefit.slice(1)}</span>}
                </div>
            </Fragment>
        }
        
    </li>
);

export default storyItem;