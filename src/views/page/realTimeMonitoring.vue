<template>
    <!-- 目前实时监控的页面就是调用报警管理这里   唯独不同的是开启状态是开的状态的 -->
    <alarmManagement :type="type"></alarmManagement>
</template>

<script>
import alarmManagement from '@/views/page/alarmManagement';
export default {
    name: 'realTimeMonitoring',
    data() {
        return {
          type:'realTimeMonitoring'
        };
    },
    components: {
        alarmManagement
    }
};
</script>

<style></style>
