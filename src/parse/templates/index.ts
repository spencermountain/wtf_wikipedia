import defaults from '../../_lib/defaults.ts'
import classify from './classify.ts'
import type { DocInfo } from '../../types/index.ts'
import allTemplates from './find/index.ts'

//find + parse all templates in the section
const process = (wiki: string, opts: DocInfo = defaults) => {
  const { templates, remaining } = allTemplates(wiki, opts)
  const { infoboxes, references, others } = classify(templates)
  return {
    infoboxes,
    references,
    templates: others,
    remaining,
  }
}

export default process
