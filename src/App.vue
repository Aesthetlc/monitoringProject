<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>
<script>
import { mapMutations } from 'vuex';
import { mapState } from 'vuex';
import Cookies from 'js-cookie';
export default {
    computed: {
        ...mapState(['monitoringArr'])
    },
    methods: {
        ...mapMutations(['addMonitoringArr', 'updateMonitoringArr'])
    },
    created() {
        console.log('app',Cookies.get('sseFlag') != undefined,Cookies.get('sseFlag'));
        if (Cookies.get('sseFlag') != undefined) {
            console.log(Cookies.get('sseFlag'), '---------------------');
            this.createSSE();
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
