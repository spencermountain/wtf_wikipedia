import Paragraph from './Paragraph.js'
import Section from '../02-section/Section.js'
import { byParagraph as parseSentences } from '../04-sentence/index.js'

const twoNewLines = /\r?\n\r?\n/
import parseImage from '../image/index.js'
import parseList from '../list/index.js'
import Document from '../01-document/Document.js'

/**
 *
 * @param {Section} section
 * @param {Document} doc
 */
function parseParagraphs (section, doc) {
  let wiki = section._wiki
  let paragraphs = wiki
    .split(twoNewLines)
    //don't create empty paragraphs
    .filter((p) => p && p.trim().length > 0)
    .map((str) => {
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
