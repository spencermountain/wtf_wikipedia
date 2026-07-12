//parses the mediawiki api response into something usable - its data-format is nutso
const getResult = function (data, options: any = {}) {
  // handle nothing found or no data passed
  if (!data?.query?.pages) {
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

    // a page can exist without any revisions - protect against it
    let rev = page.revisions?.[0]
    if (!rev) {
      return null
    }
    // get the text from the object
    let text = rev['*']
    // if the text is not found in the regular place than it is at the other place
    if (!text && rev.slots) {
      text = rev.slots.main['*']
    }
    let revisionID = rev.revid
    let timestamp = rev.timestamp

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
