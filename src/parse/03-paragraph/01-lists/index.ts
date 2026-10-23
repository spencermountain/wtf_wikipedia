import { grabList, isList } from './parse.ts'
import type { DocInfo, ParagraphData, ListData } from '../../../types/index.ts'

const findLists = function (paragraph: ParagraphData, opts?: DocInfo) {
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
    let obj: ListData = {
      items: list,
      wiki,
    }
    return obj
  })
  paragraph.remaining = theRest.join('\n')
  return paragraph
}
export default findLists
