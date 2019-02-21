<template>
  <div class="song-list">
    <li @click="selectItem(song,index)" class="item" v-for="(song,index) in songs">
      <div class="content">
        <div class="num">{{getNum(index)}}</div>
        <div class="song-list-info">
          <div class="name" v-html="song.name"></div>
          <div class="album" v-html="song.album"></div>
        </div>
        <i class="icon-play" v-show="false"></i>
      </div>
    </li>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      songs: {
        type: Array,
        default: []
      }
    },
    methods: {
      selectItem(item, index) {
        this.$emit('select', item, index)
      },
      getNum(index) {
        return `${index + 1}、`
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .song-list
    .item
      width: 100%
      .content
        display: flex
        border-bottom: 1px solid $color-text-desc
        align-items: center
        height: 60px
        &.active
          border-left: 3px solid red
        .num
          margin-left: 5px
          font-size: $font-size-large-x
        .song-list-info
          display: flex
          flex: 1
          flex-direction: column
          .name
            margin-bottom: 6px
            font-size: $font-size-large
          .album
            font-size: $font-size-medium
            color: $color-text-desc
        .icon-play
          color: red
          font-size: 30px
          padding-right: 10px
</style>
