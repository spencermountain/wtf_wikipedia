/* eslint-disable no-console */
import unfetch from 'isomorphic-unfetch'

/**
 * use the native client-side fetch function
 *
 * @private
 * @param {string} url the url that well be fetched
 * @param {Object} opts the options for fetch
 * @returns {Promise<any>} the response from fetch
 */
const request = function (url, opts) {
  return unfetch(url, opts).then(function (res) {
    return res.json()
  }).catch((e) => {
    console.error('\n\n=-=- http response error =-=-=-')
    console.error(url)
    console.error(e)
    return {}
  })
}
export default request