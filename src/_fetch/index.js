const request = require('./request/server')
const makeUrl = require('./01-makeUrl')
const parseResult = require('./02-parseResult')
const wtf = require('../01-document')

const fetch = function(article, lang, options = {}) {
  let url = makeUrl(article, lang, options)
  return new Promise((resolve, reject) => {
    request(url)
      .then(res => {
        res = JSON.parse(res)
        let data = parseResult(res)
        // remove empty results
        data = data.filter(obj => obj)
        // parse its text
        let docs = data.map(obj => wtf(obj.text))
        // return a single document
        if (docs.length === 1) {
          docs = docs[0]
        }
        resolve(docs)
      })
      .catch(err => {
        reject(err)
      })
  })
}
module.exports = fetch
