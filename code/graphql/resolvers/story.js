const Project = require('../../models/Project');
const Story = require('../../models/Story');
const TreeNode = require('../../models/TreeNode');
const mongoose = require('mongoose');

const storyTree = require('../../util/storyTree');
const Bull = require('bull');


const { transformStory } = require('./merge');

const { parseSingle, parseAllRaw } = require('../../util/story');


module.exports = {
    stories: async (args) => {
        try {
            const stories = await Story.find({project_id: args.projectId});
            return stories.map(story => {
                return transformStory(story);
            });
        } catch (error) {
            throw error;

        }

    },
    addStory: async (args, req) => {
        try {

            const fullText = args.storyInput.full_text;
            const storyParsed = await parseSingle(fullText);

            const story = new Story({
                ...storyParsed,
                project_id: args.storyInput.project_id,
                order: 1
            });

            const result = await story.save();

            const data = {
                projectId: args.storyInput.project_id,
                stories: [story]
            };

            await storyTree.createActorTree(data);
            await storyTree.createStoryTree(data);

            const createdStory = transformStory(result);

            return createdStory;
        } catch (error) {
            throw error;
        }
    },
    addStoryBulkRaw: async (args) => {
        try {
            const rawText = args.rawText;
            const storiesParsed = await parseAllRaw(rawText);

            storiesParsedMap = [];
            for(let i=0; i<storiesParsed.length; i++){
                let story = storiesParsed[i];
                storiesParsedMap.push({ ...story, project_id: args.projectId, order: i + 1 });
            }
            const stories = await Story.insertMany(storiesParsedMap);
            
            const data = {
                projectId: args.projectId,
                stories: stories
            };

            await storyTree.createActorTree(data);
            await storyTree.createStoryTree(data);

            return stories.map(story => {
                return transformStory(story)
            });
        } catch (error) {
            throw error;
        }
    },
    storyTree: async ({nodeType, projectId}) => {
        try {
            let treeNodes = await TreeNode.find({ project_id: projectId, nodeType: nodeType });

            return treeNodes.map(treeNode => {
                return {
                    ...treeNode._doc,
                    _id: treeNode.id
                };
            });

        } catch (error) {
            throw error;
        }
    }
};
