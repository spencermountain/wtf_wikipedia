// assembles the pack — template names in ./aliases.js, citation param maps in ./citations.js
import register from '../../register.js'
import version from '../../_version.js'
import aliases from './aliases.js'
import parsers from './citations.js'

const infoboxes = [
  'automatic taxobox',
  'ficha de taxon',
  'ficha de taxón',
  'ficha de virus',
  'speciesbox',
]

const data = { aliases, infoboxes, parsers }

const plugin = (_models, templates, boxes) => register(data, templates, boxes)
plugin.lang = 'es'
plugin.version = version

export { data }
export default plugin
