import graph from './graph';

function login(email, password){
    const query = 
    `
        query Login($email: String!, $password: String!) {
          login(email: $email, password: $password) {
            userId
            token
            tokenExpiration
          }
        }
    `;
    
    const variables = {
        email: email,
        password: password
    };

    return graph(query, variables)
        .then(handleResponse)
        .then(responseData => {
            if (responseData.data.login.token) {
                localStorage.setItem('token', responseData.data.login.token);
                localStorage.setItem('userId', responseData.data.login.userId);

                return responseData.data.login;
            }
        });
}

function signup(email, password){
    const query =
        `
        mutation CreateUser($email: String!, $password: String!) {
            createUser(userInput: {email: $email, password: $password}) {
              _id
              email
            }
          }
    `;

    const variables = {
        email: email,
        password: password
    };

    return graph(query, variables)
        .then(handleResponse);
}

function logout() {
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
}

function verifyToken(token){
    if(token)
    return Promise.resolve(true);
    return Promise.resolve(false); 
}

function handleResponse(res) {
    let errorExists = false;
    if (res.status !== 200 && res.status !== 201) {
        errorExists = true;
        if (res.status === 401) {
            logout();
        }
    }
    return res.json().then(resData => {
        if (errorExists) {
            return Promise.reject(resData.errors[0]);
        }
        return resData;
    });
}

export const authService = {
    login,
    signup,
    logout,
    verifyToken
};