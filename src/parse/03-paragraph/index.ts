import parseList from './01-lists/index.ts'
import parseImage from './02-images/index.ts'
import parseSentences from './03-sentences/index.ts'
import type { SectionData, ParagraphData } from '../../types/index.ts'
const twoNewLines = /\r?\n\r?\n/

const parseParagraphs = function (section: SectionData) {
  let wiki = section.remaining

  //don't create empty paragraphs
  let paragraphs = wiki.split(twoNewLines)
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
    paragraph = parseList(paragraph)
    //parse images
    paragraph = parseImage(paragraph)
    //parse the sentences
    paragraph = parseSentences(paragraph)
    return paragraph
  })
  section.remaining = wiki
  return section
}
export default parseParagraphs
