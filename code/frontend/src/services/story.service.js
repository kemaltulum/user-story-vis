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

function addStorySingle(projectId, fullText, idUser, token) {

    const query =
    `
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
    `;

    const variables = {
        full_text: fullText,
        id_user: idUser,
        project_id: projectId
    }

    return graph(query, variables, token)
        .then(handleResponse)
        .then(responseData => {
            const newStory = responseData.data.addStory;
            return newStory;
        });
}

function addStoryBulkRaw(projectId, rawText, token) {
    const query =
    `
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
    `;

    const variables = {
        rawText: rawText,
        project_id: projectId
    }

    return graph(query, variables, token)
        .then(handleResponse)
        .then(responseData => {
            const newStories = responseData.data.addStories;
            return newStories;
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
    getStories,
    addStorySingle,
    addStoryBulkRaw
};