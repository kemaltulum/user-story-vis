const storyReducer = (state = {
    stories: []
}, action) => {
    switch (action.type) {
        case 'GET_STORIES':
            state = {
                ...state,
                ...action.payload,
                isLoading: false
            };
            break;
        case 'GET_STORIES_REQUEST':
            state = {
                ...state,
                isLoading: true
            };
            break;
        case 'GET_STORIES_FAILURE':
            state = {
                ...state,
                ...action.payload,
                isLoading: false
            };
            break;
        default:
            break;
    }
    return state;
}

export default storyReducer;