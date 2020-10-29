const defaults = {
  lang: 'en',
  path: '/w/api.php'
}

const normalize = function (title = '') {
  title = title.replace(/ /g, '_')
  title = title.trim()
  return title
}

const makeUrl = function (title, options, cursor) {
  title = normalize(title)
  title = encodeURIComponent(title)
  let url = `https://${options.lang}.wikipedia.org/${options.path}?`
  if (options.domain) {
    url = `https://${options.domain}/${options.path}?`
  }
  url += `action=query&titles=${title}&rdnamespace=0&prop=redirects&rdlimit=500&format=json&origin=*&redirects=true`
  if (cursor) {
    url += '&rdcontinue=' + cursor
  }
  return url
}

const getRedirects = function (doc, http) {
  let url = makeUrl(doc.title(), defaults)
  return http(url).then((res) => {
    let pages = Object.keys(res.query.pages || {})
    if (pages.length === 0) {
      return []
    }
    return res.query.pages[pages[0]].redirects || []
  })
}
module.exports = getRedirects
