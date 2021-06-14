import Vue from 'vue';
import Vuex from 'vuex';
import { Notification } from 'element-ui';
import Cookies from 'js-cookie';
import axios from '../utils/request';
import utils from '@/utils/util.js';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        // monitoringArr: window.sessionStorage.getItem('monitoringArr') || [],
        monitoringArr: Cookies.get('monitoringArr') || [],
        isCollapse: false,
        // 用户id
        userId: '',
        // 用户角色
        userRole: '',
        // 静音时间段开启时间
        muteStartTime: '',
        // 静音时间段结束时间
        muteEndTime: '',
        // 请求时间间隔
        refreshBlank: '',
        // 监控查看
        ipArr: [
            { id: 1, ip: '10.221.170.1', showFlag: false },
            { id: 2, ip: '10.221.170.2', showFlag: false },
            { id: 3, ip: '10.221.170.4', showFlag: false },
            { id: 4, ip: '10.221.170.5', showFlag: false },
            { id: 5, ip: '10.221.170.6', showFlag: false },
            { id: 6, ip: '10.221.170.7', showFlag: false },
            { id: 7, ip: '10.221.170.8', showFlag: false }
        ],
        sourceObj: {}
    },
    mutations: {
        changeCollapse(state) {
            state.isCollapse = !state.isCollapse;
        },
        //设置userId
        setUserId(state, params) {
            state.userId = params;
            Cookies.set('userId', params);
        },
        //设置用户角色
        setUserRole(state, params) {
            state.userRole = params;
            Cookies.set('userRole', params);
        },
        //获取静音时间段
        setMuteInterval(state, params) {
            state.muteStartTime = params.mute_start_time;
            state.muteEndTime = params.mute_end_time;
            Cookies.set('muteStartTime', params.mute_start_time);
            Cookies.set('muteEndTime', params.mute_end_time);
        },
        //获取刷新时间
        setRefreshBlank(state, params) {
            state.refreshBlank = params;
            Cookies.set('refreshTime', params);
        },
        //添加预警信息
        addMonitoringArr(state, params) {
            Notification.error({
                title: params.describe,
                message: params.ip + ' --- ' + params.location
            });
            // 组装对比时间  例如：2021/03/07  +   时分秒
            let sTime = new Date(utils.getNowTimeNoHour() + ' ' + state.muteStartTime);
            let eTime = new Date(utils.getNowTimeNoHour() + ' ' + state.muteEndTime);
            // 获取现在时间
            var nowTime = new Date();

            if (state.muteEndTime.substring(0, 2) > state.muteStartTime.substring(0, 2)) {
                if (nowTime.getTime() > eTime.getTime() || nowTime.getTime() < sTime.getTime()) {
                    const audio = document.getElementById('audio');
                    // 从头播放
                    audio.currentTime = 0;
                    audio.play();
                }
            }

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
        },
        //从cookie中取到的ipArr赋值到vuex中
        getMonitoringArr(state, params) {
            state.ipArr = params;
        },
        //修改监控查看ipArr 的showFlag 控制视频的开关
        updateMonitoringIpArr(state, params) {
            state.ipArr.forEach(it => {
                if (it.id == params.id) {
                    it.showFlag = !params.showFlag;
                }
            });
        },
        updateSourceObj(state, params) {
            state.sourceObj[params.source] = params.val;
        },
        getSourceObj(state, params) {
            state.sourceObj = params;
        },
    },
    actions: {
        //获取静音时间段
        getMuteInterval(context) {
            return new Promise(resolve => {
                axios({
                    method: 'post',
                    url: 'proxy/api/alert-events-settings/getMuteInterval',
                    data: {
                        userId: context.state.userId
                    }
                }).then(res => {
                    context.commit('setMuteInterval', res.detail);
                    resolve(res);
                });
            });
        },
        //获取刷新时间
        getRefreshBlank(context) {
            return new Promise(resolve => {
                axios({
                    method: 'post',
                    url: 'proxy/api/alert-events-settings/getRefreshBlank',
                    data: {
                        userId: context.state.userId
                    }
                }).then(res => {
                    // 请求间隔默认前端给了一个60秒
                    res.detail = res.detail == 0 ? 60 : res.detail;
                    context.commit('setRefreshBlank', res.detail);
                    resolve(res);
                });
            });
        }
    }
});

export default store;
