import unfetch from 'isomorphic-unfetch'

// test if the image url exists or not
const imgExists = function (callback) {
  const userAgent = this.data['_userAgent']
  return unfetch(this.url(), {
    method: 'HEAD',
    headers: {
      'Api-User-Agent': userAgent,
      'User-Agent': userAgent
    }
  })
    .then(resp => {
      //support callback non-promise form
      let status = String(resp.status) || ''
      let bool = /^[23]/.test(status)
      if (callback) {
        callback(null, bool)
      }
      return bool
    })
    .catch(e => {
      console.error(e)
      if (callback) {
        callback(e, null)
      }
      return null
    })
}
export default imgExists
