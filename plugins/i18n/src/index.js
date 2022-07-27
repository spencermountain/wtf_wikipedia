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

let mapping = {
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
  taxobox,
  'birth date and age': birthDateAge,
  'cite book': citeBook,
  'cite journal': citeJournal,
  'cite web': citeWeb,
  'commons cat': commonsCat,
  'start date': startDate,
}

const plugin = function (_models, templates) {
  Object.keys(mapping).forEach((k) => {
    mapping[k].forEach((name) => {
      // create template parser with alias
      templates[name] = function (tmpl, list, parse) {
        return templates[k](tmpl, list, parse, k)
      }
    })
  })
}
export default plugin
