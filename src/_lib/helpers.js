function capitalise(str) {
  if (str && typeof str === 'string') {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }
  return ''
}

//trims the ends, collapses double-spaces, and removes whitespace before commas
function trim_whitespace(str) {
  if (str && typeof str === 'string') {
    str = str.replace(/^\s+/, '')
    str = str.replace(/\s+$/, '')
    str = str.replace(/ {2,}/g, ' ')
    str = str.replace(/\s, /g, ', ')
    return str
  }
  return ''
}

function isArray(x) {
  return Object.prototype.toString.call(x) === '[object Array]'
}

function isObject(x) {
  return x && Object.prototype.toString.call(x) === '[object Object]'
}

export {
  capitalise,
  trim_whitespace,
  isArray,
  isObject,
}
