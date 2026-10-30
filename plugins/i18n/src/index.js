import version from './_version.js'
import citation from './data/citation.js'
import coord from './data/coord.js'
import flag from './data/flag.js'
import flagicon from './data/flagicon.js'
import formatnum from './data/formatnum.js'
import ipa from './data/ipa.js'
import isbn from './data/isbn.js'
import main from './data/main.js'
import portal from './data/portal.js'
import reflist from './data/reflist.js'
import sfn from './data/sfn.js'
import small from './data/small.js'
import persondata from './data/persondata.js'
import taxobox from './data/taxobox.js'
import birthDateAge from './data/birth_date_and_age.js'
import citeBook from './data/cite_book.js'
import citeJournal from './data/cite_journal.js'
import citeWeb from './data/cite_web.js'
import commonsCat from './data/commons_cat.js'
import startDate from './data/start_date.js'

const mapping = {
  citation,
  coord,
  flag,
  flagicon,
  formatnum,
  ipa,
  isbn,
  main,
  portal,
  reflist,
  sfn,
  small,
  persondata,
  'birth date and age': birthDateAge,
  'cite book': citeBook,
  'cite journal': citeJournal,
  'cite web': citeWeb,
  'commons cat': commonsCat,
  'start date': startDate,
  nihongo: ['japonês', 'japonais', 'нихонго'],
}

const plugin = function (_models, templates, infoboxes = {}) {
  // taxobox aliases are infoboxes, which the core recognises by name
  taxobox.forEach((name) => {
    infoboxes[name] = true
  })
  Object.keys(mapping).forEach((k) => {
    const parser = templates[k]
    mapping[k].forEach((name) => {
      // Bridge the plugin callback to the built-in result contract.
      templates[name] = function (tmpl, list, parse, _unused, opts) {
        const { data, replacement } = parser(tmpl, parse, opts)
        if (data) {
          list.push(data)
        }
        return replacement
      }
      templates[name].kind = /^cite /.test(k) ? 'citation' : k
    })
  })
}
plugin.version = version

export default plugin
