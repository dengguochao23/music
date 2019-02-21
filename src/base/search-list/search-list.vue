<template>
  <div class="search-list">
    <ul>
      <li class="search-item" @click="selectItem(item)" v-for="item in searches">
        <span class="search-name">{{item.name}}</span>
        <span class="search-list-icon" @click.stop="deleteOne(item)">
          <i class="icon-close"></i>
        </span>
      </li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      searches: {
        type: Array,
        default: []
      }
    },
    methods: {
      selectItem(item) {
        this.$emit('select', item.name)
      },
      deleteOne(item) {
        this.$emit('delete', item)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .search-list
    .search-item
      display: flex
      align-items: center
      height: 40px
      .search-name
        flex: 1
</style>
