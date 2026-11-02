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
type ApiResponse = {
  error?: { code?: string; info?: string }
  query?: { pages?: Record<string, unknown> }
}

const defaults: FetchOptions = {
  lang: docDefaults.lang,
  wiki: docDefaults.project,
  domain: undefined,
  follow_redirects: true,
  path: 'api.php', //some 3rd party sites use a weird path
}

const getJson = function (url: string, headers: RequestInit, silent?: boolean): Promise<ApiResponse> {
  return fetch(url, headers)
    .catch((e) => {
      // the request never got a response - explain why, then reject as before
      if (!silent) {
        warnNetwork(url, e)
      }
      throw e
    })
    .then((res) => {
      if (res.ok !== true) {
        if (!silent) {
          warnHttp(res.status, url, res.headers?.get?.('retry-after'))
        }
        throw new Error(`HTTP ${res.status} error fetching: ${url}`)
      }
      return res.json()
    })
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

  return Promise.resolve()
    .then(() =>
      Promise.all(
        groups.map((group) => {
          const url = makeUrl({ ...opts, title: group })
          if (!url) {
            throw new Error(`Could not create a fetch-url from '${title}'`)
          }
          return getJson(url, headers, opts.silent).then((res) => {
            if (!res) {
              throw new Error(`No JSON Data Found For ${url}`)
            }
            // a 200-ok response can still carry an api error, like 'maxlag'
            if (res.error && !opts.silent) {
              warnApi(res.error, url)
            }
            return getResult(res, opts) || []
          })
        })
      )
    )
    .then((results) => {
      const found = results.flat()
      return parseDoc(found, title)
    })
}
export default fetchPage
