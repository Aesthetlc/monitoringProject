<template>
    <div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="摄像头ip" prop="ip">
                <el-input :disabled="typeName === 'edit'" v-model="ruleForm.ip"></el-input>
            </el-form-item>
            <el-form-item label="模板类型" prop="modelType">
                <el-input disabled v-model="ruleForm.modelType"></el-input>
            </el-form-item>
            <el-form-item label="摄像头位置" prop="position">
                <el-input v-model="ruleForm.position"></el-input>
            </el-form-item>
            <el-form-item label="重要度" prop="importanceId">
                <el-select style="width:100%" v-model="ruleForm.importanceId" placeholder="请选择">
                    <el-option v-for="item in importanceLevel" :key="item.id" :label="`等级${item.level}`" :value="item.id"></el-option>
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
import { addCameras, detectModelsCameraByIp, getImportanceLevel, updateCameras } from '@/api/cameraManagement.js'; //摄像头类型
export default {
    data() {
        var checkIp = (rule, value, callback) => {
            const reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
            if (!value) {
                return callback(new Error('摄像头IP不能为空'));
            } else if (!reg.test(value) && value != '') {
                callback(new Error('请输入正确的IP地址'));
            } else if (value) {
                if (this.typeName !== 'edit') {
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
                } else {
                    callback();
                }
            }
        };
        return {
            ruleForm: {
                ip: '',
                modelType: '',
                position: '',
                importanceId: ''
            },
            detectModelId: '', //模型Id
            rules: {
                ip: [
                    { required: true, message: '请输入摄像头ip', trigger: 'blur' },
                    { validator: checkIp, trigger: 'blur' }
                ],
                position: [{ required: true, message: '请输入摄像头位置', trigger: 'blur' }],
                importanceId: [{ required: true, message: '重要度不能为空', trigger: 'blur' }]
            },
            importanceLevel: []
        };
    },
    mounted() {
        //获取全部等级（重要度）
        this.getImportanceLevel();
    },
    props: {
        typeName: {
            type: String,
            default: ''
        },
        editRow: {
            type: Object,
            default: () => ({})
        }
    },
    methods: {
        async getImportanceLevel() {
            let res = await getImportanceLevel();
            if (res.code === '0') {
                this.importanceLevel = res.detail;
                // 如果是编辑 赋值一下
                if (JSON.stringify(this.editRow) != '{}' && this.typeName === 'edit') {
                    let obj = JSON.parse(JSON.stringify(this.editRow));
                    this.ruleForm.ip = obj.ip;
                    this.ruleForm.position = obj.position;
                    this.ruleForm.modelType = obj.detectModelType; // 这个字段算便写 编辑的时候  后台不会读取这个字段
                    //回显等级
                    this.importanceLevel.forEach(item => {
                        if (item.name == obj.name) {
                            this.ruleForm.importanceId = item.id;
                        }
                    });
                }
            } else {
                this.$message.error('获取重要度等级失败');
            }
        },
        submitForm(formName) {
            this.$refs[formName].validate(async valid => {
                if (valid) {
                    if (this.typeName === 'edit') {
                        let obj = JSON.parse(JSON.stringify(this.ruleForm));
                        obj.id = this.editRow.id;
                        let res = await updateCameras(obj);
                        if (res.code == 0) {
                            this.$message({
                                type: 'success',
                                message: '编辑成功!'
                            });
                            this.$emit('closeAddCameraDialog');
                        } else {
                            this.$message.error(res.content);
                        }
                    } else {
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
