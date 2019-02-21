export default class Detail {
  constructor({id, name, image, info, tags, list}) {
    this.id = id
    this.name = name
    this.image = image
    this.info = info
    this.tags = tags
    this.list = list
  }
}
export function createNewMusicDetail(detailData) {
  return new Detail({
    id: detailData.id,
    name: detailData.name,
    image: detailData.coverImgUrl,
    info: detailData.description,
    tags: detailData.tags,
    list: filterList(detailData.tracks)
  })
}

export function filterList(list) {
  let ret = []
  list.forEach((l) => {
    ret.push({
      name: l.name,
      artists: filterArtists(l.artists)
    })
  })
  return ret
}

function filterArtists(artists) {
  let ret = []
  artists.forEach((a) => {
    ret.push(a.name)
  })
  return ret
}
