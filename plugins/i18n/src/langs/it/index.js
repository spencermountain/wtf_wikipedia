import aliases from './aliases.js'
import citations from './citations.js'

const infoboxes = ['tassobox']

export default {
  lang: 'it',
  enLang: 'italian',
  category: ['cat', 'categoria'],
  redirect: ['rimando', 'rinvia', 'rinvio'],
  stub: ['s'],
  infobox: [],
  image: ['immagine'],
  reference: [],
  disambig: ['disambigua'],
  disambigTitle: ['disambigua'],
  aliases,
  infoboxes,
  templates: citations,
  gated: {
    'citazione necessaria': { template: 'citation needed' },
  },
}
