<template>
  <transition name="list-fade">
    <div class="playlist" v-show="showFlag">
      <div class="playlist-wrapper">
        <div class="list-header">
          <h1 class="title">
            <span class="text">歌曲列表</span>
            <span class="clear" @click="deleteAll"><i class="icon-lajitong"></i></span>
          </h1>
        </div>
        <scroll class="list-content" ref="listContent" :refreshDelay="refreshDelay">
          <ul>
            <li class="item"
                v-for="(item,index) in sequenceList"
                ref="listItem"
            >
              <div class="select">
                <div class="left" @click.stop="like(item,index)">收藏</div>
                <div class="right" @click.stop="deleted(item,index)">删除</div>
              </div>
              <div class="song-content"
                   ref="listSingle"
                   @touchstart.prevent="ListTouchStart"
                   @touchmove.prevent="ListTouchMove(index)"
                   @touchend.prevent="ListTouchEnd(index)"
                   @click.stop="selectItem(item,index)"
              >
                <i class="current" :class="getCurrentIcon(item)"></i>
                <span class="text">{{item.name}}</span>
                <div class="like" v-show="getFavoriteIcon(item)">
                  <i class="icon-share" :class="getFavoriteIcon(item)"></i>
                </div>
              </div>
            </li>
          </ul>
        </scroll>
        <div class="list-operate">
          <div class="add" @click.stop="addSongShow">
            <i class="icon-xuanzhong"></i>
            <span class="text">添加歌曲</span>
          </div>
        </div>
        <div class="list-close" @click.stop="hide">
          <span class="text">关闭</span>
        </div>
      </div>
      <confirm ref="confirm" text="是否需要清空歌曲列表" @confirm="deleteAllList"></confirm>
      <add-song ref="addSong"></add-song>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  // const MAX_MOVE_WIDTH = 75
  import Scroll from 'base/scroll/scroll'
  import Confirm from 'base/confirm/confirm'
  import AddSong from 'components/add-song/add-song'
  import {mapGetters, mapMutations, mapActions} from 'vuex'
  import {playlistMixin} from 'common/js/mixin'
  export default {
    mixins: [playlistMixin],
    data() {
      return {
        listNum: 8,
        showFlag: false,
        refreshDelay: 120
      }
    },
    computed: {
      ...mapGetters([
        'sequenceList',
        'currentSong',
        'currentIndex',
        'playlist'
      ])
    },
    created() {
      this.touch = {}
    },
    mounted() {
    },
    methods: {
      // 控制显示和关闭
      show() {
        this.showFlag = true
        setTimeout(() => {
          this.$refs.listContent.refresh()
          this.scrollToCurrent(this.currentSong)
        }, 120)
      },
      hide() {
        this.showFlag = false
      },
      // 获取当前播放歌曲的样式
      getCurrentIcon(item) {
        if (this.currentSong.id === item.id) {
          return 'icon-play'
        }
        return ''
      },
      // 监听滑动
      ListTouchStart(index) {
        this.touch.initiated = true
        this.touch.startX = event.touches[0].pageX
      },
      ListTouchMove(index) {
        if (!this.touch.initiated) {
          return
        }
        this.touch.deltaX = this.touch.startX - event.touches[0].pageX
      },
      ListTouchEnd(index) {
        if (this.touch.deltaX > 100) {
          this._moveList(-110, index) // 歌曲名字用内边距撑开了20px，所以就树妖
        } else if (this.touch.deltaX < -100) {
          this._moveList(90, index)
        }
        this.touch.deltaX = 0
        this.touch.initiated = false
      },
      // 列表移动
      _moveList(moveDistance, index) {
        this.$refs.listSingle[index].style.transform = `translate3d(${moveDistance}px,0,0)`
        this.$refs.listSingle[index].style.transitionDuration = '800ms'
      },
      // 列表滚动的距离
      scrollToCurrent(current) {
        const index = this.sequenceList.findIndex((song) => {
          return current.id === song.id
        })
        this.$refs.listContent.scrollToElement(this.$refs.listItem[index], 1000)
      },
      // 选择歌曲
      selectItem(item, index) {
        this.setCurrentIndex(index)
        this.setPlayingState(true)
      },
      // 收藏
      like(song, index) {
        this._moveList(0, index)
        this.toggleFavorite(song)
      },
      // 删除
      deleted(song, index) {
        this.$refs.listItem[index].style.height = `0px`
        this.$refs.listItem[index].style.transition = 'all 0.3s'
        this.deleteSong(song)
      },
      // 删掉全部歌曲
      deleteAll() {
        this.$refs.confirm.show()
      },
      deleteAllList() {
        this.deleteAllSong()
        this.hide()
      },
      // 展示添加歌曲页面
      addSongShow() {
        this.$refs.addSong.show()
      },
      ...mapMutations({
        setCurrentIndex: 'SET_CURRENT_INDEX',
        setPlayingState: 'SET_PLAYING_STATE'
      }),
      ...mapActions([
        'deleteSong',
        'deleteAllSong'
      ])
    },
    components: {
      Scroll,
      Confirm,
      AddSong
    },
    watch: {
      currentSong(newSong, oldSong) {
        if (!this.showFlag || newSong.id === oldSong.id) {
          return
        }
        this.scrollToCurrent(this.currentSong)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .playlist
    position: fixed
    top: 0
    left: 0
    bottom: 0
    right: 0
    z-index: 200
    background-color: rgba(0, 0, 0, 0.3)
    &.list-fade-enter-active, &.list-fade-leave-active
      transition: opacity 0.3s
      .playlist-wrapper
        transition: all 0.3s
    &.list-fade-enter, &.list-fade-leave-to
      opacity: 0
      .playlist-wrapper
        transform: translate3d(0, 100%, 0)
    &.list-fade-enter
    .playlist-wrapper
      position: absolute
      bottom: 0
      left: 0
      z-index: 210
      width: 100%
      background-color: rgba(255, 255, 255, 1)
      .list-header
        height: 40px
        line-height: 40px
        width: 100%
        border-top: 5px solid #8CD44D
        .title
          display: flex
          justify-content: space-between
          width: 100%
          font-size: $font-size-large
          .text
            padding-left: 20px
          .clear
            padding-right: 20px
            .icon-lajitong
              font-size: $font-size-large
      .list-content
        max-height: 240px
        overflow: hidden
        .item
          overflow: hidden
          width: 100%
          height: 40px
          overflow: hidden
          position: relative
          &.list-enter-active, &.list-leave-active
            transition: all 0.01s
          &.list-leave-to
            height: 0
          .select
            display: flex
            height: 45px
            line-height: 40px
            z-index: 20
            .left
              flex: 1
              background-color: red
              color: white
              padding-left: 20px
            .right
              flex: 1
              text-align: right
              padding-right: 20px
              background-color: green
          .song-content
            position: absolute
            top: 0
            left: 0
            height: 45px
            width: 100%
            background-color: white
            padding-left: 20px
            display: flex
            align-items: center
            .current
              width: 20px
              flex: 0 0 20px
              color: green
              padding-right: 10px
            .text
              padding-right: 10px
            .like
              flex: 1
              .icon-favorite
                color: red
      .list-operate
        width: 140px
        margin: 20px auto 30px auto
        .add
          display: flex
          align-items: center
          padding: 8px 16px
          border: 1px solid green
          border-radius: 10px
          .text
            padding-left: 10px
      .list-close
        width: 100%
        height: 40px
        background-color: #999
        text-align: center
        .text
          color: white
          line-height: 40px
          font-size: $font-size-large
          font-weight: 700
</style>
