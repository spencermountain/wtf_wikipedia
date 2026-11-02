// assembles the pack — template names in ./aliases.js, citation param maps in ./citations.js
import register from '../../register.js'
import version from '../../_version.js'
import aliases from './aliases.js'
import parsers from './citations.js'

const infoboxes = [
  'infokutija takson',
  'infokutija taksonomija',
  'infokvir takson',
  'infokvir taksonomija',
  'infookvir takson',
  'infookvir taksonomija',
  'taksokvir',
  'taksonomska infokutija',
  'taksonomska kutija',
  'taksonomski infokvir',
  'taksonomski infookvir',
  'taksonomski okvir',
  'taxobox-lat',
]

const data = { aliases, infoboxes, parsers }

const plugin = (_models, templates, boxes) => register(data, templates, boxes)
plugin.lang = 'sh'
plugin.version = version

export { data }
export default plugin
