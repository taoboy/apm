import { combineReducers } from 'redux';
import theme from './theme';
import user from './user';


const todoApp = combineReducers({
    theme,
    user
});

export default todoApp