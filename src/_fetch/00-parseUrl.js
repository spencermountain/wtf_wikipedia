/**
 * parses out the domain and title from a url
 *
 * @private
 * @param {string} url the url that will be parsed
 * @returns {{domain: string, title: string}} the domain and title of a url
 */
const parseUrl = function (url) {
  let parsed = new URL(url) //eslint-disable-line
  let title = parsed.pathname.replace(/^\/(wiki\/)?/, '')
  title = decodeURIComponent(title)
  return {
    domain: parsed.host,
    title: title,
  }
}
module.exports = parseUrl
