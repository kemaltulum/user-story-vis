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
                    action {
                        main_verb
                        main_object {
                            chunk
                            text
                        }
                        sec_verbs {
                            verb
                            object
                        }
                    }
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
            if(story.tokens.action && story.tokens.action.main_verb){
                return story.tokens.action.main_verb;
            }
            return null;
        case 'action-object':
            if (story.tokens.action && story.tokens.action.main_object) {
                return story.tokens.action.main_object.text;
            }
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
            treeData.children.push({ name: actor, _collapsed: true, children: [{ name: getItem(story, 'action-verb'), children: [{name: getItem(story, 'action-object')}]}  ] });
        } else if (story.action) {
            for (let j = 0; j < treeData.children.length; j++) {
                let child = treeData.children[j];

                if (child.name === actor) {
                    let item = getItem(story, 'action-verb');
                    let object = getItem(story, 'action-object');
                    if(!child.children.some(c => c.name === item)){
                        child.children.push({ name: item, children: [{name: object}]});
                    }
                }
            }
        }
    }
    return treeData;
}

function getStoriesTree(projectId, type, token) {
    if(type === "story-tree") {
        return getStoryTree(projectId, type, token)
            .then(resData => {
                return createTreeStructureFromNodes(resData);
            });
    } else if(type === "actor-tree"){
        return getStoryTree(projectId, type, token)
            .then(resData => {
                return createTreeStructureFromNodes(resData);
            });
    } else if(type === "unique-actors"){
        return getStoryTree(projectId, "actor-tree", token)
            .then(resData => {
                console.log(resData);
                return resData;
            });
    }
}

function getStoryTree(projectId, nodeType, token) {
    //getStoryTree(projectId: String, nodeType: String)
    const query =
        `
        query storyTree($project_id: String!, $nodeType: String! ) {
            storyTree(projectId: $project_id, nodeType: $nodeType) {
            _id
            nodeType
            name
            project_id
            story_ids
            isRoot
            children
        }}
    `;

    const variables = {
        project_id: projectId,
        nodeType: nodeType
    };

    console.log("Get story tree");

    return graph(query, variables, token)
        .then(handleResponse)
        .then(responseData => {
            const treeNodes = responseData.data.storyTree;
            return treeNodes;
        });
}

function createTreeStructureFromNodes(treeNodes){
    console.log(treeNodes);
    let treeRoot;
    for(let i=0; i<treeNodes.length; i++){
        if(treeNodes[i].isRoot){
            treeRoot = treeNodes[i];
            break;
        }
    }

    treeRoot = createTreeHelper(treeRoot, treeNodes);

    return treeRoot;

}

function createTreeHelper(root, nodes) {
    console.log({root});
    if(!root.children || root.children.length === 0){
        return root;
    }
    let children = root.children;
    root.children = []
    for(let i=0; i<children.length; i++){
        let child = children[i];
        let childRoot = nodes.filter(node => node._id === child)[0];
        childRoot = createTreeHelper(childRoot, nodes);
        childRoot.parentId = root._id;
        root.children.push(childRoot);
    }
    return root;
}


function addStorySingle(projectId, fullText, token) {

    const query =
    `
        mutation addStory($full_text: String!, $project_id: String!) {
            addStory(storyInput : {full_text: $full_text, project_id: $project_id}) {
            _id
            full_text
            actor
            action
            benefit
            is_parsed
            id_user
            tokens {
                    action {
                        main_verb
                        main_object {
                            chunk
                            text
                        }
                        sec_verbs {
                            verb
                            object
                        }
                    }
                }
            }
        }
    `;

    const variables = {
        full_text: fullText,
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
                    action {
                        main_verb
                        main_object {
                            chunk
                            text
                        }
                        sec_verbs {
                            verb
                            object
                        }
                    }
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
    getStoryTree,
    addStorySingle,
    addStoryBulkRaw,
    getStoriesTree
};