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
        changeCollapse(state, val) {
            state.isCollapse = !state.isCollapse;
        },
        //添加预警信息
        addMonitoringArr(state, params) {
            Notification({
                title: '成功',
                message: '这是一条成功的提示消息' + Math.random(),
                type: 'success'
            });
            state.monitoringArr.unshift(params);
            Cookies.set('monitoringArr', JSON.stringify(params));
        },
        //删除最后一个预警信息
        deleteMonitoringArr(state, params) {
            state.monitoringArr.pop();
            Cookies.set('monitoringArr', JSON.stringify(params));
        },
        //从session取到值直接赋值给预警信息
        updateMonitoringArr(state, params) {
            state.monitoringArr = params;
        }
    }
});

export default store;
