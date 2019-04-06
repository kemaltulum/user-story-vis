import React, { Component } from 'react';

import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import Spinner from '../components/Spinner/Spinner';
import ProjectList from '../components/Projects/ProjectList/ProjectList';

import { connect } from 'react-redux';
import { projectActions } from '../actions/project.actions';

import './Projects.css';

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
        this.fetchProjects();
    }

    startCreateEventHandler = () => {
        this.setState({ creating: true });
    };

    modalConfirmHandler = () => {
        this.setState({ creating: false });
        const name = this.nameElRef.current.value;
        const description = this.descriptionElRef.current.value;

        if (
            name.trim().length === 0 ||
            description.trim().length === 0
        ) {
            return;
        }

        this.props.createProject(name, description, this.props.token);
    }

    modalCancelHandler = () => {
        this.setState({ creating: false });
    }

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
                {(this.state.creating) && <Backdrop />}
                {this.state.creating && (
                    <Modal
                        title="Add Project"
                        canCancel
                        canConfirm
                        onCancel={this.modalCancelHandler}
                        onConfirm={this.modalConfirmHandler}
                        confirmText="Confirm"
                    >
                        <form>
                            <div className="form-control">
                                <label htmlFor="name">Name</label>
                                <input type="text" id="name" ref={this.nameElRef} />
                            </div>
                            <div className="form-control">
                                <label htmlFor="description">Description</label>
                                <textarea
                                    id="description"
                                    rows="4"
                                    ref={this.descriptionElRef}
                                />
                            </div>
                        </form>
                    </Modal>
                )}
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
    const { projects, isLoading } = state.project;
    return {
        token,
        projects,
        isLoading
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getProjects: (token) => {
            dispatch(projectActions.getProjects(token));
        },
        createProject: (name, description, token) => {
            dispatch(projectActions.createProject(name, description, token));
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectsPage);
