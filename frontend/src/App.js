import React, { Component, Fragment } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import './App.scss';

import Modal from './components/Modal/Modal';
import Backdrop from './components/Backdrop/Backdrop';

import AuthPage from './pages/Auth';
import ProjectsPage from './pages/Projects';
import StoryPage from './pages/Story';
import VisualizePage from './pages/Visualize';
import WordCloudPage from './pages/WordCloud';
import EntityGraphPage from './pages/EntityGraph';
import MainNavigation from './components/Navigation/MainNavigation';
import { authActions }  from './actions/auth.actions';
import {UIActions } from './actions/ui.actions';
import { projectActions } from './actions/project.actions';
import ModalConductor from './components/Modal/ModalConductor';


class App extends Component {
  constructor(props) {
    super(props);
    this.nameElRef = React.createRef();
    this.descriptionElRef = React.createRef();
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

  fetchProjects() {
    this.props.getProjects(this.props.token);
  }


  

  render() {
    return (
      <BrowserRouter>
        <Fragment>
          {(this.props.token && this.props.showMainNav) && 
              <MainNavigation />
          }
            {(this.props.token) &&
              <ModalConductor />
            }
            <main className="main-content" style={{marginLeft: this.props.showMainNav ? "250px" : "0"}}>
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
                <Route path="/:project_id/visualize/entity" component={EntityGraphPage} />
              )}
              {this.props.token && (
                <Route path="/:project_id/visualize/cloud" component={WordCloudPage} />
              )}
              {this.props.token && (
                <Route path="/:project_id/visualize" component={VisualizePage} />
              )}
              {!this.props.token && <Redirect to="/auth" exact />}
              </Switch>
            </main>
        </Fragment>
      </BrowserRouter>
    );
  }
}

function mapStateToProps(state){
  const {token, userId} = state.auth;
  const { projects } = state.project;
  const { showMainNav, showProjectModal } = state.ui;
  return {
    token,
    userId,
    showMainNav,
    showProjectModal
  };
}

function mapDispatchToProps(dispatch) {
  return {
    logout: () => {
      dispatch(authActions.logout());
    },
    toggleNav: (showMainNav) => {
      dispatch(UIActions.toggleNav(showMainNav))
    },
    createProject: (name, description, token) => {
      dispatch(projectActions.createProject(name, description, token));
    },
    toggleProjectModal: (showProjectModal) => {
      dispatch(UIActions.toggleProjectModal(showProjectModal))
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

