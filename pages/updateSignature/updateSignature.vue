<template>
	<view class="update-signature">
		<view class="status_bar">
            <!-- 这里是状态栏 -->
        </view>
		<view class="arrow-left" @click="onClickLeft"><van-icon name="arrow-left" /></view>
		<view class="title">修改{{title}}</view>
		<view class="group">
			<view v-if="title==='性别'" class="input" @click="open">
				<text>{{genderName}}</text>
				<van-icon name="arrow" />
			</view>
			<input v-else class="uni-input" type="text" v-model="text" :placeholder="'请输入'+title" />
		</view>
		<view class="footer-button">
			<van-button block @click="updateUserInfo">确认</van-button>
		</view>
		<Mpicker
			mode="bottom"
			:show.sync="sexShow"
			:range="range"
			:rangeKey="'text'"
			@confirm="sexConfirm"
			@cancel="sexShow = false"
			:pickerType="'ordinary'"
			:defaultIndex="0"
		></Mpicker>
	</view>
</template>

<script>
	const My = uniCloud.importObject('my')
	import Mpicker from '../../components/mPicker.vue/mPicker.vue'
	export default {
		components: {
			Mpicker
		},
		data() {
			return {
				title:"签名",
				text: null,
				genderName: null,
				sexShow: false,
				range: [
					{ text: '男', value: '1' },
					{ text: '女', value: '2' }
				],
			}
		},
		onLoad: function (option) {
			if(option.type==='username'){
				this.title = "用户名"
			}
			else if(option.type==='gender'){
				this.title = '性别'
			}
			else if(option.type==='comment'){
				this.title = "签名"
			}
		},
		mounted () {
			this.getUserInfo()
		},
		methods: {
			async getUserInfo(){
				const res = await My.getUserInfo()
				const {username,gender,comment} = res.data
				if(this.title=='用户名'){
					this.text = username || ''
				} else if (this.title=='性别'){
					this.text = gender || null
					if(gender==0){
						this.genderName = '未知'
					}
					else if (gender==1){
						this.genderName = '男'
					}
					else if (gender==2){
						this.genderName = '女'
					} else {
						this.genderName = null
					}
				} else if (this.title=='签名'){
					this.text = comment || null
				}
				console.log(res,88888)
			},
			async updateUserInfo(){
				let key = 'comment'
				if(this.title=='用户名'){
					key = 'username'
				} else if (this.title=='性别'){
					key = 'gender'
				} 
				const res = await My.updateUserInfo({[key]:this.text})
				console.log(res,88)
				this.onClickLeft()
			},
			sexConfirm(e) {
				const val = this.range[e[0]].value
				if(val==='0'){
					this.text = 0
					this.genderName = '未知'
				} else if (val==='1') {
					this.text = 1
					this.genderName = '男'
				} else if (val==='2') {
					this.text = 2
					this.genderName = '女'
				}
				this.sexShow = false
			},
			onClickLeft(){
				// uni.navigateBack()
				uni.reLaunch({url:'/pages/personalInfo/personalInfo'})
			},
			open(){
				this.sexShow = true
			}
		},
		onBackPress(){
			uni.reLaunch({url:'/pages/personalInfo/personalInfo'})
			return true
		}
	}
</script>

<style lang="scss">
.status_bar {
	height: var(--status-bar-height);
	width: 100%;
}
page{
	background: #212328;
}
.update-signature{
	.arrow-left{
		height: 88upx;
		display: flex;
		align-items: center;
		padding-left: 30upx;
		.van-icon{
			font-size: 40upx;
			color: #bdc3ce;
		}
	}
	.title{
		padding: 40upx;
		font-size: 48upx;
		font-weight: 600;
		color: #FFFFFF;
		line-height: 66upx;
	}
	.group{
		padding: 30upx 40upx;
		.input{
			background: rgba(56, 61, 70,.5);
			border-radius: 24upx;
			height: 122upx;
			display: flex;
			align-items: center;
			padding: 0 30upx;
			color: #BDC3CE;
			justify-content: space-between;
		}
		.uni-input{
			background: rgba(56, 61, 70,.5);
			border-radius: 24upx;
			color: #BDC3CE;
			height: 122upx;
			padding: 0 30upx;
			&::placeholder{
				color: #7a7f89;
			}
		}
	}
	.footer-button{
		position: fixed;
		bottom: 68upx;
		left: 0;
		right: 0;
		padding: 0 30upx;
		.van-button{
			background: #454951;
			border-radius: 16upx;
			font-size: 32upx;
			font-weight: 600;
			color: #FFFFFF;
			border: none;
			height: 100upx;
		}
	}
	.select-box{
		padding: 40upx;
		border-radius: 24px 24px 0px 0px;
		background: #212328;
		.list{
			margin: 0 auto;
			padding: 20upx 0;
			width: 690upx;
			background: #383D46;
			border-radius: 16upx;
			.list-item{
				color: #FFFFFF;
				text-align: center;
				line-height: 100upx;
				font-size: 30upx;
			}
		}
		.butn{
			margin: 20upx auto;
			width: 692upx;
			height: 100upx;
			background: #383D46;
			border-radius: 16upx;
			font-size: 32upx;
			font-weight: 600;
			color: #FFFFFF;
			line-height: 100upx;
			text-align: center;
		}
	}
}
</style>
