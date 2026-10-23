import defaultParse from '../../parse/templates/parse/toJSON/text.ts'

const generic = function (tmpl, list, _parser = defaultParse, alias) {
  let obj = _parser(tmpl)
  if (alias) {
    obj.name = obj.template
    obj.template = alias
  }
  list.push(obj)
  return ''
}
// it may seem redundant,
// but we need these templates for our i18n mappings
const misc = {
  persondata: generic,
  taxobox: generic,
  citation: generic,
  portal: generic,
  reflist: generic,
  'cite book': generic,
  'cite journal': generic,
  'cite web': generic,
  'commons cat': generic,
  'election box candidate': generic,
  'election box begin': generic,
  main: generic,
}
export default misc
