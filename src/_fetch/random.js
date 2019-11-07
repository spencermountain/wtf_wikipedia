const site_map = require('../_data/site_map')
const request = require('./_request')
const getParams = require('./_params')
const parseDoc = require('../01-document')

const makeUrl = function(lang) {
  let url = `https://${lang}.wikipedia.org/w/api.php`
  if (site_map[lang]) {
    url = site_map[lang] + '/w/api.php'
  }
  url += `?format=json&action=query&generator=random&grnnamespace=0&prop=revisions&rvprop=content&grnlimit=1&rvslots=main&origin=*`
  return url
}

//this data-format from mediawiki api is nutso
const postProcess = function(data, options) {
  let pages = Object.keys(data.query.pages)
  let id = pages[0]
  let page = data.query.pages[id] || {}
  if (page.hasOwnProperty('missing') || page.hasOwnProperty('invalid')) {
    return null
  }
  //us the 'generator' result format, for the random() method
  let text = page.revisions[0].slots.main['*']
  options.title = page.title
  options.pageID = page.pageid
  try {
    return parseDoc(text, options)
  } catch (e) {
    console.error(e)
    throw e
  }
}

//fetch and parse a random page from the api
const getRandom = function(a, b, c) {
  let { lang, options, callback } = getParams(a, b, c)
  let url = makeUrl(lang)
  return new Promise(function(resolve, reject) {
    let p = request(url, options)
    p.then(res => {
      return postProcess(res, options)
    })
      .then(doc => {
        //support 'err-back' format
        if (typeof callback === 'function') {
          callback(null, doc)
        }
        resolve(doc)
      })
      .catch(reject)
  })
}
module.exports = getRandom
