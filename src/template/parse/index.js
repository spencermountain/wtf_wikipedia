import ignore from './_ignore.js'
import { isInfobox, fmtInfobox } from './_infobox.js'
import templates from '../custom/index.js'
import toJSON from './toJSON/index.js'
import { isArray, isObject } from '../../_lib/helpers.js'

const nums = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

//this gets all the {{template}} objects and decides how to parse them
const parseTemplate = function (tmpl, doc) {
  let name = tmpl.name
  // dont bother with some junk templates
  if (ignore.hasOwnProperty(name) === true) {
    return ['']
  }
  //{{infobox settlement...}}
  if (isInfobox(name) === true) {
    let obj = toJSON(tmpl.body, [], 'raw')
    // list.push(infobox.format(obj))
    return ['', fmtInfobox(obj)]
  }
  //cite book, cite arxiv...
  if (/^cite [a-z]/.test(name) === true) {
    let obj = toJSON(tmpl.body)
    obj.type = obj.template
    obj.template = 'citation'
    // list.push(obj)
    return ['', obj]
  }
  // ok, here we go!
  //parse some known templates
  if (templates.hasOwnProperty(name) === true) {
    //handle number-syntax
    if (typeof templates[name] === 'number') {
      let obj = toJSON(tmpl.body, nums)
      let key = String(templates[name])
      return [obj[key] || '']
    }
    //handle string-syntax
    if (typeof templates[name] === 'string') {
      return [templates[name]]
    }
    //handle array sytax
    if (isArray(templates[name]) === true) {
      let obj = toJSON(tmpl.body, templates[name])
      // list.push(obj)
      return ['', obj]
    }
    //handle object sytax
    if (isObject(templates[name]) === true) {
      let obj = toJSON(tmpl.body, templates[name].props)
      // list.push(obj)
      return [obj[templates[name].out], obj]
    }
    //handle function syntax
    if (typeof templates[name] === 'function') {
      // let json = toJSON(tmpl.body)
      //(tmpl, list, alias, doc)
      let arr = []
      let txt = templates[name](tmpl.body, arr, toJSON, null, doc)
      return [txt, arr[0]]
    }
  }
  //if set, try using the global template fallback parser
  if (doc && doc._templateFallbackFn) {
    let arr = []
    let txt = doc._templateFallbackFn(tmpl.body, arr, toJSON, null, doc)
    if (txt !== null) {
      return [txt, arr[0]]
    }
  }
  //an unknown template with data, so just keep it.
  let json = toJSON(tmpl.body)
  if (Object.keys(json).length === 0) {
    // list.push(json)
    json = null
  }
  //..then remove it
  return ['', json]
}
export default parseTemplate
