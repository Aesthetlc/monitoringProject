<template>
    <div>
        <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item v-for="(name, index) in matchedArr" :key="index">
                {{ name }}
            </el-breadcrumb-item>
        </el-breadcrumb> -->
        <el-row :gutter="20" style="padding:10px;">
            <el-col :span="8">
                <el-card shadow="hover" class="mgb8" style="height:380px;">
                    <!-- 报警量 -->
                    <div class="alarmVolumeTitle">
                        <div>报警量</div>
                        <div><el-tag type="success">日</el-tag></div>
                    </div>
                    <!-- 报警量 日 -->
                    <div class="alarmVolumeMes">
                        <div class="alarmVolumeMesLeft">
                            <div class="alarmVolumeMesLeftNum">{{ warnDayNum }}</div>
                            <div class="alarmVolumeMesLeftProportion">
                                日同比 {{ warnDayPercentNum }}%
                                <em v-if="warnDayPercentNum >= 0" style="color:red" class="el-icon-caret-top"></em>
                                <em v-else style="color:green" class="el-icon-caret-bottom"></em>
                            </div>
                        </div>
                        <echart :isAxisChart="true" :chartData="echartData.chartDay" class="alarmVolumeMesRight"></echart>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-card shadow="hover" class="mgb8" style="height:380px;">
                    <!-- 报警量 -->
                    <div class="alarmVolumeTitle">
                        <div>报警量</div>
                        <div><el-tag type="danger">周</el-tag></div>
                    </div>
                    <!-- 报警量 周 -->
                    <div class="alarmVolumeMes">
                        <div class="alarmVolumeMesLeft">
                            <div class="alarmVolumeMesLeftNum">{{ warnWeekNum }}</div>
                            <div class="alarmVolumeMesLeftProportion">
                                周同比 {{ warnWeekPercentNum }}%
                                <em v-if="warnWeekPercentNum >= 0" style="color:red" class="el-icon-caret-top"></em>
                                <em v-else style="color:green" class="el-icon-caret-bottom"></em>
                            </div>
                        </div>
                        <echart :isAxisChart="true" :chartData="echartData.chartWeek" class="alarmVolumeMesRight"></echart>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-card shadow="hover" class="mgb8" style="height:380px;">
                    <!-- 报警量 -->
                    <div class="alarmVolumeTitle">
                        <div>报警量</div>
                        <div><el-tag>月</el-tag></div>
                    </div>
                    <!-- 报警量 月 -->
                    <div class="alarmVolumeMes">
                        <div class="alarmVolumeMesLeft">
                            <div class="alarmVolumeMesLeftNum">3100</div>
                            <div class="alarmVolumeMesLeftProportion">
                                月同比 3.2%<em style="color:green" class="el-icon-caret-bottom"></em>
                            </div>
                        </div>
                        <echart :isAxisChart="true" :chartData="echartData.chartMonth" class="alarmVolumeMesRight"></echart>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="16">
                <el-card shadow="hover" class="mgb8" style="height:380px;">
                    <!-- 近7日报警趋势 -->
                    <div class="alarmVolumeTitle">
                        <div>近7日报警趋势</div>
                    </div>
                    <!-- 近7日报警趋势 -->
                    <div class="alarmVolumeMes">
                        <echart :isAxisChart="true" :chartData="echartData.alarmingTrend" style="height:200px;width:100%"></echart>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-card shadow="hover" class="mgb8" style="height:380px;">
                    <!-- 近7日报警趋势 -->
                    <div class="alarmVolumeTitle">
                        <div>TOP7报警量排行</div>
                        <el-radio-group v-model="radio" @change="changeTopDate">
                            <el-radio label="1"><span style="font-size:18px">今日</span></el-radio>
                            <el-radio label="7"><span style="font-size:18px">近7日</span></el-radio>
                        </el-radio-group>
                    </div>
                    <!-- 近7日报警趋势 -->
                    <div class="alarmingTrendBySevenDay">
                        <div v-for="(item, index) in topWarnDataList" class="alarmingTrendBySevenDayMes">
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
import bus from '@/components/common/bus';
import {
    getAlertTrendingBySeven,
    getAlertStatisticDaily,
    getAlertStatisticWeek,
    getAlertStatisticMonth,
    getAlertTrendingTop
} from '@/api/index.js';
import Echart from '@/components/common/Echart';
export default {
    name: 'dashboard',
    data() {
        return {
            echartData: {
                chartDay: {},
                chartWeek: {},
                chartMonth: {},
                alarmingTrend: {}
            },
            chartDayData: {
                data: [],
                yTitle: []
            },
            chartWeekData: {
                data: [],
                yTitle: []
            },
            chartMonthData: {
                data: [],
                yTitle: []
            },
            alarmingTrendData: {
                x: [],
                data: []
            },
            chartDay: null,
            chartWeek: null,
            chartMonth: null,
            alarmingTrend: null,
            radio: '1',
            warnDayNum: '', //日数据
            warnDayPercentNum: '', //日同比百分比
            warnWeekNum: '', //周数据
            warnWeekPercentNum: '', //周同比百分比
            warnMonthNum: '', //月数据
            warnMonthPercentNum: '', //月同比百分比
            topParams: {
                top: 7,
                days: 1
            }, //TOP7报警量排行
            topWarnDataList: [], //top排行数据集合
            // arr: [
            //     {
            //         month: '1',
            //         func: 'pr',
            //         num: 111
            //     },
            //     {
            //         month: '2',
            //         func: 'pr',
            //         num: 222
            //     },
            //     {
            //         month: 'a',
            //         func: 'zz',
            //         num: 333
            //     },
            //     {
            //         month: 'b',
            //         func: 'zz',
            //         num: 333
            //     }
            // ]
        };
    },
    created() {
        // var result = this.arr.reduce((groups, item) => {
        //     var groupFound = groups.find(arrItem => item.func == arrItem.func);
        //     if (groupFound) {
        //         groupFound.num.push(item.num);
        //     } else {
        //         var newGroup = {
        //             func: item.func,
        //             num: [item.num]
        //         };
        //         groups.push(newGroup);
        //     }
        //     return groups;
        // }, []);
        // console.log(result);
    },
    components: { Echart },
    mounted() {
        //获取日数据
        this.getAlertStatisticDaily();
        //获取周数据
        this.getAlertStatisticWeek();
        //获取月数据
        this.getAlertStatisticMonth();
        //获取近7日报警趋势 数据
        let obj = {
            days: 7
        };
        this.getAlertTrendingBySeven(obj);
        //获取top7报警
        this.getAlertTrendingTop(this.topParams);
    },
    computed: {},
    methods: {
        // 获取日数据
        async getAlertStatisticDaily() {
            let { data: res } = await getAlertStatisticDaily();
            this.warnDayNum = res.count;
            this.warnDayPercentNum = res.percent;
            //日 柱状图
            this.chartDayData.data.push(res.series[0].data[0], res.series[1].data[0]);
            this.chartDayData.yTitle.push(res.series[0].name, res.series[1].name);
            this.echartData.chartDay = this.drawDay(this.chartDayData.data, this.chartDayData.yTitle);
        },
        // 获取周数据
        async getAlertStatisticWeek() {
            let { data: res } = await getAlertStatisticWeek();
            this.warnWeekNum = res.count;
            this.warnWeekPercentNum = res.percent;
            //周 柱状图
            this.chartWeekData.data.push(res.series[0].data[0], res.series[1].data[0]);
            this.chartWeekData.yTitle.push(res.series[0].name, res.series[1].name);
            this.echartData.chartWeek = this.drawDay(this.chartWeekData.data, this.chartWeekData.yTitle);
        },
        // 获取月数据
        async getAlertStatisticMonth() {
            let { data: res } = await getAlertStatisticMonth();
            this.warnMonthNum = res.count;
            this.warnMonthPercentNum = res.percent;
            //日 柱状图
            this.chartMonthData.data.push(res.series[0].data[0], res.series[1].data[0]);
            this.chartMonthData.yTitle.push(res.series[0].name, res.series[1].name);
            this.echartData.chartMonth = this.drawDay(this.chartMonthData.data, this.chartMonthData.yTitle);
        },
        // 获取近7日数据
        async getAlertTrendingBySeven(params) {
            let { data: res } = await getAlertTrendingBySeven(params);
            res[0].data.forEach(item => {
                this.alarmingTrendData.data.push(item[1]);
                this.alarmingTrendData.x.push(item[0]);
            });
            this.echartData.alarmingTrend = this.alarmingTrendBySevenDay(this.alarmingTrendData.data, this.alarmingTrendData.x);
        },
        // top 排行
        async getAlertTrendingTop(params) {
            let { data: res } = await getAlertTrendingTop(params);
            this.topWarnDataList = res;
        },
        // 更改top日期
        changeTopDate(val) {
            this.topParams.days = val;
            this.getAlertTrendingTop(this.topParams);
        },
        // 日echart [125,100]
        drawDay(data, yTitle) {
            var option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                grid: {
                    left: '5%',
                    right: '5%',
                    bottom: '5%',
                    top: '5%',
                    containLabel: true
                },
                xAxis: {
                    type: 'value',
                    boundaryGap: [0, 0.01]
                },
                yAxis: {
                    type: 'category',
                    data: yTitle
                },
                series: [
                    {
                        type: 'bar',
                        data: data,
                        barWidth: 30,
                        label: {
                            show: true,
                            position: 'inside'
                        },
                        itemStyle: {
                            normal: {
                                color: function(params) {
                                    var colorList = ['#FED766', '#3EA3D8'];
                                    return colorList[params.dataIndex];
                                }
                            }
                        }
                    }
                ]
            };
            return option;
        },
        //周 [880,800]
        drawWeek(data) {
            var option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                grid: {
                    left: '5%',
                    right: '5%',
                    bottom: '5%',
                    top: '5%',
                    containLabel: true
                },
                xAxis: {
                    type: 'value',
                    boundaryGap: [0, 0.01]
                },
                yAxis: {
                    type: 'category'
                },
                series: [
                    {
                        type: 'bar',
                        data: data,
                        barWidth: 30,
                        label: {
                            show: true,
                            position: 'inside'
                        },
                        itemStyle: {
                            normal: {
                                color: function(params) {
                                    var colorList = ['#FED766', '#3EA3D8'];
                                    return colorList[params.dataIndex];
                                }
                            }
                        }
                    }
                ]
            };
            return option;
        },
        //月 [3100,3200]
        drawMonth(data) {
            var option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                grid: {
                    left: '5%',
                    right: '5%',
                    bottom: '5%',
                    top: '5%',
                    containLabel: true
                },
                xAxis: {
                    type: 'value',
                    boundaryGap: [0, 0.01]
                },
                yAxis: {
                    type: 'category'
                },
                series: [
                    {
                        type: 'bar',
                        data: data,
                        barWidth: 30,
                        label: {
                            show: true,
                            position: 'inside'
                        },
                        itemStyle: {
                            normal: {
                                color: function(params) {
                                    var colorList = ['#FED766', '#3EA3D8'];
                                    return colorList[params.dataIndex];
                                }
                            }
                        }
                    }
                ]
            };
            return option;
        },
        //近7日报警趋势
        alarmingTrendBySevenDay(data, x) {
            var option = {
                color: ['#3398DB'],
                tooltip: {
                    // trigger: 'axis',
                    axisPointer: {
                        // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                grid: {
                    left: '1%',
                    right: '1%',
                    bottom: '1%',
                    top: '20%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        data: x,
                        axisTick: {
                            alignWithLabel: true
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: '报警数量'
                    }
                ],
                series: [
                    {
                        name: '报警数量',
                        type: 'bar',
                        barWidth: '60%',
                        barWidth: 30,
                        label: {
                            show: true,
                            position: 'inside'
                        },
                        data: data
                    },
                    {
                        name: '报警数量',
                        type: 'line',
                        itemStyle: {
                            normal: {
                                lineStyle: {
                                    color: '#FED766'
                                }
                            }
                        },
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
    justify-content: center;
    align-items: center;
    height: 250px;
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;
    /* border: 1px solid #000; */
    border-top: 1px solid #999;
}
.alarmVolumeMesLeft {
    width: 40%;
    height: 100%;
}
.alarmVolumeMesLeftNum,
.alarmVolumeMesLeftProportion {
    display: flex;
    padding-left: 50px;
    align-items: center;
    height: 50%;
}
.alarmVolumeMesLeftNum {
    font-size: 34px;
    font-weight: 700;
}
.alarmVolumeMesLeftProportion {
    font-size: 18px;
    font-weight: 500;
}
.alarmVolumeMesRight {
    width: 60%;
    height: 100%;
}
.alarmingTrendBySevenDay {
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
