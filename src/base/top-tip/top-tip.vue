<template>
  <transition name="drop">
    <div class="top-tip" v-show="showFlag">
      <slot></slot>
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
    methods: {
      show() {
        this.showFlag = true
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.showFlag = false
        }, 5000)
      },
      hide() {
        this.showFlag = false
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .top-tip
    width: 100%
    position: fixed
    top: 0
    left: 0
    z-index: 1999
    background-color: #E6E6E6
    &.drop-enter-active, &.drop-leave-active
      transition: all 0.5s
    &.drop-enter, &.drop-leave-to
      transform: translate3d(0, -100%, 0)
</style>
