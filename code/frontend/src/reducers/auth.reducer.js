const userId = localStorage.getItem('userId');
const token = localStorage.getItem('token');


const authReducer = (state = {
    token: token,
    userId: userId
}, action) => {
    switch (action.type) {
        case 'LOGIN_SUCCESS':
            state = {
                ...state,
                ...action.payload
            };
            break;
        case 'LOGIN_FAILURE':
            state = {
                ...state,
                ...action.payload
            };
            break;
        case 'SIGNUP_SUCCESS':
            state = {
                ...state,
                ...action.payload
            };
            break;
        case 'SIGNUP_FAILURE':
            state = {
                ...state,
                ...action.payload
            };
            break;
        case 'LOGOUT':
            state = {
                ...state,
                ...action.payload
            };
            break;
        default:
            break;
    }
    return state;
}

export default authReducer;