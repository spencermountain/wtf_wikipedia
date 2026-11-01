// the template families this plugin localizes.
// key is the core registry key the aliases resolve to.
// `page` anchors the family to its wikidata item (via `site`, enwiki unless noted).
// `file` is the generated file in ../src/data/ — these names are also test imports.
// `params: true` → also fetch TemplateData for localized→english parameter names.
const families = {
  citation: { page: 'Template:Citation', file: 'citation', params: true },
  coord: { page: 'Template:Coord', file: 'coord' },
  flag: { page: 'Template:Flag', file: 'flag' },
  flagicon: { page: 'Template:Flag icon', file: 'flagicon' },
  formatnum: { page: 'Template:Formatnum', file: 'formatnum' },
  ipa: { page: 'Template:IPA', file: 'ipa' },
  isbn: { page: 'Template:ISBN', file: 'isbn' },
  main: { page: 'Template:Main', file: 'main' },
  nihongo: { page: 'Template:Nihongo', file: 'nihongo' },
  portal: { page: 'Template:Portal', file: 'portal' },
  reflist: { page: 'Template:Reflist', file: 'reflist' },
  sfn: { page: 'Template:Sfn', file: 'sfn' },
  small: { page: 'Template:Small', file: 'small' },
  start: { page: 'Template:Start date', file: 'start_date' },
  taxobox: { page: 'Template:Taxobox', file: 'taxobox', infobox: true },
  persondata: { site: 'dewiki', page: 'Vorlage:Personendaten', file: 'persondata' },
  'birth date and age': { page: 'Template:Birth date and age', file: 'birth_date_and_age', params: true },
  'cite book': {
    page: 'Template:Cite book',
    file: 'cite_book',
    params: true,
    // de's native book-citation is its own wikidata item
    extra: [{ site: 'dewiki', page: 'Vorlage:Literatur' }],
  },
  'cite journal': { page: 'Template:Cite journal', file: 'cite_journal', params: true },
  'cite web': {
    page: 'Template:Cite web',
    file: 'cite_web',
    params: true,
    // de's native web-citation is its own wikidata item
    extra: [{ site: 'dewiki', page: 'Vorlage:Internetquelle' }],
  },
  'commons cat': { page: 'Template:Commons category', file: 'commons_cat' },
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
