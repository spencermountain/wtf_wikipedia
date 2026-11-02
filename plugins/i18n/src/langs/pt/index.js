import aliases from './aliases.js'
import citations from './citations.js'

const infoboxes = ['ficha de taxón', 'info/taxonomia', 'takson infobox', 'taxoboxe']

export default {
  lang: 'pt',
  enLang: 'portuguese',
  category: ['cat', 'categoria'],
  redirect: ['redirecionamento'],
  stub: ['esboço'],
  infobox: ['info', 'infocaixa'],
  image: ['arquivo', 'ficheiro', 'imagem'],
  reference: [],
  disambig: ['desambiguação'],
  disambigTitle: ['desambiguação'],
  aliases,
  infoboxes,
  templates: citations,
  gated: {
    'pbpe': 0, // português brasileiro/europeu — keeps the first form
  },
}
