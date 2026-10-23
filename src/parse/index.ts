import { withDefaults } from '../_lib/defaults.ts'
import parsePage from './01-page/index.ts'
import parseSection from './02-section/index.ts'

import type { DocInfo, PageData } from '../types/index.ts'

const parse = function (input: string, opts: DocInfo = {}) {
  opts = withDefaults(opts)
  // pull-apart page into safe, main parts
  let data: PageData = parsePage(input, opts)
  // interpret
  data.sections = data.sections.map((section) => parseSection(section, opts))
  return data
}

export default parse
