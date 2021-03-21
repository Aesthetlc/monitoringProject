import Vue from 'vue';
import Vuex from 'vuex';
import { Notification } from 'element-ui';
import Cookies from 'js-cookie';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        // monitoringArr: window.sessionStorage.getItem('monitoringArr') || [],
        monitoringArr: Cookies.get('monitoringArr') || [],
        isCollapse: false
    },
    mutations: {
        changeCollapse(state) {
            state.isCollapse = !state.isCollapse;
        },
        //添加预警信息
        addMonitoringArr(state, params) {
            Notification({
                title: params.camera,
                message: params.describe,
                type: 'success'
            });
            const audio = document.getElementById('audio');
            // 从头播放
            audio.currentTime = 0;
            audio.play();
            // console.log('这里报错了',state.monitoringArr);
            state.monitoringArr.unshift(params);
            Cookies.set('monitoringArr', JSON.stringify(state.monitoringArr));
        },
        //删除最后一个预警信息
        deleteMonitoringArr(state) {
            state.monitoringArr.pop();
            Cookies.set('monitoringArr', JSON.stringify(state.monitoringArr));
        },
        //monitoringArr置空数组
        emptyMonitoringArr(state) {
            state.monitoringArr = [];
            Cookies.remove('monitoringArr');
        },
        //从session取到值直接赋值给预警信息
        updateMonitoringArr(state, params) {
            state.monitoringArr = params;
        }
    }
});

export default store;
