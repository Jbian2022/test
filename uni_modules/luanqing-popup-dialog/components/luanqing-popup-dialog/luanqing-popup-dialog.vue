<template>
	<view class="pop-dialog" v-if="showDialog" >
		<!-- 三角形  如果要定制的话，从这里找到css triangle进行修改 -->
		<view class="triangle" ></view>
		<view class="pop-body" :style="'background-color:'+bgColor+';'">
			<view v-for="(item,index) in menuList" v-bind:key="index" class="pop-item" @click="onClickPopMenu(item)">
				<view class="uni_flex_row_align_left" style="height: 100rpx;width: 100%;">
					<image class="pop-img" :src="item.icon" v-if="item.icon"></image>
					<text class="uni_16px_400_colorfff" style="margin-left: 40rpx;" :style="'color:'+textColor+';'">{{item.name}}</text>
				</view>
				<view :class="item.icon?'pop-line':'pop-line-full'" :style="'background-color:'+lineColor+';'" v-if="index < menuList.length - 1"></view>
			</view>
		</view>
	</view>  
</template>

<script>
	export default{
		props:{
			textColor:{
				type:String,
				default: '#ffffff'
			},
			bgColor:{
				type:String,
				default: '#4B4B4B'
			},
			lineColor:{
				type:String,
				default: '#6C6C6C'
			},
			isShow:{
				type: Boolean,
				default: false
			},
			list:{
				type:Array,
				default: ()=>{
					return []
				}
			},
			top:{
				type:Number,
				default:0
			},
			left:{
				type:Number,
				default:0
			},
			right:{
				type:Number,
				default:0
			},
			triangleMarginRight:{
				type:Number,
				default: 24
			}
		},
		data(){
			return {
				showDialog:false,
				menuList:[],
				topPosition:0,
				rightPosition:0,
				leftPosition:0
			}
		},
		watch:{
			isShow:{
				immediate:true,
				handler:async function (newVal,oldVal){
					this.showDialog = newVal;
				}
			},
			list:{
				immediate:true,
				handler:async function (newVal,oldVal){
					this.menuList = newVal;
				}
			},
			top:{
				immediate:true,
				handler:async function (newVal,oldVal){
					this.topPosition = newVal;
				}
			},
			left:{
				immediate:true,
				handler:async function (newVal,oldVal){
					this.leftPosition = newVal;
				}
			},
			right:{
				immediate:true,
				handler:async function (newVal,oldVal){
					this.rightPosition = newVal;
				}
			},
		},
		methods:{
			onClickPopMenu(item){
				this.$emit('onClickPopupItem',item);
			}
		}
	}
</script>

<style>
	
.pop-dialog{
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	justify-content: center;
	z-index: 99;
	position: absolute;
}

.triangle {
    width: 0;
    height: 0;
    border-right: 25rpx solid transparent;
    border-left: 25rpx solid transparent;
}

.pop-body{
	border-radius: 10px;
	width: 288rpx;
}

.pop-item{
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	justify-content: center;
}

.pop-line-full{
	width: 288rpx;
	height: 2rpx;
}
.pop-line{
	width: 166rpx;
	height: 2rpx;
}

.pop-img{
	width: 48rpx;
	height: 48rpx;
	margin-left: 40rpx;
}
</style>
