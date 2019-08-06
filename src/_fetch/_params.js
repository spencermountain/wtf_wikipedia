//allow quite! flexible params to fetch, category
// [lang], [options], [callback]
const getParams = function(a, b, c) {
  let options = {}
  let lang = 'en'
  let callback = null
  if (typeof a === 'function') {
    callback = a
  } else if (typeof a === 'object') {
    options = a
  } else if (typeof a === 'string') {
    lang = a
  }
  if (typeof b === 'function') {
    callback = b
  } else if (typeof b === 'object') {
    options = b
  }
  if (typeof c === 'function') {
    callback = c
  }
  return {
    options: options,
    lang: lang,
    callback: callback
  }
}
module.exports = getParams
