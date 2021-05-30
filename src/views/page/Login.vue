<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">视频监控系统</div>
            <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
                <el-form-item prop="userName">
                    <el-input v-model="param.userName" placeholder="请输入用户名">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="请输入密码" v-model="param.password" @keyup.enter.native="submitForm()">
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm()">登录</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
import { login } from '@/api/user.js';
import { mapMutations, mapActions } from 'vuex';
import Cookies from 'js-cookie';
export default {
    data: function() {
        return {
            param: {
                userName: '',
                password: ''
            },
            rules: {
                userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
            }
        };
    },
    mounted() {
        // console.log(Cookies.get('monitoringIpArr'));
    },
    methods: {
        ...mapMutations(['setUserId', 'setUserRole']),
        ...mapActions(['getMuteInterval', 'getRefreshBlank']),
        submitForm() {
            this.$refs.login.validate(async valid => {
                if (valid) {
                    let res = await login(this.param);
                    if (res.code === '0') {
                        this.$message.success('登录成功');
                        Cookies.set('token', this.param.userName);
                        // 创建长连接（实时监控）
                        this.createSSE(res.detail.userId);
                        // 刷新重置长连接
                        Cookies.set('sseFlag', true);
                        //保存userId(存放到cookie中)
                        Cookies.set('userId', res.detail.userId);
                        //保存userId(存放到vuex中)
                        this.setUserId(res.detail.userId);
                        //保存userRole(存放到vuex中)
                        let role = '';
                        if (res.detail.uerRoleName == '管理员') {
                            role = 'admin';
                        } else if (res.detail.uerRoleName == '普通用户') {
                            role = 'user';
                        }
                        this.setUserRole(role);
                        // this.setUserRole('user');
                        //获取静音时间段
                        this.getMuteInterval();
                        //获取刷新间隔
                        this.getRefreshBlank();
                        //跳转首页
                        this.$router.push('/home');
                    } else if (res.code === '1') {
                        this.$message.error(res.content);
                    }
                } else {
                    this.$message.error('请输入账号和密码');
                    console.log('error submit!!');
                    return false;
                }
            });
        }
    }
};
</script>

<style scoped>
.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url(../../assets/img/login-bg.jpg);
    background-size: 100%;
}
.ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: #fff;
    border-bottom: 1px solid #ddd;
}
.ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 350px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
}
.ms-content {
    padding: 30px 30px;
}
.login-btn {
    text-align: center;
}
.login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
}
.login-tips {
    font-size: 12px;
    line-height: 30px;
    color: #fff;
}
</style>
