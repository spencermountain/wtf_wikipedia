/* eslint-disable no-console */

// test if the image url exists or not
const imgExists = function () {
  const userAgent = this.data['_userAgent']
  return fetch(this.url(), {
    method: 'HEAD',
    headers: {
      'Api-User-Agent': userAgent,
      'User-Agent': userAgent
    }
  })
    .then(resp => {
      const status = String(resp.status) || ''
      return /^[23]/.test(status)
    })
    .catch(e => {
      console.warn(`wtf-plugin-image: request failed - ${e.message}`)
      return null
    })
}
export default imgExists
