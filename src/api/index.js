import request from '../utils/request';

export const fetchData = query => {
    return request({
        url: './table.json',
        method: 'get',
        params: query
    });
};
export const getList = (url,query) => {
    return request({
        url: url,
        method: 'get',
        params: query
    });
};
