import makeHeaders from './_headers.js'

// make a HEAD request, to double-check the image url actually resolves
// returns true/false, or null when the request itself failed
const imageExists = function (url, options = {}) {
  const headers = makeHeaders(options)
  headers.method = 'HEAD'
  return fetch(url, headers)
    .then((res) => /^[23]/.test(String(res.status)))
    .catch(() => null)
}
export default imageExists
