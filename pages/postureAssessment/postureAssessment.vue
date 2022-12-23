<template>
	<view class="content_style">
		<BgTheamCompontent :theamType="'currency'"></BgTheamCompontent>
		<NavBarCompontent :leftNavTitle="'体态评估'"></NavBarCompontent>
		<view class="bgimg"></view>
		<view class="content">
			<van-row>
			  <van-col span="12">
				  <view class="contentLeftBlock"  
				  @click.native="isonclick(1)" 
				  v-show="textShow1"
				  style="top: 26upx;">
					  颈部前引
				  </view>
				  <view class="clickBlock" 
				  @click.native="isonclick(1)" 
				  v-show="!textShow1"
				  style="top: 26upx;">
					  <view>颈部前引</view>
					  <view>紧张肌肉：肩胛提肌，颈伸肌，前斜角肌，头后大直肌，头半棘肌，胸锁乳突形肌。无力肌肉：深层颈屈肌，菱形肌，中下斜方肌，小圆肌，岗下肌。</view>
				  </view>
			  </van-col>
			  <van-col span="12">
				  <view class="contentRightBlock"
				   @click.native="isonclick(2)" 
				   v-show="textShow2"
				   style="top: 26upx;">
					  高低肩
				  </view>
				  <view class="clickBlock" @click.native="isonclick(2)" v-show="!textShow2" style="top: 26upx;">
				  		<view>高低肩</view>
				  		<view>"紧张肌肉：上斜方肌，肩胛提肌，菱形肌。无力肌肉：中下斜方肌，菱形肌，岗下肌。"</view>
				  </view>
			  </van-col>
			</van-row>
			<van-row>
			  <van-col span="12">
				  <view class="contentLeftBlock"  
				  @click.native="isonclick(3)" 
				  v-show="textShow3"
				  style="top: 120upx;">
					  圆肩
				  </view>
				  <view class="clickBlock" 
				  @click.native="isonclick(3)" 
				  v-show="!textShow3"
				  style="top: 120upx;">
					  <view>圆肩</view>
					  <view>紧张肌肉：肩胛提肌，颈伸肌，前斜角肌，头后大直肌，头半棘肌，胸锁乳突形肌。无力肌肉：深层颈屈肌，菱形肌，中下斜方肌，小圆肌，岗下肌。</view>
				  </view>
			  </van-col>
			  <van-col span="12">
				  <view class="contentRightBlock" 
				  @click.native="isonclick(4)" 
				  v-show="textShow4"
				  style="top: 120upx;">
					  驼背
				  </view>
				  <view class="clickBlock" 
				  @click.native="isonclick(4)" 
				  v-show="!textShow4"
				  style="top: 120upx;">
				  		<view>驼背</view>
				  		<view>"紧张肌肉：上斜方肌，肩胛提肌，菱形肌。无力肌肉：中下斜方肌，菱形肌，岗下肌。"</view>
				  </view>
			  </van-col>
			</van-row>
			<van-row>
			  <van-col span="12">
				  <view class="contentLeftBlock"  
				  @click.native="isonclick(5)" 
				  v-show="textShow5"
				  style="top: 450upx;">
					  骨盆前倾
				  </view>
				  <view class="clickBlock" 
				  @click.native="isonclick(5)" 
				  v-show="!textShow5"
				  style="top: 450upx;">
					  <view>骨盆前倾</view>
					  <view>紧张肌肉：肩胛提肌，颈伸肌，前斜角肌，头后大直肌，头半棘肌，胸锁乳突形肌。无力肌肉：深层颈屈肌，菱形肌，中下斜方肌，小圆肌，岗下肌。</view>
				  </view>
			  </van-col>
			  <van-col span="12">
				  <view class="contentRightBlock" 
				  @click.native="isonclick(6)" 
				  v-show="textShow6"
				  style="top: 450upx;">
					  骨盆后倾
				  </view>
				  <view class="clickBlock" 
				  @click.native="isonclick(6)" 
				  v-show="!textShow6"
				  style="top: 450upx;">
				  		<view>骨盆后倾</view>
				  		<view>"紧张肌肉：上斜方肌，肩胛提肌，菱形肌。无力肌肉：中下斜方肌，菱形肌，岗下肌。"</view>
				  </view>
			  </van-col>
			</van-row>
			<van-row>
			  <van-col span="12">
				  <view class="contentLeftBlock"  
				  @click.native="isonclick(7)" 
				  v-show="textShow7"
				  style="top: 642upx;">
					  膝关节内扣
				  </view>
				  <view class="clickBlock" 
				  @click.native="isonclick(7)" 
				  v-show="!textShow7"
				  style="top: 642upx;">
					  <view>膝关节内扣</view>
					  <view>紧张肌肉：肩胛提肌，颈伸肌，前斜角肌，头后大直肌，头半棘肌，胸锁乳突形肌。无力肌肉：深层颈屈肌，菱形肌，中下斜方肌，小圆肌，岗下肌。</view>
				  </view>
			  </van-col>
			  <van-col span="12">
				  <view class="contentRightBlock" 
				  @click.native="isonclick(8)" 
				  v-show="textShow8"
				  style="top: 900upx;">
					  足部外翻
				  </view>
				  <view class="clickBlock" 
				  @click.native="isonclick(8)" 
				  v-show="!textShow8"
				  style="top: 900upx;">
				  		<view>足部外翻</view>
				  		<view>"紧张肌肉：上斜方肌，肩胛提肌，菱形肌。无力肌肉：中下斜方肌，菱形肌，岗下肌。"</view>
				  </view>
			  </van-col>
			</van-row>
			<van-row>
			  <van-col span="12">
				  <view class="contentLeftBlock" 
				   @click.native="isonclick(9)" 
				   v-show="textShow9"
				   style="top: 820upx;">
					  足部内翻
				  </view>
				  <view class="clickBlock" 
				  @click.native="isonclick(9)" 
				  v-show="!textShow9"
				  style="top: 820upx;">
					  <view>足部内翻</view>
					  <view>紧张肌肉：肩胛提肌，颈伸肌，前斜角肌，头后大直肌，头半棘肌，胸锁乳突形肌。无力肌肉：深层颈屈肌，菱形肌，中下斜方肌，小圆肌，岗下肌。</view>
				  </view>
			  </van-col>
			  <van-col span="12">
				  
			  </van-col>
			</van-row>
			<!-- <van-row 
			v-for="(item,index) in assessmentData" :key="index">
			  <van-col span="12">
				  <view class="contentLeftBlock" @click.native="isonclick(item,1)" v-show="item.textShow1">
					  {{item.title1}}
				  </view>
				  <view class="clickBlock" v-show="!item.textShow1" @click.native="isonclick(item,1)">
					  <view>{{item.title1}}</view>
					  <view>{{item.text1}}</view>
				  </view>
			  </van-col>
			  <van-col span="12">
				  <view class="contentRightBlock" @click.native="isonclick(item,2)" v-show="item.textShow2">
					  {{item.title2}}
				  </view>
				  <view class="clickBlock" v-show="!item.textShow2" @click.native="isonclick(item,2)">
				  		<view>{{item.title2}}</view>
				  		<view>{{item.text2}}</view>
				  </view>
			  </van-col>
			</van-row> -->
			
		</view>
		<view class="contentText">点击标签选择问题部位</view>
		<view>
			<button 
			type="primary"
			class="postureButton">确认</button>
		</view>
	</view>
</template>

<script>
	import BgTheamCompontent from '@/components/bgTheamCompontent/bgTheamCompontent.vue'
	import NavBarCompontent from '@/components/navBarCompontent/navBarCompontent.vue'
	export default {
		data() {
			return {
				c:0,
				bindex:-1, 
				textShow1:true,
				textShow2:true,
				textShow3:true,
				textShow4:true,
				textShow5:true,
				textShow6:true,
				textShow7:true,
				textShow8:true,
				textShow9:true,
				textShow10:true,
				textShow11:true,
				assessmentData:[
					{
						title1: "颈部前引",
						text1: "紧张肌肉：肩胛提肌，颈伸肌，前斜角肌，头后大直肌，头半棘肌，胸锁乳突形肌。无力肌肉：深层颈屈肌，菱形肌，中下斜方肌，小圆肌，岗下肌。",
						textShow1:true,
						title2: "高低肩",
						text2: "紧张肌肉：上斜方肌，肩胛提肌，菱形肌。无力肌肉：中下斜方肌，菱形肌，岗下肌。",
						textShow2:true
					},
					{
						title1: "颈部前引",
						text1: "紧张肌肉：肩胛提肌，颈伸肌，前斜角肌，头后大直肌，头半棘肌，胸锁乳突形肌。无力肌肉：深层颈屈肌，菱形肌，中下斜方肌，小圆肌，岗下肌。",
						textShow1:true,
						title2: "高低肩",
						text2: "紧张肌肉：上斜方肌，肩胛提肌，菱形肌。无力肌肉：中下斜方肌，菱形肌，岗下肌。",
						textShow2:true
					},
					{
						title1: "颈部前引",
						text1: "紧张肌肉：肩胛提肌，颈伸肌，前斜角肌，头后大直肌，头半棘肌，胸锁乳突形肌。无力肌肉：深层颈屈肌，菱形肌，中下斜方肌，小圆肌，岗下肌。",
						textShow1:true,
						title2: "高低肩",
						text2: "紧张肌肉：上斜方肌，肩胛提肌，菱形肌。无力肌肉：中下斜方肌，菱形肌，岗下肌。",
						textShow2:true
					},
					{
						title1: "颈部前引",
						text1: "紧张肌肉：肩胛提肌，颈伸肌，前斜角肌，头后大直肌，头半棘肌，胸锁乳突形肌。无力肌肉：深层颈屈肌，菱形肌，中下斜方肌，小圆肌，岗下肌。",
						textShow1:true
					},
					{
						title1: "颈部前引",
						text1: "紧张肌肉：肩胛提肌，颈伸肌，前斜角肌，头后大直肌，头半棘肌，胸锁乳突形肌。无力肌肉：深层颈屈肌，菱形肌，中下斜方肌，小圆肌，岗下肌。",
						textShow1:true,
						title2: "高低肩",
						text2: "紧张肌肉：上斜方肌，肩胛提肌，菱形肌。无力肌肉：中下斜方肌，菱形肌，岗下肌。",
						textShow2:true
					}
				],
				
			}
		},
		components: {
			BgTheamCompontent,
			NavBarCompontent
		},
		methods: {
			// isonclick(item,a){
			// 	if(a==1){
			// 		if(item.textShow1){
			// 			item.textShow1 = false
			// 		}else{
			// 			item.textShow1 = true
			// 		}
			// 	}else{
			// 		if(item.textShow2){
			// 			item.textShow2 = false
			// 		}else{
			// 			item.textShow2 = true
			// 		}
			// 	}
			// }
			isonclick(a){
				console.log(a);
				switch(a){
					case 1:
						this.textShow1 = !this.textShow1;
						break;
					case 2:
						this.textShow2 = !this.textShow2;
						break;
					case 3:
						this.textShow3 = !this.textShow3;
						break;
					case 4:
						this.textShow4 = !this.textShow4;
						break;
					case 5:
						this.textShow5 = !this.textShow5;
						break;
					case 6:
						this.textShow6 = !this.textShow6;
						break;
					case 7:
						this.textShow7 = !this.textShow7;
						break;
					case 8:
						this.textShow8 = !this.textShow8;
						break;
					case 9:
						this.textShow9 = !this.textShow9;
						break;
				}
				
			}
		}
	}
</script>

<style>
*{
	margin: 0 auto;
}
.content_style{
	width: 100vw;
	height: 100vh;
	overflow: hidden;
	position: relative;
	background: rgba(33, 35, 40, 1);
}
.bgimg{
	width: calc(100vw - 300upx);
	height: 100vh;
	background-image: url('../../static/app-plus/other/postureAssessment.png');
	background-size: 400upx;
	background-repeat: no-repeat;
	margin-top: 88upx;
	margin-left: 180upx;
	margin-right: 192upx;
	opacity: 0.25;
	position: absolute;
}
.content{
	width: calc(100vw - 15upx);
	height: 1280upx;
	margin-top: 42upx;
}
.contentLeftBlock{
	width: 200upx;
	height: 80upx;
	background: #383D46;
	border-radius: 16upx;
	font-size: 26upx;
	font-weight: 600;
	color: #F4F7FF;
	line-height: 80upx;
	text-align: center;
	margin-left: 30upx;
	position: relative;
}
.contentRightBlock{
	width: 200upx;
	height: 80upx;
	background: #383D46;
	border-radius: 16upx;
	font-size: 26upx;
	font-weight: 600;
	color: #F4F7FF;
	line-height: 80upx;
	text-align: center;
	margin-right: 30upx;
	position: relative;
}
.clickBlock{
	width: 280upx;
	background: #1C3965;
	border-radius: 16upx;
	border: 2upx solid #1370FF;
	padding: 20upx;
	margin-left: 30upx;
	position: relative;
}
.clickBlock :first-child{
	font-size: 26upx;
	font-weight: 600;
	color: #F4F7FF;
	line-height: 36upx;
	margin-bottom: 10upx;
}
.clickBlock :last-child{
	font-size: 18upx;
	font-weight: 400;
	color: #FFFFFF;
	line-height: 26upx;
}
.contentText{
	width: 100vw;
	height: 34upx;
	font-size: 24upx;
	font-family: PingFangSC-Regular, PingFang SC;
	font-weight: 400;
	color: #7A7F89;
	line-height: 34upx;
	text-align: center;
	margin-top: 23upx;
}
.postureButton{
	width: calc(100vw - 60upx);
	height: 100upx;
	background: #1370ff;
	border-radius: 16upx;
	margin-left: 30upx;
	margin-top: 40upx;
	line-height: 100upx;
}
</style>
