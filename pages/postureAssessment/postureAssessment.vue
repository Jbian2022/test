<template>
	<view class="content_style">
		<BgTheamCompontent :theamType="'currency'"></BgTheamCompontent>
		<NavBarCompontent :leftNavTitle="'体态评估'"></NavBarCompontent>
		<view class="watermark">数据评测来源于世界权威机构</view>
		<view class="bgimg"></view>
		<view class="content">
			<van-row>
			  <van-col span="12">
				  <view class="contentLeftBlock"  
				  @click.native="isonclick(1)" 
				  v-show="textShow1"
				  style="top: 64upx;position: relative;">
					  颈部前引
				  </view>
				  <view class="clickBlock" 
				  @click.native="isonclick(1)" 
				  v-show="!textShow1"
				  style="top: 42upx;position: relative;margin-bottom: -6px;">
					  <view>颈部前引</view>
					  <view>紧张肌肉：肩胛提肌，颈伸肌，前斜角肌，头后大直肌，头半棘肌，胸锁乳突形肌。无力肌肉：深层颈屈肌，菱形肌，中下斜方肌，小圆肌，岗下肌。</view>
				  </view>
			  </van-col>
			  <van-col span="12">
				  <view class="contentRightBlock"
				   @click.native="isonclick(2)" 
				   v-show="textShow2"
				   style="top: 64upx;position: relative;">
					  高低肩
				  </view>
				  <view class="clickBlock" 
				  @click.native="isonclick(2)" 
				  v-show="!textShow2" 
				  style="top: 42upx;position: relative;margin-bottom: -6px;">
				  		<view>高低肩</view>
				  		<view>紧张肌肉：上斜方肌，肩胛提肌，菱形肌。无力肌肉：中下斜方肌，菱形肌，岗下肌。</view>
				  </view>
			  </van-col>
			</van-row>
			<van-row>
			  <van-col span="12">
				  <view class="contentLeftBlock"  
				  @click.native="isonclick(3)" 
				  v-show="textShow3"
				  style="top: 120upx;position: relative;">
					  圆肩
				  </view>
				  <view class="clickBlock" 
				  @click.native="isonclick(3)" 
				  v-show="!textShow3"
				  style="top: 75upx;position: relative;">
					  <view>圆肩</view>
					  <view>紧张肌肉：肩胛提肌，颈伸肌，前斜角肌，头后大直肌，头半棘肌，胸锁乳突形肌。无力肌肉：深层颈屈肌，菱形肌，中下斜方肌，小圆肌，岗下肌。</view>
				  </view>
			  </van-col>
			  <van-col span="12">
				  <view class="contentRightBlock" 
				  @click.native="isonclick(4)" 
				  v-show="textShow4"
				  style="top: 120upx;position: relative;">
					  驼背
				  </view>
				  <view class="clickBlock" 
				  @click.native="isonclick(4)" 
				  v-show="!textShow4"
				  style="top: 80upx;position: relative;">
				  		<view>驼背</view>
				  		<view>紧张肌肉：上斜方肌，肩胛提肌，菱形肌。无力肌肉：中下斜方肌，菱形肌，岗下肌。</view>
				  </view>
			  </van-col>
			</van-row>
			<van-row>
			  <van-col span="12">
				  <view class="contentLeftBlock"  
				  @click.native="isonclick(5)" 
				  v-show="textShow5"
				  style="top: 750upx;">
					  骨盆前倾
				  </view>
				  <view class="clickBlock" 
				  @click.native="isonclick(5)" 
				  v-show="!textShow5"
				  style="top: 750upx;">
					  <view>骨盆前倾</view>
					  <view>紧张肌肉：肩胛提肌，颈伸肌，前斜角肌，头后大直肌，头半棘肌，胸锁乳突形肌。无力肌肉：深层颈屈肌，菱形肌，中下斜方肌，小圆肌，岗下肌。</view>
				  </view>
			  </van-col>
			  <van-col span="12">
				  <view class="contentRightBlock" 
				  @click.native="isonclick(6)" 
				  v-show="textShow6"
				  style="top: 750upx;">
					  骨盆后倾
				  </view>
				  <view class="clickBlock" 
				  @click.native="isonclick(6)" 
				  v-show="!textShow6"
				  style="top: 740upx;">
				  		<view>骨盆后倾</view>
				  		<view>紧张肌肉：上斜方肌，肩胛提肌，菱形肌。无力肌肉：中下斜方肌，菱形肌，岗下肌。</view>
				  </view>
			  </van-col>
			</van-row>
			<van-row>
			  <van-col span="12">
				  <view class="contentLeftBlock"  
				  @click.native="isonclick(7)" 
				  v-show="textShow7"
				  style="top: 1032upx;">
					  膝关节内扣
				  </view>
				  <view class="clickBlock" 
				  @click.native="isonclick(7)" 
				  v-show="!textShow7"
				  style="top: 1000upx;">
					  <view>膝关节内扣</view>
					  <view>紧张肌肉：肩胛提肌，颈伸肌，前斜角肌，头后大直肌，头半棘肌，胸锁乳突形肌。无力肌肉：深层颈屈肌，菱形肌，中下斜方肌，小圆肌，岗下肌。</view>
				  </view>
			  </van-col>
			  <van-col span="12">
				  <view class="contentRightBlock" 
				  @click.native="isonclick(8)" 
				  v-show="textShow8"
				  style="top: 1400upx;">
					  足部外翻
				  </view>
				  <view class="clickBlock" 
				  @click.native="isonclick(8)" 
				  v-show="!textShow8"
				  style="top: 1300upx;">
				  		<view>足部外翻</view>
				  		<view>紧张肌肉：上斜方肌，肩胛提肌，菱形肌。无力肌肉：中下斜方肌，菱形肌，岗下肌。</view>
				  </view>
			  </van-col>
			</van-row>
			<van-row>
			  <van-col span="12">
				  <view class="contentLeftBlock" 
				   @click.native="isonclick(9)" 
				   v-show="textShow9"
				   style="top: 1400upx;">
					  足部内翻
				  </view>
				  <view class="clickBlock" 
				  @click.native="isonclick(9)" 
				  v-show="!textShow9"
				  style="top: 1300upx;">
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
			class="postureButton"  @click.native="backPage()" >确认</button>
		</view>
	</view>
</template>

<script>
	import BgTheamCompontent from '@/components/bgTheamCompontent/bgTheamCompontent.vue'
	import NavBarCompontent from '@/components/navBarCompontent/navBarCompontent.vue'
	const testOb = uniCloud.importObject("testResults",{
		customUI : true
	});
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
						warningMessage:"颈前引对身体的危害:颈椎痛，头晕，压迫颈部神经，手臂酸麻，运动受限，影响形象气质。"
					},
					{
						title2: "高低肩",
						text2: "紧张肌肉：上斜方肌，肩胛提肌，菱形肌。无力肌肉：中下斜方肌，菱形肌，岗下肌。",
						textShow2:true,
						warningMessage:"高低肩对身体危害:颈椎痛，肩周痛，上背部疼痛，运动受限，影响形象气质。"
					},
					{
						title1: "圆肩",
						text1: "紧张肌肉：胸大肌，胸小肌，上斜方肌，肩胛下肌，三角肌前束，大圆肌，肩胛提肌。 无力肌肉：中下斜方肌，菱形肌，三角肌后束，小圆肌，岗下肌。",
						textShow3:true,
						warningMessage:"圆肩对身体的危害:肩周疼痛，上背部疼痛，肩胛骨周边疼痛，运动受限，影响形象气质。"
					},
					{
						title2: "驼背",
						text2: "紧张肌肉：胸大肌，胸小肌，三角肌前束，颈伸肌群，上斜方肌，肩胛提肌，髋关节区肌。 无力肌肉：中下斜方肌，大圆肌，小圆肌，菱形肌，颈屈肌群，髋关节伸肌。",
						textShow4:true,
						warningMessage:"驼背对身体危害:颈椎疼痛，压迫神经，胸椎疼痛，失去胸椎灵活性，呼吸困难，运动受限，影响形象气质。"
					},
					{
						title1: "骨盆前倾",
						text1: "紧张肌肉：肩胛提肌，颈伸肌，前斜角肌，头后大直肌，头半棘肌，胸锁乳突形肌。无力肌肉：深层颈屈肌，菱形肌，中下斜方肌，小圆肌，岗下肌。",
						textShow5:true,
						warningMessage:"骨盆前倾对身体危害:腰部疼痛，髋关节疼痛，髋关节灵活性受限，膝盖稳定不足，膝盖疼痛，运动受限。"
					},
					{
						title2: "骨盆后倾",
						text2: "紧张肌肉：上斜方肌，肩胛提肌，菱形肌。无力肌肉：中下斜方肌，菱形肌，岗下肌。",
						textShow6:true,
						warningMessage:"骨盆后倾对身体危害:腰部疼痛，髋关节疼痛，髋关节灵活性受限，膝盖稳定不足，膝盖疼痛，运动受限。"
					},
					{
						title1: "膝关节内扣",
						text1: "紧张肌肉：肩胛提肌，颈伸肌，前斜角肌，头后大直肌，头半棘肌，胸锁乳突形肌。无力肌肉：深层颈屈肌，菱形肌，中下斜方肌，小圆肌，岗下肌。",
						textShow7:true,
						warningMessage:"膝盖内扣对身体危害:膝关节疼痛，运动受限，影响形象气质。"
					},
					{
						title1: "足部外翻",
						text1: "紧张肌肉：腓骨长肌，腓骨短肌，伸趾长肌。 无力肌肉：胫骨前肌，胫骨短肌，屈趾长肌，屈拇长肌，伸拇长肌。",
						textShow8:true,
						warningMessage:"足外翻对身体危害:足弓塌陷，踝关节疼痛，膝盖代偿疼痛，运动受限。"
					},
					{
						title2: "足部内翻",
						text2: "紧张肌肉：胫骨前肌，胫骨后肌，屈趾长肌，屈拇长肌，伸拇长肌。 无力肌肉：腓骨长肌，腓骨短肌，伸拇长肌。",
						textShow9:true,
						warningMessage:"足内翻对身体危害:踝关节疼痛，容易扭伤，膝盖代偿疼痛，运动受限。"
					}
				],
				assessmentNewData:{},
				traineeNo:'',
				questionCode:''
			}
		},
		components: {
			BgTheamCompontent,
			NavBarCompontent
		},
		onLoad:function(item){
				console.log(item)
				this.traineeNo = item.traineeNo;
				this.questionCode = item.questionCode;
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
						if(!this.textShow1){
							this.assessmentData[0].textShow1 = this.textShow1;
						}
						break;
					case 2:
						this.textShow2 = !this.textShow2;
						if(!this.textShow2){
							this.assessmentData[1].textShow2 = this.textShow2;
						}
						break;
					case 3:
						this.textShow3 = !this.textShow3;
						if(!this.textShow3){
							this.assessmentData[2].textShow3 = this.textShow3;
						}
						break;
					case 4:
						this.textShow4 = !this.textShow4;
						if(!this.textShow4){
							this.assessmentData[3].textShow4 = this.textShow4;
						}
						break;
					case 5:
						this.textShow5 = !this.textShow5;
						if(!this.textShow5){
							this.assessmentData[4].textShow5 = this.textShow5;
						}
						break;
					case 6:
						this.textShow6 = !this.textShow6;
						if(!this.textShow6){
							this.assessmentData[5].textShow6 = this.textShow6;
						}
						break;
					case 7:
						this.textShow7 = !this.textShow7;
						if(!this.textShow7){
							this.assessmentData[6].textShow7 = this.textShow7;
						}
						break;
					case 8:
						this.textShow8 = !this.textShow8;
						if(!this.textShow8){
							this.assessmentData[7].textShow8 = this.textShow8;
						}
						break;
					case 9:
						this.textShow9 = !this.textShow9;
						if(!this.textShow9){
							this.assessmentData[8].textShow9 = this.textShow9;
						}
						break;
				}
				
			},
			backPage(){
				// uni.redirectTo({
				// 	url: '/pages/physicalAssessment/physicalAssessment'
				// })
				console.log(this.assessmentData)
				this.assessmentNewData["postData"] = this.assessmentData;
				this.assessmentNewData["traineeNo"] = this.traineeNo;
				this.assessmentNewData["questionCode"] = this.questionCode;
				this.assessmentNewData["key"] = "posture";
				console.log(this.assessmentNewData);
				const res = testOb.postConfig(this.assessmentNewData,"postureTest").then(res => {
					console.log(res, '我要保存了')
					if (res.success) {
						uni.redirectTo({
							url: '/pages/physicalAssessment/physicalAssessment' +'?traineeNo=' + this.traineeNo + '&questionCode=' + this.questionCode
						})
						uni.showToast({
						  icon: 'success',
						  title: res.message,
						  duration: 800
						})
					}
				}).catch(() =>{})
				console.log(res)
				// uni.showToast({
				//   icon: 'success',
				//   title: res.message,
				//   duration: 800
				// })
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
	opacity: 1.25;
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
	float: left;
	margin-left: 30upx;
	position: absolute;
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
	right: 30upx;
	position: absolute;
}
.clickBlock{
	width: 280upx;
	background: #1C3965;
	border-radius: 16upx;
	border: 2upx solid #1370FF;
	padding: 20upx;
	margin-left: 30upx;
	position: absolute;
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
	font-weight: 600;
	line-height: 100upx;
}
.watermark{
	position: absolute;
	font-size: 24upx;
	font-family: PingFangSC-Regular, PingFang SC;
	font-weight: 400;
	color: #7A7F89;
	top: 90upx;
	right: 30upx;
}
</style>
