const ignore = require('./_ignore')
const toJSON = require('../toJSON')
const infobox = require('./_infobox')
const templates = require('../templates')
const generic = require('../toJSON')
const { isArray } = require('../../_lib/helpers')

const nums = ['0', '1', '2', '3', '4', '5', '6', '7', '8']

//this gets all the {{template}} strings and decides how to parse them
const parseTemplate = function (tmpl, list, doc) {
  let name = tmpl.name
  // dont bother with some junk templates
  if (ignore.hasOwnProperty(name) === true) {
    return ''
  }
  //{{infobox settlement...}}
  if (infobox.isInfobox(name) === true) {
    let obj = toJSON(tmpl.body, list, 'raw')
    list.push(infobox.format(obj))
    return ''
  }
  //cite book, cite arxiv...
  if (/^cite [a-z]/.test(name) === true) {
    let obj = toJSON(tmpl.body, list)
    obj.type = obj.template
    obj.template = 'citation'
    list.push(obj)
    return ''
  }
  // ok, here we go!
  let json = toJSON(tmpl.body)
  //parse some known templates
  if (templates.hasOwnProperty(name) === true) {
    //handle number-syntax
    if (typeof templates[name] === 'number') {
      let obj = generic(tmpl.body, nums)
      let key = String(templates[name])
      return obj[key] || ''
    }
    //handle string-syntax
    if (typeof templates[name] === 'string') {
      return templates[name]
    }
    //handle array sytax
    if (isArray(templates[name]) === true) {
      let obj = generic(tmpl.body, templates[name])
      list.push(obj)
      return ''
    }
    //handle function syntax
    if (typeof templates[name] === 'function') {
      //(tmpl, list, alias, doc)
      return templates[name](tmpl.body, list, null, doc)
    }
  }
  // if (doc) {
  // doc._missing_templates[name] = doc._missing_templates[name] || 0
  // doc._missing_templates[name] += 1
  // }
  //an unknown template with data, so just keep it.
  if (list && Object.keys(json).length > 0) {
    list.push(json)
  }
  //..then remove it
  return ''
}
module.exports = parseTemplate
