import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';

import auth from "./reducers/auth.reducer";
import story from "./reducers/story.reducer";
import project from "./reducers/project.reducer";

const loggerMiddleware = createLogger();

export default createStore(combineReducers({auth, story, project}), {}, applyMiddleware(thunkMiddleware, loggerMiddleware));