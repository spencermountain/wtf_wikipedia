import postprocess from '../../_lib/postprocess.ts'
import parseLinks from './links/index.ts'
import parseFmt from './formatting.ts'
import sentenceParser from './parse.ts'
import type { ParagraphData, SentenceData } from '../../../types/index.ts'

function fromText(str: string) {
  let sentence: SentenceData = {
    text: str,
    wiki: str,
    links: [],
    fmt: {
      bold: [],
      italic: [],
    },
  }
  //pull-out the [[links]]
  parseLinks(sentence)
  sentence.text = postprocess(sentence.text)
  //pull-out the bolds and ''italics''
  sentence = parseFmt(sentence)
  //pull-out things like {{start date|...}}
  return sentence
}

//used for consistency with other class-definitions
const byParagraph = function (paragraph: ParagraphData) {
  //array of texts
  let sentences = sentenceParser(paragraph.remaining)
  //sentence objects
  sentences = sentences.map(fromText)
  //remove :indented first line, as it is often a disambiguation
  if (sentences[0] && sentences[0].text() && sentences[0].text()[0] === ':') {
    sentences = sentences.slice(1)
  }
  paragraph.sentences = sentences
  return paragraph
}

export { fromText, byParagraph }
