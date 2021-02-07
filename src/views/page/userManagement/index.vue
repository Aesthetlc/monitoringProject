<template>
    <div>
        <div class="container">
            <div>
                <el-form ref="form" style="width:100%" inline :model="form" label-width="120px">
                    <div>
                        <el-form-item label="用户名">
                            <el-input v-model="form.userName" placeholder="请输入用户名"></el-input>
                        </el-form-item>
                        <el-form-item label="手机号">
                            <el-input v-model="form.phone" placeholder="请输入手机号"></el-input>
                        </el-form-item>
                        <el-form-item label="权限筛选">
                            <el-select v-model="form.power" placeholder="筛选条件">
                                <el-option v-for="item in powerArr" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="创建时间">
                            <div class="block">
                                <el-date-picker
                                    v-model="form.createTime"
                                    type="daterange"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                >
                                </el-date-picker>
                            </div>
                        </el-form-item>
                    </div>
                    <div style="text-align:right">
                        <el-form-item>
                            <el-button type="primary" @click="handleSearch('ruleForm')">搜索</el-button>
                            <el-button @click="resetForm('ruleForm')">重置</el-button>
                        </el-form-item>
                    </div>
                </el-form>
            </div>
            <el-button type="primary" icon="el-icon-plus" style="margin-bottom:10px" @click="addUser">添加</el-button>
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
                <el-table-column sortable="custom" type="index" label="序号" width="60" align="center"></el-table-column>
                <el-table-column sortable="custom" prop="userName" label="用户名" align="center"></el-table-column>
                <el-table-column sortable="custom" prop="name" label="姓名" align="center"></el-table-column>
                <el-table-column sortable="custom" prop="phone" label="手机号" align="center"></el-table-column>
                <el-table-column sortable="custom" prop="power" label="权限" align="center"></el-table-column>
                <el-table-column sortable="custom" prop="createTime" label="创建时间" align="center"></el-table-column>

                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" style="color:red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
        <el-dialog title="添加用户" :visible.sync="addUserFlag" width="35%" :before-close="handleCloseDialog">
            <add-user @closeAddUserDialog="closeAddUserDialog" ref="addUser"></add-user>
        </el-dialog>
    </div>
</template>

<script>
import { getUserAll, getUserCount, deleteUserById } from '@/api/user.js';
import addUser from '@/views/page/userManagement/addUser.vue';
export default {
    name: 'userManagement',
    data() {
        return {
            form: {
                userName: '', //用户名
                phone: '', //手机号
                power: [], //权限
                createTime: [], //报警事件创建时间
                pagenation: {
                    pageNum: 1,
                    pageSize: 5
                },
                sort: { field: 'id', type: 'ascending' } //排序
            },
            powerArr: [
                {
                    value: '0',
                    label: '用户'
                },
                {
                    value: '1',
                    label: '管理员'
                }
            ], //权限数组
            total: 5, // 总条数
            tableData: [], //表格数据
            addUserFlag: false,
            multipleSelection: [],
            delList: []
        };
    },
    components: {
        addUser
    },
    created() {
        //用户分页查询接口
        this.getUserAll(this.form);
        //报警事件总量查询
        let obj = JSON.parse(JSON.stringify(this.form));
        delete obj.sort;
        delete obj.pagenation;
        this.getUserCount(obj);
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
        'form.powerArr': {
            handler(newVal, oldVal) {
                console.log(newVal);
            }
        }
    },
    methods: {
        closeAddUserDialog() {
            this.addUserFlag = false;
        },
        // 关闭添加的弹窗
        handleCloseDialog() {
            this.addUserFlag = false;
        },
        //添加摄像头
        addUser() {
            this.addUserFlag = true;
            if (this.$refs.addUser) {
                this.$refs.addUser.$refs.formData.clearValidate();
                this.$refs.addUser.$refs.formData.resetFields();
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
        // 根据条件分页展示报警事件信息
        async getUserAll(obj) {
            let { data: res } = await getUserAll(obj);
            this.tableData = res;
        },
        //报警事件总量查询
        async getUserCount(obj) {
            let { data: res } = await getUserCount(obj);
            this.total = res.count || 5;
        },
        //重置表单
        resetForm() {
            console.log('resetForm');
        },
        // 触发搜索按钮
        handleSearch() {
            this.$set(this.form, 'pageNum', 1);
            this.getUserAll(this.form);
            let obj = JSON.parse(JSON.stringify(this.form));
            delete obj.sort;
            delete obj.pagenation;
            this.getUserCount(obj);
        },
        // 删除操作
        handleDelete(index, row) {
            this.$confirm('此操作将永久删除该条记录, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(async () => {
                    let { data: res } = await deleteUserById(row.id);
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
            this.getUserAll(this.form);
            let obj = JSON.parse(JSON.stringify(this.form));
            delete obj.sort;
            delete obj.pagenation;
            this.getUserCount(obj);
        },
        handleSizeChange(val) {
            this.$set(this.form, 'pageSize', val);
            this.getUserAll(this.form);
            let obj = JSON.parse(JSON.stringify(this.form));
            delete obj.sort;
            delete obj.pagenation;
            this.getUserCount(obj);
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
