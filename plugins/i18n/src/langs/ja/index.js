// assembles the pack — template names in ./aliases.js, citation param maps in ./citations.js
import register from '../../register.js'
import version from '../../_version.js'
import aliases from './aliases.js'
import parsers from './citations.js'

const infoboxes = [
  '生物分類表',
]

const data = { aliases, infoboxes, parsers }

const plugin = (_models, templates, boxes) => register(data, templates, boxes)
plugin.lang = 'ja'
plugin.version = version

export { data }
export default plugin
