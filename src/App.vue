<template>
    <div id="app">
        <audio id="audio" preload="auto">
            <source src="@/assets/audio/warn.mp3" />
        </audio>
        <router-view></router-view>
    </div>
</template>
<script>
import { mapMutations, mapState, mapActions } from 'vuex';
import Cookies from 'js-cookie';
export default {
    data() {
        return {
            beforeUnloadTime: '',
            gapTime: ''
        };
    },
    computed: {
        ...mapState(['monitoringArr', 'userId', 'ipArr', 'sourceObj'])
    },
    methods: {
        ...mapMutations([
            'addMonitoringArr',
            'updateMonitoringArr',
            'setUserId',
            'setRefreshBlank',
            'setMuteInterval',
            'setUserRole',
            'getMonitoringArr',
            'getSourceObj',
            'updateSourceObj'
        ]),
        ...mapActions(['getMonitoringImg']),
        beforeunloadHandler() {
            this.beforeUnloadTime = new Date().getTime();
        },
        unloadHandler(e) {
            this.gapTime = new Date().getTime() - this.beforeUnloadTime;
            //判断是窗口关闭还是刷新
            if (this.gapTime <= 5) {
                this.closeSSE(this.userId);
                this.ipArr.forEach(item => {
                    if (item.showFlag) {
                        let source = 'source' + item.id;
                        this.sourceObj[source].close();
                        // 结束订阅，断开长链接
                        const httpRequest = new XMLHttpRequest();
                        httpRequest.open('GET', `proxy/api/live-stream/close?id=${this.userId}&ip=${item.ip}&alert=1`, false);
                        // 更新vuex里面的ipArr
                        this.updateMonitoringIpArr(item);
                        Cookies.set('monitoringIpArr', JSON.stringify(this.ipArr));
                    }
                });
            } else {
                Cookies.set('monitoringArr', JSON.stringify(this.monitoringArr));
            }
        }
    },
    mounted() {
        window.addEventListener('beforeunload', e => this.beforeunloadHandler(e));
        window.addEventListener('unload', e => this.unloadHandler(e));
    },
    destroyed() {
        window.removeEventListener('beforeunload', e => this.beforeunloadHandler(e));
        window.removeEventListener('unload', e => this.unloadHandler(e));
    },
    created() {
        // 监控sourceObj
        if (Cookies.get('sourceObj') != undefined) {
            let sourceObj = Cookies.get('sourceObj');
            this.getSourceObj(JSON.parse(sourceObj));
        }

        // 刷新userId重新给vuex赋值
        if (Cookies.get('userId') != undefined) {
            this.setUserId(Cookies.get('userId'));
        }

        // 监控查看ipArr数据重新赋值
        if (Cookies.get('monitoringIpArr') != undefined) {
            let monitoringIpArr = Cookies.get('monitoringIpArr');
            this.getMonitoringArr(JSON.parse(monitoringIpArr));
            this.ipArr.forEach(item => {
                if (item.showFlag) {
                    let source = 'source' + item.id;
                    let val = new EventSource(`proxy/api/live-stream/subscribe?id=${this.userId}&ip=${item.ip}&alert=1`);
                    this.updateSourceObj({ source, val });
                    this.sourceObj[source].onmessage = function(event) {
                        console.log('刷新的长连接', event);
                        document.getElementById(item.id).setAttribute('src', event.data);
                        document.getElementById('img' + item.id).style.display = 'none';
                        document.getElementById(item.id).style.display = 'block';
                        let parent = document.getElementsByClassName('fatherBoxContent')[0];
                        parent.getElementsByTagName('div')[0].className = 'boxContent';
                    };
                }
            });
        }
        if (Cookies.get('sseFlag') != undefined) {
            this.createSSE(Cookies.get('userId'));
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

        if (Cookies.get('monitoringArr')) {
            this.updateMonitoringArr(JSON.parse(Cookies.get('monitoringArr')));
        }

        //在页面刷新时将vuex里的信息保存到sessionStorage里
        window.addEventListener('beforeunload', () => {
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
