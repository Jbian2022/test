<template>
  <view class="counter content_style">
    <BgTheamCompontent :theamType="'currency'"></BgTheamCompontent>
    <!-- 返回图标 -->
    <view class="nav_style">
      <view class="nav_left_style" @click.native="goBack">
        <image
          class="back_img_style"
          src="../../static/app-plus/mebrs/back.svg"
        ></image>
      </view>
      <view class="nav_text" @click.native.stop="jump">跳过</view>
    </view>
    <view class="botter">
      <span class="botter-top">个人信息完善</span>
      <p class="a-i-c">完善信息后方可进行学员管理</p>
    </view>

    <view class="contetnt_form_style">
      <uni-forms :modelValue="coachForm" ref="coachForm" label-position="left">
        <uni-forms-item
          class="outer_form_item_style"
          :label="'姓名'"
          name="nickname"
        >
          <input
            type="text"
            clas="change_input_style"
            v-model="coachForm.nickname"
            placeholder="请输入真实姓名"
            maxlength="7"
            style="margin-top: 6px"
          />
        </uni-forms-item>
        <uni-forms-item
          class="outer_form_item_style"
          :label="'性别(必填)'"
          name="gender"
        >
          <Mpicker
            mode="bottom"
            :show.sync="sexShow"
            :range="range"
            :rangeKey="'text'"
            @confirm="sexConfirm"
            @cancel="sexCancel"
            :pickerType="'ordinary'"
            :defaultIndex="0"
          ></Mpicker>
          <view class="change_picker_style" @click.stop="openDialog">
            <view
              class="label_style"
              :class="coachForm.gender ? '' : 'student_label_style'"
              >{{ !coachForm.gender ? '请选择性别' : genderLabel }}</view
            >
            <image
              class="back_img_style"
              src="../../static/app-plus/mebrs/back.svg"
            ></image>
          </view>
        </uni-forms-item>
      </uni-forms>
    </view>
    <view
      class="add_method_style edit_save_style"
      :class="coachForm.gender || coachForm.nickname ? 'active' : ''"
      @click.native="savePersonInfo"
    >
      保存
    </view>
  </view>
</template>

<script>
import BgTheamCompontent from '../../components/bgTheamCompontent/bgTheamCompontent.vue'
import Mpicker from '../../components/mPicker.vue/mPicker.vue'
const login = uniCloud.importObject('login', {
  customUI: true // 取消自动展示的交互提示界面
}) //第一步导入云对象
export default {
  data() {
    return {
      coachForm: {
        nickname: '',
        gender: ''
      },
      sexShow: false,

      range: [
        { text: '男', value: '1' },
        { text: '女', value: '2' }
      ],
      mobile: ''
    }
  },
  onLoad(options) {
    this.mobile = options.mobile || ''
    // 校验验证码
  },
  components: {
    BgTheamCompontent,
    Mpicker
  },
  computed: {
    genderLabel() {
      let label = ''
      let findData = this.range.find(
        (item) => item.value === this.coachForm.gender
      )
      if (findData) {
        label = findData.text || ''
      }
      return label
    }
  },
  methods: {
    goBack() {
      uni.navigateBack()
    },
    jump() {
      try {
        let param = {
          avatar:
            'https://mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3.cdn.bspapp.com/cloudstorage/65a7d49a-7fb3-4c1a-9bea-9d5e6b074fad.png',
          nickname: this.mobile
            ? this.mobile.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2')
            : ''
        }

        console.log(param, 'param')
        login
          .perfectInfo(param)
          .then((res) => {
            if (res.success) {
              uni.reLaunch({
                url: '/pages/myMebers/myMebers'
              })
            }
          })
          .catch((err) => {})
      } catch (e) {
        //TODO handle the exception
      }
    },
    savePersonInfo() {
      console.log('1111')
      if (this.coachForm.nickname || this.coachForm.gender) {
        try {
          let param = {
            nickname:
              this.coachForm.nickname ||
              this.mobile.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2'),
            gender: this.coachForm.gender,
            avatar:
              'https://mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3.cdn.bspapp.com/cloudstorage/65a7d49a-7fb3-4c1a-9bea-9d5e6b074fad.png'
          }

          console.log(param, 'param')
          login
            .perfectInfo(param)
            .then((res) => {
              if (res.success) {
                this.jump()
              }
            })
            .catch((err) => {})
        } catch (e) {
          //TODO handle the exception
        }
      }
    },
    openDialog() {
      this.sexShow = true
    },
    sexConfirm(e) {
      this.coachForm.gender = this.range[e[0]].value
      this.sexShow = false
    },
    sexCancel() {
      this.sexShow = false
    }
  }
}
</script>

<style  lang="scss" scoped>
.content_style {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  .contetnt_form_style {
    width: 100%;
    flex: 1;
    margin-top: 30upx;
    overflow-y: auto;
  }
}

// 性别
::v-deep.van-field__control {
  font-size: 30upx;

  font-weight: 500;
  color: #f4f7ff;
}
// 确认按钮
.btn {
  position: fixed;
  bottom: 68upx;
  margin: 0 40upx;

  .btn-b {
    margin: auto;
    text-align: center;
    width: 670upx;
    height: 110upx;
    background: #383d46;
    border-radius: 16upx;
    line-height: 100upx;
    .btn-text {
      width: 64upx;
      height: 44upx;
      font-size: 32upx;

      font-weight: 600;
      color: #ffffff;
    }
  }
}
::v-deep.van-field__control--right {
  font-size: 30upx;

  font-weight: 400;
  color: #7a7f89;
}
::v-deep.van-field__label {
  width: 60upx;
  height: 42upx;
  font-size: 30upx;

  font-weight: 500;
  color: #f4f7ff;
  line-height: 80upx;
}
.counter {
  // position: absolute;
  // background: url('@/static/general.png') no-repeat center center;
  // background-size: 100% 100%;
  width: 100vw;
  height: 100vh;

  .app-esc {
    margin-top: 80upx;
    margin-left: 30upx;
    color: #a8adb6;
  }

  .botter {
    margin-top: 40upx;
    .botter-top {
      margin-left: 40upx;
      // width: 288upx;
      height: 66upx;
      font-size: 48upx;

      font-weight: 600;
      color: #f4f7ff;
      line-height: 66upx;
    }
    .a-i-c {
      margin-left: 40upx;
      margin-top: 20upx;
      // width: 390upx;
      height: 42upx;
      font-size: 30upx;
      font-weight: 400;
      color: #a8adb6;
      line-height: 42upx;
    }
  }
  .input {
    margin-top: 40upx;
    .input-name {
      margin: auto;
      text-align: center;
      width: 670upx;
      height: 110upx;
      background: #383d46;
      border-radius: 16upx;
      line-height: 80upx;
      font-size: 30upx;
      font-weight: 400;
      color: #7a7f89;
    }
  }
  .options {
    margin-top: 40upx;
    .options-sex {
      margin: auto;
      text-align: center;
      width: 670upx;
      height: 110upx;
      background: #383d46;
      border-radius: 16upx;
      line-height: 80upx;
      font-size: 30upx;
      font-weight: 400;
      color: #7a7f89;
    }
  }
}

.nav_style {
  width: calc(100vw - 60upx);
  margin-left: 30upx;
  height: 80upx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 80upx;
}
.nav_left_style {
  width: 40upx;
  height: 40upx;
  .back_img_style {
    width: 100%;
    height: 100%;
  }
}
.nav_text {
  font-size: 30upx;
  font-weight: 500;
  color: #bdc3ce;
}

::v-deep .uni-forms {
  width: calc(100vw - 60upx);
  margin-left: 30upx;

  uni-form {
    span {
      .uni-forms-item {
        width: 100%;
        height: 216upx;
        padding: 30upx;
        box-sizing: border-box;
        display: block;
        background: rgba(75, 82, 94, 0.5) !important;
        border-radius: 16upx;

        .uni-forms-item__label {
          width: 100% !important;
          margin-bottom: 46upx;
          uni-text {
            width: 100% !important;
            width: 100% !important;
            font-size: 30upx;
            height: 44upx;
            font-weight: 400;
            color: #f4f7ff;
            span {
              display: inline-block;
              width: 100% !important;
              font-size: 30upx;
              height: 44upx;
              font-weight: 400;
              color: #f4f7ff;
            }
          }
        }

        .uni-forms-item__content {
          .uni-easyinput {
            font-size: 32upx;
            font-weight: 600;
            color: #f4f7ff !important;
            .uni-easyinput__content {
              border-color: transparent !important;
              background-color: transparent !important;
            }
          }
          .uni-input-input {
            font-size: 32upx;
            font-weight: 600;
            color: #f4f7ff !important;
          }
        }
      }
    }
  }
}
::v-deep .uni-picker-container {
  .uni-picker-custom {
    border-radius: 24upx 24upx 0px 0px;
    background: #383d46 !important;
    .uni-picker-header {
      background: transparent !important;
      border-bottom: none;
      .uni-picker-action-cancel {
        padding-left: 40upx;
        // padding-top: 40upx;
        font-size: 32upx;
        font-weight: 600;
        color: #7a7f89;
      }
      .uni-picker-action-confirm {
        padding-right: 40upx;
        // padding-top: 40upx;
        font-size: 32upx;
        font-weight: 600;
        color: #f4f7ff;
      }
    }
    .uni-picker-header::after {
      border-bottom: none !important;
    }
    .uni-picker-content {
      background: transparent !important;
      .uni-picker-item {
        color: #f4f7ff !important;
      }
    }
  }
}

.change_picker_style {
  display: flex;
  width: 100%;
  margin-top: 10upx;
  // height: 80upx;
  align-items: center;
  justify-content: space-between;
  .label_style {
    font-size: 32upx;
    font-weight: 600;
    color: #f4f7ff;
    line-height: 44upx;
  }
  .back_img_style {
    width: 30upx;
    height: 32upx;
    object-fit: contain;
    transform: rotate(180deg);
  }
}
.student_label_style {
  font-size: 32upx !important;
  font-weight: 400 !important;
  color: #7a7f89 !important;
}
.edit_save_style {
  width: calc(100vw - 80upx);
  margin-left: 40upx;
  background: #454951;
  border-radius: 16upx;
  margin-top: 30upx;
  margin-bottom: 30upx;
  font-size: 32upx;
  font-weight: 600;
  color: #ffffff;
  line-height: 100upx;
  text-align: center;
  justify-content: center;
}
.active {
  background: #1370ff;
}
::v-deep.uni-input-placeholder {
  font-size: 32upx !important;
  font-weight: 400 !important;
  color: #7a7f89 !important;
}
</style>
