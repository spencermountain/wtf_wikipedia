import ignore from './_ignore.ts'
import { isInfobox, fmtInfobox } from './_infobox.ts'
import templates from '../../../templates/index.ts'
import toJSON from './toJSON/index.ts'
import { isArray, isObject } from '../../../_lib/helpers.ts'

const nums = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

//this gets all the {{template}} objects and decides how to parse them
const parseTemplate = function (wiki: string, name: string) {
  // dont bother with some junk templates
  if (ignore.has(name) === true) {
    return ['']
  }
  //{{infobox settlement...}}
  if (isInfobox(name) === true) {
    let obj = toJSON(wiki, [], 'raw')
    // list.push(infobox.format(obj))
    return ['', fmtInfobox(obj)]
  }
  //cite book, cite arxiv...
  if (/^cite [a-z]/.test(name) === true) {
    let obj = toJSON(wiki)
    obj.type = obj.template
    obj.template = 'citation'
    // list.push(obj)
    return ['', obj]
  }
  // ok, here we go!
  //parse some known templates
  if (Object.hasOwn(templates, name) === true) {
    //handle number-syntax
    if (typeof templates[name] === 'number') {
      let obj = toJSON(wiki, nums)
      let key = String(templates[name])
      return [obj[key] || '']
    }
    //handle string-syntax
    if (typeof templates[name] === 'string') {
      return [templates[name]]
    }
    //handle array sytax
    if (isArray(templates[name]) === true) {
      let obj = toJSON(wiki, templates[name])
      // list.push(obj)
      return ['', obj]
    }
    //handle object sytax
    if (isObject(templates[name]) === true) {
      let obj = toJSON(wiki, templates[name].props)
      // list.push(obj)
      return [obj[templates[name].out], obj]
    }
    //handle function syntax
    if (typeof templates[name] === 'function') {
      // let json = toJSON(tmpl.body)
      //(tmpl, list, alias, doc)
      let arr = []
      let txt = templates[name](wiki, arr, toJSON, null)
      return [txt, arr[0]]
    }
  }
  //an unknown template with data, so just keep it.
  let json = toJSON(wiki)
  if (Object.keys(json).length === 0) {
    // list.push(json)
    json = null
  }
  //..then remove it
  return ['', json]
}
export default parseTemplate
