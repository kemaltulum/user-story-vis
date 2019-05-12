import { storyService } from '../services';

function getStories(projectId, token) {
    return dispatch => {
        dispatch({
            type: 'STORIES_REQUEST',
            payload: {}
        });
        storyService.getStories(projectId, token)
            .then(
                stories => {
                    dispatch({
                        type: 'GET_STORIES',
                        payload: { stories }
                    });
                },
                error => {
                    dispatch({
                        type: 'STORIES_FAILURE',
                        payload: { error }
                    });
                }
            );
    }
}

function getStoriesTree(projectId, type, token) {
    return dispatch => {
        dispatch({
            type: 'STORIES_REQUEST',
            payload: {}
        });
        storyService.getStoriesTree(projectId, type, token)
            .then(
                storiesTree => {
                    dispatch({
                        type: 'GET_STORIES_TREE',
                        payload: { storiesTree }
                    });
                },
                error => {
                    dispatch({
                        type: 'STORIES_FAILURE',
                        payload: { error }
                    });
                }
            );
    }
}


function addStorySingle(projectId, fullText, token) {
    return dispatch => {
        dispatch({
            type: 'STORIES_REQUEST',
            payload: {}
        });
        storyService.addStorySingle(projectId, fullText, token)
            .then(
                newStory => {
                    dispatch({
                        type: 'ADD_STORY_SINGLE',
                        payload: { newStory }
                    });
                },
            error => {
                dispatch({
                    type: 'STORIES_FAILURE',
                    payload: { error }
                });
            }
            )
    }
}

function addStoryBulkRaw(projectId, rawText, token) {
    return dispatch => {
        dispatch({
            type: 'STORIES_REQUEST',
            payload: {}
        });
        storyService.addStoryBulkRaw(projectId, rawText, token)
            .then(
                newStories => {
                    dispatch({
                        type: 'ADD_STORY_BULK',
                        payload: { newStories }
                    });
                },
                error => {
                    dispatch({
                        type: 'STORIES_FAILURE',
                        payload: { error }
                    });
                }
            )
    }
}

export const storyActions = {
    getStories,
    getStoriesTree,
    addStorySingle,
    addStoryBulkRaw
};