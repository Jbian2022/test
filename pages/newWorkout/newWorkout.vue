<template>
	<view class="new-workout">
		<view class="header">
			<view class="title">新建训练</view>
			<van-button class="btn" @click="showFinishDialog = true">完成</van-button>
		</view>
		<view class="workout-title">
			<van-field v-model="workoutName" placeholder="请输入训练名称" />
		</view>
		<view class="action-list">
			<view v-for="(i,ix) in actionList" :key="ix" class="action-type-box">
				<view v-if="i.type===0" class="action-tiem">
					<view class="action-tiem-header">
						<view class="img">
							<van-image round src="../../static/newWorkout/action.png"/>
						</view>
						<view class="des-info">
							<view class="des-title">{{i.actionName}}</view>
							<view class="info-text">
								<text>负荷量：{{i.load}}kg</text>
								<text>已完成：{{i.frequency}}次</text>
							</view>
						</view>
						<popover class="config" :list="actions" position="right" mode="click">
							<van-image class="img"  src="../../static/newWorkout/config.png"/>
							<template  v-slot:item="{item}">
								<text v-if="item.text==='删除动作项'" style="color:#F04242;" @click="deleteActionHandle(ix)">{{item.text}}</text>
								<text v-else>{{item.text}}</text>
							</template>
						</popover>
					</view>
					<view class="action-tiem-des">
						<view v-for="(item,index) in i.groupList" :key="index" class="project-item" :class="{active:item.active}">
							<view class="index">
								<text>{{index+1}}</text>
							</view>
							<view class="kg">
								<van-field v-model="item.kg" placeholder="" type="digit" :disabled="item.active"/>
								<text>kg</text>
							</view>
							<view class="time">
								<van-field v-model="item.time" placeholder="" type="digit" :disabled="item.active"/>
								<text>次</text>
							</view>
							<view class="yes" @click="item.active = !item.active,technicalData()">
								<van-icon name="success" />
							</view>
							<view class="delete">
								<van-image class="img" src="../../static/newWorkout/trashcan.png" @click="deleteProjectItem(i.groupList,index),technicalData()"/>
							</view>
						</view>
						<view class="add-project-item" @click="addProjectItem(i.groupList)">+ 新增一组</view>
					</view>
				</view>
				<view v-if="i.type===1" class="action-tiem">
					<view class="action-tiem-header">
						<view class="img">
							<van-image round src="../../static/newWorkout/action.png"/>
						</view>
						<view class="des-info">
							<view class="des-title">{{i.actionName}}</view>
							<view class="info-text">
								<text>总里程：{{i.mileage}}km</text>
								<text>用时：{{formaterTimes(i.times,2)}}</text>
							</view>
						</view>
						<popover class="config" :list="actions" position="right" mode="click">
							<van-image class="img"  src="../../static/newWorkout/config.png"/>
							<template  v-slot:item="{item}">
								<text v-if="item.text==='删除动作项'" style="color:#F04242;" @click="deleteActionHandle(ix)">{{item.text}}</text>
								<text v-else>{{item.text}}</text>
							</template>
						</popover>
					</view>
					<view class="action-tiem-des">
						<view v-for="(item,index) in i.groupList" :key="index" class="project-item" :class="{active:item.active}">
							<view class="index">
								<text>{{index+1}}</text>
							</view>
							<view class="kg">
								<van-field v-model="item.km" placeholder="" type="digit" @blur="technicalData"/>
								<text>km</text>
							</view>
							<view class="time">
								<van-field v-model="item.hour" placeholder="" type="digit" @blur="technicalData"/>
								<text>时</text>
							</view>
							<view class="time">
								<van-field v-model="item.minute" placeholder="" type="digit" @blur="technicalData"/>
								<text>分</text>
							</view>
							<view class="delete">
								<van-image class="img" src="../../static/newWorkout/trashcan.png" @click="deleteProjectItem(i.groupList,index),technicalData()"/>
							</view>
						</view>
						<view class="add-project-item" @click="addProjectItem(i.groupList)">+ 新增一组</view>
					</view>
				</view>
				<view v-if="i.type===2" class="action-tiem">
					<view class="action-tiem-header">
						<view class="img">
							<van-image round src="../../static/newWorkout/action.png"/>
						</view>
						<view class="des-info">
							<view class="des-title">{{i.actionName}}</view>
							<view class="info-text">
								<text>已完成：{{i.frequency}}次</text>
							</view>
						</view>
						<popover class="config" :list="actions" position="right" mode="click">
							<van-image class="img"  src="../../static/newWorkout/config.png"/>
							<template  v-slot:item="{item}">
								<text v-if="item.text==='删除动作项'" style="color:#F04242;" @click="deleteActionHandle(ix)">{{item.text}}</text>
								<text v-else>{{item.text}}</text>
							</template>
						</popover>
					</view>
					<view class="action-tiem-des">
						<view v-for="(item,index) in i.groupList" :key="index" class="project-item" :class="{active:item.active}">
							<view class="index">
								<text>{{index+1}}</text>
							</view>
							<view class="time">
								<van-field v-model="item.time" placeholder="" type="digit" :disabled="item.active"/>
								<text>次</text>
							</view>
							<view class="yes" @click="item.active = !item.active,technicalData()">
								<van-icon name="success" />
							</view>
							<view class="delete">
								<van-image class="img" src="../../static/newWorkout/trashcan.png" @click="deleteProjectItem(i.groupList,index),technicalData()"/>
							</view>
						</view>
						<view class="add-project-item" @click="addProjectItem(i.groupList),technicalData()">+ 新增一组</view>
					</view>
				</view>
				<view v-if="i.type===3" class="action-tiem">
					<view class="action-tiem-header">
						<view class="img">
							<van-image round src="../../static/newWorkout/action.png"/>
						</view>
						<view class="des-info">
							<view class="des-title">{{i.actionName}}</view>
							<view class="info-text">
								<text>用时：{{formaterTimes(i.times)}}</text>
							</view>
						</view>
						<popover class="config" :list="actions" position="right" mode="click">
							<van-image class="img"  src="../../static/newWorkout/config.png"/>
							<template  v-slot:item="{item}">
								<text v-if="item.text==='删除动作项'" style="color:#F04242;" @click="deleteActionHandle(ix)">{{item.text}}</text>
								<text v-else>{{item.text}}</text>
							</template>
						</popover>
					</view>
					<view class="action-tiem-des">
						<view v-for="(item,index) in i.groupList" :key="index" class="project-item" :class="{active:item.active}">
							<view class="index">
								<text>{{index+1}}</text>
							</view>
							<view class="time">
								<van-field v-model="item.hour" placeholder="" type="digit" @blur="technicalData"/>
								<text>时</text>
							</view>
							<view class="time">
								<van-field v-model="item.minute" placeholder="" type="digit" @blur="technicalData"/>
								<text>分</text>
							</view>
							<view class="time">
								<van-field v-model="item.second" placeholder="" type="digit" @blur="technicalData"/>
								<text>秒</text>
							</view>
							<view class="delete">
								<van-image class="img" src="../../static/newWorkout/trashcan.png"  @click="deleteProjectItem(i.groupList,index),technicalData()"/>
							</view>
						</view>
						<view class="add-project-item" @click="addProjectItem(i.groupList)">+ 新增一组</view>
					</view>
				</view>
				<view v-if="i.type===4" class="action-tiem">
					<view class="action-tiem-header">
						<view class="img">
							<van-image round src="../../static/newWorkout/action.png"/>
						</view>
						<view class="des-info">
							<view class="des-title">{{i.actionName}}</view>
							<view class="info-text">
								<text>负荷量：{{i.load}}kg</text>
								<text>已完成：{{i.frequency}}次</text>
							</view>
						</view>
						<popover class="config" :list="actions" position="right" mode="click">
							<van-image class="img"  src="../../static/newWorkout/config.png"/>
							<template  v-slot:item="{item}">
								<text v-if="item.text==='删除动作项'" style="color:#F04242;" @click="deleteActionHandle(ix)">{{item.text}}</text>
								<text v-else>{{item.text}}</text>
							</template>
						</popover>
					</view>
					<view class="action-tiem-des">
						<view v-for="(item,index) in i.groupList" :key="index" class="project-item" :class="{active:item.active}">
							<view class="index">
								<text>{{index+1}}</text>
							</view>
							<view class="kg">
								<van-field v-model="item.kg" placeholder="" type="digit" :disabled="item.active"/>
								<text>kg</text>
							</view>
							<view class="time">
								<van-field v-model="item.time" placeholder="" type="digit" :disabled="item.active"/>
								<text>次</text>
							</view>
							<view class="yes" @click="item.active = !item.active,technicalData()">
								<van-icon name="success" />
							</view>
							<view class="delete">
								<van-image class="img" src="../../static/newWorkout/trashcan.png" @click="deleteProjectItem(i.groupList,index),technicalData()"/>
							</view>
						</view>
						<view class="add-project-item" @click="addProjectItem(i.groupList)">+ 新增一组</view>
					</view>
				</view>
				<view v-if="i.type===5" class="action-tiem">
					<view class="action-tiem-header">
						<view class="img">
							<van-image round src="../../static/newWorkout/action.png"/>
						</view>
						<view class="des-info">
							<view class="des-title">{{i.actionName}}</view>
							<view class="info-text">
								<text>负荷量：{{i.load}}kg</text>
								<text>已完成：{{i.frequency}}次</text>
							</view>
						</view>
						<popover class="config" :list="actions" position="right" mode="click">
							<van-image class="img"  src="../../static/newWorkout/config.png"/>
							<template  v-slot:item="{item}">
								<text v-if="item.text==='删除动作项'" style="color:#F04242;" @click="deleteActionHandle(ix)">{{item.text}}</text>
								<text v-else>{{item.text}}</text>
							</template>
						</popover>
					</view>
					<view class="weight">
						<van-field v-model="i.weight" placeholder="请先设置当前体重" type="digit" @blur="technicalData"/>
					</view>
					<view class="action-tiem-des">
						<view v-for="(item,index) in i.groupList" :key="index" class="project-item" :class="{active:item.active}">
							<view class="index">
								<text>{{index+1}}</text>
							</view>
							<view class="kg">
								<van-field v-model="item.kg" placeholder="" type="digit" :disabled="item.active"/>
								<text>kg</text>
							</view>
							<view class="time">
								<van-field v-model="item.time" placeholder="" type="digit" :disabled="item.active"/>
								<text>次</text>
							</view>
							<view class="yes" @click="item.active = !item.active,technicalData()">
								<van-icon name="success" />
							</view>
							<view class="delete">
								<van-image class="img" src="../../static/newWorkout/trashcan.png" @click="deleteProjectItem(i.groupList,index),technicalData()"/>
							</view>
						</view>
						<view class="add-project-item" @click="addProjectItem(i.groupList)">+ 新增一组</view>
					</view>
				</view>
				<view v-if="i.type===6" class="action-tiem">
					<view class="action-tiem-header">
						<view class="img">
							<van-image round src="../../static/newWorkout/action.png"/>
						</view>
						<view class="des-info">
							<view class="des-title">{{i.actionName}}</view>
							<view class="info-text">
								<text>总用时：{{formaterTimes(i.times)}}</text>
							</view>
						</view>
						<popover class="config" :list="actions" position="right" mode="click">
							<van-image class="img"  src="../../static/newWorkout/config.png"/>
							<template  v-slot:item="{item}">
								<text v-if="item.text==='删除动作项'" style="color:#F04242;" @click="deleteActionHandle(ix)">{{item.text}}</text>
								<text v-else>{{item.text}}</text>
							</template>
						</popover>
					</view>
					<view class="action-tiem-des">
						<view v-for="(item,index) in i.groupList" :key="index" class="project-item" :class="{active:item.active}">
							<view class="index">
								<text>{{index+1}}</text>
							</view>
							<view class="time">
								<van-field v-model="item.hour" placeholder="" type="digit" @blur="technicalData"/>
								<text>时</text>
							</view>
							<view class="time">
								<van-field v-model="item.minute" placeholder="" type="digit" @blur="technicalData"/>
								<text>分</text>
							</view>
							<view class="time">
								<van-field v-model="item.second" placeholder="" type="digit" @blur="technicalData"/>
								<text>秒</text>
							</view>
							<view class="delete">
								<van-image class="img" src="../../static/newWorkout/trashcan.png" @click="deleteProjectItem(i.groupList,index),technicalData()"/>
							</view>
						</view>
						<view class="add-project-item" @click="addProjectItem(i.groupList)">+ 新增一组</view>
					</view>
				</view>
			</view>
		</view>
		<view class="footer-button">
			<van-button class="delete" @click="showDeleteDialog=true"><van-image class="img" src="../../static/newWorkout/trashcan.png"/></van-button>
			<van-button class="add" @click="addActionHandle">+ 添加动作</van-button>
		</view>
		<van-dialog class="finish-dialog" v-model:show="showFinishDialog" :showConfirmButton="false">
			<view class="first-level-title">完成训练</view>
			<view class="second-level-title">是否已经完成训练了</view>
			<view class="botton-box">
				<van-button class="finish" block @click="finish">确认完成</van-button>
				<van-button block @click="showFinishDialog=false">取消</van-button>
			</view>
		</van-dialog>
		<van-dialog class="delete-dialog" v-model:show="showDeleteDialog" :showConfirmButton="false">
			<view class="first-level-title">删除训练</view>
			<view class="second-level-title">是否删除训练，删除后无法恢复</view>
			<view class="botton-box">
				<van-button class="delete" block @click="deleteHandle">确认删除</van-button>
				<van-button block @click="showDeleteDialog=false">取消</van-button>
			</view>
		</van-dialog>
	</view>
</template>

<script>
	const train = uniCloud.importObject('train')
	import popover from '../../components/popover/index.vue';
	export default {
		components: {
			popover
		},
		data() {
			return {
				workoutName: null,
				actionList:[],
				actions: [
					{ text: '删除动作项'}
				],
				traineeNo:null,
				showFinishDialog: false,
				showDeleteDialog: false,
				isNoOldInfo:false
			}
		},
		onLoad: function (option) { 
			if(option.traineeNo){
				this.traineeNo = option.traineeNo
				this.trainDate = option.trainDate || this.getCurTimestamp()
				this.getOldInfo()
			}
		},
		onShow(){
			try {
				const oldTrainInfoStr = uni.getStorageSync('oldTrainInfo')
				if(oldTrainInfoStr){
					const oldTrainInfo = JSON.parse(oldTrainInfoStr)
					this.actionList = oldTrainInfo.actionList
					this.workoutName = oldTrainInfo.workoutName
					this.traineeNo = oldTrainInfo.traineeNo
					this.isNoOldInfo = oldTrainInfo.isNoOldInfo
					this.trainDate = oldTrainInfo.trainDate
				}
				const actionListStr = uni.getStorageSync('actionList');
				if (actionListStr) {
					const list = JSON.parse(actionListStr)
					const tempList = list.map(item=>{
						return {
							type: item.actionType,
							actionName: item.actionName,
							load: 0,
							times: 0,
							mileage: 0,
							frequency: 0,
							weight: null,
							groupList: []
						}
					})
					this.actionList.push(...tempList)
					// console.log(list);
				}
			} catch (e) {
				// error
			}
		},
		methods: {
			async getOldInfo(){
				const res = await train.getTrainList({traineeNo:this.traineeNo,trainDate:this.trainDate})
				if(res.data&&res.data.length>0){
					const {trainContent,traineeTitle}  = res.data[0]
					this.workoutName = traineeTitle
					this.actionList = JSON.parse(trainContent)
					this.isNoOldInfo = true
				} else {
					this.isNoOldInfo = false
				}
			},
			addActionHandle(){
				uni.setStorageSync('actionLibraryType', 'select')
				uni.setStorageSync('oldTrainInfo', JSON.stringify({
					workoutName:this.workoutName,
					traineeNo:this.traineeNo,
					actionList:this.actionList,
					isNoOldInfo:this.isNoOldInfo,
					trainDate:this.trainDate
				}))
				uni.setStorageSync('traineeNo', this.traineeNo)
				uni.switchTab({
					url: '/pages/actionLibrary/index'
				});
			},
			deleteActionHandle(index){
				this.actionList.splice(index,1)
			},
			deleteProjectItem(list,index){
				list.splice(index,1)
			},
			addProjectItem(list){
				list.push({
					kg: 0,
					km: 0,
					time: 0,
					hour: 0,
					minute: 0,
					second: 0,
					active: false
				})
			},
			async finish(){
				const params = {
					traineeNo:this.traineeNo,
					trainDate: this.trainDate,
					traineeTitle: this.workoutName,
					trainContent: JSON.stringify(this.actionList)
				}
				if(this.isNoOldInfo){
					const res = await train.updateTrainInfo(params)
				} else {
					const res = await train.addTrainInfo(params)
				}
				uni.removeStorageSync('actionList')
				uni.removeStorageSync('oldTrainInfo')
				uni.removeStorageSync('traineeNo')
				uni.switchTab({url:'/pages/myMebers/myMebers'})
			},
			async deleteHandle(){
				const params = {
					traineeNo: this.traineeNo,
					trainDate: this.trainDate
				}
				if(this.isNoOldInfo){
					const res = await train.deleteTrainInfo(params)
				}
				uni.removeStorageSync('actionList')
				uni.removeStorageSync('oldTrainInfo')
				uni.removeStorageSync('traineeNo')
				uni.switchTab({url:'/pages/myMebers/myMebers'})
			},
			getCurTimestamp(){
				const formater = (temp) =>{
				　　if(temp<10){
				　　　　return "0"+temp;
				　　}else{
				　　　　return temp;
				　　}
				}
				const d=new Date();
				const year=d.getFullYear();
				const month=formater(d.getMonth()+1);
				const date=formater(d.getDate());
				return [year,month,date].join('-');
			},
			technicalData(){
				this.actionList.forEach((item)=>{
					if(item.type===0){
						item.load = item.groupList.reduce( function (prev, cur) { 
							if(!cur.kg) {cur.kg = 0}
							return cur.active ? +cur.kg + +prev : prev; 
						}, 0)
						item.frequency = item.groupList.reduce( function (prev, cur) { 
							if(!cur.time) {cur.time = 0}
							return cur.active ? +cur.time + +prev : prev; 
						}, 0)
					} else if(item.type===1){
						item.mileage = item.groupList.reduce( function (prev, cur) {
							if(!cur.km) {cur.km = 0} 
							return  +cur.km + +prev; 
						}, 0)
						item.times = item.groupList.reduce( function (prev, cur) {
							if(!cur.hour) {cur.hour = 0}  
							if(!cur.minute) {cur.minute = 0}  
							if(!cur.second) {cur.second = 0}  
							return (+cur.hour*60*60)+(+cur.minute*60)+ +cur.second + +prev; 
						}, 0)
					} else if(item.type===2){
						item.frequency = item.groupList.reduce( function (prev, cur) { 
							if(!cur.time) {cur.time = 0}
							return cur.active ? +cur.time + +prev : prev; 
						}, 0)
					} else if(item.type===3){
						item.times = item.groupList.reduce( function (prev, cur) {
							if(!cur.hour) {cur.hour = 0}  
							if(!cur.minute) {cur.minute = 0}  
							if(!cur.second) {cur.second = 0}  
							return (+cur.hour*60*60)+(+cur.minute*60)+ +cur.second + +prev; 
						}, 0)
					} else if(item.type===4){
						item.load = item.groupList.reduce( function (prev, cur) { 
							if(!cur.kg) {cur.kg = 0}
							return cur.active ? +cur.kg + +prev : prev; 
						}, 0)
						item.frequency = item.groupList.reduce( function (prev, cur) { 
							if(!cur.time) {cur.time = 0}
							return cur.active ? +cur.time + +prev : prev; 
						}, 0)
					} else if(item.type===5){
						item.load = item.groupList.reduce( function (prev, cur) { 
							if(!cur.kg) {cur.kg = 0}
							return cur.active ? +cur.kg + +prev : prev; 
						}, 0)
						if(item.weight){
							item.load = item.load + +item.weight
						}
						item.frequency = item.groupList.reduce( function (prev, cur) { 
							if(!cur.time) {cur.time = 0}
							return cur.active ? +cur.time + +prev : prev; 
						}, 0)
					} else if(item.type===6){
						item.times = item.groupList.reduce( function (prev, cur) {
							if(!cur.hour) {cur.hour = 0}  
							if(!cur.minute) {cur.minute = 0}  
							if(!cur.second) {cur.second = 0}  
							return (+cur.hour*60*60)+(+cur.minute*60)+ +cur.second + +prev; 
						}, 0)
					}
				})
			},
			formaterTimes(times,type=3){
				const hour = Math.floor(times/3600);
				const minute = Math.floor((times-(hour*3600))/60);
				const second = times-(hour*3600)-(minute*60);
				return  type===3?hour+'时'+minute+'分'+second+'秒':hour+'时'+minute+'分'
			}
		}
	}
</script>

<style lang="scss">
page{
	background: #212328;
}
.new-workout{
	padding-bottom: 168upx;
	.header{
		position: sticky;
		top: 0;
		z-index: 88;
		display: flex;
		justify-content: space-between;
		padding: 30upx;
		font-size: 48upx;
		color: #FFFFFF;
		background: #212328;
		.btn{
			width: 120upx;
			height: 68upx;
			background: #1370FF;
			border-radius: 16upx;
			font-size: 30upx;
			font-weight: 600;
			color: #FFFFFF;
			line-height: 42upx;
			border: none;
		}
	}
	.workout-title{
		position: sticky;
		top: 128upx;
		z-index: 88;
		padding: 0 30upx;
		padding-bottom: 15upx;
		background: #212328;
		.van-field{
			height: 100upx;
			background: #383D46;
			border-radius: 24upx;
			display: flex;
			align-items: center;
			font-size: 30upx;
			font-weight: 400;
			padding-left: 40upx;
			::v-deep .van-field__control{
				color: #F4F7FF;
				padding: 0;
				&::placeholder{
					color:#7A7F89;
				}
			}
		}
	}
	.action-list{
		padding: 30upx;
		padding-top: 15upx;
		.action-tiem{
			padding: 40upx;
			background: #383D46;
			border-radius: 24upx;
			.action-tiem-header{
				position: relative;
				display: flex;
				.img{
					.van-image{
						width: 100upx;
						height: 100upx;
						background: #C7C9CC;
					}
				}
				.des-info{
					margin-left: 30upx;
					.des-title{
						font-size: 30upx;
						font-weight: 600;
						color: #F4F7FF;
						line-height: 42upx;
						margin-bottom: 14upx;
					}
					.info-text{
						width: 380upx;
						font-size: 26upx;
						font-weight: 400;
						color: #BDC3CE;
						line-height: 36upx;
						display: inline-flex;
						justify-content: space-between;
					}
				}
				.config{
					position: absolute;
					right: 0;
					top: 0;
					color: #FFFFFF;
					.img{
						width: 40upx;
						height: 40upx;
					}
				}
			}
			.action-tiem-des{
				margin-top: 50upx;
				.project-item{
					display: flex;
					height: 80upx;
					color: #BDC3CE;
					font-size: 26upx;
					align-items: center;
					.van-field{
						padding: 0;
						background: transparent;
						::v-deep .van-field__control{
							font-size: 36upx;
							font-weight: 500;
							color: #F4F7FF;
							&::placeholder{
								color:#7A7F89;
							}
						}
						&:after{
							display: none;
						}
					}
					&.active{
						.kg,.time,.yes{
							background: #01E08C;
							color: #FFFFFF;
						}
					}
					.index{
						display: flex;
						justify-content: center;
						align-items: center;
						background: #454951;
						height: 100%;
						border-radius: 16upx;
						padding: 0 20upx;
						color: #BDC3CE;
						font-size: 32upx;
						min-width: 60upx;
						box-sizing: border-box;
					}
					.kg,.time{
						height: 100%;
						display: flex;
						justify-content: space-between;
						background: #454951;
						align-items: center;
						border-radius: 16upx;
						margin-left: 24upx;
						padding: 0 20upx;
						width: 140upx;
						box-sizing: border-box;
					}
					.yes{
						height: 100%;
						display: flex;
						justify-content: center;
						background: #454951;
						align-items: center;
						border-radius: 16upx;
						margin-left: 24upx;
						padding: 0 20upx;
						width: 100upx;
						color: #F4F7FF;
						box-sizing: border-box;
					}
					.delete{
						flex: 1;
						text-align: right;
						.img{
							width: 40upx;
							height: 40upx;
						}
					}
				}
				.project-item + .project-item{
					margin-top: 20upx;
				}
			}
			.weight{
				margin-top: 15upx;
				margin-bottom: -15upx;
				.van-field{
					height: 80upx;
					background: #454951;
					border-radius: 16upx;
					::v-deep .van-field__control{
						text-align: center;
						font-size: 26upx;
						font-weight: 400;
						color: #F4F7FF;
						&::placeholder{
							color:#BDC3CE;
						}
					}
					&:after{
						display: none;
					}
				}
			}
		}
		.action-type-box + .action-type-box{
			margin-top: 30upx;
		}
		.add-project-item{
			margin-top: 40upx;
			font-size: 30upx;
			font-weight: 500;
			color: #FFFFFF;
			text-align: center;
		}
	}
	.footer-button{
		position: fixed;
		padding: 68upx 30upx;
		padding-top: 30upx;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 1;
		background: #212328;
		.delete{
			background: #454951;
			height: 100upx;
			width: 100upx;
			border-radius: 100%;
			font-size: 32upx;
			font-weight: 600;
			color: #FFFFFF;
			border: none;
			padding: 0;
			.img{
				width: 40upx;
				height: 40upx;
			}
			&+.van-button{
				margin-left: 20upx;
			}
		}
		.add{
			height: 100upx;
			width: 570upx;
			background: #454951;
			border-radius: 16upx;
			border: none;
			font-size: 32upx;
			font-weight: 600;
			color: #FFFFFF;
		}
	}
	::v-deep .van-dialog{
		background: linear-gradient(180deg, #343A44 0%, #212328 100%);
		width: 610upx;
		height: 800upx;
		.first-level-title{
			padding-left: 70upx;
			padding-top: 64upx;
			font-size: 88upx;
			color: #F4F7FF;
			line-height: 124upx;
		}
		.second-level-title{
			padding-top: 20upx;
			padding-left: 70upx;
			padding-bottom: 310upx;
			font-size: 30upx;
			font-weight: 400;
			color: #BDC3CE;
		}
		.botton-box{
			padding: 0 70upx;
			.van-button{
				border: none;
				background: transparent;
				font-size: 32upx;
				font-weight: 600;
				border-radius: 16upx;
				color: #BDC3CE;
			}
		}
	}
	::v-deep .finish-dialog{
		background-image: url('../../static/newWorkout/training completed.png');
		background-size: contain;
		.van-button.finish{
			background: #1370FF !important;
			color: #FFFFFF !important;
		}
	}
	::v-deep .delete-dialog{
		background-image: url('../../static/newWorkout/training delete.png');
		background-size: contain;
		.van-button.delete{
			background: #F04242 !important;
			color: #FFFFFF !important;
		}
	}
}
</style>
