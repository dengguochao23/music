<template>
  <transition name="slide">
    <div class="add-song" v-show="showFlag">
      <div class="header">
        <h1 class="title">添加歌曲列表</h1>
        <div class="close" @click="hide">
          <i class="icon-close"></i>
        </div>
      </div>
      <div class="search-box-wrapper">
        <search-box placeholder="请输入你想搜索的歌曲" @search="onSearch" @clearQuery="onClearQuery"></search-box>
      </div>
      <div class="shortcut">
        <switches @switch="switchItem" :currentIndex="currentIndex" :switches="switches"></switches>
        <scroll v-show="searchData.length===0&&currentIndex===0"
                ref="searchHistoryList"
                class="list-wrapper"
                :data="searchHistory">
          <song-list :songs="searchHistory" @select="selectSong"></song-list>
        </scroll>
        <scroll
          ref="playHistoryList"
          class="list-wrapper"
          :data="playHistory"
          v-show="searchData.length===0&&currentIndex===1"
        >
          <song-list :songs="playHistory" @select="selectSong"></song-list>
        </scroll>
      </div>
      <div class="search-result" v-show="searchData.length>0">
        <suggest ref="suggestList" :data="searchData" @pullingUp="searchMore" @selectItem="selectItem"></suggest>
      </div>
      <top-tip ref="toptip">
        <div class="top-tip-title">歌曲--{{topTipTitle}}</div>
        <div class="top-tip-text">已经添加至列表那里了，亲</div>
      </top-tip>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import SearchBox from 'base/search-box/search-box'
  import Switches from 'base/switches/switches'
  import Suggest from 'components/suggest/suggest'
  import Song from 'common/js/song'
  import SongList from 'base/song-list/song-list'
  import Scroll from 'base/scroll/scroll'
  import TopTip from 'base/top-tip/top-tip'
  import {searchMixin} from 'common/js/mixin'
  import {searchMusic} from 'api/search'
  import {mapGetters} from 'vuex'
  const perpage = 20  // 展示结果的数量
  export default {
    mixins: [searchMixin],
    data() {
      return {
        showFlag: false,
        currentIndex: 0,
        switches: [
          {name: '搜索历史'},
          {name: '最近播放'}
        ],
        searchData: [],
        topTipTitle: ''
      }
    },
    computed: {
      ...mapGetters([
        'playHistory'
      ])
    },
    methods: {
      // 组件展示
      show() {
        this.showFlag = true
        setTimeout(() => {
          this.$refs.searchHistoryList.refresh()
          this.$refs.playHistoryList.refresh()
        }, 50)
      },
      hide() {
        this.showFlag = false
      },
      // 改变开关的展示
      switchItem(index) {
        this.currentIndex = index
      },
      // 获取搜索结果
      _getSearchList(query, count) {
        searchMusic(query, this.page, this.zhida, perpage).then((res) => {
          this.searchData = this._normalMusic(res.data.song.list)
        })
      },
      // 清除搜索框内容，并隐藏suggest
      onClearQuery() {
        this.isShowSuggestList = false
        this.searchData = []
        console.log(this.searchHistory)
      },
      // 选取歌曲
      selectItem(item) {
        this.insertSong(item)
        this.saveSearchHistory(new Song(item))
        this.onClearQuery()
      },
      // 选取搜索历史的歌曲
      selectSong(item) {
        this.insertSong(new Song(item))
        this.topTipTitle = item.name
        this.$refs.toptip.show()
      }
    },
    components: {
      SearchBox,
      Switches,
      Suggest,
      SongList,
      Scroll,
      TopTip
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .add-song
    position: fixed
    top: 0
    left: 0
    right: 0
    bottom: 0
    background-color: white
    z-index: 210
    width: 100%
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
    .header
      display: flex
      align-items: center
      height: 44px
      .title
        text-align: center
        flex: 1
        font-size: $font-size-large
      .close
        padding-right: 20px
        .icon-close
          font-size: $font-size-large
    .search-box-wrapper
      margin-top: 5px
    .shortcut
      width: 100%
      margin-top: 10px
      height: 100%
      .list-wrapper
        position: fixed
        top: 150px
        left: 0
        right: 0
        bottom: 0
        overflow: hidden
    .search-result
      position: fixed
      top: 150px
      left: 0px
      right: 0
      bottom: 0
    .top-tip-title
      width: 100%
      text-align: center
      padding: 10px 0 10px 0
    .top-tip-text
      width: 100%
      text-align: center
</style>
