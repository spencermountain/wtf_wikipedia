import Image from './Image.ts'
import { WrapperArray, wrapMethods } from '../../../_lib/plural-wrapper.ts'

class Images extends WrapperArray<Image> {}
wrapMethods(Images, Image)

export default Images
