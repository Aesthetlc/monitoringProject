<template>
    <div>
        <div class="container">
            <div id="tui-image-editor"></div>
            <el-button type="primary" @click="uploadImg">完成并关闭</el-button>
        </div>
    </div>
</template>
<script>
import 'tui-image-editor/dist/tui-image-editor.css';
import 'tui-color-picker/dist/tui-color-picker.css';
const ImageEditor = require('tui-image-editor');
const locale_zh = {
    // override default English locale to your custom
    Crop: '裁剪',
    DeleteAll: '全部删除',
    Delete: '删除',
    Undo: '撤销',
    Redo: '反撤销',
    Reset: '重置',
    Flip: '镜像',
    Rotate: '旋转',
    Draw: '画',
    Shape: '形状标注',
    Icon: '图标标注',
    Text: '文字标注',
    Mask: '遮罩',
    Filter: '滤镜',
    Bold: '加粗',
    Italic: '斜体',
    Underline: '下划线',
    Left: '左对齐',
    Center: '居中',
    Right: '右对齐',
    Color: '颜色',
    'Text size': '字体大小',
    Custom: '自定义',
    Square: '正方形',
    Apply: '应用',
    Cancel: '取消',
    'Flip X': 'X 轴',
    'Flip Y': 'Y 轴',
    Range: '区间',
    Stroke: '描边',
    Fill: '填充',
    Circle: '圆',
    Triangle: '三角',
    Rectangle: '矩形',
    Free: '曲线',
    Straight: '直线',
    Arrow: '箭头',
    'Arrow-2': '箭头2',
    'Arrow-3': '箭头3',
    'Star-1': '星星1',
    'Star-2': '星星2',
    Polygon: '多边形',
    Location: '定位',
    Heart: '心形',
    Bubble: '气泡',
    'Custom icon': '自定义图标',
    'Load Mask Image': '加载蒙层图片',
    Grayscale: '灰度',
    Blur: '模糊',
    Sharpen: '锐化',
    Emboss: '浮雕',
    'Remove White': '除去白色',
    Distance: '距离',
    Brightness: '亮度',
    Noise: '噪音',
    'Color Filter': '彩色滤镜',
    Sepia: '棕色',
    Sepia2: '棕色2',
    Invert: '负片',
    Pixelate: '像素化',
    Threshold: '阈值',
    Tint: '色调',
    Multiply: '正片叠底',
    Blend: '混合色'
    // etc...
};
const customTheme = {
    // image 坐上角度图片
    'common.bi.image': '', // 在这里换上你喜欢的logo图片
    'common.bisize.width': '0px',
    'common.bisize.height': '0px',
    'common.backgroundImage': 'none',
    'common.backgroundColor': '#fff',
    'common.border': '1px solid #fff',
    'common.marginTop': '60px',
    // header
    'header.backgroundImage': 'none',
    'header.backgroundColor': '#f3f4f6',
    'header.border': '0px',
    'header.display': 'none', // 隐藏我们的header
    // load button
    'loadButton.backgroundColor': '#fff',
    'loadButton.border': '1px solid #ddd',
    'loadButton.color': '#222',
    'loadButton.fontFamily': 'NotoSans, sans-serif',
    'loadButton.fontSize': '12px',
    'loadButton.display': 'none', // 可以直接隐藏掉
    // download button
    'downloadButton.backgroundColor': '#fdba3b',
    'downloadButton.border': '1px solid #fdba3b',
    'downloadButton.color': '#fff',
    'downloadButton.fontFamily': 'NotoSans, sans-serif',
    'downloadButton.fontSize': '12px',
    'downloadButton.display': 'none', // 可以直接隐藏掉
    // icons default
    'menu.normalIcon.color': '#8a8a8a',
    'menu.activeIcon.color': '#555555',
    'menu.disabledIcon.color': '#434343',
    'menu.hoverIcon.color': '#e9e9e9',
    'submenu.normalIcon.color': '#8a8a8a',
    'submenu.activeIcon.color': '#e9e9e9',
    'menu.iconSize.width': '24px',
    'menu.iconSize.height': '24px',
    'submenu.iconSize.width': '32px',
    'submenu.iconSize.height': '32px',
    // submenu primary color
    'submenu.backgroundColor': '#1e1e1e',
    'submenu.partition.color': '#858585',
    // submenu labels
    'submenu.normalLabel.color': '#858585',
    'submenu.normalLabel.fontWeight': 'lighter',
    'submenu.activeLabel.color': '#fff',
    'submenu.activeLabel.fontWeight': 'lighter',
    // checkbox style
    'checkbox.border': '1px solid #ccc',
    'checkbox.backgroundColor': '#fff',
    // rango style
    'range.pointer.color': '#fff',
    'range.bar.color': '#666',
    'range.subbar.color': '#d1d1d1',
    'range.disabledPointer.color': '#414141',
    'range.disabledBar.color': '#282828',
    'range.disabledSubbar.color': '#414141',
    'range.value.color': '#fff',
    'range.value.fontWeight': 'lighter',
    'range.value.fontSize': '11px',
    'range.value.border': '1px solid #353535',
    'range.value.backgroundColor': '#151515',
    'range.title.color': '#fff',
    'range.title.fontWeight': 'lighter',
    // colorpicker style
    'colorpicker.button.border': '1px solid #1e1e1e',
    'colorpicker.title.color': '#fff'
};
export default {
    data() {
        return {
            instance: null,
            positionArr: []
        };
    },
    props: {
        imageUrl: {
            type: String,
            default: ''
        }
    },
    mounted() {
        this.instance = new ImageEditor(document.querySelector('#tui-image-editor'), {
            includeUI: {
                loadImage: {
                    // path: require('../../../assets/img/1u.jpg'),
                    path: `imgProxy/${this.imageUrl}`,
                    name: 'image'
                },
                // initMenu: 'draw',
                menuBarPosition: 'bottom',
                locale: locale_zh,
                theme: customTheme
                // menu: ['draw'], //显示的功能，只留下了划线的功能
                // uiSize: {
                //     width: '800px',
                //     height: '550px'
                // }
            }
            // cssMaxWidth: 1430,
            // cssMaxHeight: 100,
            // selectionStyle: {
            //     cornerSize: 20,
            //     rotatingPointOffset: 70
            // }
        });

        // this.instance.stopDrawingMode();

        // this.instance.startDrawingMode('LINE_DRAWING');
        // this.instance.setBrush({
        //     width: 12,
        //     color: 'rgba(0, 0, 0, 0.5)'
        // });
        // this.instance.setBrush({
        //     width: 8,
        //     color: 'FFFFFF'
        // });

        this.instance.startDrawingMode('LINE_DRAWING', {
            width: 5,
            color: 'rgba(255,0,0)'
            // arrowType: {
            //     tail: 'chevron' // triangle
            // }
        });

        // canvas区域不遮挡图片 只显示编辑区
        document.getElementsByClassName('tui-image-editor-main')[0].style.top = 0;
        // 隐藏删除按钮 留下全部删除就够了
        document.getElementsByClassName('tie-btn-delete tui-image-editor-item help')[0].style.display = 'none';
        document.getElementsByClassName('tie-btn-deleteAll tui-image-editor-item help')[0].style.display = 'none';
        document.getElementsByClassName('tui-image-editor-icpartition')[0].style.display = 'none'; //线
        document.getElementsByClassName('tui-image-editor-icpartition')[1].style.display = 'none'; //线
        document.getElementsByClassName('tie-btn-history tui-image-editor-item help enabled')[0].style.display = 'none';
        document.getElementsByClassName('tie-btn-redo tui-image-editor-item help')[0].style.display = 'none';
        document.getElementsByClassName('svg_ic-submenu')[0].style.display = 'none';
        document.getElementsByClassName('tui-image-editor-button free')[0].style.display = 'none';
        document.getElementsByClassName('tui-image-editor-controls')[0].style.display = 'none';
        document.getElementsByClassName('tie-btn-zoomIn tui-image-editor-item help enabled')[0].style.display = 'none'; //放大
        document.getElementsByClassName('tie-btn-zoomOut tui-image-editor-item help enabled')[0].style.display = 'none'; //缩小
        document.getElementsByClassName('tie-btn-hand tui-image-editor-item help enabled')[0].style.display = 'none'; //移动

        var that = this;
        //添加线的时候触发的方法
        this.instance.on('objectAdded', function(props) {
            console.log(props);
            that.positionArr.push({
                id: props.id,
                start: props.startPosition,
                end: props.endPosition
            });
            console.log(that.positionArr);
        });

        // 重置
        this.instance.on('undoStackChanged', function(length) {
            if (length == 0) {
                that.positionArr = [];
            }
        });

        // 撤销
        this.instance.on('redoStackChanged', function(length) {
            that.positionArr.pop();
            console.log(that.positionArr);
        });
    },
    methods: {
        uploadImg() {
            const base64String = this.instance.toDataURL();
            let sendToData = {
                positionArr: this.positionArr,
                imgUrl: base64String
            };
            this.$emit('sendToData', sendToData);
            // const data = window.atob(base64String.split(',')[1]);
            // const ia = new Uint8Array(data.length);
            // for (let i = 0; i < data.length; i++) {
            //     ia[i] = data.charCodeAt(i);
            // }
            // const blob = new Blob([ia], { type: 'image/png' });
            // console.log(blob);
            // const fd = new FormData();
            // fd.append('image', blob);
            // upload fd
        }
    }
};
</script>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 70vh;
    /* text-align: center; */
}

.tui-image-editor-container {
    background-color: #fff;
}
.tui-image-editor {
    padding-bottom: 56%;
    width: 100%;
    position: relative;
    margin-top: 200px;
}
canvas {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
}
</style>
