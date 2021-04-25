<template>
    <div class="outContent">
        <el-button size="mini" type="danger" style="margin-bottom:10px" icon="el-icon-close" @click="outBatchCabinet">批量下架</el-button>
        <el-table
            :data="editCabinetArr"
            border
            height="calc(57vh)"
            class="table"
            ref="multipleTable"
            :row-key="
                row => {
                    return row.uId;
                }
            "
            header-cell-class-name="table-header"
            @selection-change="handleSelectionChange"
        >
            <el-table-column type="selection" width="55" align="center"></el-table-column>

            <el-table-column label="ID" width="60" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.$index + 1 }} </span>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="机器名" align="center"></el-table-column>
            <el-table-column prop="uId" label="起始U位" align="center"></el-table-column>
            <el-table-column prop="height" label="占用位" align="center"></el-table-column>

            <el-table-column label="操作" width="180" align="center">
                <template slot-scope="scope">
                    <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
                    <el-button type="text" style="color:red" @click="outCabinet(scope.row)">下架</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 上架部分 -->
        <el-dialog append-to-body title="更新" :visible.sync="updateVisible" width="30%" :before-close="handlePutClose">
            <putawayCabinet
                :rackId="rackId"
                :editRow="editRow"
                type="edit"
                @closeputawayCabinetDialog="closeputawayCabinetDialog"
            ></putawayCabinet>
        </el-dialog>
    </div>
</template>

<script>
import { outCabinetApi } from '@/api/cabinet.js';
import putawayCabinet from '@/views/page/cabinetManagement/putawayCabinet.vue';
export default {
    data() {
        return {
            //多选数组
            multipleSelection: [],
            //更新弹窗控制开关
            updateVisible: false,
            //编辑的row
            editRow: {}
        };
    },
    props: {
        editCabinetArr: {
            type: Array,
            default: () => []
        },
        rackId: {
            type: Number,
            default: 0
        }
    },
    components: {
        putawayCabinet
    },
    computed: {},
    methods: {
        // 关闭上架弹窗
        handlePutClose(done) {
            this.$confirm('确认关闭？')
                .then(_ => {
                    done();
                })
                .catch(_ => {});
        },
        // 关闭更新弹窗
        closeputawayCabinetDialog() {
            this.updateVisible = false;
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        // 编辑
        handleEdit(row) {
            this.updateVisible = true;
            this.editRow = row;
        },
        // 下架
        async outCabinet(row) {
            console.log(this.rackId, row.objId);
            let res = await outCabinetApi(this.rackId, row.objId);
            if (res.code == '0') {
                this.$message.success('下架成功');
            } else {
                this.$message.error('下架失败');
            }
        },
        //批量下架
        async outBatchCabinet() {
            let objIds = [];
            this.multipleSelection.forEach(item => {
                objIds.push(item.objId);
            });
            let outBatchCabinetObj = {
                objIds
            };
            let res = await outBatchCabinetApi(this.rackId, outBatchCabinetObj);
            if (res.code == '0') {
                this.$message.success('批量下架成功');
            } else {
                this.$message.error('批量下架失败');
            }
        }
    }
};
</script>

<style></style>
