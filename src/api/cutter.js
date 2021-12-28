import request from '../utils/request';

//刀具添加
export const addCutter = query => {
  return request({
    url: '/cutter-manage/save',
    method: 'post',
    data: query
  });
};

// 删除刀具
export const delCutter = query => {
  return request({
    url: `/cutter-manage/remove/${query.cutterId}`,
    method: 'delete',
    data: query
  });
};

// 采购记录编辑添加
export const editCutterBuyRecord = query => {
  return request({
    url: '/cutter-manage/record/addOrModify',
    method: 'post',
    data: query
  });
};
// 删除采购记录
export const delCutterBuyRecord = query => {
  return request({
    url: `/cutter-manage/record/remove/${query.recordId}`,
    method: 'delete',
    data: query
  });
};

// 领用量具
export const lendCutter = query => {
  return request({
    url: '/cutter-manage/claims/add',
    method: 'post',
    data: query
  });
};
// 归还量具
export const returnCutter = query => {
  return request({
    url: `/cutter-manage/claims/ret`,
    method: 'put',
    data: query
  });
};
// 删除领用记录
export const delCutterLendRecords = query => {
  return request({
    url: `/cutter-manage/claims/remove/${query.recordId}`,
    method: 'delete',
    data: query
  });
};
// 计算领用的刀具的价值
export const calcPrice = query => {
  return request({
    url: `/work-shop-manage/cal-cost`,
    method: 'get',
    params: query
  });
};