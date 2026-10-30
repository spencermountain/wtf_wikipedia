function capitalise(str) {
  if (str && typeof str === 'string') {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }
  return ''
}

//trims the ends, collapses double-spaces, and removes whitespace before commas
function trim_whitespace(str) {
  if (str && typeof str === 'string') {
    str = str.trim()
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

// used to soften table headers and infobox keys for easier lookup
const normalizeKey = function (key = '') {
  key = key.toLowerCase()
  key = key.replace(/[ -]/g, '_')
  key = key.replace(/(^[^(\r\n\u2028\u2029]*)\(.*?\)/m, '$1')
  key = key.trim()
  return key
}

// CJK scripts do not put spaces between sentences
const cjk = '\\p{Script=Han}\\p{Script=Hiragana}\\p{Script=Katakana}\\p{Script=Bopomofo}。、，！？：；「」『』（）'
const cjkEnd = new RegExp(`[${cjk}]$`, 'u')
const cjkStart = new RegExp(`^[${cjk}]`, 'u')
const joinSentences = function (arr: string[] = []) {
  return arr.reduce((str, next, i) => {
    if (i === 0) {
      return next
    }
    if (cjkEnd.test(str) && cjkStart.test(next)) {
      return str + next
    }
    return str + ' ' + next
  }, '')
}

export { capitalise, trim_whitespace, isArray, isObject, normalizeKey, joinSentences }
