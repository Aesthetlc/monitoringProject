<template>
    <!-- 目前实时监控的页面就是调用报警管理这里   唯独不同的是开启状态是开的状态的 -->
    <alertShow :type="type"></alertShow>
</template>

<script>
import alertShow from '@/views/page/alertShow';
export default {
    name: 'realTimeMonitoring',
    data() {
        return {
          type:'realTimeMonitoring'
        };
    },
    components: {
        alertShow
    }
};
</script>

<style></style>
