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

export const projectActions = {
    getProjects,
    createProject
};