<template>
  <transition name="more">
    <div class="more-wrapper">
      <div class="head">
        <i class="icon-back" @click="back"></i>
        <h1 class="title">{{title}}</h1>
      </div>
      <Scroll :isPullUpLoad="pullUpLoad"
              :probeType="probeType"
              :listenScroll="listenScroll"
              @pullingUp="pullingUp"
              :data="newMovies"
              class="more-container"
              ref="scrollList"
      >
        <div ref="list">
          <div class="single-more" v-for="item in newMovies" @click.prevent="selectItem(item)">
            <div class="img">
              <img width="100%" height="100%" v-lazy="item.img" alt="">
            </div>
            <div class="single-right">
              <p class="name">{{item.title}}</p>
              <p class="genres">影片风格:{{item.genres}}</p>
              <p class="directors">导演：{{filterDirectors(item.directors)}}</p>
              <p class="casts">演员：{{item.casts}}</p>
              <stars :score="item.stars" class="stars"></stars>
            </div>
          </div>
          <loading v-if="isShowPullUp" class="PullUpLoading"></loading>
          <div class="foot" v-if="isFoot">
            <hr>
            <p>
              亲，已经到达底部
            </p>
          </div>
        </div>
      </Scroll>
      <loading class="loading" v-if="!newMovies.length"></loading>
    </div>
    <router-view></router-view>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {getMoreMovie} from 'api/movie'
  import {createMovie} from 'common/js/movie'
  import Stars from 'base/stars/stars'
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import {mapGetters, mapMutations} from 'vuex'
  import {playlistMixin} from 'common/js/mixin'
  const MAX_STARTS = 19

  export default {
    mixins: [playlistMixin],
    data() {
      return {
        newMovies: [],
        movieId: '',
        probeType: 3,
        listenScroll: true,
        scrollY: '',
        listHeight: '',
        pullUpLoad: true,
        isShowPullUp: false,
        start: 0,
        isFoot: false
      }
    },
    computed: {
      title() {
        return this.movieItem.name
      },
      ...mapGetters([
        'movieItem'
      ])
    },
    mounted() {
      setTimeout(() => {
        this._getMoreMovie(this.start)
        if (this.newMovies.length === 1) {
          this.start = 0
          this._getMoreMovie(this.start)
        }
      }, 20)
    },
    methods: {
      selectItem(item) {
        this.$router.push({
          name: 'movie-detail',
          params: {id: item.id}
        })
        this.setMovie(item)
      },
      handlePlaylist(playlist) {
        const bottom = playlist.length > 0 ? '80px' : '0px'
        this.$refs.scrollList.$el.style.bottom = bottom
        this.$refs.scrollList.refresh()
      },
      back() {
        this.$router.back()
        this._getMoreMovie(this.start)
      },
//      这个是一种方法，来处理导演的数据
      filterDirectors(d) {
        let ret = []
        d.forEach((item) => {
          ret.push(item.name)
        })
        return ret.join('/')
      },
//      设置开始获取数值的值
      _setStart() {
        let initStart = this.start
        if (initStart < MAX_STARTS) {
          this.start = initStart + 5
        } else {
          return
        }
        return this.start
      },
//      这是获取数据值
      _getMoreMovie(start) {
        let count = 5
        let urlName = this.movieItem.urlName
        getMoreMovie(start, count, urlName).then((res) => {
          let movies = this._normalMovie(res.subjects)
          movies.forEach((item) => {
            this.newMovies.push(item)
          })
        }).catch(() => {
          this.isShowPullUp = false
          this.pullUpLoad = false
          this.isFoot = true
        })
      },
      _normalMovie(list) {
        let ret = []
        list.forEach((item) => {
          ret.push(createMovie(item))
        })
        return ret
      },
//      上拉刷新
      pullingUp() {
        console.log('finish')
        this.isShowPullUp = true
        this._setStart()
        this.$refs.scrollList.refresh()
      },
      ...mapMutations({
        setMovie: 'SET_MOVIE'
      })
    },
    watch: {
      newMovies(newY) {
        this.$refs.scrollList.refresh()
        this.$refs.scrollList.finishPullUp()
        this.isShowPullUp = false
      },
      start(newStart) {
        if (newStart < MAX_STARTS) {
          this._getMoreMovie(newStart)
        } else {
          this.isShowPullUp = false
          this.pullUpLoad = false
          this.isFoot = true
        }
      }
    },
    components: {
      Stars,
      Scroll,
      Loading
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .more-wrapper
    position: fixed
    top: 0
    left: 0
    right: 0
    bottom: 0
    background-color: white
    z-index: 100
    .head
      position: flex
      top: 0
      display: flex
      align-items: center
      height: 44px
      background-color: white
      z-index: 500
      .icon-back
        font-size: $font-size-large-x
        display: block
        color: $color-text
        margin-left: 10px
      .title
        text-align: center
        flex: 1
        z-index: 10
        color: $color-text
        font-size: $font-size-large
    .more-container
      width: 100%
      position: fixed
      top: 44px
      bottom: 0
      right: 0
      left: 0
      z-index: -200
      .single-more
        margin-left: 10px
        margin-bottom: 20px
        display: flex

        justify-content: flex-start
        background-color: #dbdbdb
        .img
          flex: 1
          width: 110px

        .single-right
          display: flex
          width: 200px
          margin-left: 15px
          flex-direction: column
          p
            margin-top: 10px
          .name
            font-size: $font-size-large-x
            white-space: nowrap
            margin-top: 20px
            overflow: hidden; /*自动隐藏文字*/
            text-overflow: ellipsis; /*文字隐藏后添加省略号*/
            width: 210px;
          .stars
            margin-top: 10px
      .PullUpLoading
        position: relative
        width: 100%
        height: 20px
        display: block
        text-align: center
      .foot
        position: relative
        margin-top: 20px
        width: 100%
        text-align: center
        height: 30px

    .loading
      position: absolute
      top: 50%

  .more-enter-active, .more-leave-active
    transition: all 0.3s

  .more-enter, .more-leave-to
    transform: translate3d(100%, 0, 0)
</style>
