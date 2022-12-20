### 使用组件

<m-picker mode="bottom" :show.sync="show" :range="list" @confirm="confirm"></m-picker>

### 引入组件

import mPicker from '@/components/m-picker/m-picker.vue';

### 注册组件

export default {
    components: { mPicker },
    data() {
        return {
            show: true,
            list: [
                [
                    {
                        label: '男',
                        value: 0
                    },
                    {
                        label: '女',
                        value: 1
                    },
                    {
                        label: '未知',
                        value: 2
                    }
                ]
            ]
        }
    },
    methods: {
        confirm(e) {
            console.log(e);
        }
    }
}

### 参数

是否显示遮罩
mark: {
    type: Boolean,
    default() {
        return true
    }
},
点击遮罩是否关闭
markClose: {
    type: Boolean,
    default() {
        return true
    }
},
点击按钮是否关闭
btnClose: {
    type: Boolean,
    default() {
        return true
    }
},
是否显示弹窗
show: {
    type: Boolean,
    default() {
        return false
    }
},
数据
range: {
    type: Array,
    default: []
},
picker-item显示内容的key
rangeKey: {
    type: String,
    default: 'label'
},
设置选择器中间选中框的样式
indicatorStyle: {
    type: String,
    default: 'height: 50px;'
},
设置选择器中间选中框的类名，注意页面或组件的style中写了scoped时，需要在类名前写/deep/
indicatorClass: {
    type: String,
    default: ''
},
cancel文字
cancelText: {
    type: String,
    default: '取消'
},
confirm文字
confirmText: {
    type: String,
    default: '确定'
},
cancel样式style
cancelStyle: {
    type: Object,
    default: {}
},
confirm样式style
confirmStyle: {
    type: Object,
    default: {}
},
内容高度 rpx
height: {
    type: Number,
    default: 500
},
圆角 rpx
borderRadius: {
    type: Number,
    default: 16
},
背景颜色
bgColor: {
    type: String,
    default: '#FFFFFF'
},
mark 背景颜色
markBgColor: {
    type: String,
    default: '#00000080'
},
方向 top/bottom/center
mode: {
    type: String,
    default: 'bottom'
}
