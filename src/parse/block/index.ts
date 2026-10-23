import defaults from '../../_lib/defaults.ts'
import postprocess from '../_lib/postprocess.ts'
import parseLinks from './links/index.ts'
import parseFmt from './formatting.ts'
import type { DocInfo, BlockData } from '../../types/index.ts'

function fromText(str: string, opts: DocInfo = defaults): BlockData {
  let block: BlockData = {
    text: str,
    wiki: str,
    // links: [],
    // bolds: [],
    // italics: [],
  }
  //pull-out the [[links]]
  parseLinks(block, opts)
  block.text = postprocess(block.text)
  //pull-out the bolds and ''italics''
  block = parseFmt(block)
  //pull-out things like {{start date|...}}
  return block
}

export default fromText
