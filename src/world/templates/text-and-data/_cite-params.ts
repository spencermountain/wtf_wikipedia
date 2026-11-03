// english param synonyms accepted across CS1 citation templates,
// mapped onto the canonical names the Reference accessors read
const params = {
  'author1-last': 'author',
  'author-last': 'author',
  'author-last1': 'author',
  'surname': 'author',
  'surname1': 'author',
  'subject': 'author',
  'subject1': 'author',
  'given': 'first',
  'given1': 'first',
  'author-first': 'first',
  'author-first1': 'first',
  'author1-first': 'first',
  'air-date': 'date',
  'airdate': 'date',
  'encyclopedia': 'website',
  'encyclopaedia': 'website',
  'dictionary': 'website',
  'mailinglist': 'website',
  'periodical': 'website',
  'distributor': 'publisher',
  'institution': 'publisher',
  'newsgroup': 'publisher',
  'editor-last': 'editor',
  'editor-surname': 'editor',
  'editor-last1': 'editor',
  'editor-surname1': 'editor',
  'editor1': 'editor',
  'editor1-last': 'editor',
  'editor1-surname': 'editor',
  'editors': 'editor',
  'place': 'location',
  'p': 'page',
  'pp': 'pages',
  'in': 'language',
  'lang': 'language',
  'trans_title': 'trans-title',
  'contribution': 'chapter',
  'entry': 'chapter',
  'article': 'chapter',
  'section': 'chapter',
  'quotation': 'quote',
  'accessdate': 'access-date',
  'archiveurl': 'archive-url',
  'archivedate': 'archive-date',
  'number': 'issue',
  'people': 'authors',
  'host': 'authors',
  'credits': 'authors',
}

// move synonym params onto their canonical names; existing canonical keys win
const normalizeCite = (obj: any) => {
  if (!obj) {
    return obj
  }
  Object.keys(params).forEach((from) => {
    if (obj[from] !== undefined && obj[params[from]] === undefined) {
      obj[params[from]] = obj[from]
      delete obj[from]
    }
  })
  return obj
}

export { params }
export default normalizeCite
