import graph from './graph';
import { authActions } from '../actions/auth.actions';

function getStories(projectId, token){
    const query = 
    `
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
    `;

    const variables = {
        project_id: projectId
    }

    return graph(query, variables, token)
        .then(handleResponse)
        .then(responseData => {
            const stories = responseData.data.stories;
            return stories;
        });
}

function handleResponse(res) {
    let errorExists = false;
    if (res.status !== 200 && res.status !== 201) {
        errorExists = true;
        if (res.status === 401) {
            authActions.logout();
        }
    }
    return res.json().then(resData => {
        if (errorExists) {
            return Promise.reject(resData.errors[0]);
        }
        return resData;
    });
}

export const storyService = {
    getStories
};