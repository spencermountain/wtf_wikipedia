//this data-format from mediawiki api is nutso
const getResult = function (data, options) {
  options = options || {}
  let pages = Object.keys(data.query.pages)
  let docs = pages.map((id) => {
    let page = data.query.pages[id] || {}
    if (page.hasOwnProperty('missing') || page.hasOwnProperty('invalid')) {
      return null
    }
    let text = page.revisions[0]['*']
    // console.log(page.revisions[0])
    //us the 'generator' result format, for the random() method
    if (!text && page.revisions[0].slots) {
      text = page.revisions[0].slots.main['*']
    }
    let meta = Object.assign({}, options, {
      title: page.title,
      pageID: page.pageid,
      namespace: page.ns,
      wikidata: page.pageprops.wikibase_item,
      description: page.pageprops['wikibase-shortdesc'],
    })
    try {
      return { wiki: text, meta: meta }
    } catch (e) {
      console.error(e)
      throw e
    }
  })
  return docs
}
module.exports = getResult
