const Bull = require('bull');
const Story = require('../models/Story');
const { capitalize } = require('./index');
const TreeNode = require('../models/TreeNode');

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
        return await treeNode.save();
    } else {
        let ids = [];
        for(let i=0; i<root.children.length; i++) {
            let treeNode = root.children[i];
            console.log({child: treeNode});
            let treeNodeSaved = await saveTree(treeNode);
            console.log(treeNodeSaved);
            ids.push(treeNodeSaved.id);
        }
        root.children = ids;
    }
}

async function createActorTree(data){
    console.log("Create Story Trees");

    const projectId = data.projectId;
    const storiesAdded = data.stories;


    const stories = await Story.find({project_id: projectId});

    console.log("Length:", stories.length);

    let rootNode = {
        name: 'Actor',
        children: [],
        project_id: projectId,
        nodeType: 'actor-tree'
    };

    const actors = stories.map(story => {
        return {
            name: story.actor.toLowerCase(),
            story_id: story._id
        };
    });

    const uniqueActors = []
    const actorsDict = {}

    console.log({actors});

    actors.forEach(actor => {
        actor = actor.name;
        if(actor.includes(" ")){
            // Group the tales of the word group
            // Zoning Staff Member => Zoning Staff Member and Staff Member

            let actorItems = actor.split(" ");
            for(let i=0; i<actorItems.length - 1; i++) {
                let actorSubItemsDict = actorItems.slice(i).join("_");
                if (actorsDict[actorSubItemsDict]) {
                    actorsDict[actorSubItemsDict] += 1;
                } else {
                    actorsDict[actorSubItemsDict] = 1
                }
            }          
        } else {
            if (actorsDict[actor]) {
                actorsDict[actor] += 1;
            } else {
                actorsDict[actor] = 1
            }
        }
    });
    
    console.log({actorsDict});

    actorsDictEntries = Object.entries(actorsDict);

    for(let i=0; i<actorsDictEntries.length; i++){
        let entry = actorsDictEntries[i];

        if(entry[0].includes("_") || entry[1] > 1 ) {
            uniqueActors.push(entry[0]);
        }
    }

    uniqueActors.forEach(actorUnique => {
        let actorNode = {
            name: transformActorName(actorUnique),
            children: [],
            story_ids: [],
            project_id: projectId,
            nodeType: "actor-tree"
        };
        for(let i=0; i<actors.length; i++) {
            if(actors[i].name === actorUnique) {
                actorNode.story_ids.push(actors[i].story_id);
            }
            if(actors[i].name.includes(actorUnique)){
                actorNode.children.push(
                    {
                        name: transformActorName(actors[i].name),
                        children: [],
                        story_ids: [actors[i].story_id],
                        project_id: projectId,
                        nodeType: "actor-tree"
                    }
                );
            }
        }
        rootNode.children.push(actorNode);
    });

    console.log({uniqueActors});
    console.log({rootNode});
    saveTree(rootNode);
    
}

module.exports = {
    createStoryTree: createActorTree
}