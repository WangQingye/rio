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
        url: '/products-manage/workings/addOrModify',
        method: 'post',
        data: query
    });
};
export const delPartStep = query => {
    return request({
        url: `/products-manage/remove/workings/${query.stepId}`,
        method: 'delete',
        data: query
    });
};

// 填报价格
export const fillSerialPrice = query => {
    return request({
        url: '/products-manage/fill/price',
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


