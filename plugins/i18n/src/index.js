let mapping = {
  'birth date and age': require('./data/birth_date_and_age'),
  citation: require('./data/citation'),
  'cite book': require('./data/cite_book'),
  'cite journal': require('./data/cite_journal'),
  'cite web': require('./data/cite_web'),
  'commons cat': require('./data/commons_cat'),
  coord: require('./data/coord'),
  flag: require('./data/flag'),
  flagicon: require('./data/flagicon'),
  formatnum: require('./data/formatnum'),
  ipa: require('./data/ipa'),
  isbn: require('./data/isbn'),
  main: require('./data/main'),
  portal: require('./data/portal'),
  reflist: require('./data/reflist'),
  sfn: require('./data/sfn'),
  small: require('./data/small'),
  'start date': require('./data/start_date'),
  persondata: require('./data/persondata'),
  taxobox: require('./data/taxobox')
}

const plugin = function(models, templates) {
  Object.keys(mapping).forEach(k => {
    mapping[k].forEach(name => {
      // create template parser with alias
      templates[name] = function(tmpl, list) {
        return templates[k](tmpl, list, k)
      }
    })
  })
}
module.exports = plugin
