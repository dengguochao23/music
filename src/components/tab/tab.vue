<template>
  <div class="tab">
    <router-link to="/recommend" class="tab-item" tag="div">
      <span class="item">嘻嘻网</span>
    </router-link>
    <router-link to="/recommend" class="tab-select">
      <span class="music">音乐</span>
    </router-link>
    <router-link to="/singer" class="tab-select">
      <span class="singer">歌手</span>
    </router-link>
    <router-link to="/movie" class="tab-select">
      <span class="movie">电影</span>
    </router-link>
    <router-link to="/video" class="tab-select">
      <span class="video">视频</span>
    </router-link>
    <router-link to="/search" class="tab-select">
      <span class="search">搜索</span>
    </router-link>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .tab
    display: flex
    height: 44px
    line-height: 44px
    font-size: $font-size-medium
    border-bottom: 1px solid #F7F7F7
    background-color: white
    .tab-item
      flex: 1
      padding-left: 10px
      color: #8CD44D
      font-size: $font-size-large-x
      .item
        font-weight: 600
    .tab-select
      color: #8CD44D
      padding-right: 20px
      .music
        color: #2384E8
      .singer
        color: #9F7860
      .movie
        color: #E4A813
      .video
        color: #2AB8CC
      .search
        color: #00B600
</style>
