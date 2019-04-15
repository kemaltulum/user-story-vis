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
            id_user
            tokens {
                action
                actor
                benefit
                }
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

/**
 * 
 * @param {*} story 
 * @param {*} item  The part of the story needed like action, action-verb
 */
function getItem(story, item){
    switch (item) {
        case 'actor':
            return story.actor;
        case 'action':
            return story.action;
        case 'benefit':
            return story.benefit;
        case 'action-verb':
            if(story.tokens.action && story.tokens.action.length > 0){
                let tokens = story.tokens.action;

                // Try to find a token like V, VP, VPN
                for(let i=0; i<tokens.length; i++){
                    let token = tokens[i];
                    if(token[1].startsWith('V')){
                        return token[0];
                    }
                }

                // İf cannot find, try to find N
                for (let i = 0; i < tokens.length; i++) {
                    let token = tokens[i];
                    if (token[1].startsWith('N')) {
                        return token[0];
                    }
                }
            }
            return null;
        default:
            break;
    }
}

function createStoryTreesOld(stories) {
    let treeData = {
        name: 'Actor',
        children: []
    };

    let actors = [];

    for (let i = 0; i < stories.length; i++) {
        let story = stories[i];
        let actor = story.actor;

        if (!actors.includes(actor)) {
            actors.push(actor);
            treeData.children.push({ name: actor, _collapsed:true, children: [{ name: story.action }] });
        } else if(story.action) {
            for (let j = 0; j < treeData.children.length; j++) {
                let child = treeData.children[j];

                if (child.name === actor) {
                    child.children.push({ name: story.action });
                }
            }
        }
    }
    return [treeData];
}

function createStoryTrees(stories) {
    let treeData = {
        name: 'Actor',
        children: []
    };

    let actors = [];

    for (let i = 0; i < stories.length; i++) {
        let story = stories[i];
        let actor = story.actor;

        if (!actors.includes(actor)) {
            actors.push(actor);
            treeData.children.push({ name: actor, _collapsed: true, children: [{ name: getItem(story, 'action-verb') }] });
        } else if (story.action) {
            for (let j = 0; j < treeData.children.length; j++) {
                let child = treeData.children[j];

                if (child.name === actor) {
                    let item = getItem(story, 'action-verb');
                    if(!child.children.some(c => c.name === item)){
                        child.children.push({ name: item });
                    }
                }
            }
        }
    }
    return treeData;
}

function getStoriesTree(projectId, token) {
    return getStories(projectId, token)
        .then(resData => {
            return createStoryTrees(resData);
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
            id_user
            tokens {
                action
                actor
                benefit
                }
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
            id_user
            tokens {
                action
                actor
                benefit
                }
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
            const newStories = responseData.data.addStoryBulkRaw;
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
    addStoryBulkRaw,
    getStoriesTree
};