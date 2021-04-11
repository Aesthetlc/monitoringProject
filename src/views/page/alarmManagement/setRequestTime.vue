<template>
    <el-form :model="timeForm" status-icon :rules="rules" ref="timeForm" label-width="110px" class="demo-timeForm">
        <el-form-item label="刷新时间(秒)" prop="refreshBlank">
            <el-select filterable allow-create style="width:100%" v-model="timeForm.refreshBlank" placeholder="请选择">
                <el-option v-for="item in timeOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
        </el-form-item>

        <el-form-item label="静音时间段" prop="timeTips">
            <el-time-select
                placeholder="起始时间"
                style="width:47%"
                v-model="timeForm.startTime"
                :picker-options="{
                    start: '00:00',
                    step: '00:30',
                    end: '24:00'
                }"
            >
            </el-time-select>
            ---
            <el-time-select
                placeholder="结束时间"
                style="width:47%"
                v-model="timeForm.endTime"
                :picker-options="{
                    start: '00:00',
                    step: '00:30',
                    end: '24:00',
                    minTime: timeForm.startTime
                }"
            >
            </el-time-select>
        </el-form-item>
        <div style="text-align:right">
            <el-button type="primary" @click="submitForm('timeForm')">提交</el-button>
            <el-button @click="cancelForm()">取消</el-button>
        </div>
    </el-form>
</template>

<script>
import { setRefreshBlank, setMuteInterval } from '@/api/alertEvents.js';
import { mapState, mapMutations } from 'vuex';
export default {
    data() {
        return {
            timeForm: {
                refreshBlank: '',
                startTime: '',
                endTime: ''
            },
            rules: {},
            timeOptions: [
                {
                    value: '30',
                    label: '30'
                },
                {
                    value: '40',
                    label: '40'
                },
                {
                    value: '50',
                    label: '50'
                },
                {
                    value: '60',
                    label: '60'
                }
            ],
            value: ''
        };
    },
    computed: {
        ...mapState(['userId'])
    },
    methods: {
        ...mapMutations(['setMuteInterval', 'setRefreshBlank']),
        changeTime(val) {
            console.log(val);
        },
        // 提交
        async submitForm() {
            let refreshObj = {
                userId: this.userId,
                refreshBlank: this.timeForm.refreshBlank
            };
            let refreshRes = await setRefreshBlank(refreshObj); //设置刷新时间
            let muteObj = {
                userId: this.userId,
                muteStartTime: `${this.timeForm.startTime}:00`,
                muteEndTime: `${this.timeForm.endTime}:00`
            };
            let rmuteRes = await setMuteInterval(muteObj); //设置静音时间段
            if (refreshRes.code === '0' && rmuteRes.code === '0') {
                this.$message.success('设置成功');
                // 更新静音的时间段
                let muteTimeObj = {
                    mute_start_time: `${this.timeForm.startTime}:00`,
                    mute_end_time: `${this.timeForm.endTime}:00`
                };
                //设置 静音时间段
                this.setMuteInterval(muteTimeObj);
                //设置 刷新时间
                this.setRefreshBlank(this.timeForm.refreshBlank);
                this.$emit('closeSetTimeDialog');
            } else if (refreshRes.code === '1') {
                this.$message.error('刷新时间设置失败');
            } else if (rmuteRes.code === '1') {
                this.$message.error('静音时间段设置失败');
            }
        },
        // 取消
        cancelForm() {
            this.$emit('closeSetTimeDialog');
        }
    }
};
</script>

<style></style>
