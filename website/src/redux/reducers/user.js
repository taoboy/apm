/**
 * Created by lenovo on 2017/7/31.
 */

import {USER} from '../actions/user'

export default function(state = {}, action) {
    switch (action.type) {
        case USER.LOGIN:
            return {
                ...state,
                //isLogin: action.content.isLogin,
                //username: action.content.username
                ...action.content
            };
            break;
        case USER.LOGOUT:
            state = {};
            return state;
            break;
        default:
            return state;
    }
}