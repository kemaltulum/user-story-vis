const projectReducer = (state = {
    projects: []
}, action) => {
    switch (action.type) {
        case 'PROJECTS_REQUEST':
            state = {
                ...state,
                ...action.payload,
                isLoading: true
            };
            break;
        case 'PROJECTS_FAILURE':
            state = {
                ...state,
                ...action.payload,
                isLoading: false
            };
            break;
        case 'GET_PROJECTS':
            state = {
                ...state,
                ...action.payload
            };
            break;
        case 'CREATE_PROJECT':
            state = {
                ...state,
                ...action.payload
            };
            break;
        case 'GET_METADATA':
            if(action.payload.metaData && action.payload.metaData.type === 'word-cloud'){
                state = {
                    ...state,
                    wordCloud: action.payload.metaData,
                    isLoading: false
                };
            } else if (action.payload.metaData && action.payload.metaData.type === 'entity-graph'){
                state = {
                    ...state,
                    entityGraph: action.payload.metaData,
                    isLoading: false
                };
            }else {
                state = {
                    ...state,
                    ...action.payload,
                    isLoading: false
                };
            }
            break;
        default:
            break;
    }
    return state;
}

export default projectReducer;