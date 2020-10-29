const { defaults, toUrlParams } = require('../_fns')

const params = {
  format: 'json',
  action: 'query',
  generator: 'random',
  grnnamespace: 14,
  prop: 'revisions',
  grnlimit: 1,
  origin: '*'
}

const randomCategory = function (options = {}, http) {
  options = Object.assign({}, defaults, options)
  let url = `https://${options.lang}.wikipedia.org/${options.path}?`
  if (options.domain) {
    url = `https://${options.domain}/${options.path}?`
  }
  url += toUrlParams(params)
  return http(url)
    .then((res) => {
      try {
        let o = res.query.pages
        let key = Object.keys(o)[0]
        return o[key].title
      } catch (e) {
        throw e
      }
    })
    .catch((e) => {
      console.error(e)
      return null
    })
}
module.exports = randomCategory
