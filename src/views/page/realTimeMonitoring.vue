<template>
    <div>
        <div class="container">
            <div>
                <el-form ref="form" class="demo-form-inline" inline :model="form" label-width="100px">
                    <el-form-item label="摄像机ip" prop="ip">
                        <el-input style="width:100%" v-model="form.ip" placeholder="请输入摄像机ip"></el-input>
                    </el-form-item>
                    <el-form-item label="摄像机位置" prop="location">
                        <el-input style="width:100%" v-model="form.location" placeholder="请输入摄像机位置"></el-input>
                    </el-form-item>
                    <el-form-item label="报警筛选" prop="type">
                        <el-select style="width:100%" v-model="form.type" placeholder="筛选条件">
                            <el-option v-for="item in detectModelTypeArray" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item style="float:right">
                        <el-button type="primary" @click="handleSearch('ruleForm')">搜索</el-button>
                        <el-button @click="resetForm('ruleForm')">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <el-button type="primary" icon="el-icon-close" style="margin-bottom:10px" @click="delAllSelection">批量关闭</el-button>
            <el-table
                :data="tableData.slice((pages.limit - 1) * pages.size, pages.limit * pages.size)"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column label="序号" width="60" align="center">
                    <template slot-scope="scope">
                        <span>{{ scope.$index + (pages.limit - 1) * pages.size + 1 }} </span>
                    </template>
                </el-table-column>
                <el-table-column prop="ip" label="摄像机ip" align="center"></el-table-column>
                <el-table-column prop="location" label="摄像机位置" align="center"></el-table-column>
                <el-table-column prop="type" label="类型" align="center"></el-table-column>
                <el-table-column prop="timestamp" label="报警时间" align="center"></el-table-column>

                <el-table-column label="缩略图" align="center">
                    <template slot-scope="scope">
                        <el-image class="table-td-thumb" :src="scope.row.thumb" :preview-src-list="[scope.row.thumb]"></el-image>
                    </template>
                </el-table-column>

                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <!-- <el-button type="text" @click="handleEdit(scope.$index, scope.row)">详情</el-button> -->
                        <el-button type="text" @click="handleDelete(scope.$index, scope.row)">关闭</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    :page-sizes="[10, 20]"
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
        <el-dialog title="查看详情" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="showForm" label-width="70px">
                <el-form-item label="ip">
                    <el-input v-model="showForm.ip"></el-input>
                </el-form-item>
                <el-form-item label="位置">
                    <el-input v-model="showForm.location"></el-input>
                </el-form-item>
                <el-form-item label="类型">
                    <el-input v-model="showForm.type"></el-input>
                </el-form-item>
                <el-form-item label="时间">
                    <el-input v-model="showForm.timestamp"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="editVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
// import { fetchData } from '../../api/index';
import { mapState } from 'vuex';
import { getDetectModelsTypes } from '@/api/cameraManagement.js'; //摄像头类型
export default {
    name: 'realTimeMonitoring',
    data() {
        return {
            form: {
                ip: '',
                location: '',
                type: ''
            },
            pages: {
                total: 0,
                limit: 1,
                size: 10
            },
            tableData:[],
            multipleSelection: [],
            detectModelTypeArray: [], //摄像头检测模型
            delList: [],
            editVisible: false,
            pageTotal: 0,
            showForm: {},
            id: -1
        };
    },
    computed: {
        ...mapState(['monitoringArr']),
        
    },
    watch:{
      'monitoringArr':{
        handler(newVal,oldVal){
          this.tableData =  newVal
          this.pages.total = newVal.length
        },
        immediate:true,
        deep:true
      }
    },
    created() {
        //检测模型类别查询接口
        this.getDetectModelsTypes();

        // this.getTableListData();
        // //获取数据(模拟请求到了数据)
        // let stopTime = setInterval(() => {
        //     let obj = {
        //         id: 1,
        //         ip: '172.23.138.20' + new Date().getTime(),
        //         location: '东配楼3F3A1' + new Date().getTime(),
        //         type: '指示灯',
        //         timestamp: this.$util.timestampToDateTime(new Date().getTime()),
        //         thumb: 'https://lin-xin.gitee.io/images/post/wms.png'
        //     };
        //     if (this.monitoringArr.length >= 20) {
        //         this.deleteMonitoringArr();
        //         this.addMonitoringArr(obj);
        //         // clearInterval(stopTime);
        //     } else {
        //         this.addMonitoringArr(obj);
        //         //获取数据
        //         this.getTableListData();
        //     }
        // }, 10000);
    },
    methods: {
        // ...mapMutations(['addMonitoringArr', 'deleteMonitoringArr']),
        //摄像头检测模型  --0027
        async getDetectModelsTypes() {
            let res = await getDetectModelsTypes();
            if (res.code == 0) {
                res.detail.forEach(item => {
                    this.detectModelTypeArray.push({
                        value: item.name,
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

        //获取数据
        // getTableListData() {
        //     this.tableData = this.monitoringArr;
        //     this.pages.total = this.tableData.length || 0;
        // },
        //重置表单
        resetForm() {
            this.$refs.form.resetFields();
            this.tableData = this.monitoringArr;
        },
        // 触发搜索按钮
        handleSearch() {
            this.$set(this.pages, 'limit', 1);
            this.tableData = this.tableData.filter(item => {
                return (
                    item.ip.search(this.form.ip) > -1 &&
                    item.location.search(this.form.location) > -1 &&
                    item.type.search(this.form.type) > -1
                );
            });
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
        // 详情查看
        handleEdit(index, row) {
            this.showForm = row;
            this.editVisible = true;
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.pages, 'limit', val);
        },
        handleSizeChange(val) {
            this.$set(this.pages, 'size', val);
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
