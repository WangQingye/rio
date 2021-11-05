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
        method: 'del',
        data: query
    });
};



