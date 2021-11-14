import request from '../utils/request';

// 获取工具种类
export const getToolType = query => {
  return request({
    url: '/tool-manage/tool/list',
    method: 'get',
    params: query
  });
};

// 工具种类添加
export const addToolType = query => {
  return request({
    url: '/tool-manage/tool/addOrModify',
    method: 'post',
    data: query
  });
};
// 工具种类删除
export const delToolType = query => {
  return request({
    url: `/tool-manage/tool/remove/${query.toolId}`,
    method: 'delete',
    data: query
  });
};


// 添加编辑某种工具
export const editTool = query => {
  return request({
    url: '/tool-manage/tool/all/addOrModify',
    method: 'post',
    data: query
  });
};

// 删除某种工具
export const delTool = query => {
  return request({
    url: `/tool-manage/remove/tool/${query.toolId}`,
    method: 'delete',
    data: query
  });
};
// 采购记录编辑添加
export const editToolBuyRecord = query => {
  return request({
    url: '/tool-manage/record/addOrModify',
    method: 'post',
    data: query
  });
};



// 删除采购记录
export const delToolBuyRecord = query => {
  return request({
    url: `/tool-manage/record/remove/${query.recordId}`,
    method: 'delete',
    data: query
  });
};

// 领用量具
export const lendTool = query => {
  return request({
    url: '/tool-manage/tool/record/add',
    method: 'post',
    data: query
  });
};
// 归还量具
export const returnTool = query => {
  return request({
    url: `/tool-manage/tool/claim/ret`,
    method: 'put',
    params: query
  });
};
// 删除领用记录
export const delToolLendRecords = query => {
  return request({
    url: `/tool-manage/tool/record/${query.recordId}`,
    method: 'delete',
    data: query
  });
};