<template>
    <div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
            <el-form-item label="摄像头ip" prop="ip">
                <el-input :disabled="typeName === 'edit'" placeholder="请输入摄像头IP" v-model="ruleForm.ip"></el-input>
            </el-form-item>
            <el-form-item label="模板类型" prop="modelType">
                <el-input disabled v-model="ruleForm.modelType"></el-input>
            </el-form-item>
            <el-form-item label="摄像头位置" prop="position">
                <el-input v-model="ruleForm.position" placeholder="请输入摄像头位置"></el-input>
            </el-form-item>
            <el-form-item label="重要度" prop="importanceId">
                <el-select style="width:100%" v-model="ruleForm.importanceId" placeholder="请选择重要度">
                    <el-option v-for="item in importanceLevel" :key="item.id" :label="`等级${item.level}`" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="URL" prop="url">
                <el-input v-model="ruleForm.url" placeholder="请输入url"></el-input>
            </el-form-item>
            <el-form-item label="帧率" prop="fps">
                <el-select style="width:100%" v-model="ruleForm.fps" placeholder="请选择视频流播放帧率">
                    <el-option label="8" value="8"></el-option>
                    <el-option label="12" value="12"></el-option>
                    <el-option label="24" value="24"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item
                v-if="ruleForm.modelType == '出入口' || ruleForm.modelType == '人流量计数'"
                label="房间初始化人数"
                prop="currentNum"
            >
                <el-input-number v-model="ruleForm.currentNum" :min="1" :max="999999" placeholder="请输入初始化人员"></el-input-number>
            </el-form-item>
            <el-form-item v-if="showPic" label="区域选择">
                <div v-if="ruleForm.pic !== ''" class="demo-image__placeholder">
                    <div class="block">
                        <el-image :src="ruleForm.pic">
                            <div slot="placeholder" class="image-slot">加载中<span class="dot">...</span></div>
                        </el-image>
                    </div>
                </div>
                <div v-else style="border:1px solid #C0C4CC;width:300px;height:150px;font-size:30px;text-align:center;line-height:150px;">
                    <em @click="getSrcFromCanvas(ruleForm.ip)" style="cursor:pointer" class="el-icon-video-camera-solid"></em>
                </div>
            </el-form-item>
            <el-form-item style="text-align:center;margin-right:100px">
                <el-button v-if="typeName === 'edit' && showPic" type="success" @click="resetImg()">重置图片</el-button>
                <el-button @click="closeDialog()">关闭</el-button>
                <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
            </el-form-item>
        </el-form>
        <div v-if="dialogVisible">
            <el-dialog append-to-body title="图片编辑" :visible.sync="dialogVisible" width="60%">
                <editImg :imageUrl="imageUrl" @sendToData="sendToData"></editImg>
                <!-- <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span> -->
            </el-dialog>
        </div>
    </div>
</template>

<script>
import { addCameras, detectModelsCameraByIp, getImportanceLevel, updateCameras, getSrcFromCanvas } from '@/api/cameraManagement.js'; //摄像头类型
import editImg from './editImg.vue';
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
            dialogVisible: false, //图片编辑弹窗
            imageUrl: '', //编辑图片url
            ruleForm: {
                ip: '',
                modelType: '',
                position: '',
                importanceId: '', //重要度
                fps: '', //帧率
                currentNum: '', //初始化人员  （出入口/人流量计数）
                pic: '', //缩略图
                coord: [], //坐标数组
                url: '' //url
            },
            detectModelId: '', //模型Id
            sendToDataTemp: {}, //编辑图片传过来的信息
            rules: {
                ip: [
                    { required: true, message: '请输入摄像头ip', trigger: 'blur' },
                    { validator: checkIp, trigger: 'blur' }
                ],
                position: [{ required: true, message: '请输入摄像头位置', trigger: 'blur' }],
                importanceId: [{ required: true, message: '重要度不能为空', trigger: 'blur' }],
                currentNum: [{ required: true, message: '房间初始化人数不能为空', trigger: 'blur' }],
                fps: [{ required: true, message: '帧率不能为空', trigger: 'blur' }],
                url: [{ required: true, message: 'url不能为空', trigger: 'blur' }]
            },
            importanceLevel: [],
            showPicArr: ['出入口', '安全通道占用', '危险区域闯入']
        };
    },
    components: {
        editImg
    },
    computed: {
        showPic() {
            let flag = false;
            if (this.ruleForm.modelType && this.ruleForm.modelType !== '' && this.showPicArr.includes(this.ruleForm.modelType)) {
                flag = true;
            }
            return flag;
        }
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
        // 重置图片
        resetImg() {
            // this.ruleForm.pic = '';
            this.getSrcFromCanvas(this.ruleForm.ip);
        },
        // 子组件发送数据过来
        sendToData(obj) {
            this.sendToDataTemp = obj;
            this.dialogVisible = false;
            this.ruleForm.pic = obj.imgUrl;
        },
        //编辑图片 获取图片base64
        async getSrcFromCanvas(ip) {
            let res = await getSrcFromCanvas(ip);
            if (res.code == 0) {
                let url = res.detail;
                this.imageUrl = url.substring(url.lastIndexOf('/') + 1) + '?' + Math.random();
            } else {
                this.$message.error('获取图片地址失败');
            }

            this.dialogVisible = true;
        },
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
                    this.ruleForm.fps = obj.fps;
                    this.ruleForm.currentNum = obj.currentNum;
                    if (this.ruleForm.modelType && this.ruleForm.modelType !== '' && this.showPicArr.includes(this.ruleForm.modelType)) {
                        this.ruleForm.pic = obj.pic + '?' + Math.random();
                    } else {
                        this.ruleForm.pic = '';
                    }
                    this.ruleForm.coord = obj.coord;
                    this.ruleForm.url = obj.url;
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
                        this.ruleForm.coord = this.sendToDataTemp.positionArr ? this.sendToDataTemp.positionArr : this.ruleForm.coord;
                        this.ruleForm.pic = this.sendToDataTemp.imgUrl ? this.sendToDataTemp.imgUrl : this.ruleForm.pic;
                        let obj = JSON.parse(JSON.stringify(this.ruleForm));
                        obj.coord = JSON.stringify(obj.coord);
                        obj.fps = parseInt(obj.fps);
                        obj.id = this.editRow.id;
                        for (let key in obj) {
                            if (obj[key] == '') {
                                obj[key] = null;
                            }
                        }
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
                        this.ruleForm.coord = this.sendToDataTemp.positionArr;
                        let obj = JSON.parse(JSON.stringify(this.ruleForm));
                        obj.coord = JSON.stringify(obj.coord);
                        obj.fps = parseInt(obj.fps);
                        delete obj.modelType;
                        obj.detectModelId = this.detectModelId;
                        for (let key in obj) {
                            if (obj[key] == '') {
                                obj[key] = null;
                            }
                        }
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
            if (JSON.stringify(this.editRow) != '{}' && this.typeName === 'edit') {
                let obj = JSON.parse(JSON.stringify(this.editRow));
                this.ruleForm.pic = obj.pic + '?' + Math.random();
            }
            this.$emit('closeAddCameraDialog');
        }
    }
};
</script>

<style></style>
