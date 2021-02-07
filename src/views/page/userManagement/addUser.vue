<template>
    <div>
        <el-form :model="formData" :rules="rules" ref="formData" label-width="100px" class="demo-formData">
            <el-form-item label="用户名" prop="userName">
                <el-input v-model="formData.userName" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input show-password v-model="formData.password" placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="repassword">
                <el-input show-password v-model="formData.repassword" placeholder="请再次输入密码"></el-input>
            </el-form-item>
            <el-form-item label="姓名" prop="name">
                <el-input v-model="formData.name" placeholder="请输入姓名"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="phone">
                <el-input v-model="formData.phone" placeholder="请输入手机号"></el-input>
            </el-form-item>
            <el-form-item label="权限" prop="power">
                <el-select v-model="formData.power" placeholder="请选择权限">
                    <el-option v-for="item in powerArr" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button @click="closeDialog()">关闭</el-button>
                <el-button type="primary" @click="submitForm('formData')">提交</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { isvalidPhone } from '@/utils/validate.js'; //表单校验
import { addUser } from '@/api/user.js'; //摄像头类型
export default {
    data() {
        var validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入确认密码'));
            } else if (value !== this.formData.password) {
                callback(new Error('两次输入密码不一致！'));
            } else {
                callback();
            }
        };
        var validPhone = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入手机号码'));
            } else if (!isvalidPhone(value)) {
                callback(new Error('请填写正确的手机号码'));
            }
        };

        return {
            formData: {
                userName: '', //用户名
                password: '', //密码
                repassword: '', //确认密码
                name: '', //姓名
                phone: '', //手机号
                power: '' //权限
            },
            powerArr: [
                {
                    value: '0',
                    label: '用户'
                },
                {
                    value: '1',
                    label: '管理员'
                }
            ], //权限数组
            rules: {
                userName: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
                password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
                repassword: [{ required: true, validator: validatePass, trigger: 'blur' }],
                name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
                phone: [{ required: true, validator: validPhone, trigger: 'blur' }],
                power: [{ required: true, message: '权限不能为空', trigger: 'change' }]
            }
        };
    },
    mounted() {
        console.log(this.formData);
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate(async valid => {
                if (valid) {
                    let obj = JSON.parse(JSON.stringify(this.formData));
                    delete obj.repassword;
                    let { data: res } = await addUser(obj);
                    if (res.result === 'success') {
                        this.$message({
                            type: 'success',
                            message: '添加成功!'
                        });
                        this.$emit('closeAddUserDialog');
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
            this.$emit('closeAddUserDialog');
        }
    }
};
</script>

<style></style>
