import Template from './Template.ts'
import { WrapperArray, wrapMethods } from '../../../_lib/plural-wrapper.ts'

class Templates extends WrapperArray<Template> {}
wrapMethods(Templates, Template)

export default Templates
