<template>
  <ul class="comment-wrapper" v-if="data.length>0">
    <li class="comment-container" v-for="item in data">
      <div class="comment-head">
        <img class="comment-logo" width="12%" height="12%" :src="item.img" alt="">
        <div class="comment-info">
          <div class="comment-info-top">
            <p class="comment-name" v-html="item.name"></p>
            <stars class="comment-start" :score="item.star"></stars>
          </div>
          <p class="comment-date" v-html="item.time"></p>
        </div>
      </div>
      <div class="comment-text" v-html="item.comment"></div>
    </li>
  </ul>
  <ul v-else class="none">
    <li>暂时无评</li>
  </ul>
</template>

<!--这是一个评论列表组件，是通过外面传入数组进来的，数据必须经过createdInterest来处理才能使用-->
<script type="text/ecmascript-6">
  import Stars from 'base/stars/stars'
  export default {
    props: {
      data: {
        type: Array,
        default: []
      }
    },
    components: {
      Stars
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .comment-wrapper
    margin-top: 10px
    .comment-container
      display: flex
      width: 100%
      flex-direction: column
      margin-bottom: 28px
      .comment-head
        display: flex
        .comment-logo
          margin-right: 10px
          border-radius: 50%
        .comment-info
          display: flex
          flex-direction: column
          .comment-info-top
            display: flex
            flex-direction: row
            .comment-name
              font-weight: 600
            .comment-start
              padding-top: 2px
          .comment-date
            font-size: $font-size-small
            color: $color-text-desc
      .comment-text
        padding-left: 10%
        line-height: 16px
        font-size: $font-size-medium

  .none
    width: 100%
    height: 50px
    line-height: 50px
    text-align: center
</style>
