<template>
  <div class="player" v-if="playlist.length>0">
    <transition name="normal">
      <div class="normal-player" v-show="fullScreen" @click.stop="displayVolumeShow">
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.image">
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <!--这个光盘的白色的拉杆-->
          <div class="needle-plus" ref="needlePlus">
            <img width="48%" height="48%" class="needle-plus-img" :src="needlePlus">
          </div>
          <h1 class="title" v-html="currentSong.singer[0]"></h1>
          <h2 class="subtitle" v-html="currentSong.name"></h2>
        </div>
        <div class="middle"
             @touchstart.prevent="middleTouchStart"
             @touchmove.prevent="middleTouchMove"
             @touchend.prevent="middleTouchEnd">
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper">
              <div class="cd" :class="cdCls">
                <img class="cd-image" :src="cdBg">
                <img width="64%" height="64%" :src="currentSong.image" alt="" class="image">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{playingLyric}}</div>
            </div>
          </div>
          <scroll class="middle-r" ref="lyricList" :data="currentLyric&&currentLyric.lines">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p ref="lyricLine"
                   class="text"
                   :class="{'current':currentLineNum===index}"
                   v-for="(line,index) in currentLyric.lines">{{line.txt}}</p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{active:currentShow==='cd'}"></span>
            <span class="dot" :class="{active:currentShow==='lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{format(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <process-bar :percent="percent" @percentChange="onPercentChange"></process-bar>
            </div>
            <span class="time time-r">{{format(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left" @click.stop="toggleVol">
              <i class="icon-erji"></i>
            </div>
            <div class="icon i-left" @click="prev">
              <i class="icon-jiantouzuo"></i>
            </div>
            <div class="icon i-center" @click="togglePlaying">
              <i :class="playIcon"></i>
            </div>
            <div class="icon i-right" @click="next">
              <i class="icon-jiantouyou"></i>
            </div>
            <div class="icon i-right" :class="getFavoriteIcon(currentSong)" @click.stop="toggleFavorite(currentSong)">
              <i class="icon-share "></i>
            </div>
          </div>
          <div class="volume-bar-wrapper" v-show="volumeShow">
            <volume-bar @volumeChangePercent="volumePercent"></volume-bar>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click.stop="open" ref="miniPlayer">
        <div class="mini-process-bar" ref="miniProcessBar"></div>
        <div class="icon">
          <img :width="40" height="40" :src="currentSong.image" :class="minCdCls">
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer[0]"></p>
        </div>
        <div class="control" @click.stop="togglePlaying">
          <i :class="playIcon"></i>
        </div>
        <div class="control" @click.stop="showPlayerList">
          <i class="icon-liebiao"></i>
        </div>
      </div>
    </transition>
    <player-list ref="playerList"></player-list>
    <audio ref="audio" @error="error" :src="currentSong.url" @canplay="ready"
           @timeupdate="updateTime" @ended="end"></audio>
  </div>
</template>

<script type="text/ecmascript-6">
  import {mapGetters, mapMutations, mapActions} from 'vuex'
  import ProcessBar from 'base/process-bar/process-bar'
  import Lyric from 'lyric-parser'
  import Scroll from 'base/scroll/scroll'
  import VolumeBar from 'base/volume/volume'
  import PlayerList from 'components/playerlist/playerlist'
  import {playlistMixin} from 'common/js/mixin'
  //  白色拉杆的最终的高度
  const needlePlusHeight = -150
  export default {
    mixins: [playlistMixin],
    data() {
      return {
        songReady: false,
        currentTime: 0,
        currentLyric: null,
        currentLineNum: 0,
        currentShow: 'cd',
        playingLyric: '',
        volumeShow: false,
        needlePlus: require('./needle-plus.png'),
        cdBg: require('./disc-plus.png')
      }
    },
    computed: {
      cdCls() {
        return this.playing ? 'play' : 'play pause'
      },
      playIcon() {
        return this.playing ? 'icon-stop' : 'icon-play'
      },
      minCdCls() {
        return this.playing ? 'play' : 'play pause'
      },
      percent() {
        return this.currentTime / this.currentSong.duration
      },
      ...mapGetters([
        'fullScreen',
        'playing',
        'currentIndex',
        'sequenceList'
      ])
    },
    created() {
      this.touch = {}
    },
    methods: {
      back() {
        this.setFullScreen(false)
      },
      open() {
        this.setFullScreen(true)
      },
      prev() {
        if (this.playlist.length === 1) {
          this.loop()
          return
        } else {
          if (!this.currentSong) {
            return
          }
          let index = this.currentIndex - 1
          if (index === -1) {
            index = this.playlist.length - 1
          }
          this.setCurrentIndex(index)
          if (!this.playing) {
            this.togglePlaying()
          }
        }
        this.songReady = false
      },
      next() {
        if (this.playlist.length === 1) {
          this.loop()
          return
        } else {
          let index = this.currentIndex + 1
          if (index === this.playlist.length) {
            index = 0
          }
          this.setCurrentIndex(index)
          if (!this.playing) {
            this.togglePlaying()
          }
        }
        this.songReady = false
      },
      togglePlaying() {
        this.setPlayingState(!this.playing)
        if (this.currentLyric) {
          this.currentLyric.togglePlay()
        }
      },
      ready() {
        this.songReady = true
        this.savePlayHistory(this.currentSong)
      },
      end() {
        this.next()
      },
      error() {
        this.songReady = true
      },
//      循环播放
      loop() {
        this.$refs.audio.currentTime = 0
        this.$refs.audio.play()
        if (this.currentLyric) {
          this.currentLyric.seek(0)
        }
      },
      updateTime(e) {
        this.currentTime = e.target.currentTime
      },
      onPercentChange(percent) {
        const currentTime = this.currentSong.duration * percent
        this.$refs.audio.currentTime = currentTime
        if (!this.playing) {
          this.togglePlaying()
        }
        if (this.currentLyric) {
          this.currentLyric.seek(currentTime * 1000)
        }
      },
//      时间处理
      format(interval) {
        interval = interval | 0
        const min = interval / 60 | 0
        const Sccond = this._pad(interval % 60)
        return `${min}:${Sccond}`
      },
      _pad(num, n = 2) {
        let len = num.toString().length
        while (len < n) {
          num = '0' + num
          len++
        }
        return num
      },
//      歌词部分
      getLyric() {
        this.currentSong.getLyric().then((lyric) => {
          if (this.currentSong.lyric !== lyric) {
            return
          }
          this.currentLyric = new Lyric(lyric, this.handleLyric)
          if (this.playing) {
            this.currentLyric.play()
          }
        }).catch(() => {
          this.currentLyric = null
          this.playingLyric = ''
          this.currentLineNum = 0
        })
      },
      handleLyric({lineNum, txt}) {
        if (this.playlist.length === 0) {
          return
        }
        this.currentLineNum = lineNum
        if (lineNum > 5) {
          let lineEl = this.$refs.lyricLine[lineNum - 5]
          this.$refs.lyricList.scrollToElement(lineEl, 1000)
        } else {
          this.$refs.lyricList.scrollTo(0, 0, 1000)
        }
        this.playingLyric = txt
      },
//      移动时间产生的效果
      middleTouchStart(e) {
        this.touch.initiated = true
        const touch = e.touches[0]
        this.touch.startX = touch.pageX
        this.touch.startY = touch.pageY
      },
      middleTouchMove(e) {
        if (!this.touch.initiated) {
          return
        }
        const touch = e.touches[0]
        const deltaX = touch.pageX - this.touch.startX
        const delatY = touch.pageY - this.touch.startY
        if (Math.abs(delatY) > Math.abs(deltaX)) {
          return
        }
        const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
        const offsetWidth = Math.min(0, Math.max(-window.innerWidth, deltaX + left))
        this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
        const offsetHeight = Math.max(needlePlusHeight, needlePlusHeight * this.touch.percent)
        this.$refs.lyricList.$el.style.transform = `translate3d(${offsetWidth}px,0,0)`
        this.$refs.lyricList.$el.style.transitionDuration = 0
        this.$refs.middleL.style.opacity = 1 - this.touch.percent
        this.$refs.middleL.style.transitionDuration = 0
        this.$refs.needlePlus.style.transform = `translate3d(0,${offsetHeight}px,0)`
        this.$refs.needlePlus.style.transitionDuration = 0
      },
      middleTouchEnd() {
        let offsetWidth
        let opacity
        let offsetHeight
        if (this.currentShow === 'cd') {
          if (this.touch.percent > 0.1) {
            offsetWidth = -window.innerWidth
            this.currentShow = 'lyric'
            opacity = 0
            offsetHeight = needlePlusHeight
          } else {
            offsetWidth = 0
            opacity = 1
            offsetHeight = 0
          }
        } else {
          if (this.touch.percent < 0.9) {
            offsetWidth = 0
            this.currentShow = 'cd'
            opacity = 1
            offsetHeight = 0
          } else {
            offsetWidth = -window.innerWidth
            opacity = 0
            offsetHeight = needlePlusHeight
          }
        }
        this.$refs.lyricList.$el.style.transform = `translate3d(${offsetWidth}px,0,0)`
        this.$refs.lyricList.$el.style.transitionDuration = 300 + 'ms'
        this.$refs.middleL.style.opacity = opacity
        this.$refs.middleL.style.transitionDuration = 300 + 'ms'
        this.$refs.needlePlus.style.transform = `translate3d(0,${offsetHeight}px,0)`
        this.$refs.needlePlus.style.transitionDuration = 300 + 'ms'
      },
//      音乐调节器
      toggleVol() {
        if (!this.volumeShow) {
          this.volumeShow = true
        } else {
          this.volumeShow = false
        }
      },
      volumePercent(percent) {
        this.$refs.audio.volume = 1 - percent
      },
      displayVolumeShow() {
        if (this.volumeShow) {
          this.volumeShow = false
        } else {
          return
        }
      },
      // 控制列表的展示
      showPlayerList() {
        this.$refs.playerList.show()
      },
      ...mapMutations({
        setFullScreen: 'SET_FULL_SCREEN',
        setPlayingState: 'SET_PLAYING_STATE',
        setCurrentIndex: 'SET_CURRENT_INDEX'
      }),
      ...mapActions([
        'savePlayHistory'
      ])
    },
    watch: {
      currentSong(newSong, oldSong) {
        // 防止快速切换时
        if (!newSong.id) {
          return
        }
        if (newSong.id === oldSong.id) {
          return
        }
//        防止歌词出现闪现
        if (this.playlist.length === 0) {
          return
        }
        if (this.currentLyric) {
          this.currentLyric.stop()
        }
        this.volumeShow = false
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.$refs.audio.play()
          this.getLyric()
        }, 1000)
      },
      playing(newPlaying) {
        let audio = this.$refs.audio
        setTimeout(() => {
          newPlaying ? audio.play() : audio.pause()
        }, 500)
      },
      percent(newPercent) {
        if (!this.fullScreen && this.playing) {
          const miniWidth = this.$refs.miniPlayer.clientWidth
          const currentMiniProBar = Math.min(miniWidth * newPercent, miniWidth)
          this.$refs.miniProcessBar.style.width = `${currentMiniProBar}px`
        } else {
          return
        }
      }
    },
    components: {
      ProcessBar,
      Scroll,
      VolumeBar,
      PlayerList
    }
  }

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: black
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: white
        .needle-plus
          position: absolute
          top: 0px
          left: 46%
          z-index: 150
        .title
          text-align: right
          line-height: 30px
          padding-top: 10px
          padding-right: 20px
          no-wrap()
          font-size: $font-size-medium
          color: wheat
        .subtitle
          padding-right: 20px
          line-height: 20px
          text-align: right
          font-size: $font-size-small
          color: $color-text-desc
      .middle
        position: fixed
        width: 100%
        top: 75px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .cd-image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%
              .image
                position: absolute
                left: 18%
                top: 18%
                border-radius: 50%
          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 10px
            height: 10px
            border-radius: 50%
            background: $color-text-l
            &.active
              background: #8CD44D
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: white
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: white
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
        .volume-bar-wrapper
          height: 150px
          width: 30px
          position: absolute
          bottom: 40px
          left: 10%
          background: rgba(0, 0, 0, 0.3)
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.3s
        .bottom
          transition: all 0.7s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        transform: translate3d(0, 100%, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: white
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .mini-process-bar
        position: absolute
        top: 0
        left 0
        width: 0%
        height: 3px
        background: #8CD44D
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play, .icon-stop, .icon-liebiao
          font-size: 30px
          color: black
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>
