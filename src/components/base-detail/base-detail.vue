<template>
  <div class="base-list" ref="baseList">
    <div class="head" ref="head">
      <i class="icon-back" @click="back"></i>
      <h1 class="title">最新华语新专辑</h1>
    </div>
    <scroll class="base-wrapper" :data="interests" ref="listt">
      <div>
        <div class="bg-image" :style="bgStyle" ref="bgImage"></div>
        <div class="info">
          <img class="info-img" width="32%" height="32%" :src="cd.image" alt="" @click="dialog">
          <div class="album">{{cdDetail.name}}</div>
          <div class="tags">
            <span class="tag-item" v-for="(item,index) in cdDetail.tags">{{item}}</span>
          </div>
        </div>
        <div data="songs" class="list-wrapper" ref="listWrapper">
          <div class="cd-disc">
            <div class="title">
              唱片简介
            </div>
            <div class="text" ref="moreshow">
              <p class="text-container">{{cdDetail.info}}</p>
            </div>
            <div class="songs-list">
              <div class="songs-list-title">
                曲目列表
              </div>
              <ul class="songs-list-wrapper">
                <li v-for="(item,index) in cdDetail.list">{{index}}、{{item.name}}</li>
              </ul>
            </div>
            <div class="comment">
              <div class="comment-title">热点评论</div>
              <comment-list :data="interests"></comment-list>
            </div>
          </div>
        </div>
      </div>
    </scroll>
    <dialogs :data="image" :showFlag="showFlag" @dialogClose="dialogFalse" :choseType="choseType"></dialogs>
  </div>
</template>

<script type="text/ecmascript-6">
import Stars from 'base/stars/stars'
import Scroll from 'base/scroll/scroll'
import Dialogs from 'base/dialog/dialog'
import {getCdInfo, getinterests} from 'api/recommend'
import {mapGetters} from 'vuex'
import {playlistMixin} from 'common/js/mixin'
import {createNewMusicDetail} from 'common/js/newMusicDetail'
import CommentList from 'base/comment-list/comment-list'
import moment from 'moment'
export default {
  mixins: [playlistMixin],
  data() {
    return {
      cdDetail: {},
      interests: [],
      cdDisc: '',
      showMore: true,
      showFlag: false,
      choseType: 1,
      stars: 10
    }
  },
  computed: {
    bgStyle() {
      return `background-image:url(${this.cdDetail.image})`
    },
    image() {
      return this.cdDetail.image
    },
    ...mapGetters([
      'cd'
    ])
  },
  created() {
    this._getCdInfo()
  },
  mounted() {
  },
  methods: {
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '60px' : '0px'
      this.$refs.listt.$el.style.bottom = bottom
      this.$refs.listt.refresh()
    },
    back() {
      this.$router.back()
    },
    more() {
      if (this.showMore) {
        this.$refs.moreshow.style.height = '100%'
        this.$refs.listt.refresh()
        this.showMore = false
      } else {
        this.showMore = true
      }
    },
    format(flag) {
      return flag ? '展开' : '关闭'
    },
//      窗口展示
    dialog() {
      if (!this.showFlag) {
        this.showFlag = true
        return
      }
    },
    dialogFalse(flag) {
      this.showFlag = flag
    },
    _getCdInfo() {
      getCdInfo(this.cd.id).then((res) => {
        this.cdDetail = createNewMusicDetail(res.data.result)
        this._getinterests()
      })
    },
    _initImgUrl(url) {
      return url.replace(/img3/, 'img1')
    },
    _getinterests () {
      getinterests().then((res) => {
        this.interests = this._normalComment(res.data.hotComments)
      })
    },
    _normalComment(comments) {
      let ret = []
      comments.forEach((c) => {
        ret.push({
          name: c.user.nickname || '',
          comment: c.content,
          img: c.user.avatarUrl,
          time: this._format(c.time)
        })
      })
      return ret
    },
    _format(time) {
      return moment(time).format('MMMM Do YYYY, h:mm:ss a')
    }
    // 展示更多
    // 得出窗口的宽度
    /*
    _getInnerWidth () {
      let cdWidth = this.$refs.listWrapper.offsetWidth
      let fontSize = 14
      let columLength = cdWidth / fontSize * 5
      this.sliceFromArray(columLength - 7)
    },
    sliceFromArray(num) {
      let _initArray = this.cdDetail.intro.slice(0, num)
      let ret = []
      for (let i = 0; i < _initArray.length; i++) {
        ret.push(_initArray[i])
      }
      ret.push('...[展开]')
      this.cdDisc = ret.join('')
    }
    */
  },
  components: {
    Dialogs,
    Stars,
    Scroll,
    CommentList
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .base-list
    position: fixed
    top: 0
    bottom: 0
    width: 100%
    left: 0
    right: 0
    .head
      position: fixed
      top: 0
      display: flex
      align-items: center
      height: 44px
      width: 100%
      z-index: 630
      background-color: white
      .icon-back
        font-size: $font-size-large-x
        display: block
        color: $color-text
        margin-left: 10px
      .title
        text-align: center
        flex: 0.9
        z-index: 10
        color: $color-text
        font-size: $font-size-large
    .base-wrapper
      position: fixed
      bottom: 0
      top: 44px
      width: 100%
      .bg-image
        height: 0
        padding-top: 70%
        background-size: cover
        transform-origin: top
        filter: blur(2px)
        z-index: 200
      .info
        position: absolute
        top: 54px
        left: 0
        display: flex
        flex-direction: column
        z-index: 330
        width: 100%
        align-items: center
        color: white
        .info-img
          border-radius: 50%
        .album
          margin: 7px 0
          font-size: $font-size-medium-x
        .tags
          display: flex
          .tag-item
            background-color: #9999
            border-radius: 10px
            color: $color-text
            padding: 5px 10px
            margin-left: 10px
      .list-wrapper
        width: 94%
        margin-left: 13px
        margin-top: 13px
        .cd-disc
          .title
            color: $color-text-desc
          .text
            position: relative
            padding: 15px 0
            width: 100%
            height: 76px
            overflow: hidden
            .text-container
              font-size: $font-size-medium
              width: 100%
              word-wrap: break-word
              white-space: pre-line
              line-height: 18px
            .text-more
              position: absolute
              top: 87px
              right: 0
              background-color: white
              color: #9AB45A
          .songs-list
            margin-top: 10px
            width: 100%
            .songs-list-title
              width: 100%
              color: $color-text-desc
            .songs-list-wrapper
              margin-top: 10px
              font-size: $font-size-medium
          .comment
            margin-top: 25px
            width: 100%
            .comment-title
              padding: 10px 0
              color: $color-text-desc
            .comment-wrapper
              margin-top: 10px
              .comment-container
                display: flex
                width: 100%
                flex-direction: column
                margin-bottom: 28px
                .comment-head
                  display: flex
                  .comment-logo
                    margin-right: 10px
                    border-radius: 50%
                  .comment-info
                    display: flex
                    flex-direction: column
                    .comment-info-top
                      display: flex
                      flex-direction: row
                      .comment-name
                        font-weight: 600
                      .comment-start
                        padding-top: 2px
                    .comment-date
                      font-size: $font-size-small
                      color: $color-text-desc
                .comment-text
                  padding-left: 10%
                  line-height: 16px
                  font-size: $font-size-medium
        .song-list-wrapper
          padding-top: 5px


</style>
