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
            component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
            children: [
                {
                    name: '首页',
                    path: '',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../views/page/dashboard.vue'),
                    meta: { title: '首页' }
                },
                {
                    name: '实时监控',
                    path: 'realTimeMonitoring',
                    component: () => import(/* webpackChunkName: "table" */ '../views/page/realTimeMonitoring.vue'),
                    meta: { title: '实时监控' }
                },
                {
                    name: '报警管理',
                    path: 'alarmManagement',
                    component: () => import(/* webpackChunkName: "table" */ '../views/page/alarmManagement'),
                    meta: { title: '报警管理' }
                },
                {
                    name: '报警统计',
                    path: 'policeStatistics',
                    component: () => import(/* webpackChunkName: "table" */ '../views/page/policeStatistics.vue'),
                    meta: { title: '报警统计' }
                },
                {
                    name: '摄像头管理',
                    path: 'cameraManagement',
                    component: () => import(/* webpackChunkName: "table" */ '../views/page/cameraManagement'),
                    meta: { title: '摄像头管理' }
                },
                {
                    name: '用户管理',
                    path: 'userManagement',
                    component: () => import(/* webpackChunkName: "table" */ '../views/page/userManagement'),
                    meta: { title: '用户管理' }
                },
                {
                    path: '404',
                    component: () => import(/* webpackChunkName: "404" */ '../views/page/404.vue'),
                    meta: { title: '404' }
                },
                {
                    path: '403',
                    component: () => import(/* webpackChunkName: "403" */ '../views/page/403.vue'),
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
            path: '*',
            redirect: '/404'
        }
    ]
});
