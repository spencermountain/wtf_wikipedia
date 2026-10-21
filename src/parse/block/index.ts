import postprocess from '../_lib/postprocess.ts'
import parseLinks from './links/index.ts'
import parseFmt from './formatting.ts'
import type { BlockData } from '../../types/index.ts'

function fromText(str: string): BlockData {
  let sentence: BlockData = {
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
