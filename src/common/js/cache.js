import storage from 'good-storage'

const SEARCH_KEY = '_search_'  // 音乐缓冲需要KEY
const SEARCH_MAX_LENGTH = 15

const PLAY_KEY = '_play_'
const PLAY_MAX_LENGTH = 200

const FAVORITE_KEY = '_favorite_'
const FAVORITE_MAX_LENGTH = 200
// 加入
function insertArray(arr, val, compare, maxLen) {
  const index = arr.findIndex(compare)
  if (index === 0) {
    return
  }
  if (index > 0) {
    arr.splice(index, 1) // 删除当前的
  }
  arr.unshift(val) // 加入到最前
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}
// 减少
function deleteFromArray(arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}
// 保存历史记录
export function saveSearch(query) {
  let searches = storage.get(SEARCH_KEY, []) // [] 如果没有缓存是空的话，返回一个空数组
  insertArray(searches, query, (item) => {
    return item.id === query.id
  }, SEARCH_MAX_LENGTH)
  storage.set(SEARCH_KEY, searches)
  return searches
}
// 读取历史记录
export function loadSearchHistory() {
  return storage.get(SEARCH_KEY, [])
}
// 删除当条记录
export function deleteSearchHistory(query) {
  let searches = storage.get(SEARCH_KEY, [])
  deleteFromArray(searches, (item) => {
    return item.id === query.id
  })
  storage.set(SEARCH_KEY, searches)
  return searches
}
// 删除所有记录
export function clearSearchHistory() {
  storage.remove(SEARCH_KEY)
  return []
}
// 最近播放记录
export function savePlay(song) {
  let songs = storage.get(PLAY_KEY, [])
  insertArray(songs, song, (item) => {
    return item.id === song.id
  }, PLAY_MAX_LENGTH)
  storage.set(PLAY_KEY, songs)
  return songs
}
// 读取播放记录
export function loadPlayHistory() {
  return storage.get(PLAY_KEY, [])
}
// 记录
export function saveFavorite(song) {
  let favorites = storage.get(FAVORITE_KEY, [])
  insertArray(favorites, song, (item) => {
    return item.id === song.id
  }, FAVORITE_MAX_LENGTH)
  storage.set(FAVORITE_KEY, favorites)
  return favorites
}
export function loadFavorite() {
  return storage.get(FAVORITE_KEY, [])
}
export function deleteFavorite(song) {
  let favorites = storage.get(FAVORITE_KEY, [])
  deleteFromArray(favorites, (item) => {
    return item.id === song.id
  })
  storage.set(FAVORITE_KEY, favorites)
  return favorites
}
