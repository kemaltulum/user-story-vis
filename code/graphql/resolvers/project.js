const Project = require('../../models/Project');
const User = require('../../models/User');
const ProjectMeta = require('../../models/ProjectMeta');


const { transformProject, transformMetaData } = require('./merge');


module.exports = {
    projects: async () => {
        try {
            const projects = await Project.find();
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
                creator: req.userId
            });

            const result = await project.save();
            const createdProject = transformProject(result);
            const creator = await User.findById(req.userId);

            if (!creator) {
                throw new Error('User not found.');
            }

            creator.createdProjects.push(project);
            await creator.save();

            return createdProject;
        } catch (error) {
            throw error;
        }
    }, projectMeta: async(args, req) => {
        try {

            const projectId = args.projectId;
            const type = args.type;

            console.log({args});

            let projectMeta = await ProjectMeta.findOne({ project_id: projectId, type: type });

            console.log({projectMeta});

            if(!projectMeta){
                throw new Error("MetaData not found");
            }
            return transformMetaData(projectMeta);

        } catch (error) {
            throw error;
        }
    }
};
