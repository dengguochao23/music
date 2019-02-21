<template>
  <div class="music-list">
    <div class="head" ref="head">
      <i class="icon-back" @click="back"></i>
      <h1 class="title" v-html="title"></h1>
      <i class="icon-yonghu" @click="dialog"></i>
    </div>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play" @click="selectHotItem">
        <h3 class="play-text">热门推介:{{hotMusic}}</h3>
        <i class="icon-play"></i>
      </div>
      <div class="play-opacity"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <scroll @scroll="scroll" :probeType="probeType" :listenScroll="listenScroll" :data="songs"
            class="list" ref="list">
      <div class="song-list-wrapper">
        <song-list :songs="songs" @select="selectItem"></song-list>
      </div>
      <div class="singer-container">
        <loading v-show="!songs.length"></loading>
      </div>
    </scroll>
    <dialogs :data="SingerInfo" :showFlag="showFlag" @dialogClose="dialogFalse" :choseType="choseType">
    </dialogs>
  </div>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import SongList from 'base/song-list/song-list'
  import Loading from 'base/loading/loading'
  import Dialogs from 'base/dialog/dialog'
  import {mapActions} from 'vuex'
  import {playlistMixin} from 'common/js/mixin'
  const RESERVED_HEIGHT = 44
  export default {
    mixins: [playlistMixin],
    data() {
      return {
        scrollY: 0,
        showFlag: false,
        choseType: 2
      }
    },
    props: {
      title: {
        type: String,
        default: ''
      },
      bgImage: {
        type: String,
        default: ''
      },
      songs: {
        type: Array,
        default: []
      },
      SingerInfo: {
        type: Array,
        default: []
      },
      hotMusic: {
        type: String,
        default: ''
      }
    },
    computed: {
      bgStyle() {
        return `background-image:url(${this.bgImage})`
      }
    },
    created() {
      this.probeType = 3
      this.listenScroll = true
    },
    mounted() {
      this.imageHeight = this.$refs.bgImage.clientHeight
      this.minTranslateY = -this.imageHeight + RESERVED_HEIGHT
      this.$refs.list.$el.style.top = `${this.imageHeight}px`
    },
    methods: {
      handlePlaylist(playlist) {
        const bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.list.$el.style.bottom = bottom
        this.$refs.list.refresh()
      },
//      控制弹出窗口
      dialog() {
        if (!this.showFlag) {
          this.showFlag = true
          return
        }
      },
      dialogFalse(flag) {
        this.showFlag = flag
      },
      scroll(pos) {
        this.scrollY = pos.y
      },
      back() {
        this.$router.back()
      },
      selectHotItem() {
        this.selectPlay({
          list: this.songs,
          index: 0
        })
      },
      selectItem(item, index) {
        this.selectPlay({
          list: this.songs,
          index
        })
      },
      ...mapActions([
        'selectPlay'
      ])
    },
    watch: {
      scrollY(newY) {
        let translateY = Math.max(this.minTranslateY, newY)
        this.$refs.layer.style.transform = `translate3d(0,${translateY}px,0)`
        if (newY < this.minTranslateY) {
          this.$refs.head.style.backgroundColor = 'black'
        } else {
          this.$refs.head.style.backgroundColor = ''
        }
      }
    },
    components: {
      SongList,
      Scroll,
      Loading,
      Dialogs
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .music-list
    position: fixed
    top: 0
    left: 0
    right: 0
    bottom: 0
    z-index: 400
    .head
      position absolute
      top: 0
      display: flex
      align-items: center
      height: 44px
      width: 100%
      z-index: 530
      .icon-back
        font-size: $font-size-large-x
        display: block
        color: white
        margin-left: 10px
      .title
        text-align: center
        flex: 1
        z-index: 10
        color: white
        font-size: $font-size-large
      .icon-yonghu
        margin-right: 10px
        font-size: $font-size-large-x
        display: block
        color: white
    .tab-opacity
      position: absolute
      top: 0
      left: 0
      width: 100%
      height 40px
      display: block
      background-color: black
      z-index: 3
      opacity: 0.5
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      background-size: cover
      transform-origin: top
      .play
        position: absolute
        bottom: 0px
        width: 100%
        height: 60px
        color: white
        display: flex
        z-index: 10

        .play-text
          flex: 1
          font-size: $font-size-large-x
          line-height: 60px
          text-align: left
          padding-left: 15px
          margin-right: 20px
        .icon-play
          margin-right: 10px
          line-height: 60px
          text-align: center
          font-size: 50px
      .play-opacity
        width: 100%
        height: 60px
        position: absolute
        bottom: 0px
        background-color: black
        opacity: 0.5
    .bg-layer
      position: relative
      background-color: white
      height: 100%
      z-index: 450
      overflow: hidden
    .list
      width: 100%
      position: fixed
      top: 0
      bottom: 0
      right: 0
      left: 0
      z-index: 500
      .song-list-wrapper
        padding-top: 5px
      .singer-container
        position: absolute
        width: 100%
        top: 50%
</style>
