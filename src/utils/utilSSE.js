import { Notification } from 'element-ui';
import store from '@/store';
import Cookies from 'js-cookie';
//连接标识 避免重复连接
let isConnect = false;

//source对象
let source = null;

//创建source连接
let createSSE = () => {
    try {
        const userId = '1';
        let path = window.location.href;
        console.log(path);
        path = path.substring(0, path.indexOf('#'));
        console.log(path);
        source = new EventSource(`http://8.141.53.8:8081/api/alert-events/subscribe?id=${userId}`);
        // source = new EventSource(`http://8.141.53.8:8081/api/alert-events/subscribe?id=${userId}`);
        console.log(source);

        initSSE();
    } catch (e) {
        console.log('尝试创建连接失败');
        //如果无法连接上source 那么重新连接！可能会因为服务器重新部署，或者短暂断网等导致无法创建连接
        reConnect();
    }
};


//断线重连后，延迟5秒重新创建source连接  rec用来存储延迟请求的代码
let rec;
//定义重连函数
let reConnect = () => {
    console.log('尝试重新连接');
    //如果已经连上就不在重连了
    if (isConnect) return;
    rec && clearTimeout(rec);
    // 延迟5秒重连  避免过多次过频繁请求重连
    rec = setTimeout(function() {
        createSSE();
    }, 5000);
};

//初始化source连接
let initSSE = () => {
    /**
     * 连接一旦建立，就会触发open事件
     * 另一种写法：source.onopen = function (event) {}
     */
    source.addEventListener(
        'open',
        function(e) {
            console.log('建立连接');
            isConnect = true;
        },
        false
    );

    /**
     * 客户端收到服务器发来的数据
     * 另一种写法：source.onmessage = function (event) {}
     */
    source.addEventListener('message', function(e) {
        console.log('客户端收到服务器发来的数据');

        let mes = JSON.parse(e.data);
        let mesObj = JSON.parse(window.atob(mes.body));
        console.log(mesObj);
        if (store.state.monitoringArr.length >= 20) {
            store.commit('deleteMonitoringArr');
            store.commit('addMonitoringArr', mesObj);
        } else {
            store.commit('addMonitoringArr', mesObj);
        }
    });

    /**
     * 如果发生通信错误（比如连接中断），就会触发error事件
     * 或者：
     * 另一种写法：source.onerror = function (event) {}
     */
    source.addEventListener(
        'error',
        function(e) {
            console.log('关闭连接了。。。');
            isConnect = false;
            if (e.readyState === EventSource.CLOSED) {
                console.log('连接错误');
            } else {
                console.log(e);
            }
        },
        false
    );
};

//心跳设置
// var heartCheck = {
//     //每段时间发送一次心跳包 这里设置为20s
//     timeout: 20000,
//     //延时发送消息对象（启动心跳新建这个对象，收到消息后重置对象）
//     timeoutObj: null,
//     //一段时间后发送心跳包
//     start: function() {
//         this.timeoutObj = setTimeout(function() {
//             if (isConnect) {
//                 source.onopen = function(event) {
//                     console.log('重新创建连接了。。。');
//                 };
//             }
//         }, this.timeout);
//     },
//     //    接收到服务器的信息之后要重置心跳发送的方法
//     reset: function() {
//         clearTimeout(this.timeoutObj);
//         this.start();
//     }
// };

//获得消息之后   区别是心跳还是业务信息  如果是业务信息特殊处理（这里就用Element的notify才处理提醒）
// let getMsg = e => {
//     console.log('message');
//     console.log(e.data);
//     console.log(store.state.monitoringArr);
//     if (e.data != '连接成功' && e.data != checkMsg) {
//         Notification.error({
//             title: '失败',
//             message: e.data,
//             duration: 0,
//             type: 'error'
//         });
//     }
// };

//关闭连接
let closeSSE = () => {
    source.close();
    const httpRequest = new XMLHttpRequest();
    httpRequest.open('GET', `http://8.141.53.8:8081/api/alert-events/close?id=${userId}`, true);
    httpRequest.send();
    console.log('close');
};

export default {
    createSSE: createSSE,
    closeSSE: closeSSE
};
