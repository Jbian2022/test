<template>
	<view class="content_style">
		<BgTheamCompontent :theamType="'currency'"></BgTheamCompontent>
		<NavBarCompontent :leftNavTitle="leftNavTitle"></NavBarCompontent>
		<view class="body_content">
			<image :src="imgUrl" class="contentImg"></image>
			<view class="contentBlock">
				<van-row>
				  <van-col span="16">
					  <view class="testText">请填写心率</view>
					  <view class="testInput">
						  <view>
							  <van-field v-model="testVaule" class="inputBlock"/>
						  </view>
						  <view class="inputText">/分</view>
					  </view>
				  </van-col>
				  <van-col span="8">
					  <view class="dynamicshow_right">
					    <van-circle
					      v-model:current-rate="currentRate"
					      :rate="100"
					      :speed="400"
					      :text="typeText"
					      :layer-color="typeColor"
					      :color="typeColor"
					      :style="'--van-circle-text-color:'+ typeColor"
					    />
					  </view>
				  </van-col>
				</van-row>
			</view>
		</view>
	</view>
</template>

<script>
	import BgTheamCompontent from '@/components/bgTheamCompontent/bgTheamCompontent.vue'
	import NavBarCompontent from '@/components/navBarCompontent/navBarCompontent.vue'
	import { ref } from 'vue';
	const testOb = uniCloud.importObject("testResults");
	export default {
		setup() {
		    const activeNames = ref(['1']);
		    return { activeNames };
		  },
		onLoad: function (item) {
				console.log(item.pageName);
				let leftNavTitle = item.pageName
				this.leftNavTitle = leftNavTitle
		},
		components: {
			BgTheamCompontent,
			NavBarCompontent
		},
		data() {
			return {
				gender:"1",
				age:18,
				resValue:80,
				resultValue:0,
				typeText:"待测",
				typeColor:"#4B525E",
				imgUrl:'../../../static/app-plus/bg/pedalTest.png',
				leftNavTitle:'',
				testVaule:''
			}
		},
		methods: {
			testResult(){
				const gender = this.gender;
				const age = this.age;
				const resValue = this.resultValue;
				console.log(gender,age,resValue)
				const res = testOb.method1(gender,age,resValue)
				console.log(res.data)
				// const type = (await res).data;
				// if(type.length == 0){
				// 	this.typeText = "待测";
				// }else{
				// this.typeText = type[0].resultLevel;
				// this.levelColor(this.typeText)
				// }
			}
		}
	}
</script>

<style>
.content_style {
	width: 100vw;
	height: 100vh;
	overflow: hidden;
	position: relative;

}
.collapseBlock{
	background-color: #383D46;
	--van-collapse-item-content-background-color:#383D46;
}
::v-deep .van-cell__title{
	text-align: center;
	font-size: 30upx;
	font-weight: 400;
	color: #BDC3CE;
	line-height: 42upx;
}
.contentImg{
	width: calc(100vw - 60upx);
	height: 1062upx;
	margin-top: 20upx;
	margin-left: 30upx;
}
.contentBlock{
	width: calc(100vw - 60upx);
	height: 260upx;
	background: #383D46;
	margin-top: -10upx;
	margin-left: 30upx;
	border-radius: 0px 0px 16px 16px;
}
.testText{
	width: 180upx;
	height: 50upx;
	font-size: 36upx;
	font-family: PingFangSC-Semibold, PingFang SC;
	font-weight: 600;
	color: #F4F7FF;
	line-height: 50upx;
	margin-top: 40upx;
	margin-left: 40upx;
}
.testInput{
	width: 240upx;
	height: 90upx;
	background: #4B525E;
	border-radius: 16upx;
	margin-top: 40upx;
	margin-top: 40upx;
	margin-left: 40upx;
	position: relative;
}
::v-deep .inputBlock{
	width: 120upx;
	background-color: #4B525E;
	border-radius: 16upx;
	position: absolute;
	--van-field-input-text-color:#F4F7FF;
}

.inputText{
	width: 46upx;
	height: 42upx;
	font-size: 30upx;
	font-weight: 400;
	color: #BDC3CE;
	line-height: 42upx;
	position: absolute;
	top:23upx;
	left: 160upx;
}
</style>
