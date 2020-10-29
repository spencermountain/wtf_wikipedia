const slow = require('slow')

const chunkBy = function (arr, chunkSize = 5) {
  let groups = []
  for (let i = 0; i < arr.length; i += chunkSize) {
    groups.push(arr.slice(i, i + chunkSize))
  }
  return groups
}

const fetchCat = function (cat, options = {}, wtf) {
  if (!cat) {
    return { docs: [], categories: [] }
  }
  return wtf.category(cat, options.lang).then((resp) => {
    let pages = resp.pages.map((o) => o.title)
    let groups = chunkBy(pages)

    const doit = function (group) {
      return wtf.fetch(group, options) //returns a promise
    }
    //only allow three requests at a time
    return slow.three(groups, doit).then((responses) => {
      //flatten the results
      let docs = [].concat.apply([], responses)
      return {
        docs: docs,
        categories: resp.categories
      }
    })
  })
}

module.exports = fetchCat
