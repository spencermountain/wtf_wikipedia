import parseImage from '../../API/image/index.ts'
import parseList from './01-lists/index.ts'
import { byParagraph as parseSentences } from '../../API/04-sentence/index.ts'
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
    parseList(paragraph)
    //parse images
    parseImage(paragraph)
    //parse the sentences
    parseSentences(paragraph)
    return paragraph
  })
  section.remaining = wiki
  return section
}
export default parseParagraphs
