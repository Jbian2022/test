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

                <template v-if="pickerType === 'weight'">
                  <picker-view-column>
                    <view
                      class="item"
                      v-for="(item, index) in weightList"
                      :key="index"
                      >{{ item }}</view
                    >
                  </picker-view-column>
                  <picker-view-column>
                    <view
                      class="item"
                      v-for="(item, index) in weightFixList"
                      :key="index"
                      >{{ item }}</view
                    >
                  </picker-view-column>
                </template>
                <template v-if="pickerType === 'muscleMass'">
                  <picker-view-column>
                    <view
                      class="item"
                      v-for="(item, index) in muscleMassList"
                      :key="index"
                      >{{ item }}</view
                    >
                  </picker-view-column>
                  <picker-view-column>
                    <view
                      class="item"
                      v-for="(item, index) in muscleMassFixList"
                      :key="index"
                      >{{ item }}</view
                    >
                  </picker-view-column>
                </template>

                <template v-if="pickerType === 'fatMass'">
                  <picker-view-column>
                    <view
                      class="item"
                      v-for="(item, index) in fatMassList"
                      :key="index"
                      >{{ item }}</view
                    >
                  </picker-view-column>
                  <picker-view-column>
                    <view
                      class="item"
                      v-for="(item, index) in fatMassFixList"
                      :key="index"
                      >{{ item }}</view
                    >
                  </picker-view-column>
                </template>
                <template v-if="pickerType === 'fatPer'">
                  <picker-view-column>
                    <view
                      class="item"
                      v-for="(item, index) in fatPerList"
                      :key="index"
                      >{{ item }}</view
                    >
                  </picker-view-column>
                  <picker-view-column>
                    <view
                      class="item"
                      v-for="(item, index) in fatPerFixList"
                      :key="index"
                      >{{ item }}</view
                    >
                  </picker-view-column>
                </template>

                <template v-if="pickerType === 'bodymoisture'">
                  <picker-view-column>
                    <view
                      class="item"
                      v-for="(item, index) in bodymoistureList"
                      :key="index"
                      >{{ item }}</view
                    >
                  </picker-view-column>
                  <picker-view-column>
                    <view
                      class="item"
                      v-for="(item, index) in bodymoistureFixList"
                      :key="index"
                      >{{ item }}</view
                    >
                  </picker-view-column>
                </template>

                <template v-if="pickerType === 'bmi'">
                  <picker-view-column>
                    <view
                      class="item"
                      v-for="(item, index) in bmiList"
                      :key="index"
                      >{{ item }}</view
                    >
                  </picker-view-column>
                  <picker-view-column>
                    <view
                      class="item"
                      v-for="(item, index) in bmiFixList"
                      :key="index"
                      >{{ item }}</view
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

const weightList = []
const weightFixList = []
const muscleMassList = []
const muscleMassFixList = []

const fatMassList = []
const fatMassFixList = []

const fatPerList = []
const fatPerFixList = []

const bodymoistureList = []
const bodymoistureFixList = []

const bmiList = []
const bmiFixList = []

for (let i = 3; i <= 60; i++) {
  bmiList.push(i)
}

for (let i = 0; i <= 10; i++) {
  bmiFixList.push(i)
}

for (let i = 3; i <= 60; i++) {
  bodymoistureList.push(i)
}

for (let i = 0; i <= 10; i++) {
  bodymoistureFixList.push(i)
}
for (let i = 3; i <= 60; i++) {
  fatPerList.push(i)
}

for (let i = 0; i <= 10; i++) {
  fatPerFixList.push(i)
}

for (let i = 3; i <= 60; i++) {
  fatMassList.push(i)
}

for (let i = 0; i <= 10; i++) {
  fatMassFixList.push(i)
}

for (let i = 10; i <= 60; i++) {
  muscleMassList.push(i)
}

for (let i = 0; i <= 10; i++) {
  muscleMassFixList.push(i)
}

for (let i = 30; i <= 300; i++) {
  weightList.push(i)
}

for (let i = 0; i <= 10; i++) {
  weightFixList.push(i)
}

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
      valueModel: '',
      weightList,
      weightFixList,
      weightValue: '70.0',
      muscleMassList,
      muscleMassFixList,
      muscleMassValue: '30.0',
      fatMassList,
      fatMassFixList,
      fatMassValue: '15.0',
      fatPerList,
      fatPerFixList,
      fatPerValue: '20.0',
      bodymoistureList,
      bodymoistureFixList,
      bodymoistureValue: '30.0',
      bmiList,
      bmiFixList,
      bmiValue: '19.0'
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
      switch (this.pickerType) {
        case 'ordinary':
          this.pickerValue = [this.defaultIndex]
          break
        case 'weight':
          let weightFindexIndex = this.weightList.findIndex(
            (item) => item == this.weightValue
          )
          this.pickerValue = [weightFindexIndex, 0]

          break

        case 'muscleMass':
          let muscleMassFindeIndex = this.muscleMassList.findIndex(
            (item) => item == this.muscleMassValue
          )
          this.pickerValue = [muscleMassFindeIndex, 0]
          break
        case 'fatMass':
          let fatMassFindexIndex = this.fatMassList.findIndex(
            (item) => item == this.fatMassValue
          )
          this.pickerValue = [fatMassFindexIndex, 0]
          break
        case 'fatPer':
          let fatPerFindex = this.fatPerList.findIndex(
            (item) => item == this.fatPerValue
          )
          this.pickerValue = [fatPerFindex, 0]
          break
        case 'bodymoisture':
          let bodymoistureFindIndex = this.bodymoistureList.findIndex(
            (item) => item == this.bodymoistureValue
          )
          this.pickerValue = [bodymoistureFindIndex, 0]
          break
        case 'bmi':
          let bmiFindIndex = this.bodymoistureList.findIndex(
            (item) => item == this.bmiValue
          )
          this.pickerValue = [bmiFindIndex, 0]
          break
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
      switch (this.pickerType) {
        case 'ordinary':
          this.$emit('confirm', this.pickerValue)
          if (this.btnClose) this.close()
          break
        case 'date':
          this.$emit('confirm', this.valueModel)
          if (this.btnClose) this.close()
          break
        case 'weight':
          this.$emit('confirm', this.weightValue)
          if (this.btnClose) this.close()
          break
        case 'muscleMass':
          this.$emit('confirm', this.muscleMassValue)
          if (this.btnClose) this.close()
          break
        case 'fatMass':
          this.$emit('confirm', this.fatMassValue)
          if (this.btnClose) this.close()
          break
        case 'fatPer':
          this.$emit('confirm', this.fatPerValue)
          if (this.btnClose) this.close()
          break
        case 'bodymoisture':
          this.$emit('confirm', this.bodymoistureValue)
          if (this.btnClose) this.close()
          break
        case 'bmi':
          this.$emit('confirm', this.bmiValue)
          if (this.btnClose) this.close()
          break
      }
      // if (this.pickerType === 'ordinary') {
      //   console.log(this.pickerValue.Target, 'this.pickerValue')
      //   this.$emit('confirm', this.pickerValue)
      //   if (this.btnClose) this.close()
      // } else {
      //   this.$emit('confirm', this.valueModel)
      //   if (this.btnClose) this.close()
      // }
    },
    // 点击遮罩
    clickMark() {
      if (this.markClose) this.close()
    },
    bindChange(e) {
      console.log(e, '>>>>>')
      const val = e.detail.value
      switch (this.pickerType) {
        case 'ordinary':
          this.pickerValue = val
          break
        case 'weight':
          this.pickerValue = val
          this.weightValue =
            this.weightList[val[0]] + '.' + this.weightFixList[val[1]]
          break
        case 'muscleMass':
          this.pickerValue = val
          this.muscleMassValue =
            this.muscleMassList[val[0]] + '.' + this.muscleMassFixList[val[1]]
          break
        case 'fatMass':
          this.pickerValue = val
          this.fatMassValue =
            this.fatMassList[val[0]] + '.' + this.fatMassFixList[val[1]]
          break
        case 'fatPer':
          this.pickerValue = val
          this.fatPerValue =
            this.fatPerList[val[0]] + '.' + this.fatPerFixList[val[1]]
          break
        case 'bodymoisture':
          this.pickerValue = val
          this.bodymoistureValue =
            this.bodymoistureList[val[0]] +
            '.' +
            this.bodymoistureFixList[val[1]]
          break
        case 'bmi':
          this.pickerValue = val
          this.bmi = this.bmiList[val[0]] + '.' + this.bmiFixList[val[1]]
          break
        case 'date':
          this.pickerValue = val
          this.year = this.years[val[0]]
          this.month = this.months[val[1]]
          this.day = this.days[val[2]]
          // 新增需要的数据组装
          this.valueModel = this.year + '-' + this.month + '-' + this.day
          console.log(this.year, this.month, this.day)
          break
      }

      // if (this.pickerType === 'ordinary') {
      //   this.pickerValue = val
      // } else {
      //   // this.pickerValue =val
      //   this.year = this.years[val[0]]
      //   this.month = this.months[val[1]]
      //   this.day = this.days[val[2]]
      //   // 新增需要的数据组装
      //   this.valueModel = this.year + '-' + this.month + '-' + this.day
      //   console.log(this.year, this.month, this.day)
      // }
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
