const ignore = require('./_ignore')
const getName = require('./_parsers/_getName')
const parse = require('./_parsers/parse')
const inf = require('./_infobox')
const templates = require('./templates')
const generic = require('./_parsers/parse')

const isArray = function(arr) {
  return Object.prototype.toString.call(arr) === '[object Array]'
}

// console.log(Object.keys(templates).length + ' Templates!');

//this gets all the {{template}} strings and decides how to parse them
const parseTemplate = function(tmpl, wiki, list) {
  let name = getName(tmpl)
  //we explicitly ignore these templates
  if (ignore.hasOwnProperty(name) === true) {
    wiki = wiki.replace(tmpl, '')
    return wiki
  }

  //match any known template forms (~1,000!)
  if (templates.hasOwnProperty(name) === true) {
    // handle generic shortened array-sytax
    if (isArray(templates[name]) === true) {
      let order = templates[name]
      let obj = generic(tmpl, order)
      list.push(obj)
      wiki = wiki.replace(tmpl, '')
      return wiki
    }
    // handle number-syntax
    if (typeof templates[name] === 'number') {
      let order = ['0', '1', '2', '3', '4', '5', '6', '7', '8']
      let obj = generic(tmpl, order)
      let key = String(templates[name])
      wiki = wiki.replace(tmpl, obj[key] || '')
      return wiki
    }
    //do full function syntax
    let str = templates[name](tmpl, list)
    wiki = wiki.replace(tmpl, str)
    return wiki
  }
  // {{infobox settlement...}}
  if (inf.isInfobox(name) === true) {
    let obj = parse(tmpl, list, 'raw')
    let infobox = inf.format(obj)
    list.push(infobox)
    wiki = wiki.replace(tmpl, '')
    return wiki
  }
  //cite book, cite arxiv...
  if (/^cite [a-z]/.test(name) === true) {
    let obj = parse(tmpl, list)
    list.push(obj)
    wiki = wiki.replace(tmpl, '')
    return wiki
  }
  //fallback parser
  let obj = parse(tmpl)
  if (obj !== null && Object.keys(obj).length > 0) {
    list.push(obj)
  }
  wiki = wiki.replace(tmpl, '')
  return wiki
}
module.exports = parseTemplate
