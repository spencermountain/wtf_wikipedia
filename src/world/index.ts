import templates from './templates/index.ts'
import languages from './data/languages.ts'
import namespaces from './data/namespaces.ts'
import projects from './data/projects.ts'
import interwiki from './data/interwiki.ts'
import type { WorldData } from '../types/index.ts'
// import ipac from './data/ipac.ts'

const makeWorld = function () {
  const world: WorldData = {
    templates,
    meta: {
      languages,
      namespaces,
      projects,
      interwiki,
      // ipac,
    },
    i18n: {
      // used to build regex
      categories: ['category'],
      // templates that signal disambiguation pages
      disambiguation: ['dab', 'disamb', 'disambig', 'disambiguation'],
      // page titles that signal disambiguation pages
      disambig_titles: ['disambiguation'],
      // filename prefixes that denote images
      images: ['file', 'image'],
      // template names that denate infoboxes
      infobox: ['infobox'],
      //
      latlngs: [
        ['latitude', 'longitude'],
        ['lat', 'lng'],
      ],
      //
      redirects: ['redirect'],
      //
      references: ['references', 'reference'],
      //
      stubs: ['stub'],
    },
  }
  return world
}

export default makeWorld
