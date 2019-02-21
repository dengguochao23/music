import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config'
import axios from 'axios'

const debug = process.env.NODE_ENV !== 'production'
// 音乐搜索
export function getHotKey() {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'

  const data = Object.assign({}, commonParams, {
    g_tk: 5381,
    platform: 'h5',
    needNewCode: 1
  })
  return jsonp(url, data, options)
}
/*
 export function searchMusic(query, page, zhida, perpage) {
 const url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'

 const data = Object.assign({}, commonParams, {
 perpage,
 w: query,
 p: page,
 catZhida: zhida ? 1 : 0,
 zhidaqu: 1,
 t: 0,
 flag: 1,
 ie: 'utf - 8',
 sem: 1,
 aggr: 0,
 n: perpage,
 remoteplace: 'txt.mqq.all',
 uid: 0,
 needNewCode: 1,
 platform: 'h5'
 })
 return jsonp(url, data, options)
 }
 */
export function searchMusic(query, page, zhida, perpage) {
  const url = debug ? 'api/search' : 'http://www.dengguochao.top/music/api/search'
  const data = Object.assign({}, commonParams, {
    perpage,
    w: query,
    p: page,
    catZhida: zhida ? 1 : 0,
    zhidaqu: 1,
    t: 0,
    flag: 1,
    ie: 'utf - 8',
    sem: 1,
    aggr: 0,
    n: perpage,
    remoteplace: 'txt.mqq.all',
    uid: 0,
    needNewCode: 1,
    platform: 'h5',
    format: 'json'
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function getSearchMusic(name, count) {
  const url = 'https://api.douban.com/v2/music/search?tag=' + name
  const data = {
    start: 0,
    count
  }
  return jsonp(url, data)
}

export function getSearchMovie(name, count) {
  const url = 'https://api.douban.com/v2/movie/search?tag=' + name
  const data = {
    start: 0,
    count
  }
  return jsonp(url, data)
}
