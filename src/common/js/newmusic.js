export default class Music {
  constructor({id, title, image, info}) {
    this.id = id
    this.title = title
    this.image = image
    this.info = info
  }
}
export function createMusic(musicData) {
  return new Music({
    id: musicData.id,
    title: musicData.name,
    image: musicData.picUrl,
    info: musicData.copywriter
  })
}

export function filter(data) {
  let musicData = data
  if (musicData) {
    return musicData.cover
  } else {
    return musicData
  }
}

