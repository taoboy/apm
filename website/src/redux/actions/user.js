/**
 * Created by lenovo on 2017/7/31.
 */
export const USER = {
    LOGIN: "USER_LOGIN",
    LOGOUT: "USER_LOGOUT"
};


export function userLogin(content) {
    return {
        type: USER.LOGIN,
        content
    }
}

export function userLogout() {
    return {
        type: USER.LOGOUT
    }
}