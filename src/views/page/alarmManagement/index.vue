<template>
    <div>
        <div class="container">
            <div>
                <el-form ref="form" class="demo-form-inline" inline :model="form" label-width="90px">
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
                    <!-- 实时监控 判断点 -->
                    <el-form-item v-if="type !== 'realTimeMonitoring'" label="开启状态" prop="stateArray">
                        <el-select style="width:150px" v-model="form.stateArray" multiple placeholder="筛选状态">
                            <el-option v-for="item in stateArray" :key="item.value" :label="item.label" :value="item.value"> </el-option>
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
                        <!-- 实时监控 判断点 -->
                        <el-button v-if="type === 'realTimeMonitoring'" type="primary" @click="setRequestTime()">设置时间</el-button>
                        <el-button type="primary" @click="handleSearch('form')">搜索</el-button>
                        <el-button @click="resetForm('form')">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <!-- 实时监控 判断点 -->
            <echart
                v-if="type === 'realTimeMonitoring'"
                :isAxisChart="true"
                :chartData="echartData.alarmingTrend"
                style="height:200px;width:100%"
            ></echart>
            <el-button type="danger" icon="el-icon-close" style="margin-bottom:10px" @click="delAllSelection" v-has="{ role: ['admin'] }"
                >批量删除</el-button
            >
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
                :default-sort="{ prop: 'id', order: 'asc' }"
            >
                <el-table-column :reserve-selection="true" type="selection" width="55" align="center"></el-table-column>
                <el-table-column label="ID" width="60" align="center">
                    <template slot-scope="scope">
                        <span>{{ scope.$index + (form.pagenation.pageNum - 1) * form.pagenation.pageSize + 1 }} </span>
                    </template>
                </el-table-column>
                <el-table-column sortable="custom" prop="importance" label="重要度" width="90" align="center">
                    <template slot-scope="scope">
                        <!-- <el-color-picker disabled v-model="scope.row.color"></el-color-picker> -->
                        <!-- <div class="stateStyle" :style="{'backgroundColor':scope.row.color}"></div> -->
                        <el-tooltip class="item" effect="dark" :content="scope.row.level_name" placement="right">
                            <div class="icon iconfont icon-circle" :style="{ color: scope.row.color }"></div>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column prop="ip" label="摄像机ip" align="center"></el-table-column>
                <el-table-column prop="position" label="摄像机位置" align="center"></el-table-column>
                <el-table-column prop="detectModelType" label="类别" align="center"></el-table-column>
                <el-table-column
                    sortable="custom"
                    prop="create_time"
                    label="报警时间"
                    align="center"
                    :formatter="dateFormat"
                ></el-table-column>

                <el-table-column label="概览图1" align="center">
                    <template slot-scope="scope">
                        <el-image class="table-td-thumb" :src="scope.row.pic_url" :preview-src-list="[scope.row.pic_url]"></el-image>
                    </template>
                </el-table-column>

                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <!-- <el-button type="text" @click="handleEdit(scope.$index, scope.row)">详情</el-button> -->
                        <el-button v-has="{ role: ['admin'] }" type="text" style="color:red" @click="handleDelete(scope.$index, scope.row)"
                            >删除</el-button
                        >
                        <el-button v-if="scope.row.state" type="text" @click="handleClose(scope.$index, scope.row)">关闭</el-button>
                    </template>
                </el-table-column>
            </el-table>
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

        <!-- 添加弹出框 -->
        <el-dialog title="设置请求时间" :visible.sync="setRequestTimeFlag" width="30%" :before-close="handleCloseDialog">
            <setRequestTime @closeSetTimeDialog="closeSetTimeDialog" ref="setRequestTime"></setRequestTime>
        </el-dialog>
    </div>
</template>

<script>
import {
    getAlertEventsState,
    getAlertEventsQuery,
    deleteAlertEventsById,
    closeAlertEventsById,
    deleteAlertEventsByArr,
    querySymbolSize
} from '@/api/alertEvents.js';
import { getDetectModelsTypes } from '@/api/cameraManagement.js'; //摄像头类型
import Echart from '@/components/common/Echart';
import setRequestTime from '@/views/page/alarmManagement/setRequestTime.vue';
import { mapState } from 'vuex';
export default {
    name: 'alarmManagement',
    data() {
        return {
            form: {
                ip: '', //摄像头ip地址
                position: '', //摄像头位置
                stateArray: [], //报警事件开启状态
                detectModelTypeArray: [], //摄像头检测模型
                createTime: [], //报警事件创建时间
                sort: { field: 'id', type: 'asc' }, //排序
                pagenation: {
                    pageNum: 1,
                    pageSize: 10
                }
            },
            total: 0,
            stateArray: [], //状态  启动/关闭
            detectModelTypeArray: [], //摄像头检测模型
            tableData: [],
            multipleSelection: [],
            delList: [],
            id: -1,
            alarmingTrendData: {
                x: [],
                data: []
            },
            linshi: {},
            echartData: {
                alarmingTrend: {}
            },
            setRequestTimeFlag: false, //请求时间弹窗开关
            interval: null //请求刷新定时器
        };
    },
    props: {
        type: {
            type: String,
            default: ''
        }
    },
    components: {
        Echart,
        setRequestTime
    },
    computed: {
        ...mapState(['refreshBlank'])
    },
    created() {
        //获取所有状态信息，用于分类筛选
        this.getAlertEventsState();
        //根据条件分页展示报警事件信息
        let searchObj = JSON.parse(JSON.stringify(this.form));
        searchObj.createTime = {};
        this.getAlertEventsQuery(searchObj);

        //报警事件总量查询
        // let obj = JSON.parse(JSON.stringify(this.form));
        // delete obj.sort;
        // delete obj.pagenation;
        // this.getAlertEventsCount(obj);

        //检测模型类别查询接口
        this.getDetectModelsTypes();

        if (this.type === 'realTimeMonitoring') {
            let symbolSizeObj = JSON.parse(JSON.stringify(this.form));
            symbolSizeObj.createTime = {};
            symbolSizeObj.detectModelTypeArray = [1];
            delete symbolSizeObj.sort;
            delete symbolSizeObj.pagenation;
            //获取symbolSize图表
            this.querySymbolSize(symbolSizeObj);
        }
    },
    watch: {
        // createTime: {
        //     handler(newVal) {
        //         let obj = {};
        //         // obj.startTime = timeFormat(newVal[0]);
        //         // obj.endTime = timeFormat(newVal[1]);
        //         // console.log(obj);
        //         obj.startTime = this.$util.timestampToDateTime(newVal[0]);
        //         obj.endTime = this.$util.timestampToDateTime(newVal[1]);
        //         this.form.createTime = obj;
        //     }
        // },
        'form.detectModelTypeArray': {
            handler(newVal) {
                console.log(newVal);
            }
        },
        'form.stateArray': {
            handler(newVal) {
                console.log(newVal);
            }
        },
        refreshBlank(newVal) {
            let time = Number(newVal);
            this.interval = setInterval(() => {
                this.resetForm('form');
            }, time * 1000);
        }
    },
    mounted() {},
    methods: {
        // 获取实时监控symbolsize图标
        async querySymbolSize(obj) {
            let { detail: res } = await querySymbolSize(obj);
            res.series.forEach(item => {
                this.alarmingTrendData.x.push(item.name);
                this.alarmingTrendData.data.push(item.value);
            });
            this.echartData.alarmingTrend = this.drawEchart(this.alarmingTrendData.data, this.alarmingTrendData.x);
        },
        // 关闭设置请求时间弹窗
        closeSetTimeDialog() {
            this.setRequestTimeFlag = false;
        },
        // 关闭弹窗设置请求时间
        handleCloseDialog() {
            this.setRequestTimeFlag = false;
        },
        // 设置请求时间
        setRequestTime() {
            this.setRequestTimeFlag = true;
            if (this.$refs.setRequestTime) {
                this.$refs.setRequestTime.$refs.timeForm.resetFields();
            }
        },
        //echart
        drawEchart(data, x) {
            var option = {
                color: ['#3398DB'],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        data: x
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: '总量',
                        type: 'effectScatter',
                        color: '#f00',
                        symbolSize: function(data) {
                            if (data > 50) {
                                return 50;
                            } else {
                                return data;
                            }
                        },
                        data: data
                    }
                ]
            };
            return option;
        },
        //排序
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
                this.getAlertEventsQuery(searchObj);
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
        // 根据条件分页展示报警事件信息 --0227
        async getAlertEventsQuery(obj) {
            // 实时监控 判断点
            if (this.type === 'realTimeMonitoring') {
                obj.stateArray = [true];
            }
            let res = await getAlertEventsQuery(obj);
            if (res.code == 0) {
                this.tableData = res.detail;
                this.total = res.totalCounts || 0;
            } else if (res.code == 1) {
                this.$message.error('查询失败');
            }
        },
        //表格时间转换 --0227
        dateFormat(row) {
            const date = this.$util.standardToDateTime(row.create_time);
            return date;
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
        //重置表单
        resetForm(formName) {
            this.$refs[formName].resetFields();
            let searchObj = JSON.parse(JSON.stringify(this.form));
            searchObj.createTime = {};
            this.getAlertEventsQuery(searchObj);
        },
        // 触发搜索按钮
        handleSearch() {
            this.$set(this.form.pagenation, 'pageNum', 1);
            let searchObj = JSON.parse(JSON.stringify(this.form));
            let tempObj = {};
            tempObj.startTime = this.$util.timestampToDateTime(searchObj.createTime[0]);
            tempObj.endTime = this.$util.timestampToDateTime(searchObj.createTime[1]);
            searchObj.createTime = tempObj;
            this.getAlertEventsQuery(searchObj);
            // let obj = JSON.parse(JSON.stringify(this.form)); /// ??????  这个总量有什么用？
            // delete obj.sort;
            // delete obj.pagenation;
            // this.getAlertEventsCount(obj);

            // 获取图表
            if (this.type === 'realTimeMonitoring') {
                let symbolSizeObj = JSON.parse(JSON.stringify(this.form));
                symbolSizeObj.createTime = {};
                symbolSizeObj.detectModelTypeArray = [1];
                delete symbolSizeObj.sort;
                delete symbolSizeObj.pagenation;
                //获取symbolSize图表
                this.querySymbolSize(symbolSizeObj);
            }
        },
        // 关闭操作
        handleClose(index, row) {
            this.$confirm('您是否要关闭该摄像头警告?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(async () => {
                    let closeObj = {
                        state: row.state,
                        operator: 'stop'
                    };
                    let res = await closeAlertEventsById(closeObj, row.id);
                    if (res.code == 0) {
                        this.$message({
                            type: 'success',
                            message: '摄像头关闭成功!'
                        });

                        this.resetForm('form');
                    } else if (res.code == 1) {
                        //摄像头关闭失败
                        this.$message.error(res.content);
                    }
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消关闭操作'
                    });
                });
        },
        // 删除操作
        handleDelete(index, row) {
            this.$confirm('此操作将永久删除该条记录, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(async () => {
                    let res = await deleteAlertEventsById(row.id);
                    if (res.code == 0) {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        // this.tableData.splice(index, 1);
                        this.resetForm('form');
                    } else if (res.code == 1) {
                        //删除失败
                        this.$message.error('删除失败');
                    }
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
        },
        // 分页
        handlePageChange(val) {
            this.$set(this.form.pagenation, 'pageNum', val);
            let searchObj = JSON.parse(JSON.stringify(this.form));
            let tempObj = {};
            tempObj.startTime = this.$util.timestampToDateTime(searchObj.createTime[0]);
            tempObj.endTime = this.$util.timestampToDateTime(searchObj.createTime[1]);
            searchObj.createTime = tempObj;
            this.getAlertEventsQuery(searchObj);
            // let obj = JSON.parse(JSON.stringify(this.form)); /// ??????  这个总量有什么用？
            // delete obj.sort;
            // delete obj.pagenation;
            // this.getAlertEventsCount(obj);
        },
        handleSizeChange(val) {
            this.$set(this.form.pagenation, 'pageSize', val);
            let searchObj = JSON.parse(JSON.stringify(this.form));
            let tempObj = {};
            tempObj.startTime = this.$util.timestampToDateTime(searchObj.createTime[0]);
            tempObj.endTime = this.$util.timestampToDateTime(searchObj.createTime[1]);
            searchObj.createTime = tempObj;
            this.getAlertEventsQuery(searchObj);
            // let obj = JSON.parse(JSON.stringify(this.form));/// ??????  这个总量有什么用？
            // delete obj.sort;
            // delete obj.pagenation;
            // this.getAlertEventsCount(obj);
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        async delAllSelection() {
            const length = this.multipleSelection.length;
            if (length > 0) {
                this.$confirm('此操作将永久删除选中的记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(async () => {
                        let delArr = [];
                        this.delList = this.delList.concat(this.multipleSelection);
                        for (let i = 0; i < length; i++) {
                            delArr.push(this.multipleSelection[i].id);
                        }
                        let res = await deleteAlertEventsByArr({
                            idsArray: delArr
                        });
                        if (res.code == 0) {
                            this.$message({
                                type: 'success',
                                message: '批量删除成功!'
                            });
                            this.multipleSelection = [];
                            this.resetForm('form');
                        } else if (res.code == 1) {
                            //删除失败
                            this.$message.error('批量删除失败');
                        }
                    })
                    .catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });
            } else {
                this.$message({
                    message: '请选择数据后再进行此操作',
                    type: 'warning'
                });
            }
        }
    },
    // keep-alive  进入
    activated() {
        if (this.type === 'realTimeMonitoring') {
            this.interval = setInterval(() => {
                this.resetForm('form');
            }, this.refreshBlank * 1000);
        }
    },
    // keep-alive  离开
    deactivated() {
        if (this.type === 'realTimeMonitoring') {
            clearInterval(this.interval);
            this.interval = null;
        }
    }
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}

/* ::v-deep .el-form-item label:after {
        content: " ";
        display: inline-block;
        width: 100%;
    }

     ::v-deep .el-form-item__label {
        text-align: justify
    } */
/* 这里去除必选字段的*,这个符号会造成一定影响,去掉之后我用了li列表进行定位,在前面加上" * ". */
/* ::v-deep .el-form-item.is-required .el-form-item__label:before {
        content: none !important;
    } */
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
.stateStyle {
    height: 20px;
    width: 20px;
    margin: 0 auto;
    border-radius: 50%;
}
</style>
