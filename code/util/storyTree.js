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
            childStories = childStories.concat(treeNodeSaved.story_ids);
            ids.push(treeNodeSaved._id);
        }
        root.children = ids;
        if(!root.isRoot && root.story_ids) {
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

module.exports = {
    createStoryTree: createActorTree
}