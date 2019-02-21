import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config'
import axios from 'axios'

const debug = process.env.NODE_ENV !== 'production'

export function getRecommend() {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  })
  return jsonp(url, data, options)
}
export function getHotmusicList() {
  const url = debug ? '/api/getHotmusicList' : 'http://www.dengguochao.top/music/api/getHotmusicList'
  const data = Object.assign({}, commonParams, {
    platform: 'yqq',
    hostUin: 0,
    sin: 0,
    ein: 25,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random(),
    format: 'json'
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
export function getSongList(disstid) {
  const url = debug ? '/api/getCdInfo' : 'http://www.dengguochao.top/music/api/getCdInfo'

  const data = Object.assign({}, commonParams, {
    disstid,
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
export function getNewMusic() {
  // const url = 'https://m.douban.com/rexxar/api/v2/subject_collection/music_chinese/items'
  const url = 'http://120.79.162.149:3000/personalized'
  return axios.get(url)
}
export function getCdInfo(cdId) {
  const url = 'http://120.79.162.149:3000/playlist/detail?id=' + cdId
  return axios.get(url)
}
export function getinterests() {
  const url = 'http://120.79.162.149:3000/comment/music?id=186016&limit=1'
  return axios.get(url)
}
