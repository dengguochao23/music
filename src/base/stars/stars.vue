<template>
  <div ref="stars" class="stars">
    <div class="star-item"></div>
    <div class="star-item"></div>
    <div class="star-item"></div>
    <div class="star-item"></div>
    <div class="star-item"></div>
    <span class="score" v-html="setScore"></span>
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
  import {addClass} from 'common/js/dom'
  export default {
    props: {
      score: {
        default: 0
      }
    },
    computed: {
      setScore() {
        if (this.score === 0) {
          return '无评分'
        }
        if (this.score === 'null') {
          return '无评分'
        }
        return Math.round(this.score)
      }
    },
    mounted() {
      setTimeout(() => {
        this._setStars()
      }, 20)
    },
    methods: {
      _setStars() {
        this.children = this.$refs.stars.children
        if (this.score === 0) {
          return
        }
        for (var i = 0; i < this.score / 2; i++) {
          let child = this.children[i]
          addClass(child, 'active')
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .stars
    display: flex
    margin-bottom: 5px
    font-size: $font-size-small
    .star-item
      width: 10px
      height: 10px
      background-image: url('../../common/image/star-white.png')
      background-size: 10px 10px
      &.active
        background-image: url('../../common/image/star-yellow.png')
    .score
      margin-left: 5px
</style>
