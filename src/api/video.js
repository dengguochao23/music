import jsonp from 'common/js/jsonp'
import {options2} from 'api/config'
// 腾讯视频API

export function getVideoList() {
  const url = 'https://pacaio.match.qq.com/xw/rcdVideo'
  const data = {}
  return jsonp(url, data, options2)
}
// 获取视频的详情
export function getVideoDetail(id) {
  const url = 'https://h5vv.video.qq.com/getinfo'
  const data = {
    charge: 0,
    defaultfmt: 'auto',
    otype: 'json',
    guid: '216d723e533b9f4e40dd4b334c443f4f',
    flowid: '5c7ab048aaae6ac3e1e60c40e8ba162d_70901',
    platform: 11001,
    sdtfrom: 'v1103',
    defnpayver: 0,
    appVer: '3.3.367',
    host: 'xw.qq.com',
    ehost: 'https://xw.qq.com/a/video-player/' + id,
    sphttps: 1,
    _rnd: 1516416601,
    spwm: 4,
    vid: id,
    defn: 'auto',
    fhdswitch: 0,
    show1080p: 'auto',
    isHLS: 0,
    fmt: 'auto',
    defsrc: 1,
    _qv_rmt: 'QBE7/CJAA11460SAy=',
    _qv_rmt2: 'MrrQrmmK156161LHQ=',
    _1516416601809: ''
  }
  return jsonp(url, data, options2)
}
