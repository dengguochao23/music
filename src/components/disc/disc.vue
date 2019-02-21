<template>
  <transition name="slide">
    <music-list :title="title" :SingerInfo="desc" :bg-image="bgImage" :songs="songs"
                class="singer-detail"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {getSongList} from 'api/recommend'
  import {mapGetters} from 'vuex'
  import {ERR_OK} from 'api/config'
  import {createSong} from 'common/js/song'
  import MusicList from 'components/music-list/music-list'

  export default {
    computed: {
      bgImage() {
        return this.disc.imgurl
      },
      title() {
        return this.disc.dissname
      },
      ...mapGetters([
        'disc'
      ])
    },
    data() {
      return {
        songs: [],
        desc: []
      }
    },
    created() {
      this._getSongLIst()
    },
    methods: {
      _getSongLIst() {
        getSongList(this.disc.dissid).then((res) => {
          if (res.code === ERR_OK) {
            this.desc.push(res.cdlist[0].desc)
            this.songs = this._normalizeSongs(res.cdlist[0].songlist)
          }
        })
      },
      _normalizeSongs(list) {
        let ret = []
        list.forEach((musicData) => {
          if (musicData.songid && musicData.albumid) {
            ret.push(createSong(musicData))
          }
        })
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
    background-color: black

  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
