<template>
    <!-- 图表展示在这个div中 -->
    <div>
        <div style="height:100%" ref="echart">
            echart初始化...
        </div>
    </div>
</template>

<script>
import bus from './bus';
export default {
    props: {
        chartData: {
            type: Object,
            default: {}
        },
        isAxisChart: {
            type: Boolean,
            default: {}
        }
    },
    computed: {
        //计算 有X轴还是没有X轴
        options() {
            return this.isAxisChart ? this.axisOption : this.normalOption;
        },
        //用域下面的resize 改变图表的尺寸,在容器大小发生改变时需要手动条用
        isCollapse() {
            return this.$store.state.tab.isCollapse;
        }
    },
    watch: {
        //监听chartData数据
        chartData: {
            handler: function() {
                this.initChart();
            },
            deep: true
        }
    },
    data() {
        return {
            echart: null,
            axisOption: {},
            normalOption: {}
        };
    },
    methods: {
        initChart() {
            //获取处理好的数据
            this.initChartData();
            //获取echart对象
            if (this.echart) {
                this.echart.setOption(this.options);
            } else {
                //通过refs获取
                this.echart = this.$echarts.init(this.$refs.echart);
                this.echart.setOption(this.options);
            }
        },
        //处理好数据
        initChartData() {
            if (this.isAxisChart) {
                this.axisOption = this.chartData;
            } else {
                this.normalOption = this.chartData;
            }
        },
        resizeChart() {
            this.echart ? this.echart.resize() : '';
        },
        //收缩展开
        handleListenter() {
            //调用renderChart方法对图表进行重新渲染
            let that = this;
            window.addEventListener('resize', () => {
                that.resizeChart();
            });
        },
        handleBus(msg) {
            let that = this;
            setTimeout(() => {
                that.resizeChart();
            }, 500);
        }
    },
    created() {
        this.handleListenter();

        bus.$on('changeSize', () => {
            let that = this;
            setTimeout(() => {
                that.resizeChart();
            }, 500);
        });
    },
    mounted() {
        this.initChart();
        let that = this;
        window.addEventListener('resize', () => {
            that.resizeChart();
        });
    },
    //销毁
    destroyed() {
        let that = this;
        window.addEventListener('resize', () => {
            that.resizeChart();
        });
        bus.$off('collapse', this.handleBus);
    }
};
</script>

<style></style>
