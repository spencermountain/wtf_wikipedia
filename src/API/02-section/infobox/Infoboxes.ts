import Infobox from './Infobox.ts'
import { WrapperArray, wrapMethods } from '../../../_lib/plural-wrapper.ts'

class Infoboxes extends WrapperArray<Infobox> {}
wrapMethods(Infoboxes, Infobox)

export default Infoboxes
