<template>
	<view class="content_style">
		<BgTheamCompontent :theamType="'currency'"></BgTheamCompontent>
		<NavBarCompontent :leftNavTitle="'体能评估'"></NavBarCompontent>
		<van-row style="background-color: #343A44;">
			<van-col class="need_scoll" span="24">
				<view class="dynamicshow"
					v-for="(item,index) in dynamicEvaluationdata" :key="index">
					<view class="dynamicshow_left" v-if="item.type>0">
						<text class="evaluationdata">
							{{item.title}}
						</text>
						<van-button
						 round type="primary" 
						 class="dynamicshow_button" 
						 icon="../../static/app-plus/other/arrows.svg"
						 icon-position="right"
						 @click.native="jumpModular(item)">重新测试</van-button>
					</view>
					<view class="dynamicshow_left" v-else>
						<text class="evaluationdata">
							{{item.title}}
						</text>
						<van-button
						 round
						 type="primary" 
						 color="#1370FF"
						 class="dynamicshow_button" 
						 icon="../../static/app-plus/other/arrows.svg"
						 icon-position="right">开始测试</van-button>
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
		<view>
			<van-button 
			type="primary"
			class="postureButton">确认</van-button>
		</view>
	</view>
</template>

<script>
	import BgTheamCompontent from '@/components/bgTheamCompontent/bgTheamCompontent.vue';
	import NavBarCompontent from '@/components/navBarCompontent/navBarCompontent.vue';
	export default {
		components: {
			BgTheamCompontent,
			NavBarCompontent
		},
		data() {
			return {
				currentRate:50,
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
				]
			}
		},
		methods: {
			jumpModular(item) {
							console.log(item.path,'>>>>');
								uni.navigateTo({
								url: item.path,
								success: res => {},
								fail: () => {},
								complete: () => {}
				});
			}
		}
	}
</script>

<style>
	.content_style{
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		position: relative;
		background: #383D46;
	}
	.dynamicshow{
		width: calc(100vw - 220upx);
		overflow-y: auto;
		background-color: #383D46;
		margin-left: 30upx;
		margin-top: 30upx;
		padding:0 30upx 0 30upx;
		height: 280upx;
		background: #383D46;
		border-radius: 24upx;
		position: relative;
	}
	.dynamicshow{
	width: calc(100vw - 60upx);
		overflow-y: auto;
		background-color: #383D46;	
		margin-left: 30upx;
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
		margin-left: 30upx;
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
	.postureButton{
		width: 690upx;
		height: 100upx;
		background: #1370FF;
		border-radius: 16upx;
		margin-left: 30upx;
		margin-top: 40upx;
	}
</style>
