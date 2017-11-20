/*
 * action 类型
 */
export const TOGGLE_THEME_SHADE = "TOGGLE_THEME_SHADE";

/*
 * 其它的常量
 */

export const VisibilityFilters = {
    SHOW_ALL: 'SHOW_ALL',
    SHOW_COMPLETED: 'SHOW_COMPLETED',
    SHOW_ACTIVE: 'SHOW_ACTIVE'
};

/*
 * action 创建函数
 */

export function changeTheme(content) {
    return { type: TOGGLE_THEME_SHADE, content }
}
