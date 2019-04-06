import { config } from '../config';

export default (query, variables={}, token=null) => {

    const requestBody = {
        query: query,
        variables: variables
    };

    let headers = {
        'Content-Type': 'application/json'
    };

    headers.Authorization = 'Bearer ' + token;

    let endpoint = '/graphql';

    if(!config.isProd){
        endpoint = 'http://localhost:8000/graphql'
    }

    return fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: headers
    });
}