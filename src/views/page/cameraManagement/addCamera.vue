<template>
    <div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="摄像头ip" prop="ip">
                <el-input v-model="ruleForm.ip"></el-input>
            </el-form-item>
            <el-form-item label="模板类型">
                <el-input v-model="ruleForm.modelType"></el-input>
            </el-form-item>
            <el-form-item label="摄像头位置" prop="position">
                <el-input v-model="ruleForm.position"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="closeDialog()">关闭</el-button>
                <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { addCameras } from '@/api/cameraManagement.js'; //摄像头类型
export default {
    data() {
        var checkIp = (rule, value, callback) => {
            const reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
            if (!value) {
                return callback(new Error('摄像头IP不能为空'));
            } else if (!reg.test(value) && value != '') {
                callback(new Error('请输入正确的IP地址'));
            } else if (value) {
                setTimeout(() => {
                    if (value == '1.2.3.4') {
                        callback(new Error('ip已存在'));
                    } else {
                        callback();
                    }
                }, 1000);
            }
        };
        return {
            ruleForm: {
                ip: '',
                modelType: '',
                position: ''
            },
            rules: {
                ip: [
                    { required: true, message: '请输入摄像头ip', trigger: 'blur' },
                    { validator: checkIp, trigger: 'blur' }
                ],
                position: [{ required: true, message: '请输入摄像头位置', trigger: 'blur' }]
            }
        };
    },
    mounted() {},
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate(async valid => {
                if (valid) {
                    console.log(this.ruleForm);
                    let { data: res } = await addCameras(this.ruleForm);
                    if (res.result === 'success') {
                        this.$message({
                            type: 'success',
                            message: '添加成功!'
                        });
                        this.$emit('closeAddCameraDialog');
                    } else {
                        this.$message.error('添加失败');
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        closeDialog() {
            this.$emit('closeAddCameraDialog');
        }
    }
};
</script>

<style></style>
