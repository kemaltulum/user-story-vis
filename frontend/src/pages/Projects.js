import React, { Component } from 'react';

import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import Spinner from '../components/Spinner/Spinner';
import ProjectList from '../components/Projects/ProjectList/ProjectList';

import { connect } from 'react-redux';
import { projectActions } from '../actions/project.actions';
import { UIActions } from '../actions/ui.actions';


import './Projects.scss';

class ProjectsPage extends Component {
    state = {
        creating: false,
        projects: [],
        isLoading: false
    };
    isActive = true;

    constructor(props) {
        super(props);
        this.nameElRef = React.createRef();
        this.descriptionElRef = React.createRef();
    }

    componentDidMount() {
        this.props.toggleNav(false)
        this.fetchProjects();
    }

    startCreateEventHandler = () => {
        this.props.toggleProjectModal(true);
    };

    fetchProjects() {
        this.props.getProjects(this.props.token);
    }

    addStoryHandler(projectId) {
        console.log(projectId, "add story");
    }

    componentWillUnmount() {
        this.isActive = false;
    }

    render() {
        return (
            <React.Fragment>
                {this.props.token && (
                    <div className="events-control">
                        <p>Add your project!</p>
                        <button className="btn" onClick={this.startCreateEventHandler}>
                            Create Project
                        </button>
                    </div>
                )}
                {this.state.isLoading ? (
                    <Spinner />
                ) : (
                     <ProjectList 
                        projects={this.props.projects}
                        onAddStory={this.addStoryHandler}
                     />  
                    )}
            </React.Fragment>
        );
    }
}


function mapStateToProps(state) {
    const { token } = state.auth;
    const { showProjectModal } = state.ui;
    const { projects, isLoading } = state.project;
    return {
        token,
        projects,
        isLoading,
        showProjectModal
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getProjects: (token) => {
            dispatch(projectActions.getProjects(token));
        },
        createProject: (name, description, token) => {
            dispatch(projectActions.createProject(name, description, token));
        },
        toggleNav: (showMainNav) => {
            dispatch(UIActions.toggleNav(showMainNav))
        },
        toggleProjectModal: (showProjectModal) => {
            dispatch(UIActions.toggleProjectModal(showProjectModal))
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectsPage);
