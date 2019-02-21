<template>
  <transition name="slide">
    <music-list :title="title" :hotMusic="hotMusic" :SingerInfo="SingerInfo" :bg-image="bgImage" :songs="songs"
                class="singer-detail"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {getSingerDetail, getSingerInfo} from 'api/singer'
  import {createSong} from 'common/js/song'
  import {setArray} from 'common/js/dom'
  import {ERR_OK} from 'api/config'
  import {mapGetters} from 'vuex'
  import MusicList from 'components/music-list/music-list'
  export default {
    data() {
      return {
        songs: [],
        hotMusic: '',
        SingerInfo: []
      }
    },
    computed: {
      title() {
        return this.singer.name
      },
      bgImage() {
        return this.singer.avatar
      },
      ...mapGetters([
        'singer'
      ])
    },
    created() {
      this._getSingerDetail(this.singer.id)
      this._getSingerInfo(this.singer.id)
    },
    methods: {
      _getSingerDetail(singerId) {
        if (!singerId) {
          this.$router.push('/singer')
        }
        getSingerDetail(singerId).then((res) => {
          if (res.code === ERR_OK) {
            this.songs = this._normalizeSong(res.data.list)
            this.hotMusic = this.songs[0].name
          }
        })
      },
      _getSingerInfo(singerId) {
        getSingerInfo(singerId).then((res) => {
          if (res.code === ERR_OK) {
            this.SingerInfo = setArray('。', this._normalizeSingerInfo(res.data.SingerDesc))
//            this.SingerInfo = res.data.SingerDesc
          }
        })
      },
      _normalizeSong(list) {
        let ret = []
        list.forEach((item) => {
          let {musicData} = item
          if (musicData.songid && musicData.albummid) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      },
      _normalizeSingerInfo(info) {
        let ret = []
        ret.push(info)
        return ret
      }
    },
    components: {
      MusicList
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .singer-detail
    position: fixed
    top: 0
    left: 0
    bottom: 0
    z-index: 300
    right: 0
    background-color: white

  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
