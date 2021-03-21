<template>
    <el-form :inline="true" :model="levelForm" ref="levelForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="等级1">
            <el-color-picker v-model="levelForm.levelFirst"></el-color-picker>
        </el-form-item>
        <el-form-item label="等级2">
            <el-color-picker v-model="levelForm.levelSecond"></el-color-picker>
        </el-form-item>
        <el-form-item label="等级3">
            <el-color-picker v-model="levelForm.levelThird"></el-color-picker>
        </el-form-item>
        <el-form-item label="等级4">
            <el-color-picker v-model="levelForm.levelFourth"></el-color-picker>
        </el-form-item>
        <el-form-item label="等级5">
            <el-color-picker v-model="levelForm.levelFifth"></el-color-picker>
        </el-form-item>
        <div style="text-align:right">
            <el-button type="primary" @click="submitForm('levelForm')">提交</el-button>
            <el-button @click="cancelForm('levelForm')">取消</el-button>
        </div>
    </el-form>
</template>

<script>
export default {
    data() {
        return {
            levelForm: {
                levelFirst: null,
                levelSecond: null,
                levelThird: null,
                levelFourth: null,
                levelFifth: null
            }
        };
    },
    methods: {
        //提交
        submitForm() {
            this.$emit('closeAddLevelDialog');
        },
        // 取消
        cancelForm() {
            this.$emit('closeAddLevelDialog');
        }
    }
};
</script>

<style></style>
