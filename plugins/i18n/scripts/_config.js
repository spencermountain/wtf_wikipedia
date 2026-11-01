// the template families this plugin localizes.
// key is the core registry key the aliases resolve to.
// `page` anchors the family to its wikidata item (via `site`, enwiki unless noted).
// `params: true` → also fetch TemplateData for localized→english parameter names.
const families = {
  citation: { page: 'Template:Citation', params: true },
  coord: { page: 'Template:Coord' },
  flag: { page: 'Template:Flag' },
  flagicon: { page: 'Template:Flag icon' },
  formatnum: { page: 'Template:Formatnum' },
  ipa: { page: 'Template:IPA' },
  isbn: { page: 'Template:ISBN' },
  main: { page: 'Template:Main' },
  nihongo: { page: 'Template:Nihongo' },
  portal: { page: 'Template:Portal' },
  reflist: { page: 'Template:Reflist' },
  sfn: { page: 'Template:Sfn' },
  small: { page: 'Template:Small' },
  start: { page: 'Template:Start date' },
  taxobox: { page: 'Template:Taxobox', infobox: true },
  persondata: { site: 'dewiki', page: 'Vorlage:Personendaten' },
  'birth date and age': { page: 'Template:Birth date and age', params: true },
  'cite book': {
    page: 'Template:Cite book',
    params: true,
    // de's native book-citation is its own wikidata item
    extra: [{ site: 'dewiki', page: 'Vorlage:Literatur' }],
  },
  'cite journal': { page: 'Template:Cite journal', params: true },
  'cite web': {
    page: 'Template:Cite web',
    params: true,
    // de's native web-citation is its own wikidata item
    extra: [{ site: 'dewiki', page: 'Vorlage:Internetquelle' }],
  },
  'commons cat': { page: 'Template:Commons category' },
}

// wikis we also fetch per-wiki redirects + TemplateData from.
// sitelinks (canonical names) cover every wikipedia regardless of this list.
const langs = [
  'ar', 'az', 'be', 'bg', 'bn', 'ca', 'cs', 'cy', 'da', 'de', 'el', 'eo', 'es', 'et', 'eu',
  'fa', 'fi', 'fr', 'gl', 'he', 'hi', 'hr', 'hu', 'hy', 'id', 'it', 'ja', 'ka', 'kk', 'ko',
  'lt', 'lv', 'mk', 'ml', 'ms', 'nl', 'nn', 'no', 'pl', 'pt', 'ro', 'ru', 'sh', 'simple',
  'sk', 'sl', 'sq', 'sr', 'sv', 'ta', 'te', 'th', 'tr', 'uk', 'ur', 'uz', 'vi', 'zh',
]

// the english parameter names core parsers + Reference accessors read, in preference order
const englishParams = [
  'title', 'url', 'author', 'last', 'first', 'last1', 'first1', 'last2', 'first2',
  'author1', 'author2', 'authors', 'date', 'year', 'publisher', 'website', 'work',
  'journal', 'newspaper', 'magazine', 'pages', 'page', 'isbn', 'doi', 'pmid', 'issn',
  'language', 'edition', 'volume', 'issue', 'chapter', 'location', 'editor', 'quote',
  'access-date', 'archive-url', 'archive-date', 'trans-title',
]

export { families, langs, englishParams }
