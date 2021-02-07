<template>
    <div>
        <div class="container">
            <div>
                <el-form ref="form" style="width:100%" inline :model="form" label-width="120px">
                    <el-form-item style="width:24%" label="摄像机ip">
                        <el-input v-model="form.ip" placeholder="请输入摄像机ip"></el-input>
                    </el-form-item>
                    <el-form-item style="width:24%" label="摄像机位置">
                        <el-input v-model="form.position" placeholder="请输入摄像机位置"></el-input>
                    </el-form-item>
                    <el-form-item style="width:24%" label="摄像头筛选">
                        <el-select v-model="form.detectModelTypeArray" multiple placeholder="筛选条件">
                            <el-option v-for="item in detectModelTypeArray" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item style="width:24%" label="开启状态">
                        <el-select v-model="form.stateArray" multiple placeholder="筛选状态">
                            <el-option v-for="item in stateArray" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="报警时间">
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

                    <el-form-item>
                        <el-button type="primary" @click="handleSearch('ruleForm')">搜索</el-button>
                        <el-button @click="resetForm('ruleForm')">重置</el-button>
                    </el-form-item>
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
                <el-table-column sortable="custom" type="index" label="ID" width="60" align="center"></el-table-column>
                <el-table-column sortable="custom" prop="ip" label="摄像机ip" align="center"></el-table-column>
                <el-table-column sortable="custom" prop="position" label="摄像机位置" align="center"></el-table-column>
                <el-table-column sortable="custom" prop="detectModelType" label="类别" align="center"></el-table-column>
                <el-table-column sortable="custom" prop="state" label="状态" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.state">启动</span>
                        <span v-else>停止</span>
                    </template>
                </el-table-column>
                <el-table-column sortable="custom" prop="createTime" label="创建时间" align="center"></el-table-column>

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
                    @pageSize-change="handleSizeChange"
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
                    pageSize: 5
                },
                sort: { field: 'id', type: 'ascending' } //排序
            },
            total: 5,
            stateArray: [], //状态  启动/关闭
            detectModelTypeArray: [], //摄像头检测模型
            addCameraFlag: false,
            tableData: [],
            multipleSelection: [],
            delList: []
        };
    },
    components: {
        addCamera
    },
    created() {
        //摄像头分页查询接口
        this.getCamerasQuery(this.form);
        //检测模型类别查询接口
        this.getDetectModelsTypes();
        //获取所有状态信息，用于分类筛选
        this.getAlertEventsState();
        //报警事件总量查询
        let obj = JSON.parse(JSON.stringify(this.form));
        delete obj.sort;
        delete obj.pagenation;
        this.getCamerasCount(obj);
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
        closeAddCameraDialog() {
            this.addCameraFlag = false;
        },
        // 关闭添加的弹窗
        handleCloseDialog() {
            this.addCameraFlag = false;
        },
        //添加摄像头
        addCamera() {
            this.addCameraFlag = true;
            if (this.$refs.addCamera) {
                this.$refs.addCamera.$refs.ruleForm.clearValidate();
                this.$refs.addCamera.$refs.ruleForm.resetFields();
            }
        },
        //批量添加摄像头
        batchAddCamera() {},
        //排序
        sortChange(column) {
            if (column.order !== null) {
                this.form.sort.field = column.prop;
                if (column.order === 'descending') {
                    this.form.sort.type = 'desc';
                } else if (column.order === 'ascending') {
                    this.form.sort.type = 'asc';
                }
            }
        },
        //获取所有状态信息，用于分类筛选
        async getAlertEventsState() {
            let { data: res } = await getAlertEventsState();
            res.forEach(item => {
                this.stateArray.push({
                    value: item.code,
                    label: item.name
                });
            });
        },
        //摄像头检测模型
        async getDetectModelsTypes() {
            let { data: res } = await getDetectModelsTypes();
            res.forEach(item => {
                this.detectModelTypeArray.push({
                    value: item.code,
                    label: item.name
                });
            });
        },
        // 根据条件分页展示报警事件信息
        async getCamerasQuery(obj) {
            let { data: res } = await getCamerasQuery(obj);
            this.tableData = res;
        },
        //报警事件总量查询
        async getCamerasCount(obj) {
            let { data: res } = await getCamerasCount(obj);
            this.total = res.count || 5;
        },
        //重置表单
        resetForm() {
            console.log('resetForm');
        },
        // 触发搜索按钮
        handleSearch() {
            this.$set(this.form, 'pageNum', 1);
            this.getCamerasQuery(this.form);
            let obj = JSON.parse(JSON.stringify(this.form));
            delete obj.sort;
            delete obj.pagenation;
            this.getCamerasCount(obj);
        },
        // 删除操作
        handleDelete(index, row) {
            this.$confirm('此操作将永久删除该条记录, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(async () => {
                    let { data: res } = await deleteCamerasById(row.id);
                    if (res.result === 'success') {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.tableData.splice(index, 1);
                    } else {
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
                        operator: mes === '停止' ? false : true
                    };
                    let { data: res } = await updateCamerasState(closeObj, row.id);
                    if (res.result === 'success') {
                        this.$message({
                            type: 'success',
                            message: '更新成功!'
                        });
                    } else {
                        this.$message.error('更新失败');
                    }
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消操作'
                    });
                });
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        delAllSelection() {
            const length = this.multipleSelection.length;
            let str = '';
            this.delList = this.delList.concat(this.multipleSelection);
            for (let i = 0; i < length; i++) {
                str += this.multipleSelection[i].name + ' ';
            }
            this.$message.error(`删除了${str}`);
            this.multipleSelection = [];
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.form, 'pageNum', val);
            this.getCamerasQuery(this.form);
            let obj = JSON.parse(JSON.stringify(this.form));
            delete obj.sort;
            delete obj.pagenation;
            this.getCamerasCount(obj);
        },
        handleSizeChange(val) {
            this.$set(this.form, 'pageSize', val);
            this.getCamerasQuery(this.form);
            let obj = JSON.parse(JSON.stringify(this.form));
            delete obj.sort;
            delete obj.pagenation;
            this.getCamerasCount(obj);
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
</style>
