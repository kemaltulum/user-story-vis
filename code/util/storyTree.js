const Bull = require('bull');
const Story = require('../models/Story');
const { capitalize, arrContain } = require('./index');
const TreeNode = require('../models/TreeNode');
const TreeMeta = require('../models/TreeMeta');


/*
const storyTreeQueue = new Bull('story-tree-queue');

storyTreeQueue.process(async (job, data) => {
    return createActorTree(data);
}); */

function transformActorName(name){
    let items = name.split("_");
    let res = ""
    if(items.length == 0) {
        items = name.split(" ");
        for (let i = 0; i < items.length; i++) {
            res += capitalize(items[i]);
            if (i !== items.length - 1) {
                res += " "
            }
        }
    } else {
        for (let i = 0; i < items.length; i++) {
            res += capitalize(items[i]);
            if (i !== items.length - 1) {
                res += " "
            }
        }
    }
    return res;
}

async function saveTree(root){
    console.log(root);
    if(!root.name || !root.project_id){
        return false;
    }
    if(root.children.length === 0){
        let treeNode = new TreeNode(root);
        let savedNode =  await treeNode.save();
        return savedNode;
    } else {
        let ids = [];
        let childStories = [];
        for(let i=0; i<root.children.length; i++) {
            let treeNode = root.children[i];
            let treeNodeSaved = await saveTree(treeNode);
            if(treeNodeSaved){
                childStories = childStories.concat(treeNodeSaved.story_ids);
                ids.push(treeNodeSaved._id);
            }
        }
        root.children = ids;
        if(root.nodeType === "actor-tree" && !root.isRoot && root.story_ids) {
            root.story_ids = root.story_ids.filter(elem => !arrContain(childStories, elem));
        }
        let treeNode = new TreeNode(root);
        let savedNode = await treeNode.save();
        return savedNode;
    }
}

async function createActorTree(data){

    const projectId = data.projectId;
    const storiesAdded = data.stories;


    const stories = await Story.find({project_id: projectId});
    await TreeNode.deleteMany({project_id: projectId, nodeType: "actor-tree"});


    let rootNode = {
        name: 'Actor',
        children: [],
        project_id: projectId,
        nodeType: 'actor-tree',
        isRoot: true
    };

    const actors = stories.map(story => {
        return {
            name: story.actor.toLowerCase(),
            story_id: story._id
        };
    });

    const uniqueActors = []
    const actorsDict = {}


    actors.forEach(actor => {
        if(actor.name.includes(" ")){
            // Group the tales of the word group
            // Zoning Staff Member => Zoning Staff Member and Staff Member

            let actorItems = actor.name.split(" ");
            for(let i=0; i<actorItems.length - 1; i++) {
                let actorSubItemsDict = actorItems.slice(i).join("_");
                if (actorsDict[actorSubItemsDict]) {
                    actorsDict[actorSubItemsDict].stories.push(actor.story_id);
                } else {
                    actorsDict[actorSubItemsDict] = { stories: [actor.story_id], children: []};
                }
            }          
        } else {
            if (actorsDict[actor.name]) {
                actorsDict[actor.name].stories.push(actor.story_id);
            } else {
                actorsDict[actor.name] = { stories: [actor.story_id], children: [] };
            }
        }
    });

    actorsDictKeys = Object.keys(actorsDict);

    for(let i=0; i<actorsDictKeys.length; i++){
        let key = actorsDictKeys[i];
        let value = actorsDict[key];

        let notUnique = false;
        actorsDictKeys.forEach(element => {
            if (key !== element && key.includes(element)) {
                if (!arrContain(actorsDict[element].children, key)){
                    actorsDict[element].children.push(key);
                }
                notUnique = true;
            }
        });

        if(notUnique){
            value.unique = !notUnique;
            continue;
        }

        if(!key.includes("_") || value.stories.length > 1){
            uniqueActors.push(key);
            value.unique = true
        }

    }

    uniqueActors.forEach(actorUnique => { 
        let actorNode = {
            name: transformActorName(actorUnique),
            children: [],
            story_ids: actorsDict[actorUnique].stories,
            project_id: projectId,
            nodeType: "actor-tree"
        };

        let children = actorsDict[actorUnique].children;
        children.forEach(childActorName => {
            let childActorNode = {
                name: transformActorName(childActorName),
                children: [],
                story_ids: actorsDict[childActorName].stories,
                project_id: projectId,
                nodeType: "actor-tree"
            };
            actorNode.children.push(childActorNode);
        });
        rootNode.children.push(actorNode);
    });

    saveTree(rootNode);
    
}

/**
 * 
 * @param {*} story 
 * @param {*} item  The part of the story needed like action, action-verb
 */
function getItem(story, item) {
    switch (item) {
        case 'actor':
            return story.actor;
        case 'action':
            return story.action;
        case 'benefit':
            return story.benefit;
        case 'action-verb':
            if (story.tokens.action && story.tokens.action.main_verb) {
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

async function createStoryTree(data){
    const projectId = data.projectId;
    const storiesAdded = data.stories;

    const stories = await Story.find({ project_id: projectId });
    await TreeNode.deleteMany({ project_id: projectId, nodeType: "story-tree" });

    let treeData = {
        name: 'Actor',
        children: [],
        project_id: projectId,
        nodeType: 'story-tree',
        isRoot: true
    };

    let actors = [];

    console.log({len: stories.length});

    for (let i = 0; i < stories.length; i++) {
        let story = stories[i];
        let actor = story.actor;

        if (!actors.includes(actor.toLowerCase())) {
            actors.push(actor.toLowerCase());
            let newNode = {
                name: actor,
                project_id: projectId,
                nodeType: 'story-tree',
                story_ids: [story._id],
                children: []
            };

            let actionVerb = getItem(story, 'action-verb');
            if(actionVerb){
                newChild = {
                    name: actionVerb,
                    project_id: projectId,
                    nodeType: 'story-tree',
                    story_ids: [story._id],
                    children: []
                };

                let actionObject = getItem(story, 'action-object');
                if(actionObject){
                    newChild.children.push(
                        {
                            name: actionObject,
                            project_id: projectId,
                            nodeType: 'story-tree',
                            story_ids: [story._id],
                            children: []
                        }
                    );
                }

                newNode.children.push(newChild);
            }
            treeData.children.push(newNode);
        } else if (story.action) {
            for (let j = 0; j < treeData.children.length; j++) {
                let child = treeData.children[j];

                if (child.name.toLowerCase() === actor.toLowerCase()) {
                    child.story_ids.push(story._id);
                    let item = getItem(story, 'action-verb');
                    let object = getItem(story, 'action-object');
                    if (item && !child.children.some(c => c.name === item)) {
                        let newNode = {
                            name: item,
                            project_id: projectId,
                            nodeType: 'story-tree',
                            story_ids: [story._id],
                            children: []
                        };

                        if(object){
                            newNode.children.push({
                                name: object,
                                project_id: projectId,
                                nodeType: 'story-tree',
                                story_ids: [story._id],
                                children: []
                            });
                        }

                        child.children.push(newNode);
                    } else if(item && object){
                        for(let k=0; k < child.children.length; k++){
                            let grandchild = child.children[k];
                            if(grandchild.name.toLowerCase() === item.toLowerCase()){
                                grandchild.story_ids.push(story._id);
                                grandchild.children.push({ 
                                    name: object, 
                                    project_id: projectId,
                                    nodeType: 'story-tree',
                                    story_ids: [story._id],
                                    children: [] 
                                });
                            }
                        }
                    }
                }
            }
        }
    }

    console.log(treeData);

    saveTree(treeData);



}

module.exports = {
    createActorTree: createActorTree,
    createStoryTree: createStoryTree
}