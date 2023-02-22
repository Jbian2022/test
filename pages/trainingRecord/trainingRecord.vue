<template>
	<view class="training-record">
		<view class="background-header"></view>
		<view class="background"></view>
		<view class="status_bar" :class="{isFixedTop:isFixedTop}"> <!-- 这里是状态栏 --> </view>
		<van-nav-bar :class="{isFixedTop:isFixedTop}" :title="memberName" left-text="返回主页" left-arrow @click-left="onClickLeft"/>
		<view class="calendar-box">
			<calendar v-model:value="value" ref="calendar" todayDisabled @select="dataAndLabelHandle">
				<template #operation-left>
					<view class="calendar-title">训练记录</view>
				</template>
				<template #operation-right="{item}">
					<view class="calendar-date">{{getYearMonth(item)}}</view>
				</template>
				<template #default="{cell}">
					<view class="cell-box">
						<view class="cell-key" :class="{active:cell.isSelected}">{{cell.key}}</view>
						<view v-if="trainListInfo[cell.day]" class="cell-label-box">
							<view class="cell-label" v-for="(item,key) in trainListInfo[cell.day]" :key="key" @click.stop="dataAndLabelHandle(cell)">{{item.traineeTitle}}</view> 
						</view>
					</view>
				</template>
			</calendar>
		</view>
		<view class="footer-button">
			<view class="tipes" v-if="showTipes">
				开始今日训练吧
			</view>
			<view class="add-button" @click="addWorkout"></view>
		</view>
		<uni-popup
			ref="popup"
			type="bottom"
			mask-background-color="rgba(20, 21, 23, 0.6)"
		>
			<view class="action-box">
				<view class="top">
					<view class="action-date">{{actionBoxDate}}</view>
					<view class="box-close" @click="onCloseHandle">×</view>
				</view>
				<view class="content">
					<view class="action-item" v-for="(item,key) in actionList" :key="key" @click="traineeTitleHandle(currentDay,key,item)"><view>{{item.traineeTitle}}</view><van-icon name="arrow" /></view>
				</view>
				<view class="label" v-if="!isButton">每日最多添加三次训练记录</view>
				<view class="action-button" v-else @click="selectHandle(currentDay)">新建训练</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	const train = uniCloud.importObject('train')
	import calendar from '../../components/calendar/index.vue'
	export default {
		components: {
			calendar
		},
		data() {
			return {
				trainListInfo:{},
				trainDate: null,
				memberName: '',
				value: new Date(),
				showTipes: true,
				isFixedTop: false,
				actionList: [],
				actionBoxDate: '',
				isButton: false,
				currentDay: null
			}
		},
		onLoad: function (option) { 
			if(option.traineeNo){
				this.traineeNo = option.traineeNo
				this.memberName =option.memberName
				this.getTrainList()
			}
		},
		//监测页面滑动
		onPageScroll(e) {
			if (e.scrollTop > uni.getWindowInfo().statusBarHeight) {
				this.isFixedTop = true
			} else {
				this.isFixedTop = false
			}
		},
		onShow(){
			this.showTipes = true
			const timer = setTimeout(()=>{
				this.showTipes = false
				clearTimeout(timer)
			},3000)
		},
		methods: {
			async getTrainList(){
				const res = await train.getTrainList({traineeNo:this.traineeNo})
				if(res.data&&res.data.length>0){
					const trainListInfo = {}
					res.data.forEach(item => {
						const list = JSON.parse(item.trainContent) || []
						list.forEach(item1=>{
							item1.traineeTitle = item1.traineeTitle.substring(0,5)
						})
						trainListInfo[item.trainDate] = list
					});
					this.trainListInfo = trainListInfo
				}
			},
			onClickLeft(){
				uni.reLaunch({
					url: '/pages/myMebers/myMebers'
				});
			},
			onCloseHandle(){
				this.$refs.popup.close()
			},
			dataAndLabelHandle(item){
				console.log(item,'item')
				if(!this.trainListInfo[item.day]&&item.disabled||item.type!=='current'){
					return
				}
				this.actionList = this.trainListInfo[item.day] || []
				this.currentDay = item.day
				let str = item.day.replace('-','年')
				str = str.replace('-','月')
				str = str + '日'
				this.actionBoxDate = str
				this.isButton = this.trainListInfo[item.day]&&this.trainListInfo[item.day].length<3 || !this.trainListInfo[item.day]
				console.log('打开弹框',this.trainListInfo[item.day]);
				this.$refs.popup.open()
			},
			selectHandle(day){
				this.$refs.popup.close()
				uni.navigateTo({
					url: '/pages/newWorkout/newWorkout'+`?traineeNo=${this.traineeNo}&trainDate=${day}&traineeName=${this.memberName}`
				})
			},
			traineeTitleHandle(date,key,item){
				this.$refs.popup.close()
				if(item.traineeStatus === 'save'){
					uni.navigateTo({
						url: '/pages/newWorkout/newWorkout'+`?traineeNo=${this.traineeNo}&trainDate=${date}&traineeName=${this.memberName}&key=${key}`
					})
					return
				}
				uni.navigateTo({
					url: '/pages/trainingRecordDetail/trainingRecordDetail'+`?traineeNo=${this.traineeNo}&trainDate=${date}&traineeName=${this.memberName}&key=${key}`
				});
			},
			addWorkout(){
				if(this.trainListInfo[this.getDay(new Date())]&&this.trainListInfo[this.getDay(new Date())].length>=3){
					return uni.showToast({icon:'none', title: '每日最多添加三次训练记录', duration: 2000});
				}
				uni.navigateTo({
					url: '/pages/newWorkout/newWorkout'+`?traineeNo=${this.traineeNo}&trainDate=${this.getDay(new Date())}&traineeName=${this.memberName}`
				})
			},
			getYearMonth(val){
				const formater = (temp) =>{
				　　if(temp<10){
				　　　　return "0"+temp;
				　　}else{
				　　　　return temp;
				　　}
				}
				const d=new Date(val);
				const year = d.getFullYear();
				const month=formater(d.getMonth()+1);
				return year+'.'+month
			},
			getDay(val){
				const formater = (temp) =>{
				　　if(temp<10){
				　　　　return "0"+temp;
				　　}else{
				　　　　return temp;
				　　}
				}
				const d=new Date(val);
				const year = d.getFullYear();
				const month=formater(d.getMonth()+1);
				const date=formater(d.getDate());
				return year+'-'+month+'-'+date
			}
		}
	}
</script>

<style lang="scss">
.status_bar {
	height: var(--status-bar-height);
	width: 100%;
	position: fixed;
	z-index: 1;
}
.isFixedTop{
	background: rgba(52, 58, 68, 1)
}

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
	bottom: 0;
	z-index: -2;
	min-height: 100vh;
	background: #212328;
}
.training-record{
	padding-top: var(--status-bar-height);
	position: relative;
	::v-deep .van-nav-bar{
		position: sticky;
		top: var(--status-bar-height);
		background: transparent;
		height: 88upx;
		.van-nav-bar__content{
			height: 88upx;
		}
		.van-nav-bar__title{
			font-weight: 500;
			color: #FFFFFF;
			font-size: 30upx;
		}
		.van-nav-bar__text,.van-icon-arrow-left{
			color: #eff3fc;
			font-size: 30upx;
		}
		&:after{
			border: none;
		}
	}
	::v-deep .van-nav-bar.isFixedTop{
		background: rgba(52, 58, 68, 1)
	}
	.calendar-box{
		padding: 0 15upx;
		margin-top: 50upx;
		.calendar-title{
			font-size: 48upx;
			font-weight: 600;
			color: #FFFFFF;
		}
		.calendar-date{
			font-size: 32upx;
			font-weight: 600;
			color: #BDC3CE;
		}
		.cell-box{
			padding: 0 4upx 10upx 4upx;
		}
		.cell-key{
			color: #F4F7FF;
			width: 62upx;
			height: 62upx;
			text-align: center;
			line-height: 52upx;
			margin: 0 auto;
			&.active{
				width: 62upx;
				height: 62upx;
				line-height: 62upx;
				background: #1370FF;
				font-weight: 600;
				border-radius: 100%;
			}
		}
		.cell-label-box {
			height: 100upx;
		}
		.cell-label{
			margin-top: 6upx;
			text-align: center;
			word-break: break-all;
			background: rgba(19, 112, 255, 0.3);
			border-radius: 8upx;
			font-size: 14upx;
			color: #F4F7FF;
			padding: 2upx;
		}
		.prev,.next{
			.cell-key{
				color: #7A7F89;
			}
		}
	}
	.footer-button{
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 2;
		height: 180upx;
		background: url('../../static/newWorkout/add.png') center center no-repeat;
		background-size: contain;
		.tipes{
			position: absolute;
			top: -92upx;
			left: 50%;
			transform: translateX(-50%);
			height: 80upx;
			width: 242upx;
			border-radius: 16upx;
			background: #4B525E;
			font-size: 28upx;
			font-weight: 600;
			color: #FFFFFF;
			line-height: 80upx;
			text-align: center;
			z-index: 88;
			&::after{
				content: '';
				position: absolute;
				bottom: -14upx;
				width: 24upx;
				height: 24upx;
				background: #4B525E;
				left: 50%;
				transform: rotate(45deg) translateX(-50%);
			}
		}
		.add-button{
			height: 120upx;
			width: 120upx;
			margin: 0 auto;
		}
	}
	::v-deep .uni-popup [name='mask'] {
		backdrop-filter: blur(3px);
	}
	.action-box{
		position: relative;
		height: 848upx;
		background: #383D46;
		border-radius: 24upx 24upx 0upx 0upx;
		padding: 40upx 40upx 0 40upx;
		.top{
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 40upx;
		}
		.action-date{
			font-size: 36upx;
			font-weight: 600;
			color: #F4F7FF;
		}
		.box-close {
			font-size: 36upx;
			font-weight: 500;
			text-align: center;
			color: #FFFFFF;
			width: 50upx;
			height: 50upx;
			line-height: 50upx;
			border-radius: 100%;
			background: #4B525E;
		}
		.action-item{
			padding: 48upx 40upx;
			background: #4B525E;
			border-radius: 24upx;
			font-size: 36upx;
			font-weight: 600;
			color: #F4F7FF;
			display: flex;
			justify-content: space-between;
		}
		.action-item + .action-item{
			margin-top: 30upx;
		}
		.label{
			margin-top: 42upx;
			text-align: center;
			font-size: 28upx;
			font-weight: 400;
			color: #FFFFFF;
			line-height: 40upx;
		}
		.action-button{
			position: absolute;
			bottom: 42upx;
			left: 40upx;
			right: 40upx;
			height: 100upx;
			line-height: 100upx;
			background: #1370FF;
			border-radius: 16upx;
			text-align: center;
			font-weight: 600;
			color: #FFFFFF;
			font-size: 32upx;
		}
	}
}
</style>
