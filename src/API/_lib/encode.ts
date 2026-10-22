//dumpster-dive throws everything into mongodb  - github.com/spencermountain/dumpster-dive
//mongo has some opinions about what characters are allowed as keys and ids.
//https://stackoverflow.com/questions/12397118/mongodb-dot-in-key-name/30254815#30254815

//encodes a string to make it mongodb-compatible
//https://stackoverflow.com/questions/12397118/mongodb-dot-in-key-name/30254815#30254815
const encodeStr = function (str) {
  if (typeof str !== 'string') {
    str = ''
  }
  str = str.replace(/\\/g, '\\\\')
  str = str.replace(/^\$/, '\\u0024')
  str = str.replace(/\./g, '\\u002e')
  return str
}

// Return encoded copies so serialization never changes parser data.
const encodeObj = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map((value) => encodeObj(value))
  }
  if (obj === null || typeof obj !== 'object') {
    return obj
  }
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [encodeStr(key), encodeObj(value)])
  )
}

export default encodeObj
