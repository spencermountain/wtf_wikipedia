const ignore = require('./_ignore')
const getName = require('./_parsers/_getName')
const parse = require('./_parsers/parse')
const inf = require('./_infobox')
const templates = require('./templates')
const generic = require('./_parsers/parse')
const nums = ['0', '1', '2', '3', '4', '5', '6', '7', '8']

// console.log(Object.keys(templates).length + ' Templates!');

const isArray = function(arr) {
  return Object.prototype.toString.call(arr) === '[object Array]'
}

//this gets all the {{template}} strings and decides how to parse them
const parseTemplate = function(tmpl, list) {
  let name = tmpl.name
  if (ignore.hasOwnProperty(name) === true) {
    return ''
  }
  // known template
  if (templates.hasOwnProperty(name) === true) {
    // handle number-syntax
    if (typeof templates[name] === 'number') {
      let obj = generic(tmpl, nums)
      let key = String(templates[name])
      return obj[key] || ''
    }

    // handle array sytax
    if (isArray(templates[name]) === true) {
      let obj = generic(tmpl, templates[name])
      list.push(obj)
      return ''
    }
    // handle function syntax
    if (typeof templates[name] === 'function') {
      return templates[name](tmpl, list)
    }
  }
  // unknown template, try to parse it
  let obj = parse(tmpl)
  if (list && Object.keys(obj).length > 0) {
    list.push(obj)
  }
  // ..then remove it
  return ''
}
module.exports = parseTemplate
