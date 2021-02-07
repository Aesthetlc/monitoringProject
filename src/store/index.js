import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        monitoringArr: window.sessionStorage.getItem('monitoringArr') || [],
        isCollapse: false
    },
    mutations: {
        changeCollapse(state, val) {
            state.isCollapse = !state.isCollapse;
        },
        //添加预警信息
        addMonitoringArr(state, params) {
            state.monitoringArr.push(params);
            window.sessionStorage.setItem('monitoringArr', JSON.stringify(params));
        },
        //从session取到值直接赋值给预警信息
        updateMonitoringArr(state, params) {
            state.monitoringArr = params;
        }
    }
});

export default store;
