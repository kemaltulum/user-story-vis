import React from 'react';

import './StoryItem.css';

const storyItem = props => (
    <li key={props.projectId} className={"stories__list-item " + (props.isParsed ? "correct" : "incorrect")}>
        {props.isParsed && 
            <div className="stories__full-text">
                As a <span className="actor">{props.actor}</span>,
            I want to <span className="action">{props.action}</span>{props.action && props.action.endsWith(',') ? '' : ','}
                so that <span className="benefit">{props.benefit ? props.benefit.charAt(0).toUpperCase() + props.benefit.slice(1) : props.benefit}</span>
            </div>
        }
        
    </li>
);

export default storyItem;