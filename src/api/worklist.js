import request from '../utils/request';

// 完工
export const finishWork = query => {
    return request({
        url: `/work-shop-manage/close`,
        method: 'put',
        data: query
    });
};
// 开工
export const startWork = query => {
    return request({
        url: `/work-shop-manage/start/${query.workId}`,
        method: 'put',
        params: query
    });
};
// 结账
export const payWork = query => {
    return request({
        url: `/work-shop-manage/wage`,
        method: 'put',
        data: query
    });
};
// 预支工资
export const prePayWork = query => {
    return request({
        url: `/work-shop-manage/advance`,
        method: 'put',
        data: query
    });
};