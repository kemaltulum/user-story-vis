import React from 'react';

import ModalWrapper from '../ModalWrapper';

class CreateProject extends React.Component {

    constructor(props){
        super(props);
        this.nameElRef = React.createRef();
        this.descriptionElRef = React.createRef();
        this.formElRef = React.createRef();
    }

    modalConfirmHandler = () => {
        const name = this.nameElRef.current.value;
        const description = this.descriptionElRef.current.value;

        if (
            name.trim().length === 0 ||
            description.trim().length === 0
        ) {
            console.log("No description or name");
        } else {
            this.props.createProject(name, description, this.props.token);
        }
        this.props.hideModal();
    }

    modalCancelHandler = () => {
        this.props.hideModal();
    }

    render(){
        return (
            <ModalWrapper
                title="New Project"
                onComfirm={this.modalConfirmHandler}
                onCancel={this.modalCancelHandler}
                hideModal={this.props.hideModal}
                confirmText="Create"
                canCancel
                canConfirm>
                <form ref={this.formElRef} onChange={() => console.log(this.formElRef.current)}>
                    <div className="form-control">
                        <label htmlFor="name">Name</label>
                        <input type="text" id="name" required ref={this.nameElRef} />
                    </div>
                    <div className="form-control">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            rows="4"
                            ref={this.descriptionElRef}
                        />
                    </div>
                </form>
            </ModalWrapper>
        );
    }
}

export default CreateProject;