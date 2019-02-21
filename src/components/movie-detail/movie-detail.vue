<template>
  <transition name="detail">
    <div class="movie-detail">
      <div class="detail-head">
        <i class="icon-back" @click="back"></i>
        <h1 class="title">{{title}}</h1>
      </div>
      <scroll :data="member" class="detial-wrapper" ref="listt">
        <div>
          <div class="bg-image" :style="bgStyle" ref="bgImage"></div>
          <div class="info">
            <img class="info-img" width="38%" height="38%" :src="logo">
            <div class="info-right">
              <div class="title">{{title}}</div>
              <stars class="star" :score="star"></stars>
              <div class="time">上映时间：{{year}}</div>
              <div class="type">剧种：{{genres}}</div>
              <div class="directors">导演：{{directors}}</div>
              <div class="casts">演员：{{casts}}</div>
            </div>
          </div>
          <div class="introduction" v-show="member.length>0">
            <p class="introduction-title">{{title}}的剧情简介</p>
            <p class="text">{{intro}}</p>
          </div>
          <div class="member" v-show="member.length>0">
            <p class="member-title">影人</p>
            <show-list :data="member" :isShowStar="isShowStar"></show-list>
          </div>
          <div class="comment" v-show="member.length>0">
            <p class="comment-title">{{title}}的评论</p>
            <comment-list :data="interest"></comment-list>
          </div>
        </div>
      </scroll>
      <loading class="loading" v-show="!member.length"></loading>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {mapGetters} from 'vuex'
  import Stars from 'base/stars/stars'
  import {getMovieDetail, getMovieInterest} from 'api/movie'
  import {creatInterest} from 'common/js/interest'
  import Loading from 'base/loading/loading'
  import Scroll from 'base/scroll/scroll'
  import ShowList from 'base/show-list/show-list'
  import CommentList from 'base/comment-list/comment-list'
  import {playlistMixin} from 'common/js/mixin'
  export default {
    mixins: [playlistMixin],
    data() {
      return {
        year: '',
        intro: '',
        member: [],
        isShowStar: false,
        ShowFlag: false,
        showPic: '',
        isClick: false,
        interest: []
      }
    },
    computed: {
      title() {
        return this.movie.title
      },
      bgStyle() {
        return `background-image:url(${this.movie.img})`
      },
      logo() {
        return this.movie.img
      },
      star() {
        return this.movie.stars
      },
      genres() {
        return this.movie.genres
      },
      directors() {
        return this.movie.directors[0].name
      },
      casts() {
        return this.movie.casts
      },
      ...mapGetters([
        'movie'
      ])
    },
    mounted() {
      this._getMovieDetail(this.movie.id)
      this._getMovieInterest(this.movie.id)
    },
    methods: {
      handlePlaylist(playlist) {
        const bottom = playlist.length > 0 ? '60px' : '0px'
        this.$refs.listt.$el.style.bottom = bottom
        this.$refs.listt.refresh()
      },
      back() {
        if (this.movie.type === 2) { // 无办法中的办法。故意用一个2来限制页面范围返回的页面，type的值变化主要用在search页面上
          this.$router.back()
        } else {
          this.$router.push({
            path: '/movie'
          })
        }
      },
      _getMovieDetail(id) {
        getMovieDetail(id).then((res) => {
          this.intro = res.intro
          this.year = res.pubdate[0]
          this.member = this._normalMember(res.directors, res.actors)
        })
      },
      _normalMember(directors, actors) {
        let ret = []
        if (directors.length > 0) {
          directors.forEach((d) => {
            ret.push({
              title: d.name,
              role: d.roles[0],
              img: this.movie.img
            })
          })
        }
        actors.forEach((a) => {
          ret.push({
            title: a.name,
            role: a.roles[0],
            img: this.movie.img
          })
        })
        return ret
      },
//      获取评论
      _getMovieInterest(id) {
        getMovieInterest(id).then((res) => {
          this.interest = this._normalInterest(res.interests)
        })
      },
      _normalInterest(inter) {
        let ret = []
        inter.forEach((i) => {
          ret.push(creatInterest(i))
        })
        return ret
      }
    },
    components: {
      Loading,
      Stars,
      Scroll,
      ShowList,
      CommentList
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .movie-detail
    width: 100%
    position: fixed
    top: 0
    left: 0
    right: 0
    bottom: 0
    z-index: 0
    background-color: white
    .detail-head
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

    .detial-wrapper
      width: 100%
      position: fixed
      top: 44px
      bottom: 0px
      .bg-image
        padding-top: 70%
        background-size: cover
        transform-origin: top
        filter: blur(20px)
        z-index: 200
      .info
        position: absolute
        top: 24px
        left: 0
        display: flex
        z-index: 330
        width: 100%
        .info-img
          margin-left: 15px
        .info-right
          margin-left: 10px
          display: flex
          flex-direction: column
          color: white
          font-size: $font-size-medium
          .title
            font-size: $font-size-large-x
            font-weight: 500
          .star
            margin-top: 15px
          .time
          .directors
            margin: 7px 0
          .text
            margin-top: 7px
            font-size: $font-size-medium
          .casts
            line-height: 18px

      .introduction
        width: 95%
        margin-left: 15px
        margin-top: 0px
        .introduction-title
          color: $color-text-desc
          margin-bottom: 10px
        .text
          line-height: 19px
      .member
        width: 95%
        height: 230px
        margin-left: 15px
        margin-top: 10px
        .member-title
          color: $color-text-desc
          margin-bottom: 10px
      .comment
        width: 95%
        margin-left: 15px
        .comment-title
          color: $color-text-desc
          margin-top: 20px
          margin-bottom: 20px
    .loading
      position: absolute
      top: 500px

  .detail-enter-active, .detail-leave-active
    transition: all 0.3s

  .detail-enter, .detail-leave-to
    transform: translate3d(100%, 0, 0)


</style>
