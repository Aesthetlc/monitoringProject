<template>
    <el-form :model="timeForm" status-icon :rules="rules" ref="timeForm" label-width="100px" class="demo-timeForm">
        <el-form-item label="请求间隔" prop="timeInterval">
            <el-select style="width:100%" v-model="timeForm.timeInterval" placeholder="请选择">
                <el-option v-for="item in timeOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="提示音时间" prop="timeTips">
            <el-time-select
                placeholder="起始时间"
                style="width:50%"
                v-model="timeForm.startTime"
                :picker-options="{
                    start: '08:00',
                    step: '00:30',
                    end: '22:00'
                }"
            >
            </el-time-select>
            <el-time-select
                placeholder="结束时间"
                style="width:50%"
                v-model="timeForm.endTime"
                :picker-options="{
                    start: '08:00',
                    step: '00:30',
                    end: '22:00',
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
export default {
    data() {
        return {
            timeForm: {
                timeInterval: '',

                startTime: '',
                endTime: ''
            },
            rules: {},
            timeOptions: [
                {
                    value: '30',
                    label: '30秒'
                },
                {
                    value: '40',
                    label: '40秒'
                },
                {
                    value: '50',
                    label: '50秒'
                },
                {
                    value: '60',
                    label: '60秒'
                }
            ],
            value: ''
        };
    },
    methods: {
        changeTime(val) {
            console.log(val);
        },
        // 提交
        submitForm() {
            this.$emit('closeSetTimeDialog');
        },
        // 取消
        cancelForm() {
            this.$emit('closeSetTimeDialog');
        }
    }
};
</script>

<style></style>
