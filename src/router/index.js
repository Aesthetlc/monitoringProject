import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/index'
        },
        {
            path: '/',
            component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
            meta: { title: '自述文件' },
            children: [
                {
                    name:'首页',
                    path: '/index',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/index.vue'),
                    meta: { title: '首页' },
                },
                {
                    name:'实时监控',
                    path: '/realTimeMonitoring',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/realTimeMonitoring.vue'),
                    meta: { title: '实时监控' }
                },
                {
                    name:'报警管理',
                    path: '/alarmManagement',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/alarmManagement.vue'),
                    meta: { title: '报警管理' }
                },
                {
                    name:'报警统计',
                    path: '/policeStatistics',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/policeStatistics.vue'),
                    meta: { title: '报警统计' }
                },
                {
                    path: '/404',
                    component: () => import(/* webpackChunkName: "404" */ '../components/page/404.vue'),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: () => import(/* webpackChunkName: "403" */ '../components/page/403.vue'),
                    meta: { title: '403' }
                }
            ]
        },
        {
            path: '/login',
            component: () => import(/* webpackChunkName: "login" */ '../components/page/Login.vue'),
            meta: { title: '登录' }
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
});
