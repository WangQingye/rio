import request from '../utils/request';

export const editMesure = query => {
    return request({
        url: '/measures-manage/saveOrModify',
        method: 'post',
        data: query
    });
};
export const delMesure = query => {
    return request({
        url: `/measures-manage/remove/${query.mesureId}`,
        method: 'delete',
        data: query
    });
};

// 领用量具
export const lendMesure = query => {
    return request({
        url: '/measures-manage/claims/add',
        method: 'post',
        data: query
    });
};
// 归还量具
export const returnMesure = query => {
    return request({
        url: `/measures-manage/claims/ret`,
        method: 'put',
        params: query
    });
};
// 删除领用记录
export const delMesureLendRecords = query => {
    return request({
        url: `/measures-manage/claims/remove/${query.recordId}`,
        method: 'delete',
        data: query
    });
};


