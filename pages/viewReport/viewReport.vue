<template>
	<view class="content_style">
	<!-- 	<BgTheamCompontent :theamType="'currency'"></BgTheamCompontent>
		<NavBarCompontent :leftNavTitle="pageName"></NavBarCompontent> -->
		<view class="arrow-left" :class="{show:isFixedTop}" @click="onClickLeft">
			<van-icon name="arrow-left" />
			<view class="title">{{pageName}}</view>
			<view class="z" style="opacity: 0;">8888</view>
		</view>
		<view v-show="isFixedTop" class="arrow-box"></view>
		<view id="viewReport">
		<view class="backImg"></view>
		<view class="titleText" v-if="openKey">
			<van-row class="titleTopText">
			  <van-col span="12">体测报告</van-col>
			  <van-col span="12">10.04</van-col>
			</van-row>
			<van-row class="titleBottomText">
			  <van-col span="12">数据评测来源于世界权威机构</van-col>
			  <van-col span="12">2022年</van-col>
			</van-row>
		</view>
		<view class="titleText" v-if="!openKey">
			<van-row class="titleTopText">
			  <van-col span="12">{{personName}}
				<view class="titleType">已购课</view>
			  </van-col>
			  <van-col span="12">
				  <!-- <input type="button" value="重新测试" class="titleButton"/> -->
				  <button class="titleButton">重新测试</button>
			  </van-col>
			</van-row>
			<van-row class="titleBottomText">
				<van-col span="12">2022年</van-col>
			  <van-col span="12">数据评测来源于世界权威机构</van-col>
			</van-row>
		</view>
		<view class="bgImg">
			<!-- <image src="../../static/app-plus/bg/bodysideReport.png"></image> -->
		</view>
		<view class="basicInformation">
			<uni-collapse v-model="activeBasicInformation"
			:border = 'false'
			class="need_collapse_style"
			title-border='none'>
				<uni-collapse-item 
				title="基础信息" 
				name="1" 
				>
					<view style="height: 280upx;">
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
				</uni-collapse-item>
			</uni-collapse>
		</view>
		
		<view class="basicInformation">
			<uni-collapse v-model="healthQA"
			:border = 'false'>
				<uni-collapse-item 
				title="健康问答" 
				name="2" 
				class="informationCard">
				<view style="padding-bottom: 40upx;"  v-if="showHQ">
				    <view class="basicInformationContent healthBlocks">
						<view v-for="(items,index) in HQDate">
							<view class="healthBlock" v-for="(item,index) in items[0].answer">
								{{item}}
							</view>
						</view>
					</view>
					<view v-for="(items,index) in HQDate">
					<view class="healthBlocks" v-if="items[1].remark == '是' ? true : false">
						<view style="margin-bottom: 20upx;color: #F4F7FF;font-size: 30upx;font-weight: 500;">
							<view class="greenBlock"></view>
							其他被确诊的疾病
						</view>
							<view class="healthBlock">
								{{items[1].remark}}
							</view>
						</view>
					</view>
					<view v-for="(items,index) in HQDate">
					<view class="healthBlocks" v-if="items[2].remark == '是' ? true : false">
						<view style="margin-bottom: 20upx;color: #F4F7FF;font-size: 30upx;font-weight: 500;">
							<view class="greenBlock"></view>
							关节、韧带和肌肉是否受过任何损伤
						</view>
							<view class="healthBlock">
								{{items[2].remark}}
							</view>
						</view>
					</view>
					<view v-for="(items,index) in HQDate">
					<view class="healthBlocks" v-if="items[3].remark == '是' ? true : false">
						<view style="margin-bottom: 20upx;color: #F4F7FF;font-size: 30upx;font-weight: 500;">
							<view class="greenBlock"></view>
							是否曾经骨折
						</view>
							<view class="healthBlock">
								{{items[3].remark}}
							</view>
						</view>
					</view>
					<view v-for="(items,index) in HQDate">
					<view class="healthBlocks" v-if="items[4].remark == '是' ? true : false">
						<view style="margin-bottom: 20upx;color: #F4F7FF;font-size: 30upx;font-weight: 500;">
							<view class="greenBlock"></view>
							最近的体重是否有大幅度的变化
						</view>
							<view class="healthBlock">
								{{items[4].remark}}
							</view>
						</view>
					</view>
					<view v-for="(items,index) in HQDate">
					<view class="healthBlocks" v-if="items[5].remark == '是' ? true : false">
						<view style="margin-bottom: 20upx;color: #F4F7FF;font-size: 30upx;font-weight: 500;">
							<view class="greenBlock"></view>
							最近的体重是否有大幅度的变化
						</view>
							<view class="healthBlock">
								{{items[5].remark}}
							</view>
						</view>
					</view>
					<view v-for="(items,index) in HQDate">
					<view class="healthBlocks" v-if="items[6].remark == '是' ? true : false">
						<view style="margin-bottom: 20upx;color: #F4F7FF;font-size: 30upx;font-weight: 500;">
							<view class="greenBlock"></view>
							最近的体重是否有大幅度的变化
						</view>
							<view class="healthBlock">
								{{items[6].remark}}
							</view>
						</view>
					</view>
					<view v-for="(items,index) in HQDate">
					<view class="healthBlocks" v-if="items[7].remark == '是' ? true : false">
						<view style="margin-bottom: 20upx;color: #F4F7FF;font-size: 30upx;font-weight: 500;">
							<view class="greenBlock"></view>
							最近的体重是否有大幅度的变化
						</view>
							<view class="healthBlock">
								{{items[7].remark}}
							</view>
						</view>
					</view>
					<view v-for="(items,index) in HQDate">
					<view class="healthBlocks" v-if="items[8].remark == '是' ? true : false">
						<view style="margin-bottom: 20upx;color: #F4F7FF;font-size: 30upx;font-weight: 500;">
							<view class="greenBlock"></view>
							最近的体重是否有大幅度的变化
						</view>
							<view class="healthBlock">
								{{items[8].remark}}
							</view>
						</view>
					</view>
					</view>
					<view style="height: 612upx;" v-else>
						<image src="../../static/app-plus/other/defaultImg.png" style="width: 180upx;height: 180upx;margin: 0 auto;top: 120upx;left: 256upx;"></image>
						<view style="width: 350upx;
									height: 40upx;
									font-size: 28upx;
									font-weight: 400;
									color: #7A7F89;
									line-height: 320upx;
									margin: 0 auto;">暂无评测内容，快去完善吧~</view>
					</view>
				</uni-collapse-item>
			</uni-collapse>
		</view>
		
		<view class="basicInformation">
			<uni-collapse v-model="BodyTestReport"
			:border = 'false'>
				<uni-collapse-item 
				title="体测报告" 
				name="3" 
				title-class="informationTitleText"
				class="informationCard">
				<view style="padding-bottom: 40upx;">
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
margin-top: 10upx;">{{bodyFraction}}</van-col>
					</van-row>
					<van-row >
					  <van-col span="24" style="
color: #BDC3CE;">再努力一点会更好哦！</van-col>
					</van-row>
					<view style="margin-top: 44upx;">
						<van-progress :percentage="bodyFraction" 
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
				    		  <van-col span="12" class="textRight">{{bodyTestData.height}}cm</van-col>
				    		</van-row>
				    	</view>
				    	<view class="textContent">
				    		<van-row class="text">
				    		  <van-col span="17">体重（标准：70kg）</van-col>
				    		  <van-col span="7" class="textRight">{{bodyTestData.weight}}kg</van-col>
				    		</van-row>
				    	</view>
				    	<view class="textContent">
				    		<van-row class="text">
				    		  <van-col span="17">肌肉量（标准：60kg）</van-col>
				    		  <van-col span="7" class="textRight">{{bodyTestData.muscleMass}}kg</van-col>
				    		</van-row>
				    	</view>
				    	<view class="textContent">
				    		<van-row class="text">
				    		  <van-col span="17">体脂量（标准：30kg）</van-col>
				    		  <van-col span="7" class="textRight">{{bodyTestData.fatMass}}kg</van-col>
				    		</van-row>
				    	</view>
						<view class="textContent">
							<van-row class="text">
							  <van-col span="17">体脂百分比（标准：18%）</van-col>
							  <van-col span="7" class="textRight">{{bodyTestData.fatPer}}%</van-col>
							</van-row>
						</view>
						<view class="textContent">
							<van-row class="text">
							  <van-col span="17">腰臀百分比（标准：15%）</van-col>
							  <van-col span="7" class="textRight">{{bodyTestData.buttockPer}}%</van-col>
							</van-row>
						</view>
						<view class="textContent">
							<van-row class="text">
							  <van-col span="17">基础代谢（标准：2200cal）</van-col>
							  <van-col span="7" class="textRight">{{bodyTestData.basal}}cal</van-col>
							</van-row>
						</view>
						<view class="textContent">
							<van-row class="text">
							  <van-col span="17">体水分（标准：40%）</van-col>
							  <van-col span="7" class="textRight">{{bodyTestData.bodyMisture}}%</van-col>
							</van-row>
						</view>
				    </view>
					</view>
				</uni-collapse-item>
			</uni-collapse>
		</view>
		
		<view class="basicInformation">
			<uni-collapse v-model="bodyAssessment"
			:border = 'false'>
				<uni-collapse-item 
				title="体态评估" 
				name="4" 
				title-class="informationTitleText"
				class="informationCard">
				<view style="padding-bottom: 40upx;">
				<view class="bodyAssessment" v-for="(item,index) in assessmentTrueData">
					<view style="width: 5px;
								height: 5px;
								background: #FFC13C;
								border-radius: 100%;
								display: inline-flex;
								margin-right: 20upx;
								margin-bottom: 2px;"
								></view><span style="font-size: 30upx;
								font-weight: 400;
								color: #F4F7FF;
								line-height: 42upx;">{{item.title}}</span>
						<view class="assessmentContent">
							<p style="color: #7A7F89;font-size: 26upx;">
								{{item.text}}
							</p>
							<view class = "warningText">
								<p>
									{{item.warningMessage}}
								</p>
							</view>
						</view>
				</view>
				</view>
				    <!-- <view class="bodyAssessment">
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
					</view> -->
				</uni-collapse-item>
			</uni-collapse>
		</view>
		
		<view class="basicInformation">
			<uni-collapse v-model="dynamicEvaluation"
			:border = 'false'>
				<uni-collapse-item 
				title="动态评估" 
				name="5" 
				title-class="informationTitleText"
				class="informationCard">
				<view style="padding-bottom: 40upx;">
					<view class="bodyAssessment"
						v-for="(item,index) in physicalFitnessAssessmentData">
						<view style="width: 5px;
								height: 5px;
								background: #FFC13C;
								border-radius: 100%;
								display: inline-flex;
								margin-right: 20upx;"
								></view><span style="font-size: 30upx;
								font-weight: 400;
								color: #F4F7FF;
								line-height: 42upx;">{{item.answerTitle}}</span>
						<view class="assessmentContent">
							<p style="color: #7A7F89;font-size: 26upx;">
								{{item.answeerContent}}
							</p>
						</view>
				</view>
					</view>
					<!-- <view class="bodyAssessment">
						<view style="width: 5px;
								height: 5px;
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
					</view> -->
				</uni-collapse-item>
			</uni-collapse>
		</view>
		
		<view class="basicInformation">
			<uni-collapse v-model="physicalFitnessAssessment"
			:border = 'false'>
				<uni-collapse-item 
				title="体能评估" 
				name="6" 
				title-class="informationTitleText"
				class="informationCard">
				<view style="padding-bottom: 40upx;">
					<van-row style="background-color: #343A44;">
						<van-col class="need_scoll" span="24">
							<view
							  class="dynamicshow"
							  v-for="(item, index) in queryData"
							  :key="index"
							>
							  <view class="dynamicshow_left" v-if="item.type > 0">
							    <text class="evaluationdata">
							      {{ item.questionContent }}
							    </text>
								<text v-if="item.code=='F0001'">
									心率：{{item.type}}/分
								</text>
								<text v-else>
									数量：{{item.type}}个
								</text>
							  </view>
							  <view class="dynamicshow_left" v-else>
							    <text class="evaluationdata">
							      {{ item.questionContent }}
							    </text>
								<text class="noEvaText">
									暂未测试，快去测试吧
								</text>
							    <!-- <van-button
							      round
							      type="primary"
							      color="#1370FF"
							      class="dynamicshow_button"
							      icon="../../static/app-plus/other/arrows.png"
							      icon-position="right"
								  @click.native="jumpModular(item)"
							      >开始测试</van-button
							    > -->
							  </view>
							  <view class="dynamicshow_right">
							    <!-- <van-circle
							      v-model:current-rate="currentRate"
							      :rate="100"
							      :speed="400"
							      :text="item.typeText"
							      :layer-color="item.typeColor"
							      :color="item.typeColor"
							      :style="'--van-circle-text-color:'+ item.typeColor"
							    /> -->
								<view class="circle" :style="'border: 4px solid '+item.typeColor+';'">
									<view class="circleText" :style="'color:'+item.typeColor+';'">{{item.typeText}}</view>
								</view>
							  </view>
							</view>
							<!-- <view class="dynamicshow"
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
							</view> -->
						</van-col>
					</van-row>
					</view>
				</uni-collapse-item>
			</uni-collapse>
		</view>
		</view>
		<view v-if="openKey">
			<!-- #ifdef APP-PLUS || H5 -->
			<view :prop="canvasImageMsg" :change:prop="canvasImage.updateEcharts" id="canvasImage"></view>
			<!-- #endif -->
			<!-- <van-button
			type="primary" 
			class="shareButton" 
			icon="../../static/app-plus/other/share.png"
			@click="saveReport">分享报告</van-button> -->
			<view class="bottom_style" @click="saveReport">
				<image src="../../static/app-plus/other/share.png" class="shareImage"></image>
				分享报告
			</view>
			<uni-popup ref="popup" type="bottom" mask-background-color="rgba(20, 21, 23, 0.6)">
				<view class="share-sheet">
					<view class="item" v-for="(item,index) in options" :key="index" @click="onSelect(item)">
						<van-image class="img" round :src="item.icon"/>
						<view class="text">{{item.name}}</view>
					</view>
				</view>
			</uni-popup>
			<!-- <van-share-sheet
			  v-model:show="showShare"
			  :options="options"
			  @select="onSelect"
			  cancel-text=""
			  class="shareBlock"
			/> -->
		</view>
		<view v-if="!openKey">
			<view 
			class="buttontrue"
			@click="openUIup">历史评测记录
			<!-- <image src="../../../static/app-plus/mebrs/openarrit.png"></image> -->
			<image src="../../static/app-plus/mebrs/openarrit.png"></image>
			</view>
<!-- 			<van-button
			type="primary" 
			class="historyView" 
			icon="../../static/app-plus/other/share.png"
			@click="showShare = true">历史评测记录</van-button> -->
			<uni-popup ref="popup" type="bottom" mask-background-color="rgba(20, 21, 23, 0.6)">
				<view class="histroys">
					<view class="Titlehistroy" >历史评测报告</view>
					<view class="item" v-for="(item,index) in historyData" :key="index" @click="">
						<view class="text" style="float: left;">{{item.name}}</view>
						<view class="text" style="float: right;">{{item.date}}</view>
					</view>
				</view>
			</uni-popup>
		</view>
	</view>
</template>

<script>
	// import BgTheamCompontent from '@/components/bgTheamCompontent/bgTheamCompontent.vue';
	// import NavBarCompontent from '@/components/navBarCompontent/navBarCompontent.vue';
	import { ref } from 'vue';
	import html2canvas from 'html2canvas'
import { now } from 'moment';
	const user = uniCloud.importObject('my',{
		customUI : true
	});
	const testOb = uniCloud.importObject("testResults",{
		customUI : true
	});
	const busOb = uniCloud.importObject('businessCloudObject',{
		customUI : true
	});
	const train = uniCloud.importObject('train',{
		customUI : true
	})
	export default {
		data() {
			return {
				currentRate:50,
				pageName:'',
				personName:"未知",
				gender:1,
				age:0,
				mobileNumber:0,
				openKey:true,
				key:'',
				bodyTestData:[],
				HQDate:[],
				physicalFitnessAssessmentData:[],
				bodyFraction:0,
				historyData:[],
				showHQ:true,
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
				showHistory:false,
				options: [
					{ name: '分享到微信', icon: 'https://mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3.cdn.bspapp.com/cloudstorage/23704d74-641b-4a8e-9ced-f393c631667a.png' },
					{ name: '分享到朋友圈', icon: 'https://mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3.cdn.bspapp.com/cloudstorage/4be11f14-035d-47f0-8c5d-f147b494246b.png' },
					{ name: '保存到相册', icon: 'https://mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3.cdn.bspapp.com/cloudstorage/c5edf505-9026-4d72-a16c-3ea5c8e4304c.png' }
				],
				history:[
					{ name: '分享到微信', icon: '../../static/app-plus/other/saveWechat.png' },
					{ name: '分享到朋友圈', icon: '../../static/app-plus/other/wechatMoments.png' },
					{ name: '保存到相册', icon: '../../static/app-plus/other/savePhone.png' }
				],
				getOnlyLists:{},
				traineeNo:'',
				resultValue:0,
				typeText:"待测",
				typeColor:"#4B525E",
				queryData:{},
				queryUserActionData:{},
				assessmentNewData:{},
				assessmentTrueData:[],
				baseUrl: null,
				url: null,
				canvasImageMsg: null,
				isFixedTop:false
			}
		},
		//监测页面滑动
		onPageScroll(e) {
			console.log(uni.getWindowInfo().statusBarHeight)
			if(e.scrollTop > uni.getWindowInfo().statusBarHeight){
				this.isFixedTop = true
			}else{
				this.isFixedTop = false
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
			console.log(this.key)
			
		},
		onLoad(options) {
		  if (JSON.stringify(options) !== '{}' && options.traineeNo) {
		    this.traineeNo = options.traineeNo
			this.key = options.key
			this.getUserInfo();
			this.getconfingActionName();
			this.getPosture();
			this.getBodyTestData();
			this.getDynameEvaluation();
			this.getHealthQuesson();
			switch(this.key){
							case "1":
								this.openKey = true;
								this.saveReport();
								break;
							case "2":
								this.openKey = false;
								this.getHistroyDate();
								this.pageName = '会员信息'
								console.log("1111")
								break;
			}
			
			}
		},
		methods: {
			async getUserInfo(){
				const data ={};
				data["traineeId"] = this.traineeNo;
				testOb.getOnlyList(data).then((res)=>{
					console.log(res.data)
					this.personName =  res.data[0].traineeName;
					this.gender = res.data[0].gender
					this.mobileNumber = res.data[0].mobile
					this.age = this.getAge(res.data[0].birthday)
				})
			},
			getAge(birthday){//根据日期算年龄
			          birthday=birthday.split('-');
			          // 新建日期对象
			          let date = new Date();
			          // 今天日期，数组，同 birthday
			          let today = [date.getFullYear(), date.getMonth() + 1, date.getDate()];
			          // 分别计算年月日差值
			          let age = today.map((val, index) => {
			              return val - birthday[index]
			          })
			          // 当天数为负数时，月减 1，天数加上月总天数
			          if (age[2] < 0) {
			              // 简单获取上个月总天数的方法，不会错
			              let lastMonth = new Date(today[0], today[1], 0)
			              age[1]--
			              age[2] += lastMonth.getDate()
			          }
			          // 当月数为负数时，年减 1，月数加上 12
			          if (age[1] < 0) {
			              age[0]--
			              age[1] += 12
			          }
			          // console.log(age[0]+'岁'+age[1]+'月'+age[2]+'天');
					  return age[0];
			},
			//通过传入的type值来更新等级颜色
			levelColor(levelType){
				switch(levelType){
					case "优秀":
					case "良好":
						return "rgba(1, 224, 140, 1)";
						break;
					case "中等":
					case "中上等":
					case "中下等":
					case "尚可":
						return "#FFC13C";
						break;
					case "较差":
					case "非常差":
					case "需改善":
						return "#F04242";
						break;
					default:
						return "#4B525E";
						break;
				}
			},
			//获取运动表
			getconfingActionName(){
				const data = {};
				data["traineeNo"] = this.traineeNo;
				data["questionCode"] = "A0005";
				// console.log(data)
			testOb.opearConfigQuery(data).then((res)=>{
					// console.log(res)
					if(res.success){
						this.queryUserActionData = res.data
						busOb.getPhysicalChildAssessmentList("A0005").then((res)=>{
							this.queryData = res.data;
							this.queryData.forEach((item)=>{
								item['typeText']='待测';
								item['type']=0;
								item['typeColor'] = this.levelColor(item.typeText);
								item['path'] = '/pages/physicalFitnessAssessment/actionEvaluation/actionEvaluation';
								// console.log(item)
							})
							for(let j = 0;j<this.queryUserActionData.length;j++){
								for(let i=0;i<this.queryData.length;i++){
									// console.log(this.queryData[i].code===this.queryUserActionData[j].code)
									if(this.queryData[i].code===this.queryUserActionData[j].code){
										this.queryData[i].typeText=this.queryUserActionData[j].physicalData.actionTypeText;
										this.queryData[i].type=this.queryUserActionData[j].physicalData.actionVlue;
										this.queryData[i].typeColor = this.levelColor(this.queryUserActionData[j].physicalData.actionTypeText);
										continue;
									}
								}
							}
							// console.log(this.queryData)
						}).catch((err)=>{
						});
					}
				}).catch();
			},
			//获取用户的体态评估
			getPosture(){
				const data = {};
				data["traineeNo"] = this.traineeNo;
				data["questionCode"] = "A0003";
				// console.log(data);
				testOb.opearConfigQuery(data).then((res)=>{
						if(res.success){
							this.assessmentNewData = res.data[0].postData
							let trueData = {}
							if(!this.assessmentNewData[0].textShow1){
								trueData["title"] = this.assessmentNewData[0].title1;
								trueData["text"] = this.assessmentNewData[0].text1;
								trueData["warningMessage"] = this.assessmentNewData[0].warningMessage;
								this.assessmentTrueData.push(trueData)
								trueData = {}
							}
							if(!this.assessmentNewData[1].textShow2){
								trueData["title"] = this.assessmentNewData[1].title2;
								trueData["text"] = this.assessmentNewData[1].text2;
								trueData["warningMessage"] = this.assessmentNewData[1].warningMessage;
								this.assessmentTrueData.push(trueData)
								trueData = {}
							}
							if(!this.assessmentNewData[2].textShow3){
								trueData["title"] = this.assessmentNewData[2].title1;
								trueData["text"] = this.assessmentNewData[2].text1;
								trueData["warningMessage"] = this.assessmentNewData[2].warningMessage;
								this.assessmentTrueData.push(trueData)
								trueData = {}
							}
							if(!this.assessmentNewData[3].textShow4){
								trueData["title"] = this.assessmentNewData[3].title2;
								trueData["text"] = this.assessmentNewData[3].text2;
								trueData["warningMessage"] = this.assessmentNewData[3].warningMessage;
								this.assessmentTrueData.push(trueData)
								trueData = {}
							}
							if(!this.assessmentNewData[4].textShow5){
								trueData["title"] = this.assessmentNewData[4].title1;
								trueData["text"] = this.assessmentNewData[4].text1;
								trueData["warningMessage"] = this.assessmentNewData[4].warningMessage;
								this.assessmentTrueData.push(trueData)
								trueData = {}
							}
							if(!this.assessmentNewData[5].textShow6){
								trueData["title"] = this.assessmentNewData[5].title2;
								trueData["text"] = this.assessmentNewData[5].text2;
								trueData["warningMessage"] = this.assessmentNewData[5].warningMessage;
								this.assessmentTrueData.push(trueData)
								trueData = {}
							}
							if(!this.assessmentNewData[6].textShow7){
								trueData["title"] = this.assessmentNewData[6].title1;
								trueData["text"] = this.assessmentNewData[6].text1;
								trueData["warningMessage"] = this.assessmentNewData[6].warningMessage;
								this.assessmentTrueData.push(trueData)
								trueData = {}
							}
							if(!this.assessmentNewData[7].textShow8){
								trueData["title"] = this.assessmentNewData[7].title1;
								trueData["text"] = this.assessmentNewData[7].text1;
								trueData["warningMessage"] = this.assessmentNewData[7].warningMessage;
								this.assessmentTrueData.push(trueData)
								trueData = {}
							}
							if(!this.assessmentNewData[8].textShow9){
								trueData["title"] = this.assessmentNewData[8].title2;
								trueData["text"] = this.assessmentNewData[8].text2;
								trueData["warningMessage"] = this.assessmentNewData[8].warningMessage;
								this.assessmentTrueData.push(trueData)
								trueData = {}
							}
							// console.log(this.assessmentTrueData)
						}
					}).catch();
			},
			getBodyTestData(){
				const data = {};
				data["traineeNo"] = this.traineeNo;
				data["questionCode"] = "A0002";
				testOb.opearConfigQuery(data).then((res)=>{
					this.bodyTestData = res.data[0].bodyTestReport;
					// console.log(this.bodyTestData)
					this.bodyFraction = Number(this.bodyTestData.bodyFraction)
				})
			},
			getDynameEvaluation(){
				const data = {};
				data["traineeNo"] = this.traineeNo;
				data["questionCode"] = "A0004";
				const resData = [];
				testOb.opearConfigQuery(data).then((res)=>{
					// console.log(res)
					res.data.forEach((r)=>{
						// console.log(r)
						let rq = r.actionTestResult
						// console.log(rq)
						rq.forEach((rqs)=>{
							// console.log(rqs)
							resData.push(rqs.answer)
						})
						// 
					})
					resData.forEach((d)=>{
						d.forEach((a)=>{
							if(a.status == 0){
								this.physicalFitnessAssessmentData.push(a)
							}
							
						})
					})
					console.log(this.physicalFitnessAssessmentData)
				})
			},
			openUIup(){
				this.$refs.popup.open()
			},
			saveReport(){
				this.$refs.popup.open()
				const data = {};
				let date = new Date();
				let today = date.getFullYear()+'-'+date.getMonth() + 1+'-'+date.getDate();
				data["traineeNo"] = this.traineeNo;
				data["bodyTestData"] = this.bodyTestData;
				data["assessmentTrueData"] = this.assessmentTrueData;
				data["queryData"] = this.queryData;
				data["HQDate"] = this.HQDate;
				data["physicalFitnessAssessmentData"]  =this.physicalFitnessAssessmentData;
				data["saveDate"] = today;
				console.log(data)
				testOb.saveReport(data).then((res)=>{
					console.log(res)
				})
				this.showShare = true;
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
				this.showShare = false;
			    console.log(option.name, 8888)
				this.baseUrl = option.base64;
				this.uploadImage((url)=>{
					uni.showLoading({ title: '加载中'});
					// #ifndef H5
					if(option.name==='保存到相册'){
						console.log("开始调用保存函数")
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
			onSelect(option) {
				console.log(option,88)
				this.canvasImageMsg = option.name
			},
			onClickLeft(){
				if(this.openKey){
					uni.redirectTo({
						url: '/pages/physicalAssessment/physicalAssessment' +'?traineeNo=' + this.traineeNo
					})
				}else{
					uni.reLaunch({
						url: '/pages/myMebers/myMebers'
					})
				}
			},
			getHealthQuesson(){
				const data = {};
				data["traineeNo"] = this.traineeNo;
				data["questionCode"] = "A0001";
				const resData = [];
				testOb.opearConfigQuery(data).then((res)=>{
					console.log(res.data[0].testResult)
					resData.push(res.data[0].testResult);
					this.HQDate = resData
					if(this.HQDate.length==0){
						this.showHQ = false;
					}
					// res.data.forEach((r)=>{
					// 	console.log(r)
					// 	let rq = r.actionTestResult
					// 	console.log(rq)
					// 	rq.forEach((rqs)=>{
					// 		console.log(rqs)
					// 		resData.push(rqs.answer)
					// 	})
						// 
					})
					// resData.forEach((d)=>{
					// 	d.forEach((a)=>{
					// 		if(a.status == 0){
					// 			this.physicalFitnessAssessmentData.push(a)
					// 		}
							
					// 	})
					// })
					console.log(resData.length)
				// })
			},
			getHistroyDate(){
				if(!this.historyData.length!=0){
					const data = {};
					data["traineeNo"] = this.traineeNo;
					const historyData = {};
					if(!this.openKey){
						testOb.opearReportQuery(data).then((res)=>{
							console.log(res);
							res.data.forEach((item)=>{
								data["name"] = this.personName;
								data["date"] = item.saveDate;
								data["bodyTestData"] = item.bodyTestData;
								data["assessmentTrueData"] = item.assessmentTrueData;
								data["queryData"] = item.queryData;
								data["HQDate"] = item.HQDate;
								data["physicalFitnessAssessmentData"]  = item.physicalFitnessAssessmentData;
								this.historyData.push(data)
							})
						})
					}
				}
				console.log(this.historyData)
				this.showShare = true;
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
				const dom = document.getElementById('viewReport'); // 需要生成图片内容的 dom 节点
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

<style lang="scss">
	.content_style {
		width: 100vw;
		height: 100vh;
		overflow: auto;
		position: relative;
		background-color: #212328;
		background-image: url('../../static/app-plus/bg/bodysideReport.png');
		background-repeat:no-repeat;
		background-size: 100%;
		.arrow-box{
			height: 88upx;
			background: transparent;
		}
		.backImg{
			position: absolute;
			background-image: url('../../static/app-plus/bg/bodysideReport.png');
			background-repeat:no-repeat;
			background-size: 100%;
			z-index:-1;
		}
		.arrow-left{
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
			position: relative;
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
	}
	#viewReport{
		margin-top: 80upx;
	}
	.title{
		width: 120upx;
		height: 42upx;
		font-size: 30upx;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: #FFFFFF;
		line-height: 42upx;
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
		/* opacity: 0.6; */
		margin: 30upx 30upx 0 30upx;
		background: #383d46;
	}
	.basicInformationContent{
		/* margin: 30upx 30upx 40upx 30upx; */
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
		padding-top: 40upx;
		padding-bottom: 0px;
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
		color: #BDC3CE;
		margin-bottom: 40upx;
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
		width: 580upx;
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
		margin-left: 30upx;
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
	.titleButton{
		width: 190upx;
		height: 68upx;
		background: #454951;
		border-radius: 16upx;
		font-size: 30upx;
		font-weight: 600;
		color: #F4F7FF;
		line-height: 68upx;
		margin-right: 0upx;
	}
	.titleType{
		width: 100upx;
		height: 50upx;
		background: #1370FF;
		border-radius: 8upx;
		font-size: 24upx;
		font-weight: 600;
		color: #F4F7FF;
		line-height: 50upx;
		text-align: center;
		float: right;
		margin-right: 20upx;
		margin-top: 15upx;
		padding-right: 20upx;
	}
	.circle{
		width: 100px;
		 height: 100px; 
		 border: 4px solid #4B525E;    
		 border-radius: 100px;
		 line-height: 100px;
	}
	.circleText{
		width: 120upx;
		height: 50upx;
		font-size: 36upx;
		font-weight: 600;
		color: #BDC3CE;
		margin: 0 auto;
		text-align: center;
	}
	.noEvaText{
		width: 300upx;
		height: 42upx;
		font-size: 30upx;
		font-weight: 400;
		color: #BDC3CE;
		line-height: 42upx;
	}
	.historyView{
		width: 690px;
		height: 100px;
		background: #454951;
		border-radius: 16px;
	}
	.buttontrue{
		background: #454951;
	  border-radius: 16upx;
	  margin-top: 30upx;
	  margin-bottom: 30upx;
	  font-size: 32upx;
	  font-family: PingFangSC-Semibold, PingFang SC;
	  font-weight: 600;
	  color: #ffffff;
	  line-height: 100upx;
	  text-align: center;
	  justify-content: center;
	
	  width: calc(100vw - 60upx);
	  margin-left: 30upx;
	
	  display: flex;
	}
	.buttontrue image{
		width: 32upx;
		height: 32upx;
		top: 34upx;
		left: 20upx;
	}
	.warningText{
		width: 600upx;
		background: #3e444e;
		border-radius: 24upx;
		font-size: 26upx;
		font-weight: 400;
		color: #FFC13C;
		margin-top: 60upx;
		margin-left: -15px;
		padding-top: 20px;
		padding-bottom: 20px;
		padding-left: 15px;
		padding-right: 15px;
	}
	.need_loop_style {
	  width: calc(100vw - 60upx);
	  margin-left: 30upx;
	  margin-top: 30upx;
	  background: #383d46;
	  border-radius: 24upx;
	  height: auto;
		.check_box_style {
		  .need_collapse_style {
			width: calc(100% - 60upx);
			margin-left: 30upx;
			height: auto;
			padding-top: 40upx;
			padding-bottom: 40upx;
			box-sizing: border-box;
			background-color: transparent !important;
			.collapes_conten_style {
			  width: 100%;
			  display: flex;
			  align-items: center;
			  flex-wrap: wrap;
			  .collapes_tag_stylle {
				// width: 187upx;
				width: calc((100% - 48upx) / 3);
				height: 80upx;
				background: #4b525e;
				border-radius: 16upx;
				font-size: 28upx;
				// font-family: PingFangSC-Semibold, PingFang SC;
				font-weight: 600;
				color: #f4f7ff;
				text-align: center;
				line-height: 80upx;
				margin-right: 24upx;
				margin-bottom: 24upx;
			  }
			  .active {
				background: #1370ff;
				color: #f4f7ff;
			  }
			  .collapes_tag_stylle:nth-child(3n) {
				margin-right: 0;
			  }
			}
		  }
		}
	}
	::v-deep .uni-collapse{
		background: #383d46 !important;
		border-radius: 16upx;
	}
	::v-deep .uni-collapse-item{
		color: #BDC3CE !important;
	}
	::v-deep .uni-collapse-item__title-box{
		background: #383d46 !important;
		border-radius: 16upx;
	}
	::v-deep .uni-collapse-item__title-text{
		font-size: 36upx !important;
		font-weight: 600 !important;
		color: #F4F7FF !important;
	}
	::v-deep .uni-collapse-item__wrap{
		padding-left: 30upx;
		padding-right: 30upx;
		background: #383d46 !important;
		border-radius: 16upx;
	}
	.textContent{
		color: #BDC3CE;
	}
	::v-deep .uni-collapse-item__wrap-content{
		padding-top: 40upx;
		border-radius: 16upx;
	}
	::v-deep .uni-collapse-item__wrap-content.uni-collapse-item--border{
		border: none !important;
	}
	::v-deep .uni-collapse-item__title.uni-collapse-item-border{
		border: none !important;
	}
	.bottom_style {
	  width: calc(100vw - 60upx);
	  margin-left: 30upx;
	  height: 100upx;
	  background: #1370ff;
	  border-radius: 16upx;
	  margin-top: 30upx;
	  margin-bottom: 30upx;
	  font-size: 32upx;
	  font-family: PingFangSC-Semibold, PingFang SC;
	  font-weight: 600;
	  color: #ffffff;
	  line-height: 100upx;
	  text-align: center;
	}
	.shareImage{
		width: 28upx;
		height: 28upx;
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
	.histroys{
		align-items: center;
		height: 728upx;
		background: #383D46;
		border-radius: 24upx 24upx 0px 0px;
		justify-content: space-around;
		padding: 40upx 40upx 0 40upx;
		.item {
				width: calc(100vw - 160upx);
				height: 130upx;
				background: #4B525E;
				line-height: 130upx;
				margin-bottom: 30upx;
				border-radius: 24upx;
				padding: 0 40upx;
				.text{
					font-size: 28upx;
					font-weight: 400;
					color: #F4F7FF;
					line-height: 40tpx;
				}
			}
	}
	.Titlehistroy{
		font-size: 36upx;
		font-weight: 600;
		color: #F4F7FF;
		margin-bottom: 30upx;
	}
</style>
