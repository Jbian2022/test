<template>
  <view class="action-library">
    <view class="status_bar"> <!-- 这里是状态栏 --> </view>
    <view class="header">
      <view class="all-action" :class="{active:mode===0}" @click="modeChangeHandle(0)">全部动作库</view>
      <view class="problem-action" :class="{active:mode===1}" @click="modeChangeHandle(1)">问题动作库</view>
      <view class="custom-action" :class="{show:showSaveButton}" @click="addActionHandle(19)">+ 自定义动作</view>
    </view>
    <view class="search">
      <view class="uni-search">
        <van-icon name="search" />
        <input class="uni-input" v-model="actionName" @confirm="getActionList" confirm-type="search" placeholder="输入动作名称搜索" />
      </view>
    </view>
    <view class="content" :class="{'select-page':showSaveButton}">
      <view class="sidebar">
        <van-sidebar v-model="actionClass" @change="getActionList">
          <template v-if="!showSaveButton">
            <van-sidebar-item v-for="item in actionClassList" :key="item.value" :title="item.text" />
          </template>
          <template v-else>
            <van-sidebar-item v-for="item in actionClassList" :key="item.value" :title="item.text" :badge="item.badge" />
          </template>
        </van-sidebar>
      </view>
      <view class="action-list">
        <view class="action-list-title">{{actionClassName}}训练动作</view>
        <view class="action-list-view">
          <view v-if="actionClass===19" class="action-list-box">
            <view v-for="i in actionList" :key="i._id" class="action-list-item" :class="{active:i.active}" @click="selectAction(i)">
              <popover className="image" :list="actions" mode="longpress" :disabled="showSaveButton" @selctClick="selectClick">
                <view class="action-name">{{i.actionName[0]}}</view>
                <template v-slot:item="{item}">
                  <text v-if="item.text==='删除动作'" style="color:#F04242;">{{item.text}}</text>
                  <text v-else>{{item.text}}</text>
                </template>
              </popover>
              <view class="text">{{i.actionName}}</view>
            </view>
          </view>
          <view v-else class="action-list-box">
            <view v-for="i in actionList" :key="i._id" class="action-list-item" :class="{active:i.active}" @click="selectAction(i)">
              <view class="image">
                <!-- <van-image round src="../../static/newWorkout/action.png" /> -->
                <view class="van-image"></view>
              </view>
              <view class="text">{{i.actionName}}</view>
            </view>
          </view>
          <view v-if="!showSaveButton" class="custom-action-button" @click="addActionHandle">
            <text> + 自定义动作</text>
          </view>
        </view>
      </view>
    </view>
    <view v-if="showSaveButton" class="footer-seat"></view>
    <view v-if="showSaveButton" class="footer-button">
      <van-button type="default" @click="goBack">取消</van-button>
      <van-button type="primary" @click="goNewWorkout">确认添加（{{selectNum}}）</van-button>
    </view>
    <van-dialog v-model:show="showDialog" :showConfirmButton="false">
      <view class="dialog-section">
        <view class="dialog-title">是否确认删除</view>
        <view class="dialog-content">确认删除该动作吗？删除后无法恢复</view>
        <view class="dialog-btn-box">
          <van-button type="default" @click="showDialog=false">取消</van-button>
          <van-button type="primary" @click="showDialog=false">确认</van-button>
        </view>
      </view>
    </van-dialog>
  </view>
</template>

<script>
const actionLibrary = uniCloud.importObject('actionLibrary')
import popover from '../../components/popover/index.vue'
export default {
  components: {
    popover,
  },
  data() {
    return {
      mode: 0,
      actionName: null,
      actionClass: 0,
      actionClassName: '胸',
      actionClassList: [
        {
          text: '胸',
          value: 0,
        },
        {
          text: '背',
          value: 1,
        },
        {
          text: '腿',
          value: 2,
        },
        {
          text: '肩',
          value: 3,
        },
        {
          text: '斜方肌',
          value: 4,
        },
        {
          text: '二头',
          value: 5,
        },
        {
          text: '三头',
          value: 6,
        },
        {
          text: '小腿',
          value: 7,
        },
        {
          text: '前臂',
          value: 8,
        },
        {
          text: '臀部',
          value: 9,
        },
        {
          text: '颈前引',
          value: 10,
        },
        {
          text: '圆肩',
          value: 11,
        },
        {
          text: '驼背',
          value: 12,
        },
        {
          text: '翼状肩胛',
          value: 13,
        },
        {
          text: '骨盆前倾',
          value: 14,
        },
        {
          text: '骨盆后倾',
          value: 15,
        },
        {
          text: '膝内扣',
          value: 16,
        },
        {
          text: '足外翻',
          value: 17,
        },
        {
          text: '足内翻',
          value: 18,
        },
        {
          text: '自定义动作',
          value: 19,
        },
      ],
      actions: [{ text: '修改动作' }, { text: '删除动作' }],
      showDialog: false,
      showSaveButton: false,
      actionList: [],
      selectActionList:[]
    }
  },
  onShow(){
    this.selectActionList=[]
    const type = uni.getStorageSync('actionLibraryType')
    if(type==='select'){
      this.actionClassList.forEach(item=>{
        const list = this.selectActionList.filter(child => child.actionClass === item.value)
        item.badge = list.length || null
      })
      uni.hideTabBar()
      this.showSaveButton = true
    } else {
      uni.showTabBar()
      this.showSaveButton = false
    }
    this.getActionList()
  },
  methods: {
    async getActionList() {
      this.actionClassName = this.actionClassList[this.actionClass].text
      const res = await actionLibrary.getActionList({
        type: this.mode,
        actionClass: this.actionClass,
        actionName: this.actionName,
      })
      const actionList = res.data || []
      this.actionList = actionList.map(item=>{
        const flag = this.selectActionList.some(i=>item._id===i._id)
        if(flag){
          return {
            ...item,
            active: true
          }
        } else {
          return {
            ...item,
            active: false
          }
        }
      })
      // console.log(res, 888)
    },
    modeChangeHandle(val) {
      this.mode = val
      this.getActionList()
    },
    selectAction(i){
      if(!this.showSaveButton){
        return
      }
      i.active = !i.active
      if(i.active){
        this.selectActionList.push(i)
      } else {
        this.selectActionList = this.selectActionList.filter(item=>item._id!==i._id)
      }
      this.actionClassList.forEach(item=>{
        const list = this.selectActionList.filter(child => child.actionClass === item.value)
        item.badge = list.length || null
      })
      // console.log(this.actionClassList,888)
    },
    selectClick(item) {
      if (item.text === '删除动作') {
        this.showDialog = true
      }
    },
    addActionHandle(index) {
      if(index===19){
        uni.navigateTo({
          url: '/pages/addAction/index'+`?type=${this.mode}&actionClass=${index}`,
        })
      } else {
        uni.navigateTo({
          url: '/pages/addAction/index'+`?type=${this.mode}&actionClass=${this.actionClass}`,
        })
      }
    },
    goBack(){
      uni.setStorageSync('actionLibraryType', 'show')
      uni.setStorageSync('actionList', JSON.stringify([]))
      uni.navigateTo({
        url: '/pages/newWorkout/newWorkout'
      });
      this.actionList = []
      uni.showTabBar()
    },
    goNewWorkout(){
      uni.setStorageSync('actionLibraryType', 'show')
      uni.setStorageSync('actionList', JSON.stringify(this.selectActionList))
      uni.navigateTo({
        url: '/pages/newWorkout/newWorkout'
      });
      this.actionList = []
      uni.showTabBar()
    }
  },
  computed:{
    selectNum(){
      return this.selectActionList.length || 0
    }
  }
}
</script>

<style lang="scss">
page {
  background: #212328;
}
.status_bar {
    height: var(--status-bar-height);
    width: 100%;
}
.action-library {
  .header {
    height: 100upx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 40upx;
    .all-action,
    .problem-action {
      font-size: 40upx;
      color: #7a7f89;
      &.active {
        font-weight: 600;
        color: #f4f7ff;
      }
    }
    .custom-action {
      font-size: 28upx;
      font-weight: 400;
      color: #f4f7ff;
      &.show{
        opacity: 0;
      }
    }
  }
  .search {
    height: 140upx;
    padding: 30upx;
    box-sizing: border-box;
    .uni-search{
      background: #383d46;
      border-radius: 40upx;
      height: 80upx;
      display: flex;
      align-items: center;
      .van-icon{
        font-size: 28upx;
        color: #BDC3CE;
        margin-right: 14upx;
        margin-left: 28upx;
      }
      .uni-input{
        flex: 1;
        color: #f4f7ff;
        font-size: 28upx;
        &::placeholder{
          color: #7a7f89;
        }
      }
    }
  }
  .content {
    height: calc(100vh - 240upx - var(--status-bar-height));
    box-sizing: border-box;
    display: flex;
    .sidebar {
      width: 220upx;
      overflow-y: auto;
      .van-sidebar {
        width: 220upx;
      }
      ::v-deep .van-sidebar-item {
        height: 70upx;
        padding: 0;
        padding-top: 16upx;
        padding-left: 30upx;
        background: transparent;
        font-weight: 400;
        margin: 0;
        .van-sidebar-item__text {
          color: #7a7f89;
          font-size: 28upx;
          width: 170upx;
        }
        .van-badge {
          background: #1370ff;
          border: none;
          min-width: 28upx;
          min-height: 28upx;
          font-size: 20upx;
          color: #f4f7ff;
          top: 50%;
          transform: translateY(-50%);
        }
      }
      ::v-deep .van-sidebar-item--select {
        background: linear-gradient(270deg, #202123 0%, #383d46 100%);
        .van-sidebar-item__text {
          font-weight: 600;
          color: #f4f7ff;
        }
        &:before {
          height: 70upx;
          background-color: #1370ff;
          width: 6upx;
        }
      }
    }
    .action-list {
      .action-list-view {
        height: calc(100% - 50upx);
        padding-right: 30upx;
        overflow-y: auto;
      }
      flex: 1;
      .custom-action-button {
        margin-top: 30upx;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 140upx;
        background: rgba(244, 247, 255, 0.1);
        border-radius: 16upx;
        border: 2px solid rgba(244, 247, 255, 0.2);
        font-weight: 400;
        color: #f4f7ff;
        font-size: 30upx;
      }
      .action-list-title {
        font-size: 36upx;
        font-weight: 600;
        color: #f4f7ff;
      }
      .action-list-box {
        display: flex;
        flex-wrap: wrap;
        .action-list-item {
          margin-top: 30upx;
          width: calc(50% - 15upx);
          height: 240upx;
          background: #383d46;
          border-radius: 24upx;
          box-sizing: border-box;
          &:nth-child(2n) {
            margin-left: 30upx;
          }
          ::v-deep .image {
            padding-top: 30upx;
            text-align: center;
            .action-name{
              width: 100upx;
              height: 100upx;
              margin: 0 auto;
              font-size: 28upx;
              font-weight: 600;
              line-height: 100upx;
              border-radius: 100%;
              background: #1370FF;
              color: #F4F7FF;
            }
          }
          .van-image {
            width: 100upx;
            height: 100upx;
            display: inline-block;
            background: url('../../static/newWorkout/action.png');
            background-size: contain;
          }
          .text {
            padding: 8upx 30upx;
            color: #a8adb6;
            font-size: 26upx;
            text-align: center;
          }
          &.active {
            background: #1c3965;
            border: 2upx solid #1370ff;
            .text {
              color: #f4f7ff;
            }
          }
        }
      }
    }
    &.select-page{
      height: calc(100vh - 380upx);
    }
  }
  .dialog-section {
    padding: 50upx;
    .dialog-title {
      display: flex;
      align-items: center;
      font-size: 52upx;
      color: #f4f7ff;
      line-height: 72upx;
      &::after {
        content: '';
        margin-left: 20upx;
        display: inline-block;
        width: 60upx;
        height: 60upx;
        background: url('../../static/newWorkout/pop-up.png');
        background-size: contain;
        background-repeat: no-repeat;
      }
    }
    .dialog-content {
      margin-top: 30upx;
      margin-bottom: 80upx;
      font-size: 30upx;
      font-weight: 400;
      color: #a8adb6;
      line-height: 48upx;
    }
  }
  .dialog-btn-box {
    ::v-deep.van-button {
      width: 240upx;
      height: 90upx;
      background: #454951;
      border-radius: 16upx;
      border: none;
      font-size: 32upx;
      font-weight: 600;
      color: #ffffff;
      & + .van-button {
        margin-left: 30upx;
      }
      &.van-button--primary {
        background: #1370ff;
      }
    }
  }
  .footer-seat {
    height: 198upx;
  }
  .footer-button {
    position: fixed;
    padding: 68upx 30upx;
    padding-top: 30upx;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1;
    background: #212328;
    .van-button {
      background: #454951;
      border-radius: 16upx;
      height: 100upx;
      font-size: 32upx;
      font-weight: 600;
      color: #ffffff;
      border: none;
      width: 200upx;
      & + .van-button {
        margin-left: 30upx;
      }
      &.van-button--primary {
        width: 460upx;
        background: #1370ff;
      }
    }
  }
  ::v-deep.van-dialog {
    background: #383d46;
    border-radius: 24upx;
  }
}
</style>
