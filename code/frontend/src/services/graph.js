module.exports = (query, variables={}, token=null) => {

    const requestBody = {
        query: query,
        variables: variables
    };

    let headers = {
        'Content-Type': 'application/json'
    };

    headers.Authorization = 'Bearer ' + token;

    return fetch('/graphql', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: headers
    });
}