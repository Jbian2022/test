<template>
  <view class="content_style">
    <BgTheamCompontent :theamType="'currency'"></BgTheamCompontent>
    <van-nav-bar
      title="体态评估"
      left-text=""
      left-arrow
      @click-left="onClickLeft"
      class="nav-bar"
    />
    <view class="listView">
      <view class="listView" style="padding: 0 20px">
        <view>
          <van-row :gutter="20">
            <van-col
              :span="12"
              v-for="(item, index) in fitnessprogram"
              :key="index"
            >
              <view class="listitem">
                <view style="color: white">{{ item.bodyparts }}</view>
                <view style="color: #8d9cb2; font-size: 14upx">{{
                  item.describe
                }}</view>
              </view>
            </van-col>
          </van-row>
        </view>
        <van-button type="primary" class="btn">确认</van-button>
      </view>
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
      ]
    }
  },
  methods: {
    // 返回
    onClickLeft() {
      this.$router.go(-1)
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
.nav-bar {
  position: fixed;
  height: 92upx;
  left: 0;
  right: 0;
  top: 0;
}
.listView {
  background-color: rgba(0, 0, 0, 0.5);
  margin-top: 50upx;
  overflow-y: auto;
}
.listitem {
  margin-top: 92upx;
  background-color: #1c3965;
  margin: 0 0 10upx 0;
  border-radius: 10px;
}

.btn {
  width: calc(100vw - 80upx);
  margin: 0 auto;
  border: none;
}
</style>      