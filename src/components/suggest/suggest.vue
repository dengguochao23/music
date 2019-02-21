<template>
  <scroll
    class="suggest"
    :data="data"
    :isPullUpLoad="pullUpLoad"
    :probeType="probeType"
    :listenScroll="listenScroll"
    @pullingUp="pullingUp"
    ref="suggest"
  >
    <div>
      <h1 class="suggest-type">音乐搜索结果</h1>
      <ul class="suggest-list">
        <li class="suggest-item" v-for="item in data" @click.stopp="selectItem(item)">
          <p class="title" v-html="item.name" v-if="isShowHotKey===0"></p>
          <p class="title" v-html="item.title" v-if="isShowHotKey===1"></p>
          <p class="name" v-if="isShowHotKey===0">{{item.singer[0]}}</p>
          <stars v-if="isShowHotKey===1"></stars>
        </li>
      </ul>
      <Loading class="loading" v-if="isLoading"></Loading>
      <div class="foot" v-if="isScollEnd">
        <p>亲，已经到达底部了</p>
      </div>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import Stars from 'base/stars/stars'
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'

  export default {
    data() {
      return {
        probeType: 3,
        listenScroll: true,
        pullUpLoad: true,
        isLoading: false,
        isScollEnd: false
      }
    },
    props: {
      data: {
        type: Array,
        default: []
      },
      isShowHotKey: {
        type: Number,
        default: 0
      },
      hasMore: {
        type: Boolean,
        default: true
      }
    },
    methods: {
      selectItem(item) {
        this.$emit('selectItem', item)
      },
      // 上拉刷新
      pullingUp() {
        this.isLoading = true
        this.$emit('pullingUp')
      },
      // 提醒插件上拉完成
      finishPullUp() {
        this.$refs.suggest.finishPullUp()
      },
      // 提醒上拉介绍
      scrollEnd() {
        this.isLoading = false
        this.isScollEnd = true
      }
    },
    components: {
      Stars,
      Scroll,
      Loading
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .suggest
    height: 100%
    overflow: hidden
    .suggest-type
      margin: 0 0 10px 20px
      color: $color-text-desc
      font-size: $font-size-large
    .suggest-list
      padding: 0 20px
      .suggest-item
        display: flex
        flex-direction: column
        border-bottom: 0.5px solid $color-text-desc
        padding: 12px 0px
        .title
          font-size: $font-size-large
          margin-bottom: 10px
        .name
          font-size: $font-size-medium
          color: $color-text-desc

    .loading
      margin-top: 10px
    .foot
      width: 100%

      text-align: center



</style>
