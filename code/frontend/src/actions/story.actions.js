import { storyService } from '../services';

function getStories(projectId, token) {
    return dispatch => {
        dispatch({
            type: 'GET_STORIES_REQUEST',
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
                        type: 'GET_STORIES_FAILURE',
                        payload: { error }
                    });
                }
            );
    }
}

export const storyActions = {
    getStories
};