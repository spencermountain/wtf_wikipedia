const parseUrl = function (url) {
  let parsed = new URL(url)  
  let title = parsed.pathname.replace(/^\/(wiki\/)?/, '')
  title = decodeURIComponent(title)
  return {
    domain: parsed.host,
    title: title,
  }
}
export default parseUrl
