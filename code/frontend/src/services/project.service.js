import graph from './graph';
import { authActions } from '../actions/auth.actions';


function getProjects(token) {
    const query =
    ` 
        query {
            projects {
              _id
              name
              description
              creator {
                _id
                email
              }
            }
          }
    `;

    const variables = {}

    return graph(query, variables, token)
        .then(handleResponse)
        .then(responseData => {
            const projects = responseData.data.projects;
            return projects;
        });
}



function createProject(name, description, token) {

    const query =
        `
        mutation CreateProject($name: String!, $desc: String!) {
            createProject(name: $name, description: $desc) {
              _id
              name
              description
            }
          }
    `;

    const variables = {
        name: name,
        desc: description
    }

    return graph(query, variables, token)
        .then(handleResponse)
        .then(responseData => {
            const newProject = responseData.data.createProject;
            return newProject;
        });
}

function handleResponse(res) {
    let errorExists = false;
    if (res.status !== 200 && res.status !== 201) {
        errorExists = true;
        if (res.status === 401) {
            authActions.logout();
        }
    }
    return res.json().then(resData => {
        if (errorExists) {
            return Promise.reject(resData.errors[0]);
        }
        return resData;
    });
}

export const projectService = {
    getProjects,
    createProject
};