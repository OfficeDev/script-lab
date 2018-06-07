import { createStore, combineReducers } from 'redux';

import selection from './selection';
import solutions from './solutions';
import files from './files';
import users from './users';

const reducer = combineReducers({ selection, solutions, files, users });

export default createStore(reducer);
