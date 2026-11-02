import makeHeaders from './_headers.js'
import { normalize, defaults, toUrlParams } from './_fns.js'

const params = {
  action: 'query',
  prop: 'imageinfo',
  iiprop: 'extmetadata',
  format: 'json',
  origin: '*',
}

const makeUrl = function (file, options) {
  const domain = options.domain || 'commons.wikimedia.org'
  let url = `https://${domain}/${options.path}?`
  url += toUrlParams(params)
  url += `&titles=${normalize(file)}`
  return url
}

// pull the license fields out of an imageinfo response
const parseLicense = function (res) {
  const pages = Object.values(res.query?.pages || {})
  if (pages.length === 0 || !pages[0].imageinfo || !pages[0].imageinfo[0]) {
    return null
  }
  const meta = pages[0].imageinfo[0].extmetadata || {}
  return {
    license: meta.LicenseShortName?.value || '',
    artist: meta.Artist?.value || '',
    credit: meta.Credit?.value || '',
    attributionRequired: meta.AttributionRequired?.value || '',
  }
}

// fetch license + attribution info for an image file, from the commons API
const imageLicense = function (file, options, http) {
  options = { ...defaults, ...options }
  const url = makeUrl(file, options)
  const headers = makeHeaders(options)
  return http(url, headers).then(parseLicense)
}
export default imageLicense
