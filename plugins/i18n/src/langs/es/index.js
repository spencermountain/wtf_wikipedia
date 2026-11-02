import aliases from './aliases.js'
import citations from './citations.js'

const infoboxes = ['automatic taxobox', 'ficha de taxon', 'ficha de taxón', 'ficha de virus', 'speciesbox']

export default {
  lang: 'es',
  enLang: 'spanish',
  category: ['cat', 'categoría'],
  redirect: ['redireccion', 'redirección'],
  stub: ['esbozo'],
  infobox: ['ficha'],
  image: ['archivo', 'imagen'],
  reference: ['referencias'],
  disambig: ['desambiguación'],
  disambigTitle: [],
  aliases,
  infoboxes,
  templates: citations,
  gated: {
    'cita requerida': { template: 'citation needed' },
  },
}
