import Sentence from './Sentence.ts'
import { WrapperArray, wrapMethods } from '../../../_lib/plural-wrapper.ts'

class Sentences extends WrapperArray<Sentence> {}
wrapMethods(Sentences, Sentence)

export default Sentences
