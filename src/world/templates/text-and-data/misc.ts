import defaultParse from '../../../parse/templates/parse/toJSON/text.ts'
import normalizeCite from './_cite-params.ts'

const generic = function (tmpl, _parser = defaultParse) {
  let obj = _parser(tmpl)
  return { data: obj, replacement: '' }
}
// citations also fold english param synonyms ('surname', 'pp'..) onto their canonical names
const cite = function (tmpl, _parser = defaultParse) {
  let obj = normalizeCite(_parser(tmpl))
  return { data: obj, replacement: '' }
}
// it may seem redundant,
// but we need these templates for our i18n mappings
const misc = {
  persondata: generic,
  taxobox: generic,
  citation: cite,
  portal: generic,
  reflist: generic,
  'cite book': cite,
  'cite journal': cite,
  'cite web': cite,
  'commons cat': generic,
  'election box candidate': generic,
  'election box begin': generic,
}
export default misc
