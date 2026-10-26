import Block from './Block.ts'
import Links from '../03-paragraph/link/Links.ts'

import { WrapperArray, wrapMethods } from '../../_lib/plural-wrapper.ts'

class Blocks extends WrapperArray<Block> {
  links() {
    const links = this.flatMap((item) => item.links())
    return Links.from(links)
  }
}
wrapMethods(Blocks, Block)

export default Blocks
