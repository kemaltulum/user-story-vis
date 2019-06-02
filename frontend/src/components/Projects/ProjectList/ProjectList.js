import React from 'react';

import ProjectItem from './ProjectItem/ProjectItem';
import './ProjectList.css';

const projectList = props => {
    const projects = props.projects.map(project => {
        return (
            <ProjectItem 
                key={project._id}
                projectId={project._id}
                name={project.name}
                description={project.description}
                onAddStory={props.onAddStory}
            />
        );
    });

    return <ul className="projects__list">{projects}</ul>;
};

export default projectList;