/**
 * parses the media wiki api response to something we can use
 *
 * the data-format from mediawiki api is nutso
 *
 * @private
 * @param {object} data
 * @param {object} [options]
 * @returns {*} result
 */
const getResult = function (data, options = {}) {
  // handle nothing found or no data passed
  if (!data?.query?.pages || !data?.query || !data) {
    return null
  }

  //get all the pagesIds from the result
  let pages = Object.keys(data.query.pages)

  // map over the pageIds to parse out all the information
  return pages.map((id) => {
    // get the page by pageID

    let page = data.query.pages[id] || {}

    // if the page is missing or not found than return null
    if (page.hasOwnProperty('missing') || page.hasOwnProperty('invalid')) {
      return null
    }

    // get the text from the object
    let text = page.revisions[0]['*']
    // if the text is not found in the regular place than it is at the other place
    if (!text && page.revisions[0].slots) {
      text = page.revisions[0].slots.main['*']
    }
    let revisionID = page.revisions[0].revid
    let timestamp = page.revisions[0].timestamp

    page.pageprops = page.pageprops || {}

    let domain = options.domain
    if (!domain && options.wiki) {
      domain = `${options.wiki}.org`
    }

    let meta = Object.assign({}, options, {
      title: page.title,
      pageID: page.pageid,
      namespace: page.ns,
      domain,
      revisionID,
      timestamp,
      pageImage: page.pageprops['page_image_free'],
      wikidata: page.pageprops.wikibase_item,
      description: page.pageprops['wikibase-shortdesc'],
    })

    return { wiki: text, meta: meta }
  })
}

export default getResult
