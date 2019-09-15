import { projectService } from '../services';

function getProjects(token) {
    return dispatch => {
        dispatch({
            type: 'PROJECTS_REQUEST',
            payload: {}
        });
        projectService.getProjects(token)
            .then(
                projects => {
                    dispatch({
                        type: 'GET_PROJECTS',
                        payload: { projects }
                    });
                },
                error => {
                    dispatch({
                        type: 'PROJECTS_FAILURE',
                        payload: { error }
                    });
                }
            );
    }
}


function createProject(name, description, token) {
    return dispatch => {
        dispatch({
            type: 'PROJECTS_REQUEST',
            payload: {}
        });
        projectService.createProject(name, description, token)
            .then(
                newProject => {
                    dispatch({
                        type: 'CREATE_PROJECT',
                        payload: { newProject }
                    });
                },
                error => {
                    dispatch({
                        type: 'PROJECTS_FAILURE',
                        payload: { error }
                    });
                }
            )
    }
}

function deleteProject(projectId, token) {
    return dispatch => {
        dispatch({
            type: 'DELETE_PROJECT_REQUEST',
            payload: {}
        });
        projectService.deleteProject(projectId, token)
            .then(
                deleteProjectResult => {
                    dispatch({
                        type: 'DELETE_PROJECT',
                        payload: { }
                    });
                },
                error => {
                    dispatch({
                        type: 'PROJECTS_FAILURE',
                        payload: { error }
                    });
                }
            )
    }
}

function getMetaData(projectId, type, token){
    return dispatch => {
        dispatch({
            type: 'PROJECTS_REQUEST',
            payload: {}
        });
        projectService.getMetaData(projectId, type, token)
            .then(
                metaData => {
                    dispatch({
                        type: 'GET_METADATA',
                        payload: { metaData }
                    });
                },
                error => {
                    dispatch({
                        type: 'PROJECTS_FAILURE',
                        payload: { error }
                    });
                }
            )
    }
}

export const projectActions = {
    getProjects,
    createProject,
    getMetaData,
    deleteProject
};