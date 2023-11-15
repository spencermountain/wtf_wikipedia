import idName from './id-name.js'
import idTitle from './id-title.js'
import dummies from './dummy-templates.js'
import fns from './functions.js'

let templates = {
  //https://en.wikipedia.org/wiki/Category:External_link_templates
  'find a grave': ['id', 'name', 'work', 'last', 'first', 'date', 'accessdate'],
  congbio: ['id', 'name', 'date'],
  'hollywood walk of fame': ['name'],
  'wide image': ['file', 'width', 'caption'],
  audio: ['file', 'text', 'type'],
  rp: ['page'],
  'short description': ['description'],
  'coord missing': ['region'],
  unreferenced: ['date'],
  'taxon info': ['taxon', 'item'], //https://en.wikipedia.org/wiki/Template:Taxon_info
  'portuguese name': ['first', 'second', 'suffix'], // https://en.wikipedia.org/wiki/Template:Portuguese_name
  geo: ['lat', 'lon', 'zoom'], //https://en.wikivoyage.org/wiki/Template:Geo
  hatnote: ['text'],
}

templates = Object.assign(templates, dummies, idName, idTitle, fns)

export default templates
