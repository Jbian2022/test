<template>
    <view tabindex = "-1" class="popover" :class="className" @longpress="longpressHandle()" @blur="showList=false">
        <slot></slot>
        <view v-if="showList" class="popover-list">
            <view v-for="(i,k) in list" :key="k" class="list-item" @click="clickHandle(i)">
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
        }
    },
    data () {
        return {
            showList: false
        }
    },
    methods: {
        clickHandle(i){
            this.$emit('selctClick',i)
            this.showList = false
        },
        longpressHandle(){
            if (this.disabled){
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
        bottom: 0;
        transform: translateY(100%) translateX(-50%);
        left: 50%;
        min-width: 202upx;
        background: #212328;
        border-radius: 16upx;
        .list-item{
            height: 70upx;
            line-height: 70upx;
            text-align: center;
            font-size: 28upx;
            font-weight: 600;
            color: #F4F7FF;
        }
        &::before{
            content: '';
            width: 12upx;
            height: 12upx;
            position: absolute;
            background-color: #212328;
            left: 50%;
            transform: translateX(-50%) rotate(45deg);
            top: -6upx;
        }
    }
}
</style>