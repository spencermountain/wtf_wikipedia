import type { DocInfo } from '../../../../types/index.ts'
import defaults from '../../../../_lib/defaults.ts'
//remove the top/bottom off the template
import strip from './_strip.ts'
import fmtName from './_fmtName.ts'
import parseBlock from '../../../block/index.ts'
import pipeSplitter from './01-pipe-splitter.ts'
import keyMaker from './02-keyMaker.ts'
import cleanup from './03-cleanup.ts'

const parseArguments = (tmpl: string, order = [], opts: DocInfo = defaults) => {
  //remove {{}}'s and split based on pipes
  tmpl = strip(tmpl || '')
  let arr = pipeSplitter(tmpl)
  //get template name
  let name = arr.shift()

  //name each value
  let obj = keyMaker(arr, order)

  //remove wiki-junk
  obj = cleanup(obj)

  //using '|1=content' is an escaping-thing..
  if (obj['1'] && order[0] && Object.hasOwn(obj, order[0]) === false) {
    //move it over..
    obj[order[0]] = obj['1']
    delete obj['1']
  }

  // Preserve rich values here; callers choose whether to simplify them.
  const keys = Object.keys(obj)
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i]
    if (key === 'list') {
      const values = obj[key]
      for (let j = 0; j < values.length; j += 1) {
        values[j] = parseBlock(values[j], opts)
      }
    } else {
      obj[key] = parseBlock(obj[key], opts)
    }
  }

  //add the template name
  if (name) {
    obj.template = fmtName(name)
  }
  return obj
}
export default parseArguments
