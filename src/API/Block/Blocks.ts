import Block from './Block.ts'
import { WrapperArray, wrapMethods } from '../../_lib/plural-wrapper.ts'

class Blocks extends WrapperArray<Block> {}
wrapMethods(Blocks, Block)

export default Blocks
