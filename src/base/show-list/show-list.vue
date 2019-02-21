<template>
  <scroll :click="isClick" ref="showWindow" :data="data" :directionX="true" :directionY="false">
    <div class="show-list">
      <div class="single-container" v-for="item in data" @click.prevent="selectItem(item)">
        <img width="100%" height="70%" class="img" :src="item.img">
        <p class="name">{{item.title}}</p>
        <stars v-if="isShowStar" :score="item.stars" class="stars"></stars>
        <p class="role">{{item.role}}</p>
      </div>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import Stars from 'base/stars/stars'
  import Scroll from 'base/scroll/scroll'
  export default {
    data() {
      return {
        isClick: false
      }
    },
    props: {
      data: {
        type: Array,
        default: []
      },
//      这是用来控制星星的显示来方便其他页面来使用这个组件
      isShowStar: {
        type: Boolean,
        default: true
      }
    },
    methods: {
      selectItem(item) {
        this.$emit('selectItem', item)
        console.log(item)
      }
    },
    components: {
      Stars,
      Scroll
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .show-list
    min-height: 1px
    margin-top: 10px
    display: flex
    position: fixed
    margin-right: 5px
    .single-container
      margin-right: 10px
      display: flex
      width: 110px
      flex-direction: column
      align-items: center
      .name
        margin: 7px 0
        font-size: $font-size-medium
        white-space: nowrap
        text-align: center
        overflow: hidden; /*自动隐藏文字*/
        text-overflow: ellipsis; /*文字隐藏后添加省略号*/
        width: 110px;
</style>
