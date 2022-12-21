<template>
  <view class="calendar">
    <view class="calendar-operation">
      <view class="left">
        <slot name="operation-left" :item="value">{{formatDate(value,'YYYY年MM月')}}</slot>
      </view>
      <view class="right">
        <slot name="operation-right" :item="value">
          <button class="operation-right-btn" @click="prevMonth">上个月</button>
          <button class="operation-right-btn" @click="currentMonth">今天</button>
          <button class="operation-right-btn" @click="nextMonth">下个月</button>
        </slot>
      </view>
    </view>
    <view class="calendar-header">
      <view v-for="(item,i) in weekList" :key="i">
        <slot name="header"><span class="calendar-header-title">{{item}}</span></slot>
      </view>
    </view>
    <view class="transition">
      <view class="calendar-content" :class="[transitionClass]" @touchstart="touchStart" @touchend="touchEnd">
        <view v-for="(item,i) in dataList" :key="i" :class="[item.type]" @click="selectHandle(item)">
          <slot :cell="item">
            <view class="calendar-data-item" :class="{'is-selected':item.isSelected}">{{item.key}}</view>
          </slot>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import moment from 'moment'
export default {
  name: 'calendar',
  props: {
    value: {
      required: true,
      type: [Number, String, Date],
      default: () => {
        return new Date()
      }
    },
    format: {
      type: [String],
      default: 'YYYY年MM月DD日'
    },
    mode: {
      type: String,
      default: 'single' // multiple
    },
    todayDisabled: {
      type: Boolean,
      default: false
    } 
  },
  data () {
    return {
      dataList: [],
      weekList: ['一', '二', '三', '四', '五', '六', '日'],
      touchStartX: 0,  // 触屏起始点x  
      touchStartY: 0,  // 触屏起始点y
      transitionClass: ''
    }
  },
  onShow(){
    this.transitionClass = ''
    
  },
  methods: {
    render () {
      // 上月天数
      const prevDaysInMonth = moment(new Date(this.value)).subtract(1, 'months').daysInMonth()
      // 本月第一天是星期几
      const firstDayWeekday = moment(new Date(this.value)).date(1).weekday()
      let weekDayNum = firstDayWeekday
      if (firstDayWeekday === 1) {
        weekDayNum = 6
      }
      if (firstDayWeekday === 0) {
        weekDayNum = 7
      }
      // 本月天数
      const daysInMonth = moment(new Date(this.value)).daysInMonth()

      const list = []
      // 补齐上个月的日期
      for (let i = prevDaysInMonth; i > prevDaysInMonth - weekDayNum + 1; i--) {
        const day = moment(new Date(this.value)).subtract(1, 'months').date(i).format('YYYY-MM-DD')
        const week = moment(new Date(this.value)).subtract(1, 'months').date(i).format('dddd')
        list.unshift({ key: i, type: 'prev', isSelected: false, day, week })
      }
      // 添加这个月的日期
      for (let i = 1; i < daysInMonth + 1; i++) {
        const day = moment(new Date(this.value)).date(i).format('YYYY-MM-DD')
        const week = moment(new Date(this.value)).date(i).format('dddd')
        list.push({ key: i, type: 'current', isSelected: false, day, week, disabled: false })
      }
      // 补齐下个月的日期
      const nextDays = 42 - list.length
      for (var i = 1; i < nextDays + 1; i++) {
        const day = moment(new Date(this.value)).add(1, 'months').date(i).format('YYYY-MM-DD')
        const week = moment(new Date(this.value)).add(1, 'months').date(i).format('dddd')
        list.push({ key: i, type: 'next', isSelected: false, day, week })
      }
      if(this.todayDisabled){
        list.forEach(item=>{
          if(item.type==='current'&& +new Date(item.day) < +new Date(this.formatDate(this.value))){
            item.disabled = true
          }
        })
      }
      if(this.formatDate(this.value)===this.formatDate(new Date())){
        const index = list.findIndex(item => this.formatDate(new Date()) === item.day)
        if (index > -1) {
          list[index].isSelected = true
        }
      }
      this.dataList = list
    },
    prevMonth () {
      const date = moment(new Date(this.value)).subtract(1, 'months').toDate()
      this.$emit('update:value', date)
    },
    nextMonth () {
      const date = moment(new Date(this.value)).add(1, 'months').toDate()
      this.$emit('update:value', date)
    },
    currentMonth () {
      this.$emit('update:value', new Date())
    },
    select (list) {
      if (list.typeof !== 'object') {
        const index = this.dataList.findIndex(item => item.day === this.formatDate(list))
        if (index > -1) {
          this.dataList[index].isSelected = true
        }
        return false
      } else {
        list.forEach(child => {
          const index = this.dataList.findIndex(item => item.day === this.formatDate(child))
          if (index > -1) {
            this.dataList[index].isSelected = true
          }
        })
        return false
      }
    },
    selectHandle (item) {
      if(item.disabled){
        return
      }
      if (item.type === 'current') {
        if (this.mode === 'single') {
          this.dataList.forEach(item => { item.isSelected = false })
        }
        item.isSelected = true
      }
      this.$emit('select', item)
    },
    getSelection () {
      return this.dataList.filter(item => item.isSelected)
    },
    formatDate (value, format = 'YYYY-MM-DD') {
      return moment(new Date(value)).format(format)
    },
    getCurrentData () {
      return this.dataList
    },
    /**  
    * 触摸开始  
    **/  
    touchStart(e) {  
        console.log("触摸开始")  
        this.touchStartX = e.touches[0].clientX;  
        this.touchStartY = e.touches[0].clientY;  
    },  
    /**  
    * 触摸结束  
    **/  
    touchEnd(e) {  
        console.log("触摸结束")  
        let deltaX = e.changedTouches[0].clientX - this.touchStartX;  
        let deltaY = e.changedTouches[0].clientY - this.touchStartY;  
        if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {  
            if (deltaX >= 0) {  
                console.log("左滑")
                this.leftMove()
            } else {  
                console.log("右滑")
                this.rightMove()
            }  
        } else if(Math.abs(deltaY) > 50&& Math.abs(deltaX) < Math.abs(deltaY)) {  
            if (deltaY < 0) {  
                console.log("上滑")  
            } else {  
                console.log("下滑")  
            }  
        } else {  
            console.log("可能是误触！")  
        }  
    }, 
    rightMove(){
      this.transitionClass = 'left-start'
      const time1 = setTimeout(()=>{
        this.nextMonth()
        this.transitionClass = 'left-end'
        clearTimeout(time1)
      },300)
    },
    leftMove(){
      this.transitionClass = 'right-start'
      const time1 = setTimeout(()=>{
        this.prevMonth()
        this.transitionClass = 'right-end'
        clearTimeout(time1)
      },300)
    }      
  },
  watch: {
    value: {
      immediate: true,
      handler: function () {
        this.render()
      }
    }
  }
}
</script>

<style lang="scss">
.calendar{
  .operation-right-btn{
    font-size: 20upx;
    width: 100upx;
    height: 50upx;
    padding: 0;
    display: inline-block;
  }
  .calendar-operation{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 30upx;
    border-bottom: 2upx solid #3B3F46;
  }
  .calendar-header{
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-template-rows: repeat(1, 100upx);
    text-align: center;
    & .calendar-header-title{
      font-size: 26upx;
      color: #BDC3CE;
      line-height: 100upx;
    }
  }
  .calendar-content{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-template-rows: repeat(6, minmax(150upx, 1fr));
    .prev,.next{
      .calendar-data-item{
        color: #7A7F89;
      }
    }
    .calendar-data-item{
      height: 100%;
      width: 100%;
      color: #F4F7FF;
      text-align: center;
      font-size: 28upx;
      &.is-selected,&:hover{
        color: #F4F7FF;
        background-color: #1370FF;
        font-weight: 600;
      }
    }
  }
  .transition{
    width: 100%;
    overflow: hidden;
    position: relative;
    height: 900upx;
  }
  .left-start{
    animation: leftStart .2s linear 0s 1 both;
  }
  .left-end{
    left: 100%;
    animation: leftEnd .2s linear 0s 1 both;
  }
  .right-start{
    animation: rightStart .2s linear 0s 1 both;
  }
  .right-end{
    left: -100%;
    animation: rightEnd .2s linear 0s 1 both;
  }
  @keyframes leftStart{
    0% {
      left: 0px;
    }
    100% {
      left: -100%;
    }
  }
  @keyframes leftEnd{
    0% {
      left: 100%;
    }
    100% {
      left: 0px;
    }
  }
  @keyframes rightStart{
    0% {
      left: 0px;
    }
    100% {
      left: 100%;
    }
  }
  @keyframes rightEnd{
    0% {
      left: -100%;
    }
    100% {
      left: 0px;
    }
  }
}
</style>
