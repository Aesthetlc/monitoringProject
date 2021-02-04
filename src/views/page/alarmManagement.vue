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
                    <el-form-item style="width:24%" label="开启状态">
                        <el-select v-model="form.stateArray" multiple placeholder="筛选状态">
                            <el-option v-for="item in stateArray" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item style="width:24%" label="摄像头检测模型">
                        <el-select  v-model="form.detectModelTypeArray" multiple placeholder="筛选模型">
                            <el-option v-for="item in detectModelTypeArray" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
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
            <el-button type="danger" icon="el-icon-close" style="margin-bottom:10px" @click="delAllSelection">批量删除</el-button>
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
                <el-table-column sortable="custom" prop="id" label="ID" width="60" align="center"></el-table-column>
                <el-table-column sortable="custom" prop="ip" label="摄像机ip" align="center"></el-table-column>
                <el-table-column sortable="custom" prop="position" label="摄像机位置" align="center"></el-table-column>
                <el-table-column sortable="custom" prop="detectModelType" label="类型" align="center"></el-table-column>
                <el-table-column sortable="custom" prop="createTime" label="报警时间" align="center"></el-table-column>

                <el-table-column label="缩略图" align="center">
                    <template slot-scope="scope">
                        <el-image class="table-td-thumb" :src="scope.row.thumb" :preview-src-list="[scope.row.thumb]"></el-image>
                    </template>
                </el-table-column>

                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <!-- <el-button type="text" @click="handleEdit(scope.$index, scope.row)">详情</el-button> -->
                        <el-button type="text" style="color:red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                        <el-button v-if="scope.row.state" type="text" @click="handleClose(scope.$index, scope.row)">关闭</el-button>
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

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form1" label-width="70px">
                <el-form-item label="ip">
                    <el-input v-model="form1.ip"></el-input>
                </el-form-item>
                <el-form-item label="地址">
                    <el-input v-model="form1.position"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {
    getAlertEventsState,
    getAlertEventsQuery,
    getAlertEventsCount,
    deleteAlertEventsById,
    closeAlertEventsById
} from '@/api/alertEvents.js';
import { getDetectModelsTypes } from '@/api/cameraManagement.js'; //摄像头类型
import { timeFormat } from '@/utils/tool.js';
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
                sort: { field: 'id', type: 'ascending' }, //排序
                pagenation: {
                    pageNum: 1,
                    pageSize: 5
                }
            },
            total: 5,
            stateArray: [], //状态  启动/关闭
            detectModelTypeArray: [], //摄像头检测模型
            form1: {}, //弹窗对象form
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            idx: -1,
            id: -1
        };
    },
    created() {
        //获取所有状态信息，用于分类筛选
        this.getAlertEventsState();
        //根据条件分页展示报警事件信息
        this.getAlertEventsQuery(this.form);
        //报警事件总量查询
        let obj = JSON.parse(JSON.stringify(this.form));
        delete obj.sort;
        delete obj.pagenation;
        this.getAlertEventsCount(obj);
        //检测模型类别查询接口
        this.getDetectModelsTypes();
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
        async getAlertEventsQuery(obj) {
            let { data: res } = await getAlertEventsQuery(obj);
            this.tableData = res;
        },
        //报警事件总量查询
        async getAlertEventsCount(obj) {
            let { data: res } = await getAlertEventsCount(obj);
            this.total = res.count || 5;
        },
        //重置表单
        resetForm() {
            console.log('resetForm');
        },
        // 触发搜索按钮
        handleSearch() {
            this.$set(this.form, 'pageNum', 1);
            this.getAlertEventsQuery(this.form);
            let obj = JSON.parse(JSON.stringify(this.form));
            delete obj.sort;
            delete obj.pagenation;
            this.getAlertEventsCount(obj);
        },
        // 删除操作
        handleDelete(index, row) {
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(async () => {
                    let { data: res } = await deleteAlertEventsById(row.id);
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
        // 删除操作
        handleClose(index, row) {
            this.$confirm('您是否要关闭该事件警告?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(async () => {
                    let closeObj = {
                        state: true,
                        operator: 'stop'
                    };
                    let { data: res } = await closeAlertEventsById(closeObj, row.id);
                    if (res.result === 'success') {
                        this.$message({
                            type: 'success',
                            message: '关闭成功!'
                        });
                    } else {
                        this.$message.error('关闭失败');
                    }
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消关闭'
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
        // 编辑操作
        handleEdit(index, row) {
            this.idx = index;
            this.form1 = row;
            this.editVisible = true;
        },
        // 保存编辑
        saveEdit() {
            this.editVisible = false;
            this.$message.success(`修改第 ${this.idx + 1} 行成功`);
            this.$set(this.tableData, this.idx, this.form);
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.form, 'pageNum', val);
            this.getAlertEventsQuery(this.form);
            let obj = JSON.parse(JSON.stringify(this.form));
            delete obj.sort;
            delete obj.pagenation;
            this.getAlertEventsCount(obj);
        },
        handleSizeChange(val) {
            this.$set(this.form, 'pageSize', val);
            this.getAlertEventsQuery(this.form);
            let obj = JSON.parse(JSON.stringify(this.form));
            delete obj.sort;
            delete obj.pagenation;
            this.getAlertEventsCount(obj);
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
    font-pagesize: 14px;
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
