<template>
    <div>
        <el-row :gutter="20" style="padding-left:10px;padding-right:10px;margin-bottom:0px">
            <el-col :span="24" style="text-align:right">
                <el-card>
                    <div class="block">
                        <el-date-picker
                            v-model="value1"
                            type="datetimerange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                        >
                        </el-date-picker>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <el-row :gutter="20" style="padding:10px;">
            <el-col :span="8">
                <el-card shadow="hover" class="mgb8" style="height:380px;">
                    <!-- 报警量 -->
                    <div class="alarmVolumeTitle">
                        <div>报警量</div>
                    </div>
                    <!-- 报警量 Total -->
                    <div class="alarmVolumeMes">
                        <div class="alarmVolumeMesLeftNumTotal">Total</div>
                        <div class="alarmVolumeMesLeftNumRight">{{ alertsTotalNum }}</div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-card shadow="hover" class="mgb8" style="height:380px;">
                    <!-- 报警分布 -->
                    <div class="alarmVolumeTitle">
                        <div>报警分布</div>
                    </div>
                    <!-- 报警量 周 -->
                    <div class="alarmVolumeMes">
                        <echart :isAxisChart="false" :chartData="echartData.distribution" class="alarmVolumeMesEchart"></echart>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-card shadow="hover" class="mgb8" style="height:380px;">
                    <!-- 指示灯报警量排⾏行行 -->
                    <div class="alarmVolumeTitle">
                        <div>指示灯报警量排⾏</div>
                    </div>
                    <!-- 指示灯报警量排⾏行行 -->
                    <div class="indicatorRank">
                        <div v-for="(item, index) in indicatorLightDataList" class="alarmingTrendBySevenDayMes">
                            <div style="display:flex">
                                <div
                                    class="alarmingTrendBySevenDayMesLeft"
                                    :class="{ redColor: index + 1 == 1, pinkColor: index + 1 == 2, yellowColor: index + 1 == 3 }"
                                >
                                    {{ index + 1 }}
                                </div>
                                <div>{{ item.name }}</div>
                            </div>
                            <div style="margin-right:10px">{{ item.count }}</div>
                        </div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="16">
                <el-card shadow="hover" class="mgb8" style="height:380px;">
                    <!-- 报警量变化趋势 -->
                    <div class="alarmVolumeTitle">
                        <div>报警量变化趋势</div>
                    </div>
                    <!-- 报警量变化趋势 -->
                    <div class="alarmVolumeMes">
                        <echart :isAxisChart="true" :chartData="echartData.indicatorVariation" class="alarmVolumeMesEchart"></echart>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-card shadow="hover" class="mgb8" style="height:380px;">
                    <!-- 安全帽报警量排⾏ -->
                    <div class="alarmVolumeTitle">
                        <div>安全帽报警量排⾏</div>
                    </div>
                    <!-- 安全帽报警量排⾏ -->
                    <div class="indicatorRank">
                        <div v-for="(item, index) in helmetDataList" class="alarmingTrendBySevenDayMes">
                            <div style="display:flex">
                                <div
                                    class="alarmingTrendBySevenDayMesLeft"
                                    :class="{ redColor: index + 1 == 1, pinkColor: index + 1 == 2, yellowColor: index + 1 == 3 }"
                                >
                                    {{ index + 1 }}
                                </div>
                                <div>{{ item.name }}</div>
                            </div>
                            <div style="margin-right:10px">{{ item.count }}</div>
                        </div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="16">
                <el-card shadow="hover" class="mgb8" style="height:380px;">
                    <!-- 报警量分类统计 -->
                    <div class="alarmVolumeTitle">
                        <div>报警量分类统计</div>
                    </div>
                    <!-- 报警量分类统计 -->
                    <div class="alarmVolumeMes">
                        <echart :isAxisChart="true" :chartData="echartData.alarmClassification" class="alarmVolumeMesEchart"></echart>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-card shadow="hover" class="mgb8" style="height:380px;">
                    <!-- 静电服报警量排⾏ -->
                    <div class="alarmVolumeTitle">
                        <div>静电服报警量排⾏</div>
                    </div>
                    <!-- 静电服报警量排⾏ -->
                    <div class="indicatorRank">
                        <div v-for="(item, index) in antiStaticDataList" class="alarmingTrendBySevenDayMes">
                            <div style="display:flex">
                                <div
                                    class="alarmingTrendBySevenDayMesLeft"
                                    :class="{ redColor: index + 1 == 1, pinkColor: index + 1 == 2, yellowColor: index + 1 == 3 }"
                                >
                                    {{ index + 1 }}
                                </div>
                                <div>{{ item.name }}</div>
                            </div>
                            <div style="margin-right:10px">{{ item.count }}</div>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import bus from '../common/bus';
import Echart from '@/components/common/Echart';
import {
    getAlertsTotal,
    getAlertsDistribution,
    getTopRankingLight,
    getTopRankingHelmet,
    getTopRankingAntiStatic,
    getTrendingTendency,
    getAlertsTypeStatistics
} from '@/api/policeStatistics.js';
export default {
    name: 'policeStatistics',
    data() {
        return {
            value1: [new Date(2000, 10, 10, 0, 0), new Date(2000, 10, 11, 0, 0)],
            echartData: {
                distribution: {}, //报警分布
                indicatorVariation: {}, //指令量变化趋势
                alarmClassification: {} //指令量分类统计
            },
            distributionData: {
                dataTitle: [],
                data: []
            }, //报警分布
            indicatorVariationData: {
                dataTitle: [],
                data: [],
                x: []
            }, //指令量变化趋势
            alarmClassificationData: {
                data: [],
                dataTitle: []
            }, //报警量分类统计
            alertsTotalNum: '', //报警统计total
            alertsTotalObj: {
                createTime: {
                    startTime: '2020/09/11 21:30:00',
                    endTime: '2020/09/11 22:30:00'
                },
                cameras: [1, 2, 3]
            }, // 获取报警统计参数
            alertsTotalObjByTop: {
                top: 7,
                createTime: {
                    startTime: '2020/09/11 21:30:00',
                    endTime: '2020/09/11 22:30:00'
                },
                cameras: [1, 2, 3], //摄像头id数组
                type: '' //摄像头检测模型
            }, // 获取报警统计参数(带top)
            helmetDataList: [], //安全帽数据
            antiStaticDataList: [], //静电服数据
            indicatorLightDataList: [] //指示灯数据
        };
    },
    components: { Echart },
    mounted() {},
    computed: {},
    created() {
        //报警总计
        this.getAlertsTotal(this.alertsTotalObj);
        //报警分布
        this.getAlertsDistribution(this.alertsTotalObj);
        //报警量变化趋势（带top 指示灯）
        this.alertsTotalObjByTop.type = '2';
        this.getTopRankingLight(this.alertsTotalObjByTop);
        //报警量变化趋势（带top 安全帽）
        this.alertsTotalObjByTop.type = '0';
        this.getTopRankingHelmet(this.alertsTotalObjByTop);
        //报警量变化趋势（带top 静电服）
        this.alertsTotalObjByTop.type = '1';
        this.getTopRankingAntiStatic(this.alertsTotalObjByTop);
        //报警量变化趋势
        this.getTrendingTendency(this.alertsTotalObj);
        //报警量变化趋势
        this.getAlertsTypeStatistics(this.alertsTotalObj);
    },
    methods: {
        //报警总计
        async getAlertsTotal(obj) {
            let { data: res } = await getAlertsTotal(obj);
            this.alertsTotalNum = res.count;
        },
        //报警分布
        async getAlertsDistribution(obj) {
            let { data: res } = await getAlertsDistribution(obj);
            this.distributionData.dataTitle = res.names;
            this.distributionData.data = res.series;
            this.echartData.distribution = this.drawDistribution(this.distributionData.dataTitle, this.distributionData.data);
        },
        // 指示灯报警量top
        async getTopRankingLight(obj) {
            let { data: res } = await getTopRankingLight(obj);
            this.indicatorLightDataList = res;
        },
        //安全帽报警量top
        async getTopRankingHelmet(obj) {
            let { data: res } = await getTopRankingHelmet(obj);
            this.helmetDataList = res;
        },
        //静电服报警量top
        async getTopRankingAntiStatic(obj) {
            let { data: res } = await getTopRankingAntiStatic(obj);
            this.antiStaticDataList = res;
        },
        // 报警量变化趋势 折线图
        async getTrendingTendency(obj) {
            let { data: res } = await getTrendingTendency(obj);
            let arr = [];
            let object = {};
            res.forEach(item => {
                this.indicatorVariationData.dataTitle.push(item.name);
                if (item.data) {
                    let result = item.data.map(ite => {
                        return ite[1];
                    });
                    object.name = item.name;
                    object.type = item.type;
                    object.smooth = true;
                    object.data = result;
                    arr.push(JSON.parse(JSON.stringify(object)));
                }
            });
            res[0].data.forEach(item => {
                this.indicatorVariationData.x.push(item[0]);
            });
            this.indicatorVariationData.data = arr;
            this.echartData.indicatorVariation = this.drawIndicatorVariation(
                this.indicatorVariationData.x,
                this.indicatorVariationData.data,
                this.indicatorVariationData.dataTitle
            );
        },
        // 报警量变化趋势 折线图
        async getAlertsTypeStatistics(obj) {
            let { data: res } = await getAlertsTypeStatistics(obj);
            console.log(res);
            res.forEach(item => {
                this.alarmClassificationData.dataTitle.push(item.name);
                this.alarmClassificationData.data.push(item.data[0]);
            });
            this.echartData.alarmClassification = this.drawAlarmClassification(
                this.alarmClassificationData.dataTitle,
                this.alarmClassificationData.data
            );
        },
        //报警分布echarts
        drawDistribution(dataTitle, data) {
            var option = {
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b}: {c} ({d}%)'
                },
                legend: {
                    orient: 'vertical',
                    left: '80%', //图例距离左的距离
                    y: 'center', //图例上下居中
                    data: dataTitle
                },
                color: ['rgb(203,155,255)', 'rgb(149,162,255)', 'rgb(58,186,255)', 'rgb(119,168,249)', 'rgb(235,161,159)'], //五个数据，五个颜色
                series: [
                    {
                        name: '报警分布',
                        type: 'pie',
                        radius: ['50%', '70%'],
                        center: ['45%', '50%'],
                        avoidLabelOverlap: false,
                        label: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: '30',
                                fontWeight: 'bold'
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: data
                    }
                ]
            };
            return option;
        },
        //报警量变化趋势
        drawIndicatorVariation(dataTitle, data, x) {
            var option = {
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: x
                },
                color: ['rgb(203,155,255)', 'rgb(149,162,255)', 'rgb(58,186,255)', 'rgb(119,168,249)', 'rgb(235,161,159)'], //五个数
                grid: {
                    left: '3%',
                    right: '3%',
                    bottom: '10%',
                    top: '10%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: dataTitle
                },
                yAxis: {
                    type: 'value'
                },
                series: data
            };
            return option;
        },
        //报警量分类统计
        drawAlarmClassification(dataTitle, data) {
            var option = {
                color: ['#3398DB'],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        // type: 'shadow'
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    top: '7%',
                    containLabel: true
                },
                xAxis: {
                    type: 'value',
                    boundaryGap: [0, 0.01]
                },
                yAxis: {
                    type: 'category',
                    data: dataTitle
                },
                series: [
                    {
                        type: 'bar',
                        barWidth: 30,
                        data: data
                    }
                ]
            };
            return option;
        }
    }
};
</script>

<style scoped>
.alarmVolumeTitle {
    display: flex;
    height: 80px;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
    /* border: 1px solid #000; */
    justify-content: space-between;
    padding-left: 50px;
    padding-right: 50px;
    align-items: center;
    font-size: 20px;
    font-weight: 500;
}
.alarmVolumeMes {
    display: flex;
    height: 250px;
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;
    /* border: 1px solid #000; */
    border-top: 1px solid #999;
}
.alarmVolumeMesLeft {
    display: flex;
    height: 100%;
}
.alarmVolumeMesLeftNum,
.alarmVolumeMesLeftProportion {
    display: flex;
    padding-left: 50px;
    align-items: center;
    height: 50%;
}
.alarmVolumeMesLeftNumTotal {
    padding-top: 40px;
    padding-left: 40px;
    font-size: 34px;
    font-weight: 700;
    flex: 3;
}
.alarmVolumeMesLeftNumRight {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-size: 54px;
    font-weight: 700;
    flex: 7;
}
.alarmVolumeMesLeftProportion {
    font-size: 18px;
    font-weight: 500;
}
.alarmVolumeMesEchart {
    width: 100%;
    height: 100%;
}
.indicatorRank {
    /* border: 1px solid #000; */
    border-top: 1px solid #999;
    height: 250px;
    padding-left: 20px;
    padding-right: 20px;
}
.alarmingTrendBySevenDayMes {
    display: flex;
    padding: 5px;
    margin-top: 3px;
    justify-content: space-between;
}
.alarmingTrendBySevenDayMesLeft {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 10px;
    height: 20px;
    width: 20px;
    border: 1px solid #ccc;
    border-radius: 10px;
    background-color: #ccc;
    color: #fff;
}
.redColor {
    background-color: rgb(238, 33, 12);
}
.pinkColor {
    background-color: rgb(254, 156, 110);
}
.yellowColor {
    background-color: rgb(250, 226, 50);
}
.grayColor {
    background-color: rgb(169, 169, 169);
}

.el-row {
    margin-bottom: 20px;
}

.grid-content {
    display: flex;
    align-items: center;
    height: 100px;
}

.grid-cont-right {
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: #999;
}

.grid-num {
    font-size: 30px;
    font-weight: bold;
}

.grid-con-icon {
    font-size: 50px;
    width: 100px;
    height: 100px;
    text-align: center;
    line-height: 100px;
    color: #fff;
}

.grid-con-1 .grid-con-icon {
    background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
    color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
    background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
    color: rgb(45, 140, 240);
}

.grid-con-3 .grid-con-icon {
    background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
    color: rgb(242, 94, 67);
}

.user-info {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    border-bottom: 2px solid #ccc;
    margin-bottom: 20px;
}

.user-avator {
    width: 120px;
    height: 120px;
    border-radius: 50%;
}

.user-info-cont {
    padding-left: 50px;
    flex: 1;
    font-size: 14px;
    color: #999;
}

.user-info-cont div:first-child {
    font-size: 30px;
    color: #222;
}

.user-info-list {
    font-size: 14px;
    color: #999;
    line-height: 25px;
}

.user-info-list span {
    margin-left: 70px;
}

.mgb8 {
    margin-bottom: 8px;
}

.todo-item {
    font-size: 14px;
}

.todo-item-del {
    text-decoration: line-through;
    color: #999;
}
</style>
