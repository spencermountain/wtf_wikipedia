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
const parseTemplate = function(tmpl, wiki, data) {
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
      data.templates.push(obj)
      wiki = wiki.replace(tmpl, '')
      return wiki
    }
    //do full function syntax
    let str = templates[name](tmpl, data)
    wiki = wiki.replace(tmpl, str)
    return wiki
  }
  // {{infobox settlement...}}
  if (inf.isInfobox(name) === true) {
    let obj = parse(tmpl, data, 'raw')
    let infobox = inf.format(obj)
    data.templates.push(infobox)
    wiki = wiki.replace(tmpl, '')
    return wiki
  }
  //cite book, cite arxiv...
  if (/^cite [a-z]/.test(name) === true) {
    let obj = parse(tmpl, data)
    data.templates.push(obj)
    wiki = wiki.replace(tmpl, '')
    return wiki
  }
  //fallback parser
  let obj = parse(tmpl)
  if (obj !== null && Object.keys(obj).length > 0) {
    data.templates.push(obj)
  }
  wiki = wiki.replace(tmpl, '')
  return wiki
}
module.exports = parseTemplate
