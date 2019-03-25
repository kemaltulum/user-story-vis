import React from 'react';

import './StoryItem.css';

const storyItem = props => (
    <li key={props.projectId} className="projects__list-item">
        <div>
            <p>{props.fullText}</p>
        </div>
        <div>
            <p><strong>Actor:</strong> {props.actor}</p>
            <p><strong>Action:</strong> {props.action}</p>
            <p><strong>Benefit:</strong> {props.benefit}</p>
        </div>
    </li>
);

export default storyItem;