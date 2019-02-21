<template>
  <div>
    <div class="search-box">
      <div class="query" ref="query">
        <input
          ref="input"
          @focus="focus"
          @blur="blur"
          type="text"
          class="box"
          v-model="query"
          :placeholder="placeholder"
          @keyup.enter="search(query)"
        >
        <i class="icon-clear" v-show="isShowClear" @click.stop="clearValue"></i>
      </div>
      <i class="icon-search" @click="search(query)"></i>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default{
    data() {
      return {
        isShowClear: false,
        query: ''
      }
    },
    props: {
      placeholder: {
        type: String,
        default: '请输入你想搜索的内容'
      }
    },
    created() {
    },
    methods: {
      // 这是用来控制获取焦点和失去焦点的样式
      focus() {
        this.$refs.query.style.borderColor = '#8CD44D'
      },
      blur() {
        this.$refs.query.style.borderColor = 'white'
      },
      // 增加输入的结果
      setQuery(query) {
        this.query = query
      },
      // 清空输入的框的数据
      clearValue() {
        // this.$refs.input.value = ' '
        this.query = ''
        this.isShowClear = false
        this.$emit('clearQuery')
      },
      // 搜索
      search(query) {
        this.$emit('search', query)
      }
    },
    watch: {
      query(newQuery) {
        this.isShowClear = true
      }
    },
    components: {}
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .search-box
    display: flex
    width: 100%
    height: 40px
    align-items: center
    justify-content: center
    .query
      background-color: #e6e6e6
      flex: 1
      margin-left: 20px
      display: flex
      align-items: center
      border: 2px solid white
      .box
        outline: none
        -webkit-appearance: none
        flex: 1
        height: 35px
        background-color: #e6e6e6
      .icon-clear
        margin-right: 10px
        color: red
        font-size: $font-size-large-x
    .icon-search
      font-size: $font-size-large-x
      margin-left: 4px
      margin-right: 20px


</style>
