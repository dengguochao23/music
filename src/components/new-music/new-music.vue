<template>
  <transition name="slide">
    <base-detail  class="base-detail"></base-detail>
  </transition>
</template>

<script type="text/ecmascript-6">
  import BaseDetail from 'components/base-detail/base-detail'
  import {mapGetters} from 'vuex'

  export default {

    computed: {
      ...mapGetters([
        'cd'
      ])
    },
    components: {
      BaseDetail
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .base-detail
    background-color: white
    width :100%
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
