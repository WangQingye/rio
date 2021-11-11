import request from '../utils/request';

export const editProduct = query => {
    return request({
        url: '/products-manage/product/addOrModify',
        method: 'post',
        data: query
    });
};
export const delProduct = query => {
    return request({
        url: `/products-manage/remove/workings/${query.stepId}`,
        method: 'delete',
        data: query
    });
};
// 工序进展
export const getProcessDetailList = query => {
    return request({
        url: '/products-manage/query/products/detail',
        method: 'get',
        params: query
    });
};

// 工序信息填报
export const editWorkingStep = query => {
    return request({
        url: '/products-manage/fill/workings/detail',
        method: 'post',
        data: query
    });
};

// 零件步骤编辑
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


