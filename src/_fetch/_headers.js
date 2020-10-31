/**
 * @private
 * @typedef HeaderOptions
 * @property {string} redirect
 * @property {object} headers
 * @property {*} headers.Origin
 * @property {string} headers.Content-Type
 * @property {string} headers.Api-User-Agent
 * @property {string} headers.User-Agent
 * @property {string} method
 */

/**
 * factory for header options
 *
 * @private
 * @param {object} options
 * @returns {HeaderOptions} the generated options
 */
const makeHeaders = function (options) {
  let agent =
    options.userAgent || options['User-Agent'] || options['Api-User-Agent'] || 'User of the wtf_wikipedia library'

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
    },
    redirect: 'follow',
  }
}
module.exports = makeHeaders
