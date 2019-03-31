import { authService } from '../services';

function login(email, password) {
    return dispatch => {
        authService.login(email, password)
            .then( 
                login => {
                    dispatch({
                        type: 'LOGIN_SUCCESS',
                        payload: {...login}
                    });
                },
                error => {
                    dispatch({
                        type: 'LOGIN_FAILURE',
                        payload: {error}
                    });
                }
            )
    }
}

function signup(email, password) {
    return dispatch => {
        authService.signup(email, password)
            .then(
                login => {
                    dispatch((login) => {
                        return {
                            type: "SIGNUP_SUCCESS",
                            payload: { ...signup }
                        }
                    })
                },
                error => {
                    dispatch((login) => {
                        return {
                            type: "SIGNUP_FAILURE",
                            payload: { error }
                        }
                    })
                }
            )
    }
}

function logout() {
    authService.logout();
    return {
        type: "LOGOUT",
        payload: {
            token: null,
            userId: null
        }
    };
}

export const authActions = {
    login,
    logout,
    signup
};