import languages from '../../../_data/languages.ts'
import namespaceNames from '../../../_data/namespaces.ts'
import defaults from '../../../_lib/defaults.ts'
import normalizeProject from '../../../_lib/project.ts'
import type { DocInfo } from '../../../types/index.ts'
import type { InternalLinkData } from '../../../types/index'

// automatically capitalize page titles for these projects
const capitalProjects = new Set([
  'wikipedia',
  'wikibooks',
  'wikinews',
  'wikiquote',
  'wikisource',
  'wikiversity',
  'wikivoyage',
  'commons',
  'wikispecies',
  'wikidata',
  'mediawiki',
])

const capitalize = (title: string) =>
  title.replace(/^./u, (letter) => {
    const upper = letter.toUpperCase()
    // Avoid expanding a single title character into multiple characters (e.g. ß).
    return [...upper].length === 1 ? upper : letter
  })

const normalizePage = (link: InternalLinkData, opts: DocInfo = defaults) => {
  if (link.prefix) {
    return link.page
  }
  let project = link.project || link.lang
  if (link.type === 'internal' || (!link.project && Object.hasOwn(languages, link.lang))) {
    project = opts.project ?? defaults.project
  }
  project = normalizeProject(project)
  const capitalizeTitle = capitalProjects.has(project)
  if (link.type !== 'internal' && !capitalizeTitle && project !== 'wiktionary') {
    return link.page
  }
  let page = link.page
    .normalize('NFC')
    .replace(/[_\s]+/gu, ' ')
    .trim()
  page = page.replace(/^:/, '')
  if (!capitalizeTitle) {
    return page
  }
  const colon = page.indexOf(':')
  const prefix = page.slice(0, colon).toLowerCase()
  if (colon !== -1 && Object.hasOwn(namespaceNames, prefix)) {
    return `${namespaceNames[prefix]}:${capitalize(page.slice(colon + 1).trim())}`
  }
  return capitalize(page)
}

export default normalizePage
