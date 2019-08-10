const UIReducer = (state = {
    showMainNav : false
}, action) => {
    switch (action.type) {
        case "TOGGLE_NAV":
            state = {
                ...state,
                ...action.payload
            };
            break;
        case "TOGGLE_PROJECT_MODAL":
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

export default UIReducer;