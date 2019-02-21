<template>
  <scroll
    class="listview"
    ref="listview"
    :data="data"
    @scroll="scroll"
    :listenScroll="listenScroll"
    :probeType="probeType"
  >
    <ul>
      <li class="list-group" v-for="group in data" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li @click="selectItem(item)" class="list-group-item" v-for="item in group.items">
            <img class="avatar" v-lazy="item.avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart.stop="onShortcutTouchStart">
      <ul>
        <li
          class="item"
          v-for="(item, index) in shortcutList"
          :class="{'active':currentIndex===index}"
          :data-index="index"
          ref="listShortcutGroup"
        >{{item}}
        </li>
      </ul>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import {getData} from 'common/js/dom'
  export default {
    created() {
      this.touch = {}
      this.listenScroll = true
      this.probeType = 3
      this.listHeight = []
    },
    data() {
      return {
        currentIndex: 0,
        scrollY: -1
      }
    },
    props: {
      data: {
        type: Array,
        default: []
      }
    },
    computed: {
      shortcutList() {
        return this.data.map((group) => {
          return group.title.substr(0, 1)
        })
      }
    },
    methods: {
      selectItem (item) {
        this.$emit('select', item)
      },
      onShortcutTouchStart(e) {
        let anchorIndex = getData(e.target, 'index')
        let firstTouch = e.touches[0]
        this.touch.anchorIndex = anchorIndex
        this.touch.y1 = firstTouch.pageY
        this.currentIndex = anchorIndex
        this._scrollTo(this.currentIndex)
      },
      scroll(pos) {
        this.scrollY = pos.y
      },
      refresh() {
        this.$refs.listview.refresh()
      },
      _scrollTo(index) {
        if (!index && index !== 0) {
          return
        }
        this.scrollY = -this.listHeight[index]
        this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
      },
      _calculateHeight() {
        this.listHeight = []
        const list = this.$refs.listGroup
        let height = 0
        this.listHeight.push(height)
        for (let i = 0; i < list.length; i++) {
          let item = list[i]
          height += item.clientHeight
          this.listHeight.push(height)
        }
      }
    },
    watch: {
      data() {
        setTimeout(() => {
          this._calculateHeight()
        }, 20)
      },
//      这是一个BUG
      currentIndex(newIndex, oldIndex) {
        if (!newIndex) {
          if (newIndex === 0) {
            this.currentIndex = 0
            return
          }
          this.currentIndex = oldIndex
          return
        }
      },
      scrollY(newY) {
        const listHeight = this.listHeight
        for (let i = 0; i < listHeight.length; i++) {
          let height1 = listHeight[i]
          let height2 = listHeight[i + 1]
          if (-newY >= height1 && -newY < height2) {
            this.currentIndex = i
            return
          }
        }
        this.currentIndex = 0
      }
    },
    components: {
      Scroll
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        background-color: $text-background-color
        font-size: $font-size-small
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 15%
        .name
          padding-left: 20px
          color: $color-text
    .list-shortcut
      position: absolute
      right: 0
      top: 50%
      z-index: 300
      transform: translateY(-50%)
      background-color: $text-background-color
      width: 8%
      padding: 10px 0 10px
      text-align: center
      border-radius: 10px
      font-family: Helvetica
      .item
        padding: 1px
        font-size: $font-size-small-s
        line-height: 1
        &.active
          padding: 3px 0px 2px 0px
          font-size: 30px
          color: #8CD44D
</style>
