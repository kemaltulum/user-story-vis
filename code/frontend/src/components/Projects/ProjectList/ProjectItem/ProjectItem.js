import React from 'react';

import './ProjectItem.css';

const projectItem = props => (
    <li key={props.projectId} className="projects__list-item">
        <div>
            <h1>{props.name}</h1>
        </div>
        <div>
            <button className="btn" onClick={props.onAddStory.bind(this, props.projectId)}>
                Add Story
            </button>
        </div>
    </li>
);

export default projectItem;