/**
 * Created by lenovo on 2017/7/31.
 */

import {BROWSERDASH} from '../actions/browserdash'

export default function(state = {}, action) {
    switch (action.type) {
        case BROWSERDASH.RENDERSUCCESS:
            return {
                ...state,
                ...action.content
            };
            break;
        case BROWSERDASH.RENDERFAIL:
            state = {};
            return state;
            break;
        default:
            return state;
    }
}