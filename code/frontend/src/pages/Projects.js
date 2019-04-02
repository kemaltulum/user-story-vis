import React, { Component } from 'react';

import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import Spinner from '../components/Spinner/Spinner';
import ProjectList from '../components/Projects/ProjectList/ProjectList';

import { connect } from 'react-redux';

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

        const requestBody = {
            query: `
          mutation CreateProject($name: String!, $desc: String!) {
            createProject(name: $name, description: $desc) {
              _id
              name
              description
            }
          }
        `,
            variables: {
                name: name,
                desc: description
            }
        };

        const token = this.props.token;

        fetch('/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token
            }
        })
            .then(res => {
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error('Failed!');
                }
                return res.json();
            })
            .then(resData => {
                this.setState(prevState => {
                    const updatedProjects = [...prevState.projects];
                    updatedProjects.push({
                        _id: resData.data.createProject._id,
                        name: resData.data.createProject.name,
                        description: resData.data.createProject.description,
                        creator: {
                            _id: this.context.userId
                        }
                    });
                    return { projects: updatedProjects };
                });
            })
            .catch(err => {
                console.log(err);
            });
    };

    modalCancelHandler = () => {
        this.setState({ creating: false });
    };

    fetchProjects() {
        this.setState({ isLoading: true });
        const requestBody = {
            query: `
          query {
            projects {
              _id
              name
              description
              creator {
                _id
                email
              }
            }
          }
        `
        };

        fetch('/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error('Failed!');
                }
                return res.json();
            })
            .then(resData => {
                const projects = resData.data.projects;
                if (this.isActive) {
                    this.setState({ projects: projects, isLoading: false });
                }
            })
            .catch(err => {
                console.log(err);
                if (this.isActive) {
                    this.setState({ isLoading: false });
                }
            });
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
                {(this.state.creating || this.state.selectedEvent) && <Backdrop />}
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
                        projects={this.state.projects}
                        onAddStory={this.addStoryHandler}
                     />  
                    )}
            </React.Fragment>
        );
    }
}

function mapStateToProps(state){
    const {token} = state.auth;
    return {
        token
    };
}

export default connect(mapStateToProps)(ProjectsPage);
