<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box @search="onSearch" @clearQuery="onClearQuery" ref="searchBox"></search-box>
      <radio-box class="radio" @changeRadio="onChangeHotKey"></radio-box>
    </div>
    <div class="shortcut-wrapper" ref="shortcutWrapper" v-show="searchData.length===0">
      <scroll class="shortcut" ref="shortCut" :data="shortcut">
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul v-show="isShowHotKey===0">
              <li class="item" v-for="item in hotMusicList" @click.stop="addQuery(item)">
                <span>{{item}}</span>
              </li>
            </ul>
            <ul v-show="isShowHotKey===1">
              <li class="item" v-for="item in hotMovieList" @click.stop="selectMovie(item)">
                <span>{{item.title}}</span>
              </li>
            </ul>
          </div>
          <div class="search-history" v-show="searchHistory.length>0">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click="showConfirm">
            <i class="icon-lajitong"></i>
          </span>
            </h1>
            <search-list @select="addQuery" @delete="deleteOne" :searches="searchHistory"></search-list>
          </div>
        </div>
      </scroll>
    </div>
    <div class="search-result" v-show="searchData.length>0">
      <suggest ref="suggestList"
               :data="searchData"
               :hasMore="hasMore"
               :isShowHotKey="isShowHotKey"
               @selectItem="selectItem"
               @pullingUp="searchMore"
      ></suggest>
    </div>
    <div class="no-result" v-if="isShowSuggestList&&searchData.length===0">
      <no-result></no-result>
    </div>
    <confirm ref="confirm" @confirm="clearALL"></confirm>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import SearchBox from 'base/search-box/search-box'
  import RadioBox from 'base/radio-box/radio-box'
  import Suggest from 'components/suggest/suggest'
  import NoResult from 'base/no-result/no-result'
  import SearchList from 'base/search-list/search-list'
  import Scroll from 'base/scroll/scroll'
  import Confirm from 'base/confirm/confirm'
  import {getSearchMovie, getHotKey, searchMusic} from 'api/search'
  import {ERR_OK} from 'api/config'
  import {getNewMovie} from 'api/movie'
  import {createMovie} from 'common/js/movie'
  import {createMusic} from 'common/js/newmusic'
  import {mapMutations, mapActions, mapGetters} from 'vuex'
  import {searchMixin} from 'common/js/mixin'
  const perpage = 20  // 展示结果的数量
  export default {
    mixins: [searchMixin],
    data() {
      return {
        hotMusicList: [],
        hotMovieList: [],
        searchData: [] // 搜索内容
      }
    },
    computed: {
      shortcut() {
        return this.hotMusicList.concat(this.searchHistory)
      },
      ...mapGetters([
        'playlist'
      ])
    },
    created() {
      this._getNewMusic()
      this._getNewMovie()
    },
    methods: {
      // 获取热门歌曲的结果
      _getNewMusic() {
        getHotKey().then((res) => {
          if (res.code === ERR_OK) {
            this.hotMusicList = this._normalGetNewMusic(res.data.hotkey.slice(0, 10))
          }
        })
      },
      _normalGetNewMusic(k) {
        let ret = []
        k.forEach((i) => {
          ret.push(i.k)
        })
        return ret
      },
      // 获取热门电影的结果
      _getNewMovie() {
        let count = 10
        getNewMovie(count).then((res) => {
          this.hotMovieList = this._normalNewMovie((res.subjects))
          this.filter(this.hotMovieList)
        })
      },
      _normalNewMovie(movies) {
        let ret = []
        movies.forEach((m) => {
          ret.push(createMovie(m))
        })
        return ret
      },
      selectMovie(movie) {
        this.$router.push({
          path: `/search/movie/`,
          name: 'movie',
          params: {id: movie.id}
        })
        this.setMovie(movie)
      },
      // 添加搜索名字到输入框里面
      addQuery(query) {
        this.$refs.searchBox.setQuery(query)
      },
      // 用于为返回的数据中的type值修改为2
      filter(m) {
        m.forEach((i) => {
          i.type = i.type + 1
        })
        return m
      },
      // 改变热门搜索的界面和搜索列表结果的页面
      onChangeHotKey(newRadioNum) {
        this.isShowHotKey = newRadioNum  // 0是音乐，1是电影
        this.onClearQuery()
      },
      // 获取搜索结果
      _getSearchList(query, count) {
        if (this.isShowHotKey === 0) {
          searchMusic(query, this.page, this.zhida, perpage).then((res) => {
            this.searchData = this._normalMusic(res.data.song.list)
          })
        } else {
          getSearchMovie(query, count).then((res) => {
            this.searchData = res.subjects
            this.searchData = this._normalNewMovie(res.subjects)
            this.filter(this.searchData)
            this.$refs.suggestList.finishPullUp()
          })
        }
      },
      // 初始化各类的数据
      _normalNewMusic(data) {
        let ret = []
        data.forEach((d) => {
          ret.push(createMusic(d))
        })
        return ret
      },
      selectItem(item) {
        if (this.isShowHotKey === 0) {
          this.insertSong(item)
          this.saveSearchHistory(item)
        } else {
          this.selectMovie(item)
        }
        this.onClearQuery()
      },
      // 清除搜索结果
      onClearQuery() {
        this.isShowSuggestList = false
        this.searchData = []
        this.handlePlaylist(this.playlist)
      },
      // 适应mini player 适应高度
      handlePlaylist(playlist) {
        const bottom = playlist.length > 0 ? '60px' : '0'
        this.$refs.shortcutWrapper.style.bottom = bottom
        this.$refs.shortCut.refresh()
      },
      // 删除缓存
      deleteOne(query) {
        console.log(query)
        this.deleteHistory(query)
      },
      // 弹出confirm窗口
      showConfirm() {
        this.$refs.confirm.show()
      },
      // 删除所有缓存
      clearALL() {
        this.clearHistory()
        this.$refs.confirm.hide()
      },
      ...mapMutations({
        setMovie: 'SET_MOVIE'
      }),
      ...mapActions([
        'deleteHistory',
        'clearHistory'
      ])
    },
    components: {
      SearchBox,
      RadioBox,
      Suggest,
      NoResult,
      SearchList,
      Scroll,
      Confirm
    },
    watch: {
      count(newValue) {
        this.onSearch(this.query, newValue)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .search
    width: 100%
    margin-top: 10px
    .search-box-wrapper
      text-align: center
      .radio
        margin-top: 10px
        display: flex
        margin-left: 20px

    .shortcut-wrapper
      width: 90%
      top: 170px
      bottom: 0px
      margin-left: 20px
      position: fixed
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 0px
          width: 100%
          .title
            font-size: $font-size-medium
            margin-bottom: 10px
          .item
            display: inline-block
            font-size: $font-size-medium
            background-color: #37c359
            height: 24px
            line-height: 24px
            padding-left: 15px
            padding-right: 15px
            margin-right: 10px
            color: white
            margin-bottom: 10px

        .search-history
          position: relative
          .title
            display: flex
            align-items: center
            .text
              flex: 1
            .clear
              font-size: $font-size-large-x

    .search-result
      position: fixed
      top: 150px
      bottom: 0
      width: 97%
    .no-result
      padding-top: 30%
</style>
