//grab the content of any article, off the api
const request = require('./_request')
const makeUrl = require('./01-makeUrl')
const getParams = require('./_params')
const parseDoc = require('../01-document')
//num pages per request
const MAX_PAGES = 5

//this data-format from mediawiki api is nutso
const postProcess = function(data) {
  let pages = Object.keys(data.query.pages)
  let docs = pages.map(id => {
    let page = data.query.pages[id] || {}
    if (page.hasOwnProperty('missing') || page.hasOwnProperty('invalid')) {
      return null
    }
    let text = page.revisions[0]['*']
    //us the 'generator' result format, for the random() method
    if (!text && page.revisions[0].slots) {
      text = page.revisions[0].slots.main['*']
    }
    let opt = {
      title: page.title,
      pageID: page.pageid
    }
    try {
      return parseDoc(text, opt)
    } catch (e) {
      console.error(e)
      throw e
    }
  })
  return docs
}

//recursive fn to fetch groups of pages, serially
const doPages = function(pages, results, lang, options, cb) {
  let todo = pages.slice(0, MAX_PAGES)
  let url = makeUrl(todo, lang, options)
  let p = request(url, options)
  p.then(wiki => {
    let res = postProcess(wiki, options)
    results = results.concat(res)
    let remain = pages.slice(MAX_PAGES)
    if (remain.length > 0) {
      return doPages(remain, results, lang, options, cb) //recursive
    }
    return cb(results)
  }).catch(e => {
    console.error('wtf_wikipedia error: ' + e)
    cb(results)
  })
}

//grab a single, or list of pages (or ids)
const fetchPage = function(pages = [], a, b, c) {
  if (typeof pages !== 'object') {
    pages = [pages]
  }
  let { lang, options, callback } = getParams(a, b, c)
  return new Promise(function(resolve, reject) {
    // courtesy-check for spamming wp servers
    if (pages.length > 500) {
      console.error('wtf_wikipedia error: Requested ' + pages.length + ' pages.')
      reject('Requested too many pages, exiting.')
      return
    }
    doPages(pages, [], lang, options, docs => {
      docs = docs.filter(d => d !== null)
      //return the first doc, if we only asked for one
      if (pages.length === 1) {
        docs = docs[0]
      }
      docs = docs || null
      //support 'err-back' format
      if (callback && typeof callback === 'function') {
        callback(null, docs)
      }
      resolve(docs)
    })
  })
}

module.exports = fetchPage
