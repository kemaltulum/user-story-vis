const DataLoader = require('dataloader');

const Project = require('../../models/Project');
const User = require('../../models/User');
const Story = require('../../models/Story');

const projectLoader = new DataLoader(projectIds => {
    return projects(projectIds);
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

exports.transformProject = transformProject;
exports.transformStory = transformStory;