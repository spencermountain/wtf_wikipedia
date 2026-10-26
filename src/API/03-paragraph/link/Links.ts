import Link from './Link.ts'
import { WrapperArray, wrapMethods } from '../../../_lib/plural-wrapper.ts'

// support for .links().json() etc
class Links extends WrapperArray<Link> {
  internal() {
    return this.filter((l) => l.type() === 'internal')
  }
  external() {
    return this.filter((l) => l.type() === 'external')
  }
  interwiki() {
    return this.filter((l) => l.type() === 'interwiki')
  }
}
wrapMethods(Links, Link)

export default Links
