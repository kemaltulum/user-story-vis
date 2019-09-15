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

function showModal(currentModal) {
    return dispatch => {
        dispatch({
            type: 'SHOW_MODAL',
            payload: {currentModal: currentModal}
        });
    }
}

function hideModal(){
    return dispatch => {
        dispatch({
            type: 'HIDE_MODAL',
            payload: { currentModal: null }
        });
    }
}

export const UIActions = {
    toggleNav,
    toggleProjectModal,
    showModal,
    hideModal
}