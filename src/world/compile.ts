import type { WorldData, WorldCache } from '../types/index.ts'

// plugin-supplied entries may hold regex metacharacters
const escapeStr = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const alternation = (list: string[]) => list.map(escapeStr).join('|')

// every regex/set derived from world data - rebuilt by world.rebuild()
const compile = function (world: WorldData): WorldCache {
  const i18n = world.i18n
  return {
    // '#REDIRECT [[Foo]]'
    redirectReg: new RegExp('^[ \n\t]*?#(' + alternation(i18n.redirects) + ') *?(\\[\\[.{2,180}?\\]\\])', 'i'),
    // '[[Category:Foo]]'
    catReg: new RegExp('\\[\\[(' + alternation(i18n.categories) + '):(.{2,178}?)]](w{0,10})', 'gi'),
    catRemoveReg: new RegExp('^\\[\\[:?(' + alternation(i18n.categories) + '):', 'gi'),
    // 'Foo (disambiguation)' page titles
    disambigTitleReg: new RegExp('. \\((' + alternation(i18n.disambig_titles) + ')\\)$', 'i'),
    disambigTemplates: new Set(i18n.disambig_templates),
    // '[[File:Foo.jpg]]'
    fileReg: new RegExp('(' + alternation(i18n.images) + '):', 'i'),
    fileNamespaceReg: new RegExp('^(?:' + alternation(i18n.images) + '):', 'i'),
    imageFileReg: new RegExp('(' + alternation(i18n.images) + '):(.+?)[\\||\\]]', 'iu'),
    // known infobox template names, with i18n prefix forms like 'infobox_person'
    infoboxReg: new RegExp('^(subst.)?(' + alternation(i18n.infoboxes) + ')(?=:| |\n|$)', 'i'),
    infoboxTemplates: new Set([...Object.keys(world.meta.infoboxes), ...i18n.infoboxes]),
    stubs: new Set(i18n.stubs),
  }
}

export default compile
