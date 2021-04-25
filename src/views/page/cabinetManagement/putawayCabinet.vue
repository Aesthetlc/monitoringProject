<template>
    <el-form :model="putawayForm" ref="putawayForm" label-width="100px" class="demo-putawayForm">
        <el-form-item label="起始U位" prop="uId">
            <el-input-number v-model="putawayForm.uId" controls-position="right" :min="1" :max="42"></el-input-number>
        </el-form-item>
        <el-form-item label="占用U位" prop="height">
            <el-input-number v-model="putawayForm.height" controls-position="right" :min="1" :max="42"></el-input-number>
        </el-form-item>
        <el-form-item label="设备名" prop="name">
            <el-input v-model="putawayForm.name"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button @click="closeDialog()">关闭</el-button>
            <el-button type="primary" @click="submitForm('putawayForm')">提交</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
import { putawayCabinetApi } from '@/api/cabinet.js';
export default {
    data() {
        return {
            //上架Form
            putawayForm: {
                uId: 0,
                height: 0,
                name: '',
                objId: ''
            }
        };
    },
    props: {
        type: {
            type: String,
            default: 'new'
        },
        editRow: {
            type: Object,
            default: () => ({})
        },
        rackId: {
            type: Number,
            default: 0
        }
    },
    mounted() {
        if (this.type === 'edit') {
            let res = JSON.parse(JSON.stringify(this.editRow));
            this.putawayForm = res;
        }
    },
    methods: {
        // 提交
        async submitForm() {
            
                let res = await putawayCabinetApi(this.rackId, this.putawayForm);
                if (res.code == '0') {
                    this.$message.success('上架成功');
                } else {
                    this.$message.error('上架失败');
                }
            
        },
        // 取消
        closeDialog() {
            this.$emit('closeputawayCabinetDialog');
        }
    }
};
</script>

<style></style>
