module.exports = (query, variables={}, token=null) => {

    const requestBody = {
        query: query,
        variables: variables
    };

    let headers = {
        'Content-Type': 'application/json'
    };

    headers.Authorization = 'Bearer ' + token;

    return fetch('http://localhost:8000/graphql', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: headers
    });
}