import version from '../../_version.ts'
import type { FetchOptions } from '../../types/index.ts'

// the api guidelines want 'name/version (contact)' - still, set your own
const defaultAgent = `wtf_wikipedia/${version} (https://github.com/spencermountain/wtf_wikipedia)`

const makeHeaders = function (options: FetchOptions): RequestInit {
  let agent = options.userAgent || options['User-Agent'] || options['Api-User-Agent'] || defaultAgent

  let origin
  if (options.noOrigin) {
    origin = ''
  } else {
    origin = options.origin || options.Origin || '*'
  }

  return {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Api-User-Agent': agent,
      'User-Agent': agent,
      Origin: origin,
      'Accept-Encoding': 'gzip',
    },
    redirect: 'follow',
  }
}
export default makeHeaders
