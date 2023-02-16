<template>
  <view class="pricke">
    <uni-transition
      v-if="mark"
      ref="aniMark"
      custom-class="transition"
      mode-class="fade"
      :styles="stylesMark"
      :show="show"
      @click="clickMark"
    ></uni-transition>
    <uni-transition
      ref="ani"
      custom-class="transition"
      :mode-class="modeClass"
      :styles="styles"
      :show="show"
    >
      <view class="m-picker">
        <view
          class="m-picker__case"
          :style="{
            background: bgColor,
            borderTopLeftRadius: radius[0] + 'rpx',
            borderTopRightRadius: radius[1] + 'rpx',
            borderBottomLeftRadius: radius[2] + 'rpx',
            borderBottomRightRadius: radius[3] + 'rpx',
            paddingBottom:
              model == 'bottom'
                ? 'calc(constant(safe-area-inset-bottom) + 30rpx)'
                : '30rpx',
            paddingBottom:
              model == 'bottom'
                ? 'calc(env(safe-area-inset-bottom) + 30rpx)'
                : '30rpx'
          }"
        >
          <slot v-if="model == 'bottom'" name="handle">
            <view class="handle">
              <view
                class="button cancel"
                :style="cancelStyle"
                @click="cancel"
                >{{ cancelText }}</view
              >
              <view
                class="button confirm"
                :style="confirmStyle"
                @click="confirm"
                >{{ confirmText }}</view
              >
            </view>
          </slot>
          <slot>
            <view class="content" :style="{ height: `${height}rpx` }">
              <picker-view
                class="picker-view"
                :indicator-class="indicatorClass"
                :indicator-style="indicatorStyle"
                :value="pickerValue"
                @change="bindChange"
                @pickstart="pickstart"
                @pickend="pickend"
              >
                <template v-if="pickerType === 'ordinary'">
                  <picker-view-column
                    v-for="(rangeItem, rangeIndex) in opearRange"
                    :key="rangeIndex"
                  >
                    <view
                      class="picker-view__item"
                      v-for="(item, index) in rangeItem"
                      :key="index"
                    >
                      {{ item[rangeKey] }}
                    </view>
                  </picker-view-column>
                </template>
                <template v-if="pickerType === 'date'">
                  <picker-view-column>
                    <view
                      class="item"
                      v-for="(item, index) in years"
                      :key="index"
                      >{{ item }}年</view
                    >
                  </picker-view-column>
                  <picker-view-column>
                    <view
                      class="item"
                      v-for="(item, index) in months"
                      :key="index"
                      >{{ item }}月</view
                    >
                  </picker-view-column>
                  <picker-view-column>
                    <view
                      class="item"
                      v-for="(item, index) in days"
                      :key="index"
                      >{{ item }}日</view
                    >
                  </picker-view-column>
                </template>
              </picker-view>
            </view>
          </slot>
          <slot v-if="model != 'bottom'" name="handle">
            <view class="handle">
              <view
                class="button cancel"
                :style="cancelStyle"
                @click="cancel"
                >{{ cancelText }}</view
              >
              <view
                class="button confirm"
                :style="confirmStyle"
                @click="confirm"
                >{{ confirmText }}</view
              >
            </view>
          </slot>
        </view>
      </view>
    </uni-transition>
  </view>
</template>

<script>
import props from './props.js'
const date = new Date()
const years = []
const year = date.getFullYear()
const months = []
const month = date.getMonth() + 1
const days = []
const day = date.getDate()
for (let i = 1770; i <= date.getFullYear(); i++) {
  years.push(i)
}
for (let i = 1; i <= 12; i++) {
  months.push(i)
}
for (let i = 1; i <= 31; i++) {
  days.push(i)
}
export default {
  name: 'jarvis-picker',
  props,
  data() {
    return {
      pickerValue: [],
      pickMove: false,
      opearRange: [],
      years,
      year,
      months,
      month,
      days,
      day,
      value: [9999, month - 1, day - 1],
      visible: true,
      valueModel: ''
    }
  },
  computed: {
    model() {
      if (this.mode == 'top') return 'top'
      else if (this.mode == 'bottom') return 'bottom'
      else if (this.mode == 'center') return 'center'
      else return 'bottom'
    },
    stylesMark() {
      return {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 99,
        backgroundColor: this.markBgColor
      }
    },
    styles() {
      const top = {
        position: 'fixed',
        left: 0,
        right: 0,
        top: 0,
        zIndex: 100
      }
      const bottom = {
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 100
      }
      const center = {
        position: 'fixed',
        left: '50%',
        top: '50%',
        width: '90vw',
        transform: 'translate(-50%, -50%)',
        zIndex: 100
      }
      if (this.model == 'top') return top
      else if (this.model == 'bottom') return bottom
      else if (this.model == 'center') return center
      else return bottom
    },
    radius() {
      const borderRadius = this.borderRadius
      if (this.model == 'top') return [0, 0, borderRadius, borderRadius]
      else if (this.model == 'bottom') return [borderRadius, borderRadius, 0, 0]
      else if (this.model == 'center')
        return [borderRadius, borderRadius, borderRadius, borderRadius]
      else return [0, 0, 0, 0]
    },
    modeClass() {
      if (this.model == 'top') return ['fade', 'slide-top']
      else if (this.model == 'bottom') return ['fade', 'slide-bottom']
      else if (this.model == 'center') return 'fade'
      else return ['fade', 'slide-bottom']
    }
  },
  watch: {
    range: {
      handler: function (n, o) {
        this.opearRange = [n]
      },
      immediate: true
    },
    distinguishModel: {
      handler: function (n, o) {
        if (n) {
          let resultInde = n.split('-')
          let findYearIndex = this.years.findIndex((k) => k == resultInde[0])
          let findMonthIndex = this.months.findIndex((v) => v == resultInde[1])
          let findDatyIndex = this.days.findIndex((c) => c == resultInde[2])
          this.pickerValue = [findYearIndex, findMonthIndex, findDatyIndex]
        } else {
          this.pickerValue = [9999, this.month - 1, this.day - 1]
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.$nextTick(() => {
      // console.log(this.range,'>>>>')
      if (this.pickerType === 'ordinary') {
        this.pickerValue = [this.defaultIndex]
      }
    })
  },
  methods: {
    // 关闭
    close() {
      if (!this.pickMove) this.$emit('update:show', false)
    },
    // 取消
    cancel() {
      this.$emit('cancel')
      if (this.btnClose) this.close()
    },
    // 确定
    confirm() {
      if (this.pickerType === 'ordinary') {
        console.log(this.pickerValue.Target, 'this.pickerValue')
        this.$emit('confirm', this.pickerValue)
        if (this.btnClose) this.close()
      } else {
        this.$emit('confirm', this.valueModel)
        if (this.btnClose) this.close()
      }
    },
    // 点击遮罩
    clickMark() {
      if (this.markClose) this.close()
    },
    bindChange(e) {
      console.log(e, '>>>>>')
      const val = e.detail.value
      if (this.pickerType === 'ordinary') {
        this.pickerValue = val
      } else {
        // this.pickerValue =val
        this.year = this.years[val[0]]
        this.month = this.months[val[1]]
        this.day = this.days[val[2]]
        // 新增需要的数据组装
        this.valueModel = this.year + '-' + this.month + '-' + this.day
        console.log(this.year, this.month, this.day)
      }
    },
    pickstart() {
      this.pickMove = true
    },
    pickend() {
      this.pickMove = false
    }
  }
}
</script>

<style lang="scss" scoped>
.m-picker {
  width: 100%;
  height: 100%;

  &__case {
    padding-left: 56rpx;
    padding-right: 56rpx;
    padding-top: 30rpx;
    padding-bottom: 30rpx;

    .handle {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .button {
        font-size: 48rpx;
        font-weight: 500;
        color: #000000;

        &.cancel {
        }

        &.confirm {
          color: #ff8833;
        }
      }
    }

    .content {
      width: 100%;
      height: 400rpx;
    }
  }
}

.picker-view {
  width: 100%;
  height: 100%;

  &__item {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 48rpx;
  }
}

.transition {
  border-radius: 24upx 24upx 0px 0px;
}
.m-picker {
  border-radius: 24upx 24upx 0px 0px;
}
.m-picker__case {
  border-radius: 24upx 24upx 0px 0px !important;
  background: #383d46;
}
.m-picker__case .handle .cancel {
  //   padding-left: 40upx;
  // padding-top: 40upx;
  font-size: 32upx;
  font-weight: 600;
  color: #7a7f89;
}
.m-picker__case .handle .button.confirm {
  //   padding-right: 40upx;
  // padding-top: 40upx;
  font-size: 32upx;
  font-weight: 600;
  color: #f4f7ff !important;
}
.picker-view__item {
  font-size: 30upx;
  font-weight: 400;
  color: #f4f7ff;
}
::v-deep.uni-picker-view-indicator {
  border: none !important;
  // width: 80%;

  // margin-left: 40upx;
  background: rgba(75, 82, 94, 0.2) !important;
  border-radius: 16px;
  // z-index: -1;
}

::v-deep.uni-picker-view-indicator:before {
  border-top: none;
}
::v-deep.uni-picker-view-indicator::after {
  border-bottom: none;
}
::v-deep.uni-picker-view-content {
  display: flex;
  flex-direction: column;
  align-items: center;

  .item {
    font-size: 30upx;
    font-weight: 400;
    color: #f4f7ff;
    line-height: 50px;
  }
}

::v-deep .uni-picker-view-mask {
  top: 0;
  height: 100%;
  margin: 0 auto;
  background-image: linear-gradient(
      to bottom,
      rgba(56, 61, 70, 0.9),
      rgba(56, 61, 70, 0.5)
    ),
    linear-gradient(to bottom, rgba(56, 61, 70, 0.5), rgba(56, 61, 70, 0.9));
  // background: linear-gradient( 180deg, hsla(0, 0%, 100%, 0.95), hsla(0, 0%, 100%, 0.6) ), linear-gradient(0deg, hsla(0, 0%, 100%, 0.95), hsla(0, 0%, 100%, 0.6));
  background-position: top, bottom;
  background-size: 100% 102px;
  background-repeat: no-repeat;
}
</style>
