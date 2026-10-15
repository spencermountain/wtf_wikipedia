import postprocess from '../_lib/postprocess.ts'
import parseLinks from './links/index.ts'
import parseFmt from './formatting.ts'
import sentenceParser from '../03-paragraph/03-sentences/parse.ts'
import type { SentenceData } from '../../types/index.ts'

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

export default fromText
