//parses the mediawiki api response into something usable - its data-format is nutso

// displaytitle may carry html, like '<i>The Art of War</i>'
const stripHtml = function (str: string) {
  str = str.replace(/<[^<>]*>/g, '')
  str = str.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#0?39;/g, "'")
  return str
}

// walk the response's redirect + normalization maps backwards,
// to find which requested title produced this page
const requestedTitle = function (query, pageTitle) {
  let title = pageTitle
  const redirects = query.redirects || []
  for (let i = 0; i < redirects.length; i += 1) {
    const hop = redirects.find((r) => r.to === title)
    if (!hop) {
      break
    }
    title = hop.from
  }
  const norm = (query.normalized || []).find((n) => n.to === title)
  if (norm) {
    title = norm.from
  }
  return title
}

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
    if (Object.hasOwn(page, 'missing') || Object.hasOwn(page, 'invalid')) {
      return null
    }

    // a page can exist without any revisions - protect against it
    let rev = page.revisions?.[0]
    if (!rev) {
      return null
    }
    // formatversion=2 puts the text in .content - older wikis return the v1 '*' shapes
    let text = rev.slots?.main?.content ?? rev.slots?.main?.['*'] ?? rev['*']
    let revisionID = rev.revid
    let timestamp = rev.timestamp

    page.pageprops ||= {}

    let domain = options.domain
    if (!domain && options.wiki) {
      domain = `${options.wiki}.org`
    }

    let props = page.pageprops
    let meta = {
      ...options,
      title: page.title,
      pageId: page.pageid,
      namespace: page.ns,
      domain,
      revisionId: revisionID,
      timestamp,
      // prefer the free-licensed page-image, fall back to the non-free one
      pageImage: props['page_image_free'] || props['page_image'],
      wikidata: props.wikibase_item,
      // prop=description works in any language - the shortdesc pageprop is enwiki-only
      description: page.description || props['wikibase-shortdesc'],
      // set by {{DISPLAYTITLE:}}, present only when it differs from the title
      displayTitle: props.displaytitle ? stripHtml(props.displaytitle) : undefined,
      // the page's category sort-key, like 'Beauvoir, Simone de'
      defaultSort: props.defaultsort,
      // authoritative flag from the mediawiki disambiguator extension
      isDisambig: Object.hasOwn(props, 'disambiguation') ? true : undefined,
    }

    return { wiki: text, meta: meta, requested: requestedTitle(data.query, page.title) }
  })
}

export default getResult
