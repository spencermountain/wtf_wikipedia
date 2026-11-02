// assembles the pack — template names in ./aliases.js, citation param maps in ./citations.js
import register from '../../register.js'
import version from '../../_version.js'
import { translate } from '../_lib.js'
import aliases from './aliases.js'
import citations from './citations.js'

const infoboxes = [
  'automatic taxobox',
  'speciesbox',
  'taxobox itis',
  'taxobox ncbi',
  'virusbox',
  'تصنيف',
  'تصنيف علمي',
  'تصنيف كائن',
  'صندوق صنف',
  'صندوق معلومات فيروس',
  'صندوق معلومات كائن',
  'معلومات فيروس',
  'معلومات كائن',
]

const birthDateAndAge = translate('birth date and age', {
  'العام': 'year',
  'السنة': 'year',
  'سنة': 'year',
})

const parsers = {
  ...citations,
  'الميلاد والسن': birthDateAndAge,
  'الولادة والسن': birthDateAndAge,
  'تاريخ الميلاد و العمر': birthDateAndAge,
  'تاريخ الميلاد والسن': birthDateAndAge,
  'تاريخ الميلاد والعمر': birthDateAndAge,
  'تاريخ ميلاد والعمر': birthDateAndAge,
  'تاريخ ميلاد وعمر': birthDateAndAge,
}

const data = { aliases, infoboxes, parsers }

const plugin = (_models, templates, boxes) => register(data, templates, boxes)
plugin.lang = 'ar'
plugin.version = version

export { data }
export default plugin
