import React from 'react';
import { connect } from 'react-redux';

import CreateProjectModal from './Modal-Pages/CreateProject';

import { projectActions } from '../../actions/project.actions';
import { UIActions } from '../../actions/ui.actions';



const ModalConductor = props => {

    console.log("Modal Conductor", props.currentModal);
    const modalProps = {
        token: props.token,
        hideModal: props.hideModal
    };

    switch (props.currentModal) {
        case 'CREATE_PROJECT':
            return <CreateProjectModal onConfirm={props.createProject} {...modalProps} />;

        default:
            return null;
    }
};

function mapStateToProps(state) {
    const { token } = state.auth;
    const { currentModal } = state.ui;
    return {
        currentModal,
        token
    };
}

function mapDispatchToProps(dispatch) {
    return {
        hideModal: () => {
            dispatch(UIActions.hideModal())
        },
        createProject: (name, description, token) => {
            dispatch(projectActions.createProject(name, description, token));
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalConductor);

