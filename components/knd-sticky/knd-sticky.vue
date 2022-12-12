<!-- sticky组件
 1.通过stickyTop 设置stickyTop （目前只支持Number，单位为px）
 2.需要在父组件的onPageScroll中调用this.$refs['sticky'].pageScroll(e)
 3.可以通过在父组件中@info获取本组件的元素高度
 -->
<template>
	<view>
		<view :style="{top:stickyTopPlus+'px'}" :class="[{sticky}]" class="component">
			<slot></slot>
		</view>
		<!-- 这里是用来占位置的,防止元素固定时页面下滑 -->
		<view :style="{height:height + 'px'}" v-show="sticky" class="component">

		</view>
	</view>

</template>

<script>
	export default {
		props: {
			stickyTop: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				sticky: false,
				fixedTop: 0,
				height: 0
			};
		},
		computed: {
			stickyTopPlus() {
				//#ifdef H5
				return this.stickyTop + 45
				//#endif
				return this.stickyTop
			}
		},
		methods: {
			pageScroll(e) {
				let scrollTop = e.scrollTop;
				const selector = uni.createSelectorQuery().in(this); //在这个组件内查询
				selector.select('.component').boundingClientRect().exec((res) => {
					let elementTop = res[0].top;
					if (this.fixedTop && this.fixedTop >= scrollTop) { //如果已经记录了位置
						this.sticky = false;
						this.fixedTop = 0
					}
					if (elementTop < 0 + this.stickyTop && !this.sticky) {
						this.sticky = true
						this.fixedTop = scrollTop; //记录是滚动到哪个位置固定的
					}
				})
			},

		},
		mounted() {
			const selector = uni.createSelectorQuery().in(this); //在这个组件内查询
			selector.select('.component').boundingClientRect().exec((res) => {
				this.height = res[0].height
				this.$emit('info', this.height)
			})
		}
	}
</script>

<style lang="scss" scoped>
	.component {
		position: static;
		background: blue;
		width: 100%;
	}

	.sticky {
		position: fixed;
		top: 0;
		//h5需要距离导航栏一定高度防止被遮挡
		/* #ifdef H5 */
		top: 45px;
		/*  #endif */
	}
</style>
