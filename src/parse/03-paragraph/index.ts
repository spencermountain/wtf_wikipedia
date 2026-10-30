import defaults from '../../_lib/defaults.ts'
import findLists from './01-lists/index.ts'
import parseImage from './02-images/index.ts'
import parseSentences from './03-sentences/index.ts'
import type { DocInfo, SectionData, ParagraphData } from '../../types/index.ts'
import { isList } from './01-lists/parse.ts'
// a whitespace-only line is a blank line
const twoNewLines = /\r?\n[ \t]*\r?\n/

// MediaWiki ends a list at the first non-list line, and starts a new paragraph there
const splitAfterLists = function (str: string) {
  const lines = str.split(/\n/)
  const chunks: string[][] = [[]]
  for (let i = 0; i < lines.length; i++) {
    const prev = lines[i - 1]
    if (i > 0 && isList(prev) && !isList(lines[i]) && lines[i].trim() !== '') {
      chunks.push([])
    }
    chunks[chunks.length - 1].push(lines[i])
  }
  return chunks.map((c) => c.join('\n'))
}

const parseParagraphs = function (section: SectionData, opts: DocInfo = defaults) {
  let wiki = section.remaining

  //don't create empty paragraphs
  let paragraphs = wiki.split(twoNewLines).flatMap(splitAfterLists)
  paragraphs = paragraphs.filter((p) => p && p.trim().length > 0)

  section.paragraphs = paragraphs.map((str) => {
    let paragraph: ParagraphData = {
      wiki: str,
      remaining: str,
      lists: [],
      sentences: [],
      images: [],
    }
    //parse the lists
    paragraph = findLists(paragraph, opts)
    //parse images
    paragraph = parseImage(paragraph, opts)
    //parse the sentences
    paragraph = parseSentences(paragraph, opts)
    return paragraph
  })
  section.remaining = wiki
  return section
}
export default parseParagraphs
