import request from '../utils/request';

export const editProduct = query => {
    return request({
        url: '/products-manage/product/addOrModify',
        method: 'post',
        data: query
    });
};
export const getProcessDetailList = query => {
    return request({
        url: '/products-manage/query/products/detail',
        method: 'get',
        params: query
    });
};
export const editPartStep = query => {
    return request({
        url: '/working-manage/working/addOrModify',
        method: 'post',
        data: query
    });
};
export const getSerialNums = query => {
    return request({
        url: '/products-manage/product/list',
        method: 'get',
        params: query
    });
};


