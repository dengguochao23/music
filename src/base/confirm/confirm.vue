<template>
  <transition name="confirm-fade">
    <div class="confirm" v-show="showFlag">
      <div class="confirm-wrapper">
        <div class="confirm-content">
          <p class="text">{{text}}</p>
          <div class="operate">
            <div class="operate-btn left" @click="cancel">{{cancelText}}</div>
            <div class="operate-btn" @click="confirm">{{confirmText}}</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      return {
        showFlag: false
      }
    },
    props: {
      text: {
        type: String,
        default: '是否需要全部清空'
      },
      cancelText: {
        type: String,
        default: '取消'
      },
      confirmText: {
        type: String,
        default: '确定'
      }
    },
    methods: {
      show() {
        this.showFlag = true
      },
      hide() {
        this.showFlag = false
      },
      cancel() {
        this.$emit('cancel')
        this.showFlag = false
      },
      confirm() {
        this.$emit('confirm')
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .confirm
    position: fixed
    top: 0px
    left: 0px
    bottom: 0px
    right: 0px
    z-index: 998
    background-color: rgba(0, 0, 0, 0.3)
    &.confirm-fade-enter-active
      animation: confirm-fadein 0.5s
      .confirm-content
        animation: confirm-zoom 0.3s
    .confirm-wrapper
      position: absolute
      top: 50%
      left: 50%
      z-index: 999
      transform: translate(-50%, -50%)
      .confirm-content
        width: 270px
        border-bottom: 3px solid green
        background-color: white
        opacity: 1
        border-radius: 10px
        .text
          height: 70px
          line-height: 70px
          text-align: center
        .operate
          display: flex
          height: 30px
          line-height: 30px
          text-align: center
          border-top: 1px solid $color-text-desc
          .operate-btn
            flex: 1
          .left
            border-right: 1px solid $color-text-desc

  @keyframes confirm-fadein
    0%
      opacity: 0
    100%
      opacity: 1

  @keyframes confirm-zoom
    0%
      transform: scale(0)
    50%
      transform: scale(1.1)
    100%
      transform: scale(1)
</style>
