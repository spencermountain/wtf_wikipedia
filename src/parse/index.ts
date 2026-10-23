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

  // Discard parser scratch text before handing data to the API.
  delete data.remaining
  data.sections.forEach((section) => {
    delete section.remaining
    section.paragraphs.forEach((paragraph) => {
      delete paragraph.remaining
    })
  })
  return data
}

export default parse
