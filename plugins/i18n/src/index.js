import version from './_version.js'
import citation from './data/citation.js'
import coord from './data/coord.js'
import flag from './data/flag.js'
import flagicon from './data/flagicon.js'
import formatnum from './data/formatnum.js'
import ipa from './data/ipa.js'
import isbn from './data/isbn.js'
import main from './data/main.js'
import nihongo from './data/nihongo.js'
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
import paramData from './data/params.js'

const mapping = {
  citation,
  coord,
  flag,
  flagicon,
  formatnum,
  ipa,
  isbn,
  main,
  nihongo,
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
  start: startDate, // 'start date' is an alias in core; 'start' is the registry key
}

// merge an alias's per-wiki param maps, first match winning
const paramsFor = (name) => {
  const ids = paramData.aliases[name]
  if (!ids) {
    return null
  }
  const map = {}
  ids.forEach((id) => {
    const found = paramData.maps[id]
    Object.keys(found).forEach((key) => {
      if (map[key] === undefined) {
        map[key] = found[key]
      }
    })
  })
  return map
}

// hand localized params to the core parser under the english names it reads
const translate = (parse, map) =>
  function (tmpl, order, format) {
    const obj = parse(tmpl, order, format)
    if (format === 'raw' || format === 'json' || format === 'block') {
      return obj
    }
    Object.keys(map).forEach((from) => {
      if (obj[from] !== undefined && obj[map[from]] === undefined) {
        obj[map[from]] = obj[from]
        delete obj[from]
      }
    })
    return obj
  }

const plugin = function (_models, templates, infoboxes = {}) {
  // taxobox aliases are infoboxes, which the core recognises by name
  taxobox.forEach((name) => {
    infoboxes[name] = true
  })
  Object.keys(mapping).forEach((k) => {
    const parser = templates[k]
    // fail at extend-time, not parse-time, if a core registry key moves
    if (typeof parser !== 'function') {
      throw new Error(`wtf-plugin-i18n: '${k}' is not a core template`)
    }
    mapping[k].forEach((name) => {
      const map = paramsFor(name)
      // Bridge the plugin callback to the built-in result contract.
      templates[name] = function (tmpl, list, parse, _unused, opts) {
        const { data, replacement } = parser(tmpl, map ? translate(parse, map) : parse, opts)
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
