import Reference from './Reference.ts'
import { WrapperArray, wrapMethods } from '../../../_lib/plural-wrapper.ts'

class References extends WrapperArray<Reference> {}
wrapMethods(References, Reference)

export default References
