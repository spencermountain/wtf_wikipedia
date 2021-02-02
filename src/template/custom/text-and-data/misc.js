const parse = require('../../parse/toJSON')

const generic = function (tmpl, list, alias) {
  let obj = parse(tmpl)
  if (alias) {
    obj.name = obj.template
    obj.template = alias
  }
  list.push(obj)
  return ''
}

const misc = {
  //i18n templates
  persondata: generic,
  taxobox: generic,
  citation: generic,
  portal: generic,
  reflist: generic,
  'cite book': generic,
  'cite journal': generic,
  'cite web': generic,
  'commons cat': generic,
}
module.exports = misc
