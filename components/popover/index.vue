<template>
    <view tabindex = "-1" class="popover" :class="className" @longpress="longpressHandle()" @click.stop="clickHandle" @blur="showList=false">
        <slot></slot>
        <view v-if="showList" class="popover-list" :class="{center:position==='center',left:position==='left',right:position==='right',}">
            <view v-for="(i,k) in list" :key="k" class="list-item" @click="selectHandle(i)">
                <slot name="item" :item="i">
                    {{i.text}}
                </slot>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    props: {
        disabled: {
            type: Boolean,
            default: false
        },
        className: {
            type: [String,Array],
            default: ''
        },
        list:{
            type: [Array],
            default: ()=>[]
        },
        position: {
            type: String,
            default: 'center'
        },
        mode: {
            type: String,
            default: 'longpress'
        }
    },
    data () {
        return {
            showList: false
        }
    },
    methods: {
        selectHandle(i){
            this.$emit('selctClick',i)
            this.showList = false
        },
        clickHandle(){
            if (this.disabled||this.mode!=='click'){
                return false
            }
            this.showList = true
        },
        longpressHandle(){
            if (this.disabled||this.mode!=='longpress'){
                return false
            }
            this.showList = true
        }
    }
}
</script>

<style lang="scss">
.popover{
    position: relative;
    .popover-list{
        position: absolute;
        min-width: 202upx;
        background: #212328;
        border-radius: 16upx;
        padding: 10upx 0;
        z-index: 8;
        &.center{
            bottom: -10upx;
            transform: translateY(100%) translateX(-50%);
            left: 50%;
        }
        &.left{
            bottom: 0;
            transform: translateY(100%);
            left: -25upx;
        }
        &.right{
            bottom: 0;
            transform: translateY(100%);
            right: -25upx;
        }
        .list-item{
            height: 85upx;
            line-height: 85upx;
            text-align: center;
            font-size: 28upx;
            font-weight: 600;
            color: #F4F7FF;
        }
        &.center::before{
            content: '';
            width: 12upx;
            height: 12upx;
            position: absolute;
            background-color: #212328;
            left: 50%;
            transform: translateX(-50%) rotate(45deg);
            top: -6upx;
        }
        &.right::before{
            content: '';
            width: 12upx;
            height: 12upx;
            position: absolute;
            background-color: #212328;
            top: -6upx;
            right: 40upx;
            transform: rotate(45deg);
        }
        &.left::before{
            content: '';
            width: 12upx;
            height: 12upx;
            position: absolute;
            background-color: #212328;
            left: 40upx;
            transform: rotate(45deg);
            top: -6upx;
        }
    }
}
</style>