import Vue from 'vue'
import Router from 'vue-router'
import Recommend from 'components/recommend/recommend'
import Singer from 'components/singer/singer'
import SingerDetail from 'components/singer-detail/singer-detail'
import Movie from 'components/movie/movie'
import video from 'components/video/video'
import Search from 'components/search/search'
import Disc from 'components/disc/disc'
import NewMusic from 'components/new-music/new-music'
import More from 'components/more/more'
import MovieDetail from 'components/movie-detail/movie-detail'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      component: Recommend,
      children: [
        {
          path: '/recommend/disc:id',
          name: 'disc',
          component: Disc
        },
        {
          path: '/recommend/new-music:id',
          name: 'new-music',
          component: NewMusic
        }
      ]
    },
    {
      path: '/singer',
      component: Singer,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/movie',
      component: Movie,
      children: [
        {
          path: ':id',
          name: 'movie-detail',
          component: MovieDetail
        },
        {
          path: 'more',
          name: 'more',
          component: More
        }
      ]
    },
    {
      path: '/video',
      component: video
    },
    {
      path: '/search',
      component: Search,
      children: [
        {
          path: '/search/music/:id',
          name: 'music',
          component: NewMusic
        },
        {
          path: '/search/movie/:id',
          name: 'movie',
          component: MovieDetail
        }
      ]
    }
  ]
})
