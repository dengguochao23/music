<template>
  <ul class="switches">
    <li
      class="switches-item"
      v-for="(item,index) in switches"
      @click="switchItem(index)"
      :class="{active:currentIndex===index}"
    >
      <span class="text">{{item.name}}</span>
    </li>
  </ul>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      switches: {
        type: Array,
        default: []
      },
      currentIndex: {
        type: Number,
        default: ''
      }
    },
    methods: {
      switchItem(index) {
        this.$emit('switch', index)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .switches
    display: flex
    width: 230px
    justify-content: center
    height: 33px
    margin: 0 auto
    .switches-item
      text-align: center
      line-height: 33px
      flex: 1
      background-color: #e6e6e6
      border-radius: 15px 0 0 15px
      &.switches-item:last-child
        border-radius: 0 15px 15px 0
      &.active
        background-color: #8CD44D
      .text
        font-size: $font-size-medium
</style>
