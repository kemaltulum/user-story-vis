const Project = require('../../models/Project');
const User = require('../../models/User');


const { transformProject } = require('./merge');


module.exports = {
    projects: async () => {
        try {
            const projects = await Project.find();
            console.log(projects);
            return projects.map(project => {
                return transformProject(project);
            });
        } catch (error) {
            throw error;
            
        }

    },
    createProject: async (args, req) => {
        try {
            const project = new Project({
                name: args.name,
                description: args.description,
                creator: '5c9793cbb661723d2dc74be9'
            });

            const result = await project.save();
            const createdEvent = transformProject(result);
            const creator = await User.findById('5c9793cbb661723d2dc74be9');

            if (!creator) {
                throw new Error('User not found.');
            }

            creator.createdProjects.push(project);
            await creator.save();

            return createdEvent;
        } catch (error) {
            throw error;
        }
    }
};
