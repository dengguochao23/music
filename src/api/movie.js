import jsonp from 'common/js/jsonp'

export function getNewMovie(count) {
  // const url = 'https://m.douban.com/rexxar/api/v2/subject_collection/movie_showing/items'
  const url = 'https://api.douban.com/v2/movie/in_theaters'
  const data = {
    os: 'ios',
    for_mobile: 1,
    start: 0,
    count,
    loc_id: 0
  }
  return jsonp(url, data)
}
export function getNextMovie(count) {
  // const url = 'https://m.douban.com/rexxar/api/v2/subject_collection/movie_latest/items'
  const url = 'https://api.douban.com/v2/movie/coming_soon'
  const data = {
    for_mobile: 1,
    start: 0,
    count,
    loc_id: 0
  }
  return jsonp(url, data)
}
export function getTopMovie(count) {
  const url = 'https://api.douban.com/v2/movie/top250'
  // const url = 'https://m.douban.com/rexxar/api/v2/subject_collection/movie_latest/items'
  const data = {
    for_mobile: 1,
    start: 0,
    count,
    loc_id: 0
  }
  return jsonp(url, data)
}

export function getMoreMovie(start, count, urlName) {
  const url = 'https://api.douban.com/v2/movie/' + urlName
  // const url = 'https://m.douban.com/rexxar/api/v2/subject_collection/movie_latest/items'
  const data = {
    for_mobile: 1,
    start,
    count,
    loc_id: 0
  }
  return jsonp(url, data)
}

export function getMovieDetail(id) {
  const url = 'https://m.douban.com/rexxar/api/v2/movie/' + id
  const data = {}
  return jsonp(url, data)
}

export function getMovieInterest(id) {
  const url = `https://m.douban.com/rexxar/api/v2/movie/` + id + `/interests`
  const data = {
    count: 3,
    start: 0,
    for_mobile: 1
  }
  return jsonp(url, data)
}
