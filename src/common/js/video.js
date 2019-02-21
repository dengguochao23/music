// import {getVideoDetail} from 'api/video'
export default class Video {
  constructor({id, title, name, item, time, bgImg, duration, count}) {
    this.id = id // 视频ID号
    this.title = title // 视频标题
    this.name = name // 作者名字好像是
    this.item = item // 视频主题类别，这是一个大类
    this.time = time // 视频上传时间
    this.bgImg = bgImg // 视频背景图片
    this.duration = duration // 视频持续的时间
    this.count = count  // 视频播放的次数
    // this._getVurl()
  }

  // 获取视频的地址
  // _getVurl() {
  //   getVideoDetail(this.id).then((res) => {
  //     let url = res.vl.vi[0].ul.ui[0].url
  //     let id = this.id
  //     let fvkey = res.vl.vi[0].fvkey
  //     this.url = `${url}${id}.mp4?sdtfrom=v1103&guid=216d723e533b9f4e40dd4b334c443f4f&vkey=${fvkey}`
  //   })
  // }
}
export function createVideo(videoData) {
  return new Video({
    id: videoData.id,
    title: videoData.title,
    name: videoData.source,
    item: videoData.category_chn,
    time: videoData.publish_time,
    bgImg: videoData.bimg,
    duration: videoData.duration,
    count: videoData.view_count
  })
}

