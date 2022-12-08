//remove the top/bottom off the template
import strip from './_strip.js'
import fmtName from './_fmtName.js'
import { fromText as parseSentence } from '../../../04-sentence/index.js'
import pipeSplitter from './01-pipe-splitter.js'
import keyMaker from './02-keyMaker.js'
import cleanup from './03-cleanup.js'

/**
 * most templates just want plaintext...
 *
 * @private
 * @param {str} str
 * @param {'json' | 'raw'} [fmt]
 * @returns {string} text
 */
const makeFormat = function (str, fmt) {
  let s = parseSentence(str)
  //support various output formats
  if (fmt === 'json') {
    return s.json()
  } else if (fmt === 'raw') {
    return s
  }
  //default to flat text
  return s.text()
}

/**
 * parses the parameters of a template to a usable format
 *
 * @private
 * @param {string} tmpl the template text
 * @param {string[]} [order] the order in which the parameters are returned
 * @param {'json' | 'raw'} [fmt] whether you wan to parse the text of the template the raw object or just the text
 * @returns {object} the parameters of the template in a usable format
 */
const parser = function (tmpl, order = [], fmt) {
  //remove {{}}'s and split based on pipes
  tmpl = strip(tmpl || '')
  let arr = pipeSplitter(tmpl)
  //get template name
  let name = arr.shift()

  //name each value
  let obj = keyMaker(arr, order)

  //remove wiki-junk
  obj = cleanup(obj)

  //is this a infobox/reference?
  //let known = isKnown(obj);

  //using '|1=content' is an escaping-thing..
  if (obj['1'] && order[0] && obj.hasOwnProperty(order[0]) === false) {
    //move it over..
    obj[order[0]] = obj['1']
    delete obj['1']
  }

  Object.keys(obj).forEach((k) => {
    if (k === 'list') {
      obj[k] = obj[k].map((v) => makeFormat(v, fmt))
      return
    }
    obj[k] = makeFormat(obj[k], fmt)
  })

  //add the template name
  if (name) {
    obj.template = fmtName(name)
  }
  return obj
}
export default parser
