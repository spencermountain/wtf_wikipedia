const parseUrl = function(url) {
  let parsed = new URL(url) //eslint-disable-line
  let title = parsed.pathname.replace(/^\/(wiki\/)?/, '')
  title = decodeURIComponent(title)
  return {
    domain: parsed.host,
    title: title
  }
}
module.exports = parseUrl
