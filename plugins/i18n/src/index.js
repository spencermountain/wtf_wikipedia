let list = [
  'birth_date_and_age',
  'citation',
  'cite_book',
  'cite_journal',
  'cite_web',
  'commons_cat',
  'coord',
  'flag',
  'flagicon',
  'formatnum',
  'ipa',
  'isbn',
  'main',
  'portal',
  'reflist',
  'sfn',
  'small',
  'start_date',
  'taxobox'
]
list = list.reduce((h, str) => {
  h[str] = require(`./data/${str}`)
  return h
}, {})

const plugin = function(models, templates) {}
module.exports = plugin
