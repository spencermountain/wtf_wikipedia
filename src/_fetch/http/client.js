/**
 * use the native client-side fetch function
 *
 * @private
 * @param {string} url the url that well be fetched
 * @param {object} opts the options for fetch
 * @returns {Promise<Response>} the response from fetch
 */
const request = function (url, opts) {
  return fetch(url, opts).then(function (res) {
    return res.json()
  })
}
module.exports = request
