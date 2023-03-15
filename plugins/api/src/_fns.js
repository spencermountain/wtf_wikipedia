import makeHeaders from 'wtf_wikipedia/src/_fetch/_headers.js'

export function normalize(title = '') {
  title = title.replace(/ /g, '_')
  title = title.trim()
  title = encodeURIComponent(title)
  return title
}

export const defaults = {
  lang: 'en',
  path: 'w/api.php'
}

export function toUrlParams(obj) {
  let arr = Object.entries(obj).map(([key, value]) => {
    return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
  })
  return arr.join('&')
}

export function fetchOne(url, options, http, prop) {
  const headers = makeHeaders(options)
  return http(url, headers).then((res) => {
    let pages = Object.keys(res.query.pages || {})
    if (pages.length === 0) {
      return { pages: [], cursor: null }
    }
    return {
      pages: res.query.pages[pages[0]][prop] || [],
      cursor: res.continue
    }
  })
}
