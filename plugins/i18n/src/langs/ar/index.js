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

const birthDateAndAge = {
  template: 'birth date and age',
  map: {
    العام: 'year',
    السنة: 'year',
    سنة: 'year',
  },
}

export default {
  lang: 'ar',
  enLang: 'arabic',
  category: ['تصنيف'],
  redirect: ['تحويل'],
  stub: ['بذرة'],
  infobox: ['بطاقة'],
  image: ['صورة', 'ملف'],
  reference: [],
  disambig: ['توضيح'],
  disambigTitle: ['توضيح'],
  aliases,
  infoboxes,
  templates: {
    ...citations,
    'الميلاد والسن': birthDateAndAge,
    'الولادة والسن': birthDateAndAge,
    'تاريخ الميلاد و العمر': birthDateAndAge,
    'تاريخ الميلاد والسن': birthDateAndAge,
    'تاريخ الميلاد والعمر': birthDateAndAge,
    'تاريخ ميلاد والعمر': birthDateAndAge,
    'تاريخ ميلاد وعمر': birthDateAndAge,
  },
}
