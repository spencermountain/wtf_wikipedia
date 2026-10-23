import type { TemplateData } from '../../types/index.ts'

const referenceKinds = new Set(['citation', 'refn', 'harvnb', 'source'])

// Route recognized interpretations without consulting argument names.
const sortOut = (templates: TemplateData[]) => {
  const res = { infoboxes: [], references: [], others: [] }
  templates.forEach((obj) => {
    if (referenceKinds.has(obj.kind)) {
      res.references.push(obj)
    } else if (obj.kind === 'infobox' && obj.data.subbox?.text !== 'yes') {
      res.infoboxes.push(obj)
    } else {
      res.others.push(obj)
    }
  })
  return res
}

export default sortOut
