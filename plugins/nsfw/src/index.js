import version from './_version.js'
import byTemplate from './byTemplate/index.js'
import byCategory from './byCategory/index.js'
import byTitle from './byTitle/index.js'
import byImage from './byImage/index.js'

// each detector returns rows like {reason:'Sexuality', name:'brothels', data:{..}}
const detectors = [
  ['title', byTitle],
  ['image', byImage],
  ['template', byTemplate],
  ['category', byCategory]
]

const plugin = function (models) {
  // add a new method to main class
  models.Doc.prototype.nsfw = function () {
    const doc = this
    // group every match by its content-warning type
    const byType = {}
    detectors.forEach((arr) => {
      const source = arr[0]
      const rows = arr[1](doc)
      rows.forEach((row) => {
        const type = row.reason.toLowerCase()
        const found = { source: source, name: row.name }
        if (row.data !== undefined) {
          found.data = row.data
        }
        byType[type] = byType[type] || []
        byType[type].push(found)
      })
    })
    // empty array means nothing was found
    const warnings = Object.keys(byType).map((type) => {
      return { type: type, evidence: byType[type] }
    })
    // most evidence first
    warnings.sort((a, b) => b.evidence.length - a.evidence.length)
    return warnings
  }
}
plugin.version = version
export default plugin
