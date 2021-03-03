<template>
    <div>
        <div class="container">
            <div>
                <el-form ref="form" class="demo-form-inline" inline :model="form" label-width="150px">
                    <el-collapse-transition>
                        <div v-show="showAll" id="searchBox">
                            <el-form-item label="摄像机ip" prop="ip">
                                <el-input style="width:100%" v-model="form.ip" placeholder="请输入摄像机ip"></el-input>
                            </el-form-item>
                            <el-form-item label="摄像机位置" prop="position">
                                <el-input style="width:100%" v-model="form.position" placeholder="请输入摄像机位置"></el-input>
                            </el-form-item>
                            <el-form-item label="摄像头筛选" prop="detectModelTypeArray">
                                <el-select style="width:100%" v-model="form.detectModelTypeArray" multiple placeholder="筛选条件">
                                    <el-option
                                        v-for="item in detectModelTypeArray"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                    >
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="开启状态" prop="stateArray">
                                <el-select style="width:100%" v-model="form.stateArray" multiple placeholder="筛选状态">
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
                        </div>
                    </el-collapse-transition>

                    <div style="text-align:right">
                        <el-form-item>
                            <el-button type="primary" @click="handleSearch('form')">搜索</el-button>
                            <el-button @click="resetForm('form')">重置</el-button>
                            <el-button type="text" style="margin-left:10px" id="closeSearchBtn" @click="closeSearch">
                                {{ word }}
                                <i :class="showAll ? 'el-icon-arrow-up ' : 'el-icon-arrow-down'"></i>
                            </el-button>
                        </el-form-item>
                    </div>
                </el-form>
            </div>
            <el-button type="primary" icon="el-icon-plus" style="margin-bottom:10px" @click="addCamera">添加</el-button>
            <el-button type="primary" icon="el-icon-plus" style="margin-bottom:10px" @click="batchAddCamera">批量添加</el-button>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
                @sort-change="sortChange"
                :default-sort="{ prop: 'id', order: 'ascending' }"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
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

                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" style="color:red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                        <el-button v-if="scope.row.state" type="text" @click="handleClose(scope.$index, scope.row)">停止</el-button>
                        <el-button v-if="!scope.row.state" type="text" @click="handleClose(scope.$index, scope.row)">启动</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    :page-sizes="[5, 10, 15, 20]"
                    layout="total, sizes, prev, pager, next, jumper"
                    :current-page="form.pageNum"
                    :page-pageSize="form.pageSize"
                    :total="total"
                    @current-change="handlePageChange"
                    @size-change="handleSizeChange"
                ></el-pagination>
            </div>
        </div>

        <!-- 添加弹出框 -->
        <el-dialog title="添加摄像头" :visible.sync="addCameraFlag" width="40%" :before-close="handleCloseDialog">
            <add-camera @closeAddCameraDialog="closeAddCameraDialog" ref="addCamera"></add-camera>
        </el-dialog>
    </div>
</template>

<script>
import animate from 'animate.css';
import { getAlertEventsState } from '@/api/alertEvents.js';
import { getDetectModelsTypes, getCamerasQuery, getCamerasCount, deleteCamerasById, updateCamerasState } from '@/api/cameraManagement.js'; //摄像头类型
import addCamera from '@/views/page/cameraManagement/addCamera.vue';
export default {
    name: 'cameraManagement',
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
            total: 0,
            stateArray: [], //状态  启动/关闭
            detectModelTypeArray: [], //摄像头检测模型
            addCameraFlag: false,
            tableData: [],
            multipleSelection: [],
            delList: [],
            showAll: false //是否展开全部
        };
    },
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
    mounted() {
        this.$nextTick(function() {
            this.closeSearch();
        });
    },
    components: {
        addCamera
    },
    created() {
        //摄像头分页查询接口
        let searchObj = JSON.parse(JSON.stringify(this.form));
        searchObj.createTime = {};
        this.getCamerasQuery(searchObj);
        //摄像头分页查询接口 总量
        let searchCountObj = JSON.parse(JSON.stringify(this.form));
        searchCountObj.createTime = {};
        let obj = JSON.parse(JSON.stringify(searchCountObj));
        delete obj.sort;
        delete obj.pagenation;
        this.getCamerasCount(obj);

        //检测模型类别查询接口
        this.getDetectModelsTypes();
        //获取所有状态信息，用于分类筛选
        this.getAlertEventsState();
    },
    watch: {
        'form.createTime': {
            handler(newVal, oldVal) {
                let obj = {};
                // obj.startTime = timeFormat(newVal[0]);
                // obj.endTime = timeFormat(newVal[1]);
                // console.log(obj);
                obj.startTime = this.$util.timestampToDateTime(newVal[0]);
                obj.endTime = this.$util.timestampToDateTime(newVal[1]);
                console.log(obj);
            }
        },
        'form.detectModelTypeArray': {
            handler(newVal, oldVal) {
                console.log(newVal);
            }
        },
        'form.stateArray': {
            handler(newVal, oldVal) {
                console.log(newVal);
            }
        }
    },
    methods: {
        closeSearch() {
            this.showAll = !this.showAll;
            var searchBoxHeght = document.getElementById('searchBox');
            var bbb = document.getElementById('aaa');
            if (this.showAll == false) {
                searchBoxHeght.style.height = 50 + 'px';
            } else {
                searchBoxHeght.style.height = 'auto';
            }
        },
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
        //表格时间转换 --0227
        dateFormat(row, column) {
            const date = this.$util.standardToDateTime(row.createTime);
            return date;
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
        //添加摄像头
        addCamera() {
            this.addCameraFlag = true;
            if (this.$refs.addCamera) {
                this.$refs.addCamera.$refs.ruleForm.clearValidate();
                this.$refs.addCamera.$refs.ruleForm.resetFields();
            }
        },
        // 关闭添加的弹窗
        closeAddCameraDialog() {
            this.addCameraFlag = false;
            this.resetForm('form');
        },
        // 关闭添加的弹窗
        handleCloseDialog() {
            this.addCameraFlag = false;
        },
        // 删除操作
        handleDelete(index, row) {
            this.$confirm('此操作将永久删除该条记录, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(async () => {
                    let res = await deleteCamerasById(row.id);
                    if (res.code == 0) {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.resetForm('form');
                    } else {
                        //code 1 摄像头删除失败
                        //code 2 系统错误
                        this.$message.error(res.content);
                    }
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
        },
        // (启动/关闭) 操作
        handleClose(index, row) {
            let mes = '';
            if (row.state) {
                mes = '停止';
            } else if (!row.state) {
                mes = '启动';
            }
            this.$confirm(`您是否要${mes}该条记录?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(async () => {
                    let closeObj = {
                        state: row.state,
                        operator: row.state === true ? 'stop' : 'start'
                    };
                    let res = await updateCamerasState(closeObj, row.id);
                    if (res.code == 0) {
                        this.$message({
                            type: 'success',
                            message: `${mes}成功!`
                        });
                        this.resetForm('form');
                    } else {
                        //code 1  摄像头信息查询失败
                        //code 2 系统错误
                        this.$message.error(res.content);
                    }
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消操作'
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

        //批量添加摄像头
        batchAddCamera() {},
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        }
        // delAllSelection() {
        //     const length = this.multipleSelection.length;
        //     let str = '';
        //     this.delList = this.delList.concat(this.multipleSelection);
        //     for (let i = 0; i < length; i++) {
        //         str += this.multipleSelection[i].name + ' ';
        //     }
        //     this.$message.error(`删除了${str}`);
        //     this.multipleSelection = [];
        // },
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

#searchBox {
    overflow: hidden;
}
</style>
