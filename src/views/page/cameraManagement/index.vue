<template>
    <div>
        <div class="container">
            <div>
                <el-form ref="form" class="demo-form-inline" inline :model="form" label-width="90px">
                    <el-form-item label="摄像机ip" prop="ip">
                        <el-input style="width:200px" v-model="form.ip" placeholder="请输入摄像机ip"></el-input>
                    </el-form-item>
                    <el-form-item label="摄像机位置" prop="position">
                        <el-input style="width:200px" v-model="form.position" placeholder="请输入摄像机位置"></el-input>
                    </el-form-item>
                    <el-form-item label="摄像头类型筛选" prop="detectModelTypeArray">
                        <el-select style="width:200px" v-model="form.detectModelTypeArray" multiple placeholder="筛选条件">
                            <el-option v-for="item in detectModelTypeArray" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="开启状态" prop="stateArray">
                        <el-select style="width:200px" v-model="form.stateArray" multiple placeholder="筛选状态">
                            <el-option v-for="item in stateArray" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="重要度" prop="importanceArray">
                        <el-select style="width:200px" v-model="form.importanceArray" multiple placeholder="筛选等级">
                            <el-option v-for="item in importanceLevel" :key="item.id" :label="`等级${item.level}`" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="报警时间" prop="createTime">
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
                        <el-button type="primary" @click="setImportanceLevel()">设置等级</el-button>
                        <el-button type="primary" @click="handleSearch('form')">搜索</el-button>
                        <el-button @click="resetForm('form')">重置</el-button>
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

                <el-table-column label="ID" width="60" align="center">
                    <template slot-scope="scope">
                        <span>{{ scope.$index + (form.pagenation.pageNum - 1) * form.pagenation.pageSize + 1 }} </span>
                    </template>
                </el-table-column>
                <el-table-column sortable="custom" prop="importance" label="重要度" width="90" align="center">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" :content="scope.row.name" placement="right">
                            <div class="icon iconfont icon-circle" :style="{ color: scope.row.color }"></div>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column prop="ip" label="摄像机ip" align="center" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="position" label="摄像机位置" align="center">
                    <template slot-scope="scope">
                        <span>{{ scope.row.position | formatEmpty }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="fps" label="帧数" align="center" width="50">
                    <template slot-scope="scope">
                        <span>{{ scope.row.fps | formatEmpty }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="currentNum" label="初始化人数" align="center" width="70">
                    <template slot-scope="scope">
                        <span>{{ scope.row.currentNum | formatEmpty }}</span>
                    </template>
                </el-table-column>

                <el-table-column prop="pic" label="区域标注" align="center">
                    <template slot-scope="scope">
                        <el-image
                            v-if="scope.row.pic"
                            class="table-td-thumb"
                            :src="scope.row.pic + '?' + randomNum"
                            :preview-src-list="[scope.row.pic + '?' + randomNum]"
                        ></el-image>
                        <span v-else>--</span>
                    </template>
                </el-table-column>

                <el-table-column prop="url" label="url" align="center" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <span>{{ scope.row.url | formatEmpty }}</span>
                    </template>
                </el-table-column>

                <el-table-column prop="detectModelType" label="类别" align="center" :show-overflow-tooltip="true"></el-table-column>

                <el-table-column prop="state" label="状态" width="80" align="center">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" content="启动" placement="right">
                            <div v-if="scope.row.state" class="icon iconfont icon-circle" :style="{ color: '#00ff00' }"></div>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="停止" placement="right">
                            <div v-if="!scope.row.state" class="icon iconfont icon-circle" :style="{ color: '#ff0000' }"></div>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column
                    sortable="custom"
                    prop="createTime"
                    label="创建时间"
                    align="center"
                    :formatter="dateFormat"
                    :show-overflow-tooltip="true"
                ></el-table-column>

                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button v-has="{ role: ['admin'] }" type="text" @click="handleEdit(scope.row)">修改</el-button>
                        <el-button
                            v-has="{ role: ['admin'] }"
                            v-if="scope.row.state"
                            type="text"
                            @click="handleClose(scope.$index, scope.row)"
                            >停止</el-button
                        >
                        <el-button
                            v-has="{ role: ['admin'] }"
                            v-if="!scope.row.state"
                            type="text"
                            @click="handleClose(scope.$index, scope.row)"
                            >启动</el-button
                        >
                        <el-button type="text" @click="showVideo(scope.row)">查看视频</el-button>
                        <el-button v-has="{ role: ['admin'] }" type="text" style="color:red" @click="handleDelete(scope.$index, scope.row)"
                            >删除</el-button
                        >
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

        <!-- 添加摄像头 -->
        <div v-if="addCameraFlag">
            <el-dialog title="添加摄像头" :visible.sync="addCameraFlag" width="40%" :before-close="handleCloseDialog">
                <add-camera @closeAddCameraDialog="closeAddCameraDialog" ref="addCamera"></add-camera>
            </el-dialog>
        </div>

        <!-- 设置重要等级 -->
        <div v-if="addImportanceLevelFlag">
            <el-dialog title="设置等级" :visible.sync="addImportanceLevelFlag" width="25%" :before-close="handleCloseLevelDialog">
                <addImportanceLevel
                    :importanceLevel="importanceLevel"
                    @closeAddLevelDialog="closeAddLevelDialog"
                    ref="addImportanceLevel"
                ></addImportanceLevel>
            </el-dialog>
        </div>

        <!-- 编辑摄像头 -->
        <div v-if="editCameraFlag">
            <el-dialog title="编辑摄像头" :visible.sync="editCameraFlag" width="40%" :before-close="handleCloseDialog">
                <add-camera
                    :typeName="typeName"
                    :editRow="editRow"
                    @closeAddCameraDialog="closeAddCameraDialog"
                    ref="editCamera"
                ></add-camera>
            </el-dialog>
        </div>

        <!-- 查看视频 -->
        <div v-if="showVideoFlag">
            <showVideo @closeVideo="closeVideo" :showVideoObj="showVideoObj" ref="showVideo"></showVideo>
        </div>
    </div>
</template>

<script>
import { getAlertEventsState } from '@/api/alertEvents.js';
import {
    getDetectModelsTypes,
    getCamerasQuery,
    getCamerasCount,
    deleteCamerasById,
    updateCamerasState,
    getImportanceLevel
} from '@/api/cameraManagement.js'; //摄像头类型
import addCamera from '@/views/page/cameraManagement/addCamera.vue';
import addImportanceLevel from '@/views/page/cameraManagement/addImportanceLevel.vue';
import showVideo from '@/views/page/cameraManagement/showVideo.vue';
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
                importanceArray: [], //重要度
                pagenation: {
                    pageNum: 1,
                    pageSize: 10
                },
                // sort: { field: 'createTime', type: 'asc' }, //排序
                sort: {
                    createTime: 'desc',
                    importance: 'asc'
                } //排序
            },
            total: 0,
            stateArray: [], //状态  启动/关闭
            detectModelTypeArray: [], //摄像头检测模型
            addCameraFlag: false, // 添加控制摄像头管理的开关
            editCameraFlag: false, // 编辑控制摄像头管理的开关
            editRow: {}, // 编辑对象
            tableData: [],
            multipleSelection: [],
            delList: [],
            showAll: true, //是否展开全部
            addImportanceLevelFlag: false, //设置等级弹窗开关
            startColor: '#ff0000', // 开始颜色
            endColor: '#00ff00', // 结束颜色
            showVideoFlag: false, // 视频查看弹窗开关
            importanceLevel: [], // 重要度等级
            showVideoObj: '', //查看的信息
            randomNum: 0
        };
    },
    computed: {},
    components: {
        addCamera,
        addImportanceLevel,
        showVideo
    },
    created() {
        this.randomNum = Math.random();
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
        //获取全部等级（重要度）
        this.getImportanceLevel();
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
        'form.detectModelTypeArray': {
            handler(newVal) {
                console.log(newVal);
            }
        },
        'form.stateArray': {
            handler(newVal) {
                console.log(newVal);
            }
        }
    },
    methods: {
        // 关闭视频查看弹窗
        closeVideo() {
            this.showVideoFlag = false;
        },
        // 编辑摄像头
        handleEdit(row) {
            this.editCameraFlag = true;
            this.typeName = 'edit';
            this.editRow = row;
        },
        // 获取等级（重要度）
        async getImportanceLevel() {
            let res = await getImportanceLevel();
            if (res.code === '0') {
                this.importanceLevel = res.detail;
            } else {
                this.$message.error('获取重要度等级失败');
            }
        },
        // 查看视频
        showVideo(row) {
            console.log('点击了视频查看');
            this.showVideoFlag = true;
            this.showVideoObj = row;
        },
        // 视频查看关闭
        handleVideoDialog() {
            this.showVideoFlag = false;
        },
        // 关闭设置等级弹窗
        handleCloseLevelDialog() {
            this.addImportanceLevelFlag = false;
        },
        // 设置重要等级
        setImportanceLevel() {
            this.addImportanceLevelFlag = true;
            if (this.$refs.addImportanceLevel) {
                this.$refs.addImportanceLevel.$refs.levelForm.clearValidate();
                this.$refs.addImportanceLevel.$refs.levelForm.resetFields();
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
        dateFormat(row) {
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
            console.log(column.prop);
            if (column.order !== null) {
                if (column.prop == 'createTime') {
                    if (column.order === 'descending') {
                        this.form.sort.createTime = 'desc';
                    } else if (column.order === 'ascending') {
                        this.form.sort.createTime = 'asc';
                    }
                } else if (column.prop == 'importance') {
                    if (column.order === 'descending') {
                        this.form.sort.importance = 'desc';
                    } else if (column.order === 'ascending') {
                        this.form.sort.importance = 'asc';
                    }
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
            this.editCameraFlag = false;
            this.randomNum = Math.random();
            this.resetForm('form');
        },
        // 关闭设置重要等级的弹窗
        closeAddLevelDialog() {
            this.addImportanceLevelFlag = false;
            this.resetForm('form');
        },
        // 关闭添加(编辑)的弹窗
        handleCloseDialog() {
            this.addCameraFlag = false;
            this.editCameraFlag = false;
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
.stateStyle {
    height: 20px;
    width: 20px;
    margin: 0 auto;
    border-radius: 50%;
}
</style>
