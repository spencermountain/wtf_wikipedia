import aliases from './aliases.js'
import citations from './citations.js'

const infoboxes = ['taxotaula', 'taxotaula automatikoa']

export default {
  lang: 'eu',
  enLang: 'basque',
  category: ['kategoria'],
  redirect: ['birzuzendu'],
  stub: ['zirriborroa'],
  infobox: ['infotaula'],
  image: ['fitxategi', 'irudi'],
  reference: [],
  disambig: ['argipen'],
  disambigTitle: [],
  aliases,
  infoboxes,
  templates: citations,
  gated: {
    'egiptekas': '{|-\n', // hieroglyph blocks render as an empty table
  },
}
