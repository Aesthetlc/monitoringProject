<template>
    <div>
        <el-row :gutter="20" style="padding:0px;margin-left:10px;margin-right:10px;margin-bottom:10px">
            <el-card>
                <!-- <div class="zi"> -->

                <el-form ref="form" class="demo-form-inline clearfix fu" inline :model="form" label-width="85px">
                    <div id="searchBox">
                        <div style="float:right">
                            <el-button type="text" style="margin-left:10px" id="closeSearchBtn" @click="closeSearch">
                                {{ word }}
                                <i :class="showAll ? 'el-icon-arrow-up ' : 'el-icon-arrow-down'"></i>
                            </el-button>
                        </div>
                        <el-form-item label="摄像机ip" prop="ip">
                            <el-input style="width:150px" v-model="form.ip" placeholder="请输入摄像机ip"></el-input>
                        </el-form-item>
                        <el-form-item label="摄像机位置" prop="position">
                            <el-input style="width:150px" v-model="form.position" placeholder="请输入摄像机位置"></el-input>
                        </el-form-item>
                        <el-form-item label="摄像头筛选" prop="detectModelTypeArray">
                            <el-select style="width:150px" v-model="form.detectModelTypeArray" multiple placeholder="筛选条件">
                                <el-option v-for="item in detectModelTypeArray" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="开启状态" prop="stateArray">
                            <el-select style="width:150px" v-model="form.stateArray" multiple placeholder="筛选状态">
                                <el-option v-for="item in stateArray" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="报警时间" prop="createTime">
                            <div class="block">
                                <el-date-picker
                                    v-model="form.createTime"
                                    type="datetimerange"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                >
                                </el-date-picker>
                            </div>
                        </el-form-item>
                        <el-form-item style="float:right">
                            <el-button type="primary" @click="handleSearch('form')">搜索</el-button>
                            <el-button @click="resetForm('form')">重置</el-button>
                        </el-form-item>

                        <el-table
                            :data="tableData"
                            border
                            class="table"
                            ref="multipleTable"
                            header-cell-class-name="table-header"
                            @selection-change="handleSelectionChange"
                            @sort-change="sortChange"
                            :row-key="
                                row => {
                                    return row.id;
                                }
                            "
                            :default-sort="{ prop: 'id', order: 'ascending' }"
                        >
                            <el-table-column :reserve-selection="true" type="selection" width="55" align="center"></el-table-column>
                            <el-table-column label="ID" width="60" align="center">
                                <template slot-scope="scope">
                                    <span>{{ scope.$index + (form.pagenation.pageNum - 1) * form.pagenation.pageSize + 1 }} </span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="ip" label="摄像机ip" align="center"></el-table-column>
                            <el-table-column prop="position" label="摄像机位置" align="center"></el-table-column>
                            <el-table-column prop="detectModelType" label="类别" align="center"></el-table-column>
                            <el-table-column prop="state" label="状态" align="center">
                                <template slot-scope="scope">
                                    <span v-if="scope.row.state">启动</span>
                                    <span v-else>停止</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                sortable="custom"
                                prop="createTime"
                                label="创建时间"
                                align="center"
                                :formatter="dateFormat"
                            ></el-table-column>
                        </el-table>
                        <div style="clear:both"></div>
                        <div class="pagination">
                            <el-pagination
                                background
                                :page-sizes="[5, 10, 15, 20]"
                                layout="total, sizes, prev, pager, next, jumper"
                                :current-page="form.pagenation.pageNum"
                                :page-pageSize="form.pagenation.pageSize"
                                :total="total"
                                @current-change="handlePageChange"
                                @size-change="handleSizeChange"
                            ></el-pagination>
                        </div>
                    </div>
                </el-form>
            </el-card>
        </el-row>
        <el-row :gutter="20" style="padding:0px 10px;">
            <el-col :span="16">
                <el-collapse v-model="activeNames" @change="handleChange">
                    <el-collapse-item title="已选数据" name="1">
                        <span style="margin-left:20px" v-for="item in multipleSelection" :key="item.id">
                            <el-tag>ip:{{ item.ip }},位置{{ item.position }}</el-tag>
                        </span>
                    </el-collapse-item>
                </el-collapse>
            </el-col>

            <el-col :span="8">
                <el-card>
                    <div class="block">
                        <el-date-picker
                            style="width:100%"
                            @change="changeCreateTime"
                            v-model="createTime"
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
                        <div v-if="indicatorLightDataList.length > 0">
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
                        <div v-else>
                            <div style="margin-top:10px">
                                <span>暂无数据</span>
                            </div>
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
                        <div v-if="helmetDataList.length > 0">
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
                        <div v-else>
                            <div style="margin-top:10px">
                                <span>暂无数据</span>
                            </div>
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
                        <div v-if="antiStaticDataList.length > 0">
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
                        <div v-else>
                            <div style="margin-top:10px">
                                <span>暂无数据</span>
                            </div>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
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
import { getCamerasQuery, getCamerasCount, getDetectModelsTypes } from '@/api/cameraManagement.js'; //摄像头类型
import { getAlertEventsState } from '@/api/alertEvents.js';
export default {
    name: 'policeStatistics',
    data() {
        return {
            form: {
                ip: '', //摄像头ip地址
                position: '', //摄像头位置
                createTime: [], //报警事件创建时间
                detectModelTypeArray: [], //摄像头检测模型
                stateArray: [], //报警事件开启状态
                pagenation: {
                    pageNum: 1,
                    pageSize: 10
                },
                sort: { field: 'createTime', type: 'asc' } //排序
            },
            total: 0, // 总条数
            tableData: [],
            multipleSelection: [], // 多选数据
            detectModelTypeArray: [], //摄像头检测模型
            stateArray: [], //状态  启动/关闭
            showAll: true, //是否展开全部
            activeNames: [],
            createTime: [], // 时间  筛选
            alertsTotalObj: {
                createTime: {
                    startTime: '',
                    endTime: ''
                },
                cameras: []
            }, // 获取报警统计参数
            alertsTotalNum: '', //报警统计total
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
    mounted() {
        this.$nextTick(function() {
            this.closeSearch();
        });
    },
    watch: {},
    computed: {
        word: function() {
            if (this.showAll == false) {
                //对文字进行处理
                return '展开搜索';
            } else {
                return '收起搜索';
            }
        }
    },
    created() {
        //摄像头分页查询接口
        let searchObj = JSON.parse(JSON.stringify(this.form));
        searchObj.createTime = {};
        this.getCamerasQuery(searchObj);
        //检测模型类别查询接口
        this.getDetectModelsTypes();
        //获取所有状态信息，用于分类筛选
        this.getAlertEventsState();
        //摄像头分页查询接口 总量
        let searchCountObj = JSON.parse(JSON.stringify(this.form));
        searchCountObj.createTime = {};
        let obj = JSON.parse(JSON.stringify(searchCountObj));
        delete obj.sort;
        delete obj.pagenation;
        this.getCamerasCount(obj);

        // -------------------------------------------

        //报警总计
        // this.getAlertsTotal(this.alertsTotalObj);
        //报警分布
        //this.getAlertsDistribution(this.alertsTotalObj);
        //报警量变化趋势
        // this.getTrendingTendency(this.alertsTotalObj);

        //报警量变化趋势（带top 指示灯）
        // this.alertsTotalObjByTop.type = '2';
        // this.getTopRankingLight(this.alertsTotalObjByTop);
        //报警量变化趋势（带top 安全帽）
        // this.alertsTotalObjByTop.type = '0';
        // this.getTopRankingHelmet(this.alertsTotalObjByTop);
        //报警量变化趋势（带top 静电服）
        // this.alertsTotalObjByTop.type = '1';
        // this.getTopRankingAntiStatic(this.alertsTotalObjByTop);

        //报警量变化趋势
        // this.getAlertsTypeStatistics(this.alertsTotalObj);
    },
    methods: {
        // 根据条件分页展示报警事件信息    --0227
        async getCamerasQuery(obj) {
            let res = await getCamerasQuery(obj);
            if (res.code == 0) {
                this.tableData = res.detail;
            } else {
                //code 1 摄像头信息查询失败  code 2  系统错误
                this.$message.error(res.content);
            }
        },
        //摄像头总量查询 --0227
        async getCamerasCount(obj) {
            let res = await getCamerasCount(obj);
            if (res.code == 0) {
                this.total = res.detail.count || 0;
            } else {
                // code 1  摄像头总数查询失败     code 2 系统错误
                this.$message.error(res.content);
            }
        },
        // 触发搜索按钮 --0227
        handleSearch() {
            this.$set(this.form.pagenation, 'pageNum', 1);
            let searchObj = JSON.parse(JSON.stringify(this.form));
            let tempObj = {};
            tempObj.startTime = this.$util.timestampToDateTime(searchObj.createTime[0]);
            tempObj.endTime = this.$util.timestampToDateTime(searchObj.createTime[1]);
            searchObj.createTime = tempObj;
            this.getCamerasQuery(searchObj);

            let searchCountObj = JSON.parse(JSON.stringify(this.form));
            let tempCountObj = {};
            tempCountObj.startTime = this.$util.timestampToDateTime(searchCountObj.createTime[0]);
            tempCountObj.endTime = this.$util.timestampToDateTime(searchCountObj.createTime[1]);
            searchCountObj.createTime = tempCountObj;
            delete searchCountObj.sort;
            delete searchCountObj.pagenation;
            this.getCamerasCount(searchCountObj);
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        //摄像头检测模型  --0027
        async getDetectModelsTypes() {
            let res = await getDetectModelsTypes();
            if (res.code == 0) {
                res.detail.forEach(item => {
                    this.detectModelTypeArray.push({
                        value: item.id,
                        label: item.name
                    });
                });
            } else if (res.code == 1) {
                //模型类型查询失败
                this.$message.error(res.content);
            } else if (res.code == 2) {
                //系统错误
                this.$message.error(res.content);
            }
        },
        //获取所有状态信息，用于分类筛选 --0227
        async getAlertEventsState() {
            let res = await getAlertEventsState();
            if (res.code == 0) {
                res.detail.forEach(item => {
                    this.stateArray.push({
                        value: item.code,
                        label: item.name
                    });
                });
            } else if (res.code == 1) {
                this.$message.error('查询失败');
            }
        },
        // 分页
        handlePageChange(val) {
            this.$set(this.form.pagenation, 'pageNum', val);
            let searchObj = JSON.parse(JSON.stringify(this.form));
            let tempObj = {};
            tempObj.startTime = this.$util.timestampToDateTime(searchObj.createTime[0]);
            tempObj.endTime = this.$util.timestampToDateTime(searchObj.createTime[1]);
            searchObj.createTime = tempObj;
            this.getCamerasQuery(searchObj);

            let searchCountObj = JSON.parse(JSON.stringify(this.form));
            let tempCountObj = {};
            tempCountObj.startTime = this.$util.timestampToDateTime(searchCountObj.createTime[0]);
            tempCountObj.endTime = this.$util.timestampToDateTime(searchCountObj.createTime[1]);
            searchCountObj.createTime = tempCountObj;
            delete searchCountObj.sort;
            delete searchCountObj.pagenation;
            this.getCamerasCount(searchCountObj);
        },
        handleSizeChange(val) {
            this.$set(this.form.pagenation, 'pageSize', val);
            let searchObj = JSON.parse(JSON.stringify(this.form));
            let tempObj = {};
            tempObj.startTime = this.$util.timestampToDateTime(searchObj.createTime[0]);
            tempObj.endTime = this.$util.timestampToDateTime(searchObj.createTime[1]);
            searchObj.createTime = tempObj;
            this.getCamerasQuery(searchObj);

            let searchCountObj = JSON.parse(JSON.stringify(this.form));
            let tempCountObj = {};
            tempCountObj.startTime = this.$util.timestampToDateTime(searchCountObj.createTime[0]);
            tempCountObj.endTime = this.$util.timestampToDateTime(searchCountObj.createTime[1]);
            searchCountObj.createTime = tempCountObj;
            delete searchCountObj.sort;
            delete searchCountObj.pagenation;
            this.getCamerasCount(searchCountObj);
        },
        //排序 --0227
        sortChange(column) {
            if (column.order !== null) {
                this.form.sort.field = column.prop;
                if (column.order === 'descending') {
                    this.form.sort.type = 'desc';
                } else if (column.order === 'ascending') {
                    this.form.sort.type = 'asc';
                }
                let searchObj = {};
                if (JSON.stringify(this.form.createTime) == '[]') {
                    searchObj = JSON.parse(JSON.stringify(this.form));
                    searchObj.createTime = {};
                } else {
                    searchObj = JSON.parse(JSON.stringify(this.form));
                    let tempObj = {};
                    tempObj.startTime = this.$util.timestampToDateTime(searchObj.createTime[0]);
                    tempObj.endTime = this.$util.timestampToDateTime(searchObj.createTime[1]);
                    searchObj.createTime = tempObj;
                }
                this.getCamerasQuery(searchObj);
            }
        },
        //表格时间转换 --0227
        dateFormat(row) {
            const date = this.$util.standardToDateTime(row.createTime);
            return date;
        },
        //重置表单 --0227
        resetForm(formName) {
            this.$refs[formName].resetFields();
            let searchObj = JSON.parse(JSON.stringify(this.form));
            searchObj.createTime = {};
            this.getCamerasQuery(searchObj);

            let searchCountObj = JSON.parse(JSON.stringify(this.form));
            delete searchCountObj.sort;
            delete searchCountObj.pagenation;
            let tempCountObj = {};
            tempCountObj.startTime = this.$util.timestampToDateTime(searchCountObj.createTime[0]);
            tempCountObj.endTime = this.$util.timestampToDateTime(searchCountObj.createTime[1]);
            searchCountObj.createTime = tempCountObj;
            this.getCamerasCount(searchCountObj);
        },
        //收展，展开
        closeSearch() {
            this.showAll = !this.showAll;
            var searchBoxHeght = document.getElementById('searchBox');
            if (this.showAll == false) {
                searchBoxHeght.style.height = 50 + 'px';
            } else {
                searchBoxHeght.style.height = 'auto';
            }
        },
        handleChange(val) {
            console.log(val);
        },
        // 时间改变 触发 报警总计
        async changeCreateTime(val) {
            this.alertsTotalObj.cameras = [];
            this.echartData.distribution = {}; //报警分布
            this.echartData.indicatorVariation = {}; //指令量变化趋势
            this.echartData.alarmClassification = {}; //指令量分类统计
            this.distributionData.dataTitle = []; //报警分布
            this.distributionData.data = []; //报警分布
            this.indicatorVariationData.dataTitle = []; //指令量变化趋势
            this.indicatorVariationData.data = []; //指令量变化趋势
            this.indicatorVariationData.x = []; //指令量变化趋势
            this.alarmClassificationData.data = []; //报警量分类统计
            this.alarmClassificationData.dataTitle = []; //报警量分类统计

            console.log(val);
            this.alertsTotalObj.createTime.startTime = this.$util.timestampToDateTime(val[0]);
            this.alertsTotalObj.createTime.endTime = this.$util.timestampToDateTime(val[1]);
            this.multipleSelection.forEach(item => {
                this.alertsTotalObj.cameras.push(item.id);
            });
            // 报警量统计
            this.getAlertsTotal(this.alertsTotalObj);
            // 报警分布
            this.getAlertsDistribution(this.alertsTotalObj);
            // 指示灯报警量top   (组装参数)
            let searchLightObj = JSON.parse(JSON.stringify(this.alertsTotalObj));
            searchLightObj.top = '7';
            this.detectModelTypeArray.forEach(item => {
                if (item.label.indexOf('指示灯') > -1) {
                    searchLightObj.type = item.value;
                }
            });
            //指示灯报警量top
            this.getTopRankingLight(searchLightObj);
            //报警量变化趋势 折线图
            this.getTrendingTendency(this.alertsTotalObj);
            //安全帽报警量top
            let searchHelmetObj = JSON.parse(JSON.stringify(this.alertsTotalObj));
            searchHelmetObj.top = '7';
            this.detectModelTypeArray.forEach(item => {
                if (item.label.indexOf('安全帽') > -1) {
                    searchHelmetObj.type = item.value;
                }
            });
            this.getTopRankingHelmet(searchHelmetObj);

            //报警量统计
            this.getAlertsTypeStatistics(this.alertsTotalObj);
            //静电服报警量top
            let searchAntiStaticObj = JSON.parse(JSON.stringify(this.alertsTotalObj));
            searchAntiStaticObj.top = '7';
            this.detectModelTypeArray.forEach(item => {
                if (item.label.indexOf('静电服') > -1) {
                    searchAntiStaticObj.type = item.value;
                }
            });
            this.getTopRankingAntiStatic(searchAntiStaticObj);
        },

        // -----------------------------------------

        // 报警量统计
        async getAlertsTotal(obj) {
            let totalRes = await getAlertsTotal(obj);
            if (totalRes.code == '0') {
                this.alertsTotalNum = totalRes.totalCounts;
            } else {
                //code 1
                this.$meaasge.error('获取统计报警量失败');
            }
        },
        // 报警分布
        async getAlertsDistribution(obj) {
            let distributionRes = await getAlertsDistribution(obj);
            if (distributionRes.code == '0') {
                this.distributionData.dataTitle = distributionRes.detail.names;
                this.distributionData.data = distributionRes.detail.series;
                this.echartData.distribution = this.drawDistribution(this.distributionData.dataTitle, this.distributionData.data);
            } else {
                //code 1
                this.$message.error('获取统计报警分布失败');
            }
        },
        // 指示灯报警量top
        async getTopRankingLight(obj) {
            let res = await getTopRankingLight(obj);
            if (res.code == 0) {
                this.indicatorLightDataList = res.detail;
            } else {
                //code 1
                this.$message.error(res.content);
            }
        },
        //安全帽报警量top
        async getTopRankingHelmet(obj) {
            let res = await getTopRankingHelmet(obj);
            if (res.code == 0) {
                this.helmetDataList = res.detail;
            } else {
                //code 1
                this.$message.error(res.content);
            }
        },
        // 报警量变化趋势 折线图
        async getTrendingTendency(obj) {
            let { detail: res } = await getTrendingTendency(obj);
            let arr = [];
            let object = {};
            res.data.forEach(item => {
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
            res.data[0].data.forEach(item => {
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
            let res = await getAlertsTypeStatistics(obj);
            res.detail.forEach(item => {
                this.alarmClassificationData.dataTitle.push(item.name);
                this.alarmClassificationData.data.push(item.data[0]);
            });
            this.echartData.alarmClassification = this.drawAlarmClassification(
                this.alarmClassificationData.dataTitle,
                this.alarmClassificationData.data
            );
        },
        //静电服报警量top
        async getTopRankingAntiStatic(obj) {
            let res = await getTopRankingAntiStatic(obj);
            if (res.code == 0) {
                this.antiStaticDataList = res.detail;
            } else {
                //code 1
                this.$message.error(res.content);
            }
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
                    data: dataTitle,
                    axisLabel: {
                        interval: 0,
                        rotate: 40
                    }
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
                        itemStyle: {
                            normal: {
                                color: function(params) {
                                    var colorList = [
                                        'rgb(203,155,255)',
                                        'rgb(149,162,255)',
                                        'rgb(58,186,255)',
                                        'rgb(119,168,249)',
                                        'rgb(235,161,159)'
                                    ];
                                    return colorList[params.dataIndex];
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

/* .el-row {
    margin-bottom: 20px;
} */

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
#searchBox {
    overflow: hidden;
}
.el-collapse-item /deep/ .el-collapse-item__header {
    height: 72px !important;
    padding-left: 20px !important;
}

.clearfix:after {
    /*伪元素是行内元素 正常浏览器清除浮动方法*/
    content: '';
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
}
.clearfix {
    *zoom: 1; /*ie6清除浮动的方式 *号只有IE6-IE7执行，其他浏览器不执行*/
}
.fu {
    position: relative;
}
.zi {
    position: absolute;
    top: 10;
    right: 0;
    width: 100px;
}
</style>
