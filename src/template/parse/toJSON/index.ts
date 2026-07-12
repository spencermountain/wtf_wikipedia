//remove the top/bottom off the template
import strip from './_strip.ts'
import fmtName from './_fmtName.ts'
import { fromText as parseSentence } from '../../../04-sentence/index.ts'
import pipeSplitter from './01-pipe-splitter.ts'
import keyMaker from './02-keyMaker.ts'
import cleanup from './03-cleanup.ts'

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

const parser = function (tmpl, order = [], fmt?: string) {
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
