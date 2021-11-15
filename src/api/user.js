import request from '../utils/request';

export const login = query => {
    return request({
        url: `/tool-manage/login?username=${query.username}&password=${query.password}`,
        method: 'post',
        data: query
    });
};
export const logOut = query => {
    return request({
        url: `/tool-manage/logout`,
        method: 'post',
        data: query
    });
};
export const getUserList = query => {
    return request({
        url: '/rui_ao/users',
        method: 'get',
        params: query
    });
};
export const getRoleList = query => {
    return request({
        url: '/rui_ao/find/roles',
        method: 'get',
        params: query
    });
};
export const editUser = query => {
    return request({
        url: '/rui_ao/add_or_edit/user',
        method: 'post',
        data: query
    });
};

// 删除用户
export const delUser = query => {
    return request({
        url: `/rui_ao/users/${query.userId}`,
        method: 'delete',
        params: query
    });
};
export const editPassword = query => {
    return request({
        url: '/rui_ao/user/pwd',
        method: 'put',
        data: query
    });
};
