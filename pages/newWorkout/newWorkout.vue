<template>
	<view class="new-workout">
		<view class="background-header"></view>
		<view class="background"></view>
		<view class="status_bar"> <!-- 这里是状态栏 --> </view>
		<view class="header">
			<view class="title">新建训练</view>
			<view>
				<van-button :class="isShowSave&&isShowSuccess?'btn save':'bluecss btn save'" v-if="isShowSave" @click="finish('save')">暂存</van-button>
				<van-button class="btn" v-if="isShowSave&&isShowSuccess" @click="openDialog('popupFinish')">完成训练</van-button>
			</view>
		</view>
		<view class="workout-title">
			<input v-model="workoutName" maxlength="8" class="uni-input" placeholder="请输入训练名称" />
		</view>
		<view class="action-list">
			<view v-for="(i,ix) in actionList" :key="ix" class="action-type-box">
				<view v-if="i.type===0" class="action-tiem" @click="changeOpen(i)">
					<view class="action-tiem-header">
						<view class="img">
							<image class="van-image" v-if="i.url" round :src="i.url"/>
						</view>
						<view class="des-info">
							<view class="des-title">{{i.actionName}}</view>
							<view class="info-text">
								<text>负荷量：{{i.load}}kg</text>
								<text>已完成：{{i.frequency}}次</text>
							</view>
						</view>
						<popover class="config" :list="actions" position="right" mode="click">
							<view class="img"></view>
							<template  v-slot:item="{item}">
								<text v-if="item.text==='删除动作项'" style="color:#F04242;" @click="deleteActionHandle(ix)">{{item.text}}</text>
								<text v-else>{{item.text}}</text>
							</template>
						</popover>
					</view>
					<view v-show="i.open" class="action-tiem-des">
						<view v-for="(item,index) in i.groupList" :key="index" class="project-item" :class="{active:item.active}">
							<view class="index">
								<text>{{index+1}}</text>
							</view>
							<view class="kg">
								<input v-model="item.kg" class="uni-input" type="number" :disabled="item.active"/>
								<text>kg</text>
							</view>
							<view class="time">
								<input v-model="item.time" class="uni-input" type="number" :disabled="item.active"/>
								<text>次</text>
							</view>
							<view class="yes" @click="item.active = !item.active,technicalData()">
								<view class="true-icon"></view>
							</view>
							<view class="delete">
								<view class="img" @click="deleteProjectItem(i.groupList,index),technicalData()"></view>
							</view>
						</view>
						<view class="add-project-item" @click="addProjectItem(i.groupList)"><text class="add-text">+</text> 新增一组</view>
					</view>
				</view>
				<view v-if="i.type===1" class="action-tiem" @click="changeOpen(i)">
					<view class="action-tiem-header">
						<view class="img" >
							<image class="van-image" v-if="i.url" round :src="i.url"/>
						</view>
						<view class="des-info" >
							<view class="des-title">{{i.actionName}}</view>
							<view class="info-text">
								<text>总里程：{{i.mileage}}km</text>
								<text>用时：{{formaterTimes(i.times,2)}}</text>
							</view>
						</view>
						<popover class="config" :list="actions" position="right" mode="click">
							<view class="img"></view>
							<template  v-slot:item="{item}">
								<text v-if="item.text==='删除动作项'" style="color:#F04242;" @click="deleteActionHandle(ix)">{{item.text}}</text>
								<text v-else>{{item.text}}</text>
							</template>
						</popover>
					</view>
					<view v-show="i.open" class="action-tiem-des">
						<view v-for="(item,index) in i.groupList" :key="index" class="project-item" :class="{active:item.active}">
							<view class="index">
								<text>{{index+1}}</text>
							</view>
							<view class="kg">
								<input v-model="item.km" class="uni-input" type="number" @blur="technicalData"/>
								<text>km</text>
							</view>
							<view class="time">
								<input v-model="item.hour" class="uni-input" type="number" @blur="technicalData"/>
								<text>时</text>
							</view>
							<view class="time">
								<input v-model="item.minute" class="uni-input" type="number" @blur="technicalData"/>
								<text>分</text>
							</view>
							<view class="delete">
								<view class="img" @click="deleteProjectItem(i.groupList,index),technicalData()"></view>
							</view>
						</view>
						<view class="add-project-item" @click="addProjectItem(i.groupList)"><text class="add-text">+</text> 新增一组</view>
					</view>
				</view>
				<view v-if="i.type===2" class="action-tiem" @click="changeOpen(i)">
					<view class="action-tiem-header">
						<view class="img" >
							<image class="van-image" round :src="i.url"/>
						</view>
						<view class="des-info" >
							<view class="des-title">{{i.actionName}}</view>
							<view class="info-text">
								<text>已完成：{{i.frequency}}次</text>
							</view>
						</view>
						<popover class="config" :list="actions" position="right" mode="click">
							<view class="img"></view>
							<template  v-slot:item="{item}">
								<text v-if="item.text==='删除动作项'" style="color:#F04242;" @click="deleteActionHandle(ix)">{{item.text}}</text>
								<text v-else>{{item.text}}</text>
							</template>
						</popover>
					</view>
					<view v-show="i.open" class="action-tiem-des">
						<view v-for="(item,index) in i.groupList" :key="index" class="project-item" :class="{active:item.active}">
							<view class="index">
								<text>{{index+1}}</text>
							</view>
							<view class="time">
								<input v-model="item.time" class="uni-input" type="number" :disabled="item.active"/>
								<text>次</text>
							</view>
							<view class="yes" @click="item.active = !item.active,technicalData()">
								<view class="true-icon"></view>
							</view>
							<view class="delete">
								<view class="img" @click="deleteProjectItem(i.groupList,index),technicalData()"></view>
							</view>
						</view>
						<view class="add-project-item" @click="addProjectItem(i.groupList),technicalData()"><text class="add-text">+</text> 新增一组</view>
					</view>
				</view>
				<view v-if="i.type===3" class="action-tiem" @click="changeOpen(i)">
					<view class="action-tiem-header">
						<view class="img" >
							<image class="van-image" round :src="i.url"/>
						</view>
						<view class="des-info" >
							<view class="des-title">{{i.actionName}}</view>
							<view class="info-text">
								<text>用时：{{formaterTimes(i.times)}}</text>
							</view>
						</view>
						<popover class="config" :list="actions" position="right" mode="click">
							<view class="img"></view>
							<template  v-slot:item="{item}">
								<text v-if="item.text==='删除动作项'" style="color:#F04242;" @click="deleteActionHandle(ix)">{{item.text}}</text>
								<text v-else>{{item.text}}</text>
							</template>
						</popover>
					</view>
					<view v-show="i.open" class="action-tiem-des">
						<view v-for="(item,index) in i.groupList" :key="index" class="project-item" :class="{active:item.active}">
							<view class="index">
								<text>{{index+1}}</text>
							</view>
							<view class="time">
								<input v-model="item.hour" class="uni-input" type="number" @blur="technicalData"/>
								<text>时</text>
							</view>
							<view class="time">
								<input v-model="item.minute" class="uni-input" type="number" @blur="technicalData"/>
								<text>分</text>
							</view>
							<view class="time">
								<input v-model="item.second" class="uni-input" type="number" @blur="technicalData"/>
								<text>秒</text>
							</view>
							<view class="delete">
								<view class="img" @click="deleteProjectItem(i.groupList,index),technicalData()"></view>
							</view>
						</view>
						<view class="add-project-item" @click="addProjectItem(i.groupList)"><text class="add-text">+</text> 新增一组</view>
					</view>
				</view>
				<view v-if="i.type===4" class="action-tiem" @click="changeOpen(i)">
					<view class="action-tiem-header">
						<view class="img" >
							<image class="van-image" round :src="i.url"/>
						</view>
						<view class="des-info" >
							<view class="des-title">{{i.actionName}}</view>
							<view class="info-text">
								<text>负荷量：{{i.load}}kg</text>
								<text>已完成：{{i.frequency}}次</text>
							</view>
						</view>
						<popover class="config" :list="actions" position="right" mode="click">
							<view class="img"></view>
							<template  v-slot:item="{item}">
								<text v-if="item.text==='删除动作项'" style="color:#F04242;" @click="deleteActionHandle(ix)">{{item.text}}</text>
								<text v-else>{{item.text}}</text>
							</template>
						</popover>
					</view>
					<view v-show="i.open" class="action-tiem-des">
						<view v-for="(item,index) in i.groupList" :key="index" class="project-item" :class="{active:item.active}">
							<view class="index">
								<text>{{index+1}}</text>
							</view>
							<view class="kg">
								<input v-model="item.kg" class="uni-input" type="number" :disabled="item.active"/>
								<text>kg</text>
							</view>
							<view class="time">
								<input v-model="item.time" class="uni-input" type="number" :disabled="item.active"/>
								<text>次</text>
							</view>
							<view class="yes" @click="item.active = !item.active,technicalData()">
								<view class="true-icon"></view>
							</view>
							<view class="delete">
								<view class="img" @click="deleteProjectItem(i.groupList,index),technicalData()"></view>
							</view>
						</view>
						<view class="add-project-item" @click="addProjectItem(i.groupList)"><text class="add-text">+</text> 新增一组</view>
					</view>
				</view>
				<view v-if="i.type===5" class="action-tiem" @click="changeOpen(i)">
					<view class="action-tiem-header">
						<view class="img" >
							<image class="van-image" round :src="i.url"/>
						</view>
						<view class="des-info" >
							<view class="des-title">{{i.actionName}}</view>
							<view class="info-text">
								<text>负荷量：{{i.load}}kg</text>
								<text>已完成：{{i.frequency}}次</text>
							</view>
						</view>
						<popover class="config" :list="actions" position="right" mode="click">
							<view class="img"></view>
							<template  v-slot:item="{item}">
								<text v-if="item.text==='删除动作项'" style="color:#F04242;" @click="deleteActionHandle(ix)">{{item.text}}</text>
								<text v-else>{{item.text}}</text>
							</template>
						</popover>
					</view>
					<view class="weight">
						<input v-model="i.weight" class="uni-input" type="number" placeholder="请先设置当前体重" @blur="technicalData"/>
					</view>
					<view v-show="i.open" class="action-tiem-des">
						<view v-for="(item,index) in i.groupList" :key="index" class="project-item" :class="{active:item.active}">
							<view class="index">
								<text>{{index+1}}</text>
							</view>
							<view class="kg">
								<input v-model="item.kg" class="uni-input" type="number" :disabled="item.active"/>
								<text>kg</text>
							</view>
							<view class="time">
								<input v-model="item.time" class="uni-input" type="number" :disabled="item.active"/>
								<text>次</text>
							</view>
							<view class="yes" @click="item.active = !item.active,technicalData()">
								<view class="true-icon"></view>
							</view>
							<view class="delete">
								<view class="img" @click="deleteProjectItem(i.groupList,index),technicalData()"></view>
							</view>
						</view>
						<view class="add-project-item" @click="addProjectItem(i.groupList)"><text class="add-text">+</text> 新增一组</view>
					</view>
				</view>
				<view v-if="i.type===6" class="action-tiem" @click="changeOpen(i)">
					<view class="action-tiem-header">
						<view class="img" >
							<image class="van-image" round :src="i.url"/>
						</view>
						<view class="des-info" >
							<view class="des-title">{{i.actionName}}</view>
							<view class="info-text">
								<text>总用时：{{formaterTimes(i.times)}}</text>
							</view>
						</view>
						<popover class="config" :list="actions" position="right" mode="click">
							<view class="img"></view>
							<template  v-slot:item="{item}">
								<text v-if="item.text==='删除动作项'" style="color:#F04242;" @click="deleteActionHandle(ix)">{{item.text}}</text>
								<text v-else>{{item.text}}</text>
							</template>
						</popover>
					</view>
					<view v-show="i.open" class="action-tiem-des">
						<view v-for="(item,index) in i.groupList" :key="index" class="project-item" :class="{active:item.active}">
							<view class="index">
								<text>{{index+1}}</text>
							</view>
							<view class="time">
								<input v-model="item.hour" class="uni-input" type="number"  @blur="technicalData"/>
								<text>时</text>
							</view>
							<view class="time">
								<input v-model="item.minute" class="uni-input" type="number"  @blur="technicalData"/>
								<text>分</text>
							</view>
							<view class="time">
								<input v-model="item.second" class="uni-input" type="number"  @blur="technicalData"/>
								<text>秒</text>
							</view>
							<view class="delete">
								<view class="img" @click="deleteProjectItem(i.groupList,index),technicalData()"></view>
							</view>
						</view>
						<view class="add-project-item" @click="addProjectItem(i.groupList)"><text class="add-text">+</text> 新增一组</view>
					</view>
				</view>
			</view>
		</view>
		<view class="footer-button">
			<van-button class="delete" @click="openDialog('popupDelete')">
				<view class="img"></view>
			</van-button>
			<van-button block class="add" @click="addActionHandle">+ 添加动作</van-button>
		</view>
		<uni-popup ref="popupFinish" type="center" mask-background-color="rgba(20, 21, 23, 0.6)">
			<view class="finish-dialog">
				<view class="first-level-title">完成训练</view>
				<view class="second-level-title">是否已经完成训练了</view>
				<view class="botton-box">
					<van-button class="finish" block @click="finish('success')">确认完成</van-button>
					<van-button block @click="closeDialog('popupFinish')">取消</van-button>
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="popupDelete" type="center" mask-background-color="rgba(20, 21, 23, 0.6)">
			<view class="delete-dialog">
				<view class="first-level-title">删除训练</view>
				<view class="second-level-title">是否删除训练，删除后无法恢复</view>
				<view class="botton-box">
					<van-button class="delete" block @click="deleteHandle">确认删除</van-button>
					<van-button block @click="closeDialog('popupDelete')">取消</van-button>
				</view>
			</view>
		</uni-popup>
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
				isNoOldInfo:false,
				mode: 'ADD',
				allWork: null
			}
		},
		onLoad: function (option) { 
			if(option.traineeNo){
				this.traineeNo = option.traineeNo
				this.traineeName = option.traineeName
				this.key = option.key || null
				this.trainDate = option.trainDate || this.getCurTimestamp()
				this.getOldInfo()
			}
		},
		onHide(){
			if(this.mode==='ADD'){
				uni.setStorageSync('oldTrainInfo', JSON.stringify({
					workoutName:this.workoutName,
					traineeNo:this.traineeNo,
					isNoOldInfo:this.isNoOldInfo,
					trainDate:this.trainDate,
					traineeName:this.traineeName,
					key: this.key,
					allWork: this.allWork
				}))
				uni.setStorageSync('actionList', JSON.stringify(this.actionList))
			}
		},
		onShow(){
			try {
				this.mode='ADD'
				const oldTrainInfoStr = uni.getStorageSync('oldTrainInfo')
				if(oldTrainInfoStr){
					const oldTrainInfo = JSON.parse(oldTrainInfoStr)
					this.workoutName = oldTrainInfo.workoutName
					this.traineeNo = oldTrainInfo.traineeNo
					this.isNoOldInfo = oldTrainInfo.isNoOldInfo
					this.trainDate = oldTrainInfo.trainDate
					this.traineeName = oldTrainInfo.traineeName
					this.key = oldTrainInfo.key
					this.allWork = oldTrainInfo.allWork
				}
				const actionListStr = uni.getStorageSync('actionList');
				if (actionListStr) {
					this.actionList = JSON.parse(actionListStr)
				}
			} catch (e) {
				// error
			}
		},
		methods: {
			changeOpen(item){
				this.actionList.forEach(item=>item.open=false)
				item.open = true
			},
			async getOldInfo(){
				const res = await train.getTrainList({traineeNo:this.traineeNo,trainDate:this.trainDate})
				if(res.data&&res.data.length>0){
					this.isNoOldInfo = true
					const {trainContent}  = res.data[0]
					const list = JSON.parse(trainContent) || []
					if(list&&list.length>0){
						this.allWork = list
						if(list[this.key]){
							this.workoutName = list[this.key].traineeTitle
							const actionList = list[this.key].data || []
							actionList.forEach((item,i)=>{
								if(i>0){
									item.open = false
								} else {
									item.open = true
								}
							})
							this.actionList = actionList
						}
					}
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
					trainDate:this.trainDate,
					traineeName:this.traineeName,
					key: this.key,
					allWork: this.allWork
				}))
				uni.setStorageSync('actionList', JSON.stringify(this.actionList))
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
					kg: null,
					km: null,
					time: null,
					hour: null,
					minute: null,
					second: null,
					active: false
				})
			},
			async finish(traineeStatus){
				if(!this.actionList||this.actionList.length===0){
					return uni.showToast({icon:'error', title: '请添加动作', duration: 2000});
				}
				if(!this.workoutName){
					this.workoutName = this.actionList[0].actionClassName
				}
				if(this.key){
					this.allWork[this.key] = {
						traineeTitle: this.workoutName,
						traineeStatus: traineeStatus,
						data:this.actionList
					}
				} else {
					if(this.allWork&&this.allWork.length>0){
						this.allWork.push({
							traineeTitle: this.workoutName,
							traineeStatus: traineeStatus,
							data: this.actionList
						})
					} else {
						this.allWork = [{
							traineeTitle: this.workoutName,
							traineeStatus: traineeStatus,
							data: this.actionList
						}]
					}
				}
				const params = {
					traineeNo:this.traineeNo,
					trainDate: this.trainDate,
					trainContent: JSON.stringify(this.allWork)
				}
				if(this.allWork&&this.allWork.length>1||this.key||this.isNoOldInfo){
					const res = await train.updateTrainInfo(params)
				} else {
					const res = await train.addTrainInfo(params)
				}
				if(traineeStatus==='save'){
					uni.showToast({icon:'none', title: '暂存成功', duration: 2000});
				}
				this.mode='DELETE'
				uni.removeStorageSync('actionList')
				uni.removeStorageSync('oldTrainInfo')
				uni.removeStorageSync('actionLibrary')
				const timer = setTimeout(()=>{
					uni.reLaunch({
						url:
						'/pages/trainingRecord/trainingRecord' +
						`?traineeNo=${this.traineeNo}&memberName=${this.traineeName}`
					})
					clearTimeout(timer)
				},1000)
				
			},
			async deleteHandle(){
				this.mode='DELETE'
				if(this.key){
					this.allWork.splice(this.key,1)
					const params = {
						traineeNo:this.traineeNo,
						trainDate: this.trainDate,
						trainContent: JSON.stringify(this.allWork)
					}
					const res = await train.updateTrainInfo(params)
				}
				uni.removeStorageSync('actionList')
				uni.removeStorageSync('oldTrainInfo')
				uni.removeStorageSync('actionLibrary')
				uni.reLaunch({
					url:
					'/pages/trainingRecord/trainingRecord' +
					`?traineeNo=${this.traineeNo}&memberName=${this.traineeName}`
				})
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
							if(!cur.kg||!cur.time) {
								return cur.active ? 0 + +prev : prev; 
							} else {
								return cur.active ? (cur.kg*cur.time) + +prev : prev; 
							}
						}, 0)
						item.frequency = item.groupList.reduce( function (prev, cur) { 
							if(!cur.time) {
								return cur.active ? 0 + +prev : prev; 
							} else {
								return cur.active ? +cur.time + +prev : prev; 
							}
						}, 0)
					} else if(item.type===1){
						item.mileage = item.groupList.reduce( function (prev, cur) {
							if(!cur.km) {
								return  0 + +prev; 
							} else {
								return  +cur.km + +prev; 
							}
						}, 0)
						item.times = item.groupList.reduce( function (prev, cur) {
							if(!cur.hour||!cur.minute||!cur.second) {
								return 0 + +prev;
							} else {
								return (+cur.hour*60*60)+(+cur.minute*60)+ +cur.second + +prev; 
							}
						}, 0)
					} else if(item.type===2){
						item.frequency = item.groupList.reduce( function (prev, cur) { 
							if(!cur.time) {
								return cur.active ? 0 + +prev : prev; 
							} else {
								return cur.active ? +cur.time + +prev : prev; 
							}
						}, 0)
					} else if(item.type===3){
						item.times = item.groupList.reduce( function (prev, cur) {
							if(!cur.hour||!cur.minute||!cur.second) {
								return 0 + +prev;
							} else {
								return (+cur.hour*60*60)+(+cur.minute*60)+ +cur.second + +prev; 
							}
						}, 0)
					} else if(item.type===4){
						item.load = item.groupList.reduce( function (prev, cur) { 
							if(!cur.kg||!cur.time) {
								return cur.active ? 0 + +prev : prev;
							} else {
								return cur.active ? (cur.kg*cur.time) + +prev : prev; 
							}
						}, 0)
						item.frequency = item.groupList.reduce( function (prev, cur) { 
							if(!cur.time) {
								return cur.active ? 0 + +prev : prev; 
							} else {
								return cur.active ? +cur.time + +prev : prev; 
							}
						}, 0)
					} else if(item.type===5){
						item.load = item.groupList.reduce( function (prev, cur) { 
							if(!cur.kg||!cur.time) {
								return cur.active ? 0 + +prev : prev; 
							} else {
								if(item.weight){
									return cur.active ? ((+cur.kg + +item.weight)*cur.time) + +prev : prev;
								} else {
									return cur.active ? (cur.kg*cur.time) + +prev : prev; 
								}
							}
						}, 0)
						item.frequency = item.groupList.reduce( function (prev, cur) { 
							if(!cur.time) {
								return cur.active ? 0 + +prev : prev; 
							} else {
								return cur.active ? +cur.time + +prev : prev; 
							}
						}, 0)
					} else if(item.type===6){
						item.times = item.groupList.reduce( function (prev, cur) {
							if(!cur.hour||!cur.minute||!cur.second) {
								return 0 + +prev;
							} else {
								return (+cur.hour*60*60)+(+cur.minute*60)+ +cur.second + +prev; 
							} 
						}, 0)
					}
				})
			},
			formaterTimes(times,type=3){
				const hour = Math.floor(times/3600);
				const minute = Math.floor((times-(hour*3600))/60);
				const second = times-(hour*3600)-(minute*60);
				return  type===3?hour+'时'+minute+'分'+second+'秒':hour+'时'+minute+'分'
			},
			openDialog(key){
				this.$refs[key].open()
			},
			closeDialog(key){
				this.$refs[key].close()
			}
		},
		onBackPress(){
			if(this.workoutName&&this.actionList.length>0){
				this.openDialog('popupFinish')
			} else {
				this.openDialog('popupDelete')
			}
			return true
		},
		computed: {
			isShowSave(){
				return this.actionList&&this.actionList.length>0
			},
			isShowSuccess(){
				return +new Date() >= +new Date(this.trainDate)
			}
		}
	}
</script>

<style lang="scss">
.background-header{
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	z-index: -1;
	height: 460upx;
	background: linear-gradient(to bottom, rgba(52, 58, 68, 1), #212328);
}
.background{
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	z-index: -2;
	height: 100vh;
	background: #212328;
}
.status_bar {
	height: var(--status-bar-height);
	width: 100%;
}
.new-workout{
	position: relative;
	padding-bottom: 175upx;
	.header{
		height: 126upx;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 30upx;
		font-size: 48upx;
		color: #FFFFFF;
		background: transparent;
		.title {
			font-weight: 600;
		}
		.btn{
			padding: 0 30upx;
			height: 68upx;
			background: #1370FF;
			border-radius: 16upx;
			font-size: 30upx;
			font-weight: 600;
			color: #FFFFFF;
			line-height: 42upx;
			border: none;
		}
		.save {
			margin-right: 20upx;
			background: #4B525E;
		}
	}
	.workout-title{
		height: 130upx;
		box-sizing: border-box;
		padding: 0 30upx;
		padding-bottom: 30upx;
		background: transparent;
		.uni-input{
			height: 100upx;
			background: #383D46;
			border-radius: 24upx;
			font-size: 30upx;
			font-weight: 400;
			color: #F4F7FF;
			padding-left: 40upx;
			&::placeholder{
				color:#7A7F89;
			}
		}
	}
	.action-list{
		height: calc(100vh - 462upx - var(--status-bar-height));
		overflow-y: auto;
		padding: 30upx;
		padding-top: 0;
		.action-tiem{
			padding: 40upx;
			background: #383D46;
			border-radius: 24upx;
			.action-tiem-header{
				position: relative;
				display: flex;
				.img{
					width: 100upx;
					height: 100upx;
					background: url('../../static/newWorkout/action.png');
					background-size: contain;
					background-repeat: no-repeat;
					.van-image{
						width: 100%;
						height: 100%;
						border-radius: 100%;
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
						width: 32upx;
						height: 32upx;
						background: url('../../static/newWorkout/config.png');
						background-size: contain;
						background-repeat: no-repeat;
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
					.uni-input{
						padding: 0;
						background: transparent;
						font-size: 36upx;
						font-weight: 600;
						color: #F4F7FF;
						&::placeholder{
							color:#7A7F89;
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
						.true-icon{
							width: 32upx;
							height: 32upx;
							background: url('../../static/newWorkout/true.png');
							background-size: contain;
							background-repeat: no-repeat;
						}
					}
					.delete{
						flex: 1;
						text-align: right;
						.img{
							display: inline-block;
							width: 32upx;
							height: 32upx;
							background: url('../../static/newWorkout/trashcan.png');
							background-size: contain;
							background-repeat: no-repeat;
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
				.uni-input{
					height: 80upx;
					background: #454951;
					border-radius: 16upx;
					text-align: center;
					font-size: 26upx;
					font-weight: 400;
					color: #F4F7FF;
					&::placeholder{
						color:#BDC3CE;
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
			font-weight: 600;
			color: #FFFFFF;
			text-align: center;
			.add-text{
				font-size: 34upx;
				font-weight: 600;
			}
		}
	}
	.footer-button{
		height: 160upx;
		overflow: hidden;
		box-sizing: border-box;
		position: fixed;
		padding: 30upx;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 1;
		background: #212328;
		display: flex;
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
				width: 32upx;
				height: 32upx;
				background: url('../../static/newWorkout/trashcan.png');
				background-size: contain;
				background-repeat: no-repeat;
			}
			&+.van-button{
				margin-left: 20upx;
			}
		}
		.add{
			flex: 1;
			height: 100upx;
			background: #454951;
			border-radius: 16upx;
			border: none;
			font-size: 32upx;
			font-weight: 600;
			color: #FFFFFF;
		}
	}
	::v-deep .uni-popup [name="mask"]{
		backdrop-filter: blur(3px);
	}
	::v-deep .finish-dialog,
	::v-deep .delete-dialog
	{
		background: linear-gradient(180deg, #343A44 0%, #212328 100%);
		width: 610upx;
		height: 800upx;
		.first-level-title{
			padding-left: 70upx;
			padding-top: 64upx;
			font-size: 88upx;
			color: #F4F7FF;
			line-height: 124upx;
			font-weight: 600;
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
				height: 100upx;
				background: transparent;
				font-size: 32upx;
				font-weight: 600;
				border-radius: 16upx;
				color: #BDC3CE;
				margin-bottom: 8upx;
				&::after{
					display: none;
				}
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
	.bluecss{
		background: #1370FF !important;
	}
}
</style>
