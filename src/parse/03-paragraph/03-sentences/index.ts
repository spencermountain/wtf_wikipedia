import defaults from '../../../_lib/defaults.ts'
import fromText from '../../block/index.ts'
import sentenceParser from './parse.ts'

import type { DocInfo, ParagraphData } from '../../../types/index.ts'

//used for consistency with other class-definitions
const byParagraph = function (paragraph: ParagraphData, opts: DocInfo = defaults) {
  //array of texts
  let sentences = sentenceParser(paragraph.remaining, opts)
  //sentence objects
  sentences = sentences.map((text) => fromText(text, opts))
  //remove :indented first line, as it is often a disambiguation
  if (sentences[0] && sentences[0].text && sentences[0].text[0] === ':') {
    sentences = sentences.slice(1)
  }
  paragraph.sentences = sentences
  return paragraph
}
export default byParagraph
