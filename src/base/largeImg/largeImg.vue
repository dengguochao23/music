<template>
  <transition name="dialogs">
    <div class="dialog-wrapper" v-if="showFlag">
      <div class="bg-opacity"></div>
      <div class="dialog-container">
        <scroll class="text" :data="data" v-if="">
          <div>
            <p class="text-p" v-for="item in SingerDesc">
              {{item}}
            </p>
          </div>
        </scroll>
        <div class="close" @click="close">
          <span class="close-text">关闭</span>
        </div>
      </div>
    </div>
  </transition>

</template>
<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  export default {
    props: {
      showFlag: {
        type: Boolean,
        default: true
      },
      data: {
        type: Array,
        default: []
      }
    },
    computed: {
      SingerDesc() {
        return this.data
      }
    },
    methods: {
      close() {
        let flag = false
        this.$emit('dialogClose', flag)
      }
    },
    components: {
      Scroll
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .dialog-wrapper
    position: fixed
    top: 0
    left: 0
    bottom: 0
    right: 0
    z-index: 700
    width: 100%
    height 100%
    &.dialogs-enter-active, &.dialogs-leave-active
      transition: all 0.5s

    &.dialogs-enter, &.dialogs-leave-to
      opacity: 0
    .bg-opacity
      width: 100%
      height 100%
      position: absolute
      top: 0
      left: 0
      background-color: black
      opacity: 0.6
    .dialog-container
      position: absolute
      width: 70%
      height: 60%
      background-color: white
      top: 10%
      left: 15%
      border-top: 3px solid green

      .text
        overflow: hidden
        height: 100%
        line-height: 25px
        font-size: $font-size-medium-x
        padding: 0px 14px 0 14px
        background-color: white
        .text-p
          margin-bottom: 10px
      .close
        height: 10%
        text-align: center
        background-color: white
        .close-text
          line-height: 250%
          font-size: 150%


</style>
