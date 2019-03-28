import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

import './App.css';

import AuthPage from './pages/Auth';
import ProjectsPage from './pages/Projects';
import StoryPage from './pages/Story';
import MainNavigation from './components/Navigation/MainNavigation';

import AuthContext from './context/auth-context';
import graphRequest from './services/graph';

class App extends Component {
  state = {
    token: null,
    userId: null
  };

  constructor(props) {
    super(props);
    if(localStorage.getItem('token') && localStorage.getItem('userId')){
      const query = `
        query VerifyToken($token: String!){
          verifyToken(token: $token){
            expired
          }
        }
      `;

      const variables = {
        token: localStorage.getItem('token')
      };
      
      graphRequest(query, variables)
        .then(res => {
          if (res.status !== 200 && res.status !== 201) {
            throw new Error('Token Expired!');
          }
          return res.json();
        })
        .then(resData => {
          if (!resData.data.verifyToken.expired) {
            this.state = {
              token: localStorage.getItem('token'),
              userId: localStorage.getItem('userId')
            };
          } else {
            this.logout();
          }
        })
        .catch(err => {
          console.log(err);
        });  
      
    }



  }

  login = (token, userId, tokenExpiration) => {
    this.setState({ token: token, userId: userId });
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
  };

  logout = () => {
    this.setState({ token: null, userId: null });
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  };

  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <AuthContext.Provider
            value={{
              token: this.state.token,
              userId: this.state.userId,
              login: this.login,
              logout: this.logout
            }}>
            <MainNavigation />
            <main className="main-content">
              <Switch>
                {this.state.token && <Redirect from="/" to="/projects" exact />}
                {this.state.token && (
                  <Redirect from="/auth" to="/projects" exact />
                )}
                {!this.state.token && (
                  <Route path="/auth" component={AuthPage} />
                )}
                {this.state.token && (
                  <Route path="/:project_id/stories" component={StoryPage} />
                )}
                {this.state.token && (
                  <Route path="/projects" component={ProjectsPage} />
                )}
                {!this.state.token && <Redirect to="/auth" exact />}
              </Switch>
            </main>
          </AuthContext.Provider>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}


export default App;
