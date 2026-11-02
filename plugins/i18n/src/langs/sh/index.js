import aliases from './aliases.js'
import citations from './citations.js'

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

export default {
  lang: 'sh',
  enLang: 'serbo-croatian',
  category: ['kat', 'kategorija', 'kt', 'кат', 'категорија', 'кт'],
  redirect: ['preusmeri', 'preusmjeri', 'преусмери', 'преусмјери'],
  stub: ['u začetku'],
  infobox: ['infokutija'],
  image: ['datoteka', 'dt', 'fotografija', 'slika', 'датотека', 'дт', 'слика', 'фотографија'],
  reference: [],
  disambig: ['razvrstavanje'],
  disambigTitle: [],
  aliases,
  infoboxes,
  templates: citations,
}
