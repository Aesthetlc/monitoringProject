<template>
    <div>
        <el-table :data="levelTableData" style="width: 100%">
            <el-table-column label="级别" align="center" width="100">
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.level }}</span>
                </template>
            </el-table-column>
            <el-table-column label="名称" align="center">
                <template slot-scope="scope">
                    <span style="margin-left: 10px"><el-input v-model="scope.row.name" placeholder="请输入内容"></el-input></span>
                </template>
            </el-table-column>
            <el-table-column label="颜色" align="center" width="100">
                <template slot-scope="scope">
                    <span style="margin-left: 10px"><el-color-picker v-model="scope.row.color"></el-color-picker></span>
                </template>
            </el-table-column>
        </el-table>
        <div style="text-align:right">
            <el-button type="primary" @click="submitForm('levelForm')">提交</el-button>
            <el-button @click="cancelForm('levelForm')">取消</el-button>
        </div>
    </div>
</template>

<script>
import { updateImportanceLevel } from '@/api/cameraManagement.js'; //摄像头类型
export default {
    data() {
        return {
            levelTableData: []
        };
    },
    props: {
        importanceLevel: {
            type: Array,
            default: () => []
        }
    },
    watch: {},
    mounted() {
        this.levelTableData = JSON.parse(JSON.stringify(this.importanceLevel));
    },
    methods: {
        //提交
        async submitForm() {
            let searchObj = JSON.parse(JSON.stringify(this.levelTableData));
            let res = await updateImportanceLevel(searchObj);
            if (res.code == 0) {
                this.$message({
                    type: 'success',
                    message: '修改成功!'
                });
                this.$emit('closeAddLevelDialog');
            } else {
                this.$message.error(res.content);
            }
        },
        // 取消
        cancelForm() {
            this.$emit('closeAddLevelDialog');
        }
    }
};
</script>

<style></style>
