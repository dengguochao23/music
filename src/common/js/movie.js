export default class Movie {
  constructor({id, title, genres, directors, casts, img, stars, type}) {
    this.id = id
    this.title = title
    this.genres = genres
    this.directors = directors
    this.casts = casts
    this.img = img
    this.stars = stars
    this.type = type
  }
}

export function createMovie(movieData) {
  return new Movie({
    id: movieData.id,
    title: movieData.title,
    genres: filterGenres(movieData.genres),   // 风格
    directors: filterDirectors(movieData.directors),  // 导演
    casts: filterCaster(movieData.casts),   // 演员，用于更多的页面加载
    img: filterImg(movieData.images),   // 背景和照片,用于更多的页面加载
    stars: movieData.rating.average,
    type: 1
  })
}
export function filterGenres(genres) {
  if (genres.length > 1) {
    return genres.join('/')
  } else {
    return genres[0]
  }
}
export function filterDirectors(directors) {
  let ret = []
  directors.forEach((d) => {
    ret.push({
      name: d.name,
      avatar: findText(d.avatars)
    })
  })
  return ret
}
export function filterCaster(casts) {
  let ret = []
  casts.forEach((c) => {
    ret.push(c.name)
  })
  return ret.join('/')
}

export function filterImg(img) {
  if (img === undefined) return null
  return img.medium
}

// 用于排除有时候读取即将上映的电影数据出现null的情况，来返回一个空值过去
export function findText(el) {
  if (el === null) {
    return ''
  } else {
    return el.large
  }
}

