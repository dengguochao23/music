let _uid = 0

export function getUid() {
  if (_uid) {
    return _uid
  }
  if (!_uid) {
    let d = new Date()
    const t = d.getUTCMilliseconds()
    _uid = Math.round(2147483647 * Math.random()) * t % 1e10
  }
  return _uid
}

