const slow = require('slow')

const chunkBy = function(arr, chunkSize = 5) {
  var groups = [],
    i
  for (i = 0; i < arr.length; i += chunkSize) {
    groups.push(arr.slice(i, i + chunkSize))
  }
  return groups
}

const fetchCat = async function(wtf, cat, lang, opts) {
  let resp = await wtf.category(cat, lang)
  let pages = resp.pages.map(o => o.title)
  let groups = chunkBy(pages)

  const doit = function(group) {
    return wtf.fetch(group, opts) //returns a promise
  }
  //only allow three requests at a time
  return slow.three(groups, doit).then(responses => {
    //flatten the results
    let docs = [].concat.apply([], responses)
    return {
      docs: docs,
      categories: resp.categories
    }
  })
}

const plugin = function(models) {
  models.wtf.parseCategory = async function(cat, lang, opts) {
    return await fetchCat(models.wtf, cat, lang, opts)
  }
  models.wtf.fetchCategory = models.wtf.parseCategory
}
module.exports = plugin
