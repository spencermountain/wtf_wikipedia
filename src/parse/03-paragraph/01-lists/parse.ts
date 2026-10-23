import defaults from '../../../_lib/defaults.ts'
import parseBlock from '../../block/index.ts'
import type { DocInfo, BlockData } from '../../../types/index.ts'

const list_reg = /^[#*:;|]+/
const bullet_reg = /^\*+[^:,|]{4}/
const number_reg = /^ ?#[^:,|]{4}/

// does it start with a bullet point or something?
const isList = function (line: string) {
  return list_reg.test(line) || bullet_reg.test(line) || number_reg.test(line)
}

//make bullets/numbers into human-readable *'s
const cleanList = function (lines: string[], opts: DocInfo = defaults) {
  let number = 1
  const list: BlockData[] = []
  lines = lines.filter((l) => l)
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i]
    //add # numberings formatting
    if (line.match(number_reg)) {
      line = line.replace(/^ ?#*/, number + ') ')
      line = line + '\n'
      number += 1
    } else if (line.match(list_reg)) {
      number = 1
      line = line.replace(list_reg, '')
    }
    list.push(parseBlock(line, opts))
  }
  return list
}

const grabList = function (lines: string[], i: number, opts: DocInfo = defaults) {
  let subset = []
  for (let o = i; o < lines.length; o++) {
    if (isList(lines[o])) {
      subset.push(lines[o])
    } else {
      break
    }
  }
  // sub = sub.filter((a) => a && has_word.test(a))
  return cleanList(subset, opts)
}

export { grabList, isList }
