<template>
	<view class="content_style">
		<BgTheamCompontent :theamType="'currency'"></BgTheamCompontent>
		<NavBarCompontent :leftNavTitle="''"></NavBarCompontent>
		<view class="titleText">
			<van-row class="titleTopText">
			  <van-col span="12">体测报告</van-col>
			  <van-col span="12">10.04</van-col>
			</van-row>
			<van-row class="titleBottomText">
			  <van-col span="12">数据评测来源于世界权威机构</van-col>
			  <van-col span="12">2022年</van-col>
			</van-row>
		</view>
		<view class="basicInformation">
			<van-collapse v-model="activeBasicInformation"
			:border = 'false'>
				<van-collapse-item 
				title="基础信息" 
				name="1" 
				title-class="informationTitleText"
				class="informationCard">
				    <view class="basicInformationContent">
						<view class="textContent">
							<van-row class="text">
							  <van-col span="12">姓名</van-col>
							  <van-col span="12" class="textRight">{{personName}}</van-col>
							</van-row>
						</view>
						<view class="textContent">
							<van-row class="text">
							  <van-col span="12">性别</van-col>
							  <van-col span="12" class="textRight" v-if="gender==1">男</van-col>
							  <van-col span="12" class="textRight" v-if="gender==2">女</van-col>
							</van-row>
						</view>
						<view class="textContent">
							<van-row class="text">
							  <van-col span="12">年龄</van-col>
							  <van-col span="12" class="textRight">{{age}}</van-col>
							</van-row>
						</view>
						<view class="textContent">
							<van-row class="text">
							  <van-col span="12">手机号码</van-col>
							  <van-col span="12" class="textRight">{{mobileNumber}}</van-col>
							</van-row>
						</view>
					</view>
				</van-collapse-item>
			</van-collapse>
		</view>
		
		<view class="basicInformation">
			<van-collapse v-model="healthQA"
			:border = 'false'>
				<van-collapse-item 
				title="健康问答" 
				name="2" 
				title-class="informationTitleText"
				class="informationCard">
				    <view class="basicInformationContent healthBlocks">
						<view class="healthBlock">
							高血压
						</view>
						<view class="healthBlock">
							支气管炎
						</view>
						<view class="healthBlock">
							支气管炎
						</view>
					</view>
					<view class="healthBlocks">
						<view style="margin-bottom: 20upx;color: #F4F7FF;font-size: 30upx;font-weight: 500;">
							<view class="greenBlock"></view>
							其他被确诊的疾病
						</view>
						<view class="healthBlock">
							支气管炎
						</view>
					</view>
					<view class="healthBlocks">
						<view style="margin-bottom: 20upx;color: #F4F7FF;font-size: 30upx;font-weight: 500;">
							<view class="greenBlock"></view>
							关节、韧带和肌肉是否受过任何损伤
						</view>
						<view class="healthBlock">
							跟腱损伤
						</view>
						<view class="healthBlock">
							手臂拉伤
						</view>
					</view>
					<view class="healthBlocks">
						<view style="margin-bottom: 20upx;color: #F4F7FF;font-size: 30upx;font-weight: 500;">
							<view class="greenBlock"></view>
							是否曾经骨折
						</view>
						<view class="healthBlock">
							肘部骨折
						</view>
					</view>
					<view class="healthBlocks">
						<view style="margin-bottom: 20upx;color: #F4F7FF;font-size: 30upx;font-weight: 500;">
							<view class="greenBlock"></view>
							最近的体重是否有大幅度的变化
						</view>
						<view class="healthBlock">
							重了15公斤
						</view>
					</view>
				</van-collapse-item>
			</van-collapse>
		</view>
		
		<view class="basicInformation">
			<van-collapse v-model="BodyTestReport"
			:border = 'false'>
				<van-collapse-item 
				title="体测报告" 
				name="3" 
				title-class="informationTitleText"
				class="informationCard">
				
				<view class="countNumBlock">
					<van-row>
					  <van-col span="12"
					  style="font-size: 32upx;
					  		font-weight: 600;
					  		color: #F4F7FF;
					  		line-height: 44upx;
							margin-top: 20upx;">你很棒！</van-col>
					  <van-col span="12"
					  style="font-size: 60upx;
font-weight: 600;
color: #FFFFFF;
line-height: 72upx;
text-align: right;
margin-top: 10upx;">82</van-col>
					</van-row>
					<van-row >
					  <van-col span="24">再努力一点会更好哦！</van-col>
					</van-row>
					<view style="margin-top: 44upx;">
						<van-progress :percentage="82" 
						stroke-width="8"  
						color="#01E08C"
						:show-pivot="false"
						track-color="#454951"/>
					</view>
				</view>
				
				    <view class="basicInformationContent">
				    	<view class="textContent">
				    		<van-row class="text">
				    		  <van-col span="12">身高</van-col>
				    		  <van-col span="12" class="textRight">180cm</van-col>
				    		</van-row>
				    	</view>
				    	<view class="textContent">
				    		<van-row class="text">
				    		  <van-col span="17">体重（标准：70kg）</van-col>
				    		  <van-col span="7" class="textRight">80kg</van-col>
				    		</van-row>
				    	</view>
				    	<view class="textContent">
				    		<van-row class="text">
				    		  <van-col span="17">肌肉量（标准：60kg）</van-col>
				    		  <van-col span="7" class="textRight">50kg</van-col>
				    		</van-row>
				    	</view>
				    	<view class="textContent">
				    		<van-row class="text">
				    		  <van-col span="17">体脂量（标准：30kg）</van-col>
				    		  <van-col span="7" class="textRight">15kg</van-col>
				    		</van-row>
				    	</view>
						<view class="textContent">
							<van-row class="text">
							  <van-col span="17">体脂百分比（标准：18%）</van-col>
							  <van-col span="7" class="textRight">30%</van-col>
							</van-row>
						</view>
						<view class="textContent">
							<van-row class="text">
							  <van-col span="17">腰臀百分比（标准：15%）</van-col>
							  <van-col span="7" class="textRight">25%</van-col>
							</van-row>
						</view>
						<view class="textContent">
							<van-row class="text">
							  <van-col span="17">基础代谢（标准：2200cal）</van-col>
							  <van-col span="7" class="textRight">1800cal</van-col>
							</van-row>
						</view>
						<view class="textContent">
							<van-row class="text">
							  <van-col span="17">体水分（标准：40%）</van-col>
							  <van-col span="7" class="textRight">20%</van-col>
							</van-row>
						</view>
				    </view>
				</van-collapse-item>
			</van-collapse>
		</view>
		
		<view class="basicInformation">
			<van-collapse v-model="bodyAssessment"
			:border = 'false'>
				<van-collapse-item 
				title="体态评估" 
				name="4" 
				title-class="informationTitleText"
				class="informationCard">
				    <view class="bodyAssessment">
						<view style="width: 10px;
								height: 10px;
								background: #FFC13C;
								border-radius: 100%;
								display: inline-flex;
								margin-right: 20upx;"
								></view><span style="font-size: 30upx;
								font-weight: 400;
								color: #F4F7FF;
								line-height: 42upx;">颈部前引</span>
						<view class="assessmentContent">
							<p>
								紧张肌肉：肩胛提肌，颈伸肌，前斜角肌，头后大直肌，头半棘肌，胸锁乳突形肌。
							</p>
							<p style="margin-top: 20upx;">
								无力肌肉：深层颈屈肌，菱形肌，中下斜方肌，小圆肌，岗下肌。
							</p>
						</view>
					</view>
					<view class="bodyAssessment">
						<view style="width: 10px;
								height: 10px;
								background: #FFC13C;
								border-radius: 100%;
								display: inline-flex;
								margin-right: 20upx;"
								></view>
								<span style="font-size: 30upx;
								font-weight: 400;
								color: #F4F7FF;
								line-height: 42upx;">高低肩</span>
						<view class="assessmentContent">
							<p>
								紧张肌肉：上斜方肌，肩胛提肌，菱形肌。
							</p>
							<p style="margin-top: 20upx;">
								无力肌肉：中下斜方肌，菱形肌，岗下肌。
							</p>
						</view>
					</view>
				</van-collapse-item>
			</van-collapse>
		</view>
		
		<view class="basicInformation">
			<van-collapse v-model="dynamicEvaluation"
			:border = 'false'>
				<van-collapse-item 
				title="动态评估" 
				name="5" 
				title-class="informationTitleText"
				class="informationCard">
				    <view class="bodyAssessment">
						<view style="width: 10px;
								height: 10px;
								background: #FFC13C;
								border-radius: 100%;
								display: inline-flex;
								margin-right: 20upx;"
								></view><span style="font-size: 30upx;
								font-weight: 400;
								color: #F4F7FF;
								line-height: 42upx;">正面观：先屈膝下蹲</span>
						<view class="assessmentContent">
							<p>
								问题描述：股四头肌和髋关节屈肌活跃，臀部肌群不够活跃。
							</p>
						</view>
					</view>
					<view class="bodyAssessment">
						<view style="width: 10px;
								height: 10px;
								background: #FFC13C;
								border-radius: 100%;
								display: inline-flex;
								margin-right: 20upx;"
								></view>
								<span style="font-size: 30upx;
								font-weight: 400;
								color: #F4F7FF;
								line-height: 42upx;">侧面观：胫骨和躯干不平衡</span>
						<view class="assessmentContent">
							<p>
								问题描述：跖屈肌紧张，导致背屈足背屈不足，运动力学不良。
							</p>
						</view>
					</view>
				</van-collapse-item>
			</van-collapse>
		</view>
		
		<view class="basicInformation">
			<van-collapse v-model="physicalFitnessAssessment"
			:border = 'false'>
				<van-collapse-item 
				title="体能评估" 
				name="6" 
				title-class="informationTitleText"
				class="informationCard">
					<van-row style="background-color: #343A44;">
						<van-col class="need_scoll" span="24">
							<view class="dynamicshow"
								v-for="(item,index) in dynamicEvaluationdata" :key="index">
								<view class="dynamicshow_left" v-if="item.type>0">
									<text class="evaluationdata">
										{{item.title}}
									</text>
									<text v-if="index==0">
										心率：{{item.type}}/分
									</text>
									<text v-else-if="index==1">
										数量：{{item.type}}个
									</text>
									<text v-else-if="index==2">
										数量：{{item.type}}个
									</text>
								</view>
								<view class="dynamicshow_left" v-else>
									<text class="evaluationdata">
										{{item.title}}
									</text>
									<text>
										暂未测试，快去测试吧
									</text>
								</view>
								<view class="dynamicshow_right" v-if="item.type>=90">
									<van-circle
									  v-model:current-rate="currentRate"
									  :rate="100"
									  :speed="400"
									  text="优秀"
									  layer-color="#383D46"
									  color="#01E08C"
									  style="--van-circle-text-color: #01E08C;"
									/>
								</view>
								<view class="dynamicshow_right" v-else-if="item.type>=60">
									<van-circle
									  v-model:current-rate="currentRate"
									  :rate="100"
									  :speed="400"
									  text="中上"
									  layer-color="#383D46"
									  color="#FFC13C"
									  style="--van-circle-text-color: #FFC13C;"
									/>
								</view>
								<view class="dynamicshow_right" v-else-if="item.type>0">
									<van-circle
									  v-model:current-rate="currentRate"
									  :rate="100"
									  :speed="400"
									  text="较差"
									  layer-color="#383D46"
									  color="#F04242"
									  style="--van-circle-text-color: #F04242;"
									/>
								</view>
								<view class="dynamicshow_right" v-else>
									<van-circle
									  v-model:current-rate="currentRate"
									  :rate="100"
									  :speed="400"
									  text="待测"
									  layer-color="#383D46"
									  color="#4B525E"
									  style="--van-circle-text-color: #4B525E;"
									/>
								</view>
							</view>
						</van-col>
					</van-row>
				</van-collapse-item>
			</van-collapse>
		</view>
		
		<van-button
		type="primary" 
		class="shareButton" 
		icon="../../static/app-plus/other/share.svg"
		@click="showShare = true">分享报告</van-button>
		<van-share-sheet
		  v-model:show="showShare"
		  :options="options"
		  @select="onSelect"
		  cancel-text=""
		  class="shareBlock"
		/>
	</view>
</template>

<script>
	import BgTheamCompontent from '@/components/bgTheamCompontent/bgTheamCompontent.vue';
	import NavBarCompontent from '@/components/navBarCompontent/navBarCompontent.vue';
	import { ref } from 'vue';
	const user = uniCloud.importObject('my');
	export default {
		data() {
			return {
				currentRate:50,
				personName:"未知",
				gender:1,
				age:0,
				mobileNumber:0,
				dynamicEvaluationdata: [
					{
						title: "俯卧撑耐力测试",
						type: 60,
						path: '/pages/physicalFitnessAssessment/actionEvaluation/actionEvaluation?pageName=俯卧撑耐力测试'
					},
					{
						title: "卷腹测试",
						type: 30,
						path: '/pages/physicalFitnessAssessment/actionEvaluation/actionEvaluation?pageName=卷腹测试'
					},
					{
						title: "三分钟踏板测试",
						type: 100,
						path: '/pages/physicalFitnessAssessment/actionEvaluation/actionEvaluation?pageName=三分钟踏板测试'
					},
					{
						title: "自重深蹲测试",
						type: 0,
						path: '/pages/physicalFitnessAssessment/actionEvaluation/actionEvaluation?pageName=自重深蹲测试'
					}
				],
				showShare:false,
				options:[
				  { name: '分享到微信', icon: '../../static/app-plus/other/saveWechat.svg' },
				  { name: '分享到朋友圈', icon: '../../static/app-plus/other/wechatMoments.svg' },
				  { name: '保存到相册', icon: '../../static/app-plus/other/savePhone.svg' }
				]
			}
		},
		setup() {
		    const activeBasicInformation = ref(['1']);
			const healthQA = ref(['2']);
			const BodyTestReport = ref(['3']);
			const bodyAssessment = ref(['4']);
			const dynamicEvaluation = ref(['5']);
			const physicalFitnessAssessment = ref(['6']);
			return { 
				activeBasicInformation,
				healthQA,
				BodyTestReport,
				bodyAssessment,
				dynamicEvaluation,
				physicalFitnessAssessment
				};
		},
		onShow() {
			this.getUserInfo()
		},
		methods: {
			async getUserInfo(){
				const res = await user.getUserInfo();
				console.log(res.data)
				this.name = res.data.name;
				this.gender = res.data.gender;
				this.mobileNumber = res.data.mobile;
			}
		},
		components: {
			BgTheamCompontent,
			NavBarCompontent
		},
	}
</script>

<style>
	.content_style {
		width: 100vw;
		height: 100vh;
		overflow: auto;
		position: relative;
		background-color: #212328;
	}
	.titleText{
		margin: 10upx 30upx 0 30upx;
	}
	.text{
		font-size: 30upx;
		font-weight: 400;
		/* color: #BDC3CE; */
	}
	.titleTopText{
		font-size: 60upx;
		color: #F4F7FF;
		font-weight: 600;
		line-height: 84upx;
	}
	.textRight{
		text-align: right;
	}
	.titleTopText :last-child{
		text-align: right;
	}
	.titleBottomText{
		font-size: 24upx;
		font-weight: 400;
		color: #7A7F89;
		line-height: 34upx;
		margin-top: 10upx;
	}
	.titleBottomText :last-child{
		text-align: right;
	}
	.basicInformation{
		width: calc(100vw - 60upx);
		/* background: #383D46; */
		border-radius: 24upx;
		opacity: 0.6;
		margin: 30upx 30upx 0 30upx;
	}
	.basicInformationContent{
		margin: 30upx 30upx 40upx 30upx;
	}
	.textContent{
		margin-bottom: 30upx;
	}
	::v-deep .informationTitleText{
		font-size: 36upx;
		font-weight: 600;
		color: #F4F7FF;
	}
    ::v-deep .van-cell{
		background: #383D46;
		border-top-left-radius: 24upx;
		border-top-right-radius: 24upx;
	}
	::v-deep .van-collapse-item__content{
		background: #383D46;
		font-size: 30upx;
		font-weight: 400;
		color: #BDC3CE;
		line-height: 42upx;
		border-bottom-left-radius: 24upx;
		border-bottom-right-radius: 24upx;
	}
	::v-deep .van-cell:after{
		border-bottom: none;
	}
	.healthBlock{
		width: 197upx;
		height: 80upx;
		background: #4d5561;
		border-radius: 16upx;
		font-size: 28upx;
		font-weight: 400;
		line-height: 80upx;
		text-align: center;
		display: inline-block;
		margin-right: 17upx;
	}
	.healthBlocks{
		margin: 0;
		margin-bottom: 30upx;
	}
	.healthBlocks :last-child{
		margin-right: 0px;
	}
	.greenBlock{
		width: 6upx;
		height: 26upx;
		background: #01E08C;
		position: absolute;
		margin-top: 6upx;
		margin-left: -30upx;
	}
	.countNumBlock{
		width: 550upx;
		height: 190upx;
		background: #4d5561;
		border-radius: 24upx;
		padding-top: 30upx;
		padding-left: 40upx;
		padding-right: 40upx;
		padding-bottom: 40upx;
		margin-bottom: 40upx;
	}
	.assessmentContent{
		margin-top: 20upx;
		margin-bottom: 40upx;
		margin-left: 40upx;
	}
	.dynamicshow{
		overflow-y: auto;
		background-color: #383D46;
		/* margin-left: 30upx; */
		margin-top: 30upx;
		padding:0 30upx 0 30upx;
		height: 280upx;
		background: #383D46;
		border-radius: 24upx;
		position: relative;
	}
	.dynamicshow{
	width: calc(100vw - 120upx);
		overflow-y: auto;
		background-color: #383D46;	
		/* margin-left: 30upx; */
		margin-top: 30upx;
		height: 280upx;
		border-radius:24upx;
		position: relative;
		font-size: 36upx;
			color: #F4F7FF;	
			display: flex;
			align-items: center;
			justify-content: space-between;
	}
	.dynamicshow_left{
		/* display: flex; */
		/* margin-left: 30upx; */
		align-items: center;
	}
	.dynamicshow_button{
		width: 220upx;
		height: 80upx;
		background: #4B525E;
		border-radius: 42px;
		border: 0px none;
	}
	.dynamicshow_right{
		margin-right: 70upx;
		--van-circle-text-font-weight:600;
		--van-circle-text-font-size:36upx;
	}
	.evaluationdata{
		font-size: 36upx;
			color: #F4F7FF;	
			display: flex;
			align-items: center;
			justify-content: space-between;
		width: 252upx;
		height: 50upx;
		margin-bottom: 74upx;
		font-weight: 600;
		color: #FFFFFF;
		line-height: 50px;
	}
	.shareButton{
		width: calc(100vw - 60upx);
		height: 100upx;
		background: #1370FF;
		border-radius: 16upx;
		margin-left: 30upx;
		margin-top: 40upx;
		margin-bottom: 10upx;
	}
	::v-deep .van-popup{
		width: 100vw;
		height: 388upx;
		background: #383D46;
		border-radius: 24upx 24upx 0upx 0upx;
	}
	::v-deep .van-share-sheet__name{
		color: #F4F7FF;
	}
	::v-deep .van-share-sheet__options{
		margin: 80upx 0 0 0;
	}
	::v-deep .van-share-sheet__option{
		margin-left: 94upx;
		margin-right: -44upx;
	}
</style>
