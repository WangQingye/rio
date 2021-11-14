import request from '../utils/request';

// 完工
export const finishWork = query => {
    return request({
        url: `/work-shop-manage/close/${query.workId}`,
        method: 'put',
        params: query
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