<template>
  <div class="recommend" ref="recommend">
    <scroll ref="scroll" class="recommend-content" :data="newMusic">
      <div>
        <div v-if="recommends.length" class="slider-wrapper">
          <slider>
            <div v-for="item in recommends">
              <a :href="item.linkUrl">
                <img class="needsclick" @load="loadImage" :src="item.picUrl">
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <div class="hot-music">
            <div class="item">
              <h2>推荐音乐</h2>
            </div>
            <ul>
              <li @click="selectDiscItem(item)" class="hot-list" v-for="item in hotMusic">
                <div class="text">
                  <h3 class="name" v-html="item.creator.name"></h3>
                  <p class="desc" v-html="item.dissname"></p>
                </div>
                <div class="icon">
                  <img v-lazy="item.imgurl" style="width: 95px;height: 95px;">
                </div>
              </li>
            </ul>
          </div>
          <div class="new-music">
            <div class="item">
              <h2>最新华语音乐</h2>
            </div>
            <ul>
              <li @click="selectNewMusicItem(item)" class="new-music-list" v-for="item in newMusic">
                <div class="icon">
                  <img v-lazy="item.image" style="width: 95px;height: 95px;">
                </div>
                <div class="text">
                  <h3 class="name" v-html="item.title"></h3>
                  <p class="desc" v-html="item.info"></p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <m-footer class="footer" :footName="'音乐'" v-show="newMusic.length"></m-footer>
      </div>
      <div class="recommend-container">
        <loading v-show="!hotMusic.length"></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import Slider from 'base/slider/slider'
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import MFooter from 'components/m-footer/m-footer'
  import {getRecommend, getHotmusicList, getNewMusic} from 'api/recommend'
  import Stars from 'base/stars/stars'
  import {ERR_OK} from 'api/config'
  import {playlistMixin} from 'common/js/mixin'
  import {mapMutations} from 'vuex'
  import {createMusic} from 'common/js/newmusic'
  export default {
    mixins: [playlistMixin],
    data() {
      return {
        recommends: [],
        hotMusic: [],
        newMusic: []
      }
    },
    created() {
      this._getRecommend()
      this._getHotmusicList()
      this._getNewMusic()
    },
    methods: {
      handlePlaylist(playlist) {
        const bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.recommend.style.bottom = bottom
        this.$refs.scroll.refresh()
      },
      _getRecommend() {
        getRecommend().then((res) => {
          if (res.code === ERR_OK) {
            this.recommends = res.data.slider
          }
        })
      },
      _getHotmusicList() {
        getHotmusicList().then((res) => {
          if (res.code === ERR_OK) {
            this.hotMusic = res.data.list
          }
        })
      },
      _getNewMusic () {
        getNewMusic().then((res) => {
          this.newMusic = this._normalNewMusic(res.data.result)
        })
      },
      _normalNewMusic(data) {
        let ret = []
        data.forEach((d) => {
          ret.push(createMusic(d))
        })
        return ret
      },
      loadImage() {
        if (!this.checkLoad) {
          this.$refs.scroll.refresh()
          this.checkLoad = true
        }
      },
      selectDiscItem(item) {
        this.$router.push({
          path: `/recommend/disc${item.dissid}`,
          name: `disc`,
          params: {id: item.dissid}
        })
        this.setDisc(item)
      },
      selectNewMusicItem(item) {
        this.$router.push({
          path: `/recommend/new-music/`,
          name: 'new-music',
          params: {id: item.id}
        })
        this.setCd(item)
      },
      ...mapMutations({
        setDisc: 'SET_DISC',
        setCd: 'SET_CD'
      })
    },
    components: {
      Slider,
      Scroll,
      Loading,
      Stars,
      MFooter
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .recommend
    position: fixed
    width: 100%
    top: 44px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        width: 100%
        position: relative
        overflow: hidden
      .recommend-list
        .item
          font-size: $font-size-large
          height: 28px
          width: 35%
          line-height: 28px
          background-color: $text-background-color
          margin: 20px 0 0 15px
        .hot-list
          display: flex
          box-sizing: border-box
          margin: 20px 10px 10px 15px
          padding-bottom: 20px
          border-bottom: 1px solid #EDEDED
          .icon
            width: 95px
            flex: 0 0 95px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
            .desc
              color: $color-text-desc
        .new-music-list
          display: flex
          box-sizing: border-box
          margin: 20px 10px 10px 15px
          padding-bottom: 20px
          border-bottom: 1px solid #EDEDED
        .icon
          width: 95px
          flex: 0 0 95px
          padding-right: 20px
        .text
          display: flex
          flex-direction: column
          .name
            margin: 10px 0 10px 0
            font-weight: 700
          .stars
            display: flex
            margin-bottom: 5px
            .score
              margin-left: 5px
          .desc
            color: $color-text-desc
            font-size: $font-size-small
      .footer
        margin-top: 10px
        height: 25px
        width: 100%

  .recommend-container
    position: absolute
    width: 100%
    top: 50%
</style>
