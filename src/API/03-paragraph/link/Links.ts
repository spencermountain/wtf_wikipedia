import Link from './Link.ts'
import { WrapperArray, wrapMethods } from '../../../_lib/plural-wrapper.ts'

// support for .links().json() etc
class Links extends WrapperArray<Link> {}
wrapMethods(Links, Link)

export default Links
