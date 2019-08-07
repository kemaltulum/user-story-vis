import React, { Component } from 'react';
import { connect } from 'react-redux';


import './Auth.scss';
import { authActions } from '../actions/auth.actions';

class AuthPage extends Component {
    state = {
        isLogin: true
    };

    constructor(props) {
        super(props);
        this.emailEl = React.createRef();
        this.passwordEl = React.createRef();

        this.switchModeHandler = this.switchModeHandler.bind(this);
    }

    switchModeHandler = () => {
        this.setState(prevState => {
            return { isLogin: !prevState.isLogin };
        });
    };

    submitHandler = event => {
        event.preventDefault();
        const email = this.emailEl.current.value;
        const password = this.passwordEl.current.value;

        if (email.trim().length === 0 || password.trim().length === 0) {
            return;
        }

        if(this.state.isLogin) {
            this.props.login(email, password);
        } else {
            this.props.signup(email, password);
        }
        
    };

    render() {
        return (
            <div className="auth-form-container">
                <form className="auth-form" onSubmit={this.submitHandler}>
                    <h2>{this.state.isLogin ? 'Login' : 'Sign Up'}</h2>
                    <div className="form-control">
                        <label htmlFor="email">E-Mail</label>
                        <input required type="email" id="email" ref={this.emailEl} />
                    </div>
                    <div className="form-control">
                        <label htmlFor="password">Password</label>
                        <input required type="password" id="password" ref={this.passwordEl} />
                    </div>
                    <div className="form-actions">
                        {this.state.error && 
                        <div className="form-errors">
                            {this.state.error}
                        </div>}
                        
                        <button type="submit">{this.state.isLogin ? 'Login' : 'Sign Up'}</button>
                        <button className="btn btn-secondary" type="button" onClick={this.switchModeHandler}>
                            Switch to {this.state.isLogin ? 'Sign Up' : 'Login'}
                        </button>
                    </div>
                </form>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { error, token, userId } = state.auth;
    return {
        error, token, userId
    }
}

function mapDispatchToProps(dispatch) {
    return {
        login: (email, password) => {
            dispatch(authActions.login(email, password));
        },
        signup: (email, password) => {
            dispatch(authActions.signup(email, password));
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthPage)

