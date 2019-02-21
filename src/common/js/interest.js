export default class Interest {
  constructor({id, name, img, time, star, comment}) {
    this.id = id // 评论人员的ID
    this.name = name // 评论人员的名字
    this.img = img // 评论人员的头像
    this.time = time // 评论的时间
    this.star = star // 评论的星星
    this.comment = comment // 评论内容
  }
}
export function creatInterest(interData) {
  return new Interest({
    id: interData.user.id,
    name: interData.user.name,
    img: interData.user.avatar,
    time: interData.create_time,
    star: interData.rating.value,
    comment: interData.comment
  })
}
