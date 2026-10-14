import makeHeaders from './_headers.js'
import { normalize, defaults, toUrlParams } from './_fns.js'
const isCategory = /^(category|catégorie|kategorie|categoría|categoria|categorie|kategoria)/i

const params = {
  action: 'query',
  list: 'categorymembers',
  cmlimit: 500,
  cmtype: 'page|subcat',
  cmnamespace: '0|14',
  format: 'json',
  origin: '*',
  redirects: true
}

const fetchIt = function (url, options, http, prop) {
  const headers = makeHeaders(options)
  return http(url, headers).then((res) => {
    const pages = Object.keys(res.query[prop] || {})
    if (pages.length === 0) {
      return { pages: [], cursor: null }
    }
    const arr = pages.map((k) => res.query[prop][k])
    return {
      pages: arr,
      cursor: res.continue
    }
  })
}

const makeUrl = function (title, options, append) {
  let url = `https://${options.lang}.wikipedia.org/${options.path}?`
  if (options.domain) {
    url = `https://${options.domain}/${options.path}?`
  }
  url += toUrlParams(params)
  if (isCategory.test(title) === false) {
    title = 'Category:' + title
  }
  url += `&cmtitle=${normalize(title)}`
  url += `&cmprop=ids|title|type`
  if (append) {
    url += append
  }
  return url
}

const getOneCategory = async function (title, options, http) {
  let list = []
  let getMore = true
  let append = ''
  while (getMore) {
    const url = makeUrl(title, options, append)
    const { pages, cursor } = await fetchIt(url, options, http, 'categorymembers')
    list = list.concat(pages)
    if (cursor && cursor.cmcontinue) {
      append = '&cmcontinue=' + cursor.cmcontinue
    } else {
      getMore = false
    }
  }
  return list
}

// eslint-disable-next-line max-params
async function getCategoriesRecursively(
  title,
  options,
  exclusions,
  maxDepth,
  currentDepth,
  pagesSeen,
  http
) {
  const results = await getOneCategory(title, options, http)
  //check if we should recur - either if maxDepth not set or if we're not going to exceed it in this recursion
  if (maxDepth === undefined || currentDepth < maxDepth) {
    let categories = results.filter((entry) => entry.type === 'subcat')
    if (exclusions) {
      categories = categories.filter((category) => !exclusions.includes(category.title))
    }
    //prevent infinite loops by discarding any subcats we've already seen
    categories = categories.filter((category) => !pagesSeen.includes(category.title))
    pagesSeen.push(...categories.map((category) => category.title))
    const subCatResults = []
    for (const category of categories) {
      const subCatResult = await getCategoriesRecursively(
        category.title,
        options,
        exclusions,
        maxDepth,
        currentDepth + 1,
        pagesSeen,
        http
      )
      subCatResults.push(subCatResult)
    }
    return results.concat(...subCatResults)
  } else {
    return results
  }
}

async function getCategory(title, options, http) {
  options = { ...defaults, ...options }
  const exclusions = options?.categoryExclusions
  const recursive = options?.recursive === true
  const maxDepth = options?.maxDepth
  if (recursive) {
    return await getCategoriesRecursively(title, options, exclusions, maxDepth, 0, [], http)
  } else {
    return await getOneCategory(title, options, http)
  }
}

export default getCategory
