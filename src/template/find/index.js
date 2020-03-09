const findFlat = require('./flat')
const getName = require('../_parsers/_getName')

const parseTemplate = function(tmpl) {
  return {
    tmpl: tmpl,
    name: getName(tmpl),
    children: []
  }
}

const hasTemplate = function(str) {
  return /\{\{/.test(str.substr(2)) === true
}

const doEach = function(obj) {
  // peel-off top-level
  let wiki = obj.tmpl.substr(2)
  wiki = wiki.replace(/\}\}$/, '')

  obj.children = findFlat(wiki)
  obj.children = obj.children.map(parseTemplate)

  if (obj.children.length === 0) {
    return obj
  }
  obj.children.forEach(ch => {
    if (hasTemplate(ch.tmpl)) {
      return doEach(ch)
    }
    return null
  })
  return obj
}

const doAll = function(wiki) {
  let list = findFlat(wiki)
  list = list.map(parseTemplate)
  list = list.map(doEach)
  return list
}

module.exports = doAll

let str = `start
{{one|inside here
  {{two| a}}
  {{twob| b
    {{three |none}}    
  }}
}}
{{one-more|hi}}
end`

console.log(JSON.stringify(doAll(str), null, 2))
