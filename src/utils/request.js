import axios from 'axios';
import Vue from 'vue';
import { Message } from 'element-ui';
axios.defaults.timeout = 90000;

let loading = null; //定义loading变量
let needLoadingRequestCount = 0; //声明一个变量

//开始 加载loading
function startLoading() {
    loading = Vue.prototype.$loading({
        lock: true,
        text: '加载中……',
        background: 'rgba(0, 0, 0, 0.7)',
        target: document.querySelector('.loading-area')
    });
}
//结束 取消loading加载
function endLoading() {
    loading.close();
}

function showFullScreenLoading() {
    if (needLoadingRequestCount === 0) {
        //当等于0时证明第一次请求 这时开启loading
        startLoading();
    }
    needLoadingRequestCount++; //全局变量值++
}

function hideFullScreenLoading() {
    if (needLoadingRequestCount <= 0) return; //小于等于0 证明没有开启loading 此时return
    needLoadingRequestCount--; //正常响应后 全局变量 --
    if (needLoadingRequestCount === 0) {
        //等于0 时证明全部加载完毕 此时结束loading 加载
        endLoading();
    }
}

axios.interceptors.request.use(
    config => {
        //开启loading加载
        showFullScreenLoading();
        return config;
    },
    error => {
        console.log(error);
        hideFullScreenLoading();
        return Promise.reject();
    }
);

axios.interceptors.response.use(
    response => {
        if (response.status === 200) {
            //关闭loading加载
            hideFullScreenLoading();
            return response.data;
        } else {
            Promise.reject();
        }
    },
    error => {
        console.log(error);
        let status = error.response.status; // 获取失败的状态码
        let message = '未知错误';
        switch (status) {
            case 400:
                message = '请求参数错误';
                break;
            case 403:
                message = '403 refresh_token未携带或已过期';
                break;
            case 507:
                message = '服务器数据库异常';
                break;
            case 401:
                message = 'token过期或未出';
                break;
            case 404:
                message = '404未找到请联系管理员！';
                break;
            case 500:
                message = '服务器异常，请联系管理管！';
                break;
            default:
                break;
        }
        Message({
            message: message,
            type: 'warning'
        });
        hideFullScreenLoading();
        return Promise.reject();
    }
);

export default axios;
