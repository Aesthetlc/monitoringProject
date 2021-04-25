<template>
    <div class="container">
        <!-- 柜机展示部分 -->
        <div v-for="item in cabinetArr" :key="item.rackId" class="cabinetBox">
            <div style="text-align:right;float:right">
                <el-dropdown trigger="click">
                    <span class="el-dropdown-link"><em class="el-icon-s-operation"></em> </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item icon="el-icon-upload2" @click.native="dropClick('putaway', item)">上架</el-dropdown-item>
                        <el-dropdown-item icon="el-icon-edit" @click.native="dropClick('edit', item)">编辑</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
            <p class="cabinetTitle">{{ item.rackName }}</p>

            <div
                v-for="(it, index) in item.objs"
                :key="it.uId"
                :class="[index + 1 == it.uId ? 'cabinetContent' : 'cabinetContentNoColor']"
            ></div>

            <div v-for="(ite, ind) in 42 - item.objs.length" :key="ind + Math.random()" class="cabinetContentNoColor"></div>
        </div>

        <!-- 上架部分 -->
        <el-dialog title="上架" :visible.sync="putawayVisible" width="30%" :before-close="handlePutClose">
            <putawayCabinet type="new" @closeputawayCabinetDialog="closeputawayCabinetDialog"></putawayCabinet>
        </el-dialog>

        <!-- 下架部分 -->
        <el-dialog title="详情列表" :visible.sync="outVisible" width="50%" :before-close="handleOutClose">
            <outCabinet :rackId="rackId" :editCabinetArr="editCabinetArr"></outCabinet>
        </el-dialog>
    </div>
</template>

<script>
import { getCabinet, editCabinet } from '@/api/cabinet.js';
import putawayCabinet from '@/views/page/cabinetManagement/putawayCabinet.vue';
import outCabinet from '@/views/page/cabinetManagement/outCabinet.vue';
export default {
    name: 'cabinetManagement',
    data() {
        return {
            //柜机数据数组
            cabinetArr: [],
            //上架弹窗开关
            putawayVisible: false,
            //下架弹窗开关
            outVisible: false,
            //下架数据数组
            editCabinetArr: [],
            //rackId
            rackId: ''
        };
    },
    mounted() {
        this.getCabinet();
    },
    components: {
        putawayCabinet,
        outCabinet
    },
    methods: {
        // 关闭上架弹窗
        handlePutClose(done) {
            this.$confirm('确认关闭？')
                .then(_ => {
                    done();
                })
                .catch(_ => {});
        },
        // 关闭上架弹窗
        handleOutClose(done) {
            this.$confirm('确认关闭？')
                .then(_ => {
                    done();
                })
                .catch(_ => {});
        },
        closeputawayCabinetDialog() {
            this.putawayVisible = false;
        },
        // 获取所有机柜信息
        async getCabinet() {
            let res = await getCabinet();
            if (res.code == 0) {
                this.cabinetArr = res.data;
            } else {
                this.$message.error('获取机柜信息失败');
            }
        },

        // 点击下拉功能
        async dropClick(e, item) {
            this.rackId = item.rackId;
            if (e == 'putaway') {
                this.putawayVisible = true;
            } else if (e == 'edit') {
                this.outVisible = true;
                let res = await editCabinet(item.rackId);
                if (res.code == 0) {
                    this.editCabinetArr = res.data;
                }
            }
        }
    }
};
</script>

<style scoped>
.container {
    display: flex;
}
.container .cabinetBox {
    border: 1px solid #808080;
    padding: 10px;
    width: 100%;
    margin-right: 5px;
    height: 100%;
}
.container .cabinetBox .cabinetContent {
    border: 1px solid #dcdcdc;
    height: 15px;
    line-height: 15px;
    background-color: #0f0;
}
.container .cabinetBox .cabinetContentNoColor {
    border: 1px solid #dcdcdc;
    height: 15px;
    line-height: 15px;
}
.container .cabinetBox .cabinetTitle {
    text-align: center;
}

.container ::v-deep .el-dialog__body {
    padding-top: 10px !important;
}
.el-dropdown-link {
    cursor: pointer;
    /* color: #409eff; */
}
.el-icon-s-operation {
    font-size: 18px;
}
</style>
