/**
 * Created by lenovo on 2017/7/31.
 */
import {TOGGLE_THEME_SHADE} from '../actions/theme'

export default function(state = {
    dark: false
}, action) {
    switch (action.type) {
        case TOGGLE_THEME_SHADE:
            return {
                ...state,
                dark: !state.dark,
            };
            break;
        default:
            return state
    }
}