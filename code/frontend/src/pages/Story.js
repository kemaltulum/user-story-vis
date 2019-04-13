import React, { Component } from 'react';

import Backdrop from '../components/Backdrop/Backdrop';
import Modal from '../components/Modal/Modal';
import Spinner from '../components/Spinner/Spinner';
import StoryList from '../components/Stories/StoryList/StoryList';

import { connect } from 'react-redux';

import { storyActions } from '../actions/story.actions';
import './Story.css';

class StoryPage extends Component {
    state = {
        modelOpened: false,
        modalType: 'single'
    }

    constructor(props) {
        super(props);
        this.storyElRef = React.createRef();
        this.idUserElRef = React.createRef();
        this.rawTextElRef = React.createRef();
    }

    componentDidMount(){
        this.props.getStories(this.props.match.params.project_id, this.props.token);
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

        const projectId = this.props.match.params.project_id;
        const token = this.props.token;

        if(this.state.modalType === 'single'){
            const fullText = this.storyElRef.current.value;
            const idUser = this.idUserElRef.current.value;
            this.props.addStorySingle(projectId, fullText, idUser, token);
        } else if(this.state.modalType === 'raw'){
            const rawText = this.rawTextElRef.current.value;
            this.props.addStoryBulkRaw(projectId, rawText, token);
        }
        this.setState({ modalOpened: false });
    }

    render() {
        return (
            <React.Fragment>
                {(this.state.modalOpened && this.state.modalType === 'single') && 
                    <React.Fragment>
                        <Backdrop />
                        <Modal
                            title="Add Story"
                            canCancel
                            canConfirm
                            onCancel={this.modalCancelHandler}
                            onConfirm={this.modalConfirmHandler}
                            confirmText="Add">
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
                    </React.Fragment>
                }
                {(this.state.modalOpened && this.state.modalType === 'raw') && 
                    <React.Fragment>
                        <Backdrop />
                        <Modal
                            title="Add Story Raw Text"
                            canCancel
                            canConfirm
                            onCancel={this.modalCancelHandler}
                            onConfirm={this.modalConfirmHandler}
                            confirmText="Add">
                            <form>
                                <div className="form-control">
                                    <label htmlFor="story">User Story</label>
                                    <textarea type="text" id="story" rows="10" ref={this.rawTextElRef} />
                                </div>
                            </form>
                        </Modal>
                    </React.Fragment>
                }
                {this.props.token && (
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
                
                {this.props.isLoading ? (
                    <Spinner />
                ) : (
                        <StoryList
                            stories={this.props.stories}
                        />
                    )}
                
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    const { token } = state.auth;
    const { stories, isLoading } = state.story; 
    return {
        token,
        stories,
        isLoading
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getStories: (projectId, token) => {
            dispatch(storyActions.getStories(projectId, token));
        },
        addStorySingle: (projectId, fullText, idUser, token) => {
            dispatch(storyActions.addStorySingle(projectId, fullText, idUser, token));
        },
        addStoryBulkRaw: (projectId, rawText, token) => {
            dispatch(storyActions.addStoryBulkRaw(projectId, rawText, token));
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(StoryPage);