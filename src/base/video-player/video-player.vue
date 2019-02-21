<template>
  <div class="video-player" @click="showVideoControl">
    <img width="100%" height="100%" :src="bgImg" ref="imgs" class="bg-img">
    <video
      width="100%"
      class="video"
      :src="vurl"
      ref="video"
      preload="none"
      @timeupdate="updateTime"
      @ended="videoEnd"
      poster="bgImg"
      @durationchange="onloading"
    >
    </video>
    <div class="control" :class="{isFullControl:isFullScreen}" ref="control">
      <div class="duration" v-show="isPlaying">{{format(this.options.duration)}}</div>
      <div class="control-container" v-if="isShowControl" :class="{active:isFullScreen}">
        <i :class="playIcon" class="control-icon" @click.stop="playVideo"></i>
        <span class="time">{{format(currentTime)}}</span>
        <process-bar class="process" :percent="percent" @percentChange="onPercentChange"></process-bar>
        <span class="time">{{format(this.options.duration)}}</span>
        <i class="control-icon icon-shuaxin" @click.stop="videoLoad"></i>
        <i class="control-icon icon-quanpin" @click.stop="isFull"></i>
      </div>
    </div>
    <div class="big">
      <i class="big-icon" :class="playIcon" @click.stop="playVideo" v-show="isPlaying"></i>
    </div>
    <loading class="loading" v-show="isLoading"></loading>
  </div>
</template>

<script type="text/ecmascript-6">
  import Loading from 'base/loading/loading'
  import ProcessBar from 'base/process-bar/process-bar'
  export default{
    props: {
      options: {
        type: Object,
        default: {}
      },
      vurl: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        isPlaying: true,
        currentTime: 0,
        isShowControl: false,
        isFullScreen: false,
        isLoading: false
      }
    },
    computed: {
      bgImg() {
        return this.options.bgImg
      },
      percent() {
        return this.currentTime / this.options.duration
      },
      title() {
        return this.options.title
      },
      name() {
        return this.options.name
      },
      item() {
        return this.options.item
      },
      count() {
        return this.options.count
      },
      playIcon() {
        return this.isPlaying ? ' icon-play' : 'icon-stop'
      }
    },
    created() {
    },
    mounted() {
      // 检查浏览器是否是全屏状态
      this._checkFullScreen()
    },
    methods: {
      getVideoHeight() {
        const height = this.$refs.imgs.offsetHeight
        this.$refs.control.style.height = height + 'px'
      },
      // 处理播放的时间
      format(duration) {
        duration = duration | 0
        const min = duration / 60 | 0
        const sceond = this._pad(duration % 60)
        return `${min}:${sceond}`
      },
      _pad(num, n = 2) {
        let len = num.toString().length
        while (len < n) {
          num = '0' + num
          len++
        }
        return num
      },
      // 控制视频播放
      playVideo() {
        if (this.isPlaying) {
          this.isPlaying = false
          console.log(this.options.url)
          this.$refs.video.play()
        } else {
          this.isPlaying = true
          this.$refs.video.pause()
        }
      },
      // 视频播放完毕
      videoEnd() {
        this.$refs.video.load()
        this.isPlaying = true
        this.currentTime = 0
        if (this.isFullScreen) this.exitFullscreen()
      },
      // 重新播放
      videoLoad() {
        this.$refs.video.load()
        this.isPlaying = false
        this.$refs.video.play()
      },
      // 获取即时播放时间
      updateTime(e) {
        this.currentTime = e.target.currentTime
      },
      // 改变视频的进度
      onPercentChange(percent) {
        const currentTime = this.options.duration * percent
        console.log(currentTime)
        this.$refs.video.currentTime = currentTime
      },
      // 展示视频控制
      showVideoControl() {
        this.isShowControl = true
        console.log('abcd')
      },
      // 控制视频全屏显示
      launchFullscreen(element) {
        // 此方法不可以在異步任務中執行，否則火狐無法全屏
        if (element.requestFullscreen) {
          element.requestFullscreen()
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen()
        } else if (element.msRequestFullscreen) {
          element.msRequestFullscreen()
        } else if (element.oRequestFullscreen) {
          element.oRequestFullscreen()
        } else if (element.webkitRequestFullscreen) {
          element.webkitRequestFullScreen()
        } else {
          var docHtml = document.documentElement
          var docBody = document.body
          var videobox = this.$refs.video
          var cssText = 'width:100%;height:100%;overflow:hidden;'
          docHtml.style.cssText = cssText
          docBody.style.cssText = cssText
          videobox.style.cssText = cssText + ';' + 'margin:0px;padding:0px;'
          document.IsFullScreen = true
        }
        this.isFullScreen = true
      },
      exitFullscreen() {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen()
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen()
        } else if (document.oRequestFullscreen) {
          document.oCancelFullScreen()
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen()
        } else {
          var docHtml = document.documentElement
          var docBody = document.body
          var videobox = this.$refs.video
          docHtml.style.cssText = ''
          docBody.style.cssText = ''
          videobox.style.cssText = ''
          document.IsFullScreen = false
        }
        this.isFullScreen = false
      },
      isFull() {
        if (this.isFullScreen) {
          this.exitFullscreen()
        } else {
          this.launchFullscreen(this.$refs.video)
        }
      },
      // 检查浏览器是否是全屏状态
      runPrefixMethod(element, method) {
        var usablePrefixMethod;
        ['webkit', 'moz', 'ms', '', ''].forEach(function (prefix) {
          if (usablePrefixMethod) return
          if (prefix === '') {
            // 无前缀，方法首字母小写
            method = method.slice(0, 1).toLowerCase() + method.slice(1)
          }
          var typePrefixMethod = typeof element[prefix + method]

          if (typePrefixMethod + '' !== 'undefined') {
            if (typePrefixMethod === 'function') {
              usablePrefixMethod = element[prefix + method]()
            } else {
              usablePrefixMethod = element[prefix + method]
            }
          }
        })
        return usablePrefixMethod
      },
      _checkFullScreen() {
        window.setTimeout(() => {
          if (document.IsFullScreen) {
            this.exitFullscreen()
          }
        }, 5000)
      },
      // 当音频/视频在因缓冲而暂停或停止后已就绪时触发
      onloading() {
        this.isLoading = true
      }
    },
    components: {
      Loading,
      ProcessBar
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .video-player
    position: relative
    width: 100%
    height: 100%
    .bg-image
      z-index: 10
      margin-bottom: 10px
      width: 100%
      min-height: 0
      position: absolute
      top: 0
      left: 0
    .video
      position: absolute
      top: 0
      left: 0
      width: 100%
      z-index: 5
    .video:after {
      /* 图片垂直居中显示 */
      content: '';
      height: 100%;
      vertical-align: middle;
    }
    .video-info
      margin: 17px 5px 0 5px
      padding-bottom: 40px
      z-index: 0
      .title
        font-size: $font-size-large
        font-weight: 700
        width: 100%
        margin-bottom: 10px
      .name
        float: left
        font-size: $font-size-medium
        color: $color-text-desc
      .item
        float: left
        background-color: #448AFF
        padding: 0 10px
        color: white
        border-radius: 5px
        margin-left: 10px
      .count
        float: right
    .control
      position: absolute
      bottom: 0
      left: 0
      width: 100%
      z-index: 150
      min-height: 1px
      &.isFullControl
        z-index: 2147483648
      .bg
        height: 100%
        background-color: black
        opacity: 0.5
        z-index: 150
      .duration
        position: absolute
        bottom: 50px
        right: 5%
        padding: 0 10px
        border-radius: 10px
        background-color: white
        opacity: 0.7
      .control-container
        position: absolute
        bottom: 0px
        width: 100%
        height: 40px
        background-color: black
        opacity: 0.7
        display: flex
        align-items: center
        z-index: 150
        &.active
          background: black
          position: fixed
          bottom: 0px
          left: 0px
          z-index: 2147483648
        .control-icon
          color: white
          font-size: 25px
          line-height: 40px
          margin-left: 5px
          margin-right: 10px
        .time
          color: white
          padding: 0 5px
          font-size: $font-size-small
        .process
          flex: 1
    .big
      color: white
      font-size: 50px
      opacity: 1
      top: 50%
      left: 50%
      position: absolute
      z-index: 150
      margin-left: -25px;
      margin-top: -25px;
      .big-icon
        font-size: 50px

    .loading
      position: absolute
      top: 50%
      margin-top: -20px
    :-webkit-full-screen video {
      height: 60%;
    }

    :-moz-full-screen video {
      height: 60%;
    }

    :-ms-full-screen video {
      height: 60%;
    }

    :-o-full-screen video {
      height: 60%;
    }

    :full-screen video {
      height: 60%;
    }
    video:
    :-webkit-media-controls {
      display: none !important
    }
    video:
    :-moz-media-controls {
      display: none !important
    }
    video:
    :-ms-media-controls {
      display: none !important
    }
    video:
    :-o-media-controls {
      display: none !important
    }
    video:
    :media-controls {
      display: none !important
    }
</style>
