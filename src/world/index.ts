import templates from './templates/index.ts'
import languages from './data/languages.ts'
import namespaces from './data/namespaces.ts'
import projects from './data/projects.ts'
import interwiki from './data/interwiki.ts'
import infoboxes from './data/infoboxes.ts'
import * as i18n from './data/i18n/index.ts'
import compile from './compile.ts'
import type { WorldData, WorldCache } from '../types/index.ts'
// import ipac from './data/ipac.ts'

const makeWorld = function (): WorldData {
  const world: WorldData = {
    templates,
    meta: {
      languages,
      namespaces,
      projects,
      interwiki,
      infoboxes,
      // ipac,
    },
    i18n: {
      categories: i18n.categories,
      disambig_templates: i18n.disambig_templates,
      disambig_titles: i18n.disambig_titles,
      images: i18n.images,
      infoboxes: i18n.infoboxes,
      latLngs: i18n.latLngs,
      redirects: i18n.redirects,
      references: i18n.references,
      stubs: i18n.stubs,
    },
    _cached: {} as WorldCache,
    // re-derive every compiled regex/set - call after changing world data
    rebuild() {
      this._cached = compile(this)
    },
  }
  world.rebuild()
  return world
}

// the shared world used when none is given
const defaultWorld = makeWorld()

export { defaultWorld }
export default makeWorld
