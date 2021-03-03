<template>
    <div>
        <el-form :model="formData" :rules="rules" ref="ruleForm" label-width="100px" class="demo-formData">
            <el-form-item label="用户名" prop="username">
                <el-input v-model="formData.username" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input show-password v-model="formData.password" placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="repassword">
                <el-input show-password v-model="formData.repassword" placeholder="请再次输入密码"></el-input>
            </el-form-item>
            <el-form-item label="姓名" prop="fullname">
                <el-input v-model="formData.fullname" placeholder="请输入姓名"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="mobilephone">
                <el-input v-model="formData.mobilephone" placeholder="请输入手机号"></el-input>
            </el-form-item>
            <el-form-item label="权限" prop="user_role_id">
                <el-select v-model="formData.user_role_id" placeholder="请选择权限">
                    <el-option v-for="item in powerArr" :key="item.id" :label="item.rolename" :value="item.id"> </el-option>
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
import { isvalidPhone } from '@/utils/validate.js'; //表单校验
import { addUser, getUserRoles } from '@/api/user.js'; //摄像头类型
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
            } else {
                callback();
            }
        };

        return {
            formData: {
                username: '', //用户名
                password: '', //密码
                repassword: '', //确认密码
                fullname: '', //姓名
                mobilephone: '', //手机号
                user_role_id: '' //权限
            },
            powerArr: [], //权限数组
            rules: {
                username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
                password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
                repassword: [{ required: true, validator: validatePass, trigger: 'blur' }],
                fullname: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
                mobilephone: [{ required: true, validator: validPhone, trigger: 'blur' }],
                user_role_id: [{ required: true, message: '权限不能为空', trigger: 'change' }]
            }
        };
    },
    created() {
        //获取权限列表
        this.getUserRoles();
    },
    mounted() {},
    methods: {
        //获取权限列表
        async getUserRoles() {
            let res = await getUserRoles();
            if (res.code == 0) {
                this.powerArr = res.detail;
            } else {
                // code 1
                this.$error.message(res.content);
            }
        },
        submitForm(formName) {
            this.$refs[formName].validate(async valid => {
                console.log(valid);
                if (valid) {
                    let obj = JSON.parse(JSON.stringify(this.formData));
                    delete obj.repassword;
                    let res = await addUser(obj);
                    console.log(res);
                    if (res.code === '0') {
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
