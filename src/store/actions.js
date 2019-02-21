import * as types from './mutation-types'
import {
  saveSearch,
  deleteSearchHistory,
  clearSearchHistory,
  savePlay,
  saveFavorite,
  deleteFavorite
} from 'common/js/cache'
function findIndex(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}
export const selectPlay = function ({commit, state}, {list, index}) {
  commit(types.SET_SEQUENCE_LIST, list)
  commit(types.SET_PLAYLIST, list)
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

// 加入歌曲
export const insertSong = function ({commit, state}, song) {
  let playlist = state.playlist.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  // 记录当前的歌曲
  let currentSong = playlist[currentIndex]
  // 寻找当前的歌曲是否有待插入的歌曲并返回其索引
  let fpIndex = findIndex(playlist, song)
  // 因为是插入歌曲，所示的索引应加1
  currentIndex++
  // 插入这首歌都当前的索引
  playlist.splice(currentIndex, 0, song)
  // 如果包含这首歌的话
  if (fpIndex > -1) {
    // 如果当前插入的序号大于列表中的序号时
    if (currentIndex > fpIndex) {
      playlist.splice(fpIndex, 1)
      currentIndex--
    } else {
      playlist.splice(fpIndex + 1, 1)
    }
  }
  let currentSIndex = findIndex(sequenceList, currentSong) + 1
  let fsIndex = findIndex(sequenceList, song)
  sequenceList.splice(currentSIndex, 0, song)
  if (fsIndex > -1) {
    if (currentSIndex > fsIndex) {
      sequenceList.splice(fsIndex, 1)
    } else {
      sequenceList.splice(fsIndex + 1, 1)
    }
  }
  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}
// 搜索历史
export const saveSearchHistory = function ({commit, state}, query) {
  commit(types.SET_SEARCHHISTORY, saveSearch(query))
}
// 删除某条历史记录
export const deleteHistory = function ({commit, state}, query) {
  commit(types.SET_SEARCHHISTORY, deleteSearchHistory(query))
}
// 删除所有历史记录
export const clearHistory = function ({commit}) {
  commit(types.SET_SEARCHHISTORY, clearSearchHistory())
}
// 减少歌曲
export const deleteSong = function ({commit, state}, song) {
  let playlist = state.playlist.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  // 找出当前播放歌曲的索引值
  let pIndex = findIndex(playlist, song)
  playlist.splice(pIndex, 1)
  // 根据要删掉的歌曲的序号小于当前播放歌曲的序号的话，又或者最后一首歌。这样都要减少一个序列号
  if (currentIndex > pIndex || currentIndex === playlist.length) {
    currentIndex--
  }
  let sIndex = findIndex(sequenceList, song)
  sequenceList.splice(sIndex, 1)
  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_PLAYING_STATE, true)
}
// 删除全部歌曲
export const deleteAllSong = function ({commit}) {
  commit(types.SET_PLAYLIST, [])
  commit(types.SET_SEQUENCE_LIST, [])
  commit(types.SET_CURRENT_INDEX, -1)
  commit(types.SET_PLAYING_STATE, false)
}
// 播放历史
export const savePlayHistory = function ({commit}, song) {
  commit(types.SET_PLAYHISTORY, savePlay(song))
}
// 喜爱历史
export const saveFavoriteList = function ({commit}, song) {
  commit(types.SET_FAVORITELIST, saveFavorite(song))
}
// 删除历史
export const deleteFavoriteList = function ({commit}, song) {
  commit(types.SET_FAVORITELIST, deleteFavorite(song))
}
