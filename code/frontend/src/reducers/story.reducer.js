const storyReducer = (state = {
    stories: []
}, action) => {
    switch (action.type) {
        case 'STORIES_REQUEST':
            state = {
                ...state,
                isLoading: true
            };
            break;
        case 'STORIES_FAILURE':
            state = {
                ...state,
                ...action.payload,
                isLoading: false
            };
            break;
        case 'GET_STORIES':
            state = {
                ...state,
                ...action.payload,
                isLoading: false
            };
            break;
        case 'ADD_STORY_SINGLE':
            state = {
                ...state,
                isLoading: false,
                stories: [...state.stories, action.payload.newStory]
            };
            break;
        case 'ADD_STORY_BULK':
            state = {
                ...state,
                isLoading: false,
                stories: [...state.stories, action.payload.newStories]
            };
            break;
        default:
            break;
    }
    return state;
}

export default storyReducer;