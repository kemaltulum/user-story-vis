function toggleNav(showMainNav) {
    return dispatch => {
        dispatch({
            type: 'TOGGLE_NAV',
            payload: { showMainNav: showMainNav }
    })};
}

export const UIActions = {
    toggleNav
}