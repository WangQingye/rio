import axios from 'axios';
import {
    ElLoading,
    ElMessage
} from 'element-plus'

const service = axios.create({
    // process.env.NODE_ENV === 'development' 来判断是否开发环境
    // easy-mock服务挂了，暂时不使用了
    // baseURL: 'http://162.14.79.68/',
    baseURL: '/serverBackend',
    timeout: 10000
});

let loadingInstance = null
service.interceptors.request.use(
    config => {
        loadingInstance && loadingInstance.close()
        loadingInstance = ElLoading.service({
            background: 'rgba(0,0,0,0.1)'
        })
        for (const key in config.params) {
          if (Object.hasOwnProperty.call(config.params, key)) {
            const element = config.params[key];
            if (element === '') {
              config.params[key] = undefined
            }
          }
        }
        return config;
    },
    error => {
        console.log(error);
        loadingInstance.close()
        return Promise.reject();
    }
);

service.interceptors.response.use(
    response => {
        loadingInstance.close()
        if (response.status === 200) {
            if (typeof response.data === 'string') {
                let jsonData = JSON.parse(response.data)
                if (jsonData.status === 'FAIL') {
                    ElMessage.error(jsonData.msg)
                    localStorage.removeItem('ruiao_user')
                    window.location.reload()
                    return false
                }
                return jsonData
            } else {
                if (response.data.status == 'FAIL') {
                    ElMessage.error(response.data.msg || '服务器错误')
                    throw new Error(response.data.msg || '服务器错误')
                    return false
                    Promise.reject();
                } else {
                    return response.data;
                }
            }
        } else if (response.status === 302) {
            ElMessage.error('登录过期，请重新登录')
            window.location.reload()
        } else {
            Promise.reject();
        }
    },
    error => {
        // ElMessage.error('登录过期，请重新登录')
        // window.location.reload()
        loadingInstance.close()
        console.log(error);
        return Promise.reject();
    }
);

export default service;