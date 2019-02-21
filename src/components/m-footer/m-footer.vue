<template>
  <div class="footer">
    <span>{{footName}}底部</span>
    <span class="info">网页数据来自QQ音乐和豆瓣，样式归邓国超本人所有</span>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      footName: {
        type: String,
        default: '底部'
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .footer
    line-height: 25px
    text-align: center
    color: $color-text-desc
    display: flex
    flex-direction: column
    font-size: $font-size-small
    .info
      font-size: $font-size-small-s
</style>
