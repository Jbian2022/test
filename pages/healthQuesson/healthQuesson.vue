<template>
  <view class="content_style">
    <BgTheamCompontent :theamType="'currency'"></BgTheamCompontent>
    <NavBarCompontent
      :leftNavTitle="'健康问答'"
      :isAuthority="true"
    ></NavBarCompontent>
    <view class="list_content_style">
      <view
        class="need_loop_style"
        v-for="(item, itemIndex) in healthList"
        :key="'key' + itemIndex"
      >
        <view class="check_box_style" v-if="item.questionType === 2">
          <uni-collapse class="need_collapse_style" v-model="activeName">
            <uni-collapse-item
              titleBorder="none"
              :open="true"
              :show-arrow="false"
              :title="item.questionContent"
              :name="itemIndex"
            >
              <template v-slot:title>
                <uni-list>
                  <uni-list-item
                    :border="false"
                    :title="item.questionContent"
                    clickable
                    @click="infoclick = !infoclick"
                    class="titleclass"
                  >
                    <template v-slot:footer>
                      <view
                        class="rightclickblock arrowimgopen"
                        v-if="infoclick"
                      >
                        点击展开
                      </view>
                      <view class="rightclickblock arrowimgclose" v-else
                        >点击关闭</view
                      >
                    </template>
                  </uni-list-item>
                </uni-list>
              </template>
              <view class="collapes_conten_style">
                <view
                  class="collapes_tag_stylle"
                  @click.stop="
                    quesionClick(item, itemIndex, itemChild, itemChildIndex)
                  "
                  :class="itemChild.checked ? 'active' : ''"
                  v-for="(itemChild, itemChildIndex) in item.answer"
                  :key="'key' + itemChildIndex"
                  >{{ itemChild.answerTitle }}</view
                >
              </view>
            </uni-collapse-item>
          </uni-collapse>
        </view>
        <view class="radio_style" v-if="item.questionType === 1">
          <view class="radio_title_style">
            {{ item.questionContent }}
          </view>

          <view class="radio_tag_style">
            <view
              class="tag_style"
              v-for="(radioItem, radioItemIndex) in item.answer"
              :key="'key' + radioItemIndex"
              @click.stop="
                quesionChildClick(item, itemIndex, radioItem, radioItemIndex)
              "
              :class="radioItem.checked ? 'active' : ''"
              >{{ radioItem.answerTitle }}</view
            >
          </view>
          <view class="radio_remark_style" v-if="item.answer[0].checked">
            <!-- 			  <input class="remark_style" type="textarea"  :placeholder=" item.answerRemark && item.answerRemark.remarkTitle ? item.answerRemark.remarkTitle : '请补充信息'" />
 -->
            <view class="uni-textarea">
              <textarea
                :maxlength="30"
                v-model="item.answer[0].remark"
                placeholder-style="color:#BDC3CE"
                :placeholder="
                  item.answerRemark && item.answerRemark.remarkTitle
                    ? item.answerRemark.remarkTitle
                    : '请补充信息'
                "
              />
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="bottom_style" @click.stop="saveHealthQuession">保存</view>
  </view>
</template>

<script>
import BgTheamCompontent from '@/components/bgTheamCompontent/bgTheamCompontent.vue'
import NavBarCompontent from '@/components/navBarCompontent/navBarCompontent.vue'
var businessCloudObject = uniCloud.importObject('businessCloudObject', {
  customUI: true // 取消自动展示的交互提示界面
})
export default {
  components: {
    BgTheamCompontent,
    NavBarCompontent
  },
  data() {
    return {
      healthList: [],
      activeName: [0],
      traineeNo: '',
      originList: [], // 源数据
      questionCode: '',
      infoclick: true
    }
  },
  onLoad(options) {
    if (JSON.stringify(options) !== '{}' && options.traineeNo) {
      this.traineeNo = options.traineeNo
    }
    if (
      JSON.stringify(options) !== '{}' &&
      options.hasOwnProperty('childList')
    ) {
      let originList = JSON.parse(options.childList)
      this.originList = originList
      // console.log(this,'>>>',this.healthList)
    }
    if (
      JSON.stringify(options) !== '{}' &&
      options.hasOwnProperty('questionCode')
    ) {
      this.questionCode = options.questionCode
    }
  },
  computed: {
    handlerData() {
      return function (item) {
        let remark = ''
        if (item.answer.length > 0) {
          remark = item.answer[0].remark
        }
        return {
          remark
        }
      }
    }
  },
  created() {
    uni.hideLoading()
  },
  mounted() {
    this.requestList()
  },
  methods: {
    saveHealthQuession() {
      // console.log(this.healthList, 'healthList')

      let testResult = []
      let newList = JSON.parse(JSON.stringify(this.healthList))
      newList.forEach((item) => {
        if (item.questionType == 2) {
          delete item['remark']
        }
        let resetList =
          item.answer.length > 0
            ? item.answer
                .filter((k) => k.checked)
                .map((z) => {
                  return z
                })
            : []

        // 提交时激活选项是n还是 y
        let findResultChecked = resetList.find((k) => k.checked)

        let result = {
          code: item.code,
          answer: resetList.map((c) => c.answerTitle),
          remark:
            resetList.length > 0
              ? findResultChecked.answerTitle === '是'
                ? resetList[0].remark
                : ''
              : ''
        }
        testResult.push(result)
      })
      // console.log(testResult, '我是你爹')
      // 参数封装
      let saveParam = {
        traineeNo: this.traineeNo,
        questionCode: this.questionCode,
        testResult
      }
      businessCloudObject
        .opearConfig(saveParam, 'physical')
        .then((res) => {
          console.log(res, '我要保存了')
          if (res.success) {
            uni.redirectTo({
              url:
                '/pages/physicalAssessment/physicalAssessment' +
                '?traineeNo=' +
                this.traineeNo +
                '&questionCode=' +
                this.questionCode
            })
            uni.showToast({
              icon: 'success',
              title: res.message,
              duration: 800
            })
          }
        })
        .catch(() => {})
    },
    requestList() {
      businessCloudObject
        .opearConfigQuery({
          traineeNo: this.traineeNo,
          questionCode: this.questionCode
        })
        .then((res) => {
          console.log(res, 'kkkkk')
          if (res.affectedDocs === 0) {
            let healthList = this.originList.map((item) => {
              let answer =
                item.answer.length > 0
                  ? item.answer.map((config) => {
                      return {
                        ...config,
                        checked: false
                      }
                    })
                  : []

              return {
                ...item,
                answer
              }
            })
            this.healthList = healthList
          } else {
            let list = JSON.parse(JSON.stringify(this.originList))
            // console.log(list, '你好mmm')

            let healthList = list.map((item) => {
              let answer =
                item.answer.length > 0
                  ? item.answer.map((config) => {
                      // 需要对比的数组
                      let compareData = res.data[0]
                      var checked = false
                      var remark = ''

                      compareData.testResult.forEach((k) => {
                        // 挑出父节点
                        if (item.code === k.code) {
                          if (item.questionType === 1) {
                            remark = k.remark || ''
                          }
                          k.answer.length > 0
                            ? k.answer.map((z) => {
                                if (config.answerTitle === z) {
                                  checked = true
                                }
                              })
                            : (checked = false)
                        }
                      })

                      return {
                        ...config,
                        checked,
                        remark
                      }
                    })
                  : []

              return {
                ...item,
                answer
              }
            })
            console.log(healthList, 'hellow')
            this.healthList = healthList
          }
        })
        .catch((err) => {})
    },
    quesionClick(item, itemIndex, itemChild, itemChildIndex) {
      itemChild.checked = !itemChild.checked
    },
    quesionChildClick(item, itemIndex, radioItem, radioItemIndex) {
      item.answer = item.answer.map((config, conifgIndex) => {
        if (conifgIndex === radioItemIndex) {
          return {
            ...config,
            checked: true
          }
        } else {
          return {
            ...config,
            checked: false
          }
        }
      })
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
  display: flex;
  flex-direction: column;
}
.list_content_style {
  width: 100%;
  flex: 0.88;
  overflow-x: hidden;
  overflow-y: auto;

  .need_loop_style {
    width: calc(100vw - 60upx);
    margin-left: 30upx;
    margin-top: 30upx;
    background: #383d46;
    border-radius: 24upx;
    height: auto;

    .check_box_style {
      .need_collapse_style {
        width: calc(100% - 60upx);
        margin-left: 30upx;
        height: auto;
        padding-top: 40upx;
        padding-bottom: 40upx;
        box-sizing: border-box;
        background-color: transparent !important;
        .collapes_conten_style {
          width: 100%;
          display: flex;
          align-items: center;
          flex-wrap: wrap;

          .collapes_tag_stylle {
            // width: 187upx;
            width: calc((100% - 48upx) / 3);
            height: 80upx;
            background: #4b525e;
            border-radius: 16upx;
            font-size: 28upx;
            font-weight: 600;
            color: #f4f7ff;
            text-align: center;
            line-height: 80upx;
            margin-right: 24upx;
            margin-bottom: 24upx;
          }
          .active {
            background: #1370ff;
            color: #f4f7ff;
          }
          .collapes_tag_stylle:nth-child(3n) {
            margin-right: 0;
          }
        }
      }
    }
    .radio_style {
      width: 100%;

      margin-top: 30upx;
      background: #383d46;
      border-radius: 24upx;
      height: auto;
      .radio_title_style {
        font-size: 32upx;
        font-weight: 600;
        color: #f4f7ff;
        padding-top: 40upx;
        margin-left: 30upx;
      }
      .radio_tag_style {
        width: 100%;
        display: flex;
        align-items: center;
        margin-left: 30upx;
        margin-top: 36upx;
        padding-bottom: 30upx;
        .tag_style {
          width: 160upx;
          height: 80upx;
          background: #4b525e;
          border-radius: 16upx;
          line-height: 80upx;
          margin-right: 30upx;
          text-align: center;
          font-size: 30upx;
          font-weight: 400;
          color: #f4f7ff;
        }
        .active {
          background: #1370ff;
          color: #f4f7ff;
        }
      }
      .radio_remark_style {
        width: calc(100% - 60upx);
        margin-left: 30upx;
        padding-bottom: 30upx;

        .supplement_style {
          width: 100%;
          height: 160px;
          background: #4b525e;
          border-radius: 16px;
          input {
            &::placeholder {
              /* Chrome, Firefox, Opera, Safari 10.1+ */
              color: red !important;
            }
          }
        }
      }
    }
  }
}
.bottom_style {
  width: calc(100vw - 60upx);
  margin-left: 30upx;
  height: 100upx;
  background: #1370ff;
  border-radius: 16upx;
  margin-top: 30upx;
  margin-bottom: 30upx;
  font-size: 32upx;
  font-weight: 600;
  color: #ffffff;
  line-height: 100upx;
  text-align: center;
  position: fixed;
  left: 0;
  bottom: 0;
}

::v-deep.uni-collapse {
  .uni-collapse-item {
    .uni-collapse-item-border {
      border: none !important;
    }
  }
}
::v-deep.uni-collapse-item__title-box {
  background-color: transparent !important;
  font-size: 32upx !important;
  font-weight: 600 !important;
  color: #f4f7ff !important;
  padding: 0 !important;
}
::v-deep.uni-collapse-item__title-text {
  font-size: 32upx !important;
  font-weight: 600 !important;
  color: #f4f7ff !important;
}
::v-deep.uni-collapse-item__wrap {
  background-color: transparent !important;
  margin-top: 30upx;
}
::v-deep.uni-collapse-item__wrap-content.uni-collapse-item--border {
  border-bottom-width: 0 !important;
}
::v-deep .uni-textarea {
  // height: 160px;
  background: #4b525e;
  border-radius: 16upx;
  padding: 30upx;
  box-sizing: border-box;
  color: #f4f7ff;
}
.rightclickblock {
  width: 154upx;
  height: 50upx;
  background: #1370ff;
  border-radius: 26upx;
  font-size: 24upx;
  font-weight: 600;
  color: #f4f7ff;
  line-height: 50upx;
  padding-left: 26upx;
}
.titleclass {
  background: transparent !important;
  border-top: none;
  border-bottom: none;
  color: #f4f7ff !important;
  border-radius: 24upx;
  font-size: 32upx;
  font-weight: 600;
  color: #f4f7ff;
}
::v-deep .uni-list {
  background: transparent !important;
  border-radius: 24upx;
}
::v-deep .uni-list-item__container {
  padding-left: 0 !important;
}
::v-deep .uni-list-item__content-title {
  color: #f4f7ff !important;
  // font-weight: 600;
  background: transparent !important;
  font-size: 32upx !important;
}
::v-deep .uni-list--border-top {
  background-color: #2f333a !important;
}
.arrowimgopen {
  background-image: url('https://mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3.cdn.bspapp.com/cloudstorage/70b5ca0b-6450-45fc-b306-4882dd2b6e47.png');
  background-repeat: no-repeat;
  background-size: 25%;
  background-position-x: 124upx;
}
.arrowimgclose {
  background-image: url('https://mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3.cdn.bspapp.com/cloudstorage/e98a8797-15e5-4862-b7f4-b747771c5e89.png');
  background-repeat: no-repeat;
  background-size: 25%;
  background-position-x: 124upx;
  background-position-y: 2upx;
}
::v-deep .uni-list--border-bottom {
  background-color: #2f333a !important;
}
</style>
