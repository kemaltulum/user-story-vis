module.exports = (query, variables={}) => {

    const requestBody = {
        query: query,
        variables: variables
    };

    return fetch('http://localhost:8000/graphql', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
            'Content-Type': 'application/json'
        }
    });
}