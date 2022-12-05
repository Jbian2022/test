<template>
	<view class="training-record">
		<van-nav-bar title="赵思远" left-text="返回主页" left-arrow @click-left="onClickLeft"/>
		<view class="calendar">
			<van-calendar title="训练记录" :show-mark="false" :poppable="false" :show-confirm="false" @confirm="onConfirm" :min-date="new Date('2021-01-01')">
				<template #bottom-info="day">
					<view v-show="getTrainTitle(day)" class="train-title" @click.stop="sharePage(day)">{{getTrainTitle(day)}}</view>
				</template>
			</van-calendar>
		</view>
		<view class="footer-button">
			<view class="add-button" @click="addWorkout"></view>
		</view>
	</view>
</template>

<script>
	const train = uniCloud.importObject('train')
	export default {
		data() {
			return {
				trainListInfo:{},
				trainDate: null
			}
		},
		onLoad: function (option) { 
			if(option.traineeNo){
				this.traineeNo = option.traineeNo
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
				uni.navigateTo({
					url: '/pages/newWorkout/newWorkout'+`?traineeNo=${this.traineeNo}&trainDate=${this.trainDate}`
				})
			},
			sharePage(day){
				uni.navigateTo({
					url: '/pages/trainingRecordDetail/trainingRecordDetail'+`?traineeNo=${this.traineeNo}&trainDate=${this.getCurTimestamp(day.date)}`
				});
			},
			getCurTimestamp(val){
				const formater = (temp) =>{
				　　if(temp<10){
				　　　　return "0"+temp;
				　　}else{
				　　　　return temp;
				　　}
				}
				const d=new Date(val);
				const year=d.getFullYear();
				const month=formater(d.getMonth()+1);
				const date=formater(d.getDate());
				return [year,month,date].join('-');
			},
			getTrainTitle(day){
				const key = this.getCurTimestamp(day.date)
				return this.trainListInfo[key] || ''
			},
			onConfirm(val){
				if(val){
					this.trainDate = this.getCurTimestamp(val)
				}
			}
		}
	}
</script>

<style lang="scss">
page{
	background: #212328;
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
		.van-calendar{
			padding: 0 40upx;
			height: 1020upx;
			padding-top: 20upx;
			background: #212328;
			::v-deep .van-calendar__header{
				position: relative;
				height: 180upx;
				box-shadow: none;
			}
			::v-deep .van-calendar__header-title{
				text-align: left;
				height: 66upx;
				font-weight: 600;
				color: #FFFFFF;
				line-height: 66upx;
			}
			::v-deep .van-calendar__header-subtitle{
				position: absolute;
				top: 0;
				right: 0;
				text-align: right;
				height: 66upx;
				line-height: 66upx;
				font-size: 32upx;
				font-weight: 600;
				color: #BDC3CE;
			}
			::v-deep .van-calendar__weekdays{
				padding-top: 38upx;
				border-top: 2upx solid #3B3F46;
				color: #BDC3CE;
				font-size: 26upx;
			}
			::v-deep .van-calendar__day{
				position: relative;
				align-items: flex-start;
				height: 160upx;
				font-size: 28upx;
				color: #F4F7FF;
				line-height: 52upx;
				z-index: 2;
				.van-calendar__bottom-info{
					transform: translateX(-50%);
					bottom: auto;
					top: 62upx;
					left: 50%;
					width: 100%;
					box-sizing: border-box;
					padding: 0 4upx;
					.train-title{
						padding: 6upx;
						background: rgba(19, 112, 255, 0.3);
						border-radius: 8upx;
						line-height: 26upx;
						word-break: break-all;
						font-size: 18upx;
						color: #F4F7FF;
					}
				}
			}
			::v-deep .van-calendar__selected-day{
				align-items: flex-start;
				background: transparent;
				font-weight: 600;
				&::before{
					position: absolute;
					top: 0;
					content: '';
					width: 52upx;
					height: 52upx;
					z-index: -1;
					background: #1370FF;
					border-radius: 50%;
				}
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
