import type { DocInfo } from '../types/index.ts'
import normalizeProject from './project.ts'

const defaults: DocInfo = Object.freeze({
  lang: 'en',
  project: 'wikipedia',
  domain: 'wikipedia.org',
})

// user-facing option names that map onto the internal DocInfo keys
const aliases: Record<string, keyof DocInfo> = {
  pageID: 'pageId',
  id: 'pageId',
  ns: 'namespace',
  language: 'lang',
  revisionID: 'revisionId',
}

const withDefaults = (input: DocInfo = {}): DocInfo => {
  const opts: Record<string, any> = { ...input }
  Object.entries(aliases).forEach(([alias, key]) => {
    if (opts[key] === undefined && opts[alias] !== undefined) {
      opts[key] = opts[alias]
    }
    delete opts[alias]
  })
  const project = normalizeProject(opts.project ?? defaults.project)
  return {
    ...defaults,
    ...opts,
    project,
    lang: opts.lang ?? defaults.lang,
    domain: opts.domain ?? (project === defaults.project ? defaults.domain : `${project}.org`),
  }
}

export { withDefaults }
export default defaults
