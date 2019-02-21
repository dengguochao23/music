<template>
  <div class="video-container">
    <video-player class="video-player-box" :options="data" :vurl="vurl"></video-player>
    <div class="video-info">
      <p class="title">{{title}}</p>
      <p class="name">{{name}}</p>
      <p class="item">{{item}}</p>
      <p class="count">{{count}}次播放</p>
      <i class="icon-fenxiang" @click="share"></i>
    </div>
    <loading class="loading" v-if="false"></loading>
  </div>
</template>

<script type="text/ecmascript-6">
  import {getVideoDetail} from 'api/video'
  import Loading from 'base/loading/loading'
  import VideoPlayer from 'base/video-player/video-player'
  export default {
    data() {
      return {
        isPlaying: true,
        videoUrl: '',
        currentTime: 0,
        isShowControl: false,
        isFullScreenChange: false,
        isFullScreen: false,
        vurl: ''
      }
    },
    props: {
      data: {
        type: Object,
        default: {}
      }
    },
    computed: {
      title() {
        return this.data.title
      },
      name() {
        return this.data.name
      },
      item() {
        return this.data.item
      },
      count() {
        return this.data.count
      }
    },
    created() {
      this._getVideoDetail(this.data.id)
    },
    methods: {
      // 这是用来获取单个video的数据
      _getVideoDetail(id) {
        getVideoDetail(id).then((res) => {
          let url = res.vl.vi[0].ul.ui[0].url
          let ID = id
          let fvkey = res.vl.vi[0].fvkey
          this.vurl = `${url}${ID}.mp4?sdtfrom=v1103&guid=216d723e533b9f4e40dd4b334c443f4f&vkey=${fvkey}`
        })
      },
      // 初始化视频的链接
      _normalVideoUrl(url) {
        for (let i = 0; i < url.length; i++) {
          let u = url[i]
          if (u) {
            return u.url
          }
        }
      },
      // 分享
      share() {
        this.$emit('showShare', true)
      }
    },
    components: {
      Loading,
      VideoPlayer
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .video-container
    position: relative
    width: 100%
    .video-player-box
      width: 100%
      z-index: 5
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
      top: 0
      left: 0
      width: 100%
      z-index: 150
      min-height: 1px
      .bg
        height: 100%
        background-color: black
        opacity: 0.5
        z-index: 150
      .big
        color: white
        font-size: 50px
        opacity: 1
        position: absolute
        top: 38%
        left: 45%
        z-index: 150
      .duration
        position: absolute
        bottom: 10%
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
    .loading
      position: absolute
      top: 25%
    .full-screen
      width: 100% !important
      height: 700px !important
      position: fixed !important
      top: 0
      left: 0
      bottom: 0
      right: 0
      opacity: 1
      z-index: 999
      overflow: hidden
      background-color: black
      .full-screen-control
        width: 100%
        height: 50px
        background-color: black
        position: fixed
        top: 0px
        left: 0px
        display: flex
        align-items: center
        .control-icon
          color: white
          font-size: 32px
        .time
          color: white
          padding: 0 5px
          font-size: $font-size-small
        .process
          flex: 1
</style>
