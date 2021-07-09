<template>
  <div>
    <div class="container">

      <el-card
        v-if="type === 'realTimeMonitoring'"
        class="box-card"
      >
        <div slot="header">
          <span>监控图像</span>
        </div>
        <div class="middle">
          <div class="desc" >
            <p v-if="monitoringArr.length !== 0">{{monitoringArr[0].desc}}</p>
          </div>

          <!-- key +10的原因 保证跟下方的暂无数据的key 不相同 -->

          <div class="mainImg">
            <div
              v-for="(item, index) in monitoringArr"
              :key="index + 10"
              v-if="index === 0"
            >
              <div>
                <el-image
                  :src="item.img"
                  :preview-src-list="[item.img]"
                ></el-image>
                <div style="width: 100%;align-items: center ;text-align:center">
                  <p>IP:{{ item.ip }}</p>
                  <p>位置:{{ item.location }}</p>
                  <p>类型:{{ item.describe }}</p>
                  <p>时间:{{ item.timeValue }}</p>
                </div>

              </div>

            </div>
          </div>

          <div class="right">
            <div
              v-for="(item, index) in monitoringArr"
              :key="index + 10"
              v-if="index !== 0"
            >
              <div style="width:90%;height:60%;display: flex;justify-content: space-between;align-items: center; margin-bottom: 3%">
                <el-image
                  :src="item.img"
                  :preview-src-list="[item.img]"
                ></el-image>
                <div style="width:50%;font-size: 14px">
                  <p>IP:{{ item.ip }}</p>
                  <p>位置:{{ item.location }}</p>
                  <p>类型:{{ item.describe }}</p>
                  <p>时间:{{ item.timeValue }}</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import {
  getAlertEventsState,
  getAlertEventsQuery,
  deleteAlertEventsById,
  closeAlertEventsById,
  deleteAlertEventsByArr,
  querySymbolSize
} from '@/api/alertEvents.js';
import { mapState } from 'vuex';
export default {
  name: 'alertShow',
  props: {
    type: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      arr: [
        {
          ip: "10.221.170.111111111",
          location: "location1",
          img: "http://8.140.185.142:9999/10.221.170.6.jpg"
        },
        {
          ip: "10.221.170.2",
          location: "location2",
          img: "http://8.140.185.142:9999/10.221.170.7.jpg"
        },
        {
          ip: "10.221.170.3",
          location: "location3",
          img: "http://8.140.185.142:9999/10.221.170.7.jpg"
        },
        {
          ip: "10.221.170.4",
          location: "location4",
          img: "http://8.140.185.142:9999/10.221.170.7.jpg"
        },
        {
          ip: "10.221.170.5",
          location: "location5",
          img: "http://8.140.185.142:9999/10.221.170.7.jpg"
        },
        {
          ip: "10.221.170.6",
          location: "location6",
          img: "http://8.140.185.142:9999/10.221.170.7.jpg"
        }
      ],
      descs: {
          "安全帽":"安全帽场景描述:",
          "工服":"工服场景描述:",
          "吸烟":"吸烟场景描述:",
          "打电话":"打电话场景描述:",
          "出入口":"出入口场景描述:",
          "危险区域闯入":"危险区域闯入场景描述:",
          "安全通道占用":"安全通道占用场景描述:",
          "安全帽":"安全帽场景描述",
      }
    }
  },
  computed: {
    ...mapState(['refreshBlank', 'monitoringArr'])
  },
  created () {
  },
  watch: {
    // createTime: {
    //     handler(newVal) {
    //         let obj = {};
    //         // obj.startTime = timeFormat(newVal[0]);
    //         // obj.endTime = timeFormat(newVal[1]);
    //         // console.log(obj);
    //         obj.startTime = this.$util.timestampToDateTime(newVal[0]);
    //         obj.endTime = this.$util.timestampToDateTime(newVal[1]);
    //         this.form.createTime = obj;
    //     }
    // },

  },
  mounted () { },
  methods: {

  },
  // keep-alive  进入
  activated () {

  },
  // keep-alive  离开
  deactivated () {

  }
};
</script>

<style scoped>
.el-card {
    height: 100%;
}

.red {
    color: #ff0000;
}

/* .warningImgBorder {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    box-sizing: border-box;
} */
.middle {
    display: flex;
    width: 100%;
}

.desc {
    width: 15%; /*这里是百分比或者像素值，对应下面的center就是百分比或者像素值*/
    height: 100%;
    align-items: center;
    font-size: 26px;
}

.mainImg {
    height: 100%;
    flex: 1;
    margin-left: 1%;
    margin-right: 1%;
}

.right {
    width: 22%; /*这里是百分比或者像素值，对应下面的center就是百分比或者像素值*/
    height: 100%;
}

/* .warningImg {
    border: 1px solid #999;
    width: 24%;
    height: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
} */

/* .box-card {
    margin-top: 10px;
    margin-bottom: 10px;
} */

/* /deep/ .el-card__header {
    padding: 7px 10px;
} */

/* .mr10 {
    margin-right: 10px;
} */
/* .table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
} */

/* ::v-deep .el-form-item label:after {
        content: " ";
        display: inline-block;
        width: 100%;
    }

     ::v-deep .el-form-item__label {
        text-align: justify
    } */
/* 这里去除必选字段的*,这个符号会造成一定影响,去掉之后我用了li列表进行定位,在前面加上" * ". */
/* ::v-deep .el-form-item.is-required .el-form-item__label:before {
        content: none !important;
    } */
.clearfix:after {
    /*伪元素是行内元素 正常浏览器清除浮动方法*/
    content: '';
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
}
.clearfix {
    *zoom: 1; /*ie6清除浮动的方式 *号只有IE6-IE7执行，其他浏览器不执行*/
}
.stateStyle {
    height: 20px;
    width: 20px;
    margin: 0 auto;
    border-radius: 50%;
}
</style>
