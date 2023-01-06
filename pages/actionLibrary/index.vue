<template>
  <view class="action-library">
    <view class="status_bar"> <!-- 这里是状态栏 --> </view>
    <view class="background-header"></view>
		<view class="background"></view>
    <view class="header">
      <view class="all-action" :class="{active:mode===0}" @click="modeChangeHandle(0)">全部动作库</view>
      <view class="problem-action" :class="{active:mode===1}" @click="modeChangeHandle(1)">问题动作库</view>
      <view class="custom-action" @click="addActionHandle('z')">+ 自定义动作</view>
    </view>
    <view class="search">
      <view class="uni-search">
        <view class="image"></view>
        <input class="uni-input" v-model="actionName" @confirm="getActionList" confirm-type="search" placeholder="输入动作名称搜索" />
      </view>
    </view>
    <view class="content" :class="{'select-page':showSaveButton}">
      <view class="sidebar">
        <van-sidebar v-model="actionIndex">
          <template v-if="!showSaveButton">
            <van-sidebar-item v-for="item in actionClassList" :key="item.value" :title="item.text"  @click="sidebarClick(item)"/>
          </template>
          <template v-else>
            <van-sidebar-item v-for="item in actionClassList" :key="item.value" :title="item.text" :badge="item.badge" @click="sidebarClick(item)" />
          </template>
        </van-sidebar>
      </view>
      <view class="action-list">
        <view class="action-list-title">{{actionClassName}}训练动作</view>
        <view class="action-list-view">
          <view v-for="(classify,classifyi) in actionList" :key="classifyi" class="classify-box">
            <view class="classify">{{actionTypeList[classify.actionType].title}}</view>
            <view class="action-list-box">
              <template v-for="i in classify.children" :key="i._id">
                <view v-if="i.userId" class="action-list-item" :class="{active:i.active}" @click="selectAction(i)">
                  <popover className="image" :list="actions" mode="longpress" @selctClick="selectClick($event,i)">
                    <view class="action-name">{{i.actionName[0]}}</view>
                    <template v-slot:item="{item}">
                      <text v-if="item.text==='删除动作'" style="color:#F04242;">{{item.text}}</text>
                      <text v-else>{{item.text}}</text>
                    </template>
                  </popover>
                  <view class="text">{{i.actionName}}</view>
                </view>
                <view v-else class="action-list-item" :class="{active:i.active}" @click="selectAction(i)">
                  <view class="image">
                    <van-image v-if="i.url" round :src="i.url" />
                    <view v-else class="van-image"></view>
                  </view>
                  <view class="text">{{i.actionName}}</view>
                </view>
              </template>
            </view>
          </view>
          <view class="custom-action-button" @click="addActionHandle">
            <text> + 自定义动作</text>
          </view>
        </view>
      </view>
    </view>
    <view v-if="showSaveButton" class="footer-seat"></view>
    <view v-if="showSaveButton" class="footer-button">
      <van-button type="default" @click="goBack">取消</van-button>
      <van-button block type="primary" @click="goNewWorkout">确认添加（{{selectNum}}）</van-button>
    </view>
    <uni-popup ref="popup" type="center" mask-background-color="rgba(20, 21, 23, 0.6)">
      <view class="dialog">
        <view class="dialog-section">
          <view class="dialog-title">是否确认删除</view>
          <view class="dialog-content">确认删除该动作吗？删除后无法恢复</view>
          <view class="dialog-btn-box">
            <van-button type="default" @click="closePopup">取消</van-button>
            <van-button type="primary" @click="deleteHandle">确认</van-button>
          </view>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
const actionLibrary = uniCloud.importObject('actionLibrary',{ customuI: true })
import popover from '../../components/popover/index.vue'
export default {
  components: {
    popover,
  },
  data() {
    return {
      mode: 0,
      actionName: null,
      actionIndex: 0,
      actionClass: 0,
      actionClassName: '胸',
      actionClassList: [
        {text: '胸部', value: 0, },
        {text: '背部', value: 1, },
        {text: '腿部', value: 2, },
        {text: '臀部', value: 3, },
        {text: '肩部', value: 4, },
        {text: '二头肌', value: 5, },
        {text: '三头肌', value: 6, },
        {text: '腹部', value: 7, },
        {text: '小腿', value: 8, },
        {text: '斜方肌', value: 9 },
        {text: '自定义动作', value: 10}
      ],
      actionClassListAll: [
        {text: '胸部', value: 0, },
        {text: '背部', value: 1, },
        {text: '腿部', value: 2, },
        {text: '臀部', value: 3, },
        {text: '肩部', value: 4, },
        {text: '二头肌', value: 5, },
        {text: '三头肌', value: 6, },
        {text: '腹部', value: 7, },
        {text: '小腿', value: 8, },
        {text: '斜方肌', value: 9 },
        {text: '自定义动作', value: 10}
      ],
      actionClassListPro: [
        {text:'颈前引', value: 11},
        {text:'圆肩', value: 12},
        {text:'驼背', value: 13},
        {text:'骨盆前倾', value: 14},
        {text:'骨盆后倾', value: 15},
        {text:'膝内扣', value: 16},
        {text:'足外翻', value: 17},
        {text:'足内翻', value: 18},
        {text:'翼状肩胛', value: 19},
        {text: '自定义动作', value: 20}
      ],
      actions: [{ text: '修改动作' }, { text: '删除动作' }],
      showDialog: false,
      showSaveButton: false,
      actionList: [],
      selectActionList:[],
      actionTypeList:[
					{
						type: 0,
						title:'力量训练',
						des:'力量训练的类型，可以为自定义动作提供记录次数和重量，其中重量的单位只能为公斤（kg）和磅（lbs）',
						active:false
					},
					{
						type: 1,
						title:'有氧训练',
						des:'有氧训练有多种记录形式，用户可以自行选择多种记录组合进行搭配',
						active:false
					},
					{
						type: 2,
						title:'仅需要填写次数',
						des:'有些动作既不会负重，也不需要重物，此时你可以选择这种记录方式',
						active:false
					},
					{
						type: 3,
						title:'仅记录时间',
						des:'有些动作你只想记录时间的，选择此类记录形式你可以自行选择用秒表还是计时器',
						active:false
					},
					{
						type: 4,
						title:'自重训练',
						des:'自重动作、自动负重动作，都适合这种训练类型。如果你不负重，那么你可以只填写次数；如果负重，那么可以填写附加的重量',
						active:false
					},
					{
						type: 5,
						title:'自重辅助',
						des:'例如辅助引体向上、辅助臂屈伸等等项目，需要用到辅助重量的动作，适合这种类型。这种类型可以自行设置体重。',
						active:false
					},
					{
						type: 6,
						title:'放松训练',
						des:'拉伸动作无需记录任何数据',
						active:false
					}
			],
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
    sidebarClick(item){
      this.actionClass = item.value
      this.actionClassName = item.text
      this.getActionList()
    },
    async getActionList() {
      this.actionList = []
      const res = await actionLibrary.getActionList({
        type: this.mode,
        actionClass: this.actionClass,
        actionName: this.actionName,
      })
      const actionTemp = res.data || []
      const actionList = actionTemp.map(item=>{
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
      const actionTypeTemp = actionList.map(item=>item.actionType)
      const actionTypeList = [...new Set(actionTypeTemp)]
      this.actionList = actionTypeList.map(item=>{
        const children = actionList.filter(child=>child.actionType===item)
        return {
          actionType: item,
          children: children
        }
      })
      console.log(this.actionList, 888)
    },
    modeChangeHandle(val) {
      this.mode = val
      if(val===0){
        this.actionIndex = 0
        this.actionClass = 0
        this.actionClassList = JSON.parse(JSON.stringify(this.actionClassListAll))
      } else {
        this.actionIndex = 0
        this.actionClass = 11
        this.actionClassList = JSON.parse(JSON.stringify(this.actionClassListPro))
      }
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
    },
    selectClick(item,info) {
      if (item.text === '删除动作') {
        this.currentAction = info
        this.$refs.popup.open()
      } else if(item.text === '修改动作'){
        uni.reLaunch({
          url: '/pages/addAction/index'+`?type=${this.mode}&actionClass=${this.actionClass}&update=1&id=${info._id}&actionName=${info.actionName}&actionType=${info.actionType}`,
        })
      }
    },
    addActionHandle(z) {
      if(this.mode===0&&z==='z') {
        uni.reLaunch({
          url: '/pages/addAction/index'+`?type=${this.mode}&actionClass=10`,
        })
      } else if(this.mode===1&&z==='z') {
        uni.reLaunch({
          url: '/pages/addAction/index'+`?type=${this.mode}&actionClass=20`,
        })
      } else {
        uni.reLaunch({
          url: '/pages/addAction/index'+`?type=${this.mode}&actionClass=${this.actionClass}`,
        })
      }
    },
    async deleteHandle(){
      this.$refs.popup.close()
      const res = await actionLibrary.deleteAction({id:this.currentAction._id})
      uni.showToast({	title: '删除成功',	duration: 1000});
      this.getActionList()
    },
    closePopup(){
      this.$refs.popup.close()
    },
    goBack(){
      uni.setStorageSync('actionLibraryType', 'show')
      uni.setStorageSync('actionList', JSON.stringify([]))
      uni.reLaunch({
        url: '/pages/newWorkout/newWorkout'
      });
      this.actionList = []
      uni.showTabBar()
    },
    goNewWorkout(){
      uni.setStorageSync('actionLibraryType', 'show')
      uni.setStorageSync('actionList', JSON.stringify(this.selectActionList))
      uni.reLaunch({
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
.background-header{
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: -1;
  height: 460upx;
  background: linear-gradient(to bottom, rgba(52, 58, 68, 1), #212328);
}
.background{
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: -2;
  height: 100vh;
  background: #212328;
}
.status_bar {
    height: var(--status-bar-height);
    width: 100%;
}
.action-library {
  position: relative;
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
    height: 120upx;
    padding: 30upx;
    padding-top: 0upx;
    box-sizing: border-box;
    .uni-search{
      background: #383d46;
      border-radius: 40upx;
      height: 80upx;
      display: flex;
      align-items: center;
      .image{
        width: 28upx;
        height: 28upx;
        margin-right: 14upx;
        margin-left: 28upx;
        background-image: url('../../static/newWorkout/search.png');
        background-size: contain;
        background-repeat: no-repeat;
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
    height: calc(100vh - 250upx - var(--status-bar-height));
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
        background: linear-gradient(270deg, rgba(56,61,70,0) 0%, #383D46 100%);
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
        height: calc(100% - 20upx);
        padding-right: 30upx;
        overflow-y: auto;
        .classify-box{
          width: 100%;
          .classify{
            margin-top: 12upx;
            transform: translateY(8upx);
            font-size: 28upx;
            font-weight: 600;
            color: #BDC3CE;
            line-height: 40upx;
          }
        }
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
  .dialog {
    background: #383d46;
    border-radius: 24upx;
  }
  .dialog-section {
    padding: 50upx;
    .dialog-title {
      display: flex;
      align-items: center;
      font-size: 52upx;
      color: #f4f7ff;
      line-height: 72upx;
      font-weight: 600;
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
    ::v-deep .van-button {
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
    padding: 30upx;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1;
    background: #212328;
    display: flex;
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
        flex: 1;
        background: #1370ff;
      }
    }
  }
  ::v-deep .van-dialog {
    background: #383d46;
    border-radius: 24upx;
  }
}
</style>
