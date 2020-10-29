exports.normalize = function (title = '') {
  title = title.replace(/ /g, '_')
  title = title.trim()
  title = encodeURIComponent(title)
  return title
}

exports.defaults = {
  lang: 'en',
  path: '/w/api.php'
}

exports.toUrlParams = function (obj) {
  let arr = Object.entries(obj).map(([key, value]) => {
    return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
  })
  return arr.join('&')
}
