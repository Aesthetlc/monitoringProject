<template>
    <div>
        <div class="container">
            <div>
                <el-form ref="form" inline :model="form" label-width="100px">
                    <el-form-item label="摄像机ip">
                        <el-input v-model="form.ip" placeholder="请输入摄像机ip"></el-input>
                    </el-form-item>
                    <el-form-item label="摄像机位置">
                        <el-input v-model="form.address" placeholder="请输入摄像机位置"></el-input>
                    </el-form-item>
                    <el-form-item label="报警筛选">
                        <el-select v-model="form.warn" placeholder="筛选条件">
                            <el-option label="警告1" value="jinggao1"></el-option>
                            <el-option label="警告2" value="jinggao2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="报警时间">
                        <div class="block">
                            <el-date-picker
                                v-model="form.time"
                                type="daterange"
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
            <el-button type="primary" icon="el-icon-close" style="margin-bottom:10px" @click="delAllSelection">批量关闭</el-button>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="ip" label="摄像机ip" align="center"></el-table-column>
                <el-table-column prop="address" label="摄像机位置" align="center"></el-table-column>
                <el-table-column prop="type" label="类型" align="center"></el-table-column>
                <el-table-column prop="warnTime" label="报警时间" align="center"></el-table-column>

                <el-table-column label="缩略图" align="center">
                    <template slot-scope="scope">
                        <el-image class="table-td-thumb" :src="scope.row.thumb" :preview-src-list="[scope.row.thumb]"></el-image>
                    </template>
                </el-table-column>

                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" @click="handleEdit(scope.$index, scope.row)">详情</el-button>
                        <el-button type="text" @click="handleDelete(scope.$index, scope.row)">关闭</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    :page-sizes="[5, 10, 15, 20]"
                    layout="total, sizes, prev, pager, next, jumper"
                    :current-page="pages.limit"
                    :page-size="pages.size"
                    :total="pages.total"
                    @current-change="handlePageChange"
                    @size-change="handleSizeChange"
                ></el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="用户名">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="地址">
                    <el-input v-model="form.address"></el-input>
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
import { fetchData } from '../../api/index';
import { timeFormat } from '@/utils/tool.js';
export default {
    name: 'alarmManagement',
    data() {
        return {
            form: {
                ip: '',
                address: '',
                warn: 1,
                time: []
            },
            pages: {
                total: 5,
                limit: 1,
                size: 5
            },
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            pageTotal: 0,
            form: {},
            idx: -1,
            id: -1
        };
    },
    created() {
        this.getData();
    },
    methods: {
        // 获取 easy-mock 的模拟数据
        async getData() {
            let res = await fetchData(this.form);
            this.tableData = res.list;
            this.pages.total = res.pageTotal || 5;
        },
        //重置表单
        resetForm() {
            console.log('resetForm');
        },
        // 触发搜索按钮
        handleSearch() {
            this.$set(this.pages, 'limit', 1);
            this.getData();
        },
        // 删除操作
        handleDelete(index, row) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    this.$message.success('删除成功');
                    this.tableData.splice(index, 1);
                })
                .catch(() => {});
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
            this.form = row;
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
            this.$set(this.pages, 'limit', val);
            this.getData();
        },
        handleSizeChange(val) {
            this.$set(this.pages, 'size', val);
            this.getData();
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
