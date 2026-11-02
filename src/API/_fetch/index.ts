import parseUrl from './parseUrl.ts'
import makeUrl from './makeUrl.ts'
import getResult from './getResult.ts'
import parseDoc from './parseDoc.ts'
import makeHeaders from './_headers.ts'
import { warnHttp, warnNetwork, warnApi } from '../_lib/warn.ts'
import { isArray } from '../../_lib/helpers.ts'
import docDefaults from '../../_lib/defaults.ts'
import normalizeProject from '../../_lib/project.ts'
import type Document from '../01-document/Document.ts'
import type { FetchOptions } from '../../types/index.ts'

const isUrl = /^https?:\/\//

//the mediawiki api only allows 50 titles or pageids per request
const chunkSize = 50

//a page title, a pageid, an array of either, or anything with an .href, like a URL
type FetchInput = string | number | Array<string | number> | { href: string }

//the parts of a mediawiki api json response we look at
//formatversion=2 returns pages as an array - v1 keys them by pageid
type ApiResponse = {
  error?: { code?: string; info?: string }
  continue?: Record<string, string>
  batchcomplete?: boolean | string
  query?: { pages?: Record<string, unknown> | unknown[] }
}

const defaults: FetchOptions = {
  lang: docDefaults.lang,
  wiki: docDefaults.project,
  domain: undefined,
  follow_redirects: true,
  path: 'api.php', //some 3rd party sites use a weird path
}

const sleep = function (ms: number) {
  return new Promise((ok) => setTimeout(ok, ms))
}

//these http errors are temporary - the server says how long to wait
const transient = new Set([429, 503])

//the Retry-After header, in ms - 0 when missing, or longer than we'll wait
const retryWait = function (res): number {
  const after = Number(res.headers?.get?.('retry-after'))
  if (after > 0 && after <= 10) {
    return after * 1000
  }
  return 0
}

const getJson = async function (url: string, headers: RequestInit, silent?: boolean, isRetry?: boolean): Promise<ApiResponse> {
  let res
  try {
    res = await fetch(url, headers)
  } catch (e) {
    // the request never got a response - explain why, then reject as before
    if (!silent) {
      warnNetwork(url, e)
    }
    throw e
  }
  if (res.ok !== true) {
    // wait-out a short Retry-After, once, like the api guidelines ask
    const wait = retryWait(res)
    if (!isRetry && wait && transient.has(res.status)) {
      await sleep(wait)
      return getJson(url, headers, silent, true)
    }
    if (!silent) {
      warnHttp(res.status, url, res.headers?.get?.('retry-after'))
    }
    throw new Error(`HTTP ${res.status} error fetching: ${url}`)
  }
  const json = await res.json()
  // a lagged server asks non-urgent clients to wait a moment, then retry
  if (!isRetry && json?.error?.code === 'maxlag') {
    const wait = retryWait(res)
    if (wait) {
      await sleep(wait)
      return getJson(url, headers, silent, true)
    }
  }
  return json
}

const asPageList = function (res: ApiResponse): any[] {
  const pages = res?.query?.pages
  return isArray(pages) ? pages : Object.values(pages || {})
}

//'batchcomplete' says our pages are fully served - any further continue only pages-through older revisions
//it is `true` in formatversion=2, and '' in v1
const isDone = function (res: ApiResponse) {
  return res.batchcomplete === true || res.batchcomplete === '' || !res.continue
}

// a revision whose content got cut from the response
const noContent = function (revs: any[]) {
  return !revs || revs.length === 0 || revs.every((r) => !r.slots && r['*'] === undefined)
}

//copy-in anything the earlier response didn't have room for, page-by-page
const mergePages = function (pages: any[], extras: any[]) {
  const byId = {}
  pages.forEach((p) => (byId[p.pageid ?? p.title] = p))
  extras.forEach((p) => {
    const have = byId[p.pageid ?? p.title]
    if (!have) {
      pages.push(p)
      return
    }
    Object.keys(p).forEach((k) => {
      if (have[k] === undefined) {
        have[k] = p[k]
      }
    })
    // the page straddling the response boundary can arrive with empty revisions
    if (noContent(have.revisions) && !noContent(p.revisions)) {
      have.revisions = p.revisions
    }
  })
}

//large batches can overflow the api's response-size limit - it then returns
//some pages without content, plus a 'continue' param pointing at the rest
const getJsonAll = async function (url: string, headers: RequestInit, silent?: boolean): Promise<ApiResponse> {
  const res = await getJson(url, headers, silent)
  if (!res?.query) {
    return res
  }
  const pages = asPageList(res)
  let last = res
  for (let i = 0; i < 10 && !isDone(last); i += 1) {
    last = await getJson(url + '&' + new URLSearchParams(last.continue).toString(), headers, silent)
    mergePages(pages, asPageList(last))
  }
  res.query.pages = pages
  return res
}

//run the chunked requests one-at-a-time, as the wikimedia api guidelines ask
const fetchAll = async function (groups: Array<FetchOptions['title']>, opts: FetchOptions, headers: RequestInit) {
  const found = []
  for (const group of groups) {
    const url = makeUrl({ ...opts, title: group })
    if (!url) {
      throw new Error(`Could not create a fetch-url from '${group}'`)
    }
    const res = await getJsonAll(url, headers, opts.silent)
    if (!res) {
      throw new Error(`No JSON Data Found For ${url}`)
    }
    // a 200-ok response can still carry an api error, like 'maxlag'
    if (res.error && !opts.silent) {
      warnApi(res.error, url)
    }
    found.push(getResult(res, opts) || [])
  }
  return found.flat()
}

//a single pageID, title, or URL returns one Document; an array of pageIDs or
//titles returns an array of Documents. an array must be all pageIDs or all
//titles - the two can't be mixed.
const fetchPage = function (title: FetchInput, options?: FetchOptions | string): Promise<Document | Document[] | null> {
  // support lang as 2nd param
  if (typeof options === 'string') {
    options = { lang: options }
  }
  if (title && typeof title === 'object' && 'href' in title && typeof title.href === 'string') {
    title = title.href
  }
  const project = normalizeProject(options?.project ?? options?.wiki ?? docDefaults.project)
  let opts: FetchOptions = { ...defaults, ...options, wiki: project, project }
  opts.title = title as FetchOptions['title']

  //parse url input
  if (typeof title === 'string' && isUrl.test(title)) {
    opts = { ...opts, ...parseUrl(title) }
  }
  const headers = makeHeaders(opts)

  //split larger requests into groups the api will accept
  let groups: Array<FetchOptions['title']> = [opts.title]
  if (isArray(opts.title) && opts.title.length > chunkSize) {
    groups = []
    for (let i = 0; i < opts.title.length; i += chunkSize) {
      groups.push(opts.title.slice(i, i + chunkSize))
    }
  }

  return fetchAll(groups, opts, headers).then((found) => parseDoc(found, title))
}
export default fetchPage
