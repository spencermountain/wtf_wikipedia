//every value in {{tmpl|a|b|c}} needs a name
//here we come up with names for them
const hasKey = /^[\p{Letter}0-9._/\- '()\t]+=/iu

//templates with these properties are asking for trouble
const reserved = {
  template: true,
  list: true,
  prototype: true,
}

/**
 * @typedef parseKeyReturn
 * @property {string} val
 * @property {string} key
 */

/**
 * turn 'key=val' into {key:key, val:val}
 *
 * @param {string} str the string that will be parsed
 * @returns {parseKeyReturn} the spit string
 */
const parseKey = function (str) {
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
    val: val.trim(),
  }
}

/**
 * turn [a, b=v, c] into {'1':a, b:v, '2':c}
 *
 * @private
 * @param {string[]} arr the array of parameters
 * @param {string[]} [order] the order in which the parameters are returned
 * @returns {object} and object with the names as the keys and the values as the values
 */
const keyMaker = function (arr, order) {
  let keyIndex = 0
  return arr.reduce((h, str = '') => {
    str = str.trim()

    //support named keys - 'foo=bar'
    if (hasKey.test(str) === true) {
      let res = parseKey(str)
      if (res.key) {
        // don't overwrite if empty
        if (h[res.key] && !res.val) {
          return h
        }
        h[res.key] = res.val
        return h
      }
    }

    //if the current index is present in the order array then we have a name for the key
    if (order && order[keyIndex]) {
      let key = order[keyIndex]
      h[key] = str
    } else {
      h.list = h.list || []
      h.list.push(str)
    }

    keyIndex += 1
    return h
  }, {})
}

export default keyMaker
