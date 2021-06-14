<template>
    <el-dialog :title="`${showVideoObj.ip}实时监控`" width="70%" :visible.sync="showVideoFlag" :before-close="handleVideoDialog">
        <img id="img" width="100%" />
    </el-dialog>
</template>

<script>
import { mapState } from 'vuex';
export default {
    data() {
        return {
            showVideoFlag: true,
            source: null
        };
    },
    props: {
        showVideoObj: {
            type: Object,
            default: () => ({})
        }
    },
    mounted() {
        this.init();
    },
    computed: {
        ...mapState(['userId'])
    },
    methods: {
        init() {
            // 开启订阅，建立长链接
            this.source = new EventSource(`proxy/api/live-stream/subscribe?id=${this.userId}&ip=${this.showVideoObj.ip}&alert=0`);
            // 接受消息
            this.source.onopen = function(event) {
                console.log(event);
                document.getElementById('img').setAttribute('src', event.data);
            };
            this.source.onmessage = function(event) {
                console.log(event);
                document.getElementById('img').setAttribute('src', event.data);
            };
        },
        //关闭视频弹窗查看
        handleVideoDialog() {
            this.source.close();
            // 结束订阅，断开长链接
            const httpRequest = new XMLHttpRequest();
            httpRequest.open('GET', `proxy/api/live-stream/close?id=${this.userId}&ip=${this.showVideoObj.ip}&alert=0`, false);
            // httpRequest.send();

            this.showVideoFlag = false;
            this.$emit('closeVideo');
        }
    }
};
</script>

<style>
.el-dialog {
    display: flex;
    flex-direction: column;
    margin: 0 !important;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-height: calc(100% - 30px);
    max-width: calc(100% - 30px);
}
.el-dialog .el-dialog__body {
    flex: 1;
    overflow: auto;
}
</style>
