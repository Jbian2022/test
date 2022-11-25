<template>
  <view class="content_style">
    <BgTheamCompontent :theamType="'currency'"></BgTheamCompontent>
    <NavBarCompontent :leftNavTitle="'体态评估'"></NavBarCompontent>
	<view class="waterfall_flow_style">
		
		 <view style="padding: 0 10upx;">
		        <custom-waterfalls-flow ref="waterfallsFlowRef" :value="data.list" :column="column" :columnSpace="2" :seat="1" @wapperClick="wapperClick" @loaded="loaded">
		  
		            <template v-slot:default="item">
		                <view class="item">
		                    <view class="title">{{item.title}}</view>
		                    <view class="desc">{{item.desc}}</view>
		                </view>
		            </template>
		        </custom-waterfalls-flow>
		    </view>
	
	</view>
 

  </view>
</template>

<script>
import BgTheamCompontent from '@/components/bgTheamCompontent/bgTheamCompontent.vue'
import NavBarCompontent from '@/components/navBarCompontent/navBarCompontent.vue'
// import XgWaterfall from '../../uni_modules/xg-waterfall/components/xg-waterfall/xg-waterfall.vue'
import CustomWaterfallsFlow from '../../uni_modules/custom-waterfalls-flow/components/custom-waterfalls-flow/custom-waterfalls-flow.vue'

export default {
  components: {
    BgTheamCompontent,
	NavBarCompontent,
	CustomWaterfallsFlow
  },
  data() {
    return {
      fitnessprogram: [
        {
          bodyparts: '颈部前引',
          describe:
            '紧张肌肉：肩胛提肌，颈伸肌，前斜角肌，头后大直肌，头半棘肌，胸锁乳突形肌。 无力肌肉：深层颈屈肌，菱形肌，中下斜方肌，小圆肌，岗下肌。'
        },
        {
          bodyparts: '高低肩',
          describe:
            '紧张肌肉：上斜方肌，肩胛提肌，菱形肌。 无力肌肉：中下斜方肌，菱形肌，岗下肌。'
        },
        {
          bodyparts: '圆肩',
          describe:
            '紧张肌肉：胸大肌，胸小肌，上斜方肌，肩胛下肌，三角肌前束，大圆肌，肩胛提肌。无力肌肉：中下斜方肌，菱形肌，三角肌后束，小圆肌，岗下肌。'
        },
        {
          bodyparts: '翼状肩胛',
          describe:
            '紧张肌肉：菱形肌，肩胛提肌，上斜方肌，胸小肌。无力肌肉：前锯肌，菱形肌，中下斜方肌。'
        },
        {
          bodyparts: '骨盆前倾',
          describe:
            '髂腰肌，股直肌，腹直肌，缝匠肌，阔筋膜张肌，长收肌，短收肌，竖脊肌。无力肌肉：腹直肌，臀大肌，股二头肌，半腱肌，半膜肌，大收肌。'
        },
        {
          bodyparts: '驼背',
          describe:
            '紧张肌肉：胸大肌，胸小肌，三角肌前束，颈伸肌群，上斜方肌，肩胛提肌，髋关节区肌。无力肌肉：中下斜方肌，大圆肌，小圆肌，菱形肌，颈屈肌群，髋关节伸肌。'
        },
        {
          bodyparts: '膝关节内扣',
          describe:
            '紧张肌肉：大收肌，短内收肌，长内收肌，股薄肌，趾骨肌肉：臀大肌，梨状肌，臀中肌，股四头内侧头。'
        },
        {
          bodyparts: '骨盆后倾',
          describe:
            '紧张肌肉：腹直肌，臀大肌，股二头肌，半腱肌，半膜肌，大收肌。无力肌肉：髂腰肌，股直肌，缝匠肌，阔筋膜张肌，长收肌，短收肌，竖脊肌。'
        },
        {
          bodyparts: '足部内翻',
          describe:
            '紧张肌肉：胫骨前肌，胫骨后肌，屈趾长肌，屈拇长肌，伸拇长肌无力肌肉：腓骨长肌，腓骨短肌，伸拇长肌。'
        },
        {
          bodyparts: '足部外翻',
          describe:
            '紧张肌肉：胫骨前肌，胫骨后肌，屈趾长肌，屈拇长肌，伸拇长肌无力肌肉：腓骨长肌，腓骨短肌，伸拇长肌。'
        }
      ],
	  data: {
	                      list: [{  image: 'https://via.placeholder.com/200x200.png/2878ff',title: '我是标题1', desc: '描述描述描述描述描述描述描述描述1' }, 
	                      { image: 'https://via.placeholder.com/200x200.png/2878ff', title: '我是标题2', desc: '描述描述描述描述描述描述描述描述2' }, 
	                      { image: 'https://via.placeholder.com/200x100.png/FFB6C1', title: '我是标题3', desc: '描述描述描述描述描述描述描述描述3' }, 
	                      { image: 'https://via.placeholder.com/200x300.png/9400D3', title: '我是标题4', desc: '描述描述描述描述描述描述描述描述4' }, 
	                      { image: 'https://via.placeholder.com/100x240.png/B0E0E6', title: '我是标题5', desc: '描述描述描述描述描述描述描述描述5' }, 
	                      { image: 'https://via.placeholder.com/140x280.png/7FFFAA', title: '我是标题6', desc: '描述描述描述描述描述描述描述描述6' }, 
	                      { image: 'https://via.placeholder.com/40x60.png/EEE8AA', title: '我是标题7', desc: '描述描述描述描述描述描述描述描述7' }]
	                  },
	                  column: 2
    }
  },
  methods: {
    // 返回
    onClickLeft() {
      this.$router.go(-1)
    },
	            add() {
	                const newArr = [{ image: 'https://via.placeholder.com/58x100.png/FF7F50', title: '我是标题8', desc: '描述描述描述描述描述描述描述描述8' }, 
	                { image: 'https://via.placeholder.com/59x100.png/C0C0C0', title: '我是标题9', desc: '描述描述描述描述描述描述描述描述9' }, 
	                { image: 'https://via.placeholder.com/60x100.png/FAEBD7', title: '我是标题10', desc: '描述描述描述描述描述描述描述描述10' }]
	                this.data.list = this.data.list.concat(newArr);
	            },
	            changeColumn(h) {
	                this.column = !h ? this.column - 1 : this.column + 1;
	            },
	            loaded() {
	                console.log('加载完成')
	            },
	            wapperClick(item) {
	                console.log('单项点击事件', item)
	            },
	            imageClick(item) {
	                console.log('图片点击事件', item)
	            },
	            reset() {
	                this.data.list = [{ image: 'https://via.placeholder.com/200x500.png/ff0000', title: '我是标题1', desc: '描述描述描述描述描述描述描述描述1' }]
	                this.$refs.waterfallsFlowRef.refresh();
	            }
  }
}
</script>

<style lang="scss">
.content_style {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
}

::v-deep .waterfalls-flow-column {
	width: calc((100% - 90upx) / 2) !important;
	margin-left: 30upx !important;
	margin-top: 52upx;
}
::v-deep.column-value {
	// width: calc((100% - 90upx) / 2);
	height:auto;
	background: #1C3965 !important;
	border-radius: 16px;
	border: 2px solid #1370FF;
	.inner {
		width: 100%;
		.item {
			box-sizing: border-box;
			width: 100%;
			padding: 20upx;
			.title {
				font-size: 26upx;
				font-family: PingFangSC-Semibold, PingFang SC;
				font-weight: 600;
				color: #F4F7FF;
			}
			.desc {
				padding-top: 10upx;
				font-size: 18upx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				 color: #a8adb6;
			}
		}
	}
}


	.water_inner_style {
		
		
	}


.btn {
  width: calc(100vw - 80upx);
  margin: 0 auto;
  border: none;
}
</style>      