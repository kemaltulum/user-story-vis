import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import './App.css';

import AuthPage from './pages/Auth';
import ProjectsPage from './pages/Projects';
import StoryPage from './pages/Story';
import VisualizePage from './pages/Visualize';
import MainNavigation from './components/Navigation/MainNavigation';
import { authActions }  from './actions/auth.actions';


class App extends Component {
  constructor(props) {
    super(props);
    /*
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
            console.log('Not expired!');
            //TODO Find a correct way for token verification
            this.setState({
              token: localStorage.getItem('token'),
              userId: localStorage.getItem('userId')
            });
            console.log(this.state);
          } else {
            this.logout();
          }
        })
        .catch(err => {
          console.log(err);
        });  
      
    }
    */



  }

  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          {this.props.token && 
            <MainNavigation /> 
          }
            <main className="main-content">
              <Switch>
                {this.props.token && <Redirect from="/" to="/projects" exact />}
              {this.props.token && (
                  <Redirect from="/auth" to="/projects" exact />
                )}
              {!this.props.token && (
                  <Route path="/auth" component={AuthPage} />
                )}
              {this.props.token && (
                  <Route path="/:project_id/stories" component={StoryPage} />
                )}
              {this.props.token && (
                  <Route path="/projects" component={ProjectsPage} />
                )}
              {this.props.token && (
                <Route path="/:project_id/visualize" component={VisualizePage} />
              )}
              {!this.props.token && <Redirect to="/auth" exact />}
              </Switch>
            </main>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

function mapStateToProps(state){
  const {token, userId} = state.auth;
  const { projects } = state.project;
  return {
    token,
    userId
  };
}

function mapDispatchToProps(dispatch) {
  return {
    logout: () => {
      dispatch(authActions.logout());
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

