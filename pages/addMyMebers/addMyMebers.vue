<template>
	<view class="content_style">
		 <BgTheamCompontent :theamType="'currency'"></BgTheamCompontent>
<!-- 		 <van-nav-bar
		   title=""
		   left-text="添加学员"
		   left-arrow
		   @click-left="onClickLeft"
		 /> -->
		 <view class="contetnt_form_style">
			 <van-form @submit="onSubmit">
			   <van-cell-group inset>
			     <van-field
			       v-model="username"
			       name="用户名"
			       label="用户名"
			       placeholder="用户名"
				  
			       :rules="[{ required: true, message: '请填写用户名' }]"
			     />
			   </van-cell-group>
			   <van-cell-group inset>
			     <van-field
			       v-model="username"
			       name="用户名"
			       label="用户名"
			       placeholder="用户名"
			   				  
			       :rules="[{ required: true, message: '请填写用户名' }]"
			     />
			    
			   </van-cell-group>
			   
			   <div style="margin: 16px;">
			     <van-button round block type="primary" native-type="submit">
			       提交
			     </van-button>
			   </div>
			 </van-form>
		 </view>
		
	</view>
</template>

<script>
	import BgTheamCompontent from '@/components/bgTheamCompontent/bgTheamCompontent.vue'
	export default {
		components: {
			BgTheamCompontent
		},
		data() {
			return {
				
			};
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

</style>
