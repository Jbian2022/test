<template>
	<view class="personal-info">
		<view class="status_bar">
            <!-- 这里是状态栏 -->
        </view>
		<view class="arrow-left" @click="onClickLeft"><van-icon name="arrow-left" /></view>
		<view class="header">
			<view class="user-name" @click="updateSignature('username')">{{userInfo.username||''}}</view>
			<view class="user-logo" @click="show=true">
				<van-image class="img" round :src="userInfo.avatar"/>
			</view>
		</view>
		<view class="form">
			<view class="form-content">
				<van-cell title="性别" :value="userInfo.gender" is-link @click="updateSignature('gender')" />
				<van-cell title="签名" :value="userInfo.comment" is-link @click="updateSignature('comment')"/>
			</view>
		</view>
		<van-action-sheet
			v-model:show="show"
			:actions="actions"
			cancel-text="取消"
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
				show:false,
				actions :[
					{ name: '拍照上传' },
					{ name: '本地上传' }
				],
				userInfo: {
					username: '',
					avatar: null,
					gender: null,
					comment: null
				}
			}
		},
		mounted () {
			this.getUserInfo()
		},
		methods: {
			async getUserInfo(){
				const res = await My.getUserInfo()
				const {avatar,username,gender,comment} = res.data
				this.userInfo = {
					avatar:avatar||null,
					username:username||'用户名',
					gender:gender===0?'未知':gender===1?'男':gender===2?'女':null,
					comment
				}
				console.log(res,88888)
			},
			onClickLeft(){
				// uni.navigateBack()
				uni.switchTab({
					url: '/pages/my/my'
				});
			},
			updateSignature(type){
				uni.navigateTo({
					url: '/pages/updateSignature/updateSignature?type='+type
				});
			},
			selectHandle(val){
				if(val.name==='拍照上传'){
					this.uploadImage('camera')
				} else if (val.name==='本地上传') {
					this.uploadImage('album')
				}
			},
			uploadImage(sourceType){
				const success = async (res) =>{
					if(res.tempFiles&&res.tempFiles.length>0){
						const result = await uniCloud.uploadFile({
							cloudPath: Date.now() + "-" + res.tempFiles[0].name,
							filePath: res.tempFilePaths[0]
						});
						const res1 = await My.updateUserInfo({
							avatar: result.fileID
						})
						this.getUserInfo()
						console.log(res1)
					}
				}
				const fail = () =>{

				}
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					extension: ['jpg','jpeg','png'],
					sourceType:[sourceType],
					success,
					fail
				})
			}
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
.personal-info{
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
	.header{
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 40upx 60upx 40upx 40upx;
		.user-name{
			font-size: 48upx;
			font-weight: 600;
			color: #FFFFFF;
			&::after{
				margin-left: 20upx;
				content: '';
				width: 32upx;
				height: 32upx;
				display: inline-block;
				background-image: url('../../static/newWorkout/edit.png');
				background-size: contain;
			}
		}
		.user-logo{
			.img{
				width: 120upx;
				height: 120upx;
			}
		}
	}
	.form{
		padding: 0 40upx;
		.form-content{
			background: rgba(56, 61, 70, .5);;
			border-radius: 24upx;
			overflow: hidden;
			.van-cell {
				height: 112upx;
				background: transparent;
				align-items: center;
				::v-deep .van-cell__title{
					font-size: 30upx;
					color: #BDC3CE;
				}
				::v-deep .van-cell__value{
					font-size: 30upx;
					color: #BDC3CE;
				}
				::v-deep .van-icon{
					color: #bdc3ce;
				}
				&:after{
					border: none;
				}
			}
		}
	}
	::v-deep .van-popup{
		padding: 30upx;
		background: transparent;
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
