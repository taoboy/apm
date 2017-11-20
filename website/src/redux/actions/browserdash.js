/**
 * Created by lenovo on 2017/7/31.
 */
export const BROWSERDASH = {
    RENDERSUCCESS: "BROWSERDASH_RENDERSUCCESS",
    RENDERFAIL: "BROWSERDASH_RENDERFAIL"
};

//action creator
export function browserdashRendersuccess(content) {
    return {
        type: BROWSERDASH.RENDERSUCCESS,
        content
    }
}

export function browserdashRenderfail() {
    return {
        type: BROWSERDASH.RENDERFAIL
    }
}