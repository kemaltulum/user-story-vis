import React, { Component } from 'react';

import './Auth.css';
import AuthContext from '../context/auth-context';

class AuthPage extends Component {
    state = {
        isLogin: true,
        formError: {
            exists: false,
            message: 'No error'
        }
    };

    static contextType = AuthContext;

    constructor(props) {
        super(props);
        this.emailEl = React.createRef();
        this.passwordEl = React.createRef();
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

        let requestBody = {
            query: `
        query Login($email: String!, $password: String!) {
          login(email: $email, password: $password) {
            userId
            token
            tokenExpiration
          }
        }
      `,
            variables: {
                email: email,
                password: password
            }
        };

        if (!this.state.isLogin) {
            requestBody = {
                query: `
          mutation CreateUser($email: String!, $password: String!) {
            createUser(userInput: {email: $email, password: $password}) {
              _id
              email
            }
          }
        `,
                variables: {
                    email: email,
                    password: password
                }
            };
        }

        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                if (res.status !== 200 && res.status !== 201) {
                    this.setState({
                        formError: {
                            exists: true
                        }
                    });
                }
                return res.json();
            })
            .then(resData => {
                if(this.state.formError.exists){
                    this.setState({
                        formError: {
                            exists: true,
                            message: resData.errors[0].message 
                        }
                    });
                    throw new Error(resData.errors[0].message);
                }

                if (resData.data.login.token) {
                    this.context.login(
                        resData.data.login.token,
                        resData.data.login.userId,
                        resData.data.login.tokenExpiration
                    );
                }
            })
            .catch(err => {
                console.log(err);
            });    
        
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
                        {this.state.formError.exists && 
                        <div className="form-errors">
                            {this.state.formError.message}
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

export default AuthPage;
