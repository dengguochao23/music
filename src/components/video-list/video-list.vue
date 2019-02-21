<template>
  <div>
    <scroll class="video-list"
            ref="VideoList"
            :data="videoList"
            :isPullUpLoad="pullUpLoad"
            :probeType="probeType"
            :listenScroll="listenScroll"
            @pullingUp="pullingUp"
    >
      <div ref="list">
        <div v-for="item in videoList">
          <video-window :data="item" @showShare="onShowShare"></video-window>
        </div>
      </div>
    </scroll>
    <div class="to-top" @click="ToTop">
      <i class="icon-dingceng"></i>
    </div>
    <share class="share" :isShowShare="isShowShare" @cancel="cancel"></share>
  </div>
</template>

<script type="text/ecmascript-6">
  // import {getVideoList} from 'api/video'
  import {createVideo} from 'common/js/video'
  import VideoWindow from 'base/video-window/video-window'
  import Scroll from 'base/scroll/scroll'
  import Share from 'base/share/share'
  import axios from 'axios'
  const debug = process.env.NODE_ENV !== 'production'
  export default {
    data() {
      return {
        videoList: [],
        probeType: 3,
        listenScroll: true,
        pullUpLoad: true,
        src: 'http://mat1.gtimg.com/www/mobi/2017/image/share-wx.svg',
        isShowShare: false
      }
    },
    created() {
      this._getVideoList()
    },
    methods: {
      // 获取视频的数据列表，并且初始化数据
      _getVideoList() {
        const url = debug ? '/api/videos' : 'http://www.dengguochao.top/music/api/videos'
        axios.get(url).then((res) => {
          this.videoList = this.videoList.concat(this._normalVideoData(res.data.data))
          console.log(this.videoList)
        })
//        timer = setInterval(() => {
//          getVideoList().then((res) => {
//            this.videoList = this.videoList.concat(this._normalVideoData(res.data))
//            console.log(this.isPullUpLoad)
//          })
//        }, 2000)
      },
      _normalVideoData(videoData) {
        let ret = []
        videoData.forEach((v) => {
          ret.push(createVideo(v))
        })
        return ret
      },
      // 上拉刷新
      pullingUp() {
        this._getVideoList()
      },
      // 置顶
      ToTop() {
        let list = this.$refs.list.children[0]
        this.$refs.VideoList.scrollToElement(list, 700)
      },
      // 控制分享
      onShowShare(flag) {
        this.isShowShare = flag
      },
      cancel() {
        this.isShowShare = false
      }
    },
    watch: {
      videoList() {
        // clearInterval(timer)
        this.$refs.VideoList.finishPullUp()
      }
    },
    components: {
      VideoWindow,
      Scroll,
      Share
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .video-list
    position: fixed
    top: 49px
    left: 0
    bottom: 0
    width: 100%
    right: 0
    overflow: hidden
    z-index: 1

  .to-top
    z-index: 1
    width: 50px
    height: 50px
    position: fixed
    bottom: 60px
    right: 20px
    background-color: #ccc
    text-align: center
    border-radius: 50%
    .icon-dingceng
      line-height: 50px

  .share
    width: 100%
    position: fixed
    bottom: 0px
    left: 0
    z-index: 2

</style>
