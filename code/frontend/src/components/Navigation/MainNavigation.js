import React from 'react';
import { NavLink } from 'react-router-dom';

import './MainNavigation.css';

const mainNavigation = props => (
  <header className="main-navigation">
    <div className="main-navigation__logo">
      <h1>AgileStory</h1>
    </div>
    <nav className="main-navigation__items">
      <ul>
        {props.token && (
          <React.Fragment>
            <li>
              <NavLink to="/projects">Projects</NavLink>
            </li>
            <li>
              <button onClick={() => props.logout()}>Logout</button>
            </li>
          </React.Fragment>
        )}
      </ul>
    </nav>
  </header>
);


export default mainNavigation;
