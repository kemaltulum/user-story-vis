import React from 'react';
import { Link } from 'react-router-dom'; 

import './ProjectItem.css';

const projectItem = props => (
    <li key={props.projectId} className="projects__list-item">
        <div>
            <h1>{props.name}</h1>
        </div>
        <div>
            <Link className="btn" to={props.projectId + "/stories"}>Stories</Link>
        </div>
    </li>
);

export default projectItem;