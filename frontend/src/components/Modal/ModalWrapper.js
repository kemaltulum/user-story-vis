import React, {Component, Fragment} from 'react';

import Backdrop from './Backdrop';
import "./ModalWrapper.scss";

class ModalWrapper extends Component {
    constructor(props){
        super(props);
    }
    handleBackgroundClick(e){
        console.log("Background Click");
        if (e.target === e.currentTarget) this.props.hideModal();
    }
    render(){
        return (
            <Fragment>
                <div className="backdrop" onClick={this.handleBackgroundClick.bind(this)}></div>
                <div className="modal">
                    <header className="modal__header">
                        <h1>{this.props.title}</h1>
                    </header>
                    <section className="modal__content">
                        {this.props.children}
                    </section>
                    <section className="modal__actions">
                        {this.props.canCancel && (
                            <button className="btn" onClick={this.props.hideModal}>
                                Cancel
                            </button>
                        )}
                        {this.props.canConfirm && (
                            <button className="btn" onClick={this.props.onConfirm} disabled={this.props.confirmDisabled}>
                                {this.props.confirmText}
                            </button>
                        )}
                    </section>
                </div>
            </Fragment>
        );
    }
}

export default ModalWrapper;