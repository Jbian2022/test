<template>
	<view class="training-record-detail">
		<view class="arrow-left" :class="{show:isFixedTop}" @click="onClickLeft">
			<van-icon name="arrow-left" />
			<view class="title">训练记录</view>
			<view class="z" style="opacity: 0;">8888</view>
		</view>
		<view id="training-detail">
			<view class="status_bar"> <!-- 这里是状态栏 --> </view>
			<view class="backgroud-img"><van-image  src="https://mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3.cdn.bspapp.com/cloudstorage/6b1a6145-faf2-4eb1-a710-4e41ff2ca19b.png"/></view>
			<view class="first-title-times">
				<view class="title">{{traineeTitle}}</view>
				<view class="times">{{getMonthDay(trainDate)}}</view>
			</view>
			<view class="second-title-day">
				<view class="title">总负荷量：{{sumLoad}}kg</view>
				<view class="day">星期{{getweekday(trainDate)}}</view>
			</view>
			<view class="info-list">
				<view v-for="(j,jx) in trainInfoList" :key="jx">
					<view v-if="j.type===0" class="info-item">
						<view class="item-header">
							<view class="img">
								<van-image v-if="j.url" round :src="j.url"/>
								<van-image v-else round src="https://mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3.cdn.bspapp.com/cloudstorage/f1ecf80b-cf75-4017-9ae2-622fe72717e9.png"/>
							</view>
							<view class="des-info">
								<view class="des-title">{{j.actionName}}</view>
								<view class="info-text">
									<text>负荷量：{{j.load}}kg</text>
									<text>已完成：{{j.frequency}}次</text>
								</view>
							</view>
						</view>
						<view class="detailed-data">
							<view v-for="(i,ix) in j.groupList" :key="ix" class="data-item">
								<view class="index">{{ix+1}}</view>
								<view class="data-info">
									<view class="kg">
										<text class="num">{{i.kg}}</text>
										<text>kg</text>
									</view>
									<view class="x">
										x
									</view>
									<view class="time">
										<text class="num">{{i.time}}</text>
										<text>次</text>
									</view>
								</view>
							</view>
						</view>
					</view>
					<view v-if="j.type===1" class="info-item">
						<view class="item-header">
							<view class="img">
								<van-image v-if="j.url" round :src="j.url"/>
								<van-image v-else round src="https://mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3.cdn.bspapp.com/cloudstorage/f1ecf80b-cf75-4017-9ae2-622fe72717e9.png"/>
							</view>
							<view class="des-info">
								<view class="des-title">{{j.actionName}}</view>
								<view class="info-text">
									<text>总里程：{{j.mileage}}km</text>
									<text>用时：{{formaterTimes(j.times)}}</text>
								</view>
							</view>
						</view>
						<view class="detailed-data">
							<view v-for="(i,ix) in j.groupList" :key="ix" class="data-item">
								<view class="index">{{ix+1}}</view>
								<view class="data-info-km">
									<text class="num">{{i.km}}</text>
									<text>km</text>
								</view>
								<view class="data-info-time">
									<text class="num">{{i.hour>=10?i.hour:'0'+i.hour}}:{{i.minute>=10?i.minute:'0'+i.minute}}:{{i.second>=10?i.second:'0'+i.second}}</text>
								</view>
							</view>
						</view>
					</view>
					<view v-if="j.type===2" class="info-item">
						<view class="item-header">
							<view class="img">
								<van-image v-if="j.url" round :src="j.url"/>
								<van-image v-else round src="https://mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3.cdn.bspapp.com/cloudstorage/f1ecf80b-cf75-4017-9ae2-622fe72717e9.png"/>
							</view>
							<view class="des-info">
								<view class="des-title">{{j.actionName}}</view>
								<view class="info-text">
									<text>已完成：{{j.frequency}}次</text>
								</view>
							</view>
						</view>
						<view class="detailed-data">
							<view v-for="(i,ix) in j.groupList" :key="ix" class="data-item">
								<view class="index">{{ix+1}}</view>
								<view class="data-info">
									<view class="time">
										<text class="num">{{i.time}}</text>
										<text>次</text>
									</view>
								</view>
							</view>
						</view>
					</view>
					<view v-if="j.type===3" class="info-item">
						<view class="item-header">
							<view class="img">
								<van-image v-if="j.url" round :src="j.url"/>
								<van-image v-else round src="https://mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3.cdn.bspapp.com/cloudstorage/f1ecf80b-cf75-4017-9ae2-622fe72717e9.png"/>
							</view>
							<view class="des-info">
								<view class="des-title">{{j.actionName}}</view>
								<view class="info-text">
									<text>总用时：{{formaterTimes(j.times)}}</text>
								</view>
							</view>
						</view>
						<view class="detailed-data">
							<view v-for="(i,ix) in j.groupList" :key="ix" class="data-item">
								<view class="index">{{ix+1}}</view>
								<view class="data-info">
									<view class="time">
										<text class="num">{{i.hour>=10?i.hour:'0'+i.hour}}:{{i.minute>=10?i.minute:'0'+i.minute}}:{{i.second>=10?i.second:'0'+i.second}}</text>
									</view>
								</view>
							</view>
						</view>
					</view>
					<view v-if="j.type===4" class="info-item">
						<view class="item-header">
							<view class="img">
								<van-image v-if="j.url" round :src="j.url"/>
								<van-image v-else round src="https://mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3.cdn.bspapp.com/cloudstorage/f1ecf80b-cf75-4017-9ae2-622fe72717e9.png"/>
							</view>
							<view class="des-info">
								<view class="des-title">{{j.actionName}}</view>
								<view class="info-text">
									<text>负荷量：{{j.load}}kg</text>
									<text>已完成：{{j.frequency}}次</text>
								</view>
							</view>
						</view>
						<view class="detailed-data">
							<view v-for="(i,ix) in j.groupList" :key="ix" class="data-item">
								<view class="index">{{ix+1}}</view>
								<view class="data-info">
									<view class="kg">
										<text class="num">{{i.kg}}</text>
										<text>kg</text>
									</view>
									<view class="x">
										x
									</view>
									<view class="time">
										<text class="num">{{i.time}}</text>
										<text>次</text>
									</view>
								</view>
							</view>
						</view>
					</view>
					<view v-if="j.type===5" class="info-item">
						<view class="item-header">
							<view class="img">
								<van-image v-if="j.url" round :src="j.url"/>
								<van-image v-else round src="https://mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3.cdn.bspapp.com/cloudstorage/f1ecf80b-cf75-4017-9ae2-622fe72717e9.png"/>
							</view>
							<view class="des-info">
								<view class="des-title">{{j.actionName}}</view>
								<view class="info-text">
									<text>负荷量：{{j.load}}kg</text>
									<text>已完成：{{j.frequency}}次</text>
								</view>
							</view>
						</view>
						<view class="detailed-data">
							<view v-for="(i,ix) in j.groupList" :key="ix" class="data-item">
								<view class="index">{{ix+1}}</view>
								<view class="data-info">
									<view class="kg">
										<text class="num">{{i.kg}}</text>
										<text>kg</text>
									</view>
									<view class="x">
										x
									</view>
									<view class="time">
										<text class="num">{{i.time}}</text>
										<text>次</text>
									</view>
								</view>
							</view>
						</view>
					</view>
					<view v-if="j.type===6" class="info-item">
						<view class="item-header">
							<view class="img">
								<van-image v-if="j.url" round :src="j.url"/>
								<van-image v-else round src="https://mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3.cdn.bspapp.com/cloudstorage/f1ecf80b-cf75-4017-9ae2-622fe72717e9.png"/>
							</view>
							<view class="des-info">
								<view class="des-title">{{j.actionName}}</view>
								<view class="info-text">
									<text>总用时：{{formaterTimes(j.times)}}</text>
								</view>
							</view>
						</view>
						<view class="detailed-data">
							<view v-for="(i,ix) in j.groupList" :key="ix" class="data-item">
								<view class="index">{{ix+1}}</view>
								<view class="data-info">
									<view class="time">
										<text class="num">{{i.hour>=10?i.hour:'0'+i.hour}}:{{i.minute>=10?i.minute:'0'+i.minute}}:{{i.second>=10?i.second:'0'+i.second}}</text>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="footer-button">
			<view class="van-button" @click="openPopup"><view class="share-icon"></view>炫耀一下</view>
		</view>
		<!-- #ifdef APP-PLUS || H5 -->
		<view :prop="canvasImageMsg" :change:prop="canvasImage.updateEcharts" id="canvasImage"></view>
		<!-- #endif -->
		<uni-popup ref="popup" type="bottom" mask-background-color="rgba(20, 21, 23, 0.6)">
			<view class="share-sheet">
				<view class="item" v-for="(item,index) in options" :key="index" @click="onSelect(item)">
					<van-image class="img" round :src="item.icon"/>
					<view class="text">{{item.name}}</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	const train = uniCloud.importObject('train')
	export default {
		data() {
			return {
				options: [
					{ name: '分享到微信', icon: 'https://mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3.cdn.bspapp.com/cloudstorage/23704d74-641b-4a8e-9ced-f393c631667a.png' },
					{ name: '分享到朋友圈', icon: 'https://mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3.cdn.bspapp.com/cloudstorage/4be11f14-035d-47f0-8c5d-f147b494246b.png' },
					{ name: '保存到相册', icon: 'https://mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3.cdn.bspapp.com/cloudstorage/c5edf505-9026-4d72-a16c-3ea5c8e4304c.png' }
				],
				traineeTitle: '',
				trainDate: '',
				sumLoad: 0,
				trainInfoList: [],
				baseUrl: null,
				url: null,
				canvasImageMsg: null,
				isFixedTop:false
			}
		},
		onLoad: function (option) { 
			if(option.traineeNo){
				this.traineeNo = option.traineeNo
				this.trainDate = option.trainDate
				this.getTrainInfo()
			}
		},
		//监测页面滑动
		onPageScroll(e) {
			if(e.scrollTop > uni.getWindowInfo().statusBarHeight){
				this.isFixedTop = true
			}else{
				this.isFixedTop = false
			}
		},
		methods: {
			async getTrainInfo(){
				const res = await train.getTrainList({traineeNo:this.traineeNo,trainDate:this.trainDate})
				if(res.data&&res.data.length>0){
					const {trainContent,traineeTitle}  = res.data[0]
					this.traineeTitle = traineeTitle
					this.trainInfoList = JSON.parse(trainContent)
					this.sumLoad = this.trainInfoList.reduce(function(prev, cur) {
						return +cur.load + +prev;
					}, 0);
				}
			},
			onClickLeft(){
				uni.navigateBack()
			},
			formaterTimes(times,type=3){
				const hour = Math.floor(times/3600);
				const minute = Math.floor((times-(hour*3600))/60);
				const second = times-(hour*3600)-(minute*60);
				return  type===3?hour+'时'+minute+'分'+second+'秒':hour+'时'+minute+'分'
			},
			getMonthDay(val){
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
				return month+'.'+date;
			},
			getweekday(date){
				const weekArray = new Array("日", "一", "二", "三", "四", "五", "六");
				const week = weekArray[new Date(date).getDay()];
				return week;
			},
			onSelect(option) {
				console.log(option,88)
				this.canvasImageMsg = option.name
			},
			async uploadImage(callback){
				const result = await train.uploadBase64({
					base64: this.baseUrl
				});
				this.url =  result.fileID;
				this.canvasImageMsg = null;
				callback&&callback(this.url);
			},
			downloadFile(){
				uni.downloadFile({
					url: this.url, //仅为示例，并非真实的资源
					success: (res) => {
						if (res.statusCode === 200) {
							console.log('下载成功',res);
							uni.saveImageToPhotosAlbum({
								filePath: res.tempFilePath,
								success: (res) => {
									console.log('保存成功！',res);
									uni.hideLoading();
									uni.showModal({
										showCancel: false,
										title: '提示',
										content: '图片已经保存到相册请查看',
										success: function (res) {
											if (res.confirm) {
												console.log('用户点击确定');
											} else if (res.cancel) {
												console.log('用户点击取消');
											}
										}
									});
								},
								fail:(err)=>{
									console.log('err',err);
								}
							});
						}
					},
				});
			},
			receiveRenderData(option) {
				this.$refs.popup.close()
                console.log(option.name, 8888)
				this.baseUrl = option.base64;
				this.uploadImage((url)=>{
					uni.showLoading({ title: '加载中'});
					// #ifndef H5
					if(option.name==='保存到相册'){
						this.downloadFile()
					} else {
						if(option.name==='分享到微信'){
							uni.share({
								provider: "weixin",
								scene: "WXSceneSession",
								type: 2,
								imageUrl: url,
								success: function (res) {
									console.log("success:" + JSON.stringify(res));
									uni.hideLoading();
								},
								fail: function (err) {
									console.log("fail:" + JSON.stringify(err));
								}
							});
						} else if (option.name==='分享到朋友圈') {
							uni.share({
								provider: "weixin",
								scene: "WXSceneTimeline",
								type: 2,
								imageUrl: url,
								success: function (res) {
									console.log("success:" + JSON.stringify(res));
									uni.hideLoading();
								},
								fail: function (err) {
									console.log("fail:" + JSON.stringify(err));
								}
							});
						}
					}
					// #endif
				})
            },
			openPopup(){
				this.$refs.popup.open()
			}
		}
	}
</script>
<script lang="renderjs" module="canvasImage">
import html2canvas from 'html2canvas'
export default {
	methods: {
		generateImage(callback) {
			setTimeout(() => {
				const dom = document.getElementById('training-detail'); // 需要生成图片内容的 dom 节点
				html2canvas(dom, {
					width: dom.clientWidth, //dom 原始宽度
					height: dom.clientHeight,
					scrollY: 0, // html2canvas默认绘制视图内的页面，需要把scrollY，scrollX设置为0
					scrollX: 0,
					useCORS: true, //支持跨域
					// scale: 1, // 设置生成图片的像素比例，默认是1，如果生成的图片模糊的话可以开启该配置项
				}).then((canvas) => {
					const base64 = canvas.toDataURL('image/png');
					callback&&callback(base64);
				}).catch(err=>{})
			}, 300);
		},
		updateEcharts(newValue, oldValue, ownerInstance, instance) {
			// 监听 service 层数据变更
			if(newValue){
				this.generateImage((base64)=>{
					ownerInstance.callMethod('receiveRenderData', {name:newValue,base64});
				})
			}
		}
	}
}
</script>
<style lang="scss" >
	.status_bar {
		height: var(--status-bar-height);
		width: 100%;
	}
	.training-record-detail{
		position: relative;
		.canvas-box{
			height: 0upx;
			overflow: hidden;
		}
		#training-detail{
			padding-bottom: 170upx;
			padding-top: 88upx;
			min-height: 100vh;
			box-sizing: border-box;
			position: relative;
		}
		.backgroud-img{
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			z-index: -1;
			background: #212328;
		}
		.arrow-left{
			position: absolute;
			top: var(--status-bar-height);
			left: 0;
			right: 0;
			z-index: 88;
			height: 88upx;
			display: flex;
			align-items: center;
			padding-left: 30upx;
			justify-content: space-between;
			color: #bdc3ce;
			.van-icon{
				font-size: 40upx;
				color: #bdc3ce;
			}
			&.show{
				position: sticky;
				background: #212328;
				top: 0;
				padding-top: var(--status-bar-height);
			}
		}
		.first-title-times{
			padding: 10upx 30upx;
			display: flex;
			justify-content: space-between;
			.title{
				font-size: 60upx;
				color: #F4F7FF;
				line-height: 84upx;
				font-weight: 600;
			}
			.times{
				font-size: 48upx;
				font-weight: bold;
				color: #F4F7FF;
				line-height: 58upx;
			}
		}
		.second-title-day{
			padding: 0 30upx;
			display: flex;
			justify-content: space-between;
			.title{
				font-size: 30upx;
				font-weight: 600;
				color: #F4F7FF;
				line-height: 42upx;
			}
			.day{
				font-size: 24upx;
				font-weight: 400;
				color: #BDC3CE;
				line-height: 34upx;
			}
		}
		.info-list{
			padding: 0 30upx;
			.info-item{
				margin-top: 30upx;
				padding: 40upx;
				background: rgba(56, 61, 70, .6);
				border-radius: 24upx;
				.item-header{
					position: relative;
					display: flex;
					.img{
						.van-image{
							width: 100upx;
							height: 100upx;
							background: #C7C9CC;
						}
					}
					.des-info{
						margin-left: 30upx;
						.des-title{
							font-size: 30upx;
							font-weight: 600;
							color: #F4F7FF;
							line-height: 42upx;
							margin-bottom: 14upx;
						}
						.info-text{
							width: 450upx;
							font-size: 26upx;
							font-weight: 400;
							color: #BDC3CE;
							line-height: 36upx;
							display: flex;
							justify-content: space-between;
							& :nth-child(2){
								width: 240upx;
								text-align: left;
							}
						}
					}
				}
				.detailed-data{
					.data-item{
						margin-top: 20upx;
						display: flex;
						align-items: center;
						.index{
							font-size: 36upx;
							font-weight: 500;
							color: #BDC3CE;
							width: 80upx;
							text-align: center;
						}
						.data-info{
							display: flex;
							justify-content: space-around;
							align-items: center;
							width: 530upx;
							height: 80upx;
							border-radius: 16upx;
							background: rgb(75, 82, 94, .5);
							font-size: 26upx;
							color: #BDC3CE;
							.num{
								margin-right: 10upx;
								font-size: 36upx;
								font-weight: 500;
								color: #F4F7FF;
							}
						}
						.data-info-km{
							text-align: center;
							width: 161upx;
							height: 80upx;
							line-height: 80upx;
							background: rgb(75, 82, 94, .5);
							border-radius: 16upx;
							font-size: 26upx;
							color: #BDC3CE;
							.num{
								font-size: 36upx;
								font-weight: 500;
								color: #F4F7FF;
							}
						}
						.data-info-time{
							margin-left: 20upx;
							text-align: center;
							width: 349upx;
							height: 80upx;
							line-height: 80upx;
							background: rgb(75, 82, 94, .5);
							border-radius: 16upx;
							.num{
								font-size: 36upx;
								font-weight: 500;
								color: #F4F7FF;
							}
						}
					}
				}
			}
		}
		.footer-button{
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			z-index: 1;
			padding: 30upx;
			background: #212328;
			.van-button{
				height: 100upx;
				width: 100%;
				background: #1370FF;
				border-radius: 16upx;
				font-size: 32upx;
				font-weight: 600;
				color: #FFFFFF;
				display: flex;
				align-items: center;
				justify-content: center;
				border: none;
				.share-icon {
					width: 28upx;
					height: 28upx;
					background: url('../../static/newWorkout/share.svg');
					background-size: contain;
					background-repeat: no-repeat;
					margin-right: 16upx;
				}
				&::after{
					display: none;
				}
			}
		}
		::v-deep.uni-popup [name="mask"]{
			backdrop-filter: blur(3px);
		}
		.share-sheet{
			display: flex;
			align-items: center;
			height: 388upx;
			background: #383D46;
			border-radius: 24upx 24upx 0px 0px;
			justify-content: space-around;
			.item {
				text-align: center;
				.img{
					margin: 0 auto;
					width: 100upx;
					height: 100upx;
					padding-bottom: 20upx;
				}
				.text{
					font-size: 28upx;
					font-weight: 400;
					color: #F4F7FF;
					line-height: 40tpx;
				}
			}
		}
	}
</style>
