<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'
  export default {
    props: {
      probeType: {
        type: Number,
        defautl: 1
      },
      click: {
        type: Boolean,
        default: true
      },
      data: {
        default: null
      },
      listenScroll: {
        type: Boolean,
        default: false
      },
      beforeScroll: {
        type: Boolean,
        default: false
      },
//      这个用来控制scroll滚动的方向，默认是X轴是false,Y轴是true,
//      你可以通过改变directionX和directionY的Boolean值来改变滚动的方向
      directionX: {
        type: Boolean,
        default: false
      },
      directionY: {
        type: Boolean,
        default: true
      },
      isPullDownRefresh: {
        type: Boolean,
        default: false
      },
      isPullUpLoad: {
        type: Boolean,
        default: false
      },
      refreshDelay: {
        type: Number,
        default: 20
      }
    },
    mounted() {
      setTimeout(() => {
        this._initScroll()
      }, 20)
    },
    methods: {
      _initScroll() {
        if (!this.$refs.wrapper) {
          return
        }
        this.scroll = new BScroll(this.$refs.wrapper, {
          probeType: this.probeType,
          click: this.click,
          scrollX: this.directionX,
          scrollY: this.directionY,
          pullDownRefresh: this.isPullDownRefresh,
          pullUpLoad: this.isPullUpLoad
        })
        if (this.listenScroll) {
          let me = this
          this.scroll.on('scroll', (pos) => {
            me.$emit('scroll', pos)
          })
        }
//        这是控制是否下拉刷新
        if (this.isPullUpLoad) {
          this._initPullup()
          this._initScrollEnd()
        }
      },
      enable() {
        this.scroll && this.scroll.enable()
      },
      disable() {
        this.scroll && this.scroll.disable()
      },
      refresh() {
        this.scroll && this.scroll.refresh()
      },
      finishPullUp() {
        this.scroll && this.scroll.finishPullUp()
      },
      scrollTo() {
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
      },
      scrollToElement() {
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
      },
      // 每次调用下拉刷新，都需先设置probeType: 3,listenScroll: true, 这样才能调用
      // 每次当下拉刷新数据加载完毕后，需要调用finishPullUp()告诉 better-scroll 数据已加载
      _initPullup() {
        this.scroll.on('pullingUp', () => {
          this.$emit('pullingUp')
        })
      },
      // 滚动到底部时间
      _initScrollEnd() {
        this.scroll.on('scrollEnd', () => {
          this.$emit('scrollEnd')
        })
      }
    },
    watch: {
      data() {
        setTimeout(() => {
          this.refresh()
        }, this.refreshDelay)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
