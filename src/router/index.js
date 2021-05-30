import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/home'
        },
        {
            path: '/home',
            component: () => import('../components/common/Home.vue'),
            children: [
                {
                    name: '首页',
                    path: '',
                    component: () => import('../views/page/dashboard.vue'),
                    meta: { title: '首页', role: ['admin', 'user'] }
                },
                {
                    name: '实时监控',
                    path: 'realTimeMonitoring',
                    component: () => import('../views/page/realTimeMonitoring.vue'),
                    meta: { title: '实时监控', role: ['admin', 'user'] }
                },
                {
                    name: '报警管理',
                    path: 'alarmManagement',
                    component: () => import('../views/page/alarmManagement'),
                    meta: { title: '报警管理', role: ['admin', 'user'] }
                },
                {
                    name: '报警统计',
                    path: 'policeStatistics',
                    component: () => import('../views/page/policeStatistics.vue'),
                    meta: { title: '报警统计', role: ['admin', 'user'] }
                },
                {
                    name: '摄像头管理',
                    path: 'cameraManagement',
                    component: () => import('../views/page/cameraManagement'),
                    meta: { title: '摄像头管理', role: ['admin', 'user'] }
                },
                {
                    name: '用户管理',
                    path: 'userManagement',
                    component: () => import('../views/page/userManagement'),
                    meta: { title: '用户管理', role: ['admin'] }
                },
                {
                    name: '监控查看',
                    path: 'monitoringShow',
                    component: () => import('../views/page/monitoringShow'),
                    meta: { title: '监控查看', role: ['admin', 'user'] }
                },
                {
                    path: '404',
                    component: () => import('../views/page/404.vue'),
                    meta: { title: '404' }
                },
                {
                    path: '403',
                    component: () => import('../views/page/403.vue'),
                    meta: { title: '403' }
                }
            ]
        },
        {
            path: '/login',
            component: () => import(/* webpackChunkName: "login" */ '../views/page/Login.vue'),
            meta: { title: '登录' }
        },
        {
            path: '/403',
            component: () => import('../views/page/403.vue'),
            meta: { title: '403' }
        },
        {
            path: '*',
            component: () => import('../views/page/404.vue'),
            meta: { title: '404' }
        }
    ]
});
