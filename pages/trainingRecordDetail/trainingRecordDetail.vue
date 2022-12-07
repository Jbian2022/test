<template>
	<view class="training-record-detail">
		<view class="arrow-left" @click="onClickLeft"><van-icon name="arrow-left" /></view>
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
								<van-image round src="https://mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3.cdn.bspapp.com/cloudstorage/f1ecf80b-cf75-4017-9ae2-622fe72717e9.png"/>
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
								<van-image round src="https://mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3.cdn.bspapp.com/cloudstorage/f1ecf80b-cf75-4017-9ae2-622fe72717e9.png"/>
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
								<van-image round src="https://mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3.cdn.bspapp.com/cloudstorage/f1ecf80b-cf75-4017-9ae2-622fe72717e9.png"/>
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
								<van-image round src="https://mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3.cdn.bspapp.com/cloudstorage/f1ecf80b-cf75-4017-9ae2-622fe72717e9.png"/>
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
								<van-image round src="https://mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3.cdn.bspapp.com/cloudstorage/f1ecf80b-cf75-4017-9ae2-622fe72717e9.png"/>
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
								<van-image round src="https://mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3.cdn.bspapp.com/cloudstorage/f1ecf80b-cf75-4017-9ae2-622fe72717e9.png"/>
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
								<van-image round src="https://mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3.cdn.bspapp.com/cloudstorage/f1ecf80b-cf75-4017-9ae2-622fe72717e9.png"/>
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
			<van-button block @click="showShare=true"><van-icon name="share-o" />炫耀一下</van-button>
		</view>
		<van-share-sheet
			v-model:show="showShare"
			:options="options"
			@select="onSelect"
			cancel-text=""
		/>
		<!-- <image v-if="base64" :src="base64" style="width: 100vw; height:200vh;"></image> -->
	</view>
</template>

<script>
	const train = uniCloud.importObject('train')
	export default {
		data() {
			return {
				showShare: false,
				options: [
					{ name: '分享到微信', icon: 'https://mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3.cdn.bspapp.com/cloudstorage/23704d74-641b-4a8e-9ced-f393c631667a.png' },
					{ name: '分享到朋友圈', icon: 'https://mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3.cdn.bspapp.com/cloudstorage/4be11f14-035d-47f0-8c5d-f147b494246b.png' },
					{ name: '保存到相册', icon: 'https://mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3.cdn.bspapp.com/cloudstorage/c5edf505-9026-4d72-a16c-3ea5c8e4304c.png' }
				],
				traineeTitle: '',
				trainDate: '',
				sumLoad: 0,
				trainInfoList: [],
				base64: null,
				url: null
			}
		},
		onLoad: function (option) { 
			if(option.traineeNo){
				this.traineeNo = option.traineeNo
				this.trainDate = option.trainDate
				this.getTrainInfo()
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
			onSelect(option) {
				this.showShare = false
				console.log(option,888)
				this.generateImage(()=>{
					console.log(option,88)
					if(option.name==='保存到相册'){
						this.downloadFile()
					} else {
						this.uploadImage((url)=>{
							if(option.name==='分享到微信'){
								uni.share({
									provider: "weixin",
									scene: "WXSceneSession",
									type: 2,
									imageUrl: url,
									success: function (res) {
										console.log("success:" + JSON.stringify(res));
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
									},
									fail: function (err) {
										console.log("fail:" + JSON.stringify(err));
									}
								});
							}
						})
					}
				})
			},
			formaterTimes(times,type=3){
				const hour = Math.floor(times/3600);
				const minute = Math.floor((times-(hour*3600))/60);
				const second = times-(hour*3600)-(minute*60);
				return  type===3?hour+'时'+minute+'分'+second+'秒':hour+'时'+minute+'分'
			},
			getMonthDay(){
				const formater = (temp) =>{
				　　if(temp<10){
				　　　　return "0"+temp;
				　　}else{
				　　　　return temp;
				　　}
				}
				const d=new Date();
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
			base64ToFile(data){
				const binary = atob(data.split(',')[1])
				const mime = data.split(',')[0].match(/:(.*?);/)[1]
				let array = []
				for (let i = 0; i < binary.length; i++) {
					array.push(binary.charCodeAt(i))
				}
				const fileData = new Blob([new Uint8Array(array)], {type: mime})
				const file = new File([fileData], `${new Date().getTime()}.png`, { type: mime })
				return file
			},
			async uploadImage(callback){
				const file = this.base64ToFile(this.base64)
				const url = URL.createObjectURL(file)
				const result = await uniCloud.uploadFile({
					cloudPath: Date.now() + "-share.png",
					filePath: url
				});
				this.url =  result.fileID;
				callback&&callback(result.fileID)
				console.log('uploadImage',result)
			},
			downloadFile(){
				const file = this.base64ToFile(this.base64);
				const url = URL.createObjectURL(file);
				uni.saveImageToPhotosAlbum({
					filePath: url,
					success: function() {
						console.log('保存成功！');
					}
				});
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
				const dom = document.getElementById('training-detail') // 需要生成图片内容的 dom 节点
				html2canvas(dom, {
					width: dom.clientWidth, //dom 原始宽度
					height: dom.clientHeight,
					scrollY: 0, // html2canvas默认绘制视图内的页面，需要把scrollY，scrollX设置为0
					scrollX: 0,
					useCORS: true, //支持跨域
					// scale: 2, // 设置生成图片的像素比例，默认是1，如果生成的图片模糊的话可以开启该配置项
				}).then((canvas) => {
					// 生成成功
					// html2canvas 生成成功的图片链接需要转成 base64位的url
					this.base64 = canvas.toDataURL('image/png')
					callback&&callback()
				}).catch(err=>{})
			}, 300);
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
			.van-icon{
				font-size: 40upx;
				color: #bdc3ce;
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
				background: #383D46;
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
							display: inline-flex;
							justify-content: space-between;
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
				background: #1370FF;
				border-radius: 16upx;
				border: none;
				font-size: 32upx;
				font-weight: 600;
				color: #FFFFFF;
				.van-icon{
					margin-right: 16upx;
				}
			}
		}
		::v-deep .van-popup {
			background: #383D46;
			border-radius: 24upx 24upx 0px 0px;
		}
		::v-deep .van-share-sheet__options{
			justify-content: space-around;
			.van-share-sheet__name{
				font-size: 28upx;
				font-weight: 400;
				color: #F4F7FF;
				line-height: 40tpx;
			}
		}
	}
</style>
