<template>
    <view v-if="value" class="dialog">
        <view class="dialog-box">
            <slot></slot>
        </view>
    </view>
</template>

<script>
export default {
    props: {
        value: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        maskClick(){
            this.$emit('update:value',false)
        }
    }
}
</script>

<style lang="scss">
    .dialog{
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 200;
        .dialog-box{
            position: absolute;
            width: 610upx;
            height: 420upx;
            background: #383D46;
            border-radius: 24upx;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
        }
    }
</style>