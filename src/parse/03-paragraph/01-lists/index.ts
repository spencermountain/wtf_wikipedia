import { grabList, isList } from './parse.ts'
import type { DocInfo, ParagraphData, ListData } from '../../../types/index.ts'

const findLists = function (paragraph: ParagraphData, opts?: DocInfo) {
  let wiki = paragraph.remaining
  let lines = wiki.split(/\n/g)
  let lists: ListData[] = []
  let theRest = []
  for (let i = 0; i < lines.length; i++) {
    if (isList(lines[i])) {
      let sub = grabList(lines, i, opts)
      if (sub.length > 0) {
        const source = lines.slice(i, i + sub.length).join('\n')
        i += sub.length - 1
        sub = sub.filter((s) => s.text !== '')
        lists.push({ items: sub, wiki: source })
      }
    } else {
      theRest.push(lines[i])
    }
  }
  paragraph.lists = lists
  paragraph.remaining = theRest.join('\n')
  return paragraph
}
export default findLists
