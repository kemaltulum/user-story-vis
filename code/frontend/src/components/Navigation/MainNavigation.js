import React, {Component} from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';

import { authActions } from '../../actions/auth.actions';
import { projectActions } from '../../actions/project.actions';

import './MainNavigation.css';

// #8948FC

class MainNavigation extends Component {
  render(){
    return (
      <header className="main-navigation">
        <div className="project-links">
          <h2>Projects</h2>
          {
            this.props.projects.map(project => {
              return (
                <NavLink key={project._id} to={"/" + project._id + "/stories"}>
                  <div>
                    <div className="project-links__circle" title={project.name}>
                      {project.name.toUpperCase().substring(0, 3)}
                    </div>
                  </div>
                </NavLink>
              )
            })
          }
          <NavLink to={"/projects"}>
            <div>
              <div className="project-links__circle project-links__add" title="Add New Project">
                +
              </div>
            </div>
          </NavLink>
        </div>

        <nav className="main-navigation__items">
        <div className="main-navigation__logo">
          <h1>AgileStory</h1>
        </div>
          <div>
            <ul>
              {this.props.token && (
                <React.Fragment>
                  <li>
                    <NavLink to="/projects">Projects</NavLink>
                  </li>
                </React.Fragment>
              )}
            </ul>
            <div className="main-navigation__logout" onClick={() => this.props.logout()}>Logout</div>
          </div>
        </nav>
      </header>
    );
  }
}



function mapStateToProps(state) {
  const { token, userId } = state.auth;
  const { projects } = state.project;
  return {
    token,
    userId,
    projects
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getProjects: (token) => {
      dispatch(projectActions.getProjects(token));
    },
    logout: () => {
      dispatch(authActions.logout());
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MainNavigation);
