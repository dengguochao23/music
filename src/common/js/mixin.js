import {mapGetters, mapActions} from 'vuex'
import {searchMusic} from 'api/search'
import {createSong} from 'common/js/song'
export const playlistMixin = {
  computed: {
    ...mapGetters([
      'playlist',
      'favoriteList',
      'currentSong'
    ])
  },
  mounted() {
    this.handlePlaylist(this.playlist)
  },
  activated () {
    this.handlePlaylist(this.playlist)
  },
  watch: {
    playlist(newVal) {
      this.handlePlaylist(newVal)
    }
  },
  methods: {
    handlePlaylist() {
      return new Error('component must implement handlePlaylist method')
    },
    toggleFavorite(song) {
      if (this.isFavorite(song)) {
        this.deleteFavoriteList(song)
      } else {
        this.saveFavoriteList(song)
      }
    },
    getFavoriteIcon(currentSong) {
      if (this.isFavorite(currentSong)) {
        return 'icon-favorite'
      } else {
        return false
      }
    },
    isFavorite(song) {
      const index = this.favoriteList.findIndex((item) => {
        return item.id === song.id
      })
      return index > -1
    },
    ...mapActions([
      'saveFavoriteList',
      'deleteFavoriteList'
    ])
  }
}
const perpage = 20  // 展示结果的数量
const MAX_COUNT = 30
export const searchMixin = {
  data() {
    return {
      zhida: 0, // 0表示不展示歌手信息,
      page: 1,  // 控制页面的第几页，用于下拉加载时使用
      count: 10,
      query: '',
      hasMore: true,
      isShowHotKey: 0, // 0是音乐，1是电影,
      isShowSuggestList: false
    }
  },
  computed: {
    ...mapGetters([
      'searchHistory'
    ])
  },
  methods: {
    // 获取搜索结果
    onSearch(query) {
      this.query = query
      this.isShowSuggestList = true
      this._getSearchList(query, this.count)  // __getSearchList需要另外设置，因为search页面那里我要搜索电影
    },
    // 初始化音乐数据
    _normalMusic(data) {
      let ret = []
      data.forEach((d) => {
        ret.push(createSong(d))
      })
      return ret
    },
    // 下拉刷新
    searchMore() {
      this.addCount(this.count)
      this.page++
      searchMusic(this.query, this.page, this.zhida, perpage).then((res) => {
        this.searchData = this.searchData.concat(this._normalMusic(res.data.song.list))
        this.checkMore(res.data)
        this.$refs.suggestList.finishPullUp()
      })
    },
    // 检查是否有更多
    checkMore(data) {
      const song = data.song
      if (!song.list.length || (song.curnum + song.curpage * perpage) > song.totalnum) {
        this.hasMore = false
      }
    },
    addCount(count) {
      if (count >= MAX_COUNT) {
        return
      } else {
        this.count = count + 5
      }
    },
    ...mapActions([
      'insertSong',
      'saveSearchHistory'
    ])
  }
}
