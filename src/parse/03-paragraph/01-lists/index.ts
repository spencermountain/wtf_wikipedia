import defaults from '../../../_lib/defaults.ts'
import parseBlock from '../../block/index.ts'
import type { DocInfo, ParagraphData, BlockData } from '../../../types/index.ts'

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

const parseList = function (paragraph: ParagraphData, opts: DocInfo = defaults) {
  let wiki = paragraph.remaining
  let lines = wiki.split(/\n/g)
  let lists = []
  let theRest = []
  for (let i = 0; i < lines.length; i++) {
    if (isList(lines[i])) {
      let sub = grabList(lines, i, opts)
      if (sub.length > 0) {
        i += sub.length - 1
        sub = sub.filter((s) => s.text !== '')
        lists.push(sub)
      }
    } else {
      theRest.push(lines[i])
    }
  }
  paragraph.lists = lists.map((list) => {
    return {
      items: list,
      wiki,
    }
  })
  paragraph.remaining = theRest.join('\n')
  return paragraph
}
export default parseList
