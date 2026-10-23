import List from './List.ts'
import { WrapperArray, wrapMethods } from '../../../_lib/plural-wrapper.ts'

class Lists extends WrapperArray<List> {}
wrapMethods(Lists, List)

export default Lists
