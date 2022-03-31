import schema from './index'
/** add spaces at the end */
const indent = function (str = '', width) {
  let pad = ''.padStart(width, ' ')
  return pad + str
}

const hasData = function (obj) {
  // is it an object
  if (!obj || Object.prototype.toString.call(obj) !== '[object Object]') {
    return false
  }
  // does it have zero properties
  return Object.keys(obj).length > 0
}

const doChildren = function (obj, depth) {
  if (obj.id) {
    let name = indent('' + obj.id, depth * 3)
    if (hasData(obj.children)) {
      console.log(`${name}:`)
    } else {
      console.log(`${name} : true`)
    }
    // print properties
    // if (hasData(obj.properties)) {
    //   Object.keys(obj.properties).forEach((k) => {
    //     console.log(indent(`[${k}]`, depth * 3 + 4))
    //   })
    // }
  }
  depth += 1
  Object.keys(obj.children).forEach((k) => {
    doChildren(obj.children[k], depth)
  })
}
console.log('\n\n')
doChildren(schema, 0)
console.log('\n\n')
// console.log(JSON.stringify(schema, null, 2))
