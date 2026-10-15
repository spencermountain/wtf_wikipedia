import parsePage from './01-page/index.ts'
import parseSection from './02-section/index.ts'

import type { PageData } from '../types/index.ts'

const parse = function (input: string) {
  // pull-apart page into safe, main parts
  let data: PageData = parsePage(input)
  // interpret
  data.sections = data.sections.map((section) => parseSection(section))
  return data
}

export default parse
