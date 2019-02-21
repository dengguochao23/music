<template>
  <div class="single-container">
    <img class="img" :src="test" alt="">
    <p class="name"></p>
    <stars class="stars"></stars>
  </div>
</template>

<script type="text/ecmascript-6">
  import Stars from 'base/stars/stars'
  export default {
    data() {
      return {
        test: require('./movie.jpg')
      }
    },
    components: {
      Stars
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

</style>
