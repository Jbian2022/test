<template>
	<view class="training-record">
		<view class="status_bar"> <!-- 这里是状态栏 --> </view>
		<van-nav-bar :title="memberName" left-text="返回主页" left-arrow @click-left="onClickLeft"/>
		<view class="calendar">
			<calendar v-model:value="value" ref="calendar">
				<template #operation-left>
					<view class="calendar-title">训练记录</view>
				</template>
				<template #operation-right="{item}">
					<view class="calendar-date">{{getYearMonth(item)}}</view>
				</template>
				<template #default="{cell}">
					<view class="cell-box">
						<view class="cell-key" :class="{active:cell.isSelected}">{{cell.key}}</view>
						<view v-if="getTrainTitle(cell.day)" class="cell-label" @click.stop="sharePage(cell.day)">{{getTrainTitle(cell.day)}}</view>
					</view>
				</template>
			</calendar>
		</view>
		<view class="footer-button">
			<view class="add-button" @click="addWorkout"></view>
		</view>
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
				value: new Date()
			}
		},
		onLoad: function (option) { 
			if(option.traineeNo){
				this.traineeNo = option.traineeNo
				this.memberName =option.memberName
				this.getTrainList()
			}
		},
		methods: {
			async getTrainList(){
				const res = await train.getTrainList({traineeNo:this.traineeNo})
				if(res.data&&res.data.length>0){
					const trainListInfo = {}
					res.data.forEach(item => {
						trainListInfo[item.trainDate] = item.traineeTitle
					});
					this.trainListInfo = trainListInfo
				}
			},
			onClickLeft(){
				uni.switchTab({
					url: '/pages/myMebers/myMebers'
				});
			},
			addWorkout(){
				const list = this.$refs.calendar.getSelection()
				const item = list.find(item=>item.isSelected)
				if(!item) return
				uni.navigateTo({
					url: '/pages/newWorkout/newWorkout'+`?traineeNo=${this.traineeNo}&trainDate=${item.day}`
				})
			},
			sharePage(date){
				uni.navigateTo({
					url: '/pages/trainingRecordDetail/trainingRecordDetail'+`?traineeNo=${this.traineeNo}&trainDate=${date}`
				});
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
			getTrainTitle(day){
				return this.trainListInfo[day] || ''
			}
		}
	}
</script>

<style lang="scss">
page{
	background: #212328;
}
.status_bar {
	height: var(--status-bar-height);
	width: 100%;
}
.training-record{
	::v-deep .van-nav-bar{
		background: #212328;
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
	.calendar{
		padding: 0 15upx;
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
			padding: 0 4upx;
		}
		.cell-key{
			color: #F4F7FF;
			width: 52upx;
			height: 52upx;
			text-align: center;
			line-height: 52upx;
			margin: 0 auto;
			&.active{
				background: #1370FF;
				font-weight: 600;
				border-radius: 100%;
			}
		}
		.cell-label{
			margin-top: 8upx;
			text-align: center;
			word-break: break-all;
			background: rgba(19, 112, 255, 0.3);
			border-radius: 8upx;
			font-size: 18upx;
			color: #F4F7FF;
			padding: 6upx;
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
		.add-button{
			height: 120upx;
			width: 120upx;
			margin: 0 auto;
		}
	}
}
</style>
