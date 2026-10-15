import fromText from '../../sentences/index.ts'
import sentenceParser from './parse.ts'

import type { ParagraphData } from '../../../types/index.ts'

//used for consistency with other class-definitions
const byParagraph = function (paragraph: ParagraphData) {
  //array of texts
  let sentences = sentenceParser(paragraph.remaining)
  //sentence objects
  sentences = sentences.map(fromText)
  //remove :indented first line, as it is often a disambiguation
  if (sentences[0] && sentences[0].text && sentences[0].text[0] === ':') {
    sentences = sentences.slice(1)
  }
  paragraph.sentences = sentences
  return paragraph
}
export default byParagraph
