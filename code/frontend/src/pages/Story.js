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
        this.actorFilterRef = React.createRef();
        this.storyKeywordRef = React.createRef();
    }

    sortStories(stories) {
        stories.sort((a, b) => {
            return parseInt(b.id_user) > parseInt(a.id_user);
        });
        return stories;
    }

    componentDidMount() {
        this.props.getStories(this.props.match.params.project_id, this.props.token);
        this.props.getUniqueActors(this.props.match.params.project_id, this.props.token);
    }

    componentDidUpdate(prevProps) {
        // will be true
        const locationChanged = this.props.location !== prevProps.location;

        if (locationChanged) {
            this.props.getStories(this.props.match.params.project_id, this.props.token);
            this.props.getUniqueActors(this.props.match.params.project_id, this.props.token);
        }
        // INCORRECT, will *always* be false because history is mutable.
        //const locationChanged = this.props.history.location !== prevProps.history.location;
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

        if (this.state.modalType === 'single') {
            const fullText = this.storyElRef.current.value;
            this.props.addStorySingle(projectId, fullText, token);
        } else if (this.state.modalType === 'raw') {
            const rawText = this.rawTextElRef.current.value;
            this.props.addStoryBulkRaw(projectId, rawText, token);
        }
        this.setState({ modalOpened: false });
    }

    filterStories(){
        const actorFilter = this.actorFilterRef.current.value;
        const keyword = this.storyKeywordRef.current.value;
        const projectId = this.props.match.params.project_id;
        const token = this.props.token;

        this.props.filterStories(projectId, actorFilter, keyword, token);
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
                        <div className="add-story">
                            <button className="btn" onClick={this.startAddStoryHandlerSingle}>
                                Add Story
                            </button>
                            <button className="btn" onClick={this.startAddStoryHandlerRaw}>
                                Add Story Raw
                            </button>
                        </div>
                        <div className="filter-container">
                            {this.props.uniqueActors &&
                                <select name="actor" ref={this.actorFilterRef}>
                                    <option value="">No Actor Filter</option>
                                    {
                                        this.props.uniqueActors.map(actor => {
                                            return (
                                                <option key={actor._id} value={actor.name}>{actor.name}</option>
                                            );
                                        })
                                    }
                                </select>
                            }
                            <input ref={this.storyKeywordRef} type="text" placeholder="Enter a keyword" />
                            <button className="btn" onClick={this.filterStories.bind(this)}>
                                Filter
                            </button>
                        </div>
                    </div>
                )}

                {this.props.isLoading ? (
                    <Spinner />
                ) : (
                        <StoryList
                            stories={this.sortStories(this.props.stories)}
                        />
                    )}

            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    const { token } = state.auth;
    const { stories, isLoading, uniqueActors } = state.story;
    return {
        token,
        stories,
        isLoading,
        uniqueActors
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
        },
        getUniqueActors: (projectId, token) => {
            dispatch(storyActions.getUniqueActors(projectId, token));
        },
        filterStories: (projectId, actorFilter, keyword, token) => {
            dispatch(storyActions.filterStories(projectId, actorFilter, keyword, token));
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(StoryPage);