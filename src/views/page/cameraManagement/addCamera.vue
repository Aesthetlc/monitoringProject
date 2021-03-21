<template>
    <div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="摄像头ip" prop="ip">
                <el-input v-model="ruleForm.ip"></el-input>
            </el-form-item>
            <el-form-item label="模板类型" prop="modelType">
                <el-input disabled v-model="ruleForm.modelType"></el-input>
            </el-form-item>
            <el-form-item label="摄像头位置" prop="position">
                <el-input v-model="ruleForm.position"></el-input>
            </el-form-item>
            <el-form-item label="重要度" prop="level">
                <el-select style="width:100%" v-model="ruleForm.level" placeholder="请选择">
                    <el-option v-for="item in levelOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button @click="closeDialog()">关闭</el-button>
                <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { addCameras, detectModelsCameraByIp } from '@/api/cameraManagement.js'; //摄像头类型
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
                    detectModelsCameraByIp(value).then(res => {
                        if (res.code == 0) {
                            this.detectModelId = res.detail.detectModelId;
                            this.ruleForm.modelType = res.detail.detectModelType;
                            callback();
                        } else {
                            //code 1 摄像头已经注册，不能重复注册/摄像头IP为空/摄像头IP格式非法/摄像头模型不存在
                            //code 2 系统错误
                            callback(new Error(res.content));
                        }
                    });
                }, 500);
            }
        };
        return {
            ruleForm: {
                ip: '',
                modelType: '',
                position: '',
                level: ''
            },
            detectModelId: '', //模型Id
            rules: {
                ip: [
                    { required: true, message: '请输入摄像头ip', trigger: 'blur' },
                    { validator: checkIp, trigger: 'blur' }
                ],
                position: [{ required: true, message: '请输入摄像头位置', trigger: 'blur' }],
                level: [{ required: true, message: '等级不能为空', trigger: 'blur' }],
            },
            levelOptions: [
                { value: '1', label: '等级1' },
                { value: '2', label: '等级2' },
                { value: '3', label: '等级3' },
                { value: '4', label: '等级4' },
                { value: '5', label: '等级5' },
            ]
        };
    },
    mounted() {
        console.log(this.ruleForm);
    },
    methods: {
        submitForm(formName) {
            console.log('第一遍');
            this.$refs[formName].validate(async valid => {
                if (valid) {
                    let obj = JSON.parse(JSON.stringify(this.ruleForm));
                    delete obj.modelType;
                    obj.detectModelId = this.detectModelId;
                    let res = await addCameras(obj);
                    if (res.code == 0) {
                        this.$message({
                            type: 'success',
                            message: '添加成功!'
                        });
                        this.$emit('closeAddCameraDialog');
                    } else {
                        //code 1 摄像头已经注册，不能重复注册/摄像头IP为空/摄像头IP格式非法/摄像头模型不存在/摄像头添加失败
                        //code 2 系统错误
                        this.$message.error(res.content);
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
