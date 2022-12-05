<template>
	<view class="update-signature">
		<view class="arrow-left" @click="onClickLeft"><van-icon name="arrow-left" /></view>
		<view class="title">修改{{title}}</view>
		<van-cell-group class="form" inset>
			<van-field  v-if="title==='性别'" class="input"  v-model="genderName"  is-link  readonly  name="picker"  placeholder="点击选择性别" @click="showPicker = true"/>
			<van-field v-else class="input" v-model="text" :placeholder="'请输入'+title"/>
		</van-cell-group>
		<view class="footer-button">
			<van-button block @click="updateUserInfo">确认</van-button>
		</view>
		<van-action-sheet
			v-model:show="showPicker"
			:actions="columns"
			close-on-click-action
			@select="selectHandle"
		/>
	</view>
</template>

<script>
	const My = uniCloud.importObject('my')
	export default {
		data() {
			return {
				title:"签名",
				text: null,
				genderName: null,
				showPicker: false,
				columns:[
					{ name: '未知', value: 0 },
					{ name: '男', value: 1 },
					{ name: '女', value: 2 }
				]
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
			selectHandle(val){
				if(val.name==='未知'){
					this.text = 0
					this.genderName = '未知'
				} else if (val.name==='男') {
					this.text = 1
					this.genderName = '男'
				} else if (val.name==='女') {
					this.text = 2
					this.genderName = '女'
				}
			},
			onClickLeft(){
				// uni.navigateBack()
				uni.navigateTo({url:'/pages/personalInfo/personalInfo'})
			}
		}
	}
</script>

<style lang="scss">
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
	.form{
		background: rgba(56, 61, 70,.5);
		border-radius: 24upx;
		.input{
			align-items: center;
			background: transparent;
			padding: 0 30upx;
		}
	}
	::v-deep .van-field__control{
		height: 122upx;
		background: transparent;
		font-size: 30upx;
		color: #BDC3CE;
		line-height: 122upx;
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
	::v-deep .van-popup{
		padding: 30upx;
		background: #212328;
		border-radius: 0;
		box-sizing: border-box;
		.van-action-sheet__gap{
			background: transparent;
		}
		.van-action-sheet__content,.van-action-sheet__cancel{
			border-radius: 16upx;
			background: #454951;
			color: #FFFFFF;
		}
		.van-action-sheet__item{
			background: #454951;
			color: #FFFFFF;
		}
	}
}
</style>
