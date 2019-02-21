<template>
  <scroll :data="newMovies" class="show-window" ref="listt">
    <div class="show-wrapper">
      <div class="new-movie">
        <div class="show-window-head">
          <div class="title">最新电影</div>
          <div class="more" @click="selectMore('最新电影','in_theaters')">更多</div>
        </div>
        <div class="show-container">
          <show-list :data="newMovies" @selectItem="selectMovie"></show-list>
        </div>
      </div>
      <div class="next-movie">
        <div class="show-window-head">
          <div class="title">即将上映</div>
          <div class="more" @click="selectMore('即将上映','coming_soon')">更多</div>
        </div>
        <div class="show-container">
          <show-list :data="nextMovies" @selectItem="selectMovie"></show-list>
        </div>
      </div>
      <div class="top-movie">
        <div class="show-window-head">
          <div class="title">Top250</div>
          <div class="more" @click="selectMore('Top250','top250')">更多</div>
        </div>
        <div class="show-container">
          <show-list :data="topMovies" @selectItem="selectMovie"></show-list>
        </div>
      </div>
    </div>
    <router-view></router-view>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import ShowList from 'base/show-list/show-list'
  import Scroll from 'base/scroll/scroll'
  import {getNewMovie, getNextMovie, getTopMovie} from 'api/movie'
  import {createMovie} from 'common/js/movie'
  import {mapMutations} from 'vuex'
  import {playlistMixin} from 'common/js/mixin'
  export default {
    mixins: [playlistMixin],
    data() {
      return {
        newMovies: [],
        nextMovies: [],
        topMovies: [],
        movieData: []
      }
    },
    created() {
      this._getNewMovie()
      this._getNextMovie()
      this._getTopMovie()
    },
    methods: {
      handlePlaylist(playlist) {
        const bottom = playlist.length > 0 ? '60px' : '0px'
        this.$refs.listt.$el.style.bottom = bottom
        this.$refs.listt.refresh()
      },
      _getNewMovie() {
        let count = 5
        getNewMovie(count).then((res) => {
          this.newMovies = this._normalMovie(res.subjects)
        })
      },
      _getNextMovie() {
        let count = 5
        getNextMovie(count).then((res) => {
          this.nextMovies = this._normalMovie(res.subjects)
        })
      },
      _getTopMovie() {
        let count = 4
        getTopMovie(count).then((res) => {
          this.topMovies = this._normalMovie(res.subjects)
        })
      },
      _normalMovie(data) {
        let ret = []
        data.forEach((item) => {
          ret.push(createMovie(item))
        })
        return ret
      },
      selectMovie(item) {
        this.setMovie(item)
        this.$router.push({
          name: 'movie-detail',
          params: {id: item.id}
        })
      },
      selectMore(moreName, url) {
        this.setMovieItem({
          name: moreName,
          urlName: url,
          count: 10
        })
        this.$router.push({
          name: 'more'
        })
      },
      ...mapMutations({
        setMovie: 'SET_MOVIE',
        setMovieItem: 'SET_MOVIE_ITEM'
      })
    },
    components: {
      ShowList,
      Scroll
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .show-window
    width: 95%
    position: fixed
    top: 49px
    left 10px
    bottom: 0
    z-index: 0
    overflow: hidden
    .show-wrapper
      .new-movie
        margin-top: 10px
        height: 230px
        .show-window-head
          display: flex
          align-items: center
          justify-content: space-between
          .title
            font-size: $font-size-large
          .more
            font-size: $font-size-medium-x
            color: $color-theme
            padding-right: 25px
      .next-movie
        height: 230px
        padding-right: 15px
        .show-window-head
          display: flex
          align-items: center
          justify-content: space-between
          .title
            font-size: $font-size-large
          .more
            font-size: $font-size-medium-x
            color: $color-theme
            padding-right: 25px
      .top-movie
        height: 230px
        padding-right: 15px
        .show-window-head
          display: flex
          align-items: center
          justify-content: space-between
          .title
            font-size: $font-size-large
          .more
            font-size: $font-size-medium-x
            color: $color-theme
            padding-right: 25px

</style>
