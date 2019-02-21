<template>
  <div class="volume-bar" ref="progressBar">
    <div class="bar-inner">

      <div class="progress" ref="progress"></div>
      <div class="progress-bg"></div>
      <div class="progress-btn-wrapper" ref="progressBtn"
           @touchstart.prevent="processTouchStart"
           @touchmove.prevent="processTouchMove"
           @touchend.prevent="processTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    created() {
      this.touch = {}
    },
    methods: {
      processTouchStart(e) {
        this.touch.initiated = true
        this.touch.startY = e.touches[0].pageY
        this.touch.bottom = this.$refs.progress.clientHeight
      },
      processTouchMove(e) {
        if (!this.touch.initiated) {
          return
        }
        const deltaY = e.touches[0].pageY - this.touch.startY
        const offsetHight = Math.min(this.$refs.progressBar.clientHeight, Math.max(0, deltaY + this.touch.bottom))
        this._offset(offsetHight)
      },
      processTouchEnd() {
        this.touch.initiated = false
        this._triggerPercent()
      },
      _triggerPercent() {
        const percent = this.$refs.progress.clientHeight / 120
        this.$emit('volumeChangePercent', percent)
      },
      _offset(offsetHight) {
        this.$refs.progress.style.height = `${offsetHight}px`
        this.$refs.progressBtn.style.transform = `translate3d(0,${offsetHight}px,0)`
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .volume-bar
    height: 120px

    .bar-inner
      position: relative
      left: 0px
      top: 16px
      background: rgba(0, 0, 0, 1)

      .progress-bg
        position: absolute
        left: 13px
        bottom: -120px
        width: 4px
        height: 120px
        background-color: white
        z-index: 2
      .progress
        position: absolute
        left: 13px
        top: 0px
        width: 4px
        z-index: 3
        background: #666666
      .progress-btn-wrapper
        position: absolute
        top: -16px
        left: 0px
        width: 30px
        height: 30px
        border-radius: 50%
        z-index: 6
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid white
          border-radius: 50%
          background: #8CD44D
</style>
