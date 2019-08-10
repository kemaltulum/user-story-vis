function toggleNav(showMainNav) {
    return dispatch => {
        dispatch({
            type: 'TOGGLE_NAV',
            payload: { showMainNav: showMainNav }
    })};
}

function toggleProjectModal(showProjectModal) {
    return dispatch => {
        dispatch({
            type: 'TOGGLE_PROJECT_MODAL',
            payload: { showProjectModal: showProjectModal }
        });
    }
}

export const UIActions = {
    toggleNav,
    toggleProjectModal
}