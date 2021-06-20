<template>
    <div class="monitoringContent">
        <el-card v-for="item in ipArr" :key="item.id" class="box-card">
            <div slot="header" class="clearfix">
                <span>IP:{{ item.ip }}</span>
                <el-button @click="showVideo(item)" style="float: right; padding: 3px 0;fontSize:18px" type="text">{{
                    item.showFlag ? '关闭视频' : '查看视频'
                }}</el-button>
            </div>
            <div class="fatherBoxContent">
                <div class="boxIconContent">
                    <em :id="'img' + item.id" style="fontSize:50px;" class="el-icon-video-camera-solid"></em>
                    <img :id="item.id" style="height:100%;width:100%" />
                </div>
            </div>
        </el-card>
    </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import Cookies from 'js-cookie';
export default {
    name: 'monitoringShow',
    data() {
        return {};
    },
    mounted() {
        this.ipArr.forEach(item => {
            if (item.showFlag == false) {
                document.getElementById(item.id).style.display = 'none';
            }
        });
    },
    computed: {
        ...mapState(['userId', 'ipArr', 'sourceObj'])
    },
    methods: {
        ...mapMutations(['updateMonitoringIpArr', 'updateSourceObj']),
        showVideo(item) {
            let source = 'source' + item.id;
            if (item.showFlag == false) {
                let val = new EventSource(`proxy/api/live-stream/subscribe?id=${this.userId}&ip=${item.ip}&alert=1`);
                this.updateSourceObj({ source, val });
                this.sourceObj[source].onopen = function(event) {
                    console.log('连接创建open');
                };
                this.sourceObj[source].onmessage = function(event) {
                    console.log('直接点击的长连接', event);
                    document.getElementById(item.id).setAttribute('src', event.data);
                    document.getElementById('img' + item.id).style.display = 'none';
                    document.getElementById(item.id).style.display = 'block';
                    console.log(document.getElementsByClassName('fatherBoxContent'))
                    let parent = document.getElementsByClassName('fatherBoxContent')[item.id - 1];
                    parent.getElementsByTagName('div')[0].className = 'boxContent';
                };
                // 更新vuex里面的ipArr
                this.updateMonitoringIpArr(item);
                Cookies.set('monitoringIpArr', JSON.stringify(this.ipArr));
                Cookies.set('sourceObj', JSON.stringify(this.sourceObj));
            } else {
                // 刷新报错 是因为sourceObj没有存  这个位置要修改下
                this.sourceObj[source].close();
                // 结束订阅，断开长链接
                const httpRequest = new XMLHttpRequest();
                httpRequest.open('GET', `proxy/api/live-stream/close?id=${this.userId}&ip=${item.ip}&alert=0`, false);
                document.getElementById('img' + item.id).style.display = 'block';
                document.getElementById(item.id).style.display = 'none';
                let parent = document.getElementsByClassName('fatherBoxContent')[item.id - 1];
                parent.getElementsByTagName('div')[0].className = 'boxIconContent';
                // 更新vuex里面的ipArr
                this.updateMonitoringIpArr(item);
                Cookies.set('monitoringIpArr', JSON.stringify(this.ipArr));
                console.log('关闭了长连接');
            }
        }
    }
};
</script>

<style>
.monitoringContent {
    display: flex;
    width: 100%;
    height: 100%;
    flex-wrap: wrap;
    justify-content: space-around;
    align-content: flex-start;
}

.monitoringContent .el-card__body {
    padding: 0px !important;
}

.monitoringContent .box-card {
    width: 48%;
}

.fatherBoxContent {
    width: 100%;
    height: 0px;
    position: relative;
    padding-bottom: 56.25%;
}

.boxContent {
    height: 100%;
    width: 100%;
    position: absolute;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    -moz-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
}

.boxIconContent {
    position: absolute;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    -moz-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
}

.el-card {
    margin-bottom: 20px;
}

.clearfix:before,
.clearfix:after {
    display: table;
    monitoringcontent: '';
}
.clearfix:after {
    clear: both;
}
</style>
