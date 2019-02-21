<template>
  <transition-group name="share">
    <div class="bg-opacity" v-if="isShowShare" :key="1"></div>
    <div class="share-container" v-if="isShowShare" :key="2">
      <p class="share-head">分享至</p>
      <div class="img-container">
        <img class="img" :src="item" alt="" v-for="item in imgUrl">
      </div>
      <p class="cancel" @click="cancel">取消</p>
    </div>
  </transition-group>
</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      return {
        imgUrl: [
          'http://mat1.gtimg.com/www/mobi/2017/image/share-wx.svg',
          'http://mat1.gtimg.com/www/mobi/2017/image/share-tl.svg',
          'http://mat1.gtimg.com/www/mobi/2017/image/share-qq.svg',
          'http://mat1.gtimg.com/www/mobi/2017/image/share-qz.svg',
          'http://mat1.gtimg.com/www/mobi/2017/image/share-wb.svg'
        ]
      }
    },
    props: {
      isShowShare: {
        type: Boolean,
        default: true
      }
    },
    methods: {
      cancel() {
        this.$emit('cancel')
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .bg-opacity
    width: 100%
    height: 100%
    background-color: black
    position: fixed
    top: 0
    left: 0
    opacity: 0.7
    z-index: -1
    &.share-enter-active, &.share-leave-active
      transition: all 0.5s
    &.share-enter, &.share-leave-to
      opacity: 0
  .share-container
    width: 100%
    display: flex
    flex-direction: column
    background-color: white
    align-items: center
    z-index: 2
    &.share-enter-active, &.share-leave-active
      transition: all 0.5s
    &.share-enter, &.share-leave-to
      transform: translate3d(0, 100%, 0)
    .share-head
      text-align: center
      height: 30px
      line-height: 30px
    .img-container
      display: flex
      width: 100%
      align-items: center
      justify-content: center
      .img
        padding: 5% 5%
    .cancel
      width: 100%
      height: 50px
      font-size: $font-size-large-x
      line-height: 50px
      border-top: 1px solid #999
      text-align: center
</style>
