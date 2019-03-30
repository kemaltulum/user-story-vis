import React from 'react';

import './StoryItem.css';

const storyItem = props => (
    <li key={props.projectId} className={"stories__list-item " + (props.isParsed ? "correct" : "incorrect")}>
        <div className="stories__full-text">
            <p>{props.fullText}</p>
        </div>
        <div className="stories__details">
            <p className="stories__actor"><strong>Actor:</strong> {props.actor}</p>
            <p className="stories__action"><strong>Action:</strong> {props.action}</p>
            <p className="stories__benefit"><strong>Benefit:</strong> {props.benefit}</p>
        </div>
    </li>
);

export default storyItem;