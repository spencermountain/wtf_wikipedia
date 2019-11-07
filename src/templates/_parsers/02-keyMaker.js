// every value in {{tmpl|a|b|c}} needs a name
// here we come up with names for them
const hasKey = /^[a-z0-9\u00C0-\u00FF\._\- '()œ]+=/iu

//templates with these properties are asking for trouble
const reserved = {
  template: true,
  list: true,
  prototype: true
}

//turn 'key=val' into {key:key, val:val}
const parseKey = function(str) {
  let parts = str.split('=')
  let key = parts[0] || ''
  key = key.toLowerCase().trim()
  let val = parts.slice(1).join('=')
  //don't let it be called 'template'..
  if (reserved.hasOwnProperty(key)) {
    key = '_' + key
  }
  return {
    key: key,
    val: val.trim()
  }
}

//turn [a, b=v, c] into {'1':a, b:v, '2':c}
const keyMaker = function(arr, order) {
  let o = 0
  return arr.reduce((h, str) => {
    str = (str || '').trim()
    //support named keys - 'foo=bar'
    if (hasKey.test(str) === true) {
      let res = parseKey(str)
      if (res.key) {
        h[res.key] = res.val
        return h
      }
    }
    //try a key from given 'order' names
    if (order && order[o]) {
      let key = order[o] //here goes!
      h[key] = str
    } else {
      h.list = h.list || []
      h.list.push(str)
    }
    o += 1
    return h
  }, {})
}

module.exports = keyMaker
