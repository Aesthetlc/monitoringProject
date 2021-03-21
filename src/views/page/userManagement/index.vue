<template>
    <div>
        <div class="container">
            <div>
                <el-form ref="form" class="demo-form-inline" inline :model="form" label-width="90px">
                    <el-form-item label="用户名" prop="username">
                        <el-input style="width:150px" v-model="form.username" placeholder="请输入用户名"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号" prop="mobilephone">
                        <el-input style="width:150px" v-model="form.mobilephone" placeholder="请输入手机号"></el-input>
                    </el-form-item>
                    <el-form-item label="权限筛选" prop="roleid">
                        <el-select style="width:150px" v-model="form.roleid" placeholder="筛选条件">
                            <el-option v-for="item in powerArr" :key="item.id" :label="item.rolename" :value="item.id"> </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="创建时间" prop="createTime">
                        <div class="block">
                            <el-date-picker
                                style="width:100%"
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
                </el-form>
            </div>
            <el-button type="primary" icon="el-icon-plus" style="margin-bottom:10px" @click="addUser" v-has="{ role: ['admin'] }"
                >添加</el-button
            >
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
                <el-table-column label="序号" width="60" align="center">
                    <template slot-scope="scope">
                        <span>{{ scope.$index + (form.pagenation.pageNum - 1) * form.pagenation.pageSize + 1 }} </span>
                    </template>
                </el-table-column>
                <el-table-column prop="username" label="用户名" align="center"></el-table-column>
                <el-table-column prop="fullname" label="姓名" align="center"></el-table-column>
                <el-table-column prop="mobilephone" label="手机号" align="center"></el-table-column>
                <el-table-column prop="user_role_id" label="权限" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.user_role_id == 1">管理员</span>
                        <span v-else-if="scope.row.user_role_id == 2">普通用户</span>
                        <span v-else>未知</span>
                    </template>
                </el-table-column>
                <el-table-column
                    sortable="custom"
                    :formatter="dateFormat"
                    prop="create_time"
                    label="创建时间"
                    align="center"
                ></el-table-column>

                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="text" style="color:red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
        <el-dialog :title="title" :visible.sync="addUserFlag" width="35%" :before-close="handleCloseDialog">
            <add-user @closeAddUserDialog="closeAddUserDialog" :editUserObj="editUserObj" ref="addUser"></add-user>
        </el-dialog>
    </div>
</template>

<script>
import { getUserAll, deleteUserById, getUserRoles } from '@/api/user.js';
import addUser from '@/views/page/userManagement/addUser.vue';
export default {
    name: 'userManagement',
    data() {
        return {
            form: {
                username: '', //用户名
                mobilephone: '', //手机号
                createTime: [], //报警事件创建时间
                pagenation: {
                    pageNum: 1,
                    pageSize: 10
                },
                sort: { field: 'create_time', type: 'asc' }, //排序
                roleid: '' //权限
            },
            powerArr: [], //权限数组
            total: 0, // 总条数
            tableData: [], //表格数据
            title: '',
            editUserObj: {}, //编辑用户
            addUserFlag: false,
            multipleSelection: [],
            delList: []
        };
    },
    components: {
        addUser
    },
    created() {
        let searchObj = JSON.parse(JSON.stringify(this.form));
        searchObj.createTime = {};
        //用户分页查询接口
        this.getUserAll(searchObj);

        //获取权限列表
        this.getUserRoles();
    },
    watch: {
        'form.createTime': {
            handler(newVal) {
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
            handler(newVal) {
                console.log(newVal);
            }
        }
    },
    methods: {
        //获取权限列表
        async getUserRoles() {
            let res = await getUserRoles();
            if (res.code == 0) {
                this.powerArr = res.detail;
            } else {
                // code 1
                this.$error.message(res.content);
            }
        },
        // 根据条件分页展示用户信息   --0227
        async getUserAll(obj) {
            let res = await getUserAll(obj);
            if (res.code == 0) {
                this.tableData = res.detail;
                this.total = res.totalCounts;
            } else {
                //code 1
                this.$error.message(res.content);
            }
        },
        //表格时间转换 --0227
        dateFormat(row) {
            const date = this.$util.standardToDateTime(row.create_time);
            return date;
        },
        // 触发搜索按钮  --0227
        handleSearch() {
            this.$set(this.form.pagenation, 'pageNum', 1);
            let searchObj = JSON.parse(JSON.stringify(this.form));
            let tempObj = {};
            tempObj.startTime = this.$util.timestampToDateTime(searchObj.createTime[0]);
            tempObj.endTime = this.$util.timestampToDateTime(searchObj.createTime[1]);
            searchObj.createTime = tempObj;
            this.getUserAll(searchObj);
        },
        //重置表单 --0227
        resetForm(formName) {
            this.$refs[formName].resetFields();
            let searchObj = JSON.parse(JSON.stringify(this.form));
            searchObj.createTime = {};
            this.getUserAll(searchObj);
        },
        //添加用户  --0227
        addUser() {
            this.addUserFlag = true;
            this.title = '添加用户';
            if (this.$refs.addUser) {
                this.$refs.addUser.$refs.ruleForm.clearValidate();
                this.$refs.addUser.$refs.ruleForm.resetFields();
            }
        },
        // 添加成功之后关闭弹窗
        closeAddUserDialog() {
            this.addUserFlag = false;
            this.resetForm('form');
        },
        // 关闭添加的弹窗
        handleCloseDialog() {
            this.addUserFlag = false;
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
            }
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.form.pagenation, 'pageNum', val);
            let searchObj = JSON.parse(JSON.stringify(this.form));
            let tempObj = {};
            tempObj.startTime = this.$util.timestampToDateTime(searchObj.createTime[0]);
            tempObj.endTime = this.$util.timestampToDateTime(searchObj.createTime[1]);
            searchObj.createTime = tempObj;
            this.getUserAll(searchObj);
        },
        handleSizeChange(val) {
            this.$set(this.form.pagenation, 'pageSize', val);
            let searchObj = JSON.parse(JSON.stringify(this.form));
            let tempObj = {};
            tempObj.startTime = this.$util.timestampToDateTime(searchObj.createTime[0]);
            tempObj.endTime = this.$util.timestampToDateTime(searchObj.createTime[1]);
            searchObj.createTime = tempObj;
            this.getUserAll(searchObj);
        },
        // 删除操作
        handleDelete(index, row) {
            this.$confirm('此操作将永久删除该条用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(async () => {
                    let res = await deleteUserById(row.id);
                    if (res.code === '0') {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.resetForm('form');
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
        //编辑操作
        handleEdit(index, row) {
            this.editUserObj = row;
            this.addUserFlag = true;
            this.title = '编辑用户';
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
