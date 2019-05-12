import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';

import { authActions } from '../../actions/auth.actions';
import { projectActions } from '../../actions/project.actions';

import { withRouter } from 'react-router-dom';

import './MainNavigation.css';

// #8948FC

class MainNavigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: null,
      projectID: this.props.location.pathname.substr(1, this.props.location.pathname.lastIndexOf("/") - 1)
    }
  }
  componentDidMount() {
    this.props.getProjects(this.props.token);
  }
  componentDidUpdate(prevProps) {
    if (this.props !== prevProps) {
      this.props.projects.forEach(element => {
        if (element._id === this.state.projectID) {
          this.setState({
            current: element
          })
        }
      });
    }

  }
  render() {
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
            <div className="main-navigation__title">
              <h3>
                Project
              </h3>
            </div>
            <div className="main-navigation__current-project">
              <h2>
                {this.state.current && this.state.current.name}
              </h2>
            </div>
            <div className="main-navigation__title">
              <h3>
                Stories
              </h3>
            </div>
            <ul>
              {this.state.projectID && (
                <React.Fragment>
                  <li>
                    <NavLink to={"/" + this.state.projectID + "/stories"}>Card View</NavLink>
                  </li>
                </React.Fragment>
              )}
            </ul>
            <div className="main-navigation__title">
              <h3>
                Visualize
              </h3>
            </div>
            <ul>
              {this.state.projectID && (
                <React.Fragment>
                  <li>
                    <NavLink to={"/" + this.state.projectID + "/visualize?type=story-tree"}>Story Tree</NavLink>
                  </li>
                  <li>
                    <NavLink to={"/" + this.state.projectID + "/visualize?type=actor-tree"}>Actor Tree</NavLink>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MainNavigation));
