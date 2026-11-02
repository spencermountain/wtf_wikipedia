// assembles the pack — template names in ./aliases.js, citation param maps in ./citations.js
import register from '../../register.js'
import version from '../../_version.js'
import aliases from './aliases.js'
import parsers from './citations.js'

const infoboxes = [
  'তথ্যছক শ্রেণীবিন্যাস',
  'প্রজাতিছক',
  'শ্রেণিবিন্যাস ছক',
  'শ্রেণীবিন্যাস ছক',
]

const data = { aliases, infoboxes, parsers }

const plugin = (_models, templates, boxes) => register(data, templates, boxes)
plugin.lang = 'bn'
plugin.version = version

export { data }
export default plugin
