import Paragraph from './Paragraph.js'
import { byParagraph as parseSentences } from '../04-sentence/index.js'

const twoNewLines = /\r?\n\r?\n/
import parseImage from '../image/index.js'
import parseList from '../list/index.js'

const parseParagraphs = function (section, doc) {
  let wiki = section._wiki
  let paragraphs = wiki.split(twoNewLines)
  //don't create empty paragraphs
  paragraphs = paragraphs.filter((p) => p && p.trim().length > 0)
  paragraphs = paragraphs.map((str) => {
    let paragraph = {
      wiki: str,
      lists: [],
      sentences: [],
      images: [],
    }
    //parse the lists
    parseList(paragraph)
    //parse images
    parseImage(paragraph, doc)
    //parse the sentences
    parseSentences(paragraph)
    return new Paragraph(paragraph)
  })
  section._wiki = wiki
  section._paragraphs = paragraphs
}
export default parseParagraphs
