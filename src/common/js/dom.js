export function addClass(el, className) {
  if (hasClass(el, className)) {
    return
  }
  let newClass = el.className.split(' ')
  newClass.push(className)
  el.className = newClass.join(' ')
}
export function hasClass(el, className) {
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return reg.test(el.className)
}

export function getData(el, name, val) {
  let prefix = 'data-'
  name = prefix + name
  if (val) {
    return el.setAttribute(name, val)
  } else {
    return el.getAttribute(name)
  }
}
// 设置一个能够处理带有提取功能
let ret = [0]
export function setIndexOf(searchValue, val) {
  for (var i = 1; i < val[0].length; i++) {
    if (i === 1) {
      ret.push(val[0].indexOf(searchValue))
    } else {
      ret.push(val[0].indexOf(searchValue, ret[i - 1] + 1))
      if (ret[i] === val[0].length - 1) {
        return
      }
    }
  }
}
// 根据提取到的指定元素的位置，来让原本的数值形成一个数组
export function setArray(searchValue, val) {
  ret = [0]
  setIndexOf(searchValue, val)
  let arr = []
  for (let j = 0; j < ret.length - 1; j++) {
    if (j === 0) {
      arr.push(val[0].substring(0, ret[j + 1] + 1))
    } else {
      arr.push(val[0].substring(ret[j] + 1, ret[j + 1] + 1))
    }
  }
  return arr
}

export function replaceString(replaceVal, newVal, data) {
  let ret = data
  ret.replace(/replaceVal/i, newVal)
}
