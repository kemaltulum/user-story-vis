const DataLoader = require('dataloader');

const Project = require('../../models/Project');
const User = require('../../models/User');
const Story = require('../../models/Story');

const projectLoader = new DataLoader(projectIds => {
    return projects(projectIds);
});

const storyLoader = new DataLoader(storyIds => {
    return stories(storyIds);
});

const userLoader = new DataLoader(userIds => {
    return User.find({ _id: { $in: userIds } });
});


const projects = async projectIds => {
    try {
        const projects = await Project.find({_id: {$in: projectIds}});
        projects.sort((a, b) => {
            return (
                projectIds.indexOf(a._id.toString()) - projectIds.indexOf(b._id.toString())
            );
        })
        return projects.map(project => {
            return transformProject(project);
        })
    } catch (error) {
        throw error;
    }
}

const stories = async storyIds => {
    try {
        const stories = await Story.find({_id: {$in: storyIds}});
        const returnedStories = [];
        storyIds.forEach(element => {
            let storiesFound = stories.filter(story => story._id.toString() === element.toString());
            returnedStories.push(storiesFound[0]);
        });
        /*
        stories.sort((a, b) => {
            return (
                stories.indexOf(a._id.toString()) - stories.indexOf(b._id.toString())
            );
        });*/
        return returnedStories.map(story => {
            return transformStory(story);
        });
    } catch(error) {
        throw error;
    }
}

const user = async userId => {
    try {
        const user = await userLoader.load(userId.toString());
        return {
            ...user._doc,
            _id: user.id,
            createdProjects: () => projectLoader.loadMany(user._doc.createdProjects)
        };
    } catch (err) {
        throw err;
    }
};

const project = async projectId => {
    try {
        const project = await projectLoader.load(projectId.toString());
        return transformProject(project);
    } catch (error) {
        throw error;
    }
}

const story = async storyId => {
    try {
        const story = await storyLoader.load(storyId.toString());
        return story;
    } catch (error) {
        throw error;
    }
}

const transformProject = (project) => {
    return {
        ...project._doc,
        _id: project.id,
        creator: user.bind(this, project.creator)
    }
}

const transformStory = (story) => {
    return {
        ...story._doc,
        _id: story.id,
        project_id: project.bind(this, project.creator)
    }
}

const transformTreeNode = (treeNode) => {
    return {
        ...treeNode._doc,
        _id: treeNode.id,
        stories: () => storyLoader.loadMany(treeNode._doc.story_ids)
    };
}

exports.transformProject = transformProject;
exports.transformStory = transformStory;
exports.transformTreeNode = transformTreeNode;