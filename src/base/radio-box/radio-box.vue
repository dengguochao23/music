<template>
  <div>
    <div ref="radios" class="radio-box" :class="{active:intiRadio===index}" v-for="(item,index) in radios"
         @click.prevent="changeRadio(index)">
      <div class="circle" :class="{circleActive:intiRadio===index}"></div>
      <div class="text">{{item}}</div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      return {
        radios: ['音乐', '电影'],
        intiRadio: 0
      }
    },
    methods: {
      changeRadio(index) {
        this.intiRadio = index
      }
    },
    watch: {
      intiRadio(newRadio) {
        this.$emit('changeRadio', newRadio)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .radio-box
    width: 25%
    height: 30px
    background-color: white
    display: flex
    align-items: center
    justify-content: center
    border-radius: 10px
    &.active
      background-color: #999
    .circle
      width: 12px
      height: 12px
      border-radius: 50%
      border: 1px solid black
      &.circleActive
        background-color: #8CD44D
    .text
      margin-left: 10px
      font-size: $font-size-medium

</style>
