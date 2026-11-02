import { normalize, defaults, toUrlParams, apiBase } from './_fns.js'
import makeHeaders from './_headers.js'

// the TextExtracts api renders a page as plaintext (prose only - tables,
// infoboxes and references are dropped by the server)
const params = {
  action: 'query',
  prop: 'extracts',
  explaintext: '1',
  redirects: '1',
  format: 'json',
  formatversion: '2',
  origin: '*',
}

const makeUrl = function (title, options, sections) {
  let url = apiBase(options)
  url += toUrlParams({ ...params, exsectionformat: sections })
  url += `&titles=${normalize(title)}`
  return url
}

const getExtract = function (title, options, http) {
  options = { ...defaults, ...options }
  // 'wiki' keeps '== heading ==' lines, 'plain' bare text, 'raw' internal markers
  let sections = options.sections
  if (sections !== 'plain' && sections !== 'raw') {
    sections = 'wiki'
  }
  const url = makeUrl(title, options, sections)
  const headers = makeHeaders(options)
  return http(url, headers).then((res) => {
    return res?.query?.pages?.[0]?.extract ?? null
  })
}
export default getExtract
