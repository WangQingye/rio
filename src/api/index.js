import request from '../utils/request';

export const getList = (url, query) => {
    return request({
        url: url,
        method: 'get',
        params: query
    });
};
export const getExcel = (url, query) => {
    request({
        url: url + '/export',
        method: 'post',
        data: query,
        responseType: 'blob'
    }).then(res => {
        console.log(res)
        var blob = new Blob([res], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
        }); //application/vnd.openxmlformats-officedocument.spreadsheetml.sheet这里表示xlsx类型
        var downloadElement = document.createElement('a');
        var href = window.URL.createObjectURL(blob); //创建下载的链接
        downloadElement.href = href;
        downloadElement.download = '列表.xlsx'; //下载后文件名
        document.body.appendChild(downloadElement);
        downloadElement.click(); //点击下载
        document.body.removeChild(downloadElement); //下载完成移除元素
        window.URL.revokeObjectURL(href); //释放掉blob对象 
    })
};