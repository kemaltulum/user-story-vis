import React, { Component } from 'react';

import Backdrop from '../components/Backdrop/Backdrop';
import Modal from '../components/Modal/Modal';
import Spinner from '../components/Spinner/Spinner';
import StoryList from '../components/Stories/StoryList/StoryList';

import AuthContext from '../context/auth-context';

import './Story.css';

class StoryPage extends Component {
    state = {
        modelOpened: false,
        modalType: 'single',
        stories: [],
        isLoading: false
    }

    static contextType = AuthContext;

    constructor(props) {
        super(props);
        this.storyElRef = React.createRef();
        this.idUserElRef = React.createRef();
        this.rawTextElRef = React.createRef();
    }

    fetchStories() {
        this.setState({isLoading: true});

        const requestBody = {
            query: `
                    query getStories($project_id: String!) {
                        stories(projectId: $project_id) {
                        _id
                        full_text
                        actor
                        action
                        benefit
                        is_parsed
                        }
                    }
                    `,
            variables: {
                project_id: this.props.match.params.project_id
            }
        };

        const token = this.context.token;

        fetch('http://localhost:8000/graphql', {
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
                const stories = resData.data.stories;
                this.setState({ stories: stories, isLoading: false });

            })
            .catch(err => {
                console.log(err);
                this.setState({ isLoading: false });
            });
    }

    componentDidMount(){
        console.log(this.props.match);
        this.fetchStories();
    }

    startAddStoryHandlerSingle = () => {
        this.setState({ modalOpened: true, modalType: 'single' });
    }

    startAddStoryHandlerRaw = () => {
        this.setState({ modalOpened: true, modalType: 'raw' });
    }

    modalCancelHandler = () => {
        this.setState({ modalOpened: false });
    }

    modalConfirmHandler = () => {

        let requestBody;

        if(this.state.modalType === 'single'){
            const fullText = this.storyElRef.current.value;
            const idUser = this.idUserElRef.current.value;


            requestBody = {
                query: `
                    mutation addStory($full_text: String!, $id_user: String!, $project_id: String!) {
                        addStory(storyInput : {full_text: $full_text, id_user: $id_user, project_id: $project_id}) {
                        _id
                        full_text
                        actor
                        action
                        benefit
                        is_parsed
                        }
                    }
                    `,
                variables: {
                    full_text: fullText,
                    id_user: idUser,
                    project_id: this.props.match.params.project_id
                }
            };
        } else if(this.state.modalType === 'raw'){
            const rawText = this.rawTextElRef.current.value;
            console.log(rawText);

            requestBody = {
                query: `
                    mutation addStories($rawText: String!, $project_id: String!) {
                        addStoryBulkRaw(rawText: $rawText, projectId: $project_id) {
                        _id
                        full_text
                        actor
                        action
                        benefit
                        is_parsed
                        }
                    }
                    `,
                variables: {
                    rawText: rawText,
                    project_id: this.props.match.params.project_id
                }
            };
        }
        

        const token = this.context.token;

        fetch('http://localhost:8000/graphql', {
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
                   const stories = prevState.stories;
                   stories.push({
                       ...resData.data.addStory
                   })
                   return {stories: stories, modalOpened: false};
               });
            })
            .catch(err => {
                console.log(err);
                this.setState({ modalOpened: false });
            });
    }

    render() {
        return (
            <React.Fragment>
                {(this.state.modalOpened && this.state.modalType === 'single') && <Backdrop />}
                {this.state.modalOpened && (
                    <Modal
                        title="Add Story"
                        canCancel
                        canConfirm
                        onCancel={this.modalCancelHandler}
                        onConfirm={this.modalConfirmHandler}
                        confirmText="Add"
                    >
                        <form>
                            <div className="form-control">
                                <label htmlFor="story">User Story</label>
                                <input type="text" id="story" ref={this.storyElRef} />
                            </div>
                            <div className="form-control">
                                <label htmlFor="id_user">Story ID</label>
                                <input type="text" id="id_user" ref={this.idUserElRef} />
                            </div>
                        </form>
                    </Modal>
                )}
                {(this.state.modalOpened && this.state.modalType === 'raw') && <Backdrop />}
                {this.state.modalOpened && (
                    <Modal
                        title="Add Story Raw Text"
                        canCancel
                        canConfirm
                        onCancel={this.modalCancelHandler}
                        onConfirm={this.modalConfirmHandler}
                        confirmText="Add"
                    >
                        <form>
                            <div className="form-control">
                                <label htmlFor="story">User Story</label>
                                <textarea type="text" id="story" rows="10" ref={this.rawTextElRef} />
                            </div>
                        </form>
                    </Modal>
                )}
                {this.context.token && (
                    <div className="stories-control">
                        <p>Add stories to your project!</p>
                        <button className="btn" onClick={this.startAddStoryHandlerSingle}>
                            Add Story
                        </button>
                        <button className="btn" onClick={this.startAddStoryHandlerRaw}>
                            Add Story Raw
                        </button>
                    </div>
                )}
                
                {this.state.isLoading ? (
                    <Spinner />
                ) : (
                        <StoryList
                            stories={this.state.stories}
                        />
                    )}
                
            </React.Fragment>
        );
    }
}

export default StoryPage;