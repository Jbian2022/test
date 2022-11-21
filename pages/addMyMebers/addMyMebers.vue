<template>
	<view class="content_style">
		 <BgTheamCompontent :theamType="'currency'"></BgTheamCompontent>
		<NavBarCompontent :leftNavTitle="'添加学员'" ></NavBarCompontent>
		 
		 <view class="contetnt_form_style">
			 <van-form @submit="onSubmit">
			   <van-cell-group inset>
			     <van-field
			       v-model="studentForm.userName"
			       name="userName"
			       label="真实姓名(必填)"
			       placeholder="请填写姓名"
				  
			       :rules="[{ required: true, message: '请填写真实姓名' }]"
			     />
			   </van-cell-group>
			   <van-cell-group inset>
				<van-field
				  v-model="studentForm.sex"
				  is-link
				  readonly
				  name="picker"
				  label="性别(必填)"
				  placeholder="请选择性别"
				  @click="showPicker = true"
				/>
				<van-popup v-model:show="showPicker" position="bottom">
				  <van-picker
					:columns="columns"
					@confirm="onConfirm"
					@cancel="showPicker = false"
				  />
				</van-popup>
			    
			   </van-cell-group>
			   <van-cell-group inset>
					<van-field
					  v-model="studentForm.sex"
					  is-link
					  readonly
					  name="picker"
					  label="生日(必填)"
					  placeholder="请选择生日"
					  @click="dateShowpicker = true"
					/>
					<van-popup v-model:show="dateShowpicker" position="bottom">
						<van-datetime-picker
						  v-model="currentDate"
						  type="date"
						  title="选择年月日"
						  :min-date="minDate"
						  :max-date="maxDate"
						  @confirm="onConfirm"
						  @cancel="dateShowpicker = false"
						/>
					</van-popup>
			    
			   </van-cell-group>
			   <van-cell-group inset>
				 <van-field
				   v-model="studentForm.userName"
				   name="userName"
				   label="手机号码(必填)"
				   placeholder="请填写手机号码"
				  
				   :rules="[{ required: true, message: '请填写手机号码' }]"
				 />
			   </van-cell-group>
			   <van-cell-group inset>
				<view class="is_buy_content_style van-cell">
					<text class="buy_text_style">是否已购课</text>
					<view class="is_buy_style">
						<view class="buy_left" :class="isActive === 'n' ? 'active' : ''" @click.native="buyClick('n')">无</view>
						<view class="buy_right" :class="isActive === 'y' ? 'active' : ''" @click.native="buyClick('y')">有</view>
					</view>
				</view>
			   </van-cell-group>
			   
			   
<!-- 			   <div style="margin: 16px;">
			     <van-button round block type="primary" native-type="submit">
			       提交
			     </van-button>
			   </div> -->
			   <view class="add_method_style">
				   <view class="add_left_style" >直接添加</view>
				    <view class="add_right_style" @click.native="jumpPhysical">身体评测并添加</view>
			   </view>
			 </van-form>
		 </view>
		
	</view>
</template>

<script>
	import BgTheamCompontent from '@/components/bgTheamCompontent/bgTheamCompontent.vue'
	import NavBarCompontent from '@/components/navBarCompontent/navBarCompontent.vue'
	export default {
		components: {
			BgTheamCompontent,
			NavBarCompontent
		},
		data() {
			 
			return {
				studentForm: {
					userName: '',
					sex: ''
				},
				columns: ['男','女'],
				showPicker: false,
				  minDate: new Date(2020, 0, 1),
				  maxDate: new Date(2025, 10, 1),
				  currentDate: new Date(2021, 0, 18),
				  dateShowpicker: false,
				  isActive: 'n'
			};
		},
		methods: {
			onConfirm() {
				
			},
			onSubmit() {
				
			},
			buyClick(type) {
				this.isActive = type
				
			},
			jumpPhysical() {
				uni.navigateTo({
					url: '/pages/physicalAssessment/physicalAssessment'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.van-hairline--bottom:after {
  border-bottom-width: 0;
   border-bottom-color: #212328;
} 

	::v-deep.van-nav-bar__content {
		background: #212328;
		border: none;
		height: 88upx;
		box-sizing: border-box;

		
	}
	::v-deep.van-nav-bar .van-icon {
		color: #fff;
	}
	::v-deep.van-nav-bar .van-nav-bar__text {
		color: #fff !important;
	}
	.content_style {
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		position: relative;
		.contetnt_form_style {
			width: 100%;
			margin-top: 30upx;
			
			
		}
	}
	
	::v-deep.van-cell {
		display: flex;
		flex-direction: column;
		background: #383D46 !important;
		position: relative;
		border-bottom-width: 0 !important;
		
		.van-cell__title {
			width: 100% !important;
			color: #F4F7FF !important;
			label {
				font-size: 30upx;
				color: #F4F7FF !important;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				
			}
		}
		.van-cell__value {
			margin-top: 40upx;
			display: flex;
			flex-wrap: nowrap;
			border-bottom-width: 0 !important;
		.van-field__body {
			.van-field__control {
				color: #F4F7FF !important;
			}
			input {
				color: #F4F7FF !important;
			}
		}
			
		}
		i {
			position: absolute;
			right: 30upx;
			top: 120upx;
			
		}
	}
	::v-deep.van-cell:after {
		border-bottom: none;
	}
	::v-deep.van-cell-group {
		background: #383D46 !important;
		margin-top: 30upx;
		border-bottom-width: 0 !important;
		
	}
	.is_buy_content_style {
		width: 100%;
		height: 140upx;
		display: flex;
		flex-direction: row !important; 
		align-items: center;
		justify-content: space-between;
		.buy_text_style {
			font-size: 30upx;
			color: #F4F7FF !important;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			
		}
		.is_buy_style {
			display: flex;
			align-items: center;
			width: 176upx;
			.buy_left {
					   width: 50%;
					   height: 100%;
					   text-align: center;
					   background: linear-gradient(180deg, #343A44 0%, #212328 100%);
					  line-height: 82upx;
					  color: #A8ADB6;
					  
				
						border-radius: 16upx 0px 0px 16upx;
						
			}
			.buy_right {
					   width: 50%;
					   height: 100%;
					   color: #A8ADB6;
					line-height: 88upx;
					 text-align: center;
					   background: linear-gradient(180deg, #343A44 0%, #212328 100%);
					   border-radius: 0px 16upx   16upx 0px;
			}
			.active {
					   background: #1370FF;
					   color: #fff;
			}
			
		}
		
	}

.add_method_style {
	width: calc(100vw - 60upx);
	margin-left: 30upx;
	margin-top: 30upx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	.add_left_style {
		width: calc(50% - 15upx);
		height: 100upx;
		font-size: 32upx;
		font-family: PingFangSC-Semibold, PingFang SC;
		font-weight: 600;
		color: #FFFFFF;
		background: #454951;
		border-radius: 16upx;
		z-index: 88;
		text-align: center;
		line-height: 100upx;
	}
	.add_right_style {
		width: calc(50% - 15upx);
		height: 100upx;
		font-size: 32upx;
		font-family: PingFangSC-Semibold, PingFang SC;
		font-weight: 600;
		color: #FFFFFF;
		background: #1370FF;
		border-radius: 16upx;
		z-index: 88;
		text-align: center;
		line-height: 100upx;
		
	}
}
</style>
