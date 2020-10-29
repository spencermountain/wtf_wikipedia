exports.normalize = function (title = '') {
  title = title.replace(/ /g, '_')
  title = title.trim()
  return title
}

exports.defaults = {
  lang: 'en',
  path: '/w/api.php'
}
