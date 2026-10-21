import postprocess from '../_lib/postprocess.ts'
import parseLinks from './links/index.ts'
import parseFmt from './formatting.ts'
import type { BlockData } from '../../types/index.ts'

function fromText(str: string): BlockData {
  if (typeof str !== 'string') {
    console.error(str)
    throw new Error('str must be a string', str)
  }
  let block: BlockData = {
    text: str,
    wiki: str,
    links: [],
    fmt: {
      bold: [],
      italic: [],
    },
  }
  //pull-out the [[links]]
  parseLinks(block)
  block.text = postprocess(block.text)
  //pull-out the bolds and ''italics''
  block = parseFmt(block)
  //pull-out things like {{start date|...}}
  return block
}

export default fromText
