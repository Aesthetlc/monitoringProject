<template>
    <div id="app">
        <audio id="audio" preload="auto">
            <source src="@/assets/audio/warn.mp3" />
        </audio>
        <router-view></router-view>
    </div>
</template>
<script>
import { mapMutations, mapState } from 'vuex';
import Cookies from 'js-cookie';
export default {
    computed: {
        ...mapState(['monitoringArr', 'userId'])
    },
    methods: {
        ...mapMutations(['addMonitoringArr', 'updateMonitoringArr', 'setUserId', 'setRefreshBlank', 'setMuteInterval', 'setUserRole'])
    },
    created() {
        if (Cookies.get('sseFlag') != undefined) {
            this.createSSE();
        }
        // 刷新userId重新给vuex赋值
        if (Cookies.get('userId') != undefined) {
            this.setUserId(Cookies.get('userId'));
        }
        // 刷新userRole重新给vuex赋值
        if (Cookies.get('userRole') != undefined) {
            this.setUserRole(Cookies.get('userRole'));
        }
        // 重新获取静音时间段
        if (Cookies.get('muteStartTime') != undefined || Cookies.get('muteEndTime') != undefined) {
            let obj = {
                mute_start_time: Cookies.get('muteStartTime'),
                mute_end_time: Cookies.get('muteEndTime')
            };
            this.setMuteInterval(obj);
        }
        // 重新获取刷新时间间隔
        if (Cookies.get('refreshTime') != undefined) {
            this.setRefreshBlank(Cookies.get('refreshTime'));
        }
        //在页面加载时读取sessionStorage里的状态信息
        // if (window.sessionStorage.getItem('monitoringArr')) {
        if (Cookies.get('monitoringArr')) {
            // this.updateMonitoringArr(JSON.parse(window.sessionStorage.getItem('monitoringArr')));
            this.updateMonitoringArr(JSON.parse(Cookies.get('monitoringArr')));
        }

        //在页面刷新时将vuex里的信息保存到sessionStorage里
        window.addEventListener('beforeunload', () => {
            // sessionStorage.setItem('monitoringArr', JSON.stringify(this.monitoringArr));
            Cookies.set('monitoringArr', JSON.stringify(this.monitoringArr));
        });
    }
};
</script>
<style>
@import './assets/css/main.css';
@import './assets/css/color-dark.css'; /*深色主题*/
/*@import "./assets/css/theme-green/color-green.css";   浅绿色主题*/
</style>
