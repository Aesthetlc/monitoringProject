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
                        <div class="alarmVolumeMesLeftNumRight">34231</div>
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
                        <div v-for="item in 7" class="alarmingTrendBySevenDayMes">
                            <div style="display:flex">
                                <div
                                    class="alarmingTrendBySevenDayMesLeft"
                                    :class="{ redColor: item == 1, pinkColor: item == 2, yellowColor: item == 3 }"
                                >
                                    {{ item }}
                                </div>
                                <div>东配楼1F1A3</div>
                            </div>
                            <div style="margin-right:10px">20</div>
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
                        <div v-for="item in 7" class="alarmingTrendBySevenDayMes">
                            <div style="display:flex">
                                <div
                                    class="alarmingTrendBySevenDayMesLeft"
                                    :class="{ redColor: item == 1, pinkColor: item == 2, yellowColor: item == 3 }"
                                >
                                    {{ item }}
                                </div>
                                <div>东配楼1F1A3</div>
                            </div>
                            <div style="margin-right:10px">20</div>
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
                        <div v-for="item in 7" class="alarmingTrendBySevenDayMes">
                            <div style="display:flex">
                                <div
                                    class="alarmingTrendBySevenDayMesLeft"
                                    :class="{ redColor: item == 1, pinkColor: item == 2, yellowColor: item == 3 }"
                                >
                                    {{ item }}
                                </div>
                                <div>东配楼1F1A3</div>
                            </div>
                            <div style="margin-right:10px">20</div>
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
            } //报警量分类统计
        };
    },
    components: { Echart },
    mounted() {
        //月 柱状图
        (this.distributionData.dataTitle = ['指示灯', '安全帽', '静电服']),
            (this.distributionData.data = [
                { value: 335, name: '指示灯' },
                { value: 310, name: '安全帽' },
                { value: 234, name: '静电服' }
            ]);
        this.echartData.distribution = this.drawDistribution(this.distributionData.dataTitle, this.distributionData.data);
        //近7日报警趋势
        this.indicatorVariationData.dataTitle = ['指示灯', '安全帽', '静电服'];
        this.indicatorVariationData.x = ['8月13日', '8月14日', '8月15日', '8月16日', '8月17日', '8月18日', '8月19日'];
        this.indicatorVariationData.data = [
            {
                name: '指示灯',
                type: 'line',
                stack: '总量',
                smooth: true,
                data: [120, 132, 101, 134, 90, 230, 210]
            },
            {
                name: '安全帽',
                type: 'line',
                stack: '总量',
                smooth: true,
                data: [220, 182, 191, 234, 290, 330, 310]
            },
            {
                name: '静电服',
                type: 'line',
                stack: '总量',
                smooth: true,
                data: [150, 232, 201, 154, 190, 330, 410]
            }
        ];
        this.echartData.indicatorVariation = this.drawIndicatorVariation(
            this.indicatorVariationData.x,
            this.indicatorVariationData.data,
            this.indicatorVariationData.dataTitle
        );
        this.echartData.alarmClassification = this.drawAlarmClassification();
    },
    computed: {},
    methods: {
        //报警分布
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
        drawAlarmClassification() {
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
                    top:'7%',
                    containLabel: true
                },
                xAxis: {
                    type: 'value',
                    boundaryGap: [0, 0.01]
                },
                yAxis: {
                    type: 'category',
                    data: ['静电服', '安全帽', '指示灯']
                },
                series: [
                    {
                        type: 'bar',
                        barWidth: 30,
                        data: [160, 320, 240]
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
    border: 1px solid #000;
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
    border: 1px solid #000;
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
    border: 1px solid #000;
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
