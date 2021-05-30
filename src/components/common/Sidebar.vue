<template>
    <div class="sidebar">
        <el-menu
            class="sidebar-el-menu"
            :default-active="onRoutes"
            :collapse="collapse"
            background-color="#324157"
            text-color="#bfcbd9"
            active-text-color="#20a0ff"
            unique-opened
            router
        >
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i :class="item.icon"></i>
                            <span slot="title">{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                                <template slot="title">{{ subItem.title }}</template>
                                <el-menu-item
                                    v-if="item.meta.role.includes(userRole)"
                                    v-for="(threeItem, i) in subItem.subs"
                                    :key="i"
                                    :index="threeItem.index"
                                    >{{ threeItem.title }}</el-menu-item
                                >
                            </el-submenu>
                            <el-menu-item v-else :index="subItem.index" :key="subItem.index">{{ subItem.title }}</el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item v-if="item.meta.role.includes(userRole)" :index="item.index" :key="item.index">
                        <i :class="item.icon"></i>
                        <span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
import bus from '@/components/common/bus';
import { mapState } from 'vuex';
export default {
    data() {
        return {
            collapse: false,
            items: [
                {
                    icon: 'el-icon-lx-home',
                    index: '/home',
                    title: '系统首页',
                    meta: {
                        role: ['admin', 'user']
                    }
                },
                {
                    icon: 'el-icon-lx-cascades',
                    index: '/home/realTimeMonitoring',
                    title: '实时监控',
                    meta: {
                        role: ['admin', 'user']
                    }
                },
                {
                    icon: 'el-icon-lx-cascades',
                    index: '/home/alarmManagement',
                    title: '报警管理',
                    meta: {
                        role: ['admin', 'user']
                    }
                },
                {
                    icon: 'el-icon-lx-cascades',
                    index: '/home/policeStatistics',
                    title: '报警统计',
                    meta: {
                        role: ['admin', 'user']
                    }
                },
                {
                    icon: 'el-icon-lx-cascades',
                    index: '/home/cameraManagement',
                    title: '摄像头管理',
                    meta: {
                        role: ['admin', 'user']
                    }
                },
                {
                    icon: 'el-icon-lx-cascades',
                    index: '/home/monitoringShow',
                    title: '监控查看',
                    meta: {
                        role: ['admin', 'user']
                    }
                },
                {
                    icon: 'el-icon-lx-cascades',
                    index: '/home/userManagement',
                    title: '用户管理',
                    meta: {
                        role: ['admin']
                    }
                }
            ]
        };
    },
    computed: {
        onRoutes() {
            return this.$route.path;
        },
        ...mapState(['userRole'])
    },
    created() {
        // 通过 Event Bus 进行组件间通信，来折叠侧边栏
        bus.$on('collapse', msg => {
            this.collapse = msg;
            bus.$emit('collapse-content', msg);
        });
    }
};
</script>

<style scoped>
.sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom: 0;
    overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
    width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
    width: 250px;
}
.sidebar > ul {
    height: 100%;
}
</style>
