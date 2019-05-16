const Bull = require('bull');
const Story = require('../models/Story');
const { capitalize, arrContain } = require('./index');
const TreeNode = require('../models/TreeNode');
const ProjectMeta = require('../models/ProjectMeta');


/*
const storyTreeQueue = new Bull('story-tree-queue');

storyTreeQueue.process(async (job, data) => {
    return createActorTree(data);
}); */

function transformActorName(name) {
    let items = name.split("_");
    let res = ""
    if (items.length == 0) {
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

async function saveTree(root) {
    if (!root.name || !root.project_id) {
        return false;
    }
    if (root.children.length === 0) {
        let treeNode = new TreeNode(root);
        let savedNode = await treeNode.save();
        return savedNode;
    } else {
        let ids = [];
        let childStories = [];
        for (let i = 0; i < root.children.length; i++) {
            let treeNode = root.children[i];
            let treeNodeSaved = await saveTree(treeNode);
            if (treeNodeSaved) {
                childStories = childStories.concat(treeNodeSaved.story_ids);
                ids.push(treeNodeSaved._id);
            }
        }
        root.children = ids;
        if (root.nodeType === "actor-tree" && !root.isRoot && root.story_ids) {
            root.story_ids = root.story_ids.filter(elem => !arrContain(childStories, elem));
        }
        let treeNode = new TreeNode(root);
        let savedNode = await treeNode.save();
        return savedNode;
    }
}

async function createGraphs(data) {
    const projectId = data.projectId;
    const stories = await Story.find({ project_id: projectId });

    const result = await createActorTree({
        stories: stories,
        projectId: projectId
    });

    await createStoryTree({
        stories: stories,
        projectId: projectId
    });

    await createWordCloud({
        stories: stories,
        projectId: projectId,
        actorsDict: result.actorsDict
    })

    /*
    await createEntityGraph({
        stories: stories,
        projectId: projectId,
        actorTree: result.actorTree
    });*/
}

async function createActorTree(data) {

    const projectId = data.projectId;
    const stories = data.stories;

    await TreeNode.deleteMany({ project_id: projectId, nodeType: "actor-tree" });


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
        if (actor.name.includes(" ")) {
            // Group the tales of the word group
            // Zoning Staff Member => Zoning Staff Member and Staff Member

            let actorItems = actor.name.split(" ");
            for (let i = 0; i < actorItems.length - 1; i++) {
                let actorSubItemsDict = actorItems.slice(i).join("_");
                if (actorsDict[actorSubItemsDict]) {
                    actorsDict[actorSubItemsDict].stories.push(actor.story_id);
                } else {
                    actorsDict[actorSubItemsDict] = { stories: [actor.story_id], children: [] };
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

    for (let i = 0; i < actorsDictKeys.length; i++) {
        let key = actorsDictKeys[i];
        let value = actorsDict[key];

        let notUnique = false;
        actorsDictKeys.forEach(element => {
            if (key !== element && key.includes(element)) {
                if (!arrContain(actorsDict[element].children, key)) {
                    actorsDict[element].children.push(key);
                }
                notUnique = true;
            }
        });

        if (notUnique) {
            value.unique = !notUnique;
            continue;
        }

        if (!key.includes("_") || value.stories.length > 1) {
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


    await createEntityGraph({
        projectId: projectId,
        stories: stories,
        actorTree: Object.assign({}, rootNode)
    });

    await saveTree(rootNode);

    return {
        actorsDict: actorsDict
    };

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
            return null;
        case 'benefit-verb':
            if (story.tokens.benefit && story.tokens.benefit.main_verb) {
                return story.tokens.benefit.main_verb;
            }
            return null;
        case 'benefit-object':
            if (story.tokens.benefit && story.tokens.benefit.main_object) {
                return story.tokens.benefit.main_object.text;
            }
            return null;
        default:
            return null;
    }
}

async function createStoryTree(data) {
    const projectId = data.projectId;
    const stories = data.stories;

    await TreeNode.deleteMany({ project_id: projectId, nodeType: "story-tree" });

    let treeData = {
        name: 'Actor',
        children: [],
        project_id: projectId,
        nodeType: 'story-tree',
        isRoot: true
    };

    let actors = [];

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
            if (actionVerb) {
                newChild = {
                    name: actionVerb,
                    project_id: projectId,
                    nodeType: 'story-tree',
                    story_ids: [story._id],
                    children: []
                };

                let actionObject = getItem(story, 'action-object');
                if (actionObject) {
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

                        if (object) {
                            newNode.children.push({
                                name: object,
                                project_id: projectId,
                                nodeType: 'story-tree',
                                story_ids: [story._id],
                                children: []
                            });
                        }

                        child.children.push(newNode);
                    } else if (item && object) {
                        for (let k = 0; k < child.children.length; k++) {
                            let grandchild = child.children[k];
                            if (grandchild.name.toLowerCase() === item.toLowerCase()) {
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

    await saveTree(treeData);



}

const stopWords = ["i", "me", "my", "myself", "we", "our", "ours", "ourselves", "you", "your","yours","yourself","yourselves","he","him","his","himself","she","her","hers","herself","it","its","itself","they"
,"them","their","theirs","themselves","what","which","who","whom","this","that","these","those","am","is","are","was","were","be","been","being","have","has","had","having","do ","does","did","doing","a","an","the","and","but","if","or","because","as","until","while","of","at","by","for","with","about","against","between","into","through","during","before","after","above","below","to","from","up","down"
,"in ","out","on","off","over","under","again","further","then","once","here","there","when","where","why","how","all","any","both","each","few","more","most","other","some","such","no","nor","not","only","own","same","so","than","too","very","s","t","can","will","just","don","should","now"]

function preprocessWord(word){
    if (stopWords.includes(word)) {
        return false;
    }
    if(word.charAt(word.length - 1) === ","){
        word = word.substr(0, word.length - 1);
    }
    return word;
}

async function createWordCloud(data) {
    const projectId = data.projectId;
    const stories = data.stories;
    const actorsDict = data.actorsDict;

    await ProjectMeta.deleteMany({project_id: projectId, type: "word-cloud"});

    wordDict = {};

    for (let i = 0; i < stories.length; i++) {
        let story = stories[i];
        let action = getItem(story, "action");
        let actionVerb = getItem(story, "action-verb");
        let actionObject = getItem(story, "action-object");
        let benefit = getItem(story, "benefit");
        let benefitVerb = getItem(story, "benefit-verb");
        let benefitObject = getItem(story, "benefit-object");

        let actionWords = action.split(" ");

        for (let i = 0; i < actionWords.length; i++) {
            let word = actionWords[i].toLowerCase();
            word = preprocessWord(word);
            if (!word) {
                continue;
            }
            let value = 1;
            switch (word) {
                case actionVerb:
                    value = 3;
                    break;
                case actionObject:
                    value = 3;
                    break;
                default:
                    break;
            }

            if (!wordDict[word]) {
                wordDict[word] = value;
            } else {
                wordDict[word] += value;
            }
        }

        if (benefit && benefit.length > 0) {
            let benefitWords = benefit.split(" ");

            for (let i = 0; i < benefitWords.length; i++) {
                let word = benefitWords[i].toLowerCase();
                word = preprocessWord(word);
                if(!word){
                    continue;
                }
                let value = 1;
                switch (word) {
                    case benefitVerb:
                        value = 2;
                        break;
                    case benefitObject:
                        value = 2
                        break;
                    default:
                        break;
                }

                if (!wordDict[word]) {
                    wordDict[word] = value;
                } else {
                    wordDict[word] += value;
                }
            }
        }
    }

    const actorKeys = Object.keys(actorsDict);
    for (let i = 0; i < actorKeys.length; i++) {
        let actorKey = actorKeys[i];
        let actor = actorKeys[i].split("_").join(" ");
        value = parseInt(actorsDict[actorKey].stories.length);
        if (!wordDict[actor]) {
            wordDict[actor] = value * 3;
        } else {
            wordDict[actor] += (value * 3);
        }
    }

    let wordCloudData = new ProjectMeta({
        data: wordDict,
        project_id: projectId,
        type: "word-cloud"
    });

    let wordCloud = await wordCloudData.save();

}

var idGlobal = 0;
function recActorTree(root, parentId, nodes, links, stories){
    let newNode = {id: idGlobal, name: root.name, story_ids: root.story_ids, nodeType: "actor"};
    nodes.push(newNode);
    idGlobal += 1;
    if(parentId !== null){
        let newLink = {source: newNode.id, target: parentId, relation: "is-a", linkType:"is-a"};
        links.push(newLink)
    }


    let childStories = [];
    if(root.children && root.children.length > 0){
        for(let i=0; i<root.children.length; i++){
            let childRoot = root.children[i];
            recActorTree(childRoot, newNode.id, nodes, links, stories);
            childStories = childStories.concat(childRoot.story_ids);
        }
    }

    if(root.story_ids){
        root.story_ids = root.story_ids.filter(elem => !arrContain(childStories, elem));
    }

    if(root.story_ids && root.story_ids.length > 0){
        for(let i=0; i<root.story_ids.length; i++){
            let story_id = root.story_ids[i];
            let story;
            for(let j=0; j<stories.length; j++){
                if(story_id === stories[j]._id){
                    story = stories[j];
                    break
                }
            }
            if(!story){
                continue;
            }
            let actionVerb = getItem(story, "action-verb");
            let actionObject = getItem(story, "action-object");
            let benefitVerb = getItem(story, "benefit-verb");
            let benefitObject = getItem(story, "benefit-object");

            let actionNode;
            if(actionVerb && actionObject){
                actionNode = {id: idGlobal, name: actionObject, story_ids:[story._id], nodeType: "action"};
                idGlobal += 1;
                nodes.push(actionNode);

                let actionLink = {source: newNode.id, target: actionNode.id, relation: actionVerb, linkType: "action"}
                links.push(actionLink);
            }

            if(actionNode && benefitVerb && benefitObject){
                let benefitNode = { id: idGlobal, name: benefitObject, story_ids: [story._id], nodeType: "benefit" };
                idGlobal += 1;
                nodes.push(benefitNode);

                let benefitLink = { source: actionNode.id, target: benefitNode.id, relation: benefitVerb, linkType: "benefit" }
                links.push(benefitLink);
            }
        }
    }
}

async function createEntityGraph(data){
    const projectId = data.projectId;
    const stories = data.stories;
    const actorTree = data.actorTree;

    await ProjectMeta.deleteMany({project_id: projectId, type:"entity-graph"});

    nodes = [];
    links = [];

    recActorTree(actorTree, null, nodes, links, stories);

    const entityGraph = {
        nodes: nodes,
        links: links
    };

    let entityGraphData = new ProjectMeta({
        data: entityGraph,
        project_id: projectId,
        type: "entity-graph"
    });

    await entityGraphData.save();
}

module.exports = {
    createGraphs: createGraphs
}