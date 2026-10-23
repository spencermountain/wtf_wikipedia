import type { DocInfo } from '../types/index.ts'
import normalizeProject from './project.ts'

const defaults: DocInfo = Object.freeze({
  lang: 'en',
  project: 'wikipedia',
  domain: 'wikipedia.org',
})

const withDefaults = (opts: DocInfo = {}): DocInfo => {
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
