import Infobox from './Infobox.ts'
import { WrapperArray, wrapMethods } from '../../../_lib/plural-wrapper.ts'

class Infoboxes extends WrapperArray<Infobox> {
  getFirst(choices: string[]) {
    return this.find((infobox) => infobox.getFirst(choices))
  }
}
wrapMethods(Infoboxes, Infobox)

export default Infoboxes
